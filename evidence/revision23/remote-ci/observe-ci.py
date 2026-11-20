#!/usr/bin/env python3
"""Observe exact-commit R23 CI through public GitHub HTML, without using its API.

This records observed workflow states and source bindings. It does not invent
individual remote test reports or reinterpret the cross-browser flag as a
three-engine requirement on its own.
"""
from pathlib import Path
from datetime import datetime, timezone
from html.parser import HTMLParser
from io import BytesIO
import argparse
import ast
import hashlib
import html
import json
import re
import subprocess
import tarfile
import time
import urllib.request

REPO = Path('/workspace/MODERN')
BASELINE = '35ad8188207f6a47be47b6bc361a011cf01c948b'
DEFAULT_OUT = Path('/workspace/r23-validation/remote-ci')
REQUIRED = [
    'Instalar dependencias Python de comprobación',
    'Instalar dependencias del sistema para los tres motores',
    'Preparar Chromium', 'Preparar Firefox', 'Preparar WebKit',
    'Registrar la ruta de Chromium para las pruebas existentes',
    'Recuperar la fuente técnica fijada y comprobar idempotencia',
    'Compilar y comparar el HTML publicado',
    'Ejecutar pruebas del entregable', 'Exigir comprobación entre motores',
]
PREBUILT_IMAGE = 'mcr.microsoft.com/playwright/python@sha256:aa81288e738725378becba5b3e06cb0f3a7f012a610e87e8d767a090ea3f740d'
PREBUILT_TEMPLATE_SHA256 = '3a899c08477412da21b55e95bc0320245337544c673ad69010dfe9c7b3324270'
NATIVE_OFFLINE_HELPER_SHA256 = 'd8505a6c1ddfb170acc7a6b7c4641723a6681e816d0ea0b283b2d166b59da2f3'
NATIVE_OFFLINE_PROBE_COMMAND = 'python tests/browser_offline.py --probe --output tests/native-offline-preflight-results.json'
IMAGE_RECEIPT = Path('/workspace/r23-validation/playwright-image-receipt.json')
IMAGE_MANIFEST = Path('/workspace/r23-validation/playwright-image-manifest.json')
PREBUILT_SYSTEM_STEP = 'Verificar dependencias del sistema para los tres motores'
NEW_GROUPS = {
    'priority_chain', 'trigger_order', 'damage_step', 'xyz_summon',
    'pendulum_summon', 'draw_sequences', 'data_review_r23',
    'release23_in_browser', 'accessibility_r23',
}


class Steps(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows = []

    def handle_starttag(self, tag, attrs):
        if tag == 'check-step':
            self.rows.append(dict(attrs))


class Annotations(HTMLParser):
    """Read annotation titles and rendered bodies, without scraping unrelated JSON."""
    VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
            'link', 'meta', 'param', 'source', 'track', 'wbr'}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.rows = [], []
        self.current = None
        self.title_depth = self.body_depth = None

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag not in self.VOID:
            self.stack.append(tag)
        if tag == 'annotation-message':
            self.current = {'title': [], 'body': [], 'href': None}
            self.title_depth = self.body_depth = None
        if self.current is None:
            return
        if tag == 'a' and self.current['href'] is None:
            self.current['href'] = values.get('href')
        if tag == 'strong' and self.body_depth is None:
            self.title_depth = len(self.stack)
        if 'annotation-message.annotationContainer' in values.get('data-target', '').split():
            self.body_depth = len(self.stack)
        if tag == 'br' and self.body_depth is not None:
            self.current['body'].append('\n')

    def handle_endtag(self, tag):
        depth = len(self.stack)
        if self.current is not None:
            if self.title_depth == depth and tag == 'strong':
                self.title_depth = None
            if self.body_depth == depth:
                self.body_depth = None
            if tag == 'annotation-message':
                self.rows.append({'title': ''.join(self.current['title']).strip(),
                                  'body': ''.join(self.current['body']).strip(),
                                  'href': self.current['href']})
                self.current = None
                self.title_depth = self.body_depth = None
        if tag in self.stack:
            index = len(self.stack) - 1 - self.stack[::-1].index(tag)
            del self.stack[index:]

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID:
            self.handle_endtag(tag)

    def handle_data(self, data):
        if self.current is not None:
            if self.title_depth is not None:
                self.current['title'].append(data)
            if self.body_depth is not None:
                self.current['body'].append(data)


def compact_ci_result(page, proof, commit, run_id):
    parser = Annotations()
    parser.feed(page)
    rows = [row for row in parser.rows if row['title'] == 'R23_CI_RESULT']
    result = {
        'requiredForAcceptance': proof['officialImageSmokeRequiredInCi'],
        'observed': bool(rows), 'pass': False, 'bindingVerified': False,
        'scope': 'COMPACT_ANNOTATION_DERIVED_FROM_VALIDATION_REPORT_NOT_INDIVIDUAL_RAW_TEST_ROWS',
        'fullRawReportDownloaded': False, 'upstreamRawReportHashRecomputed': False,
        'issues': [],
    }
    if len(rows) != 1:
        result['issues'] = ['CI_RESULT_MISSING' if not rows else 'CI_RESULT_DUPLICATED']
        return result
    row = rows[0]
    result['annotationHref'] = row['href']
    body = row['body']
    result['bodyCharacters'] = len(body)
    if len(body) > 4096:
        result['issues'] = ['CI_RESULT_EXCEEDS_ANNOTATION_LIMIT']
        return result
    result['compactPayloadText'] = body
    result['compactPayloadSha256'] = digest(body.encode())
    try:
        payload = json.loads(body)
    except (ValueError, TypeError) as error:
        result['issues'] = ['CI_RESULT_INVALID_OR_TRUNCATED_JSON']
        result['parseError'] = str(error)
        return result
    result['payload'] = payload
    if not isinstance(payload, dict):
        result['issues'] = ['CI_RESULT_OBJECT_REQUIRED']
        return result
    checks = [
        ('CI_RESULT_SCHEMA_MISMATCH', payload.get('schema') == 'ygo-ci-result-summary/v1'),
        ('CI_RESULT_SOURCE_COMMIT_MISMATCH', payload.get('sourceCommit') == commit),
        ('CI_RESULT_SOURCE_RUN_MISMATCH', payload.get('sourceRun') == run_id),
        ('CI_RESULT_BUILD_MISMATCH', payload.get('buildId') == proof['buildId']),
        ('CI_RESULT_HTML_HASH_MISMATCH', payload.get('htmlSha256') == proof['htmlSha256']),
        ('CI_RESULT_GROUP_COUNT_MISMATCH', type(payload.get('groups')) is int and payload['groups'] == proof['totalGroups'] == 88),
        ('CI_RESULT_BUILD_BINDING_NOT_CONFIRMED', payload.get('buildBindingMatches') is True),
        ('CI_RESULT_RAW_REPORT_HASH_INVALID', isinstance(payload.get('rawReportSha256'), str) and bool(re.fullmatch('[a-f0-9]{64}', payload['rawReportSha256']))),
        ('CI_RESULT_PASS_TYPE_INVALID', type(payload.get('pass')) is bool),
        ('CI_RESULT_FAILED_GROUPS_INVALID', isinstance(payload.get('failed'), list) and all(isinstance(name, str) for name in payload.get('failed', []))),
        ('CI_RESULT_ANNOTATION_RUN_LINK_MISMATCH', bool(re.fullmatch(
            r'/socramgns/MODERN/actions/runs/' + re.escape(run_id) + r'/job/\d+#step:\d+:\d+', row['href'] or ''))),
    ]
    result['issues'] = [name for name, passed in checks if not passed]
    result['bindingVerified'] = not result['issues']
    result['reportedPass'] = payload.get('pass') is True
    result['upstreamRawReportSha256'] = payload.get('rawReportSha256')
    if payload.get('pass') is not True:
        result['issues'].append('CI_RESULT_VALIDATION_REPORT_DID_NOT_PASS')
    if payload.get('failed') != []:
        result['issues'].append('CI_RESULT_HAS_FAILED_GROUPS')
    result['pass'] = not result['issues']
    return result


def git(*args):
    result = subprocess.run(['git', *args], cwd=REPO, capture_output=True)
    if result.returncode:
        raise RuntimeError('Read-only Git operation failed: ' + args[0])
    return result.stdout


def digest(data):
    return hashlib.sha256(data).hexdigest()


def command_names(runner):
    parsed = ast.parse(runner)
    assignments = [node for node in ast.walk(parsed)
                   if isinstance(node, ast.Assign)
                   and any(isinstance(target, ast.Name) and target.id == 'commands'
                           for target in node.targets)]
    assert len(assignments) == 1 and isinstance(assignments[0].value, ast.List)
    return [ast.literal_eval(node.elts[0]) for node in assignments[0].value.elts]


def workflow_proof(workflow, baseline_workflow, expected_workflow=None):
    """Permit historical exact bytes or the explicitly supplied reviewed image template."""
    job_budget = b'    timeout-minutes: 45\n'
    suite_budget = b'        timeout-minutes: 25\n'
    assert baseline_workflow.count(job_budget) == 1 and baseline_workflow.count(suite_budget) == 1
    extended = baseline_workflow.replace(job_budget, b'    timeout-minutes: 65\n').replace(suite_budget, b'        timeout-minutes: 40\n')
    unchanged = workflow == baseline_workflow
    only_timeouts = workflow == extended and not unchanged
    if expected_workflow is None:
        assert workflow in (baseline_workflow, extended), 'For the prebuilt workflow supply --expected-workflow with the reviewed exact template'
        return {
            'workflowUnchangedFromBaseline': unchanged,
            'workflowOnlyTimeoutBudgetsExtended': only_timeouts,
            'workflowCommandsUnchanged': True, 'mandatoryGateCommandsUnchanged': True,
            'setupStrategy': 'HISTORICAL_APT_AND_BROWSER_PREPARATION',
            'runtimeDeclaredPinnedImage': None, 'officialImageVerified': False,
            'officialImageSmokeRequiredInCi': False,
            'nativeOfflinePreflightRequiredInCi': False,
            'expectedWorkflowPath': None, 'expectedWorkflowSha256': None,
            'workflowByteExactExpectedTemplate': False,
            'requiredStepNames': list(REQUIRED),
        }
    expected_path = Path(expected_workflow).resolve()
    expected = expected_path.read_bytes()
    assert digest(expected) == PREBUILT_TEMPLATE_SHA256, 'Expected workflow is not the reviewed prebuilt-image template'
    assert workflow == expected, 'Committed workflow differs from the supplied exact template'
    import yaml
    current, baseline = yaml.safe_load(workflow), yaml.safe_load(baseline_workflow)
    assert current['permissions'] == baseline['permissions'] == {'contents': 'read'}
    assert set(current['jobs']) == {'verify'}
    job, old_job = current['jobs']['verify'], baseline['jobs']['verify']
    assert job['runs-on'] == 'ubuntu-24.04' and job['timeout-minutes'] == 75
    assert job['container'] == {'image': PREBUILT_IMAGE, 'options': '--shm-size=1g'}
    assert job['defaults'] == {'run': {'shell': 'bash'}}
    assert job['env']['PLAYWRIGHT_BROWSERS_PATH'] == '/ms-playwright'
    assert b'continue-on-error' not in workflow and b'install-deps' not in workflow
    assert b'sudo' not in workflow and b'actions/cache@' not in workflow
    steps, old_steps = job['steps'], old_job['steps']
    expected_setup = json.loads(json.dumps(old_steps[:3]))
    assert expected_setup[1]['with'].pop('cache') == 'pip'
    assert expected_setup[1]['with'].pop('cache-dependency-path') == 'requirements-dev.txt'
    assert len(steps) == 15 and steps[:3] == expected_setup
    named = {step['name']: step for step in steps if 'name' in step}
    old_named = {step['name']: step for step in old_steps if 'name' in step}
    required = [PREBUILT_SYSTEM_STEP if name == REQUIRED[1] else name for name in REQUIRED]
    assert set(named) == set(required) | {'Publicar el resultado vinculado de CI', 'Guardar los informes'}
    assert len(named) == len(required) + 2
    gates = ['Instalar dependencias Python de comprobación',
             'Recuperar la fuente técnica fijada y comprobar idempotencia',
             'Compilar y comparar el HTML publicado', 'Ejecutar pruebas del entregable',
             'Exigir comprobación entre motores']
    for name in gates:
        assert named[name]['run'] == old_named[name]['run'], 'Mandatory gate command changed: ' + name
    for name in required:
        assert set(named[name]) == {'name', 'timeout-minutes', 'run'}, 'Mandatory step has an unexpected condition or execution option: ' + name
    assert named['Ejecutar pruebas del entregable']['timeout-minutes'] == 45
    for engine in ['Chromium', 'Firefox', 'WebKit']:
        name = 'Preparar ' + engine
        assert named[name]['run'] == old_named[name]['run']
    registration = 'Registrar la ruta de Chromium para las pruebas existentes'
    registration_script = named[registration]['run']
    assert "workspace_directory = Path(os.environ['GITHUB_WORKSPACE']).resolve()" in registration_script
    assert 'assert workspace_directory == Path.cwd().resolve()' in registration_script
    assert "if checks['gitMetadataPresent']:" in registration_script
    assert "['git', 'config', '--global', '--add', 'safe.directory', str(workspace_directory)]" in registration_script
    assert "assert checks['gitMetadataPresent'] and result.returncode == 0" in registration_script
    assert 'assert Path(result.stdout.strip()).resolve() == workspace_directory' in registration_script
    assert 'R23_GIT_RUNTIME' in registration_script
    assert registration_script.rsplit('\nPY\n', 1)[1] == old_named[registration]['run'].replace('sudo ln -s', 'ln -s').rsplit('\nPY\n', 1)[1] + NATIVE_OFFLINE_PROBE_COMMAND + '\n'
    smoke = named[PREBUILT_SYSTEM_STEP]['run']
    assert "for name in ['chromium', 'firefox', 'webkit']:" in smoke
    assert "assert importlib.metadata.version('playwright') == '1.62.0'" in smoke
    assert 'browser = engine.launch(headless=True' in smoke
    assert "assert page.title() == 'R23 runtime check'" in smoke and 'browser.version' in smoke
    assert "assert len(checks) == 3 and all(check['pass'] for check in checks)" in smoke
    assert 'R23_RUNTIME_CHECK' in smoke and 'except Exception as error:' in smoke
    assert "runtime_directory = Path('/github/home')" in smoke
    assert 'assert runtime_directory.is_dir() and not runtime_directory.is_symlink()' in smoke
    assert 'os.chown(runtime_directory, os.getuid(), os.getgid())' in smoke
    assert named['Guardar los informes'] == old_named['Guardar los informes']
    assert named['Publicar el resultado vinculado de CI']['if'] == 'always()'
    assert 'R23_CI_RESULT' in named['Publicar el resultado vinculado de CI']['run']
    receipt_bytes, manifest_bytes = IMAGE_RECEIPT.read_bytes(), IMAGE_MANIFEST.read_bytes()
    receipt = json.loads(receipt_bytes)
    image_digest = PREBUILT_IMAGE.rsplit(':', 1)[1]
    assert receipt['pinnedImage'] == PREBUILT_IMAGE and receipt['httpStatus'] == 200
    assert receipt['officialRepository'] == 'mcr.microsoft.com/playwright/python'
    assert receipt['contentDigestVerified'] is True and receipt['tlsVerificationDisabled'] is False
    assert receipt['manifestSha256'] == image_digest == digest(manifest_bytes)
    return {
        'workflowUnchangedFromBaseline': False, 'workflowOnlyTimeoutBudgetsExtended': False,
        'workflowCommandsUnchanged': False, 'mandatoryGateCommandsUnchanged': True,
        'setupStrategy': 'PINNED_OFFICIAL_PLAYWRIGHT_IMAGE',
        'runtimeDeclaredPinnedImage': PREBUILT_IMAGE, 'officialImageVerified': True,
        'officialImageSmokeRequiredInCi': True,
        'nativeOfflinePreflightRequiredInCi': True,
        'nativeOfflinePreflightCommand': NATIVE_OFFLINE_PROBE_COMMAND,
        'nativeOfflinePreflightOutputArtifact': 'tests/native-offline-preflight-results.json',
        'workspaceGitOwnershipCheck': {
            'workspaceSource': 'GITHUB_WORKSPACE', 'mustEqualCurrentWorkingDirectory': True,
            'gitMetadataRequired': True, 'safeDirectoryScope': 'ONLY_THE_EXACT_WORKSPACE_PATH',
            'globalWildcardTrustAllowed': False, 'gitTopLevelMustEqualWorkspace': True,
        },
        'runtimeDirectoryOwnershipCheck': {
            'path': '/github/home', 'nonSymlinkDirectoryRequired': True,
            'targetOwner': 'CURRENT_CONTAINER_UID_AND_GID', 'recursive': False,
            'scope': 'EPHEMERAL_GITHUB_RUNNER_MOUNT_ONLY', 'homeEnvironmentVariableChanged': False,
        },
        'officialImageVerification': {
            'scope': 'STORED_OFFICIAL_REGISTRY_MANIFEST_AND_PINNED_WORKFLOW_DECLARATION',
            'sourceUrl': receipt['sourceUrl'], 'httpStatusAtCapture': receipt['httpStatus'],
            'manifestSha256': image_digest, 'manifestBytesRechecked': True,
            'receiptPath': str(IMAGE_RECEIPT), 'receiptSha256': digest(receipt_bytes),
            'manifestPath': str(IMAGE_MANIFEST), 'registryRetrievalInThisObserver': False,
        },
        'expectedWorkflowPath': str(expected_path), 'expectedWorkflowSha256': digest(expected),
        'workflowByteExactExpectedTemplate': True, 'requiredStepNames': required,
    }


def source_proof(commit, expected_workflow=None):
    runner = git('show', commit + ':tests/run_all.py')
    names = command_names(runner)
    assert len(names) == 86 and len(set(names)) == 86
    baseline_names = command_names(git('show', BASELINE + ':tests/run_all.py'))
    assert len(baseline_names) == 77
    assert set(names) == set(baseline_names) | NEW_GROUPS
    assert b"rows.append({'name':'source_syntax','pass':True" in runner
    assert b"rows.append({'name':'artifact_unchanged_during_tests','pass':actual==build['htmlSha256']})" in runner
    assert b"return 0 if report['pass'] else 1" in runner
    workflow = git('show', commit + ':.github/workflows/verify-html.yml')
    baseline_workflow = git('show', BASELINE + ':.github/workflows/verify-html.yml')
    workflow_contract = workflow_proof(workflow, baseline_workflow, expected_workflow)
    native_helper_sha = None
    if workflow_contract['nativeOfflinePreflightRequiredInCi']:
        native_helper = git('show', commit + ':tests/browser_offline.py')
        native_helper_sha = digest(native_helper)
        assert native_helper_sha == NATIVE_OFFLINE_HELPER_SHA256, 'Native offline helper differs from the approved exact source'
    assert b'python tests/run_all.py --no-build' in workflow
    assert b'python tests/compatibility_browser.py --require-cross-browser' in workflow
    manifest = json.loads(git('show', commit + ':manifest.json'))
    assert manifest['revision'] == '2026.11-stable.23'
    extensions = manifest['extensions']
    procedures = ['src/app/priority-chain.js', 'src/app/trigger-order.js',
                  'src/app/damage-step.js', 'src/app/xyz-summon.js',
                  'src/app/pendulum-summon.js']
    assert all(path in extensions for path in procedures)
    assert [extensions.index(path) for path in procedures] == sorted(extensions.index(path) for path in procedures)
    assert extensions.index('src/app/draw-sequences.js') > extensions.index('src/app/draw-continuation.js')
    assert extensions.index('src/app/rules-workbench.js') > extensions.index('src/app/draw-sequences.js')
    paths = git('ls-tree', '-r', '--name-only', commit).decode().splitlines()
    javascript = [path for path in paths if path.endswith('.js')
                  and path.startswith(('src/scripts/', 'src/modules/', 'src/app/'))]
    assert len(javascript) == 131
    # Recompute the build fingerprint from committed bytes in build.py order.
    archive = git('archive', '--format=tar', commit, 'manifest.json', 'tools', 'src')
    with tarfile.open(fileobj=BytesIO(archive), mode='r:') as bundle:
        files = {entry.name: bundle.extractfile(entry).read()
                 for entry in bundle if entry.isfile() and '__pycache__' not in Path(entry.name).parts}
    ordered = ['manifest.json'] + sorted((path for path in files if path.startswith('tools/')), key=Path) + sorted((path for path in files if path.startswith('src/')), key=Path)
    fingerprint = hashlib.sha256()
    for path in ordered:
        fingerprint.update(path.encode() + b'\0' + files[path] + b'\0')
    data = git('show', commit + ':Analizador_YuGiOh.html')
    embedded = re.search(rb'window\.YGO_BUILD_MANIFEST=(\{[^\n]+\});\nwindow\.YGO_CATALOG_MANIFEST=', data)
    assert embedded, 'Committed HTML has no recognized embedded build manifest'
    build = json.loads(embedded.group(1))
    assert re.fullmatch('[a-f0-9]{64}', build['buildId'])
    assert build['revision'] == manifest['revision']
    assert build['buildId'] == fingerprint.hexdigest(), 'Committed HTML does not match committed build inputs'
    assert build['scope']['ranking'] == 'STRUCTURAL_PROVISIONAL'
    assert build['scope']['universalCertified'] is False
    critical = ['manifest.json', 'requirements-dev.txt', 'Analizador_YuGiOh.html',
                'src', 'tools', 'tests', '.github']
    changed = git('diff', '--name-only', commit, '--', *critical).decode().splitlines()
    untracked = git('ls-files', '--others', '--exclude-standard', '--', *critical).decode().splitlines()
    return {
        'candidateCommit': commit, 'runnerSha256': digest(runner),
        'commandGroups': len(names), 'commandNames': names,
        'additionalMandatoryGroups': ['source_syntax', 'artifact_unchanged_during_tests'],
        'totalGroups': len(names) + 2, 'allGroupsMustPassForRunnerExitZero': True,
        'previousCommandsPreserved': True, 'workflowSha256': digest(workflow),
        **workflow_contract, 'baselineCommit': BASELINE,
        'nativeOfflineHelperSha256': native_helper_sha,
        'nativeOfflineHelperExactSourceVerified': native_helper_sha is not None,
        'sourceJavaScriptFiles': len(javascript), 'revision': manifest['revision'],
        'currentCodeTestsWorkflowUnchanged': not changed and not untracked,
        'currentCriticalDifferences': changed, 'currentUntrackedCriticalFiles': untracked,
        'committedBuildInputsFingerprintVerified': True,
        'htmlSha256': digest(data), 'bytes': len(data), 'buildId': build['buildId'],
        'embeddedBuildManifest': build,
    }


def fetch(url, path):
    request = urllib.request.Request(url, headers={'User-Agent': 'MODERN-R23-CI-readonly-observer/1'})
    with urllib.request.urlopen(request, timeout=40) as response:
        data, status, resolved = response.read(), response.status, response.geturl()
    assert status == 200
    path.write_bytes(data)
    return ({'url': url, 'httpStatus': status, 'resolvedUrl': resolved,
             'path': str(path), 'sha256': digest(data), 'bytes': len(data)},
            data.decode('utf-8', errors='replace'))


def observe(commit, run_url, out, expected_workflow=None):
    out.mkdir(parents=True, exist_ok=True)
    run_id = run_url.rsplit('/', 1)[1]
    report = {
        'schema': 'ygo-r23-public-ci-observation/v1',
        'observedAt': datetime.now(timezone.utc).isoformat(),
        'candidateCommit': commit, 'runUrl': run_url,
        'transport': 'PUBLIC_GITHUB_HTML', 'apiUsed': False,
        'individualRemoteReportsDownloaded': False,
        'sourceRunnerGroupCountVerified': False, 'requiredStepNames': REQUIRED,
        'pass': False, 'conclusion': 'unknown',
    }
    try:
        proof = source_proof(commit, expected_workflow)
        report['sourceProof'] = proof
        report['sourceRunnerGroupCountVerified'] = True
        required = proof['requiredStepNames']
        report['requiredStepNames'] = required
        report['officialImageVerified'] = proof['officialImageVerified']
        report['runtimeDeclaredPinnedImage'] = proof['runtimeDeclaredPinnedImage']
        receipt, page = fetch(run_url, out / (commit + '-run-' + run_id + '.html'))
        report['run'] = receipt
        compact = compact_ci_result(page, proof, commit, run_id)
        report['compactCiResult'] = compact
        report['compactCiResultObserved'] = compact['observed']
        report['compactCiResultVerified'] = compact['pass']
        if compact.get('compactPayloadText') is not None:
            compact_path = out / (commit + '-run-' + run_id + '-ci-result-summary.json')
            compact_path.write_text(compact['compactPayloadText'])
            compact['compactSummaryPath'] = str(compact_path)
            compact['compactSummaryFileSha256'] = digest(compact_path.read_bytes())
        report['commitFoundInRun'] = bool(re.search(
            r'href=[\"\'][^\"\']*/socramgns/MODERN/commit/' + re.escape(commit) + r'[\"\']', page))
        labels = [html.unescape(value).strip() for value in re.findall(
            r'<span class="h4 color-fg-default">([^<]+)</span>', page)]
        report['visibleStatus'] = labels
        for label, state in [('Failure', 'failure'), ('Cancelled', 'cancelled'),
                             ('Success', 'success'), ('Queued', 'queued'), ('In progress', 'in_progress')]:
            if label in labels:
                report['conclusion'] = state
                break
        report['runSuccess'] = report['conclusion'] == 'success'
        job_pattern = r'/socramgns/MODERN/actions/runs/' + re.escape(run_id) + r'/job/\d+'
        jobs = list(dict.fromkeys(re.findall(job_pattern, page)))
        report['jobs'] = []
        for job_path in jobs:
            job_id = job_path.rsplit('/', 1)[1]
            job_receipt, document = fetch('https://github.com' + job_path,
                                           out / (commit + '-job-' + job_id + '.html'))
            parser = Steps()
            parser.feed(document)
            selected = [row for row in parser.rows if row.get('data-name') in required]
            valid = len(selected) == len(required) and len({row.get('data-name') for row in selected}) == len(required)
            for row in selected:
                valid = (valid and row.get('data-conclusion') == 'success'
                         and 'data-job-completed' in row
                         and bool(re.fullmatch(r'/socramgns/MODERN/commit/' + re.escape(commit)
                                               + r'/checks/\d+/logs/\d+', row.get('data-log-url', ''))))
            smoke = [row for row in selected if row.get('data-name') == PREBUILT_SYSTEM_STEP]
            smoke_verified = (proof['officialImageSmokeRequiredInCi'] and len(smoke) == 1
                              and smoke[0].get('data-conclusion') == 'success'
                              and 'data-job-completed' in smoke[0]
                              and bool(re.fullmatch(r'/socramgns/MODERN/commit/' + re.escape(commit)
                                                    + r'/checks/\d+/logs/\d+', smoke[0].get('data-log-url', ''))))
            git_runtime = [row for row in selected if row.get('data-name') == 'Registrar la ruta de Chromium para las pruebas existentes']
            git_runtime_verified = (proof['officialImageSmokeRequiredInCi'] and len(git_runtime) == 1
                                    and git_runtime[0].get('data-conclusion') == 'success'
                                    and 'data-job-completed' in git_runtime[0]
                                    and bool(re.fullmatch(r'/socramgns/MODERN/commit/' + re.escape(commit)
                                                          + r'/checks/\d+/logs/\d+', git_runtime[0].get('data-log-url', ''))))
            report['jobs'].append({
                **job_receipt, 'requiredStepsVerified': bool(valid),
                'officialImageSmokeVerifiedInCi': bool(smoke_verified),
                'workspaceGitRuntimeVerifiedInCi': bool(git_runtime_verified),
                'requiredSteps': [{key: row.get(key) for key in
                                  ['data-name', 'data-conclusion', 'data-log-url',
                                   'data-started-at', 'data-completed-at', 'data-job-completed']}
                                 for row in selected],
                'allStepStates': [{'name': row.get('data-name'), 'conclusion': row.get('data-conclusion')}
                                  for row in parser.rows],
            })
        report['officialImageSmokeVerifiedInCi'] = any(job['officialImageSmokeVerifiedInCi'] for job in report['jobs'])
        report['workspaceGitRuntimeVerifiedInCi'] = any(job['workspaceGitRuntimeVerifiedInCi'] for job in report['jobs'])
        report['nativeOfflinePreflightVerifiedInCi'] = bool(proof['nativeOfflinePreflightRequiredInCi'] and report['workspaceGitRuntimeVerifiedInCi'])
        report['pass'] = bool(report['commitFoundInRun'] and report['runSuccess']
                              and proof['currentCodeTestsWorkflowUnchanged']
                              and (not compact['requiredForAcceptance'] or compact['pass'])
                              and any(job['requiredStepsVerified'] for job in report['jobs']))
    except Exception as error:
        report['errorType'] = type(error).__name__
        report['error'] = str(error)
    target = out / 'remote-acceptance-observation.json'
    target.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    (out / (commit + '-run-' + run_id + '-observation.json')).write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    with (out / 'observations.jsonl').open('a') as history:
        history.write(json.dumps(report, ensure_ascii=False) + '\n')
    print(json.dumps({key: report.get(key) for key in
                      ['observedAt', 'pass', 'candidateCommit', 'runUrl', 'conclusion',
                       'visibleStatus', 'commitFoundInRun', 'errorType', 'error']}, ensure_ascii=False), flush=True)
    print(json.dumps({'jobs': [{'url': job['url'], 'requiredStepsVerified': job['requiredStepsVerified'],
                               'states': job['allStepStates']} for job in report.get('jobs', [])]}, ensure_ascii=False), flush=True)
    return report


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--commit', required=True, help='Exact full candidate commit SHA')
    parser.add_argument('--run', required=True, help='Public GitHub Actions run URL')
    parser.add_argument('--output-dir', type=Path, default=DEFAULT_OUT)
    parser.add_argument('--expected-workflow', type=Path,
                        help='Exact reviewed prebuilt-image workflow template, required for that setup strategy')
    parser.add_argument('--loop', action='store_true', help='Observe every 50 seconds until a terminal conclusion')
    args = parser.parse_args()
    if not re.fullmatch('[a-f0-9]{40}', args.commit):
        parser.error('--commit must be a full 40-character lowercase hexadecimal SHA')
    args.run = args.run.rstrip('/')
    if not re.fullmatch(r'https://github\.com/socramgns/MODERN/actions/runs/\d+', args.run):
        parser.error('--run must identify a public socramgns/MODERN Actions run')
    while True:
        result = observe(args.commit, args.run, args.output_dir, args.expected_workflow)
        if (not args.loop or result.get('pass')
                or result.get('conclusion') in ('success', 'failure', 'cancelled')
                or result.get('error')):
            break
        time.sleep(50)

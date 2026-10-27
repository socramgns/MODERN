#!/usr/bin/env python3
"""Exercise the standalone HTML through normal, offline file: navigation.

No web server, route fulfillment, browser-policy changes or special file-access
flags are used. Engines that reject file navigation remain explicitly pending.
"""
from pathlib import Path
import argparse
import datetime as dt
import hashlib
import json
import tempfile

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


def wait_ready(page):
    page.wait_for_function(
        'window.YGOStableRelease?.status().ready && window.YGODataCatalog?.status().loaded '
        '&& window.YGOUIState?.last && window.YGOComboWorkbench', timeout=60000)
    page.evaluate('async()=>{await YGODataCatalog.ready;await YGOUIState.ready;await YGOComboWorkbench.ready;}')


def test_engine(browser, engine, artifact, build, fixture):
    tests, details, errors = [], {}, []

    def check(name, passed, detail=None):
        tests.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(engine, name, 'PASS' if passed else 'FAIL', flush=True)

    context = browser.new_context(offline=True, accept_downloads=True,
                                  viewport={'width': 1280, 'height': 900})
    page = context.new_page()
    page.on('pageerror', lambda error: errors.append(str(error)))
    navigation_verified = False
    try:
        if engine == 'webkit':
            # WPE can reject every file: navigation when offline emulation is
            # enabled, even a one-paragraph control in the same directory.
            # Establish that runtime limitation before opening the application;
            # an application failure after a successful control remains FAIL.
            with tempfile.NamedTemporaryFile(prefix='local-file-control-', suffix='.html',
                                             dir=artifact.parent, mode='w', delete=False) as handle:
                handle.write('<!doctype html><title>Local file control</title><p>offline-file-control</p>')
                control = Path(handle.name)
            try:
                control_message = 'Unexpected content in minimal file control'
                try:
                    page.goto(control.as_uri(), wait_until='domcontentloaded', timeout=15000)
                    control_pass = page.locator('p').inner_text() == 'offline-file-control'
                except Exception as control_error:
                    control_pass = False
                    control_message = str(control_error)
                if not control_pass:
                    online_context = browser.new_context()
                    try:
                        online_page = online_context.new_page()
                        online_page.goto(control.as_uri(), wait_until='domcontentloaded', timeout=15000)
                        online_pass = online_page.locator('p').inner_text() == 'offline-file-control'
                    except Exception as online_error:
                        online_pass = False
                        details['onlineControlError'] = str(online_error)[:2500]
                    finally:
                        online_context.close()
                    if online_pass and 'WebKit encountered an internal error' in control_message:
                        return {'engine': engine, 'version': browser.version,
                                'status': 'OFFLINE_FILE_EMULATION_UNAVAILABLE', 'pass': None,
                                'directFileNavigationVerified': False, 'tests': [],
                                'control': {'sameArtifactDirectory': True, 'offlineMinimalDocument': False,
                                            'onlineMinimalDocument': True, 'error': control_message[:2500]},
                                'limitation': 'Runtime offline emulation rejects a minimal file before the application is loaded.'}
                    raise RuntimeError('MINIMAL_FILE_CONTROL_FAILED: ' + control_message)
            finally:
                control.unlink(missing_ok=True)
        page.goto(artifact.as_uri(), wait_until='domcontentloaded', timeout=30000)
        wait_ready(page)
        navigation_verified = True
        identity = page.evaluate('()=>({buildId:YGO_BUILD_MANIFEST.buildId,ready:__YGO_BOOT_HEALTH_1263().ready,protocol:location.protocol})')
        check('offline_file_boot_bound_to_delivered_build', identity['buildId'] == build['buildId']
              and identity['ready'] and identity['protocol'] == 'file:', identity)

        page.locator('#ygoCausalFile').set_input_files({
            'name': 'Invoked_local_file.json', 'mimeType': 'application/json',
            'buffer': json.dumps(fixture).encode()})
        page.wait_for_function('YGOUIState.last?.counts.main===40 && '
                               'YGOComboWorkbench.report().openingIds[0]===86120751', timeout=60000)
        imported = page.evaluate('()=>({fingerprint:YGOComboEngine.deckFingerprint(deckState),opening:YGOComboWorkbench.report().openingIds,counts:YGOUIState.last.counts,name:document.getElementById("name").value,context:YGOUIState.getFormatContext()})')
        check('import_physical_deck_from_file', imported['counts']['main'] == 40
              and imported['opening'] == fixture['openingIds'], imported)

        calculate = page.locator('.main-calc-pad button.calc')
        calculate.focus()
        focused = calculate.evaluate('(button)=>document.activeElement===button')
        page.keyboard.press('Enter')
        page.wait_for_function('!document.querySelector(".main-calc-pad button.calc").disabled '
                               '&& YGOUIState.last?.evaluation?.total>=0', timeout=60000)
        score = page.evaluate('()=>({evaluation:YGOUIState.last.evaluation,scope:YGOStableRelease.status().score})')
        check('calculate_with_keyboard_keeps_score_provisional', focused
              and score['evaluation']['total'] == sum(score['evaluation']['stats'])
              and score['scope']['competitiveCertified'] is False,
              {'keyboardFocused': focused, 'total': score['evaluation']['total'], 'scope': score['scope']})

        result = page.evaluate('async()=>{const r=await YGOComboWorkbench.run({maxDepth:14,maxStates:5000,maxMs:10000});return{pass:r.pass,count:r.lines?.length||0,goals:(r.lines||[]).map(l=>YGOComboWorkbench.goalMatches(l.state,r.goal)),replays:(r.lines||[]).map(l=>YGOComboEngine.replay(l,{deck:deckState}).pass)};}')
        check('offline_file_invoked_goal_has_fresh_replay', result['pass'] and result['count'] > 0
              and all(result['goals']) and all(result['replays']), result)

        with tempfile.TemporaryDirectory(prefix='ygo-file-downloads-') as directory:
            folder = Path(directory)
            expected = page.evaluate('()=>YGOAlpha330.serializeYDK(deckState).text')
            with page.expect_download() as pending:
                page.locator('#alpha330ExportYDK').click()
            pending.value.save_as(folder / 'deck.ydk')
            actual = (folder / 'deck.ydk').read_text()
            lines = lambda text: [line.strip() for line in text.splitlines()
                                  if line.strip() and not line.startswith('#created')]
            check('ydk_download_from_local_html_preserves_cards', lines(actual) == lines(expected))

            with page.expect_download() as pending:
                page.locator('[data-action=analysis]').click()
            pending.value.save_as(folder / 'analysis.json')
            exported = json.loads((folder / 'analysis.json').read_text())
            check('analysis_download_from_local_html_is_bound_to_build', exported['schema'] == 'ygo-analysis/v1'
                  and exported['status']['build']['buildId'] == build['buildId']
                  and exported['status']['score']['competitiveCertified'] is False)

        saved = page.evaluate('()=>YGOUIState.saveSession()')
        check('local_file_session_saved', saved.get('saved') is True, saved)
        page.reload(wait_until='domcontentloaded')
        wait_ready(page)
        page.wait_for_function('YGOUIState.last?.counts.main===40 && YGOUIState.last?.evaluation?.total>=0', timeout=60000)
        restored = page.evaluate('()=>({fingerprint:YGOComboEngine.deckFingerprint(deckState),name:document.getElementById("name").value,context:YGOUIState.getFormatContext()})')
        check('offline_local_file_reload_restores_same_deck_and_context',
              restored == {key: imported[key] for key in ['fingerprint', 'name', 'context']}, restored)
        check('no_javascript_page_errors', not errors, errors)
        return {'engine': engine, 'version': browser.version, 'status': 'PASSED' if all(t['pass'] for t in tests) else 'FAILED',
                'pass': all(t['pass'] for t in tests), 'directFileNavigationVerified': True,
                'tests': tests, 'details': details, 'pageErrors': errors}
    except Exception as error:
        message = str(error)
        blocked = not navigation_verified and any(token in message for token in
                     ['ERR_BLOCKED_BY_ADMINISTRATOR', 'NS_ERROR_DOM_BAD_URI'])
        return {'engine': engine, 'version': browser.version,
                'status': 'BLOCKED_BY_BROWSER_POLICY' if blocked else 'FAILED',
                'pass': None if blocked else False, 'directFileNavigationVerified': navigation_verified,
                'tests': tests, 'details': details, 'pageErrors': errors, 'error': message[:5000]}
    finally:
        context.close()


def run(engines):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    actual = hashlib.sha256(artifact.read_bytes()).hexdigest()
    if actual != build['htmlSha256']:
        raise ValueError('DELIVERED_BYTES_DIFFER_FROM_MANIFEST')
    fixture = json.loads((ROOT / 'examples/Arquetipo_Invoked.json').read_text())
    records = []
    with sync_playwright() as playwright:
        for engine in engines:
            browser_type = getattr(playwright, engine)
            executable = Path(browser_type.executable_path)
            if not executable.is_file():
                records.append({'engine': engine, 'status': 'UNAVAILABLE', 'pass': None,
                                'directFileNavigationVerified': False, 'tests': []})
                continue
            try:
                browser = browser_type.launch(executable_path=str(executable), headless=True)
                try:
                    records.append(test_engine(browser, engine, artifact, build, fixture))
                finally:
                    browser.close()
            except Exception as error:
                records.append({'engine': engine, 'status': 'FAILED', 'pass': False,
                                'directFileNavigationVerified': False, 'tests': [], 'error': str(error)[:5000]})
    executed = [record for record in records if record['pass'] is not None]
    return {'schema': 'ygo-local-file-delivery/v1', 'buildId': build['buildId'], 'htmlSha256': actual,
            'executedAt': dt.datetime.now(dt.timezone.utc).isoformat(),
            'pass': bool(executed) and all(record['pass'] for record in executed),
            'complete': len(executed) == len(engines) and all(record['pass'] for record in executed),
            'artifactMode': 'DIRECT_FILE_NAVIGATION', 'networkMode': 'OFFLINE',
            'browserPolicyChanges': False, 'routeFulfillmentUsed': False, 'httpServerUsed': False,
            'browsers': records,
            'limitations': ['Automated browser tasks do not certify every OS/browser configuration.',
                            'Local file storage is bound to this browser profile and file location.',
                            'Competition score remains provisional; only registered actions are replayed.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--engine', choices=['firefox', 'webkit'], action='append')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/local-file-delivery-results.json')
    options = parser.parse_args()
    result = run(options.engine or ['firefox', 'webkit'])
    options.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': result['pass'], 'complete': result['complete'],
                      'browsers': [{'engine': row['engine'], 'status': row['status']} for row in result['browsers']]}))
    raise SystemExit(0 if result['pass'] else 1)

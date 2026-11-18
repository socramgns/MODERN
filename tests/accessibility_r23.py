#!/usr/bin/env python3
"""Focused accessibility checks; DOM evidence is not a screen-reader witness.

The optional source diagnostic injects only the presentation module and must
never be described as acceptance of delivered R23 bytes. Manual-report fixture
objects are synthetic schema diagnostics, not physical-device test results.
"""
import argparse
import copy
import hashlib
import json
import os
from pathlib import Path
import shutil
import time

from playwright.sync_api import sync_playwright
from release5_browser import load_example, ready
from expanded_examples_browser import execute_step, report

ROOT = Path(__file__).resolve().parents[1]


def run(url=None, diagnostic_source=False):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    document = artifact.read_bytes()
    digest = hashlib.sha256(document).hexdigest()
    assert digest == build['htmlSha256']
    target = url or 'https://ygo-accessibility-r23.test/Analizador_YuGiOh.html'
    checks, details, errors, blocked = [], {}, [], []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    with sync_playwright() as runtime:
        executable = os.environ.get('YGO_CHROMIUM') or shutil.which('chromium')
        browser = runtime.chromium.launch(executable_path=executable, headless=True,
                                           args=['--no-sandbox'])
        context = browser.new_context(viewport={'width': 1440, 'height': 1000},
                                      accept_downloads=True, reduced_motion='no-preference')

        def deliver(route):
            if route.request.url == target:
                route.fulfill(status=200, content_type='text/html; charset=utf-8', body=document)
            else:
                blocked.append(route.request.url)
                route.abort()

        context.route('**/*', deliver)
        context.set_offline(True)
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        response = page.goto(target, wait_until='domcontentloaded')
        ready(page)
        if diagnostic_source:
            page.evaluate((ROOT / 'src/app/accessibility.js').read_text())
        page.wait_for_function('()=>YGOAccessibility?.version==="keyboard-presentation-v2"&&document.getElementById("ygoManualEvidence")')
        check('r23_accessibility_uses_manifest_bound_document_offline',
              response is not None and hashlib.sha256(response.body()).hexdigest() == digest
              and page.evaluate('()=>navigator.onLine===false')
              and page.evaluate('()=>YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        check('automation_does_not_claim_screen_reader_physical_device_or_full_conformance',
              page.evaluate('''()=>YGOAccessibility.completeAccessibilityCertified===false
                &&YGOAccessibility.assistiveTechnologyTested===false
                &&YGOAccessibility.physicalDevicesTested===false'''))
        load_example(page, 'invoked')
        baseline = page.evaluate('()=>JSON.stringify(YGOAdvancedWorkbench.report())')
        page.locator('#ygoManualEvidence summary').click()
        page.locator('#ygoA11yHighContrast').focus()
        page.keyboard.press('Space')
        check('contrast_preference_works_from_keyboard_and_exposes_checked_state',
              page.locator('#ygoA11yHighContrast').is_checked()
              and page.evaluate('()=>document.documentElement.dataset.ygoContrast==="more"')
              and page.get_by_role('checkbox', name='Aumentar contraste de los paneles de trabajo').count() == 1)
        check('preference_change_has_a_concise_polite_atomic_announcement',
              page.locator('#ygoAccessibilityAnnouncement').get_attribute('role') == 'status'
              and page.locator('#ygoAccessibilityAnnouncement').get_attribute('aria-live') == 'polite'
              and page.locator('#ygoAccessibilityAnnouncement').get_attribute('aria-atomic') == 'true'
              and 'activado' in page.locator('#ygoAccessibilityAnnouncement').inner_text())
        saved = page.evaluate('()=>JSON.parse(localStorage.getItem("ygo-accessibility-preferences-v1"))')
        check('accessibility_preferences_are_saved_separately_from_deck_state', saved['highContrast'] is True
              and page.evaluate('()=>JSON.stringify(YGOAdvancedWorkbench.report())') == baseline)

        for host in page.locator('[data-ygo-accessible-region]').all():
            for item in host.locator('details').all():
                if not item.evaluate('(element)=>element.open'):
                    item.locator(':scope > summary').click()
        page.wait_for_timeout(100)
        structure = page.evaluate('()=>YGOAccessibility.audit()')
        check('visible_registered_controls_have_names_and_valid_aria_references',
              structure['pass'] is True and structure['controlsChecked'] >= 25, structure)
        page.wait_for_function('()=>document.getElementById("ygoDuelUndo").getAttribute("aria-describedby")?.includes("ygoA11yReason")')
        check('disabled_undo_has_a_visible_explanation',
              page.locator('#ygoDuelUndo').is_disabled()
              and page.locator('#ygoA11yReason-ygoDuelUndo').is_visible()
              and 'deshacer' in page.locator('#ygoA11yReason-ygoDuelUndo').inner_text())
        page.locator('#ygoDuelActionFilter').fill('NO_SUCH_REGISTERED_ACTION_986754')
        page.wait_for_function('()=>document.getElementById("ygoDuelActions").disabled&&document.getElementById("ygoDuelActions").getAttribute("aria-describedby")?.includes("ygoA11yReason")')
        described = page.locator('#ygoDuelActions').get_attribute('aria-describedby').split()
        check('disabled_reason_preserves_the_original_action_count_description',
              'ygoDuelActionCount' in described and 'ygoA11yReason-ygoDuelActions' in described)
        page.locator('#ygoDuelActionFilter').fill('')
        page.wait_for_function('()=>!document.getElementById("ygoDuelActions").disabled&&!document.getElementById("ygoDuelActions").getAttribute("aria-describedby")?.includes("ygoA11yReason")')
        check('enabled_control_drops_only_its_owned_disabled_reason',
              page.locator('#ygoDuelActions').get_attribute('aria-describedby') == 'ygoDuelActionCount'
              and not page.locator('#ygoA11yReason-ygoDuelActions').is_visible())

        # Only opaque computed text paints are evaluated; unsupported paints
        # remain explicit rather than being treated as a white/black default.
        paints = page.evaluate('''()=>{
          const parse=value=>{const parts=value.match(/[\\d.]+/g)?.map(Number);
            return parts&&parts.length>=3?{rgb:parts.slice(0,3),a:parts[3]??1}:null;};
          const luminance=rgb=>rgb.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4)
            .reduce((sum,x,i)=>sum+x*[.2126,.7152,.0722][i],0);
          const ratio=(a,b)=>{const high=Math.max(luminance(a),luminance(b)),low=Math.min(luminance(a),luminance(b));return(high+.05)/(low+.05);};
          const controls=[...new Set([...document.querySelectorAll('[data-ygo-accessible-region]')]
            .flatMap(root=>[...root.querySelectorAll('button,input,select,textarea')]))]
            .filter(el=>el.getClientRects().length&&!el.disabled&&!el.closest('details:not([open])'));
          return controls.map(el=>{const style=getComputedStyle(el),fg=parse(style.color),bg=parse(style.backgroundColor);
            if(['checkbox','radio'].includes(el.type))return{id:el.id,scope:'NATIVE_WIDGET_PAINT_UNMEASURED'};
            if(!fg||!bg||fg.a!==1||bg.a!==1||style.backgroundImage!=='none'||Number(style.opacity)!==1)
              return{id:el.id,scope:'NON_OPAQUE_OR_COMPOSITE_PAINT_UNMEASURED'};
            return{id:el.id,scope:'OPAQUE_COMPUTED_TEXT',ratio:ratio(fg.rgb,bg.rgb),foreground:style.color,background:style.backgroundColor};});
        }''')
        measured = [row for row in paints if row['scope'] == 'OPAQUE_COMPUTED_TEXT']
        check('high_contrast_opaque_control_text_meets_four_point_five_to_one',
              len(measured) >= 20 and all(row['ratio'] >= 4.5 for row in measured),
              {'measured': measured, 'unmeasured': [row for row in paints if row not in measured]})
        page.locator('#ygoManualEvidenceTemplate').focus()
        focus = page.locator('#ygoManualEvidenceTemplate').evaluate('''el=>{const s=getComputedStyle(el);
          return{style:s.outlineStyle,width:parseFloat(s.outlineWidth),color:s.outlineColor,background:s.backgroundColor};}''')
        check('contrast_mode_keeps_a_visible_keyboard_focus_indicator',
              focus['style'] == 'solid' and focus['width'] >= 3, focus)

        page.locator('#ygoA11yReduceMotion').focus()
        page.keyboard.press('Space')
        motion = page.locator('#ygoManualEvidenceTemplate').evaluate('(el)=>getComputedStyle(el).transitionDuration')
        check('reduced_motion_preference_is_keyboard_operable',
              page.locator('#ygoA11yReduceMotion').is_checked()
              and page.evaluate('()=>document.documentElement.dataset.ygoReducedMotion==="reduce"')
              and all(float(part.strip().removesuffix('s')) <= .001 for part in motion.split(',')))

        with page.expect_download() as pending:
            page.locator('#ygoManualEvidenceTemplate').click()
        template = json.loads(Path(pending.value.path()).read_text())
        check('manual_template_is_build_bound_and_starts_without_executed_or_physical_claims',
              template['buildId'] == build['buildId']
              and template['htmlSha256'] is None and template['testedAt'] is None
              and template['performedByReporter'] is False
              and template['environment']['deviceKind'] is None
              and template['environment']['physicalDeviceConfirmed'] is False
              and all(row['result'] == 'NOT_RUN' for row in template['flows']))
        fixture = copy.deepcopy(template)
        fixture.update(htmlSha256=digest, testedAt='2026-11-14T12:00:00Z',
                       testerAlias='SYNTHETIC VALIDATOR FIXTURE', performedByReporter=True)
        fixture['environment'].update(deviceKind='EMULATED', deviceModel='QA simulated viewport',
            os='QA operating system', osVersion='QA version', browser='QA Chromium',
            browserVersion='QA build', emulationUsed=True)
        for flow in fixture['flows']:
            flow.update(result='PASS', observed='Synthetic schema assertion; no physical or screen-reader witness.')
        validate = lambda value: page.evaluate('''({value,digest})=>YGOAccessibility.validateManualEvidence(value,{htmlSha256:digest})''', {'value': value, 'digest': digest})
        valid = validate(fixture)
        check('manual_validator_distinguishes_reporter_claims_from_agent_verification',
              valid['inputValid'] is True and valid['requiresHumanReview'] is True
              and valid['physicalDeviceReported'] is False
              and valid['physicalDevicesVerifiedByAgent'] is False
              and valid['completeAccessibilityCertified'] is False
              and valid['htmlHashCompared'] is True)
        variants = []
        for kind in ['build', 'hash', 'duplicate', 'physical-conflict', 'unconfirmed', 'technology']:
            value = copy.deepcopy(fixture)
            if kind == 'build': value['buildId'] = 'f' * 64
            if kind == 'hash': value['htmlSha256'] = 'f' * 64
            if kind == 'duplicate': value['flows'][1]['id'] = value['flows'][0]['id']
            if kind == 'physical-conflict': value['environment']['physicalDeviceConfirmed'] = True
            if kind == 'unconfirmed': value['performedByReporter'] = False
            if kind == 'technology': value['environment']['assistiveTechnology']['actualUse'] = True
            variants.append({'kind': kind, 'rejected': validate(value)['inputValid'] is False})
        check('manual_validator_rejects_wrong_binding_duplicate_flows_and_conflicting_claims',
              all(row['rejected'] for row in variants), variants)
        not_run = copy.deepcopy(fixture)
        not_run['flows'][0].update(result='NOT_RUN', observed='')
        review = validate(not_run)
        check('valid_unrun_manual_flow_is_never_counted_as_passed',
              review['inputValid'] is True and review['flows']['reportedAllPassed'] is False
              and review['flows']['notRun'] == 1)
        check('malformed_or_oversized_manual_data_is_rejected_without_execution',
              validate([])['inputValid'] is False
              and validate({'data': 'x' * 257000})['inputValid'] is False
              and page.evaluate('()=>({}).manualPolluted===undefined'))
        page.locator('#ygoManualEvidenceFile').set_input_files({'name': 'synthetic-review.json',
            'mimeType': 'application/json', 'buffer': json.dumps(fixture).encode()})
        page.wait_for_function('()=>document.getElementById("ygoManualEvidenceStatus").textContent.includes("válido")')
        check('manual_file_review_renders_uncertainty_and_preserves_the_live_deck',
              'revisión humana' in page.locator('#ygoManualEvidenceStatus').inner_text()
              and page.evaluate('()=>YGOAccessibility.lastManualReview().physicalDevicesVerifiedByAgent===false')
              and page.evaluate('()=>JSON.stringify(YGOAdvancedWorkbench.report())') == baseline)
        wrong = copy.deepcopy(fixture)
        wrong['buildId'] = '0' * 64
        page.locator('#ygoManualEvidenceFile').set_input_files({'name': 'wrong-build.json',
            'mimeType': 'application/json', 'buffer': json.dumps(wrong).encode()})
        page.wait_for_function('()=>document.getElementById("ygoManualEvidenceStatus").textContent.includes("no coincide")')
        check('manual_file_with_another_build_is_rejected_without_replacing_the_lab',
              page.evaluate('()=>YGOAccessibility.lastManualReview().inputValid===false')
              and page.evaluate('()=>JSON.stringify(YGOAdvancedWorkbench.report())') == baseline)

        # These are emulated viewports, never physical-device witnesses.
        geometry = []
        for width in [390, 320]:
            page.set_viewport_size({'width': width, 'height': 844})
            geometry.append(page.evaluate('''()=>{const panel=document.getElementById('ygoManualEvidence');
              const controls=[...panel.querySelectorAll('button,input,summary')].filter(el=>el.getClientRects().length);
              const rows=controls.map(el=>{const target=el.type==='checkbox'?el.closest('label'):el,r=target.getBoundingClientRect();
                return{id:el.id||el.tagName,height:r.height,left:r.left,right:r.right};});
              return{width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,
                controls:rows,invalid:rows.filter(r=>r.height<43.5||r.left < -1||r.right>innerWidth+1)};}'''))
        check('manual_and_preference_controls_fit_390_and_320_pixel_emulation_with_44px_targets',
              all(not row['overflow'] and not row['invalid'] for row in geometry), geometry)
        current = execute_step(page, 'NORMAL_SUMMON', sourceCard=86120751)
        check('presentation_preferences_leave_real_registered_gameplay_and_replay_intact',
              len(current['scenario']['actions']) == 1
              and current['scenario']['replay']['pass'] is True)
        page.wait_for_function('()=>!document.getElementById("ygoDuelUndo").disabled')
        check('undo_explanation_is_removed_when_a_real_step_enables_undo',
              not page.locator('#ygoA11yReason-ygoDuelUndo').is_visible()
              and not page.locator('#ygoDuelUndo').get_attribute('aria-describedby'))
        check('accessibility_tasks_raise_no_javascript_page_errors', not errors, errors)
        version = browser.version
        context.close()
        browser.close()
    check('accessibility_tasks_leave_the_compiled_html_unchanged', hashlib.sha256(artifact.read_bytes()).hexdigest() == digest)
    return {'schema': 'ygo-accessibility-r23/v1', 'pass': all(row['pass'] for row in checks),
        'buildId': build['buildId'], 'htmlSha256': digest,
        'artifactMode': 'SOURCE_DIAGNOSTIC' if diagnostic_source else 'DELIVERED_BYTES',
        'sourceInjection': diagnostic_source, 'checks': checks, 'details': details,
        'engine': 'chromium', 'engineVersion': version, 'externalRequestsBlocked': len(blocked),
        'manualFixtureScope': 'SYNTHETIC_SCHEMA_DIAGNOSTICS_NOT_DEVICE_RESULTS',
        'physicalDevicesTested': False, 'assistiveTechnologyTested': False,
        'completeAccessibilityCertified': False,
        'limitations': ['Computed opaque control text contrast does not establish every graphic, image or composite contrast.',
            'Accessibility-tree names and roles are not an actual screen-reader evaluation.',
            'Viewport and target-size checks are emulated and do not close physical-device criterion C31.',
            'Manual file selection is automated; the native OS file-picker interface is not tested.',
            'Source diagnostic mode cannot accept a delivered R23 release.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url')
    parser.add_argument('--diagnostic-source', action='store_true')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/accessibility-r23-results.json')
    args = parser.parse_args()
    started = time.monotonic()
    result = run(args.url, args.diagnostic_source)
    result['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': result['pass'], 'checks': len(result['checks']),
                      'artifactMode': result['artifactMode'],
                      'failed': [row['name'] for row in result['checks'] if not row['pass']]}))
    raise SystemExit(0 if result['pass'] else 1)

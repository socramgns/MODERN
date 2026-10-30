#!/usr/bin/env python3
"""Tasks on the delivered hypothetical-draw and data-quality interfaces."""
import argparse
import copy
import hashlib
import json
import os
from pathlib import Path
import shutil
import time

from playwright.sync_api import sync_playwright
from expanded_examples_browser import execute_step, report
from release5_browser import load_example, ready

ROOT = Path(__file__).resolve().parents[1]
BEWD, ALEISTER, INVOCATION = 89631139, 86120751, 74063034


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    delivered = artifact.read_bytes()
    digest = hashlib.sha256(delivered).hexdigest()
    assert digest == build['htmlSha256']
    target = url or 'https://ygo-release14.test/Analizador_YuGiOh.html'
    checks, details, errors, blocked = [], {}, [], []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    def hypothetical(page):
        return page.evaluate('()=>YGODrawContinuationWorkbench.report()')

    def open_details(page, selector):
        owner = page.locator(selector).locator('xpath=ancestor::details[1]')
        if owner.count() and not owner.evaluate('(el)=>el.open'):
            owner.locator('summary').first.click()

    def import_hypothesis(page, value, filename, accepted):
        page.locator('#ygoDrawContinuationImport').set_input_files({
            'name': filename, 'mimeType': 'application/json',
            'buffer': json.dumps(value).encode()})
        prefix = 'Informe hipotético verificado.' if accepted else 'No importado:'
        page.wait_for_function('prefix=>document.getElementById("ygoDrawContinuationImport").value===""&&document.getElementById("ygoDrawContinuationStatus").textContent.startsWith(prefix)',
                               arg=prefix)
        return hypothetical(page)

    def advance(page, phase):
        # The shared action helper has no phase criterion. Select the exact
        # visible phase action instead of assuming its order in enumeration.
        page.locator('#ygoDuelActionFilter').fill('DUEL_ADVANCE_PHASE')
        choice = page.evaluate('''phase=>YGOAdvancedWorkbench.actions().map((action,index)=>({action,index}))
          .find(({action})=>action.type==='DUEL_ADVANCE_PHASE'&&action.toPhase===phase)||null''', phase)
        assert choice is not None, 'Missing phase transition ' + phase
        count = len((report(page).get('scenario') or {}).get('actions', []))
        page.locator('#ygoDuelActions').select_option(str(choice['index']))
        page.locator('#ygoDuelStep').click()
        page.wait_for_function('n=>YGOAdvancedWorkbench.report().scenario?.actions.length===n', arg=count + 1)
        value = report(page)
        assert value['current']['phase'] == phase and value['scenario']['replay']['pass']
        return value

    with sync_playwright() as runtime:
        executable = os.environ.get('YGO_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
        browser = runtime.chromium.launch(executable_path=executable, headless=True, args=['--no-sandbox'])
        context = browser.new_context(accept_downloads=True, viewport={'width': 1440, 'height': 1000})

        def deliver(route):
            if route.request.url == target:
                route.fulfill(status=200, content_type='text/html; charset=utf-8', body=delivered)
            else:
                blocked.append(route.request.url)
                route.abort()

        context.route('**/*', deliver)
        context.set_offline(True)
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        response = page.goto(target, wait_until='domcontentloaded')
        ready(page)
        page.wait_for_function('()=>window.YGODrawContinuationWorkbench&&window.YGODataQuality')
        page.evaluate('async()=>{await YGODrawContinuationWorkbench.ready;await YGODataQuality.ready}')
        check('release14_uses_the_same_manifest_bound_bytes_with_network_offline',
              response is not None and hashlib.sha256(response.body()).hexdigest() == digest
              and page.evaluate('()=>navigator.onLine===false&&YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        expected_ids = ['spark', 'spirit', 'invoked', 'swordsoul', 'branded', 'tenyi', 'salamangreat',
                        'roar', 'crow', 'droll', 'field', 'trap', 'evacuation', 'shuffle']
        check('fourteen_examples_preserve_all_previous_identifiers',
              page.locator('#ygoExampleSelect').evaluate('(el)=>[...el.options].map(o=>o.value)') == expected_ids)
        try:
            initial = load_example(page, 'shuffle')
            check('shuffle_loads_without_autoplay_or_initial_goal_success',
                  initial['scenario'] is None and initial['current']['turn'] == 2
                  and initial['current']['phase'] == 'MAIN 1'
                  and initial['current']['deckOrderKnown'] == [True, True]
                  and initial['goalProgress']['achieved'] is False
                  and initial['current']['context']['opponentPolicy'] == 'PASS')
            execute_step(page, 'NORMAL_SUMMON', sourceCard=ALEISTER)
            execute_step(page, 'ALEISTER_SEARCH', selectionCard=INVOCATION)
            advance(page, 'END')
            execute_step(page, 'DUEL_NEXT_TURN')
            execute_step(page, 'DUEL_DRAW_FOR_TURN', player=1)
            advance(page, 'STANDBY')
            advance(page, 'MAIN 1')
            advance(page, 'END')
            origin = execute_step(page, 'DUEL_NEXT_TURN')
            # execute_step checks ordinary physical replay after every real step.
            check('nine_real_steps_reach_the_unknown_own_draw_without_drawing_a_card',
                  origin['current']['turn'] == 4 and origin['current']['activePlayer'] == 0
                  and origin['current']['phase'] == 'DRAW'
                  and origin['current']['deckOrderKnown'][0] is False
                  and len(origin['current']['zones'][0]['deck']) == 34
                  and len(origin['scenario']['actions']) == 9
                  and origin['scenario']['replay']['pass'] is True
                  and not page.evaluate('()=>YGOAdvancedWorkbench.actions().some(a=>a.type==="DUEL_DRAW_FOR_TURN")'))
            open_details(page, '#ygoDrawContinuationAnalyze')
            page.locator('#ygoDrawContinuationDepth').fill('0')
            page.locator('#ygoDrawContinuationStates').fill('60')
            page.locator('#ygoDrawContinuationSeconds').fill('6')
            before = report(page)
            page.locator('#ygoDrawContinuationAnalyze').click()
            page.wait_for_function('()=>!YGODrawContinuationWorkbench.isBusy&&!!YGODrawContinuationWorkbench.report()',
                                   timeout=30000)
            result = hypothetical(page)
            check('analyzing_hypotheses_preserves_the_entire_real_laboratory_report', report(page) == before)
            check('all_remaining_physical_copies_keep_their_exact_uniform_weight',
                  len(result['branches']) == 34
                  and len({row['uid'] for row in result['branches']}) == 34
                  and all(row['weight'] == {'numerator': '1', 'denominator': '34'}
                          and row['hypothesis']['observedDraw'] is False
                          and row['hypothesis']['remainingOrderKnown'] is False
                          for row in result['branches']))
            check('the_hand_goal_has_one_verified_draw_and_the_other_mass_stays_unknown',
                  result['summary']['verifiedSuccesses'] == 1
                  and result['summary']['unknown'] == 33
                  and result['summary']['verifiedFailures'] == 0
                  and result['summary']['successWeight'] == {'numerator': '1', 'denominator': '34'}
                  and result['summary']['unknownWeight'] == {'numerator': '33', 'denominator': '34'})
            success = [row for row in result['branches'] if row['status'] == 'GOAL_WITNESS'][0]
            check('the_blue_eyes_witness_is_hypothetical_and_needs_no_post_draw_action',
                  success['cardId'] == BEWD and success['witness']['actions'] == []
                  and success['witness']['replay']['pass'] is True
                  and success['witness']['after']['deckOrderKnown'][0] is False
                  and any(row['uid'] == success['uid'] for row in success['witness']['after']['zones'][0]['hand']))
            check('the_visible_result_explains_unknown_mass_and_does_not_claim_a_win_rate',
                  '33/34' in page.locator('#ygoDrawContinuationSummary').inner_text()
                  and 'no es una tasa de victoria' in page.locator('#ygoDrawContinuationResults').inner_text()
                  and page.locator('#ygoDrawContinuationBranches > li').count() == 34
                  and result['winRate'] is None and result['certified'] is False)
            check('fresh_verification_reconstructs_the_prefix_and_each_success_witness',
                  page.evaluate('value=>YGODrawContinuation.verify(value,{source:YGOAdvancedWorkbench.report()}).pass', result))
            with page.expect_download() as pending:
                page.locator('#ygoDrawContinuationExport').click()
            downloaded = pending.value
            saved_path = ROOT / 'tests/release14-hypothetical-report.json'
            downloaded.save_as(str(saved_path))
            saved = json.loads(saved_path.read_text())
            check('saving_a_hypothetical_report_downloads_the_exact_verified_result',
                  saved == result and saved['buildId'] == build['buildId']
                  and downloaded.suggested_filename.endswith('.json'))
            accepted = import_hypothesis(page, saved, 'hypothetical-replay.json', True)
            check('saved_hypotheses_reimport_without_replacing_the_real_partida',
                  accepted == result and report(page) == before)
            for name, mutate in [
                ('altered_weight', lambda value: value['branches'][0]['weight'].update(numerator='2')),
                ('altered_uid', lambda value: value['branches'][0].update(uid='invented-copy')),
                ('altered_context', lambda value: value['source']['context'].update(formatContextVersion=999)),
                ('altered_total', lambda value: value['summary'].update(verifiedSuccesses=34)),
            ]:
                forged = copy.deepcopy(saved)
                mutate(forged)
                snapshot = hypothetical(page)
                rejected = import_hypothesis(page, forged, name + '.json', False)
                check(name + '_is_rejected_transactionally', rejected == snapshot and report(page) == before)
            page.evaluate('()=>dispatchEvent(new CustomEvent("ygo-ui-state-updated"))')
            check('an_unchanged_ui_refresh_preserves_the_verified_report', hypothetical(page) == saved)
            open_details(page, '#ygoAdvancedGoal')
            page.locator('#ygoAdvancedGoal').fill(json.dumps({'requiredHandIds': [INVOCATION]}))
            page.locator('#ygoAdvancedApplyGoal').click()
            page.wait_for_function('()=>YGODrawContinuationWorkbench.report()===null')
            check('applying_a_different_goal_invalidates_only_the_hypothetical_result',
                  hypothetical(page) is None and report(page)['current'] == before['current']
                  and page.locator('#ygoDrawContinuationExport').is_disabled()
                  and page.locator('#ygoDrawContinuationResults').inner_text() == '')
            page.locator('#ygoAdvancedGoal').fill(json.dumps({'requiredHandIds': [BEWD]}))
            page.locator('#ygoAdvancedApplyGoal').click()
            page.wait_for_function('()=>YGOAdvancedWorkbench.report().goal.requiredHandIds?.[0]===89631139')
            check('restoring_the_original_goal_allows_the_saved_hypothesis_to_verify_again',
                  import_hypothesis(page, saved, 'restored-original-goal.json', True) == saved)
            page.evaluate('''()=>{const value=YGODrawContinuationWorkbench.report();value.summary.verifiedSuccesses=999;}''')
            check('the_public_report_is_detached_from_internal_panel_state', hypothetical(page) == saved)
            page.set_viewport_size({'width': 390, 'height': 844})
            check('the_hypothetical_panel_remains_readable_at_mobile_width',
                  page.evaluate('()=>document.documentElement.scrollWidth<=innerWidth'))
            page.set_viewport_size({'width': 1440, 'height': 1000})
        except Exception as error:
            check('the_visible_hypothetical_draw_workflow_completes', False, str(error))
        try:
            prior_deck = page.evaluate('()=>JSON.stringify(deckState)')
            data = page.evaluate('()=>YGODataQuality.report()')
            check('data_quality_counts_are_derived_from_the_incorporated_catalogue',
                  data['counts']['catalogueRecords'] == 21986
                  and data['counts']['unresolvedIdentities'] == 98
                  and data['counts']['unknownMonsterStats'] == 51
                  and data['counts']['migrationProposals'] == 32, data['counts'])
            open_details(page, '#ygoDataQualityExport')
            with page.expect_download() as pending:
                page.locator('#ygoDataQualityExport').click()
            download = pending.value
            path = ROOT / 'tests/release14-data-quality.json'
            download.save_as(str(path))
            exported = json.loads(path.read_text())
            check('data_quality_download_is_bound_to_the_current_build',
                  exported['buildId'] == build['buildId'] and exported['counts'] == data['counts'])
            check('data_review_and_export_do_not_migrate_or_change_the_active_deck',
                  page.evaluate('()=>JSON.stringify(deckState)') == prior_deck)
            check('the_incident_panel_limits_its_visible_page_to_fifty_rows',
                  page.locator('#ygoDataQualityRows').evaluate('(el)=>el.children.length') <= 50)
        except Exception as error:
            check('the_data_quality_interface_completes', False, str(error))
        check('release14_tasks_raise_no_javascript_page_errors', not errors, errors)
        version = browser.version
        browser.close()
    check('compiled_document_remains_unchanged_during_release14_tasks',
          hashlib.sha256(artifact.read_bytes()).hexdigest() == digest)
    return {'schema': 'ygo-release14-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': digest, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'checks': checks, 'details': details,
            'browser': {'engine': 'chromium', 'version': version}, 'externalRequestsBlocked': len(blocked),
            'limitations': ['The unknown turn draw is an explicit uniform hypothetical assumption, never an observed laboratory action.',
                            'The zero-depth visible task checks an immediate hand goal; source tests exercise registered subsequent actions.',
                            'Card-quality incidents are reported for review without applying migrations or inventing missing data.',
                            'The mobile width check is desktop emulation; competitive scoring remains provisional.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release14-browser-results.json')
    args = parser.parse_args()
    started = time.monotonic()
    value = run(args.url)
    value['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.output.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': value['pass'], 'checks': len(value['checks']),
                      'failed': [row['name'] for row in value['checks'] if not row['pass']]}, ensure_ascii=False))
    raise SystemExit(0 if value['pass'] else 1)

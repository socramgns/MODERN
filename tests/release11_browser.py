#!/usr/bin/env python3
"""Offline delivered-byte tasks for physical goal progress and initial goals."""
import argparse
import copy
import hashlib
import json
import os
from pathlib import Path
import shutil
import time

from playwright.sync_api import sync_playwright
from advanced_browser import open_details
from expanded_examples_browser import execute_step, report
from release5_browser import load_example, ready
from release8_browser import cards, undo_to

ROOT = Path(__file__).resolve().parents[1]
FACE, SET = 'requiredFaceUpSpellTrapIds', 'requiredSetSpellTrapIds'
SANCTUARY, MAUSOLEUM, ROAR = 1295111, 24382602, 51339637


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    html = artifact.read_bytes()
    html_hash = hashlib.sha256(html).hexdigest()
    assert html_hash == build['htmlSha256']
    target = url or 'https://ygo-release11.test/Analizador_YuGiOh.html'
    checks, details, errors, blocked = [], {}, [], []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    def progress(page):
        return report(page).get('goalProgress')

    def requirement(value, key, card_id=None):
        return next(row for row in value['requirements'] if row['key'] == key
                    and (card_id is None or row.get('cardId') == card_id))

    def apply_goal(page, goal):
        page.locator('#ygoAdvancedGoal').fill(json.dumps(goal))
        page.locator('#ygoAdvancedApplyGoal').click()
        page.wait_for_function('g=>JSON.stringify(YGOComboWorkbench.report().goal)===JSON.stringify(g)', arg=goal)
        page.wait_for_function('g=>JSON.stringify(YGOAdvancedWorkbench.report().goal)===JSON.stringify(g)', arg=goal)
        return progress(page)

    def advance_to_battle(page):
        page.locator('#ygoDuelActionFilter').fill('DUEL_ADVANCE_PHASE')
        choice = page.evaluate('''()=>YGOComboEngine.enumerate(YGOAdvancedWorkbench.report().current)
          .map((action,index)=>({action,index}))
          .find(({action})=>action.type==='DUEL_ADVANCE_PHASE'&&action.toPhase==='BATTLE')||null''')
        assert choice is not None, 'No registered MAIN 1 to BATTLE transition'
        page.locator('#ygoDuelActions').select_option(str(choice['index']))
        page.locator('#ygoDuelStep').click()
        page.wait_for_function('()=>YGOAdvancedWorkbench.report().current.phase==="BATTLE"')
        return report(page)

    with sync_playwright() as runtime:
        executable = os.environ.get('YGO_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
        browser = runtime.chromium.launch(executable_path=executable, headless=True, args=['--no-sandbox'])
        context = browser.new_context(accept_downloads=True, viewport={'width': 1440, 'height': 1000})

        def deliver(route):
            if route.request.url == target:
                route.fulfill(status=200, content_type='text/html; charset=utf-8', body=html)
            else:
                blocked.append(route.request.url)
                route.abort()

        context.route('**/*', deliver)
        context.set_offline(True)
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        response = page.goto(target, wait_until='domcontentloaded')
        ready(page)
        check('release11_boots_offline_from_the_manifest_bound_document', response is not None
              and hashlib.sha256(response.body()).hexdigest() == html_hash
              and page.evaluate('()=>navigator.onLine===false&&YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        try:
            widget = page.locator('#ygoDuelGoalProgress')
            check('progress_widget_is_accessible_and_does_not_claim_an_unstarted_scenario',
                  widget.count() == 1 and widget.get_attribute('role') == 'status'
                  and widget.get_attribute('aria-live') == 'polite'
                  and widget.get_attribute('data-state') == 'no-state'
                  and report(page).get('goalProgress') is None)
            initial = load_example(page, 'field')
            open_details(page, 1)
            first = initial['goalProgress']
            check('included_field_goal_reports_the_actual_missing_hand_and_face_up_copies',
                  first['schema'] == 'ygo-goal-progress/v1' and first['achieved'] is False
                  and requirement(first, FACE, SANCTUARY)['missing'] == 1
                  and requirement(first, 'requiredHandIds', ROAR)['missing'] == 1
                  and first['totals']['requiredCopies'] == 3
                  and first['totals']['matchedCopies'] == 1
                  and widget.get_attribute('data-state') == 'pending', first)
            check('board_identifies_face_up_field_and_set_spell_trap_positions',
                  'Mausoleum' in page.locator('#ygoDuelBoard').inner_text()
                  and 'boca arriba' in page.locator('#ygoDuelBoard').inner_text().lower()
                  and 'colocada' in page.locator('#ygoDuelBoard').inner_text().lower()
                  and 'campo' in page.locator('#ygoDuelBoard').inner_text().lower())
            declared_goal = {FACE: [MAUSOLEUM], SET: [ROAR], 'ownLpAtLeast': 8000, 'phase': 'MAIN 1'}
            declared = apply_goal(page, declared_goal)
            check('an_initially_met_goal_is_visible_as_declared_without_autoplay_or_a_replay_claim',
                  declared['achieved'] is True and declared['totals']['fulfilledRequirements'] == 4
                  and declared['totals']['totalRequirements'] == 4
                  and declared['totals']['matchedCopies'] == declared['totals']['requiredCopies'] == 2
                  and widget.get_attribute('data-state') == 'achieved'
                  and 'estado inicial declarado' in widget.inner_text().lower()
                  and report(page)['scenario'] is None
                  and report(page)['current']['context']['initialHistoryCertified'] is False, declared)
            duplicate = apply_goal(page, {FACE: [MAUSOLEUM, MAUSOLEUM], 'phase': 'MAIN 1'})
            duplicate_row = requirement(duplicate, FACE, MAUSOLEUM)
            check('a_visual_missing_quantity_requires_another_physical_copy',
                  duplicate['achieved'] is False and duplicate_row['required'] == 2
                  and duplicate_row['matched'] == 1 and duplicate_row['missing'] == 1
                  and 'Mausoleum' in widget.inner_text()
                  and 'falta' in widget.inner_text().lower()
                  and widget.get_attribute('data-state') == 'pending', duplicate_row)
            goal = {FACE: [SANCTUARY], SET: [ROAR], 'phase': 'MAIN 1'}
            applied = apply_goal(page, goal)
            check('applying_a_new_goal_immediately_replaces_previous_success',
                  applied['achieved'] is False and requirement(applied, FACE, SANCTUARY)['matched'] == 0
                  and requirement(applied, SET, ROAR)['matched'] == 1
                  and widget.get_attribute('data-state') == 'pending'
                  and 'Sanctuary' in widget.inner_text())

            activated = execute_step(page, 'SALAMANGREAT_ACTIVATE_SANCTUARY', sourceCard=SANCTUARY,
                                     responseType='MECHABA', responseCostCard=74063034, counterCount=1)
            after_activation = activated['goalProgress']
            check('resolved_field_progress_distinguishes_sanctuary_from_the_paid_roar',
                  after_activation['achieved'] is False
                  and requirement(after_activation, FACE, SANCTUARY)['matched'] == 1
                  and requirement(after_activation, SET, ROAR)['missing'] == 1
                  and activated['scenario']['replay']['pass'] is True
                  and 'replay' in widget.inner_text().lower()
                  and widget.get_attribute('data-state') == 'pending', after_activation)
            execute_step(page, 'SALAMANGREAT_REINCARNATE_WOLF', destination=5, responseType=None)
            recovered = execute_step(page, 'SALAMANGREAT_WOLF_RECOVER_ST', targetCard=ROAR, responseType=None)
            roar_uid = cards(recovered, 0, 'hand', ROAR)[0]['uid']
            check('progress_does_not_count_a_recovered_hand_copy_as_a_set_card',
                  recovered['goalProgress']['achieved'] is False
                  and requirement(recovered['goalProgress'], SET, ROAR)['missing'] == 1
                  and cards(recovered, 0, 'hand', ROAR)[0]['uid'] == roar_uid)
            completed = execute_step(page, 'DUEL_SET_SPELL_TRAP', sourceCard=ROAR, player=0, responseType=None)
            finished = completed['goalProgress']
            check('the_registered_set_step_completes_the_goal_with_the_same_physical_roar',
                  finished['achieved'] is True
                  and finished['totals']['fulfilledRequirements'] == finished['totals']['totalRequirements'] == 3
                  and finished['totals']['matchedCopies'] == finished['totals']['requiredCopies'] == 2
                  and cards(completed, 0, 'spelltrap', ROAR)[0]['uid'] == roar_uid
                  and completed['scenario']['replay']['pass'] is True
                  and widget.get_attribute('data-state') == 'achieved')
            with page.expect_download() as pending:
                page.locator('#ygoAdvancedExport').click()
            saved = json.loads(Path(pending.value.path()).read_text())
            check('downloaded_report_binds_derived_progress_to_goal_and_verified_state',
                  saved['goalProgress'] == finished and saved['goal'] == goal
                  and saved['buildId'] == build['buildId']
                  and saved['scenario']['replay']['pass'] is True
                  and saved['competitiveScore'] is None)

            phase_goal = {**goal, 'phase': 'BATTLE', 'turn': 2, 'activePlayer': 0,
                          'ownLpAtLeast': 8000, 'opponentLpAtMost': 8000}
            before_phase = apply_goal(page, phase_goal)
            check('state_conditions_show_expected_and_actual_phase_without_a_percentage',
                  before_phase['achieved'] is False
                  and requirement(before_phase, 'phase')['expected'] == 'BATTLE'
                  and requirement(before_phase, 'phase')['actual'] == 'MAIN 1'
                  and requirement(before_phase, 'phase')['fulfilled'] is False
                  and requirement(before_phase, 'ownLpAtLeast')['fulfilled'] is True
                  and '%' not in widget.inner_text(), before_phase)
            battle = advance_to_battle(page)
            check('a_real_phase_transition_recomputes_scalar_progress_and_preserves_replay',
                  battle['goalProgress']['achieved'] is True
                  and requirement(battle['goalProgress'], 'phase')['actual'] == 'BATTLE'
                  and battle['scenario']['replay']['pass'] is True)
            undone_phase = undo_to(page, 4)
            check('undo_reverts_the_fulfilled_phase_condition',
                  undone_phase['current']['phase'] == 'MAIN 1'
                  and undone_phase['goalProgress']['achieved'] is False
                  and requirement(undone_phase['goalProgress'], 'phase')['fulfilled'] is False)
            apply_goal(page, goal)
            undone_set = undo_to(page, 3)
            check('undo_reverts_set_progress_and_exposes_the_missing_copy_again',
                  undone_set['goalProgress']['achieved'] is False
                  and requirement(undone_set['goalProgress'], SET, ROAR)['missing'] == 1
                  and cards(undone_set, 0, 'hand', ROAR)[0]['uid'] == roar_uid
                  and widget.get_attribute('data-state') == 'pending')
            for length in [2, 1, 0]:
                undo_to(page, length)
            negated = execute_step(page, 'SALAMANGREAT_ACTIVATE_SANCTUARY', sourceCard=SANCTUARY,
                                   responseType='MECHABA', responseCostCard=74063034, counterCount=0)
            check('a_negated_field_activation_remains_missing_in_progress',
                  negated['goalProgress']['achieved'] is False
                  and requirement(negated['goalProgress'], FACE, SANCTUARY)['missing'] == 1
                  and requirement(negated['goalProgress'], SET, ROAR)['matched'] == 1
                  and cards(negated, 0, 'banished', SANCTUARY)
                  and negated['scenario']['replay']['pass'] is True)

            forged = copy.deepcopy(saved)
            forged['goalProgress'] = {'schema': 'ygo-goal-progress/v1', 'achieved': False,
                                      'requirements': [], 'totals': {'matchedCopies': 999}}
            page.locator('#ygoAdvancedImport').set_input_files({'name': 'derived-goal-progress.json',
                                                             'mimeType': 'application/json',
                                                             'buffer': json.dumps(forged).encode()})
            page.wait_for_function('()=>YGOAdvancedWorkbench.report().scenario?.actions.length===4')
            resumed = report(page)
            check('import_recomputes_progress_from_validated_goal_and_replayed_state',
                  resumed['goalProgress'] == saved['goalProgress']
                  and resumed['goalProgress'] != forged['goalProgress']
                  and resumed['goalProgress']['achieved'] is True
                  and page.evaluate('()=>YGOComboWorkbench.report().goal') == goal
                  and resumed['scenario']['replay']['pass'] is True)
            legacy = copy.deepcopy(saved)
            del legacy['goalProgress']
            page.locator('#ygoAdvancedImport').set_input_files({'name': 'report-without-derived-progress.json',
                                                             'mimeType': 'application/json',
                                                             'buffer': json.dumps(legacy).encode()})
            page.wait_for_function('()=>document.getElementById("ygoAdvancedImport").value===""')
            check('a_report_without_derived_progress_is_recomputed_compatibly',
                  report(page)['goalProgress'] == finished)
            bad = copy.deepcopy(saved)
            bad['goal'][FACE] = [87871125]
            before_bad, causal_before = report(page), page.evaluate('()=>YGOComboWorkbench.report().goal')
            page.locator('#ygoAdvancedImport').set_input_files({'name': 'invalid-goal-with-success-summary.json',
                                                             'mimeType': 'application/json',
                                                             'buffer': json.dumps(bad).encode()})
            page.wait_for_function('()=>document.getElementById("ygoAdvancedStatus").textContent.startsWith("No completado")')
            check('an_invalid_goal_cannot_replace_the_session_using_a_derived_success_summary',
                  report(page) == before_bad
                  and page.evaluate('()=>YGOComboWorkbench.report().goal') == causal_before)

            changed = apply_goal(page, {FACE: [MAUSOLEUM]})
            check('applying_another_goal_after_resume_clears_the_previous_success',
                  changed['achieved'] is False
                  and requirement(changed, FACE, MAUSOLEUM)['missing'] == 1
                  and widget.get_attribute('data-state') == 'pending')
            page.locator('#ygoDuelInitialize').click()
            page.wait_for_function('()=>YGOAdvancedWorkbench.report().scenario===null')
            restarted = report(page)
            check('reinitialization_recomputes_the_goal_from_declared_initial_copies',
                  restarted['goalProgress']['achieved'] is True
                  and cards(restarted, 0, 'spelltrap', MAUSOLEUM)
                  and 'estado inicial declarado' in widget.inner_text().lower())

            # A same-deck import must invalidate the prior laboratory. With DUEL
            # mode absent, each admitted depth-one action consumes a hand copy;
            # requiring the original five copies yields no nonempty goal line.
            scenario = page.evaluate('''()=>{
              const value=YGOScenarioExamples.get('field');delete value.setup;
              value.context={format:'tcg',opponentPolicy:'PASS',duelMode:false};
              value.goal={requiredHandIds:[...value.openingIds]};return value;
            }''')
            page.locator('#ygoCausalFile').set_input_files({'name': 'already-met-opening.json',
                                                         'mimeType': 'application/json',
                                                         'buffer': json.dumps(scenario).encode()})
            page.wait_for_function('g=>!YGOComboWorkbench.isBusy&&JSON.stringify(YGOComboWorkbench.report().goal)===JSON.stringify(g)',
                                   arg=scenario['goal'])
            check('same_deck_scenario_import_does_not_keep_old_laboratory_success',
                  report(page)['current'] is None and report(page)['goalProgress'] is None
                  and widget.get_attribute('data-state') in ['stale', 'no-state'])
            searched = page.evaluate('async()=>await YGOComboWorkbench.run({maxDepth:1,maxStates:100,maxMs:3000})')
            initial_progress = searched['initialGoalProgress']
            check('an_already_met_opening_goal_does_not_fabricate_an_empty_replay',
                  searched['pass'] is True and initial_progress['achieved'] is True
                  and initial_progress['totals']['matchedCopies'] == initial_progress['totals']['requiredCopies'] == 5
                  and searched['candidateCount'] == 0 and searched['lines'] == []
                  and page.evaluate('()=>YGOComboWorkbench.lastSearch.candidateCount') == 0, searched)
            causal_text = page.locator('#ygoCausalResults').inner_text().lower()
            check('zero_continuations_explain_the_initial_declared_success_and_search_limit',
                  'estado inicial declarado' in page.locator('#ygoCausalInitialGoalProgress').inner_text().lower()
                  and 'continuaciones' in causal_text
                  and 'no se encontró una línea completa hacia el objetivo' not in causal_text
                  and '%' not in page.locator('#ygoCausalInitialGoalProgress').inner_text())
            page.locator('#ygoDuelInitialize').click()
            page.wait_for_function('()=>YGOAdvancedWorkbench.report().current!==null')
            check('starting_the_imported_opening_recomputes_its_own_initial_goal',
                  report(page)['goalProgress']['achieved'] is True
                  and report(page)['scenario'] is None
                  and widget.get_attribute('data-state') == 'achieved')
            page.locator('#ygoCausalGoal').select_option('mechaba')
            page.wait_for_function('()=>YGOAdvancedWorkbench.report().goal.requiredFieldIds?.[0]===75286621')
            check('changing_the_causal_preset_refreshes_the_laboratory_goal_progress',
                  report(page)['goalProgress']['achieved'] is False
                  and widget.get_attribute('data-state') == 'pending'
                  and 'Mechaba' in widget.inner_text())
            page.evaluate('''()=>{
              YGOUIState.setFormatContext({format:'tcg',event:{tag:'release11-context-change'}});
              YGOUIState.sync();
            }''')
            page.wait_for_function('()=>YGOAdvancedWorkbench.report().current===null')
            check('changed_format_context_removes_old_progress_until_a_fresh_initialization',
                  report(page)['goalProgress'] is None
                  and widget.get_attribute('data-state') in ['stale', 'no-state'])
        except Exception as error:
            check('goal_progress_visible_flow_completed', False, str(error))
        check('release11_tasks_raise_no_javascript_page_errors', not errors, errors)
        version = browser.version
        browser.close()
    check('compiled_document_is_unchanged_during_release11_tasks', hashlib.sha256(artifact.read_bytes()).hexdigest() == html_hash)
    return {'schema': 'ygo-release11-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': html_hash, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'checks': checks, 'details': details,
            'browser': {'engine': 'chromium', 'version': version}, 'externalRequestsBlocked': len(blocked),
            'limitations': ['Initial goal fulfillment describes declared physical copies and state, not certified prior history.',
                            'Progress is recomputed from validated state and goals; it does not register new card effects.',
                            'No zero-action replay, win rate or competitive score is created from an initially met goal.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release11-browser-results.json')
    args = parser.parse_args()
    started = time.monotonic()
    value = run(args.url)
    value['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.output.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': value['pass'], 'checks': len(value['checks']),
                      'failed': [row['name'] for row in value['checks'] if not row['pass']]}, ensure_ascii=False))
    raise SystemExit(0 if value['pass'] else 1)

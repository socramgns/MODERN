#!/usr/bin/env python3
"""Offline delivered-byte tasks for typed physical Spell/Trap field goals."""
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
FACE = 'requiredFaceUpSpellTrapIds'
SET = 'requiredSetSpellTrapIds'
SANCTUARY, MAUSOLEUM, ROAR = 1295111, 24382602, 51339637


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    html = artifact.read_bytes()
    html_hash = hashlib.sha256(html).hexdigest()
    assert html_hash == build['htmlSha256']
    target = url or 'https://ygo-release10.test/Analizador_YuGiOh.html'
    checks, details, errors, blocked = [], {}, [], []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    def matches(page, goal):
        return page.evaluate('goal=>YGOComboWorkbench.goalMatches(YGOAdvancedWorkbench.report().current,goal)', goal)

    def apply_json(page, goal):
        page.locator('#ygoAdvancedGoal').fill(json.dumps(goal))
        page.locator('#ygoAdvancedApplyGoal').click()
        page.wait_for_function('g=>JSON.stringify(YGOComboWorkbench.report().goal)===JSON.stringify(g)', arg=goal)

    def add_visual(page, zone, card_id, quantity=1):
        page.locator('#ygoGoalZone').select_option(zone)
        page.locator('#ygoGoalCard').select_option(str(card_id))
        page.locator('#ygoGoalQuantity').fill(str(quantity))
        page.locator('#ygoGoalAddCard').click()

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
        check('release10_boots_offline_from_the_manifest_bound_document', response is not None
              and hashlib.sha256(response.body()).hexdigest() == html_hash
              and page.evaluate('()=>navigator.onLine===false&&YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        try:
            initial = load_example(page, 'field')
            open_details(page, 1)
            options = page.locator('#ygoGoalZone').evaluate('(el)=>[...el.options].map(o=>({value:o.value,label:o.textContent}))')
            check('visual_goal_selector_exposes_four_explicit_own_zones',
                  [row['value'] for row in options] == ['requiredFieldIds', 'requiredHandIds', FACE, SET]
                  and 'boca arriba' in options[0]['label'].lower()
                  and 'boca arriba' in options[2]['label'].lower()
                  and 'colocadas' in options[3]['label'].lower(), options)
            check('the_included_field_goal_now_requires_the_resolved_sanctuary',
                  initial['goal'].get(FACE) == [SANCTUARY]
                  and not matches(page, initial['goal'])
                  and matches(page, {FACE: [MAUSOLEUM], SET: [ROAR]})
                  and not matches(page, {FACE: [SANCTUARY]}))
            for zone in [FACE, SET]:
                page.locator('#ygoGoalZone').select_option(zone)
                eligible = page.locator('#ygoGoalCard').evaluate('''el=>[...el.options].every(o=>{
                  const c=YGODataCatalog.rulesCard(Number(o.value))||YGODataCatalog.lookup(Number(o.value));
                  return (Number(c.typeBits)&6)&&!(Number(c.typeBits)&0x4000)&&!(Number(c.typeBits)&0x8000000);
                })''')
                offered = page.locator('#ygoGoalCard').evaluate('(el)=>[...el.options].map(o=>Number(o.value))')
                check('typed_goal_inventory_' + zone, eligible and SANCTUARY in offered
                      and MAUSOLEUM in offered and ROAR in offered and 87871125 not in offered, offered)
            apply_json(page, {'phase': 'MAIN 1'})
            add_visual(page, FACE, SANCTUARY, 2)
            add_visual(page, SET, ROAR)
            draft_text = page.locator('#ygoGoalCards').inner_text()
            check('visual_additions_are_a_quantity_preserving_draft_until_applied',
                  '×2' in draft_text and 'colocadas' in draft_text.lower()
                  and page.evaluate('()=>YGOComboWorkbench.report().goal') == {'phase': 'MAIN 1'})
            page.locator('#ygoGoalApplyForm').click()
            duplicate_goal = {'phase': 'MAIN 1', FACE: [SANCTUARY, SANCTUARY], SET: [ROAR]}
            page.wait_for_function('()=>YGOComboWorkbench.report().goal.requiredFaceUpSpellTrapIds?.length===2')
            check('applied_visual_goals_sync_json_and_count_each_requested_copy',
                  page.evaluate('()=>YGOComboWorkbench.report().goal') == duplicate_goal
                  and json.loads(page.locator('#ygoAdvancedGoal').input_value()) == duplicate_goal
                  and not matches(page, duplicate_goal))
            page.locator('#ygoGoalCards button').first.click()
            add_visual(page, FACE, SANCTUARY)
            page.locator('#ygoGoalApplyForm').click()
            goal = {'phase': 'MAIN 1', FACE: [SANCTUARY], SET: [ROAR]}
            page.wait_for_function('()=>YGOComboWorkbench.report().goal.requiredFaceUpSpellTrapIds?.length===1')
            check('removing_and_readding_one_copy_keeps_the_other_zone_requirement',
                  page.evaluate('()=>YGOComboWorkbench.report().goal') == goal
                  and not matches(page, goal))

            resolved = execute_step(page, 'SALAMANGREAT_ACTIVATE_SANCTUARY', sourceCard=SANCTUARY,
                                    responseType='MECHABA', responseCostCard=74063034, counterCount=1)
            check('resolved_field_meets_face_up_goal_but_paid_roar_no_longer_meets_set_goal',
                  matches(page, {FACE: [SANCTUARY]}) and not matches(page, {SET: [ROAR]})
                  and not matches(page, {FACE: [SANCTUARY, SANCTUARY]})
                  and not matches(page, goal) and resolved['scenario']['replay']['pass'] is True)
            execute_step(page, 'SALAMANGREAT_REINCARNATE_WOLF', destination=5, responseType=None)
            recovered = execute_step(page, 'SALAMANGREAT_WOLF_RECOVER_ST', targetCard=ROAR, responseType=None)
            roar_uid = cards(recovered, 0, 'hand', ROAR)[0]['uid']
            check('a_recovered_hand_copy_still_does_not_satisfy_a_set_goal', not matches(page, {SET: [ROAR]})
                  and matches(page, {'requiredHandIds': [ROAR]})
                  and matches(page, {'recoveredHandIds': [ROAR]}))
            completed = execute_step(page, 'DUEL_SET_SPELL_TRAP', sourceCard=ROAR, player=0, responseType=None)
            check('a_real_set_transition_reaches_both_typed_goal_zones_with_fresh_replay',
                  matches(page, goal) and cards(completed, 0, 'spelltrap', ROAR)[0]['uid'] == roar_uid
                  and cards(completed, 0, 'spelltrap', ROAR)[0]['faceUp'] is False
                  and len(completed['scenario']['actions']) == 4 and completed['scenario']['replay']['pass'] is True
                  and completed['competitiveScore'] is None)
            with page.expect_download() as pending:
                page.locator('#ygoAdvancedExport').click()
            saved = json.loads(Path(pending.value.path()).read_text())
            check('report_download_preserves_goal_arrays_and_binds_the_verified_trace_to_this_build',
                  saved['goal'] == goal and saved['buildId'] == build['buildId']
                  and saved['scenario']['replay']['pass'] is True)
            for index in [3, 2, 1, 0]:
                undo_to(page, index)
            negated = execute_step(page, 'SALAMANGREAT_ACTIVATE_SANCTUARY', sourceCard=SANCTUARY,
                                   responseType='MECHABA', responseCostCard=74063034, counterCount=0)
            check('a_negated_field_activation_cannot_satisfy_the_face_up_goal',
                  not matches(page, {FACE: [SANCTUARY]}) and not matches(page, goal)
                  and cards(negated, 0, 'banished', SANCTUARY)
                  and negated['scenario']['replay']['pass'] is True)
            page.locator('#ygoAdvancedImport').set_input_files({'name': 'typed-field-goal.json', 'mimeType': 'application/json',
                                                             'buffer': json.dumps(saved).encode()})
            page.wait_for_function('()=>YGOAdvancedWorkbench.report().scenario?.actions.length===4')
            resumed = report(page)
            check('report_import_reconstructs_the_four_steps_and_typed_goal',
                  resumed['goal'] == goal and matches(page, goal)
                  and resumed['scenario']['replay']['pass'] is True
                  and page.evaluate('()=>YGOComboWorkbench.report().goal') == goal
                  and json.loads(page.locator('#ygoAdvancedGoal').input_value()) == goal)
            bad = copy.deepcopy(saved)
            bad['goal'][FACE] = [87871125]
            before = report(page)
            causal_goal_before = page.evaluate('()=>YGOComboWorkbench.report().goal')
            page.locator('#ygoAdvancedImport').set_input_files({'name': 'bad-typed-goal.json', 'mimeType': 'application/json',
                                                             'buffer': json.dumps(bad).encode()})
            page.wait_for_function('()=>document.getElementById("ygoAdvancedStatus").textContent.startsWith("No completado")')
            check('invalid_typed_report_goal_rejects_atomically_without_replacing_the_session', report(page) == before
                  and page.evaluate('()=>YGOComboWorkbench.report().goal') == causal_goal_before)

            # Scenario import uses the public scenario interface and its real input control.
            scenario = page.evaluate('()=>({...YGOComboWorkbench.input(),goal:{requiredFaceUpSpellTrapIds:[24382602],requiredSetSpellTrapIds:[51339637]}})')
            page.locator('#ygoCausalFile').set_input_files({'name': 'typed-scenario.json', 'mimeType': 'application/json',
                                                         'buffer': json.dumps(scenario).encode()})
            page.wait_for_function('()=>!YGOComboWorkbench.isBusy&&YGOComboWorkbench.report().goal.requiredFaceUpSpellTrapIds?.[0]===24382602')
            page.locator('#ygoDuelInitialize').click()
            page.wait_for_function('()=>YGOAdvancedWorkbench.report().current!==null&&YGOAdvancedWorkbench.report().scenario===null')
            check('scenario_import_preserves_both_arrays_and_recreates_the_declared_initial_field',
                  report(page)['goal'] == scenario['goal'] and matches(page, scenario['goal']))
            apply_json(page, {'recoveredHandIds': [SANCTUARY]})
            legacy_text = page.locator('#ygoGoalCards').inner_text()
            add_visual(page, 'requiredHandIds', SANCTUARY)
            page.locator('#ygoGoalApplyForm').click()
            page.wait_for_function('()=>YGOComboWorkbench.report().goal.requiredHandIds?.length===2')
            edited = page.evaluate('()=>YGOComboWorkbench.report().goal')
            check('legacy_hand_goal_stays_visible_and_user_edits_preserve_both_requested_copies',
                  'Sanctuary' in legacy_text and 'mano' in legacy_text.lower()
                  and edited.get('requiredHandIds') == [SANCTUARY, SANCTUARY]
                  and 'recoveredHandIds' not in edited and not matches(page, edited))
        except Exception as error:
            check('typed_goal_visible_flow_completed', False, str(error))
        check('release10_tasks_raise_no_javascript_page_errors', not errors, errors)
        version = browser.version
        browser.close()
    check('compiled_document_is_unchanged_during_release10_tasks', hashlib.sha256(artifact.read_bytes()).hexdigest() == html_hash)
    return {'schema': 'ygo-release10-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': html_hash, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'checks': checks, 'details': details,
            'browser': {'engine': 'chromium', 'version': version}, 'externalRequestsBlocked': len(blocked),
            'limitations': ['Starting fields and prior summon history remain declared assumptions.',
                            'Typed goals describe own physical zones and do not register new card effects.',
                            'Recorded replay and goal checks do not certify competitive results.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release10-browser-results.json')
    args = parser.parse_args()
    started = time.monotonic()
    value = run(args.url)
    value['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.output.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': value['pass'], 'checks': len(value['checks']),
                      'failed': [row['name'] for row in value['checks'] if not row['pass']]}, ensure_ascii=False))
    raise SystemExit(0 if value['pass'] else 1)

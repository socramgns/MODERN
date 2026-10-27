#!/usr/bin/env python3
"""Delivered-byte laboratory tasks: visual goals, physical setup and keyboard UI."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import time

from playwright.sync_api import sync_playwright

from advanced_browser import fixtures, open_details, ready

ROOT = Path(__file__).resolve().parents[1]


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    html = artifact.read_bytes()
    html_hash = hashlib.sha256(html).hexdigest()
    target = url or 'https://ygo-ux-delivery.test/Analizador_YuGiOh.html'
    invoked, _, opponent = fixtures()
    checks, details, errors = [], {}, []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    with sync_playwright() as pw:
        executable = os.environ.get('YGO_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
        browser = pw.chromium.launch(executable_path=executable, headless=True, args=['--no-sandbox'])
        context = browser.new_context(accept_downloads=True, viewport={'width': 1440, 'height': 1000})
        context.route('**/*', lambda route: route.fulfill(status=200, content_type='text/html; charset=utf-8', body=html)
                      if route.request.url == target else route.abort())
        context.set_offline(True)
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        response = page.goto(target, wait_until='domcontentloaded')
        ready(page)
        check('exact_delivered_bytes_boot_offline', response is not None
              and hashlib.sha256(response.body()).hexdigest() == html_hash
              and html_hash == build['htmlSha256'] and page.evaluate('()=>navigator.onLine===false'))
        page.evaluate('async value=>await YGOComboWorkbench.loadScenario(value)', invoked)
        page.evaluate('async value=>await YGOComboWorkbench.loadOpponent(value)', opponent)
        page.locator('#ygoCausalPolicy').select_option('PASS')

        try:
            open_details(page, 1)
            page.locator('#ygoAdvancedGoal').fill(json.dumps({'requiredFieldIds': [], 'phase': 'MAIN 1'}))
            page.locator('#ygoAdvancedApplyGoal').click()
            page.wait_for_function('YGOComboWorkbench.report().goal.phase==="MAIN 1"')
            page.locator('#ygoGoalZone').select_option('requiredHandIds')
            page.locator('#ygoGoalCard').select_option('86120751')
            page.locator('#ygoGoalQuantity').fill('2')
            page.locator('#ygoGoalAddCard').click()
            page.wait_for_function('document.getElementById("ygoGoalCards").textContent.includes("×2")')
            check('visual_goal_keeps_repeated_physical_card_requirement',
                  'Aleister' in page.locator('#ygoGoalCards').inner_text()
                  and page.evaluate('()=>YGOComboWorkbench.report().goal.requiredHandIds===undefined'))
            page.locator('#ygoGoalOwnLp').fill('4000')
            page.locator('#ygoGoalOpponentLp').fill('6000')
            page.locator('#ygoGoalTurn').fill('2')
            page.locator('#ygoGoalPhase').select_option('MAIN 2')
            page.locator('#ygoGoalPlayer').select_option('0')
            page.locator('#ygoGoalApplyForm').focus()
            page.keyboard.press('Enter')
            page.wait_for_function('YGOComboWorkbench.report().goal.phase==="MAIN 2"')
            goal = {'requiredFieldIds': [], 'requiredHandIds': [86120751, 86120751],
                    'ownLpAtLeast': 4000, 'opponentLpAtMost': 6000,
                    'turn': 2, 'phase': 'MAIN 2', 'activePlayer': 0}
            check('keyboard_enter_applies_visual_goal_and_syncs_json',
                  page.evaluate('()=>YGOComboWorkbench.report().goal') == goal
                  and json.loads(page.locator('#ygoAdvancedGoal').input_value()) == goal)
            page.locator('#ygoGoalQuantity').fill('0')
            page.locator('#ygoGoalAddCard').click()
            page.wait_for_function('document.getElementById("ygoAdvancedStatus").textContent.startsWith("No completado")')
            check('invalid_goal_quantity_preserves_applied_goal_and_focuses_error',
                  page.evaluate('()=>YGOComboWorkbench.report().goal') == goal
                  and page.locator('#ygoAdvancedStatus').evaluate('(el)=>el===document.activeElement'))
            page.locator('#ygoGoalQuantity').fill('1')
            hand_goal = {'requiredHandIds': [86120751]}
            page.locator('#ygoAdvancedGoal').fill(json.dumps(hand_goal))
            page.locator('#ygoAdvancedApplyGoal').click()
            page.wait_for_function('YGOComboWorkbench.report().goal.requiredHandIds?.length===1')
            check('hand_only_json_goal_is_supported_and_visual_conditions_reset',
                  page.evaluate('()=>YGOComboWorkbench.report().goal') == hand_goal
                  and page.locator('#ygoGoalPhase').input_value() == ''
                  and page.locator('#ygoGoalOwnLp').input_value() == '')
            rejected = page.evaluate('''()=>{
              const saved=JSON.stringify(YGOComboWorkbench.report().goal),goals=[
                {ownLpAtLeast:'4000'},{opponentLpAtMost:-1},{turn:1.5},{turn:101},
                {activePlayer:2},{phase:'DAMAGE STEP'},{requiredHandIds:[-1]},
                {requiredFieldIds:['86120751']},{unexpected:true},{}
              ];return goals.every(goal=>{try{YGOComboWorkbench.setGoal(goal);return false}catch(_){return JSON.stringify(YGOComboWorkbench.report().goal)===saved}});
            }''')
            check('goal_validation_rejects_unknown_fields_types_cards_and_empty_goals_transactionally', rejected)
            alias_match = page.evaluate('''()=>{
              const input=YGOComboWorkbench.input(),st=YGOComboEngine.createState(input);
              return YGOComboWorkbench.goalMatches(st,{requiredHandIds:[86120752]})
                && !YGOComboWorkbench.goalMatches(st,{requiredHandIds:[86120751,86120752]});
            }''')
            check('goal_alias_matching_preserves_family_identity_and_physical_quantity', alias_match)
            labels = page.locator('#ygoAdvancedWorkbench').evaluate('''panel=>[...panel.querySelectorAll('input,select,textarea')]
              .filter(el=>!el.hidden&&el.type!=='hidden')
              .every(el=>el.labels?.length||el.getAttribute('aria-label')||el.getAttribute('aria-labelledby'))''')
            check('laboratory_inputs_have_programmatic_labels', labels)
            page.locator('#ygoGoalQuantity').focus()
            page.keyboard.press('Tab')
            check('keyboard_tab_reaches_add_card_button',
                  page.locator('#ygoGoalAddCard').evaluate('(el)=>el===document.activeElement'))
        except Exception as error:
            check('visual_goal_flow_completed', False, str(error))

        try:
            open_details(page, 0)
            page.locator('#ygoDuelTurn').fill('2')
            page.locator('#ygoDuelPlayer').select_option('0')
            page.locator('#ygoDuelPhase').select_option('MAIN 1')
            page.locator('#ygoDuelClearPlacements').click()
            page.locator('#ygoDuelSetupOwner').select_option('0')
            page.locator('#ygoDuelSetupZone').select_option('spelltrap')
            page.locator('#ygoDuelSetupCard').select_option('deck:74063034')
            page.locator('#ygoDuelSetupColumn').select_option(label='3 · centro')
            assert page.locator('#ygoDuelSetupColumn').input_value() == '2'
            page.locator('#ygoDuelSetupSetTurn').fill('1')
            page.locator('#ygoDuelSetupPosition').select_option('SET')
            page.locator('#ygoDuelAddPlacement').click()
            page.wait_for_function('document.getElementById("ygoDuelSetupList").querySelectorAll("button").length===1')
            check('spell_setup_can_use_explicit_column_and_prior_set_turn',
                  'Invocation' in page.locator('#ygoDuelSetupList').inner_text()
                  and 'Mágicas/Trampas' in page.locator('#ygoDuelSetupList').inner_text())
            page.locator('#ygoDuelSetupCard').select_option('deck:74063034')
            page.locator('#ygoDuelAddPlacement').click()
            page.wait_for_function('document.getElementById("ygoAdvancedStatus").textContent.includes("ya está ocupada")')
            check('occupied_spell_column_rejects_without_adding_a_copy',
                  page.locator('#ygoDuelSetupList button').count() == 1)
            page.locator('#ygoDuelSetupZone').select_option('gy')
            page.locator('#ygoDuelSetupCard').select_option('deck:74063034')
            page.locator('#ygoDuelAddPlacement').click()
            page.wait_for_function('document.getElementById("ygoDuelSetupList").querySelectorAll("button").length===2')
            page.locator('#ygoDuelApplySetup').click()
            page.wait_for_function('YGOAdvancedWorkbench.report().current?.turn===2')
            state = page.evaluate('()=>YGOAdvancedWorkbench.report().current')
            placements = state['provenance']['setup']['placements']
            selected = state['zones'][0]['spelltrap'][0]
            total = sum(len(zone) for zone in state['zones'][0].values())
            expected_total = sum(row['qty'] for key in ['main', 'extra', 'side'] for row in invoked['deck'][key])
            check('setup_resolves_distinct_real_uids_without_changing_inventory',
                  len(placements) == 2 and len({row['uid'] for row in placements}) == 2
                  and selected['uid'] == placements[0]['uid'] and selected['zoneIndex'] == 2
                  and selected['setTurn'] == 1 and selected['faceUp'] is False
                  and any(row['uid'] == placements[1]['uid'] for row in state['zones'][0]['gy'])
                  and total == expected_total and state['context']['initialHistoryCertified'] is False,
                  {'placements': placements, 'spell': selected, 'total': total,
                   'expectedTotal': expected_total, 'gy': state['zones'][0]['gy'],
                   'history': state['context'].get('initialHistoryCertified')})
            page.locator('#ygoDuelActionFilter').fill('pasar')
            check('action_filter_retains_real_indices_and_readable_labels',
                  page.locator('#ygoDuelActions option').count() > 0
                  and 'acciones coinciden' in page.locator('#ygoDuelActionCount').inner_text()
                  and all('Pasar' in text and '_' not in text
                          for text in page.locator('#ygoDuelActions option').all_inner_texts()))
            page.locator('#ygoDuelActionFilter').fill('no existe esa acción')
            check('empty_action_filter_disables_execution',
                  page.locator('#ygoDuelActions option').count() == 0
                  and page.locator('#ygoDuelStep').is_disabled())
            page.locator('#ygoDuelActionFilter').fill('')
            if page.locator('#ygoDrawReport').count():
                page.locator('#ygoDrawUncertainty').evaluate('(el)=>el.open=true')
                page.locator('#ygoDrawReport').click()
                page.wait_for_function('document.getElementById("ygoDrawResults").textContent.length>0')
                page.locator('#ygoDuelInitialize').click()
                page.wait_for_function('document.getElementById("ygoDrawResults").textContent.length===0')
                check('reinitializing_lab_invalidates_visible_draw_distribution', True)
        except Exception as error:
            check('physical_setup_and_filter_flow_completed', False, str(error))

        try:
            # An isolated synthetic handler creates >500 distinguishable choices
            # to test pagination/index preservation, not a new Yu-Gi-Oh rule.
            page.evaluate('''()=>YGOComboEngine.registerHandler({type:'TEST_UX_SELECTION',scope:'DUEL',
              enumerate:st=>Array.from({length:1101},(_,selectionIndex)=>({type:'TEST_UX_SELECTION',player:0,selectionIndex})),
              apply:(st,a)=>{st.lp[0]=8000-a.selectionIndex;return{events:[{type:'TEST_UI_SELECTION',index:a.selectionIndex}]}}})''')
            page.locator('#ygoDuelInitialize').click()
            page.wait_for_function('document.getElementById("ygoDuelActionPage").options.length>=3')
            check('large_action_inventory_exposes_all_pages_and_count',
                  page.locator('#ygoDuelActionPage option').count() >= 3
                  and page.locator('#ygoDuelActions option').count() == 500
                  and str(page.evaluate('()=>YGOAdvancedWorkbench.actions().length'))
                  in page.locator('#ygoDuelActionCount').inner_text())
            selected_index = page.evaluate('()=>YGOAdvancedWorkbench.actions().findIndex(a=>a.type==="TEST_UX_SELECTION"&&a.selectionIndex===1100)')
            page.locator('#ygoDuelActionPage').select_option('2')
            page.locator('#ygoDuelActions').select_option(str(selected_index))
            page.locator('#ygoDuelStep').click()
            page.wait_for_function('YGOAdvancedWorkbench.report().scenario?.actions.at(-1).selectionIndex===1100')
            value = page.evaluate('()=>YGOAdvancedWorkbench.report()')
            check('third_action_page_executes_original_choice_and_replays',
                  value['current']['lp'][0] == 6900 and value['scenario']['replay']['pass']
                  and any(event.get('type') == 'TEST_UI_SELECTION' and event.get('index') == 1100
                          for event in value['scenario']['actions'][-1]['events']))
        except Exception as error:
            check('large_action_pagination_flow_completed', False, str(error))

        check('no_uncaught_page_errors', not errors, errors)
        context.close()
        mobile = browser.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True)
        mobile.route('**/*', lambda route: route.fulfill(status=200, content_type='text/html; charset=utf-8', body=html)
                     if route.request.url == target else route.abort())
        mobile.set_offline(True)
        touch = mobile.new_page()
        touch.goto(target, wait_until='domcontentloaded')
        ready(touch)
        touch.evaluate('async value=>await YGOComboWorkbench.loadScenario(value)', invoked)
        open_details(touch, 1)
        touch.locator('#ygoGoalOpponentLp').fill('7000')
        touch.locator('#ygoGoalApplyForm').tap()
        touch.wait_for_function('YGOComboWorkbench.report().goal.opponentLpAtMost===7000')
        check('touch_task_applies_visual_goal_without_laboratory_overflow',
              touch.locator('#ygoGoalApplyForm').is_visible()
              and touch.locator('#ygoAdvancedWorkbench').evaluate('(el)=>el.scrollWidth<=el.clientWidth+1'))
        mobile.close()
        browser.close()

    check('tested_artifact_unchanged', hashlib.sha256(artifact.read_bytes()).hexdigest() == html_hash)
    return {'schema': 'ygo-revision6-ux-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': html_hash, 'artifactMode': 'DELIVERED_BYTES',
            'checks': checks, 'details': details,
            'limitations': ['Keyboard/touch tasks do not certify complete accessibility or real mobile devices.',
                            'The synthetic pagination handler tests UI choice identity only, not card-rule correctness.',
                            'Prior field history remains explicitly declared.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/ux-revision6-browser-results.json')
    args = parser.parse_args()
    started = time.monotonic()
    result = run(args.url)
    result['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': result['pass'], 'checks': len(result['checks']),
                      'failed': [row['name'] for row in result['checks'] if not row['pass']],
                      'seconds': result['elapsedSeconds']}))
    raise SystemExit(0 if result['pass'] else 1)

#!/usr/bin/env python3
"""Delivered-byte UI witnesses for declared attack budgets, physical attacks and replay."""
import argparse
import copy
import hashlib
import json
import os
from pathlib import Path
import shutil
import time

from playwright.sync_api import sync_playwright
from blue_eyes_browser import import_scenario
from expanded_examples_browser import report
from release5_browser import load_example, ready
from release8_browser import cards, undo_to

ROOT = Path(__file__).resolve().parents[1]
HAYABUSA, CYBER_TWIN, FISH, IMPERM = 21015833, 74157028, 23771716, 10045474


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    document = artifact.read_bytes()
    digest = hashlib.sha256(document).hexdigest()
    assert digest == build['htmlSha256']
    target = url or 'https://ygo-release21.test/Analizador_YuGiOh.html'
    checks, details, errors, blocked = [], {}, [], []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    def actions(page, kind):
        return page.evaluate('kind=>YGOAdvancedWorkbench.actions().filter(a=>a.type===kind)', kind)

    def budget(page, uid):
        return page.evaluate('uid=>YGODuelPhases.attackBudget(YGOAdvancedWorkbench.report().current,uid)', uid)

    def step(page, kind, **criteria):
        page.locator('#ygoDuelActionFilter').fill(kind)
        chosen = page.evaluate('''({kind,criteria})=>YGOAdvancedWorkbench.actions().map((action,index)=>({action,index}))
          .find(({action:a})=>a.type===kind&&Object.entries(criteria).every(([key,value])=>{
            if(key==='noResponse')return !a.response&&!a.responseUid&&!(a.counterResponses||[]).length;
            return JSON.stringify(a[key])===JSON.stringify(value);
          }))||null''', {'kind': kind, 'criteria': criteria})
        assert chosen is not None, 'No rendered action: ' + kind + ' ' + str(criteria)
        option = page.locator('#ygoDuelActions option[value="' + str(chosen['index']) + '"]')
        if option.count() == 0:
            visible_page = page.evaluate('''({kind,index})=>Math.floor(YGOAdvancedWorkbench.actions().map((a,i)=>({a,i}))
                  .filter(({a})=>a.type.toLowerCase().includes(kind.toLowerCase())).findIndex(row=>row.i===index)/500)''',
                                         {'kind': kind, 'index': chosen['index']})
            page.locator('#ygoDuelActionPage').select_option(str(visible_page))
        label = option.inner_text()
        previous = len((report(page).get('scenario') or {}).get('actions', []))
        page.locator('#ygoDuelActions').select_option(str(chosen['index']))
        page.locator('#ygoDuelStep').click()
        page.wait_for_function('n=>YGOAdvancedWorkbench.report().scenario?.actions.length===n', arg=previous + 1)
        value = report(page)
        assert value['scenario']['replay']['pass'] is True
        assert value['scenario']['actions'][-1]['type'] == kind
        return value, label

    def import_report(page, value, accepted, name):
        page.locator('#ygoAdvancedImport').set_input_files({
            'name': name, 'mimeType': 'application/json', 'buffer': json.dumps(value).encode()})
        prefix = 'Informe reanudado:' if accepted else 'No completado:'
        page.wait_for_function('prefix=>document.getElementById("ygoAdvancedImport").value===""&&document.getElementById("ygoAdvancedStatus").textContent.startsWith(prefix)', arg=prefix)
        return report(page)

    def export_report(page, filename):
        with page.expect_download() as pending:
            page.locator('#ygoAdvancedExport').click()
        value = json.loads(Path(pending.value.path()).read_text())
        (ROOT / 'tests' / filename).write_text(json.dumps(value, ensure_ascii=False) + '\n')
        return value

    with sync_playwright() as runtime:
        executable = os.environ.get('YGO_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
        browser = runtime.chromium.launch(executable_path=executable, headless=True, args=['--no-sandbox'])
        context = browser.new_context(accept_downloads=True, viewport={'width': 1440, 'height': 1000})

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
        check('release21_runs_the_manifest_bound_document_without_network', response is not None
              and hashlib.sha256(response.body()).hexdigest() == digest
              and page.evaluate('()=>navigator.onLine===false&&YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        expected_ids = ['spark', 'spirit', 'invoked', 'swordsoul', 'branded', 'tenyi', 'salamangreat',
                        'roar', 'crow', 'droll', 'field', 'trap', 'evacuation', 'shuffle', 'reborn',
                        'synchro', 'azure', 'spirit-reborn', 'wolf-reborn', 'albaz', 'hayabusa', 'faith-flip']
        check('twenty_one_visible_examples_preserve_all_twenty_previous_identifiers',
              page.locator('#ygoExampleSelect').evaluate('(el)=>[...el.options].map(o=>o.value)') == expected_ids)
        try:
            initial = load_example(page, 'hayabusa')
            uid = cards(initial, 0, 'hand', HAYABUSA)[0]['uid']
            check('hayabusa_starts_in_a_physical_five_card_hand_without_autoplay_or_prior_history',
                  initial['scenario'] is None and initial['current']['turn'] == 2
                  and initial['current']['phase'] == 'MAIN 1' and initial['current']['activePlayer'] == 0
                  and len(initial['current']['zones'][0]['hand']) == 5
                  and initial['current']['zones'][0]['monster'] == []
                  and initial['current']['context']['initialHistoryCertified'] is False
                  and initial['goalProgress']['achieved'] is False)
            guide = page.locator('#ygoExampleInstructions').inner_text()
            check('the_visible_guide_explains_second_attack_negation_spent_declarations_and_scope',
                  'efecto continuo' in guide and 'No se ofrece un tercer ataque' in guide
                  and 'sin borrar las declaraciones' in guide and 'no acredita una Invocación por Fusión' in guide
                  and 'cuatro acciones' in guide and 'provisional' in guide)
            summoned, _ = step(page, 'DUEL_NORMAL_SUMMON_OR_SET', sourceUid=uid, position='ATTACK', player=0, noResponse=True)
            check('a_real_normal_summon_consumes_the_summon_and_conserves_the_same_copy',
                  cards(summoned, 0, 'monster', HAYABUSA)[0]['uid'] == uid
                  and cards(summoned, 0, 'monster', HAYABUSA)[0]['summonType'] == 'NORMAL'
                  and summoned['current']['normalSummonAvailable'][0] is False)
            coverage = page.evaluate('()=>YGOCardCoverage.report().entries.find(x=>x.id===21015833)')
            check('hayabusa_action_inventory_names_the_registered_normal_summon_and_continuous_attack',
                  coverage is not None and coverage['completeCardRules'] is False
                  and {a['id'] for a in coverage['actions']} == {'DUEL_NORMAL_SUMMON_OR_SET', 'DUEL_ATTACK'}
                  and all(a['registration'] == 'BATTLE_PROFILE' for a in coverage['actions']))
            check('the_board_shows_an_unspent_two_attack_budget', budget(page, uid)['limit'] == 2
                  and budget(page, uid)['spent'] == 0 and budget(page, uid)['remaining'] == 2
                  and 'ataques declarados 0/2' in page.locator('#ygoDuelBoard').inner_text())
            entered, _ = step(page, 'DUEL_ADVANCE_PHASE', toPhase='BATTLE', player=0)
            check('the_second_turn_legally_enters_battle_with_a_fresh_budget',
                  entered['current']['phase'] == 'BATTLE' and len(actions(page, 'DUEL_ATTACK')) == 1)
            first, first_label = step(page, 'DUEL_ATTACK', player=0, attackerUid=uid, targetUid=None)
            check('the_first_direct_attack_pays_one_declaration_and_causes_printed_damage',
                  first['current']['lp'] == [8000, 7000] and budget(page, uid)['spent'] == 1
                  and budget(page, uid)['remaining'] == 1 and first['current']['duel']['attacked'][uid] == 2
                  and 'ataque 1 de 2' in first_label)
            check('the_same_copy_offers_one_second_attack_and_the_board_labels_the_remaining_budget',
                  len(actions(page, 'DUEL_ATTACK')) == 1 and actions(page, 'DUEL_ATTACK')[0]['attackerUid'] == uid
                  and 'ataques declarados 1/2' in page.locator('#ygoDuelBoard').inner_text()
                  and 'restantes 1' in page.locator('#ygoDuelBoard').inner_text())
            saved_first = export_report(page, 'release21-first-attack-report.json')
            final, second_label = step(page, 'DUEL_ATTACK', player=0, attackerUid=uid, targetUid=None)
            check('the_second_direct_attack_spends_the_second_declaration_without_creating_a_third',
                  final['current']['lp'] == [8000, 6000] and budget(page, uid)['spent'] == 2
                  and budget(page, uid)['remaining'] == 0 and actions(page, 'DUEL_ATTACK') == []
                  and 'ataque 2 de 2' in second_label)
            check('four_visible_actions_achieve_the_goal_with_a_replayed_same_copy',
                  final['goalProgress']['achieved'] is True and len(final['scenario']['actions']) == 4
                  and final['scenario']['replay']['pass'] is True and final['competitiveScore'] is None
                  and cards(final, 0, 'monster', HAYABUSA)[0]['uid'] == uid
                  and final['certified'] is False)
            saved_final = export_report(page, 'release21-final-report.json')
            check('download_binds_delivered_build_goal_attack_history_and_actual_lp',
                  saved_final['buildId'] == build['buildId'] and saved_final['current'] == final['current']
                  and saved_final['scenario']['replay']['pass'] is True and saved_final['goalProgress']['achieved'] is True)
            undone = undo_to(page, 3)
            check('undo_restores_exactly_one_spent_attack_and_the_opponents_previous_lp',
                  undone['current'] == first['current'] and budget(page, uid)['spent'] == 1
                  and budget(page, uid)['remaining'] == 1 and undone['goalProgress']['achieved'] is False)
            imported = import_report(page, saved_final, True, 'hayabusa-final.json')
            check('import_reexecutes_all_actions_and_restores_the_exhausted_budget',
                  imported['current'] == final['current'] and len(imported['scenario']['actions']) == 4
                  and imported['goalProgress']['achieved'] is True and actions(page, 'DUEL_ATTACK') == [])
            restored_first = import_report(page, saved_first, True, 'hayabusa-first.json')
            check('import_of_the_first_attack_preserves_the_one_remaining_legal_declaration',
                  restored_first['current'] == first['current'] and budget(page, uid)['remaining'] == 1
                  and restored_first['scenario']['replay']['pass'] is True)
            import_report(page, saved_final, True, 'hayabusa-final-again.json')
            baseline = report(page)
            forged_reports = []
            forged = copy.deepcopy(saved_final)
            forged['scenario']['actions'].append(copy.deepcopy(forged['scenario']['actions'][-1]))
            forged_reports.append(('a_third_attack_appended_to_an_exhausted_trace', forged))
            forged = copy.deepcopy(saved_final)
            forged['scenario']['actions'][-1]['attackerUid'] = 'forged-physical-copy'
            forged_reports.append(('a_nonexistent_attacker_copy', forged))
            forged = copy.deepcopy(saved_final)
            forged['scenario']['actions'][-1]['player'] = 1
            forged_reports.append(('an_attack_by_the_inactive_player', forged))
            forged = copy.deepcopy(saved_final)
            forged['scenario']['actions'][-1]['targetUid'] = 'forged-target'
            forged_reports.append(('an_invented_battle_target', forged))
            forged = copy.deepcopy(saved_final)
            forged['current']['lp'][1] = 5000
            forged['scenario']['after']['lp'][1] = 5000
            forged['scenario']['state']['lp'][1] = 5000
            forged_reports.append(('damage_beyond_two_physical_attacks', forged))
            forged = copy.deepcopy(saved_final)
            forged['current']['zones'][0]['monster'][0]['effectsNegated'] = True
            forged['scenario']['after']['zones'][0]['monster'][0]['effectsNegated'] = True
            forged['scenario']['state']['zones'][0]['monster'][0]['effectsNegated'] = True
            forged_reports.append(('negation_invented_without_a_registered_transition', forged))
            forged = copy.deepcopy(saved_final)
            for state in [forged['current'], forged['scenario']['after'], forged['scenario']['state']]:
                state['duel']['attackDeclarations'][uid]['count'] = 1
            forged_reports.append(('a_refunded_attack_without_undoing_its_transition', forged))
            for name, forged in forged_reports:
                rejected = import_report(page, forged, False, 'forged-' + name + '.json')
                check('report_import_rejects_' + name + '_without_replacing_the_lab',
                      rejected['current'] == baseline['current']
                      and rejected['scenario'] == baseline['scenario'] and actions(page, 'DUEL_ATTACK') == [])
            phase2, _ = step(page, 'DUEL_ADVANCE_PHASE', toPhase='MAIN 2', player=0)
            check('a_monster_that_attacked_twice_cannot_change_position_manually',
                  phase2['current']['phase'] == 'MAIN 2'
                  and not any(a.get('sourceUid') == uid for a in actions(page, 'DUEL_CHANGE_POSITION')))
            # Start the ordinary visible search from the example's original inputs.
            page.locator('#ygoCausalStart').click()
            page.wait_for_function('()=>!YGOComboWorkbench.isBusy&&YGOComboWorkbench.lastSearch!==null', timeout=30000)
            search = page.evaluate('()=>{const r=YGOComboWorkbench.lastSearch;return {pass:r.pass,lines:r.lines.map(l=>({types:l.actions.map(a=>a.type),attacks:l.actions.filter(a=>a.type==="DUEL_ATTACK").length,replay:YGOComboEngine.replay(l,{deck:deckState}).pass,goal:YGOComboWorkbench.goalMatches(l.after,YGOScenarioExamples.get("hayabusa").goal)}))}}')
            check('visible_search_finds_and_replays_a_line_with_two_attacks_by_the_same_monster',
                  bool(search['lines']) and all(row['replay'] and row['goal'] for row in search['lines'])
                  and any(row['attacks'] == 2 for row in search['lines']), search)
            page.locator('#ygoDuelFromLine').click()
            page.wait_for_function('()=>YGOAdvancedWorkbench.report().goalProgress?.achieved===true')
            continued = report(page)
            live = cards(continued, 0, 'monster', HAYABUSA)[0]['uid']
            check('continuing_a_verified_search_line_preserves_the_two_spent_attacks',
                  continued['scenario']['replay']['pass'] is True
                  and budget(page, live)['spent'] == 2 and actions(page, 'DUEL_ATTACK') == [])
            page.set_viewport_size({'width': 390, 'height': 844})
            check('the_emulated_mobile_board_exposes_spent_attack_budget_and_goal',
                  page.locator('#ygoDuelBoard').is_visible()
                  and 'ataques declarados 2/2' in page.locator('#ygoDuelBoard').inner_text()
                  and page.locator('#ygoDuelGoalProgress').get_attribute('data-state') == 'achieved')
            page.set_viewport_size({'width': 1440, 'height': 1000})
        except Exception as error:
            check('the_visible_hayabusa_two_attack_route_completes', False, str(error))
        try:
            spec = page.evaluate('()=>YGOScenarioExamples.get("hayabusa")')
            spec['deck']['extra'] = [{'id': CYBER_TWIN, 'qty': 1}]
            spec['setup'] = {'turn': 2, 'activePlayer': 0, 'phase': 'BATTLE', 'placements': [
                {'player': 0, 'from': 'extra', 'cardId': CYBER_TWIN, 'zone': 'monster',
                 'position': 'ATTACK', 'faceUp': True, 'summonTurn': 1},
                {'player': 1, 'from': 'deck', 'cardId': FISH, 'zone': 'monster', 'zoneIndex': 0,
                 'position': 'ATTACK', 'faceUp': True, 'summonTurn': 1},
                {'player': 1, 'from': 'deck', 'cardId': FISH, 'zone': 'monster', 'zoneIndex': 1,
                 'position': 'ATTACK', 'faceUp': True, 'summonTurn': 1},
            ]}
            spec['goal'] = {'requiredFieldIds': [CYBER_TWIN], 'opponentLpAtMost': 6000, 'phase': 'BATTLE'}
            import_scenario(page, spec)
            initial = report(page)
            twin = cards(initial, 0, 'monster', CYBER_TWIN)[0]
            targets = cards(initial, 1, 'monster', FISH)
            check('cyber_twin_import_uses_a_declared_field_without_certifying_prior_fusion',
                  twin['summonType'] == 'DECLARED_STARTING_FIELD' and twin['properlySummoned'] is False
                  and initial['current']['extraHistory'] == [] and budget(page, twin['uid'])['limit'] == 2)
            coverage = page.evaluate('()=>YGOCardCoverage.report().entries.find(x=>x.id===74157028)')
            check('cyber_twin_action_inventory_declares_only_its_partial_continuous_battle_profile',
                  coverage is not None and coverage['completeCardRules'] is False
                  and len(coverage['actions']) == 1 and coverage['actions'][0]['id'] == 'DUEL_ATTACK'
                  and coverage['actions'][0]['registration'] == 'BATTLE_PROFILE'
                  and any('no añade su receta' in note for note in coverage['notes']))
            first, _ = step(page, 'DUEL_ATTACK', player=0, attackerUid=twin['uid'], targetUid=targets[0]['uid'])
            check('cyber_twin_first_attack_sends_the_first_physical_rival_to_its_owners_grave',
                  first['current']['lp'] == [8000, 7000]
                  and cards(first, 1, 'gy', FISH)[0]['uid'] == targets[0]['uid']
                  and cards(first, 1, 'gy', FISH)[0]['ownerPlayer'] == 1
                  and len(cards(first, 1, 'monster', FISH)) == 1 and budget(page, twin['uid'])['remaining'] == 1)
            final, label = step(page, 'DUEL_ATTACK', player=0, attackerUid=twin['uid'], targetUid=targets[1]['uid'])
            check('cyber_twin_second_attack_targets_the_other_copy_and_exhausts_its_budget',
                  final['current']['lp'] == [8000, 6000] and len(cards(final, 1, 'gy', FISH)) == 2
                  and {row['uid'] for row in cards(final, 1, 'gy', FISH)} == {row['uid'] for row in targets}
                  and final['current']['zones'][1]['monster'] == [] and budget(page, twin['uid'])['spent'] == 2
                  and actions(page, 'DUEL_ATTACK') == [] and 'ataque 2 de 2' in label)
            check('both_monster_attacks_replay_without_fabricating_fusion_history',
                  final['goalProgress']['achieved'] is True and final['scenario']['replay']['pass'] is True
                  and len(final['scenario']['actions']) == 2 and final['current']['extraHistory'] == []
                  and cards(final, 0, 'monster', CYBER_TWIN)[0]['properlySummoned'] is False)
        except Exception as error:
            check('the_visible_cyber_twin_two_target_route_completes', False, str(error))
        try:
            spec = page.evaluate('()=>YGOScenarioExamples.get("hayabusa")')
            for row in spec['opponentDeck']['main']:
                if row['id'] == 89631139:
                    row['qty'] -= 1
                    break
            spec['opponentDeck']['main'].append({'id': IMPERM, 'qty': 1})
            spec['opponentOpeningIds'][0] = IMPERM
            remaining = [row['id'] for row in spec['opponentDeck']['main'] for _ in range(row['qty'])]
            for card_id in spec['opponentOpeningIds']:
                remaining.remove(card_id)
            spec['opponentRemainingDeckIds'] = remaining
            spec['context'].update({'opponentPolicy': 'RESPONSES_EXPLICIT', 'responseTypes': ['IMPERM'], 'responsePolicy': 'CHOICE_BRANCHES'})
            import_scenario(page, spec)
            initial = report(page)
            uid = cards(initial, 0, 'hand', HAYABUSA)[0]['uid']
            imperm = cards(initial, 1, 'hand', IMPERM)[0]['uid']
            step(page, 'DUEL_NORMAL_SUMMON_OR_SET', sourceUid=uid, position='ATTACK', player=0, noResponse=True)
            step(page, 'DUEL_ADVANCE_PHASE', toPhase='BATTLE', player=0)
            step(page, 'DUEL_ATTACK', player=0, attackerUid=uid, targetUid=None)
            before = export_report(page, 'release21-before-negation-report.json')
            negated, _ = step(page, 'ACTIVATE_INFINITE_IMPERMANENCE', player=1, sourceUid=imperm, targetUid=uid, noResponse=True)
            check('a_real_opposing_impermanence_negates_hayabusa_after_its_first_attack',
                  cards(negated, 1, 'gy', IMPERM)[0]['uid'] == imperm
                  and cards(negated, 0, 'monster', HAYABUSA)[0]['effectsNegated'] is True
                  and negated['current']['lp'] == [8000, 7000])
            check('negation_reduces_the_limit_without_refunding_the_spent_declaration',
                  budget(page, uid)['limit'] == 1 and budget(page, uid)['spent'] == 1
                  and budget(page, uid)['remaining'] == 0 and actions(page, 'DUEL_ATTACK') == []
                  and 'ataques declarados 1/1' in page.locator('#ygoDuelBoard').inner_text())
            check('negation_and_battle_history_replay_from_the_real_hand_copy',
                  negated['scenario']['replay']['pass'] is True and len(negated['scenario']['actions']) == 4
                  and negated['goalProgress']['achieved'] is False and negated['competitiveScore'] is None)
            restored = import_report(page, before, True, 'before-negation.json')
            check('resuming_before_negation_restores_the_opponents_hand_and_one_remaining_attack',
                  restored['current'] == before['current'] and cards(restored, 1, 'hand', IMPERM)[0]['uid'] == imperm
                  and budget(page, uid)['remaining'] == 1 and len(actions(page, 'DUEL_ATTACK')) == 1)
            after_second, _ = step(page, 'DUEL_ATTACK', player=0, attackerUid=uid, targetUid=None)
            negated_late, _ = step(page, 'ACTIVATE_INFINITE_IMPERMANENCE', player=1, sourceUid=imperm, targetUid=uid, noResponse=True)
            check('negation_after_two_attacks_keeps_both_declarations_spent_even_above_the_new_limit',
                  budget(page, uid)['limit'] == 1 and budget(page, uid)['spent'] == 2
                  and budget(page, uid)['remaining'] == 0 and negated_late['current']['lp'] == [8000, 6000]
                  and actions(page, 'DUEL_ATTACK') == [] and negated_late['scenario']['replay']['pass'] is True)
        except Exception as error:
            check('the_visible_physical_negation_budget_route_completes', False, str(error))
        check('release21_raises_no_javascript_page_errors', not errors, errors)
        version = browser.version
        browser.close()
    check('release21_leaves_the_compiled_artifact_unchanged', hashlib.sha256(artifact.read_bytes()).hexdigest() == digest)
    return {'schema': 'ygo-release21-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': digest, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'checks': checks, 'details': details,
            'browser': {'engine': 'chromium', 'version': version}, 'externalRequestsBlocked': len(blocked),
            'limitations': ['Only Hayabusa Knight and Cyber Twin Dragon have a reviewed continuous second-attack profile; other attack patterns are not inferred.',
                            'The built-in guide executes a real Normal Summon and two direct attacks; the separate Cyber Twin field is a declared assumption without prior Fusion proof.',
                            'Impermanence uses a physical opponent hand copy and a registered activation; general battle priority and Damage Step chains remain outside scope.',
                            'Mobile width is emulated; physical devices, full accessibility and competitive calibration remain unverified.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release21-browser-results.json')
    args = parser.parse_args()
    start = time.monotonic()
    result = run(args.url)
    result['elapsedSeconds'] = round(time.monotonic() - start, 2)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': result['pass'], 'checks': len(result['checks']),
                      'failed': [row['name'] for row in result['checks'] if not row['pass']]}))
    raise SystemExit(0 if result['pass'] else 1)

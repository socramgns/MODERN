#!/usr/bin/env python3
"""Delivered-byte tasks for a witnessed Spark Synchro, revival and protection."""
import argparse
import copy
import hashlib
import json
import os
from pathlib import Path
import shutil
import time

from playwright.sync_api import sync_playwright
from expanded_examples_browser import report
from release5_browser import load_example, ready
from release8_browser import cards, undo_to

ROOT = Path(__file__).resolve().parents[1]
SYNCHRO = 'SYNCHRO_STARDUST_SPARK_DRAGON'
SPARK, GUARD, MAGICIAN, REBORN, BEWD = 83994433, 21615956, 46986414, 83764718, 89631139


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    document = artifact.read_bytes()
    digest = hashlib.sha256(document).hexdigest()
    assert digest == build['htmlSha256']
    target = url or 'https://ygo-release16.test/Analizador_YuGiOh.html'
    checks, details, errors, blocked = [], {}, [], []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    def step(page, kind, **criteria):
        page.locator('#ygoDuelActionFilter').fill(kind)
        chosen = page.evaluate('''({kind,criteria})=>YGOAdvancedWorkbench.actions().map((action,index)=>({action,index}))
          .find(({action:a})=>a.type===kind&&Object.entries(criteria).every(([key,value])=>{
            if(key==='noResponse')return !a.response&&!a.responseUid&&!(a.counterResponses||[]).length;
            return JSON.stringify(a[key])===JSON.stringify(value);
          }))||null''', {'kind': kind, 'criteria': criteria})
        assert chosen is not None, 'No rendered action: ' + kind + ' ' + str(criteria)
        option = page.locator('#ygoDuelActions option[value="' + str(chosen['index']) + '"]')
        label = option.inner_text()
        previous = len((report(page).get('scenario') or {}).get('actions', []))
        page.locator('#ygoDuelActions').select_option(str(chosen['index']))
        page.locator('#ygoDuelStep').click()
        page.wait_for_function('n=>YGOAdvancedWorkbench.report().scenario?.actions.length===n', arg=previous + 1)
        value = report(page)
        assert value['scenario']['replay']['pass'] is True
        assert value['scenario']['actions'][-1]['type'] == kind
        for key, expected in criteria.items():
            if key != 'noResponse':
                assert value['scenario']['actions'][-1].get(key) == expected
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
        page.wait_for_function('()=>window.YGOStardustSynchro&&YGOComboEngine.capabilities().handlers.includes("SYNCHRO_STARDUST_SPARK_DRAGON")')
        check('release16_runs_the_manifest_bound_document_without_network', response is not None
              and hashlib.sha256(response.body()).hexdigest() == digest
              and page.evaluate('()=>navigator.onLine===false&&YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        expected_ids = ['spark', 'spirit', 'invoked', 'swordsoul', 'branded', 'tenyi', 'salamangreat',
                        'roar', 'crow', 'droll', 'field', 'trap', 'evacuation', 'shuffle', 'reborn', 'synchro']
        check('sixteen_visible_examples_preserve_all_fifteen_previous_identifiers',
              page.locator('#ygoExampleSelect').evaluate('(el)=>[...el.options].map(o=>o.value)') == expected_ids)
        registry = page.evaluate('()=>YGOComboEngine.capabilities()')
        check('spark_adds_a_summon_without_widening_spell_or_trap_activation_registries',
              SYNCHRO in registry['handlers'] and len(registry['normalSpellActivations']) == 4
              and len(registry['fieldSpellActivations']) == 2 and len(registry['normalTrapActivations']) == 2)
        try:
            initial = load_example(page, 'synchro')
            guard = cards(initial, 0, 'hand', GUARD)[0]['uid']
            magician = cards(initial, 0, 'monster', MAGICIAN)[0]['uid']
            spark = cards(initial, 0, 'extra', SPARK)[0]['uid']
            reborn = cards(initial, 0, 'hand', REBORN)[0]['uid']
            rivals = [row['uid'] for row in cards(initial, 1, 'monster', BEWD)]
            check('the_example_starts_with_declared_materials_and_no_autoplay',
                  initial['scenario'] is None and initial['current']['turn'] == 2
                  and initial['current']['activePlayer'] == 0 and initial['current']['phase'] == 'MAIN 1'
                  and len(initial['current']['zones'][0]['hand']) == 5 and len(rivals) == 2
                  and initial['goalProgress']['achieved'] is False)
            check('the_extra_copy_has_no_claim_of_a_previous_proper_summon',
                  cards(initial, 0, 'extra', SPARK)[0].get('properSummonType') is None
                  and cards(initial, 0, 'extra', SPARK)[0].get('properlySummoned') is not True
                  and initial['current']['context']['initialHistoryCertified'] is False)
            check('monster_reborn_does_not_offer_an_unwitnessed_extra_copy',
                  not page.evaluate('uid=>YGOAdvancedWorkbench.actions().some(a=>a.type==="ACTIVATE_MONSTER_REBORN"&&a.targetUid===uid)', spark))
            normal, _ = step(page, 'NORMAL_SUMMON', sourceUid=guard, noResponse=True)
            check('the_normal_tuner_is_summoned_from_the_hand_and_spends_the_normal_summon',
                  cards(normal, 0, 'monster', GUARD)[0]['uid'] == guard
                  and cards(normal, 0, 'monster', GUARD)[0]['summonType'] == 'NORMAL'
                  and normal['current']['normalSummonAvailable'][0] is False
                  and normal['current']['pendingTriggers'] == [])
            summoned, label = step(page, SYNCHRO, sourceUid=spark, materialUids=[guard, magician],
                                   destination=0, position='ATTACK', noResponse=True)
            action = summoned['scenario']['actions'][-1]
            live = cards(summoned, 0, 'monster', SPARK)[0]
            check('the_visible_synchro_choice_names_both_materials_position_and_destination',
                  'Invocar por Synchro a Stardust Spark Dragon' in label
                  and 'Flamvell Guard' in label and 'Dark Magician' in label
                  and 'zona principal 1' in label and 'de Ataque' in label)
            check('a_successful_synchro_creates_the_actual_proper_history',
                  live['uid'] == spark and live['summonType'] == 'SYNCHRO'
                  and live['properlySummoned'] is True and live['properSummonType'] == 'SYNCHRO'
                  and live['zoneIndex'] == 0 and live['position'] == 'ATTACK')
            check('the_two_real_material_copies_are_sent_to_their_graveyard',
                  cards(summoned, 0, 'gy', GUARD)[0]['uid'] == guard
                  and cards(summoned, 0, 'gy', MAGICIAN)[0]['uid'] == magician
                  and {row['uid'] for row in action['paid']} == {guard, magician}
                  and all(row['kind'] == 'SYNCHRO_MATERIAL' and row['to'] == 'gy' for row in action['paid']))
            check('the_summon_records_no_card_activation_or_response_and_no_extra_normal_summon',
                  action['proof']['normalSpellActivation'] is None
                  and action['proof']['normalTrapActivation'] is None
                  and action['proof']['responseType'] is None
                  and not action.get('response') and not action.get('responseUid')
                  and summoned['current']['extraHistory'] == ['SYNCHRO']
                  and summoned['current']['normalSummonAvailable'][0] is False)
            check('the_main_two_goal_does_not_claim_success_for_an_earlier_synchro',
                  summoned['goalProgress']['achieved'] is False
                  and page.locator('#ygoDuelGoalProgress').get_attribute('data-state') != 'achieved')
            step(page, 'DUEL_ADVANCE_PHASE', toPhase='BATTLE', player=0)
            lost, _ = step(page, 'DUEL_ATTACK', player=0, attackerUid=spark, targetUid=rivals[0])
            check('the_first_real_battle_destroys_spark_and_pays_five_hundred_life_points',
                  lost['current']['lp'] == [7500, 8000] and not cards(lost, 0, 'monster', SPARK)
                  and cards(lost, 0, 'gy', SPARK)[0]['uid'] == spark
                  and all(row['uid'] in rivals for row in cards(lost, 1, 'monster', BEWD)))
            grave = cards(lost, 0, 'gy', SPARK)[0]
            check('the_physical_graveyard_copy_retains_its_witnessed_synchro_qualification',
                  grave['properlySummoned'] is True and grave['properSummonType'] == 'SYNCHRO'
                  and grave.get('sparkProtection') is None)
            main_two, _ = step(page, 'DUEL_ADVANCE_PHASE', toPhase='MAIN 2', player=0)
            check('the_goal_is_still_false_when_main_two_starts_without_spark',
                  main_two['goalProgress']['achieved'] is False
                  and page.evaluate('uid=>YGOAdvancedWorkbench.actions().some(a=>a.type==="ACTIVATE_MONSTER_REBORN"&&a.targetUid===uid)', spark))
            revived, _ = step(page, 'ACTIVATE_MONSTER_REBORN', sourceUid=reborn, targetUid=spark,
                              destination=0, position='ATTACK', noResponse=True)
            returned = cards(revived, 0, 'monster', SPARK)[0]
            check('monster_reborn_revives_the_same_copy_as_special_and_keeps_only_its_prior_qualification',
                  returned['uid'] == spark and returned['ownerPlayer'] == 0
                  and returned['summonType'] == 'SPECIAL' and returned['properSummonType'] == 'SYNCHRO'
                  and returned['properlySummoned'] is True and returned.get('sparkProtection') is None)
            check('the_spell_goes_to_graveyard_without_repaying_materials_or_adding_an_extra_summon',
                  cards(revived, 0, 'gy', REBORN)[0]['uid'] == reborn
                  and cards(revived, 0, 'gy', GUARD)[0]['uid'] == guard
                  and cards(revived, 0, 'gy', MAGICIAN)[0]['uid'] == magician
                  and revived['current']['extraHistory'] == ['SYNCHRO']
                  and revived['current']['normalSummonAvailable'][0] is False)
            check('the_revived_spark_satisfies_the_visible_main_two_goal',
                  revived['goalProgress']['achieved'] is True
                  and page.locator('#ygoDuelGoalProgress').get_attribute('data-state') == 'achieved'
                  and revived['current']['lp'] == [7500, 8000])
            step(page, 'DUEL_ADVANCE_PHASE', toPhase='END', player=0)
            next_turn, _ = step(page, 'DUEL_NEXT_TURN', player=0, nextPlayer=1)
            check('the_turn_boundary_creates_no_undeclared_protection_or_free_draw',
                  next_turn['current']['turn'] == 3 and next_turn['current']['activePlayer'] == 1
                  and next_turn['current']['phase'] == 'DRAW'
                  and cards(next_turn, 0, 'monster', SPARK)[0].get('sparkProtection') is None
                  and next_turn['current']['duel']['drawCompleted'].get('3') is not True)
            draw_uid = next_turn['current']['zones'][1]['deck'][0]['uid']
            drawn, _ = step(page, 'DUEL_DRAW_FOR_TURN', player=1, sourceUid=draw_uid)
            check('the_rival_draw_uses_the_next_known_physical_copy',
                  drawn['current']['duel']['drawCompleted']['3'] is True
                  and any(row['uid'] == draw_uid for row in drawn['current']['zones'][1]['hand'])
                  and len(drawn['current']['zones'][1]['deck']) == len(next_turn['current']['zones'][1]['deck']) - 1)
            protected, _ = step(page, 'STARDUST_SPARK_PROTECTION', player=0, sourceUid=spark, targetUid=spark,
                                noResponse=True)
            shield = cards(protected, 0, 'monster', SPARK)[0]['sparkProtection']
            check('the_protection_is_activated_on_the_rival_turn_after_the_actual_draw',
                  shield['turn'] == 3 and shield['sourceUid'] == spark and shield['targetUid'] == spark
                  and shield['remaining'] == 1 and protected['current']['activePlayer'] == 1
                  and protected['current']['phase'] == 'DRAW' and protected['current']['lp'] == [7500, 8000])
            check('the_once_per_turn_protection_budget_is_spent_without_preventing_battle_damage',
                  protected['current']['used']['SPARK_PROTECT:' + spark] is True
                  and not page.evaluate('uid=>YGOAdvancedWorkbench.actions().some(a=>a.type==="STARDUST_SPARK_PROTECTION"&&a.sourceUid===uid)', spark)
                  and any(event['type'] == 'SPARK_PROTECTION_APPLIED' and event['battleDamagePrevented'] is False
                          for event in protected['scenario']['actions'][-1]['events']))
            saved_protection = export_report(page, 'release16-protected-report.json')
            check('the_downloaded_protection_report_binds_build_materials_history_and_turn',
                  saved_protection['buildId'] == build['buildId']
                  and len(saved_protection['scenario']['actions']) == 10
                  and saved_protection['scenario']['actions'][1]['materialUids'] == [guard, magician]
                  and cards(saved_protection, 0, 'monster', SPARK)[0]['sparkProtection']['turn'] == 3
                  and saved_protection['scenario']['replay']['pass'] is True)
            step(page, 'DUEL_ADVANCE_PHASE', toPhase='STANDBY', player=1)
            step(page, 'DUEL_ADVANCE_PHASE', toPhase='MAIN 1', player=1)
            battle, _ = step(page, 'DUEL_ADVANCE_PHASE', toPhase='BATTLE', player=1)
            check('the_registered_phase_path_keeps_the_current_turn_protection_available',
                  battle['current']['phase'] == 'BATTLE' and battle['current']['turn'] == 3
                  and cards(battle, 0, 'monster', SPARK)[0]['sparkProtection']['remaining'] == 1)
            first, _ = step(page, 'DUEL_ATTACK', player=1, attackerUid=rivals[0], targetUid=spark)
            check('the_first_rival_attack_spends_one_shield_but_still_deals_damage',
                  first['current']['lp'] == [7000, 8000]
                  and cards(first, 0, 'monster', SPARK)[0]['sparkProtection']['remaining'] == 0
                  and any(event['type'] == 'SPARK_DESTRUCTION_PREVENTED'
                          for event in first['scenario']['actions'][-1]['events']))
            final, _ = step(page, 'DUEL_ATTACK', player=1, attackerUid=rivals[1], targetUid=spark)
            check('the_second_physical_attacker_destroys_spark_without_another_free_charge',
                  final['current']['lp'] == [6500, 8000] and not cards(final, 0, 'monster', SPARK)
                  and cards(final, 0, 'gy', SPARK)[0]['uid'] == spark
                  and cards(final, 0, 'gy', SPARK)[0].get('sparkProtection') is None)
            check('the_entire_fifteen_action_route_replays_without_global_or_competitive_certification',
                  len(final['scenario']['actions']) == 15 and final['scenario']['replay']['pass'] is True
                  and final['goalProgress']['achieved'] is False and final['competitiveScore'] is None
                  and final['certified'] is False and final['scenario']['globalOptimalityProven'] is False)
            saved_final = export_report(page, 'release16-final-report.json')
            check('the_final_download_preserves_the_two_distinct_attackers_and_qualified_graveyard_copy',
                  saved_final['scenario']['actions'][-2]['attackerUid'] != saved_final['scenario']['actions'][-1]['attackerUid']
                  and saved_final['current'] == final['current']
                  and cards(saved_final, 0, 'gy', SPARK)[0]['properSummonType'] == 'SYNCHRO')
            undone_second = undo_to(page, 14)
            check('undoing_the_second_attack_restores_the_spent_shield_and_correct_damage',
                  undone_second['current']['lp'] == [7000, 8000]
                  and cards(undone_second, 0, 'monster', SPARK)[0]['sparkProtection']['remaining'] == 0)
            undone_first = undo_to(page, 13)
            check('undoing_the_first_attack_restores_the_one_available_charge',
                  undone_first['current']['lp'] == [7500, 8000]
                  and cards(undone_first, 0, 'monster', SPARK)[0]['sparkProtection']['remaining'] == 1
                  and undone_first['scenario']['replay']['pass'] is True)
            imported_protection = import_report(page, saved_protection, True, 'spark-protected-route.json')
            check('importing_the_saved_protection_reconstructs_its_history_and_single_charge',
                  imported_protection['current'] == saved_protection['current']
                  and len(imported_protection['scenario']['actions']) == 10
                  and imported_protection['scenario']['replay']['pass'] is True)
            imported_final = import_report(page, saved_final, True, 'spark-final-route.json')
            check('importing_the_final_route_replays_all_fifteen_actions',
                  imported_final['current'] == saved_final['current']
                  and len(imported_final['scenario']['actions']) == 15
                  and imported_final['scenario']['replay']['pass'] is True)
            before_bad = report(page)
            for name in ['materials', 'history', 'payment']:
                forged = copy.deepcopy(saved_final)
                action = forged['scenario']['actions'][1]
                if name == 'materials':
                    action['materialUids'][1] = action['materialUids'][0]
                elif name == 'history':
                    next(row for row in action['after']['zones'][0]['monster'] if row['uid'] == spark)['properSummonType'] = 'FUSION'
                else:
                    action['paid'][0]['to'] = 'banished'
                rejected = import_report(page, forged, False, 'forged-spark-' + name + '.json')
                check('an_altered_' + name + '_is_rejected_without_replacing_the_active_route', rejected == before_bad)
            imported_protection = import_report(page, saved_protection, True, 'spark-mobile-protection.json')
            page.set_viewport_size({'width': 390, 'height': 844})
            measurements = page.locator('#ygoAdvancedWorkbench').evaluate('''el=>{
              const r=el.getBoundingClientRect(),select=document.getElementById('ygoDuelActions'),button=document.getElementById('ygoDuelStep');
              return{left:r.left,right:r.right,selectHeight:select.getBoundingClientRect().height,
                buttonHeight:button.getBoundingClientRect().height,width:innerWidth};}''')
            check('the_synchro_route_remains_readable_at_mobile_width_without_changing_state',
                  measurements['left'] >= -1 and measurements['right'] <= measurements['width'] + 1
                  and measurements['selectHeight'] >= 44 and measurements['buttonHeight'] >= 44
                  and report(page) == imported_protection, measurements)
            page.set_viewport_size({'width': 1440, 'height': 1000})
        except Exception as error:
            check('the_visible_synchro_revival_protection_guide_completes', False, str(error))
        check('release16_raises_no_javascript_page_errors', not errors, errors)
        version = browser.version
        browser.close()
    check('release16_leaves_the_compiled_artifact_unchanged', hashlib.sha256(artifact.read_bytes()).hexdigest() == digest)
    return {'schema': 'ygo-release16-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': digest, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'checks': checks, 'details': details,
            'browser': {'engine': 'chromium', 'version': version}, 'externalRequestsBlocked': len(blocked),
            'limitations': ['The initial Dark Magician and rival fields are declared, while the Spark Synchro, materials, graveyard departure and revival are executed and replayed.',
                            'The protection is activated after the rival turn draw; no previous-turn shield is carried across a turn boundary.',
                            'These tasks cover the registered physical route, not arbitrary Synchro procedures, priority or all card effects.',
                            'Mobile width is emulated; competitive scoring remains provisional.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release16-browser-results.json')
    args = parser.parse_args()
    start = time.monotonic()
    result = run(args.url)
    result['elapsedSeconds'] = round(time.monotonic() - start, 2)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': result['pass'], 'checks': len(result['checks']),
                      'failed': [row['name'] for row in result['checks'] if not row['pass']]}))
    raise SystemExit(0 if result['pass'] else 1)

#!/usr/bin/env python3
"""Delivered-byte tasks for a witnessed Azure-Eyes Synchro, mandatory protection and Standby revival."""
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
SYNCHRO = 'SYNCHRO_AZURE_EYES_SILVER_DRAGON'
AZURE, GUARD, REBORN, BEWD = 40908371, 21615956, 83764718, 89631139


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    document = artifact.read_bytes()
    digest = hashlib.sha256(document).hexdigest()
    assert digest == build['htmlSha256']
    target = url or 'https://ygo-release17.test/Analizador_YuGiOh.html'
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
        page.wait_for_function('()=>YGOComboEngine.capabilities().handlers.includes("SYNCHRO_AZURE_EYES_SILVER_DRAGON")')
        check('release17_runs_the_manifest_bound_document_without_network', response is not None
              and hashlib.sha256(response.body()).hexdigest() == digest
              and page.evaluate('()=>navigator.onLine===false&&YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        expected_ids = ['spark', 'spirit', 'invoked', 'swordsoul', 'branded', 'tenyi', 'salamangreat',
                        'roar', 'crow', 'droll', 'field', 'trap', 'evacuation', 'shuffle', 'reborn', 'synchro', 'azure', 'spirit-reborn', 'wolf-reborn']
        check('nineteen_visible_examples_preserve_all_eighteen_previous_identifiers',
              page.locator('#ygoExampleSelect').evaluate('(el)=>[...el.options].map(o=>o.value)') == expected_ids)
        registry = page.evaluate('()=>YGOComboEngine.capabilities()')
        check('azure_adds_a_summon_without_widening_spell_or_trap_activation_registries',
              SYNCHRO in registry['handlers'] and len(registry['normalSpellActivations']) == 4
              and len(registry['fieldSpellActivations']) == 2 and len(registry['normalTrapActivations']) == 2)
        try:
            initial = load_example(page, 'azure')
            guard = cards(initial, 0, 'hand', GUARD)[0]['uid']
            blue = cards(initial, 0, 'monster', BEWD)[0]['uid']
            azure = cards(initial, 0, 'extra', AZURE)[0]['uid']
            reborn = cards(initial, 0, 'hand', REBORN)[0]['uid']
            rival = cards(initial, 1, 'monster', BEWD)[0]['uid']
            check('the_example_starts_with_declared_materials_and_no_autoplay',
                  initial['scenario'] is None and initial['current']['turn'] == 2
                  and initial['current']['activePlayer'] == 0 and initial['current']['phase'] == 'MAIN 1'
                  and len(initial['current']['zones'][0]['hand']) == 5
                  and initial['goalProgress']['achieved'] is False)
            check('the_extra_copy_and_starting_field_do_not_claim_witnessed_summon_history',
                  cards(initial, 0, 'extra', AZURE)[0].get('properSummonType') is None
                  and cards(initial, 0, 'extra', AZURE)[0].get('properlySummoned') is not True
                  and initial['current']['context']['initialHistoryCertified'] is False
                  and initial['current']['pendingTriggers'] == [])
            check('monster_reborn_does_not_offer_the_unwitnessed_extra_copy',
                  not page.evaluate('uid=>YGOAdvancedWorkbench.actions().some(a=>a.type==="ACTIVATE_MONSTER_REBORN"&&a.targetUid===uid)', azure))
            normal, _ = step(page, 'NORMAL_SUMMON', sourceUid=guard, noResponse=True)
            check('the_normal_tuner_uses_the_real_hand_copy_and_normal_summon',
                  cards(normal, 0, 'monster', GUARD)[0]['uid'] == guard
                  and cards(normal, 0, 'monster', GUARD)[0]['summonType'] == 'NORMAL'
                  and normal['current']['normalSummonAvailable'][0] is False)
            summoned, label = step(page, SYNCHRO, sourceUid=azure, materialUids=[guard, blue],
                                   destination=0, position='ATTACK', noResponse=True)
            action = summoned['scenario']['actions'][-1]
            live = cards(summoned, 0, 'monster', AZURE)[0]
            check('the_visible_synchro_choice_names_materials_position_and_destination',
                  'Invocar por Synchro a Azure-Eyes Silver Dragon' in label
                  and 'Flamvell Guard' in label and 'Blue-Eyes White Dragon' in label
                  and 'zona principal 1' in label and 'de Ataque' in label)
            check('the_successful_synchro_creates_its_own_proper_history_and_extra_origin',
                  live['uid'] == azure and live['summonType'] == 'SYNCHRO'
                  and live['properlySummoned'] is True and live['properSummonType'] == 'SYNCHRO'
                  and live['summonOriginZone'] == 'extra' and live['zoneIndex'] == 0)
            check('both_distinct_physical_materials_reach_their_owners_graveyard',
                  cards(summoned, 0, 'gy', GUARD)[0]['uid'] == guard
                  and cards(summoned, 0, 'gy', BEWD)[0]['uid'] == blue
                  and {row['uid'] for row in action['paid']} == {guard, blue}
                  and all(row['kind'] == 'SYNCHRO_MATERIAL' and row['to'] == 'gy' for row in action['paid']))
            check('the_procedure_is_not_a_card_activation_or_response',
                  action['proof']['normalSpellActivation'] is None
                  and action['proof']['normalTrapActivation'] is None
                  and action['proof']['responseType'] is None
                  and summoned['current']['extraHistory'] == ['SYNCHRO'])
            check('one_mandatory_protection_trigger_blocks_unrelated_steps',
                  len(summoned['current']['pendingTriggers']) == 1
                  and summoned['current']['pendingTriggers'][0]['kind'] == 'AZURE_PROTECTION'
                  and summoned['current']['pendingTriggers'][0]['mandatory'] is True
                  and page.evaluate('()=>YGOAdvancedWorkbench.actions().every(a=>a.type==="AZURE_EYES_PROTECTION")'))
            protected, _ = step(page, 'AZURE_EYES_PROTECTION', player=0, sourceUid=azure, noResponse=True)
            shield = cards(protected, 0, 'monster', AZURE)[0]
            check('protection_resolves_through_the_end_of_the_next_turn',
                  protected['current']['pendingTriggers'] == []
                  and shield['effectTargetImmuneUntilTurn'] == 3
                  and shield['effectDestructionImmuneUntilTurn'] == 3)
            check('protection_is_a_snapshot_of_current_own_dragons',
                  cards(protected, 1, 'monster', BEWD)[0].get('effectTargetImmuneUntilTurn') is None
                  and cards(protected, 0, 'gy', BEWD)[0].get('effectTargetImmuneUntilTurn') is None
                  and any(event['type'] == 'AZURE_DRAGON_PROTECTION_APPLIED'
                          and event['affectedUids'] == [azure]
                          for event in protected['scenario']['actions'][-1]['events']))
            saved_first = export_report(page, 'release17-first-protection-report.json')
            check('the_first_download_binds_materials_mandatory_trigger_and_build',
                  len(saved_first['scenario']['actions']) == 3 and saved_first['buildId'] == build['buildId']
                  and saved_first['scenario']['actions'][1]['materialUids'] == [guard, blue]
                  and saved_first['scenario']['replay']['pass'] is True)
            step(page, 'DUEL_ADVANCE_PHASE', toPhase='BATTLE', player=0)
            lost, _ = step(page, 'DUEL_ATTACK', player=0, attackerUid=azure, targetUid=rival)
            check('battle_still_destroys_azure_and_deals_five_hundred_damage',
                  lost['current']['lp'] == [7500, 8000] and not cards(lost, 0, 'monster', AZURE)
                  and cards(lost, 0, 'gy', AZURE)[0]['uid'] == azure
                  and cards(lost, 1, 'monster', BEWD)[0]['uid'] == rival)
            grave = cards(lost, 0, 'gy', AZURE)[0]
            check('departure_clears_field_protection_but_retains_proper_synchro_qualification',
                  grave['properlySummoned'] is True and grave['properSummonType'] == 'SYNCHRO'
                  and grave.get('effectTargetImmuneUntilTurn') is None
                  and grave.get('effectDestructionImmuneUntilTurn') is None
                  and grave.get('summonOriginZone') is None)
            step(page, 'DUEL_ADVANCE_PHASE', toPhase='MAIN 2', player=0)
            revived, _ = step(page, 'ACTIVATE_MONSTER_REBORN', sourceUid=reborn, targetUid=azure,
                              destination=0, position='ATTACK', noResponse=True)
            returned = cards(revived, 0, 'monster', AZURE)[0]
            check('monster_reborn_revives_the_same_qualified_copy_with_a_new_graveyard_origin',
                  returned['uid'] == azure and returned['ownerPlayer'] == 0
                  and returned['summonType'] == 'SPECIAL' and returned['summonOriginZone'] == 'gy'
                  and returned['properSummonType'] == 'SYNCHRO' and returned['properlySummoned'] is True)
            check('revival_does_not_restore_a_field_shield_or_charge_materials_again',
                  returned.get('effectTargetImmuneUntilTurn') is None
                  and returned.get('effectDestructionImmuneUntilTurn') is None
                  and cards(revived, 0, 'gy', REBORN)[0]['uid'] == reborn
                  and cards(revived, 0, 'gy', BEWD)[0]['uid'] == blue
                  and revived['current']['extraHistory'] == ['SYNCHRO']
                  and revived['current']['normalSummonAvailable'][0] is False)
            check('revival_creates_one_new_mandatory_protection_trigger',
                  len(revived['current']['pendingTriggers']) == 1
                  and revived['current']['pendingTriggers'][0]['kind'] == 'AZURE_PROTECTION'
                  and revived['current']['pendingTriggers'][0]['sourceUid'] == azure
                  and revived['current']['pendingTriggers'][0]['mandatory'] is True
                  and page.evaluate('()=>YGOAdvancedWorkbench.actions().every(a=>a.type==="AZURE_EYES_PROTECTION")'))
            restored, _ = step(page, 'AZURE_EYES_PROTECTION', player=0, sourceUid=azure, noResponse=True)
            check('the_second_special_summon_resolves_its_own_protection_without_an_invented_limit',
                  restored['current']['pendingTriggers'] == []
                  and cards(restored, 0, 'monster', AZURE)[0]['effectTargetImmuneUntilTurn'] == 3
                  and sum(row['type'] == 'AZURE_EYES_PROTECTION' for row in restored['scenario']['actions']) == 2)
            saved_second = export_report(page, 'release17-revived-protection-report.json')
            check('the_second_protection_download_preserves_both_activations_and_spell_payment',
                  len(saved_second['scenario']['actions']) == 8
                  and saved_second['current'] == restored['current']
                  and cards(saved_second, 0, 'gy', REBORN)[0]['uid'] == reborn
                  and saved_second['scenario']['replay']['pass'] is True)
            step(page, 'DUEL_ADVANCE_PHASE', toPhase='END', player=0)
            boundary, _ = step(page, 'DUEL_NEXT_TURN', player=0, nextPlayer=1)
            check('protection_is_still_active_during_the_next_turn',
                  boundary['current']['turn'] == 3 and boundary['current']['activePlayer'] == 1
                  and cards(boundary, 0, 'monster', AZURE)[0]['effectTargetImmuneUntilTurn'] >= 3
                  and boundary['current']['duel']['drawCompleted'].get('3') is not True)
            rival_draw_uid = boundary['current']['zones'][1]['deck'][0]['uid']
            drawn, _ = step(page, 'DUEL_DRAW_FOR_TURN', player=1, sourceUid=rival_draw_uid)
            check('the_rival_draw_uses_a_known_physical_card_without_inventing_order',
                  drawn['current']['duel']['drawCompleted']['3'] is True
                  and any(row['uid'] == rival_draw_uid for row in drawn['current']['zones'][1]['hand']))
            rival_standby, _ = step(page, 'DUEL_ADVANCE_PHASE', toPhase='STANDBY', player=1)
            check('own_azure_cannot_revive_a_normal_during_the_rival_standby',
                  rival_standby['current']['activePlayer'] == 1 and rival_standby['goalProgress']['achieved'] is False
                  and not page.evaluate('uid=>YGOAdvancedWorkbench.actions().some(a=>a.type==="AZURE_EYES_STANDBY_REVIVE"&&a.sourceUid===uid)', azure))
            step(page, 'DUEL_ADVANCE_PHASE', toPhase='MAIN 1', player=1)
            step(page, 'DUEL_ADVANCE_PHASE', toPhase='END', player=1)
            own_turn, _ = step(page, 'DUEL_NEXT_TURN', player=1, nextPlayer=0)
            check('the_next_turn_expires_the_old_protection_before_own_standby',
                  own_turn['current']['turn'] == 4 and own_turn['current']['activePlayer'] == 0
                  and (cards(own_turn, 0, 'monster', AZURE)[0].get('effectTargetImmuneUntilTurn') or 0) < 4
                  and (cards(own_turn, 0, 'monster', AZURE)[0].get('effectDestructionImmuneUntilTurn') or 0) < 4)
            own_draw_uid = own_turn['current']['zones'][0]['deck'][0]['uid']
            own_drawn, _ = step(page, 'DUEL_DRAW_FOR_TURN', player=0, sourceUid=own_draw_uid)
            check('the_own_draw_moves_the_next_known_copy_and_preserves_life_points',
                  own_drawn['current']['duel']['drawCompleted']['4'] is True
                  and any(row['uid'] == own_draw_uid for row in own_drawn['current']['zones'][0]['hand'])
                  and own_drawn['current']['lp'] == [7500, 8000])
            standby, _ = step(page, 'DUEL_ADVANCE_PHASE', toPhase='STANDBY', player=0)
            check('the_goal_remains_false_before_the_normal_copy_is_revived',
                  standby['current']['phase'] == 'STANDBY' and standby['current']['turn'] == 4
                  and standby['goalProgress']['achieved'] is False
                  and page.evaluate('({source,target})=>YGOAdvancedWorkbench.actions().some(a=>a.type==="AZURE_EYES_STANDBY_REVIVE"&&a.sourceUid===source&&a.targetUid===target)', {'source': azure, 'target': blue}))
            final, _ = step(page, 'AZURE_EYES_STANDBY_REVIVE', player=0, sourceUid=azure, targetUid=blue,
                            noResponse=True)
            dragon = cards(final, 0, 'monster', BEWD)[0]
            check('standby_revives_the_same_normal_material_under_its_owner',
                  dragon['uid'] == blue and dragon['ownerPlayer'] == 0
                  and dragon['summonOriginZone'] == 'gy' and not cards(final, 0, 'gy', BEWD))
            check('the_new_normal_dragon_has_no_stale_previous_turn_protection',
                  dragon.get('effectTargetImmuneUntilTurn') is None
                  and dragon.get('effectDestructionImmuneUntilTurn') is None)
            check('standby_consumes_the_physical_azure_once_per_turn_budget',
                  final['current']['used']['AZURE_REVIVE:' + azure] is True
                  and not page.evaluate('uid=>YGOAdvancedWorkbench.actions().some(a=>a.type==="AZURE_EYES_STANDBY_REVIVE"&&a.sourceUid===uid)', azure))
            check('the_visible_goal_requires_both_dragons_during_the_own_turn_four_standby',
                  final['goalProgress']['achieved'] is True
                  and page.locator('#ygoDuelGoalProgress').get_attribute('data-state') == 'achieved'
                  and final['current']['phase'] == 'STANDBY' and final['current']['activePlayer'] == 0
                  and final['current']['turn'] == 4 and final['current']['lp'] == [7500, 8000])
            check('the_entire_eighteen_action_route_replays_without_competitive_certification',
                  len(final['scenario']['actions']) == 18 and final['scenario']['replay']['pass'] is True
                  and final['competitiveScore'] is None and final['certified'] is False
                  and final['scenario']['globalOptimalityProven'] is False)
            saved_final = export_report(page, 'release17-final-report.json')
            check('the_final_download_preserves_the_summon_origins_materials_and_standby_result',
                  saved_final['current'] == final['current'] and len(saved_final['scenario']['actions']) == 18
                  and cards(saved_final, 0, 'monster', AZURE)[0]['summonOriginZone'] == 'gy'
                  and cards(saved_final, 0, 'monster', BEWD)[0]['uid'] == blue)
            undone = undo_to(page, 17)
            check('undo_restores_the_graveyard_target_and_unspent_standby_budget',
                  cards(undone, 0, 'gy', BEWD)[0]['uid'] == blue
                  and undone['current']['used'].get('AZURE_REVIVE:' + azure) is not True
                  and undone['goalProgress']['achieved'] is False
                  and undone['scenario']['replay']['pass'] is True)
            imported_second = import_report(page, saved_second, True, 'azure-revived-protection.json')
            check('importing_the_intermediate_report_reconstructs_the_new_mandatory_protection',
                  imported_second['current'] == saved_second['current']
                  and len(imported_second['scenario']['actions']) == 8
                  and imported_second['scenario']['replay']['pass'] is True)
            imported_final = import_report(page, saved_final, True, 'azure-final-route.json')
            check('importing_the_final_report_replays_all_eighteen_actions',
                  imported_final['current'] == saved_final['current']
                  and len(imported_final['scenario']['actions']) == 18
                  and imported_final['scenario']['replay']['pass'] is True)
            before_bad = report(page)
            for name in ['materials', 'history', 'payment']:
                forged = copy.deepcopy(saved_final)
                action = forged['scenario']['actions'][1]
                if name == 'materials':
                    action['materialUids'][1] = action['materialUids'][0]
                elif name == 'history':
                    next(row for row in action['after']['zones'][0]['monster'] if row['uid'] == azure)['properSummonType'] = 'FUSION'
                else:
                    action['paid'][0]['to'] = 'banished'
                rejected = import_report(page, forged, False, 'forged-azure-' + name + '.json')
                check('an_altered_' + name + '_is_rejected_without_replacing_the_active_route', rejected == before_bad)
            page.set_viewport_size({'width': 390, 'height': 844})
            measurements = page.locator('#ygoAdvancedWorkbench').evaluate('''el=>{
              const r=el.getBoundingClientRect(),select=document.getElementById('ygoDuelActions'),button=document.getElementById('ygoDuelStep');
              return{left:r.left,right:r.right,selectHeight:select.getBoundingClientRect().height,
                buttonHeight:button.getBoundingClientRect().height,width:innerWidth};}''')
            check('the_azure_route_remains_readable_at_mobile_width_without_changing_state',
                  measurements['left'] >= -1 and measurements['right'] <= measurements['width'] + 1
                  and measurements['selectHeight'] >= 44 and measurements['buttonHeight'] >= 44
                  and report(page) == before_bad, measurements)
            page.set_viewport_size({'width': 1440, 'height': 1000})
        except Exception as error:
            check('the_visible_azure_synchro_revival_standby_guide_completes', False, str(error))
        check('release17_raises_no_javascript_page_errors', not errors, errors)
        version = browser.version
        browser.close()
    check('release17_leaves_the_compiled_artifact_unchanged', hashlib.sha256(artifact.read_bytes()).hexdigest() == digest)
    return {'schema': 'ygo-release17-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': digest, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'checks': checks, 'details': details,
            'browser': {'engine': 'chromium', 'version': version}, 'externalRequestsBlocked': len(blocked),
            'limitations': ['The starting Blue-Eyes fields are declared; the Azure-Eyes Synchro, materials, graveyard departure, revival and two protections are executed and replayed.',
                            'Azure protection applies to the current own Dragons through the end of the next turn, not battle destruction or later arrivals.',
                            'The Standby revival requires the own Standby and a registered physical Normal target; this does not certify arbitrary summon procedures or priority.',
                            'Mobile width is emulated; competitive scoring remains provisional.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release17-browser-results.json')
    args = parser.parse_args()
    start = time.monotonic()
    result = run(args.url)
    result['elapsedSeconds'] = round(time.monotonic() - start, 2)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': result['pass'], 'checks': len(result['checks']),
                      'failed': [row['name'] for row in result['checks'] if not row['pass']]}))
    raise SystemExit(0 if result['pass'] else 1)

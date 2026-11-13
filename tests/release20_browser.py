#!/usr/bin/env python3
"""Manifest-bound offline UI witnesses for Albaz's real summon and Fusion window."""
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
ALBAZ, REBORN, FISH, NORMAL = 68468459, 83764718, 23771716, 47372349
LUBELLION, MIRRORJADE, MECHABA = 70534340, 44146295, 75286621
MAGICIAN, VEILER, IMPERM = 46986414, 97268402, 10045474


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    document = artifact.read_bytes()
    digest = hashlib.sha256(document).hexdigest()
    assert digest == build['htmlSha256']
    target = url or 'https://ygo-release20.test/Analizador_YuGiOh.html'
    checks, details, errors, blocked = [], {}, [], []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    def actions(page, kind):
        return page.evaluate('kind=>YGOAdvancedWorkbench.actions().filter(a=>a.type===kind)', kind)

    def step(page, kind, **criteria):
        page.locator('#ygoDuelActionFilter').fill(kind)
        chosen = page.evaluate('''({kind,criteria})=>YGOAdvancedWorkbench.actions().map((action,index)=>({action,index}))
          .find(({action:a})=>a.type===kind&&Object.entries(criteria).every(([key,value])=>{
            if(key==='noResponse')return !a.response&&!a.responseUid&&!(a.counterResponses||[]).length;
            if(key==='responseType')return a.response?.type===value;
            if(key==='responseCostUid')return a.response?.costUid===value;
            return JSON.stringify(a[key])===JSON.stringify(value);
          }))||null''', {'kind': kind, 'criteria': criteria})
        assert chosen is not None, 'No rendered action: ' + kind + ' ' + str(criteria)
        # The selected option must exist in the delivered UI; no engine execution is injected.
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

    def physical_uids(value):
        return {
            'albaz': (cards(value, 0, 'hand', ALBAZ) + cards(value, 0, 'gy', ALBAZ))[0]['uid'],
            'reborn': cards(value, 0, 'hand', REBORN)[0]['uid'],
            'discard': cards(value, 0, 'hand', FISH)[0]['uid'],
            'discard2': cards(value, 0, 'hand', NORMAL)[0]['uid'],
            'mirrorjade': cards(value, 0, 'extra', MIRRORJADE)[0]['uid'],
            'lubellion': cards(value, 0, 'extra', LUBELLION)[0]['uid'],
            'mechaba': cards(value, 1, 'monster', MECHABA)[0]['uid'],
            'magician': cards(value, 1, 'monster', MAGICIAN)[0]['uid'],
            'responseCost': cards(value, 1, 'hand', FISH)[0]['uid'],
            'veiler': cards(value, 1, 'hand', VEILER)[0]['uid'],
            'imperm': cards(value, 1, 'spelltrap', IMPERM)[0]['uid'],
        }

    def fusion(page, uid, **response):
        return step(page, 'ALBAZ_FUSION', sourceUid=uid['albaz'], discardUid=uid['discard'],
                    fusionUid=uid['mirrorjade'], materialUids=[uid['albaz'], uid['mechaba']],
                    destination=0, position='ATTACK', nonTargeting=True, **response)

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
        check('release20_runs_the_manifest_bound_document_without_network', response is not None
              and hashlib.sha256(response.body()).hexdigest() == digest
              and page.evaluate('()=>navigator.onLine===false&&YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        expected_ids = ['spark', 'spirit', 'invoked', 'swordsoul', 'branded', 'tenyi', 'salamangreat',
                        'roar', 'crow', 'droll', 'field', 'trap', 'evacuation', 'shuffle', 'reborn',
                        'synchro', 'azure', 'spirit-reborn', 'wolf-reborn', 'albaz', 'hayabusa', 'faith-flip']
        check('twenty_one_visible_examples_preserve_all_twenty_previous_identifiers',
              page.locator('#ygoExampleSelect').evaluate('(el)=>[...el.options].map(o=>o.value)') == expected_ids)
        try:
            initial = load_example(page, 'albaz')
            uid = physical_uids(initial)
            check('albaz_starts_in_a_real_five_card_hand_with_declared_rival_materials_and_no_autoplay',
                  initial['scenario'] is None and initial['current']['turn'] == 2
                  and initial['current']['phase'] == 'MAIN 1' and initial['current']['activePlayer'] == 0
                  and len(initial['current']['zones'][0]['hand']) == 5
                  and initial['current']['context']['initialHistoryCertified'] is False
                  and initial['current']['pendingTriggers'] == [] and initial['goalProgress']['achieved'] is False)
            guide = page.locator('#ygoExampleInstructions').inner_text()
            check('the_visible_guide_explains_rival_ownership_cost_optional_decline_and_non_targeting',
                  'supuestos iniciales declarados' in guide and 'No selecciona objetivo al activar' in guide
                  and 'propietario rival' in guide and 'declinar el efecto opcional' in guide
                  and 'no reinicia el uso por turno' in guide and 'tres acciones' in guide)
            check('declared_setup_creates_neither_an_albaz_window_nor_fusion_qualification',
                  actions(page, 'ALBAZ_FUSION') == []
                  and cards(initial, 0, 'extra', MIRRORJADE)[0].get('properlySummoned') is not True
                  and cards(initial, 0, 'extra', LUBELLION)[0].get('properlySummoned') is not True)
            summoned, _ = step(page, 'BRANDED_NORMAL_SUMMON_ALBAZ', sourceUid=uid['albaz'], noResponse=True)
            check('a_real_normal_summon_opens_exactly_one_optional_albaz_window',
                  cards(summoned, 0, 'monster', ALBAZ)[0]['uid'] == uid['albaz']
                  and summoned['current']['normalSummonAvailable'][0] is False
                  and [t['kind'] for t in summoned['current']['pendingTriggers']] == ['ALBAZ_FUSION'])
            choices = actions(page, 'ALBAZ_FUSION')
            check('rendered_fusion_choices_use_only_source_albaz_plus_a_physical_rival_material',
                  choices and all(a['materialUids'][0] == uid['albaz']
                                  and a['materialUids'][1] in [uid['mechaba'], uid['magician']]
                                  and len(a['materialUids']) == 2 and a.get('nonTargeting') is True
                                  and 'targetUid' not in a and 'targetUids' not in a for a in choices))
            check('both_reviewed_recipes_and_main_zone_positions_are_visible',
                  any(a['fusionUid'] == uid['mirrorjade'] and a['materialUids'][1] == uid['mechaba'] for a in choices)
                  and any(a['fusionUid'] == uid['lubellion'] and a['materialUids'][1] == uid['magician'] for a in choices)
                  and not any(a['fusionUid'] == uid['mirrorjade'] and a['materialUids'][1] == uid['magician'] for a in choices)
                  and {a['destination'] for a in choices} == {0, 1, 2, 3, 4}
                  and {a['position'] for a in choices} == {'ATTACK', 'DEFENSE'})
            check('the_optional_albaz_window_offers_three_physical_response_families',
                  {a.get('response', {}).get('type') for a in choices if a.get('response')} == {'MECHABA', 'VEILER', 'IMPERM'}
                  and any(a.get('response', {}).get('costUid') == uid['responseCost'] for a in choices))
            saved_window = export_report(page, 'release20-normal-window-report.json')
            fused, label = fusion(page, uid, noResponse=True)
            live = cards(fused, 0, 'monster', MIRRORJADE)[0]
            action = fused['scenario']['actions'][-1]
            check('the_fusion_label_names_albaz_rival_mechaba_discard_recipe_zone_and_non_targeting',
                  'Albaz' in label and 'Mechaba' in label and 'Mirrorjade' in label
                  and '7 Colored Fish' in label and 'zona principal 1' in label
                  and 'de Ataque' in label and 'sin seleccionar objetivo al activar' in label)
            check('a_true_fusion_certifies_the_same_extra_copy_without_declared_history',
                  live['uid'] == uid['mirrorjade'] and live['ownerPlayer'] == 0 and live['zoneIndex'] == 0
                  and live['summonType'] == 'FUSION' and live['properlySummoned'] is True
                  and live['properSummonType'] == 'FUSION' and fused['current']['extraHistory'] == ['FUSION'])
            check('each_material_goes_to_its_owners_graveyard_and_the_real_discard_stays_paid',
                  cards(fused, 0, 'gy', ALBAZ)[0]['uid'] == uid['albaz']
                  and cards(fused, 1, 'gy', MECHABA)[0]['uid'] == uid['mechaba']
                  and cards(fused, 1, 'gy', MECHABA)[0]['ownerPlayer'] == 1
                  and cards(fused, 0, 'gy', MECHABA) == []
                  and cards(fused, 0, 'gy', FISH)[0]['uid'] == uid['discard']
                  and any(p['kind'] == 'DISCARD' and p['uid'] == uid['discard'] for p in action['paid']))
            check('albaz_records_field_origin_non_targeting_and_a_spent_hard_once_per_turn_use',
                  action['proof']['activationOrigin']['zone'] == 'monster'
                  and action['proof']['activationOrigin']['sourceUid'] == uid['albaz']
                  and action['nonTargeting'] is True and fused['current']['used'].get('ALBAZ_FUSION') is True
                  and not any(e['type'] == 'TARGET' for e in action['events'])
                  and fused['current']['pendingTriggers'] == [] and fused['goalProgress']['achieved'] is False)
            final, reborn_label = step(page, 'ACTIVATE_MONSTER_REBORN', sourceUid=uid['reborn'], targetUid=uid['albaz'],
                                       destination=1, position='DEFENSE', noResponse=True)
            revived = cards(final, 0, 'monster', ALBAZ)[0]
            check('reborn_revives_the_same_main_deck_albaz_into_the_chosen_main_zone_and_position',
                  revived['uid'] == uid['albaz'] and revived['ownerPlayer'] == 0 and revived['zoneIndex'] == 1
                  and revived['position'] == 'DEFENSE' and revived['summonType'] == 'SPECIAL'
                  and revived['summonOriginZone'] == 'gy' and 'Fallen of Albaz' in reborn_label
                  and 'tu Cementerio' in reborn_label and 'zona principal 2' in reborn_label)
            check('revival_preserves_the_spent_albaz_use_and_opens_no_second_fusion_window',
                  final['current']['used'].get('ALBAZ_FUSION') is True
                  and final['current']['pendingTriggers'] == [] and actions(page, 'ALBAZ_FUSION') == []
                  and cards(final, 0, 'gy', REBORN)[0]['uid'] == uid['reborn'])
            check('three_ui_actions_achieve_the_advertised_goal_with_an_independent_replay',
                  final['goalProgress']['achieved'] is True and len(final['scenario']['actions']) == 3
                  and final['scenario']['replay']['pass'] is True and final['competitiveScore'] is None
                  and final['certified'] is False
                  and page.evaluate('()=>{const r=YGOAdvancedWorkbench.report();return YGOComboEngine.replay(r.scenario,{deck:r.initial.provenance.deck}).pass}') is True)
            saved_final = export_report(page, 'release20-final-report.json')
            check('the_download_binds_real_uids_owner_fusion_history_goal_and_delivered_build',
                  saved_final['buildId'] == build['buildId'] and saved_final['current'] == final['current']
                  and saved_final['scenario']['replay']['pass'] is True and saved_final['goalProgress']['achieved'] is True)
            undo_to(page, 2)
            undone = undo_to(page, 1)
            check('undo_restores_the_optional_window_material_owners_hand_cost_and_unspent_use',
                  cards(undone, 0, 'monster', ALBAZ)[0]['uid'] == uid['albaz']
                  and cards(undone, 1, 'monster', MECHABA)[0]['uid'] == uid['mechaba']
                  and cards(undone, 0, 'hand', FISH)[0]['uid'] == uid['discard']
                  and undone['current']['used'].get('ALBAZ_FUSION') is not True
                  and [t['kind'] for t in undone['current']['pendingTriggers']] == ['ALBAZ_FUSION']
                  and undone['goalProgress']['achieved'] is False)
            resumed = import_report(page, saved_window, True, 'albaz-normal-window.json')
            check('import_reconstructs_the_real_normal_summon_window_and_choices',
                  resumed['current'] == saved_window['current'] and len(resumed['scenario']['actions']) == 1
                  and actions(page, 'ALBAZ_FUSION') and resumed['scenario']['replay']['pass'] is True)
            imported = import_report(page, saved_final, True, 'albaz-final.json')
            check('import_reexecutes_all_three_actions_and_restores_spent_use_and_goal',
                  imported['current'] == final['current'] and len(imported['scenario']['actions']) == 3
                  and imported['goalProgress']['achieved'] is True and imported['scenario']['replay']['pass'] is True)
            before_bad = report(page)
            for name in ['discard', 'rival_material', 'owner', 'fusion_history', 'non_targeting', 'activation_origin']:
                forged = copy.deepcopy(saved_final)
                forged_action = forged['scenario']['actions'][1]
                if name == 'discard':
                    forged_action['discardUid'] = uid['reborn']
                elif name == 'rival_material':
                    forged_action['materialUids'] = [uid['albaz'], uid['magician']]
                elif name == 'owner':
                    next(x for x in forged_action['after']['zones'][1]['gy'] if x['uid'] == uid['mechaba'])['ownerPlayer'] = 0
                elif name == 'fusion_history':
                    next(x for x in forged_action['after']['zones'][0]['monster'] if x['uid'] == uid['mirrorjade'])['properSummonType'] = 'LINK'
                elif name == 'non_targeting':
                    forged_action['nonTargeting'] = False
                else:
                    forged_action['proof']['activationOrigin']['zone'] = 'gy'
                rejected = import_report(page, forged, False, 'forged-albaz-' + name + '.json')
                check('forged_' + name + '_is_rejected_without_replacing_the_active_route', rejected == before_bad)
            page.set_viewport_size({'width': 390, 'height': 844})
            measurements = page.locator('#ygoAdvancedWorkbench').evaluate('''el=>{
              const r=el.getBoundingClientRect(),select=document.getElementById('ygoDuelActions'),button=document.getElementById('ygoDuelStep');
              return{left:r.left,right:r.right,selectHeight:select.getBoundingClientRect().height,
                buttonHeight:button.getBoundingClientRect().height,width:innerWidth};}''')
            check('the_albaz_guide_board_and_controls_remain_readable_at_mobile_width',
                  measurements['left'] >= -1 and measurements['right'] <= measurements['width'] + 1
                  and measurements['selectHeight'] >= 44 and measurements['buttonHeight'] >= 44
                  and 'Mirrorjade' in page.locator('#ygoDuelBoard').inner_text() and report(page) == before_bad, measurements)
            page.set_viewport_size({'width': 1440, 'height': 1000})
        except Exception as error:
            check('the_visible_normal_albaz_fusion_reborn_and_report_route_completes', False, str(error))

        try:
            initial = load_example(page, 'albaz')
            uid = physical_uids(initial)
            step(page, 'BRANDED_NORMAL_SUMMON_ALBAZ', sourceUid=uid['albaz'], noResponse=True)
            declined, decline_label = step(page, 'DECLINE_OPTIONAL_TRIGGER', sourceUid=uid['albaz'], triggerKind='ALBAZ_FUSION')
            check('explicit_optional_decline_names_albaz_and_spends_neither_discard_nor_use',
                  'Fusión de Albaz' in decline_label and declined['current']['pendingTriggers'] == []
                  and cards(declined, 0, 'hand', FISH)[0]['uid'] == uid['discard']
                  and declined['current']['used'].get('ALBAZ_FUSION') is not True
                  and declined['scenario']['actions'][-1]['paid'] == [])
            for response_type in ['MECHABA', 'VEILER', 'IMPERM']:
                initial = load_example(page, 'albaz')
                uid = physical_uids(initial)
                step(page, 'BRANDED_NORMAL_SUMMON_ALBAZ', sourceUid=uid['albaz'], noResponse=True)
                response_criteria = {'responseType': response_type}
                if response_type == 'MECHABA':
                    response_criteria['responseCostUid'] = uid['responseCost']
                negated, label = fusion(page, uid, **response_criteria)
                action = negated['scenario']['actions'][-1]
                check(response_type.lower() + '_negation_preserves_albaz_discard_consumes_use_and_does_not_fuse',
                      cards(negated, 0, 'gy', FISH)[0]['uid'] == uid['discard']
                      and negated['current']['used'].get('ALBAZ_FUSION') is True
                      and cards(negated, 0, 'extra', MIRRORJADE)[0]['uid'] == uid['mirrorjade']
                      and cards(negated, 0, 'extra', MIRRORJADE)[0].get('properlySummoned') is not True
                      and cards(negated, 1, 'monster', MECHABA)[0]['uid'] == uid['mechaba']
                      and negated['current']['pendingTriggers'] == [] and negated['scenario']['replay']['pass'] is True
                      and action['proof']['activationOrigin']['zone'] == 'monster')
                if response_type == 'MECHABA':
                    check('mechaba_uses_a_real_matching_monster_cost_and_banishes_the_field_source',
                          cards(negated, 1, 'gy', FISH)[0]['uid'] == uid['responseCost']
                          and cards(negated, 0, 'banished', ALBAZ)[0]['uid'] == uid['albaz']
                          and action['proof']['activationNegated'] is True
                          and action['response']['activationZone'] == 'monster'
                          and action['response']['matchingCardType'] == 'MONSTER'
                          and action['response']['nonTargeting'] is True
                          and 'coste: 7 Colored Fish' in label)
                elif response_type == 'VEILER':
                    check('veiler_pays_its_actual_hand_copy_and_negates_the_current_field_albaz',
                          cards(negated, 1, 'gy', VEILER)[0]['uid'] == uid['veiler']
                          and cards(negated, 0, 'monster', ALBAZ)[0]['effectsNegated'] is True
                          and action['proof']['effectNegated'] is True and action['proof']['activationNegated'] is False)
                else:
                    check('imperm_uses_the_prior_set_physical_trap_and_cleans_it_to_its_owners_graveyard',
                          cards(negated, 1, 'gy', IMPERM)[0]['uid'] == uid['imperm']
                          and cards(negated, 0, 'monster', ALBAZ)[0]['effectsNegated'] is True
                          and action['proof']['effectNegated'] is True and action['proof']['activationNegated'] is False)
        except Exception as error:
            check('the_visible_optional_decline_and_three_physical_response_comparisons_complete', False, str(error))

        try:
            spec = page.evaluate('()=>YGOScenarioExamples.get("albaz")')
            spec['name'] = 'Albaz: llegada real por Monster Reborn y continuación Lubellion'
            spec['setup']['placements'].append({'player': 0, 'from': 'hand', 'cardId': ALBAZ, 'zone': 'gy'})
            spec['goal'] = {'requiredFieldIds': [MIRRORJADE]}
            import_scenario(page, spec)
            initial = report(page)
            uid = physical_uids(initial)
            check('a_physical_json_scenario_import_declares_albaz_in_grave_without_inventing_a_trigger',
                  initial['scenario'] is None and initial['current']['pendingTriggers'] == []
                  and cards(initial, 0, 'gy', ALBAZ)[0]['uid'] == uid['albaz']
                  and actions(page, 'ALBAZ_FUSION') == [] and initial['goalProgress']['achieved'] is False)
            arrived, _ = step(page, 'ACTIVATE_MONSTER_REBORN', sourceUid=uid['reborn'], targetUid=uid['albaz'],
                              destination=2, position='ATTACK', noResponse=True)
            check('reborn_first_opens_the_optional_albaz_window_from_an_actual_main_deck_revival',
                  cards(arrived, 0, 'monster', ALBAZ)[0]['uid'] == uid['albaz']
                  and cards(arrived, 0, 'monster', ALBAZ)[0]['summonOriginZone'] == 'gy'
                  and [t['kind'] for t in arrived['current']['pendingTriggers']] == ['ALBAZ_FUSION']
                  and arrived['current']['used'].get('ALBAZ_FUSION') is not True
                  and arrived['current']['normalSummonAvailable'][0] is True)
            saved_reborn_window = export_report(page, 'release20-reborn-window-report.json')
            lubellion, lubellion_label = step(page, 'ALBAZ_FUSION', sourceUid=uid['albaz'], discardUid=uid['discard'],
                                            fusionUid=uid['lubellion'], materialUids=[uid['albaz'], uid['magician']],
                                            destination=2, position='DEFENSE', nonTargeting=True, noResponse=True)
            check('reborn_albaz_fuses_with_the_rival_dark_material_and_opens_real_lubellion_continuation',
                  cards(lubellion, 0, 'monster', LUBELLION)[0]['uid'] == uid['lubellion']
                  and cards(lubellion, 0, 'monster', LUBELLION)[0]['properSummonType'] == 'FUSION'
                  and cards(lubellion, 1, 'gy', MAGICIAN)[0]['uid'] == uid['magician']
                  and cards(lubellion, 1, 'gy', MAGICIAN)[0]['ownerPlayer'] == 1
                  and [t['kind'] for t in lubellion['current']['pendingTriggers']] == ['LUBELLION_FUSION']
                  and 'Lubellion' in lubellion_label and 'Dark Magician' in lubellion_label)
            continued, _ = step(page, 'LUBELLION_FUSION_MIRRORJADE', sourceUid=uid['lubellion'],
                                discardUid=uid['discard2'], fusionUid=uid['mirrorjade'],
                                materialUids=[uid['albaz'], uid['lubellion']], noResponse=True)
            check('lubellion_pays_a_second_physical_discard_and_shuffles_only_own_materials',
                  cards(continued, 0, 'gy', FISH)[0]['uid'] == uid['discard']
                  and cards(continued, 0, 'gy', NORMAL)[0]['uid'] == uid['discard2']
                  and cards(continued, 0, 'deck', ALBAZ)[0]['uid'] == uid['albaz']
                  and cards(continued, 0, 'extra', LUBELLION)[0]['uid'] == uid['lubellion']
                  and cards(continued, 1, 'gy', MAGICIAN)[0]['uid'] == uid['magician']
                  and cards(continued, 1, 'monster', MECHABA)[0]['uid'] == uid['mechaba'])
            check('the_imported_reborn_first_lubellion_route_achieves_mirrorjade_in_three_replayed_actions',
                  cards(continued, 0, 'monster', MIRRORJADE)[0]['properSummonType'] == 'FUSION'
                  and continued['current']['extraHistory'] == ['FUSION', 'FUSION']
                  and len(continued['scenario']['actions']) == 3 and continued['scenario']['replay']['pass'] is True
                  and continued['goalProgress']['achieved'] is True and continued['certified'] is False)
            resumed = import_report(page, saved_reborn_window, True, 'albaz-reborn-window.json')
            check('report_import_reconstructs_the_reborn_generated_optional_window',
                  resumed['current'] == saved_reborn_window['current'] and actions(page, 'ALBAZ_FUSION')
                  and resumed['scenario']['replay']['pass'] is True)
        except Exception as error:
            check('the_visible_imported_reborn_albaz_lubellion_and_mirrorjade_route_completes', False, str(error))
        check('release20_raises_no_javascript_page_errors', not errors, errors)
        version = browser.version
        browser.close()
    check('release20_leaves_the_compiled_artifact_unchanged', hashlib.sha256(artifact.read_bytes()).hexdigest() == digest)
    return {'schema': 'ygo-release20-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': digest, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'checks': checks, 'details': details,
            'browser': {'engine': 'chromium', 'version': version}, 'externalRequestsBlocked': len(blocked),
            'limitations': ['Rival Mechaba, Dark Magician and the prior set Infinite Impermanence are declared setup assumptions, with physical hand response costs.',
                            'The main guide executes Normal Summon, a non-targeting Fusion with a rival material and revival of the same Albaz without resetting its spent use.',
                            'A separate physical scenario JSON import witnesses Reborn-first Albaz, Lubellion and its existing own-material continuation into Mirrorjade.',
                            'Physical Mechaba, Veiler and prior-set Impermanence branches and explicit optional decline are exercised; arbitrary priority and SEGOC are outside scope.',
                            'Mobile width is emulated; competitive scoring remains provisional.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release20-browser-results.json')
    args = parser.parse_args()
    start = time.monotonic()
    result = run(args.url)
    result['elapsedSeconds'] = round(time.monotonic() - start, 2)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': result['pass'], 'checks': len(result['checks']),
                      'failed': [row['name'] for row in result['checks'] if not row['pass']]}))
    raise SystemExit(0 if result['pass'] else 1)

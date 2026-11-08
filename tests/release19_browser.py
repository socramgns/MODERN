#!/usr/bin/env python3
"""Delivered-byte UI route for a genuinely Link Summoned and revived Sunlight Wolf."""
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
WOLF, GAZELLE, SPINNY = 87871125, 26889158, 52277807
ASH, ROAR, REBORN, BEWD, ALEISTER, ARTEMIS = 14558127, 51339637, 83764718, 89631139, 86120751, 34755994


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    document = artifact.read_bytes()
    digest = hashlib.sha256(document).hexdigest()
    assert digest == build['htmlSha256']
    target = url or 'https://ygo-release19.test/Analizador_YuGiOh.html'
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
            return JSON.stringify(a[key])===JSON.stringify(value);
          }))||null''', {'kind': kind, 'criteria': criteria})
        assert chosen is not None, 'No rendered action: ' + kind + ' ' + str(criteria)
        label = page.locator('#ygoDuelActions option[value="' + str(chosen['index']) + '"]').inner_text()
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
        check('release19_runs_the_manifest_bound_document_without_network', response is not None
              and hashlib.sha256(response.body()).hexdigest() == digest
              and page.evaluate('()=>navigator.onLine===false&&YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        expected_ids = ['spark', 'spirit', 'invoked', 'swordsoul', 'branded', 'tenyi', 'salamangreat',
                        'roar', 'crow', 'droll', 'field', 'trap', 'evacuation', 'shuffle', 'reborn',
                        'synchro', 'azure', 'spirit-reborn', 'wolf-reborn', 'albaz', 'hayabusa']
        check('twenty_one_visible_examples_preserve_all_twenty_previous_identifiers',
              page.locator('#ygoExampleSelect').evaluate('(el)=>[...el.options].map(o=>o.value)') == expected_ids)
        registry = page.evaluate('()=>YGOComboEngine.capabilities()')
        check('wolf_revival_preserves_the_existing_registered_spell_and_trap_packets',
              len(registry['normalSpellActivations']) == 4 and len(registry['fieldSpellActivations']) == 2
              and len(registry['normalTrapActivations']) == 2)
        try:
            initial = load_example(page, 'wolf-reborn')
            wolf = cards(initial, 0, 'extra', WOLF)[0]['uid']
            artemis = cards(initial, 0, 'extra', ARTEMIS)[0]['uid']
            reborn = cards(initial, 0, 'hand', REBORN)[0]['uid']
            aleister = cards(initial, 0, 'hand', ALEISTER)[0]['uid']
            ash = cards(initial, 0, 'gy', ASH)[0]['uid']
            roar = cards(initial, 0, 'gy', ROAR)[0]['uid']
            gazelle = cards(initial, 0, 'monster', GAZELLE)[0]['uid']
            spinny = cards(initial, 0, 'monster', SPINNY)[0]['uid']
            enemy = cards(initial, 1, 'monster', BEWD)[0]['uid']
            check('the_example_loads_declared_materials_and_graveyards_without_autoplay',
                  initial['scenario'] is None and initial['current']['turn'] == 2
                  and initial['current']['phase'] == 'MAIN 1' and initial['current']['activePlayer'] == 0
                  and len(initial['current']['zones'][0]['hand']) == 5
                  and cards(initial, 0, 'monster', GAZELLE)[0]['zoneIndex'] == 0
                  and cards(initial, 0, 'monster', SPINNY)[0]['zoneIndex'] == 2
                  and initial['current']['context']['initialHistoryCertified'] is False
                  and initial['goalProgress']['achieved'] is False)
            guide = page.locator('#ygoExampleInstructions').inner_text()
            check('the_visible_guide_declares_setup_indices_fixed_geometry_and_non_targeting_selection',
                  'supuestos iniciales declarados' in guide and 'zona principal 2' in guide
                  and 'zona principal 4 rival' in guide and 'izquierda de cada controlador' in guide
                  and 'No selecciona objetivo al activar' in guide and 'cualquier monstruo FUEGO' in guide)
            check('the_initial_extra_copy_has_no_invented_link_qualification_or_reborn_target',
                  cards(initial, 0, 'extra', WOLF)[0].get('properlySummoned') is not True
                  and cards(initial, 0, 'extra', WOLF)[0].get('properSummonType') is None
                  and not any(a.get('targetUid') == wolf for a in actions(page, 'ACTIVATE_MONSTER_REBORN')))
            linked, label = step(page, 'SALAMANGREAT_LINK_WOLF', sourceUid=wolf,
                                 materialUids=[gazelle, spinny], destination=5, noResponse=True)
            live = cards(linked, 0, 'monster', WOLF)[0]
            check('the_rendered_link_choice_names_both_physical_materials_and_the_extra_zone',
                  'Sunlight Wolf' in label and 'Gazelle' in label and 'Spinny' in label
                  and 'zona de Monstruos Extra' in label)
            check('the_genuine_link_procedure_certifies_the_same_wolf_and_sends_both_materials',
                  live['uid'] == wolf and live['zoneIndex'] == 5 and live['properlySummoned'] is True
                  and live['properSummonType'] == 'LINK' and live['summonType'] == 'LINK'
                  and live['summonOriginZone'] == 'extra' and live.get('reincarnated') is False
                  and cards(linked, 0, 'gy', GAZELLE)[0]['uid'] == gazelle
                  and cards(linked, 0, 'gy', SPINNY)[0]['uid'] == spinny
                  and {p['uid'] for p in linked['scenario']['actions'][-1]['paid'] if p['kind'] == 'LINK_MATERIAL'} == {gazelle, spinny})
            check('the_extra_wolf_board_displays_both_real_pointed_zones',
                  'apunta a tu zona principal 2 y la zona principal 4 rival' in page.locator('#ygoDuelBoard').inner_text()
                  and linked['current']['pendingTriggers'] == []
                  and linked['goalProgress']['achieved'] is False)
            step(page, 'DUEL_ADVANCE_PHASE', toPhase='BATTLE')
            battled, _ = step(page, 'DUEL_ATTACK', attackerUid=wolf, targetUid=enemy)
            grave = cards(battled, 0, 'gy', WOLF)[0]
            check('the_actual_battle_destroys_wolf_and_charges_1200_lp_without_losing_link_history',
                  grave['uid'] == wolf and grave['properlySummoned'] is True
                  and grave['properSummonType'] == 'LINK' and grave.get('summonOriginZone') is None
                  and battled['current']['lp'] == [6800, 8000]
                  and any(e['type'] == 'BATTLE_DAMAGE' and e['amount'] == 1200
                          for e in battled['scenario']['actions'][-1]['events'])
                  and battled['goalProgress']['achieved'] is False)
            step(page, 'DUEL_ADVANCE_PHASE', toPhase='MAIN 2')
            choices = [a for a in actions(page, 'ACTIVATE_MONSTER_REBORN') if a.get('targetUid') == wolf]
            check('the_witnessed_wolf_is_revivable_only_in_attack_in_main_monster_zones',
                  choices and all(a['position'] == 'ATTACK' and a['destination'] in [0, 1, 2, 3, 4] for a in choices)
                  and {a['destination'] for a in choices} == {0, 1, 2, 3, 4})
            saved_grave = export_report(page, 'release19-grave-report.json')
            check('the_intermediate_download_binds_real_materials_battle_history_and_build',
                  saved_grave['buildId'] == build['buildId'] and len(saved_grave['scenario']['actions']) == 4
                  and saved_grave['scenario']['replay']['pass'] is True
                  and cards(saved_grave, 0, 'gy', WOLF)[0]['uid'] == wolf)
            revived, revived_label = step(page, 'ACTIVATE_MONSTER_REBORN', sourceUid=reborn,
                                          targetUid=wolf, destination=1, position='ATTACK', noResponse=True)
            live = cards(revived, 0, 'monster', WOLF)[0]
            check('the_visible_revive_choice_names_own_graveyard_attack_and_main_zone_two',
                  'Activar Monster Reborn' in revived_label and 'Sunlight Wolf' in revived_label
                  and 'tu Cementerio' in revived_label and 'de Ataque' in revived_label
                  and 'zona principal 2' in revived_label)
            check('the_revived_wolf_retains_identity_owner_and_proper_link_history_with_current_gy_origin',
                  live['uid'] == wolf and live['ownerPlayer'] == 0 and live['zoneIndex'] == 1
                  and live['position'] == 'ATTACK' and live['summonType'] == 'SPECIAL'
                  and live['summonOriginZone'] == 'gy' and live['properlySummoned'] is True
                  and live['properSummonType'] == 'LINK' and revived['current']['extraHistory'] == ['LINK'])
            check('revival_creates_no_reincarnation_spell_trap_recovery_or_fire_trigger',
                  live.get('reincarnated') is not True and revived['current']['pendingTriggers'] == []
                  and actions(page, 'SALAMANGREAT_WOLF_RECOVER_ST') == []
                  and actions(page, 'SALAMANGREAT_WOLF_RECOVER_FIRE') == []
                  and cards(revived, 0, 'gy', ROAR)[0]['uid'] == roar)
            check('the_main_zone_wolf_board_shows_its_extra_zone_arrow_and_reborn_cleanup',
                  'zona principal 2 · apunta a tu zona de Monstruos Extra' in page.locator('#ygoDuelBoard').inner_text()
                  and cards(revived, 0, 'gy', REBORN)[0]['uid'] == reborn
                  and revived['scenario']['actions'][-1]['paid'] == []
                  and any(e['type'] == 'NORMAL_SPELL_RESOLUTION_CLEANUP' and e['uid'] == reborn
                          for e in revived['scenario']['actions'][-1]['events'])
                  and revived['goalProgress']['achieved'] is False)
            normal, _ = step(page, 'NORMAL_SUMMON', sourceUid=aleister, noResponse=True)
            check('a_real_normal_summon_outside_the_arrow_does_not_open_wolfs_fire_window',
                  cards(normal, 0, 'monster', ALEISTER)[0]['uid'] == aleister
                  and cards(normal, 0, 'monster', ALEISTER)[0]['zoneIndex'] == 0
                  and normal['current']['normalSummonAvailable'][0] is False
                  and [t['kind'] for t in normal['current']['pendingTriggers']] == ['ALEISTER_SEARCH']
                  and actions(page, 'SALAMANGREAT_WOLF_RECOVER_FIRE') == [])
            declined, _ = step(page, 'DECLINE_OPTIONAL_TRIGGER', sourceUid=aleister, triggerKind='ALEISTER_SEARCH')
            check('declining_aleisters_optional_search_does_not_invent_a_deck_card_or_wolf_trigger',
                  declined['current']['pendingTriggers'] == [] and len(declined['current']['zones'][0]['hand']) == 3
                  and declined['current']['deckOrderKnown'][0] is True)
            pointed, artemis_label = step(page, 'LINK_ARTEMIS', sourceUid=artemis, materialUids=[aleister], noResponse=True)
            windows = pointed['current']['pendingTriggers']
            check('the_actual_artemis_link_into_the_pointed_extra_zone_opens_one_wolf_window',
                  cards(pointed, 0, 'monster', ARTEMIS)[0]['uid'] == artemis
                  and cards(pointed, 0, 'monster', ARTEMIS)[0]['zoneIndex'] == 5
                  and cards(pointed, 0, 'monster', ARTEMIS)[0]['properSummonType'] == 'LINK'
                  and 'Artemis' in artemis_label and 'Aleister' in artemis_label
                  and len(windows) == 1 and windows[0]['kind'] == 'SALAMANGREAT_WOLF_FIRE'
                  and windows[0]['sourceUid'] == wolf and windows[0]['summonedUid'] == artemis
                  and pointed['goalProgress']['achieved'] is False)
            fire_choices = actions(page, 'SALAMANGREAT_WOLF_RECOVER_FIRE')
            check('the_non_targeting_resolution_choices_include_non_salamangreat_ash_and_exclude_roar',
                  any(a.get('selectionUid') == ash for a in fire_choices)
                  and all(a.get('nonTargeting') is True and a.get('selectionAtResolution') is True for a in fire_choices)
                  and not any(a.get('selectionUid') == roar for a in fire_choices)
                  and actions(page, 'SALAMANGREAT_WOLF_RECOVER_ST') == [])
            saved_window = export_report(page, 'release19-window-report.json')
            final, recovery_label = step(page, 'SALAMANGREAT_WOLF_RECOVER_FIRE', sourceUid=wolf,
                                         selectionUid=ash, nonTargeting=True, selectionAtResolution=True, noResponse=True)
            check('the_visible_recovery_label_describes_a_choice_at_resolution_without_targeting',
                  'Ash Blossom' in recovery_label and 'elección al resolver' in recovery_label
                  and 'sin seleccionar objetivo al activar' in recovery_label
                  and recovery_label.count('Ash Blossom') == 1)
            check('fire_recovery_moves_the_same_ash_to_hand_and_consumes_the_wolf_hard_once_per_turn',
                  cards(final, 0, 'hand', ASH)[0]['uid'] == ash and cards(final, 0, 'gy', ASH) == []
                  and final['current']['used']['SALAMANGREAT_WOLF_FIRE'] is True
                  and final['current']['pendingTriggers'] == []
                  and any(e['type'] == 'RECOVER_FIRE_FROM_GY' and e['uid'] == ash
                          and e.get('nonTargeting') is True and e.get('selectionAt') == 'RESOLUTION'
                          for e in final['scenario']['actions'][-1]['events'])
                  and not any(e['type'] == 'TARGET' for e in final['scenario']['actions'][-1]['events'])
                  and actions(page, 'SALAMANGREAT_WOLF_RECOVER_FIRE') == [])
            check('hand_recovery_records_the_same_name_summon_lock_for_the_rest_of_this_turn',
                  any(l['kind'] == 'SALAMANGREAT_WOLF_NAME_LOCK' and l['cardId'] == ASH
                      and l['untilTurn'] == final['current']['turn'] and (l.get('appliesToPlayer', l.get('player', 0)) == 0)
                      for l in final['current']['locks']))
            check('the_advertised_goal_is_achieved_only_after_nine_real_actions_with_a_fresh_replay',
                  final['goalProgress']['achieved'] is True and len(final['scenario']['actions']) == 9
                  and final['scenario']['replay']['pass'] is True and final['current']['lp'] == [6800, 8000]
                  and cards(final, 0, 'monster', WOLF)[0]['uid'] == wolf
                  and cards(final, 0, 'monster', WOLF)[0]['summonOriginZone'] == 'gy'
                  and cards(final, 0, 'monster', ARTEMIS)[0]['uid'] == artemis
                  and cards(final, 0, 'gy', ROAR)[0]['uid'] == roar
                  and final['competitiveScore'] is None and final['certified'] is False)
            fresh = page.evaluate('()=>{const r=YGOAdvancedWorkbench.report();return YGOComboEngine.replay(r.scenario,{deck:r.initial.provenance.deck})}')
            check('an_independent_read_only_replay_reexecutes_the_exportable_nine_action_line', fresh['pass'] is True)
            saved_final = export_report(page, 'release19-final-report.json')
            check('the_final_download_preserves_physical_identity_goal_lock_and_replay',
                  saved_final['current'] == final['current'] and saved_final['goalProgress']['achieved'] is True
                  and saved_final['buildId'] == build['buildId'] and saved_final['scenario']['replay']['pass'] is True)
            undone = undo_to(page, 8)
            check('undo_restores_the_real_arrival_window_ash_in_grave_and_unspent_recovery',
                  cards(undone, 0, 'gy', ASH)[0]['uid'] == ash
                  and undone['current']['used'].get('SALAMANGREAT_WOLF_FIRE') is not True
                  and not any(l['kind'] == 'SALAMANGREAT_WOLF_NAME_LOCK' and l['cardId'] == ASH for l in undone['current']['locks'])
                  and len(undone['current']['pendingTriggers']) == 1
                  and undone['goalProgress']['achieved'] is False and undone['scenario']['replay']['pass'] is True)
            resumed_window = import_report(page, saved_window, True, 'wolf-arrival-window.json')
            check('import_rebuilds_the_eight_action_summon_window_instead_of_trusting_a_saved_summary',
                  resumed_window['current'] == saved_window['current']
                  and resumed_window['scenario']['replay']['pass'] is True
                  and any(a.get('selectionUid') == ash for a in actions(page, 'SALAMANGREAT_WOLF_RECOVER_FIRE')))
            imported = import_report(page, saved_final, True, 'wolf-reborn-final.json')
            check('import_replays_nine_actions_and_restores_the_consumed_use_name_lock_and_goal',
                  imported['current'] == saved_final['current'] and imported['scenario']['replay']['pass'] is True
                  and len(imported['scenario']['actions']) == 9 and imported['goalProgress']['achieved'] is True)
            before_bad = report(page)
            for name in ['material', 'qualification', 'revival_origin', 'resolution_choice']:
                forged = copy.deepcopy(saved_final)
                if name == 'material':
                    forged['scenario']['actions'][0]['materialUids'] = [aleister, spinny]
                elif name == 'qualification':
                    next(row for row in forged['scenario']['actions'][0]['after']['zones'][0]['monster']
                         if row['uid'] == wolf)['properSummonType'] = 'FUSION'
                elif name == 'revival_origin':
                    next(row for row in forged['scenario']['actions'][4]['after']['zones'][0]['monster']
                         if row['uid'] == wolf)['summonOriginZone'] = 'extra'
                else:
                    forged['scenario']['actions'][8]['selectionUid'] = roar
                rejected = import_report(page, forged, False, 'forged-wolf-' + name + '.json')
                check('an_altered_' + name + '_is_rejected_without_replacing_the_active_route', rejected == before_bad)
            page.set_viewport_size({'width': 390, 'height': 844})
            measurements = page.locator('#ygoAdvancedWorkbench').evaluate('''el=>{
              const r=el.getBoundingClientRect(),select=document.getElementById('ygoDuelActions'),button=document.getElementById('ygoDuelStep');
              return{left:r.left,right:r.right,selectHeight:select.getBoundingClientRect().height,
                buttonHeight:button.getBoundingClientRect().height,width:innerWidth};}''')
            check('the_wolf_guide_and_board_remain_readable_at_mobile_width_without_mutating_state',
                  measurements['left'] >= -1 and measurements['right'] <= measurements['width'] + 1
                  and measurements['selectHeight'] >= 44 and measurements['buttonHeight'] >= 44
                  and 'apunta a tu zona de Monstruos Extra' in page.locator('#ygoDuelBoard').inner_text()
                  and report(page) == before_bad, measurements)
        except Exception as error:
            check('the_visible_wolf_link_battle_revival_and_fire_recovery_guide_completes', False, str(error))
        check('release19_raises_no_javascript_page_errors', not errors, errors)
        version = browser.version
        browser.close()
    check('release19_leaves_the_compiled_artifact_unchanged', hashlib.sha256(artifact.read_bytes()).hexdigest() == digest)
    return {'schema': 'ygo-release19-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': digest, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'checks': checks, 'details': details,
            'browser': {'engine': 'chromium', 'version': version}, 'externalRequestsBlocked': len(blocked),
            'limitations': ['The initial Gazelle, Spinny, Ash, Roar and rival Blue-Eyes are declared assumptions. Wolf proper Link history is created by the executed route.',
                            'The same physical Wolf is destroyed by a real battle, revived from the GY and observes an actual Artemis arrival in its pointed Extra Monster Zone.',
                            'The fixed left Extra Monster Zone per controller geometry and non-targeting recovery choice are displayed. Other board topologies and arbitrary chain priority are not certified.',
                            'Hand recovery and its name lock are witnessed; broader name-lock and returning-Link alternatives are covered by the source-model tests.',
                            'Mobile width is emulated; competitive scoring remains provisional.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release19-browser-results.json')
    args = parser.parse_args()
    start = time.monotonic()
    result = run(args.url)
    result['elapsedSeconds'] = round(time.monotonic() - start, 2)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': result['pass'], 'checks': len(result['checks']),
                      'failed': [row['name'] for row in result['checks'] if not row['pass']]}))
    raise SystemExit(0 if result['pass'] else 1)

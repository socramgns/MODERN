#!/usr/bin/env python3
"""Delivered-byte tasks for witnessed Spirit Link history, tribute and GY revival."""
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
SPIRIT, GUARD, REBORN, BEWD = 42097666, 21615956, 83764718, 89631139
MAUSOLEUM, LONGYUAN, ADHARA = 24382602, 93490856, 98159737


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    document = artifact.read_bytes()
    digest = hashlib.sha256(document).hexdigest()
    assert digest == build['htmlSha256']
    target = url or 'https://ygo-release18.test/Analizador_YuGiOh.html'
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

    def actions(page, kind):
        return page.evaluate('kind=>YGOAdvancedWorkbench.actions().filter(a=>a.type===kind)', kind)

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
        check('release18_runs_the_manifest_bound_document_without_network', response is not None
              and hashlib.sha256(response.body()).hexdigest() == digest
              and page.evaluate('()=>navigator.onLine===false&&YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        expected_ids = ['spark', 'spirit', 'invoked', 'swordsoul', 'branded', 'tenyi', 'salamangreat',
                        'roar', 'crow', 'droll', 'field', 'trap', 'evacuation', 'shuffle', 'reborn',
                        'synchro', 'azure', 'spirit-reborn', 'wolf-reborn', 'albaz', 'hayabusa']
        check('twenty_one_visible_examples_preserve_all_twenty_previous_identifiers',
              page.locator('#ygoExampleSelect').evaluate('(el)=>[...el.options].map(o=>o.value)') == expected_ids)
        registry = page.evaluate('()=>YGOComboEngine.capabilities()')
        check('spirit_revival_reuses_the_registered_spell_packet_and_preserves_other_registries',
              len(registry['normalSpellActivations']) == 4 and len(registry['fieldSpellActivations']) == 2
              and len(registry['normalTrapActivations']) == 2)
        try:
            initial = load_example(page, 'spirit-reborn')
            guard = cards(initial, 0, 'hand', GUARD)[0]['uid']
            blue = cards(initial, 0, 'hand', BEWD)[0]['uid']
            spirit = cards(initial, 0, 'extra', SPIRIT)[0]['uid']
            reborn = cards(initial, 0, 'hand', REBORN)[0]['uid']
            longyuan = cards(initial, 0, 'hand', LONGYUAN)[0]['uid']
            adhara = cards(initial, 0, 'hand', ADHARA)[0]['uid']
            check('the_example_starts_with_an_empty_field_five_physical_hand_cards_and_no_autoplay',
                  initial['scenario'] is None and initial['current']['turn'] == 2
                  and initial['current']['phase'] == 'MAIN 1' and initial['current']['activePlayer'] == 0
                  and initial['current']['zones'][0]['monster'] == []
                  and len(initial['current']['zones'][0]['hand']) == 5
                  and initial['goalProgress']['achieved'] is False)
            check('the_extra_copy_claims_no_initial_proper_link_history',
                  cards(initial, 0, 'extra', SPIRIT)[0].get('properSummonType') is None
                  and cards(initial, 0, 'extra', SPIRIT)[0].get('properlySummoned') is not True
                  and initial['current']['context']['initialHistoryCertified'] is False)
            check('the_visible_longyuan_alternative_initially_has_a_real_wyrm_discard',
                  any(a['sourceUid'] == longyuan and a['discardUid'] == adhara
                      for a in actions(page, 'LONGYUAN_SPECIAL')))
            check('monster_reborn_does_not_offer_an_extra_copy_without_graveyard_history',
                  not any(a.get('targetUid') == spirit for a in actions(page, 'ACTIVATE_MONSTER_REBORN')))
            normal, _ = step(page, 'NORMAL_SUMMON', sourceUid=guard, noResponse=True)
            check('normal_summon_consumes_the_real_guard_and_normal_budget',
                  cards(normal, 0, 'monster', GUARD)[0]['uid'] == guard
                  and normal['current']['normalSummonAvailable'][0] is False)
            linked, label = step(page, 'LINK_SPIRIT_WITH_EYES_OF_BLUE', sourceUid=spirit,
                                 materialUids=[guard], noResponse=True)
            live = cards(linked, 0, 'monster', SPIRIT)[0]
            check('the_visible_link_choice_identifies_spirit_and_its_real_material',
                  'Spirit with Eyes of Blue' in label and 'Flamvell Guard' in label)
            check('the_link_procedure_creates_proper_history_for_the_same_physical_copy',
                  live['uid'] == spirit and live['properlySummoned'] is True
                  and live['properSummonType'] == 'LINK' and live['summonType'] == 'LINK'
                  and live['summonOriginZone'] == 'extra' and live['zoneIndex'] == 5
                  and linked['current']['extraHistory'] == ['LINK'])
            check('the_material_reaches_the_graveyard_with_a_link_material_proof',
                  cards(linked, 0, 'gy', GUARD)[0]['uid'] == guard
                  and any(p['uid'] == guard and p['kind'] == 'LINK_MATERIAL' and p['to'] == 'gy'
                          for p in linked['scenario']['actions'][-1]['paid']))
            check('the_real_link_summon_queues_its_own_mausoleum_opportunity',
                  len(linked['current']['pendingTriggers']) == 1
                  and linked['current']['pendingTriggers'][0]['kind'] == 'SPIRIT_MAUSOLEUM'
                  and linked['current']['pendingTriggers'][0]['sourceUid'] == spirit)
            searched, _ = step(page, 'SPIRIT_SEARCH_MAUSOLEUM', sourceUid=spirit, noResponse=True)
            mausoleum = cards(searched, 0, 'hand', MAUSOLEUM)[0]['uid']
            check('the_link_only_search_adds_a_real_mausoleum_consumes_its_use_and_shuffles',
                  searched['current']['pendingTriggers'] == []
                  and searched['current']['used']['SPIRIT_MAUSOLEUM'] is True
                  and searched['current']['deckOrderKnown'][0] is False)
            check('the_live_spirit_restriction_excludes_longyuan_without_spending_its_discard',
                  actions(page, 'LONGYUAN_SPECIAL') == []
                  and cards(searched, 0, 'hand', LONGYUAN)[0]['uid'] == longyuan
                  and cards(searched, 0, 'hand', ADHARA)[0]['uid'] == adhara
                  and searched['current']['used'].get('LONGYUAN_SPECIAL') is not True)
            check('the_goal_remains_unachieved_before_tribute_and_revival',
                  searched['goalProgress']['achieved'] is False)
            tributed, _ = step(page, 'SPIRIT_TRIBUTE_BLUE_EYES', sourceUid=spirit,
                                   summonUid=blue, noResponse=True)
            grave = cards(tributed, 0, 'gy', SPIRIT)[0]
            check('the_tribute_is_a_real_paid_cost_and_preserves_spirits_link_qualification',
                  grave['uid'] == spirit and grave['properlySummoned'] is True
                  and grave['properSummonType'] == 'LINK' and grave.get('summonOriginZone') is None
                  and any(p['uid'] == spirit and p['kind'] == 'TRIBUTE' and p['to'] == 'gy'
                          for p in tributed['scenario']['actions'][-1]['paid']))
            check('blue_eyes_is_summoned_from_the_same_hand_and_the_tribute_use_is_spent',
                  cards(tributed, 0, 'monster', BEWD)[0]['uid'] == blue
                  and tributed['current']['used']['SPIRIT_TRIBUTE'] is True
                  and tributed['goalProgress']['achieved'] is False)
            check('departure_removes_the_live_restriction_despite_retained_historical_locks',
                  any(a['sourceUid'] == longyuan and a['discardUid'] == adhara
                      for a in actions(page, 'LONGYUAN_SPECIAL')))
            choices = [a for a in actions(page, 'ACTIVATE_MONSTER_REBORN') if a.get('targetUid') == spirit]
            check('the_revive_choices_offer_only_attack_in_free_main_monster_zones',
                  choices and all(a['position'] == 'ATTACK' and a['destination'] in [1, 2, 3, 4] for a in choices)
                  and any(a['destination'] == 2 for a in choices))
            saved_tribute = export_report(page, 'release18-tribute-report.json')
            check('the_intermediate_download_binds_proper_history_cost_and_build',
                  saved_tribute['buildId'] == build['buildId']
                  and len(saved_tribute['scenario']['actions']) == 4
                  and saved_tribute['scenario']['replay']['pass'] is True)
            final, revived_label = step(page, 'ACTIVATE_MONSTER_REBORN', sourceUid=reborn,
                                        targetUid=spirit, destination=2, position='ATTACK', noResponse=True)
            revived = cards(final, 0, 'monster', SPIRIT)[0]
            check('the_visible_revive_choice_names_own_graveyard_attack_and_main_zone_three',
                  'Activar Monster Reborn' in revived_label and 'Spirit with Eyes of Blue' in revived_label
                  and 'tu Cementerio' in revived_label and 'de Ataque' in revived_label
                  and 'zona principal 3' in revived_label)
            check('the_revived_copy_keeps_owner_and_proper_link_history_with_current_gy_origin',
                  revived['uid'] == spirit and revived['ownerPlayer'] == 0 and revived['zoneIndex'] == 2
                  and revived['position'] == 'ATTACK' and revived['summonType'] == 'SPECIAL'
                  and revived['summonOriginZone'] == 'gy' and revived['properlySummoned'] is True
                  and revived['properSummonType'] == 'LINK' and final['current']['extraHistory'] == ['LINK'])
            check('reborn_creates_no_second_link_only_search_or_pending_summon_trigger',
                  final['current']['pendingTriggers'] == [] and actions(page, 'SPIRIT_SEARCH_MAUSOLEUM') == []
                  and cards(final, 0, 'hand', MAUSOLEUM)[0]['uid'] == mausoleum
                  and sum(a['type'] == 'SPIRIT_SEARCH_MAUSOLEUM' for a in final['scenario']['actions']) == 1)
            check('revival_does_not_reset_either_spirit_once_per_turn_use',
                  final['current']['used']['SPIRIT_MAUSOLEUM'] is True
                  and final['current']['used']['SPIRIT_TRIBUTE'] is True
                  and actions(page, 'SPIRIT_TRIBUTE_BLUE_EYES') == [])
            check('revival_reinstates_the_live_dragon_restriction_without_spending_longyuan',
                  actions(page, 'LONGYUAN_SPECIAL') == []
                  and cards(final, 0, 'hand', LONGYUAN)[0]['uid'] == longyuan
                  and cards(final, 0, 'hand', ADHARA)[0]['uid'] == adhara)
            check('the_normal_spell_finishes_in_the_graveyard_without_material_or_normal_summon_charges',
                  cards(final, 0, 'gy', REBORN)[0]['uid'] == reborn
                  and final['scenario']['actions'][-1]['paid'] == []
                  and final['current']['normalSummonAvailable'][0] is False
                  and any(e['type'] == 'NORMAL_SPELL_RESOLUTION_CLEANUP' and e['uid'] == reborn
                          for e in final['scenario']['actions'][-1]['events']))
            check('the_advertised_goal_and_five_real_actions_have_a_fresh_passing_replay',
                  final['goalProgress']['achieved'] is True
                  and len(final['scenario']['actions']) == 5 and final['scenario']['replay']['pass'] is True
                  and final['current']['lp'] == [8000, 8000])
            saved_final = export_report(page, 'release18-final-report.json')
            check('the_final_download_preserves_the_same_physical_spirit_and_goal',
                  saved_final['current'] == final['current'] and saved_final['goalProgress']['achieved'] is True
                  and cards(saved_final, 0, 'monster', SPIRIT)[0]['uid'] == spirit)
            undone = undo_to(page, 4)
            check('undo_restores_the_graveyard_copy_reborn_in_hand_and_unrestricted_alternative',
                  cards(undone, 0, 'gy', SPIRIT)[0]['uid'] == spirit
                  and cards(undone, 0, 'hand', REBORN)[0]['uid'] == reborn
                  and undone['goalProgress']['achieved'] is False
                  and len(actions(page, 'LONGYUAN_SPECIAL')) > 0
                  and undone['scenario']['replay']['pass'] is True)
            imported = import_report(page, saved_final, True, 'spirit-reborn-final.json')
            check('import_reconstructs_five_actions_and_the_live_restriction_from_fresh_replay',
                  imported['current'] == saved_final['current'] and imported['scenario']['replay']['pass'] is True
                  and len(imported['scenario']['actions']) == 5 and actions(page, 'LONGYUAN_SPECIAL') == [])
            before_bad = report(page)
            for name in ['material', 'qualification', 'tribute_cost', 'revival_origin']:
                forged = copy.deepcopy(saved_final)
                if name == 'material':
                    forged['scenario']['actions'][1]['materialUids'] = [blue]
                elif name == 'qualification':
                    next(row for row in forged['scenario']['actions'][1]['after']['zones'][0]['monster']
                         if row['uid'] == spirit)['properSummonType'] = 'FUSION'
                elif name == 'tribute_cost':
                    forged['scenario']['actions'][3]['paid'][0]['to'] = 'hand'
                else:
                    next(row for row in forged['scenario']['actions'][4]['after']['zones'][0]['monster']
                         if row['uid'] == spirit)['summonOriginZone'] = 'extra'
                rejected = import_report(page, forged, False, 'forged-spirit-' + name + '.json')
                check('an_altered_' + name + '_is_rejected_without_replacing_the_active_route',
                      rejected == before_bad)
            page.set_viewport_size({'width': 390, 'height': 844})
            measurements = page.locator('#ygoAdvancedWorkbench').evaluate('''el=>{
              const r=el.getBoundingClientRect(),select=document.getElementById('ygoDuelActions'),button=document.getElementById('ygoDuelStep');
              return{left:r.left,right:r.right,selectHeight:select.getBoundingClientRect().height,
                buttonHeight:button.getBoundingClientRect().height,width:innerWidth};}''')
            check('the_spirit_guide_remains_readable_at_mobile_width_without_mutating_state',
                  measurements['left'] >= -1 and measurements['right'] <= measurements['width'] + 1
                  and measurements['selectHeight'] >= 44 and measurements['buttonHeight'] >= 44
                  and report(page) == before_bad, measurements)
        except Exception as error:
            check('the_visible_spirit_link_tribute_and_revival_guide_completes', False, str(error))
        check('release18_raises_no_javascript_page_errors', not errors, errors)
        version = browser.version
        browser.close()
    check('release18_leaves_the_compiled_artifact_unchanged', hashlib.sha256(artifact.read_bytes()).hexdigest() == digest)
    return {'schema': 'ygo-release18-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': digest, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'checks': checks, 'details': details,
            'browser': {'engine': 'chromium', 'version': version}, 'externalRequestsBlocked': len(blocked),
            'limitations': ['The Spirit Link procedure, physical tribute cost and Monster Reborn revival are executed and freshly replayed; no initial field assumes proper qualification.',
                            'Mausoleum search belongs to the genuine Link Summon. Revival does not create a new Link trigger or reset used effects.',
                            'Longyuan is inspected as a real available alternative without spending its source or discard; this is not a general priority or all-card certification.',
                            'Mobile width is emulated; competitive scoring remains provisional.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release18-browser-results.json')
    args = parser.parse_args()
    start = time.monotonic()
    result = run(args.url)
    result['elapsedSeconds'] = round(time.monotonic() - start, 2)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': result['pass'], 'checks': len(result['checks']),
                      'failed': [row['name'] for row in result['checks'] if not row['pass']]}))
    raise SystemExit(0 if result['pass'] else 1)

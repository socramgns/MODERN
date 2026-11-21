#!/usr/bin/env python3
"""R24 physical UI witnesses over the delivered standalone HTML, without injection.

All mutations use rendered controls. API reads identify physical copies and
inspect results; declared starting fields and unknown draws remain qualified.
"""
import argparse
import copy
import hashlib
import json
import os
from pathlib import Path
import shutil
import time

from playwright.sync_api import sync_playwright
from browser_offline import new_offline_page
from expanded_examples_browser import report
from release5_browser import load_example, ready
from release8_browser import cards

ROOT = Path(__file__).resolve().parents[1]
OLD_IDS = ['spark', 'spirit', 'invoked', 'swordsoul', 'branded', 'tenyi', 'salamangreat',
           'roar', 'crow', 'droll', 'field', 'trap', 'evacuation', 'shuffle', 'reborn',
           'synchro', 'azure', 'spirit-reborn', 'wolf-reborn', 'albaz', 'hayabusa', 'faith-flip',
           'priority-chain', 'simultaneous-triggers', 'xyz-corn', 'pendulum-metalfoes',
           'damage-step', 'draw-sequences']
NEW_IDS = ['branded-priority', 'tenyi-priority', 'salamangreat-priority', 'metalfoes-priority']
FISH, ALBAZ, DARK, BRANDED, LUBELLION, MIRRORJADE = 23771716, 68468459, 46986414, 44362883, 70534340, 44146295
ASHUNA, ADHARA, MONK, ASH = 87052196, 98159737, 32519092, 14558127
GAZELLE, SPINNY, ROAR = 26889158, 52277807, 51339637
GOLDRIVER, METAL_FUSION, ADAMANTE = 33256280, 73594093, 81612598


def locate(value, uid):
    for player, zones in enumerate(value['current']['zones']):
        for zone, rows in zones.items():
            for item in rows:
                if item['uid'] == uid:
                    return player, zone, item
    return None


def events(value):
    return [event for action in (value.get('scenario') or {}).get('actions', []) for event in action['events']]


def run(url=None, evidence_dir=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    document = artifact.read_bytes()
    digest = hashlib.sha256(document).hexdigest()
    assert digest == build['htmlSha256']
    evidence_dir = evidence_dir or ROOT / 'tests'
    evidence_dir.mkdir(parents=True, exist_ok=True)
    target = url or 'https://ygo-release24.test/Analizador_YuGiOh.html'
    checks, details, errors, blocked, exports = [], {}, [], [], []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    def section(name, function):
        try:
            function()
        except Exception as error:
            print(name, type(error).__name__ + ':', str(error), flush=True)
            check(name + '_completes', False, str(error))

    def actions(page, kind=None):
        return page.evaluate('kind=>YGOAdvancedWorkbench.actions().filter(a=>!kind||a.type===kind)', kind)

    def step(page, kind, **criteria):
        page.locator('#ygoDuelActionFilter').fill(kind)
        choice = page.evaluate('''({kind,criteria})=>{
          const state=YGOAdvancedWorkbench.snapshot().current,H=YGOComboEngine.helpers;
          const id=uid=>H.baseId(H.locate(state,uid)?.item);
          return YGOAdvancedWorkbench.actions().map((action,index)=>({action,index})).find(({action:a})=>
            a.type===kind&&Object.entries(criteria).every(([key,value])=>{
              if(key==='sourceCard')return id(a.sourceUid)===value;
              if(key==='resolutionCard')return id(a.resolutionChoice?.selectionUid)===value;
              if(key==='resolutionFusion')return id(a.resolutionChoice?.fusionUid)===value;
              if(key==='resolutionMaterials')return JSON.stringify((a.resolutionChoice?.materialUids||[]).map(id).sort((x,y)=>x-y))===JSON.stringify([...value].sort((x,y)=>x-y));
              if(key==='resolutionDestination')return a.resolutionChoice?.destination===value;
              if(key==='resolutionPosition')return a.resolutionChoice?.position===value;
              return JSON.stringify(a[key])===JSON.stringify(value);
            }))||null;}''', {'kind': kind, 'criteria': criteria})
        assert choice is not None, 'Missing rendered action ' + kind + ': ' + json.dumps(criteria)
        option = page.locator('#ygoDuelActions option[value="' + str(choice['index']) + '"]')
        assert option.count() == 1, 'Action absent from the visible selector: ' + kind
        label = option.inner_text()
        before = report(page)
        previous = len((before.get('scenario') or {}).get('actions', []))
        page.locator('#ygoDuelActions').select_option(str(choice['index']))
        page.locator('#ygoDuelStep').click()
        page.wait_for_function('''n=>(YGOAdvancedWorkbench.report().scenario?.actions.length||0)===n+1
          ||document.getElementById('ygoAdvancedStatus').textContent.startsWith('Transición rechazada:')''', arg=previous)
        result = report(page)
        assert result.get('scenario') and len(result['scenario']['actions']) == previous + 1, page.locator('#ygoAdvancedStatus').inner_text()
        assert result['scenario']['actions'][-1]['type'] == kind
        assert result['scenario']['replay']['pass'] is True
        assert result['competitiveScore'] is None and result['certified'] is False
        return result, label

    def seal(page):
        step(page, 'PRIORITY_PASS')
        step(page, 'PRIORITY_PASS')

    def settle(page):
        for _ in range(32):
            state = page.evaluate('()=>YGOAdvancedWorkbench.snapshot().current')
            assert not state.get('duel', {}).get('triggerOrder'), 'Choose trigger order explicitly'
            chain = state.get('duel', {}).get('priorityChain')
            if not chain:
                return report(page)
            step(page, 'PRIORITY_RESOLVE' if chain['stage'] == 'RESOLVE' else 'PRIORITY_PASS')
        raise AssertionError('Priority chain exceeded the witness budget')

    def export_report(page, suffix):
        with page.expect_download() as pending:
            page.locator('#ygoAdvancedExport').click()
        value = json.loads(Path(pending.value.path()).read_text())
        path = evidence_dir / ('release24-' + suffix + '-export.json')
        path.write_text(json.dumps(value, ensure_ascii=False) + '\n')
        exports.append(str(path))
        assert value['scenario']['replay']['pass'] is True
        assert value['competitiveScore'] is None and value['certified'] is False
        return value

    def import_report(page, value, accepted, suffix):
        page.locator('#ygoAdvancedImport').set_input_files({'name': suffix + '.json', 'mimeType': 'application/json',
                                                        'buffer': json.dumps(value).encode()})
        prefix = 'Informe reanudado:' if accepted else 'No completado:'
        page.wait_for_function('prefix=>document.getElementById("ygoAdvancedImport").value===""&&document.getElementById("ygoAdvancedStatus").textContent.startsWith(prefix)', arg=prefix)
        return report(page)

    with sync_playwright() as runtime:
        executable = os.environ.get('YGO_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
        browser = runtime.chromium.launch(executable_path=executable, headless=True, args=['--no-sandbox'])
        context = browser.new_context(viewport={'width': 1440, 'height': 1000}, accept_downloads=True)

        def deliver(route):
            if route.request.url == target:
                route.fulfill(status=200, content_type='text/html; charset=utf-8', body=document)
            else:
                blocked.append(route.request.url)
                route.abort()

        context.route('**/*', deliver)
        page = new_offline_page(context)
        page.on('pageerror', lambda error: errors.append(str(error)))
        response = page.goto(target, wait_until='domcontentloaded')
        ready(page)
        check('release24_boots_exact_delivered_bytes_offline_without_source_injection', response is not None
              and hashlib.sha256(response.body()).hexdigest() == digest
              and page.evaluate('()=>navigator.onLine===false&&YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        ids = page.locator('#ygoExampleSelect').evaluate('(el)=>[...el.options].map(x=>x.value)')
        check('thirty_two_visible_examples_preserve_the_existing_twenty_eight_in_order', ids == OLD_IDS + NEW_IDS, ids)
        check('reviewed_r24_modules_are_delivered', page.evaluate('''()=>!!(
          window.YGOPriorityFusions&&window.YGOPriorityExpandedResponses&&window.YGOCardProfilesExpanded&&window.YGOMetalfoesEffects)'''))

        def examples_load():
            for example_id in NEW_IDS:
                initial = load_example(page, example_id)
                assert initial['scenario'] is None and initial['competitiveScore'] is None
                assert initial['current']['context']['priorityMode'] is True
                assert initial['current']['context']['triggerOrderMode'] is True
                assert initial['current']['context']['initialHistoryCertified'] is False
                assert page.locator('#ygoExampleInstructions li').count() == 5
            check('four_new_examples_load_declared_physical_states_and_guides_without_autoplay', True)
        section('new_examples', examples_load)

        def data_evidence_export_flow():
            def preserved_state():
                return page.evaluate('''async()=>{
                  const bytes=new TextEncoder().encode(JSON.stringify(CARD_CATALOG));
                  const digest=await crypto.subtle.digest('SHA-256',bytes);
                  return {deck:JSON.stringify(deckState),catalogSha256:Array.from(new Uint8Array(digest),
                    byte=>byte.toString(16).padStart(2,'0')).join(''),
                    current:JSON.stringify(YGOAdvancedWorkbench.snapshot())};
                }''')
            before = preserved_state()
            panel = page.locator('#ygoDataQuality #ygoDataReviewLedger')
            if not panel.evaluate('(el)=>el.open'):
                panel.locator(':scope > summary').click()
            with page.expect_download() as pending:
                page.locator('#ygoDataEvidenceRequestExport').click()
            saved = json.loads(Path(pending.value.path()).read_text())
            path = evidence_dir / 'release24-exact-passcode-evidence-request.json'
            path.write_text(json.dumps(saved, ensure_ascii=False, indent=2) + '\n')
            exports.append(str(path))
            expected = page.evaluate('()=>YGODataQuality.dataEvidenceRequest()')
            check('rendered_evidence_export_preserves_98_exact_ids_and_51_32_review_counts_with_build_binding',
                  saved == expected and saved['schema'] == 'ygo-exact-id-evidence-request/v1'
                  and saved['binding']['buildId'] == build['buildId']
                  and saved['binding']['catalogSha256'] == build['catalogSha256']
                  and saved['binding']['sourceCommit'] == page.evaluate('()=>YGO_CATALOG_MANIFEST.sourceCommit')
                  and saved['counts'] == {'identities': 98, 'unknownMonsterStats': 51, 'migrationProposals': 32}
                  and len(saved['records']) == len({row['id'] for row in saved['records']}) == 98
                  and sum(bool(row['missingFields']) for row in saved['records']) == 51
                  and saved['officialIdentityCertified'] is False and saved['criteriaClosed'] == [])
            verified = page.evaluate('''value=>{
              const forged=structuredClone(value);forged.binding.catalogSha256='0'.repeat(64);
              return {valid:YGODataQuality.verifyDataEvidenceRequest(value),
                forged:YGODataQuality.verifyDataEvidenceRequest(forged)};
            }''', saved)
            check('evidence_export_and_forged_binding_validation_preserve_the_deck_catalogue_and_lab',
                  verified['valid']['pass'] is True and verified['forged']['pass'] is False
                  and verified['forged']['status'] == 'EVIDENCE_REQUEST_REJECTED'
                  and verified['forged']['previousPreserved'] is True
                  and saved['originalCatalogueChanged'] is False and saved['activeDeckChanged'] is False
                  and preserved_state() == before)
        section('exact_passcode_evidence_export_flow', data_evidence_export_flow)

        def branded_flow():
            initial = load_example(page, 'branded-priority')
            spell = cards(initial, 0, 'hand', BRANDED)[0]['uid']
            albaz = cards(initial, 0, 'deck', ALBAZ)[0]['uid']
            dark = cards(initial, 0, 'deck', DARK)[0]['uid']
            discard = cards(initial, 0, 'hand', FISH)[0]['uid']
            pending, _ = step(page, 'PRIORITY_ACTIVATE', effectId='BRANDED_FUSION_LUBELLION', sourceUid=spell)
            check('native_branded_activation_leaves_both_materials_in_deck_until_resolution',
                  locate(pending, albaz)[1] == locate(pending, dark)[1] == 'deck'
                  and pending['scenario']['actions'][-1]['paid'] == []
                  and len(pending['current']['duel']['priorityChain']['links']) == 1)
            seal(page)
            summoned, _ = step(page, 'PRIORITY_RESOLVE', resolutionFusion=LUBELLION,
                               resolutionMaterials=[ALBAZ, DARK], resolutionDestination=0, resolutionPosition='DEFENSE')
            check('native_branded_resolution_physically_sends_deck_materials_and_opens_lubellion_trigger',
                  locate(summoned, albaz)[1] == 'gy' and cards(summoned, 0, 'gy', DARK)
                  and cards(summoned, 0, 'monster', LUBELLION)[0]['properSummonType'] == 'FUSION'
                  and summoned['current']['duel'].get('triggerOrder'))
            paid, _ = step(page, 'TRIGGER_ORDER_ACTIVATE', effectId='PRIORITY_LUBELLION_FUSION_MIRRORJADE', discardUid=discard)
            check('lubellion_discards_a_real_copy_before_its_pending_fusion_resolves',
                  locate(paid, discard)[1] == 'gy' and cards(paid, 0, 'monster', LUBELLION)
                  and not cards(paid, 0, 'monster', MIRRORJADE)
                  and any(row.get('uid') == discard and row['kind'] == 'DISCARD' for row in paid['scenario']['actions'][-1]['paid']))
            saved = export_report(page, 'lubellion-paid-pending')
            page.locator('#ygoDuelUndo').click()
            check('undo_reverts_lubellion_cost_and_restores_its_optional_trigger',
                  locate(report(page), discard)[1] == 'hand')
            restored = import_report(page, saved, True, 'lubellion-paid-pending')
            check('pending_report_reexecutes_the_paid_discard_and_restores_priority',
                  restored['current'] == paid['current'] and locate(restored, discard)[1] == 'gy')
            before = json.dumps(report(page), sort_keys=True)
            forged = copy.deepcopy(saved)
            forged['scenario']['actions'][-1]['paid'][0]['uid'] = 'INVENTED_LUBELLION_COST'
            import_report(page, forged, False, 'forged-lubellion-cost')
            check('forged_lubellion_cost_report_is_rejected_without_replacing_the_lab',
                  json.dumps(report(page), sort_keys=True) == before)
            seal(page)
            final, _ = step(page, 'PRIORITY_RESOLVE', resolutionFusion=MIRRORJADE,
                           resolutionMaterials=[ALBAZ, LUBELLION], resolutionDestination=1, resolutionPosition='ATTACK')
            final = settle(page)
            check('two_native_fusions_reach_mirrorjade_with_recycled_materials_and_provisional_score',
                  final['goalProgress']['achieved'] is True and cards(final, 0, 'extra', LUBELLION)
                  and locate(final, albaz)[1] == 'deck' and locate(final, discard)[1] == 'gy'
                  and any(lock['kind'] == 'FUSION_ONLY' for lock in final['current']['locks'])
                  and len([e for e in events(final) if e['type'] == 'FUSION_SUMMON']) == 2
                  and final['scenario']['replay']['pass'] is True and final['competitiveScore'] is None)
            export_report(page, 'native-branded-resolved')
        section('native_branded_flow', branded_flow)

        def tenyi_flow():
            initial = load_example(page, 'tenyi-priority')
            ashuna = cards(initial, 0, 'gy', ASHUNA)[0]['uid']
            ash = cards(initial, 1, 'hand', ASH)[0]['uid']
            paid, _ = step(page, 'PRIORITY_ACTIVATE', effectId='TENYI_ASHUNA_DECK', sourceUid=ashuna)
            check('native_gy_ashuna_banish_cost_is_paid_before_any_deck_selection',
                  locate(paid, ashuna)[1] == 'banished' and not cards(paid, 0, 'monster', ADHARA)
                  and paid['current']['duel']['priorityChain']['links'][0]['activationOrigin']['zone'] == 'gy')
            response, _ = step(page, 'PRIORITY_ACTIVATE', effectId='ASH_BLOSSOM', sourceUid=ash)
            check('native_ash_response_pays_its_own_discard_while_the_chain_is_pending',
                  locate(response, ash)[1] == 'gy' and locate(response, ashuna)[1] == 'banished'
                  and len(response['current']['duel']['priorityChain']['links']) == 2)
            final = settle(page)
            resolutions = [e for e in events(final) if e['type'] == 'PRIORITY_LINK_RESOLVED']
            check('ash_negates_ashuna_effect_lifo_without_refunding_costs_or_applying_wyrm_lock',
                  [e['effectId'] for e in resolutions] == ['ASH_BLOSSOM', 'TENYI_ASHUNA_DECK']
                  and locate(final, ash)[1] == 'gy' and locate(final, ashuna)[1] == 'banished'
                  and not cards(final, 0, 'monster', ADHARA)
                  and not any(lock['kind'] == 'WYRM_ONLY' for lock in final['current']['locks'])
                  and final['goalProgress']['achieved'] is False)
            export_report(page, 'native-ashuna-negated')
            load_example(page, 'tenyi-priority')
            step(page, 'PRIORITY_ACTIVATE', effectId='TENYI_ASHUNA_DECK')
            seal(page)
            step(page, 'PRIORITY_RESOLVE', resolutionCard=ADHARA, resolutionDestination=0)
            completed = settle(page)
            check('ashuna_without_response_selects_adhara_only_at_resolution_and_applies_wyrm_lock',
                  completed['goalProgress']['achieved'] is True and cards(completed, 0, 'monster', MONK)
                  and cards(completed, 0, 'monster', ADHARA)
                  and any(lock['kind'] == 'WYRM_ONLY' for lock in completed['current']['locks']))
            export_report(page, 'native-ashuna-resolved')
        section('native_tenyi_response_flow', tenyi_flow)

        def salamangreat_flow():
            initial = load_example(page, 'salamangreat-priority')
            spinny = cards(initial, 0, 'hand', SPINNY)[0]['uid']
            step(page, 'DUEL_EXPANDED_NORMAL_SUMMON', sourceCard=GAZELLE)
            triggered, _ = step(page, 'TRIGGER_ORDER_ACTIVATE', effectId='SALAMANGREAT_GAZELLE_SEND')
            check('normal_gazelle_uses_a_real_optional_trigger_and_keeps_roar_in_deck_until_resolved',
                  cards(triggered, 0, 'deck', ROAR) and not cards(triggered, 0, 'gy', ROAR))
            seal(page)
            step(page, 'PRIORITY_RESOLVE', resolutionCard=ROAR)
            settled = settle(page)
            gazelle = cards(settled, 0, 'monster', GAZELLE)[0]['uid']
            paid, _ = step(page, 'PRIORITY_ACTIVATE', effectId='SALAMANGREAT_SPINNY_DISCARD', targetUid=gazelle)
            check('spinny_discard_is_paid_before_its_atk_gain_resolves',
                  locate(paid, spinny)[1] == 'gy' and not locate(paid, gazelle)[2].get('currentAtk')
                  and cards(paid, 0, 'gy', ROAR))
            boosted = settle(page)
            check('spinny_grants_exactly_five_hundred_atk_after_explicit_passes_and_resolution',
                  locate(boosted, gazelle)[2]['currentAtk'] == 2000)
            step(page, 'PRIORITY_ACTIVATE', effectId='SALAMANGREAT_SPINNY_REVIVE', sourceUid=spinny)
            check('spinny_gy_revival_does_not_admit_ash_as_a_deck_summon_response',
                  not any(a.get('effectId') == 'ASH_BLOSSOM' for a in actions(page, 'PRIORITY_ACTIVATE')))
            seal(page)
            step(page, 'PRIORITY_RESOLVE', resolutionDestination=1)
            final = settle(page)
            check('spinny_revives_the_same_copy_and_retains_its_leave_field_banish_rule',
                  locate(final, spinny)[:2] == (0, 'monster')
                  and locate(final, spinny)[2]['leaveFieldRedirect'] == 'banished'
                  and final['goalProgress']['achieved'] is True and final['scenario']['replay']['pass'] is True)
            export_report(page, 'native-salamangreat-resolved')
        section('native_salamangreat_flow', salamangreat_flow)

        def metalfoes_flow():
            initial = load_example(page, 'metalfoes-priority')
            fusion = cards(initial, 0, 'hand', METAL_FUSION)[0]['uid']
            gold = cards(initial, 0, 'hand', GOLDRIVER)[0]['uid']
            fish = cards(initial, 0, 'hand', FISH)[0]['uid']
            pending, _ = step(page, 'PRIORITY_ACTIVATE', effectId='METALFOES_FUSION', sourceUid=fusion)
            check('metalfoes_fusion_keeps_both_materials_in_hand_during_response_window',
                  locate(pending, gold)[1] == locate(pending, fish)[1] == 'hand'
                  and pending['scenario']['actions'][-1]['paid'] == [])
            seal(page)
            step(page, 'PRIORITY_RESOLVE', resolutionFusion=ADAMANTE,
                 resolutionMaterials=[GOLDRIVER, FISH], resolutionDestination=0, resolutionPosition='ATTACK')
            final = settle(page)
            check('metalfoes_resolution_uses_two_real_hand_materials_and_properly_fusion_summons_adamante',
                  all(locate(final, uid)[1] == 'gy' for uid in [fusion, gold, fish])
                  and cards(final, 0, 'monster', ADAMANTE)[0]['properSummonType'] == 'FUSION'
                  and final['goalProgress']['achieved'] is True and final['competitiveScore'] is None)
            saved = export_report(page, 'metalfoes-fusion-resolved')
            restored = import_report(page, saved, True, 'metalfoes-fusion-resolved')
            check('metalfoes_export_replays_exact_physical_material_destinations', restored['current'] == final['current'])
            before_hand = [row['uid'] for row in restored['current']['zones'][0]['hand']]
            step(page, 'PRIORITY_ACTIVATE', effectId='METALFOES_FUSION_GY_DRAW')
            seal(page)
            pending = report(page)
            pending_draw = page.evaluate('()=>YGOMetalfoesEffects.pendingDraw(YGOAdvancedWorkbench.snapshot().current)')
            check('shuffled_unknown_draw_stays_pending_without_inventing_an_observed_card',
                  pending_draw and pending_draw['observedDraw'] is False
                  and not actions(page, 'PRIORITY_RESOLVE')
                  and locate(pending, fusion)[1] == 'gy'
                  and [row['uid'] for row in pending['current']['zones'][0]['hand']] == before_hand
                  and pending['goalProgress']['achieved'] is False
                  and pending['scenario']['replay']['pass'] is True)
            export_report(page, 'metalfoes-unknown-draw-pending')
        section('native_metalfoes_flow', metalfoes_flow)
        check('release24_ui_flows_have_no_javascript_page_errors', not errors, errors)
        version = browser.version
        browser.close()
    check('delivered_html_is_unchanged_during_release24_browser_test', hashlib.sha256(artifact.read_bytes()).hexdigest() == digest)
    return {'schema': 'ygo-release24-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': digest, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'servedBytesSha256': digest,
            'browser': {'engine': 'chromium', 'engineVersion': version},
            'checks': checks, 'details': details, 'externalRequestsBlocked': len(blocked),
            'exports': exports,
            'limitations': ['Declared initial fields are assumptions; only subsequent rendered-control actions are replay witnesses.',
                'Exact offline delivered bytes do not establish file navigation, physical device use or real assistive technology.',
                'Finite registered recipes and reviewed profiles do not certify all card effects or official TCG rulings.',
                'Unknown shuffled draws remain pending; no competitive score or win rate is certified.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release24-browser-results.json')
    parser.add_argument('--evidence-dir', type=Path)
    args = parser.parse_args()
    started = time.monotonic()
    result = run(args.url, args.evidence_dir)
    result['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': result['pass'], 'checks': len(result['checks']),
                      'failed': [row['name'] for row in result['checks'] if not row['pass']],
                      'artifactMode': result['artifactMode']}, ensure_ascii=False))
    raise SystemExit(0 if result['pass'] else 1)

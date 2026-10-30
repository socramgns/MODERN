#!/usr/bin/env python3
"""Delivered-byte tasks for Monster Reborn and reviewed deck-copy exports."""
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
ACTION = 'ACTIVATE_MONSTER_REBORN'
REBORN, BEWD, MECHABA, ROAR, CED, INVOCATION = 83764718, 89631139, 75286621, 51339637, 94192409, 74063034


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    html = artifact.read_bytes()
    digest = hashlib.sha256(html).hexdigest()
    assert digest == build['htmlSha256']
    target = url or 'https://ygo-release15.test/Analizador_YuGiOh.html'
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
            if(key==='responseType')return (a.response?.type??null)===value;
            if(key==='counterCount')return (a.counterResponses||[]).length===value;
            if(key==='responseCostUid')return a.response?.costUid===value;
            return a[key]===value;
          }))||null''', {'kind': kind, 'criteria': criteria})
        assert chosen is not None, 'No registered action: ' + kind + ' ' + str(criteria)
        option = page.locator('#ygoDuelActions option[value="' + str(chosen['index']) + '"]')
        label = option.inner_text()
        if kind == ACTION:
            assert 'Activar Monster Reborn' in label
            assert 'Cementerio' in label
            assert ('de Defensa' if criteria.get('position') == 'DEFENSE' else 'de Ataque') in label
            assert 'zona principal ' + str(criteria['destination'] + 1) in label
        count = len((report(page).get('scenario') or {}).get('actions', []))
        page.locator('#ygoDuelActions').select_option(str(chosen['index']))
        page.locator('#ygoDuelStep').click()
        page.wait_for_function('n=>YGOAdvancedWorkbench.report().scenario?.actions.length===n', arg=count + 1)
        value = report(page)
        assert value['scenario']['replay']['pass'] is True
        assert value['scenario']['actions'][-1]['targetUid'] == criteria['targetUid']
        return value, label

    def import_report(page, value, accepted, name):
        page.locator('#ygoAdvancedImport').set_input_files({
            'name': name, 'mimeType': 'application/json', 'buffer': json.dumps(value).encode()})
        prefix = 'Informe reanudado:' if accepted else 'No completado:'
        page.wait_for_function('prefix=>document.getElementById("ygoAdvancedImport").value===""&&document.getElementById("ygoAdvancedStatus").textContent.startsWith(prefix)', arg=prefix)
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
        page.wait_for_function('()=>window.YGODeckIdentityReview&&YGOComboEngine.capabilities().handlers.includes("ACTIVATE_MONSTER_REBORN")')
        page.evaluate('async()=>{await YGODataQuality.ready;await YGODeckIdentityReview.ready}')
        check('release15_uses_manifest_bound_bytes_offline', response is not None
              and hashlib.sha256(response.body()).hexdigest() == digest
              and page.evaluate('()=>navigator.onLine===false&&YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        expected_ids = ['spark', 'spirit', 'invoked', 'swordsoul', 'branded', 'tenyi', 'salamangreat',
                        'roar', 'crow', 'droll', 'field', 'trap', 'evacuation', 'shuffle', 'reborn']
        check('fifteen_examples_preserve_all_fourteen_previous_identifiers',
              page.locator('#ygoExampleSelect').evaluate('(el)=>[...el.options].map(o=>o.value)') == expected_ids)
        capabilities = page.evaluate('()=>({core:YGOComboEngine.capabilities(),responses:YGOResponses.capabilities()})')
        check('reborn_is_the_fourth_registered_normal_spell_with_its_real_identity',
              len(capabilities['core']['normalSpellActivations']) == 4
              and any(row['type'] == ACTION and row['cardId'] == REBORN for row in capabilities['core']['normalSpellActivations'])
              and len(capabilities['responses']['mechabaNormalSpellActivations']) == 4
              and ACTION in capabilities['responses']['mechabaNormalSpellActivations'])
        try:
            initial = load_example(page, 'reborn')
            source_uid = cards(initial, 0, 'hand', REBORN)[0]['uid']
            own_uid = cards(initial, 0, 'gy', BEWD)[0]['uid']
            rival_uid = cards(initial, 1, 'gy', BEWD)[0]['uid']
            cost_uid = cards(initial, 1, 'hand', INVOCATION)[0]['uid']
            roar_uid = cards(initial, 0, 'spelltrap', ROAR)[0]['uid']
            ced_uid = cards(initial, 0, 'spelltrap', CED)[0]['uid']
            mechaba_uid = cards(initial, 1, 'monster', MECHABA)[0]['uid']
            check('reborn_loads_a_physical_declared_field_without_autoplay_or_goal_success',
                  initial['scenario'] is None and initial['current']['turn'] == 2
                  and initial['current']['phase'] == 'MAIN 1'
                  and initial['goalProgress']['achieved'] is False
                  and len(initial['current']['zones'][0]['hand']) == 5
                  and initial['competitiveScore'] is None)
            returned, label = step(page, ACTION, sourceUid=source_uid, targetUid=own_uid,
                                   destination=0, position='DEFENSE', responseType='MECHABA',
                                   responseCostUid=cost_uid, counterCount=1)
            action = returned['scenario']['actions'][-1]
            packet = action['proof']['normalSpellActivation']
            check('the_visible_choice_identifies_the_own_graveyard_position_and_destination',
                  'desde tu Cementerio' in label and 'de Defensa' in label and 'zona principal 1' in label)
            revived = cards(returned, 0, 'monster', BEWD)[0]
            check('roar_allows_the_same_own_monster_to_revive_in_defense',
                  revived['uid'] == own_uid and revived['ownerPlayer'] == 0
                  and revived['faceUp'] is True and revived['position'] == 'DEFENSE'
                  and revived['zoneIndex'] == 0
                  and cards(returned, 1, 'gy', BEWD)[0]['uid'] == rival_uid)
            check('the_real_matching_spell_cost_and_both_own_spell_traps_stay_paid',
                  cards(returned, 1, 'gy', INVOCATION)[0]['uid'] == cost_uid
                  and cards(returned, 1, 'gy', MECHABA)[0]['uid'] == mechaba_uid
                  and cards(returned, 0, 'gy', REBORN)[0]['uid'] == source_uid
                  and cards(returned, 0, 'gy', ROAR)[0]['uid'] == roar_uid
                  and any(row.get('uid') == cost_uid and row['kind'] == 'SEND_GY' for row in action['paid'])
                  and not any(row.get('uid') == source_uid for row in action['paid']))
            check('normal_spell_transport_records_its_source_before_responses',
                  packet['kind'] == 'NORMAL_SPELL_CARD_ACTIVATION' and packet['cardId'] == REBORN
                  and packet['sourceUid'] == source_uid and packet['player'] == 0
                  and packet['originZone'] == 'hand' and packet['activationZone'] == 'spelltrap'
                  and action['proof']['activationNegated'] is False
                  and action['proof']['registeredResponseChain']['firstResponseNegated'] is True)
            check('revival_achieves_the_field_goal_without_spending_a_normal_summon',
                  returned['goalProgress']['achieved'] is True
                  and page.locator('#ygoDuelGoalProgress').get_attribute('data-state') == 'achieved'
                  and returned['current']['normalSummonAvailable'] == initial['current']['normalSummonAvailable']
                  and returned['current']['lp'] == initial['current']['lp']
                  and returned['scenario']['replay']['pass'] is True)
            with page.expect_download() as pending:
                page.locator('#ygoAdvancedExport').click()
            saved = json.loads(Path(pending.value.path()).read_text())
            check('the_saved_revival_report_is_bound_to_the_target_cost_and_build',
                  saved['buildId'] == build['buildId'] and saved['scenario']['replay']['pass'] is True
                  and saved['scenario']['actions'][0]['targetUid'] == own_uid
                  and saved['scenario']['actions'][0]['response']['costUid'] == cost_uid)
            undone = undo_to(page, 0)
            check('undo_restores_the_original_graveyards_set_trap_and_unpaid_response',
                  undone['scenario'] is None and undone['goalProgress']['achieved'] is False
                  and cards(undone, 0, 'gy', BEWD)[0]['uid'] == own_uid
                  and cards(undone, 1, 'gy', BEWD)[0]['uid'] == rival_uid
                  and cards(undone, 0, 'hand', REBORN)[0]['uid'] == source_uid
                  and cards(undone, 0, 'spelltrap', ROAR)[0]['uid'] == roar_uid
                  and cards(undone, 1, 'hand', INVOCATION)[0]['uid'] == cost_uid)
            negated, _ = step(page, ACTION, sourceUid=source_uid, targetUid=own_uid,
                              destination=0, position='DEFENSE', responseType='MECHABA',
                              responseCostUid=cost_uid, counterCount=0)
            check('negating_reborn_keeps_the_monster_in_its_graveyard_and_the_spell_cost_paid',
                  cards(negated, 0, 'gy', BEWD)[0]['uid'] == own_uid
                  and cards(negated, 0, 'banished', REBORN)[0]['uid'] == source_uid
                  and cards(negated, 1, 'gy', INVOCATION)[0]['uid'] == cost_uid
                  and cards(negated, 0, 'spelltrap', ROAR)[0]['uid'] == roar_uid
                  and not cards(negated, 0, 'monster', BEWD)
                  and negated['scenario']['actions'][0]['proof']['activationNegated'] is True
                  and negated['goalProgress']['achieved'] is False)
            undo_to(page, 0)
            controlled, rival_label = step(page, ACTION, sourceUid=source_uid, targetUid=rival_uid,
                                           destination=2, position='ATTACK', responseType=None, counterCount=0)
            borrowed = cards(controlled, 0, 'monster', BEWD)[0]
            check('reviving_the_rival_monster_changes_control_and_preserves_its_real_owner',
                  borrowed['uid'] == rival_uid and borrowed['ownerPlayer'] == 1
                  and borrowed['zoneIndex'] == 2 and borrowed['position'] == 'ATTACK'
                  and 'Cementerio rival' in rival_label
                  and 'propietario: jugador 2' in page.locator('#ygoDuelBoard').inner_text()
                  and not cards(controlled, 1, 'gy', BEWD)
                  and cards(controlled, 1, 'hand', INVOCATION)[0]['uid'] == cost_uid)
            back, _ = step(page, 'ACTIVATE_COMPULSORY_EVACUATION_DEVICE', sourceUid=ced_uid,
                           targetUid=rival_uid, player=0, column=2, responseType=None, counterCount=0)
            check('a_registered_revival_then_compulsory_returns_to_the_original_rival_owner',
                  not cards(back, 0, 'monster', BEWD) and not cards(back, 0, 'hand', BEWD)
                  and cards(back, 1, 'hand', BEWD)[0]['uid'] == rival_uid
                  and cards(back, 1, 'hand', BEWD)[0]['ownerPlayer'] == 1
                  and cards(back, 0, 'gy', BEWD)[0]['uid'] == own_uid
                  and cards(back, 0, 'gy', CED)[0]['uid'] == ced_uid
                  and back['goalProgress']['achieved'] is False
                  and len(back['scenario']['actions']) == 2
                  and back['scenario']['replay']['pass'] is True)
            replayed = import_report(page, saved, True, 'reborn-replay.json')
            check('a_saved_revival_reimports_with_fresh_replay_and_the_same_physical_target',
                  replayed['scenario']['replay']['pass'] is True
                  and cards(replayed, 0, 'monster', BEWD)[0]['uid'] == own_uid
                  and replayed['goalProgress']['achieved'] is True)
            before_bad = report(page)
            for name, mutate in [
                ('target', lambda value: value['scenario']['actions'][0].__setitem__('targetUid', rival_uid)),
                ('cost', lambda value: value['scenario']['actions'][0]['response'].__setitem__('costUid', 'invented')),
                ('history', lambda value: value['current']['zones'][0]['monster'][-1].__setitem__('properlySummoned', not value['current']['zones'][0]['monster'][-1].get('properlySummoned', False))),
            ]:
                forged = copy.deepcopy(saved)
                mutate(forged)
                rejected = import_report(page, forged, False, 'forged-reborn-' + name + '.json')
                check('an_altered_' + name + '_is_rejected_without_replacing_the_active_revival', rejected == before_bad)
            page.set_viewport_size({'width': 390, 'height': 844})
            check('revival_controls_remain_inside_a_mobile_width_without_changing_the_route',
                  page.evaluate('()=>document.documentElement.scrollWidth<=innerWidth')
                  and report(page) == before_bad)
            page.set_viewport_size({'width': 1440, 'height': 1000})
        except Exception as error:
            check('the_visible_revival_guide_and_its_saved_routes_complete', False, str(error))

        try:
            # Choose an actual shipped review candidate with a Main-compatible
            # source and target; no identity mapping is invented by this test.
            fixture = page.evaluate('''()=>{
              const Q=YGODataQuality.report(),C=YGODataCatalog,extra=0x40|0x2000|0x800000|0x4000000;
              const row=Q.migrationProposals.find(r=>(r.typeBits&1)&&!(r.typeBits&(extra|0x4000|0x1000000))
                &&r.candidates.some(c=>{const t=Number(C.rulesCard(c.id)?.typeBits);return(t&1)&&!(t&(extra|0x4000|0x1000000))}));
              if(!row)throw Error('No real Main identity candidate');
              const candidate=row.candidates.find(c=>{const t=Number(C.rulesCard(c.id)?.typeBits);return(t&1)&&!(t&(extra|0x4000|0x1000000))});
              const main=[{id:row.id,qty:1}],normal=[23771716,47372349,97127906,70924884,64428736,99785935,17968114,42431843,43230671,89904598,85639257,75889523,48202661,89386122,67371383];
              let left=39;for(const id of normal){if(!left)break;if(id===row.id||id===candidate.id)continue;const qty=Math.min(3,left);main.push({id,qty});left-=qty;}
              if(left)throw Error('Review diagnostic filler incomplete');
              return{fromId:row.id,toId:candidate.id,sourceName:row.name,targetName:candidate.name,
                value:{schema:'ygo-format-deck/v1',name:'Diagnóstico de identidad revisada',fmt:'TCG',formatContext:YGOUIState.getFormatContext(),deckState:{main,extra:[],side:[],skills:[]}}};
            }''')
            page.locator('#ygoFormatFile').set_input_files({
                'name': 'legacy-identity-review.json', 'mimeType': 'application/json',
                'buffer': json.dumps(fixture['value']).encode()})
            page.wait_for_function("""id=>deckState.main.some(c=>c.id===id)&&[...(document.getElementById('ygoDeckIdentityRows')?.querySelectorAll('select')||[])].some(el=>Number(el.dataset.identityFrom)===id)""", arg=fixture['fromId'])
            source_deck = page.evaluate('()=>YGOFormatEditor.export()')
            source_lab = report(page)
            panel = page.locator('#ygoDeckIdentityReview')
            for owner in panel.locator('xpath=ancestor-or-self::details').all():
                if not owner.evaluate('(el)=>el.open'):
                    owner.locator(':scope > summary').click()
            for owner in panel.locator('details').all():
                if not owner.evaluate('(el)=>el.open'):
                    owner.locator(':scope > summary').click()
            selector = panel.locator('select[data-identity-from="' + str(fixture['fromId']) + '"]')
            assert selector.is_visible(), 'The identity choice must be opened through its visible summary'
            check('the_review_tool_preserves_the_legacy_passcode_by_default', selector.input_value() == 'keep'
                  and page.evaluate('()=>YGOFormatEditor.export()') == source_deck
                  and report(page) == source_lab)
            selector.select_option(str(fixture['toId']))
            page.wait_for_function('()=>YGODeckIdentityReview.report()!==null')
            copy_report = page.evaluate('()=>YGODeckIdentityReview.report()')
            check('selecting_a_real_candidate_prepares_a_detached_copy_without_mutating_the_deck',
                  any(row['id'] == fixture['toId'] and row['qty'] == 1 for row in copy_report['deckState']['main'])
                  and not any(row['id'] == fixture['fromId'] for row in copy_report['deckState']['main'])
                  and sum(row['qty'] for row in copy_report['deckState']['main']) == 40
                  and page.evaluate('()=>YGOFormatEditor.export()') == source_deck
                  and report(page) == source_lab)
            with page.expect_download() as pending:
                page.locator('#ygoDeckIdentityDownload').click()
            copied = json.loads(Path(pending.value.path()).read_text())
            check('the_review_download_preserves_all_counts_format_and_context',
                  copied['deckState'] == copy_report['deckState']
                  and copied['fmt'] == source_deck['fmt']
                  and copied['formatContext'] == source_deck['formatContext']
                  and copied['identityReview']['binding']['buildId'] == build['buildId'])
            page.locator('#ygoDeckIdentityRefresh').click()
            check('an_unchanged_refresh_preserves_the_explicit_identity_choice',
                  selector.input_value() == str(fixture['toId'])
                  and page.evaluate('()=>YGODeckIdentityReview.report()') == copy_report)
            rejection = page.evaluate('''value=>{const bad=structuredClone(value);bad.deckState.main[0].qty++;
              return YGODeckIdentityReview.verify(bad,{source:YGODeckIdentityReview.captureSource()})}''', copied)
            check('an_altered_copy_quantity_is_rejected_against_the_current_source',
                  rejection['pass'] is False and page.evaluate('()=>YGOFormatEditor.export()') == source_deck
                  and report(page) == source_lab)
            importing = browser.new_context(accept_downloads=True)
            importing.route('**/*', deliver)
            importing.set_offline(True)
            other = importing.new_page()
            other.on('pageerror', lambda error: errors.append(str(error)))
            other.goto(target, wait_until='domcontentloaded')
            ready(other)
            other.locator('#ygoFormatFile').set_input_files({
                'name': 'reviewed-copy-roundtrip.json', 'mimeType': 'application/json',
                'buffer': json.dumps(copied).encode()})
            other.wait_for_function('({toId,fromId})=>deckState.main.some(c=>c.id===toId)&&!deckState.main.some(c=>c.id===fromId)',
                                    arg={'toId': fixture['toId'], 'fromId': fixture['fromId']})
            imported_copy = other.evaluate('()=>YGOFormatEditor.export()')
            check('the_existing_json_importer_accepts_the_reviewed_copy_in_a_separate_session',
                  imported_copy['deckState'] == copied['deckState']
                  and imported_copy['formatContext'] == copied['formatContext']
                  and imported_copy['fmt'] == copied['fmt']
                  and page.evaluate('()=>YGOFormatEditor.export()') == source_deck
                  and report(page) == source_lab)
            importing.close()
            source_change = copy.deepcopy(fixture['value'])
            source_change['deckState']['main'][0]['qty'] = 2
            source_change['deckState']['main'][1]['qty'] -= 1
            page.locator('#ygoFormatFile').set_input_files({
                'name': 'changed-review-source.json', 'mimeType': 'application/json',
                'buffer': json.dumps(source_change).encode()})
            page.wait_for_function('id=>deckState.main.find(c=>c.id===id)?.qty===2&&YGODeckIdentityReview.report()===null', arg=fixture['fromId'])
            check('a_changed_source_invalidates_the_old_proposal_and_selection',
                  panel.locator('select[data-identity-from="' + str(fixture['fromId']) + '"]').input_value() == 'keep'
                  and page.locator('#ygoDeckIdentityDownload').is_disabled())
        except Exception as error:
            check('the_reviewed_copy_flow_completes_without_silent_migration', False, str(error))
        check('release15_tasks_raise_no_javascript_page_errors', not errors, errors)
        version = browser.version
        browser.close()
    check('release15_leaves_the_compiled_artifact_unchanged', hashlib.sha256(artifact.read_bytes()).hexdigest() == digest)
    return {'schema': 'ygo-release15-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': digest, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'checks': checks, 'details': details,
            'browser': {'engine': 'chromium', 'version': version}, 'externalRequestsBlocked': len(blocked),
            'limitations': ['Initial fields and graveyards are declared; Extra resurrection history is exercised separately by source-level tests.',
                            'The registered Reborn and Compulsory route verifies physical ownership without certifying general control-changing effects.',
                            'Reviewed identity candidates come from the technical catalogue and require user selection; exports do not certify official identity or competitive legality.',
                            'Viewport checks are emulated and competitive scoring remains provisional.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release15-browser-results.json')
    args = parser.parse_args()
    start = time.monotonic()
    result = run(args.url)
    result['elapsedSeconds'] = round(time.monotonic() - start, 2)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': result['pass'], 'checks': len(result['checks']),
                      'failed': [row['name'] for row in result['checks'] if not row['pass']]}))
    raise SystemExit(0 if result['pass'] else 1)

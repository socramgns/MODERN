#!/usr/bin/env python3
"""Delivered-byte UI tasks for Compulsory's returns and physical response costs."""
import argparse
import copy
import hashlib
import json
import os
from pathlib import Path
import shutil
import time

from playwright.sync_api import sync_playwright
from expanded_examples_browser import execute_step, report
from release5_browser import load_example, ready
from release8_browser import cards, undo_to

ROOT = Path(__file__).resolve().parents[1]
ACTION = 'ACTIVATE_COMPULSORY_EVACUATION_DEVICE'
CED, ROAR, WOLF = 94192409, 51339637, 87871125
MECHABA, SPARK, BEWD = 75286621, 83994433, 89631139


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    html = artifact.read_bytes()
    html_hash = hashlib.sha256(html).hexdigest()
    assert html_hash == build['htmlSha256']
    target = url or 'https://ygo-release13.test/Analizador_YuGiOh.html'
    checks, details, errors, blocked = [], {}, [], []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    def import_report(page, value, filename):
        page.locator('#ygoAdvancedImport').set_input_files({
            'name': filename, 'mimeType': 'application/json',
            'buffer': json.dumps(value).encode()})
        page.wait_for_function('''()=>document.getElementById('ygoAdvancedStatus').textContent
          .startsWith('Informe reanudado:')''')
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
        check('release13_boots_offline_from_the_same_manifest_bound_html', response is not None
              and hashlib.sha256(response.body()).hexdigest() == html_hash
              and page.evaluate('()=>navigator.onLine===false&&YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        expected_ids = ['spark', 'spirit', 'invoked', 'swordsoul', 'branded', 'tenyi', 'salamangreat',
                        'roar', 'crow', 'droll', 'field', 'trap', 'evacuation']
        check('the_evacuation_guide_preserves_all_twelve_previous_example_identifiers',
              page.locator('#ygoExampleSelect').evaluate('(el)=>[...el.options].map(o=>o.value)') == expected_ids)
        capabilities = page.evaluate('()=>({core:YGOComboEngine.capabilities(),response:YGOResponses.capabilities()})')
        roots = capabilities['core'].get('normalTrapActivations', [])
        root_by_card = {row['cardId']: row for row in roots}
        check('only_impermanence_keeps_a_registered_hand_activation_exception',
              len(roots) == 2
              and root_by_card.get(CED, {}).get('activationZones') == ['spelltrap']
              and root_by_card.get(10045474, {}).get('activationZones') == ['hand', 'spelltrap']
              and set(capabilities['response']['mechabaNormalTrapActivations']) == {ACTION, 'ACTIVATE_INFINITE_IMPERMANENCE'})
        try:
            initial = load_example(page, 'evacuation')
            source_uid = cards(initial, 0, 'spelltrap', CED)[0]['uid']
            roar_uid = cards(initial, 0, 'spelltrap', ROAR)[0]['uid']
            wolf_uid = cards(initial, 0, 'monster', WOLF)[0]['uid']
            spark_uid = cards(initial, 0, 'monster', SPARK)[0]['uid']
            bewd_uid = cards(initial, 0, 'monster', BEWD)[0]['uid']
            mechaba_uid = cards(initial, 1, 'monster', MECHABA)[0]['uid']
            cost_uid = cards(initial, 1, 'hand', CED)[0]['uid']
            check('evacuation_loads_a_declared_physical_field_without_autoplay_or_goal_success',
                  initial['scenario'] is None and initial['competitiveScore'] is None
                  and initial['goalProgress']['achieved'] is False
                  and initial['current']['context']['initialHistoryCertified'] is False
                  and cards(initial, 0, 'spelltrap', CED)[0]['setTurn'] == 1
                  and cards(initial, 0, 'spelltrap', CED)[0]['zoneIndex'] == 1
                  and page.locator('#ygoExampleInstructions li').count() == 5
                  and page.locator('#ygoDuelGoalProgress').get_attribute('data-state') == 'pending')
            coverage = page.evaluate('''()=>YGOCardCoverage.report(deckState).entries
              .find(row=>row.id===94192409&&row.zone==='main')''')
            check('the_card_coverage_panel_advertises_only_the_registered_compulsory_action',
                  [row['id'] for row in coverage['actions']] == [ACTION]
                  and coverage['actionCoverage'] == 'PARTIAL_REGISTERED_ACTIONS')
            protected = execute_step(page, 'STARDUST_SPARK_PROTECTION', sourceCard=SPARK,
                                     targetCard=BEWD, player=0, responseType=None)
            check('the_first_manual_step_protects_the_same_blue_eyes_without_finishing_the_goal',
                  cards(protected, 0, 'monster', BEWD)[0]['uid'] == bewd_uid
                  and cards(protected, 0, 'monster', BEWD)[0]['sparkProtection']['remaining'] == 1
                  and cards(protected, 0, 'monster', BEWD)[0]['sparkProtection']['sourceUid'] == spark_uid
                  and protected['goalProgress']['achieved'] is False
                  and len(protected['scenario']['actions']) == 1)
            returned = execute_step(page, ACTION, sourceCard=CED, targetCard=BEWD,
                                    player=0, column=1, responseType='MECHABA',
                                    responseCostCard=CED, counterCount=1)
            action = returned['scenario']['actions'][-1]
            packet = action['proof']['normalTrapActivation']
            check('the_return_packet_preserves_the_own_target_set_turn_column_and_speed',
                  packet['kind'] == 'NORMAL_TRAP_CARD_ACTIVATION'
                  and packet['sourceUid'] == source_uid and packet['cardId'] == CED
                  and packet['player'] == 0 and packet['targetUid'] == bewd_uid
                  and packet['targetPlayer'] == 0 and packet['originZone'] == 'spelltrap'
                  and packet['activationZone'] == 'spelltrap' and packet['column'] == 1
                  and packet['fromSet'] is True and packet['setTurn'] == 1 and packet['spellSpeed'] == 2
                  and action['proof']['activationOrigin']['cardActivation'] == 'NORMAL_TRAP', packet)
            check('mechaba_pays_the_rival_compulsory_as_a_distinct_physical_trap_cost',
                  action['response']['matchingCardType'] == 'TRAP'
                  and action['response']['costUid'] == cost_uid and cost_uid != source_uid
                  and cards(returned, 1, 'gy', CED)[0]['uid'] == cost_uid
                  and any(row['kind'] == 'SEND_GY' and row['uid'] == cost_uid
                          and row['player'] == 1 and row['from'] == 'hand' and row['to'] == 'gy'
                          for row in action['paid']))
            chain = action['proof']['registeredResponseChain']
            check('roar_negates_mechaba_first_and_preserves_all_paid_response_costs',
                  chain['firstResponseNegated'] is True and action['proof']['activationNegated'] is False
                  and [row['chainLink'] for row in chain['resolutions']
                       if row['type'] == 'REGISTERED_CHAIN_LINK_RESOLVED'] == [3, 2]
                  and cards(returned, 1, 'gy', MECHABA)[0]['uid'] == mechaba_uid
                  and cards(returned, 0, 'gy', ROAR)[0]['uid'] == roar_uid)
            check('returning_the_protected_blue_eyes_is_not_prevented_or_reported_as_destruction',
                  cards(returned, 0, 'hand', BEWD)[0]['uid'] == bewd_uid
                  and not cards(returned, 0, 'monster', BEWD)
                  and not cards(returned, 0, 'hand', BEWD)[0].get('sparkProtection')
                  and not any(row['type'] == 'SPARK_DESTRUCTION_PREVENTED' and row.get('targetUid') == bewd_uid
                              or row['type'].startswith('DESTROYED_') and row.get('uid') == bewd_uid
                              for row in action['events'])
                  and cards(returned, 0, 'monster', WOLF)[0]['uid'] == wolf_uid)
            check('both_actual_actions_finish_the_hand_goal_and_keep_a_fresh_replay',
                  len(returned['scenario']['actions']) == 2 and returned['goalProgress']['achieved'] is True
                  and page.locator('#ygoDuelGoalProgress').get_attribute('data-state') == 'achieved'
                  and returned['scenario']['replay']['pass'] is True
                  and cards(returned, 0, 'gy', CED)[0]['uid'] == source_uid
                  and not any(row.get('uid') == source_uid for row in action['paid'])
                  and returned['competitiveScore'] is None)
            with page.expect_download() as pending:
                page.locator('#ygoAdvancedExport').click()
            saved = json.loads(Path(pending.value.path()).read_text())
            check('the_export_binds_the_own_target_and_paid_response_to_the_delivered_build',
                  saved['buildId'] == build['buildId'] and saved['scenario']['replay']['pass'] is True
                  and saved['scenario']['actions'][1]['proof']['normalTrapActivation'] == packet
                  and saved['scenario']['actions'][1]['response']['costUid'] == cost_uid)
            restored = undo_to(page, 1)
            check('undoing_only_compulsory_restores_the_same_shield_target_traps_and_unpaid_cost',
                  len(restored['scenario']['actions']) == 1 and restored['goalProgress']['achieved'] is False
                  and cards(restored, 0, 'monster', BEWD)[0]['uid'] == bewd_uid
                  and cards(restored, 0, 'monster', BEWD)[0]['sparkProtection']['remaining'] == 1
                  and cards(restored, 0, 'spelltrap', CED)[0]['uid'] == source_uid
                  and cards(restored, 0, 'spelltrap', ROAR)[0]['uid'] == roar_uid
                  and cards(restored, 1, 'monster', MECHABA)[0]['uid'] == mechaba_uid
                  and cards(restored, 1, 'hand', CED)[0]['uid'] == cost_uid)
            negated = execute_step(page, ACTION, sourceCard=CED, targetCard=BEWD,
                                   player=0, column=1, responseType='MECHABA',
                                   responseCostCard=CED, counterCount=0)
            negated_action = negated['scenario']['actions'][-1]
            check('declining_roar_banishes_compulsory_without_returning_or_consuming_the_target_shield',
                  negated_action['proof']['activationNegated'] is True
                  and cards(negated, 0, 'banished', CED)[0]['uid'] == source_uid
                  and cards(negated, 1, 'gy', CED)[0]['uid'] == cost_uid
                  and cards(negated, 0, 'monster', BEWD)[0]['uid'] == bewd_uid
                  and cards(negated, 0, 'monster', BEWD)[0]['sparkProtection']['remaining'] == 1
                  and cards(negated, 0, 'spelltrap', ROAR)[0]['uid'] == roar_uid
                  and not cards(negated, 0, 'hand', BEWD)
                  and negated['goalProgress']['achieved'] is False
                  and negated['scenario']['replay']['pass'] is True)
            undo_to(page, 1)
            extra = execute_step(page, ACTION, sourceCard=CED, targetCard=MECHABA,
                                 player=0, column=1, responseType=None)
            extra_action = extra['scenario']['actions'][-1]
            extra_packet = extra_action['proof']['normalTrapActivation']
            extra_card = cards(extra, 1, 'extra', MECHABA)[0]
            check('the_opposing_fusion_returns_to_its_owners_hidden_extra_instead_of_either_hand',
                  extra_card['uid'] == mechaba_uid and extra_card['ownerPlayer'] == 1
                  and extra_card.get('faceUp') is not True
                  and not extra_card.get('properlySummoned') and not extra_card.get('summonType')
                  and not extra_card.get('declaredSummonType')
                  and not cards(extra, 1, 'monster', MECHABA)
                  and not cards(extra, 1, 'hand', MECHABA) and not cards(extra, 0, 'hand', MECHABA)
                  and extra_packet['targetUid'] == mechaba_uid and extra_packet['targetPlayer'] == 1)
            check('passing_the_response_leaves_roar_and_the_opponents_cost_available',
                  not extra_action.get('response') and not extra_action['paid']
                  and cards(extra, 0, 'spelltrap', ROAR)[0]['uid'] == roar_uid
                  and cards(extra, 1, 'hand', CED)[0]['uid'] == cost_uid
                  and cards(extra, 0, 'monster', BEWD)[0]['sparkProtection']['remaining'] == 1
                  and extra['goalProgress']['achieved'] is False
                  and extra['scenario']['replay']['pass'] is True)
            with page.expect_download() as pending:
                page.locator('#ygoAdvancedExport').click()
            extra_saved = json.loads(Path(pending.value.path()).read_text())
            resumed = import_report(page, saved, 'evacuation-own-target-replay.json')
            check('reimport_replays_the_original_own_target_route_and_recomputes_goal_success',
                  resumed['scenario']['replay']['pass'] is True
                  and resumed['goalProgress']['achieved'] is True
                  and cards(resumed, 0, 'hand', BEWD)[0]['uid'] == bewd_uid
                  and resumed['scenario']['actions'][1]['proof']['normalTrapActivation'] == packet
                  and cards(resumed, 1, 'gy', CED)[0]['uid'] == cost_uid)
            before_reject = report(page)
            forged = copy.deepcopy(saved)
            forged['scenario']['actions'][1]['proof']['normalTrapActivation']['targetPlayer'] = 1
            page.locator('#ygoAdvancedImport').set_input_files({
                'name': 'forged-compulsory-target.json', 'mimeType': 'application/json',
                'buffer': json.dumps(forged).encode()})
            page.wait_for_function('''()=>document.getElementById('ygoAdvancedStatus').textContent
              .startsWith('No completado:')''')
            check('an_altered_target_player_is_rejected_without_replacing_the_active_session',
                  report(page) == before_reject)
            restored_extra = import_report(page, extra_saved, 'evacuation-extra-replay.json')
            check('the_alternate_extra_destination_also_reimports_with_the_same_uid_and_replay',
                  restored_extra['scenario']['replay']['pass'] is True
                  and restored_extra['goalProgress']['achieved'] is False
                  and cards(restored_extra, 1, 'extra', MECHABA)[0]['uid'] == mechaba_uid)
            forged_destination = copy.deepcopy(extra_saved)
            for state in [forged_destination['current'], forged_destination['scenario']['after'],
                          forged_destination['scenario']['state']]:
                owner = state['zones'][1]
                physical = next(row for row in owner['extra'] if row['uid'] == mechaba_uid)
                owner['extra'].remove(physical)
                owner['hand'].append(physical)
            before_reject = report(page)
            page.locator('#ygoAdvancedImport').set_input_files({
                'name': 'forged-compulsory-destination.json', 'mimeType': 'application/json',
                'buffer': json.dumps(forged_destination).encode()})
            page.wait_for_function('''()=>document.getElementById('ygoAdvancedStatus').textContent
              .startsWith('No completado:')''')
            check('a_forged_hand_destination_for_the_fusion_is_transactionally_rejected',
                  report(page) == before_reject)
            undo_to(page, 1)
            reset = undo_to(page, 0)
            check('undoing_both_steps_restores_the_initial_unprotected_field_and_pending_goal',
                  reset['scenario'] is None and reset['goalProgress']['achieved'] is False
                  and cards(reset, 0, 'monster', BEWD)[0]['uid'] == bewd_uid
                  and not cards(reset, 0, 'monster', BEWD)[0].get('sparkProtection')
                  and cards(reset, 0, 'spelltrap', CED)[0]['uid'] == source_uid
                  and cards(reset, 1, 'monster', MECHABA)[0]['uid'] == mechaba_uid
                  and cards(reset, 1, 'hand', CED)[0]['uid'] == cost_uid)
        except Exception as error:
            check('the_visible_compulsory_guide_and_saved_route_complete', False, str(error))
        check('release13_tasks_raise_no_javascript_page_errors', not errors, errors)
        version = browser.version
        browser.close()
    check('compiled_document_is_unchanged_during_release13_tasks',
          hashlib.sha256(artifact.read_bytes()).hexdigest() == html_hash)
    return {'schema': 'ygo-release13-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': html_hash, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'checks': checks, 'details': details,
            'browser': {'engine': 'chromium', 'version': version}, 'externalRequestsBlocked': len(blocked),
            'limitations': ['Compulsory targets and zone departures are limited to the registered reviewed profiles.',
                            'The visible guide checks own Main and opposing Fusion returns; the source suite covers other admitted profiles and Tokens.',
                            'The initial field remains declared and these registered windows do not certify general priority, SEGOC or Damage Step.',
                            'Competitive scoring remains provisional.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release13-browser-results.json')
    args = parser.parse_args()
    started = time.monotonic()
    value = run(args.url)
    value['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.output.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': value['pass'], 'checks': len(value['checks']),
                      'failed': [row['name'] for row in value['checks'] if not row['pass']]}, ensure_ascii=False))
    raise SystemExit(0 if value['pass'] else 1)

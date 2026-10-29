#!/usr/bin/env python3
"""Offline delivered-byte tasks for the registered Infinite Impermanence card activation."""
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
ACTION = 'ACTIVATE_INFINITE_IMPERMANENCE'
IMPERM, ROAR, WOLF = 10045474, 51339637, 87871125
MECHABA, SPIRIT, ALEISTER, INVOCATION = 75286621, 59822133, 86120751, 74063034


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    html = artifact.read_bytes()
    html_hash = hashlib.sha256(html).hexdigest()
    assert html_hash == build['htmlSha256']
    target = url or 'https://ygo-release12.test/Analizador_YuGiOh.html'
    checks, details, errors, blocked = [], {}, [], []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    def column_locks(value):
        return [row for row in value['current']['locks'] if row['kind'] == 'IMPERM_COLUMN_NEGATED']

    def import_initial(page, value, filename):
        page.locator('#ygoCausalFile').set_input_files({
            'name': filename, 'mimeType': 'application/json', 'buffer': json.dumps(value).encode()})
        page.wait_for_function('''()=>!YGOComboWorkbench.isBusy
          &&YGOAdvancedWorkbench.report().current===null
          &&document.getElementById('ygoCausalStatus').textContent.startsWith('Escenario importado:')''')
        page.locator('#ygoDuelInitialize').click()
        page.wait_for_function('()=>YGOAdvancedWorkbench.report().current!==null')
        return report(page)

    def hand_scenario(base, keep_own_field):
        value = copy.deepcopy(base)
        value['openingIds'] = [IMPERM, *value['openingIds'][:-1]]
        value['remainingDeckIds'] = [row['id'] for row in value['deck']['main'] for _ in range(row['qty'])]
        for card_id in value['openingIds']:
            value['remainingDeckIds'].remove(card_id)
        value['setup']['placements'] = [row for row in value['setup']['placements']
                                        if not (row['player'] == 0 and
                                                (not keep_own_field or row.get('cardId') == IMPERM))]
        return value

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
        check('release12_boots_offline_from_the_manifest_bound_document', response is not None
              and hashlib.sha256(response.body()).hexdigest() == html_hash
              and page.evaluate('()=>navigator.onLine===false&&YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        expected_ids = ['spark', 'spirit', 'invoked', 'swordsoul', 'branded', 'tenyi', 'salamangreat',
                        'roar', 'crow', 'droll', 'field', 'trap']
        check('twelve_visible_examples_preserve_the_previous_eleven_identifiers',
              page.locator('#ygoExampleSelect').evaluate('(el)=>[...el.options].map(o=>o.value)') == expected_ids)
        capabilities = page.evaluate('()=>({core:YGOComboEngine.capabilities(),response:YGOResponses.capabilities()})')
        roots = capabilities['core'].get('normalTrapActivations', [])
        check('normal_trap_registry_explicitly_limits_the_new_card_activation',
              len(roots) == 1 and roots[0]['type'] == ACTION and roots[0]['cardId'] == IMPERM
              and len(capabilities['core']['normalSpellActivations']) == 3
              and len(capabilities['core']['fieldSpellActivations']) == 2)
        check('mechaba_models_a_physical_trap_cost_without_widening_monster_registry',
              'TRAP' in capabilities['response']['mechabaModeledCardTypes']
              and capabilities['response']['mechabaNormalTrapActivations'] == [ACTION]
              and len(capabilities['response']['mechabaNonFieldMonsterActivations']) == 15)
        try:
            initial = load_example(page, 'trap')
            base = page.evaluate('()=>YGOScenarioExamples.get("trap")')
            source_uid = cards(initial, 0, 'spelltrap', IMPERM)[0]['uid']
            roar_uid = cards(initial, 0, 'spelltrap', ROAR)[0]['uid']
            wolf_uid = cards(initial, 0, 'monster', WOLF)[0]['uid']
            mechaba_uid = cards(initial, 1, 'monster', MECHABA)[0]['uid']
            spirit_uid = cards(initial, 1, 'monster', SPIRIT)[0]['uid']
            cost_uid = cards(initial, 1, 'hand', IMPERM)[0]['uid']
            check('trap_guide_loads_previous_turn_set_copies_without_autoplay_or_initial_goal_success',
                  initial['scenario'] is None and initial['competitiveScore'] is None
                  and initial['goalProgress']['achieved'] is False
                  and initial['current']['context']['initialHistoryCertified'] is False
                  and cards(initial, 0, 'spelltrap', IMPERM)[0]['zoneIndex'] == 2
                  and cards(initial, 0, 'spelltrap', IMPERM)[0]['setTurn'] == 1
                  and page.locator('#ygoExampleInstructions li').count() == 5)
            coverage = page.evaluate('''()=>YGOCardCoverage.report(deckState).entries
              .find(row=>row.id===10045474&&row.zone==='main')''')
            check('coverage_retains_imperm_response_and_adds_the_registered_card_activation',
                  {row['id'] for row in coverage['actions']} == {ACTION, 'IMPERM'}
                  and coverage['actionCoverage'] == 'PARTIAL_REGISTERED_ACTIONS')

            resolved = execute_step(page, ACTION, sourceCard=IMPERM, targetCard=SPIRIT,
                                    player=0, column=2, responseType='MECHABA',
                                    responseCostCard=IMPERM, counterCount=1)
            action = resolved['scenario']['actions'][-1]
            packet = action['proof']['normalTrapActivation']
            check('the_normal_trap_packet_keeps_the_set_origin_physical_column_and_speed_two',
                  packet['kind'] == 'NORMAL_TRAP_CARD_ACTIVATION'
                  and packet['sourceUid'] == source_uid and packet['cardId'] == IMPERM
                  and packet['player'] == 0 and packet['originZone'] == 'spelltrap'
                  and packet['activationZone'] == 'spelltrap' and packet['column'] == 2
                  and packet['fromSet'] is True and packet['setTurn'] == 1 and packet['spellSpeed'] == 2
                  and action['proof']['activationOrigin']['sourceUid'] == source_uid
                  and action['proof']['activationOrigin']['zone'] == 'spelltrap'
                  and action['proof']['activationOrigin']['cardActivation'] == 'NORMAL_TRAP', packet)
            check('mechaba_pays_a_different_physical_trap_even_when_roar_negates_its_response',
                  action['response']['matchingCardType'] == 'TRAP'
                  and action['response']['activationKind'] == 'TRAP_CARD_ACTIVATION'
                  and action['response']['costUid'] == cost_uid and cost_uid != source_uid
                  and cards(resolved, 1, 'gy', IMPERM)[0]['uid'] == cost_uid
                  and any(row['kind'] == 'SEND_GY' and row['uid'] == cost_uid
                          and row['player'] == 1 and row['from'] == 'hand' and row['to'] == 'gy'
                          for row in action['paid']))
            chain = action['proof']['registeredResponseChain']
            check('the_registered_counter_chain_resolves_roar_before_mechaba_without_refunding_payments',
                  chain['firstResponseNegated'] is True and action['proof']['activationNegated'] is False
                  and [row['chainLink'] for row in chain['resolutions']
                       if row['type'] == 'REGISTERED_CHAIN_LINK_RESOLVED'] == [3, 2]
                  and cards(resolved, 1, 'gy', MECHABA)[0]['uid'] == mechaba_uid
                  and cards(resolved, 0, 'gy', ROAR)[0]['uid'] == roar_uid)
            check('imperm_negates_the_surviving_spirit_instead_of_the_destroyed_mechaba',
                  cards(resolved, 1, 'monster', SPIRIT)[0]['uid'] == spirit_uid
                  and cards(resolved, 1, 'monster', SPIRIT)[0]['effectsNegated'] is True
                  and cards(resolved, 1, 'monster', SPIRIT)[0]['negatedUntilTurn'] == 2
                  and cards(resolved, 0, 'monster', WOLF)[0]['uid'] == wolf_uid)
            locks = column_locks(resolved)
            check('set_imperm_applies_its_source_column_only_after_successfully_negating_the_target',
                  len(locks) == 1 and locks[0]['column'] == 2
                  and locks[0]['sourceUid'] == source_uid and locks[0]['untilTurn'] == 2
                  and locks[0]['appliesToPlayers'] == [0, 1], locks)
            check('normal_trap_resolution_cleanup_is_not_an_activation_cost_and_keeps_fresh_replay',
                  cards(resolved, 0, 'gy', IMPERM)[0]['uid'] == source_uid
                  and not any(row.get('uid') == source_uid for row in action['paid'])
                  and any(row['type'] == 'NORMAL_TRAP_RESOLUTION_CLEANUP'
                          and row['uid'] == source_uid for row in action['events'])
                  and resolved['scenario']['replay']['pass'] is True)

            execute_step(page, 'NORMAL_SUMMON', sourceCard=ALEISTER, responseType=None)
            final = execute_step(page, 'ALEISTER_SEARCH', responseType=None)
            check('the_three_visible_actions_finish_the_guide_with_an_actual_invocation_in_hand',
                  len(final['scenario']['actions']) == 3
                  and len(cards(final, 0, 'hand', INVOCATION)) == 1
                  and final['goalProgress']['achieved'] is True
                  and final['scenario']['replay']['pass'] is True
                  and final['competitiveScore'] is None)
            with page.expect_download() as pending:
                page.locator('#ygoAdvancedExport').click()
            exported = json.loads(Path(pending.value.path()).read_text())
            check('export_binds_the_trap_origin_and_paid_response_to_the_same_delivered_build',
                  exported['buildId'] == build['buildId'] and exported['scenario']['replay']['pass'] is True
                  and exported['scenario']['actions'][0]['proof']['normalTrapActivation']['sourceUid'] == source_uid
                  and exported['scenario']['actions'][0]['response']['costUid'] == cost_uid)
            undo_to(page, 2)
            undo_to(page, 1)
            restored = undo_to(page, 0)
            check('undo_restores_the_same_set_trap_roar_mechaba_cost_and_unnegated_target',
                  restored['scenario'] is None and not column_locks(restored)
                  and restored['goalProgress']['achieved'] is False
                  and cards(restored, 0, 'spelltrap', IMPERM)[0]['uid'] == source_uid
                  and cards(restored, 0, 'spelltrap', IMPERM)[0]['faceUp'] is False
                  and cards(restored, 0, 'spelltrap', ROAR)[0]['uid'] == roar_uid
                  and cards(restored, 1, 'monster', MECHABA)[0]['uid'] == mechaba_uid
                  and cards(restored, 1, 'hand', IMPERM)[0]['uid'] == cost_uid
                  and not cards(restored, 1, 'monster', SPIRIT)[0].get('effectsNegated', False))
            negated = execute_step(page, ACTION, sourceCard=IMPERM, targetCard=SPIRIT,
                                   player=0, column=2, responseType='MECHABA',
                                   responseCostCard=IMPERM, counterCount=0)
            negated_action = negated['scenario']['actions'][-1]
            check('declining_roar_banishes_the_activated_trap_without_a_target_or_column_effect',
                  negated_action['proof']['activationNegated'] is True
                  and cards(negated, 0, 'banished', IMPERM)[0]['uid'] == source_uid
                  and cards(negated, 1, 'gy', IMPERM)[0]['uid'] == cost_uid
                  and cards(negated, 0, 'spelltrap', ROAR)[0]['uid'] == roar_uid
                  and cards(negated, 1, 'monster', MECHABA)[0]['uid'] == mechaba_uid
                  and not cards(negated, 1, 'monster', SPIRIT)[0].get('effectsNegated', False)
                  and not column_locks(negated)
                  and negated['scenario']['replay']['pass'] is True)
            before_reject = report(page)
            forged = copy.deepcopy(exported)
            forged['scenario']['actions'][0]['proof']['normalTrapActivation']['column'] = 4
            page.locator('#ygoAdvancedImport').set_input_files({
                'name': 'forged-trap-packet.json', 'mimeType': 'application/json',
                'buffer': json.dumps(forged).encode()})
            page.wait_for_function('''()=>document.getElementById('ygoAdvancedStatus').textContent
              .startsWith('No completado:')''')
            check('forged_trap_packet_evidence_is_rejected_without_replacing_the_active_session',
                  report(page) == before_reject)
            page.locator('#ygoAdvancedImport').set_input_files({
                'name': 'trap-replay.json', 'mimeType': 'application/json',
                'buffer': json.dumps(exported).encode()})
            page.wait_for_function('()=>YGOAdvancedWorkbench.report().scenario?.actions.length===3')
            resumed = report(page)
            check('saved_trap_route_reimports_its_proof_costs_and_recomputed_goal_progress',
                  resumed['scenario']['replay']['pass'] is True
                  and resumed['goalProgress']['achieved'] is True
                  and resumed['scenario']['actions'][0]['proof']['normalTrapActivation'] == packet
                  and cards(resumed, 1, 'gy', IMPERM)[0]['uid'] == cost_uid)

            same_turn = copy.deepcopy(base)
            next(row for row in same_turn['setup']['placements']
                 if row['player'] == 0 and row.get('cardId') == IMPERM)['setTurn'] = 2
            same_turn_state = import_initial(page, same_turn, 'same-turn-set-trap.json')
            current_source = cards(same_turn_state, 0, 'spelltrap', IMPERM)[0]['uid']
            check('a_trap_set_this_turn_does_not_gain_an_activation_option',
                  not page.evaluate('uid=>YGOComboEngine.enumerate(YGOAdvancedWorkbench.report().current)'
                                    '.some(a=>a.type==="ACTIVATE_INFINITE_IMPERMANENCE"&&a.sourceUid===uid)', current_source))
            controlled = import_initial(page, hand_scenario(base, True), 'controlled-hand-trap.json')
            hand_uid = cards(controlled, 0, 'hand', IMPERM)[0]['uid']
            check('imperm_in_hand_requires_control_of_no_cards_including_the_existing_wolf_and_roar',
                  len(controlled['current']['zones'][0]['monster']) == 1
                  and not page.evaluate('uid=>YGOComboEngine.enumerate(YGOAdvancedWorkbench.report().current)'
                                        '.some(a=>a.type==="ACTIVATE_INFINITE_IMPERMANENCE"&&a.sourceUid===uid)', hand_uid))
            empty = import_initial(page, hand_scenario(base, False), 'empty-field-hand-trap.json')
            empty_uid = cards(empty, 0, 'hand', IMPERM)[0]['uid']
            hand_columns = page.evaluate('''uid=>[...new Set(YGOComboEngine.enumerate(YGOAdvancedWorkbench.report().current)
              .filter(a=>a.type==='ACTIVATE_INFINITE_IMPERMANENCE'&&a.sourceUid===uid&&!a.response)
              .map(a=>a.column))].sort()''', empty_uid)
            check('an_empty_own_field_offers_all_five_real_hand_activation_columns',
                  hand_columns == [0, 1, 2, 3, 4]
                  and not empty['current']['zones'][0]['monster']
                  and not empty['current']['zones'][0]['spelltrap'])
            from_hand = execute_step(page, ACTION, sourceCard=IMPERM, targetCard=SPIRIT,
                                     player=0, column=4, responseType=None)
            hand_packet = from_hand['scenario']['actions'][-1]['proof']['normalTrapActivation']
            check('hand_activation_preserves_its_different_origin_and_never_creates_the_set_column_bonus',
                  hand_packet['sourceUid'] == empty_uid and hand_packet['originZone'] == 'hand'
                  and hand_packet['fromSet'] is False and hand_packet['setTurn'] is None
                  and hand_packet['column'] == 4 and hand_packet['spellSpeed'] == 2
                  and cards(from_hand, 0, 'gy', IMPERM)[0]['uid'] == empty_uid
                  and cards(from_hand, 1, 'monster', SPIRIT)[0]['effectsNegated'] is True
                  and not column_locks(from_hand)
                  and from_hand['scenario']['replay']['pass'] is True)
        except Exception as error:
            check('normal_trap_visible_tutorial_completed', False, str(error))
        check('release12_tasks_raise_no_javascript_page_errors', not errors, errors)
        version = browser.version
        browser.close()
    check('compiled_document_is_unchanged_during_release12_tasks', hashlib.sha256(artifact.read_bytes()).hexdigest() == html_hash)
    return {'schema': 'ygo-release12-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': html_hash, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'checks': checks, 'details': details,
            'browser': {'engine': 'chromium', 'version': version}, 'externalRequestsBlocked': len(blocked),
            'limitations': ['The new Normal Trap card activation is limited to Infinite Impermanence.',
                            'The registered between-action windows do not certify arbitrary priority or Damage Step.',
                            'Starting fields remain declared assumptions and competitive scoring remains provisional.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release12-browser-results.json')
    args = parser.parse_args()
    started = time.monotonic()
    value = run(args.url)
    value['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.output.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': value['pass'], 'checks': len(value['checks']),
                      'failed': [row['name'] for row in value['checks'] if not row['pass']]}, ensure_ascii=False))
    raise SystemExit(0 if value['pass'] else 1)

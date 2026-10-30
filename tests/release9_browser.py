#!/usr/bin/env python3
"""Delivered-byte Field Spell replacement, response and saved replay tasks."""
import argparse
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


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    html = artifact.read_bytes()
    html_hash = hashlib.sha256(html).hexdigest()
    assert html_hash == build['htmlSha256']
    target = url or 'https://ygo-release9.test/Analizador_YuGiOh.html'
    checks, details, errors, blocked = [], {}, [], []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

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
        check('release9_boots_offline_from_the_manifest_bound_document', response is not None
              and hashlib.sha256(response.body()).hexdigest() == html_hash
              and page.evaluate('()=>navigator.onLine===false&&YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        expected_ids = ['spark', 'spirit', 'invoked', 'swordsoul', 'branded', 'tenyi', 'salamangreat',
                        'roar', 'crow', 'droll', 'field', 'trap', 'evacuation', 'shuffle']
        check('fourteen_visible_examples_preserve_the_previous_thirteen_identifiers',
              page.locator('#ygoExampleSelect').evaluate('(el)=>[...el.options].map(o=>o.value)') == expected_ids)
        registered = page.evaluate('()=>YGOResponses.capabilities().mechabaFieldSpellActivations')
        check('the_delivered_mechaba_field_registry_is_explicit_and_limited_to_the_two_reviewed_cards',
              set(registered) == {'ACTIVATE_MAUSOLEUM_OF_WHITE', 'SALAMANGREAT_ACTIVATE_SANCTUARY'}
              and len(registered) == 2)
        try:
            initial = load_example(page, 'field')
            old_uid = cards(initial, 0, 'spelltrap', 24382602)[0]['uid']
            new_uid = cards(initial, 0, 'hand', 1295111)[0]['uid']
            roar_uid = cards(initial, 0, 'spelltrap', 51339637)[0]['uid']
            wolf_uid = cards(initial, 0, 'monster', 87871125)[0]['uid']
            mechaba_uid = cards(initial, 1, 'monster', 75286621)[0]['uid']
            cost_uid = cards(initial, 1, 'hand', 74063034)[0]['uid']
            check('field_guide_prepares_physical_cards_without_autoplay_or_an_already_reached_goal',
                  initial['scenario'] is None and initial['competitiveScore'] is None
                  and initial['current']['context']['initialHistoryCertified'] is False
                  and page.locator('#ygoExampleInstructions li').count() == 5
                  and not page.evaluate('()=>YGOComboWorkbench.goalMatches(YGOAdvancedWorkbench.report().current,YGOScenarioExamples.get("field").goal)'))

            resolved = execute_step(page, 'SALAMANGREAT_ACTIVATE_SANCTUARY', sourceCard=1295111,
                                    responseType='MECHABA', responseCostCard=74063034, counterCount=1)
            action = resolved['scenario']['actions'][-1]
            packet = action['proof']['fieldSpellActivation']
            check('the_field_packet_captures_hand_origin_and_the_exact_prior_field',
                  packet['kind'] == 'FIELD_SPELL_CARD_ACTIVATION' and packet['sourceUid'] == new_uid
                  and packet['cardId'] == 1295111 and packet['player'] == 0
                  and packet['originZone'] == 'hand' and packet['activationZone'] == 'spelltrap'
                  and packet['fieldSpell'] is True and packet['column'] is None
                  and len(packet['replaced']) == 1 and packet['replaced'][0]['uid'] == old_uid
                  and packet['replaced'][0]['cardId'] == 24382602
                  and packet['replaced'][0]['from'] == 'spelltrap' and packet['replaced'][0]['to'] == 'gy'
                  and action['proof']['activationOrigin']['zone'] == 'hand'
                  and action['proof']['activationOrigin']['cardActivation'] == 'FIELD_SPELL')
            events = action['events']
            replacement_at = next(n for n, event in enumerate(events)
                                  if event['type'] == 'REPLACE_FIELD_SPELL' and event['uid'] == old_uid)
            activation_at = next(n for n, event in enumerate(events) if event['type'] == 'FIELD_SPELL_CARD_ACTIVATION')
            response_at = next(n for n, event in enumerate(events) if event['type'] == 'REGISTERED_CHAIN_LINK_ACTIVATED')
            replacement = events[replacement_at]
            check('the_prior_field_is_sent_by_rule_before_the_activation_and_responses_without_destruction',
                  replacement_at < activation_at < response_at and replacement['destroyed'] is False
                  and replacement['cost'] is False and replacement['reason'] == 'FIELD_ZONE_RULE_NOT_DESTRUCTION'
                  and cards(resolved, 0, 'gy', 24382602)[0]['uid'] == old_uid
                  and not any(event['type'] == 'DESTROYED_BY_EFFECT' and event.get('uid') == old_uid for event in events))
            check('roar_negates_mechaba_after_its_spell_cost_and_all_physical_payments_remain_paid',
                  action['proof']['registeredResponseChain']['firstResponseNegated'] is True
                  and action['proof']['activationNegated'] is False
                  and cards(resolved, 0, 'gy', 51339637)[0]['uid'] == roar_uid
                  and cards(resolved, 1, 'gy', 74063034)[0]['uid'] == cost_uid
                  and cards(resolved, 1, 'gy', 75286621)[0]['uid'] == mechaba_uid
                  and any(payment['kind'] == 'SEND_GY' and payment['uid'] == cost_uid
                          and payment['player'] == 1 for payment in action['paid']))
            new_field = cards(resolved, 0, 'spelltrap', 1295111)[0]
            check('the_resolved_sanctuary_keeps_its_separate_field_slot_and_a_fresh_replay',
                  new_field['uid'] == new_uid and new_field['fieldSpell'] is True
                  and new_field['faceUp'] is True and 'zoneIndex' not in new_field
                  and resolved['scenario']['replay']['pass'] is True and resolved['competitiveScore'] is None)

            reincarnated = execute_step(page, 'SALAMANGREAT_REINCARNATE_WOLF', destination=5, responseType=None)
            check('sanctuary_enables_a_new_reincarnated_wolf_using_the_actual_starting_copy',
                  cards(reincarnated, 0, 'gy', 87871125)[0]['uid'] == wolf_uid
                  and cards(reincarnated, 0, 'monster', 87871125)[0]['uid'] != wolf_uid
                  and cards(reincarnated, 0, 'monster', 87871125)[0]['reincarnated'] is True)
            final = execute_step(page, 'SALAMANGREAT_WOLF_RECOVER_ST', targetCard=51339637, responseType=None)
            check('the_three_visible_steps_recover_the_same_roar_and_reach_the_advertised_goal',
                  len(final['scenario']['actions']) == 3
                  and cards(final, 0, 'hand', 51339637)[0]['uid'] == roar_uid
                  and cards(final, 0, 'gy', 24382602)[0]['uid'] == old_uid
                  and final['scenario']['replay']['pass'] is True and final['competitiveScore'] is None
                  and page.evaluate('()=>YGOComboWorkbench.goalMatches(YGOAdvancedWorkbench.report().current,YGOScenarioExamples.get("field").goal)'))
            with page.expect_download() as pending:
                page.locator('#ygoAdvancedExport').click()
            exported = json.loads(Path(pending.value.path()).read_text())
            check('field_report_export_binds_the_staging_proof_and_verified_trace_to_the_delivered_build',
                  exported['buildId'] == build['buildId'] and exported['scenario']['replay']['pass'] is True
                  and exported['scenario']['actions'][0]['proof']['fieldSpellActivation']['replaced'][0]['uid'] == old_uid)
            undo_to(page, 2)
            undo_to(page, 1)
            restored = undo_to(page, 0)
            check('undo_restores_the_original_field_roar_mechaba_and_spell_cost', restored['scenario'] is None
                  and cards(restored, 0, 'spelltrap', 24382602)[0]['uid'] == old_uid
                  and cards(restored, 0, 'hand', 1295111)[0]['uid'] == new_uid
                  and cards(restored, 0, 'spelltrap', 51339637)[0]['uid'] == roar_uid
                  and cards(restored, 1, 'monster', 75286621)[0]['uid'] == mechaba_uid
                  and cards(restored, 1, 'hand', 74063034)[0]['uid'] == cost_uid)
            negated = execute_step(page, 'SALAMANGREAT_ACTIVATE_SANCTUARY', sourceCard=1295111,
                                   responseType='MECHABA', responseCostCard=74063034, counterCount=0)
            negated_action = negated['scenario']['actions'][-1]
            check('declining_the_roar_counter_banishes_sanctuary_without_restoring_mausoleum',
                  negated_action['proof']['activationNegated'] is True
                  and cards(negated, 0, 'banished', 1295111)[0]['uid'] == new_uid
                  and cards(negated, 0, 'gy', 24382602)[0]['uid'] == old_uid
                  and cards(negated, 0, 'spelltrap', 51339637)[0]['uid'] == roar_uid
                  and cards(negated, 1, 'gy', 74063034)[0]['uid'] == cost_uid
                  and cards(negated, 1, 'monster', 75286621)[0]['uid'] == mechaba_uid
                  and not any(row.get('fieldSpell') for row in negated['current']['zones'][0]['spelltrap']))
            check('the_negated_branch_cannot_use_sanctuary_reincarnation_and_does_not_claim_the_goal',
                  not page.evaluate('()=>YGOComboEngine.enumerate(YGOAdvancedWorkbench.report().current).some(a=>a.type==="SALAMANGREAT_REINCARNATE_WOLF")')
                  and not page.evaluate('()=>YGOComboWorkbench.goalMatches(YGOAdvancedWorkbench.report().current,YGOScenarioExamples.get("field").goal)')
                  and negated['scenario']['replay']['pass'] is True)
            page.locator('#ygoAdvancedImport').set_input_files({'name': 'field-replay.json', 'mimeType': 'application/json',
                                                            'buffer': json.dumps(exported).encode()})
            page.wait_for_function('()=>YGOAdvancedWorkbench.report().scenario?.actions.length===3')
            resumed = report(page)
            check('the_saved_field_route_reimports_and_replays_its_original_staging_and_recovered_roar',
                  resumed['scenario']['replay']['pass'] is True
                  and cards(resumed, 0, 'hand', 51339637)[0]['uid'] == roar_uid
                  and cards(resumed, 0, 'spelltrap', 1295111)[0]['uid'] == new_uid
                  and cards(resumed, 0, 'gy', 24382602)[0]['uid'] == old_uid)
        except Exception as error:
            check('field_visible_tutorial_completed', False, str(error))
        check('release9_tasks_raise_no_javascript_page_errors', not errors, errors)
        version = browser.version
        browser.close()
    check('compiled_document_is_unchanged_during_release9_tasks', hashlib.sha256(artifact.read_bytes()).hexdigest() == html_hash)
    return {'schema': 'ygo-release9-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': html_hash, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'checks': checks, 'details': details,
            'browser': {'engine': 'chromium', 'version': version}, 'externalRequestsBlocked': len(blocked),
            'limitations': ['Starting fields and prior summon history remain declared assumptions.',
                            'The two registered Field Spell activations do not provide arbitrary priority or all Spell/Trap rules.',
                            'Recorded replay and goal checks do not certify competitive results.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release9-browser-results.json')
    args = parser.parse_args()
    started = time.monotonic()
    value = run(args.url)
    value['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.output.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': value['pass'], 'checks': len(value['checks']),
                      'failed': [row['name'] for row in value['checks'] if not row['pass']]}, ensure_ascii=False))
    raise SystemExit(0 if value['pass'] else 1)

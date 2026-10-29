#!/usr/bin/env python3
"""Delivered-byte UI tasks for Crow, Droll, their costs and saved replay."""
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

ROOT = Path(__file__).resolve().parents[1]


def cards(value, player, zone, card_id):
    return [row for row in value['current']['zones'][player][zone] if row['card']['id'] == card_id]


def undo_to(page, length):
    page.locator('#ygoDuelUndo').click()
    page.wait_for_function('length=>(YGOAdvancedWorkbench.report().scenario?.actions.length||0)===length', arg=length)
    return report(page)


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    html = artifact.read_bytes()
    html_hash = hashlib.sha256(html).hexdigest()
    assert html_hash == build['htmlSha256']
    target = url or 'https://ygo-release8.test/Analizador_YuGiOh.html'
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
        check('release8_boots_offline_from_the_manifest_bound_document', response is not None
              and hashlib.sha256(response.body()).hexdigest() == html_hash
              and page.evaluate('()=>navigator.onLine===false&&YGO_BUILD_MANIFEST.buildId') == build['buildId'])
        expected_ids = ['spark', 'spirit', 'invoked', 'swordsoul', 'branded', 'tenyi', 'salamangreat', 'roar', 'crow', 'droll', 'field', 'trap', 'evacuation']
        check('thirteen_visible_examples_preserve_the_previous_twelve_identifiers',
              page.locator('#ygoExampleSelect').evaluate('(el)=>[...el.options].map(o=>o.value)') == expected_ids)
        metadata = page.evaluate('()=>YGOResponses.capabilities().mechabaNonFieldMonsterActivations.filter(r=>["DD_CROW_BANISH","DROLL_LOCK"].includes(r.type))')
        check('crow_and_droll_are_explicit_hand_packets_without_an_invented_once_per_turn',
              {row['type'] for row in metadata} == {'DD_CROW_BANISH', 'DROLL_LOCK'}
              and all(row['activationZones'] == ['hand'] and row['restriction'] == 'NONE' for row in metadata))

        try:
            initial = load_example(page, 'crow')
            crow_uid = cards(initial, 1, 'hand', 24508238)[0]['uid']
            aleister_uid = cards(initial, 0, 'gy', 86120751)[0]['uid']
            cost_uid = cards(initial, 0, 'hand', 23771716)[0]['uid']
            first_mechaba = cards(initial, 0, 'monster', 75286621)[0]['uid']
            check('crow_guide_loads_without_autoplay_and_requires_a_second_mechaba', initial['scenario'] is None
                  and page.locator('#ygoExampleInstructions li').count() == 4
                  and len(cards(initial, 0, 'monster', 75286621)) == 1
                  and not page.evaluate('()=>YGOComboWorkbench.goalMatches(YGOAdvancedWorkbench.report().current,YGOScenarioExamples.get("crow").goal)'))
            negated = execute_step(page, 'DD_CROW_BANISH', player=1, sourceCard=24508238,
                                   targetCard=86120751, responseType='MECHABA', responseCostCard=23771716,
                                   counterCount=0)
            action = negated['scenario']['actions'][-1]
            check('crow_negation_preserves_the_opposing_discard_and_own_mechaba_cost',
                  cards(negated, 1, 'gy', 24508238)[0]['uid'] == crow_uid
                  and cards(negated, 0, 'gy', 86120751)[0]['uid'] == aleister_uid
                  and cards(negated, 0, 'gy', 23771716)[0]['uid'] == cost_uid
                  and action['proof']['activationOrigin']['zone'] == 'hand'
                  and action['proof']['activationOrigin']['player'] == 1
                  and action['proof']['activationOrigin']['restriction'] == 'NONE'
                  and action['proof']['activationNegated'] is True
                  and any(p['kind'] == 'DISCARD' and p['uid'] == crow_uid and p['player'] == 1 for p in action['paid'])
                  and any(p['kind'] == 'SEND_GY' and p['uid'] == cost_uid and p['player'] == 0 for p in action['paid']))
            check('crow_is_not_banished_again_from_its_new_gy_location',
                  not any(event['type'] == 'MECHABA_BANISH_ACTIVATED_CARD' and event.get('targetUid') == crow_uid for event in action['events'])
                  and any(event['type'] == 'MECHABA_BANISH_NOT_APPLIED' and event.get('targetUid') == crow_uid
                          and event.get('activationZone') == 'hand' and event.get('currentZone') == 'gy' for event in action['events']))
            final = execute_step(page, 'INVOCATION_MECHABA', materialCards=[86120751, 89631139], responseType=None)
            check('the_preserved_aleister_enables_a_second_distinct_physical_mechaba',
                  len(final['scenario']['actions']) == 2 and len(cards(final, 0, 'monster', 75286621)) == 2
                  and len({row['uid'] for row in cards(final, 0, 'monster', 75286621)}) == 2
                  and any(row['uid'] == first_mechaba for row in cards(final, 0, 'monster', 75286621))
                  and cards(final, 1, 'gy', 24508238)[0]['uid'] == crow_uid
                  and page.evaluate('()=>YGOComboWorkbench.goalMatches(YGOAdvancedWorkbench.report().current,YGOScenarioExamples.get("crow").goal)')
                  and final['scenario']['replay']['pass'] is True and final['competitiveScore'] is None)
            with page.expect_download() as pending:
                page.locator('#ygoAdvancedExport').click()
            exported = json.loads(Path(pending.value.path()).read_text())
            check('crow_report_export_is_bound_to_the_current_build_and_verified_trace',
                  exported['buildId'] == build['buildId'] and exported['scenario']['replay']['pass'] is True
                  and len(exported['scenario']['actions']) == 2)
            undo_to(page, 1)
            restored = undo_to(page, 0)
            check('undo_restores_both_costs_and_the_original_crow_target', restored['scenario'] is None
                  and cards(restored, 1, 'hand', 24508238)[0]['uid'] == crow_uid
                  and cards(restored, 0, 'hand', 23771716)[0]['uid'] == cost_uid
                  and cards(restored, 0, 'gy', 86120751)[0]['uid'] == aleister_uid)
            passed = execute_step(page, 'DD_CROW_BANISH', player=1, sourceCard=24508238,
                                  targetCard=86120751, responseType=None)
            check('passing_mechaba_banishes_aleister_and_removes_this_invocation_route',
                  cards(passed, 1, 'gy', 24508238)[0]['uid'] == crow_uid
                  and cards(passed, 0, 'banished', 86120751)[0]['uid'] == aleister_uid
                  and cards(passed, 0, 'hand', 23771716)[0]['uid'] == cost_uid
                  and not page.evaluate('()=>YGOComboEngine.enumerate(YGOAdvancedWorkbench.report().current).some(a=>a.type==="INVOCATION_MECHABA")')
                  and not page.evaluate('()=>YGOComboWorkbench.goalMatches(YGOAdvancedWorkbench.report().current,YGOScenarioExamples.get("crow").goal)'))
            page.locator('#ygoAdvancedImport').set_input_files({'name': 'crow-replay.json', 'mimeType': 'application/json', 'buffer': json.dumps(exported).encode()})
            page.wait_for_function('()=>YGOAdvancedWorkbench.report().scenario?.actions.length===2')
            resumed = report(page)
            check('crow_saved_report_reimports_and_replays_the_negated_branch',
                  resumed['scenario']['replay']['pass'] is True and len(cards(resumed, 0, 'monster', 75286621)) == 2
                  and cards(resumed, 1, 'gy', 24508238)[0]['uid'] == crow_uid)
        except Exception as error:
            check('crow_visible_tutorial_completed', False, str(error))

        try:
            initial = load_example(page, 'droll')
            droll_uid = cards(initial, 1, 'hand', 94145021)[0]['uid']
            cost_uid = cards(initial, 0, 'hand', 23771716)[0]['uid']
            check('droll_guide_respects_the_dated_one_copy_limit_without_autoplay', initial['scenario'] is None
                  and len(cards(initial, 1, 'hand', 94145021)) == 1
                  and page.locator('#ygoExampleInstructions li').count() == 5
                  and not page.evaluate('()=>YGOComboEngine.enumerate(YGOAdvancedWorkbench.report().current).some(a=>a.type==="DROLL_LOCK")'))
            execute_step(page, 'NORMAL_SUMMON', sourceCard=86120751, responseType=None)
            check('normal_summoning_alone_does_not_create_a_droll_window',
                  not page.evaluate('()=>YGOComboEngine.enumerate(YGOAdvancedWorkbench.report().current).some(a=>a.type==="DROLL_LOCK")'))
            searched = execute_step(page, 'ALEISTER_SEARCH', selectionCard=74063034, responseType=None)
            check('aleisters_actual_search_opens_the_registered_opposing_hand_window',
                  len(cards(searched, 0, 'hand', 74063034)) == 1
                  and bool(searched['current']['drollWindows'])
                  and page.evaluate('()=>YGOComboEngine.enumerate(YGOAdvancedWorkbench.report().current).some(a=>a.type==="DROLL_LOCK"&&a.player===1&&a.response?.type==="MECHABA")'))
            negated = execute_step(page, 'DROLL_LOCK', player=1, sourceCard=94145021,
                                   responseType='MECHABA', responseCostCard=23771716, counterCount=0)
            action = negated['scenario']['actions'][-1]
            check('droll_negation_keeps_both_send_costs_in_gy_without_a_deck_to_hand_lock',
                  cards(negated, 1, 'gy', 94145021)[0]['uid'] == droll_uid
                  and cards(negated, 0, 'gy', 23771716)[0]['uid'] == cost_uid
                  and action['proof']['activationOrigin']['zone'] == 'hand'
                  and action['proof']['activationOrigin']['restriction'] == 'NONE'
                  and action['proof']['activationNegated'] is True
                  and not any(lock['kind'] == 'NO_DECK_TO_HAND' for lock in negated['current']['locks'])
                  and all(any(p['uid'] == uid and p['kind'] == 'SEND_GY' for p in action['paid']) for uid in [droll_uid, cost_uid])
                  and not any(event['type'] == 'MECHABA_BANISH_ACTIVATED_CARD' and event.get('targetUid') == droll_uid for event in action['events']))
            check('the_resolved_chain_closes_the_old_droll_window_without_an_opt_flag',
                  negated['current']['drollWindows'] == []
                  and not any('DROLL' in key for key in negated['current']['used'])
                  and negated['scenario']['replay']['pass'] is True and negated['competitiveScore'] is None)
            restored = undo_to(page, 2)
            check('undo_restores_the_physical_droll_and_the_search_window',
                  cards(restored, 1, 'hand', 94145021)[0]['uid'] == droll_uid
                  and cards(restored, 0, 'hand', 23771716)[0]['uid'] == cost_uid
                  and bool(restored['current']['drollWindows']))
            passed = execute_step(page, 'DROLL_LOCK', player=1, sourceCard=94145021, responseType=None)
            check('passing_mechaba_applies_droll_to_both_players_and_keeps_its_send_cost',
                  cards(passed, 1, 'gy', 94145021)[0]['uid'] == droll_uid
                  and cards(passed, 0, 'hand', 23771716)[0]['uid'] == cost_uid
                  and any(lock['kind'] == 'NO_DECK_TO_HAND' and lock['appliesToPlayers'] == [0, 1] for lock in passed['current']['locks'])
                  and passed['current']['drollWindows'] == []
                  and passed['scenario']['replay']['pass'] is True and passed['competitiveScore'] is None)
        except Exception as error:
            check('droll_visible_tutorial_completed', False, str(error))
        check('release8_tasks_raise_no_javascript_page_errors', not errors, errors)
        version = browser.version
        browser.close()
    check('compiled_document_is_unchanged_during_release8_tasks', hashlib.sha256(artifact.read_bytes()).hexdigest() == html_hash)
    return {'schema': 'ygo-release8-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': html_hash, 'artifactMode': 'DELIVERED_BYTES',
            'sourceInjection': False, 'checks': checks, 'details': details,
            'browser': {'engine': 'chromium', 'version': version}, 'externalRequestsBlocked': len(blocked),
            'limitations': ['The dated TCG list limits Droll to one copy in the product fixtures.',
                            'The starting Mechaba and Aleister GY history are declared, not reconstructed summons.',
                            'Recorded packet and replay checks do not establish universal priority or competitive results.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release8-browser-results.json')
    args = parser.parse_args()
    started = time.monotonic()
    value = run(args.url)
    value['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.output.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': value['pass'], 'checks': len(value['checks']),
                      'failed': [row['name'] for row in value['checks'] if not row['pass']]}, ensure_ascii=False))
    raise SystemExit(0 if value['pass'] else 1)

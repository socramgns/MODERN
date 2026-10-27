#!/usr/bin/env python3
"""Delivered-byte offline UI checks for embedded examples, coverage and Mechaba."""
import argparse
import copy
import hashlib
import json
import os
from pathlib import Path
import shutil
import time

from playwright.sync_api import sync_playwright

from blue_eyes_browser import cards, click_action, fixture, import_scenario, report, with_opponent

ROOT = Path(__file__).resolve().parents[1]


def ready(page):
    page.wait_for_function('''()=>window.YGOAdvancedWorkbench
      && window.YGOScenarioExamples && window.YGOCardCoverage
      && document.getElementById('ygoExampleLoad')
      && document.getElementById('ygoCardCoverage')''', timeout=60000)
    page.evaluate('''async()=>{
      await YGODataCatalog.ready; await YGOUIState.ready;
      await YGOComboWorkbench.ready; await YGOAdvancedWorkbench.ready;
      await YGOCardCoverage.ready;
    }''')


def load_example(page, example_id):
    details = page.locator('#ygoExampleSelect').evaluate('(el)=>el.closest("details")?.open')
    if details is False:
        page.locator('details').filter(has=page.locator('#ygoExampleSelect')).locator('summary').first.click()
    page.locator('#ygoExampleSelect').select_option(example_id)
    page.locator('#ygoExampleLoad').click()
    page.wait_for_function('''id=>{
      const sample=YGOScenarioExamples.get(id),s=YGOAdvancedWorkbench.report();
      return !document.getElementById('ygoExampleLoad').disabled && !!s.current
        && s.scenario===null
        && YGOComboEngine.deckFingerprint(sample.deck)===YGOComboEngine.deckFingerprint(deckState)
        && JSON.stringify(s.current.provenance.setup)===JSON.stringify(sample.setup);
    }''', arg=example_id, timeout=30000)
    return report(page)


def spell_response_scenario():
    rival = fixture('Arquetipo_Invoked.json')
    rival['openingIds'][0] = 74063034
    remaining = [row['id'] for row in rival['deck']['main'] for _ in range(row['qty'])]
    for card_id in rival['openingIds']:
        remaining.remove(card_id)
    rival['remainingDeckIds'] = remaining
    value = with_opponent(fixture('Arquetipo_Branded.json'), rival)
    value['context'].update({
        'opponentPolicy': 'RESPONSES_EXPLICIT', 'responseTypes': ['MECHABA'],
        'responsePolicy': 'FIRST_ELIGIBLE',
    })
    value['setup'] = {
        'turn': 2, 'activePlayer': 0, 'phase': 'MAIN 1',
        'placements': [
            {'player': 1, 'from': 'extra', 'cardId': 75286621,
             'zone': 'monster', 'position': 'ATTACK', 'faceUp': True, 'summonTurn': 1},
        ],
    }
    return value


def run(url=None):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    html = artifact.read_bytes()
    html_hash = hashlib.sha256(html).hexdigest()
    target = url or 'https://ygo-offline-delivery.test/Analizador_YuGiOh.html'
    checks, details, errors, blocked = [], {}, [], []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    with sync_playwright() as pw:
        executable = os.environ.get('YGO_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
        browser = pw.chromium.launch(executable_path=executable, headless=True, args=['--no-sandbox'])
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
        check('offline_browser_received_exact_delivered_html_bytes',
              response is not None and hashlib.sha256(response.body()).hexdigest() == html_hash
              and page.evaluate('()=>navigator.onLine===false'))
        check('delivered_build_identity_matches_manifest',
              page.evaluate('()=>YGO_BUILD_MANIFEST.buildId') == build['buildId']
              and html_hash == build['htmlSha256'])
        example_defs = page.evaluate('()=>YGOScenarioExamples.list()')
        check('original_embedded_examples_preserved_and_menu_matches_declared_inventory',
              [row['id'] for row in example_defs][:3] == ['spark', 'spirit', 'invoked']
              and len({row['id'] for row in example_defs}) == len(example_defs)
              and all(row.get('replacesDeck') is True for row in example_defs)
              and page.locator('#ygoExampleSelect option').count() == len(example_defs)
              and page.locator('#ygoExampleSelect').evaluate('(el)=>[...el.options].map(option=>option.value)') == [row['id'] for row in example_defs]
              and page.locator('#ygoExampleSelect').evaluate(
                  '(el)=>/sustituy|reemplaz/i.test(el.closest("details").textContent)'))

        try:
            spark = load_example(page, 'spark')
            check('spark_example_loads_offline_with_real_declared_board',
                  spark['current']['turn'] == 2 and spark['current']['phase'] == 'BATTLE'
                  and len(cards(spark['current'], 0, 'monster', 89631139)) == 2
                  and len(cards(spark['current'], 1, 'monster', 83994433)) == 1
                  and spark['current']['context']['initialHistoryCertified'] is False)
            protected = click_action(page, 'STARDUST_SPARK_PROTECTION', player=1,
                                     sourceId=83994433, targetId=83994433)
            first = click_action(page, 'DUEL_ATTACK', player=0, sourceId=89631139, targetId=83994433)
            second = click_action(page, 'DUEL_ATTACK', player=0, sourceId=89631139, targetId=83994433)
            check('offline_spark_example_executes_one_protection_two_damage_events_and_replay',
                  protected['scenario']['replay']['pass']
                  and first['current']['lp'] == [8000, 7500]
                  and len(cards(first['current'], 1, 'monster', 83994433)) == 1
                  and second['current']['lp'] == [8000, 7000]
                  and not cards(second['current'], 1, 'monster', 83994433)
                  and second['scenario']['replay']['pass'])

            spirit = load_example(page, 'spirit')
            ashuna_uid = cards(spirit['current'], 0, 'gy', 87052196)[0]['uid']
            check('spirit_example_loads_offline_and_replaces_previous_trace',
                  spirit['current']['phase'] == 'MAIN 1' and spirit['scenario'] is None
                  and len(cards(spirit['current'], 1, 'monster', 59822133)) == 1
                  and page.locator('#ygoCausalPolicy').input_value() == 'SPIRIT')
            negated = click_action(page, 'TENYI_ASHUNA_DECK', sourceId=87052196, responseType='SPIRIT')
            last = negated['scenario']['actions'][-1]
            check('offline_spirit_example_preserves_banish_cost_and_replays_negation',
                  any(x['uid'] == ashuna_uid for x in negated['current']['zones'][0]['banished'])
                  and len(negated['current']['zones'][0]['monster']) == 1
                  and last['proof']['activationOrigin']['zone'] == 'gy'
                  and any(e['type'] == 'SPIRIT_NEGATE_GY_ACTIVATION' for e in last['events'])
                  and negated['scenario']['replay']['pass'])

            invoked = load_example(page, 'invoked')
            check('invoked_example_loads_offline_with_clean_empty_field',
                  invoked['scenario'] is None and not invoked['current']['zones'][0]['monster']
                  and len(cards(invoked['current'], 0, 'hand', 86120751)) == 1
                  and page.locator('#ygoCausalPolicy').input_value() == 'PASS')
            for action_type in ['NORMAL_SUMMON', 'ALEISTER_SEARCH', 'LINK_ARTEMIS',
                                'INVOCATION_MECHABA', 'INVOCATION_RECYCLE']:
                invoked = click_action(page, action_type)
            check('offline_invoked_example_completes_real_fusion_recovery_and_replay',
                  len(cards(invoked['current'], 0, 'monster', 75286621)) == 1
                  and len(cards(invoked['current'], 0, 'hand', 86120751)) == 1
                  and invoked['scenario']['replay']['pass']
                  and invoked['competitiveScore'] is None and invoked['certified'] is False)
        except Exception as error:
            check('embedded_examples_offline_ui_flow_completed', False, str(error))

        try:
            coverage = page.evaluate('()=>YGOCardCoverage.report()')
            physical = page.evaluate('''()=>Object.values(deckState)
              .filter(Array.isArray).flat().reduce((n,row)=>n+Number(row.qty??1),0)''')
            check('coverage_tracks_current_deck_with_build_context_and_explicit_partial_scope',
                  coverage['schema'] == 'ygo-card-action-coverage/v1'
                  and coverage['buildId'] == build['buildId']
                  and coverage['catalogSha256'] == build['catalogSha256']
                  and coverage['counts']['totalCopies'] == physical
                  and coverage['applicableInCurrentFormat'] is True
                  and coverage['certified'] is False and coverage['completeCardRules'] is False
                  and any(row['id'] == 86120751 for row in coverage['entries'])
                  and not any(row['id'] == 87052196 for row in coverage['entries']))
            coverage_details = page.locator('#ygoCardCoverage > details')
            if not coverage_details.evaluate('(el)=>el.open'):
                coverage_details.locator('summary').first.click()
            page.locator('#ygoCardCoverageFilter').fill('86120751')
            page.wait_for_function('''()=>{
              const rows=[...document.querySelectorAll('#ygoCardCoverageRows tr')];
              return rows.length===1 && rows[0].textContent.includes('86120751');
            }''', timeout=10000)
            check('coverage_text_filter_restricts_visible_rows_to_selected_identity',
                  page.locator('#ygoCardCoverageRows tr').count() == 1
                  and '86120751' in page.locator('#ygoCardCoverageRows').inner_text())
            page.locator('#ygoCardCoverageFilter').fill('')
            page.locator('#ygoCardCoverageZone').select_option('extra')
            expected_extra = [row for row in coverage['entries'] if row['zone'] == 'extra']
            page.wait_for_function('(n)=>document.querySelectorAll("#ygoCardCoverageRows tr").length===n',
                                   arg=len(expected_extra), timeout=10000)
            check('coverage_zone_filter_matches_actual_extra_entries',
                  page.locator('#ygoCardCoverageRows tr').count() == len(expected_extra)
                  and all(str(row['id']) in page.locator('#ygoCardCoverageRows').inner_text()
                          for row in expected_extra))
            with page.expect_download() as pending:
                page.locator('#ygoCardCoverageExport').click()
            coverage_path = ROOT / 'tests/release5-coverage-export.json'
            pending.value.save_as(str(coverage_path))
            exported = json.loads(coverage_path.read_text())
            check('coverage_export_keeps_full_inventory_and_exact_build_despite_visual_filter',
                  exported == coverage and exported['buildId'] == build['buildId']
                  and len(exported['entries']) > len(expected_extra))
            page.locator('#ygoCardCoverageZone').select_option('all')
            page.locator('.fmt[data-f="OCG"]').click()
            page.wait_for_function('()=>YGOCardCoverage.report().applicableInCurrentFormat===false')
            outside_tcg = page.evaluate('()=>YGOCardCoverage.report()')
            check('coverage_does_not_present_tcg_action_registry_as_other_format_validation',
                  outside_tcg['format'].lower() == 'ocg'
                  and outside_tcg['applicableInCurrentFormat'] is False
                  and outside_tcg['certified'] is False and outside_tcg['completeCardRules'] is False)
        except Exception as error:
            check('coverage_ui_flow_completed', False, str(error))

        try:
            spec = spell_response_scenario()
            import_scenario(page, spec)
            before = report(page)
            spell_uid = cards(before['current'], 0, 'hand', 44362883)[0]['uid']
            cost_uid = cards(before['current'], 1, 'hand', 74063034)[0]['uid']
            mechaba_uid = cards(before['current'], 1, 'monster', 75286621)[0]['uid']
            negated = click_action(page, 'BRANDED_FUSION_LUBELLION', sourceId=44362883,
                                   responseType='MECHABA')
            last = negated['scenario']['actions'][-1]
            check('gui_mechaba_spell_packet_pays_matching_physical_spell_cost',
                  last['response']['costUid'] == cost_uid
                  and any(x['uid'] == cost_uid for x in negated['current']['zones'][1]['gy'])
                  and any(p['uid'] == cost_uid and p['kind'] == 'SEND_GY' for p in last['paid'])
                  and negated['current']['used'].get('MECHABA_NEGATE:' + mechaba_uid) is True)
            check('gui_mechaba_negates_normal_spell_banishes_same_source_and_preserves_materials',
                  any(x['uid'] == spell_uid for x in negated['current']['zones'][0]['banished'])
                  and negated['current']['zones'][0]['deck'] == before['current']['zones'][0]['deck']
                  and not negated['current']['zones'][0]['monster']
                  and not cards(negated['current'], 0, 'gy', 44362883)
                  and last['proof']['activationNegated'] is True
                  and any(e['type'] == 'MECHABA_BANISH_ACTIVATED_CARD' for e in last['events'])
                  and negated['scenario']['replay']['pass'])
            window = last['proof'].get('normalSpellActivation') or {}
            banished_spell = cards(negated['current'], 0, 'banished', 44362883)[0]
            check('gui_mechaba_uses_real_spell_activation_zone_without_false_gy_visit_or_activation_limit',
                  window.get('originZone') == 'hand' and window.get('activationZone') == 'spelltrap'
                  and window.get('sourceUid') == spell_uid
                  and banished_spell.get('sentToGyTurn') is None
                  and any(e['type'] == 'MECHABA_BANISH_ACTIVATED_CARD'
                          and e.get('from') == 'spelltrap' for e in last['events'])
                  and not any(e['type'] == 'NORMAL_SPELL_RESOLUTION_CLEANUP' for e in last['events'])
                  and negated['current']['used'].get('BRANDED_FUSION_ACTIVATED') is not True
                  and not any(lock.get('kind') == 'FUSION_ONLY' for lock in negated['current']['locks']))
            coverage_after = page.evaluate('()=>YGOCardCoverage.report()')
            check('coverage_refreshes_after_loading_another_deck',
                  any(row['id'] == 44362883 for row in coverage_after['entries'])
                  and not any(row['id'] == 86120751 for row in coverage_after['entries']))
        except Exception as error:
            check('mechaba_normal_spell_ui_flow_completed', False, str(error))

        check('no_browser_page_errors', not errors, errors)
        version = browser.version
        browser.close()

    check('artifact_unchanged_during_browser_test',
          hashlib.sha256(artifact.read_bytes()).hexdigest() == html_hash
          and json.loads((ROOT / 'dist/build-manifest.json').read_text())['buildId'] == build['buildId'])
    return {
        'schema': 'ygo-release5-browser-validation/v1',
        'pass': all(row['pass'] for row in checks),
        'artifactMode': 'DELIVERED_BYTES', 'transport': 'PLAYWRIGHT_ROUTE_EXACT_BYTES_OFFLINE',
        'buildId': build['buildId'], 'htmlSha256': html_hash,
        'browser': {'engine': 'chromium', 'version': version},
        'checks': checks, 'details': details, 'externalRequestsBlocked': len(blocked),
        'limitations': [
            'Exact final HTML bytes are fulfilled locally while the browser reports offline.',
            'Remote images are blocked; this does not claim image availability without Internet.',
            'The examples declare prior fields and are diagnostic fixtures, not competitive lists.',
            'Mechaba coverage is limited to the registered activation packets.',
            'This does not establish direct file: navigation or Firefox/WebKit compatibility.',
        ],
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release5-browser-results.json')
    args = parser.parse_args()
    started = time.monotonic()
    result = run(args.url)
    result['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2))
    print(json.dumps({
        'pass': result['pass'], 'checks': len(result['checks']),
        'failed': [row['name'] for row in result['checks'] if not row['pass']],
    }, ensure_ascii=False), flush=True)
    raise SystemExit(0 if result['pass'] else 1)

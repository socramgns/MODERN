#!/usr/bin/env python3
"""Exercise Spark, Spirit and resumable reports through the delivered HTML UI."""
import argparse
import copy
import functools
import hashlib
import json
import os
from pathlib import Path
import shutil
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def fixture(name):
    return json.loads((ROOT / 'examples' / name).read_text())


def blue_deck():
    value = fixture('Arquetipo_BlueEyes.json')
    value['deck']['extra'].extend([
        {'id': 83994433, 'qty': 1}, {'id': 40908371, 'qty': 1},
    ])
    return value


def with_opponent(value, rival):
    value = copy.deepcopy(value)
    value['opponentDeck'] = copy.deepcopy(rival['deck'])
    value['opponentOpeningIds'] = list(rival['openingIds'])
    value['opponentRemainingDeckIds'] = list(rival['remainingDeckIds'])
    value['context']['duelMode'] = True
    return value


def wait_ready(page):
    page.wait_for_function(
        'window.YGOAdvancedWorkbench && document.getElementById("ygoAdvancedWorkbench")',
        timeout=60000,
    )
    page.evaluate('''async()=>{
      await YGODataCatalog.ready; await YGOUIState.ready;
      await YGOComboWorkbench.ready; await YGOAdvancedWorkbench.ready;
    }''')


def import_scenario(page, value):
    page.locator('#ygoCausalFile').set_input_files({
        'name': 'blue-eyes-browser-scenario.json',
        'mimeType': 'application/json',
        'buffer': json.dumps(value).encode(),
    })
    page.wait_for_function('''expected=>{
      const r=YGOComboWorkbench.report();
      return JSON.stringify(r.openingIds)===JSON.stringify(expected.openingIds)
        && JSON.stringify(r.setup)===JSON.stringify(expected.setup);
    }''', arg=value, timeout=20000)
    page.locator('#ygoDuelInitialize').click()
    page.wait_for_function('''expected=>{
      const s=YGOAdvancedWorkbench.report().current;
      return !!s && s.turn===expected.turn && s.phase===expected.phase
        && s.context.duelMode===true;
    }''', arg=value['setup'], timeout=20000)


def report(page):
    return page.evaluate('()=>YGOAdvancedWorkbench.report()')


def click_action(page, action_type, **criteria):
    selected = page.evaluate('''({type,criteria})=>{
      const r=YGOAdvancedWorkbench.report(),st=r.current,H=YGOComboEngine.helpers;
      const id=uid=>Number(H.card(H.locate(st,uid)?.item)?.id);
      const actions=YGOAdvancedWorkbench.actions();
      const index=actions.findIndex(a=>a.type===type
        && (criteria.player===undefined||a.player===criteria.player)
        && (!criteria.responseType||a.response?.type===criteria.responseType)
        && (!criteria.sourceId||id(a.sourceUid||a.attackerUid)===criteria.sourceId)
        && (!criteria.targetId||id(a.targetUid)===criteria.targetId)
        && (!criteria.toPhase||a.toPhase===criteria.toPhase));
      return{index,count:r.scenario?.actions.length||0,
        available:actions.map(a=>({type:a.type,player:a.player,
          sourceUid:a.sourceUid,attackerUid:a.attackerUid,targetUid:a.targetUid,response:a.response,toPhase:a.toPhase}))};
    }''', {'type': action_type, 'criteria': criteria})
    assert selected['index'] >= 0, {
        'type': action_type, 'criteria': criteria, 'available': selected['available'],
    }
    page.locator('#ygoDuelActions').select_option(str(selected['index']))
    page.locator('#ygoDuelStep').click()
    page.wait_for_function(
        '(count)=>(YGOAdvancedWorkbench.report().scenario?.actions.length||0)===count+1',
        arg=selected['count'], timeout=20000,
    )
    return report(page)


def cards(state, player, zone, card_id):
    return [x for x in state['zones'][player][zone] if x['card']['id'] == card_id]


def run(url):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    html_hash = hashlib.sha256(artifact.read_bytes()).hexdigest()
    rows, details, errors = [], {}, []

    def check(name, passed, detail=None):
        rows.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    with sync_playwright() as pw:
        executable = os.environ.get('YGO_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
        browser = pw.chromium.launch(executable_path=executable, headless=True, args=['--no-sandbox'])
        context = browser.new_context(accept_downloads=True, viewport={'width': 1440, 'height': 1000})
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        response = page.goto(url, wait_until='domcontentloaded')
        wait_ready(page)
        check('browser_received_exact_delivered_html_bytes',
              response is not None and hashlib.sha256(response.body()).hexdigest() == html_hash)
        check('delivered_build_identity_matches_manifest',
              page.evaluate('()=>YGO_BUILD_MANIFEST.buildId') == build['buildId']
              and html_hash == build['htmlSha256'])
        check('spirit_policy_and_resumable_report_controls_are_present',
              page.locator('#ygoCausalPolicy option[value="SPIRIT"]').count() == 1
              and page.locator('#ygoAdvancedImport').count() == 1)

        # Two actual 3000 ATK physical copies attack the same 2500 ATK Spark.
        # Its first destruction is prevented, but both battles still deal 500.
        try:
            blue = with_opponent(blue_deck(), blue_deck())
            blue['setup'] = {
                'turn': 2, 'activePlayer': 0, 'phase': 'BATTLE',
                'placements': [
                    {'player': 0, 'from': 'deck', 'cardId': 89631139, 'zone': 'monster',
                     'position': 'ATTACK', 'faceUp': True, 'summonTurn': 1},
                    {'player': 0, 'from': 'deck', 'cardId': 89631139, 'zone': 'monster',
                     'position': 'ATTACK', 'faceUp': True, 'summonTurn': 1},
                    {'player': 1, 'from': 'extra', 'cardId': 83994433, 'zone': 'monster',
                     'position': 'ATTACK', 'faceUp': True, 'summonTurn': 1},
                ],
            }
            import_scenario(page, blue)
            before = report(page)
            spark_uid = cards(before['current'], 1, 'monster', 83994433)[0]['uid']
            protected = click_action(page, 'STARDUST_SPARK_PROTECTION', player=1,
                                     sourceId=83994433, targetId=83994433)
            charge = cards(protected['current'], 1, 'monster', 83994433)[0]['sparkProtection']
            check('gui_spark_quick_effect_creates_physical_single_use_protection',
                  charge['remaining'] == 1 and charge['turn'] == 2
                  and charge['sourceUid'] == spark_uid and charge['targetUid'] == spark_uid
                  and protected['scenario']['replay']['pass'])

            first = click_action(page, 'DUEL_ATTACK', player=0, sourceId=89631139, targetId=83994433)
            first_spark = cards(first['current'], 1, 'monster', 83994433)
            check('gui_first_battle_consumes_protection_and_still_applies_damage',
                  first['current']['lp'] == [8000, 7500]
                  and len(first_spark) == 1 and first_spark[0]['sparkProtection']['remaining'] == 0
                  and any(e['type'] == 'SPARK_DESTRUCTION_PREVENTED'
                          for e in first['scenario']['actions'][-1]['events'])
                  and first['scenario']['replay']['pass'])

            second = click_action(page, 'DUEL_ATTACK', player=0, sourceId=89631139, targetId=83994433)
            check('gui_second_battle_destroys_same_copy_after_shared_charge_is_spent',
                  second['current']['lp'] == [8000, 7000]
                  and not cards(second['current'], 1, 'monster', 83994433)
                  and cards(second['current'], 1, 'gy', 83994433)[0]['uid'] == spark_uid
                  and second['scenario']['replay']['pass'])
            check('gui_replay_keeps_declared_history_provisional',
                  second['initial']['context']['initialHistoryCertified'] is False
                  and second['certified'] is False and second['competitiveScore'] is None)
        except Exception as error:
            check('spark_battle_ui_flow_completed', False, str(error))

        try:
            tenyi = with_opponent(fixture('Expansion_Tenyi.json'), blue_deck())
            tenyi['context'].update({
                'opponentPolicy': 'RESPONSES_EXPLICIT', 'responseTypes': ['SPIRIT'],
                'responsePolicy': 'FIRST_ELIGIBLE',
            })
            tenyi['setup'] = {
                'turn': 2, 'activePlayer': 0, 'phase': 'MAIN 1',
                'placements': [
                    {'player': 0, 'from': 'hand', 'cardId': 87052196, 'zone': 'gy'},
                    {'player': 0, 'from': 'extra', 'cardId': 32519092, 'zone': 'monster',
                     'position': 'ATTACK', 'faceUp': True, 'summonTurn': 1},
                    {'player': 1, 'from': 'extra', 'cardId': 59822133, 'zone': 'monster',
                     'position': 'DEFENSE', 'faceUp': True, 'summonTurn': 1},
                ],
            }
            import_scenario(page, tenyi)
            check('scenario_import_preserves_spirit_policy_in_visible_control',
                  page.locator('#ygoCausalPolicy').input_value() == 'SPIRIT'
                  and page.evaluate('()=>YGOComboWorkbench.input().context.responseTypes.includes("SPIRIT")'))
            before = report(page)
            ashuna_uid = cards(before['current'], 0, 'gy', 87052196)[0]['uid']
            spirit_uid = cards(before['current'], 1, 'monster', 59822133)[0]['uid']
            check('declared_spirit_without_synchro_history_has_a_gy_response',
                  cards(before['current'], 1, 'monster', 59822133)[0].get('properlySummoned') is not True
                  and page.evaluate('()=>YGOAdvancedWorkbench.actions().some(a=>a.type==="TENYI_ASHUNA_DECK"&&a.response?.type==="SPIRIT")'))
            negated = click_action(page, 'TENYI_ASHUNA_DECK', responseType='SPIRIT', sourceId=87052196)
            action = negated['scenario']['actions'][-1]
            check('gui_spirit_negates_gy_activation_while_preserving_actual_banish_cost',
                  any(x['uid'] == ashuna_uid for x in negated['current']['zones'][0]['banished'])
                  and len(negated['current']['zones'][0]['monster']) == 1
                  and any(p['kind'] == 'BANISH' and p['uid'] == ashuna_uid for p in action['paid'])
                  and negated['scenario']['replay']['pass'])
            origin = action.get('proof', {}).get('activationOrigin', {})
            check('gui_trace_records_pre_cost_gy_origin_and_non_targeting_negation',
                  origin.get('zone') == 'gy' and origin.get('sourceUid') == ashuna_uid
                  and any(e['type'] == 'SPIRIT_NEGATE_GY_ACTIVATION'
                          and e.get('nonTargeting') is True and e.get('activationZone') == 'gy'
                          for e in action['events'])
                  and negated['current']['used'].get('SPIRIT_GY_NEGATE:' + spirit_uid) is True)

            # Real UI download and file import must resume the reconstructed trace.
            with page.expect_download() as pending:
                page.locator('#ygoAdvancedExport').click()
            exported_path = ROOT / 'tests/blue-eyes-browser-export.json'
            pending.value.save_as(str(exported_path))
            exported = json.loads(exported_path.read_text())
            page.locator('#ygoDuelUndo').click()
            page.wait_for_function('()=>YGOAdvancedWorkbench.report().scenario===null')
            page.locator('#ygoAdvancedImport').set_input_files(str(exported_path))
            page.wait_for_function('()=>YGOAdvancedWorkbench.report().scenario?.actions.length===1', timeout=20000)
            resumed = report(page)
            check('gui_download_import_resumes_spirit_trace_with_fresh_replay',
                  resumed['current'] == exported['current']
                  and resumed['scenario']['replay']['pass']
                  and resumed['scenario']['actions'][-1]['response']['type'] == 'SPIRIT'
                  and page.locator('#ygoDuelBoard').inner_text().find('Replay válido') >= 0)

            before_rejected = report(page)
            wrong_build = copy.deepcopy(exported)
            wrong_build['buildId'] = 'not-the-delivered-build'
            page.locator('#ygoAdvancedImport').set_input_files({
                'name': 'wrong-build.json', 'mimeType': 'application/json',
                'buffer': json.dumps(wrong_build).encode(),
            })
            page.wait_for_function('()=>document.getElementById("ygoAdvancedStatus").textContent.startsWith("No completado")', timeout=20000)
            check('gui_report_from_another_build_is_rejected_without_mutating_scenario',
                  report(page) == before_rejected)

            tampered = copy.deepcopy(exported)
            tampered['current']['lp'][0] -= 1
            if tampered.get('scenario'):
                tampered['scenario']['after']['lp'][0] -= 1
                if tampered['scenario'].get('state'):
                    tampered['scenario']['state']['lp'][0] -= 1
            page.locator('#ygoAdvancedImport').set_input_files({
                'name': 'tampered-state.json', 'mimeType': 'application/json',
                'buffer': json.dumps(tampered).encode(),
            })
            page.wait_for_function('''()=>{
              const text=document.getElementById('ygoAdvancedStatus').textContent;
              return text.startsWith('No completado')
                && document.getElementById('ygoAdvancedImport').value==='';
            }''', timeout=20000)
            check('gui_tampered_trace_is_rejected_without_mutating_scenario',
                  report(page) == before_rejected)
        except Exception as error:
            check('spirit_and_report_ui_flow_completed', False, str(error))

        check('no_browser_page_errors', not errors, errors)
        browser_version = browser.version
        browser.close()

    check('artifact_unchanged_during_browser_test',
          hashlib.sha256(artifact.read_bytes()).hexdigest() == html_hash
          and json.loads((ROOT / 'dist/build-manifest.json').read_text())['buildId'] == build['buildId'])
    return {
        'schema': 'ygo-blue-eyes-browser-validation/v1',
        'pass': all(row['pass'] for row in rows),
        'artifactMode': 'DELIVERED_BYTES',
        'buildId': build['buildId'], 'htmlSha256': html_hash,
        'browser': {'engine': 'chromium', 'version': browser_version},
        'checks': rows, 'details': details,
        'limitations': [
            'The browser opened exact delivered bytes over a temporary local HTTP server.',
            'This does not establish direct file: navigation or Firefox/WebKit compatibility.',
            'Physical starting fields and prior history are declared scenario assumptions.',
            'The tested policy packets do not establish arbitrary chain priority or a win rate.',
        ],
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/blue-eyes-browser-results.json')
    args = parser.parse_args()
    server = None
    try:
        url = args.url
        if not url:
            build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
            artifact = ROOT / build['output']
            server = ThreadingHTTPServer(
                ('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(artifact.parent)),
            )
            threading.Thread(target=server.serve_forever, daemon=True).start()
            url = f'http://127.0.0.1:{server.server_port}/{artifact.name}'
        started = time.monotonic()
        result = run(url)
        result['elapsedSeconds'] = round(time.monotonic() - started, 2)
        args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2))
        print(json.dumps({
            'pass': result['pass'], 'checks': len(result['checks']),
            'failed': [row['name'] for row in result['checks'] if not row['pass']],
        }, ensure_ascii=False), flush=True)
        raise SystemExit(0 if result['pass'] else 1)
    finally:
        if server:
            server.shutdown()

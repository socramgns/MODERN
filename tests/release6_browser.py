#!/usr/bin/env python3
"""Roar and imported multi-provider policies through the actual laboratory UI."""
import argparse
import copy
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import time

from playwright.sync_api import sync_playwright

from advanced_browser import ready

ROOT = Path(__file__).resolve().parents[1]
SPARK, WOLF, ROAR, MECHABA = 83994433, 87871125, 51339637, 75286621


def scenario(multiple=False, set_turn=1, with_link=True):
    invoked = json.loads((ROOT / 'examples/Arquetipo_Invoked.json').read_text())
    fillers = [row['id'] for row in invoked['deck']['main']
               if row['id'] not in [86120751, 74063034]] + [63749102, 74367458, 48305365, 32452818]

    def deck(include_roar=False, extra=None):
        rows = [{'id': ROAR, 'qty': 1}] if include_roar else []
        total = sum(row['qty'] for row in rows)
        for card_id in fillers:
            qty = min(3, 40 - total)
            if qty:
                rows.append({'id': card_id, 'qty': qty})
                total += qty
        assert total == 40
        return {'main': rows, 'extra': [{'id': card_id, 'qty': 1} for card_id in extra or []], 'side': []}

    own = deck(extra=[SPARK])
    rival = deck(include_roar=True, extra=[WOLF] + ([MECHABA] if multiple else []))

    def opening(value):
        cards = [row['id'] for row in value['main'] for _ in range(row['qty']) if row['id'] != ROAR]
        return cards[:5]

    def remaining(value, hand):
        cards = [row['id'] for row in value['main'] for _ in range(row['qty'])]
        for card_id in hand:
            cards.remove(card_id)
        return cards

    hand, rival_hand = opening(own), opening(rival)
    placements = [
        {'player': 0, 'from': 'extra', 'cardId': SPARK, 'zone': 'monster',
         'faceUp': True, 'position': 'ATTACK', 'zoneIndex': 0, 'summonTurn': 1},
        {'player': 1, 'from': 'deck', 'cardId': ROAR, 'zone': 'spelltrap',
         'faceUp': False, 'zoneIndex': 2, 'setTurn': set_turn},
    ]
    if with_link:
        placements.append({'player': 1, 'from': 'extra', 'cardId': WOLF,
                           'zone': 'monster', 'faceUp': True, 'position': 'ATTACK', 'zoneIndex': 5})
    if multiple:
        placements.append({'player': 1, 'from': 'extra', 'cardId': MECHABA,
                           'zone': 'monster', 'faceUp': True, 'position': 'ATTACK', 'zoneIndex': 0})
    return {
        'schema': 'ygo-archetype-fixture/v1', 'name': 'Roar · escenario físico de interfaz',
        'description': 'Fixture técnico con monstruos Normales; no es una lista competitiva.',
        'deck': own, 'openingIds': hand, 'remainingDeckIds': remaining(own, hand),
        'opponentDeck': rival, 'opponentOpeningIds': rival_hand,
        'opponentRemainingDeckIds': remaining(rival, rival_hand),
        'context': {'format': 'tcg', 'duelMode': True, 'opponentPolicy': 'RESPONSES_EXPLICIT',
                    'responseTypes': ['MECHABA', 'ROAR'] if multiple else ['ROAR'],
                    'responsePolicy': 'CHOICE_BRANCHES', 'ashPolicy': 'CHOICE_BRANCHES'},
        'setup': {'turn': 2, 'activePlayer': 0, 'phase': 'MAIN 1', 'placements': placements},
        'goal': {'requiredFieldIds': [SPARK]},
    }


def import_fixture(page, value):
    page.locator('#ygoCausalFile').set_input_files({
        'name': 'roar-policy.json', 'mimeType': 'application/json',
        'buffer': json.dumps(value).encode(),
    })
    page.wait_for_function('''types=>!YGOComboWorkbench.isBusy
      && JSON.stringify(YGOComboWorkbench.report().scenarioContext.responseTypes)===JSON.stringify(types)
      && document.getElementById('ygoCausalFile').value==='' ''', arg=value['context']['responseTypes'])


def initialize(page):
    page.locator('#ygoDuelInitialize').click()
    page.wait_for_function('YGOAdvancedWorkbench.report().current?.turn===2&&YGOAdvancedWorkbench.report().scenario===null')


def run(url=None, source_inject=False):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    html = artifact.read_bytes()
    artifact_hash = hashlib.sha256(html).hexdigest()
    if source_inject:
        text = html.decode()
        for module in ['combo-workbench', 'advanced-workbench']:
            pattern = r'<script data-ygo-stable-module="' + module + r'">[\s\S]*?</script>'
            text, count = re.subn(pattern, lambda _, module=module:
                                  '<script data-ygo-stable-module="' + module + '">\n'
                                  + (ROOT / 'src/app' / (module + '.js')).read_text() + '\n</script>', text)
            assert count == 1, (module, count)
        html = text.encode()
    target = url or 'https://ygo-release6-delivery.test/Analizador_YuGiOh.html'
    checks, details, errors = [], {}, []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    with sync_playwright() as pw:
        executable = os.environ.get('YGO_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
        browser = pw.chromium.launch(executable_path=executable, headless=True, args=['--no-sandbox'])
        context = browser.new_context(viewport={'width': 1440, 'height': 1000})
        context.route('**/*', lambda route: route.fulfill(status=200, content_type='text/html; charset=utf-8', body=html)
                      if route.request.url == target else route.abort())
        context.set_offline(True)
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        response = page.goto(target, wait_until='domcontentloaded')
        ready(page)
        check('source_injected_development_boot' if source_inject else 'exact_delivered_bytes_boot_offline',
              response is not None and hashlib.sha256(response.body()).hexdigest() == hashlib.sha256(html).hexdigest()
              and page.evaluate('()=>navigator.onLine===false'))
        try:
            value = scenario()
            import_fixture(page, value)
            preserved = page.evaluate('()=>({policy:document.getElementById("ygoCausalPolicy").value,input:YGOComboWorkbench.input().context})')
            check('single_roar_import_preserves_registered_provider_and_choice_policy',
                  preserved['policy'] == 'ROAR' and preserved['input']['opponentPolicy'] == 'RESPONSES_EXPLICIT'
                  and preserved['input']['responseTypes'] == ['ROAR']
                  and preserved['input']['responsePolicy'] == 'CHOICE_BRANCHES'
                  and preserved['input']['ashPolicy'] == 'CHOICE_BRANCHES')
            initialize(page)
            selected = page.evaluate('''()=>{
              const r=YGOAdvancedWorkbench.report(),spark=r.current.zones[0].monster.find(x=>x.card.id===83994433),actions=YGOAdvancedWorkbench.actions();
              return{index:actions.findIndex(a=>a.type==='STARDUST_SPARK_PROTECTION'&&a.sourceUid===spark.uid&&a.targetUid===spark.uid&&a.response?.type==='ROAR'&&!a.counterResponses),
                spark:spark.uid,roar:r.current.zones[1].spelltrap.find(x=>x.card.id===51339637).uid};
            }''')
            check('laboratory_exposes_physical_roar_variant_and_readable_label', selected['index'] >= 0
                  and 'Salamangreat Roar' in page.locator('#ygoDuelActions option[value="' + str(selected['index']) + '"]').inner_text())
            page.locator('#ygoDuelActions').select_option(str(selected['index']))
            page.locator('#ygoDuelStep').click()
            page.wait_for_function('YGOAdvancedWorkbench.report().scenario?.actions.length===1')
            result = page.evaluate('()=>YGOAdvancedWorkbench.report()')
            action = result['scenario']['actions'][0]
            check('gui_roar_negates_spark_destroys_actual_source_and_replays',
                  result['scenario']['replay']['pass'] and action['response']['type'] == 'ROAR'
                  and any(row['uid'] == selected['spark'] for row in result['current']['zones'][0]['gy'])
                  and any(row['uid'] == selected['roar'] for row in result['current']['zones'][1]['gy'])
                  and not result['current']['zones'][0]['monster']
                  and any(event['type'] == 'ROAR_ACTIVATION_NEGATED' for event in action['events']))
            compared = page.evaluate('async()=>await YGOAdvancedWorkbench.compare({maxDepth:1,maxStates:40,maxMs:1200})')
            check('comparison_includes_roar_with_its_same_valid_physical_start',
                  [row['id'] for row in compared['matrix']] == ['PASS', 'ROAR']
                  and all(row['baselineVerified'] for row in compared['matrix'])
                  and page.evaluate('''()=>YGOAdvancedWorkbench.report().comparisonInputs.scenarios.every(row=>
                    row.initialState.provenance.setup.placements.some(p=>p.cardId===51339637&&p.setTurn===1))'''))
            for fixture, reason in [(scenario(set_turn=2), 'set_this_turn'),
                                    (scenario(with_link=False), 'without_salamangreat_link')]:
                page.evaluate('async value=>await YGOComboWorkbench.loadScenario(value)', fixture)
                page.locator('#ygoDuelInitialize').click()
                page.wait_for_function('YGOAdvancedWorkbench.report().current!==null&&YGOAdvancedWorkbench.report().scenario===null')
                comparison = page.evaluate('async()=>await YGOAdvancedWorkbench.compare({maxDepth:1,maxStates:40,maxMs:1200})')
                check('comparison_excludes_unavailable_roar_' + reason,
                      not any(row['id'] == 'ROAR' for row in comparison['matrix']))
            value = scenario(multiple=True)
            import_fixture(page, value)
            multi = page.evaluate('()=>({policy:document.getElementById("ygoCausalPolicy").value,context:YGOComboWorkbench.input().context})')
            check('multiple_provider_import_keeps_order_and_context_in_custom_option',
                  multi['policy'] == 'RESPONSES_EXPLICIT'
                  and multi['context']['opponentPolicy'] == 'RESPONSES_EXPLICIT'
                  and multi['context']['responseTypes'] == ['MECHABA', 'ROAR']
                  and multi['context']['responsePolicy'] == 'CHOICE_BRANCHES')
            initialize(page)
            check('both_imported_providers_reach_laboratory_action_variants',
                  page.evaluate('''()=>{const rows=YGOAdvancedWorkbench.actions().filter(a=>a.type==='STARDUST_SPARK_PROTECTION');
                    return rows.some(a=>a.response?.type==='MECHABA')&&rows.some(a=>a.response?.type==='ROAR');}'''))
            page.locator('#ygoCausalPolicy').select_option('ROAR')
            individual = page.evaluate('()=>YGOComboWorkbench.input().context')
            page.locator('#ygoCausalPolicy').select_option('RESPONSES_EXPLICIT')
            check('individual_choice_and_return_to_imported_policy_are_lossless',
                  individual['responseTypes'] == ['ROAR']
                  and page.evaluate('()=>YGOComboWorkbench.input().context.responseTypes') == ['MECHABA', 'ROAR'])
            rejected = page.evaluate('''async fixture=>{
              const saved=JSON.stringify(YGOComboWorkbench.report()),policy=document.getElementById('ygoCausalPolicy').value;
              const rows=[];for(const types of [['UNREGISTERED_PROVIDER'],[]]){
                const bad=structuredClone(fixture);bad.context.responseTypes=types;let error=null;
                try{await YGOComboWorkbench.loadScenario(bad)}catch(e){error=e.message}
                rows.push(!!error&&JSON.stringify(YGOComboWorkbench.report())===saved&&document.getElementById('ygoCausalPolicy').value===policy);
              }return rows.every(Boolean);
            }''', value)
            check('unknown_or_missing_providers_are_rejected_before_replacing_scenario', rejected)
        except Exception as error:
            check('roar_policy_ui_flow_completed', False, str(error))
        check('no_uncaught_page_errors', not errors, errors)
        browser.close()
    check('original_artifact_unchanged', hashlib.sha256(artifact.read_bytes()).hexdigest() == artifact_hash)
    return {'schema': 'ygo-release6-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': artifact_hash,
            'artifactMode': 'SOURCE_INJECTED_DEVELOPMENT' if source_inject else 'DELIVERED_BYTES',
            'checks': checks, 'details': details,
            'limitations': ['Technical physical fixtures are not competitive deck recommendations.',
                            'Registered providers and chains keep their declared scope.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url')
    parser.add_argument('--source-inject', action='store_true')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/release6-browser-results.json')
    args = parser.parse_args()
    started = time.monotonic()
    result = run(args.url, args.source_inject)
    result['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': result['pass'], 'checks': len(result['checks']),
                      'failed': [row['name'] for row in result['checks'] if not row['pass']],
                      'seconds': result['elapsedSeconds']}))
    raise SystemExit(0 if result['pass'] else 1)

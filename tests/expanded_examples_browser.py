#!/usr/bin/env python3
"""Offline delivered-byte tasks for the five additional embedded tutorials."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import time

from playwright.sync_api import sync_playwright
from release5_browser import load_example, ready

ROOT = Path(__file__).resolve().parents[1]


def report(page):
    return page.evaluate('()=>YGOAdvancedWorkbench.report()')


def execute_step(page, action_type, **criteria):
    """Choose an actual rendered option and verify the physical action it ran."""
    page.locator('#ygoDuelActionFilter').fill(action_type)
    choice = page.evaluate('''({type,criteria})=>{
      const state=YGOAdvancedWorkbench.report().current,E=YGOComboEngine;
      const id=uid=>Number(E.helpers.card(E.helpers.locate(state,uid)?.item)?.id);
      return E.enumerate(state).map((action,index)=>({action,index})).find(({action:a})=>{
        if(a.type!==type)return false;
        for(const [key,value]of Object.entries(criteria)){
          if(key==='sourceCard'&&id(a.sourceUid)!==value)return false;
          if(key==='selectionCard'&&id(a.selectionUid)!==value)return false;
          if(key==='revealCard'&&id(a.revealUid)!==value)return false;
          if(key==='discardCard'&&id(a.discardUid)!==value)return false;
          if(key==='targetCard'&&id(a.targetUid)!==value)return false;
          if(key==='materialCards'&&JSON.stringify(a.materialUids.map(id).sort((a,b)=>a-b))!==JSON.stringify([...value].sort((a,b)=>a-b)))return false;
          if(key==='destination'&&a.destination!==value)return false;
          if(key==='makeToken'&&a.makeToken!==value)return false;
          if(key==='triggerKind'&&a.triggerKind!==value)return false;
          if(key==='responseType'&&(a.response?.type??null)!==value)return false;
          if(key==='responseCostCard'&&id(a.response?.costUid)!==value)return false;
          if(key==='player'&&a.player!==value)return false;
          if(key==='counterCount'&&(a.counterResponses||[]).length!==value)return false;
        }
        return true;
      })||null;
    }''', {'type': action_type, 'criteria': criteria})
    if choice is None:
        raise AssertionError(f'No admitted action {action_type}: {criteria}')
    option = page.locator(f'#ygoDuelActions option[value="{choice["index"]}"]')
    label = option.inner_text()
    if 'makeToken' in criteria:
        assert ('sin crear Token' in label) if not criteria['makeToken'] else (' · crear Token' in label and 'sin crear Token' not in label)
    if 'destination' in criteria:
        destination = criteria['destination']
        assert ('zona de Monstruos Extra' if destination == 5 else f'zona principal {destination + 1}') in label
    if criteria.get('triggerKind') == 'SALAMANGREAT_ROAR_SET':
        assert 'colocar Roar desde el Cementerio' in label
    if criteria.get('counterCount') == 1:
        assert label.count('Salamangreat Roar') == 2
    before = report(page)
    count = len((before.get('scenario') or {}).get('actions', []))
    page.locator('#ygoDuelActions').select_option(value=str(choice['index']))
    page.locator('#ygoDuelStep').click()
    page.wait_for_function('count=>YGOAdvancedWorkbench.report().scenario?.actions.length===count',
                           arg=count + 1, timeout=15000)
    after = report(page)
    last = after['scenario']['actions'][-1]
    assert last['type'] == action_type
    assert last.get('sourceUid') == choice['action'].get('sourceUid')
    assert after['scenario']['replay']['pass'] is True
    assert after['competitiveScore'] is None
    return after


def check_mechaba_release(page, check):
    """Inspect the delivered document and execute two physical registered packets."""
    evidence = page.evaluate('''()=>{
      const data=YGO_RULE_REFERENCES,box=document.querySelector('[data-stable-rule-references]');
      return {scope:data?.scope,officialTcgRulingCertified:data?.officialTcgRulingCertified,
        storedBytesRecheckedAtBuild:data?.storedBytesRecheckedAtBuild,
        retrievalAuthenticatedInThisBuild:data?.retrievalAuthenticatedInThisBuild,
        identicalBuildEvidence:JSON.stringify(YGO_BUILD_MANIFEST.ruleReferences)===JSON.stringify(data),
        references:data?.references.map(r=>({faqId:r.faqId,formatAuthority:r.formatAuthority,language:r.language})),
        links:box?[...box.querySelectorAll('a')].map(a=>({href:a.href,rel:a.rel,target:a.target})):[],
        explanation:box?.textContent||'',
        registry:YGOResponses.capabilities().mechabaNonFieldMonsterActivations};
    }''')
    expected_faqs = [16041, 22388, 23949]
    expected_urls = [f'https://www.db.yugioh-card.com/yugiohdb/faq_search.action?ope=5&fid={faq}&request_locale=ja'
                     for faq in expected_faqs]
    check('delivered_mechaba_references_show_three_official_faq_links_and_honest_ocg_scope',
          [link['href'] for link in evidence['links']] == expected_urls
          and all(link['target'] == '_blank' and {'noopener', 'noreferrer'}.issubset(set(link['rel'].split()))
                  for link in evidence['links'])
          and [row['faqId'] for row in evidence['references']] == expected_faqs
          and all(row['formatAuthority'] == 'OCG' and row['language'] == 'ja' for row in evidence['references'])
          and 'OCG' in evidence['explanation'] and 'no certifican todas sus reglas' in evidence['explanation'])
    check('delivered_mechaba_reference_evidence_is_bound_to_build_without_new_transport_claim',
          evidence['scope'] == 'TCG_REFERENCE_NOT_TCG_RULING_CERTIFICATION'
          and evidence['officialTcgRulingCertified'] is False
          and evidence['storedBytesRecheckedAtBuild'] is True
          and evidence['retrievalAuthenticatedInThisBuild'] is False
          and evidence['identicalBuildEvidence'] is True)
    expected_handlers = {
        'TENYI_HAND_SPECIAL', 'TENYI_ASHUNA_DECK', 'TENYI_ADHARA_RECOVER', 'TENYI_VISHUDA_BOUNCE',
        'SALAMANGREAT_GAZELLE_HAND', 'SALAMANGREAT_SPINNY_DISCARD', 'SALAMANGREAT_SPINNY_REVIVE',
        'MOYE_DRAW', 'DUEL_ANCIENTS_END_SUMMON', 'ANCIENTS_RECOVER_BLUE_EYES', 'TENYI_SHTHANA_REVIVE',
        'LONGYUAN_SPECIAL', 'LONGYUAN_BURN', 'DD_CROW_BANISH', 'DROLL_LOCK'}
    check('delivered_mechaba_registry_contains_the_fifteen_reviewed_hand_and_gy_handlers',
          len(evidence['registry']) == 15
          and {row['type'] for row in evidence['registry']} == expected_handlers
          and all(row['cardIds'] and row['activationZones']
                  and set(row['activationZones']).issubset({'hand', 'gy'}) for row in evidence['registry']))
    for origin in ['hand', 'gy']:
        try:
            packet = page.evaluate('''origin=>{
              const E=YGOComboEngine,H=E.helpers,spec=YGOScenarioExamples.get('spirit'),ASHUNA=87052196,MECHABA=75286621;
              spec.context.responseTypes=['MECHABA'];spec.context.responsePolicy='CHOICE_BRANCHES';
              spec.opponentDeck.extra=[{id:MECHABA,qty:1}];
              spec.setup.placements=(origin==='gy'?spec.setup.placements.filter(p=>p.player===0):[])
                .concat([{player:1,cardId:MECHABA,from:'extra',zone:'monster',zoneIndex:0,faceUp:true,position:'ATTACK',summonTurn:1}]);
              const initial=E.createState(spec),before=JSON.stringify(initial),type=origin==='hand'?'TENYI_HAND_SPECIAL':'TENYI_ASHUNA_DECK';
              const action=E.enumerate(initial).find(a=>a.type===type&&a.response?.type==='MECHABA'&&!a.counterResponses);
              if(!action)throw Error('No delivered registered Mechaba action for '+origin);
              const result=E.execute(initial,action);if(!result.pass)throw Error(JSON.stringify(result));
              const trace=result.action,source=H.locate(result.after,action.sourceUid),cost=H.locate(result.after,action.response.costUid);
              const line={before:structuredClone(initial),after:structuredClone(result.after),state:structuredClone(result.after),
                actions:[structuredClone(trace)],deckFingerprint:E.deckFingerprint(spec.deck),context:structuredClone(initial.context)};
              const replay=E.replay(line,{deck:spec.deck});
              return {sourceUid:action.sourceUid,responseCostUid:action.response.costUid,
                activationOrigin:trace.proof.activationOrigin,negated:trace.proof.activationNegated,
                sourceZone:source.zone,costZone:cost.zone,inputPreserved:before===JSON.stringify(initial),
                copiesPreserved:H.inventory(initial)===H.inventory(result.after),freshReplay:replay.pass===true,
                costPaid:trace.paid.some(p=>p.uid===action.response.costUid&&p.player===1&&p.kind==='SEND_GY'&&p.from==='hand'&&p.to==='gy'),
                ownBanishCostPaid:trace.paid.some(p=>p.uid===action.sourceUid&&p.kind==='BANISH'&&p.from==='gy'&&p.to==='banished'),
                sourceBanishedByMechaba:trace.events.some(e=>e.type==='MECHABA_BANISH_ACTIVATED_CARD'&&e.targetUid===action.sourceUid&&e.from===origin),
                banishSkippedAfterCost:trace.events.some(e=>e.type==='MECHABA_BANISH_NOT_APPLIED'&&e.targetUid===action.sourceUid
                  &&e.activationZone==='gy'&&e.currentZone==='banished'&&e.reason==='REGISTERED_SOURCE_LEFT_ACTIVATION_LOCATION'),
                noSummon:!trace.events.some(e=>['SPECIAL_SUMMON_FROM_HAND','SPECIAL_SUMMON_FROM_DECK','SPECIAL_SUMMON'].includes(e.type)),
                noEffectLock:!result.after.locks.some(l=>l.kind==='WYRM_ONLY')};
            }''', origin)
            check('delivered_mechaba_' + origin + '_packet_preserves_physical_cost_origin_and_fresh_replay',
                  packet['activationOrigin']['sourceUid'] == packet['sourceUid']
                  and packet['activationOrigin']['zone'] == origin and packet['activationOrigin']['player'] == 0
                  and packet['negated'] and packet['sourceZone'] == 'banished' and packet['costZone'] == 'gy'
                  and packet['sourceUid'] != packet['responseCostUid']
                  and packet['costPaid'] and packet['copiesPreserved'] and packet['inputPreserved']
                  and packet['freshReplay'] and packet['noSummon'] and packet['noEffectLock']
                  and (packet['sourceBanishedByMechaba'] if origin == 'hand' else
                       packet['ownBanishCostPaid'] and packet['banishSkippedAfterCost'] and not packet['sourceBanishedByMechaba']),
                  packet)
        except Exception as error:
            check('delivered_mechaba_' + origin + '_packet_preserves_physical_cost_origin_and_fresh_replay', False, str(error))


def run(url=None, source_inject=False):
    build = json.loads((ROOT / 'dist/build-manifest.json').read_text())
    artifact = ROOT / build['output']
    original = artifact.read_bytes()
    original_hash = hashlib.sha256(original).hexdigest()
    assert original_hash == build['htmlSha256']
    html = original
    if source_inject:
        text = html.decode()
        for name in ['scenario-examples', 'combo-workbench', 'advanced-workbench']:
            code = (ROOT / f'src/app/{name}.js').read_text()
            expression = r'<script data-ygo-stable-module="' + name + r'">[\s\S]*?</script>'
            text, count = re.subn(expression, lambda _match, name=name, code=code:
                                 '<script data-ygo-stable-module="' + name + '">\n' + code + '\n</script>', text)
            assert count == 1, name
        html = text.encode()
    checks, details, errors, blocked = [], {}, [], []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'pass': bool(passed)})
        if detail is not None:
            details[name] = detail
        print(name, 'PASS' if passed else 'FAIL', flush=True)

    target = url or 'https://ygo-expanded-examples.test/Analizador_YuGiOh.html'
    with sync_playwright() as playwright:
        executable = os.environ.get('YGO_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
        browser = playwright.chromium.launch(executable_path=executable, headless=True, args=['--no-sandbox'])
        context = browser.new_context(viewport={'width': 1440, 'height': 1000})

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
        check('embedded_tutorials_boot_offline_with_expected_document_bytes', response is not None
              and hashlib.sha256(response.body()).hexdigest() == hashlib.sha256(html).hexdigest()
              and page.evaluate('()=>navigator.onLine===false'))
        expected_ids = ['spark', 'spirit', 'invoked', 'swordsoul', 'branded', 'tenyi', 'salamangreat', 'roar', 'crow', 'droll']
        definitions = page.evaluate('()=>YGOScenarioExamples.list()')
        menu_ids = page.locator('#ygoExampleSelect').evaluate('(el)=>[...el.options].map(option=>option.value)')
        check('dynamic_example_menu_preserves_originals_and_lists_every_registered_tutorial',
              [row['id'] for row in definitions] == expected_ids and menu_ids == expected_ids)
        check_mechaba_release(page, check)
        for example_id in ['swordsoul', 'branded', 'tenyi', 'salamangreat', 'roar']:
            try:
                initial = load_example(page, example_id)
                steps = next(row['steps'] for row in definitions if row['id'] == example_id)
                check(example_id + '_loads_physical_deck_and_guide_without_autoplay',
                      initial['scenario'] is None and initial['competitiveScore'] is None
                      and len(initial['current']['zones'][0]['hand']) == 5
                      and page.locator('#ygoExampleInstructions li').count() == len(steps)
                      and page.locator('#ygoExampleInstructions').inner_text().strip() != '')
                if example_id == 'swordsoul':
                    draw_uid = initial['current']['zones'][0]['deck'][0]['uid']
                    execute_step(page, 'NORMAL_SUMMON', sourceCard=20001443)
                    execute_step(page, 'MOYE_TOKEN', revealCard=93490856)
                    execute_step(page, 'SYNCHRO_CHIXIAO')
                    chain = execute_step(page, 'CHIXIAO_CL1_MOYE_CL2', selectionCard=56465981)
                    check('swordsoul_known_physical_draw_precedes_search_shuffle',
                          any(event.get('chainLink') == 2 and event.get('drawnUid') == draw_uid
                              for event in chain['scenario']['actions'][-1]['events'])
                          and chain['current']['deckOrderKnown'][0] is False)
                    execute_step(page, 'LONGYUAN_SPECIAL', discardCard=56465981, makeToken=True)
                    execute_step(page, 'SYNCHRO_CHENGYING')
                    final = execute_step(page, 'LONGYUAN_BURN')
                    check('swordsoul_seven_visible_actions_reach_two_synchros_and_real_damage',
                          len(final['scenario']['actions']) == 7 and final['current']['lp'][1] == 6800
                          and page.evaluate('()=>YGOComboWorkbench.goalMatches(YGOAdvancedWorkbench.report().current,YGOScenarioExamples.get("swordsoul").goal)'))
                elif example_id == 'branded':
                    execute_step(page, 'BRANDED_FUSION_LUBELLION', materialCards=[68468459, 46986414])
                    final = execute_step(page, 'LUBELLION_FUSION_MIRRORJADE', discardCard=23771716)
                    check('branded_two_visible_actions_keep_the_real_discard_and_fusion_lock',
                          len(final['scenario']['actions']) == 2
                          and any(row['card']['id'] == 23771716 for row in final['current']['zones'][0]['gy'])
                          and any(lock['kind'] == 'FUSION_ONLY' for lock in final['current']['locks'])
                          and page.evaluate('()=>YGOComboWorkbench.goalMatches(YGOAdvancedWorkbench.report().current,YGOScenarioExamples.get("branded").goal)'))
                elif example_id == 'tenyi':
                    execute_step(page, 'TENYI_HAND_SPECIAL', sourceCard=87052196, destination=0)
                    execute_step(page, 'TENYI_LINK_MONK')
                    execute_step(page, 'TENYI_ASHUNA_DECK', selectionCard=98159737, destination=0)
                    execute_step(page, 'TENYI_LINK_SHAMAN')
                    final = execute_step(page, 'TENYI_SHAMAN_REVIVE', targetCard=32519092, discardCard=48202661, destination=0)
                    check('tenyi_five_visible_actions_conserve_banish_discard_and_normal_summon',
                          len(final['scenario']['actions']) == 5 and final['current']['normalSummonAvailable'][0] is True
                          and any(row['card']['id'] == 87052196 for row in final['current']['zones'][0]['banished'])
                          and any(row['card']['id'] == 48202661 for row in final['current']['zones'][0]['gy'])
                          and page.evaluate('()=>YGOComboWorkbench.goalMatches(YGOAdvancedWorkbench.report().current,YGOScenarioExamples.get("tenyi").goal)'))
                elif example_id == 'salamangreat':
                    execute_step(page, 'SALAMANGREAT_NORMAL_SUMMON', sourceCard=26889158)
                    execute_step(page, 'SALAMANGREAT_GAZELLE_SEND', selectionCard=51339637)
                    execute_step(page, 'SALAMANGREAT_SPINNY_DISCARD', targetCard=26889158)
                    execute_step(page, 'SALAMANGREAT_LINK_BALELYNX')
                    execute_step(page, 'SALAMANGREAT_BALELYNX_SEARCH')
                    execute_step(page, 'SALAMANGREAT_SPINNY_REVIVE', destination=1)
                    execute_step(page, 'SALAMANGREAT_LINK_WOLF')
                    execute_step(page, 'SALAMANGREAT_ACTIVATE_SANCTUARY')
                    execute_step(page, 'SALAMANGREAT_REINCARNATE_WOLF')
                    execute_step(page, 'DECLINE_OPTIONAL_TRIGGER', triggerKind='SALAMANGREAT_ROAR_SET')
                    final = execute_step(page, 'SALAMANGREAT_WOLF_RECOVER_ST', targetCard=51339637)
                    check('salamangreat_eleven_visible_actions_recover_roar_and_preserve_spinny_banish',
                          len(final['scenario']['actions']) == 11
                          and any(row['card']['id'] == 52277807 for row in final['current']['zones'][0]['banished'])
                          and page.evaluate('()=>YGOComboWorkbench.goalMatches(YGOAdvancedWorkbench.report().current,YGOScenarioExamples.get("salamangreat").goal)'))
                elif example_id == 'roar':
                    check('roar_tutorial_preserves_explicit_physical_counter_response_policy',
                          initial['current']['context']['responseTypes'] == ['ROAR']
                          and initial['current']['context']['responsePolicy'] == 'CHOICE_BRANCHES')
                    final = execute_step(page, 'INVOCATION_MECHABA', materialCards=[86120751, 89631139], responseType='ROAR', counterCount=1)
                    last = final['scenario']['actions'][-1]
                    check('roar_counter_chain_reaches_mechaba_and_moves_both_real_traps_to_gy',
                          last['proof']['registeredResponseChain']['firstResponseNegated'] is True
                          and all(any(row['card']['id'] == 51339637 for row in final['current']['zones'][p]['gy']) for p in [0, 1])
                          and page.evaluate('()=>YGOComboWorkbench.goalMatches(YGOAdvancedWorkbench.report().current,YGOScenarioExamples.get("roar").goal)'))
                    page.locator('#ygoDuelUndo').click()
                    page.wait_for_function('()=>YGOAdvancedWorkbench.report().scenario===null')
                    negated = execute_step(page, 'INVOCATION_MECHABA', responseType='ROAR', counterCount=0)
                    check('roar_alternative_after_undo_preserves_fusion_materials_when_activation_is_negated',
                          negated['scenario']['actions'][-1]['proof']['activationNegated'] is True
                          and {86120751, 89631139}.issubset({row['card']['id'] for row in negated['current']['zones'][0]['hand']})
                          and not page.evaluate('()=>YGOComboWorkbench.goalMatches(YGOAdvancedWorkbench.report().current,YGOScenarioExamples.get("roar").goal)'))
                check(example_id + '_final_report_has_fresh_replay_and_provisional_score',
                      report(page)['scenario']['replay']['pass'] is True and report(page)['competitiveScore'] is None)
            except Exception as error:
                check(example_id + '_visible_tutorial_completed', False, str(error))
        check('expanded_tutorials_raise_no_javascript_page_errors', not errors, errors)
        version = browser.version
        browser.close()
    check('compiled_artifact_unchanged_during_browser_test', hashlib.sha256(artifact.read_bytes()).hexdigest() == original_hash)
    return {'schema': 'ygo-expanded-examples-browser/v1', 'pass': all(row['pass'] for row in checks),
            'buildId': build['buildId'], 'htmlSha256': original_hash,
            'artifactMode': 'SOURCE_INJECTED_DEVELOPMENT' if source_inject else 'DELIVERED_BYTES',
            'sourceInjection': source_inject, 'servedBytesSha256': hashlib.sha256(html).hexdigest(),
            'browser': {'engine': 'chromium', 'version': version}, 'checks': checks, 'details': details,
            'externalRequestsBlocked': len(blocked),
            'limitations': ['Tutorials are technical fixtures with physical cards, not competitive deck recommendations.',
                            'Declared starting fields do not certify the summons that preceded them.',
                            'Exact bytes served while offline do not establish direct file navigation on every browser.']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url')
    parser.add_argument('--source-inject', action='store_true')
    parser.add_argument('--output', type=Path, default=ROOT / 'tests/expanded-examples-browser-results.json')
    args = parser.parse_args()
    started = time.monotonic()
    result = run(args.url, args.source_inject)
    result['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'pass': result['pass'], 'checks': len(result['checks']),
                      'failed': [row['name'] for row in result['checks'] if not row['pass']],
                      'artifactMode': result['artifactMode']}, ensure_ascii=False))
    raise SystemExit(0 if result['pass'] else 1)

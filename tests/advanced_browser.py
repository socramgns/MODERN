#!/usr/bin/env python3
"""Replay, physical battle, turn progression and controlled-response UI checks."""
import argparse
import copy
import functools
import hashlib
import json
import os
import re
from pathlib import Path
import shutil
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self,*_args):
        pass

def fixtures():
    invoked=json.loads((ROOT/'examples/Arquetipo_Invoked.json').read_text())
    blue=json.loads((ROOT/'examples/Arquetipo_BlueEyes.json').read_text())
    opponent=json.loads((ROOT/'examples/Escenario_Ash_TCG.json').read_text())
    # Test-only real card list: preserve exactly 40 physical copies while adding
    # the two extra responses. This is not a competitive deck recommendation.
    opponent=copy.deepcopy(opponent)
    for card_id in [97268402,10045474]:
        filler=next(row for row in reversed(opponent['deck']['main']) if row['qty']>1 and row['id']!=14558127)
        filler['qty']-=1
        opponent['deck']['main'].append({'id':card_id,'qty':1})
    opponent['openingIds']=[14558127,97268402,10045474,23771716,47372349]
    physical=[row['id'] for row in opponent['deck']['main'] for _ in range(row['qty'])]
    assert len(physical)==40
    for card_id in opponent['openingIds']:
        physical.remove(card_id)
    opponent['remainingDeckIds']=physical
    opponent['name']='Physical Ash, Veiler and Imperm response fixture'
    return invoked,blue,opponent

def ready(page):
    page.wait_for_function('window.YGOAdvancedWorkbench && document.getElementById("ygoAdvancedWorkbench")',timeout=60000)
    page.evaluate('async()=>{await YGODataCatalog.ready;await YGOUIState.ready;await YGOComboWorkbench.ready;await YGOAdvancedWorkbench.ready;}')

def open_details(page,index):
    details=page.locator('#ygoAdvancedWorkbench > details').nth(index)
    if not details.evaluate('(el)=>el.open'):
        details.locator('summary').first.click()

def click_action(page,action_type,fields=None):
    fields=fields or {}
    selected=page.evaluate('''({type,fields})=>{
      const actions=YGOAdvancedWorkbench.actions();
      const index=actions.findIndex(a=>a.type===type&&Object.entries(fields).every(([key,v])=>a[key]===v));
      return{index,count:YGOAdvancedWorkbench.report().scenario?.actions.length||0,available:actions.map(a=>({type:a.type,toPhase:a.toPhase,player:a.player,targetUid:a.targetUid}))};
    }''',{'type':action_type,'fields':fields})
    assert selected['index']>=0,{'requested':action_type,'fields':fields,'available':selected['available']}
    page.locator('#ygoDuelActions').select_option(str(selected['index']))
    page.locator('#ygoDuelStep').click()
    page.wait_for_function('(count)=>(YGOAdvancedWorkbench.report().scenario?.actions.length||0)===count+1',arg=selected['count'],timeout=15000)
    return page.evaluate('''()=>{const r=YGOAdvancedWorkbench.report();return{turn:r.current.turn,phase:r.current.phase,activePlayer:r.current.activePlayer,lp:r.current.lp,replay:r.scenario.replay,last:r.scenario.actions.at(-1).type,hands:r.current.zones.map(z=>z.hand.length),decks:r.current.zones.map(z=>z.deck.length)}}''')

def run(url,source_inject=False):
    build=json.loads((ROOT/'dist/build-manifest.json').read_text())
    html_hash=hashlib.sha256((ROOT/build['output']).read_bytes()).hexdigest()
    invoked,blue,opponent=fixtures()
    html=None
    if source_inject:
        html=(ROOT/build['output']).read_text()
        manifest=json.loads((ROOT/'manifest.json').read_text())
        for path in manifest['extensions']:
            name=Path(path).stem
            pattern=r'<script data-ygo-stable-module="'+re.escape(name)+r'">[\s\S]*?</script>'
            html,count=re.subn(pattern,lambda _,path=path,name=name:'<script data-ygo-stable-module="'+name+'">\n'+(ROOT/path).read_text()+'\n</script>',html)
            assert count==1,(name,count)
        if 'data-ygo-stable-module="advanced-workbench"' not in html:
            html=html.replace('<script data-ygo-stable-module="exports">','<script data-ygo-stable-module="advanced-workbench">\n'+(ROOT/'src/app/advanced-workbench.js').read_text()+'\n</script>\n<script data-ygo-stable-module="exports">')
    checks=[];details={};errors=[]
    def check(name,passed,detail=None):
        checks.append({'name':name,'pass':bool(passed)})
        if detail is not None:
            details[name]=detail
        print(name,'PASS' if passed else 'FAIL',flush=True)
    with sync_playwright() as pw:
        executable=os.environ.get('YGO_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
        browser=pw.chromium.launch(executable_path=executable,headless=True,args=['--no-sandbox'])
        context=browser.new_context(accept_downloads=True,viewport={'width':1440,'height':1000})
        if html is not None:context.route(url,lambda route:route.fulfill(status=200,content_type='text/html',body=html))
        page=context.new_page();page.on('pageerror',lambda error:errors.append(str(error)))
        page.goto(url,wait_until='domcontentloaded');ready(page)
        check('delivered_build_identity',page.evaluate('()=>YGO_BUILD_MANIFEST.buildId')==build['buildId'])
        check('advanced_lab_and_controls_are_mounted',page.locator('#ygoAdvancedWorkbench').count()==1 and page.locator('#ygoDuelStep').count()==1 and page.locator('#ygoCompareStart').count()==1)
        try:
            page.locator('#ygoCausalFile').set_input_files({'name':'invoked.json','mimeType':'application/json','buffer':json.dumps(invoked).encode()})
            page.wait_for_function('YGOComboWorkbench.report().openingIds[0]===86120751 && YGOUIState.last.counts.main===40')
            page.locator('#ygoCausalOpponentFile').set_input_files({'name':'responses.json','mimeType':'application/json','buffer':json.dumps(opponent).encode()})
            page.wait_for_function('YGOComboWorkbench.report().opponent?.openingIds.includes(97268402)')
            page.locator('#ygoCausalPolicy').select_option('PASS')
            result=page.evaluate('async()=>await YGOComboWorkbench.run({maxDepth:10,maxStates:2000,maxMs:8000})')
            check('passing_opponent_fixture_reaches_invoked_goal',result.get('pass') is True and bool(result.get('lines')) and all(row['replay']['pass'] for row in result.get('lines',[])))
            page.locator('#ygoDuelFromLine').click()
            page.wait_for_function('YGOAdvancedWorkbench.report().scenario?.actions.length>0')
            continued=page.evaluate('''()=>{const r=YGOAdvancedWorkbench.report();return{replay:r.scenario.replay,phase:r.current.phase,duelMode:r.current.context.duelMode,hasMechaba:r.current.zones[0].monster.some(x=>x.card.id===75286621),opponentCopies:Object.values(r.current.zones[1]).reduce((n,z)=>n+z.length,0),turn:r.current.turn}}''')
            check('from_line_reexecutes_into_duel_mode_with_physical_opponent',continued['replay']['pass'] and continued['duelMode'] and continued['hasMechaba'] and continued['opponentCopies']==40 and continued['phase']=='MAIN 1' and continued['turn']==1)
            check('first_turn_does_not_offer_battle_phase',page.evaluate('()=>!YGOAdvancedWorkbench.actions().some(a=>a.type==="DUEL_ADVANCE_PHASE"&&a.toPhase==="BATTLE")'))
            ended=click_action(page,'DUEL_ADVANCE_PHASE',{'toPhase':'END'})
            check('gui_phase_transition_to_end_replays',ended['phase']=='END' and ended['replay']['pass'])
            undo_before=page.evaluate('()=>YGOAdvancedWorkbench.report().scenario.actions.length')
            page.locator('#ygoDuelUndo').click()
            undone=page.evaluate('()=>({phase:YGOAdvancedWorkbench.report().current.phase,n:YGOAdvancedWorkbench.report().scenario.actions.length,replay:YGOAdvancedWorkbench.report().scenario.replay})')
            check('gui_undo_restores_previous_phase_and_trace',undone['phase']=='MAIN 1' and undone['n']==undo_before-1 and undone['replay']['pass'])
            click_action(page,'DUEL_ADVANCE_PHASE',{'toPhase':'END'})
            next_turn=click_action(page,'DUEL_NEXT_TURN')
            check('gui_end_turn_switches_active_player_and_resets_usage',next_turn['turn']==2 and next_turn['activePlayer']==1 and next_turn['phase']=='DRAW' and next_turn['replay']['pass'])
            before_draw=page.evaluate('()=>({top:YGOAdvancedWorkbench.report().current.zones[1].deck[0].uid,hand:YGOAdvancedWorkbench.report().current.zones[1].hand.length,deck:YGOAdvancedWorkbench.report().current.zones[1].deck.length})')
            drawn=click_action(page,'DUEL_DRAW_FOR_TURN')
            draw_uid=page.evaluate('()=>YGOAdvancedWorkbench.report().current.zones[1].hand.at(-1).uid')
            check('opponent_turn_draw_moves_exact_known_physical_copy',drawn['hands'][1]==before_draw['hand']+1 and drawn['decks'][1]==before_draw['deck']-1 and draw_uid==before_draw['top'] and drawn['replay']['pass'])
            click_action(page,'DUEL_ADVANCE_PHASE',{'toPhase':'STANDBY'})
            main=click_action(page,'DUEL_ADVANCE_PHASE',{'toPhase':'MAIN 1'})
            check('opponent_main_phase_has_admitted_actions',main['phase']=='MAIN 1' and main['activePlayer']==1 and page.evaluate('()=>YGOAdvancedWorkbench.actions().some(a=>a.type==="DUEL_NORMAL_SUMMON_OR_SET"&&a.player===1)'))
            click_action(page,'DUEL_ADVANCE_PHASE',{'toPhase':'END'})
            third=click_action(page,'DUEL_NEXT_TURN')
            check('unknown_post_shuffle_draw_is_blocked_in_next_own_turn',third['turn']==3 and third['activePlayer']==0 and third['phase']=='DRAW' and page.evaluate('()=>YGOAdvancedWorkbench.report().current.deckOrderKnown[0]===false&&!YGOAdvancedWorkbench.actions().some(a=>a.type==="DUEL_DRAW_FOR_TURN"||a.type==="DUEL_ADVANCE_PHASE")'))
        except Exception as error:
            check('invoked_turn_ui_flow_completed',False,str(error))
        try:
            page.evaluate('async value=>await YGOComboWorkbench.loadScenario(value)',blue)
            page.evaluate('async value=>await YGOComboWorkbench.loadOpponent(value)',opponent)
            page.locator('#ygoCausalPolicy').select_option('PASS')
            open_details(page,0)
            page.locator('#ygoDuelTurn').fill('2');page.locator('#ygoDuelPlayer').select_option('0');page.locator('#ygoDuelPhase').select_option('BATTLE')
            page.locator('#ygoDuelClearPlacements').click()
            page.locator('#ygoDuelSetupOwner').select_option('0')
            page.locator('#ygoDuelSetupCard').select_option('deck:89631139')
            page.locator('#ygoDuelSetupPosition').select_option('ATTACK');page.locator('#ygoDuelAddPlacement').click()
            page.locator('#ygoDuelSetupOwner').select_option('1')
            page.locator('#ygoDuelSetupCard').select_option('deck:23771716')
            page.locator('#ygoDuelSetupPosition').select_option('ATTACK');page.locator('#ygoDuelAddPlacement').click()
            page.locator('#ygoDuelApplySetup').click()
            page.wait_for_function('YGOAdvancedWorkbench.report().current?.phase==="BATTLE"&&YGOAdvancedWorkbench.report().current.turn===2')
            declared=page.evaluate('()=>({context:YGOAdvancedWorkbench.report().current.context,field:YGOAdvancedWorkbench.report().current.zones.map(z=>z.monster.map(x=>({id:x.card.id,uid:x.uid,summonType:x.summonType}))),hand:YGOAdvancedWorkbench.report().current.zones[0].hand.length})')
            check('gui_declared_board_uses_real_copies_and_unverified_prior_history',declared['context']['initialBoard']=='DECLARED_PHYSICAL_SCENARIO' and declared['context']['initialHistoryCertified'] is False and declared['field'][0][0]['id']==89631139 and declared['field'][1][0]['id']==23771716 and all(x['summonType']=='DECLARED_STARTING_FIELD' for field in declared['field'] for x in field))
            battle=click_action(page,'DUEL_ATTACK')
            battled=page.evaluate('''()=>{const r=YGOAdvancedWorkbench.report(),a=r.scenario.actions.at(-1);return{lp:r.current.lp,enemyField:r.current.zones[1].monster.length,enemyGY:r.current.zones[1].gy.map(x=>x.uid),events:a.events,attackAgain:YGOAdvancedWorkbench.actions().some(a=>a.type==='DUEL_ATTACK'),replay:r.scenario.replay}}''')
            fish_uid=declared['field'][1][0]['uid']
            check('gui_battle_applies_3000_vs_1800_damage_and_destruction',battle['lp']==[8000,6800] and battled['enemyField']==0 and fish_uid in battled['enemyGY'] and any(event['type']=='BATTLE_DAMAGE' and event['amount']==1200 for event in battled['events']))
            check('battle_trace_replays_and_cannot_attack_twice',battled['replay']['pass'] and not battled['attackAgain'])
            page.locator('#ygoDuelUndo').click()
            check('battle_undo_restores_lp_target_and_attack_budget',page.evaluate('()=>{const r=YGOAdvancedWorkbench.report();return r.current.lp[1]===8000&&r.current.zones[1].monster.length===1&&r.scenario===null&&YGOAdvancedWorkbench.actions().some(a=>a.type==="DUEL_ATTACK");}'))
            click_action(page,'DUEL_ATTACK')
            with page.expect_download() as pending:
                page.locator('#ygoAdvancedExport').click()
            output=ROOT/'tests/advanced-workbench-export.json';pending.value.save_as(str(output));exported=json.loads(output.read_text())
            check('advanced_export_contains_real_battle_and_fresh_replay',exported['schema']=='ygo-advanced-workbench/v1' and exported['scenario']['replay']['pass'] and exported['scenario']['actions'][-1]['type']=='DUEL_ATTACK' and exported['current']['lp']==[8000,6800] and exported['competitiveScore'] is None and exported['certified'] is False)
            check('advanced_report_binds_actual_context_and_has_import_control',page.locator('#ygoAdvancedImport').count()==1 and exported['context']['buildId']==build['buildId'] and exported['context']['format']=='tcg' and exported['context']['skills']==[] and exported['context']['banlistIdentity'] and exported['context']['catalogSha256'])
            click_action(page,'DUEL_ADVANCE_PHASE',{'toPhase':'MAIN 2'})
            page.locator('#ygoAdvancedImport').set_input_files({'name':'resume-battle.json','mimeType':'application/json','buffer':json.dumps(exported).encode()})
            page.wait_for_function('document.getElementById("ygoAdvancedImport").value===""&&document.getElementById("ygoAdvancedStatus").textContent.startsWith("Informe reanudado")')
            resumed=page.evaluate('()=>YGOAdvancedWorkbench.report()')
            check('gui_report_import_rebuilds_physical_initial_state_and_replays_to_battle',resumed['initial']==exported['initial'] and resumed['current']==exported['current'] and resumed['scenario']==exported['scenario'] and resumed['context']==exported['context'] and resumed['initial']['context']['initialHistoryCertified'] is False)
            rejected=page.evaluate('''async saved=>{
              const cases=[
                ['build',r=>r.buildId='other-build'],
                ['catalog',r=>r.context.catalogSha256='other-catalog'],
                ['banlist',r=>r.context.banlistIdentity='different-content'],
                ['formatContext',r=>r.context.formatContext={format:'tcg',historicalDate:'1900-01-01'}],
                ['initial',r=>r.initial.lp[0]-=100],
                ['current',r=>r.current.lp[0]-=100],
                ['trace',r=>r.scenario.actions.at(-1).events.push({type:'INVENTED_DAMAGE'})],
                ['after',r=>r.scenario.after.lp[1]-=1],
                ['replayFlag',r=>r.scenario.replay.certified=true]
              ],out=[];
              for(const [id,mutate] of cases){const before=JSON.stringify(YGOAdvancedWorkbench.report()),r=structuredClone(saved);mutate(r);let error=null;try{await YGOAdvancedWorkbench.loadReport(r);}catch(e){error=e.message;}out.push({id,rejected:!!error,error,unchanged:JSON.stringify(YGOAdvancedWorkbench.report())===before});}
              const oldSkills=deckState.skills;try{deckState.skills=[{id:300000001,qty:1}];const before=JSON.stringify(YGOAdvancedWorkbench.report());let error=null;try{await YGOAdvancedWorkbench.loadReport(saved);}catch(e){error=e.message;}out.push({id:'skills',rejected:!!error,error,unchanged:JSON.stringify(YGOAdvancedWorkbench.report())===before});}finally{if(oldSkills===undefined)delete deckState.skills;else deckState.skills=oldSkills;}
              return out;
            }''',exported)
            check('advanced_import_rejects_tamper_and_context_mismatches_transactionally',all(row['rejected'] and row['unchanged'] for row in rejected),rejected)
            page.locator('#ygoDuelUndo').click()
            empty_trace=page.evaluate('()=>YGOAdvancedWorkbench.report()')
            check('zero_step_scenario_can_roundtrip_without_fabricating_replay',page.evaluate('async r=>{const out=await YGOAdvancedWorkbench.loadReport(r);return out.scenario===null&&out.current.phase==="BATTLE"&&out.current.lp[1]===8000&&out.initial.context.initialHistoryCertified===false;}',empty_trace))
            declared_comparison=page.evaluate('async()=>await YGOAdvancedWorkbench.compare({goal:{requiredFieldIds:[],opponentLpAtMost:6800},maxDepth:1,maxStates:60,maxMs:2000})')
            comparison_report=page.evaluate('()=>YGOAdvancedWorkbench.report()')
            initial_boards=[row['initialState'] for row in comparison_report['comparisonInputs']['scenarios']]
            check('controlled_comparison_preserves_declared_field_phase_lp_and_policies',bool(initial_boards) and all(st['phase']=='BATTLE' and st['turn']==2 and st['lp']==[8000,8000] and st['zones'][0]['monster'][0]['card']['id']==89631139 and st['zones'][1]['monster'][0]['card']['id']==23771716 and st['provenance']['setup']==empty_trace['initial']['provenance']['setup'] for st in initial_boards) and all(row['baselineVerified'] for row in declared_comparison['matrix']) and not declared_comparison['rejected'])
            comparison_resumed=page.evaluate('async r=>await YGOAdvancedWorkbench.loadReport(r)',comparison_report)
            check('comparison_report_roundtrip_recomputes_recommendations_from_replayed_inputs',comparison_resumed['comparison']==comparison_report['comparison'] and comparison_resumed['comparisonInputs']==comparison_report['comparisonInputs'])
            tampered_comparison=copy.deepcopy(comparison_report)
            tampered_comparison['comparison']['matrix'][0]['counts']['goalReached']+=1
            rejected_comparison=page.evaluate('''async r=>{const before=JSON.stringify(YGOAdvancedWorkbench.report());let error=null;try{await YGOAdvancedWorkbench.loadReport(r);}catch(e){error=e.message;}return{error,unchanged:before===JSON.stringify(YGOAdvancedWorkbench.report())};}''',tampered_comparison)
            check('forged_comparison_summary_is_rejected_without_replacing_lab',rejected_comparison['error']=='ADVANCED_COMPARISON_REPORT_MISMATCH' and rejected_comparison['unchanged'])
        except Exception as error:
            check('battle_setup_ui_flow_completed',False,str(error))
        try:
            page.evaluate('async value=>await YGOComboWorkbench.loadScenario(value)',invoked)
            page.evaluate('async value=>await YGOComboWorkbench.loadOpponent(value)',opponent)
            page.locator('#ygoCausalPolicy').select_option('PASS')
            open_details(page,1)
            goal={'requiredFieldIds':[75286621],'requiredHandIds':[86120751]}
            page.locator('#ygoAdvancedGoal').fill(json.dumps(goal));page.locator('#ygoAdvancedApplyGoal').click()
            check('custom_goal_control_updates_causal_goal',page.evaluate('()=>YGOComboWorkbench.report().goal')==goal)
            page.locator('#ygoCompareStart').click()
            page.wait_for_function('YGOAdvancedWorkbench.report().comparison!==null',timeout=90000)
            comparison=page.evaluate('()=>YGOAdvancedWorkbench.report().comparison')
            ids=[row['id'] for row in comparison['matrix']]
            check('gui_comparison_has_pass_ash_veiler_and_imperm_scenarios',comparison['pass'] and ids==['PASS','ASH','VEILER','IMPERM'] and comparison['coverage']['scenarios']==4,{'status':comparison['status'],'ids':ids,'rejected':comparison.get('rejected')})
            check('comparison_baselines_bind_same_physical_hand_and_opponent',all(row['baselineVerified'] for row in comparison['matrix']) and not comparison['rejected'] and bool(comparison['comparison']['baselineFingerprint']))
            check('comparison_success_is_replay_observed_and_other_scenarios_unknown',comparison['matrix'][0]['counts']['goalReached']>0 and all(row['classification']=='UNKNOWN' and row['verifiedFailure'] is False for row in comparison['matrix'][1:]) and comparison['coverage']['failedScenariosProven']==0 and all(outcome['replayFresh'] and outcome['copiesConserved'] for row in comparison['matrix'] for outcome in row['outcomes']))
            check('recommendations_remain_conditional_without_win_rate',bool(comparison['recommendations']) and comparison['winRate'] is None and comparison['competitiveScore'] is None and comparison['adversarialOptimalityProven'] is False and comparison['globalOptimalityProven'] is False and all(row['unknownScenarios'] for row in comparison['recommendations']))
            check('comparison_rows_are_rendered_in_ui',page.locator('#ygoCompareResults table tr').count()==5 and page.locator('#ygoCompareResults article').count()>0)
            page.evaluate('()=>{window.__advancedCancelled=YGOAdvancedWorkbench.compare({spec:{...YGOComboWorkbench.input(),context:{...YGOComboWorkbench.input().context,duelMode:true}},goal:{requiredFieldIds:[],opponentLpAtMost:0},maxDepth:40,maxStates:5000,maxTurns:3,maxMs:30000});return true;}')
            page.locator('#ygoCompareStop').click()
            cancelled=page.evaluate('async()=>await window.__advancedCancelled')
            check('comparison_stop_discards_partial_matrix',cancelled.get('status')=='CANCELLED_OR_STALE' and page.evaluate('()=>YGOAdvancedWorkbench.report().comparison===null'))
            page.locator('#ygoDuelInitialize').click()
            page.wait_for_function('YGOAdvancedWorkbench.report().current!==null')
            page.evaluate('()=>{window.__advancedStale=YGOAdvancedWorkbench.compare({spec:{...YGOComboWorkbench.input(),context:{...YGOComboWorkbench.input().context,duelMode:true}},goal:{requiredFieldIds:[],opponentLpAtMost:0},maxDepth:40,maxStates:5000,maxTurns:3,maxMs:30000});return true;}')
            page.evaluate('()=>{deckState.main[0].qty=2;YGOUIState.sync();}')
            stale_result=page.evaluate('async()=>await window.__advancedStale')
            stale=page.evaluate('()=>YGOAdvancedWorkbench.report()')
            check('deck_change_cancels_comparison_and_clears_manual_scenario',stale_result.get('status')=='CANCELLED_OR_STALE' and stale['comparison'] is None and stale['current'] is None and stale['scenario'] is None)
            check('stale_board_is_not_left_visible',page.locator('#ygoDuelBoard').inner_text().startswith('Inicia el laboratorio') and page.locator('#ygoCompareResults table').count()==0)
        except Exception as error:
            check('comparison_ui_flow_completed',False,str(error))
        check('no_page_errors',not errors,errors)
        browser.close()
    check('artifact_unchanged_during_browser_test',hashlib.sha256((ROOT/build['output']).read_bytes()).hexdigest()==html_hash and json.loads((ROOT/'dist/build-manifest.json').read_text())['buildId']==build['buildId'])
    return{'schema':'ygo-advanced-browser-validation/v1','pass':all(row['pass'] for row in checks),'buildId':build['buildId'],'htmlSha256':html_hash,'artifactMode':'SOURCE_INJECTED_DEVELOPMENT' if source_inject else 'DELIVERED_BYTES','checks':checks,'details':details,'limitations':['Test decks are diagnostic fixtures, not competitive labels.','The starting field history is declared rather than independently proven.','Observed policy comparisons do not certify adversarial optimality or a win rate.']}

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--url');parser.add_argument('--source-inject',action='store_true');parser.add_argument('--output',type=Path,default=ROOT/'tests/advanced-browser-results.json');args=parser.parse_args();server=None
    try:
        url=args.url
        if not url:
            server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(ROOT/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{server.server_port}/Calculadora_de_Barajas_YuGiOh_Alpha_1263_Corregida.html'
        started=time.monotonic();result=run(url,args.source_inject);result['elapsedSeconds']=round(time.monotonic()-started,2);args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps({'pass':result['pass'],'checks':len(result['checks']),'failed':[row['name'] for row in result['checks'] if not row['pass']],'seconds':result['elapsedSeconds']}));raise SystemExit(0 if result['pass'] else 1)
    finally:
        if server:server.shutdown();server.server_close()

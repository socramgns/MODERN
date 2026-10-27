#!/usr/bin/env python3
"""Causal cross-archetype regressions against the delivered standalone HTML.

Fixtures use real CDB identities and legal construction, but normal-monster
fillers are diagnostic and are not competitive deck recommendations.
"""
import argparse
import functools
import hashlib
import json
import os
import shutil
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
FIXTURES = ['Invoked', 'Swordsoul', 'Branded', 'BlueEyes']

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

SCRIPT = r'''async ({fixtures,opponent}) => {
 const E=window.YGOComboEngine;
 if(!E)throw Error('Delivered bundle has no causal archetype engine');
 const checks=[],details={},states={},results={};
 const clone=x=>structuredClone(x),arr=x=>Array.isArray(x)?x:[],C=x=>x?.card||x;
 const ids=zone=>arr(zone).map(x=>Number(C(x).id));
 const controls=x=>Object.fromEntries(Object.entries(x).filter(([k])=>!['before','after','paid','events','proof','witnesses','ashNegated'].includes(k)));
 function check(name,pass,detail){checks.push({name,pass:!!pass});if(detail!==undefined)details[name]=detail;}
 function make(f,ash=false){return E.createState({deck:f.deck,openingIds:f.openingIds,remainingDeckIds:f.remainingDeckIds,context:{...f.context,opponentPolicy:ash?'ASH_EXPLICIT':'PASS',...(ash?{ashPolicy:'FIRST_ELIGIBLE'}:{})},...(ash?{opponentDeck:opponent.deck,opponentOpeningIds:opponent.openingIds,opponentRemainingDeckIds:opponent.remainingDeckIds}:{})});}
 function goal(f,line){const field=ids((line.after||line.state).zones[0].monster),hand=ids((line.after||line.state).zones[0].hand),g=f.goal;return(!g.requiredFieldIds||g.requiredFieldIds.every(id=>field.includes(id)))&&(!g.requiredFieldIdsAny||g.requiredFieldIdsAny.some(group=>group.every(id=>field.includes(id))))&&(!g.requiredHandIds||g.requiredHandIds.every(id=>hand.includes(id)))&&(g.opponentLpAtMost===undefined||(line.after||line.state).lp[1]<=g.opponentLpAtMost);}
 const summarize=l=>({actions:l.actions.map(a=>({type:a.type,sourceUid:a.sourceUid,materialUids:a.materialUids,paid:a.paid,events:a.events})),field:(l.after||l.state).zones[0].monster.map(x=>({id:C(x).id,name:C(x).name,uid:x.uid})),hand:(l.after||l.state).zones[0].hand.map(x=>({id:C(x).id,name:C(x).name})),replay:E.replay(l,{deck:l.before.provenance.deck})});
 for(const f of fixtures){
  const audit=YGODataCatalog.auditDeck(f.deck,{format:'tcg',banlist:BANLIST_PROFILES.tcg.data,banlistDate:f.context.banlistVersion});
  check(f.id+'_legal_construction',audit.pass&&audit.counts.main===40,{errors:audit.errors,counts:audit.counts});
  let initial;try{initial=make(f);}catch(e){check(f.id+'_canonical_opening',false,String(e));continue;}
  states[f.id]=initial;
  check(f.id+'_canonical_opening',ids(initial.zones[0].hand).sort((a,b)=>a-b).join(',')===[...f.openingIds].sort((a,b)=>a-b).join(',')&&initial.zones[0].deck.length===35);
  const before=JSON.stringify(initial);
  const result=await E.search(initial,{maxDepth:14,maxStates:5000,maxMs:10000,checkCurrentDeck:false,goal:st=>goal(f,{after:st})});results[f.id]=result;
  check(f.id+'_search_preserves_input',before===JSON.stringify(initial));
  const matching=arr(result.lines||result.candidates).filter(l=>goal(f,l));
  check(f.id+'_goal_reached',result.pass===true&&matching.length>0,{status:result.status,candidateCount:result.candidateCount,expanded:result.expanded,truncated:result.truncated,lines:arr(result.lines).map(summarize)});
  const lines=arr(result.lines||result.candidates);
  check(f.id+'_fresh_replays',lines.length>0&&lines.every(l=>E.replay(l,{deck:f.deck}).pass===true));
  if(lines.length){
   const forged=clone(lines[0]);forged.after.lp[0]-=100;
   // Some result objects deliberately share after/state; mutate both to test
   // actual transition replay rather than a mere final-field consistency check.
   if(forged.state)forged.state.lp[0]=forged.after.lp[0];
   const rejected=E.replay(forged,{deck:f.deck});check(f.id+'_tampered_final_rejected',rejected.pass===false,{status:rejected.status});
   const changed=clone(f.deck);changed.main[0].qty=changed.main[0].qty===1?2:1;
   check(f.id+'_changed_deck_rejected',E.replay(lines[0],{deck:changed}).pass===false);
  }
 }
 const invoked=fixtures.find(x=>x.id==='invoked');
 if(states.invoked){
  const illegal=clone(invoked);illegal.deck.main[0].qty=4;let rejected=false;try{make(illegal);}catch(_){rejected=true;}check('copy_limit_rejects_four',rejected);
  const impossible=clone(invoked);impossible.openingIds=[86120751,86120751,86120751,86120751,86120751];rejected=false;try{make(impossible);}catch(_){rejected=true;}check('opening_cannot_invent_copies',rejected);
  const cancel=new AbortController();cancel.abort();const cancelled=await E.search(states.invoked,{signal:cancel.signal,checkCurrentDeck:false});check('search_cancellable',cancelled.status==='CANCELLED'&&!(cancelled.lines||[]).length);
  const actual=window.deckState;try{window.deckState={main:[],extra:[],side:[]};const stale=await E.search(states.invoked,{maxMs:100});check('search_rejects_stale_deck',stale.status==='STALE_DECK_CANCELLED');}finally{window.deckState=actual;}
  const line=arr(results.invoked?.lines).find(x=>goal(invoked,x));
  if(line){const fusion=line.actions.find(a=>a.type==='INVOCATION_MECHABA');if(fusion){const bad={...controls(fusion),materialUids:[fusion.materialUids[0],fusion.materialUids[0]]};check('fusion_requires_distinct_physical_materials',E.execute(fusion.before,bad).pass===false);}}
  const ashState=make(invoked,true),ns=E.enumerate(ashState).find(a=>a.type==='NORMAL_SUMMON'&&C(E.helpers.locate(ashState,a.sourceUid).item).id===86120751);
  const nsResult=ns&&E.execute(ashState,ns);const ashSearch=nsResult?.pass&&E.enumerate(nsResult.after).find(a=>a.type==='ALEISTER_SEARCH'&&a.responseUid);
  const response=ashSearch&&E.execute(nsResult.after,ashSearch);
  check('ash_first_eligible_has_no_optimistic_pass_branch',!!ashSearch&&!E.enumerate(nsResult.after).some(a=>a.type==='ALEISTER_SEARCH'&&!a.responseUid));
  check('ash_uses_declared_physical_card_and_negates_search',response?.pass===true&&response.status==='EFFECT_NEGATED_BY_EXPLICIT_ASH'&&!ids(response.after.zones[0].hand).includes(74063034)&&ids(response.after.zones[1].gy).includes(14558127),response?{status:response.status,paid:response.action?.paid}:null);
  if(response?.pass)check('ash_once_per_turn_consumed',response.after.used['ASH:1']===true);
  if(line){const conditional=clone(invoked);conditional.context.ashPolicy='CHOICE_BRANCHES';let ashPass=E.createState({...conditional,context:{...conditional.context,opponentPolicy:'ASH_EXPLICIT'},opponentDeck:opponent.deck,opponentOpeningIds:opponent.openingIds,opponentRemainingDeckIds:opponent.remainingDeckIds}),fusionBefore=null;for(const step of line.actions){if(step.type==='INVOCATION_MECHABA'){fusionBefore=ashPass;break;}const r=E.execute(ashPass,controls(step));if(!r.pass)break;ashPass=r.after;}
   if(fusionBefore){const f=E.enumerate(fusionBefore).find(a=>a.type==='INVOCATION_MECHABA'),uid=fusionBefore.zones[1].hand.find(c=>Number(C(c).id)===14558127)?.uid;check('ash_cannot_answer_invocation_material_fusion',!!f&&E.execute(fusionBefore,{...f,responseUid:uid}).pass===false);}
  }
 }
 const swordsoulLine=arr(results.swordsoul?.lines).find(l=>ids(l.after.zones[0].monster).includes(69248256));
 if(swordsoulLine){const final=swordsoulLine.after;const tokenRemains=final.zones[0].monster.some(x=>x.token);const tokenEvents=swordsoulLine.actions.flatMap(a=>a.events||[]).filter(e=>e.type==='TOKEN_SUMMON');
  check('swordsoul_token_created_and_ceases_on_material_use',tokenEvents.length>0&&!tokenRemains&&Object.values(final.tokenLedger).some(t=>t.destroyed));
  const searchUsed=final.used.CHIXIAO_EFFECT===true,w=E.replay(swordsoulLine,{deck:fixtures.find(f=>f.id==='swordsoul').deck}).witnesses;
  check('chixiao_search_does_not_also_credit_same_turn_negate',!searchUsed||!arr(w?.interruptions).some(x=>x.effectId==='CHIXIAO_NEGATE'&&x.available));
  check('swordsoul_longyuan_burn_is_1200_and_cost_is_paid',swordsoulLine.after.lp[1]===6800&&swordsoulLine.actions.some(a=>a.type==='LONGYUAN_SPECIAL'&&a.paid.some(p=>p.kind==='DISCARD'&&p.uid))&&swordsoulLine.actions.some(a=>a.type==='LONGYUAN_BURN'));
  let joint=make(fixtures.find(f=>f.id==='swordsoul'),true);
  for(const t of ['NORMAL_SUMMON','MOYE_TOKEN','SYNCHRO_CHIXIAO']){const a=E.enumerate(joint).find(a=>a.type===t);if(!a)break;
   if(t==='MOYE_TOKEN'){const ashUid=joint.zones[1].hand.find(x=>Number(C(x).id)===14558127)?.uid;check('ash_cannot_negate_token_summon',!!ashUid&&!E.enumerate(joint).some(a=>a.type==='MOYE_TOKEN'&&a.responseUid)&&E.execute(joint,{...a,responseUid:ashUid}).pass===false);}
   const r=E.execute(joint,a);if(!r.pass)break;joint=r.after;}
  const jointAction=E.enumerate(joint).find(a=>a.type==='CHIXIAO_CL1_MOYE_CL2'&&a.responseUid),jointResult=jointAction&&E.execute(joint,jointAction);
  check('swordsoul_joint_chain_ash_negates_draw_not_chixiao',jointResult?.pass&&jointResult.action.events.some(e=>e.type==='ASH_NEGATE_EFFECT'&&e.chainLink===3)&&jointResult.action.events.some(e=>e.type==='RESOLVE_CHAIN_LINK'&&e.chainLink===2&&e.negated)&&jointResult.action.events.some(e=>e.type==='RESOLVE_CHAIN_LINK'&&e.chainLink===1&&e.addedUid)&&!jointResult.action.events.some(e=>e.type==='DRAW'));
 }
 const bf=fixtures.find(f=>f.id==='branded'),bline=arr(results.branded?.lines).find(l=>goal(bf,l));
 if(bline){
  const discard=bline.actions.find(a=>a.discardUid||arr(a.paid).some(p=>p.kind==='DISCARD'));
  check('lubellion_pays_real_discard',!!discard&&arr(discard.paid).some(p=>p.kind==='DISCARD'&&p.uid));
  const materialReturn=bline.actions.some(a=>a.events?.some(e=>/FUSION/i.test(e.type||''))&&a.after.zones[0].extra.some(x=>Number(C(x).id)===70534340)&&a.after.zones[0].monster.some(x=>Number(C(x).id)===44146295));
  check('lubellion_returns_to_extra_not_main',materialReturn&&!bline.after.zones[0].deck.some(x=>Number(C(x).id)===70534340));
  let initial=make(bf,true);const ash=E.enumerate(initial).find(a=>a.type==='BRANDED_FUSION_LUBELLION'&&a.responseUid),response=ash&&E.execute(initial,ash);
  check('branded_ash_consumes_activation_and_lock_without_materials',response?.pass&&response.after.used.BRANDED_FUSION_ACTIVATED&&response.after.locks.some(l=>l.kind==='FUSION_ONLY')&&ids(response.after.zones[0].gy).includes(44362883)&&!ids(response.after.zones[0].monster).includes(70534340)&&ash.materialUids.every(uid=>E.helpers.locate(response.after,uid).zone===E.helpers.locate(initial,uid).zone));
  let lubellionState=E.createState({...bf,context:{...bf.context,opponentPolicy:'ASH_EXPLICIT',ashPolicy:'CHOICE_BRANCHES'},opponentDeck:opponent.deck,opponentOpeningIds:opponent.openingIds,opponentRemainingDeckIds:opponent.remainingDeckIds});
  for(const step of bline.actions){if(step.type==='LUBELLION_FUSION_MIRRORJADE')break;const r=E.execute(lubellionState,controls(step));if(!r.pass)break;lubellionState=r.after;}
  const lubellionAction=E.enumerate(lubellionState).find(a=>a.type==='LUBELLION_FUSION_MIRRORJADE'),ashUid=lubellionState.zones[1].hand.find(x=>Number(C(x).id)===14558127)?.uid;
  check('lubellion_fusion_is_not_ashable',!!lubellionAction&&!!ashUid&&!E.enumerate(lubellionState).some(a=>a.type==='LUBELLION_FUSION_MIRRORJADE'&&a.responseUid)&&E.execute(lubellionState,{...lubellionAction,responseUid:ashUid}).pass===false);
 }
 const blue=fixtures.find(f=>f.id==='blueeyes'),blueLine=arr(results.blueeyes?.lines).find(l=>goal(blue,l));
 if(blueLine){
  const types=blueLine.actions.map(a=>a.type),tribute=blueLine.actions.find(a=>a.type==='SPIRIT_TRIBUTE_BLUE_EYES'),mausoleum=blueLine.actions.find(a=>a.type==='MAUSOLEUM_SEND_NORMAL_MONSTER');
  check('blueeyes_uses_search_field_extra_normal_and_synchro',types.includes('SAGE_SEARCH_LIGHT_TUNER')&&types.includes('LINK_SPIRIT_WITH_EYES_OF_BLUE')&&types.includes('SPIRIT_SEARCH_MAUSOLEUM')&&types.includes('MAUSOLEUM_ADDITIONAL_NORMAL_SUMMON')&&types.includes('SYNCHRO_BLUE_EYES_SPIRIT_DRAGON'));
  check('blueeyes_tribute_pays_source_and_releases_live_dragon_lock',!!tribute&&tribute.paid.some(p=>p.kind==='TRIBUTE'&&p.uid===tribute.sourceUid)&&E.helpers.locate(tribute.after,tribute.sourceUid)?.zone==='gy');
  check('mausoleum_sends_as_effect_and_applies_temporary_stats',!!mausoleum&&mausoleum.events.some(e=>e.type==='SEND_TO_GY_BY_EFFECT')&&!mausoleum.paid.some(p=>p.uid===mausoleum.selectionUid)&&mausoleum.events.some(e=>e.type==='TEMPORARY_ATK_DEF_GAIN'&&e.amount===800));
  check('ancients_end_phase_not_fabricated_in_main_phase',blueLine.after.phase==='MAIN 1'&&!blueLine.actions.some(a=>/ANCIENTS.*(?:END|SUMMON)/.test(a.type)));
 }
 return{schema:'ygo-archetype-browser-validation/v1',engine:E.version,capabilities:E.capabilities(),pass:checks.every(c=>c.pass),checks,details,limitations:['Fixtures are diagnostic, not competitive labels.','Opponent policy and supported actions are declared, not universal Yu-Gi-Oh coverage.','A bounded search proves returned replays, not global optimality.']};
}'''

def run(url, source_inject=False):
    fixtures=[json.loads((ROOT/'examples'/f'Arquetipo_{name}.json').read_text()) for name in FIXTURES]
    opponent=json.loads((ROOT/'examples/Escenario_Ash_TCG.json').read_text())
    with sync_playwright() as pw:
        executable=os.environ.get('YGO_CHROMIUM') or shutil.which('chromium') or shutil.which('google-chrome')
        browser=pw.chromium.launch(headless=True,executable_path=executable,args=['--no-sandbox'])
        page=browser.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(url,wait_until='domcontentloaded')
        page.evaluate('async()=>{await window.__YGO_ENGINE_READY;await window.YGODataCatalog.ready;}')
        if source_inject:
            if not page.evaluate('()=>!!window.YGOComboEngine'):
                page.add_script_tag(path=str(ROOT/'src/app/combo-engine.js'))
            if (ROOT/'src/app/archetypes.js').exists() and not page.evaluate('()=>!!window.YGOArchetypeRules'):
                page.add_script_tag(path=str(ROOT/'src/app/archetypes.js'))
        result=page.evaluate(SCRIPT,{'fixtures':fixtures,'opponent':opponent})
        build=json.loads((ROOT/'dist/build-manifest.json').read_text())
        delivered=page.evaluate('()=>window.YGO_BUILD_MANIFEST')
        result['buildId']=delivered.get('buildId')
        result['htmlSha256']=hashlib.sha256((ROOT/build['output']).read_bytes()).hexdigest()
        result['executedAt']=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
        result['checks'].append({'name':'delivered_build_identity_matches_artifact','pass':delivered.get('buildId')==build['buildId'] and result['htmlSha256']==build['htmlSha256']})
        if not source_inject:
            page.wait_for_function('window.YGOComboWorkbench && document.getElementById("ygoCausalStart")',timeout=30000)
            page.evaluate('async()=>await YGOComboWorkbench.ready')
            def check(name,passed,detail=None):
                result['checks'].append({'name':name,'pass':bool(passed)})
                if detail is not None:
                    result['details'][name]=detail
            check('workbench_controls_present',all(page.locator('#'+id).count()==1 for id in ['ygoCausalStart','ygoCausalStop','ygoCausalFile','ygoCausalGoal','ygoCausalHand','ygoCausalSimulate']))
            for f in fixtures:
                fixture_file=ROOT/'examples'/f'Arquetipo_{next(name for name in FIXTURES if name.lower()==f["id"])}.json'
                page.locator('#ygoCausalFile').set_input_files(str(fixture_file))
                page.wait_for_function('ids=>JSON.stringify(YGOComboWorkbench.report().openingIds)===JSON.stringify(ids)',arg=f['openingIds'],timeout=30000)
                loaded=page.evaluate('()=>({report:YGOComboWorkbench.report(),hand:[...document.querySelectorAll("#ygoCausalHand select")].map(s=>Number(s.value)),counts:YGOUIState.last.counts})')
                check(f['id']+'_scenario_file_imports_full_deck_and_hand',loaded['counts']['main']==40 and loaded['hand']==f['openingIds'] and loaded['report']['remainingDeckIds']==f['remainingDeckIds'])
                if f['id']=='invoked':
                    page.locator('#ygoCausalStart').click()
                    page.wait_for_function('YGOComboWorkbench.report().search!==null && !document.getElementById("ygoCausalStart").disabled',timeout=30000)
                    ui_result=page.evaluate('()=>YGOComboWorkbench.report().search')
                else:
                    ui_result=page.evaluate('async()=>await YGOComboWorkbench.run({maxDepth:14,maxStates:5000,maxMs:15000})')
                proof=page.evaluate('''f=>{const r=YGOComboWorkbench.report(),lines=r.search?.lines||[],C=x=>x.card||x;return{rendered:document.querySelectorAll('#ygoCausalResults article').length,goalMatches:lines.every(l=>{const st=l.state;return(f.goal.requiredFieldIds||[]).every(id=>st.zones[0].monster.some(x=>Number(C(x).id)===id))&&(f.goal.requiredHandIds||[]).every(id=>st.zones[0].hand.some(x=>Number(C(x).id)===id))&&(f.goal.opponentLpAtMost===undefined||st.lp[1]<=f.goal.opponentLpAtMost);}),fresh:lines.every(l=>YGOComboEngine.replay(l,{deck:deckState}).pass),strategy:r.strategy,competitiveScore:r.competitiveScore};}''',f)
                check(f['id']+'_workbench_goal_replay_and_render',ui_result.get('pass') and len(ui_result.get('lines',[]))>0 and proof['rendered']==len(ui_result['lines']) and proof['goalMatches'] and proof['fresh'],{'status':ui_result.get('status'),'candidateCount':len(ui_result.get('lines',[])),'rendered':proof['rendered']})
                check(f['id']+'_strategy_has_no_competitive_claim',proof['competitiveScore'] is None and proof['strategy'].get('competitiveScore') is None and proof['strategy'].get('winRate') is None and proof['strategy']['verifiedDistinctOutcomes']>0)
            # Invalid selected quantities may be inspected, but never become a
            # causal search. The deck itself must remain unchanged.
            invoked=next(f for f in fixtures if f['id']=='invoked')
            page.evaluate('async f=>await YGOComboWorkbench.loadScenario(f)',invoked)
            before=page.evaluate('()=>YGOComboEngine.deckFingerprint(deckState)')
            for select in page.locator('#ygoCausalHand select').all():
                select.select_option('86120751')
            page.locator('#ygoCausalStart').click()
            page.wait_for_function('document.getElementById("ygoCausalStatus").textContent.includes("No completado")')
            invalid=page.evaluate('()=>({status:document.getElementById("ygoCausalStatus").textContent,search:YGOComboWorkbench.report().search,fingerprint:YGOComboEngine.deckFingerprint(deckState)})')
            check('workbench_rejects_five_aleisters_transactionally',invalid['search'] is None and invalid['fingerprint']==before,invalid['status'])
            page.evaluate('async f=>await YGOComboWorkbench.loadScenario(f)',invoked)
            page.locator('#ygoCausalOpponentFile').set_input_files(str(ROOT/'examples/Escenario_Ash_TCG.json'))
            page.wait_for_function('YGOComboWorkbench.report().opponent!==null')
            ash=page.evaluate('async()=>await YGOComboWorkbench.run({maxDepth:14,maxStates:1000,maxMs:10000})')
            ash_report=page.evaluate('()=>YGOComboWorkbench.report()')
            check('workbench_first_ash_prevents_unsupported_invoked_goal',ash.get('pass') and len(ash.get('lines',[]))==0 and sum(c['qty'] for c in ash_report['opponent']['deck']['main'])==40,{'status':ash.get('status'),'candidateCount':len(ash.get('lines',[]))})
            page.evaluate('async f=>await YGOComboWorkbench.loadScenario(f)',invoked)
            simulation=page.evaluate('async()=>await YGOComboWorkbench.simulate({trials:4,seed:"browser-regression",maxMs:15000,perTrialMs:400,maxStates:120})')
            sampling_ok=simulation.get('completedTrials')==4 and simulation.get('verifiedFailures')==0 and simulation.get('unknown',0)+simulation.get('verifiedSuccesses',0)==4
            if simulation.get('unknown',0)>0:
                sampling_ok=sampling_ok and simulation.get('probability') is None
            check('workbench_sampling_preserves_unknown_results',sampling_ok,{'status':simulation.get('status'),'successes':simulation.get('verifiedSuccesses'),'failures':simulation.get('verifiedFailures'),'unknown':simulation.get('unknown')})
            page.evaluate('async()=>await YGOComboWorkbench.run({maxMs:8000})')
            with page.expect_download() as pending:
                page.locator('#ygoCausalExport').click()
            exported_path=ROOT/'tests/archetypes-workbench-export.json'
            pending.value.save_as(str(exported_path))
            exported=json.loads(exported_path.read_text())
            check('workbench_trace_download_contains_replay_and_scope',exported['schema']=='ygo-causal-workbench/v1' and len(exported.get('search',{}).get('lines',[]))>0 and exported['competitiveScore'] is None and exported['certified'] is False)
            # Updating the actual deck invalidates previous traces and hands.
            stale=page.evaluate('()=>{deckState.main[0].qty=2;YGOUIState.sync();return{report:YGOComboWorkbench.report(),articles:document.querySelectorAll("#ygoCausalResults article").length};}')
            check('workbench_clears_stale_traces_after_deck_change',stale['report']['search'] is None and stale['report']['strategy'] is None and stale['report']['openingIds']==[] and stale['articles']==0)
            blue=next(f for f in fixtures if f['id']=='blueeyes')
            page.evaluate('async f=>await YGOComboWorkbench.loadScenario(f)',blue)
            page.evaluate('()=>{window.__causalCancellation=YGOComboWorkbench.run({maxDepth:14,maxStates:5000,maxMs:30000});return true;}')
            page.locator('#ygoCausalStop').click()
            cancelled=page.evaluate('async()=>await window.__causalCancellation')
            check('workbench_cancel_does_not_publish_partial_lines',cancelled.get('status')=='CANCELLED_OR_STALE' and page.evaluate('()=>YGOComboWorkbench.report().search===null'),{'status':cancelled.get('status')})
        result['pageErrors']=errors
        result['checks'].append({'name':'no_page_errors','pass':not errors})
        result['pass']=all(row['pass'] for row in result['checks'])
        result['artifactMode']='SOURCE_INJECTED_DEVELOPMENT' if source_inject else 'DELIVERED_BYTES'
        browser.close()
    return result

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--url')
    parser.add_argument('--source-inject',action='store_true',help='Development only; not evidence for delivered artifact')
    parser.add_argument('--output',type=Path,default=ROOT/'tests/archetypes-browser-results.json')
    args=parser.parse_args();server=None
    try:
        url=args.url
        if not url:
            server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(ROOT/'dist')))
            threading.Thread(target=server.serve_forever,daemon=True).start()
            url=f'http://127.0.0.1:{server.server_port}/Calculadora_de_Barajas_YuGiOh_Alpha_1263_Corregida.html'
        started=time.monotonic();result=run(url,args.source_inject);result['elapsedSeconds']=round(time.monotonic()-started,2)
        args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2))
        print(json.dumps({'pass':result['pass'],'checks':len(result['checks']),'failed':[c['name'] for c in result['checks'] if not c['pass']],'artifactMode':result['artifactMode'],'seconds':result['elapsedSeconds']},ensure_ascii=False,indent=2))
        raise SystemExit(0 if result['pass'] else 1)
    finally:
        if server:server.shutdown();server.server_close()

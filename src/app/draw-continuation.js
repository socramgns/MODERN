/* One explicitly hypothetical uniform turn draw, followed by registered own
 * decisions. This module never changes the laboratory or enables ordinary
 * unknown draws. Its replay is separate from the observed causal replay. */
(()=>{'use strict';
const W=window,E=W.YGOComboEngine,R=W.YGORecommendations;
if(!E?.execute||!R?.validateGoal)throw Error('DRAW_CONTINUATION_DEPENDENCIES_REQUIRED');
const H=E.helpers,clone=x=>structuredClone(x),arr=x=>Array.isArray(x)?x:[];
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const same=(a,b)=>stable(a)===stable(b),MAX_BYTES=8*1024*1024;
const SCHEMA='ygo-hypothetical-draw-analysis/v1',SOURCE_SCHEMA='ygo-draw-continuation-source/v1';
const ASSUMPTION='UNIFORM_RANDOM_PERMUTATION_OF_REMAINING_PHYSICAL_CARDS';
const METRIC='EXISTENCE_OF_A_REGISTERED_OWN_CONTINUATION_AFTER_ONE_UNIFORM_HYPOTHETICAL_TURN_DRAW';
const unknownReasons=new Set(['BRANCH_BUDGET','STATE_BUDGET','TIME_BUDGET','DEPTH_HORIZON','NO_REGISTERED_GOAL_WITNESS','REPORT_SIZE_BUDGET']);
const defaults=Object.freeze({maxDepth:4,maxStates:1200,maxStatesPerBranch:60,maxMs:6000,maxBranches:60});
const ranges={maxDepth:[0,12],maxStates:[1,5000],maxStatesPerBranch:[1,500],maxMs:[50,30000],maxBranches:[1,60]};
const limitsOf=options=>Object.fromEntries(Object.entries(defaults).map(([k,d])=>{const value=options[k]??d,[min,max]=ranges[k];if(!Number.isSafeInteger(value)||value<min||value>max)throw Error('DRAW_CONTINUATION_INVALID_LIMIT:'+k);return[k,value];}));
function exceedsReportBudget(text){if(text.length>MAX_BYTES)return true;let bytes=0;for(const char of text){const code=char.codePointAt(0);bytes+=code<=0x7f?1:code<=0x7ff?2:code<=0xffff?3:4;if(bytes>MAX_BYTES)return true;}return false;}
function boundedClone(value){const text=typeof value==='string'?value:JSON.stringify(value);if(typeof text!=='string'||exceedsReportBudget(text))throw Error('DRAW_CONTINUATION_REPORT_SIZE_LIMIT');return JSON.parse(text);}
function sourceContext(initial){
 if(!initial?.provenance?.deck)throw Error('DRAW_CONTINUATION_INITIAL_REQUIRED');
 return{buildId:W.YGO_BUILD_MANIFEST?.buildId||E.version,catalogSha256:W.YGO_BUILD_MANIFEST?.catalogSha256??null,engineVersion:E.version,deckFingerprint:E.deckFingerprint(initial.provenance.deck),skills:arr(initial.provenance.deck.skills).map(x=>[Number(x.id??x.cardId),Number(x.qty??1)]).sort((a,b)=>a[0]-b[0]),format:String(W.YGOAlpha973?.activeFormatKey?.()||W.__YGO_ACTIVE_BAN_KEY||W.YGOUIState?.last?.format||'tcg').toLowerCase(),formatContextVersion:W.YGOUIState?.contextVersion??0,formatContext:W.YGOUIState?.getFormatContext?.()||{format:'tcg'},banlistVersion:W.BANLIST_PROFILES?.tcg?.date??null,banlistIdentity:stable(W.BANLIST_PROFILES?.tcg?.data||[])};
}
function assertWindow(state){
 if(state?.schema!=='ygo-causal-state/v1'||state.context?.duelMode!==true||state.context.opponentPolicy!=='PASS'||state.activePlayer!==0||state.phase!=='DRAW'||!Number.isSafeInteger(state.turn)||state.turn<=1||state.duelEnded||state.deckOrderKnown?.[0]!==false||arr(state.chain).length||arr(state.pendingTriggers).length||state.duel?.drawCompleted?.[state.turn]===true||!state.zones?.[0]?.deck?.length)throw Error('DRAW_CONTINUATION_UNKNOWN_OWN_TURN_DRAW_REQUIRED');
 H.inventory(state);
}
function validateSource(value){
 const raw=boundedClone(value);
 if(!raw||![SOURCE_SCHEMA,'ygo-advanced-workbench/v1'].includes(raw.schema)||raw.certified!==false||raw.competitiveScore!==null||!raw.initial?.provenance||!raw.current||!raw.scenario)throw Error('DRAW_CONTINUATION_SOURCE_REQUIRED');
 if(raw.initial.provenance.deck?.skills?.length||raw.initial.provenance.opponentDeck?.skills?.length)throw Error('DRAW_CONTINUATION_TCG_WITHOUT_SKILLS_REQUIRED');
 const initial=E.createState({...clone(raw.initial.provenance),context:clone(raw.initial.context)});
 if(!same(initial,raw.initial))throw Error('DRAW_CONTINUATION_INITIAL_MISMATCH');
 const context=sourceContext(initial);
 if(raw.buildId!==context.buildId||context.format!=='tcg'||!same(raw.context,context))throw Error('DRAW_CONTINUATION_CONTEXT_MISMATCH');
 const goal=R.validateGoal(raw.goal);
 if(!same(raw.goal,goal))throw Error('DRAW_CONTINUATION_GOAL_MISMATCH');
 const line=raw.scenario;
 if(!Array.isArray(line.actions)||!line.actions.length||line.actions.length>500||!same(line.before,initial)||!same(line.context,initial.context)||line.deckFingerprint!==initial.deckFingerprint||line.scope!==E.version||line.certified!==false||line.globalOptimalityProven!==false)throw Error('DRAW_CONTINUATION_PREFIX_REQUIRED');
 const replay=E.replay(line,{deck:initial.provenance.deck});
 if(!replay.pass||!same(line.after,line.state)||!same(line.after,raw.current))throw Error('DRAW_CONTINUATION_PREFIX_REPLAY_REJECTED');
 if(!line.actions.some(a=>arr(a.events).some(e=>e.type==='SHUFFLE'&&e.player===0)))throw Error('DRAW_CONTINUATION_VERIFIED_SHUFFLE_REQUIRED');
 assertWindow(raw.current);
 const scenario=clone(line);scenario.replay=replay;
 return{schema:SOURCE_SCHEMA,buildId:context.buildId,context,goal,initial:clone(initial),current:clone(raw.current),scenario,competitiveScore:null,certified:false};
}
function isCurrent(source,checkCurrentDeck=true){
 if(!same(source.context,sourceContext(source.initial)))return false;
 if(!checkCurrentDeck)return true;
 if(W.deckState&&E.deckFingerprint(W.deckState)!==source.context.deckFingerprint)return false;
 if(typeof W.YGOAdvancedWorkbench?.report==='function'){
  const live=W.YGOAdvancedWorkbench.report();
  if(!same(live.goal,source.goal)||!same(live.current,source.current)||!same(live.initial,source.initial))return false;
  const prefix=clone(live.scenario);if(!prefix)return false;prefix.replay=E.replay(prefix,{deck:source.initial.provenance.deck});
  if(!same(prefix,source.scenario))return false;
 }
 return true;
}
function packetFor(source,item){return{kind:'UNIFORM_UNKNOWN_TURN_DRAW',uid:item.uid,player:0,cardId:Number(H.card(item).id),turn:source.current.turn,phase:'DRAW',from:'deck',to:'hand',remainingCopies:source.current.zones[0].deck.length,weight:{numerator:'1',denominator:String(source.current.zones[0].deck.length)},observedDraw:false,remainingOrderKnown:false,assumption:ASSUMPTION};}
function hypotheticalDraw(source,item){
 const state=clone(source.current),before=H.inventory(state),packet=packetFor(source,item);
 const hit=H.locate(state,item.uid);if(hit?.player!==0||hit.zone!=='deck')throw Error('DRAW_CONTINUATION_UID_NOT_IN_DECK');
 H.move(state,item.uid,'hand',{player:0});
 if(!state.duel||!state.duel.drawCompleted)throw Error('DRAW_CONTINUATION_DUEL_STATE_REQUIRED');
 state.duel.drawCompleted[state.turn]=true;
 state.events.push({type:'HYPOTHETICAL_DRAW_FOR_TURN',...clone(packet)});
 if(state.deckOrderKnown[0]!==false||H.inventory(state)!==before)throw Error('DRAW_CONTINUATION_PHYSICAL_COPY_MISMATCH');
 return{state,packet};
}
const controls=a=>Object.fromEntries(Object.entries(a).filter(([k])=>!['before','after','paid','events','proof','witnesses','ashNegated','effectNegated','activationNegated'].includes(k)));
function ownAction(state,a,turn){
 const player=a.player??H.locate(state,a.sourceUid||a.attackerUid)?.player??0;
 return state.turn===turn&&state.activePlayer===0&&player===0&&a.type!=='DUEL_NEXT_TURN'&&!a.response&&!a.responseUid&&!a.counterResponses;
}
function replayWitness(source,item,witness,limits){
 if(!witness||!Array.isArray(witness.actions)||witness.actions.length>limits.maxDepth||witness.actions.length>12)throw Error('DRAW_CONTINUATION_WITNESS_REQUIRED');
 let{state}=hypotheticalDraw(source,item);const inventory=H.inventory(state);
 for(const recorded of witness.actions){
  if(!ownAction(state,recorded,source.current.turn)||!same(recorded.before,state))throw Error('DRAW_CONTINUATION_WITNESS_ACTION_INVALID');
  const result=E.execute(state,controls(recorded));
  if(!result.pass||!same(result.action,recorded)||result.after.turn!==source.current.turn||result.after.activePlayer!==0)throw Error('DRAW_CONTINUATION_WITNESS_REPLAY_REJECTED');
  state=result.after;
 }
 if(H.inventory(state)!==inventory||!same(state,witness.after)||arr(state.pendingTriggers).length||!R.goalMatches(state,source.goal))throw Error('DRAW_CONTINUATION_GOAL_WITNESS_REJECTED');
 const replay={pass:true,status:'HYPOTHETICAL_CONTINUATION_REPLAY_VALID',steps:witness.actions.length};
 if(!same(replay,witness.replay))throw Error('DRAW_CONTINUATION_WITNESS_SUMMARY_MISMATCH');
 return{actions:clone(witness.actions),after:clone(state),replay};
}
function summarize(branches){const N=branches.length,k=branches.filter(x=>x.status==='GOAL_WITNESS').length;return{remainingCopies:N,verifiedSuccesses:k,unknown:N-k,verifiedFailures:0,successWeight:{numerator:String(k),denominator:String(N)},unknownWeight:{numerator:String(N-k),denominator:String(N)},identificationInterval:{low:k/N,high:1},winRate:null};}
const common=source=>({schema:SCHEMA,pass:true,buildId:source.buildId,catalogSha256:source.context.catalogSha256,engineVersion:E.version,assumption:ASSUMPTION,metric:METRIC,opponentPolicy:'PASS',hypothetical:true,observedDraw:false,remainingOrderKnown:false,competitiveScore:null,winRate:null,certified:false,globalOptimalityProven:false,adversarialOptimalityProven:false});
const limitations=Object.freeze(['Un solo próximo robo hipotético propio bajo barajado uniforme y rival PASS; no es un robo observado.','Cada copia física conserva peso 1/N; la búsqueda posterior elige solo decisiones propias registradas dentro del mismo turno.','Las ramas sin testigo y los límites de búsqueda conservan masa desconocida; no equivalen a derrota.','El replay de la hipótesis está separado del replay de jugadas observadas. La partida y el orden desconocido restante no se modifican.','No se modelan robos posteriores desconocidos, prioridad general ni decisiones rivales óptimas. El intervalo no es una tasa de victoria y la puntuación competitiva sigue provisional.']);
function normalizeReport(raw,source){
 const limits=limitsOf(raw.limits||{});if(!same(limits,raw.limits))throw Error('DRAW_CONTINUATION_LIMITS_MISMATCH');
 for(const[k,v]of Object.entries(common(source)))if(!same(raw[k],v))throw Error('DRAW_CONTINUATION_REPORT_BINDING_MISMATCH:'+k);
 if(!same(raw.source,source)||!same(raw.limitations,limitations))throw Error('DRAW_CONTINUATION_REPORT_SOURCE_MISMATCH');
 const items=source.current.zones[0].deck;
 if(!Array.isArray(raw.branches)||raw.branches.length!==items.length)throw Error('DRAW_CONTINUATION_BRANCH_SET_MISMATCH');
 const branches=raw.branches.map((branch,i)=>{
  const item=items[i],packet=packetFor(source,item),base={index:i+1,uid:item.uid,cardId:packet.cardId,name:String(H.card(item).name||packet.cardId),weight:clone(packet.weight),hypothesis:packet};
  for(const[k,v]of Object.entries(base))if(!same(branch?.[k],v))throw Error('DRAW_CONTINUATION_BRANCH_IDENTITY_MISMATCH:'+k);
  if(branch.status==='GOAL_WITNESS'){
   if(branch.reason!==null)throw Error('DRAW_CONTINUATION_WITNESS_REASON_INVALID');
   return{...base,status:'GOAL_WITNESS',reason:null,witness:replayWitness(source,item,branch.witness,limits)};
  }
  if(branch.status!=='UNKNOWN'||branch.witness!==null||!unknownReasons.has(branch.reason))throw Error('DRAW_CONTINUATION_UNKNOWN_BRANCH_INVALID');
  return{...base,status:'UNKNOWN',reason:branch.reason,witness:null};
 });
 const summary=summarize(branches);if(!same(raw.summary,summary))throw Error('DRAW_CONTINUATION_TOTALS_MISMATCH');
 const expected={...common(source),source,limits,branches,summary,limitations:clone(limitations)};
 if(!same(raw,expected))throw Error('DRAW_CONTINUATION_REPORT_FIELDS_MISMATCH');
 return expected;
}
function verify(value,options={}){try{
 const raw=boundedClone(value);if(raw?.schema!==SCHEMA)throw Error('DRAW_CONTINUATION_REPORT_SCHEMA_REQUIRED');
 const source=validateSource(raw.source);
 if(options.source!==undefined&&!same(validateSource(options.source),source))throw Error('DRAW_CONTINUATION_STALE_SOURCE');
 if(!isCurrent(source,true))throw Error('DRAW_CONTINUATION_STALE_SOURCE');
 const report=normalizeReport(raw,source);
 return{pass:true,status:'HYPOTHETICAL_DRAW_ANALYSIS_VERIFIED',report:boundedClone(report)};
 }catch(error){return{pass:false,status:'HYPOTHETICAL_DRAW_ANALYSIS_REJECTED',issues:[String(error?.message||error)]};}}
async function analyze(value,options={}){
 const source=validateSource(value),limits=limitsOf(options);
 const started=Date.now(),deadline=started+limits.maxMs,items=source.current.zones[0].deck,branches=[];
 let expanded=0,processed=0;
 const cancelled=()=>options.signal?.aborted===true;
 const stale=()=>!isCurrent(source,options.checkCurrentDeck!==false);
 if(cancelled())return{pass:false,status:'CANCELLED'};
 if(stale())return{pass:false,status:'STALE_SOURCE_CANCELLED'};
 for(let index=0;index<items.length;index++){
  if(cancelled())return{pass:false,status:'CANCELLED'};
  if(stale())return{pass:false,status:'STALE_SOURCE_CANCELLED'};
  const item=items[index],draw=hypotheticalDraw(source,item),base={index:index+1,uid:item.uid,cardId:draw.packet.cardId,name:String(H.card(item).name||draw.packet.cardId),weight:clone(draw.packet.weight),hypothesis:draw.packet};
  let reason=null,witness=null;
  if(!arr(draw.state.pendingTriggers).length&&R.goalMatches(draw.state,source.goal))witness={actions:[],after:draw.state,replay:{pass:true,status:'HYPOTHETICAL_CONTINUATION_REPLAY_VALID',steps:0}};
  else if(processed>=limits.maxBranches)reason='BRANCH_BUDGET';
  else if(expanded>=limits.maxStates)reason='STATE_BUDGET';
  else if(Date.now()>=deadline)reason='TIME_BUDGET';
  else{
   processed++;let local=0,head=0,depthHit=false,queue=[{state:draw.state,actions:[]}],seen=new Set([E.outcomeKey(draw.state)]);
   while(head<queue.length){
    if(cancelled())return{pass:false,status:'CANCELLED'};
    if(local>=limits.maxStatesPerBranch||expanded>=limits.maxStates){reason='STATE_BUDGET';break;}
    if(Date.now()>=deadline){reason='TIME_BUDGET';break;}
    const current=queue[head++];local++;expanded++;
    if(!arr(current.state.pendingTriggers).length&&R.goalMatches(current.state,source.goal)){witness={actions:current.actions,after:current.state,replay:{pass:true,status:'HYPOTHETICAL_CONTINUATION_REPLAY_VALID',steps:current.actions.length}};break;}
    if(current.actions.length>=limits.maxDepth){depthHit=true;continue;}
    for(const action of E.enumerate(current.state)){
     if(!ownAction(current.state,action,source.current.turn))continue;
     if(Date.now()>=deadline){reason='TIME_BUDGET';break;}
     const result=E.execute(current.state,action);
     if(!result.pass||result.after.turn!==source.current.turn||result.after.activePlayer!==0)continue;
     const key=E.outcomeKey(result.after);if(seen.has(key))continue;
     seen.add(key);queue.push({state:result.after,actions:[...current.actions,result.action]});
    }
    if(reason)break;
    if(expanded%4===0){options.onProgress?.({expanded,processedBranches:processed,totalBranches:items.length,currentBranch:index+1});await new Promise(resolve=>setTimeout(resolve,0));if(stale())return{pass:false,status:'STALE_SOURCE_CANCELLED'};}
   }
   if(!witness&&!reason)reason=depthHit?'DEPTH_HORIZON':'NO_REGISTERED_GOAL_WITNESS';
  }
  branches.push({...base,status:witness?'GOAL_WITNESS':'UNKNOWN',reason:witness?null:reason,witness});
  options.onProgress?.({expanded,processedBranches:processed,totalBranches:items.length,currentBranch:index+1});
  if(index%4===3){await new Promise(resolve=>setTimeout(resolve,0));}
 }
 if(cancelled())return{pass:false,status:'CANCELLED'};
 if(stale())return{pass:false,status:'STALE_SOURCE_CANCELLED'};
 const report={...common(source),source,limits,branches,summary:summarize(branches),limitations:clone(limitations)};
 // Retain conservative unknown mass if full recorded witnesses exceed the
 // report budget. A missing exported witness never counts as a success.
 let text=JSON.stringify(report);
 for(let i=branches.length-1;exceedsReportBudget(text)&&i>=0;i--)if(branches[i].witness){branches[i]={...branches[i],status:'UNKNOWN',reason:'REPORT_SIZE_BUDGET',witness:null};report.summary=summarize(branches);text=JSON.stringify(report);}
 if(exceedsReportBudget(text))throw Error('DRAW_CONTINUATION_REPORT_SIZE_LIMIT');
 const normalized=normalizeReport(JSON.parse(text),source);
 return boundedClone(normalized);
}
W.YGODrawContinuation=Object.freeze({analyze,verify,validateSource,sourceContext,capabilities:()=>({scope:METRIC,draws:1,player:0,opponentPolicy:'PASS',sameTurnOnly:true,observedDraw:false,ordinaryUnknownDrawEnabled:false,defaults:clone(defaults),maximumReportBytes:MAX_BYTES,certified:false,winRate:null})});
})();

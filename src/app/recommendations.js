/* Recommendations compare replayed physical scenarios. They describe the
 * supplied outcomes and never infer win rates or an adversarial optimum. */
(()=>{'use strict';
const W=typeof window==='object'?window:globalThis;
const arr=x=>Array.isArray(x)?x:[],clone=x=>structuredClone(x),card=x=>x?.card||x||{};
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const finite=x=>typeof x==='number'&&Number.isFinite(x),integer=(x,min=0)=>Number.isSafeInteger(x)&&x>=min;
const policyKeys=['opponentPolicy','ashPolicy','responsePolicy','responseTypes'];
const dimensions=Object.freeze({handCopies:{direction:'MAX',label:'cartas en mano'},knownVisibleAttack:{direction:'MAX',label:'ATK visible conocido'},ownLP:{direction:'MAX',label:'LP propios'},lpPaid:{direction:'MIN',label:'LP pagados como coste'},discardedCopies:{direction:'MIN',label:'descartes propios pagados'},banishedAsCost:{direction:'MIN',label:'cartas propias desterradas como coste'},ownLocks:{direction:'MIN',label:'restricciones propias activas documentadas'}});
const resultBase=()=>({schema:'ygo-observed-recommendations/v1',competitiveScore:null,winRate:null,certified:false,globalOptimalityProven:false,adversarialOptimalityProven:false});
const fail=(status,issues)=>({...resultBase(),pass:false,status,issues,matrix:[],recommendations:[],missingEvidence:[]});
function deckFingerprint(deck,context){const E=W.YGOComboEngine;if(E?.deckFingerprint)return E.deckFingerprint(deck);return W.YGOStrategy.fingerprint(deck,context);}
function policy(input){
 if(typeof input==='string'&&input)return{opponentPolicy:input};
 if(!input||typeof input!=='object'||Array.isArray(input)||typeof input.opponentPolicy!=='string'||!input.opponentPolicy)throw Error('SCENARIO_POLICY_REQUIRED');
 if(Object.keys(input).some(k=>!policyKeys.includes(k)))throw Error('UNSUPPORTED_POLICY_FIELD');
 const value=clone(input);if(value.responseTypes!==undefined&&(!Array.isArray(value.responseTypes)||value.responseTypes.some(x=>typeof x!=='string'||!x)))throw Error('INVALID_RESPONSE_TYPE_POLICY');
 return value;
}
function matchesPolicy(value,context){return Object.entries(value).every(([key,v])=>stable(v)===stable(context?.[key]));}
function actualPolicy(context){return Object.fromEntries(policyKeys.filter(k=>context?.[k]!==undefined).map(k=>[k,clone(context[k])]));}
function baseline(state){
 const value=clone(state);delete value.provenance;delete value.events;
 if(value.context){for(const key of [...policyKeys,'seed','initialOrderSource'])delete value.context[key];}
 return stable(value);
}
function reconstructInitial(state,deck){
 if(!state?.provenance||typeof W.YGOComboEngine?.createState!=='function')return{pass:false,reason:'INITIAL_RECONSTRUCTION_UNAVAILABLE'};
 try{const rebuilt=W.YGOComboEngine.createState({...state.provenance,deck,context:state.context});return stable(state)===stable(rebuilt)?{pass:true,state:rebuilt}:{pass:false,reason:'INITIAL_RECONSTRUCTION_MISMATCH'};}
 catch(e){return{pass:false,reason:'INITIAL_RECONSTRUCTION_REJECTED',issues:[String(e?.message||e)]};}
}
function finalState(line){return line.state||line.after||line.finalState;}
// One declarative goal contract is shared by recommendations and both workbenches.
// The legacy field key continues to mean face-up monsters; Spell/Trap positions
// have distinct keys and never widen that historical meaning.
const goalCardKeys=Object.freeze(['requiredFieldIds','requiredHandIds','recoveredHandIds','requiredFaceUpSpellTrapIds','requiredSetSpellTrapIds']);
const goalStateKeys=Object.freeze(['opponentLpAtMost','ownLpAtLeast','phase','turn','activePlayer']);
const canonicalGoalId=id=>Number(W.YGODataCatalog?.canonicalIdentity?.(Number(id))?.canonicalId??(W.YGODataCatalog?.lookup?.(Number(id))?.alias||id));
function handGoalIds(goal){return goal.requiredHandIds??goal.recoveredHandIds;}
function validateGoal(goal){
 if(!goal||typeof goal!=='object'||Array.isArray(goal))throw Error('INVALID_GOAL: utiliza cartas, LP, turno, fase o jugador activo.');
 if(Object.keys(goal).some(key=>![...goalCardKeys,...goalStateKeys].includes(key)))throw Error('UNSUPPORTED_GOAL_FIELD');
 for(const key of goalCardKeys)if(goal[key]!==undefined){
  if(!Array.isArray(goal[key])||goal[key].length>20||goal[key].some(id=>!integer(id,1)||!W.YGODataCatalog?.lookup?.(id)))throw Error('INVALID_GOAL_CARD_IDS: cartas o cantidades inválidas.');
  if(['requiredFaceUpSpellTrapIds','requiredSetSpellTrapIds'].includes(key)&&goal[key].some(id=>{const c=W.YGODataCatalog?.rulesCard?.(id)||W.YGODataCatalog.lookup(id),bits=Number(c?.typeBits);return!Number.isSafeInteger(bits)||!(bits&6)||!!(bits&(1|0x8000000|0x4000))||/skills/i.test(String(c?.source||''))||/skill/i.test(String(c?.type||''));}))throw Error('INVALID_SPELL_TRAP_GOAL: utiliza Mágicas o Trampas del catálogo.');
 }
 if(goal.requiredHandIds!==undefined&&goal.recoveredHandIds!==undefined){const identities=ids=>arr(ids).map(canonicalGoalId).sort((a,b)=>a-b);if(stable(identities(goal.requiredHandIds))!==stable(identities(goal.recoveredHandIds)))throw Error('CONFLICTING_HAND_GOAL_ALIASES: los dos campos de mano deben representar las mismas copias.');}
 for(const key of ['opponentLpAtMost','ownLpAtLeast'])if(goal[key]!==undefined&&(!finite(goal[key])||goal[key]<0))throw Error('INVALID_GOAL_LP');
 if(goal.turn!==undefined&&(!integer(goal.turn,1)||goal.turn>100)||goal.activePlayer!==undefined&&![0,1].includes(goal.activePlayer)||goal.phase!==undefined&&!['DRAW','STANDBY','MAIN 1','BATTLE','MAIN 2','END'].includes(goal.phase))throw Error('INVALID_GOAL_STATE');
 if(!goalCardKeys.some(key=>arr(goal[key]).length)&&!goalStateKeys.some(key=>goal[key]!==undefined))throw Error('EMPTY_GOAL: añade al menos una carta o condición al objetivo.');
 return clone(goal);
}
function goalMatches(state,goal){
 if(!state||!goal||typeof goal!=='object'||Array.isArray(goal))return false;
 // A physical UID can satisfy only one requested copy, including across zones.
 const claimed=new Set(),contains=(items,ids)=>{const available=new Map();for(const item of arr(items)){const id=canonicalGoalId(card(item).id),identity=item?.uid??item;if(claimed.has(identity))continue;let row=available.get(id);if(!row)available.set(id,row=[]);if(!row.some(x=>x.identity===identity))row.push({identity});}for(const id of arr(ids)){const row=available.get(canonicalGoalId(id));while(row?.length&&claimed.has(row[0].identity))row.shift();const copy=row?.shift();if(!copy)return false;claimed.add(copy.identity);}return true;};
 const zones=state.zones?.[0]||{};
 return contains(arr(zones.monster).filter(x=>x.faceUp===true),goal.requiredFieldIds)&&contains(zones.hand,handGoalIds(goal))&&contains(arr(zones.spelltrap).filter(x=>x.faceUp===true),goal.requiredFaceUpSpellTrapIds)&&contains(arr(zones.spelltrap).filter(x=>x.faceUp===false),goal.requiredSetSpellTrapIds)&&(goal.opponentLpAtMost===undefined||Number(state.lp?.[1])<=goal.opponentLpAtMost)&&(goal.ownLpAtLeast===undefined||Number(state.lp?.[0])>=goal.ownLpAtLeast)&&(goal.phase===undefined||state.phase===goal.phase)&&(goal.turn===undefined||state.turn===goal.turn)&&(goal.activePlayer===undefined||state.activePlayer===goal.activePlayer);
}
// This read-only explanation is deliberately outside the per-node search path.
// Allocate in the same zone and request order as goalMatches, then group the
// display rows by canonical identity. A physical UID cannot fill two demands.
function goalProgress(state,goal){
 const value=validateGoal(goal),present=!!state&&typeof state==='object'&&!Array.isArray(state),zones=present?state.zones?.[0]||{}:{},claimed=new Set(),requirements=[];
 const placements=[['requiredFieldIds','monster',true],
  [value.requiredHandIds!==undefined?'requiredHandIds':'recoveredHandIds','hand',null],
  ['requiredFaceUpSpellTrapIds','spelltrap',true],['requiredSetSpellTrapIds','spelltrap',false]];
 for(const [key,zone,faceUp]of placements){
  const requested=arr(value[key]),available=new Map(),groups=new Map();
  for(const item of arr(zones[zone])){
   if(faceUp!==null&&item.faceUp!==faceUp)continue;
   const id=canonicalGoalId(card(item).id),identity=item?.uid??item;if(claimed.has(identity))continue;
   let copies=available.get(id);if(!copies)available.set(id,copies=[]);if(!copies.some(copy=>copy.identity===identity))copies.push({identity,uid:typeof item?.uid==='string'?item.uid:null});
  }
  for(const requestedId of requested){
   const id=canonicalGoalId(requestedId);let row=groups.get(id);
   if(!row){const entry=W.YGODataCatalog?.lookup?.(id)||W.YGODataCatalog?.lookup?.(requestedId);row={kind:'CARD',key,zone,...(faceUp!==null?{faceUp}:{}),cardId:id,name:entry?.name||String(id),required:0,matched:0,missing:0,fulfilled:false,matchedUids:[]};groups.set(id,row);}
   row.required++;
   const copies=available.get(id);while(copies?.length&&claimed.has(copies[0].identity))copies.shift();
   const copy=copies?.shift();if(copy){claimed.add(copy.identity);row.matched++;if(copy.uid!==null)row.matchedUids.push(copy.uid);}
  }
  for(const row of groups.values()){row.missing=row.required-row.matched;row.fulfilled=present&&row.missing===0;requirements.push(row);}
 }
 for(const key of goalStateKeys){
  if(value[key]===undefined)continue;
  let actual=null,fulfilled=false;
  if(present){
   if(key==='opponentLpAtMost'||key==='ownLpAtLeast'){
    const numeric=Number(state.lp?.[key==='opponentLpAtMost'?1:0]);actual=Number.isFinite(numeric)?numeric:null;
    fulfilled=key==='opponentLpAtMost'?numeric<=value[key]:numeric>=value[key];
   }else{actual=state[key]??null;fulfilled=state[key]===value[key];}
  }
  requirements.push({kind:'STATE',key,expected:value[key],actual,fulfilled});
 }
 const cardRows=requirements.filter(row=>row.kind==='CARD'),fulfilledRequirements=requirements.filter(row=>row.fulfilled).length;
 return{schema:'ygo-goal-progress/v1',achieved:present&&fulfilledRequirements===requirements.length,requirements,
  totals:{fulfilledRequirements,totalRequirements:requirements.length,matchedCopies:cardRows.reduce((total,row)=>total+row.matched,0),requiredCopies:cardRows.reduce((total,row)=>total+row.required,0)}};
}
function goalDefinition(goal,label){
 if(goal===undefined||goal===null)return{id:'ANY_SUPPORTED_LINE',label:'Una línea completa dentro del alcance registrado',test:line=>arr(line.actions).length>0,serialized:{id:'ANY_SUPPORTED_LINE'}};
 if(typeof goal==='function')return{id:'CALLER_DECLARED_GOAL',label:String(label||'Objetivo declarado por el usuario'),test:(line,metrics)=>goal(finalState(line),line,metrics)===true,serialized:{id:'CALLER_DECLARED_GOAL',label:String(label||'Objetivo declarado por el usuario')}};
 const value=validateGoal(goal);
 return{id:'DECLARED_STATE_GOAL',label:String(label||'Monstruos, Mágicas/Trampas, mano y estado declarados'),serialized:value,test:line=>goalMatches(finalState(line),value)};
}
function firstOwnAction(line){
 for(const action of arr(line.actions)){
  const uid=action.sourceUid||action.uid;if(!uid)continue;
  let source=null;for(let p=0;p<2;p++)for(const cards of Object.values(action.before?.zones?.[p]||{}))if(Array.isArray(cards)){const found=cards.find(x=>x.uid===uid);if(found)source={item:found,player:p};}
  if(!source||source.player!==0||Number(source.item.ownerPlayer??0)!==0)continue;
  const excluded=new Set(['before','after','paid','events','proof','witnesses','ashNegated','effectNegated','response','responseUid','requiresAsh']);
  const controls=Object.fromEntries(Object.entries(action).filter(([k])=>!excluded.has(k)));
  const name=card(source.item).name||W.YGODataCatalog?.lookup?.(Number(card(source.item).id))?.name||String(card(source.item).id);
  return{key:stable(controls),controls,sourceUid:uid,cardId:Number(card(source.item).id),sourceName:name,type:action.type};
 }
 return null;
}
function finalDomain(state){return stable({turn:state.turn??null,phase:state.phase??null,activePlayer:state.activePlayer??null});}
function observedVector(metrics){const c=metrics.comparisonVector||{};return{handCopies:c.handCopies??null,knownVisibleAttack:c.knownVisibleAttack??null,ownLP:metrics.state?.ownLP??null,lpPaid:c.lpPaid??null,discardedCopies:c.discardedCopies??null,banishedAsCost:c.banishedAsCost??null,ownLocks:c.ownLocks??null};}
function range(rows){const output={};for(const key of Object.keys(dimensions)){const values=rows.map(x=>x.vector[key]),known=values.filter(finite);output[key]={minimum:known.length?Math.min(...known):null,maximum:known.length?Math.max(...known):null,knownOutcomes:known.length,totalOutcomes:rows.length,complete:known.length===rows.length&&rows.length>0};}return output;}
function weakest(ranges){const v={};for(const [key,definition] of Object.entries(dimensions)){const r=ranges[key];v[key]=r?.complete?(definition.direction==='MAX'?r.minimum:r.maximum):null;}return v;}
function dominates(a,b,keys){let strict=false;for(const key of keys){const sign=dimensions[key].direction==='MAX'?1:-1,delta=(a[key]-b[key])*sign;if(delta<0)return false;if(delta>0)strict=true;}return strict;}
function explain(row,cohort){
 const facts=[],advantages=[],tradeoffs=[];
 for(const [key,definition] of Object.entries(dimensions)){const r=row.observedRanges[key];if(!r?.knownOutcomes)continue;facts.push({metric:key,label:definition.label,minimum:r.minimum,maximum:r.maximum,complete:r.complete});
  const others=cohort.filter(x=>x!==row&&x.endDomain===row.endDomain&&finite(x.worstObserved[key]));if(!finite(row.worstObserved[key])||!others.length)continue;
  const better=others.filter(x=>(row.worstObserved[key]-x.worstObserved[key])*(definition.direction==='MAX'?1:-1)>0),worse=others.filter(x=>(row.worstObserved[key]-x.worstObserved[key])*(definition.direction==='MAX'?1:-1)<0);
  if(better.length)advantages.push({metric:key,label:definition.label,value:row.worstObserved[key],comparedPlanIds:better.map(x=>x.planId),meaning:'Mejor extremo observado en esta dimensión; no prueba una ventaja competitiva.'});
  if(worse.length)tradeoffs.push({metric:key,label:definition.label,value:row.worstObserved[key],comparedPlanIds:worse.map(x=>x.planId),meaning:'Coste o recurso menos favorable en los resultados suministrados.'});
 }
 return{facts,advantages,tradeoffs};
}
function missingGoalCards(deck,goal){
 if(!goal||typeof goal!=='object'||Array.isArray(goal))return[];
 const output=[],counts=new Map(),demands=new Map();for(const z of ['main','extra'])for(const c of arr(deck?.[z]))counts.set(canonicalGoalId(c.id),(counts.get(canonicalGoalId(c.id))||0)+Number(c.qty??1));
 for(const key of goalCardKeys){if(key==='recoveredHandIds'&&goal.requiredHandIds!==undefined)continue;for(const id of arr(goal[key])){const family=canonicalGoalId(id);let row=demands.get(family);if(!row)demands.set(family,row={id,requiredCopies:0,goalFields:[]});row.requiredCopies++;if(!row.goalFields.includes(key))row.goalFields.push(key);}}
 for(const [family,row]of demands){const actualCopies=counts.get(family)||0;if(actualCopies>=row.requiredCopies)continue;const c=W.YGODataCatalog?.rulesCard?.(row.id)||W.YGODataCatalog?.lookup?.(row.id),isExtra=!!(Number(c?.typeBits)&(0x40|0x2000|0x800000|0x4000000));output.push({reason:actualCopies?'DECLARED_GOAL_COPIES_INSUFFICIENT':'DECLARED_GOAL_CARD_ABSENT',cardId:row.id,name:c?.name||null,requiredZone:isExtra?'extra':'main_or_extra',evidence:{goalField:row.goalFields[0],goalFields:row.goalFields,actualCopies,requiredCopies:row.requiredCopies},meaning:'El objetivo exige más copias simultáneas de esta identidad que las disponibles en Main y Extra. No se propone una proporción competitiva.'});}
 return output;
}
function evaluate({deck,scenarios,context={},goal,goalLabel}={}){
 try{
  const S=W.YGOStrategy;if(typeof S?.evaluateLines!=='function')return fail('STRATEGY_MODULE_REQUIRED',['Fresh replay metrics are required.']);
  if(!deck||!Array.isArray(deck.main)||!Array.isArray(deck.extra)||!Array.isArray(deck.side))return fail('INVALID_DECK',['Provide Main, Extra and Side arrays.']);
  if(context.player!==undefined&&context.player!==0)return fail('PLAYER_NOT_SUPPORTED',['Recommendations currently describe the deck owned by player zero.']);
  if(!Array.isArray(scenarios)||!scenarios.length||scenarios.length>16)return fail('INVALID_SCENARIOS',['Provide 1–16 physical scenarios.']);
  const fp=deckFingerprint(deck,context);if(context.deckFingerprint!==undefined&&context.deckFingerprint!==fp)return fail('DECK_FINGERPRINT_MISMATCH',['The context refers to another deck.']);
  const target=goalDefinition(goal,goalLabel),ids=new Set(),matrix=[],rejected=[],plans=new Map(),evidence=[],scenarioRows=[];let sharedBaseline=null;
  for(const [scenarioIndex,scenario] of scenarios.entries()){
   const id=String(scenario?.id||'').trim();if(!id||id.length>100||ids.has(id))return fail('INVALID_SCENARIO_ID',['Scenario IDs must be nonempty, unique and at most 100 characters.']);ids.add(id);
   if(!Array.isArray(scenario.lines)||scenario.lines.length>64)return fail('INVALID_SCENARIO_LINES',['Each scenario needs an array of at most 64 lines.']);
   const expected=policy(scenario.policy),validLines=[],indices=[];let scenarioBaseline=null,initialRejected=false;
   const initial=scenario.initialState||scenario.initial;
   if(initial){const proof=reconstructInitial(initial,deck);let reason=null;if(!proof.pass)reason=proof.reason;else if(!matchesPolicy(expected,initial.context))reason='INITIAL_POLICY_MISMATCH';else{const key=baseline(initial);if(sharedBaseline!==null&&key!==sharedBaseline)reason='INITIAL_SCENARIO_BASELINE_MISMATCH';else{sharedBaseline??=key;scenarioBaseline=key;}}
    if(reason){rejected.push({scenarioId:id,issues:[reason,...arr(proof.issues)]});initialRejected=true;}}
   for(const [i,line] of scenario.lines.entries()){
    if(initialRejected){rejected.push({scenarioId:id,lineIndex:i,issues:['DECLARED_INITIAL_STATE_REJECTED']});continue;}
    if(!matchesPolicy(expected,line?.context)){rejected.push({scenarioId:id,lineIndex:i,issues:['DECLARED_POLICY_DOES_NOT_MATCH_REPLAY_CONTEXT']});continue;}
    validLines.push(line);indices.push(i);
   }
   const entries=[];for(const [i,line] of validLines.entries()){const analysis=S.evaluateLines({deck,lines:[line],context:{...context,deckFingerprint:fp}});for(const row of arr(analysis.rejected))rejected.push({scenarioId:id,lineIndex:indices[i],issues:row.issues});for(const row of arr(analysis.lines))entries.push({...row,index:i});}
   const outcomes=[],seenOutcomes=new Set();
   for(const entry of entries){
    const line=validLines[entry.index],key=baseline(line.before||line.openingBefore);
    if(scenarioBaseline!==null&&key!==scenarioBaseline){rejected.push({scenarioId:id,lineIndex:indices[entry.index],issues:['SCENARIO_CONTAINS_DIFFERENT_PHYSICAL_OPENINGS']});continue;}
    if(sharedBaseline!==null&&key!==sharedBaseline){rejected.push({scenarioId:id,lineIndex:indices[entry.index],issues:['SCENARIO_OPENING_OR_OPPONENT_INVENTORY_MISMATCH']});continue;}
    scenarioBaseline=key;sharedBaseline??=key;
    let goalReached=false;try{goalReached=target.test(line,entry.metrics)===true;}catch(e){rejected.push({scenarioId:id,lineIndex:indices[entry.index],issues:['GOAL_EVALUATION_FAILED:'+String(e?.message||e)]});continue;}
    const first=firstOwnAction(line),end=finalDomain(finalState(line)),outcome={scenarioId:id,lineIndex:indices[entry.index],lineId:entry.lineId,goalReached,steps:entry.steps,metrics:clone(entry.metrics),vector:observedVector(entry.metrics),endDomain:end,firstAction:first,policy:actualPolicy(line.context),replayFresh:true,copiesConserved:true};
    const finalView=clone(finalState(line));delete finalView.events;delete finalView.provenance;const outcomeKey=stable({first:first?.key??null,final:finalView,metrics:entry.metrics});if(seenOutcomes.has(outcomeKey))continue;seenOutcomes.add(outcomeKey);outcomes.push(outcome);
    if(first&&goalReached){const planKey=stable({first:first.key,end});let p=plans.get(planKey);if(!p){p={planId:'plan-'+(plans.size+1),firstAction:clone(first),endDomain:end,outcomes:[]};plans.set(planKey,p);}p.outcomes.push(outcome);}
   }
   const counts={verifiedOutcomes:outcomes.length,goalReached:outcomes.filter(x=>x.goalReached).length};
   const hasChoice=p=>p.opponentPolicy==='ASH_EXPLICIT'&&p.ashPolicy!=='FIRST_ELIGIBLE'||p.opponentPolicy==='RESPONSES_EXPLICIT'&&p.responsePolicy!=='FIRST_ELIGIBLE';
   const branchChoice=hasChoice(expected)||outcomes.some(x=>hasChoice(x.policy));
   const row={id,label:String(scenario.label||id),policy:expected,counts,classification:counts.goalReached?'VERIFIED_GOAL_OBSERVED':'UNKNOWN',baselineVerified:scenarioBaseline!==null,branchChoice,
    declaredSearchComplete:scenario.searchComplete===true||scenario.enumerationComplete===true,truncated:scenario.truncated===true,verifiedFailure:false,
    bounds:{goalObserved:counts.goalReached>0,impossibilityProven:false},outcomes:outcomes.map(({vector,firstAction,...x})=>x)};matrix.push(row);scenarioRows.push({row,outcomes});
   if(!counts.goalReached)evidence.push({scenarioId:id,reason:'NO_VERIFIED_GOAL_IS_NOT_A_PROVEN_FAILURE',truncated:row.truncated});
   if(!row.baselineVerified)evidence.push({scenarioId:id,reason:'PHYSICAL_INITIAL_STATE_UNVERIFIED'});
   if(branchChoice)evidence.push({scenarioId:id,reason:'CHOICE_BRANCHES_INCLUDE_OPTIMISTIC_ADVERSARY_CHOICES'});
  }
  const recommendations=[...plans.values()].map(p=>{
   const ranges=range(p.outcomes),byScenario=new Map();for(const x of p.outcomes){if(!byScenario.has(x.scenarioId))byScenario.set(x.scenarioId,[]);byScenario.get(x.scenarioId).push(x);}
   const unsupported=matrix.filter(s=>!byScenario.has(s.id)).map(s=>s.id),allObserved=unsupported.length===0,constrained=matrix.every(s=>!s.branchChoice&&s.baselineVerified);
   return{planId:p.planId,firstAction:p.firstAction,endDomain:p.endDomain,verifiedGoalScenarios:byScenario.size,requestedScenarios:matrix.length,unknownScenarios:unsupported,
    observedOutcomes:p.outcomes.length,observedRanges:ranges,worstObserved:weakest(ranges),observedPolicyCoverageComplete:allObserved,
    constrainedPolicyCoverageComplete:allObserved&&constrained,claim:allObserved&&constrained?'A_REPLAYED_ADAPTATION_EXISTS_FOR_EACH_SUPPLIED_POLICY':'PARTIAL_OBSERVED_POLICY_SUPPORT',
    scenarioEvidence:[...byScenario].map(([id,rows])=>({scenarioId:id,lineIndexes:rows.map(x=>x.lineIndex),outcomes:rows.length})),paretoFront:null,dominators:[],comparedDimensions:[],scalarScore:null};
  });
  const groups=new Map();for(const r of recommendations){const key=stable({end:r.endDomain,scenarios:r.scenarioEvidence.map(x=>x.scenarioId).sort()});if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);}
  for(const cohort of groups.values()){
   const keys=Object.keys(dimensions).filter(key=>cohort.every(r=>finite(r.worstObserved[key])));if(!keys.length)continue;let pending=cohort.slice(),front=1;
   while(pending.length){const layer=pending.filter(x=>!pending.some(y=>y!==x&&dominates(y.worstObserved,x.worstObserved,keys)));for(const x of layer)x.paretoFront=front;pending=pending.filter(x=>!layer.includes(x));front++;}
   for(const x of cohort){x.comparedDimensions=keys.slice();x.dominators=cohort.filter(y=>y!==x&&dominates(y.worstObserved,x.worstObserved,keys)).map(y=>y.planId);}
  }
  for(const row of recommendations)Object.assign(row,explain(row,recommendations));
  recommendations.sort((a,b)=>b.verifiedGoalScenarios-a.verifiedGoalScenarios||Number(b.constrainedPolicyCoverageComplete)-Number(a.constrainedPolicyCoverageComplete)||(a.paretoFront??Infinity)-(b.paretoFront??Infinity)||a.planId.localeCompare(b.planId));
  const missingCards=missingGoalCards(deck,goal),verified=matrix.reduce((n,x)=>n+x.counts.verifiedOutcomes,0);
  return{...resultBase(),pass:verified>0,status:verified?'OBSERVED_SCENARIO_RECOMMENDATIONS':'NO_VERIFIED_SCENARIO_OUTCOMES',deckFingerprint:fp,goal:{id:target.id,label:target.label,definition:target.serialized},
   matrix,recommendations,rejected,missingGoalCards:missingCards,missingEvidence:evidence,coverage:{scenarios:matrix.length,scenariosWithVerifiedGoal:matrix.filter(x=>x.counts.goalReached>0).length,verifiedOutcomes:verified,failedScenariosProven:0,scopeComplete:false},
   comparison:{method:'PARETO_OF_OBSERVED_EXTREMES_WITH_EQUAL_SCENARIO_COVERAGE_AND_FINAL_STATE_DOMAIN',baselineFingerprint:sharedBaseline,dimensions,scalarScore:null,
    meaning:'An opening action can have a replayed continuation per supplied scenario. Unknown scenarios remain unknown, and observed extremes are not a minimax guarantee.'},
   limitations:['Only supplied physical openings, fields, policies and replayed outcomes are compared.','A complete bounded search does not prove failure outside its registered rules.','Conditional response capacity is separate from an executed response.','Search truncation and selected results can omit stronger or weaker outcomes.','No win rate, deck tier or globally optimal policy is inferred.']};
 }catch(e){return fail('INVALID_RECOMMENDATION_INPUT',[String(e?.message||e)]);}
}
W.YGORecommendations=Object.freeze({version:'observed-policy-recommendations-v1',evaluate,dimensions,validateGoal,goalMatches,goalProgress});
})();

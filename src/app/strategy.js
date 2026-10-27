/* Evidence-driven comparison of observed lines and physical opening events.
 * No metric in this module is a win rate, universal legality certificate or
 * proof of a globally optimal combo. Unmodeled outcomes stay unknown. */
(()=>{'use strict';
const W=typeof window==='object'?window:globalThis;
const ZONES=['deck','extra','hand','monster','spelltrap','gy','banished','field','pendulum'];
const arr=x=>Array.isArray(x)?x:[],card=x=>x?.card||x||{},clone=x=>typeof structuredClone==='function'?structuredClone(x):JSON.parse(JSON.stringify(x));
const int=(x,min=0,max=Number.MAX_SAFE_INTEGER)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const now=()=>typeof performance==='object'&&typeof performance.now==='function'?performance.now():Date.now();
const token=x=>x?.token===true||x?.isToken===true||!!(Number(card(x).typeBits)&0x4000);
const stable=x=>JSON.stringify(x,(_,value)=>value&&typeof value==='object'&&!Array.isArray(value)?Object.fromEntries(Object.keys(value).sort().map(key=>[key,value[key]])):value);
const normalId=x=>{const n=Number(typeof x==='object'?x?.id??x?.cardId:x);if(!int(n,1))throw Error('INVALID_PASSCODE');return String(n)};
function qty(x){const n=typeof x==='object'?Number(x?.qty??1):1;if(!int(n,1,60))throw Error('INVALID_QUANTITY');return n;}
function normalizedMain(deck){
 const main=Array.isArray(deck)?deck:deck?.main;if(!Array.isArray(main))throw Error('MAIN_DECK_REQUIRED');
 const rows=new Map();let total=0;
 for(const input of main){const id=normalId(input),n=qty(input);total+=n;if(total>60)throw Error('MAIN_DECK_OVER_60');const old=rows.get(id);if(old)old.qty+=n;else rows.set(id,{id:Number(id),qty:n,card:typeof input==='object'?{...input,qty:1}:{id:Number(id),qty:1}});}
 return {rows:[...rows.values()],total};
}
function fingerprint(deck,context={}){
 const zones=['main','extra','side'].map(z=>{
  const source=Array.isArray(deck)?(z==='main'?deck:[]):arr(deck?.[z]),counts=new Map();
  for(const c of source){const id=normalId(c);counts.set(id,(counts.get(id)||0)+qty(c));}
  return [...counts].sort((a,b)=>Number(a[0])-Number(b[0]));
 });
 return JSON.stringify({format:String(context.format||'tcg').toLowerCase(),banlistVersion:String(context.banlistVersion||''),zones});
}
function expectedFingerprint(deck,context){
 if(typeof context.fingerprintDeck==='function')return String(context.fingerprintDeck(deck,context));
 if(typeof context.deckFingerprint==='string'&&context.deckFingerprint)return context.deckFingerprint;
 return fingerprint(deck,context);
}
function zoneRows(st,player){
 if(!st||!Array.isArray(st.zones)||st.zones.length!==2||!int(player,0,1))throw Error('NORMALIZED_TWO_PLAYER_STATE_REQUIRED');
 const z=st.zones[player];if(!z||typeof z!=='object')throw Error('PLAYER_ZONES_MISSING');
 for(const name of ZONES)if(z[name]!==undefined&&!Array.isArray(z[name]))throw Error('INVALID_ZONE_'+name);
 return z;
}
function physicalInventory(st){
 const ids=new Map(),uids=new Map(),tokens=[],allUids=new Set();
 const visit=(entry,zone,player,attachment=false)=>{
  if(!entry||typeof entry!=='object')throw Error('INVALID_STATE_CARD');
  const c=card(entry),uid=String(entry.uid||''),owner=Number(entry.ownerPlayer??entry.owner??player);
  if(!int(owner,0,1))throw Error('INVALID_CARD_OWNER');
  const count=uid?1:qty(entry);
  if(uid){if(allUids.has(uid))throw Error('DUPLICATE_PHYSICAL_UID');allUids.add(uid);}
  if(token(entry)){tokens.push({uid,id:c.id??null,zone,player});return;}
  const id=normalId(c);
  if(uid){if(uids.has(uid))throw Error('DUPLICATE_PHYSICAL_UID');uids.set(uid,{id,owner});}
  const key=owner+':'+id;ids.set(key,(ids.get(key)||0)+count);
  for(const child of arr(entry.overlays||entry.materials||entry.xyzMaterials))visit(child,'overlay',player,true);
 };
 for(let p=0;p<2;p++){const z=zoneRows(st,p);for(const name of ZONES)for(const e of arr(z[name]))visit(e,name,p);}
 return{ids,uids,tokens,key:JSON.stringify([...ids].sort((a,b)=>a[0].localeCompare(b[0])))};
}
function handSignature(hand){const counts=new Map();for(const x of arr(hand)){const id=normalId(card(x)),n=x?.uid?1:qty(x);counts.set(id,(counts.get(id)||0)+n);}return JSON.stringify([...counts].sort((a,b)=>Number(a[0])-Number(b[0])));}
function finalState(line){return line?.state||line?.after||line?.finalState;}
function verifierFor(context){return context.verifyLine||W.YGOComboEngine?.replay||W.YGOStable?.replaySupported;}
function validateLine(line,deck,context={}){
 const issues=[];
 if(!line||typeof line!=='object'||!Array.isArray(line.actions)||!line.actions.length)return{pass:false,issues:['LINE_ACTIONS_REQUIRED']};
 if(line.replay?.pass!==true)return{pass:false,issues:['PREVIOUS_REPLAY_MISSING_OR_REJECTED']};
 const fp=expectedFingerprint(deck,context);
 if(typeof line.deckFingerprint!=='string'||line.deckFingerprint!==fp)issues.push('DECK_FINGERPRINT_MISMATCH');
 if(line.globalOptimalityProven===true)issues.push('UNSUPPORTED_GLOBAL_OPTIMALITY_CLAIM');
 if(context.format&&line.context?.format&&String(context.format).toLowerCase()!==String(line.context.format).toLowerCase())issues.push('FORMAT_MISMATCH');
 if(context.banlistVersion&&line.context?.banlistVersion&&String(context.banlistVersion)!==String(line.context.banlistVersion))issues.push('BANLIST_MISMATCH');
 const before=line.before||line.openingBefore,after=finalState(line),player=Number(context.player??0);
 for(const key of ['modelBuild','dataVersion','banlistIdentity','formatContextVersion'])if(context[key]!==undefined&&line.context?.[key]!==context[key])issues.push('CONTEXT_MISMATCH:'+key);
 for(const key of ['turn','phase','activePlayer'])if(context[key]!==undefined&&before?.[key]!==context[key])issues.push('INITIAL_STATE_MISMATCH:'+key);
 let inventoryBefore,inventoryAfter;
 try{
  inventoryBefore=physicalInventory(before);inventoryAfter=physicalInventory(after);
  if(inventoryBefore.key!==inventoryAfter.key)issues.push('PRINTED_CARD_COPIES_NOT_CONSERVED');
  const expectedOwned=new Map();for(const zone of ['main','extra'])for(const item of arr(deck?.[zone]||(Array.isArray(deck)&&zone==='main'?deck:[]))){const key=player+':'+normalId(item);expectedOwned.set(key,(expectedOwned.get(key)||0)+qty(item));}
  const expectedKey=JSON.stringify([...expectedOwned].sort((a,b)=>a[0].localeCompare(b[0]))),actualKey=JSON.stringify([...inventoryBefore.ids].filter(([key])=>key.startsWith(player+':')).sort((a,b)=>a[0].localeCompare(b[0])));
  if(expectedKey!==actualKey)issues.push('OPENING_INVENTORY_DOES_NOT_MATCH_MAIN_AND_EXTRA');
  if(inventoryBefore.uids.size!==inventoryAfter.uids.size)issues.push('PHYSICAL_UID_COUNT_CHANGED');
  for(const [uid,value] of inventoryBefore.uids){const b=inventoryAfter.uids.get(uid);if(!b||b.id!==value.id||b.owner!==value.owner){issues.push('PHYSICAL_UID_IDENTITY_CHANGED');break;}}
  if(context.expectedHand&&handSignature(zoneRows(before,player).hand)!==handSignature(context.expectedHand))issues.push('SAMPLED_HAND_PROVENANCE_MISMATCH');
 }catch(e){issues.push(String(e?.message||e));}
 if(issues.length)return{pass:false,issues};
 const verify=verifierFor(context);if(typeof verify!=='function')return{pass:false,issues:['INDEPENDENT_REPLAY_VERIFIER_REQUIRED']};
 let verification;try{verification=verify(line,{deck,context,expectedDeckFingerprint:fp});}catch(e){return{pass:false,issues:['REPLAY_EXCEPTION:'+String(e?.message||e)]};}
 if(verification&&typeof verification.then==='function')return{pass:false,issues:['SYNCHRONOUS_REPLAY_VERIFIER_REQUIRED']};
 if(verification?.pass!==true)return{pass:false,issues:['FRESH_REPLAY_REJECTED'],verification};
 return{pass:true,verification,before,after,player,inventoryBefore,inventoryAfter,expectedDeckFingerprint:fp};
}
function boardMetrics(valid){
 const {before,after,player,verification,inventoryAfter}=valid,own=zoneRows(after,player),start=zoneRows(before,player),w=verification.witnesses||{};
 const board=[...arr(own.monster).map(x=>({entry:x,zone:'monster'})),...arr(own.spelltrap).map(x=>({entry:x,zone:'spelltrap'})),...arr(own.field).map(x=>({entry:x,zone:'field'}))];
 const byUid=new Map(board.filter(x=>x.entry.uid).map(x=>[String(x.entry.uid),x]));
 const units=z=>arr(own[z]).reduce((n,x)=>n+(x?.uid?1:qty(x)),0);
 let visibleAttack=0,unknownAttack=0,faceUpMonsters=0;
 for(const x of arr(own.monster))if(x.faceUp!==false){faceUpMonsters++;const atk=finite(x.currentAtk)?x.currentAtk:card(x).atk;if(finite(atk)&&atk>=0)visibleAttack+=atk;else unknownAttack++;}
 const responseOptions=[],invalidResponseWitnesses=[],responseKeys=new Set(),responseSources=new Set();
 for(const witness of arr(w.interruptions)){
  const uid=String(witness?.uid||witness?.sourceUid||''),source=byUid.get(uid),effect=String(witness?.effectId??witness?.kind??'');
  const declaredWindow=String(witness?.window||'');
  if(!source||!effect||witness.available!==true||witness.requirementsMet!==true||!declaredWindow||
     (witness.sourceZone&&witness.sourceZone!==source.zone)||witness.negated===true||witness.used===true){invalidResponseWitnesses.push({uid,effect,reason:'RESPONSE_NOT_AVAILABLE_IN_VERIFIED_FINAL_STATE'});continue;}
  const key=uid+':'+effect+':'+declaredWindow;if(responseKeys.has(key))continue;responseKeys.add(key);responseSources.add(uid);
  responseOptions.push({uid,cardId:Number(card(source.entry).id),name:card(source.entry).name||null,effectId:effect,kind:String(witness.kind||'RESPONSE'),window:declaredWindow,resourceKey:String(witness.sharedBudgetKey||witness.resourceKey||uid),capacityOnly:witness.capacityOnly===true,conditions:clone(witness.conditions||[])});
 }
 const paymentsProvided=Array.isArray(w.payments),payments=paymentsProvided?w.payments:[],invalidPayments=[];
 let lpPaid=paymentsProvided?0:null,discarded=paymentsProvided?0:null,banished=paymentsProvided?0:null,tributed=paymentsProvided?0:null;
 const paid=[];
 for(const value of payments){
  const kind=String(value?.kind||'').toUpperCase(),amount=Number(value?.amount??(value?.uid?1:NaN));
  if(!['LP','DISCARD','BANISH','TRIBUTE','SEND_GY','SEND_HAND','DETACH','REVEAL','FUSION_MATERIAL','FUSION_MATERIAL_RETURN','LINK_MATERIAL','SYNCHRO_MATERIAL','XYZ_MATERIAL','RITUAL_MATERIAL'].includes(kind)||!int(amount,0)||
      ((kind!=='LP')&&!value?.uid&&!value?.cardId)){invalidPayments.push({reason:'PAYMENT_WITNESS_INCOMPLETE',kind});continue;}
  const paidBy=Number(value.player??(value.uid?valid.inventoryBefore.uids.get(String(value.uid))?.owner:undefined)??player);
  if(paidBy===player){if(kind==='LP')lpPaid+=amount;if(kind==='DISCARD')discarded+=amount;if(kind==='BANISH')banished+=amount;if(kind==='TRIBUTE')tributed+=amount;}
  paid.push({kind,amount,player:paidBy,uid:value.uid||null,cardId:value.cardId||null,step:value.step??null});
 }
 if(invalidPayments.length){lpPaid=null;discarded=null;banished=null;tributed=null;}
 const recovery=[],recoverySources=new Set();
 for(const value of arr(w.recovery)){
  const uid=String(value?.uid||value?.sourceUid||'');
  if(!uid||!inventoryAfter.uids.has(uid)||value.available!==true||value.requirementsMet!==true)continue;
  const key=String(value.resourceKey||uid);if(recoverySources.has(key))continue;recoverySources.add(key);
  recovery.push({uid,kind:String(value.kind||'AVAILABLE_FOLLOWUP'),window:String(value.window||'DECLARED_WINDOW'),conditions:clone(value.conditions||[])});
 }
 const locks=arr(w.locks).filter(x=>x&&typeof x==='object'&&x.active===true).map(x=>({key:String(x.key||x.kind||'DECLARED_LOCK'),appliesToPlayer:Number(x.appliesToPlayer??player),until:String(x.until||'DECLARED_DURATION'),description:String(x.description||''),sourceUid:x.sourceUid||null}));
 const ownLocks=locks.filter(x=>x.appliesToPlayer===player);
 const lpBefore=Array.isArray(before.lp)?Number(before.lp[player]):null,lpAfter=Array.isArray(after.lp)?Number(after.lp[player]):null;
 const sourceCounts={};for(const x of responseOptions)sourceCounts[x.resourceKey]=Math.max(sourceCounts[x.resourceKey]||0,1);
 const completeResponseCoverage=w.interruptionCoverageComplete===true,completeRecoveryCoverage=w.recoveryCoverageComplete===true,completeLockCoverage=w.lockCoverageComplete===true;
 const executedProvided=Array.isArray(w.executedResponses),executedResponses=arr(w.executedResponses).filter(x=>x?.executed===true&&x?.resultVerified===true).map(x=>clone(x));
 return{
  state:{turn:after.turn??null,phase:after.phase??null,activePlayer:after.activePlayer??null,player,startingTurn:before.turn??null,startingPhase:before.phase??null,startingActivePlayer:before.activePlayer??null,
   ownLP:finite(lpAfter)?lpAfter:null,opponentLP:Array.isArray(after.lp)&&finite(after.lp[1-player])?after.lp[1-player]:null},
  resources:{handCopies:units('hand'),mainDeckCopies:units('deck'),extraDeckCopies:units('extra'),gyCopies:units('gy'),banishedCopies:units('banished'),fieldMonsters:units('monster'),setSpellTraps:arr(own.spelltrap).filter(x=>x.faceUp===false).length,
   normalSummonUsed:before.normalSummonAvailable?.[player]===true&&after.normalSummonAvailable?.[player]===false,
   handChange:units('hand')-arr(start.hand).reduce((n,x)=>n+(x?.uid?1:qty(x)),0)},
  board:{faceUpMonsters,visibleKnownAttack:visibleAttack,unknownAttackMonsters:unknownAttack},
  responses:{verifiedOptions:responseOptions.length,verifiedSources:responseSources.size,conditionalCapacityOptions:responseOptions.filter(x=>x.capacityOnly).length,
   executedResponses:executedProvided?executedResponses:null,executedResponseCount:executedProvided?executedResponses.length:null,
   resourceGroups:Object.keys(sourceCounts).length,options:responseOptions,invalidWitnesses:invalidResponseWitnesses,coverageComplete:completeResponseCoverage,
   simultaneousResponsesProven:w.jointInterruptionProof?.pass===true&&int(w.jointInterruptionProof.count)?w.jointInterruptionProof.count:null,
   policy:'Options are available only in their declared modeled windows; shared costs can prevent simultaneous use.'},
  costs:{lpPaid,discardedCopies:discarded,banishedAsCost:banished,tributedCopies:tributed,payments:paid,evidenceComplete:paymentsProvided&&!invalidPayments.length,invalidWitnesses:invalidPayments,observedLpChange:finite(lpBefore)&&finite(lpAfter)?lpAfter-lpBefore:null},
  recovery:{availableSources:recoverySources.size,witnesses:recovery,coverageComplete:completeRecoveryCoverage},
  restrictions:{activeOwnLocks:ownLocks.length,locks,coverageComplete:completeLockCoverage},
  comparisonVector:{handCopies:units('hand'),readyResponseSources:completeResponseCoverage?responseSources.size:null,availableRecoverySources:completeRecoveryCoverage?recoverySources.size:null,knownVisibleAttack:unknownAttack?null:visibleAttack,
   lpPaid,discardedCopies:discarded,banishedAsCost:banished,ownLocks:completeLockCoverage?ownLocks.length:null}
 };
}
const MAXIMIZE=['handCopies','readyResponseSources','availableRecoverySources','knownVisibleAttack'];
const MINIMIZE=['lpPaid','discardedCopies','banishedAsCost','ownLocks'];
function dominates(a,b){
 let strictly=false;
 for(const key of [...MAXIMIZE,...MINIMIZE]){
  if(!finite(a[key])||!finite(b[key]))return false;
  const sign=MAXIMIZE.includes(key)?1:-1,d=(a[key]-b[key])*sign;
  if(d<0)return false;if(d>0)strictly=true;
 }
 return strictly;
}
function outcomeSignature(after,player){
 if(typeof W.YGOComboEngine?.outcomeKey==='function')return W.YGOComboEngine.outcomeKey(after);
 const value=clone(after);delete value.events;delete value.provenance;delete value.context;
 return stable(value);
}
function comparisonDomain(line,player){
 const before=line.before||line.openingBefore,after=finalState(line),c=line.context||{};
 const view=x=>({...clone(x),card:undefined,id:Number(card(x).id)});
 const zones=before?.zones?.map((own,p)=>Object.fromEntries(ZONES.map(zone=>{const rows=arr(own?.[zone]).map(view);if(zone!=='deck'||before.deckOrderKnown?.[p]!==true)rows.sort((a,b)=>stable(a).localeCompare(stable(b)));return[zone,rows]})));
 return stable({player,context:Object.fromEntries(['format','banlistVersion','modelBuild','dataVersion','banlistIdentity','formatContextVersion','duelMode','goingSecond','opponentPolicy','responsePolicy','responseTypes','ashPolicy'].filter(key=>c[key]!==undefined).map(key=>[key,c[key]])),
  start:{turn:before?.turn??null,phase:before?.phase??null,activePlayer:before?.activePlayer??null,lp:before?.lp??null,zones,normal:before?.normalSummonAvailable??null,locks:before?.locks||[],used:before?.used||{},pending:before?.pendingTriggers||[],order:before?.deckOrderKnown??null,duel:before?.duel??null,delayedEffects:before?.delayedEffects??null,responseWindows:before?.responseWindows??null,drollWindows:before?.drollWindows??null,extraHistory:before?.extraHistory??null},
  end:{turn:after?.turn??null,phase:after?.phase??null,activePlayer:after?.activePlayer??null}});
}
function evaluateLines({deck,lines,context={}}={}){
 try{
  normalizedMain(deck);const fp=expectedFingerprint(deck,context),accepted=[],rejected=[],outcomes=new Map();
  for(const [index,line] of arr(lines).entries()){
   const checked=validateLine(line,deck,context);
   if(!checked.pass){rejected.push({index,issues:checked.issues});continue;}
   const metrics=boardMetrics(checked),domainKey=comparisonDomain(line,checked.player),signature=domainKey+'|'+outcomeSignature(checked.after,checked.player),entry={index,lineId:line.id||line.index||index+1,scope:String(line.scope||checked.verification.scope||'DECLARED_REPLAY_DOMAIN'),domainKey,metrics,steps:line.actions.length,
    comparisonEvidenceComplete:Object.values(metrics.comparisonVector).every(finite),replayFresh:true,copiesConserved:true,paretoFront:null,dominators:[],equivalentLineIndexes:[],certified:false,globalOptimalityProven:false};
   const prior=outcomes.get(signature);
   if(prior){prior.equivalentLineIndexes.push(index);if(entry.steps<prior.steps){entry.equivalentLineIndexes=[prior.index,...prior.equivalentLineIndexes];accepted[accepted.indexOf(prior)]=entry;outcomes.set(signature,entry);}continue;}
   accepted.push(entry);outcomes.set(signature,entry);
  }
  const domains=[...new Set(accepted.map(x=>x.domainKey))];
  for(const domain of domains){let pending=accepted.filter(x=>x.domainKey===domain&&x.comparisonEvidenceComplete),front=1;
   while(pending.length){const layer=pending.filter(x=>!pending.some(y=>y!==x&&dominates(y.metrics.comparisonVector,x.metrics.comparisonVector)));for(const x of layer)x.paretoFront=front;pending=pending.filter(x=>!layer.includes(x));front++;}}
  for(const x of accepted)x.dominators=accepted.filter(y=>y!==x&&y.domainKey===x.domainKey&&dominates(y.metrics.comparisonVector,x.metrics.comparisonVector)).map(y=>y.index);
  accepted.sort((a,b)=>(a.paretoFront??Infinity)-(b.paretoFront??Infinity)||a.steps-b.steps||a.index-b.index);
  return{schema:'ygo-strategy-observed-lines/v1',pass:accepted.length>0,status:accepted.length?'OBSERVED_LINES_COMPARED':'NO_VERIFIED_LINES',deckFingerprint:fp,context:{format:String(context.format||'tcg'),banlistVersion:String(context.banlistVersion||''),player:Number(context.player??0)},
   inputLines:arr(lines).length,verifiedDistinctOutcomes:accepted.length,rejected,lines:accepted,
   comparison:{method:'PARETO_LAYERS_OF_OBSERVED_REPLAY_OUTCOMES',maximize:MAXIMIZE,minimize:MINIMIZE,evidenceComplete:accepted.every(x=>x.comparisonEvidenceComplete),domains:domains.length,domainPartition:'SAME_PHYSICAL_OPENING_RULE_CONTEXT_AND_FINAL_TURN_PHASE',scalarScore:null,
    meaning:'Front 1 contains outcomes not dominated on every documented metric by another observed outcome. It does not prove best play or win rate.'},
   coverage:{verifiedLines:accepted.length,rejectedLines:rejected.length,unrankableForMissingEvidence:accepted.filter(x=>!x.comparisonEvidenceComplete).length,scopeComplete:false},
   competitiveScore:null,winRate:null,certified:false,globalOptimalityProven:false};
 }catch(e){return{schema:'ygo-strategy-observed-lines/v1',pass:false,status:'INVALID_ANALYSIS_INPUT',issues:[String(e?.message||e)],lines:[],competitiveScore:null,winRate:null,certified:false,globalOptimalityProven:false};}
}
const binomialCache=new Map();
function choose(n,k){if(!int(n,0,60)||!int(k,0,60)||k>n)return 0n;k=Math.min(k,n-k);const key=n+','+k;if(binomialCache.has(key))return binomialCache.get(key);let value=1n;for(let j=1;j<=k;j++)value=value*BigInt(n-k+j)/BigInt(j);binomialCache.set(key,value);return value;}
function exactHandEvent(options={}){
 const invalid=(status,issues)=>({schema:'ygo-hand-event/v1',pass:false,status,probability:null,issues,comboSuccessProven:false});
 try{
  const deck=normalizedMain(options.deck),H=Number(options.handSize??5);
  if(!int(H,0,7)||H>deck.total)return invalid('INVALID_HAND_SIZE',['Hand size must be 0–7 and no larger than the Main Deck.']);
  if(!Array.isArray(options.groups)||options.groups.length>8)return invalid('INVALID_GROUPS',['Provide at most eight card-ID groups.']);
  const names=new Set(),groups=options.groups.map((g,index)=>{
   const id=String(g?.id||'group-'+(index+1));if(names.has(id))throw Error('DUPLICATE_GROUP_ID');names.add(id);
   if(!Array.isArray(g.cardIds))throw Error('CARD_ID_ARRAY_REQUIRED');
   const ids=new Set(g.cardIds.map(normalId)),min=Number(g.min??1),max=g.max===undefined?H:Number(g.max);
   if(!int(min,0,7)||!int(max,0,7)||min>max)throw Error('INVALID_GROUP_CONSTRAINT');
   return{id,ids,min,max,explicitMax:g.max!==undefined&&max<H};
  });
  const buckets=new Map();for(const row of deck.rows){let mask=0;groups.forEach((g,i)=>{if(g.ids.has(String(row.id)))mask|=1<<i});buckets.set(mask,(buckets.get(mask)||0)+row.qty);}
  const dimensions=groups.map((g,i)=>({mask:1<<i,mode:g.explicitMax?'max':'min',target:g.explicitMax?g.max:g.min,minimum:g.min}));
  if(options.distinctResources===true){
   const active=groups.map((g,i)=>({g,i})).filter(x=>x.g.min>0);
   if(active.length>5)return invalid('EXACT_COMPLEXITY_LIMIT',['Distinct-resource allocation supports at most five positive-demand groups.']);
   for(let subset=1;subset<(1<<active.length);subset++){
    let mask=0,demand=0,count=0;active.forEach((x,i)=>{if(subset&(1<<i)){mask|=1<<x.i;demand+=x.g.min;count++;}});
    if(count<2)continue;
    dimensions.push({mask,mode:'min',target:demand,minimum:demand});
   }
  }
  const denominator=choose(deck.total,H),metadata={deckCopies:deck.total,handSize:H,groups:groups.map(g=>({id:g.id,cardIds:[...g.ids].map(Number),min:g.min,max:g.max})),distinctResources:options.distinctResources===true,
   accessEventOnly:true,physicalDeckLegalityVerified:false,comboSuccessProven:false,
   algorithm:'EXACT_MEMBERSHIP_MASK_MULTIVARIATE_HYPERGEOMETRIC_DP',totalWays:denominator.toString()};
  for(const d of dimensions){let available=0;for(const [mask,n] of buckets)if(mask&d.mask)available+=n;if(available<d.minimum||d.minimum>H)return{schema:'ygo-hand-event/v1',pass:true,status:'EXACT',probability:0,favorableWays:'0',states:1,transitions:0,...metadata};}
  const maxStates=Math.max(10,Math.min(100000,Number(options.maxStates)||100000)),maxTransitions=Math.max(10,Math.min(2000000,Number(options.maxTransitions)||2000000));
  let states=new Map([['0|'+dimensions.map(()=>0).join(','),{used:0,counts:dimensions.map(()=>0),ways:1n}]]),visited=1,transitions=0;
  for(const [mask,n] of [...buckets].filter(([mask])=>mask!==0)){
   const next=new Map();
   for(const value of states.values())for(let x=0;x<=Math.min(n,H-value.used);x++){
    if(++transitions>maxTransitions)return{...invalid('EXACT_COMPLEXITY_LIMIT',['Transition budget exhausted; no partial probability is labeled exact.']),...metadata,states:visited,transitions};
    let rejected=false;const counts=value.counts.map((count,i)=>{const d=dimensions[i],v=count+((mask&d.mask)?x:0);if(d.mode==='max'&&v>d.target)rejected=true;return d.mode==='min'?Math.min(d.target,v):v;});
    if(rejected)continue;
    const used=value.used+x,key=used+'|'+counts.join(','),old=next.get(key),ways=value.ways*choose(n,x);
    if(old)old.ways+=ways;else next.set(key,{used,counts,ways});
    if(next.size>maxStates)return{...invalid('EXACT_COMPLEXITY_LIMIT',['State budget exhausted; no partial probability is labeled exact.']),...metadata,states:visited+next.size,transitions};
   }
   visited+=next.size;states=next;
  }
  let numerator=0n;const others=buckets.get(0)||0;
  for(const state of states.values())if(state.counts.every((n,i)=>n>=dimensions[i].minimum))numerator+=state.ways*choose(others,H-state.used);
  if(numerator>denominator)throw Error('INTERNAL_EVENT_WEIGHT_OVERFLOW');
  return{schema:'ygo-hand-event/v1',pass:true,status:'EXACT',probability:Number(numerator)/Number(denominator),favorableWays:numerator.toString(),states:visited,transitions,...metadata,
   interpretation:options.distinctResources?'Each positive group demand is assigned a distinct physical card; this still does not prove a legal combo.':'One physical card in an overlap can satisfy several access conditions; no distinct resource allocation is implied.'};
 }catch(e){return invalid('INVALID_EVENT_INPUT',[String(e?.message||e)]);}
}
function wilson(hits,n){if(!n)return{low:null,high:null,method:'WILSON_95'};const z=1.959963984540054,p=hits/n,d=1+z*z/n,mid=(p+z*z/(2*n))/d,delta=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d;return{low:Math.max(0,mid-delta),high:Math.min(1,mid+delta),method:'WILSON_95'};}
function seeded(seed){let hash=2166136261;for(const c of String(seed)){hash^=c.charCodeAt(0);hash=Math.imul(hash,16777619);}let n=hash>>>0;return()=>{n=(n+0x6D2B79F5)|0;let t=Math.imul(n^(n>>>15),1|n);t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296};}
function asyncBounded(call,timeoutMs,signal){return new Promise(resolve=>{let done=false,timer;const finish=value=>{if(done)return;done=true;clearTimeout(timer);signal?.removeEventListener?.('abort',abort);resolve(value);};const abort=()=>finish({kind:'CANCELLED'});if(signal?.aborted)return abort();signal?.addEventListener?.('abort',abort,{once:true});timer=setTimeout(()=>finish({kind:'TIMEOUT'}),timeoutMs);Promise.resolve().then(call).then(value=>finish({kind:'VALUE',value}),error=>finish({kind:'ERROR',error:String(error?.message||error)}));});}
async function simulateHands(options={}){
 const fail=(status,issues)=>({schema:'ygo-simulated-hand-event/v1',pass:false,status,issues,competitiveScore:null,winRate:null,globalOptimalityProven:false});
 try{
  const normalized=normalizedMain(options.deck),H=Number(options.handSize??5),trials=Number(options.trials??500);
  if(!int(H,1,7)||H>normalized.total||!int(trials,1,10000))return fail('INVALID_SAMPLE_REQUEST',['Hand size must be 1–7; trials 1–10000.']);
  if(typeof options.simulateHand!=='function')return fail('SIMULATION_CALLBACK_REQUIRED',['Provide a bounded, cancelable simulator.']);
  const context={...(options.context||{})},verify=options.verifyLine||context.verifyLine;
  if(typeof verify!=='function'&&typeof verifierFor(context)!=='function')return fail('REPLAY_VERIFIER_REQUIRED',['Successful lines require fresh replay.']);
  context.verifyLine=verify||verifierFor(context);context.deckFingerprint=expectedFingerprint(options.deck,context);
  const deck=normalized.rows.flatMap(r=>Array.from({length:r.qty},(_,i)=>({...r.card,id:r.id,qty:1,physicalCopyIndex:i})));
  const seed=String(options.seed??'ygo-strategy-hand-sampling-v1'),random=seeded(seed),start=now(),maxMs=Math.max(100,Math.min(120000,Number(options.maxMs)||30000)),perTrialMs=Math.max(100,Math.min(5000,Number(options.perTrialMs)||2500));
  const goal=typeof options.goal==='function'?options.goal:line=>line.actions.length>0,event={id:String(options.event?.id||'SUPPORTED_LEGAL_LINE'),label:String(options.event?.label||'At least one replay-verified supported line'),definition:String(options.event?.definition||'A distinct line accepted by fresh replay from the sampled physical hand.')};
  let successes=0,failures=0,unknown=0,status='COMPLETE',completed=0;const unknownReasons={},rows=[];
  for(let sampleIndex=0;sampleIndex<trials;sampleIndex++){
   if(options.signal?.aborted){status='CANCELLED';break;}if(now()-start>=maxMs){status='TIME_BUDGET_REACHED';break;}
   const shuffled=deck.slice();for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
   const sample={hand:clone(shuffled.slice(0,H)),remainingDeck:clone(shuffled.slice(H)),sampleIndex,seed,context,signal:options.signal};
   const outcome=await asyncBounded(()=>options.simulateHand(sample),Math.min(perTrialMs,Math.max(1,maxMs-(now()-start))),options.signal);
   if(outcome.kind==='CANCELLED'){status='CANCELLED';break;}
   let classification='UNKNOWN',reason=null,lineCount=0;
   if(outcome.kind==='VALUE'){
    const result=outcome.value,lines=arr(result?.lines||result?.candidates),rejected=[];let matched=false;
    for(const line of lines){const checked=validateLine(line,options.deck,{...context,expectedHand:sample.hand});if(!checked.pass){rejected.push(...checked.issues);continue;}lineCount++;if(goal(line,checked.verification)===true){matched=true;break;}}
    if(matched){classification='VERIFIED_SUCCESS';successes++;}
    else if(typeof options.verifyFailure==='function'&&result?.enumerationComplete===true&&result?.truncated!==true&&!arr(result?.unsupported).length){
     let proof;try{proof=await options.verifyFailure(result,sample);}catch(e){proof={pass:false,error:String(e?.message||e)};}
     if(proof?.pass===true&&proof?.coverageComplete===true){classification='VERIFIED_FAILURE';failures++;}else reason='NEGATIVE_OUTCOME_NOT_PROVEN';
    }else reason=rejected.length?'REPLAY_OR_HAND_PROVENANCE_REJECTED':result?.truncated?'TRUNCATED_SEARCH':arr(result?.unsupported).length?'UNSUPPORTED_ACTIONS':'NEGATIVE_OUTCOME_NOT_PROVEN';
   }else reason=outcome.kind==='TIMEOUT'?'TRIAL_TIMEOUT':'SIMULATOR_ERROR';
   if(classification==='UNKNOWN'){unknown++;unknownReasons[reason]=(unknownReasons[reason]||0)+1;}
   completed++;if(rows.length<100)rows.push({sampleIndex,classification,reason,verifiedLines:lineCount,hand:sample.hand.map(c=>c.id)});
   try{options.onProgress?.({completed,trials,verifiedSuccesses:successes,verifiedFailures:failures,unknown})}catch(_){}
   if(completed%4===0)await new Promise(resolve=>setTimeout(resolve,0));
  }
  const low=completed?successes/completed:null,high=completed?(successes+unknown)/completed:null,ciLow=wilson(successes,completed),ciHigh=wilson(successes+unknown,completed);
  return{schema:'ygo-simulated-hand-event/v1',pass:completed>0,status:status==='COMPLETE'?(unknown?'COMPLETE_WITH_UNKNOWN_OUTCOMES':'COMPLETE_VERIFIED_SAMPLING'):status,
   event,seed,requestedTrials:trials,completedTrials:completed,verifiedSuccesses:successes,verifiedFailures:failures,unknown,unknownReasons,
   probability:completed>0&&unknown===0?low:null,identificationInterval:{low,high},confidence95:{low:ciLow.low,high:ciHigh.high,method:'CONSERVATIVE_WILSON_BOUNDS_WITH_UNKNOWN_OUTCOMES'},
   rows,deckFingerprint:context.deckFingerprint,handSize:H,elapsedMs:Math.round(now()-start),physicalCopies:normalized.total,coverage:completed?(successes+failures)/completed:null,
   limitations:['Unknown, unsupported and truncated samples remain in the denominator.','The event applies to this simulator and its declared scope, not all legal game lines.','Cancellation or time-budget stopping can affect nominal confidence-interval interpretation.'],
   competitiveScore:null,winRate:null,certified:false,globalOptimalityProven:false};
 }catch(e){return fail('SIMULATION_INPUT_OR_EXECUTION_ERROR',[String(e?.message||e)]);}
}
W.YGOStrategy=Object.freeze({version:'observed-replay-strategy-v2',evaluateLines,exactHandEvent,simulateHands,fingerprint,wilson});
})();

/* Bounded, replayable opening setup. This deliberately small rules domain is
 * separate from the experimental universal effect enumerator. */
(()=>{
'use strict';
const W=window,S=W.YGOStable=W.YGOStable||{};
const ZONES=['deck','extra','hand','monster','spelltrap','gy','banished','field','pendulum'];
const SCOPE='TCG_OPENING_NORMAL_MONSTER_AND_SET_WITH_PASSING_OPPONENT';
const ACTIONS=['NORMAL_SUMMON','NORMAL_SET','SET_SPELL_TRAP'];
const clone=x=>structuredClone(x),arr=x=>Array.isArray(x)?x:[],card=x=>x?.card||x;
const fingerprint=()=>JSON.stringify([String(W.YGOAlpha973?.activeFormatKey?.()||'tcg').toLowerCase(),['main','extra','side'].map(z=>arr(W.deckState?.[z]).map(c=>[String(c.id??c.cardId??c.name),Number(c.qty??1)]))]);
const phase=x=>String(x||'').toUpperCase().replace(/\s+/g,'');
const fail=(status,issues=[])=>({status,pass:false,executionSucceeded:false,scope:SCOPE,certified:false,globalOptimalityProven:false,candidates:[],candidateCount:0,issues});
const identity=s=>{
 if(!s||!Array.isArray(s.zones)||s.zones.length!==2)throw Error('STATE_ZONES_INVALID');
 const rows=[],seen=new Set();
 for(let p=0;p<2;p++)for(const z of ZONES){
  if(s.zones[p]?.[z]!==undefined&&!Array.isArray(s.zones[p][z]))throw Error('STATE_ZONE_INVALID');
  for(const x of arr(s.zones[p]?.[z])){
   const c=card(x),uid=String(x?.uid||'');
   if(!uid||seen.has(uid)||!Number.isSafeInteger(Number(c?.id))||Number(c.id)<=0)throw Error('STATE_CARD_IDENTITY_INVALID');
   seen.add(uid);rows.push([uid,String(c.id),Number(x.ownerPlayer??x.owner??p)]);
  }
 }
 return JSON.stringify(rows.sort((a,b)=>a[0].localeCompare(b[0])));
};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function available(st){
 if(st?.activePlayer!==0||!['MAIN1','MAIN2'].includes(phase(st.phase))||arr(st.chain).length||
    arr(st.pendingTriggers).length||arr(st.triggerQueue).length||arr(st.continuousEffects).length||arr(st.replacementEffects).length)return [];
 const own=st.zones[0],out=[];
 for(const x of arr(own.hand)){
  const c=card(x),bits=Number(c.typeBits),uid=String(x.uid||''),level=Number(c.level);
  if(!Number.isSafeInteger(bits)||!uid||/unofficial|skills|deckmaster/i.test(String(c.source||'')))continue;
  if((bits&1)&&(bits&16)&&!(bits&(0x4000|0x1000000|0x2000000|0x4000000|0x800000|0x2000|0x40|0x80))&&
      Number.isSafeInteger(level)&&level>=1&&level<=4&&c.statsKnown!==false&&
      st.normalSummonAvailable?.[0]===true&&arr(own.monster).length<5){
   out.push({type:'NORMAL_SUMMON',uid},{type:'NORMAL_SET',uid});
  }
  if((bits&6)&&!(bits&1)&&!(bits&0x80000)&&arr(own.spelltrap).length<5&&
      !/cannot be set|can't be set/i.test(String(c.desc||'')))out.push({type:'SET_SPELL_TRAP',uid});
 }
 return out;
}
function execute(before,action){
 if(!action||!ACTIONS.includes(action.type))return {pass:false,status:'ACTION_NOT_SUPPORTED'};
 const accepted=available(before).some(x=>x.type===action.type&&x.uid===action.uid);
 if(!accepted)return {pass:false,status:'ACTION_PRECONDITION_FAILED'};
 const initial=identity(before),after=clone(before),z=after.zones[0],index=z.hand.findIndex(x=>x.uid===action.uid);
 const [x]=z.hand.splice(index,1);x.previousZone='hand';x.locationHistory=[...arr(x.locationHistory),action.type==='SET_SPELL_TRAP'?'spelltrap':'monster'];
 if(action.type==='SET_SPELL_TRAP'){
  x.faceUp=false;x.position='SET';x.setTurn=after.turn;z.spelltrap.push(x);
 }else{
  x.faceUp=action.type==='NORMAL_SUMMON';x.position=x.faceUp?'ATTACK':'DEFENSE';
  x.summonType=action.type==='NORMAL_SUMMON'?'NORMAL':null;x.summonTurn=after.turn;x.summonPlayer=0;x.wasSummoned=action.type==='NORMAL_SUMMON';
  z.monster.push(x);after.normalSummonAvailable[0]=false;
  if(Object.prototype.hasOwnProperty.call(after,'normalSummonsUsed')){
   if(after.normalSummonsUsed!==0)return {pass:false,status:'NORMAL_SUMMON_COUNTER_INVALID'};
   after.normalSummonsUsed=1;
  }
 }
 if(identity(after)!==initial)throw Error('COPY_CONSERVATION_FAILED');
 return {pass:true,status:'SUPPORTED_TRANSITION_VERIFIED',after,proof:{scope:SCOPE,type:action.type,uid:action.uid,
  cardId:Number(card(x).id),name:card(x).name,costs:[],targets:[],copiesConserved:true,
  normalSummonConsumed:action.type!=='SET_SPELL_TRAP',lpUnchanged:same(before.lp,after.lp),chainUnchanged:same(before.chain,after.chain)}};
}
function replay(line){
 try{
  if(line?.scope!==SCOPE||line?.assumptions?.opponentPolicy!=='PASS'||line?.assumptions?.effectResolution!=='NONE')return {pass:false,status:'SCOPE_REQUIRED'};
  if(!line.before||!Array.isArray(line.actions)||!line.actions.length||line.actions.length>5)return {pass:false,status:'TRACE_INVALID'};
  if(typeof line.deckFingerprint!=='string'||line.deckFingerprint!==fingerprint())return {pass:false,status:'STALE_DECK'};
  if(!Number.isInteger(line.openingSample)||line.openingSample<0||line.openingSample>9)return {pass:false,status:'OPENING_SAMPLE_INVALID'};
  const expectedOpening=W.YGOAlpha655?.openingState655?.(line.openingSample);
  if(!expectedOpening||!same(expectedOpening,line.before))return {pass:false,status:'OPENING_PROVENANCE_MISMATCH'};
  let state=clone(line.before);identity(state);
  const rows=[];
  for(let i=0;i<line.actions.length;i++){
   const a=line.actions[i];
   if(!same(a.before,state))return {pass:false,status:'BEFORE_STATE_MISMATCH',step:i+1};
   const result=execute(state,a);
   if(!result.pass||!same(result.after,a.after)||!same(result.proof,a.proof))return {pass:false,status:'TRANSITION_REPLAY_FAILED',step:i+1};
   rows.push(result.proof);state=result.after;
  }
  if(!same(state,line.state))return {pass:false,status:'FINAL_STATE_MISMATCH'};
  return {pass:true,status:'SUPPORTED_SCOPE_REPLAY_VALID',scope:SCOPE,copiesConserved:true,steps:rows.length,rows,certified:false,globalOptimalityProven:false};
 }catch(e){return {pass:false,status:'REPLAY_INVALID',error:String(e?.message||e)}}
}
const outcome=s=>JSON.stringify({monsters:arr(s.zones[0].monster).map(x=>[card(x).id,x.faceUp,x.position]).sort(),sets:arr(s.zones[0].spelltrap).map(x=>card(x).id).sort(),remaining:arr(s.zones[0].hand).map(x=>card(x).id).sort(),normal:s.normalSummonAvailable?.[0]});
const objective=s=>({faceUpAtk:arr(s.zones[0].monster).reduce((n,x)=>n+(x.faceUp===true?Math.max(0,Number(card(x).atk)||0):0),0),setCards:arr(s.zones[0].spelltrap).length,monsters:arr(s.zones[0].monster).length,remainingHand:arr(s.zones[0].hand).length});
let serial=0,active=null;
async function search(opts={}){
 if(opts.opponentPolicy!=='PASS')return fail('EXPLICIT_PASSING_OPPONENT_REQUIRED',['Este modo supone que el rival pasa y no resuelve efectos; debe elegirse expresamente.']);
 if(active)return fail('SEARCH_ALREADY_RUNNING');
 const fmt=String(W.YGOAlpha973?.activeFormatKey?.()||'tcg').toLowerCase();
 if(fmt!=='tcg')return fail('FORMAT_NOT_SUPPORTED',['El modo de preparación verificado está limitado a TCG.']);
 const physical=W.YGOAlpha1263?.physicalLegality1050?.(W.deckState);
 if(physical?.physicalValid!==true||Number(physical.unknownCopies)!==0)return fail('DECK_STRUCTURE_INVALID',arr(physical?.errors));
 const poolAudit=W.YGODataCatalog?.auditDeck?.(W.deckState,{format:'tcg',banlist:W.BANLIST_PROFILES?.tcg?.data});
 if(poolAudit&&arr(poolAudit.errors).length)return fail('DECK_OUTSIDE_SUPPORTED_POOL',poolAudit.errors);
 const restrictions=W.YGOAlpha1263?.restrictionSnapshot1126?.(W.deckState,'tcg');
 if(arr(restrictions?.violations).length)return fail('DECK_RESTRICTED_BY_SNAPSHOT',restrictions.violations);
 const ownFp=fingerprint(),sample=Math.max(0,Math.min(9,Math.trunc(Number(opts.sample)||0))),runId=++serial;
 const maxDepth=Math.max(1,Math.min(5,Math.trunc(Number(opts.maxDepth)||3))),maxStates=Math.max(10,Math.min(2000,Math.trunc(Number(opts.maxStates)||250))),maxMs=Math.max(100,Math.min(10000,Number(opts.maxMs)||1800));
 const started=performance.now(),job={runId,cancelled:false};active=job;
 try{
  const before=W.YGOAlpha655?.openingState655?.(sample);
  if(!before||arr(before.zones?.[0]?.hand).length!==5)return fail('OPENING_UNAVAILABLE');
  if(arr(before.zones[0].monster).length||arr(before.zones[0].spelltrap).length)return fail('EMPTY_OWN_FIELD_REQUIRED');
  identity(before);
  const opening=clone(before),queue=[{state:opening,actions:[]}],seen=new Set([outcome(opening)]),finals=new Map();let expanded=0,truncated=false;
  while(queue.length){
   if(job.cancelled||opts.signal?.aborted)return {...fail('CANCELLED'),runId};
   if(fingerprint()!==ownFp)return {...fail('STALE_DECK_CANCELLED'),runId};
   if(String(W.YGOAlpha973?.activeFormatKey?.()||'tcg').toLowerCase()!==fmt)return {...fail('STALE_FORMAT_CANCELLED'),runId};
   if(expanded>=maxStates||performance.now()-started>maxMs){truncated=true;break}
   const node=queue.shift();expanded++;
   if(node.actions.length)finals.set(outcome(node.state),node);
   if(node.actions.length>=maxDepth)continue;
   for(const action of available(node.state)){
    const r=execute(node.state,action);if(!r.pass)continue;
    const key=outcome(r.after);if(seen.has(key))continue;seen.add(key);
    const c=card(node.state.zones[0].hand.find(x=>x.uid===action.uid));
    const a={...action,name:c.name,cardId:Number(c.id),before:clone(node.state),after:clone(r.after),proof:r.proof};
    queue.push({state:r.after,actions:[...node.actions,a]});
   }
   if(expanded%8===0)await new Promise(resolve=>setTimeout(resolve,0));
  }
  const nodes=[...finals.values()].sort((a,b)=>{const x=objective(a.state),y=objective(b.state);return y.faceUpAtk-x.faceUpAtk||y.setCards-x.setCards||y.monsters-x.monsters||a.actions.length-b.actions.length});
  const candidates=nodes.slice(0,5).map((n,i)=>({index:i+1,scope:SCOPE,before:clone(opening),state:n.state,actions:n.actions,openingSample:sample,deckFingerprint:ownFp,
   assumptions:{opponentPolicy:'PASS',effectResolution:'NONE',startingField:'EMPTY',phase:'MAIN 1'},objective:objective(n.state),certified:false,globalOptimalityProven:false}));
  for(const line of candidates){line.replay=replay(line);if(!line.replay.pass)throw Error('FINAL_REPLAY_REJECTED')}
  return {status:candidates.length?'SUPPORTED_SCOPE_CANDIDATES':'NO_SUPPORTED_ACTIONS',pass:true,executionSucceeded:true,runId,scope:SCOPE,candidates,candidateCount:candidates.length,
   sample,expanded,distinctOutcomes:finals.size,truncated,enumerationComplete:!truncated,limits:{maxDepth,maxStates,maxMs},elapsedMs:Math.round(performance.now()-started),
   objective:'ATK de monstruos Normales boca arriba, después número de cartas colocadas; no es una evaluación competitiva.',
   unsupported:['Resolución de efectos','Respuestas del rival','Invocaciones Especiales','Combate'],certified:false,globalOptimalityProven:false};
 }catch(e){return {...fail('SEARCH_FAILED',[String(e?.message||e)]),runId}}
 finally{if(active===job)active=null}
}
S.searchSupported=search;S.replaySupported=replay;S.executeSupported=execute;
S.cancelSupportedSearch=()=>{if(active){active.cancelled=true;return true}return false};
S.supportedSearchScope={id:SCOPE,actions:[...ACTIONS],formats:['TCG'],requiresExplicitPassingOpponent:true,effectResolution:false};

const text=(tag,value)=>{const e=document.createElement(tag);e.textContent=String(value);return e};
let displayed=null,displayedFormat=null;
function mount(){
 if(document.getElementById('ygoSupportedSearch'))return;
 const host=document.getElementById('comboWorkbench');if(!host)return;
 const panel=document.createElement('section');panel.id='ygoSupportedSearch';panel.className='box';panel.style.cssText='padding:12px;margin:10px 0;';
 panel.append(text('h3','Preparación inicial con replay verificable · TCG'));
 panel.append(text('p','Explora Invocación/Colocación Normal de monstruos Normales de nivel 1–4 y colocación de Mágicas/Trampas. No resuelve efectos, combate ni Invocaciones Especiales. Las cinco cartas se muestrean de tu Main real.'));
 const assumptions=document.createElement('label');assumptions.style.cssText='display:flex;gap:8px;align-items:center;';
 const pass=document.createElement('input');pass.type='checkbox';pass.id='ygoSupportedPass';pass.style.cssText='width:auto;height:auto;';
 assumptions.append(pass,text('span','Elegir escenario: el rival pasa y no se resuelven efectos automáticos.'));panel.append(assumptions);
 const controls=document.createElement('div');controls.style.cssText='display:flex;gap:8px;flex-wrap:wrap;align-items:center;';
 const sample=document.createElement('select');sample.id='ygoSupportedSample';sample.style.width='auto';sample.setAttribute('aria-label','Muestra de mano inicial');
 for(let n=0;n<10;n++){const o=text('option','Mano de muestra '+(n+1));o.value=String(n);sample.append(o)}
 const depth=document.createElement('select');depth.id='ygoSupportedDepth';depth.style.width='auto';depth.setAttribute('aria-label','Máximo de acciones');
 for(let n=1;n<=5;n++){const o=text('option',n+' acción'+(n===1?'':'es'));o.value=String(n);o.selected=n===3;depth.append(o)}
 const start=text('button','EXPLORAR PREPARACIONES');start.id='ygoSupportedStart';start.type='button';start.className='adv-btn gold';
 const stop=text('button','DETENER');stop.id='ygoSupportedStop';stop.type='button';stop.className='adv-btn red';stop.disabled=true;
 const download=text('button','EXPORTAR TRAZAS JSON');download.type='button';download.className='adv-btn';download.disabled=true;
 controls.append(sample,depth,start,stop,download);panel.append(controls);
 const status=text('p','Elige explícitamente el escenario para comenzar. Pueden existir menos de cinco resultados.');status.id='ygoSupportedStatus';status.setAttribute('role','status');status.setAttribute('aria-live','polite');panel.append(status);
 const results=document.createElement('div');results.id='ygoSupportedResults';panel.append(results);
 const invalidate=()=>{if(!displayed)return;const currentFormat=String(W.YGOAlpha973?.activeFormatKey?.()||'tcg').toLowerCase();if(displayed.deckFingerprint!==fingerprint()||currentFormat!==displayedFormat){displayed=null;download.disabled=true;S.cancelSupportedSearch();results.replaceChildren();status.textContent='Las trazas anteriores se invalidaron al cambiar la baraja o el formato.'}};
 W.addEventListener('ygo-ui-state-updated',invalidate);
 stop.addEventListener('click',()=>{S.cancelSupportedSearch();status.textContent='Cancelación solicitada…'});
 start.addEventListener('click',async()=>{
  if(!pass.checked){status.textContent='Debes elegir explícitamente que el rival pasa y que no se resolverán efectos automáticos.';pass.focus();return}
  start.disabled=true;stop.disabled=false;download.disabled=true;results.replaceChildren();status.textContent='Explorando estados y comprobando cada replay…';
  try{
   const result=await search({opponentPolicy:'PASS',sample:Number(sample.value),maxDepth:Number(depth.value),maxStates:300,maxMs:2000});
   S.lastSupportedSearch=result;
   if(!result.executionSucceeded){status.textContent='No se pudo explorar: '+result.status+(result.issues?.length?' · '+result.issues.map(x=>typeof x==='string'?x:JSON.stringify(x)).join('; '):'');displayed=null;return}
   displayed={...result,deckFingerprint:fingerprint()};displayedFormat=String(W.YGOAlpha973?.activeFormatKey?.()||'tcg').toLowerCase();download.disabled=!result.candidateCount;
   status.textContent=result.candidateCount+' preparación(es) distintas con replay válido; '+result.expanded+' estados examinados; '+(result.truncated?'búsqueda truncada por límites.':'dominio de acciones agotado hasta la profundidad elegida.')+' No acredita el óptimo global ni la fuerza competitiva.';
   for(const line of result.candidates){
    const d=document.createElement('details');d.style.cssText='margin:8px 0;padding:8px;border:1px solid #1780aa;border-radius:8px;';
    d.append(text('summary','Preparación '+line.index+' · ATK visible '+line.objective.faceUpAtk+' · '+line.objective.setCards+' Mágicas/Trampas colocadas'));
    d.append(text('p','Mano inicial: '+line.before.zones[0].hand.map(x=>card(x).name).join(' · ')));
    const steps=document.createElement('ol');
    const labels={NORMAL_SUMMON:'Invocación Normal en ataque',NORMAL_SET:'Colocación Normal en defensa',SET_SPELL_TRAP:'Colocar Mágica/Trampa'};
    for(const a of line.actions)steps.append(text('li',labels[a.type]+': '+a.name+' · sin costes ni objetivos · copias conservadas'));
    d.append(steps);
    d.append(text('p','Campo final: '+(line.state.zones[0].monster.map(x=>card(x).name+(x.faceUp?' (ataque)':' (defensa boca abajo)')).join(' · ')||'sin monstruos')+'. Mano restante: '+line.state.zones[0].hand.length+'.'));
    const check=text('button','VOLVER A VERIFICAR REPLAY');check.type='button';check.className='adv-btn';const proof=text('span',' Replay válido dentro del alcance declarado.');
    check.addEventListener('click',()=>{invalidate();if(!displayed){proof.textContent=' Baraja o formato cambiados: vuelve a buscar.';return}const r=replay(line);proof.textContent=r.pass?' Replay comprobado: '+r.steps+' pasos, copias y recursos conservados.':' Replay rechazado: '+r.status});
    d.append(check,proof);results.append(d);
   }
   if(!result.candidateCount)results.append(text('p','La mano muestreada no tiene acciones de este subconjunto. Esto no implica que el mazo carezca de combos: los efectos y las Invocaciones Especiales se exploran en sus escenarios específicos.'));
  }catch(error){status.textContent='Error: '+String(error?.message||error)}finally{start.disabled=false;stop.disabled=true}
 });
 download.addEventListener('click',()=>{invalidate();if(!displayed)return;const b=new Blob([JSON.stringify(displayed,null,2)],{type:'application/json'}),url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download='preparaciones-verificables-yugioh.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),500)});
 host.querySelector('.combo-toolbar')?.after(panel);
 const old=host.querySelector('button[onclick*="autoAnalyzeAllCombos"]');
 const focus=()=>{panel.scrollIntoView({behavior:'smooth',block:'center'});if(!pass.checked){status.textContent='Elige el escenario con rival que pasa; después pulsa EXPLORAR PREPARACIONES.';pass.focus()}else start.click()};
 if(old){old.removeAttribute('onclick');old.textContent='EXPLORAR PREPARACIÓN VERIFICABLE';old.title='Modo TCG acotado, con supuestos explícitos';old.addEventListener('click',focus)}
 W.autoAnalyzeAllCombos=focus;
}
S.mountSupportedSearch=mount;
Promise.resolve(W.__YGO_ENGINE_READY).then(()=>setTimeout(mount,30));
})();

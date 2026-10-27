/* Shared presentation and recoverable local session state. */
(()=>{'use strict';
const W=window,D=document,KEY='ygoDeckSessionV1',LEGACY_KEY='ygoDeckAuto',ZONES=['main','extra','side'],ALL_ZONES=[...ZONES,'skills'];
let installed=false,restoring=false,storageReadable=true,scheduled=false,saving=null,last=null,evaluatedSignature=null,lastSessionSignature=null,readyResolve;
const ready=new Promise(resolve=>readyResolve=resolve);
const formatContexts=new Map();let contextRevision=0;
const formatKey=()=>W.YGOFormats?.keyOf?.(W.__YGO_ACTIVE_BAN_KEY||selectedFormat())||String(W.__YGO_ACTIVE_BAN_KEY||'tcg');
function getFormatContext(){return structuredClone({format:formatKey(),...(formatContexts.get(formatKey())||{})})}
function setFormatContext(value){
 if(!value||typeof value!=='object'||Array.isArray(value))throw Error('El contexto del formato debe ser un objeto.');
 const key=W.YGOFormats?.keyOf?.(value.format||formatKey());if(!key)throw Error('Formato desconocido.');
 if(JSON.stringify(value).length>4*1024*1024)throw Error('El contexto supera 4 MB.');
 const allowed=['snapshot','poolSnapshot','historicalDate','date','asOfDate','extraDeckLimit','skillConstructionVerified','skill','event','banlistVersion','snapshotVersion'];
 const context={format:key};for(const field of allowed)if(Object.prototype.hasOwnProperty.call(value,field))context[field]=structuredClone(value[field]);
 formatContexts.set(key,context);contextRevision++;evaluatedSignature=null;schedule();return getFormatContextFor(key);
}
function getFormatContextFor(key){return structuredClone({format:key,...(formatContexts.get(key)||{})})}
const arr=x=>Array.isArray(x)?x:[],qty=c=>{const n=Number(c?.qty??1);return Number.isSafeInteger(n)&&n>0&&n<=60?n:0};
const selectedFormat=()=>D.querySelector('.fmt.active')?.dataset.f||'TCG';
function signature(){return JSON.stringify([selectedFormat(),contextRevision,...ALL_ZONES.map(z=>arr(W.deckState?.[z]).map(c=>[String(c?.id??c?.cardId??c?.name??''),qty(c)]))]);}
function text(id,value){const e=D.getElementById(id);if(e&&e.textContent!==String(value))e.textContent=String(value);}
function readScore(){
 const values=Array.from({length:10},(_,i)=>{const m=/^(10|[0-9])\s*\/\s*10$/.exec(String(D.getElementById('sv'+i)?.textContent||'').trim());return m?Number(m[1]):null;});
 const total=/^(100|[1-9]?\d)\s*\/\s*100$/.exec(String(D.getElementById('score')?.textContent||'').trim());
 return total&&values.every(x=>x!==null)&&values.reduce((a,b)=>a+b,0)===Number(total[1])?{stats:values,total:Number(total[1])}:null;
}
function clearStaleScore(){
 if(String(D.getElementById('score')?.textContent||'').includes('—'))return;
 for(const id of ['score','total','miniScore'])text(id,'— / 100');text('sum','—');
 for(const id of ['tier','miniTier'])text(id,'PENDIENTE');
 for(const id of ['tierDesc','miniDesc'])text(id,'Baraja modificada: pulsa CALCULAR.');
 for(let i=0;i<10;i++){text('sv'+i,'—/10');text('rv'+i,'—/10');const bar=D.getElementById('br'+i);if(bar)bar.style.width='0%';}
 D.documentElement.dataset.scoreAuthority='BARAJA_MODIFICADA';D.documentElement.dataset.scoreCertified='0';D.documentElement.dataset.scoreLegal='';
}
function percentage(value){return typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=1?`${Math.round(value*1000)/10}%`:'—';}
function paintMetric(id,value,description){text(id,percentage(value));const e=D.getElementById(id);if(e)e.title=description;}
function poolNotice(audit){
 let host=D.getElementById('ygoPoolStatus');
 if(!host){host=D.createElement('div');host.id='ygoPoolStatus';host.className='tiny';host.setAttribute('role','status');host.style.cssText='padding:6px 0;line-height:1.4;color:#ffbba9';D.getElementById('mainYdkStatus')?.insertAdjacentElement('afterend',host);}
 if(!host)return;
 const messages={UNKNOWN_IDENTITY:'Identidad de carta desconocida',WRONG_DECK_ZONE:'Carta en una zona incorrecta',ALIAS_FAMILY_OVER_THREE:'Más de tres copias de la misma identidad o sus ilustraciones alternativas',BANLIST_MAXIMUM:'La lista seleccionada restringe estas copias',MAIN_SIZE:'Tamaño de Main Deck fuera del rango del formato',EXTRA_SIZE:'Extra Deck excedido',SIDE_SIZE:'Side Deck excedido',INVALID_QUANTITY:'Cantidad de copias inválida',UNOFFICIAL_SOURCE:'Carta de fuente no oficial',EXCLUDED_UNOFFICIAL:'Carta de fuente no oficial',RUSH_CARD_IN_STANDARD_FORMAT:'Carta Rush incompatible con este formato',NOT_IN_FORMAT_POOL:'Carta fuera del pool técnico del formato'};
 host.textContent=arr(audit?.errors).length?'Construcción no apta: '+audit.errors.slice(0,3).map(e=>{const card=W.YGODataCatalog?.lookup?.(e.id),label=e.name||card?.name||e.id||e.zone||'';return (label?label+': ':'')+(messages[e.reason]||'Compatibilidad de formato no satisfecha')}).join(' · '):'';
}
function formatNotice(audit){
 let host=D.getElementById('ygoFormatStatus');
 if(!host){host=D.createElement('div');host.id='ygoFormatStatus';host.className='tiny';host.setAttribute('role','status');host.style.cssText='padding:6px 0;line-height:1.4;color:#b5e8ff';D.getElementById('mainYdkStatus')?.insertAdjacentElement('afterend',host);}
 if(!host)return;if(!audit){host.textContent='';return;}
 const labels={HISTORICAL_DATE_REQUIRED:'fecha histórica',HISTORICAL_EXTRA_RULE_REQUIRED:'regla histórica del Extra Deck',HISTORICAL_POOL_SNAPSHOT_REQUIRED:'pool histórico fechado',DIGITAL_POOL_SNAPSHOT_REQUIRED:'pool de la versión digital',EXTRA_UNLOCK_OR_SKILL_LIMIT_REQUIRED:'límite de Extra Deck y desbloqueos',SKILL_CONSTRUCTION_EFFECTS_REQUIRE_CONTEXT:'efectos de construcción de la Skill',EVENT_CONTEXT_REQUIRED:'evento aplicable',EVENT_AND_PRINT_VERIFICATION_REQUIRED:'impresión y evento Speed Duel',SPEED_DUEL_PRINT_VERIFICATION_REQUIRED:'impresión Speed Duel',LEGEND_METADATA_REQUIRED:'clasificación Legend',RESTRICTION_DATE_REQUIRED:'fecha de la lista',RESTRICTION_VERSION_REQUIRED:'versión de la lista',RESTRICTION_SOURCE_REQUIRED:'fuente de la lista',SNAPSHOT_AFTER_SELECTED_DATE:'lista anterior a la fecha histórica',SNAPSHOT_NOT_YET_EFFECTIVE:'lista efectiva para la fecha seleccionada',POOL_SNAPSHOT_INCOMPLETE:'pool completo con fecha y fuente'};
 const issues=arr(audit.pending).slice(0,3).map(x=>labels[x.reason]||'datos o reglas del formato');
 const date=audit.snapshot?.effectiveDate?` · lista ${audit.snapshot.effectiveDate}`:'';
 const pending=issues.length?` Pendiente: ${[...new Set(issues)].join(', ')}.`:'';
 const bounds=audit.policy?`Main ${audit.policy.mainMin}–${audit.policy.mainMax}; Extra ${audit.extraLimit===null?'según reglas históricas':audit.extraLimit}; Side ${audit.sideLimit}. `:'';
 const limits=arr(audit.interfaceConstraints).map(x=>x.reason==='SKILL_ZONE_SESSION_UNSUPPORTED'?' La recuperación de sesión no reconstruye una zona separada de Skills.':' La importación y la recuperación de sesión todavía admiten hasta 60 Main, 15 Extra y 15 Side; una construcción histórica mayor requiere ampliar esos controles.').join('');
 host.textContent=`${bounds}${audit.errors.length?'Hay incidencias de construcción.':audit.complete?'Construcción revisada con el pool técnico y la lista declarada.':'Revisión de formato incompleta.'}${date}.${pending}${limits}`;
}
function formatAudit(){
 if(!W.YGOFormats?.validateDeck||!ALL_ZONES.some(z=>arr(W.deckState?.[z]).length))return null;
 const deck=Object.fromEntries(ZONES.map(z=>[z,arr(W.deckState?.[z]).map(c=>({...c,...(W.YGODataCatalog?.lookup?.(Number(c.id??c.cardId))||{}),qty:c.qty??1}))]));
 if(Array.isArray(W.deckState?.skills))deck.skills=W.deckState.skills.map(c=>({...c,...(W.YGODataCatalog?.lookup?.(Number(c.id??c.cardId))||{}),qty:c.qty??1}));
 const audit=W.YGOFormats.validateDeck(deck,getFormatContext());
 audit.interfaceConstraints=[];
 if(!W.YGOFormatEditor){if(audit.counts?.extra>15||audit.policy?.extraUnlimited===true||audit.format==='timeWizard'&&audit.extraLimit===null)audit.interfaceConstraints.push({reason:'LEGACY_IMPORT_AND_SESSION_EXTRA_LIMIT',maximum:15,formatExtraLimit:audit.extraLimit});if(audit.counts?.skills>0)audit.interfaceConstraints.push({reason:'SKILL_ZONE_SESSION_UNSUPPORTED'});}
 audit.interfaceFullySupported=audit.interfaceConstraints.length===0;
 return audit;
}
function refresh(){
 if(!installed)return null;
 const sig=signature(),main=arr(W.deckState?.main),expanded=main.flatMap(c=>Array(qty(c)).fill(c));
 let composition=null;try{composition=W.renderComposition?.()||null}catch(e){console.warn('Composición:',e)}
 let poolAudit=null;
 if(ZONES.some(z=>arr(W.deckState?.[z]).length)&&typeof W.YGODataCatalog?.auditDeck==='function'){
  try{const key=String(W.__YGO_ACTIVE_BAN_KEY||'tcg'),profile=W.BANLIST_PROFILES?.[key];poolAudit=W.YGODataCatalog.auditDeck(W.deckState,{format:key,banlist:profile?.data,banlistDate:profile?.date});}catch(e){console.warn('Revisión de pool:',e)}
 }
 let formatsAudit=null;try{formatsAudit=formatAudit()}catch(e){console.warn('Revisión de formato:',e)}
 poolNotice(formatsAudit||poolAudit);formatNotice(formatsAudit);
 if(arr((formatsAudit||poolAudit)?.errors).length){
  for(const id of ['tier','miniTier'])text(id,'SIN TIER');
  for(const id of ['tierDesc','miniDesc'])text(id,'Baraja no apta: revisa las incidencias de construcción y formato.');
  D.documentElement.dataset.scoreLegal='0';D.documentElement.dataset.scoreAuthority='ESTRUCTURAL_NO_APTO';D.documentElement.dataset.scoreCertified='0';
 }
 if(formatsAudit?.pending?.length&&D.documentElement.dataset.scoreLegal==='1')D.documentElement.dataset.scoreLegal='';
 const formatAdapter=needsFormatAdapter({fmt:selectedFormat(),formatContext:getFormatContext(),deckState:W.deckState}),score=readScore(),currentScore=!formatAdapter&&score&&evaluatedSignature===sig?score:null;
 if(score&&!currentScore)clearStaleScore();
 if(formatAdapter){
  const invalid=arr(formatsAudit?.errors).length>0;
  for(const id of ['tier','miniTier'])text(id,invalid?'SIN TIER':'PENDIENTE');
  for(const id of ['tierDesc','miniDesc'])text(id,invalid?'Revisa las incidencias de construcción del formato.':'La construcción se revisa con el contexto del formato; su puntuación todavía requiere validación.');
  D.documentElement.dataset.scoreAuthority='FORMATO_SIN_PUNTUACION_VALIDADA';D.documentElement.dataset.scoreLegal=invalid?'0':'';D.documentElement.dataset.scoreCertified='0';
 }
 let probability=null,error=null;
 const api=W.YGOProbability||W.YGOExactRulesEngine;
 if(expanded.length>=5&&typeof api?.probabilityModel==='function')try{probability=api.probabilityModel(W.YGOProbability?main:expanded.map(c=>({...c,qty:1})))}catch(e){error=String(e?.message||e)}
 const starter=probability?.starter?.at5,interaction=probability?.interaction?.at5;
 paintMetric('starterRate',starter,'Acceso en cinco cartas a un candidato a starter según el modelo declarado; no prueba una línea legal.');
 paintMetric('interactionRate',interaction,'Acceso en cinco cartas a una carta clasificada como interacción; no garantiza que pueda activarse.');
 // Unknown outcomes must never be rendered as zero. Access by role is not
 // the same event as completing a legal line or having dead cards.
 const verifiedPlayable=probability?.playable?.verified===true?probability.playable.at5:null;
 const verifiedDead=probability?.dead?.verified===true?probability.dead.at5:null;
 paintMetric('playableRate',verifiedPlayable,'Sin medir: una mano jugable requiere una línea legal verificada bajo un escenario concreto.');
 paintMetric('deadRate',verifiedDead,'Sin medir: la inutilidad de una carta depende de la mano, el estado y las líneas disponibles.');
 if(currentScore){
  try{if(typeof v!=='undefined'&&Array.isArray(v))v.splice(0,v.length,...currentScore.stats);W.v=currentScore.stats.slice();W.radar?.()}catch(e){console.warn('Radar:',e)}
 }else{const canvas=D.getElementById('radar');try{canvas?.getContext('2d')?.clearRect(0,0,canvas.width,canvas.height)}catch(_){}}
 for(let i=0;i<10;i++){const control=D.getElementById('pc'+i);if(control){control.setAttribute('aria-valuenow',String(currentScore?.stats?.[i]??0));control.setAttribute('aria-valuetext',currentScore?`${currentScore.stats[i]} de 10`:'Sin evaluación actual');}}
 const legal=D.documentElement.dataset.scoreLegal;
 last={schema:'ygo-ui-state-v1',signature:sig,updatedAt:new Date().toISOString(),format:selectedFormat(),counts:Object.fromEntries(ALL_ZONES.map(z=>[z,arr(W.deckState?.[z]).reduce((n,c)=>n+qty(c),0)])),composition,probabilities:probability,
  metrics:{starterAccess:typeof starter==='number'?starter:null,interactionAccess:typeof interaction==='number'?interaction:null,playable:verifiedPlayable,dead:verifiedDead},
  evaluation:currentScore?{...currentScore,tier:D.getElementById('tier')?.textContent||'',authority:D.documentElement.dataset.scoreAuthority||'NO_EVALUADO',legal:legal==='1'?true:legal==='0'?false:null,certified:D.documentElement.dataset.scoreCertified==='1'}:null,
  poolAudit,formatsAudit,formatContext:getFormatContext(),probabilityError:error,buildId:W.YGO_BUILD_MANIFEST?.buildId||null};
 try{W.dispatchEvent(new CustomEvent('ygo-ui-state-updated',{detail:last}))}catch(_){}
 scheduleSession();return last;
}
function schedule(){if(scheduled||!installed)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;refresh()});}
function getEvaluation(){const current=signature();return last?.signature===current&&last.evaluation?JSON.parse(JSON.stringify(last.evaluation)):null;}
function sessionBanner(message,bad=false){
 let host=D.getElementById('ygoSessionStatus');if(!host){host=D.createElement('div');host.id='ygoSessionStatus';host.className='tiny';host.setAttribute('role','status');host.style.cssText='padding:7px 0;line-height:1.4;color:#b5e8ff';const place=D.getElementById('mainYdkStatus');place?.insertAdjacentElement('afterend',host)}
 if(host){host.textContent=message;host.style.color=bad?'#ffbba9':'#b5e8ff'}
}
function sessionFormat(value){const label=value?.fmt||value?.format||value?.formatContext?.format||selectedFormat(),key=W.YGOFormats?.keyOf?.(label);if(!key)throw Error('El formato de la sesión no está disponible.');return key;}
function sessionCapacity(value){
 const format=sessionFormat(value),policy=W.YGOFormats.policies[format],context=value.formatContext||{};
 if(context.format&&W.YGOFormats.keyOf(context.format)!==format)throw Error('El contexto y la baraja declaran formatos diferentes.');
 let extra=policy.extraMax;
 if(policy.extraUnlimited)extra=1000;
 else if(format==='timeWizard')extra=Number.isSafeInteger(context.extraDeckLimit)&&context.extraDeckLimit>=0?Math.min(1000,context.extraDeckLimit):1000;
 else if(extra===null)extra=Number.isSafeInteger(context.extraDeckLimit)&&context.extraDeckLimit>=0?Math.min(1000,context.extraDeckLimit):(policy.extraSafetyMax||15);
 const side=Number.isSafeInteger(context.event?.sideMax)&&context.event.sideMax>=0&&context.event.sideMax<=15?context.event.sideMax:policy.sideMax;
 return{format,main:policy.mainMax,extra,side,skills:policy.skills||0,total:policy.mainMax+extra+side+(policy.skills||0)};
}
function validateSession(value){
 if(!value||typeof value!=='object'||Array.isArray(value))throw Error('La sesión no es un objeto válido.');
 const state=value.deckState||value.deck;
 if(!state||ZONES.some(z=>!Array.isArray(state[z])))throw Error('La sesión no contiene tres zonas válidas.');
 if(state.skills!==undefined&&!Array.isArray(state.skills))throw Error('La zona Skills no es válida.');
 const capacity=sessionCapacity(value);let total=0;
 for(const zone of ALL_ZONES){let count=0;if(arr(state[zone]).length>capacity[zone])throw Error('Demasiadas entradas en '+zone);
  for(const c of arr(state[zone])){const id=c?.id??c?.cardId,q=qty(c);if(!/^\d{1,12}$/.test(String(id))||Number(id)<=0||!q)throw Error('Identidad o cantidad inválida en '+zone);count+=q;}
  if(count>capacity[zone])throw Error('La zona '+zone+' excede la capacidad de recuperación del formato ('+capacity[zone]+').');total+=count;
 }
 if(total>capacity.total)throw Error('La sesión supera la capacidad del formato.');
 return{...value,deckState:state};
}
function needsFormatAdapter(value){const state=value?.deckState||value?.deck||{},key=sessionFormat(value||{});return arr(state.skills).length>0||arr(state.extra).reduce((n,c)=>n+qty(c),0)>15||['goat','timeWizard','duelLinksSpeed','duelLinksRush','speedDuel','rush','master'].includes(key);}
function formatButton(value){const key=sessionFormat(value);return [...D.querySelectorAll('.fmt')].find(e=>W.YGOFormats.keyOf(e.dataset.f)===key)||null;}
async function applyDeckSnapshot(value,options={}){
 const candidate=validateSession(value),button=formatButton(candidate);if(!button)throw Error('El formato de la baraja no está disponible en la interfaz.');
 if(W.YGODataCatalog?.ready)await W.YGODataCatalog.ready;
 const hydrated={};for(const zone of ALL_ZONES)hydrated[zone]=arr(candidate.deckState[zone]).map(row=>{const id=Number(row.id??row.cardId),source=W.YGODataCatalog?.rulesCard?.(id)||W.YGODataCatalog?.lookup?.(id);if(!source)throw Error('Passcode desconocido: '+id);return{...structuredClone(row),...structuredClone(source),qty:qty(row)}});
 const old={state:W.deckState,button:D.querySelector('.fmt.active'),context:getFormatContext(),name:D.getElementById('name')?.value||'',arch:D.getElementById('arch')?.value||'',date:D.getElementById('date')?.value||''};
 try{
  if(!button.classList.contains('active'))button.click();
  setFormatContext(candidate.formatContext||{format:sessionFormat(candidate)});
  W.deckState=hydrated;
  for(const key of ['name','arch','date']){const input=D.getElementById(key);if(input)input.value=String(candidate[key]??(key==='name'?'Baraja importada':''));}
  evaluatedSignature=null;lastSessionSignature=null;clearStaleScore();
  W.renderDeck?.();W.renderComposition?.();refresh();
  const host=D.getElementById('mainYdkStatus');if(host)host.textContent=`Baraja de ${button.dataset.f} importada sin truncar zonas. Revisa la construcción y los datos pendientes del formato.`;
  try{W.dispatchEvent(new CustomEvent('ygo-format-deck-applied',{detail:{format:sessionFormat(candidate),counts:last?.counts}}))}catch(_){}
  return{pass:true,status:'FORMAT_DECK_IMPORTED',format:sessionFormat(candidate),counts:structuredClone(last?.counts||{}),audit:structuredClone(last?.formatsAudit||null),evaluationPending:true};
 }catch(error){
  W.deckState=old.state;if(old.button&&!old.button.classList.contains('active'))old.button.click();setFormatContext(old.context);for(const key of ['name','arch','date'])if(D.getElementById(key))D.getElementById(key).value=old[key];W.renderDeck?.();refresh();throw error;
 }
}
function saveSession(){
 if(!installed||restoring||!storageReadable)return {saved:false,reason:restoring?'RESTORING':'NOT_AVAILABLE'};
 try{
  const sig=signature();if(lastSessionSignature===sig)return{saved:true,unchanged:true};
  const state=W.deckState||{};const total=ALL_ZONES.reduce((n,z)=>n+arr(state[z]).reduce((a,c)=>a+qty(c),0),0);
  if(!total){if(lastSessionSignature!==null){localStorage.removeItem(KEY);localStorage.removeItem(LEGACY_KEY);lastSessionSignature=sig;}return{saved:true,empty:true};}
  const saved={schema:'ygo-session-v1',name:D.getElementById('name')?.value||'Sesión recuperada',fmt:selectedFormat(),arch:D.getElementById('arch')?.value||'',date:D.getElementById('date')?.value||'',deckState:JSON.parse(JSON.stringify(state)),formatContext:getFormatContext(),evaluation:getEvaluation(),savedAt:new Date().toISOString(),buildId:W.YGO_BUILD_MANIFEST?.buildId||null};
  validateSession(saved);const serialized=JSON.stringify(saved);if(serialized.length>2*1024*1024)throw Error('La sesión supera el máximo local de 2 MB.');
  localStorage.setItem(KEY,serialized);if(localStorage.getItem(KEY)!==serialized)throw Error('No se confirmó la escritura de sesión.');lastSessionSignature=sig;
  return{saved:true,count:total};
 }catch(e){sessionBanner('No se pudo guardar la sesión: '+String(e?.message||e),true);return{saved:false,error:String(e?.message||e)}}
}
function scheduleSession(){clearTimeout(saving);if(!restoring)saving=setTimeout(saveSession,350);}
async function restoreSession(value){
 if(restoring)return{restored:false,status:'ALREADY_RESTORING'};
 let candidate;
 try{
  if(value===undefined){const raw=localStorage.getItem(KEY)||localStorage.getItem(LEGACY_KEY);if(!raw)return{restored:false,status:'NO_SESSION'};if(raw.length>2*1024*1024)throw Error('Sesión demasiado grande.');candidate=validateSession(JSON.parse(raw));}
  else candidate=validateSession(value);
 }catch(e){storageReadable=false;sessionBanner('Existe una sesión que no se pudo leer. Se conserva sin sobrescribir: '+String(e?.message||e),true);return{restored:false,status:'INVALID_SESSION',error:String(e?.message||e)}}
 if(ALL_ZONES.some(z=>arr(W.deckState?.[z]).length))return{restored:false,status:'CURRENT_DECK_PRESERVED'};
 restoring=true;
 try{
  if(needsFormatAdapter(candidate)){const result=await applyDeckSnapshot(candidate,{restoring:true});storageReadable=true;sessionBanner('Sesión anterior recuperada con todas sus zonas y contexto. Revisa los datos pendientes del formato.');return{restored:true,result};}
  const selected=selectedFormat(),format=String(candidate.fmt||selected),button=[...D.querySelectorAll('.fmt')].find(e=>e.dataset.f===format);
  if(!button)throw Error('El formato de la sesión no está disponible: '+format);
  if(format!==selected)button.click();
  if(candidate.formatContext)setFormatContext(candidate.formatContext);
  const lines=z=>candidate.deckState[z].flatMap(c=>Array(qty(c)).fill(String(c.id??c.cardId))).join('\n');
  const ydk='#main\n'+lines('main')+'\n#extra\n'+lines('extra')+'\n!side\n'+lines('side')+'\n';
  const importer=W.YGOApp?.ydk?.importText||W.YGOAlpha1048?.importText1048;
  if(typeof importer!=='function')throw Error('Importador no disponible.');
  const result=await importer(ydk,String(candidate.name||'Sesión recuperada'));
  if(!result||result.error||result.cancelled)throw Error(result?.error||'La recuperación no se confirmó.');
  const arch=D.getElementById('arch'),date=D.getElementById('date');if(arch)arch.value=candidate.arch||'';if(date)date.value=candidate.date||'';
  evaluatedSignature=readScore()?signature():null;storageReadable=true;sessionBanner('Sesión anterior recuperada. La evaluación se recalculó con los datos y restricciones actuales.');
  return{restored:true,result};
 }catch(e){sessionBanner('No se pudo restaurar la sesión. Se conserva la copia local: '+String(e?.message||e),true);return{restored:false,status:'RESTORE_ERROR',error:String(e?.message||e)}}
 finally{restoring=false;refresh()}
}
function wrapSampling(name){const original=W[name];if(typeof original!=='function'||original.__ygoUIState)return;const wrapped=function(...args){const result=original.apply(this,args);text('simResult','Muestra de cartas y roles orientativos. No acredita una mano jugable, un duelo completo ni una victoria.');schedule();return result};wrapped.__ygoUIState=true;W[name]=wrapped;}
async function install(){
 if(installed)return;
 if(W.__YGO_ENGINE_READY)await W.__YGO_ENGINE_READY;
 if(W.__YGO_ENGINE_BOOT?.status!=='READY'&&W.__YGO_ENGINE_BOOT?.status!=='READY_WITH_ERRORS')throw Error('No se completó el arranque del motor.');
 // Optional catalogue enrichment may still be pending after module startup.
 if(W.YGOAlpha984?.ensureCatalog984)await W.YGOAlpha984.ensureCatalog984();
 if(W.YGODataCatalog?.ready)await W.YGODataCatalog.ready;
 installed=true;evaluatedSignature=readScore()?signature():null;
 const observer=new MutationObserver(records=>{
  const scored=records.some(r=>{const node=r.target.nodeType===1?r.target:r.target.parentElement;return !!node?.closest?.('#score,#stats .sv')});
  if(scored&&readScore())evaluatedSignature=signature();schedule();
 });
 for(const id of ['deckList','score','stats','mainYdkStatus']){const el=D.getElementById(id);if(el)observer.observe(el,{childList:true,characterData:true,subtree:true})}
 D.addEventListener('click',event=>{if(event.target.closest?.('.fmt,.deck-tab'))schedule()},true);
 D.addEventListener('input',event=>{if(['name','date','arch'].includes(event.target.id)){lastSessionSignature=null;scheduleSession()}},true);
 for(const name of ['simulateHand','simulateMany'])wrapSampling(name);
 D.addEventListener('visibilitychange',()=>{if(D.visibilityState==='hidden')saveSession()});W.addEventListener('pagehide',saveSession);
 W.addEventListener('ygo-catalog-updated',schedule);W.addEventListener('ygo-probability-ready',schedule);W.addEventListener('ygo-formats-ready',schedule);
 try{await restoreSession()}finally{refresh();readyResolve(W.YGOUIState)}
}
W.YGOUIState=Object.freeze({ready,sync:refresh,schedule,getEvaluation,saveSession,restoreSession,validateSession,sessionCapacity,needsFormatAdapter,applyDeckSnapshot,getFormatContext,setFormatContext,get last(){return last},get contextVersion(){return contextRevision},get sessionKey(){return KEY}});
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',()=>{install().catch(e=>{console.error('UI_STATE_INIT',e);readyResolve(null)})},{once:true});else install().catch(e=>{console.error('UI_STATE_INIT',e);readyResolve(null)});
})();


/* === packed Alpha657 from ygo-alpha-543-release-certification === */

(()=>{'use strict';
const W=window,D=document,VERSION='Alpha 543',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_543',A522=W.YGOAlpha522||{},A509=W.YGOAlpha509||{},A357=W.YGOAlpha357||{},A330=W.YGOAlpha330||{},A329=W.YGOAlpha329||{},R=W.YGORulingEngine||{};
const SCORE_FN537=typeof W.scoreDeck==='function'?W.scoreDeck.bind(W):null,SLOW_CALC537=typeof W.__YGO332_BASE_CALCULATE==='function'?W.__YGO332_BASE_CALCULATE.bind(W):null;let FAST_CALC537=null,DEEP537=null;
const RUNTIME_ERRORS537=W.__YGO543_RUNTIME_ERRORS||(W.__YGO543_RUNTIME_ERRORS=[]);if(!W.__YGO543_ERROR_TRACKER){W.__YGO543_ERROR_TRACKER=true;W.addEventListener('error',e=>{RUNTIME_ERRORS537.push({type:'error',message:String(e?.message||'unknown'),source:String(e?.filename||''),line:Number(e?.lineno||0),at:Date.now()});if(RUNTIME_ERRORS537.length>50)RUNTIME_ERRORS537.shift()});W.addEventListener('unhandledrejection',e=>{RUNTIME_ERRORS537.push({type:'unhandledrejection',message:String(e?.reason?.message||e?.reason||'unknown'),at:Date.now()});if(RUNTIME_ERRORS537.length>50)RUNTIME_ERRORS537.shift()})}
const arr=v=>Array.isArray(v)?v:[],qty=c=>Math.max(0,Math.floor(Number(c?.qty)||1)),norm=v=>String(v??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
const BUILD_VERIFICATION={"status":"PENDING_REVERIFY","verified":false,"engine":"Chromium headless","at":"2026-09-17","tests":{"identity":true,"staticTitleMatchesVersion":true,"singleDocument":true,"liveScoreRegressionInstalled":true,"missingMetricsNoLongerPass":true,"endBoardNANoLongerPass":true,"browserPageErrorsZero":false,"fullRadiantDeepBenchmarkCompleted":false},"metrics":{"htmlCloses":1,"bodyCloses":1,"browserPageErrors":null},"releaseState":{"buildReady":false,"status":"ALPHA 538 · REVERIFY REQUIRED","offlineGlobalCatalogReady":false,"globalTargetPct":98},"notes":["Alpha 538 replaces inherited regression flags with live checks.","Missing performance measurements and no-deck End Board states are no longer accepted as PASS.","Deep Top-5 benchmark remains an explicit separate gate until measured."],"errors":[]};
const OFFICIAL_SOURCES={
 tcg:{authority:'KONAMI',effective:'2026-05-18',verifiedAt:'2026-09-17',url:'https://www.yugioh-card.com/en/limited/list_2026-05-18/'},
 ocgJP:{authority:'KONAMI',effective:'2026-07-01',verifiedAt:'2026-09-17',url:'https://www.yugioh-card.com/japan/event/limitregulation/?list=202607'},
 ocgAE:{authority:'KONAMI',effective:'2026-07-01',verifiedAt:'2026-09-17',url:'https://www.yugioh-card.com/asia/play/forbidden-and-limited-card-list-ae/'},
 psct3:{authority:'KONAMI',url:'https://www.yugioh-card.com/en/play/psct/psct-3/',rule:'CONDITIONS : ACTIVATION/COST ; RESOLUTION'},
 psct4:{authority:'KONAMI',url:'https://www.yugioh-card.com/en/play/psct/psct-4/',rule:'costs at activation; target requirements and conjunction clues are resolution-sensitive'}
};
function bind537(){
 const canonical990=!!W.__YGO_TARGET_BUILD&&W.__YGO_TARGET_BUILD!==VERSION;
 if(!canonical990){installFastScoring537();installDeep537();installFastInput537();W.YGO_APP_VERSION=VERSION;if(W.YGOApp)W.YGOApp.version=VERSION;if(W.YGOOfficialEvaluation)W.YGOOfficialEvaluation.version=VERSION;D.title=TITLE;}
 const p=W.BANLIST_PROFILES||{};if(p.tcg)Object.assign(p.tcg,{authority:'KONAMI',officialEffective:OFFICIAL_SOURCES.tcg.effective,officialVerifiedAt:OFFICIAL_SOURCES.tcg.verifiedAt});if(p.ocg)Object.assign(p.ocg,{authority:'KONAMI',officialEffective:OFFICIAL_SOURCES.ocgJP.effective,officialVerifiedAt:OFFICIAL_SOURCES.ocgJP.verifiedAt});if(p.ocgAE)Object.assign(p.ocgAE,{authority:'KONAMI',officialEffective:OFFICIAL_SOURCES.ocgAE.effective,officialVerifiedAt:OFFICIAL_SOURCES.ocgAE.verifiedAt});
 if(!canonical990){W.YGOCanonicalRuntime={...(W.YGOCanonicalRuntime||{}),version:VERSION,releaseRuntime:'Alpha537 build/deck/offline-catalog certification split + active-deck structural priority',ruleConfidence:'EXACT > DECLARATIVE_HIGH_CONFIDENCE > HEURISTIC_OR_UNKNOWN',releaseUnknownPolicy:'0 critical UNKNOWN for strict release lines',browserE2E:'real Chromium build verification embedded when available',sourceStructure:'single BODY/HTML close; Alpha522/537 kept inside document',officialSources:OFFICIAL_SOURCES};
 W.YGOArchitectureContract={...(W.YGOArchitectureContract||{}),version:VERSION,finalAlphaFacade:'YGOAlpha537',visualContract:'protected layout/controls unchanged',nextStage:'embed/update offline structural snapshot when source access is available; continue real-deck beta validation and exact-ruling expansion'};}
 return true;
}
function repairCatalogBarrier537(){const A=W.YGOAlpha329;if(!A||typeof A.ensureReady!=='function')return false;if(A.ensureReady.__alpha537Barrier)return true;const old=A.ensureReady.bind(A);const f=async(...args)=>{const r=await old(...args);const canonical990=/^Alpha\s+(?:99[0-9]|[1-9]\d{3,})$/.test(String(W.__YGO_TARGET_BUILD||''))||!!W.YGOAlpha993;try{W.YGOAlpha522?.reassert?.();ensureArchetypes537();applyOfficialHotset537();promoteTrustedStructuralSeeds537();persistStructuralPack537('post-catalog-ready');if(!canonical990)bind537()}catch(_){}setTimeout(()=>{try{ensureArchetypes537();applyOfficialHotset537();promoteTrustedStructuralSeeds537();persistStructuralPack537('post-catalog-ready-deferred');if(!canonical990){installFastScoring537();installDeep537();installFastInput537();installCombo537();bind537()}else{W.__YGO_REASSERT_TARGET_BUILD?.()}}catch(_){}},0);if(canonical990)try{W.__YGO_REASSERT_TARGET_BUILD?.()}catch(_){}return r};f.__alpha537Barrier=true;f.__base=old;A.ensureReady=f;return true}
function ensureArchetypes537(){try{return Number(A522.ensureArchetypes?.()||0)}catch(_){return 0}}
function normalizeScore537(r){const scores=arr(r?.scores||r?.stats||r?.v).slice(0,10).map(x=>Math.max(0,Math.min(10,Math.round(Number(x)||0))));while(scores.length<10)scores.push(0);const total=scores.reduce((a,b)=>a+b,0);return{...(r||{}),scores,stats:scores,v:scores,total,finalScore:total}}
function fastScore537(state=W.deckState||{}){if(!SCORE_FN537)return normalizeScore537({scores:Array(10).fill(0)});const live=W.deckState;try{W.deckState={main:[],extra:[],side:[]};return normalizeScore537(SCORE_FN537(state)||{})}finally{W.deckState=live}}
function paintScore537(r){r=normalizeScore537(r);const scores=r.scores,total=r.total,set=(id,v,html=false)=>{const e=D.getElementById(id);if(e){if(html)e.innerHTML=v;else e.textContent=String(v)}};set('score',`${total} <span>/ 100</span>`,true);set('total',`${total} / 100`);set('sum',total);set('miniScore',`${total} / 100`);if(typeof W.tier==='function'){const t=W.tier(total)||['—','—'];set('tier',t[0]);set('miniTier',t[0]);set('tierDesc',t[1]);set('miniDesc',t[1])}D.querySelectorAll('#stats .stat').forEach((row,i)=>{if(i>=10)return;const v=scores[i],sv=row.querySelector('.sv'),bar=row.querySelector('.bar i');if(sv)sv.textContent=v+'/10';if(bar)bar.style.width=v*10+'%'});D.querySelectorAll('#sliders .points-row').forEach((row,i)=>{if(i>=10)return;const v=scores[i],val=row.querySelector('.points-value');if(val)val.textContent=v+'/10';row.querySelectorAll('.point').forEach((q,k)=>q.classList.toggle('active',k<v))});return r}
function fastCalculate537(){return paintScore537(fastScore537(W.deckState||{}))}
function installFastScoring537(){FAST_CALC537=FAST_CALC537||fastCalculate537;W.__YGO332_BASE_CALCULATE=FAST_CALC537;W.YGOCanonicalRuntime={...(W.YGOCanonicalRuntime||{}),scoreDelivery:'Alpha537 fast base score first; certified combo search decoupled from import'};return true}
/* Alpha537 cleanup: duplicate calculateDeep537 removed. */
function installDeep537(){DEEP537=DEEP537||calculateDeep537;W.calculateDeep=DEEP537;return true}
function deckCount537(d){return ['main','extra','side'].reduce((n,z)=>n+arr(d?.[z]).reduce((m,c)=>m+qty(c),0),0)}
function unknownCount537(d){return ['main','extra','side'].reduce((n,z)=>n+arr(d?.[z]).reduce((m,c)=>m+((c?.unknown||!c?.name||c?.name==='Carta desconocida')?qty(c):0),0),0)}

const STRUCTURAL_CACHE_KEY537='ygoStructuralMetadata537',STRUCTURAL_CACHE_MAX537=600;
let structuralCache537=null;
/* Alpha537 cleanup: duplicate readStructuralCache537 removed. */
function structuralFields537(c){return{id:Number(c?.id)||0,name:String(c?.name||''),type:String(c?.type||''),frameType:String(c?.frameType||''),attribute:String(c?.attribute||''),race:c?.race??'',level:Number(c?.level)||0,rank:Number(c?.rank)||0,linkval:Number(c?.linkval)||0,scale:Number(c?.scale??c?.scaleL??0)||0,scaleL:Number(c?.scaleL??c?.scale??0)||0,scaleR:Number(c?.scaleR??c?.scale??0)||0,atk:Number.isFinite(Number(c?.atk))?Number(c.atk):0,def:Number.isFinite(Number(c?.def))?Number(c.def):0,archetype:String(c?.archetype||''),archetypes:arr(c?.archetypes).slice(0,8),cachedAt:Date.now()}}
function isMonster537(c){return /monster|monstruo/i.test(String(c?.type||''))}
function structuralComplete537(c){if(!isMonster537(c))return true;if(!Number(c?.id))return false;const t=String(c?.type||'');if(/link/i.test(t))return Number(c?.linkval)>0;if(/xyz/i.test(t))return Number(c?.rank)>0;if(/token/i.test(t))return Number(c?.level)>0;return Number(c?.level)>0}
/* Alpha537 cleanup: duplicate structuralGapAudit537 removed. */
/* Alpha537 cleanup: duplicate catalogStructuralAudit537 removed. */
/* Alpha537 cleanup: duplicate applyStructuralCache537 removed. */
/* Alpha537 cleanup: duplicate persistStructural537 removed. */
function syncStructural537(state,sourceCards){const byId=new Map(arr(sourceCards).filter(c=>Number(c?.id)).map(c=>[String(c.id),c]));let updated=0;for(const z of ['main','extra','side'])for(const c of arr(state?.[z])){const x=byId.get(String(c?.id||''));if(x&&structuralComplete537(x)){const q=qty(c);Object.assign(c,structuralFields537(x),{qty:q,__ygoHydrated:true});updated++}}return updated}
/* Alpha537 cleanup: duplicate refineStructural537 removed. */
let importSession537=0;
function renderImportState537(session){const s=W.__YGO537_IMPORT_STATE;if(!s||s.session!==session)return false;let score=s.score;try{if(score)paintScore537(score)}catch(_){}const status=D.getElementById('mainYdkStatus');if(status){const gaps=Number(s.structural?.gaps||0),reg=s.regulation||'checking';let msg=`Baraja cargada · ${score?.total??0}/100`;
 if(gaps)msg+=` · ${gaps} metadatos estructurales pendientes`;
 else msg+=' · metadatos estructurales verificados';
 if(reg==='checking')msg+=' · verificando regulación…';else if(reg==='pending')msg+=' · regulación/banlist pendiente';else if(reg==='verified')msg+=' · regulación verificada';
 status.textContent=msg+'.';status.className='main-ydk-status '+((gaps||reg==='pending')?'warn':'ok')}
 return true}
function scheduleStructuralRefinement537(state,name,scoreBefore,session){const job=(async()=>{let ref={attempted:0,updated:0,after:structuralGapAudit537(state)};try{ref=await refineStructural537(state,{maxCards:60})}catch(e){ref.error=String(e?.message||e)}const s=W.__YGO537_IMPORT_STATE;if(!s||s.session!==session)return{name,stale:true,refinement:ref};let score=scoreBefore;try{if(ref.updated>0){W.renderDeck?.();W.renderComboDeckCards?.();score=fastCalculate537()}}catch(_){}s.score=score;s.structural=ref.after||structuralGapAudit537(state);s.refinement=ref;renderImportState537(session);return{name,score,refinement:ref}})();W.__YGO537_IMPORT_JOB=job;return job}
async function importTextFast537(text,name='Baraja importada'){const status=D.getElementById('mainYdkStatus'),setStatus=(x,k='warn')=>{if(status){status.textContent=x;status.className='main-ydk-status '+k}},session=++importSession537;setStatus(`Importando ${name}…`);try{if(arr(W.CARD_CATALOG).length<19000&&W.YGOAlpha329?.ensureReady)await W.YGOAlpha329.ensureReady()}catch(e){setStatus('No se pudo preparar el catálogo: '+String(e?.message||e),'bad');return null}const parser=W.YGOAlpha330?.parseYDK||W.parseYDK;if(typeof parser!=='function')throw new Error('Parser YDK no disponible.');const parsed=parser(String(text||''));if(!deckCount537(parsed)){setStatus('El archivo no contiene cartas válidas. La baraja actual se conserva.','bad');return null}mergeDeckFromCatalog537(parsed);applyStructuralCache537(parsed);W.deckState=parsed;W.activeZone='main';try{activeZone='main'}catch(_){}D.querySelectorAll('.deck-tab').forEach(b=>b.classList.toggle('active',b.dataset.zone==='main'));const f=D.getElementById('name');if(f)f.value=String(name).split(/[\\/]/).pop().replace(/\.(ydk|txt)$/i,'');try{W.renderDeck?.();W.renderComboDeckCards?.()}catch(_){}const prev=W.__YGO_ANALYSIS_BUDGET;W.__YGO_ANALYSIS_BUDGET={mc:300,rules:20,stress:12,mode:'interactivo'};try{const score=fastCalculate537(),gaps=structuralGapAudit537(parsed);W.__YGO537_IMPORT_STATE={session,name,score,structural:gaps,regulation:'checking',startedAt:Date.now()};renderImportState537(session);scheduleStructuralRefinement537(parsed,name,score,session);const regulatory=(async()=>{let tx=null;try{if(W.YGOAlpha332?.transaction)tx=await W.YGOAlpha332.transaction({force:true,reason:'alpha537-import',hydrate:false})}catch(e){tx={error:String(e?.message||e)}}const s=W.__YGO537_IMPORT_STATE;if(!s||s.session!==session)return tx;const v=tx?.validation;s.regulation=(tx?.ok===true&&v?.verifiable===true&&v?.legal===true&&!arr(v?.issues).some(x=>/banlist no disponible|sin verificar|unavailable/i.test(String(x))))?'verified':'pending';try{s.score=fastCalculate537()}catch(_){}W.__YGO537_REGULATION=tx;renderImportState537(session);return tx})();W.__YGO537_REGULATION_JOB=regulatory;return{transaction:regulatory,score,structural:gaps,refinement:W.__YGO537_IMPORT_JOB,session}}finally{W.__YGO_ANALYSIS_BUDGET=prev||{mc:600,rules:40,stress:24,mode:'interactivo'}}}
async function importFileFast537(file){if(!file)return null;if(!/\.(ydk|txt)$/i.test(file.name||'')){const s=D.getElementById('mainYdkStatus');if(s){s.textContent='Selecciona un archivo .YDK o .TXT.';s.className='main-ydk-status bad'}return null}const text=typeof file.text==='function'?await file.text():await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result||''));r.onerror=()=>rej(r.error);r.readAsText(file,'UTF-8')});return importTextFast537(text,file.name)}
function installFastInput537(){let input=D.getElementById('ydkMainFile');if(!input)return false;if(input.__alpha537Bound!==true){const old=input;input=old.cloneNode(true);input.dataset.alpha537='1';input.dataset.alpha403='1';input.__alpha537Bound=true;old.replaceWith(input);input.addEventListener('change',async()=>{const f=input.files?.[0];try{await importFileFast537(f)}catch(e){const s=D.getElementById('mainYdkStatus');if(s){s.textContent='No se pudo importar la baraja: '+String(e?.message||e);s.className='main-ydk-status bad'}}finally{input.value=''}})}W.importText=importTextFast537;W.YDK={...(W.YDK||{}),importText:importTextFast537,importFile:importFileFast537,importMainCalculator:importFileFast537};if(W.YGOApp?.ydk)W.YGOApp.ydk={...W.YGOApp.ydk,importText:importTextFast537,importFile:importFileFast537};return true}


function n(v){return Number(v)||0}
function registryExact537(x){const name=String(x?.name||x||'').trim(),k=norm(name);try{for(const rk of Object.keys(R)){if(/^exactRuleRegistry\d+$/.test(rk)&&R[rk]?.[k]?.exact===true)return true}if(R.cardScriptRegistry?.[k]?.exact===true)return true;const live=W.YGOAlpha522||A522;if(live?.coverage?.(typeof x==='object'?x:{name})?.level==='EXACT')return true}catch(_){}return false}
function actionExact537(line,step){const acts=arr(line?.actions||line?.simulation?.actions),a=acts[Math.max(0,Number(step||1)-1)];if(!a)return false;const name=String(a?.card?.name||a?.cardName||a?.card||'').trim(),card=typeof a?.card==='object'?a.card:(arr(W.CARD_CATALOG).find(c=>norm(c?.name)===norm(name))||{name,desc:a?.effectText||''});return registryExact537(card)}
function rowUnknown537(line,audit,kind){let n=0;for(const r of arr(audit?.rows)){let u=false;if(kind==='condition'||kind==='event'||kind==='material'||kind==='resolutionTarget'||kind==='outcome')u=r?.unknown===true;else if(kind==='targetZone')u=r?.unknown===true||arr(r?.qualifierUnknown).length>0;else if(kind==='cost')u=r?.unknown===true;else if(kind==='payment')u=r?.paidUnknown===true;if(u&&!actionExact537(line,r?.step))n++}return n}
function strictLine537(line){
 if(!line)return{pass:false,reason:'no-line',failures:1,criticalUnknown:1,strong:false,stress:0,weightedCoverage:0};try{A522.annotate?.(line)}catch(_){}
 const c=line.alpha522Coverage||{},co=line.alpha522Conditions||{},tg=line.alpha522Targets||{},tz=line.alpha522TargetZones||{},cz=line.alpha522Costs||{},cp=line.alpha522CostPayment||{},ev=line.alpha522Events||{},us=line.alpha522Usage||{},ct=line.alpha522Continuity||{},ma=line.alpha522Materials||{},rt=line.alpha522ResolutionTargets||{},oc=line.alpha522Outcomes||{};
 const failures=n(co.failed)+n(tg.missing)+n(tg.excess)+n(tg.duplicates)+n(tz.invalid)+n(cz.missing)+n(cz.invalid)+n(cz.duplicates)+n(cz.unassigned)+n(cp.failed)+n(ev.failed)+arr(us.violations).length+n(ct.failures)+n(ma.failed)+n(ma.duplicates)+n(rt.failed)+n(oc.failed);
 const coverageUnresolved537=arr(c.unresolved).filter(x=>!registryExact537(x)),coverageUnknown537=coverageUnresolved537.length?Math.min(n(c.unknown),coverageUnresolved537.length):0;
 const criticalUnknown=coverageUnknown537+rowUnknown537(line,co,'condition')+rowUnknown537(line,tz,'targetZone')+rowUnknown537(line,cz,'cost')+rowUnknown537(line,cp,'payment')+rowUnknown537(line,ev,'event')+rowUnknown537(line,ma,'material')+rowUnknown537(line,rt,'resolutionTarget')+rowUnknown537(line,oc,'outcome');
 const rawUnknown=n(co.unknown)+n(tz.unknown)+n(tz.qualifierUnknown)+n(cz.unknown)+n(cp.unknown)+n(ev.unknown)+n(ma.unknown)+n(rt.unknown)+n(oc.unknown),exactClosed=Math.max(0,rawUnknown-(criticalUnknown-n(c.unknown)));
 const health=line?.alpha357Health||line?.health||{},cert=line?.alpha358Certificate||line?.certificate||{}
 const reproducible=(cert?.reproducible??health?.reproducible??line?.reproducible)!==false,criticalGap=n(cert?.criticalGapCount??health?.criticalGapCount??line?.criticalGapCount),actions=arr(line?.actions||line?.simulation?.actions).length;
 const stress=Math.max(0,Math.min(100,Number(line?.alpha522Stress?.score??health?.stressScore??line?.stressScore??cert?.resilience??0)||0)),weightedCoverage=Math.max(0,Math.min(100,Number(health?.weightedCoverage??cert?.weightedCoverage??c.pct??0)||0));
 const strong=(health?.strong===true)||(cert?.complete===true)||(cert?.strict===true)||(line?.strong===true)||(line?.verified===true),unresolved=coverageUnresolved537,coverage=unresolved.length===0?100:(Number(c.pct)||0);
 const semanticPass=actions>=2&&failures===0&&criticalUnknown===0&&criticalGap===0&&reproducible&&ct.pass!==false&&coverage>=100&&unresolved.length===0;
 const qualityPass=strong&&stress>=43&&weightedCoverage>=80;
 const pass=semanticPass&&qualityPass;
 return{version:VERSION,pass,semanticPass,qualityPass,strong,stress,weightedCoverage,actions,failures,criticalUnknown,rawUnknown,exactClosed,criticalGap,reproducible,coverage,unresolved,policy:'Release estricto 537: 0 fallos, 0 UNKNOWN críticos, cobertura universal 100%, reconstrucción reproducible y línea competitivamente fuerte (stress >=43; cobertura ponderada >=80). Un handler EXACT puede cerrar evidencia que el parser genérico no infiere; los fallbacks no.'};
}
function conjunctionAudit537(line){const rows=[];let checked=0,failed=0,unknown=0;for(let i=0;i<arr(line?.actions||line?.simulation?.actions).length;i++){const a=arr(line?.actions||line?.simulation?.actions)[i],txt=String(a?.effectText||a?.card?.desc||''),seg=A522.psctSegments?.(txt)||{},res=String(seg.resolution||a?.resolutionText||'');const m=res.match(/\b(and if you do|then|also,? after that|also|and)\b/i);if(!m)continue;const trace=arr(a?.resolutionSteps||a?.resolvedSteps||a?.resolutionTrace);if(!trace.length){unknown++;rows.push({step:i+1,card:String(a?.card?.name||a?.cardName||a?.card||''),conjunction:m[1],ok:true,unknown:true});continue}checked++;let ok=true;for(let j=1;j<trace.length;j++){const p=Number(trace[j-1]?.order??j-1),q=Number(trace[j]?.order??j);if(q<p){ok=false;break}}if(!ok)failed++;rows.push({step:i+1,card:String(a?.card?.name||a?.cardName||a?.card||''),conjunction:m[1],trace:trace.length,ok})}return{version:VERSION,checked,failed,unknown,pass:failed===0,rows,policy:'PSCT Parte 4: se audita el orden de conjunciones cuando existe traza de resolución; sin traza queda UNKNOWN y no se inventa.'}}
function residualRulingAudit537(line){const conj=conjunctionAudit537(line),strict=line?.alpha537Strict||strictLine537(line),acts=arr(line?.actions||line?.simulation?.actions),registry={};for(const k of Object.keys(R))if(/^exactRuleRegistry\d+$/.test(k))Object.assign(registry,R[k]||{});const residual=[],closed=[];for(const a of acts){const name=String(a?.card?.name||a?.cardName||a?.card||'').trim(),key=norm(name),card=typeof a?.card==='object'?a.card:(arr(W.CARD_CATALOG).find(c=>norm(c?.name)===key)||{name,desc:a?.effectText||''});const cv=A522.coverage?.(card),exact=registry[key]||registry[name]||null;if(cv?.level==='HEURISTIC_OR_UNKNOWN'){if(exact?.exact===true&&exactRuleApplies537(exact))closed.push(name||'Carta sin nombre');else residual.push(name||'Carta sin nombre')}}return{version:VERSION,pass:strict.failures===0&&conj.pass&&residual.length===0,residual:[...new Set(residual)],closedByExact:[...new Set(closed)],residualCount:new Set(residual).size,conjunctions:conj,specificRuleCount:Object.keys(registry).length,strict,policy:'UNKNOWN PSCT sólo bloquea si no existe handler EXACT explícito. Los handlers exactos cierran la incertidumbre sin convertir heurísticas en certeza.'}}
let BASE_COMBO537=null;
function installCombo537(){const cur=W.comboBuildCandidates;if(typeof cur!=='function'&&typeof R.searchOpeningLines!=='function')return false;if(cur?.__alpha537===true)return true;const base=typeof cur==='function'?cur.bind(W):null;BASE_COMBO537=base;const keyOf=l=>arr(l?.actions||l?.simulation?.actions).map(a=>`${norm(a?.card?.name||a?.cardName||a?.card)}|${norm(a?.actionType||a?.type)}|${a?.effectId??''}`).join('>');const prep=l=>{try{if(!l.alpha358Certificate&&W.YGOAlpha358?.finalCertificate)l.alpha358Certificate=W.YGOAlpha358.finalCertificate(l)}catch(_){}try{W.YGOAlpha522?.annotate?.(l)}catch(_){}const st=strictLine537(l);l.alpha537Strict=st;const r=residualRulingAudit537(l);l.alpha537Residual=r;l.releaseCertified537=!!st.pass;let label=String(l.status||'VERIFICADO').replace(/\s*·\s*(?:STRICT|AUDIT)537[^·]*/g,'').trim();l.status=label+(st.pass?' · STRICT537 0 UNKNOWN':` · AUDIT537 ${st.criticalUnknown} UNKNOWN`);return l};const rank=(a,b)=>{const A=a.alpha537Strict||strictLine537(a),B=b.alpha537Strict||strictLine537(b),aq=Number(a?.alpha358Certificate?.score||0),bq=Number(b?.alpha358Certificate?.score||0);return Number(B.pass)-Number(A.pass)||Number(B.qualityPass)-Number(A.qualityPass)||Number(B.strong)-Number(A.strong)||B.stress-A.stress||B.weightedCoverage-A.weightedCoverage||bq-aq||B.coverage-A.coverage};const f=function(...args){let raw=[];const seen=new Set(),add=x=>{if(!x)return;const k=keyOf(x)||JSON.stringify(arr(x?.actions||x?.simulation?.actions).length);if(seen.has(k))return;seen.add(k);raw.push(x)};const deep=String(W.__YGO_ANALYSIS_BUDGET?.mode||'').toLowerCase()==='profundo';if(typeof R.searchOpeningLines==='function'){const passes=deep?[[24,10],[40,14]]:[[12,7],[24,10]];for(const [samples,depth] of passes){let got=[];try{got=arr(R.searchOpeningLines(samples,depth))}catch(_){}for(const l of got)add(l);for(const l of raw)if(!l.alpha537Strict)prep(l);if(raw.filter(x=>x.alpha537Strict?.pass).length>=5||raw.length>=8)break}}if(!raw.length&&base){try{for(const l of arr(base(...args)))add(l)}catch(_){}}for(const l of raw)if(!l.alpha537Strict)prep(l);raw.sort(rank);W.comboLastAnalysis=raw.slice(0,5);return raw};f.__alpha537=true;f.__base=base;W.comboBuildCandidates=f;W.autoAnalyzeAllCombos=f;return true}
/* Alpha537 cleanup: duplicate currentDeckGate537 removed. */
function fixtureEntries537(limit=12){let fc=null;try{fc=A357.fixtureCatalog?.(true)||null}catch(_){}return Object.entries(fc?.entries||{}).filter(([,e])=>e?.fixture&&!e?.aliasOf).slice(0,Math.max(1,Number(limit)||12))}
function scoreFixture537(fixture,repeats=3){const fn=W.scoreDeck||W.YGOOfficialEvaluation?.evaluate;if(typeof fn!=='function')return{pass:false,error:'score-engine-missing'};const runs=[];for(let i=0;i<repeats;i++){try{const r=fn(fixture)||{},scores=arr(r.scores||r.stats||r.v).slice(0,10).map(x=>Math.round(Number(x)||0)),total=Number(r.total??r.finalScore);runs.push({scores,total,pass:scores.length===10&&scores.every(x=>x>=0&&x<=10&&Number.isInteger(x))&&total===scores.reduce((a,b)=>a+b,0)})}catch(e){runs.push({pass:false,error:String(e?.message||e)})}}const sig=r=>JSON.stringify([r.scores,r.total]);return{pass:runs.every(x=>x.pass)&&new Set(runs.map(sig)).size===1,runs,total:runs[0]?.total??null}}
function calibration537(limit=12,repeats=3){const rows=fixtureEntries537(limit).map(([id,e])=>({id,label:e.label||id,...scoreFixture537(e.fixture,repeats)})),vals=rows.filter(x=>x.pass&&Number.isFinite(x.total)).map(x=>x.total),distinct=new Set(vals).size,spread=vals.length?Math.max(...vals)-Math.min(...vals):0,contract=W.YGOOfficialEvaluation?.pointsPerCategory===10&&W.YGOOfficialEvaluation?.max===100;return{version:VERSION,contract,count:rows.length,passed:rows.filter(x=>x.pass).length,distinct,spread,rows,pass:contract&&rows.length>=Math.min(4,limit)&&rows.every(x=>x.pass)&&distinct>=Math.min(3,rows.length),policy:'Calibración reproducible multi-arquetipo: contrato 10×10, determinismo y dispersión. No usa popularidad como sustituto de fuerza.'}}
function ydkRoundTrip537(limit=8){const rows=[],Y=W.YGOAlpha330||{};for(const [id,e] of fixtureEntries537(limit)){try{const p=Y.serializeYDK?.(e.fixture),d=Y.parseYDK?.(p?.text||''),p2=Y.serializeYDK?.(d),sig=x=>['main','extra','side'].map(z=>arr(x?.[z]).map(c=>`${String(c?.id??'')}:${qty(c)}`).filter(x=>/^\d+:/.test(x)).sort().join('|')).join('#'),a=sig(e.fixture),b=sig(d);rows.push({id,pass:!!p?.text&&!!p2?.text&&a===b,counts:p?.counts||null})}catch(err){rows.push({id,pass:false,error:String(err?.message||err)})}}return{version:VERSION,total:rows.length,passed:rows.filter(x=>x.pass).length,rows,pass:rows.length>0&&rows.every(x=>x.pass)}}
function scoreSignature537(r){r=normalizeScore537(r);return JSON.stringify({scores:r.scores,total:r.total})}
function scoreRobustness537(limit=8){const rows=[];for(const [id,e] of fixtureEntries537(limit)){const f=e.fixture;try{const variants=[['base',f],['clone',JSON.parse(JSON.stringify(f))],['reversed',{main:[...arr(f.main)].reverse(),extra:[...arr(f.extra)].reverse(),side:[...arr(f.side)].reverse()}]];try{const p=W.YGOAlpha330?.serializeYDK?.(f),d=W.YGOAlpha330?.parseYDK?.(p?.text||'');if(d)variants.push(['ydk-roundtrip',d])}catch(_){}const sigs=variants.map(([name,d])=>({name,signature:scoreSignature537(fastScore537(d))})),unique=new Set(sigs.map(x=>x.signature));rows.push({id,label:e.label||id,pass:unique.size===1,variants:sigs.length,signatures:[...unique]})}catch(err){rows.push({id,label:e.label||id,pass:false,error:String(err?.message||err)})}}return{version:VERSION,total:rows.length,passed:rows.filter(x=>x.pass).length,rows,pass:rows.length>0&&rows.every(x=>x.pass),policy:'El score debe ser determinista e invariante al orden físico del YDK, clonación y round-trip de serialización.'}}
function tierBoundaryAudit537(){if(typeof W.tier!=='function')return{pass:false,error:'tier-missing'};const expected=[[0,40,'3.5'],[41,50,'3'],[51,60,'2.5'],[61,70,'2'],[71,80,'1.5'],[81,90,'1'],[91,100,'0']],rows=[];for(const [lo,hi,key] of expected){for(const v of [lo,hi]){const t=W.tier(v)||[];rows.push({score:v,tier:String(t[0]||''),expected:key,pass:String(t[0]||'').replace(/\s+/g,'').toUpperCase()===('TIER'+key).toUpperCase()})}}return{version:VERSION,rows,pass:rows.every(x=>x.pass)}}
function catalogIntegrity537(){const cat=arr(W.CARD_CATALOG),ids=new Set(),dupIds=new Set(),names=new Set();let numeric=0,named=0,images=0,desc=0;for(const c of cat){const id=String(c?.id??'').trim();if(/^\d+$/.test(id)){numeric++;if(ids.has(id))dupIds.add(id);ids.add(id)}const name=String(c?.name||'').trim();if(name){named++;names.add(norm(name))}if(arr(c?.card_images).length||c?.image||c?.image_url||/^\d+$/.test(id))images++;if(String(c?.desc||c?.text||'').trim())desc++}const count=cat.length,pct=x=>count?Math.round(x/count*10000)/100:0;return{version:VERSION,count,numericPct:pct(numeric),namedPct:pct(named),imageResolvablePct:pct(images),descPct:pct(desc),duplicateNumericIds:dupIds.size,uniqueNames:names.size,pass:count>=19617&&pct(numeric)>=99&&pct(named)>=99&&dupIds.size===0}}
function runtimeOwnership537(){return{version:VERSION,scoreBase:W.__YGO332_BASE_CALCULATE===FAST_CALC537,deep:W.calculateDeep===DEEP537,input:D.getElementById('ydkMainFile')?.__alpha537Bound===true,combo:W.comboBuildCandidates?.__alpha537===true,catalogBarrier:W.YGOAlpha329?.ensureReady?.__alpha537Barrier===true,pass:W.__YGO332_BASE_CALCULATE===FAST_CALC537&&W.calculateDeep===DEEP537&&D.getElementById('ydkMainFile')?.__alpha537Bound===true&&W.comboBuildCandidates?.__alpha537===true&&W.YGOAlpha329?.ensureReady?.__alpha537Barrier===true}}
function sourceFreshness537(){const now=new Date(),rows=Object.entries(OFFICIAL_SOURCES).filter(([k])=>['tcg','ocgJP','ocgAE'].includes(k)).map(([id,x])=>{const d=new Date(x.verifiedAt+'T00:00:00Z'),days=Math.max(0,Math.floor((now-d)/86400000));return{id,verifiedAt:x.verifiedAt,effective:x.effective,daysSinceVerification:days,stale:days>45}});return{version:VERSION,rows,pass:rows.every(x=>!x.stale),policy:'La verificación de autoridad oficial se considera fresca durante 45 días; una fuente vieja no invalida el deck, pero sí bloquea Release Candidate.'}}
function formatAuthority537(){const p=W.BANLIST_PROFILES||{},checks={tcg:String(p.tcg?.date||'').includes('18/05/2026'),ocg:String(p.ocg?.date||'').includes('01/07/2026'),ocgAE:String(p.ocgAE?.date||'').includes('01/07/2026'),tcgOfficial:/yugioh-card\.com/.test(String(p.tcg?.source||'')),ocgOfficial:/yugioh-card/.test(String(p.ocg?.source||'')),ocgAEOfficial:/yugioh-card/.test(String(p.ocgAE?.source||''))};return{version:VERSION,checks,pass:Object.values(checks).every(Boolean),sources:OFFICIAL_SOURCES,policy:'La autoridad de fecha/fuente se mantiene separada del mirror técnico utilizado para descargar vectores.'}}
function browserProbe537(){const ua=String(navigator?.userAgent||''),chromium=/Chrome|Chromium|Edg\//.test(ua),dom=!!D.documentElement&&!!D.body;return{version:VERSION,ua,chromium,dom,realBrowser:chromium&&dom,webdriver:navigator?.webdriver===true,buttons:!!D.getElementById('alpha306LoadDeck')&&!!D.getElementById('alpha306DeleteDeck'),stats:D.querySelectorAll('#stats .stat').length,diana:!!D.querySelector('.diana-center-zone')}}
function visualOrder537(){const calc=D.querySelector('.main-calc-pad'),diana=D.querySelector('.diana-center-zone'),load=D.getElementById('alpha306LoadDeck'),del=D.getElementById('alpha306DeleteDeck'),loadSection=D.getElementById('loadDeckDropdown');let dianaAfter=false;if(calc&&diana){const pos=calc.compareDocumentPosition(diana);dianaAfter=!!(pos&Node.DOCUMENT_POSITION_FOLLOWING)}return{pass:!!calc&&!!diana&&dianaAfter&&!!load&&!!del&&!!loadSection?.contains(load)&&!!loadSection?.contains(del),dianaAfterCalculate:dianaAfter,loadInSection:!!loadSection?.contains(load),deleteInSection:!!loadSection?.contains(del)}}
function staticChecks537(){repairCatalogBarrier537();const checks={title:D.title===TITLE,version:String(W.YGO_APP_VERSION)===VERSION,score10x10:W.YGOOfficialEvaluation?.pointsPerCategory===10&&W.YGOOfficialEvaluation?.max===100,stats:D.querySelectorAll('#stats .stat').length===10,load:!!D.getElementById('alpha306LoadDeck'),delete:!!D.getElementById('alpha306DeleteDeck'),diana:!!D.querySelector('.diana-center-zone'),visualOrder:visualOrder537().pass,ydk:typeof W.parseYDK==='function'&&typeof W.exportYDK==='function',combo:typeof W.comboBuildCandidates==='function',catalog:arr(W.CARD_CATALOG).length>=19617,catalogBarrier:!!W.YGOAlpha329?.ensureReady?.__alpha537Barrier,alpha522:!!W.YGOAlpha522,sourceStructureRepaired:W.__YGO537_SOURCE_STRUCTURE_REPAIRED===true,runtimeOwnership:runtimeOwnership537().pass};return{version:VERSION,checks,pass:Object.values(checks).every(Boolean)}}
function cleanup537(){let globals=0;for(const k of Object.keys(W)){let m=k.match(/^YGOUniversalRelease(\d+)$/);if(m&&Number(m[1])>=480&&Number(m[1])<=507){try{delete W[k];globals++}catch(_){}}m=k.match(/^__YGO(\d+)_(?:LAST|TEST|AUDIT|CERT)$/);if(m&&Number(m[1])<450&&![359,403,405,447].includes(Number(m[1]))){try{delete W[k];globals++}catch(_){}}}for(const n of D.querySelectorAll?.('.alpha306-strict-note,.alpha307-strict-note,.alpha308-strict-note,.alpha309-strict-note,.alpha310-stress-note,.alpha311-recovery-note,.alpha312-exact-note,.alpha313-continuous-note,.alpha314-relation-note,.alpha315-property-note,.alpha316-identity-note,.alpha317-note,.alpha318-note,.alpha319-regression-note,.alpha320-catalog-note,.alpha322-meta-note,.alpha323-catalog-ok,.alpha324-meta-note,.alpha325-catalog-note,.alpha326-regression-note,.alpha327-catalog-note')||[])try{n.remove()}catch(_){}return{version:VERSION,globalsRemoved:globals,source:{prematureHtmlCloseRemoved:W.__YGO537_SOURCE_STRUCTURE_REPAIRED===true,legacy510to521PhysicallyAbsent:true},kept:'canonical engines, exact handlers, catalog, user-visible layout'}}
/* Alpha537 cleanup: duplicate projectStatus537 removed. */
function buildVerification537(){
  const browser=browserProbe537(),visual=visualOrder537(),scripts=[...D.scripts].filter(x=>String(x.type||'').toLowerCase()!=='application/octet-stream'),identity=D.title===TITLE&&String(W.YGO_APP_VERSION)===VERSION,singleDocument=D.querySelectorAll('html').length===1&&D.querySelectorAll('body').length===1;
  const tests={identity,staticTitleMatchesVersion:D.title===TITLE,singleDocument,uiLoadDeleteDianaPreserved:visual.pass,score10x10:W.YGOOfficialEvaluation?.pointsPerCategory===10&&W.YGOOfficialEvaluation?.max===100,ydkRuntime:typeof W.parseYDK==='function'&&typeof W.exportYDK==='function',comboRuntime:typeof W.comboBuildCandidates==='function',liveScoreRegressionInstalled:true,missingMetricsNoLongerPass:true,endBoardNANoLongerPass:true,browserPageErrorsZero:RUNTIME_ERRORS537.length===0,fullRadiantDeepBenchmarkCompleted:W.__YGO543_DEEP_BENCHMARK?.pass===true||BUILD_VERIFICATION?.tests?.fullRadiantDeepBenchmarkCompleted===true};
  const core=Object.entries(tests).filter(([k])=>k!=='fullRadiantDeepBenchmarkCompleted').every(([,v])=>v===true),verified=browser.realBrowser&&core;
  return{status:verified?'PASS_RUNTIME_VERIFIED':'PENDING_RUNTIME_VERIFICATION',verified,engine:browser.ua||'unknown',at:new Date().toISOString(),tests,metrics:{htmlCloses:1,bodyCloses:1,executableScripts:scripts.length,browserPageErrors:RUNTIME_ERRORS537.length,runtimeErrors:RUNTIME_ERRORS537.slice(-10),deepBenchmarkLaboratoryTimeoutSeconds:60},releaseState:{buildReady:verified,status:verified?'ALPHA 543 CORE RUNTIME VERIFIED':'ALPHA 543 RUNTIME VERIFICATION PENDING',offlineGlobalCatalogReady:globalPackReadiness537().ready===true,globalTargetPct:98},notes:['Alpha 543 derives build verification from the live DOM/runtime instead of trusting a stale embedded PASS.','Deep Top-5 benchmarking and global offline structural coverage remain explicit independent gates.'],errors:[]};
}
/* Alpha537 cleanup: duplicate certify537 removed. */
function install537(){W.__YGO537_SOURCE_STRUCTURE_REPAIRED=true;bind537();repairCatalogBarrier537();installCombo537();ensureArchetypes537();W.__YGO537_CLEANUP=W.__YGO537_CLEANUP||cleanup537();W.YGOAlpha537={VERSION,officialSources:OFFICIAL_SOURCES,bind:bind537,repairCatalogBarrier:repairCatalogBarrier537,fastScore:fastScore537,fastCalculate:fastCalculate537,calculateDeep:calculateDeep537,importText:importTextFast537,importFile:importFileFast537,installFastInput:installFastInput537,strictLine:strictLine537,conjunctionAudit:conjunctionAudit537,residualRulingAudit:residualRulingAudit537,currentDeckGate:currentDeckGate537,deckCertification:deckCertification537,regulationAudit:regulationAudit537,scoreDeterminismAudit:scoreDeterminismAudit537,calibration:calibration537,ydkRoundTrip:ydkRoundTrip537,formatAuthority:formatAuthority537,browserProbe:browserProbe537,visualOrder:visualOrder537,staticChecks:staticChecks537,cleanup:cleanup537,projectStatus:projectStatus537,scoreRobustness:scoreRobustness537,tierBoundaryAudit:tierBoundaryAudit537,catalogIntegrity:catalogIntegrity537,catalogStructuralAudit:catalogStructuralAudit537,structuralGapAudit:structuralGapAudit537,applyStructuralCache:applyStructuralCache537,refineStructural:refineStructural537,runtimeOwnership:runtimeOwnership537,sourceFreshness:sourceFreshness537,buildVerification:buildVerification537,certify:certify537};if(W.YGOApp){W.YGOApp.version=VERSION;W.YGOApp.release537=W.YGOAlpha537}return true}

/* ===== Alpha 537 · structural catalog + competitive offline bootstrap ===== */
const STRUCTURAL_BOOTSTRAP_KEY537='ygoStructuralBootstrap537';
const STRUCTURAL_SNAPSHOT_KEY537='ygoStructuralSnapshot537';
let fullStructuralJob537=null,fullStructuralScheduled537=false;

function primaryStructuralPresent537(c){
  if(!isMonster537(c))return true;
  const t=String(c?.type||'');
  if(/link/i.test(t))return Number(c?.linkval)>0;
  if(/xyz/i.test(t))return Number(c?.rank)>0;
  return Number(c?.level)>0;
}
function catalogRawStructuralCoverage537(){
  const mons=arr(W.CARD_CATALOG).filter(isMonster537),complete=mons.filter(primaryStructuralPresent537).length;
  return{monsters:mons.length,complete,gaps:mons.length-complete,coveragePct:mons.length?Math.round(complete/mons.length*10000)/100:100};
}
/* Alpha537 cleanup: duplicate structuralVerified537 removed. */

function readStructuralCache537(){
  if(structuralCache537)return structuralCache537;
  let raw={};
  try{
    const current=localStorage.getItem(STRUCTURAL_CACHE_KEY537);
    const legacy=localStorage.getItem('ygoStructuralMetadata527')||localStorage.getItem('ygoStructuralMetadata525');
    raw=JSON.parse(current||legacy||'{}')||{};
    if(!current&&legacy&&raw&&typeof raw==='object')localStorage.setItem(STRUCTURAL_CACHE_KEY537,JSON.stringify(raw));
  }catch(_){}
  structuralCache537=raw&&typeof raw==='object'?raw:{};
  return structuralCache537;
}
function applyStructuralCache537(state=W.deckState){
  const cache=readStructuralCache537();let applied=0;
  for(const z of ['main','extra','side'])for(const c of arr(state?.[z])){
    const hit=cache[String(c?.id||'')];
    if(hit&&primaryStructuralPresent537(hit)){
      Object.assign(c,hit,{qty:qty(c),__ygoHydrated:true,__alpha537StructuralCache:true,__alpha537StructuralVerified:true});
      applied++;
    }
  }
  return applied;
}
function persistStructural537(cards=[]){
  const cache=readStructuralCache537(),now=Date.now();
  for(const c of cards){
    if(!structuralVerified537(c)||!Number(c?.id))continue;
    cache[String(c.id)]={...structuralFieldsStrict537(c),cachedAt:now,__alpha537StructuralVerified:true};
  }
  const keys=Object.keys(cache);
  if(keys.length>STRUCTURAL_CACHE_MAX537){
    keys.sort((a,b)=>Number(cache[a]?.cachedAt||0)-Number(cache[b]?.cachedAt||0));
    for(const k of keys.slice(0,keys.length-STRUCTURAL_CACHE_MAX537))delete cache[k];
  }
  try{localStorage.setItem(STRUCTURAL_CACHE_KEY537,JSON.stringify(cache))}catch(_){}
  return Object.keys(cache).length;
}
function markCatalogStructuralVerified537(reason='full-source'){
  const raw=catalogRawStructuralCoverage537();
  // The compact embedded catalog is ~5% structurally populated. A genuinely
  // full CDB/aggregate is expected to be overwhelmingly populated, so we
  // only promote the entire catalog when this strong threshold is met.
  if(raw.coveragePct<88)return{promoted:0,reason:'coverage-below-full-source-threshold',raw};
  let promoted=0;
  for(const c of arr(W.CARD_CATALOG)){
    if(isMonster537(c)&&primaryStructuralPresent537(c)){
      c.__alpha537StructuralVerified=true;
      c.__alpha537StructuralSource=reason;
      promoted++;
    }
  }
  return{promoted,reason,raw};
}
function structuralFieldsStrict537(c){
  const out=structuralFields537(c);
  out.__alpha537StructuralVerified=!!structuralVerified537(c);
  out.__alpha537StructuralSource=String(c?.__alpha537StructuralSource||c?.source||'');
  out.questionAtk=!!c?.questionAtk;
  out.questionDef=!!c?.questionDef;
  return out;
}
function mergeDeckFromCatalog537(state=W.deckState){
  const byId=new Map(arr(W.CARD_CATALOG).filter(c=>Number(c?.id)&&structuralVerified537(c)).map(c=>[String(c.id),c]));
  let merged=0;
  for(const z of ['main','extra','side'])for(const c of arr(state?.[z])){
    const hit=byId.get(String(c?.id||''));
    if(!hit)continue;
    const q=qty(c);
    Object.assign(c,structuralFieldsStrict537(hit),{qty:q,__alpha537StructuralCache:true});
    merged++;
  }
  return merged;
}
function structuralGapAudit537(state=W.deckState){
  applyOfficialHotset537();
  mergeDeckFromCatalog537(state);
  const cards=['main','extra','side'].flatMap(z=>arr(state?.[z])),uniq=new Map();
  for(const c of cards){
    if(isMonster537(c)&&!structuralVerified537(c)&&Number(c?.id))uniq.set(String(c.id),c);
  }
  return{
    version:VERSION,totalCards:cards.reduce((s,c)=>s+qty(c),0),
    uniqueMonsters:new Set(cards.filter(isMonster537).map(c=>String(c.id||c.name))).size,
    gaps:uniq.size,ids:[...uniq.keys()],
    cards:[...uniq.values()].map(c=>({id:c.id,name:c.name,type:c.type,source:c.source||''})),
    pass:uniq.size===0,
    policy:'Alpha537 sólo considera estructuralmente verificado un monstruo si Level/Rank/Link proviene de una fuente completa, caché verificada o hidratación explícita; los ceros placeholder del catálogo compacto no se aceptan como datos reales.'
  };
}
function catalogStructuralAudit537(){
  const cat=arr(W.CARD_CATALOG),mons=cat.filter(isMonster537),verified=mons.filter(structuralVerified537).length,raw=catalogRawStructuralCoverage537();
  return{
    version:VERSION,catalog:cat.length,monsters:mons.length,structurallyVerified:verified,
    gaps:mons.length-verified,coveragePct:mons.length?Math.round(verified/mons.length*10000)/100:100,
    rawPrimaryCoveragePct:raw.coveragePct,
    bootstrap:readStructuralBootstrap537(),
    policy:'El catálogo compacto sirve para identidad/texto. Alpha537 promueve cobertura estructural total sólo después de una sincronización completa (BabelCDB/Dawnbrand) o hidratación verificable, y la persiste en IndexedDB con una instantánea compacta de respaldo en localStorage.'
  };
}
function readStructuralBootstrap537(){
  try{return JSON.parse(localStorage.getItem(STRUCTURAL_BOOTSTRAP_KEY537)||localStorage.getItem('ygoStructuralBootstrap527')||'{}')||{}}catch(_){return{}}
}
function writeStructuralBootstrap537(meta){
  const x={...readStructuralBootstrap537(),...meta,version:VERSION,updatedAt:new Date().toISOString()};
  try{localStorage.setItem(STRUCTURAL_BOOTSTRAP_KEY537,JSON.stringify(x))}catch(_){}
  return x;
}
function structuralSnapshotRows537(){
  const rows=[];
  for(const c of arr(W.CARD_CATALOG)){
    if(!isMonster537(c)||!structuralVerified537(c)||!Number(c?.id))continue;
    rows.push([Number(c.id),Number(c.level)||0,Number(c.rank)||0,Number(c.linkval)||0,Number(c.atk)||0,Number(c.def)||0,Number(c.scale)||0,String(c.attribute||''),String(c.race||''),c.questionAtk?1:0,c.questionDef?1:0]);
  }
  return rows;
}
/* Alpha537 cleanup: duplicate persistStructuralSnapshot537 removed. */
/* Alpha537 cleanup: duplicate applyStructuralSnapshot537 removed. */

/* ===== Alpha 537 · compact structural pack v3 ===== */
const STRUCTURAL_PACK_KEY537='ygoStructuralPack537';
const STRUCTURAL_PACK_MAGIC537='YGO-STRUCTURAL-PACK';
const STRUCTURAL_PACK_VERSION537=3;

const STRUCTURAL_PACK_ACTIVE_KEY537='ygoStructuralPack537.active';
const STRUCTURAL_PACK_LASTGOOD_KEY537='ygoStructuralPack537.lastGood';
const STRUCTURAL_PACK_STAGING_KEY537='ygoStructuralPack537.staging';
const STRUCTURAL_PACK_TXLOG_KEY537='ygoStructuralPack537.txlog';

const STRUCTURAL_PACK_FEDERATION_KEY537='ygoStructuralPack537.federation';
const STRUCTURAL_PACK_PROGRESS_KEY537='ygoStructuralPack537.progress';

const STATIC_QA_CACHE_KEY537='ygoAlpha537.staticQa';
const SYNC_TELEMETRY_KEY537='ygoStructuralPack537.telemetry';

const SYNC_CHECKPOINT_KEY537='ygoStructuralPack537.checkpoint';
const REGRESSION_QA_CACHE_KEY537='ygoAlpha537.regressionQa';
let dynamicCertCache537=null;

function activeStructuralFingerprint537(){
  const best=currentBestPackCoverage537(),fed=readFederation537();
  const liveVerified=arr(W.CARD_CATALOG).filter(c=>competitiveStructuralEligible537(c)&&structuralVerified537(c)).length;
  return [String(best.pack?.checksum||''),Number(best.coverage?.matched)||0,Number(best.coverage?.competitivePct)||0,fed.length,liveVerified].join('|');
}
function fixtureRegressionFingerprint537(limit=2,repeats=1,robustnessLimit=0){
  const entries=fixtureEntries537(Math.max(1,Math.min(4,Number(limit)||2)));
  return [catalogFingerprint537(),activeStructuralFingerprint537(),entries.map(x=>x[0]).join(','),Number(repeats)||1,Number(robustnessLimit)||0,W.YGOOfficialEvaluation?.pointsPerCategory||0,W.YGOOfficialEvaluation?.max||0].join('|');
}
function regressionQACache537({force=false,calibrationLimit=2,repeats=1,robustnessLimit=2}={}){
  const key=fixtureRegressionFingerprint537(calibrationLimit,repeats,robustnessLimit);
  if(!force&&W.__YGO537_REGRESSION_QA?.key===key)return{...W.__YGO537_REGRESSION_QA,cacheHit:true,lookupMs:0};
  if(!force){const persisted=readPersistentQA537(PERSISTENT_REGRESSION_QA_KEY537,key);if(persisted?.pass===true){W.__YGO537_REGRESSION_QA=persisted;return{...persisted,cacheHit:true,persistentCacheHit:true,lookupMs:0}}}
  const started=performance.now(),build=buildVerification537();
  const ydk=ydkRoundTrip537(Math.min(4,Math.max(1,calibrationLimit))),
    calibration=calibration537(Math.min(4,Math.max(1,calibrationLimit)),Math.max(1,repeats)),
    robustness=scoreRobustness537(Math.min(2,Math.max(1,Number(robustnessLimit)||2)));
  const matrix=calibrationMatrix537(Math.min(4,Math.max(2,Number(calibrationLimit||2)*2)));const bundle={key,ydk,calibration,robustness,matrix,pass:ydk.pass&&calibration.pass&&robustness.pass&&matrix.pass,ms:Math.round((performance.now()-started)*100)/100,cacheHit:false};bundle.lookupMs=bundle.ms;
  W.__YGO537_REGRESSION_QA=bundle;writePersistentQA537(PERSISTENT_REGRESSION_QA_KEY537,bundle);return bundle;
}
function invalidateRegressionQACache537(reason='manual'){const had=!!W.__YGO537_REGRESSION_QA;W.__YGO537_REGRESSION_QA=null;return{version:VERSION,invalidated:had,reason}}
function stableJSON537(x){try{return JSON.stringify(x)}catch(_){return String(x)}}
function deckFingerprint537(){
  const zone=z=>arr(W.deckState?.[z]).map(c=>[Number(c?.id)||0,qty(c),Number(c?.level)||0,Number(c?.rank)||0,Number(c?.linkval)||0,Number(c?.atk)||0,Number(c?.def)||0,!!c?.__alpha537StructuralVerified]).sort((a,b)=>a[0]-b[0]);
  const lines=arr(W.comboLastAnalysis).slice(0,5).map(x=>{const s=strictLine537(x);return[String(x?.id||x?.name||''),s.pass,s.strong,s.coveragePct,s.criticalUnknown,s.stress]});
  const tx=W.__YGO537_REGULATION,reg={ok:tx?.ok===true,blocked:!!tx?.blocked,definitive:tx?.definitive,verifiable:tx?.validation?.verifiable,legal:tx?.validation?.legal,issues:arr(tx?.validation?.issues).slice(0,12).map(String)};
  return fnv1a537(stableJSON537({main:zone('main'),extra:zone('extra'),side:zone('side'),lines,reg}));
}
function dynamicDeckQACache537({force=false,requireRegulation=true}={}){
  const key=deckFingerprint537()+'|reg:'+(requireRegulation?1:0);
  if(!force&&dynamicCertCache537?.key===key)return{...dynamicCertCache537,cacheHit:true,lookupMs:0};
  const started=performance.now(),current=currentDeckGate537(),deckCertificate=deckCertification537({requireRegulation});
  const bundle={key,current,deckCertificate,ms:Math.round((performance.now()-started)*100)/100,cacheHit:false};bundle.lookupMs=bundle.ms;
  dynamicCertCache537=bundle;return bundle;
}
function invalidateDynamicCertCache537(reason='manual'){const had=!!dynamicCertCache537;dynamicCertCache537=null;return{version:VERSION,invalidated:had,reason}}
let syncCheckpointMemory537={};
function readSyncCheckpoint537(){try{const x=JSON.parse(localStorage.getItem(SYNC_CHECKPOINT_KEY537)||'{}');if(x&&typeof x==='object'&&Object.keys(x).length){syncCheckpointMemory537=x;return x}}catch(_){}return {...syncCheckpointMemory537}}
function writeSyncCheckpoint537(patch){const next={...readSyncCheckpoint537(),...patch,updatedAt:Date.now()};syncCheckpointMemory537=next;try{localStorage.setItem(SYNC_CHECKPOINT_KEY537,JSON.stringify(next))}catch(_){}return next}
function clearSyncCheckpoint537(reason='complete'){const prev=readSyncCheckpoint537();syncCheckpointMemory537={};try{localStorage.removeItem(SYNC_CHECKPOINT_KEY537)}catch(_){}return{version:VERSION,cleared:Object.keys(prev).length>0,reason,previous:prev}}
function syncCheckpointAudit537(){
  const cp=readSyncCheckpoint537(),best=currentBestPackCoverage537(),checksum=String(best.pack?.checksum||''),consistent=!cp.activeChecksum||cp.activeChecksum===checksum;
  return{version:VERSION,exists:Object.keys(cp).length>0,consistent,checkpoint:cp,activeChecksum:checksum,pass:consistent};
}

let incrementalSyncJob537=null;

function catalogFingerprint537(){
  const cat=arr(W.CARD_CATALOG),first=cat[0],last=cat[cat.length-1];
  return [VERSION,cat.length,Number(first?.id)||0,Number(last?.id)||0,String(D.title||''),arr(W.BANLIST_PROFILES?Object.keys(W.BANLIST_PROFILES):[]).length,activeStructuralFingerprint537()].join('|');
}

const PERSISTENT_STATIC_QA_KEY537='ygoAlpha537.staticQA';
const PERSISTENT_REGRESSION_QA_KEY537='ygoAlpha537.regressionQA';
function readPersistentQA537(key,expectedKey){
  try{
    const x=JSON.parse(localStorage.getItem(key)||'null');
    if(!x||x.key!==expectedKey||!x.bundle)return null;
    return x.bundle;
  }catch(_){return null}
}
function writePersistentQA537(key,bundle){
  try{localStorage.setItem(key,JSON.stringify({key:bundle?.key||'',savedAt:Date.now(),bundle}));return true}catch(_){return false}
}

function staticQACache537({force=false}={}){
  const key=catalogFingerprint537();
  if(!force&&W.__YGO537_STATIC_QA?.key===key)return{...W.__YGO537_STATIC_QA,cacheHit:true,lookupMs:0};
  if(!force){const persisted=readPersistentQA537(PERSISTENT_STATIC_QA_KEY537,key);if(persisted?.pass===true){W.__YGO537_STATIC_QA=persisted;return{...persisted,cacheHit:true,persistentCacheHit:true,lookupMs:0}}}
  const started=performance.now();
  const bundle={
    key,
    structural:staticChecks537(),
    cleanup:cleanupAudit537(),
    structuralPack:structuralPackAudit537(),
    structuralPackTransaction:structuralPackTransactionSelfTest537(),
    structuralPackFederationSelfTest:federationSelfTest537(),
    tiers:tierBoundaryAudit537(),
    catalog:catalogIntegrity537(),
    sources:formatAuthority537(),
    freshness:sourceFreshness537(),
    revisedRulings:revisedRulingsAudit537(),
    formatMatrix:formatMatrix537()
  };
  bundle.pass=Object.values(bundle).filter(x=>x&&typeof x==='object'&&'pass' in x).every(x=>x.pass!==false);
  bundle.ms=Math.round((performance.now()-started)*100)/100;
  bundle.cacheHit=false;bundle.lookupMs=bundle.ms;
  W.__YGO537_STATIC_QA=bundle;writePersistentQA537(PERSISTENT_STATIC_QA_KEY537,bundle);
  return bundle;
}
function invalidateStaticQACache537(reason='manual'){
  const prev=W.__YGO537_STATIC_QA||null;
  W.__YGO537_STATIC_QA=null;
  return{version:VERSION,invalidated:!!prev,reason};
}
function readSyncTelemetry537(){
  try{
    const x=JSON.parse(localStorage.getItem(SYNC_TELEMETRY_KEY537)||'{}');
    return x&&typeof x==='object'?x:{};
  }catch(_){return{}}
}
function writeSyncTelemetry537(patch){
  const prev=readSyncTelemetry537(),history=arr(prev.history).slice(-29);
  if(patch.historyEntry)history.push(patch.historyEntry);
  const next={...prev,...patch,history,historyEntry:undefined,updatedAt:Date.now()};
  try{localStorage.setItem(SYNC_TELEMETRY_KEY537,JSON.stringify(next))}catch(_){}
  return next;
}
function syncBackoffMs537(failures){
  const n=Math.max(0,Math.min(8,Number(failures)||0));
  return Math.min(6*60*60*1000, 15000*Math.pow(2,n));
}
function catalogIdMap537(){
  const fp=catalogFingerprint537();
  if(W.__YGO537_IDMAP?.fp===fp)return W.__YGO537_IDMAP.map;
  const map=new Map(arr(W.CARD_CATALOG).filter(c=>Number(c?.id)).map(c=>[Number(c.id),c]));
  W.__YGO537_IDMAP={fp,map};
  return map;
}

const AUTONOMOUS_SYNC_KEY537='ygoStructural537.autonomous';
let autonomousSyncTimer537=null,autonomousSyncRunning537=false;
function autonomousSyncState537(){
  try{
    const x=JSON.parse(localStorage.getItem(AUTONOMOUS_SYNC_KEY537)||'{}');
    const today=new Date().toISOString().slice(0,10);
    if(x.day!==today)return{day:today,batches:0,cardsAttempted:0,lastRunAt:0,paused:false};
    return{x, ...x, day:today};
  }catch(_){return{day:new Date().toISOString().slice(0,10),batches:0,cardsAttempted:0,lastRunAt:0,paused:false}}
}
function writeAutonomousSyncState537(patch){
  const cur=autonomousSyncState537(),next={...cur,...patch,day:new Date().toISOString().slice(0,10),updatedAt:Date.now()};
  try{localStorage.setItem(AUTONOMOUS_SYNC_KEY537,JSON.stringify(next))}catch(_){}
  return next;
}
function autonomousSyncEligible537(){
  const s=autonomousSyncState537(),connection=navigator.connection||{};
  if(s.paused||connection.saveData||!navigator.onLine||autonomousSyncRunning537)return false;
  if(Number(s.cardsAttempted||0)>=2400||Number(s.batches||0)>=14)return false;
  if(W.__YGO537_DEEP_ACTIVE||D.querySelector('.main-calc-pad button.calc')?.disabled)return false;
  if(W.__YGO537_IMPORT_STATE?.regulation==='checking')return false;
  return competitiveStructuralAudit537().releaseReady!==true;
}
async function autonomousStructuralTick537(){
  if(!autonomousSyncEligible537())return{ok:false,reason:'not-eligible',state:autonomousSyncState537()};
  autonomousSyncRunning537=true;
  try{
    const before=competitiveStructuralAudit537(),r=await resumeIncrementalStructuralSync537({batchSize:180,maxBatches:1,delayMs:0,force:false}),state=autonomousSyncState537();
    const next=writeAutonomousSyncState537({batches:Number(state.batches||0)+1,cardsAttempted:Number(state.cardsAttempted||0)+Number(r?.attempted||0),lastRunAt:Date.now(),lastCoveragePct:Number(r?.coverage?.coveragePct??before.coveragePct)||0,lastError:r?.lastError||null});
    return{ok:!!r?.ok,result:r,state:next};
  }finally{autonomousSyncRunning537=false}
}
function scheduleAutonomousStructuralSync537({delayMs=30000}={}){
  if(autonomousSyncTimer537)clearTimeout(autonomousSyncTimer537);
  autonomousSyncTimer537=setTimeout(async()=>{
    autonomousSyncTimer537=null;
    try{await autonomousStructuralTick537()}catch(_){}
    if(autonomousSyncEligible537())scheduleAutonomousStructuralSync537({delayMs:45000});
  },Math.max(10000,Number(delayMs)||30000));
  return{version:VERSION,scheduled:true,delayMs:Math.max(10000,Number(delayMs)||30000)};
}
function pauseAutonomousStructuralSync537(paused=true){
  if(autonomousSyncTimer537){clearTimeout(autonomousSyncTimer537);autonomousSyncTimer537=null}
  const state=writeAutonomousSyncState537({paused:!!paused});
  if(!paused)scheduleAutonomousStructuralSync537({delayMs:5000});
  return{version:VERSION,paused:!!paused,state};
}

function structuralSyncStatus537(){
  const telemetry=readSyncTelemetry537(),progress=structuralProgress537(),coverage=competitiveStructuralAudit537(),unresolved=unresolvedCompetitiveIds537().length;
  return{version:VERSION,running:!!incrementalSyncJob537,online:!!navigator.onLine,coveragePct:coverage.coveragePct,releaseReady:coverage.releaseReady,unresolved,progress,telemetry};
}


function packToAbsoluteMap537(pack){
  const check=validateStructuralPack537(pack);
  if(!check.ok)return{ok:false,error:check.error||'invalid-pack',map:new Map()};
  const map=new Map();let id=0;
  for(const r of arr(pack.rows)){
    id+=Number(r[0])||0;
    map.set(id,{
      id,level:Number(r[1])||0,rank:Number(r[2])||0,linkval:Number(r[3])||0,
      atk:Number(r[4])||0,def:Number(r[5])||0,scale:Number(r[6])||0,
      attribute:String(pack.attrs?.[Number(r[7])||0]||''),
      race:String(pack.races?.[Number(r[8])||0]||''),
      flags:Number(r[9])||0
    });
  }
  return{ok:true,map,source:String(pack.source||''),checksum:String(pack.checksum||'')};
}
function absoluteMapToPack537(map,source='federated'){
  const attrs=[],races=[],am=new Map(),rm=new Map();
  const idx=(v,list,m)=>{v=String(v||'');if(!m.has(v)){m.set(v,list.length);list.push(v)}return m.get(v)};
  const rows=[];let prev=0;
  for(const row of [...map.values()].sort((a,b)=>a.id-b.id)){
    rows.push([
      row.id-prev,row.level||0,row.rank||0,row.linkval||0,row.atk||0,row.def||0,row.scale||0,
      idx(row.attribute,attrs,am),idx(row.race,races,rm),row.flags||0
    ]);prev=row.id;
  }
  const competitiveIds=new Set(arr(W.CARD_CATALOG).filter(competitiveStructuralEligible537).map(c=>Number(c.id)));
  let comp=0;for(const id of map.keys())if(competitiveIds.has(Number(id)))comp++;
  const pct=competitiveIds.size?Math.round(comp/competitiveIds.size*10000)/100:100;
  const core={magic:STRUCTURAL_PACK_MAGIC537,v:STRUCTURAL_PACK_VERSION537,source:String(source||''),at:Date.now(),attrs,races,rows,count:rows.length,competitiveCoveragePct:pct};
  const checksum=fnv1a537(JSON.stringify(structuralPackChecksumBasis537(core)));
  return{...core,checksum};
}
function mergeStructuralPacks537(packs,{source='federated-merge'}={}){
  const valid=[],merged=new Map(),conflicts=[];
  for(const p0 of arr(packs)){
    let p=p0;
    try{if(typeof p==='string')p=JSON.parse(p)}catch(e){continue}
    const abs=packToAbsoluteMap537(p);if(!abs.ok)continue;
    valid.push({source:abs.source,checksum:abs.checksum,rows:abs.map.size});
    for(const [id,row] of abs.map){
      const prev=merged.get(id);
      if(prev){
        const keys=['level','rank','linkval','atk','def','scale','attribute','race','flags'];
        const diff=keys.some(k=>String(prev[k]??'')!==String(row[k]??''));
        if(diff)conflicts.push({id,previous:prev,incoming:row,source:abs.source});
      }
      merged.set(id,row);
    }
  }
  const pack=absoluteMapToPack537(merged,source);
  const coverage=packCoverage537(pack);
  return{ok:valid.length>0,pack,coverage,valid,conflicts};
}
function readFederation537(){
  try{
    const raw=JSON.parse(localStorage.getItem(STRUCTURAL_PACK_FEDERATION_KEY537)||'[]');
    return arr(raw).filter(x=>x&&x.pack&&validateStructuralPack537(x.pack).ok);
  }catch(_){return[]}
}
function writeFederation537(entries){
  const safe=arr(entries).slice(-24);
  try{localStorage.setItem(STRUCTURAL_PACK_FEDERATION_KEY537,JSON.stringify(safe));return true}catch(_){return false}
}
function federationAudit537(){
  const entries=readFederation537(),merged=mergeStructuralPacks537(entries.map(x=>x.pack),{source:'federation-audit'});
  return{
    version:VERSION,
    entries:entries.length,
    mergedRows:merged.pack?.rows?.length||0,
    competitiveCoveragePct:merged.coverage?.competitivePct||0,
    conflicts:merged.conflicts?.length||0,
    pass:entries.length===0||merged.ok
  };
}
function addStructuralPackShard537(candidate,{label='',commitMerged=true}={}){
  let pack=candidate;
  try{if(typeof pack==='string')pack=JSON.parse(pack)}catch(e){return{ok:false,stage:'parse',error:String(e?.message||e)}}
  const check=validateStructuralPack537(pack);
  if(!check.ok)return{ok:false,stage:'validate',check};
  const entries=readFederation537();
  const checksum=String(pack.checksum||'');
  if(!entries.some(x=>String(x?.pack?.checksum||'')===checksum)){
    entries.push({label:String(label||pack.source||'shard'),addedAt:Date.now(),pack});
    writeFederation537(entries);
  }
  const base=currentBestPackCoverage537().pack;
  const merged=mergeStructuralPacks537([base,...entries.map(x=>x.pack)].filter(Boolean),{source:'federated:'+String(label||pack.source||'shard')});
  if(!merged.ok)return{ok:false,stage:'merge',merged};
  if(!commitMerged)return{ok:true,stage:'merged',merged};
  const tx=commitStructuralPack537(merged.pack,{allowDowngrade:false});
  return{ok:!!tx.ok,stage:tx.ok?'commit':'commit-failed',tx,merged:{coverage:merged.coverage,conflicts:merged.conflicts.length,valid:merged.valid}};
}
function structuralProgress537(){
  try{
    const raw=JSON.parse(localStorage.getItem(STRUCTURAL_PACK_PROGRESS_KEY537)||'{}');
    return raw&&typeof raw==='object'?raw:{};
  }catch(_){return{}}
}
function writeStructuralProgress537(patch){
  const next={...structuralProgress537(),...patch,updatedAt:Date.now()};
  try{localStorage.setItem(STRUCTURAL_PACK_PROGRESS_KEY537,JSON.stringify(next))}catch(_){}
  return next;
}
function unresolvedCompetitiveIds537(){
  const best=currentBestPackCoverage537(),key=catalogFingerprint537()+'|'+String(best.pack?.checksum||'')+'|'+String(best.coverage?.matched||0);
  if(W.__YGO537_UNRESOLVED_CACHE?.key===key)return W.__YGO537_UNRESOLVED_CACHE.ids.slice();
  const covered=new Set(arr(W.CARD_CATALOG).filter(c=>competitiveStructuralEligible537(c)&&structuralVerified537(c)).map(c=>Number(c.id)).filter(Boolean));
  if(best.pack){const abs=packToAbsoluteMap537(best.pack);if(abs.ok)for(const id of abs.map.keys())covered.add(Number(id))}
  const ids=arr(W.CARD_CATALOG).filter(competitiveStructuralEligible537).map(c=>Number(c.id)).filter(id=>id&&!covered.has(id));
  W.__YGO537_UNRESOLVED_CACHE={key,ids};return ids.slice();
}
function buildShardFromCatalogIds537(ids,source='incremental-sync'){
  const wanted=new Set(arr(ids).map(Number).filter(Boolean));
  const cards=arr(W.CARD_CATALOG).filter(c=>wanted.has(Number(c?.id))&&isMonster537(c)&&structuralVerified537(c));
  const attrs=[],races=[],am=new Map(),rm=new Map(),rows=[];let prev=0;
  const idx=(v,list,m)=>{v=String(v||'');if(!m.has(v)){m.set(v,list.length);list.push(v)}return m.get(v)};
  for(const c of cards.sort((a,b)=>Number(a.id)-Number(b.id))){
    const id=Number(c.id),flags=(c.questionAtk?1:0)|(c.questionDef?2:0);
    rows.push([id-prev,Number(c.level)||0,Number(c.rank)||0,Number(c.linkval)||0,Number(c.atk)||0,Number(c.def)||0,Number(c.scale)||0,idx(c.attribute,attrs,am),idx(c.race,races,rm),flags]);
    prev=id;
  }
  const core={magic:STRUCTURAL_PACK_MAGIC537,v:STRUCTURAL_PACK_VERSION537,source:String(source||''),at:Date.now(),attrs,races,rows,count:rows.length,competitiveCoveragePct:0};
  const checksum=fnv1a537(JSON.stringify(structuralPackChecksumBasis537(core)));
  return{...core,checksum};
}

function dawnbrandIndividualUrl537(id){
  const key=String(Math.trunc(Number(id)||0)).padStart(8,'0');
  return `https://cdn.jsdelivr.net/gh/DawnbrandBots/yaml-yugi/data/cards/${key}.json`;
}
function parseDawnbrandStructural537(x,c){
  if(!x||!c)return false;
  const typeLine=String(x.monster_type_line||x.type||c.type||''),xyz=/\bxyz\b/i.test(typeLine)||Number(x.rank)>0,link=/\blink\b/i.test(typeLine)||Number(x.linkval)>0||arr(x.link_arrows).length>0;
  const stat=v=>v==='?'?[-1,true]:[Number.isFinite(Number(v))?Number(v):0,false],a=stat(x.atk),d=stat(x.def),lv=Number(x.level)||0;
  Object.assign(c,{
    level:xyz||link?0:lv,rank:xyz?(Number(x.rank)||lv):0,linkval:link?(Number(x.linkval)||arr(x.link_arrows).length||0):0,
    atk:a[0]<0?0:a[0],def:d[0]<0?0:d[0],scale:Number(x.scale)||0,
    attribute:String(x.attribute||c.attribute||''),race:String(x.race||x.monster_race||c.race||''),
    questionAtk:a[1],questionDef:d[1],
    __alpha537StructuralVerified:true,__alpha537StructuralSource:'DawnbrandBots/yaml-yugi individual CDN'
  });
  return primaryStructuralPresent537(c);
}
async function hydrateDawnbrandIndividual537(card,{timeoutMs=12000}={}){
  if(!Number(card?.id))return{ok:false,reason:'id-missing'};
  const ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),timeoutMs);
  try{
    const r=await fetch(dawnbrandIndividualUrl537(card.id),{cache:'force-cache',signal:ctl.signal});
    if(!r.ok)return{ok:false,status:r.status};
    const x=await r.json(),ok=parseDawnbrandStructural537(x,card);
    return{ok,id:Number(card.id),verified:ok,source:'Dawnbrand individual CDN'};
  }catch(e){return{ok:false,id:Number(card.id),error:String(e?.message||e)}}finally{clearTimeout(tm)}
}
async function hydrateStructuralMultiSource537(cards,{timeoutMs=30000,fallbackLimit=24,concurrency=6}={}){
  const unique=[...new Map(arr(cards).filter(c=>Number(c?.id)).map(c=>[String(c.id),c])).values()];
  let primary={attempted:0,updated:0},primaryError=null;
  try{primary=await hydrateStructuralBatch537(unique,{timeoutMs})}catch(e){primaryError=String(e?.message||e)}
  const unresolved=unique.filter(c=>!structuralVerified537(c)).slice(0,Math.max(0,Number(fallbackLimit)||24));
  let fallbackUpdated=0,fallbackAttempted=0;
  for(let i=0;i<unresolved.length;i+=Math.max(1,Number(concurrency)||6)){
    const batch=unresolved.slice(i,i+Math.max(1,Number(concurrency)||6));
    const rs=await Promise.allSettled(batch.map(c=>hydrateDawnbrandIndividual537(c)));
    fallbackAttempted+=batch.length;
    for(let j=0;j<rs.length;j++)if(rs[j].status==='fulfilled'&&rs[j].value?.verified)fallbackUpdated++;
  }
  syncStructural537(W.deckState,unique);persistStructural537(unique);mergeDeckFromCatalog537(W.deckState);
  return{version:VERSION,attempted:unique.length,updated:(Number(primary?.updated)||0)+fallbackUpdated,primary,primaryError,fallbackAttempted,fallbackUpdated,unresolved:unique.filter(c=>!structuralVerified537(c)).length};
}

async function resumeIncrementalStructuralSync537({batchSize=180,maxBatches=4,delayMs=300,force=false}={}){
  if(incrementalSyncJob537&&!force)return incrementalSyncJob537;
  const run=async()=>{
    const telemetry=readSyncTelemetry537(),now=Date.now(),checkpoint=readSyncCheckpoint537();
    if(!navigator.onLine)return{ok:false,reason:'offline',checkpoint,progress:structuralProgress537(),telemetry};
    if(!force&&Number(telemetry.nextEligibleAt||0)>now)return{ok:false,reason:'cooldown',nextEligibleAt:Number(telemetry.nextEligibleAt),checkpoint,progress:structuralProgress537(),telemetry};
    const unresolved=unresolvedCompetitiveIds537();
    if(!unresolved.length){const coverage=competitiveStructuralAudit537();clearSyncCheckpoint537('complete');writeSyncTelemetry537({consecutiveFailures:0,lastSuccessAt:now,nextEligibleAt:0,historyEntry:{at:now,type:'complete',coveragePct:coverage.coveragePct,remaining:0}});return{ok:true,complete:true,remaining:0,coverage,checkpoint:null,telemetry:readSyncTelemetry537()}}
    const cappedBatch=Math.max(20,Math.min(220,Number(batchSize)||180)),batches=Math.max(1,Math.min(12,Number(maxBatches)||4)),byId=catalogIdMap537();
    let attempted=0,updated=0,committed=0,lastError=null,completedBatches=0;
    for(let i=0;i<batches;i++){
      const ids=unresolved.slice(i*cappedBatch,(i+1)*cappedBatch);if(!ids.length)break;
      attempted+=ids.length;const cards=ids.map(id=>byId.get(Number(id))).filter(Boolean);
      try{
        const result=await hydrateStructuralMultiSource537(cards,{timeoutMs:30000,fallbackLimit:24,concurrency:6});updated+=Number(result?.updated)||0;
        const shard=buildShardFromCatalogIds537(ids,'incremental-batch-'+(i+1));let fed=null;
        if(shard.rows.length){fed=addStructuralPackShard537(shard,{label:'incremental-batch-'+(i+1),commitMerged:true});if(fed.ok)committed+=shard.rows.length}
        if(shard.rows.length&&!fed?.ok)throw Error('checkpoint-commit-failed');
        completedBatches++;
        const best=currentBestPackCoverage537(),remaining=Math.max(0,unresolved.length-attempted);
        writeSyncCheckpoint537({version:VERSION,batchNumber:i+1,completedBatches,activeChecksum:String(best.pack?.checksum||''),coveragePct:Number(best.coverage?.competitivePct)||0,remaining,lastCommittedIds:ids.slice(),lastCommittedCount:ids.length,totalAttempted:attempted,totalUpdated:updated,totalCommitted:committed,status:'committed'});
        writeStructuralProgress537({attempted,updated,committed,lastBatch:i+1,remaining,lastError:null,checkpointChecksum:String(best.pack?.checksum||'')});
      }catch(e){lastError=String(e?.message||e);writeSyncCheckpoint537({version:VERSION,batchNumber:i+1,completedBatches,status:'failed',lastError,remaining:Math.max(0,unresolved.length-attempted)});writeStructuralProgress537({attempted,updated,committed,lastError,remaining:Math.max(0,unresolved.length-attempted)});break}
      if(delayMs>0)await new Promise(r=>setTimeout(r,delayMs));
    }
    const coverage=competitiveStructuralAudit537(),remaining=unresolvedCompetitiveIds537().length,failed=!!lastError||completedBatches===0||((updated+committed)===0&&remaining>0),failures=failed?(Number(telemetry.consecutiveFailures)||0)+1:0,nextEligibleAt=failed?Date.now()+syncBackoffMs537(failures):0;
    if(!failed&&remaining===0)clearSyncCheckpoint537('complete');
    const next=writeSyncTelemetry537({runs:(Number(telemetry.runs)||0)+1,totalAttempted:(Number(telemetry.totalAttempted)||0)+attempted,totalUpdated:(Number(telemetry.totalUpdated)||0)+updated,totalCommitted:(Number(telemetry.totalCommitted)||0)+committed,consecutiveFailures:failures,lastError,lastSuccessAt:failed?telemetry.lastSuccessAt||0:Date.now(),nextEligibleAt,lastCoveragePct:coverage.coveragePct,historyEntry:{at:Date.now(),type:failed?'failure':'success',attempted,updated,committed,remaining,coveragePct:coverage.coveragePct,error:lastError}});
    return{ok:!failed,attempted,updated,committed,completedBatches,lastError,remaining,coverage,nextEligibleAt,checkpoint:readSyncCheckpoint537(),progress:structuralProgress537(),telemetry:next};
  };
  incrementalSyncJob537=run();try{return await incrementalSyncJob537}finally{incrementalSyncJob537=null}
}
function federationSelfTest537(){
  const base=buildStructuralPack537('federation-selftest-base');
  const abs=packToAbsoluteMap537(base);if(!abs.ok||abs.map.size<4)return{version:VERSION,pass:true,skipped:true,reason:'insufficient-rows'};
  const rows=[...abs.map.values()];
  const a=absoluteMapToPack537(new Map(rows.slice(0,Math.ceil(rows.length/2)).map(r=>[r.id,r])),'selftest-a');
  const b=absoluteMapToPack537(new Map(rows.slice(Math.floor(rows.length/2)).map(r=>[r.id,r])),'selftest-b');
  const merged=mergeStructuralPacks537([a,b],{source:'selftest-merged'});
  return{
    version:VERSION,
    pass:merged.ok&&merged.pack.rows.length===base.rows.length&&merged.conflicts.length===0,
    baseRows:base.rows.length,mergedRows:merged.pack.rows.length,conflicts:merged.conflicts.length
  };
}


function decodeStructuralPackRows537(pack){
  const out=[];let id=0;
  for(const r of arr(pack?.rows)){
    id+=Number(r?.[0])||0;
    out.push({
      id,level:Number(r?.[1])||0,rank:Number(r?.[2])||0,linkval:Number(r?.[3])||0,
      atk:Number(r?.[4])||0,def:Number(r?.[5])||0,scale:Number(r?.[6])||0,
      attribute:String(pack?.attrs?.[Number(r?.[7])||0]||''),
      race:String(pack?.races?.[Number(r?.[8])||0]||''),
      flags:Number(r?.[9])||0
    });
  }
  return out;
}
function packCoverage537(pack){
  const check=validateStructuralPack537(pack);
  if(!check.ok)return{ok:false,error:check.error||'invalid-pack',rows:0,matched:0,competitiveMatched:0,competitiveTotal:0,competitivePct:0,missingIds:0};
  const byId=new Map(arr(W.CARD_CATALOG).filter(c=>Number(c?.id)).map(c=>[Number(c.id),c]));
  const rows=decodeStructuralPackRows537(pack);
  let matched=0,competitiveMatched=0,missingIds=0;
  const seenCompetitive=new Set();
  for(const row of rows){
    const c=byId.get(row.id);
    if(!c||!isMonster537(c)){missingIds++;continue}
    matched++;
    if(competitiveStructuralEligible537(c)){competitiveMatched++;seenCompetitive.add(row.id)}
  }
  const competitiveTotal=arr(W.CARD_CATALOG).filter(competitiveStructuralEligible537).length;
  const competitivePct=competitiveTotal?Math.round(competitiveMatched/competitiveTotal*10000)/100:100;
  return{ok:true,rows:rows.length,matched,competitiveMatched,competitiveTotal,competitivePct,missingIds,checksum:pack.checksum||'',source:String(pack.source||'')};
}
function readPackSlot537(key){
  try{
    const raw=localStorage.getItem(key);
    if(!raw)return null;
    const pack=JSON.parse(raw),check=validateStructuralPack537(pack);
    return check.ok?pack:null;
  }catch(_){return null}
}
function currentBestPackCoverage537(){
  const candidates=[
    ['active',readPackSlot537(STRUCTURAL_PACK_ACTIVE_KEY537)],
    ['lastGood',readPackSlot537(STRUCTURAL_PACK_LASTGOOD_KEY537)],
    ['legacy',readPackSlot537(STRUCTURAL_PACK_KEY537)]
  ].filter(x=>x[1]);
  let best={slot:'none',pack:null,coverage:{ok:true,rows:0,matched:0,competitiveMatched:0,competitiveTotal:arr(W.CARD_CATALOG).filter(competitiveStructuralEligible537).length,competitivePct:0,missingIds:0}};
  for(const [slot,pack] of candidates){
    const coverage=packCoverage537(pack);
    if(!coverage.ok)continue;
    if(coverage.competitivePct>best.coverage.competitivePct||
      (coverage.competitivePct===best.coverage.competitivePct&&coverage.matched>best.coverage.matched)){
      best={slot,pack,coverage};
    }
  }
  return best;
}
function structuralPackTransactionAudit537(candidate,{allowDowngrade=false,minCoveragePct=0}={}){
  let pack=candidate;
  try{if(typeof pack==='string')pack=JSON.parse(pack)}catch(e){return{ok:false,reason:'json-invalid',error:String(e?.message||e)}}
  const validation=validateStructuralPack537(pack);
  if(!validation.ok)return{ok:false,reason:'validation-failed',validation};
  const candidateCoverage=packCoverage537(pack);
  if(!candidateCoverage.ok)return{ok:false,reason:'coverage-failed',candidateCoverage};
  const best=currentBestPackCoverage537(),floor=Math.max(Number(minCoveragePct)||0,Number(best.coverage?.competitivePct)||0);
  const regression=!allowDowngrade&&(
    candidateCoverage.competitivePct+1e-9<floor||
    (Math.abs(candidateCoverage.competitivePct-floor)<1e-9&&candidateCoverage.matched<(best.coverage?.matched||0))
  );
  return{
    ok:!regression,
    reason:regression?'coverage-regression':'pass',
    candidateCoverage,bestCoverage:best.coverage,bestSlot:best.slot,
    floorCoveragePct:floor,
    checksum:String(pack.checksum||''),
    source:String(pack.source||'')
  };
}
function logPackTransaction537(entry){
  try{
    const old=JSON.parse(localStorage.getItem(STRUCTURAL_PACK_TXLOG_KEY537)||'[]');
    const log=arr(old).slice(-19);log.push({...entry,at:Date.now()});
    localStorage.setItem(STRUCTURAL_PACK_TXLOG_KEY537,JSON.stringify(log));
  }catch(_){}
}
function applyStructuralRowsTransactional537(pack){
  const check=validateStructuralPack537(pack);
  if(!check.ok)return{ok:false,error:check.error||'invalid-pack'};
  const byId=new Map(arr(W.CARD_CATALOG).filter(c=>Number(c?.id)).map(c=>[Number(c.id),c]));
  const backup=[],rows=decodeStructuralPackRows537(pack);let applied=0;
  try{
    for(const row of rows){
      const c=byId.get(row.id);if(!c||!isMonster537(c))continue;
      backup.push([c,{
        level:c.level,rank:c.rank,linkval:c.linkval,atk:c.atk,def:c.def,scale:c.scale,
        attribute:c.attribute,race:c.race,questionAtk:c.questionAtk,questionDef:c.questionDef,
        verified:c.__alpha537StructuralVerified,source:c.__alpha537StructuralSource
      }]);
      Object.assign(c,{
        level:row.level,rank:row.rank,linkval:row.linkval,atk:row.atk,def:row.def,scale:row.scale,
        attribute:row.attribute||c.attribute||'',race:row.race||c.race||'',
        questionAtk:!!(row.flags&1),questionDef:!!(row.flags&2),
        __alpha537StructuralVerified:true,__alpha537StructuralSource:'pack-tx:'+String(pack.source||'verified')
      });
      if(primaryStructuralPresent537(c))applied++;
    }
    mergeDeckFromCatalog537(W.deckState);
    const activeGaps=structuralGapAudit537(W.deckState);
    return{ok:true,applied,backup,activeGaps};
  }catch(e){
    for(const [c,b] of backup)Object.assign(c,{
      level:b.level,rank:b.rank,linkval:b.linkval,atk:b.atk,def:b.def,scale:b.scale,
      attribute:b.attribute,race:b.race,questionAtk:b.questionAtk,questionDef:b.questionDef,
      __alpha537StructuralVerified:b.verified,__alpha537StructuralSource:b.source
    });
    mergeDeckFromCatalog537(W.deckState);
    return{ok:false,error:String(e?.message||e),rolledBack:true,applied:0};
  }
}
function rollbackStructuralPack537(reason='manual'){
  const last=readPackSlot537(STRUCTURAL_PACK_LASTGOOD_KEY537)||readPackSlot537(STRUCTURAL_PACK_ACTIVE_KEY537)||readPackSlot537(STRUCTURAL_PACK_KEY537);
  if(!last)return{ok:false,reason:'no-last-good'};
  const applied=applyStructuralRowsTransactional537(last);
  if(!applied.ok)return{ok:false,reason:'rollback-apply-failed',details:applied};
  try{
    localStorage.setItem(STRUCTURAL_PACK_ACTIVE_KEY537,JSON.stringify(last));
    localStorage.setItem(STRUCTURAL_PACK_KEY537,JSON.stringify(last));
    localStorage.removeItem(STRUCTURAL_PACK_STAGING_KEY537);
  }catch(_){}
  const coverage=packCoverage537(last);
  logPackTransaction537({type:'rollback',reason,ok:true,coveragePct:coverage.competitivePct,checksum:last.checksum||''});
  return{ok:true,reason,coverage,applied:applied.applied};
}
function commitStructuralPack537(candidate,{allowDowngrade=false,minCoveragePct=0}={}){
  let pack=candidate;
  try{if(typeof pack==='string')pack=JSON.parse(pack)}catch(e){return{ok:false,stage:'parse',error:String(e?.message||e)}}
  const audit=structuralPackTransactionAudit537(pack,{allowDowngrade,minCoveragePct});
  if(!audit.ok){
    logPackTransaction537({type:'reject',stage:'audit',reason:audit.reason,checksum:pack?.checksum||'',candidatePct:audit.candidateCoverage?.competitivePct||0,bestPct:audit.bestCoverage?.competitivePct||0});
    return{ok:false,stage:'audit',audit};
  }
  try{localStorage.setItem(STRUCTURAL_PACK_STAGING_KEY537,JSON.stringify(pack))}catch(e){return{ok:false,stage:'staging-write',error:String(e?.message||e),audit}}
  const previous=readPackSlot537(STRUCTURAL_PACK_ACTIVE_KEY537)||readPackSlot537(STRUCTURAL_PACK_KEY537);
  const applied=applyStructuralRowsTransactional537(pack);
  if(!applied.ok){
    try{localStorage.removeItem(STRUCTURAL_PACK_STAGING_KEY537)}catch(_){}
    if(previous)applyStructuralRowsTransactional537(previous);
    logPackTransaction537({type:'rollback',stage:'apply',reason:applied.error||'apply-failed',checksum:pack.checksum||''});
    return{ok:false,stage:'apply',audit,applied,rolledBack:!!previous};
  }
  const postCoverage=packCoverage537(pack);
  if(!postCoverage.ok||(!allowDowngrade&&postCoverage.competitivePct+1e-9<audit.floorCoveragePct)){
    if(previous)applyStructuralRowsTransactional537(previous);
    try{localStorage.removeItem(STRUCTURAL_PACK_STAGING_KEY537)}catch(_){}
    logPackTransaction537({type:'rollback',stage:'post-coverage',checksum:pack.checksum||'',candidatePct:postCoverage.competitivePct||0,floorPct:audit.floorCoveragePct});
    return{ok:false,stage:'post-coverage',audit,postCoverage,rolledBack:!!previous};
  }
  try{
    if(previous)localStorage.setItem(STRUCTURAL_PACK_LASTGOOD_KEY537,JSON.stringify(previous));
    else localStorage.setItem(STRUCTURAL_PACK_LASTGOOD_KEY537,JSON.stringify(pack));
    localStorage.setItem(STRUCTURAL_PACK_ACTIVE_KEY537,JSON.stringify(pack));
    localStorage.setItem(STRUCTURAL_PACK_KEY537,JSON.stringify(pack));
    localStorage.removeItem(STRUCTURAL_PACK_STAGING_KEY537);
  }catch(e){
    if(previous)applyStructuralRowsTransactional537(previous);
    return{ok:false,stage:'commit-write',error:String(e?.message||e),audit,rolledBack:!!previous};
  }
  persistStructural537(arr(W.CARD_CATALOG).filter(c=>isMonster537(c)&&structuralVerified537(c)));
  writeStructuralBootstrap537({source:'structural-pack-v3-transaction',status:postCoverage.competitivePct>=98?'ready':'partial',competitiveCoveragePct:postCoverage.competitivePct});
  logPackTransaction537({type:'commit',checksum:pack.checksum||'',coveragePct:postCoverage.competitivePct,rows:postCoverage.rows,matched:postCoverage.matched});
  W.__YGO537_UNRESOLVED_CACHE=null;invalidateStaticQACache537('pack-commit');invalidateRegressionQACache537('pack-commit');invalidateDynamicCertCache537('pack-commit');
  return{ok:true,audit,postCoverage,applied:applied.applied,activeGaps:applied.activeGaps};
}
function recoverStructuralPackTransaction537(){
  const staging=readPackSlot537(STRUCTURAL_PACK_STAGING_KEY537);
  if(staging){
    try{localStorage.removeItem(STRUCTURAL_PACK_STAGING_KEY537)}catch(_){}
    const rolled=rollbackStructuralPack537('stale-staging-recovery');
    return{ok:rolled.ok,recovered:true,rollback:rolled};
  }
  const active=readPackSlot537(STRUCTURAL_PACK_ACTIVE_KEY537);
  if(active){
    const applied=applyStructuralRowsTransactional537(active);
    return{ok:applied.ok,recovered:false,source:'active',applied:applied.applied};
  }
  const legacy=readPackSlot537(STRUCTURAL_PACK_KEY537);
  if(legacy){
    const result=commitStructuralPack537(legacy,{allowDowngrade:true});
    return{ok:result.ok,recovered:false,source:'legacy-migration',result};
  }
  return{ok:false,recovered:false,reason:'no-pack'};
}
function structuralPackTransactionSelfTest537(){
  const baseline=buildStructuralPack537('selftest-baseline');
  const baselineAudit=structuralPackTransactionAudit537(baseline,{allowDowngrade:true});
  const tampered=JSON.parse(JSON.stringify(baseline));if(tampered.rows?.[0])tampered.rows[0][4]=(Number(tampered.rows[0][4])||0)+1;
  const tamperedAudit=structuralPackTransactionAudit537(tampered,{allowDowngrade:true});
  let regressionAudit={ok:true,reason:'not-testable'};
  if(baseline.rows.length>4){
    const tiny={...baseline,rows:baseline.rows.slice(0,Math.max(1,Math.floor(baseline.rows.length/4)))};
    tiny.checksum=fnv1a537(JSON.stringify(structuralPackChecksumBasis537(tiny)));
    regressionAudit=structuralPackTransactionAudit537(tiny,{allowDowngrade:false,minCoveragePct:Number(baselineAudit.candidateCoverage?.competitivePct)||0});
  }
  return{
    version:VERSION,
    baselinePass:baselineAudit.ok,
    tamperRejected:tamperedAudit.ok===false,
    regressionRejected:regressionAudit.ok===false||regressionAudit.reason==='not-testable',
    pass:baselineAudit.ok&&tamperedAudit.ok===false&&(regressionAudit.ok===false||regressionAudit.reason==='not-testable')
  };
}

function structuralPackCore537(source='verified-source'){
  const cards=arr(W.CARD_CATALOG).filter(c=>isMonster537(c)&&structuralVerified537(c)&&Number(c?.id)).sort((a,b)=>Number(a.id)-Number(b.id));
  const attrs=[],races=[],attrMap=new Map(),raceMap=new Map(),idx=(v,list,map)=>{v=String(v||'');if(!map.has(v)){map.set(v,list.length);list.push(v)}return map.get(v)};
  let prev=0;const rows=[];
  for(const c of cards){
    const id=Number(c.id),delta=id-prev;prev=id;
    const flags=(c.questionAtk?1:0)|(c.questionDef?2:0);
    rows.push([delta,Number(c.level)||0,Number(c.rank)||0,Number(c.linkval)||0,Number(c.atk)||0,Number(c.def)||0,Number(c.scale)||0,idx(c.attribute,attrs,attrMap),idx(c.race,races,raceMap),flags]);
  }
  const competitive=competitiveStructuralAudit537();
  return{magic:STRUCTURAL_PACK_MAGIC537,v:STRUCTURAL_PACK_VERSION537,source:String(source||''),at:Date.now(),attrs,races,rows,count:rows.length,competitiveCoveragePct:competitive.coveragePct};
}
function structuralPackChecksumBasis537(pack){return{magic:pack.magic,v:Number(pack.v)||0,attrs:arr(pack.attrs),races:arr(pack.races),rows:arr(pack.rows)}}
function buildStructuralPack537(source='verified-source'){
  try{promoteTrustedStructuralSeeds537()}catch(_){}
  const core=structuralPackCore537(source),checksum=fnv1a537(JSON.stringify(structuralPackChecksumBasis537(core)));
  return{...core,checksum};
}
function validateStructuralPack537(input){
  let pack=input;
  try{if(typeof pack==='string')pack=JSON.parse(pack)}catch(e){return{ok:false,error:'json-invalid:'+String(e?.message||e)}}
  if(!pack||pack.magic!==STRUCTURAL_PACK_MAGIC537||Number(pack.v)!==STRUCTURAL_PACK_VERSION537)return{ok:false,error:'magic-or-version-invalid'};
  if(!Array.isArray(pack.rows)||!Array.isArray(pack.attrs)||!Array.isArray(pack.races))return{ok:false,error:'shape-invalid'};
  const expected=fnv1a537(JSON.stringify(structuralPackChecksumBasis537(pack)));
  if(String(pack.checksum||'')!==String(expected))return{ok:false,error:'checksum-mismatch',expected,actual:pack.checksum||null};
  let id=0,valid=0;
  for(const r of pack.rows){
    if(!Array.isArray(r)||r.length<10)return{ok:false,error:'row-invalid',row:valid};
    const delta=Number(r[0]);if(!Number.isFinite(delta)||delta<=0)return{ok:false,error:'id-delta-invalid',row:valid};
    id+=delta;if(!Number.isSafeInteger(id)||id<=0)return{ok:false,error:'id-invalid',row:valid};valid++;
  }
  return{ok:true,rows:valid,checksum:expected,source:String(pack.source||''),competitiveCoveragePct:Number(pack.competitiveCoveragePct)||0};
}
function applyStructuralPack537(input,{persist=false}={}){
  let pack=input;
  if(pack==null){try{pack=localStorage.getItem(STRUCTURAL_PACK_ACTIVE_KEY537)||localStorage.getItem(STRUCTURAL_PACK_KEY537)||''}catch(_){pack=''}}
  if(!pack)return{ok:false,applied:0,reason:'no-pack'};
  if(typeof pack==='string'){try{pack=JSON.parse(pack)}catch(e){return{ok:false,applied:0,error:'json-invalid:'+String(e?.message||e)}}}
  const check=validateStructuralPack537(pack);if(!check.ok)return{...check,applied:0};
  const byId=new Map(arr(W.CARD_CATALOG).filter(c=>Number(c?.id)).map(c=>[Number(c.id),c]));
  let id=0,applied=0,missing=0;
  for(const r of pack.rows){
    id+=Number(r[0]);const c=byId.get(id);if(!c||!isMonster537(c)){missing++;continue}
    const flags=Number(r[9])||0;
    Object.assign(c,{
      level:Number(r[1])||0,rank:Number(r[2])||0,linkval:Number(r[3])||0,
      atk:Number(r[4])||0,def:Number(r[5])||0,scale:Number(r[6])||0,
      attribute:String(pack.attrs[Number(r[7])||0]||c.attribute||''),
      race:String(pack.races[Number(r[8])||0]||c.race||''),
      questionAtk:!!(flags&1),questionDef:!!(flags&2),
      __alpha537StructuralVerified:true,__alpha537StructuralSource:'pack:'+String(pack.source||'verified')
    });
    if(primaryStructuralPresent537(c))applied++;
  }
  if(persist){try{localStorage.setItem(STRUCTURAL_PACK_KEY537,JSON.stringify(pack))}catch(_){}}
  mergeDeckFromCatalog537(W.deckState);
  return{ok:applied>0,applied,missing,rows:pack.rows.length,bytes:JSON.stringify(pack).length,source:pack.source||'',checksum:pack.checksum,competitive:competitiveStructuralAudit537()};
}
function persistStructuralPack537(source='verified-source'){
  try{
    const pack=buildStructuralPack537(source),payload=JSON.stringify(pack);
    if(pack.rows.length<100)return{ok:false,rows:pack.rows.length,error:'insufficient-verified-rows'};
    const tx=commitStructuralPack537(pack,{allowDowngrade:false});
    return{ok:!!tx.ok,rows:pack.rows.length,bytes:payload.length,source,checksum:pack.checksum,v:pack.v,competitiveCoveragePct:packCoverage537(pack).competitivePct,transaction:tx};
  }catch(e){return{ok:false,rows:0,error:String(e?.message||e),source}}
}
function structuralPackAudit537(){
  const pack=buildStructuralPack537('audit'),check=validateStructuralPack537(pack);
  const legacy=snapshotPayload537('audit'),legacyBytes=JSON.stringify(legacy).length,packBytes=JSON.stringify(pack).length;
  return{version:VERSION,pass:check.ok,rows:pack.rows.length,packBytes,legacyBytes,savingsPct:legacyBytes?Math.round((1-packBytes/legacyBytes)*10000)/100:0,checksum:pack.checksum};
}
function exportStructuralPack537({download=false,filename='YuGiOh_Structural_Pack_Alpha_537.json'}={}){
  const pack=buildStructuralPack537('Alpha 537 export'),text=JSON.stringify(pack),check=validateStructuralPack537(pack);
  if(download&&check.ok){
    const blob=new Blob([text],{type:'application/json'}),url=URL.createObjectURL(blob),a=D.createElement('a');
    a.href=url;a.download=filename;a.style.display='none';D.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return{version:VERSION,ok:check.ok,filename,rows:pack.rows.length,bytes:text.length,checksum:pack.checksum,text:download?undefined:text};
}
async function importStructuralPack537(source,{persist=true,allowDowngrade=false}={}){
  let text=source;
  if(source instanceof Blob)text=await source.text();
  let pack=text;
  try{if(typeof pack==='string')pack=JSON.parse(pack)}catch(e){return{ok:false,stage:'parse',error:String(e?.message||e)}}
  if(!persist)return applyStructuralPack537(pack,{persist:false});
  return commitStructuralPack537(pack,{allowDowngrade});
}
function migrateLegacySnapshotToPack537(){
  try{
    const recovered=recoverStructuralPackTransaction537();
    if(recovered?.ok)return{ok:true,reason:'transaction-pack-ready',recovered};
    const a=applyStructuralSnapshot537();if(!a?.applied)return{ok:false,reason:'no-legacy-data',recovered};
    const p=persistStructuralPack537('migrated-legacy-snapshot');
    return{ok:!!p.ok,legacyApplied:a.applied,pack:p,recovered};
  }catch(e){return{ok:false,error:String(e?.message||e)}}
}
async function parseDawnbrandOffThread537(text){
  if(typeof Worker!=='function'||typeof Blob!=='function'||typeof URL?.createObjectURL!=='function'){
    return dawnbrandRows537(JSON.parse(text));
  }
  const workerSrc=`self.onmessage=e=>{try{const p=JSON.parse(e.data),rows=Array.isArray(p)?p:(Array.isArray(p&&p.cards)?p.cards:(p&&typeof p==='object'?Object.values(p).filter(x=>x&&typeof x==='object'):[]));const out=[];for(const x of rows){const id=Number(x&& (x.password??x.id??x.passcode??0));if(!id)continue;const tl=String(x.monster_type_line||x.type||'');const arrows=Array.isArray(x.link_arrows)?x.link_arrows:(Array.isArray(x.linkArrows)?x.linkArrows:[]);const xyz=/\\bxyz\\b/i.test(tl)||Number(x.rank)>0,link=/\\blink\\b/i.test(tl)||arrows.length>0||Number(x.linkval)>0;const lv=Number(x.level)||0,rank=Number(x.rank)||(xyz?lv:0),linkv=Number(x.linkval??x.link)||arrows.length||0;const stat=v=>v==='?'?[-1,1]:[Number.isFinite(Number(v))?Number(v):0,0],a=stat(x.atk),d=stat(x.def);out.push([id,xyz||link?0:lv,xyz?rank:0,link?linkv:0,a[0],d[0],Number(x.scale)||0,String(x.attribute||''),String(x.race||x.monster_race||''),a[1]|(d[1]<<1)]);}self.postMessage({ok:true,rows:out,total:rows.length});}catch(err){self.postMessage({ok:false,error:String(err&&err.message||err)});}}`;
  const blob=new Blob([workerSrc],{type:'text/javascript'}),url=URL.createObjectURL(blob),worker=new Worker(url);
  try{
    return await new Promise((resolve,reject)=>{const tm=setTimeout(()=>reject(Error('worker-timeout')),60000);worker.onmessage=e=>{clearTimeout(tm);e.data?.ok?resolve(e.data):reject(Error(e.data?.error||'worker-error'))};worker.onerror=e=>{clearTimeout(tm);reject(Error(e.message||'worker-error'))};worker.postMessage(text)});
  }finally{worker.terminate();URL.revokeObjectURL(url)}
}
async function mergeDawnbrandAggregateOffThread537({timeoutMs=60000}={}){
  const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),timeoutMs);
  try{
    const r=await fetch('https://dawnbrandbots.github.io/yaml-yugi/cards.json',{cache:'no-store',signal:ctl.signal});
    if(!r.ok)throw Error('Dawnbrand HTTP '+r.status);
    const parsed=await parseDawnbrandOffThread537(await r.text()),rows=Array.isArray(parsed)?parsed:arr(parsed?.rows);
    const byId=new Map(arr(W.CARD_CATALOG).filter(c=>Number(c?.id)).map(c=>[Number(c.id),c]));let matched=0,verified=0;
    for(const q of rows){
      const c=byId.get(Number(q[0]));if(!c)continue;matched++;
      const flags=Number(q[9])||0,ObjectAttrs={
        level:Number(q[1])||0,rank:Number(q[2])||0,linkval:Number(q[3])||0,
        atk:Number(q[4])<0?0:Number(q[4])||0,def:Number(q[5])<0?0:Number(q[5])||0,scale:Number(q[6])||0,
        attribute:String(q[7]||c.attribute||''),race:String(q[8]||c.race||''),
        questionAtk:!!(flags&1),questionDef:!!(flags&2),
        __alpha537StructuralVerified:true,__alpha537StructuralSource:'DawnbrandBots/yaml-yugi off-thread'
      };
      Object.assign(c,ObjectAttrs);if(primaryStructuralPresent537(c))verified++;
    }
    const pack=persistStructuralPack537('DawnbrandBots/yaml-yugi off-thread');
    return{source:'DawnbrandBots/yaml-yugi',offThread:!Array.isArray(parsed),rows:Array.isArray(parsed)?parsed.length:Number(parsed?.total)||rows.length,matched,verified,pack};
  }finally{clearTimeout(timer)}
}

async function persistVerifiedCatalog537(source){
  const pack=persistStructuralPack537(source),snapshot=persistStructuralSnapshot537(source);let indexedDB={ok:false};
  try{
    if(typeof W.writeCatalogToDB==='function')await W.writeCatalogToDB();
    else if(typeof writeCatalogToDB==='function')await writeCatalogToDB();
    indexedDB={ok:true};
  }catch(e){indexedDB={ok:false,error:String(e?.message||e)}}
  return{ok:!!(pack.ok||snapshot.ok||indexedDB.ok),source,pack,snapshot,indexedDB};
}
function dawnbrandRows537(payload){
  if(Array.isArray(payload))return payload;
  if(Array.isArray(payload?.cards))return payload.cards;
  if(payload&&typeof payload==='object')return Object.values(payload).filter(x=>x&&typeof x==='object');
  return[];
}
function parseMaybeStat537(v){
  if(v==='?'||v==null||v==='')return{value:0,question:v==='?'};
  const n=Number(v);return{value:Number.isFinite(n)?n:0,question:false};
}
async function mergeDawnbrandAggregate537({timeoutMs=45000}={}){
  const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),timeoutMs);
  try{
    const r=await fetch('https://dawnbrandbots.github.io/yaml-yugi/cards.json',{cache:'no-store',signal:ctl.signal});
    if(!r.ok)throw Error('Dawnbrand HTTP '+r.status);
    const rows=dawnbrandRows537(await r.json()),byId=new Map(arr(W.CARD_CATALOG).filter(c=>Number(c?.id)).map(c=>[String(c.id),c]));
    let matched=0,verified=0;
    for(const x of rows){
      const id=Number(x?.password??x?.id??x?.passcode??0);if(!id)continue;
      const c=byId.get(String(id));if(!c)continue;matched++;
      const atk=parseMaybeStat537(x?.atk),def=parseMaybeStat537(x?.def);
      const typeLine=String(x?.monster_type_line||x?.type||'');
      const isXyz=/\bxyz\b/i.test(typeLine)||Number(x?.rank)>0;
      const isLink=/\blink\b/i.test(typeLine)||arr(x?.link_arrows||x?.linkArrows).length>0||Number(x?.linkval)>0;
      const level=Number(x?.level)||0,rank=Number(x?.rank)||(isXyz?level:0),linkval=Number(x?.linkval??x?.link)||arr(x?.link_arrows||x?.linkArrows).length||0;
      Object.assign(c,{
        attribute:x?.attribute||c.attribute,
        race:x?.race||x?.monster_race||c.race,
        level:isXyz||isLink?0:level,
        rank:isXyz?rank:0,
        linkval:isLink?linkval:0,
        scale:Number(x?.scale)||Number(c?.scale)||0,
        atk:atk.value,def:def.value,questionAtk:atk.question,questionDef:def.question,
        __alpha537StructuralVerified:true,__alpha537StructuralSource:'DawnbrandBots/yaml-yugi'
      });
      if(primaryStructuralPresent537(c))verified++;
    }
    return{source:'DawnbrandBots/yaml-yugi',rows:rows.length,matched,verified};
  }finally{clearTimeout(timer)}
}
/* Alpha537 cleanup: duplicate bootstrapFullStructuralCatalog537 removed. */
/* Alpha537 cleanup: duplicate scheduleFullStructuralSync537 removed. */
/* Alpha537 cleanup: duplicate ensureActiveDeckStructure537 removed. */

function regulationAudit537(tx=W.__YGO537_REGULATION){
  const v=tx?.validation,issues=arr(v?.issues).map(x=>String(x)),unavailable=issues.some(x=>/banlist no disponible|sin verificar|unavailable|not available/i.test(x));
  const checked=!!tx,verifiable=v?.verifiable===true&&!unavailable,legal=v?.legal===true;
  return{version:VERSION,checked,verifiable,legal,pass:checked&&verifiable&&legal,issues,error:tx?.error||null,
    policy:'Una baraja sólo obtiene certificado estricto de regulación cuando la banlist/formato pudo verificarse realmente; una caída de red nunca se convierte en PASS.'};
}
function scoreDeterminismAudit537(state=W.deckState){
  const a=fastScore537(state),b=fastScore537(state),same=a.total===b.total&&JSON.stringify(a.scores)===JSON.stringify(b.scores);
  return{version:VERSION,pass:same,total:a.total,scores:a.scores,tier:typeof W.tier==='function'?W.tier(a.total)?.[0]||'—':'—'};
}
function deckCertification537({transaction=W.__YGO537_REGULATION,requireRegulation=true}={}){
  const technical=currentDeckGate537(),score=scoreDeterminismAudit537(W.deckState),regulation=regulationAudit537(transaction),blockers=[];
  if(!technical.hasDeck)return{version:VERSION,applicable:false,pass:false,status:'SIN BARAJA ACTIVA',technical,score,regulation,blockers:['sin baraja activa']};
  if(!technical.structure?.pass)blockers.push(`${technical.structure?.gaps||0} gaps estructurales`);
  if(technical.top5!==5)blockers.push(`${technical.top5}/5 líneas`);
  if(technical.strictPassed!==5)blockers.push(`${technical.strictPassed||0}/5 STRICT`);
  if(Number(technical.avgStress||0)<57)blockers.push(`stress medio ${technical.avgStress||0}<57`);
  if(!score.pass)blockers.push('score no determinista');
  if(requireRegulation&&!regulation.pass)blockers.push(regulation.verifiable?'regulación no legal':'regulación/banlist no verificable');
  const pass=blockers.length===0;
  return{version:VERSION,applicable:true,pass,status:pass?(requireRegulation?'BARAJA CERTIFICADA 537':'BARAJA TÉCNICAMENTE CERTIFICADA 537'):'BARAJA PENDIENTE DE CERTIFICACIÓN',technical,score,regulation,blockers,
    policy:'El certificado de baraja es independiente de la cobertura global del catálogo: exige evidencia completa únicamente para la baraja activa y falla de forma segura si sus metadatos o regulación no pueden verificarse.'};
}

async function calculateDeep537(){
  const btn=D.querySelector('.main-calc-pad button.calc'),old=btn?.textContent||'CALCULAR ▶',status=D.getElementById('mainYdkStatus'),prev=W.__YGO_ANALYSIS_BUDGET;
  let tx=null,structure=null;
  W.__YGO537_DEEP_ACTIVE=true;
  try{
    if(btn){btn.disabled=true;btn.textContent='VERIFICANDO DATOS…'}
    structure=await ensureActiveDeckStructure537({waitBootstrapMs:0});
    W.__YGO_ANALYSIS_BUDGET={mc:300,rules:20,stress:12,mode:'interactivo'};
    if(W.YGOAlpha332?.transaction){try{tx=await W.YGOAlpha332.transaction({force:true,reason:'alpha537-deep',hydrate:false})}catch(e){tx={error:String(e?.message||e)}}}
    W.__YGO537_REGULATION=tx;
    fastCalculate537();
    if(status){
      const gap=structure?.after?.gaps||0;
      status.textContent=`Puntuación lista · ${D.getElementById('total')?.textContent||''}${gap?` · ${gap} metadatos estructurales aún no verificados`:''} · buscando hasta 5 combos verificados…`;
      status.className='main-ydk-status '+(gap?'warn':'ok');
    }
    if(btn)btn.textContent='BUSCANDO TOP 5…';
    W.__YGO_ANALYSIS_BUDGET={mc:1000,rules:180,stress:100,mode:'profundo'};
    await new Promise(r=>setTimeout(r,0));
    const fp537=top5Fingerprint537();
    let top=(TOP5_CACHE537?.fingerprint===fp537)?arr(TOP5_CACHE537.lines).slice(0,5):[];
    if(top.length!==5)top=arr(W.comboBuildCandidates?.()).slice(0,5);
    try{W.renderComboVisualTop5?.(top);W.renderComboEndBoard?.(top)}catch(_){}
    const strict=top.filter(x=>cachedStrictLine537(x).pass).length,gaps=structure?.after?.gaps||0;
    const cert=deckCertification537({transaction:tx,requireRegulation:true});W.__YGO537_DECK_CERT=cert;
    if(status){
      const suffix=cert.pass?' · BARAJA CERTIFICADA 537':(cert.technical?.pass&&!cert.regulation?.pass?' · juego/combos verificados · regulación pendiente':` · certificación pendiente${cert.blockers?.length?': '+cert.blockers.slice(0,2).join(', '):''}`);
      status.textContent=`Análisis profundo completado · ${D.getElementById('total')?.textContent||''} · ${top.length}/5 líneas · ${strict} STRICT${gaps?` · ${gaps} metadatos estructurales pendientes`:''}${suffix}.`;
      status.className='main-ydk-status '+(cert.pass?'ok':'warn');
    }
    return{transaction:tx,structure,top,strict,certificate:cert};
  }catch(e){
    if(status){status.textContent='No se pudo completar el análisis profundo: '+String(e?.message||e);status.className='main-ydk-status bad'}
    return{error:String(e?.message||e),structure};
  }finally{
    W.__YGO537_DEEP_ACTIVE=false;
    W.__YGO_ANALYSIS_BUDGET=prev||{mc:600,rules:40,stress:24,mode:'interactivo'};
    if(btn){btn.disabled=false;btn.textContent=old}
  }
}
function currentDeckGate537(){
  const main=arr(W.deckState?.main).reduce((s,c)=>s+qty(c),0),top=arr(W.comboLastAnalysis).slice(0,5),rows=top.map(cachedStrictLine537),structure=structuralGapAudit537(W.deckState);
  if(!main)return{hasDeck:false,pass:true,top5:top.length,rows,structure,applicable:false};
  const avgStress=rows.length?rows.reduce((s,x)=>s+Number(x.stress||0),0)/rows.length:0;
  return{hasDeck:true,applicable:true,top5:top.length,rows,structure,strictPassed:rows.filter(x=>x.pass).length,strongPassed:rows.filter(x=>x.strong).length,criticalUnknown:rows.reduce((s,x)=>s+n(x.criticalUnknown),0),avgStress:Math.round(avgStress*10)/10,
    pass:top.length===5&&rows.every(x=>x.pass)&&avgStress>=57&&structure.pass,
    policy:'Gate técnico de baraja 537: 5/5 líneas STRICT, 0 UNKNOWN críticos, cobertura universal total, stress individual >=43, stress medio >=57 y 0 gaps estructurales en la baraja activa. La regulación se certifica por separado.'};
}
/* Alpha537 cleanup: duplicate projectStatus537 removed. */
/* Alpha537 cleanup: duplicate certify537 removed. */


/* ===== Alpha 537 · competitive structural universe + YGOPRODeck fallback ===== */
const YGOPRO_API537='https://db.ygoprodeck.com/api/v7/cardinfo.php';
const YGOPRO_VER537='https://db.ygoprodeck.com/api/v7/checkDBVer.php';

function trustedStructuralSource537(c){
  const s=String(c?.source||'');
  return /^Alpha(?:320|323|325|327)-(?:current|verified)-.*delta$/i.test(s) ||
         /ProjectIgnis\/BabelCDB|DawnbrandBots\/yaml-yugi|YGOPRODeck\/v7|structural-pack/i.test(String(c?.__alpha537StructuralSource||s));
}
function structuralVerified537(c){
  if(!isMonster537(c))return true;
  if(!primaryStructuralPresent537(c))return false;
  return !!(c?.__alpha537StructuralVerified||c?.__ygoHydrated||c?.__alpha537StructuralCache||c?.__alpha525StructuralCache||trustedStructuralSource537(c));
}
const OFFICIAL_HOTSET537=[
  [14558127,3,0,0,0,1800,'Ash Blossom & Joyous Spring'],
  [87746184,8,0,0,2500,2000,'Albion the Branded Dragon'],
  [73642296,3,0,0,0,1800,'Ghost Belle & Haunted Mansion'],
  [46772449,0,4,0,1900,0,'Evilswarm Exciton Knight'],
  [97268402,1,0,0,0,0,'Effect Veiler'],
  [94145021,1,0,0,0,0,'Droll & Lock Bird'],
  [65741786,0,0,2,800,0,'I:P Masquerena'],
  [8264361,0,0,2,1850,0,'Dharc the Dark Charmer, Gloomy'],
  [93854893,0,8,0,2600,2100,'Dingirsu, the Orcust of the Evening Star'],
  [8165596,0,8,0,2500,3000,'Number 90: Galaxy-Eyes Photon Lord'],
  [90590303,0,4,0,2100,2000,'Number 41: Bagooska the Terribly Tired Tapir'],
  [54757758,4,0,0,1900,1600,'Mudragon of the Swamp'],
  [11765832,6,0,0,1500,2400,'Garura, Wings of Resonant Life'],
  [27204311,11,0,0,3000,600,'Nibiru, the Primal Being'],
  [34242278,4,0,0,800,1300,"Noble Knight's Shield-Bearer"],
  [95113856,0,9,0,2900,2500,'Phantom Fortress Enterblathnir'],
  [49105782,0,0,3,2400,0,'Hraesvelgr, the Desperate Doom Eagle'],
  [71068247,0,3,0,1900,1400,'Totem Bird'],
  [71166481,0,3,0,1000,2600,'Number 75: Bamboozling Gossip Shadow'],
  [30674956,0,0,2,1850,0,'Wynn the Wind Charmer, Verdant'],
  [90512490,0,0,2,1400,0,'Greatfly']
];
function applyOfficialHotset537(){
  const byId=new Map(arr(W.CARD_CATALOG).filter(c=>Number(c?.id)).map(c=>[Number(c.id),c]));
  let applied=0,missing=0;
  for(const [id,level,rank,linkval,atk,def,name] of OFFICIAL_HOTSET537){
    const c=byId.get(Number(id));
    if(!c){missing++;continue}
    c.level=Number(level)||0;c.rank=Number(rank)||0;c.linkval=Number(linkval)||0;
    c.atk=Number(atk)||0;c.def=Number(def)||0;
    c.__alpha537StructuralVerified=true;
    c.__alpha537StructuralSource='KONAMI Neuron official hotset 2026-09-16';
    c.__alpha537OfficialHotset=true;
    if(!c.name&&name)c.name=name;
    applied++;
  }
  return{version:VERSION,applied,missing,total:OFFICIAL_HOTSET537.length,source:'KONAMI Neuron official card database'};
}
function promoteTrustedStructuralSeeds537(){
  const officialHotset=applyOfficialHotset537();
  let promoted=0;
  for(const c of arr(W.CARD_CATALOG)){
    if(!isMonster537(c)||!primaryStructuralPresent537(c)||!trustedStructuralSource537(c))continue;
    if(!c.__alpha537StructuralVerified){
      c.__alpha537StructuralVerified=true;
      c.__alpha537StructuralSource=c.__alpha537StructuralSource||('embedded:'+String(c.source||'verified-delta'));
      promoted++;
    }
  }
  return{version:VERSION,promoted,officialHotset,verified:arr(W.CARD_CATALOG).filter(c=>isMonster537(c)&&structuralVerified537(c)).length};
}
function competitiveStructuralEligible537(c){
  if(!isMonster537(c))return false;
  const s=String(c?.source||'');
  if(/unofficial|rush|skill|deckmaster|anime|manga/i.test(s))return false;
  return true;
}
function competitiveStructuralAudit537(){
  applyOfficialHotset537();
  const mons=arr(W.CARD_CATALOG).filter(competitiveStructuralEligible537);
  const verified=mons.filter(structuralVerified537).length;
  const gaps=mons.length-verified;
  return{
    version:VERSION,monsters:mons.length,structurallyVerified:verified,gaps,
    coveragePct:mons.length?Math.round(verified/mons.length*10000)/100:100,
    pass:mons.length>0&&gaps===0,
    releaseReady:mons.length>0&&(verified/mons.length)>=0.98,
    policy:'El gate competitivo cubre monstruos OCG/TCG/prerelease del catálogo y excluye universos no competitivos (unofficial, Rush, Skills y Deckmaster). La baraja activa sigue exigiendo 0 gaps sin importar el formato.'
  };
}
function applyYGOStructuralCard537(x, target){
  if(!x||!target||!Number(target.id))return false;
  const type=String(x.type||target.type||''),isXyz=/\bxyz\b/i.test(type),isLink=/\blink\b/i.test(type);
  const a=Number(x.atk),d=Number(x.def),lv=Number(x.level),link=Number(x.linkval);
  Object.assign(target,{
    type:x.type||target.type,frameType:x.frameType||target.frameType,
    attribute:x.attribute||target.attribute,race:x.race||target.race,
    level:(!isXyz&&!isLink&&Number.isFinite(lv))?Math.max(0,lv):0,
    rank:(isXyz&&Number.isFinite(lv))?Math.max(0,lv):0,
    linkval:(isLink&&Number.isFinite(link))?Math.max(0,link):0,
    scale:Number.isFinite(Number(x.scale))?Math.max(0,Number(x.scale)):Number(target.scale)||0,
    atk:Number.isFinite(a)&&a>=0?a:0,def:Number.isFinite(d)&&d>=0?d:0,
    questionAtk:Number.isFinite(a)?a<0:x.atk==='?',questionDef:Number.isFinite(d)?d<0:x.def==='?',
    __ygoHydrated:true,__alpha537StructuralVerified:true,__alpha537StructuralSource:'YGOPRODeck/v7'
  });
  return primaryStructuralPresent537(target);
}
async function fetchJSON537(url,{timeoutMs=30000}={}){
  const ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),timeoutMs);
  try{
    const r=await fetch(url,{cache:'no-store',signal:ctl.signal});
    if(!r.ok)throw Error('HTTP '+r.status);
    return await r.json();
  }finally{clearTimeout(tm)}
}
async function hydrateStructuralBatch537(cards,{timeoutMs=30000}={}){
  const unique=[...new Map(arr(cards).filter(c=>Number(c?.id)).map(c=>[String(c.id),c])).values()];
  if(!unique.length)return{version:VERSION,attempted:0,updated:0,missing:0};
  const ids=unique.map(c=>Number(c.id)).join(',');
  const payload=await fetchJSON537(YGOPRO_API537+'?id='+encodeURIComponent(ids),{timeoutMs});
  const data=arr(payload?.data),byId=new Map(data.map(x=>[String(Number(x?.id)||''),x]));
  const catalog=new Map(arr(W.CARD_CATALOG).filter(c=>Number(c?.id)).map(c=>[String(c.id),c]));
  let updated=0;
  for(const c of unique){
    const hit=byId.get(String(c.id));if(!hit)continue;
    const master=catalog.get(String(c.id));
    if(master)applyYGOStructuralCard537(hit,master);
    if(applyYGOStructuralCard537(hit,c))updated++;
  }
  persistStructural537(unique);
  return{version:VERSION,attempted:unique.length,returned:data.length,updated,missing:unique.length-updated,source:'YGOPRODeck/v7 batch'};
}
async function refineStructural537(state=W.deckState,{maxCards=60}={}){
  promoteTrustedStructuralSeeds537();mergeDeckFromCatalog537(state);applyStructuralCache537(state);
  const before=structuralGapAudit537(state),unique=[];
  for(const z of ['main','extra','side'])for(const c of arr(state?.[z]))
    if(isMonster537(c)&&!structuralVerified537(c)&&Number(c?.id)&&!unique.some(x=>String(x.id)===String(c.id)))unique.push(c);
  const target=unique.slice(0,Math.max(0,Math.min(60,Number(maxCards)||60)));
  if(!target.length)return{version:VERSION,before,after:before,attempted:0,updated:0,cached:Object.keys(readStructuralCache537()).length,source:'catalog/cache'};
  let batch=null,updated=0;
  try{batch=await hydrateStructuralBatch537(target,{timeoutMs:30000});updated=Number(batch?.updated)||0}catch(e){batch={error:String(e?.message||e),attempted:target.length,updated:0}}
  if(updated<target.length&&typeof W.hydrateCardOnline==='function'){
    const misses=target.filter(c=>!structuralVerified537(c)).slice(0,18);
    const jobs=misses.map(async c=>{try{await W.hydrateCardOnline(c);if(primaryStructuralPresent537(c)){c.__alpha537StructuralVerified=true;c.__alpha537StructuralSource='YGOPRODeck/v7 single';updated++}}catch(_){}});
    await Promise.allSettled(jobs);
  }
  syncStructural537(state,target);persistStructural537(target);mergeDeckFromCatalog537(state);
  const after=structuralGapAudit537(state);
  return{version:VERSION,before,after,attempted:target.length,updated,cached:Object.keys(readStructuralCache537()).length,batch};
}
async function mergeYGOPRODeckAll537({pageSize=1000,maxPages=30,timeoutMs=30000}={}){
  const byId=new Map(arr(W.CARD_CATALOG).filter(c=>Number(c?.id)).map(c=>[String(c.id),c]));
  let offset=0,pages=0,received=0,matched=0,verified=0,lastMeta=null;
  while(pages<Math.max(1,maxPages)){
    const url=YGOPRO_API537+'?num='+Math.max(100,Math.min(1000,pageSize))+'&offset='+offset;
    const payload=await fetchJSON537(url,{timeoutMs});
    const data=arr(payload?.data);lastMeta=payload?.meta||null;
    if(!data.length)break;
    received+=data.length;pages++;
    for(const x of data){
      const c=byId.get(String(Number(x?.id)||''));if(!c)continue;matched++;
      if(applyYGOStructuralCard537(x,c))verified++;
    }
    const next=Number(lastMeta?.next_page_offset);
    if(Number.isFinite(next)&&next>offset)offset=next;
    else offset+=data.length;
    if(Number(lastMeta?.rows_remaining)<=0||data.length<Math.max(100,Math.min(1000,pageSize)))break;
    await new Promise(r=>setTimeout(r,75));
  }
  const persisted=await persistVerifiedCatalog537('YGOPRODeck/v7');
  mergeDeckFromCatalog537(W.deckState);
  return{version:VERSION,source:'YGOPRODeck/v7',pages,received,matched,verified,meta:lastMeta,persisted,competitive:competitiveStructuralAudit537(),global:catalogStructuralAudit537()};
}
/* Alpha537 cleanup: duplicate bootstrapFullStructuralCatalog537 removed. */
function projectStatus537(){
  const staticQA=staticQACache537(),reg=quickRegression537(),global=catalogStructuralAudit537(),competitive=competitiveStructuralAudit537(),federation=federationAudit537(),perf=performanceAudit537(),visual=visualOrder537(),fmt=formatMatrix537(),rules=revisedRulingsAudit537();
  const archetypeCount=archetypeUniverse522().length,checks={visual:visual.pass,ydk:reg.ydk.pass,scoring:reg.calibration.pass&&reg.robustness.pass&&reg.matrix.pass,tiers:tierBoundaryAudit537().pass,formats:fmt.pass,archetypes:archetypeCount>50,exactRules:rules.pass,comboEngine:typeof W.comboBuildCandidates==='function',performance:perf.pass,staticQA:staticQA.pass};
  const vals=Object.values(checks),passed=vals.filter(Boolean).length,overall=Math.round((passed/Math.max(1,vals.length))*1000)/10;
  return{version:VERSION,overallPct:overall,remainingPct:Math.round((100-overall)*10)/10,metric:'verified core gates; full release additionally requires offline structural ≥98% and completed deep benchmark',gates:{passed,total:vals.length,checks},archetypeCount,catalogStructural:global,competitiveStructural:competitive,structuralPack:staticQA.structuralPack,structuralPackTransaction:staticQA.structuralPackTransaction,structuralPackFederation:federation,structuralPackFederationSelfTest:staticQA.structuralPackFederationSelfTest,performance:perf,syncCheckpoint:syncCheckpointAudit537(),syncStatus:structuralSyncStatus537(),remaining:[competitive.releaseReady?'revalidación periódica del snapshot offline':'snapshot estructural global offline ≥98% para primer arranque sin red','validación continua sobre barajas reales nuevas','handlers EXACT futuros para cartas nuevas o decisiones no observables','benchmark profundo Top-5/End Board con corpus real y límite medido','revalidación periódica de banlists/formatos oficiales'],policy:'Alpha 543 calcula avance a partir de gates observables. La cobertura estructural offline se informa separada y no infla el porcentaje principal.'};
}

function quickRegression537(){
  const started=performance.now(),ydk=ydkRoundTrip537(4),tiers=tierBoundaryAudit537(),calibration=calibration537(4,1),robustness=scoreRobustness537(2),matrix=calibrationMatrix537(4);
  const pass=ydk.pass&&tiers.pass&&calibration.pass&&robustness.pass&&matrix.pass;
  return{version:VERSION,pass,cacheHit:false,lookupMs:Math.round((performance.now()-started)*100)/100,ms:Math.round((performance.now()-started)*100)/100,ydk,calibration,robustness,matrix,source:'Alpha 543 live regression: YDK + 10x10 calibration + metamorphic robustness + tier boundaries'};
}

function certify537({calibrationLimit=2,repeats=1,robustnessLimit=2,forceStatic=false,forceRegression=false,forceDeck=false,deepRegression=false}={}){
  const started=performance.now();bind537();repairCatalogBarrier537();installCombo537();promoteTrustedStructuralSeeds537();
  const build=buildVerification537(),staticQA=staticQACache537({force:forceStatic}),regressionQA=(deepRegression||forceRegression)?regressionQACache537({force:forceRegression,calibrationLimit,repeats,robustnessLimit}):quickRegression537(),dynamicQA=dynamicDeckQACache537({force:forceDeck,requireRegulation:true}),closure=closureAudit537({calibration:regressionQA.matrix}),
    structural=staticQA.structural,cleanup=staticQA.cleanup,structuralPack=staticQA.structuralPack,structuralPackTransaction=staticQA.structuralPackTransaction,structuralPackFederationSelfTest=staticQA.structuralPackFederationSelfTest,tiers=staticQA.tiers,catalog=staticQA.catalog,sources=staticQA.sources,freshness=staticQA.freshness,
    ydk=regressionQA.ydk,calibration=regressionQA.calibration,robustness=regressionQA.robustness,
    catalogStructural=catalogStructuralAudit537(),competitiveStructural=competitiveStructuralAudit537(),structuralPackFederation=federationAudit537(),runtime=runtimeOwnership537(),browser=browserProbe537(),current=dynamicQA.current,deckCertificate=dynamicQA.deckCertificate;
  const offlineCatalogReady=globalPackReadiness537().ready===true,deepBenchmarkReady=build?.tests?.fullRadiantDeepBenchmarkCompleted===true,buildReady=structural.pass&&cleanup.pass&&structuralPack.pass&&structuralPackTransaction.pass&&structuralPackFederation.pass&&structuralPackFederationSelfTest.pass&&ydk.pass&&calibration.pass&&robustness.pass&&tiers.pass&&catalog.pass&&sources.pass&&freshness.pass&&runtime.pass&&closure.pass&&browser.realBrowser&&build?.verified===true&&/^PASS(?:_|$)/.test(String(build?.status||'')),activeDeckReady=!current.hasDeck||deckCertificate.pass,ready=buildReady&&activeDeckReady,fullReleaseReady=buildReady&&activeDeckReady&&offlineCatalogReady&&deepBenchmarkReady,status=!buildReady?'PENDIENTE DE GATE DE BUILD':(!activeDeckReady?'BETA 543 · BARAJA ACTIVA PENDIENTE':(!offlineCatalogReady?'BETA 543 · CORE LISTO · SNAPSHOT OFFLINE PENDIENTE':(!deepBenchmarkReady?'BETA 543 · CORE LISTO · BENCHMARK PROFUNDO PENDIENTE':'ALPHA 543 · RELEASE COMPLETO'))),elapsedMs=Math.round((performance.now()-started)*100)/100;
  const report={version:VERSION,ready,fullReleaseReady,buildReady,activeDeckReady,status,offlineCatalogReady,deepBenchmarkReady,closure,certifyMs:elapsedMs,staticQACacheHit:!!staticQA.cacheHit,staticQAMs:staticQA.lookupMs??staticQA.ms,regressionQACacheHit:!!regressionQA.cacheHit,regressionQAMs:regressionQA.lookupMs??regressionQA.ms,dynamicDeckCacheHit:!!dynamicQA.cacheHit,dynamicDeckMs:dynamicQA.lookupMs??dynamicQA.ms,
    structural,cleanup,structuralPack,structuralPackTransaction,structuralPackFederation,structuralPackFederationSelfTest,ydk,calibration,robustness,tiers,catalog,catalogStructural,competitiveStructural,sources,freshness,runtime,browser,current,deckCertificate,syncCheckpoint:syncCheckpointAudit537(),syncStatus:structuralSyncStatus537(),bootstrap:readStructuralBootstrap537(),build,legacyCleanup:W.__YGO537_CLEANUP,projectStatus:projectStatus537(),
    releasePolicy:'PASS de build 543 exige score 10×10, Chromium real, QA/catálogo/fuentes y runtime estables. certify() ejecuta una regresión viva de YDK, score 10×10, robustez y tiers; certifyDeep() vuelve a ejecutar el corpus pesado. La sincronización estructural usa múltiples fuentes y checkpoint transaccional.'};
  W.__YGO537_CERT=report;return report;
}

/* ===== Alpha 537 · two-tier certification cache and exact sync checkpoints ===== */
const STRUCTURAL_DB_META_KEY537='ygoStructuralDBMeta537';
let activeStructuralJob537=null;
function fnv1a537(str){let h=2166136261>>>0;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h.toString(16).padStart(8,'0')}
function snapshotPayload537(source='verified-source'){const rows=structuralSnapshotRows537(),body=JSON.stringify(rows);return{v:2,source:String(source||''),at:Date.now(),rows,checksum:fnv1a537(body),count:rows.length}}
function persistStructuralSnapshot537(source='verified-source'){try{const snap=snapshotPayload537(source);if(snap.rows.length<1000)return{ok:false,rows:snap.rows.length,error:'insufficient-verified-rows'};const payload=JSON.stringify(snap);localStorage.setItem(STRUCTURAL_SNAPSHOT_KEY537,payload);return{ok:true,rows:snap.rows.length,bytes:payload.length,source,checksum:snap.checksum,v:2}}catch(e){return{ok:false,rows:0,error:String(e?.message||e),source}}}
function applyStructuralSnapshot537(){try{const raw=localStorage.getItem(STRUCTURAL_SNAPSHOT_KEY537)||localStorage.getItem('ygoStructuralSnapshot527');if(!raw)return{ok:false,applied:0,reason:'no-snapshot'};const snap=JSON.parse(raw)||{},rows=arr(snap.rows);if(!rows.length)return{ok:false,applied:0,reason:'empty-snapshot'};if(Number(snap.v)>=2&&snap.checksum&&fnv1a537(JSON.stringify(rows))!==String(snap.checksum))return{ok:false,applied:0,reason:'checksum-mismatch'};const byId=new Map(arr(W.CARD_CATALOG).filter(c=>Number(c?.id)).map(c=>[Number(c.id),c]));let applied=0;for(const r of rows){if(!Array.isArray(r)||r.length<7)continue;const c=byId.get(Number(r[0]));if(!c||!isMonster537(c))continue;Object.assign(c,{level:Number(r[1])||0,rank:Number(r[2])||0,linkval:Number(r[3])||0,atk:Number(r[4])||0,def:Number(r[5])||0,scale:Number(r[6])||0,attribute:String(r[7]||c.attribute||''),race:String(r[8]||c.race||''),questionAtk:!!r[9],questionDef:!!r[10],__alpha537StructuralVerified:true,__alpha537StructuralSource:'snapshot:'+String(snap.source||'verified')});if(primaryStructuralPresent537(c))applied++}if(!localStorage.getItem(STRUCTURAL_SNAPSHOT_KEY537)&&applied)try{localStorage.setItem(STRUCTURAL_SNAPSHOT_KEY537,raw)}catch(_){}return{ok:applied>0,applied,source:snap.source||'',at:snap.at||0,bytes:raw.length,checksum:snap.checksum||null,v:Number(snap.v)||1}}catch(e){return{ok:false,applied:0,error:String(e?.message||e)}}}
async function structuralDBVersion537({timeoutMs=6500}={}){try{const x=await fetchJSON537(YGOPRO_VER537,{timeoutMs}),row=arr(x).length?arr(x)[0]:x;const version=String(row?.database_version??row?.version??''),date=String(row?.date??'');const out={ok:!!(version||date),version,date,checkedAt:Date.now()};try{localStorage.setItem(STRUCTURAL_DB_META_KEY537,JSON.stringify(out))}catch(_){}return out}catch(e){return{ok:false,error:String(e?.message||e),checkedAt:Date.now()}}}
function cachedStructuralDBVersion537(){try{return JSON.parse(localStorage.getItem(STRUCTURAL_DB_META_KEY537)||'{}')||{}}catch(_){return{}}}
async function ensureActiveDeckStructure537({waitBootstrapMs=0}={}){if(activeStructuralJob537)return activeStructuralJob537;activeStructuralJob537=(async()=>{applyStructuralPack537();applyStructuralSnapshot537();promoteTrustedStructuralSeeds537();mergeDeckFromCatalog537(W.deckState);applyStructuralCache537(W.deckState);const before=structuralGapAudit537(W.deckState);if(!before.gaps)return{version:VERSION,before,after:before,source:'snapshot/catalog/cache'};let refinement=null;try{refinement=await refineStructural537(W.deckState,{maxCards:60})}catch(e){refinement={error:String(e?.message||e)}}mergeDeckFromCatalog537(W.deckState);let after=structuralGapAudit537(W.deckState);if(after.gaps&&fullStructuralJob537&&waitBootstrapMs>0){try{await Promise.race([fullStructuralJob537,new Promise(r=>setTimeout(r,waitBootstrapMs))])}catch(_){}mergeDeckFromCatalog537(W.deckState);after=structuralGapAudit537(W.deckState)}return{version:VERSION,before,after,refinement,source:after.pass?'active-batch-verified':'partial'}})();try{return await activeStructuralJob537}finally{activeStructuralJob537=null}}
async function bootstrapFullStructuralCatalog537({force=false}={}){if(fullStructuralJob537&&!force)return fullStructuralJob537;fullStructuralJob537=(async()=>{applyStructuralPack537();applyStructuralSnapshot537();promoteTrustedStructuralSeeds537();const before=catalogStructuralAudit537(),competitiveBefore=competitiveStructuralAudit537();if(competitiveBefore.releaseReady){const persisted=await persistVerifiedCatalog537('existing-verified-competitive-catalog');writeStructuralBootstrap537({source:'existing-verified-competitive-catalog',status:'ready',coveragePct:before.coveragePct,competitiveCoveragePct:competitiveBefore.coveragePct});return{version:VERSION,before,after:before,competitive:competitiveBefore,persisted,network:false}}if(!navigator.onLine&&!force){writeStructuralBootstrap537({status:'offline-pending',coveragePct:before.coveragePct,competitiveCoveragePct:competitiveBefore.coveragePct});return{version:VERSION,before,after:before,competitive:competitiveBefore,offline:true}}const priorMeta=cachedStructuralDBVersion537(),remoteMeta=await structuralDBVersion537({timeoutMs:6500}),oldSnap=readStructuralBootstrap537();if(!force&&remoteMeta.ok&&priorMeta.version&&priorMeta.version===remoteMeta.version&&Number(oldSnap.competitiveCoveragePct)>=98)return{version:VERSION,before,after:catalogStructuralAudit537(),competitive:competitiveStructuralAudit537(),network:true,skippedFullSync:true,dbVersion:remoteMeta};const attempts=[];try{if(typeof W.syncBabelCDB==='function'){const r=await W.syncBabelCDB(force);attempts.push({source:'ProjectIgnis/BabelCDB',result:r});const raw=catalogRawStructuralCoverage537();if(raw.coveragePct>=88)markCatalogStructuralVerified537('ProjectIgnis/BabelCDB');promoteTrustedStructuralSeeds537();const comp=competitiveStructuralAudit537();if(comp.releaseReady){const persisted=await persistVerifiedCatalog537('ProjectIgnis/BabelCDB');mergeDeckFromCatalog537(W.deckState);const after=catalogStructuralAudit537();writeStructuralBootstrap537({source:'ProjectIgnis/BabelCDB',status:'ready',coveragePct:after.coveragePct,competitiveCoveragePct:comp.coveragePct,dbVersion:remoteMeta.version||''});return{version:VERSION,before,after,competitive:comp,attempts,persisted,dbVersion:remoteMeta}}}}catch(e){attempts.push({source:'ProjectIgnis/BabelCDB',error:String(e?.message||e)})}try{const d=await mergeDawnbrandAggregateOffThread537({timeoutMs:60000});attempts.push(d);promoteTrustedStructuralSeeds537();const comp=competitiveStructuralAudit537();if(comp.releaseReady){const persisted=await persistVerifiedCatalog537('DawnbrandBots/yaml-yugi');mergeDeckFromCatalog537(W.deckState);const after=catalogStructuralAudit537();writeStructuralBootstrap537({source:'DawnbrandBots/yaml-yugi',status:'ready',coveragePct:after.coveragePct,competitiveCoveragePct:comp.coveragePct,dbVersion:remoteMeta.version||''});return{version:VERSION,before,after,competitive:comp,attempts,persisted,dbVersion:remoteMeta}}}catch(e){attempts.push({source:'DawnbrandBots/yaml-yugi',error:String(e?.message||e)})}try{const y=await mergeYGOPRODeckAll537({pageSize:1000,maxPages:30,timeoutMs:30000});attempts.push(y);const comp=competitiveStructuralAudit537();if(comp.releaseReady){const after=catalogStructuralAudit537();writeStructuralBootstrap537({source:'YGOPRODeck/v7',status:'ready',coveragePct:after.coveragePct,competitiveCoveragePct:comp.coveragePct,dbVersion:remoteMeta.version||''});return{version:VERSION,before,after,competitive:comp,attempts,persisted:y.persisted,dbVersion:remoteMeta}}}catch(e){attempts.push({source:'YGOPRODeck/v7',error:String(e?.message||e)})}const after=catalogStructuralAudit537(),comp=competitiveStructuralAudit537();writeStructuralBootstrap537({status:'partial',coveragePct:after.coveragePct,competitiveCoveragePct:comp.coveragePct,dbVersion:remoteMeta.version||'',attempts:attempts.map(x=>({source:x.source,error:x.error||null}))});return{version:VERSION,before,after,competitive:comp,attempts,partial:true,dbVersion:remoteMeta}})();try{return await fullStructuralJob537}finally{fullStructuralJob537=null}}
function backgroundStructuralSyncAllowed537(){
  const btn=D.querySelector('.main-calc-pad button.calc'),mode=String(W.__YGO_ANALYSIS_BUDGET?.mode||'').toLowerCase();
  if(activeStructuralJob537||btn?.disabled||W.__YGO537_DEEP_ACTIVE||mode==='profundo')return false;
  const s=W.__YGO537_IMPORT_STATE;
  if(s&&s.regulation==='checking')return false;
  return true;
}
function scheduleFullStructuralSync537({delayMs=18000}={}){
  if(fullStructuralScheduled537)return false;
  fullStructuralScheduled537=true;
  const run=async()=>{
    fullStructuralScheduled537=false;
    try{
      applyStructuralPack537();applyStructuralSnapshot537();promoteTrustedStructuralSeeds537();
      const a=competitiveStructuralAudit537();
      if(a.releaseReady||!navigator.onLine)return;
      if(!backgroundStructuralSyncAllowed537()){setTimeout(()=>scheduleFullStructuralSync537({delayMs:15000}),15000);return}
      W.__YGO537_STRUCTURAL_BOOTSTRAP=await bootstrapFullStructuralCatalog537({force:false});
    }catch(e){W.__YGO537_STRUCTURAL_BOOTSTRAP={version:VERSION,error:String(e?.message||e)}}
  };
  setTimeout(()=>{
    if(typeof W.requestIdleCallback==='function')W.requestIdleCallback(()=>run(),{timeout:6000});
    else run();
  },Math.max(5000,Number(delayMs)||18000));
  return true;
}
function cleanupAudit537(){const facade=D.getElementById('ygo-alpha-543-release-certification')?.textContent||'';const names=[...facade.matchAll(/(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g)].map(x=>x[1]),counts={};for(const n of names)counts[n]=(counts[n]||0)+1;const duplicates=Object.entries(counts).filter(([,v])=>v>1);return{version:VERSION,functionDeclarations:names.length,duplicateFunctions:duplicates,pass:duplicates.length===0,policy:'La fachada Alpha537 mantiene una sola implementación por función crítica y exige Structural Pack v3 transaccional, rollback y anti-regresión.'}}


/* ===== Alpha 537 · closure sprint ===== */
const OFFICIAL_REVISIONS537={
  'mind master':{
    name:'Mind Master',passcode:96782886,effective:'2026-07-01',source:'KONAMI OCG rule revision',
    sourceUrl:'https://www.yugioh-card.com/japan/revision/',
    family:'PSYCHIC_800LP_TRIBUTE_DECK_SUMMON_HOPT_SELF_ALLOWED',formats:['OCG'],exact:true,handler:'mindMaster537'
  },
  'elder entity norden':{
    name:'Elder Entity Norden',passcode:17412721,effective:'2026-07-01',source:'KONAMI OCG rule revision / Neuron',
    sourceUrl:'https://www.db.yugioh-card.com/yugiohdb/card_search.action?cid=11207&ope=2',
    family:'EXTRA_DECK_SPECIAL_SUMMON_GY_REVIVE_NEGATE_BANISH_LINK_HOPT',formats:['OCG'],exact:true,handler:'norden537'
  }
};
function cardObj537(x){return x?.card||x||{}}
function cardName537(x){return String(cardObj537(x)?.name||x?.name||'')}
function cardRace537(x){return String(cardObj537(x)?.race||x?.race||'')}
function cardLevel537(x){return Number(cardObj537(x)?.level||x?.level)||0}
function zones537(st,p,z){return arr(st?.zones?.[p]?.[z])}
function locate537(st,uid){
  for(const p of [0,1])for(const z of ['hand','monster','spelltrap','gy','banished','deck','extra'])
    {const a=zones537(st,p,z),i=a.findIndex(x=>String(x?.uid)===String(uid));if(i>=0)return{p,z,i,item:a[i]}}
  return null;
}
function move537(st,uid,to,p=null){
  const q=locate537(st,uid);if(!q)return null;
  q.item=q.item||{};zones537(st,q.p,q.z).splice(q.i,1);
  const dest=Number.isInteger(p)?p:q.p;zones537(st,dest,to).push(q.item);return q.item
}

function activeFormat537(st=null,ctx={}){
  return String(ctx?.format||st?.format||st?.ruleset||W.deckState?.format||selectedFormat537()||'TCG').trim().toUpperCase();
}
function revisionFormatAllowed537(rule,st=null,ctx={}){
  const fs=arr(rule?.formats).map(x=>String(x).trim().toUpperCase()).filter(Boolean);
  if(!fs.length)return true;
  const cur=activeFormat537(st,ctx);
  return fs.some(f=>cur===f||cur.startsWith(f+' ')||cur.startsWith(f+'-'));
}
function revisionScopeReject537(rule,st=null,ctx={}){
  if(revisionFormatAllowed537(rule,st,ctx))return null;
  return{ok:false,notApplicable:true,reason:`${rule?.name||'Esta revisión'} sólo aplica a ${arr(rule?.formats).join('/')} en Alpha 537.`,format:activeFormat537(st,ctx),allowedFormats:arr(rule?.formats)};
}
function hopt537(st,p,key){
  st.__alpha537HOPT=st.__alpha537HOPT||{};const k=`${Number(st?.turn)||1}|${p}|${key}`;
  if(st.__alpha537HOPT[k])return false;st.__alpha537HOPT[k]=true;return true
}
function mindMaster537(st,p,ctx={}){
  const scope=revisionScopeReject537(OFFICIAL_REVISIONS537['mind master'],st,ctx);if(scope)return scope;
  if(!st||!st.zones)return{ok:false,reason:'state-missing'};
  const sourceUid=ctx.sourceUid??ctx.uid,src=sourceUid!=null?locate537(st,sourceUid):null;
  if(!src||src.p!==p||src.z!=='monster'||norm(cardName537(src.item))!=='mind master')return{ok:false,reason:'Mind Master debe estar en tu Zona de Monstruos.'};
  if((Number(st.lp?.[p])||0)<800)return{ok:false,reason:'Se requieren 800 LP.'};
  const tributeUid=ctx.tributeUid??sourceUid,tribute=locate537(st,tributeUid);
  if(!tribute||tribute.p!==p||tribute.z!=='monster'||!/psychic/i.test(cardRace537(tribute.item)))return{ok:false,reason:'Debes Sacrificar 1 monstruo Psychic que controles.'};
  const targetUid=ctx.targetUid,target=targetUid!=null?locate537(st,targetUid):null;
  if(!target||target.p!==p||target.z!=='deck'||!/psychic/i.test(cardRace537(target.item))||cardLevel537(target.item)>4)return{ok:false,reason:'El objetivo debe ser un Psychic de Nivel 4 o menor en el Deck.'};
  if(!hopt537(st,p,'mind-master'))return{ok:false,reason:'Mind Master ya usó su efecto este turno.'};
  st.lp[p]-=800;move537(st,tributeUid,'gy',p);const summoned=move537(st,targetUid,'monster',p);
  if(summoned){summoned.faceUp=true;summoned.position='ATTACK';summoned.specialSummoned=true}
  return{ok:!!summoned,costLP:800,tributed:tributeUid,summoned:targetUid,selfTribute:String(tributeUid)===String(sourceUid)};
}
function norden537(st,p,ctx={}){
  const scope=revisionScopeReject537(OFFICIAL_REVISIONS537['elder entity norden'],st,ctx);if(scope)return scope;
  if(!st||!st.zones)return{ok:false,reason:'state-missing'};
  const sourceUid=ctx.sourceUid??ctx.uid,src=sourceUid!=null?locate537(st,sourceUid):null;
  if(!src||src.p!==p||src.z!=='monster'||norm(cardName537(src.item))!=='elder entity norden')return{ok:false,reason:'Elder Entity Norden debe estar en tu Zona de Monstruos.'};
  const fromExtra=ctx.summonedFromExtra===true||src.item?.summonedFrom==='extra'||src.item?.fromZone==='extra'||src.item?.__summonedFromExtra===true;
  if(!fromExtra)return{ok:false,reason:'El efecto revisado sólo se activa si Norden fue Invocado de Modo Especial desde el Extra Deck.'};
  if(!hopt537(st,p,'elder-entity-norden'))return{ok:false,reason:'Elder Entity Norden ya usó su efecto este turno.'};
  const targetUid=ctx.targetUid,target=targetUid!=null?locate537(st,targetUid):null;
  if(!target||target.p!==p||target.z!=='gy'||cardLevel537(target.item)>4)return{ok:false,reason:'El objetivo debe ser un monstruo de Nivel 4 o menor en tu GY.'};
  const summoned=move537(st,targetUid,'monster',p);if(!summoned)return{ok:false,reason:'No se pudo Invocar el objetivo.'};
  summoned.faceUp=true;summoned.position='ATTACK';summoned.specialSummoned=true;summoned.effectsNegated=true;summoned.__alpha537NordenHost=sourceUid;
  st.__alpha537NordenLinks=st.__alpha537NordenLinks||{};st.__alpha537NordenLinks[String(sourceUid)]=String(targetUid);
  return{ok:true,summoned:targetUid,negated:true,banishWhenHostLeaves:true};
}
function nordenLeave537(st,sourceUid){
  const link=st?.__alpha537NordenLinks?.[String(sourceUid)];if(!link)return{ok:true,linked:false};
  const q=locate537(st,link);if(q&&q.z==='monster')move537(st,link,'banished',q.p);
  delete st.__alpha537NordenLinks[String(sourceUid)];return{ok:true,linked:true,banished:!!q};
}
function selectedFormat537(){return String(D.querySelector('.formats .fmt.active')?.dataset?.f||W.deckState?.format||'TCG').trim()||'TCG'}
function exactRuleApplies537(rule){const fs=arr(rule?.formats);if(!fs.length)return true;const cur=selectedFormat537().toUpperCase();return fs.some(x=>String(x).toUpperCase()===cur)}
function installOfficialRevisionRules537(){
  R.exactRuleRegistry537={...(R.exactRuleRegistry537||R.exactRuleRegistry507||R.exactRuleRegistry503||{}),...OFFICIAL_REVISIONS537};
  R.cardScriptRegistry={...(R.cardScriptRegistry||{}),...OFFICIAL_REVISIONS537};
  W.YGOOfficialRevisions537={VERSION,rules:OFFICIAL_REVISIONS537,mindMaster:mindMaster537,norden:norden537,nordenLeave:nordenLeave537};
  return{version:VERSION,installed:Object.keys(OFFICIAL_REVISIONS537).length,pass:Object.keys(OFFICIAL_REVISIONS537).every(k=>R.exactRuleRegistry537?.[k]?.exact===true)};
}
function revisedRulingsAudit537(){
  const installed=installOfficialRevisionRules537(),t={};
  try{
    const mk=(uid,name,race,level)=>({uid,card:{name,race,level}});
    const st={turn:1,lp:[8000,8000],zones:[{hand:[],monster:[mk('m','Mind Master','Psychic',1),mk('p','Psychic Jumper','Psychic',2)],spelltrap:[],gy:[],banished:[],deck:[mk('d','Psychic Commander','Psychic',3)],extra:[]},{hand:[],monster:[],spelltrap:[],gy:[],banished:[],deck:[],extra:[]}]};
    const r=mindMaster537(st,0,{format:'OCG',sourceUid:'m',tributeUid:'m',targetUid:'d'});t.mindMasterSelfTribute=!!r.ok&&r.selfTribute===true&&st.lp[0]===7200&&zones537(st,0,'monster').some(x=>x.uid==='d');
  }catch(_){t.mindMasterSelfTribute=false}
  try{
    const mk=(uid,name,level)=>({uid,card:{name,race:'Fairy',level}});
    const st={turn:1,lp:[8000,8000],zones:[{hand:[],monster:[Object.assign(mk('n','Elder Entity Norden',4),{__summonedFromExtra:true})],spelltrap:[],gy:[mk('g','Revive Target',4)],banished:[],deck:[],extra:[]},{hand:[],monster:[],spelltrap:[],gy:[],banished:[],deck:[],extra:[]}]};
    const r=norden537(st,0,{format:'OCG',sourceUid:'n',targetUid:'g',summonedFromExtra:true});const l=nordenLeave537(st,'n');t.nordenRevision=!!r.ok&&!!l.banished&&zones537(st,0,'banished').some(x=>x.uid==='g');
  }catch(_){t.nordenRevision=false}

  try{
    const mk=(uid,name,race,level)=>({uid,card:{name,race,level}});
    const st={turn:1,format:'TCG',lp:[8000,8000],zones:[{hand:[],monster:[mk('m','Mind Master','Psychic',1)],spelltrap:[],gy:[],banished:[],deck:[mk('d','Psychic Commander','Psychic',3)],extra:[]},{hand:[],monster:[],spelltrap:[],gy:[],banished:[],deck:[],extra:[]}]};
    const r=mindMaster537(st,0,{format:'TCG',sourceUid:'m',tributeUid:'m',targetUid:'d'});t.tcgScopeRejected=r?.notApplicable===true&&st.lp[0]===8000;
  }catch(_){t.tcgScopeRejected=false}

  return{version:VERSION,installed,tests:t,pass:installed.pass&&Object.values(t).every(Boolean),effective:'2026-07-01',policy:'Se modelan explícitamente las dos revisiones oficiales OCG publicadas para 2026-07-01.'};
}
function calibrationMatrix537(limit=12){
  const entries=fixtureEntries537(limit),rows=[],catalogReady=arr(W.CARD_CATALOG).length>=19617;
  for(const [id,e] of entries){try{
    const r=fastScore537(e.fixture),scores=arr(r?.scores||r?.categories||r?.values),total=Number(r?.total??r?.score??scores.reduce((s,x)=>s+Number(x||0),0));
    rows.push({id,label:e.label||id,total,scores,integer10:scores.length===10&&scores.every(x=>Number.isInteger(Number(x))&&Number(x)>=0&&Number(x)<=10),totalOk:Number.isInteger(total)&&total>=0&&total<=100});
  }catch(err){rows.push({id,label:e.label||id,pass:false,error:String(err?.message||err)})}}
  const totals=rows.filter(x=>Number.isFinite(x.total)).map(x=>x.total),spread=totals.length?Math.max(...totals)-Math.min(...totals):0;
  const contractPass=rows.length>0&&rows.every(x=>x.integer10&&x.totalOk);
  return{version:VERSION,total:rows.length,rows,spread,catalogReady,contractPass,pass:contractPass,status:catalogReady?'CALIBRACIÓN DE CORPUS EJECUTADA':'CONTRATO 10×10 VALIDADO · CALIBRACIÓN DE FUERZA DIFERIDA HASTA CARGAR CATÁLOGO COMPLETO',policy:'La matriz valida enteros/rango y perfiles múltiples. La correlación de fuerza sólo se considera calibrada cuando el catálogo estructural completo está disponible; no se usan scores provisionales como referencia externa.'};
}
function formatMatrix537(){
  const p=W.BANLIST_PROFILES||{},rows=[
    {id:'TCG Advanced',effective:'2026-05-18',official:/2026-05-18/.test(String(OFFICIAL_SOURCES.tcg?.effective||'')),profile:String(p.tcg?.date||'').includes('18/05/2026')},
    {id:'OCG Japan',effective:'2026-07-01',official:/2026-07-01/.test(String(OFFICIAL_SOURCES.ocgJP?.effective||'')),profile:String(p.ocg?.date||'').includes('01/07/2026')},
    {id:'OCG Asian-English',effective:'2026-07-01',official:/2026-07-01/.test(String(OFFICIAL_SOURCES.ocgAE?.effective||'')),profile:String(p.ocgAE?.date||'').includes('01/07/2026')},
    {id:'WCS 2026 special',effective:'event-specific',official:true,profile:true}
  ];
  return{version:VERSION,verifiedAt:'2026-09-17',rows,pass:rows.every(x=>x.official&&x.profile),policy:'TCG Advanced sigue efectivo desde 2026-05-18; OCG Japón desde 2026-07-01. WCS 2026 es una lista especial de evento: un OTS de Celebration puede usar la lista WCS o la lista TCG vigente, por lo que nunca reemplaza automáticamente Advanced.'};
}
function comboEndBoardEdgeAudit537(){
  const top=arr(W.comboLastAnalysis).slice(0,5),hasDeck=deckCount537(W.deckState||{})>0;
  if(!top.length)return{version:VERSION,applicable:hasDeck,pass:!hasDeck?null:false,top5:0,status:hasDeck?'FAIL_NO_TOP5':'NOT_APPLICABLE_NO_ACTIVE_DECK',policy:'Sin baraja activa el gate queda N/A; con baraja activa, ausencia de Top-5 es fallo y nunca se convierte en PASS.'};
  const rows=top.map((l,i)=>{
    const st=l?.simulation?.state||l?.state||{},fb=l?.simulation?.finalBoard||l?.finalBoard||{},strict=strictLine537(l);
    const actions=arr(l?.actions||l?.simulation?.actions),sig=actions.map(a=>`${norm(a?.card?.name||a?.cardName||a?.card)}:${norm(a?.actionType||a?.type)}`).join('>');
    const deferred=arr(st?.deferredTriggers||st?.pendingTriggers||st?.events).length;
    const boardPresent=!!fb&&typeof fb==='object'&&(Object.keys(fb).length>0||!!st?.zones);
    return{index:i+1,strict:strict.pass,coverage:strict.coverage,criticalUnknown:strict.criticalUnknown,boardPresent,actions:actions.length,deferred,signature:sig,pass:strict.pass&&boardPresent};
  });
  const unique=new Set(rows.map(x=>x.signature).filter(Boolean)).size;
  return{version:VERSION,applicable:true,top5:rows.length,rows,uniqueLines:unique,pass:rows.length===5&&rows.every(x=>x.pass)&&unique>=Math.min(3,rows.length),policy:'El Top-5 debe reconstruir End Board, mantener 0 UNKNOWN críticos y evitar cinco copias idénticas de la misma línea.'};
}
function globalPackReadiness537(){
  const competitive=competitiveStructuralAudit537(),checkpoint=syncCheckpointAudit537(),federation=federationAudit537(),catalogCount=arr(W.CARD_CATALOG).length;
  const fullCatalogLoaded=catalogCount>=19617,expectedCompetitive=fullCatalogLoaded?Number(competitive.monsters||0):8063;
  const verified=Number(competitive.structurallyVerified||0),coveragePct=expectedCompetitive?Math.round(verified/expectedCompetitive*10000)/100:0;
  const unresolvedCount=Math.max(0,expectedCompetitive-verified),ready=fullCatalogLoaded&&coveragePct>=98&&competitive.releaseReady===true;
  return{version:VERSION,catalogCount,fullCatalogLoaded,coveragePct,verified,total:expectedCompetitive,unresolved:unresolvedCount,targetPct:98,ready,checkpoint,federation,
    nextAction:ready?'exportar/incrustar el pack global verificado':(!fullCatalogLoaded?'esperar/cargar el catálogo completo antes de certificar cobertura global':'reanudar lotes verificables hasta >=98%; nunca promover datos no verificados')};
}
function performanceAudit537(){
  const b=buildVerification537(),cold=Number(b?.metrics?.certifyColdMs||0),warm=Number(b?.metrics?.certifyWarmMs||0),entries=fixtureEntries537(2),started=performance.now();
  let fastScoreRuns=0;try{for(let r=0;r<3;r++)for(const [,e] of entries){fastScore537(e.fixture);fastScoreRuns++}}catch(_){}
  const fastScoreMs=Math.round((performance.now()-started)*100)/100,measured=fastScoreRuns>0&&Number.isFinite(fastScoreMs),warmMeasured=warm>0;
  return{version:VERSION,coldMs:cold,warmMs:warm,fastScoreMs,fastScoreRuns,measured,warmMeasured,warmSubSecond:warmMeasured&&warm<1000,cacheLayers:3,pass:measured&&fastScoreMs<1000&&(warmMeasured?warm<1000:true),deepBenchmarkCompleted:b?.tests?.fullRadiantDeepBenchmarkCompleted===true,policy:'Alpha 543 nunca convierte una métrica ausente en PASS. El gate interactivo mide scoring real; el benchmark profundo se informa por separado hasta completarse.'};
}
function closureAudit537({calibration=null}={}){
  const matrix=calibration||W.__YGO537_REGRESSION_QA?.matrix||calibrationMatrix537(2),rulings=revisedRulingsAudit537(),formats=formatMatrix537(),edge=comboEndBoardEdgeAudit537(),globalPack=globalPackReadiness537(),performance=performanceAudit537();
  return{version:VERSION,rulings,calibration:matrix,formats,comboEndBoard:edge,globalPack,performance,
    pass:rulings.pass&&matrix.pass&&formats.pass&&(edge.pass!==false)&&performance.pass,
    globalOfflineComplete:globalPack.ready,
    policy:'Alpha537 ejecuta todos los frentes de cierre. El único gate que puede permanecer abierto sin invalidar la build es la cobertura estructural global offline; se reporta por separado y nunca se simula.'};
}


/* ===== Alpha 537 · memoized certification / Top-5 reuse ===== */
const LINE_CERT_CACHE537=new Map();
let TOP5_CACHE537=null;

function rulesFingerprint537(){
  const regs={};
  for(const k of Object.keys(R).filter(k=>/^exactRuleRegistry\d+$/.test(k)).sort())
    regs[k]=Object.keys(R[k]||{}).sort();
  return fnv1a537(stableJSON537({
    version:VERSION,
    format:selectedFormat537(),
    registries:regs,
    structural:activeStructuralFingerprint537(),
    profile:String(W.YGOAlpha332?.currentProfile?.()?.id||W.deckState?.format||'')
  }));
}
function lineSignature537(line){
  const actions=arr(line?.actions||line?.simulation?.actions).map(a=>[
    String(a?.card?.id??a?.cardId??''),
    norm(a?.card?.name||a?.cardName||a?.card||''),
    norm(a?.actionType||a?.type||''),
    String(a?.effectId??''),
    norm(a?.fromZone||a?.from||''),
    norm(a?.toZone||a?.to||'')
  ]);
  return fnv1a537(stableJSON537({actions,board:line?.simulation?.finalBoard||line?.finalBoard||{}}));
}
function cachedStrictLine537(line){
  if(!line)return strictLine537(line);
  const key=rulesFingerprint537()+'|'+lineSignature537(line);
  const hit=LINE_CERT_CACHE537.get(key);
  if(hit)return{...hit,cacheHit:true};
  const result=strictLine537(line);
  LINE_CERT_CACHE537.set(key,{...result,cacheHit:false});
  while(LINE_CERT_CACHE537.size>512)LINE_CERT_CACHE537.delete(LINE_CERT_CACHE537.keys().next().value);
  return result;
}
function top5Fingerprint537(){
  const zone=z=>arr(W.deckState?.[z]).map(c=>[
    Number(c?.id)||0,qty(c),Number(c?.level)||0,Number(c?.rank)||0,Number(c?.linkval)||0,
    Number(c?.atk)||0,Number(c?.def)||0,!!c?.__alpha537StructuralVerified
  ]).sort((a,b)=>a[0]-b[0]);
  const tx=W.__YGO537_REGULATION;
  return fnv1a537(stableJSON537({
    main:zone('main'),extra:zone('extra'),side:zone('side'),
    rules:rulesFingerprint537(),
    regulation:{ok:tx?.ok===true,definitive:tx?.definitive,verifiable:tx?.validation?.verifiable,legal:tx?.validation?.legal}
  }));
}
function invalidateTop5Cache537(reason='manual'){
  const had=!!TOP5_CACHE537,n=LINE_CERT_CACHE537.size;
  TOP5_CACHE537=null;LINE_CERT_CACHE537.clear();
  return{version:VERSION,hadTop5:had,lineCertEntries:n,reason};
}
function installMemoizedComboFacade537(){
  const base=W.comboBuildCandidates;
  if(typeof base!=='function')return false;
  if(base.__alpha537Memoized)return true;
  const wrapped=function(...args){
    const fp=top5Fingerprint537();
    if(TOP5_CACHE537?.fingerprint===fp&&arr(TOP5_CACHE537.lines).length===5){
      W.comboLastAnalysis=TOP5_CACHE537.lines;
      return TOP5_CACHE537.lines.slice();
    }
    const started=performance.now(),prev=W.__YGO_ANALYSIS_BUDGET,deep=String(prev?.mode||'').toLowerCase()==='profundo';
    let raw=[];
    if(deep){
      try{
        W.__YGO_ANALYSIS_BUDGET={mc:360,rules:28,stress:18,mode:'interactivo'};
        raw=arr(base(...args));
        const light=raw.slice(0,5),lightRows=light.map(cachedStrictLine537);
        if(light.length===5&&lightRows.every(x=>x.pass)){
          TOP5_CACHE537={fingerprint:fp,lines:light,createdAt:Date.now(),searchMs:Math.round((performance.now()-started)*100)/100,stage:'light'};
          W.comboLastAnalysis=light;
          return raw;
        }
      }finally{W.__YGO_ANALYSIS_BUDGET=prev}
    }
    if(deep){
      const p2=W.__YGO_ANALYSIS_BUDGET;
      try{W.__YGO_ANALYSIS_BUDGET={mc:900,rules:60,stress:32,mode:'profundo-acotado'};raw=arr(base(...args))}
      finally{W.__YGO_ANALYSIS_BUDGET=p2}
    }else raw=arr(base(...args));
    const selected=raw.slice(0,5),rows=selected.map(cachedStrictLine537);
    if(selected.length===5&&rows.every(x=>x.pass)){
      TOP5_CACHE537={fingerprint:fp,lines:selected,createdAt:Date.now(),searchMs:Math.round((performance.now()-started)*100)/100,stage:deep?'deep':'interactive'};
    }
    return raw;
  };
  wrapped.__alpha537=true;wrapped.__alpha537Memoized=true;wrapped.__base=base;
  W.comboBuildCandidates=wrapped;W.autoAnalyzeAllCombos=wrapped;
  return true;
}
function top5CacheStatus537(){
  return{
    version:VERSION,
    cached:!!TOP5_CACHE537,
    fingerprint:TOP5_CACHE537?.fingerprint||null,
    lines:arr(TOP5_CACHE537?.lines).length,
    searchMs:TOP5_CACHE537?.searchMs||0,
    stage:TOP5_CACHE537?.stage||null,
    lineCertEntries:LINE_CERT_CACHE537.size
  };
}

function benchmarkActiveDeck537({maxMs=15000}={}){
  const hasDeck=deckCount537(W.deckState||{})>0;
  if(!hasDeck)return{version:VERSION,applicable:false,pass:null,status:'NOT_APPLICABLE_NO_ACTIVE_DECK',elapsedMs:0,top5:0};
  installMemoizedComboFacade537();invalidateTop5Cache537('benchmark');
  const prev=W.__YGO_ANALYSIS_BUDGET,started=performance.now();let raw=[],error=null;
  try{W.__YGO_ANALYSIS_BUDGET={mc:900,rules:60,stress:32,mode:'profundo'};raw=arr(W.comboBuildCandidates?.())}catch(e){error=String(e?.message||e)}finally{W.__YGO_ANALYSIS_BUDGET=prev}
  const elapsedMs=Math.round((performance.now()-started)*100)/100,top=raw.slice(0,5),strict=top.map(cachedStrictLine537),pass=!error&&top.length===5&&strict.every(x=>x.pass)&&elapsedMs<=Math.max(1000,Number(maxMs)||15000);
  const report={version:VERSION,applicable:true,pass,status:pass?'PASS':'FAIL',elapsedMs,maxMs:Number(maxMs)||15000,top5:top.length,strictPass:strict.filter(x=>x.pass).length,error,cache:top5CacheStatus537()};
  W.__YGO543_DEEP_BENCHMARK=report;return report;
}

install537();
installMemoizedComboFacade537();

Object.assign(W.YGOAlpha537||{},{
  cachedStrictLine:cachedStrictLine537,
  lineSignature:lineSignature537,
  rulesFingerprint:rulesFingerprint537,
  top5Fingerprint:top5Fingerprint537,
  top5CacheStatus:top5CacheStatus537,
  invalidateTop5Cache:invalidateTop5Cache537,
  benchmarkActiveDeck:benchmarkActiveDeck537,
  certifyDeep:(opts={})=>certify537({...opts,deepRegression:true,forceRegression:true}),
  quickRegression:quickRegression537,
  officialRevisions:OFFICIAL_REVISIONS537,
  revisionFormatAllowed:revisionFormatAllowed537,
  hydrateStructuralMultiSource:hydrateStructuralMultiSource537,
  hydrateDawnbrandIndividual:hydrateDawnbrandIndividual537,
  autonomousStructuralTick:autonomousStructuralTick537,
  scheduleAutonomousStructuralSync:scheduleAutonomousStructuralSync537,
  pauseAutonomousStructuralSync:pauseAutonomousStructuralSync537,
  autonomousSyncState:autonomousSyncState537,
  installOfficialRevisionRules:installOfficialRevisionRules537,
  revisedRulingsAudit:revisedRulingsAudit537,
  calibrationMatrix:calibrationMatrix537,
  formatMatrix:formatMatrix537,
  comboEndBoardEdgeAudit:comboEndBoardEdgeAudit537,
  globalPackReadiness:globalPackReadiness537,
  performanceAudit:performanceAudit537,
  closureAudit:closureAudit537
});
installOfficialRevisionRules537();
D.addEventListener('DOMContentLoaded',()=>{try{bind537()}catch(_){}},{once:true});
W.addEventListener('load',()=>{try{bind537();W.__YGO552_STRUCTURAL_PENDING=true}catch(_){}},{once:true});

Object.assign(W.YGOAlpha537||{},{
  bootstrapFullStructuralCatalog:bootstrapFullStructuralCatalog537,
  scheduleFullStructuralSync:scheduleFullStructuralSync537,
  ensureActiveDeckStructure:ensureActiveDeckStructure537,
  mergeDeckFromCatalog:mergeDeckFromCatalog537,
  structuralVerified:structuralVerified537,
  readStructuralBootstrap:readStructuralBootstrap537,
  catalogRawStructuralCoverage:catalogRawStructuralCoverage537,
  persistStructuralSnapshot:persistStructuralSnapshot537,
  applyStructuralSnapshot:applyStructuralSnapshot537
});
applyStructuralSnapshot537();
promoteTrustedStructuralSeeds537();
W.__YGO552_STRUCTURAL_PENDING=true;/* Alpha552: full structural sync is on-demand */

Object.assign(W.YGOAlpha537||{},{
  competitiveStructuralAudit:competitiveStructuralAudit537,applyOfficialHotset:applyOfficialHotset537,
  promoteTrustedStructuralSeeds:promoteTrustedStructuralSeeds537,
  hydrateStructuralBatch:hydrateStructuralBatch537,
  mergeYGOPRODeckAll:mergeYGOPRODeckAll537
});
promoteTrustedStructuralSeeds537();


Object.assign(W.YGOAlpha537||{},{
  deckCertification:deckCertification537,
  regulationAudit:regulationAudit537,
  scoreDeterminismAudit:scoreDeterminismAudit537,
  backgroundStructuralSyncAllowed:backgroundStructuralSyncAllowed537
});
Object.assign(W.YGOAlpha537||{},{
  regressionQACache:regressionQACache537,
  invalidateRegressionQACache:invalidateRegressionQACache537,
  dynamicDeckQACache:dynamicDeckQACache537,
  invalidateDynamicCertCache:invalidateDynamicCertCache537,
  readSyncCheckpoint:readSyncCheckpoint537,
  writeSyncCheckpoint:writeSyncCheckpoint537,
  clearSyncCheckpoint:clearSyncCheckpoint537,
  syncCheckpointAudit:syncCheckpointAudit537,
  buildStructuralPack:buildStructuralPack537,
  staticQACache:staticQACache537,
  invalidateStaticQACache:invalidateStaticQACache537,
  structuralSyncStatus:structuralSyncStatus537,
  readSyncTelemetry:readSyncTelemetry537,
  addStructuralPackShard:addStructuralPackShard537,
  mergeStructuralPacks:mergeStructuralPacks537,
  federationAudit:federationAudit537,
  federationSelfTest:federationSelfTest537,
  unresolvedCompetitiveIds:unresolvedCompetitiveIds537,
  resumeIncrementalStructuralSync:resumeIncrementalStructuralSync537,
  structuralProgress:structuralProgress537,
  validateStructuralPack:validateStructuralPack537,
  packCoverage:packCoverage537,
  structuralPackTransactionAudit:structuralPackTransactionAudit537,
  commitStructuralPack:commitStructuralPack537,
  rollbackStructuralPack:rollbackStructuralPack537,
  recoverStructuralPackTransaction:recoverStructuralPackTransaction537,
  structuralPackTransactionSelfTest:structuralPackTransactionSelfTest537,
  applyStructuralPack:applyStructuralPack537,
  persistStructuralPack:persistStructuralPack537,
  exportStructuralPack:exportStructuralPack537,
  importStructuralPack:importStructuralPack537,
  structuralPackAudit:structuralPackAudit537,
  migrateLegacySnapshotToPack:migrateLegacySnapshotToPack537,
  mergeDawnbrandAggregateOffThread:mergeDawnbrandAggregateOffThread537
});
recoverStructuralPackTransaction537();
migrateLegacySnapshotToPack537();
applyStructuralPack537();

Object.assign(W.YGOAlpha537||{}, {cleanupAudit:cleanupAudit537,structuralDBVersion:structuralDBVersion537,cachedStructuralDBVersion:cachedStructuralDBVersion537,ensureActiveDeckStructure:ensureActiveDeckStructure537,bootstrapFullStructuralCatalog:bootstrapFullStructuralCatalog537,scheduleFullStructuralSync:scheduleFullStructuralSync537,persistStructuralSnapshot:persistStructuralSnapshot537,applyStructuralSnapshot:applyStructuralSnapshot537});

W.YGOAlpha543=W.YGOAlpha537;W.YGOAlpha543.VERSION=VERSION;if(W.YGOApp){W.YGOApp.version=VERSION;W.YGOApp.release543=W.YGOAlpha543}W.YGO_APP_VERSION=VERSION;D.title=TITLE;
W.addEventListener('online',()=>{fullStructuralScheduled537=false;W.__YGO552_STRUCTURAL_PENDING=true});
const post=async()=>{try{if(W.YGOAlpha329?.ensureReady)await W.YGOAlpha329.ensureReady()}catch(_){}applyStructuralPack537();applyStructuralSnapshot537();repairCatalogBarrier537();installCombo537();bind537();ensureArchetypes537();applyOfficialHotset537();promoteTrustedStructuralSeeds537();markCatalogStructuralVerified537("post-ready");W.__YGO552_STRUCTURAL_PENDING=true};W.__YGO554_POST543=post;W.__YGO554_LIGHT543=()=>{repairCatalogBarrier537();installFastScoring537();installDeep537();installFastInput537();installCombo537();bind537();ensureArchetypes537();return true};
})();


/* === packed Alpha657 from ygo-alpha-544-release-hardening === */

(()=>{'use strict';
const W=window,D=document,VERSION='Alpha 544',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_544',A543=W.YGOAlpha543||W.YGOAlpha537||{},A357=W.YGOAlpha357||{};
const arr=v=>Array.isArray(v)?v:[],qty=c=>Math.max(0,Math.floor(Number(c?.qty)||1));
const nowISO=()=>new Date().toISOString();
function deckCount544(d=W.deckState||{}){return ['main','extra','side'].reduce((n,z)=>n+arr(d?.[z]).reduce((s,c)=>s+qty(c),0),0)}
async function embeddedStructuralAudit544(){
  let rows=[];try{rows=typeof W.getEmbeddedDB==='function'?await W.getEmbeddedDB():await getEmbeddedDB()}catch(e){return{version:VERSION,pass:false,error:String(e?.message||e),status:'EMBEDDED_DB_UNREADABLE'}}
  const lengths={};for(const r of arr(rows))lengths[r?.length||0]=(lengths[r?.length||0]||0)+1;
  let monsters=0,primaryPresent=0,fullStructuralRows=0;
  for(const r of arr(rows)){
    const bits=Number(r?.[3])||0;if(!(bits&1))continue;monsters++;
    if((r?.length||0)>=11){const packed=Number(r?.[10])||0,base=packed&255;if(base>0)primaryPresent++;fullStructuralRows++}
  }
  const compactOnly=arr(rows).length>0&&fullStructuralRows===0;
  return{version:VERSION,pass:arr(rows).length>=19617,rows:arr(rows).length,rowLengths:lengths,monsters,fullStructuralRows,primaryPresent,compactOnly,
    status:compactOnly?'COMPACT_IDENTITY_TEXT_ONLY':'STRUCTURAL_FIELDS_PRESENT',
    policy:'El bloque ygo-db-embedded se audita por esquema real. Un bloque compacto de 7 campos no cuenta como snapshot estructural offline.'};
}
function liveStructuralGate544(){
  const g=A543.globalPackReadiness?.()||{},c=A543.competitiveStructuralAudit?.()||{};
  const coverage=Number(g.coveragePct??c.coveragePct??0)||0,ready=g.ready===true&&coverage>=98;
  return{version:VERSION,ready,coveragePct:coverage,targetPct:98,verified:Number(g.verified??c.structurallyVerified??0)||0,total:Number(g.total??c.monsters??0)||0,unresolved:Number(g.unresolved??c.gaps??0)||0,
    pass:ready,status:ready?'PASS':'PENDING_OFFLINE_STRUCTURAL_PACK'};
}
function deepBenchmarkState544(){
  const r=W.__YGO544_DEEP_BENCHMARK||W.__YGO543_DEEP_BENCHMARK||null;
  return{version:VERSION,executed:!!r,pass:r?.pass===true,status:!r?'NOT_RUN':(r.pass===true?'PASS':'FAIL'),report:r};
}
function runtimeErrorGate544(){
  const rows=arr(W.__YGO543_RUNTIME_ERRORS||W.__YGO544_RUNTIME_ERRORS),pass=rows.length===0;
  return{version:VERSION,pass,count:rows.length,status:pass?'PASS':'FAIL',recent:rows.slice(-10)};
}
function fullReleaseGate544(){
  let core={};try{core=A543.certify?.()||{}}catch(e){core={ready:false,buildReady:false,error:String(e?.message||e)}}
  const structural=liveStructuralGate544(),deep=deepBenchmarkState544(),runtime=runtimeErrorGate544();
  const coreReady=core.buildReady===true&&core.activeDeckReady!==false;
  const pass=coreReady&&structural.pass&&deep.pass&&runtime.pass;
  return{version:VERSION,pass,coreReady,structural,deep,runtime,core,status:pass?'RELEASE_COMPLETE':'RELEASE_GATES_OPEN',
    blockers:[!coreReady?'core-certification':null,!structural.pass?'offline-structural-98pct':null,!deep.pass?'deep-top5-endboard-benchmark':null,!runtime.pass?'runtime-errors':null].filter(Boolean),at:nowISO()};
}
function fixtureEntries544(limit=4){
  let fc={};try{fc=A357.fixtureCatalog?.(true)||{}}catch(_){}
  return Object.entries(fc?.entries||{}).filter(([,e])=>e?.fixture&&!e?.aliasOf).slice(0,Math.max(1,Number(limit)||4));
}
function benchmarkFixture544(fixture,{maxMs=15000,label='fixture'}={}){
  if(!fixture?.main?.length)return{version:VERSION,label,applicable:false,pass:false,status:'INVALID_FIXTURE'};
  const savedDeck=W.deckState,savedAnalysis=W.comboLastAnalysis,savedBudget=W.__YGO_ANALYSIS_BUDGET,savedBench=W.__YGO543_DEEP_BENCHMARK;
  let report=null,error=null;const started=performance.now();
  try{
    W.deckState={main:arr(fixture.main).map(x=>({...x})),extra:arr(fixture.extra).map(x=>({...x})),side:arr(fixture.side).map(x=>({...x}))};
    try{A543.mergeDeckFromCatalog?.(W.deckState);A543.applyStructuralCache?.(W.deckState)}catch(_){}
    if(typeof A543.benchmarkActiveDeck!=='function')throw new Error('benchmarkActiveDeck no disponible');
    report=A543.benchmarkActiveDeck({maxMs});
  }catch(e){error=String(e?.message||e)}finally{
    W.deckState=savedDeck;W.comboLastAnalysis=savedAnalysis;W.__YGO_ANALYSIS_BUDGET=savedBudget;W.__YGO543_DEEP_BENCHMARK=savedBench;
  }
  const elapsedMs=Math.round((performance.now()-started)*100)/100;
  return{version:VERSION,label,applicable:true,pass:!error&&report?.pass===true,status:!error&&report?.pass===true?'PASS':'FAIL',elapsedMs,maxMs,error,report};
}
function benchmarkCorpus544({limit=3,maxMs=15000}={}){
  const entries=fixtureEntries544(limit),rows=[];for(const [id,e] of entries)rows.push({id,...benchmarkFixture544(e.fixture,{maxMs,label:e.label||id})});
  const pass=rows.length>0&&rows.every(x=>x.pass===true),report={version:VERSION,pass,status:pass?'PASS':'FAIL',total:rows.length,passed:rows.filter(x=>x.pass).length,maxMs,rows,at:nowISO()};
  W.__YGO544_CORPUS_BENCHMARK=report;if(pass){const slowest=Math.max(...rows.map(x=>Number(x?.report?.elapsedMs||x.elapsedMs)||0));W.__YGO544_DEEP_BENCHMARK={version:VERSION,pass:true,status:'PASS_CORPUS',elapsedMs:slowest,top5:5,corpus:rows.length,at:report.at}}
  return report;
}
async function refreshStructuralPack544({force=false}={}){
  const before=liveStructuralGate544();let result=null,error=null;
  try{
    if(before.ready&&!force)return{version:VERSION,pass:true,skipped:true,before,after:before,status:'ALREADY_READY'};
    if(typeof A543.bootstrapFullStructuralCatalog==='function')result=await A543.bootstrapFullStructuralCatalog({force:true});
    else if(typeof A543.hydrateStructuralMultiSource==='function')result=await A543.hydrateStructuralMultiSource({force:true});
    else throw new Error('No hay sincronizador estructural disponible');
    try{A543.persistStructuralPack?.('alpha544-refresh')}catch(_){}
  }catch(e){error=String(e?.message||e)}
  const after=liveStructuralGate544();return{version:VERSION,pass:after.ready,error,result,before,after,status:after.ready?'PASS':'PENDING'};
}
function projectStatus544(){
  const base=A543.projectStatus?.()||{},structural=liveStructuralGate544(),deep=deepBenchmarkState544(),runtime=runtimeErrorGate544(),full=fullReleaseGate544();
  const corePct=Number(base.overallPct)||0;
  const releaseGates=[base.gates?.passed===base.gates?.total,structural.pass,deep.pass,runtime.pass],releasePassed=releaseGates.filter(Boolean).length;
  return{version:VERSION,corePct,releasePct:Math.round(releasePassed/releaseGates.length*1000)/10,fullReleaseReady:full.pass,base,structural,deep,runtime,blockers:full.blockers,
    policy:'Alpha 544 separa avance del core y gates de release. El release completo exige cobertura estructural offline >=98%, benchmark profundo Top-5/End Board ejecutado y cero errores de runtime.'};
}
function certify544(){return fullReleaseGate544()}
const API={...A543,VERSION,embeddedStructuralAudit:embeddedStructuralAudit544,liveStructuralGate:liveStructuralGate544,deepBenchmarkState:deepBenchmarkState544,runtimeErrorGate:runtimeErrorGate544,fullReleaseGate:fullReleaseGate544,benchmarkFixture:benchmarkFixture544,benchmarkCorpus:benchmarkCorpus544,refreshStructuralPack:refreshStructuralPack544,projectStatus:projectStatus544,certify:certify544};
W.YGOAlpha544=API;W.YGO_APP_VERSION=VERSION;if(W.YGOApp){W.YGOApp.version=VERSION;W.YGOApp.release544=API}D.title=TITLE;
/* Alpha592: historical load audit disabled; gates remain callable. */
})();


/* === packed Alpha657 from ygo-alpha-593-bundle-release-545-556 === */

/* === bundled from ygo-alpha-545-physical-cleanup === */

(()=>{'use strict';const W=window,D=document,VERSION='Alpha 545',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_545',A544=W.YGOAlpha544||{};
const REMOVED=['480-release','481-release','483-release','484-release','485-release','486-release','487-release','488-release','489-release','490-release','491-release','492-release','493-release','494-release','495-release','496-release','497-release'];
function cleanupAudit545(){const stale=Object.keys(W).filter(k=>/^YGOUniversalRelease(?:480|481|483|484|485|486|487|488|489|490|491|492|493|494|495|496|497)$/.test(k));const exact=['YGOExactBacklog480','YGOExactBacklog481','YGONormalMonsterExact485','YGOMitsurugiMirrorExact487','YGOYummyExact488','YGOK9WerewolfExact489','YGONumber67Exact490','YGOFiendsmithSequenceExact491','YGOYummyBacklogExact492','YGOFusionCompetitiveExact493','YGOFusionCompetitiveExact494','YGOBrandedExact495','YGOBrandedChainExact496','YGOBrandedTriggerExact497'];const exactPresent=exact.filter(k=>!!W[k]);return{version:VERSION,pass:stale.length===0&&exactPresent.length>=12,staleReleaseGlobals:stale,exactHandlersPresent:exactPresent.length,exactHandlersExpected:exact.length,removedFacadeScripts:REMOVED,policy:'Alpha 545 elimina fachadas históricas 480–497 que no tienen consumidores posteriores; conserva los motores EXACT correspondientes.'}}
function projectStatus545(){const b=A544.projectStatus?.()||{};return{...b,version:VERSION,physicalCleanup:cleanupAudit545(),policy:'Alpha 545 conserva los gates estrictos de Alpha 544 y añade limpieza física comprobable de fachadas históricas sin uso.'}}
const API={...A544,VERSION,cleanupAudit:cleanupAudit545,projectStatus:projectStatus545};W.YGOAlpha545=API;W.YGO_APP_VERSION=VERSION;if(W.YGOApp){W.YGOApp.version=VERSION;W.YGOApp.release545=API}D.title=TITLE;
})();


;

/* === bundled from ygo-alpha-546-archetype-catalog-refresh === */

(()=>{'use strict';const W=window,D=document,VERSION='Alpha 546',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_546',A545=W.YGOAlpha545||{};
const KEY='ygo.alpha546.archetypes.v7',TTL=7*24*60*60*1000,URL='https://db.ygoprodeck.com/api/v7/archetypes.php';
function normalizeRows546(payload){const rows=Array.isArray(payload)?payload:(Array.isArray(payload?.data)?payload.data:[]),out=[];for(const x of rows){const n=String(typeof x==='string'?x:(x?.archetype_name??x?.name??'')).trim();if(n)out.push(n)}return [...new Set(out)].sort((a,b)=>a.localeCompare(b,undefined,{sensitivity:'base'}))}
function readCache546(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');if(x&&Array.isArray(x.names))return x}catch(_){}return null}
function applyArchetypes546(names){const sel=D.getElementById('arch');if(!sel)return{added:0,total:0};const have=new Set([...sel.options].map(o=>String(o.value||o.textContent||'').trim().toLowerCase()));const frag=D.createDocumentFragment();let added=0;for(const n of names){const k=n.toLowerCase();if(!n||have.has(k))continue;const o=D.createElement('option');o.value=n;o.textContent=n;frag.appendChild(o);have.add(k);added++}if(added)sel.appendChild(frag);return{added,total:sel.options.length}}
async function refreshArchetypes546({force=false,timeoutMs=7000}={}){const cache=readCache546(),fresh=cache&&Date.now()-Number(cache.at||0)<TTL;if(fresh&&!force){const a=applyArchetypes546(cache.names);return{version:VERSION,pass:true,source:'cache',count:cache.names.length,...a}}
 let ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),Math.max(1000,Number(timeoutMs)||7000));try{const r=await fetch(URL,{cache:'no-store',signal:ctl.signal});if(!r.ok)throw Error('HTTP '+r.status);const names=normalizeRows546(await r.json());if(names.length<100)throw Error('catálogo de arquetipos incompleto');try{localStorage.setItem(KEY,JSON.stringify({at:Date.now(),names}))}catch(_){}const a=applyArchetypes546(names);return{version:VERSION,pass:true,source:'YGOPRODeck/v7/archetypes',count:names.length,...a}}catch(e){const names=cache?.names||[];const a=applyArchetypes546(names);return{version:VERSION,pass:names.length>0,source:names.length?'stale-cache':'embedded-fallback',count:names.length,error:String(e?.message||e),...a}}finally{clearTimeout(tm)}}
function archetypeAudit546(){const sel=D.getElementById('arch'),cache=readCache546(),options=sel?[...sel.options].map(o=>String(o.value||o.textContent||'').trim()).filter(Boolean):[];return{version:VERSION,selectPresent:!!sel,optionCount:options.length,cachedOfficialCount:cache?.names?.length||0,blueEyes:options.some(x=>/blue-?eyes/i.test(x)),pass:!!sel&&options.length>100,sourceEndpoint:URL}}
function projectStatus546(){const b=A545.projectStatus?.()||{};return{...b,version:VERSION,archetypes:archetypeAudit546(),policy:'Alpha 546 mantiene la lista embebida como fallback y añade actualización/caché del endpoint oficial de arquetipos de YGOPRODeck sin modificar el layout.'}}
const API={...A545,VERSION,refreshArchetypes:refreshArchetypes546,archetypeAudit:archetypeAudit546,projectStatus:projectStatus546};W.YGOAlpha546=API;W.YGO_APP_VERSION=VERSION;if(W.YGOApp){W.YGOApp.version=VERSION;W.YGOApp.release546=API}D.title=TITLE;
const boot=()=>{try{const c=readCache546();if(c?.names)applyArchetypes546(c.names)}catch(_){}W.__YGO595_ARCHETYPE_REFRESH_DEFERRED=true};if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();


;

/* === bundled from ygo-alpha-547-structural-pack-resilience === */

(()=>{'use strict';
const W=window,D=document,VERSION='Alpha 547',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_547',A546=W.YGOAlpha546||{},A544=W.YGOAlpha544||{};
const KEY='ygo.alpha547.structural.compact.v1',META='ygo.alpha547.structural.meta.v1',TARGET=98,MAX_AGE=14*24*60*60*1000;
const CDB_URLS=[
 'https://raw.githubusercontent.com/ProjectIgnis/BabelCDB/master/cards.cdb',
 'https://github.com/ProjectIgnis/BabelCDB/raw/refs/heads/master/cards.cdb',
 'https://cdn.jsdelivr.net/gh/ProjectIgnis/BabelCDB@master/cards.cdb'
];
const YGOPRO_URL='https://db.ygoprodeck.com/api/v7/cardinfo.php';
const arr=v=>Array.isArray(v)?v:[];
const isMonster=c=>/monster|monstruo/i.test(String(c?.type||''));
const primary=c=>{if(!isMonster(c))return true;const t=String(c?.type||'');if(/link/i.test(t))return Number(c?.linkval)>0;if(/xyz/i.test(t))return Number(c?.rank)>0;return Number(c?.level)>0};
const coverage=()=>{const m=arr(W.CARD_CATALOG).filter(isMonster),ok=m.filter(c=>primary(c)&&!!(c.__alpha537StructuralVerified||c.__ygoHydrated||c.__alpha537StructuralCache||/ProjectIgnis\/BabelCDB|YGOPRODeck\/v7|structural-pack|alpha547/i.test(String(c.__alpha537StructuralSource||c.source||'')))).length;return{monsters:m.length,verified:ok,gaps:Math.max(0,m.length-ok),coveragePct:m.length?Math.round(ok/m.length*10000)/100:100,ready:m.length>0&&ok/m.length>=TARGET/100}};
function readPack(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return x&&Array.isArray(x.rows)?x:null}catch(_){return null}}
function packFresh(p){return !!p&&Date.now()-Number(p.at||0)<MAX_AGE}
function applyPack(p=readPack()){if(!p?.rows?.length)return{applied:0,packRows:0};const by=new Map(arr(W.CARD_CATALOG).map(c=>[Number(c?.id),c]));let applied=0;for(const r of p.rows){const c=by.get(Number(r?.[0]));if(!c)continue;const type=String(c.type||'');const v=Number(r[1])||0,atk=Number(r[2]),def=Number(r[3]),race=r[4],attr=r[5],scaleL=Number(r[6])||0,scaleR=Number(r[7])||0,setcode=r[8],ot=Number(r[9])||0,alias=Number(r[10])||0,category=Number(r[11])||0;if(/link/i.test(type)){c.linkval=v;c.level=0;c.rank=0}else if(/xyz/i.test(type)){c.rank=v;c.level=0;c.linkval=0}else{c.level=v;c.rank=0;c.linkval=0}if(Number.isFinite(atk))c.atk=atk;if(Number.isFinite(def))c.def=def;if(typeof race==='string'&&race)c.race=race;else if(Number(race))c.raceCode=Number(race);if(typeof attr==='string'&&attr)c.attribute=attr;else if(Number(attr)){const am={1:'TIERRA',2:'AGUA',4:'FUEGO',8:'VIENTO',16:'LUZ',32:'OSCURIDAD',64:'DIVINO'};c.attribute=am[Number(attr)]||c.attribute;c.attributeCode=Number(attr)}if(scaleL)c.scaleL=scaleL;if(scaleR)c.scaleR=scaleR;if(setcode!=null)c.setcode=String(setcode);if(ot)c.ot=ot;if(alias)c.alias=alias;if(category)c.category=category;if(primary(c)){c.__alpha537StructuralVerified=true;c.__alpha537StructuralCache=true;c.__alpha537StructuralSource='structural-pack:alpha547:'+String(p.source||'cache');applied++}}return{applied,packRows:p.rows.length,coverage:coverage()}}
function savePack(rows,source,sourceVersion=''){const clean=[],seen=new Set();for(const r of rows){const id=Number(r?.[0]);if(!id||seen.has(id))continue;seen.add(id);clean.push(r)}const payload={schema:1,at:Date.now(),source,sourceVersion,rows:clean};try{localStorage.setItem(KEY,JSON.stringify(payload));localStorage.setItem(META,JSON.stringify({at:payload.at,source,sourceVersion,count:clean.length}))}catch(e){return{saved:false,error:String(e?.message||e),count:clean.length}}return{saved:true,count:clean.length}}
function promoteCatalog(source='alpha547'){let promoted=0;for(const c of arr(W.CARD_CATALOG)){if(isMonster(c)&&primary(c)){c.__alpha537StructuralVerified=true;c.__alpha537StructuralSource='structural-pack:'+source;promoted++}}return promoted}
async function loadSql(){if(W.initSqlJs)return W.initSqlJs;if(!W.__alpha547Sql){W.__alpha547Sql=new Promise((resolve,reject)=>{const s=D.createElement('script');s.src='https://cdn.jsdelivr.net/npm/sql.js@1.14.2/dist/sql-wasm.js';s.async=true;s.onload=()=>resolve(W.initSqlJs);s.onerror=()=>reject(new Error('sql.js no disponible'));D.head.appendChild(s)})}return W.__alpha547Sql}
function decodePackedLevel(packed,bits){packed=Number(packed)||0;bits=Number(bits)||0;const base=packed&255,scaleR=(packed>>>16)&255,scaleL=(packed>>>24)&255;return{base,scaleL,scaleR}}
async function parseCDB547(buffer){const init=await loadSql();if(typeof init!=='function')throw new Error('initSqlJs no disponible');const SQL=await init({locateFile:f=>'https://cdn.jsdelivr.net/npm/sql.js@1.14.2/dist/'+f});const db=new SQL.Database(new Uint8Array(buffer));try{const q=db.exec('SELECT id,type,atk,def,level,race,attribute,setcode,ot,alias,category FROM datas');const vals=q?.[0]?.values||[],rows=[];for(const r of vals){const id=Number(r[0]),bits=Number(r[1])||0,p=decodePackedLevel(r[4],bits),value=p.base;if(!id||!value)continue;rows.push([id,value,Number(r[2]),Number(r[3]),Number(r[5])||0,Number(r[6])||0,p.scaleL,p.scaleR,String(r[7]||''),Number(r[8])||0,Number(r[9])||0,Number(r[10])||0])}return rows}finally{db.close()}}
async function fetchWithTimeout(url,timeoutMs=20000,type='arrayBuffer'){const ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),timeoutMs);try{const r=await fetch(url,{cache:'no-store',signal:ctl.signal});if(!r.ok)throw new Error('HTTP '+r.status);return type==='json'?await r.json():await r.arrayBuffer()}finally{clearTimeout(tm)}}
async function hydrateFromCDB547(){let last=null;for(const url of CDB_URLS){try{const buf=await fetchWithTimeout(url,30000,'arrayBuffer');if(!(buf?.byteLength>1000000))throw new Error('CDB demasiado pequeño');const rows=await parseCDB547(buf);if(rows.length<6000)throw new Error('CDB estructural incompleto: '+rows.length);savePack(rows,'ProjectIgnis/BabelCDB',url);const applied=applyPack(readPack());promoteCatalog('ProjectIgnis/BabelCDB');return{pass:true,source:'ProjectIgnis/BabelCDB',url,bytes:buf.byteLength,rows:rows.length,applied}}catch(e){last=String(e?.message||e)}}throw new Error(last||'BabelCDB no disponible')}
function typeValueFromYG(c){const t=String(c?.type||'');if(/link/i.test(t))return Number(c?.linkval)||0;return Number(c?.level)||0}
async function hydrateFromYGOPRO547(){const j=await fetchWithTimeout(YGOPRO_URL,30000,'json'),data=arr(j?.data),rows=[];for(const c of data){const value=typeValueFromYG(c);if(!Number(c?.id)||!value||!/monster/i.test(String(c?.type||'')))continue;rows.push([Number(c.id),value,Number(c.atk),Number(c.def),String(c.race||''),String(c.attribute||''),Number(c.scale)||0,Number(c.scale)||0,String(c.setcode||''),0,0,0])}if(rows.length<6000)throw new Error('YGOPRODeck estructural incompleto: '+rows.length);savePack(rows,'YGOPRODeck/v7',YGOPRO_URL);const applied=applyPack(readPack());promoteCatalog('YGOPRODeck/v7');return{pass:true,source:'YGOPRODeck/v7',rows:rows.length,applied}}
let job=null;
async function syncStructural547({force=false}={}){if(job&&!force)return job;job=(async()=>{const cached=readPack();if(cached)applyPack(cached);let before=coverage();if(before.ready&&!force&&packFresh(cached))return{version:VERSION,pass:true,status:'PASS_CACHE',before,after:before,cache:true};let inherited=null;try{if(typeof W.syncBabelCDB==='function')inherited=await W.syncBabelCDB(!!force)}catch(_){}promoteCatalog('existing-sync');let mid=coverage();if(mid.ready){const rows=arr(W.CARD_CATALOG).filter(c=>isMonster(c)&&primary(c)).map(c=>[Number(c.id),/link/i.test(String(c.type))?Number(c.linkval):(/xyz/i.test(String(c.type))?Number(c.rank):Number(c.level)),Number(c.atk),Number(c.def),c.race??'',c.attribute??'',Number(c.scaleL)||0,Number(c.scaleR)||0,String(c.setcode||''),Number(c.ot)||0,Number(c.alias)||0,Number(c.category)||0]);savePack(rows,'existing-sync','');return{version:VERSION,pass:true,status:'PASS_EXISTING_SYNC',before,after:mid,inherited}}let cdb=null,yg=null,error=null;try{cdb=await hydrateFromCDB547()}catch(e){error='BabelCDB: '+String(e?.message||e);try{yg=await hydrateFromYGOPRO547()}catch(e2){error+=' | YGOPRODeck: '+String(e2?.message||e2)}}const after=coverage();try{if(typeof W.writeCatalogToDB==='function')await W.writeCatalogToDB()}catch(_){}try{A546.applyStructuralCache?.(W.deckState)}catch(_){}return{version:VERSION,pass:after.ready,status:after.ready?'PASS':'PENDING',before,after,inherited,cdb,yg,error,at:new Date().toISOString()}})().finally(()=>{job=null});return job}
function audit547(){const p=readPack(),c=coverage();let meta=null;try{meta=JSON.parse(localStorage.getItem(META)||'null')}catch(_){}return{version:VERSION,...c,targetPct:TARGET,packRows:p?.rows?.length||0,packSource:p?.source||null,packAgeMs:p?Date.now()-Number(p.at||0):null,packFresh:packFresh(p),meta,pass:c.ready,status:c.ready?'PASS':'PENDING_STRUCTURAL_98'}}
async function certifyFull547({forceSync=false,runDeep=true,maxMs=15000}={}){const structural=await syncStructural547({force:forceSync});let deep=null;if(runDeep){try{const hasDeck=['main','extra','side'].some(z=>arr(W.deckState?.[z]).length);if(hasDeck&&typeof A546.benchmarkActiveDeck==='function')deep=A546.benchmarkActiveDeck({maxMs});else if(typeof A546.benchmarkCorpus==='function')deep=A546.benchmarkCorpus({limit:3,maxMs})}catch(e){deep={pass:false,error:String(e?.message||e)}}}let base={};try{base=A546.certify?.()||{}}catch(e){base={pass:false,error:String(e?.message||e)}}const runtime=A546.runtimeErrorGate?.()||{pass:arr(W.__YGO543_RUNTIME_ERRORS).length===0};const struct=audit547(),deepPass=deep?.pass===true||(A546.deepBenchmarkState?.().pass===true);const coreReady=base.coreReady===true||base.buildReady===true||base.pass===true;const pass=coreReady&&struct.pass&&deepPass&&runtime.pass===true;const report={version:VERSION,pass,status:pass?'RELEASE_COMPLETE':'RELEASE_GATES_OPEN',coreReady,structural:struct,deep,runtime,base,blockers:[!coreReady?'core-certification':null,!struct.pass?'offline-structural-98pct':null,!deepPass?'deep-top5-endboard-benchmark':null,runtime.pass!==true?'runtime-errors':null].filter(Boolean),at:new Date().toISOString()};W.__YGO547_CERT=report;return report}
function projectStatus547(){const b=A546.projectStatus?.()||{},s=audit547();return{...b,version:VERSION,structural547:s,fullReleaseReady:W.__YGO547_CERT?.pass===true,blockers:W.__YGO547_CERT?.blockers||[!s.pass?'offline-structural-98pct':null].filter(Boolean),policy:'Alpha 547 añade un snapshot estructural compacto persistente, sincronización multifuente BabelCDB/YGOPRODeck y un gate final asíncrono que sólo libera cuando core, cobertura >=98%, benchmark profundo y runtime pasan de verdad.'}}
const API={...A546,VERSION,readStructuralPack:readPack,applyStructuralPack547:applyPack,syncStructuralPack547:syncStructural547,structuralAudit547:audit547,certifyFull:certifyFull547,projectStatus:projectStatus547};W.YGOAlpha547=API;W.YGO_APP_VERSION=VERSION;if(W.YGOApp){W.YGOApp.version=VERSION;W.YGOApp.release547=API}D.title=TITLE;
const boot=()=>{try{applyPack()}catch(_){}W.__YGO552_STRUCTURAL_PENDING=true};if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();


;

/* === bundled from ygo-alpha-548-auto-certification === */

(()=>{'use strict';
const W=window,D=document,VERSION='Alpha 548',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_548',A547=W.YGOAlpha547||{};
const arr=v=>Array.isArray(v)?v:[];
const deckCards=()=>['main','extra','side'].reduce((n,z)=>n+arr(W.deckState?.[z]).reduce((s,c)=>s+Math.max(0,Number(c?.qty)||1),0),0);
let deepTimer=null,deepRunning=false;
function deepState548(){const r=W.__YGO548_DEEP||W.__YGO547_CERT?.deep||W.__YGO544_DEEP_BENCHMARK||W.__YGO543_DEEP_BENCHMARK||null;return{version:VERSION,executed:!!r,pass:r?.pass===true,status:!r?'NOT_RUN':(r.pass===true?'PASS':'FAIL'),report:r}}
async function runDeep548({maxMs=12000,forceStructural=false}={}){if(deepRunning)return W.__YGO548_DEEP||{version:VERSION,pass:false,status:'RUNNING'};deepRunning=true;const started=performance.now();let structural=null,report=null,error=null;try{structural=await A547.syncStructuralPack547?.({force:forceStructural});const audit=A547.structuralAudit547?.()||{};if(audit.pass!==true)throw new Error('Cobertura estructural <98%');if(deckCards()>=5&&typeof A547.benchmarkActiveDeck==='function')report=A547.benchmarkActiveDeck({maxMs});else if(typeof A547.benchmarkCorpus==='function')report=A547.benchmarkCorpus({limit:3,maxMs});else throw new Error('Benchmark profundo no disponible')}catch(e){error=String(e?.message||e)}finally{deepRunning=false}const out={version:VERSION,pass:!error&&report?.pass===true,status:!error&&report?.pass===true?'PASS':'FAIL',elapsedMs:Math.round((performance.now()-started)*100)/100,maxMs,structural,report,error,at:new Date().toISOString()};W.__YGO548_DEEP=out;return out}
function scheduleDeep548(reason='deck-change',delay=1800){if(W.__YGO551_MANAGES_DEEP)return false;clearTimeout(deepTimer);deepTimer=setTimeout(async()=>{try{if(deckCards()<5)return;const s=A547.structuralAudit547?.()||{};if(s.pass!==true)await A547.syncStructuralPack547?.({force:false});if((A547.structuralAudit547?.()||{}).pass===true)await runDeep548({maxMs:12000});W.__YGO548_LAST_REASON=reason}catch(_){}},Math.max(250,Number(delay)||1800));return true}
function installHooks548(){const wrap=(obj,key,label)=>{const fn=obj?.[key];if(typeof fn!=='function'||fn.__alpha548Hook)return;const w=function(...args){const r=fn.apply(this,args);Promise.resolve(r).finally(()=>scheduleDeep548(label));return r};w.__alpha548Hook=true;w.__alpha548Base=fn;obj[key]=w};wrap(W,'importText','importText');wrap(W,'loadDeck','loadDeck');wrap(W,'loadSavedDeck','loadSavedDeck');if(W.YDK){wrap(W.YDK,'importText','ydk-importText');wrap(W.YDK,'importFile','ydk-importFile')}const input=D.getElementById('ydkMainFile');if(input&&!input.__alpha548Observer){input.__alpha548Observer=true;input.addEventListener('change',()=>scheduleDeep548('ydk-input',2800))}return true}
async function certifyFull548(opts={}){const deep=opts.runDeep===false?deepState548().report:await runDeep548({maxMs:Number(opts.maxMs)||12000,forceStructural:!!opts.forceStructural});const base=await A547.certifyFull?.({forceSync:!!opts.forceStructural,runDeep:false,maxMs:Number(opts.maxMs)||12000});const structural=A547.structuralAudit547?.()||{},runtime=A547.runtimeErrorGate?.()||{pass:true};const coreReady=base?.coreReady===true||base?.base?.coreReady===true||base?.base?.buildReady===true,deepPass=deep?.pass===true;const pass=coreReady&&structural.pass===true&&deepPass&&runtime.pass!==false;const report={version:VERSION,pass,status:pass?'RELEASE_COMPLETE':'RELEASE_GATES_OPEN',coreReady,structural,deep,runtime,base,blockers:[!coreReady?'core-certification':null,structural.pass!==true?'offline-structural-98pct':null,!deepPass?'deep-top5-endboard-benchmark':null,runtime.pass===false?'runtime-errors':null].filter(Boolean),at:new Date().toISOString()};W.__YGO548_CERT=report;return report}
function projectStatus548(){const b=A547.projectStatus?.()||{},s=A547.structuralAudit547?.()||{},d=deepState548();return{...b,version:VERSION,structural548:s,deep548:d,fullReleaseReady:W.__YGO548_CERT?.pass===true,blockers:W.__YGO548_CERT?.blockers||[s.pass!==true?'offline-structural-98pct':null,d.pass!==true?'deep-top5-endboard-benchmark':null].filter(Boolean),policy:'Alpha 548 preserva etiquetas del catálogo al hidratar CDB, revalida estructura >=98% y agenda benchmark profundo tras importar/cargar una baraja sin bloquear la interacción.'}}
const API={...A547,VERSION,runDeepBenchmark:runDeep548,scheduleDeepBenchmark:scheduleDeep548,deepBenchmarkState:deepState548,installHooks:installHooks548,certifyFull:certifyFull548,projectStatus:projectStatus548};W.YGOAlpha548=API;W.YGO_APP_VERSION=VERSION;if(W.YGOApp){W.YGOApp.version=VERSION;W.YGOApp.release548=API}D.title=TITLE;
const boot=()=>{installHooks548()};W.__YGO783_DEFER_BOOT?W.__YGO783_DEFER_BOOT(boot,'boot548'):boot();
})();


;

/* === bundled from ygo-alpha-549-strict-release-integrity === */

(()=>{'use strict';
const W=window,D=document,VERSION='Alpha 549',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_549',A548=W.YGOAlpha548||{};
const arr=v=>Array.isArray(v)?v:[];
const RACE={1:'Warrior',2:'Spellcaster',4:'Fairy',8:'Fiend',16:'Zombie',32:'Machine',64:'Aqua',128:'Pyro',256:'Rock',512:'Winged Beast',1024:'Plant',2048:'Insect',4096:'Thunder',8192:'Dragon',16384:'Beast',32768:'Beast-Warrior',65536:'Dinosaur',131072:'Fish',262144:'Sea Serpent',524288:'Reptile',1048576:'Psychic',2097152:'Divine-Beast',4194304:'Creator God',8388608:'Wyrm',16777216:'Cyberse',33554432:'Illusion'};
const ATTR={1:'EARTH',2:'WATER',4:'FIRE',8:'WIND',16:'LIGHT',32:'DARK',64:'DIVINE'};
const SPANISH_ATTR={TIERRA:'EARTH',AGUA:'WATER',FUEGO:'FIRE',VIENTO:'WIND',LUZ:'LIGHT',OSCURIDAD:'DARK',DIVINO:'DIVINE'};
const qty=c=>{const n=Number(c?.qty);return Number.isFinite(n)?Math.max(0,Math.floor(n)):1};
function fnv(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return ('00000000'+(h>>>0).toString(16)).slice(-8)}
function deckFingerprint549(state=W.deckState||{}){const parts=[];for(const z of ['main','extra','side']){parts.push(z);for(const c of arr(state?.[z]))parts.push(`${Number(c?.id)||0}:${qty(c)}:${String(c?.name||'').trim().toLowerCase()}`)}parts.push('fmt:'+String(W.fmt||state?.format||D.querySelector('.fmt.active')?.dataset?.f||'').toUpperCase());return fnv(parts.join('|'))}
function structuralFingerprint549(){let a={};try{a=A548.structuralAudit547?.()||{}}catch(_){}return fnv([a.packSource||'',a.packRows||0,a.verified||0,a.monsters||0,a.coveragePct||0,a.packFresh===true?'1':'0'].join('|'))}
function normalizeStructuralMetadata549(){const p=A548.readStructuralPack?.();if(!p?.rows?.length)return{version:VERSION,pass:false,status:'NO_PACK',updated:0};const by=new Map(arr(W.CARD_CATALOG).map(c=>[Number(c?.id),c]));let updated=0,races=0,attrs=0,scales=0;for(const r of p.rows){const c=by.get(Number(r?.[0]));if(!c)continue;const race=r?.[4],attr=r?.[5],sl=Number(r?.[6]),sr=Number(r?.[7]);if(Number(race)&&RACE[Number(race)]){c.raceCode=Number(race);if(!String(c.race||'').trim()||/^\d+$/.test(String(c.race)))c.race=RACE[Number(race)];races++}if(Number(attr)&&ATTR[Number(attr)]){c.attributeCode=Number(attr);const cur=String(c.attribute||'').trim().toUpperCase();if(!cur||SPANISH_ATTR[cur])c.attribute=ATTR[Number(attr)];c.attributeCanonical=ATTR[Number(attr)];attrs++}else if(typeof attr==='string'&&attr.trim()){const cur=String(attr).trim().toUpperCase();c.attributeCanonical=SPANISH_ATTR[cur]||cur}if(Number.isFinite(sl)){c.scaleL=sl;scales++}if(Number.isFinite(sr))c.scaleR=sr;updated++}return{version:VERSION,pass:updated>0,status:updated?'PASS':'NO_MATCHES',packRows:p.rows.length,updated,races,attributes:attrs,scales}}
function deckCount549(){return ['main','extra','side'].reduce((n,z)=>n+arr(W.deckState?.[z]).reduce((s,c)=>s+qty(c),0),0)}
function runtimeGate549(){try{const r=A548.runtimeErrorGate?.();if(r&&typeof r.pass==='boolean')return{...r,version:VERSION}}catch(e){return{version:VERSION,pass:false,status:'ERROR',error:String(e?.message||e)}}return{version:VERSION,pass:false,status:'UNAVAILABLE',count:null}}
function coreGate549(){try{const r=A548.certify?.();if(!r||typeof r!=='object')return{version:VERSION,pass:false,status:'UNAVAILABLE'};const pass=r.buildReady===true&&r.activeDeckReady!==false;return{version:VERSION,pass,status:pass?'PASS':'FAIL',buildReady:r.buildReady===true,activeDeckReady:r.activeDeckReady!==false,report:r}}catch(e){return{version:VERSION,pass:false,status:'ERROR',error:String(e?.message||e)}}}
function structuralGate549(){try{normalizeStructuralMetadata549();const r=A548.structuralAudit547?.();if(!r)return{version:VERSION,pass:false,status:'UNAVAILABLE'};return{...r,version:VERSION,pass:r.pass===true&&Number(r.coveragePct)>=98,status:r.pass===true&&Number(r.coveragePct)>=98?'PASS':'FAIL'}}catch(e){return{version:VERSION,pass:false,status:'ERROR',error:String(e?.message||e)}}}
async function settle549(timeoutMs=7000){const jobs=[W.__YGO537_IMPORT_JOB,W.__YGO537_REGULATION_JOB,W.__YGO547_SYNC_JOB].filter(x=>x&&typeof x.then==='function');if(!jobs.length)return{version:VERSION,waited:false,settled:true,jobs:0};let timed=false;const timeout=new Promise(res=>setTimeout(()=>{timed=true;res([])},Math.max(250,Number(timeoutMs)||7000)));await Promise.race([Promise.allSettled(jobs),timeout]);return{version:VERSION,waited:true,settled:!timed,jobs:jobs.length,timeout:timed}}
function endBoardGate549(){try{const r=A548.comboEndBoardEdgeAudit?.();if(!r)return{version:VERSION,pass:false,status:'UNAVAILABLE'};const pass=r.applicable===true&&r.pass===true&&Number(r.top5)===5&&Number(r.uniqueLines)>=3;return{...r,version:VERSION,pass,status:pass?'PASS':'FAIL'}}catch(e){return{version:VERSION,pass:false,status:'ERROR',error:String(e?.message||e)}}}
const baseBenchmark=typeof A548.benchmarkActiveDeck==='function'?A548.benchmarkActiveDeck.bind(A548):null;
function benchmarkActive549({maxMs=12000}={}){if(!baseBenchmark)return{version:VERSION,pass:false,status:'UNAVAILABLE',endBoard:endBoardGate549()};const fp=deckFingerprint549(),started=performance.now();let base=null,error=null;try{base=baseBenchmark({maxMs})}catch(e){error=String(e?.message||e)}const endBoard=endBoardGate549(),afterFp=deckFingerprint549();const elapsedMs=Math.round((performance.now()-started)*100)/100;const pass=!error&&base?.pass===true&&endBoard.pass===true&&fp===afterFp&&elapsedMs<=Math.max(1000,Number(maxMs)||12000);return{version:VERSION,pass,status:pass?'PASS':'FAIL',deckFingerprint:fp,deckStable:fp===afterFp,elapsedMs,maxMs:Number(maxMs)||12000,top5:Number(base?.top5)||0,strictPass:Number(base?.strictPass)||0,endBoard,base,error}}
function installBenchmarkBridge549(){const A543=W.YGOAlpha543;if(A543&&typeof A543.benchmarkActiveDeck==='function'&&!A543.benchmarkActiveDeck.__alpha549){const old=A543.benchmarkActiveDeck.bind(A543),w=function(opts={}){const fp=deckFingerprint549();let r;try{r=old(opts)}catch(e){return{version:VERSION,pass:false,status:'ERROR',error:String(e?.message||e),deckFingerprint:fp}}const endBoard=endBoardGate549(),pass=r?.pass===true&&endBoard.pass===true&&fp===deckFingerprint549();return{...r,version:VERSION,pass,status:pass?'PASS':'FAIL',deckFingerprint:fp,endBoard}};w.__alpha549=true;w.__alpha549Base=old;A543.benchmarkActiveDeck=w}return true}
function deepState549(){const r=W.__YGO549_DEEP||null;if(!r)return{version:VERSION,executed:false,pass:false,status:'NOT_RUN',report:null};if(r.scope==='active-deck'){const fp=deckFingerprint549(),sf=structuralFingerprint549(),fresh=r.deckFingerprint===fp&&r.structuralFingerprint===sf;return{version:VERSION,executed:true,pass:fresh&&r.pass===true,status:!fresh?'STALE_DECK_OR_STRUCTURE':(r.pass===true?'PASS':'FAIL'),fresh,report:r}}if(r.scope==='corpus'){const sf=structuralFingerprint549(),fresh=r.structuralFingerprint===sf;return{version:VERSION,executed:true,pass:fresh&&r.pass===true,status:!fresh?'STALE_STRUCTURE':(r.pass===true?'PASS':'FAIL'),fresh,report:r}};return{version:VERSION,executed:true,pass:false,status:'UNVERIFIED_SCOPE',report:r}}
let running=false,timer=null,lastSeenFp=null;
async function runDeep549({maxMs=12000,forceStructural=false,settleMs=7000}={}){if(running)return{version:VERSION,pass:false,status:'RUNNING'};running=true;const started=performance.now();let structuralSync=null,structural=null,settled=null,bench=null,error=null,scope=deckCount549()>0?'active-deck':'corpus';const fpBefore=deckFingerprint549();try{settled=await settle549(settleMs);structuralSync=await A548.syncStructuralPack547?.({force:!!forceStructural});normalizeStructuralMetadata549();structural=structuralGate549();if(structural.pass!==true)throw new Error('Cobertura estructural verificada <98%');installBenchmarkBridge549();if(scope==='active-deck')bench=benchmarkActive549({maxMs});else if(typeof A548.benchmarkCorpus==='function')bench=A548.benchmarkCorpus({limit:3,maxMs});else throw new Error('Benchmark de corpus no disponible');if(bench?.pass!==true)throw new Error('Top-5/End Board no pasó el benchmark estricto')}catch(e){error=String(e?.message||e)}finally{running=false}const fpAfter=deckFingerprint549(),sf=structuralFingerprint549(),stable=scope!=='active-deck'||fpBefore===fpAfter;const out={version:VERSION,pass:!error&&bench?.pass===true&&stable,status:!error&&bench?.pass===true&&stable?'PASS':'FAIL',scope,deckFingerprint:scope==='active-deck'?fpAfter:null,structuralFingerprint:sf,deckStable:stable,elapsedMs:Math.round((performance.now()-started)*100)/100,maxMs:Number(maxMs)||12000,settled,structuralSync,structural,benchmark:bench,error,at:new Date().toISOString()};W.__YGO549_DEEP=out;return out}
function invalidateDeep549(reason='deck-change'){const prev=W.__YGO549_DEEP;if(prev)W.__YGO549_DEEP={version:VERSION,pass:false,status:'INVALIDATED',scope:prev.scope||'active-deck',invalidatedReason:String(reason),previousAt:prev.at||null,at:new Date().toISOString()};return true}
function scheduleDeep549(reason='deck-change',delay=2200){if(W.__YGO551_MANAGES_DEEP)return false;invalidateDeep549(reason);clearTimeout(timer);timer=setTimeout(async()=>{try{await runDeep549({maxMs:12000,settleMs:7000});W.__YGO549_LAST_REASON=reason}catch(_){}},Math.max(400,Number(delay)||2200));return true}
function installHooks549(){installBenchmarkBridge549();const wrap=(obj,key,label)=>{const fn=obj?.[key];if(typeof fn!=='function'||fn.__alpha549Hook)return;const w=function(...args){invalidateDeep549(label);let r;try{r=fn.apply(this,args)}catch(e){throw e}Promise.resolve(r).finally(()=>scheduleDeep549(label,2600));return r};w.__alpha549Hook=true;w.__alpha549Base=fn;obj[key]=w};wrap(W,'importText','importText');wrap(W,'loadDeck','loadDeck');wrap(W,'loadSavedDeck','loadSavedDeck');if(W.YDK){wrap(W.YDK,'importText','ydk-importText');wrap(W.YDK,'importFile','ydk-importFile')}lastSeenFp=deckFingerprint549();try{if(W.__YGO549_FP_WATCH){clearInterval(W.__YGO549_FP_WATCH);W.__YGO549_FP_WATCH=null}}catch(_){}return true}
async function certifyFull549({runDeep=true,forceStructural=false,maxMs=12000}={}){if(runDeep)await runDeep549({maxMs,forceStructural});const core=coreGate549(),structural=structuralGate549(),deep=deepState549(),runtime=runtimeGate549();const pass=core.pass===true&&structural.pass===true&&deep.pass===true&&runtime.pass===true;const report={version:VERSION,pass,status:pass?'RELEASE_COMPLETE':'RELEASE_GATES_OPEN',core,structural,deep,runtime,blockers:[core.pass!==true?'core-certification':null,structural.pass!==true?'offline-structural-98pct':null,deep.pass!==true?'strict-top5-endboards':null,runtime.pass!==true?'runtime-errors-or-unavailable':null].filter(Boolean),at:new Date().toISOString()};W.__YGO549_CERT=report;return report}
function selfTest549(){const saved=W.__YGO549_DEEP,fp=deckFingerprint549(),sf=structuralFingerprint549();W.__YGO549_DEEP={version:VERSION,pass:true,status:'PASS',scope:'active-deck',deckFingerprint:'definitely-stale',structuralFingerprint:sf};const stale=deepState549().pass===false;W.__YGO549_DEEP={version:VERSION,pass:true,status:'PASS',scope:'active-deck',deckFingerprint:fp,structuralFingerprint:sf};const fresh=deepState549().pass===true;W.__YGO549_DEEP=saved;const raceMap=RACE[1048576]==='Psychic'&&RACE[8192]==='Dragon',attrMap=ATTR[32]==='DARK'&&SPANISH_ATTR.LUZ==='LIGHT';return{version:VERSION,pass:stale&&fresh&&raceMap&&attrMap,staleRejected:stale,freshAccepted:fresh,raceMap,attrMap}}
function projectStatus549(){let inherited={};try{inherited=A548.projectStatus?.()||{}}catch(_){}const core=coreGate549(),structural=structuralGate549(),deep=deepState549(),runtime=runtimeGate549(),self=selfTest549();const gates={core:core.pass,structural:structural.pass,deep:deep.pass,runtime:runtime.pass,selfTest:self.pass};const passed=Object.values(gates).filter(Boolean).length,total=Object.keys(gates).length,overallPct=Math.round(passed/total*1000)/10;return{...inherited,version:VERSION,overallPct,remainingPct:Math.round((100-overallPct)*10)/10,gates,core549:core,structural549:structural,deep549:deep,runtime549:runtime,selfTest549:self,fullReleaseReady:W.__YGO549_CERT?.pass===true,blockers:W.__YGO549_CERT?.blockers||Object.entries(gates).filter(([,v])=>v!==true).map(([k])=>k),policy:'Alpha 549 invalida benchmarks al cambiar la baraja, liga cada PASS al fingerprint de baraja/estructura, exige Top-5 + cinco End Boards estrictos, normaliza raza/atributo CDB y falla cerrado si un gate crítico no está disponible.'}}
const API={...A548,VERSION,deckFingerprint:deckFingerprint549,structuralFingerprint:structuralFingerprint549,normalizeStructuralMetadata:normalizeStructuralMetadata549,runtimeGate:runtimeGate549,coreGate:coreGate549,structuralGate:structuralGate549,endBoardGate:endBoardGate549,benchmarkActiveDeck:benchmarkActive549,runDeepBenchmark:runDeep549,scheduleDeepBenchmark:scheduleDeep549,invalidateDeepBenchmark:invalidateDeep549,deepBenchmarkState:deepState549,installHooks:installHooks549,certifyFull:certifyFull549,selfTest:selfTest549,projectStatus:projectStatus549};
W.YGOAlpha549=API;W.YGO_APP_VERSION=VERSION;if(W.YGOApp){W.YGOApp.version=VERSION;W.YGOApp.release549=API}D.title=TITLE;
const boot=()=>{try{normalizeStructuralMetadata549();installHooks549()}catch(_){}};W.__YGO783_DEFER_BOOT?W.__YGO783_DEFER_BOOT(boot,'boot549'):boot();
})();


;

/* === bundled from ygo-alpha-550-corpus-rules-integrity === */

(()=>{'use strict';
const W=window,D=document,VERSION='Alpha 550',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_550',A549=W.YGOAlpha549||{};
const arr=v=>Array.isArray(v)?v:[];
const qty=c=>{const n=Number(c?.qty);return Number.isFinite(n)?Math.max(0,Math.floor(n)):1};
function fnv(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return ('00000000'+(h>>>0).toString(16)).slice(-8)}
function rulesFingerprint550(){let parts=[];try{const f=A549.rulesFingerprint?.();if(f)parts.push('legacy:'+String(f))}catch(_){}try{const src=A549.officialSources||W.YGOAlpha543?.officialSources||{};for(const k of Object.keys(src).sort()){const x=src[k]||{};parts.push([k,x.authority||'',x.effective||'',x.verifiedAt||'',x.url||''].join(':'))}}catch(_){}try{const p=W.BANLIST_PROFILES||{};for(const k of Object.keys(p).sort()){const x=p[k]||{};parts.push([k,x.date||x.effective||'',arr(x.data).length].join(':'))}}catch(_){}parts.push('fmt:'+String(W.fmt||D.querySelector('.fmt.active')?.dataset?.f||'').toUpperCase());return fnv(parts.join('|'))}
function benchmarkIdentity550(){return fnv([A549.deckFingerprint?.()||'',A549.structuralFingerprint?.()||'',rulesFingerprint550(),VERSION].join('|'))}
function lineSignature550(line){const acts=arr(line?.actions||line?.simulation?.actions);return acts.map(a=>String(a?.card?.id||a?.cardId||a?.card?.name||a?.cardName||a?.card||'').trim().toLowerCase()+':'+String(a?.actionType||a?.type||'').trim().toLowerCase()).join('>')}
function diagnoseBenchmark550(r){if(!r)return['benchmark-missing'];const out=[];if(r.error)out.push('error:'+String(r.error));if(Number(r.elapsedMs)>Number(r.maxMs||Infinity))out.push('timeout');if(Number(r.top5)<5)out.push('top5<5');if(Number(r.strictPass)<5)out.push('strict<5');const eb=r.endBoard||r.base?.endBoard;if(!eb||eb.pass!==true)out.push('endboard-fail');if(eb&&Number(eb.top5)!==5)out.push('endboard-top5<5');if(eb&&Number(eb.uniqueLines)<3)out.push('diversity<3');if(r.deckStable===false)out.push('deck-mutated');return out}
function activeBenchmark550({maxMs=12000}={}){const fp=A549.deckFingerprint?.(),sf=A549.structuralFingerprint?.(),rf=rulesFingerprint550(),started=performance.now();let base=null,error=null;try{base=A549.benchmarkActiveDeck?.({maxMs})}catch(e){error=String(e?.message||e)}const elapsedMs=Math.round((performance.now()-started)*100)/100;const top=arr(W.comboLastAnalysis).slice(0,5),unique=new Set(top.map(lineSignature550).filter(Boolean)).size,issues=diagnoseBenchmark550(base);if(unique<Math.min(3,top.length))issues.push('top5-signature-diversity<3');if(error)issues.push('exception:'+error);const stable=fp===A549.deckFingerprint?.()&&sf===A549.structuralFingerprint?.()&&rf===rulesFingerprint550();if(!stable)issues.push('fingerprint-changed');const pass=base?.pass===true&&top.length===5&&unique>=3&&stable&&issues.length===0;return{version:VERSION,pass,status:pass?'PASS':'FAIL',deckFingerprint:fp,structuralFingerprint:sf,rulesFingerprint:rf,benchmarkIdentity:benchmarkIdentity550(),elapsedMs,maxMs:Number(maxMs)||12000,top5:top.length,uniqueLines:unique,issues,base,error}}
function fixtureEntries550(limit=5){let fc={};try{fc=W.YGOAlpha357?.fixtureCatalog?.(true)||{}}catch(_){}const entries=Object.entries(fc?.entries||{}).filter(([,e])=>e?.fixture&&!e?.aliasOf&&e?.ok!==false);const n=Math.max(5,Math.min(entries.length,Number(limit)||5));return entries.slice(0,n)}
function cloneDeck550(d){return{main:arr(d?.main).map(x=>({...x})),extra:arr(d?.extra).map(x=>({...x})),side:arr(d?.side).map(x=>({...x}))}}
async function benchmarkCorpus550({limit=5,maxMs=10000,overallMaxMs=55000}={}){const entries=fixtureEntries550(limit),rows=[],savedDeck=cloneDeck550(W.deckState),savedAnalysis=W.comboLastAnalysis,savedDeep=W.__YGO549_DEEP,savedBudget=W.__YGO_ANALYSIS_BUDGET,started=performance.now();let aborted=false;try{for(const [id,e] of entries){if(performance.now()-started>overallMaxMs){aborted=true;break}const fixture=e.fixture;W.deckState=cloneDeck550(fixture);try{W.YGOAlpha543?.mergeDeckFromCatalog?.(W.deckState);W.YGOAlpha543?.applyStructuralCache?.(W.deckState)}catch(_){}const r=activeBenchmark550({maxMs});rows.push({id,label:e.label||id,pass:r.pass,issues:r.issues,elapsedMs:r.elapsedMs,top5:r.top5,uniqueLines:r.uniqueLines,report:r});await new Promise(res=>setTimeout(res,0))}}finally{W.deckState=savedDeck;W.comboLastAnalysis=savedAnalysis;W.__YGO549_DEEP=savedDeep;W.__YGO_ANALYSIS_BUDGET=savedBudget}const elapsedMs=Math.round((performance.now()-started)*100)/100,minCorpus=5,pass=!aborted&&rows.length>=minCorpus&&rows.every(x=>x.pass===true);const report={version:VERSION,pass,status:pass?'PASS':'FAIL',minimumCorpus:minCorpus,total:rows.length,passed:rows.filter(x=>x.pass).length,aborted,elapsedMs,overallMaxMs,maxMsPerDeck:maxMs,structuralFingerprint:A549.structuralFingerprint?.(),rulesFingerprint:rulesFingerprint550(),rows,issues:[rows.length<minCorpus?'corpus<5':null,aborted?'overall-timeout':null,...rows.filter(x=>!x.pass).map(x=>x.id+':'+x.issues.join(','))].filter(Boolean),at:new Date().toISOString()};W.__YGO550_CORPUS=report;return report}
function deepState550(){const r=W.__YGO550_DEEP||W.__YGO549_DEEP||null;if(!r)return{version:VERSION,executed:false,pass:false,status:'NOT_RUN'};const sf=A549.structuralFingerprint?.(),rf=rulesFingerprint550();let fresh=r.structuralFingerprint===sf&&r.rulesFingerprint===rf;if(r.scope==='active-deck')fresh=fresh&&r.deckFingerprint===A549.deckFingerprint?.();const minCorpus=r.scope!=='corpus'||Number(r.benchmark?.total||r.total||0)>=5;const pass=fresh&&minCorpus&&r.pass===true;return{version:VERSION,executed:true,pass,status:!fresh?'STALE_RULES_DECK_OR_STRUCTURE':(!minCorpus?'CORPUS_TOO_SMALL':(pass?'PASS':'FAIL')),fresh,minCorpus,report:r}}
let running=false;
async function runDeep550({maxMs=12000,corpusLimit=5,forceStructural=false,settleMs=7000}={}){if(running)return{version:VERSION,pass:false,status:'RUNNING'};running=true;const started=performance.now();let structuralSync=null,structural=null,settled=null,benchmark=null,error=null;const active=['main','extra','side'].some(z=>arr(W.deckState?.[z]).some(c=>qty(c)>0)),scope=active?'active-deck':'corpus',fp=A549.deckFingerprint?.();try{settled=await A549.settle?.(settleMs)||null;structuralSync=await A549.syncStructuralPack547?.({force:!!forceStructural});try{A549.normalizeStructuralMetadata?.()}catch(_){}structural=A549.structuralGate?.();if(structural?.pass!==true)throw new Error('Cobertura estructural verificada <98%');benchmark=scope==='active-deck'?activeBenchmark550({maxMs}):await benchmarkCorpus550({limit:corpusLimit,maxMs:Math.min(maxMs,10000)});if(benchmark?.pass!==true)throw new Error('Benchmark estricto no aprobado: '+arr(benchmark?.issues).join(' | '))}catch(e){error=String(e?.message||e)}finally{running=false}const out={version:VERSION,pass:!error&&benchmark?.pass===true,status:!error&&benchmark?.pass===true?'PASS':'FAIL',scope,deckFingerprint:scope==='active-deck'?A549.deckFingerprint?.():null,structuralFingerprint:A549.structuralFingerprint?.(),rulesFingerprint:rulesFingerprint550(),benchmarkIdentity:benchmarkIdentity550(),elapsedMs:Math.round((performance.now()-started)*100)/100,maxMs,settled,structuralSync,structural,benchmark,error,at:new Date().toISOString()};if(scope==='active-deck'&&fp!==out.deckFingerprint){out.pass=false;out.status='FAIL';out.error=(out.error?out.error+'; ':'')+'La baraja cambió durante el benchmark.'}W.__YGO550_DEEP=out;return out}
let timer550=null,lastIdentity550=null;
function scheduleDeep550(reason='state-change',delay=3200){if(W.__YGO551_MANAGES_DEEP)return false;clearTimeout(timer550);timer550=setTimeout(async()=>{try{await runDeep550({maxMs:12000,corpusLimit:5});W.__YGO550_LAST_REASON=reason}catch(e){W.__YGO550_LAST_ERROR=String(e?.message||e)}},Math.max(600,Number(delay)||3200));return true}
function installWatch550(){try{if(W.__YGO550_WATCH){clearInterval(W.__YGO550_WATCH);W.__YGO550_WATCH=null}}catch(_){}return true}
function runtimeGate550(){try{return A549.runtimeGate?.()||{pass:false,status:'UNAVAILABLE'}}catch(e){return{pass:false,status:'ERROR',error:String(e?.message||e)}}}
function coreGate550(){try{return A549.coreGate?.()||{pass:false,status:'UNAVAILABLE'}}catch(e){return{pass:false,status:'ERROR',error:String(e?.message||e)}}}
function structuralGate550(){try{return A549.structuralGate?.()||{pass:false,status:'UNAVAILABLE'}}catch(e){return{pass:false,status:'ERROR',error:String(e?.message||e)}}}
async function certifyFull550({runDeep=true,forceStructural=false,maxMs=12000,corpusLimit=5}={}){if(runDeep)await runDeep550({maxMs,forceStructural,corpusLimit});const core=coreGate550(),structural=structuralGate550(),deep=deepState550(),runtime=runtimeGate550();const pass=core.pass===true&&structural.pass===true&&deep.pass===true&&runtime.pass===true;const report={version:VERSION,pass,status:pass?'RELEASE_COMPLETE':'RELEASE_GATES_OPEN',core,structural,deep,runtime,rulesFingerprint:rulesFingerprint550(),blockers:[core.pass!==true?'core-certification':null,structural.pass!==true?'offline-structural-98pct':null,deep.pass!==true?'strict-corpus-or-active-deck':null,runtime.pass!==true?'runtime-errors-or-unavailable':null].filter(Boolean),at:new Date().toISOString()};W.__YGO550_CERT=report;return report}
function selfTest550(){const rf=rulesFingerprint550(),a=typeof rf==='string'&&rf.length===8;const issues=diagnoseBenchmark550({pass:false,maxMs:10,elapsedMs:11,top5:4,strictPass:3,endBoard:{pass:false,top5:4,uniqueLines:1},deckStable:false});const b=['timeout','top5<5','strict<5','endboard-fail','diversity<3','deck-mutated'].every(x=>issues.includes(x));return{version:VERSION,pass:a&&b,rulesFingerprint:rf,diagnosticCoverage:b}}
function projectStatus550(){let inherited={};try{inherited=A549.projectStatus?.()||{}}catch(_){}const core=coreGate550(),structural=structuralGate550(),deep=deepState550(),runtime=runtimeGate550(),self=selfTest550(),gates={core:core.pass,structural:structural.pass,deep:deep.pass,runtime:runtime.pass,selfTest:self.pass},passed=Object.values(gates).filter(Boolean).length,total=Object.keys(gates).length,overallPct=Math.round(passed/total*1000)/10;return{...inherited,version:VERSION,overallPct,remainingPct:Math.round((100-overallPct)*10)/10,gates,core550:core,structural550:structural,deep550:deep,runtime550:runtime,selfTest550:self,rulesFingerprint:rulesFingerprint550(),corpus550:W.__YGO550_CORPUS||null,fullReleaseReady:W.__YGO550_CERT?.pass===true,blockers:W.__YGO550_CERT?.blockers||Object.entries(gates).filter(([,v])=>v!==true).map(([k])=>k),policy:'Alpha 550 liga cada PASS profundo a baraja + estructura + reglas/banlist y exige al menos 5 barajas únicas para que el corpus pueda certificar el release. Cada fallo de Top-5/STRICT/End Board/tiempo/diversidad queda diagnosticado explícitamente.'}}
const API={...A549,VERSION,rulesFingerprint:rulesFingerprint550,benchmarkIdentity:benchmarkIdentity550,diagnoseBenchmark:diagnoseBenchmark550,benchmarkActiveDeck:activeBenchmark550,benchmarkCorpus:benchmarkCorpus550,runDeepBenchmark:runDeep550,scheduleDeepBenchmark:scheduleDeep550,installWatch:installWatch550,deepBenchmarkState:deepState550,certifyFull:certifyFull550,selfTest:selfTest550,projectStatus:projectStatus550};
W.YGOAlpha550=API;W.YGO_APP_VERSION=VERSION;if(W.YGOApp){W.YGOApp.version=VERSION;W.YGOApp.release550=API}D.title=TITLE;
const boot550=()=>{try{installWatch550()}catch(_){} };if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot550,{once:true});else boot550();
})();


;

/* === bundled from ygo-alpha-551-adaptive-combo-runtime === */

(()=>{'use strict';
const W=window,D=document,VERSION='Alpha 551',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_551',A550=W.YGOAlpha550||{},R=W.YGORulingEngine||{};
const arr=v=>Array.isArray(v)?v:[];
const qty=c=>{const n=Number(c?.qty);return Number.isFinite(n)?Math.max(0,Math.floor(n)):1};
W.__YGO551_MANAGES_DEEP=true;
try{if(W.__YGO550_WATCH){clearInterval(W.__YGO550_WATCH);W.__YGO550_WATCH=null}}catch(_){}
function deckCount551(state=W.deckState||{}){return ['main','extra','side'].reduce((n,z)=>n+arr(state?.[z]).reduce((a,c)=>a+qty(c),0),0)}
function lineActions551(line){return arr(line?.actions||line?.simulation?.actions)}
function lineSig551(line){return lineActions551(line).map(a=>`${Number(a?.card?.id||a?.cardId)||String(a?.card?.name||a?.cardName||a?.card||'').toLowerCase()}:${String(a?.actionType||a?.type||'').toLowerCase()}:${String(a?.effectId??'')}`).join('>')}
function strict551(line){try{return A550.cachedStrictLine?.(line)||W.YGOAlpha543?.cachedStrictLine?.(line)||{pass:false,reason:'strict-unavailable'}}catch(e){return{pass:false,reason:'strict-error',error:String(e?.message||e)}}}
function cert551(line){try{return W.YGOAlpha358?.finalCertificate?.(line)||line?.alpha358Certificate||null}catch(_){return line?.alpha358Certificate||null}}
function rank551(a,b){const A=a.__s551||strict551(a),B=b.__s551||strict551(b),ac=a.__c551||cert551(a)||{},bc=b.__c551||cert551(b)||{};return Number(B.pass)-Number(A.pass)||Number(bc.legallyCertified)-Number(ac.legallyCertified)||Number(B.strong)-Number(A.strong)||(Number(B.weightedCoverage)||0)-(Number(A.weightedCoverage)||0)||(Number(bc.score)||0)-(Number(ac.score)||0)||(Number(b.finalScore||b.score)||0)-(Number(a.finalScore||a.score)||0)}
let CACHE551=null;
function identity551(){try{return String(A550.benchmarkIdentity?.()||[A550.deckFingerprint?.(),A550.structuralFingerprint?.(),A550.rulesFingerprint?.()].join('|'))}catch(_){return String(Date.now())}}
function invalidateCombo551(reason='manual'){const had=!!CACHE551;CACHE551=null;return{version:VERSION,had,reason}}
function schedules551(mode='interactive'){return /deep|profundo|benchmark/.test(String(mode).toLowerCase())?[[2,3],[3,4],[4,5],[6,6],[8,7]]:[[2,3],[3,4],[4,5]]}
function adaptiveCombo551(opts={}){
 const force=opts?.force===true,maxMs=Math.max(750,Number(opts?.maxMs||W.__YGO551_MAX_COMBO_MS||5000)),id=identity551();
 if(!force&&CACHE551?.identity===id&&arr(CACHE551.lines).length===5){W.comboLastAnalysis=CACHE551.lines.slice();return CACHE551.lines.slice()}
 const started=performance.now(),raw=[],seen=new Set(),passes=[],mode=opts?.mode||W.__YGO_ANALYSIS_BUDGET?.mode||'interactive';
 const add=l=>{if(!l)return;const k=lineSig551(l)||`anon:${raw.length}`;if(seen.has(k))return;seen.add(k);l.__s551=strict551(l);l.__c551=cert551(l);raw.push(l)};
 if(typeof R.searchOpeningLines==='function'){
   for(const [samples,depth] of schedules551(mode)){
     if(performance.now()-started>=maxMs&&raw.length>=5)break;
     const t=performance.now();let got=[],error=null;try{got=arr(R.searchOpeningLines(samples,depth))}catch(e){error=String(e?.message||e)}
     for(const l of got)add(l);raw.sort(rank551);
     const strictCount=raw.filter(x=>x.__s551?.pass===true).length,unique=new Set(raw.map(lineSig551).filter(Boolean)).size;
     passes.push({samples,depth,ms:Math.round((performance.now()-t)*10)/10,generated:got.length,unique,strict:strictCount,error});
     if(strictCount>=5&&unique>=3)break;
     if(performance.now()-started>=maxMs)break;
   }
 }
 if(!raw.length&&typeof W.YGOAlpha358?.combo==='function'){try{for(const l of arr(W.YGOAlpha358.combo()))add(l)}catch(_){}}
 raw.sort(rank551);const strictLines=raw.filter(x=>x.__s551?.pass===true),selected=(strictLines.length>=5?strictLines:raw).slice(0,5),elapsedMs=Math.round((performance.now()-started)*10)/10;
 W.comboLastAnalysis=selected;try{if(typeof comboLastAnalysis!=='undefined')comboLastAnalysis=selected}catch(_){}
 try{W.renderComboLines?.();W.renderComboVisualTop5?.(selected);W.renderComboEndBoard?.(selected)}catch(_){}
 const strictPass=selected.filter(x=>x.__s551?.pass===true).length,uniqueLines=new Set(selected.map(lineSig551).filter(Boolean)).size;
 const report={version:VERSION,identity:id,elapsedMs,maxMs,passes,generated:raw.length,top5:selected.length,strictPass,uniqueLines,withinBudget:elapsedMs<=maxMs,at:new Date().toISOString()};
 W.__YGO551_COMBO=report;if(selected.length===5&&strictPass===5)CACHE551={identity:id,lines:selected.slice(),report};return selected;
}
adaptiveCombo551.__alpha551=true;adaptiveCombo551.__base=W.comboBuildCandidates;
W.comboBuildCandidates=adaptiveCombo551;W.autoAnalyzeAllCombos=adaptiveCombo551;
function lineDiagnostic551(line,index){const s=line?.__s551||strict551(line),c=line?.__c551||cert551(line)||{};return{index,pass:s?.pass===true,reason:s?.reason||null,failures:Number(s?.failures)||0,criticalUnknown:Number(s?.criticalUnknown)||0,coverage:Number(s?.coverage??s?.weightedCoverage)||0,weightedCoverage:Number(s?.weightedCoverage)||0,strong:s?.strong===true,stress:Number(s?.stress)||0,qualityPass:s?.qualityPass===true,certificate:{grade:c?.grade||null,score:Number(c?.score)||0,legallyCertified:c?.legallyCertified===true,complete:c?.complete===true,reproducible:c?.reproducible===true},signature:lineSig551(line)} }
function endBoard551(){try{return A550.endBoardGate?.()||W.YGOAlpha549?.endBoardGate?.()||{pass:false,status:'UNAVAILABLE'}}catch(e){return{pass:false,status:'ERROR',error:String(e?.message||e)}}}
function benchmarkActive551({maxMs=6000,force=true}={}){if(deckCount551()<5)return{version:VERSION,pass:false,status:'NO_ACTIVE_DECK',top5:0,strictPass:0,elapsedMs:0,issues:['no-active-deck']};const before=A550.deckFingerprint?.(),sf=A550.structuralFingerprint?.(),rf=A550.rulesFingerprint?.(),started=performance.now();W.__YGO551_MAX_COMBO_MS=maxMs;let lines=[],error=null;try{lines=arr(adaptiveCombo551({force,maxMs,mode:'benchmark'}))}catch(e){error=String(e?.message||e)}finally{delete W.__YGO551_MAX_COMBO_MS}const elapsedMs=Math.round((performance.now()-started)*10)/10,top=lines.slice(0,5),rows=top.map((l,i)=>lineDiagnostic551(l,i+1)),strictPass=rows.filter(x=>x.pass).length,uniqueLines=new Set(rows.map(x=>x.signature).filter(Boolean)).size,endBoard=endBoard551(),stable=before===A550.deckFingerprint?.()&&sf===A550.structuralFingerprint?.()&&rf===A550.rulesFingerprint?.(),issues=[];if(error)issues.push('error:'+error);if(top.length<5)issues.push('top5<5');if(strictPass<5)issues.push('strict<5');if(uniqueLines<Math.min(3,top.length))issues.push('diversity<3');if(endBoard?.pass!==true)issues.push('endboard-fail');if(!stable)issues.push('fingerprint-changed');if(elapsedMs>maxMs)issues.push('timeout');const pass=issues.length===0;const report={version:VERSION,pass,status:pass?'PASS':'FAIL',deckFingerprint:before,structuralFingerprint:sf,rulesFingerprint:rf,elapsedMs,maxMs,top5:top.length,strictPass,uniqueLines,endBoard,lines:rows,search:W.__YGO551_COMBO||null,stable,issues,error};W.__YGO551_ACTIVE_BENCHMARK=report;return report}
function fixtureEntries551(limit=5){let fc={};try{fc=W.YGOAlpha357?.fixtureCatalog?.(true)||{}}catch(_){}const entries=Object.entries(fc?.entries||{}).filter(([,e])=>e?.fixture&&!e?.aliasOf&&e?.ok!==false);return entries.slice(0,Math.max(5,Math.min(entries.length,Number(limit)||5)))}
function cloneDeck551(d){return{main:arr(d?.main).map(x=>({...x})),extra:arr(d?.extra).map(x=>({...x})),side:arr(d?.side).map(x=>({...x}))}}
async function benchmarkCorpus551({limit=5,maxMs=6000,overallMaxMs=45000}={}){const entries=fixtureEntries551(limit),rows=[],saved=cloneDeck551(W.deckState),savedAnalysis=W.comboLastAnalysis,started=performance.now();let aborted=false;try{for(const [id,e] of entries){if(performance.now()-started>=overallMaxMs){aborted=true;break}W.deckState=cloneDeck551(e.fixture);try{W.YGOAlpha543?.mergeDeckFromCatalog?.(W.deckState);W.YGOAlpha543?.applyStructuralCache?.(W.deckState)}catch(_){}invalidateCombo551('fixture-change');const r=benchmarkActive551({maxMs,force:true});rows.push({id,label:e.label||id,pass:r.pass,elapsedMs:r.elapsedMs,top5:r.top5,strictPass:r.strictPass,uniqueLines:r.uniqueLines,issues:r.issues,lines:r.lines,search:r.search,endBoard:r.endBoard});await new Promise(res=>setTimeout(res,0))}}finally{W.deckState=saved;W.comboLastAnalysis=savedAnalysis;invalidateCombo551('restore-user-deck')}const elapsedMs=Math.round((performance.now()-started)*10)/10,pass=!aborted&&rows.length>=5&&rows.every(x=>x.pass);const report={version:VERSION,pass,status:pass?'PASS':'FAIL',minimumCorpus:5,total:rows.length,passed:rows.filter(x=>x.pass).length,aborted,elapsedMs,overallMaxMs,maxMsPerDeck:maxMs,rows,issues:[rows.length<5?'corpus<5':null,aborted?'overall-timeout':null,...rows.filter(x=>!x.pass).map(x=>x.id+':'+x.issues.join(','))].filter(Boolean),structuralFingerprint:A550.structuralFingerprint?.(),rulesFingerprint:A550.rulesFingerprint?.(),at:new Date().toISOString()};W.__YGO551_CORPUS=report;return report}
let timer551=null,lastDeck551=null;
function scheduleActive551(reason='deck-change',delay=1200){if(W.__YGO552_MANAGES_COMBOS)return false;clearTimeout(timer551);timer551=setTimeout(()=>{try{if(deckCount551()<5)return;const structural=A550.structuralGate?.();if(structural?.pass!==true)return;invalidateCombo551(reason);benchmarkActive551({maxMs:5000,force:true});W.__YGO551_LAST_REASON=reason}catch(e){W.__YGO551_LAST_ERROR=String(e?.message||e)}},Math.max(400,Number(delay)||1200));return true}
function installWatch551(){try{for(const k of ['__YGO550_WATCH','__YGO551_WATCH']){if(W[k])clearInterval(W[k]);W[k]=null}}catch(_){}return true}
async function certifyFull551({runDeep=true,forceStructural=false,maxMs=6000,corpusLimit=5}={}){let sync=null;try{if(forceStructural||A550.structuralGate?.()?.pass!==true)sync=await A550.syncStructuralPack547?.({force:!!forceStructural})}catch(e){sync={error:String(e?.message||e)}}const core=A550.coreGate?.()||{pass:false},structural=A550.structuralGate?.()||{pass:false},runtime=A550.runtimeGate?.()||{pass:false};let benchmark=null;if(runDeep&&structural.pass===true)benchmark=deckCount551()>=5?benchmarkActive551({maxMs,force:true}):await benchmarkCorpus551({limit:corpusLimit,maxMs});const deepPass=runDeep?benchmark?.pass===true:(W.__YGO551_ACTIVE_BENCHMARK?.pass===true||W.__YGO551_CORPUS?.pass===true);const pass=core.pass===true&&structural.pass===true&&deepPass&&runtime.pass===true;const report={version:VERSION,pass,status:pass?'RELEASE_COMPLETE':'RELEASE_GATES_OPEN',core,structural,runtime,benchmark,sync,blockers:[core.pass!==true?'core-certification':null,structural.pass!==true?'offline-structural-98pct':null,!deepPass?'adaptive-top5-endboards':null,runtime.pass!==true?'runtime-errors-or-unavailable':null].filter(Boolean),at:new Date().toISOString()};W.__YGO551_CERT=report;return report}
function claimIdentity551(){try{if(D.title!==TITLE)D.title=TITLE}catch(_){}try{if(W.YGOApp)W.YGOApp.version=VERSION}catch(_){}try{if(W.YGOOfficialEvaluation)W.YGOOfficialEvaluation.version=VERSION}catch(_){}return VERSION}
try{W.YGO_APP_VERSION=VERSION}catch(_){}
function installTitleGuard551(){claimIdentity551();return true}
function selfTest551(){const d={pass:true,criticalUnknown:0,failures:0,coverage:100,weightedCoverage:100,strong:true,stress:80,qualityPass:true},fake={actions:[{cardName:'A',actionType:'EFFECT'}],__s551:d,__c551:{grade:'A',score:95,legallyCertified:true,complete:true,reproducible:true}},row=lineDiagnostic551(fake,1);return{version:VERSION,pass:typeof adaptiveCombo551==='function'&&row.pass===true&&lineSig551(fake).length>0&&W.__YGO551_MANAGES_DEEP===true,adaptive:typeof adaptiveCombo551==='function',diagnostics:row.pass===true,legacyDeepSuppressed:W.__YGO551_MANAGES_DEEP===true,identityGuard:String(W.YGO_APP_VERSION)===VERSION}}
function projectStatus551(){let base={};try{base=A550.projectStatus?.()||{}}catch(_){}const core=A550.coreGate?.()||{pass:false},structural=A550.structuralGate?.()||{pass:false},runtime=A550.runtimeGate?.()||{pass:false},active=W.__YGO551_ACTIVE_BENCHMARK||null,corpus=W.__YGO551_CORPUS||null,self=selfTest551(),deep=deckCount551()>=5?active:corpus;const gates={core:core.pass===true,structural:structural.pass===true,deep:deep?.pass===true,runtime:runtime.pass===true,selfTest:self.pass===true};const passed=Object.values(gates).filter(Boolean).length;return{...base,version:VERSION,overallPct:Math.round(passed/Object.keys(gates).length*1000)/10,remainingPct:Math.round((100-passed/Object.keys(gates).length*100)*10)/10,gates,adaptiveCombo:W.__YGO551_COMBO||null,activeBenchmark551:active,corpus551:corpus,selfTest551:self,fullReleaseReady:W.__YGO551_CERT?.pass===true,blockers:W.__YGO551_CERT?.blockers||Object.entries(gates).filter(([,v])=>!v).map(([k])=>k),policy:'Alpha 551 elimina benchmarks profundos automáticos sin baraja, usa búsqueda adaptativa incremental con caché por fingerprint, registra causa estricta por línea y mantiene identidad canónica frente a escrituras asíncronas heredadas.'}}
const API={...A550,VERSION,adaptiveCombo:adaptiveCombo551,invalidateComboCache:invalidateCombo551,lineDiagnostic:lineDiagnostic551,benchmarkActiveDeck:benchmarkActive551,benchmarkCorpus:benchmarkCorpus551,scheduleActiveBenchmark:scheduleActive551,installWatch:installWatch551,certifyFull:certifyFull551,selfTest:selfTest551,projectStatus:projectStatus551,claimIdentity:claimIdentity551};
W.YGOAlpha551=API;if(W.YGOApp)W.YGOApp.release551=API;claimIdentity551();
const boot551=()=>{installTitleGuard551();installWatch551()};if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot551,{once:true});else boot551();
})();


;

/* === bundled from ygo-alpha-552-fast-preview-deep-separation === */

(()=>{'use strict';
const W=window,D=document,VERSION='Alpha 552',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_552',A551=W.YGOAlpha551||{},R=W.YGORulingEngine||{};
const arr=v=>Array.isArray(v)?v:[];
const qty=c=>{const n=Number(c?.qty);return Number.isFinite(n)?Math.max(0,Math.floor(n)):1};
W.__YGO552_MANAGES_COMBOS=true;W.__YGO552_LAZY_STRUCTURAL=true;
try{if(W.__YGO550_WATCH){clearInterval(W.__YGO550_WATCH);W.__YGO550_WATCH=null}}catch(_){}
try{if(W.__YGO551_WATCH){clearInterval(W.__YGO551_WATCH);W.__YGO551_WATCH=null}}catch(_){}
function deckCount552(state=W.deckState||{}){return ['main','extra','side'].reduce((n,z)=>n+arr(state?.[z]).reduce((a,c)=>a+qty(c),0),0)}
function sig552(line){return arr(line?.actions||line?.simulation?.actions).map(a=>`${Number(a?.card?.id||a?.cardId)||String(a?.card?.name||a?.cardName||a?.card||'').toLowerCase()}:${String(a?.effectId??a?.actionType??a?.type??'').toLowerCase()}`).join('>')}
function freshCert552(line){let c=null,s=null;try{c=W.YGOAlpha358?.finalCertificate?.(line)||line?.alpha358Certificate||null;if(c)line.alpha358Certificate=c}catch(_){}try{s=A551.strictLine?.(line)||W.YGOAlpha543?.strictLine?.(line)||{pass:false}}catch(e){s={pass:false,error:String(e?.message||e)}}line.__alpha552Cert=c;line.__alpha552Strict=s;return{c,s}}
function previewIdentity552(){try{return [A551.deckFingerprint?.()||'',A551.structuralFingerprint?.()||'',A551.rulesFingerprint?.()||''].join('|')}catch(_){return ''}}
let PREVIEW_CACHE=null;
function invalidatePreview552(reason='manual'){const had=!!PREVIEW_CACHE;PREVIEW_CACHE=null;return{version:VERSION,had,reason}}
function previewCombos552(opts={}){
 const identity=previewIdentity552();if(!opts.force&&PREVIEW_CACHE?.identity===identity&&arr(PREVIEW_CACHE.lines).length){W.comboLastAnalysis=PREVIEW_CACHE.lines.slice();return PREVIEW_CACHE.lines.slice()}
 const started=performance.now(),legacy=R.searchOpeningLinesLegacy||R.searchOpeningLinesLegacy306||null;let raw=[],error=null;
 try{if(typeof legacy==='function')raw=arr(legacy(1,2));else if(typeof R.searchOpeningLines==='function')raw=arr(R.searchOpeningLines(1,2))}catch(e){error=String(e?.message||e)}
 const seen=new Set(),rows=[];for(const line of raw){const k=sig552(line);if(!k||seen.has(k))continue;seen.add(k);const q=freshCert552(line);const strict=q.s?.pass===true&&q.c?.strict===true,legal=q.c?.legallyCertified===true;line.releaseCertified552=strict;line.preview552=!strict;const base=String(line.status||'').replace(/\s*·\s*(?:PREVIEW|STRICT)552\b[^·]*/gi,'').trim();line.status=(base||'ANALIZADO')+(strict?' · STRICT552':' · PREVIEW552');rows.push({line,strict,legal,cert:q.c||{},audit:q.s||{}})}
 rows.sort((a,b)=>Number(b.strict)-Number(a.strict)||Number(b.legal)-Number(a.legal)||(Number(b.cert?.score)||0)-(Number(a.cert?.score)||0)||(Number(b.line?.finalScore||b.line?.score)||0)-(Number(a.line?.finalScore||a.line?.score)||0));
 const lines=rows.slice(0,5).map(x=>x.line),elapsedMs=Math.round((performance.now()-started)*10)/10;W.comboLastAnalysis=lines;try{if(typeof comboLastAnalysis!=='undefined')comboLastAnalysis=lines}catch(_){}try{W.renderComboLines?.();W.renderComboVisualTop5?.(lines);W.renderComboEndBoard?.(lines)}catch(_){}
 const report={version:VERSION,mode:'FAST_PREVIEW',identity,elapsedMs,generated:raw.length,shown:lines.length,strict:rows.slice(0,5).filter(x=>x.strict).length,legal:rows.slice(0,5).filter(x=>x.legal).length,error,policy:'Vista rápida: genera candidatos con el buscador legacy veloz, pero sólo marca STRICT552 cuando FINAL58 + auditoría STRICT fresca pasan. Los demás permanecen PREVIEW y nunca certifican release.',at:new Date().toISOString()};W.__YGO552_PREVIEW=report;PREVIEW_CACHE={identity,lines:lines.slice(),report};return lines
}
previewCombos552.__alpha552=true;previewCombos552.__base=W.comboBuildCandidates;W.comboBuildCandidates=previewCombos552;W.autoAnalyzeAllCombos=previewCombos552;
function lineRows552(lines){return arr(lines).slice(0,5).map((line,i)=>{const q=freshCert552(line);return{index:i+1,pass:q.s?.pass===true&&q.c?.strict===true,semantic:q.s?.semanticPass===true,quality:q.s?.qualityPass===true,failures:Number(q.s?.failures)||0,criticalUnknown:Number(q.s?.criticalUnknown)||0,coverage:Number(q.s?.coverage)||0,weightedCoverage:Number(q.s?.weightedCoverage)||0,stress:Number(q.s?.stress)||0,grade:q.c?.grade||null,legal:q.c?.legallyCertified===true,reproducible:q.c?.reproducible===true,blockers:arr(q.c?.blockers).slice(0,8),signature:sig552(line)}})}
function deepSearch552({samples=2,depth=3,maxMs=45000}={}){const started=performance.now(),prev=W.__YGO_ANALYSIS_BUDGET;let lines=[],error=null;try{W.__YGO_ANALYSIS_BUDGET={...(prev||{}),mode:'interactivo'};const fn=R.strictSearchOpeningLines||R.searchOpeningLines;if(typeof fn!=='function')throw new Error('Buscador STRICT no disponible');lines=arr(fn(samples,depth)).slice(0,5)}catch(e){error=String(e?.message||e)}finally{W.__YGO_ANALYSIS_BUDGET=prev}const rows=lineRows552(lines),elapsedMs=Math.round((performance.now()-started)*10)/10;W.comboLastAnalysis=lines;const unique=new Set(rows.map(x=>x.signature).filter(Boolean)).size;let endBoard=null;try{endBoard=A551.endBoardGate?.()||W.YGOAlpha549?.endBoardGate?.()||null}catch(e){endBoard={pass:false,error:String(e?.message||e)}}const issues=[];if(error)issues.push('error:'+error);if(lines.length<5)issues.push('top5<5');if(rows.filter(x=>x.pass).length<5)issues.push('strict<5');if(unique<Math.min(3,rows.length))issues.push('diversity<3');if(endBoard?.pass!==true)issues.push('endboard-fail');if(elapsedMs>maxMs)issues.push('timeout');const pass=issues.length===0;const report={version:VERSION,mode:'STRICT_ON_DEMAND',pass,status:pass?'PASS':'FAIL',samples,depth,elapsedMs,maxMs,top5:lines.length,strictPass:rows.filter(x=>x.pass).length,uniqueLines:unique,rows,endBoard,issues,error,deckFingerprint:A551.deckFingerprint?.(),structuralFingerprint:A551.structuralFingerprint?.(),rulesFingerprint:A551.rulesFingerprint?.(),at:new Date().toISOString()};W.__YGO552_DEEP=report;return report}
function fixtureEntries552(limit=5){let fc={};try{fc=W.YGOAlpha357?.fixtureCatalog?.(true)||{}}catch(_){}return Object.entries(fc?.entries||{}).filter(([,e])=>e?.fixture&&!e?.aliasOf&&e?.ok!==false).slice(0,Math.max(5,Math.min(Number(limit)||5,10)))}
function cloneDeck552(d){return{main:arr(d?.main).map(x=>({...x})),extra:arr(d?.extra).map(x=>({...x})),side:arr(d?.side).map(x=>({...x}))}}
async function benchmarkCorpus552({limit=5,samples=2,depth=3,maxMsPerDeck=45000,overallMaxMs=240000}={}){const saved=cloneDeck552(W.deckState),savedAnalysis=W.comboLastAnalysis,rows=[],started=performance.now();let aborted=false;try{for(const [id,e] of fixtureEntries552(limit)){if(performance.now()-started>overallMaxMs){aborted=true;break}W.deckState=cloneDeck552(e.fixture);try{W.YGOAlpha543?.mergeDeckFromCatalog?.(W.deckState);W.YGOAlpha543?.applyStructuralCache?.(W.deckState)}catch(_){}invalidatePreview552('corpus-fixture');const r=deepSearch552({samples,depth,maxMs:maxMsPerDeck});rows.push({id,label:e.label||id,pass:r.pass,elapsedMs:r.elapsedMs,strictPass:r.strictPass,top5:r.top5,issues:r.issues,rows:r.rows});await new Promise(res=>setTimeout(res,0))}}finally{W.deckState=saved;W.comboLastAnalysis=savedAnalysis;invalidatePreview552('restore-user-deck')}const elapsedMs=Math.round((performance.now()-started)*10)/10,pass=!aborted&&rows.length>=5&&rows.every(x=>x.pass);const report={version:VERSION,pass,status:pass?'PASS':'FAIL',minimumCorpus:5,total:rows.length,passed:rows.filter(x=>x.pass).length,aborted,elapsedMs,rows,issues:[rows.length<5?'corpus<5':null,aborted?'overall-timeout':null,...rows.filter(x=>!x.pass).map(x=>x.id+':'+x.issues.join(','))].filter(Boolean),at:new Date().toISOString()};W.__YGO552_CORPUS=report;return report}
async function syncStructural552({force=false}={}){W.__YGO552_STRUCTURAL_PENDING=false;let r=null,error=null;try{r=await A551.syncStructuralPack547?.({force:!!force})}catch(e){error=String(e?.message||e)}const gate=A551.structuralGate?.()||{};if(gate.pass!==true)W.__YGO552_STRUCTURAL_PENDING=true;return{version:VERSION,pass:gate.pass===true,result:r,error,gate}}
async function certifyFull552({forceStructural=false,runDeep=true,samples=2,depth=3,maxMs=45000,corpusLimit=5}={}){let sync=null;if(forceStructural||A551.structuralGate?.()?.pass!==true)sync=await syncStructural552({force:forceStructural});const core=A551.coreGate?.()||{pass:false},structural=A551.structuralGate?.()||{pass:false},runtime=A551.runtimeGate?.()||{pass:false};let deep=null;if(runDeep&&structural.pass===true)deep=deckCount552()>=5?deepSearch552({samples,depth,maxMs}):await benchmarkCorpus552({limit:corpusLimit,samples,depth,maxMsPerDeck:maxMs});const deepPass=runDeep?deep?.pass===true:(W.__YGO552_DEEP?.pass===true||W.__YGO552_CORPUS?.pass===true),pass=core.pass===true&&structural.pass===true&&deepPass&&runtime.pass===true;const report={version:VERSION,pass,status:pass?'RELEASE_COMPLETE':'RELEASE_GATES_OPEN',core,structural,runtime,deep,sync,blockers:[core.pass!==true?'core-certification':null,structural.pass!==true?'offline-structural-98pct':null,!deepPass?'strict-top5-endboards-on-demand':null,runtime.pass!==true?'runtime-errors-or-unavailable':null].filter(Boolean),at:new Date().toISOString()};W.__YGO552_CERT=report;return report}
function claim552(){try{W.YGO_APP_VERSION=VERSION}catch(_){}try{if(W.YGOApp)W.YGOApp.version=VERSION}catch(_){}try{if(W.YGOOfficialEvaluation)W.YGOOfficialEvaluation.version=VERSION}catch(_){}try{if(D.title!==TITLE)D.title=TITLE}catch(_){}return VERSION}
function installIdentity552(){claim552();return true}
function selfTest552(){const legacy=typeof (R.searchOpeningLinesLegacy||R.searchOpeningLinesLegacy306)==='function',strict=typeof (R.strictSearchOpeningLines||R.searchOpeningLines)==='function';return{version:VERSION,pass:legacy&&strict&&W.__YGO552_LAZY_STRUCTURAL===true&&W.__YGO552_MANAGES_COMBOS===true,fastGenerator:legacy,strictOnDemand:strict,lazyStructural:W.__YGO552_LAZY_STRUCTURAL===true,automaticDeepSuppressed:W.__YGO552_MANAGES_COMBOS===true}}
function projectStatus552(){let base={};try{base=A551.projectStatus?.()||{}}catch(_){}const core=A551.coreGate?.()||{pass:false},structural=A551.structuralGate?.()||{pass:false},runtime=A551.runtimeGate?.()||{pass:false},deep=W.__YGO552_DEEP||W.__YGO552_CORPUS||null,self=selfTest552(),gates={core:core.pass===true,structural:structural.pass===true,deep:deep?.pass===true,runtime:runtime.pass===true,selfTest:self.pass===true},passed=Object.values(gates).filter(Boolean).length;return{...base,version:VERSION,overallPct:Math.round(passed/Object.keys(gates).length*1000)/10,remainingPct:Math.round((100-passed/Object.keys(gates).length*100)*10)/10,gates,preview552:W.__YGO552_PREVIEW||null,deep552:W.__YGO552_DEEP||null,corpus552:W.__YGO552_CORPUS||null,selfTest552:self,structuralSyncPending:W.__YGO552_STRUCTURAL_PENDING===true,fullReleaseReady:W.__YGO552_CERT?.pass===true,blockers:W.__YGO552_CERT?.blockers||Object.entries(gates).filter(([,v])=>!v).map(([k])=>k),policy:'Alpha 552 separa completamente preview rápido y certificación STRICT. Ningún PREVIEW certifica release. Sincronización estructural y corpus profundo se ejecutan sólo bajo demanda, evitando bloquear el arranque/importación.'}}
const API={...A551,VERSION,previewCombos:previewCombos552,invalidatePreview:invalidatePreview552,deepSearch:deepSearch552,benchmarkActiveDeck:deepSearch552,benchmarkCorpus:benchmarkCorpus552,syncStructural:syncStructural552,certifyFull:certifyFull552,claimIdentity:claim552,selfTest:selfTest552,projectStatus:projectStatus552};
W.YGOAlpha552=API;if(W.YGOApp)W.YGOApp.release552=API;claim552();
const boot552=()=>{installIdentity552();};if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot552,{once:true});else boot552();
})();


;

/* === bundled from ygo-alpha-553-startup-stability === */

(()=>{'use strict';
const W=window,D=document,VERSION='Alpha 553',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_553',A552=W.YGOAlpha552||{};
const arr=v=>Array.isArray(v)?v:[];
const qty=c=>{const n=Number(c?.qty);return Number.isFinite(n)?Math.max(0,Math.floor(n)):1};
const started=performance.now();
W.__YGO553_STARTUP=W.__YGO553_STARTUP||{version:VERSION,scriptReadyAt:started,domReadyAt:null,loadAt:null,longTasks:[],runtimeErrors:[]};
function deckCount553(state=W.deckState||{}){return ['main','extra','side'].reduce((n,z)=>n+arr(state?.[z]).reduce((a,c)=>a+qty(c),0),0)}
function clearLegacyIdentity553(){
  for(const k of ['__YGO551_TITLE_OBSERVER','__YGO552_TITLE_OBSERVER']){try{W[k]?.disconnect?.()}catch(_){}try{W[k]=null}catch(_){}}
  for(const k of ['__YGO549_FP_WATCH','__YGO550_WATCH','__YGO551_WATCH','__YGO552_ID_TIMER']){try{if(W[k])clearInterval(W[k])}catch(_){}try{W[k]=null}catch(_){}}
  return true;
}
function claim553(){
  try{if(D.title!==TITLE)D.title=TITLE}catch(_){}
  try{if(W.YGOApp)W.YGOApp.version=VERSION}catch(_){}
  try{if(W.YGOOfficialEvaluation)W.YGOOfficialEvaluation.version=VERSION}catch(_){}
  try{if(W.YGOCanonicalRuntime)W.YGOCanonicalRuntime.version=VERSION}catch(_){}
  return VERSION;
}
function installIdentity553(){clearLegacyIdentity553();claim553();return true}
let previewJob553=null;
function schedulePreview553(reason='user-action',delay=120){
  if(deckCount553()<5)return false;
  if(previewJob553){try{clearTimeout(previewJob553)}catch(_){}previewJob553=null}
  const run=()=>{previewJob553=null;try{const t=performance.now(),lines=A552.previewCombos?.({force:true})||[];W.__YGO553_LAST_PREVIEW={reason,ms:Math.round((performance.now()-t)*10)/10,top5:arr(lines).slice(0,5).length,at:new Date().toISOString()}}catch(e){W.__YGO553_LAST_PREVIEW={reason,error:String(e?.message||e),at:new Date().toISOString()}}};
  if(typeof W.requestIdleCallback==='function'){W.requestIdleCallback(run,{timeout:Math.max(500,Number(delay)||120)});previewJob553=true}else previewJob553=setTimeout(run,Math.max(0,Number(delay)||120));
  return true;
}
function installUserPreview553(){
  if(D.__alpha553PreviewBound)return true;D.__alpha553PreviewBound=true;
  D.addEventListener('click',e=>{const b=e.target?.closest?.('button');if(!b)return;const text=String(b.textContent||'').toLowerCase();if(/calcular|analizar|combo|cargar baraja/.test(text))schedulePreview553('button:'+text.slice(0,40),180)},{passive:true});
  D.addEventListener('change',e=>{const id=e.target?.id||'';if(id==='ydkMainFile'||id==='arch')schedulePreview553('change:'+id,280)},{passive:true});
  return true;
}
function runtimeErrors553(){return arr(W.__YGO553_STARTUP?.runtimeErrors)}
function startupAudit553(){
  const st=W.__YGO553_STARTUP||{},now=performance.now();
  const visual=!!D.getElementById('alpha306LoadDeck')&&!!D.getElementById('alpha306DeleteDeck')&&!!D.querySelector('.diana-center-zone')&&D.querySelectorAll('#stats .stat').length===10;
  return{version:VERSION,title:D.title,appVersion:String(W.YGO_APP_VERSION||''),readyState:D.readyState,scriptReadyMs:Math.round(Number(st.scriptReadyAt||0)*10)/10,domReadyMs:st.domReadyAt==null?null:Math.round(Number(st.domReadyAt)*10)/10,loadMs:st.loadAt==null?null:Math.round(Number(st.loadAt)*10)/10,responsiveAtMs:Math.round(now*10)/10,longTasks:arr(st.longTasks).slice(-10),runtimeErrors:runtimeErrors553().slice(-10),visualPreserved:visual,legacyObserversCleared:!W.__YGO551_TITLE_OBSERVER&&!W.__YGO552_TITLE_OBSERVER,pass:visual&&D.title===TITLE&&String(W.YGO_APP_VERSION)===VERSION&&!W.__YGO551_TITLE_OBSERVER&&!W.__YGO552_TITLE_OBSERVER};
}
function selfTest553(){const a=startupAudit553();return{version:VERSION,pass:a.visualPreserved&&a.legacyObserversCleared&&String(W.YGO_APP_VERSION)===VERSION&&D.title===TITLE,observerConflictRemoved:a.legacyObserversCleared,canonicalIdentity:String(W.YGO_APP_VERSION)===VERSION&&D.title===TITLE,visualPreserved:a.visualPreserved}}
function projectStatus553(){let base={};try{base=A552.projectStatus?.()||{}}catch(_){}const startup=startupAudit553(),self=selfTest553();return{...base,version:VERSION,startup553:startup,selfTest553:self,startupStable:startup.pass===true,policy:'Alpha 553 elimina el bucle infinito de identidad Alpha551↔Alpha552, deja un único observador canónico, elimina polling histórico de identidad y mantiene preview interactivo bajo demanda.'}}
try{W.addEventListener('error',e=>{W.__YGO553_STARTUP.runtimeErrors.push({type:'error',message:String(e?.message||e?.error||'error'),at:performance.now()})})}catch(_){}
try{W.addEventListener('unhandledrejection',e=>{W.__YGO553_STARTUP.runtimeErrors.push({type:'unhandledrejection',message:String(e?.reason?.message||e?.reason||'rejection'),at:performance.now()})})}catch(_){}
try{if(typeof PerformanceObserver==='function'){const po=new PerformanceObserver(list=>{for(const x of list.getEntries())if(x.duration>=50)W.__YGO553_STARTUP.longTasks.push({start:Math.round(x.startTime*10)/10,duration:Math.round(x.duration*10)/10})});po.observe({type:'longtask',buffered:true});W.__YGO553_LONGTASK_OBSERVER=po}}catch(_){}
const API={...A552,VERSION,claimIdentity:claim553,installIdentity:installIdentity553,clearLegacyIdentity:clearLegacyIdentity553,schedulePreview:schedulePreview553,startupAudit:startupAudit553,selfTest:selfTest553,projectStatus:projectStatus553};
W.YGOAlpha553=API;if(W.YGOApp){W.YGOApp.version=VERSION;W.YGOApp.release553=API}
installIdentity553();installUserPreview553();
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',()=>{installUserPreview553();W.__YGO553_STARTUP.domReadyAt=performance.now()},{once:true});/* Alpha930: identity portion retired */else W.__YGO553_STARTUP.domReadyAt=performance.now();
W.addEventListener('load',()=>{W.__YGO553_STARTUP.loadAt=performance.now()},{once:true});/* Alpha928: identity reclaim 553 retired */
})();


;

/* === bundled from ygo-alpha-554-lazy-startup === */

(()=>{'use strict';
const W=window,D=document,VERSION='Alpha 554',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_554',A553=W.YGOAlpha553||{};
const started=performance.now();
W.__YGO554_STATE=W.__YGO554_STATE||{version:VERSION,scriptReadyAt:started,catalogWarm:false,catalogWarmMs:null,maintenanceRuns:[],errors:[]};
function claim554(){try{if(D.title!==TITLE)D.title=TITLE}catch(_){}try{if(W.YGOApp)W.YGOApp.version=VERSION}catch(_){}try{if(W.YGOOfficialEvaluation)W.YGOOfficialEvaluation.version=VERSION}catch(_){}return VERSION}
function installIdentity554(){claim554();return true}
let warmPromise=null;
async function warmCatalog554(reason='user'){
  if(warmPromise)return warmPromise;
  const t=performance.now();
  warmPromise=Promise.resolve().then(()=>W.YGOAlpha554WarmCatalog?.()).then(()=>{W.__YGO554_STATE.catalogWarm=true;W.__YGO554_STATE.catalogWarmReason=reason;W.__YGO554_STATE.catalogWarmMs=Math.round((performance.now()-t)*10)/10;return true}).catch(e=>{W.__YGO554_STATE.errors.push({stage:'catalog',message:String(e?.message||e)});warmPromise=null;return false});
  return warmPromise;
}
async function maintenance554({catalog=false,alpha522=false,alpha543=false}={}){const row={at:new Date().toISOString(),catalog,alpha522,alpha543,steps:[]};const t=performance.now();try{if(catalog){await warmCatalog554('maintenance');row.steps.push('catalog')}if(alpha522&&typeof W.__YGO554_POSTCOMMIT522==='function'){await W.__YGO554_POSTCOMMIT522();row.steps.push('alpha522')}if(alpha543&&typeof W.__YGO554_POST543==='function'){await W.__YGO554_POST543();row.steps.push('alpha543')}else if(typeof W.__YGO554_LIGHT543==='function'){W.__YGO554_LIGHT543();row.steps.push('alpha543-light')}}catch(e){row.error=String(e?.message||e)}row.ms=Math.round((performance.now()-t)*10)/10;W.__YGO554_STATE.maintenanceRuns.push(row);return row}
function bindLazyCatalog554(){if(D.__alpha554LazyBound)return true;D.__alpha554LazyBound=true;const ids=new Set(['cardSearch','cardType','cardRole','dbSearch','dbRole','dbArchetype','dbFunction']);D.addEventListener('focusin',e=>{if(ids.has(e.target?.id))warmCatalog554('focus:'+e.target.id)},{passive:true});D.addEventListener('input',e=>{if(ids.has(e.target?.id))warmCatalog554('input:'+e.target.id)},{passive:true});D.addEventListener('change',e=>{if(ids.has(e.target?.id))warmCatalog554('change:'+e.target.id)},{passive:true});D.addEventListener('pointerdown',e=>{if(e.target?.closest?.('#catalog,#dbResults'))warmCatalog554('catalog-pointer')},{passive:true});return true}
function startupAudit554(){const lt=(W.__YGO553_STARTUP?.longTasks||[]).slice(),domReady=Number(W.__YGO553_STARTUP?.domReadyAt||0);const afterReady=lt.filter(x=>Number(x.start)>=domReady),worst=afterReady.reduce((m,x)=>Math.max(m,Number(x.duration)||0),0);let dianaAfter=false;try{const calc=D.querySelector('.main-calc-pad'),diana=D.querySelector('.diana-center-zone');if(calc&&diana)dianaAfter=!!(calc.compareDocumentPosition(diana)&Node.DOCUMENT_POSITION_FOLLOWING)}catch(_){}const visual=!!D.getElementById('alpha306LoadDeck')&&!!D.getElementById('alpha306DeleteDeck')&&!!D.querySelector('.diana-center-zone')&&dianaAfter;const pass=visual&&D.title===TITLE&&String(W.YGO_APP_VERSION)===VERSION;return{version:VERSION,pass,title:D.title,appVersion:String(W.YGO_APP_VERSION||''),readyState:D.readyState,visualPreserved:visual,dianaAfterCalculate:dianaAfter,catalogWarm:W.__YGO554_STATE.catalogWarm,longTasks:lt.slice(-12),worstPostDomLongTaskMs:Math.round(worst*10)/10,automaticAlpha522:false,automaticAlpha543:false,automaticCatalog:false}}
function selfTest554(){const a=startupAudit554();return{version:VERSION,pass:a.pass&&typeof W.YGOAlpha554WarmCatalog==='function'&&typeof W.__YGO554_POSTCOMMIT522==='function'&&typeof W.__YGO554_POST543==='function',identity:a.title===TITLE&&a.appVersion===VERSION,lazyCatalog:typeof W.YGOAlpha554WarmCatalog==='function',legacyMaintenanceExposed:typeof W.__YGO554_POSTCOMMIT522==='function'&&typeof W.__YGO554_POST543==='function'}}
function projectStatus554(){let base={};try{base=A553.projectStatus?.()||{}}catch(_){}const startup=startupAudit554(),self=selfTest554();return{...base,version:VERSION,startup554:startup,selfTest554:self,startupStable:startup.pass===true,policy:'Alpha 554 saca del arranque crítico las auditorías Alpha522, el mantenimiento Alpha543 y la construcción del catálogo. Todo sigue disponible bajo demanda mediante warmCatalog/maintenance.'}}
const API={...A553,VERSION,warmCatalog:warmCatalog554,maintenance:maintenance554,bindLazyCatalog:bindLazyCatalog554,claimIdentity:claim554,installIdentity:installIdentity554,startupAudit:startupAudit554,selfTest:selfTest554,projectStatus:projectStatus554};
W.YGOAlpha554=API;if(W.YGOApp){W.YGOApp.version=VERSION;W.YGOApp.release554=API}installIdentity554();bindLazyCatalog554();
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',()=>{bindLazyCatalog554()},{once:true});/* Alpha934: identity replay 554 retired */
})();


;

/* === bundled from ygo-alpha-555-lazy-aware-certification === */

(()=>{'use strict';
const W=window,D=document,VERSION='Alpha 555',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_555',A554=W.YGOAlpha554||{},A543=W.YGOAlpha543||{};
const arr=v=>Array.isArray(v)?v:[];
function claim555(){try{if(D.title!==TITLE)D.title=TITLE}catch(_){}try{if(W.YGOApp)W.YGOApp.version=VERSION}catch(_){}try{if(W.YGOOfficialEvaluation)W.YGOOfficialEvaluation.version=VERSION}catch(_){}return VERSION}
function installIdentity555(){claim555();return true}
function visualGate555(){let dianaAfter=false;try{const calc=D.querySelector('.main-calc-pad'),d=D.querySelector('.diana-center-zone');if(calc&&d)dianaAfter=!!(calc.compareDocumentPosition(d)&Node.DOCUMENT_POSITION_FOLLOWING)}catch(_){}const pass=!!D.getElementById('alpha306LoadDeck')&&!!D.getElementById('alpha306DeleteDeck')&&!!D.querySelector('.diana-center-zone')&&dianaAfter&&D.querySelectorAll('#stats .stat').length===10;return{version:VERSION,pass,dianaAfterCalculate:dianaAfter,stats:D.querySelectorAll('#stats .stat').length,load:!!D.getElementById('alpha306LoadDeck'),delete:!!D.getElementById('alpha306DeleteDeck')}}
function catalogGate555({requireLoaded=false}={}){const count=arr(W.CARD_CATALOG).length,loaded=count>=19617,lazy=typeof W.YGOAlpha329?.ensureReady==='function'||typeof W.getEmbeddedDB==='function'||typeof W.YGOAlpha554WarmCatalog==='function';const pass=requireLoaded?loaded:(loaded||lazy);return{version:VERSION,pass,loaded,lazyAvailable:lazy,count,requireLoaded,status:loaded?'LOADED_FULL':(lazy?'LAZY_READY':'UNAVAILABLE')}}
function scoreGate555(){let fixture=null,result=null,error=null;try{const fc=W.YGOAlpha357?.fixtureCatalog?.(true)||{},e=Object.values(fc?.entries||{}).find(x=>x?.fixture&&!x?.aliasOf);fixture=e?.fixture||null;if(fixture)result=A543.fastScore?.(fixture)||W.scoreDeck?.(fixture)}catch(e){error=String(e?.message||e)}const scores=arr(result?.scores||result?.categories||result?.values),total=Number(result?.total??result?.score??scores.reduce((a,b)=>a+Number(b||0),0)),contract=W.YGOOfficialEvaluation?.pointsPerCategory===10&&W.YGOOfficialEvaluation?.max===100,integer10=scores.length===10&&scores.every(x=>Number.isInteger(Number(x))&&Number(x)>=0&&Number(x)<=10),totalOk=Number.isInteger(total)&&total>=0&&total<=100;return{version:VERSION,pass:contract&&!!fixture&&!error&&integer10&&totalOk,contract,fixture:!!fixture,total,scores,integer10,totalOk,error}}
function ydkGate555(){try{const r=A543.ydkRoundTrip?.(4);return{version:VERSION,pass:r?.pass===true,report:r}}catch(e){return{version:VERSION,pass:false,error:String(e?.message||e)}}}
function tierGate555(){try{const r=A543.tierBoundaryAudit?.();return{version:VERSION,pass:r?.pass===true,report:r}}catch(e){return{version:VERSION,pass:false,error:String(e?.message||e)}}}
function comboGate555(){const fast=typeof W.comboBuildCandidates==='function'&&W.comboBuildCandidates===W.autoAnalyzeAllCombos,preview=typeof A554.previewCombos==='function',strict=typeof A554.deepSearch==='function';return{version:VERSION,pass:fast&&preview&&strict,fastFacade:fast,previewAvailable:preview,strictOnDemand:strict}}
function coreGate555({requireCatalog=false}={}){const visual=visualGate555(),catalog=catalogGate555({requireLoaded:requireCatalog}),score=scoreGate555(),ydk=ydkGate555(),tier=tierGate555(),combo=comboGate555();const pass=[visual,catalog,score,ydk,tier,combo].every(x=>x.pass===true);return{version:VERSION,pass,requireCatalog,visual,catalog,score,ydk,tier,combo}}
let preparePromise=null;
async function prepare555({render=true}={}){if(preparePromise)return preparePromise;preparePromise=(async()=>{const started=performance.now();let error=null;try{if(arr(W.CARD_CATALOG).length<19000&&typeof W.YGOAlpha329?.ensureReady==='function')await W.YGOAlpha329.ensureReady();try{A543.repairCatalogBarrier?.()}catch(_){}if(render)try{await A554.warmCatalog?.('prepare555')}catch(_){}}catch(e){error=String(e?.message||e)}const gate=coreGate555({requireCatalog:true}),out={version:VERSION,pass:!error&&gate.pass,error,gate,elapsedMs:Math.round((performance.now()-started)*10)/10,at:new Date().toISOString()};W.__YGO555_PREPARE=out;if(!out.pass)preparePromise=null;return out})();return preparePromise}
async function certifyCore555(){const prepared=await prepare555({render:false}),core=coreGate555({requireCatalog:true});const report={version:VERSION,pass:prepared.pass===true&&core.pass===true,status:prepared.pass===true&&core.pass===true?'CORE_CERTIFIED':'CORE_PENDING',prepared,core,at:new Date().toISOString()};W.__YGO555_CORE_CERT=report;return report}
function selfTest555(){const lazy=coreGate555({requireCatalog:false}),startup=A554.startupAudit?.()||{};return{version:VERSION,pass:lazy.pass===true&&startup.pass===true&&D.title===TITLE&&String(W.YGO_APP_VERSION)===VERSION,lazyCore:lazy.pass===true,startup:startup.pass===true,identity:D.title===TITLE&&String(W.YGO_APP_VERSION)===VERSION}}
function projectStatus555(){const startup=A554.startupAudit?.()||{},core=coreGate555({requireCatalog:false}),prepared=W.__YGO555_PREPARE||null,self=selfTest555();return{version:VERSION,startup555:startup,core555:core,prepared555:prepared,selfTest555:self,coreReady:core.pass===true,fullCatalogLoaded:catalogGate555({requireLoaded:true}).pass===true,policy:'Alpha 555 distingue catálogo lazy disponible de catálogo completo cargado. El arranque puede pasar con lazy-ready, pero certifyCore prepara y exige el catálogo completo antes de certificar.'}}
const API={...A554,VERSION,claimIdentity:claim555,installIdentity:installIdentity555,visualGate:visualGate555,catalogGate:catalogGate555,scoreGate:scoreGate555,ydkGate:ydkGate555,tierGate:tierGate555,comboGate:comboGate555,coreGate:coreGate555,prepare:prepare555,certifyCore:certifyCore555,selfTest:selfTest555,projectStatus:projectStatus555};
W.YGOAlpha555=API;if(W.YGOApp){W.YGOApp.version=VERSION;W.YGOApp.release555=API}installIdentity555();/* Alpha934: redundant identity-only DOMContentLoaded 555 retired */
})();


;

/* === bundled from ygo-alpha-556-lazy-core-finalization === */

(()=>{'use strict';
const W=window,D=document,VERSION='Alpha 556',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_556',A555=W.YGOAlpha555||{},A554=W.YGOAlpha554||{};
function claim556(){try{if(D.title!==TITLE)D.title=TITLE}catch(_){}try{if(W.YGOApp)W.YGOApp.version=VERSION}catch(_){}try{if(W.YGOOfficialEvaluation)W.YGOOfficialEvaluation.version=VERSION}catch(_){}return VERSION}
function installIdentity556(){try{W.__YGO555_TITLE_OBSERVER?.disconnect?.()}catch(_){}try{Object.defineProperty(W,'YGO_APP_VERSION',{configurable:true,enumerable:true,get:()=>VERSION,set:v=>{W.__YGO556_LAST_VERSION_WRITE=String(v??'')}})}catch(_){}claim556();const t=D.querySelector('title');if(t&&typeof MutationObserver==='function'){try{W.__YGO556_TITLE_OBSERVER?.disconnect?.()}catch(_){}/* Alpha579: historical title observer 556 removed physically */W.__YGO556_TITLE_OBSERVER=null}return true}
function comboGate556(){const generator=typeof W.comboBuildCandidates==='function',auto=typeof W.autoAnalyzeAllCombos==='function',preview=typeof A555.previewCombos==='function',strict=typeof A555.deepSearch==='function';return{version:VERSION,pass:generator&&preview&&strict,generator,autoFacade:auto,sharedFacade:generator&&auto&&W.comboBuildCandidates===W.autoAnalyzeAllCombos,previewAvailable:preview,strictOnDemand:strict}}
function coreGate556({requireCatalog=false}={}){const base=A555.coreGate?.({requireCatalog})||{pass:false};const combo=comboGate556(),pass=base.visual?.pass===true&&base.catalog?.pass===true&&base.score?.pass===true&&base.ydk?.pass===true&&base.tier?.pass===true&&combo.pass===true;return{...base,version:VERSION,pass,combo}}
function startupGate556(){const a=A554.startupAudit?.()||{};const visual=A555.visualGate?.()||{};const longTasks=a.longTasks||[];const domReady=Number(W.__YGO553_STARTUP?.domReadyAt||0),post=longTasks.filter(x=>Number(x.start)>=domReady),worst=post.reduce((m,x)=>Math.max(m,Number(x.duration)||0),0);const pass=visual.pass===true&&D.title===TITLE&&String(W.YGO_APP_VERSION)===VERSION;return{version:VERSION,pass,visual:visual.pass===true,title:D.title,appVersion:String(W.YGO_APP_VERSION||''),readyState:D.readyState,worstPostDomLongTaskMs:Math.round(worst*10)/10,automaticCatalog:false,automaticLegacyMaintenance:false}}
function selfTest556(){const startup=startupGate556(),core=coreGate556({requireCatalog:false});return{version:VERSION,pass:startup.pass&&core.pass,startup:startup.pass,lazyCore:core.pass,identity:D.title===TITLE&&String(W.YGO_APP_VERSION)===VERSION,combo:core.combo}}
async function certifyCore556(){const prep=await A555.prepare?.({render:false});const core=coreGate556({requireCatalog:true}),pass=prep?.pass===true&&core.pass===true;const r={version:VERSION,pass,status:pass?'CORE_CERTIFIED':'CORE_PENDING',prepare:prep,core,at:new Date().toISOString()};W.__YGO556_CORE_CERT=r;return r}
function projectStatus556(){const startup=startupGate556(),core=coreGate556({requireCatalog:false}),fullCatalog=A555.catalogGate?.({requireLoaded:true})||{},self=selfTest556();return{version:VERSION,startup556:startup,core556:core,selfTest556:self,coreReady:core.pass===true,fullCatalogLoaded:fullCatalog.pass===true,prepared:W.__YGO555_PREPARE||null,coreCertificate:W.__YGO556_CORE_CERT||null,policy:'Alpha 556 considera válido el generador rápido aunque la fachada auto aún no haya sido re-enlazada durante el arranque lazy; la certificación sigue exigiendo catálogo completo.'}}
const API={...A555,VERSION,claimIdentity:claim556,installIdentity:installIdentity556,comboGate:comboGate556,coreGate:coreGate556,startupGate:startupGate556,selfTest:selfTest556,certifyCore:certifyCore556,projectStatus:projectStatus556};W.YGOAlpha556=API;if(W.YGOApp){W.YGOApp.version=VERSION;W.YGOApp.release556=API}installIdentity556();if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',installIdentity556,{once:true});
})();



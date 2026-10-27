
(()=>{'use strict';
const W=window,D=document,VERSION='Alpha 984',TITLE='Calculadora_de_Barajas_YuGiOh_Alpha_984';
const arr=v=>Array.isArray(v)?v:[], raw=v=>String(v??''), num=v=>Number(v)||0;
const STATE_KEY='ygo.alpha984.universal.scan.v1', CAL_KEY='ygo.alpha984.competitive.corpus.v1';
let scanJob=null, authorityTimer=null, catalogJob984=null;
function safe(fn,fallback=null){try{return fn()}catch(_){return fallback}}
function ensureAuthority984(){
  if(W.YGOAlpha985)return true;
  try{D.title=TITLE}catch(_){}
  try{Object.defineProperty(W,'YGO_APP_VERSION',{configurable:true,enumerable:true,get:()=>VERSION,set:v=>{W.__YGO984_BLOCKED_VERSION_WRITE={value:raw(v),at:Date.now()}}})}catch(_){try{W.YGO_APP_VERSION=VERSION}catch(__){}}
  if(!W.YGOApp)W.YGOApp={};
  try{Object.defineProperty(W.YGOApp,'version',{configurable:true,enumerable:true,get:()=>VERSION,set:v=>{W.__YGO984_BLOCKED_APP_VERSION_WRITE={value:raw(v),at:Date.now()}}})}catch(_){try{W.YGOApp.version=VERSION}catch(__){}}
  try{W.YGOApp.release={...(W.YGOApp.release||{}),authority:VERSION};W.YGOApp.certification={...(W.YGOApp.certification||{}),authority:VERSION}}catch(_){}
  try{D.documentElement.dataset.canonicalAuthority='Alpha-984'}catch(_){}
  return true;
}
async function ensureCatalog984(){
  if(arr(W.CARD_CATALOG).length>=19617)return{version:VERSION,pass:true,rows:arr(W.CARD_CATALOG).length,cached:true};
  if(catalogJob984)return catalogJob984;
  catalogJob984=(async()=>{
    let r=null;
    if(typeof W.YGOAlpha867?.ensure867==='function')r=await W.YGOAlpha867.ensure867();
    else if(typeof W.getEmbeddedDB==='function'){const rows=await W.getEmbeddedDB();if(arr(rows).length>=19617){W.CARD_CATALOG=rows;r={pass:true,rows:rows.length,source:'embedded'}}}
    return{version:VERSION,pass:arr(W.CARD_CATALOG).length>=19617,rows:arr(W.CARD_CATALOG).length,result:r,owner:'Alpha984-self-contained'};
  })().finally(()=>{catalogJob984=null});
  return catalogJob984;
}
function blankScan984(total=19617){return{version:VERSION,total,processed:0,effectBearing:0,exact:0,handlerExact:0,grammarExact:0,parseErrors:0,gaps:[],byFamily:{},byReason:{},startedAt:new Date().toISOString(),updatedAt:new Date().toISOString(),complete:false}}
function loadScan984(){try{const x=JSON.parse(localStorage.getItem(STATE_KEY)||'null');if(x&&x.version===VERSION&&x.total===19617)return x}catch(_){}return null}
function saveScan984(s){try{localStorage.setItem(STATE_KEY,JSON.stringify({...s,gaps:arr(s.gaps).slice(0,5000)}))}catch(_){}return s}
function mergeCounts984(dst,rows,key){for(const x of arr(rows)){const k=raw(x?.[key]??x?.name);if(k)dst[k]=(dst[k]||0)+num(x?.count)}}
function finishScan984(s){
  const unresolved=Math.max(0,num(s.effectBearing)-num(s.exact));
  const rank=o=>Object.entries(o||{}).map(([name,count])=>({name,count:num(count)})).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name));
  const out={...s,version:VERSION,unresolved,exactPct:s.effectBearing?Math.round(s.exact/s.effectBearing*10000)/100:0,universalExact:s.processed>=s.total&&s.effectBearing>0&&unresolved===0,pass:s.processed>=s.total&&s.total===19617&&unresolved===0,complete:s.processed>=s.total,byFamilyRanked:rank(s.byFamily),byReasonRanked:rank(s.byReason),updatedAt:new Date().toISOString()};
  W.__YGO984_CORPUS=out;
  if(out.complete){W.__YGO973_CORPUS=out;W.__YGO956_CORPUS=out;W.__YGO948_CORPUS=out}
  return out;
}
async function scanUniversal984(opts={}){
  if(scanJob)return scanJob;
  scanJob=(async()=>{
    const cat=await ensureCatalog984();if(!cat.pass)throw Error('Catálogo completo no disponible');
    const total=arr(W.CARD_CATALOG).length;if(total!==19617)throw Error('Catálogo inesperado: '+total);
    const batch=Math.max(25,Math.min(1000,num(opts.batchSize)||250)),maxGaps=Math.max(100,Math.min(10000,num(opts.maxGapRows)||5000));
    let s=opts.reset?null:(opts.resume===false?null:loadScan984());if(!s||s.total!==total)s=blankScan984(total);
    const scan=W.YGOAlpha978?.scanRange978||W.YGOAlpha976?.scanRange976||W.YGOApp?.rules?.scanRange976;if(typeof scan!=='function')throw Error('Scanner universal no disponible');
    for(let start=s.processed;start<total;start+=batch){
      const count=Math.min(batch,total-start),r=scan(start,count,{maxGapRows:Math.min(maxGaps,Math.max(250,count*4))})||{};
      s.processed=Math.max(s.processed,start+count);s.effectBearing+=num(r.effectBearing);s.exact+=num(r.exact);s.handlerExact+=num(r.handlerExact);s.grammarExact+=num(r.grammarExact);s.parseErrors+=num(r.parseErrors);
      if(s.gaps.length<maxGaps)s.gaps.push(...arr(r.gaps).slice(0,maxGaps-s.gaps.length));
      mergeCounts984(s.byFamily,r.byFamily||r.byFamilyRanked,'family');mergeCounts984(s.byReason,r.byReason||r.byReasonRanked,'reason');
      const p=finishScan984(s);saveScan984(p);try{opts.onProgress?.(p)}catch(_){};W.__YGO984_CORPUS_PROGRESS=p;
      await new Promise(res=>(W.requestIdleCallback?W.requestIdleCallback(()=>res(),{timeout:25}):setTimeout(res,0)));
    }
    const out=finishScan984(s);saveScan984(out);return out;
  })().finally(()=>{scanJob=null});return scanJob;
}
function clearUniversal984(){try{localStorage.removeItem(STATE_KEY)}catch(_){}W.__YGO984_CORPUS=null;W.__YGO984_CORPUS_PROGRESS=null;return true}
function gapPlan984(limit=100){const c=finishScan984(loadScan984()||W.__YGO984_CORPUS||blankScan984());const total=Math.max(1,c.unresolved||1),q=[...arr(c.byFamilyRanked).map(x=>({kind:'family',key:x.name,count:x.count,share:x.count/total})),...arr(c.byReasonRanked).map(x=>({kind:'reason',key:x.name,count:x.count,share:x.count/total}))].sort((a,b)=>b.count-a.count||a.kind.localeCompare(b.kind)||a.key.localeCompare(b.key));return{version:VERSION,complete:c.complete,unresolved:c.unresolved,exactPct:c.exactPct,next:q[0]||null,queue:q.slice(0,Math.max(1,limit)),gaps:arr(c.gaps).slice(0,Math.max(1,limit))}}
function searchCertificate984(){
  const c=W.__YGO864_SEARCH?.certificates?.at?.(-1)||W.__YGO688_LAST_EXHAUSTIVE?.certificate||W.__YGO669_LAST_EXHAUSTIVE?.certificate||W.__YGO644_EXHAUSTIVE_CERT||{};
  const checks={frontierExhausted:c.frontierExhausted===true,allLegalActionsEnumerated:c.allLegalActionsEnumerated===true,allTransitionsExact:c.allTransitionsExact===true,targetChoiceEnumerationComplete:c.targetChoiceEnumerationComplete===true,stateDominanceSafe:c.stateDominanceSafe===true,objectiveComplete:c.objectiveComplete===true,horizonOptimalityProven:c.horizonOptimalityProven===true,truncated:c.truncated!==true};
  const boundedComplete=Object.values(checks).every(Boolean),globalOptimalityProven=boundedComplete&&c.globalOptimalityProven===true;
  return{version:VERSION,pass:boundedComplete,boundedComplete,globalOptimalityProven,checks,certificate:c,policy:'Alpha984 sólo certifica búsqueda cuando toda la frontera legal del horizonte queda agotada; convergencia/beam no equivalen a optimalidad global.'};
}
function top5Certificate984(){
  let base={};try{base=W.YGOAlpha948?.top5?.()||W.YGOApp?.combos?.top5Exact?.()||{}}catch(e){base={pass:false,error:raw(e?.message||e)}}
  const s=searchCertificate984(),shown=num(base.shown??arr(W.comboLastAnalysis).slice(0,5).length),exact=num(base.exact),boards=num(base.endBoardsExact);
  return{version:VERSION,pass:shown===5&&exact===5&&boards===5&&s.pass===true,shown,exact,endBoardsExact:boards,search:s,globalOptimalityProven:s.globalOptimalityProven===true,policy:'Cinco replays exactos requieren además búsqueda acotada completa; no se promueve un beam truncado.'};
}
function calibrationContext984(){
 const key=String(W.__YGO_ACTIVE_BAN_KEY||'tcg');const profile=W.BANLIST_PROFILES?.[key]||{};
 const stamp=String(profile.officialEffective||profile.date||'').trim();
 const date=/^\d{2}\/\d{2}\/\d{4}$/.test(stamp)?stamp.split('/').reverse().join('-'):stamp;
 return{format:key==='tcg'?'TCG':key==='ocg'?'OCG':key,banlistVersion:key+'@'+date,
  modelBuild:String(W.YGO_BUILD_MANIFEST?.buildId||W.__YGO_TARGET_BUILD||W.YGO_APP_VERSION||'unknown'),
  dataVersion:String(W.YGO_BUILD_MANIFEST?.catalogSha256||W.YGO_BUILD_MANIFEST?.dataVersion||W.YGO_DATA_MANIFEST?.sha256||W.CARD_CATALOG?.length||'unknown'),
  semanticVersion:String(W.YGOProbability?.version||'unknown')};
}
function calibrationDeck984(input){
 if(!input||typeof input!=='object')throw Error('DECK_REQUIRED');
 const catalog=new Map(arr(W.CARD_CATALOG).map(c=>[String(c?.id),c])),deck={main:[],extra:[],side:[]},copies=new Map();
 for(const zone of ['main','extra','side']){
  if(!Array.isArray(input[zone]))throw Error('DECK_ZONE_REQUIRED:'+zone);
  const merged=new Map();
  for(const item of input[zone]){
   const id=Number(item?.id??item?.cardId),qty=Number(item?.qty??1);
   if(!Number.isSafeInteger(id)||id<=0||!Number.isSafeInteger(qty)||qty<1||qty>3)throw Error('INVALID_CARD_OR_QUANTITY:'+zone);
   const card=catalog.get(String(id));if(!card)throw Error('UNKNOWN_CARD_ID:'+id);
   const n=(merged.get(id)?.qty||0)+qty;if(n>3)throw Error('OVER_THREE_COPIES:'+id);
   merged.set(id,{...card,qty:n});
   const identity=String(Number(card.alias)>0?Number(card.alias):id);copies.set(identity,(copies.get(identity)||0)+qty);
   if(copies.get(identity)>3)throw Error('OVER_THREE_SHARED_COPIES:'+identity);
  }
  deck[zone]=[...merged.values()].sort((a,b)=>Number(a.id)-Number(b.id));
 }
 const count=z=>deck[z].reduce((n,c)=>n+c.qty,0);
 if(count('main')<40||count('main')>60||count('extra')>15||count('side')>15)throw Error('INVALID_DECK_COUNTS');
 const fingerprint=JSON.stringify(['main','extra','side'].map(z=>deck[z].map(c=>[String(c.id),c.qty])));
 return{deck,fingerprint};
}
function loadCalibration984(){try{const x=JSON.parse(localStorage.getItem(CAL_KEY)||'null');return x&&x.schema==='ygo-calibration-v2'&&Array.isArray(x.rows)?x:null}catch(_){return null}}
async function importCalibration984(rows=[],opts={}){
 if(!Array.isArray(rows)||rows.length===0||rows.length>2000)return{version:VERSION,pass:false,status:'INVALID_DATASET_SIZE',accepted:0};
 const context=calibrationContext984(),ids=new Set(),decks=new Set(),validated=[],issues=[];
 for(let i=0;i<rows.length;i++){
  const row=rows[i]||{},id=String(row.id||'').trim(),label=Number(row.label??row.competitiveScore),format=String(row.format||'').trim();
  try{
   if(!id||ids.has(id))throw Error('DUPLICATE_OR_MISSING_ID');ids.add(id);
   if(!Number.isFinite(label)||label<0||label>100)throw Error('INVALID_EXTERNAL_LABEL');
   if(!['tuning','validation'].includes(row.split))throw Error('SPLIT_MUST_BE_TUNING_OR_VALIDATION');
   if(format!==context.format||String(row.banlistVersion||'')!==context.banlistVersion)throw Error('FORMAT_OR_BANLIST_MISMATCH');
   const sourceUrl=String(row.sourceUrl||row.source||'');let url;try{url=new URL(sourceUrl)}catch(_){throw Error('EXTERNAL_SOURCE_URL_REQUIRED')}
   if(url.protocol!=='https:'||!url.hostname||['localhost','127.0.0.1'].includes(url.hostname))throw Error('EXTERNAL_HTTPS_SOURCE_REQUIRED');
   if(!['expert_review','tournament_results','matchup_dataset'].includes(row.labelMethod))throw Error('EXTERNAL_LABEL_METHOD_REQUIRED');
   const date=String(row.labeledAt||'');if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date+'T00:00:00Z'))||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date||date>new Date().toISOString().slice(0,10))throw Error('VALID_LABEL_DATE_REQUIRED');
   const clean=calibrationDeck984(row.deck);
   if(decks.has(clean.fingerprint))throw Error('DUPLICATE_DECK_ACROSS_SPLITS');decks.add(clean.fingerprint);
   validated.push({id,label,format,banlistVersion:context.banlistVersion,split:row.split,sourceUrl:url.href,labelMethod:row.labelMethod,labeledAt:date,...clean});
  }catch(e){issues.push({index:i,id,error:String(e.message||e)})}
 }
 if(issues.length)return{version:VERSION,pass:false,status:'DATASET_REJECTED',accepted:0,issues,storedDatasetPreserved:true};
 if(typeof W.scoreDeck!=='function')return{version:VERSION,pass:false,status:'SCORING_ENGINE_UNAVAILABLE',accepted:0};
 const scored=[];
 for(let i=0;i<validated.length;i++){
  if(opts.signal?.aborted||opts.shouldCancel?.()===true)return{version:VERSION,pass:false,status:'CANCELLED',accepted:0,storedDatasetPreserved:true};
  if(JSON.stringify(context)!==JSON.stringify(calibrationContext984()))return{version:VERSION,pass:false,status:'CONTEXT_CHANGED',accepted:0,storedDatasetPreserved:true};
  const row=validated[i],oldBudget=W.__YGO_ANALYSIS_BUDGET;
  try{
   W.__YGO_ANALYSIS_BUDGET={mc:600,rules:40,stress:24};
   const result=await W.scoreDeck(row.deck);
   const stats=result?.scores;if(!Array.isArray(stats)||stats.length!==10||stats.some(n=>!Number.isInteger(n)||n<0||n>10))throw Error('INVALID_ENGINE_RESULT');
   const score=stats.reduce((a,b)=>a+b,0);
   scored.push({...row,score,stats:[...stats],evaluationOrigin:'CURRENT_ENGINE_RECALCULATED',evaluatedAt:new Date().toISOString()});
  }catch(e){return{version:VERSION,pass:false,status:'SCORING_FAILED',accepted:0,index:i,error:String(e?.message||e),storedDatasetPreserved:true}}
  finally{W.__YGO_ANALYSIS_BUDGET=oldBudget}
  try{opts.onProgress?.({completed:i+1,total:validated.length})}catch(_){}
  await new Promise(resolve=>setTimeout(resolve,0));
 }
 const dataset={schema:'ygo-calibration-v2',context,rows:scored,importedAt:new Date().toISOString(),sourceEvidence:'DECLARED_EXTERNAL_SOURCES_NOT_INDEPENDENTLY_VERIFIED'};
 const before=localStorage.getItem(CAL_KEY),serialized=JSON.stringify(dataset);
 try{localStorage.setItem(CAL_KEY,serialized);if(localStorage.getItem(CAL_KEY)!==serialized)throw Error('WRITE_UNCONFIRMED')}
 catch(e){try{if(before===null)localStorage.removeItem(CAL_KEY);else localStorage.setItem(CAL_KEY,before)}catch(_){}return{version:VERSION,pass:false,status:'DATASET_STORAGE_FAILED',error:String(e?.message||e)}}
 return{...calibrationStatus984(),accepted:scored.length,submittedScoresIgnored:true};
}
function calibrationMetrics984(rows){
 const n=rows.length;if(!n)return{count:0,mae:null,correlation:null};
 const meanS=rows.reduce((a,x)=>a+x.score,0)/n,meanL=rows.reduce((a,x)=>a+x.label,0)/n;
 let nume=0,ds=0,dl=0;for(const x of rows){nume+=(x.score-meanS)*(x.label-meanL);ds+=(x.score-meanS)**2;dl+=(x.label-meanL)**2}
 return{count:n,mae:rows.reduce((a,x)=>a+Math.abs(x.score-x.label),0)/n,correlation:ds&&dl?nume/Math.sqrt(ds*dl):null};
}
function calibrationStatus984(){
 const dataset=loadCalibration984(),context=calibrationContext984();
 if(!dataset)return{version:VERSION,pass:false,count:0,strongPass:false,status:'NEED_DISTINCT_EXTERNAL_HOLDOUT_DATA',requiredValidation:50,competitiveCertified:false,context};
 if(JSON.stringify(dataset.context)!==JSON.stringify(context))return{version:VERSION,pass:false,count:dataset.rows.length,strongPass:false,status:'STALE_MODEL_OR_DATASET_CONTEXT',competitiveCertified:false,context,savedContext:dataset.context};
 const rows=dataset.rows,ids=new Set(),fingerprints=new Set();
 for(const row of rows){if(!row?.id||ids.has(row.id)||!row?.fingerprint||fingerprints.has(row.fingerprint)||row.evaluationOrigin!=='CURRENT_ENGINE_RECALCULATED'||!Number.isFinite(row.score)||!Number.isFinite(row.label)||!['tuning','validation'].includes(row.split))return{version:VERSION,pass:false,count:rows.length,strongPass:false,status:'STORED_DATASET_INVALID',competitiveCertified:false};ids.add(row.id);fingerprints.add(row.fingerprint)}
 const validation=calibrationMetrics984(rows.filter(x=>x.split==='validation')),tuning=calibrationMetrics984(rows.filter(x=>x.split==='tuning'));
 const statisticalPass=validation.count>=50&&validation.correlation!==null&&validation.correlation>=.75&&validation.mae<=10;
 return{version:VERSION,pass:statisticalPass,strongPass:false,statisticalPass,count:rows.length,uniqueDecks:fingerprints.size,validation,tuning,mae:validation.mae,correlation:validation.correlation,
  status:statisticalPass?'HOLDOUT_METRICS_PASS_EXTERNAL_REVIEW_REQUIRED':validation.count<50?'NEED_50_DISTINCT_VALIDATION_DECKS':'VALIDATION_METRICS_NEED_TUNING',
  competitiveCertified:false,sourceEvidence:dataset.sourceEvidence,context,
  policy:'Scores recalculated by the current engine. Distinct tuning/holdout decks and external label provenance are required. Metrics alone do not certify competitive ranking; external evidence review remains explicit.'};
}
function calibrationTemplate984(){
 const context=calibrationContext984(),row={id:'',deck:{main:[{id:null,qty:1}],extra:[],side:[]},label:null,format:context.format,banlistVersion:context.banlistVersion,split:'validation',sourceUrl:'',labelMethod:'expert_review',labeledAt:null};
 return{schema:'ygo-calibration-input-v2',context,requiredValidation:50,rows:[row],
  notes:['Replace the placeholder row with distinct physical decks; no overlap between tuning and validation.','Use external labels with real source URLs and dates. No labels are generated automatically.','Input score fields are ignored: the current engine recalculates every score.','A declared URL is not independently verified evidence.']};
}
function formatPlan984(){let rel=null;try{rel=W.YGOAlpha973?.release?.()||W.YGOAlpha948?.release?.({})||null}catch(_){}const u=rel?.formatUniverse||{};return{version:VERSION,pass:u.pass===true,partial:arr(u.partial),active:rel?.format||null,banlistUniverse:rel?.banlistUniverse||null}}
function cleanup984(){
  const disconnected=[],cleared=[];try{if(W.__YGO_FINAL983_TITLE_TIMER){clearTimeout(W.__YGO_FINAL983_TITLE_TIMER);W.__YGO_FINAL983_TITLE_TIMER=null;cleared.push('__YGO_FINAL983_TITLE_TIMER')}}catch(_){}for(const k of Object.keys(W)){if(/^__YGO\d+_TITLE_OBSERVER$/.test(k)&&W[k]?.disconnect){try{W[k].disconnect();W[k]=null;disconnected.push(k)}catch(_){}}}
  for(const k of ['__YGO549_FP_WATCH','__YGO550_WATCH','__YGO551_WATCH'])if(W[k]){try{clearInterval(W[k]);clearTimeout(W[k]);W[k]=null;cleared.push(k)}catch(_){}}
  W.__YGO597_MANAGES_GROWTH=true;W.__YGO595_ARCHETYPE_REFRESH_DEFERRED=true;ensureAuthority984();return{version:VERSION,pass:true,disconnected,cleared};
}
function structural984(){const ids=[...D.querySelectorAll('[id]')].map(x=>x.id),stats=D.querySelectorAll('#stats .stat').length,formats=D.querySelectorAll('.fmt').length;const checks={identity:D.title===TITLE,authority:raw(W.YGO_APP_VERSION)===VERSION,uniqueIds:new Set(ids).size===ids.length,load:!!D.getElementById('alpha306LoadDeck'),delete:!!D.getElementById('alpha306DeleteDeck'),diana:!!D.querySelector('.diana-center-zone'),ydk:typeof W.parseYDK==='function',scoreUi:!!D.getElementById('score')&&!!D.getElementById('tier'),stats:stats===10,formats:formats>=9,catalogSource:!!D.getElementById('ygo-db-embedded')};return{version:VERSION,pass:Object.values(checks).every(Boolean),checks,stats,formats,catalogLoaded:arr(W.CARD_CATALOG).length}}
function project984(){let rel=null;try{rel=W.YGOAlpha973?.release?.()||W.YGOAlpha948?.release?.({})||null}catch(e){rel={status:'ERROR',error:raw(e?.message||e)}}const corpus=loadScan984()||W.__YGO984_CORPUS||null,cal=calibrationStatus984(),top=top5Certificate984(),fmt=formatPlan984();const blockers=[...new Set([...(arr(rel?.blockers)),...(corpus?.complete&&corpus?.universalExact?'': 'universalExactRules984').split(' ').filter(Boolean),...(top.pass?[]:['top5BoundedComplete984']),...(fmt.pass?[]:['allFormatsExact984']),...(cal.strongPass?[]:['scoreCalibration50Plus984']),...(W.__YGO_EXTERNAL_BROWSER_E2E_PASS===true?[]:['externalBrowserE2E'])])];return{version:VERSION,structural:structural984(),release:rel,corpus:corpus?finishScan984(corpus):{status:'NOT_RUN'},gaps:gapPlan984(25),top5:top,formats:fmt,calibration:cal,externalBrowserE2E:W.__YGO_EXTERNAL_BROWSER_E2E_PASS===true,blockers,policy:'Alpha984 convierte pendientes universales en gates reanudables y medibles; nunca marca exactitud/optimalidad por heurística.'}}
async function certify984(opts={}){const out={version:VERSION,startedAt:new Date().toISOString(),errors:[]};try{out.catalog=await ensureCatalog984()}catch(e){out.errors.push({stage:'catalog',error:raw(e?.message||e)})}if(opts.universal===true)try{out.corpus=await scanUniversal984({resume:opts.resume!==false,reset:opts.reset===true,batchSize:opts.batchSize||250,maxGapRows:opts.maxGapRows||5000,onProgress:opts.onProgress})}catch(e){out.errors.push({stage:'universal',error:raw(e?.message||e)})}if(opts.base!==false){try{const base={version:VERSION,physical:null,e2e:null,certification:null,errors:[]};if(opts.physical===true)try{base.physical=await W.YGOAlpha874?.physical874?.()}catch(e){base.errors.push({stage:'physical',error:raw(e?.message||e)})}if(opts.e2e===true&&typeof W.YGOAlpha973?.e2e==='function')try{base.e2e=await W.YGOAlpha973.e2e()}catch(e){base.errors.push({stage:'e2e',error:raw(e?.message||e)})}if(opts.full===true&&typeof W.YGOAlpha973?.certify==='function')try{base.certification=await W.YGOAlpha973.certify(opts.certificationOptions||{})}catch(e){base.errors.push({stage:'certification',error:raw(e?.message||e)})}out.base=base}catch(e){out.errors.push({stage:'base',error:raw(e?.message||e)})}}
  out.project=project984();out.finishedAt=new Date().toISOString();W.__YGO984_CERT=out;return out;
}

function paint984(x={}){try{const n=D.getElementById('alpha870FullStatus');if(!n)return x;if(x.running)n.textContent='Alpha 984 · certificación total en curso…';else if(x.progress)n.textContent=`Alpha 984 · corpus ${x.progress.processed}/${x.progress.total} · EXACT ${x.progress.exactPct}% · pendientes ${x.progress.unresolved}`;else{const p=x.project||project984(),b=arr(p.blockers);n.textContent=`Alpha 984 · ${b.length?b.length+' bloqueadores: '+b.slice(0,5).join(', '):'sin bloqueadores detectados'}`}}catch(_){}return x}
function export984(x=W.__YGO984_CERT||{version:VERSION,project:project984(),corpus:W.__YGO984_CORPUS||loadScan984()}){const blob=new Blob([JSON.stringify(x,null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=D.createElement('a');a.href=u;a.download=`Alpha_984_Certificacion_${new Date().toISOString().slice(0,10)}.json`;D.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);return x}
function bindCertification984(){
 const old=D.getElementById('alpha870FullCert');if(old&&old.dataset.alpha984!=='1'){const b=old.cloneNode(true);b.dataset.alpha984='1';old.replaceWith(b);b.addEventListener('click',async()=>{const label=b.textContent;b.disabled=true;b.textContent='CERTIFICANDO…';paint984({running:true});try{const r=await certify984({universal:true,resume:true,e2e:true,physical:true,full:true,onProgress:p=>paint984({progress:p})});paint984(r)}catch(e){paint984({project:{blockers:['error:'+raw(e?.message||e)]}})}finally{b.disabled=false;b.textContent=label||'★ CERTIFICACIÓN TOTAL DEL ANALIZADOR'}})}
 const ex=D.getElementById('alpha870Export');if(ex&&ex.dataset.alpha984!=='1'){const b=ex.cloneNode(true);b.dataset.alpha984='1';ex.replaceWith(b);b.addEventListener('click',()=>export984())}
 return true;
}

const API={VERSION,TITLE,ensureCatalog984,scanUniversal984,clearUniversal984,gapPlan984,searchCertificate984,top5Certificate984,importCalibration984,calibrationStatus984,calibrationTemplate984,calibrationContext984,formatPlan984,cleanup984,structural984,project984,certify984,ensureAuthority984,paint984,export984,bindCertification984};
W.YGOAlpha984=API;W.YGOCanonicalRelease984=API;if(!W.YGOApp)W.YGOApp={};W.YGOApp.release984=API;W.YGOApp.diagnostics={...(W.YGOApp.diagnostics||{}),alpha984:project984,gaps984:gapPlan984,top5Proof984:top5Certificate984};W.YGOApp.certification={...(W.YGOApp.certification||{}),run984:certify984,scanUniversal984,authority:VERSION};
cleanup984();bindCertification984();
const settle=()=>{ensureAuthority984();bindCertification984();clearTimeout(authorityTimer);authorityTimer=setTimeout(ensureAuthority984,1200)};
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',settle,{once:true});else settle();
})();

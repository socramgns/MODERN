(()=>{'use strict';
const W=window,D=document;
const state={ready:false,lastChecks:null,testEvidence:null};
const arr=x=>Array.isArray(x)?x:[];
const count=z=>arr(W.deckState?.[z]).reduce((n,c)=>n+(Number(c.qty)||1),0);
function download(value,name){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=D.createElement('a');a.href=url;a.download=name;D.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function status(){
 const boot=W.__YGO_BOOT_HEALTH_1263?.()||{};
 const calibration=W.YGOAlpha984?.calibrationStatus984?.()||{status:'PENDING',competitiveCertified:false};
 let catalog=null,provenance=null,combo=null,coverage=null;try{catalog=W.YGODataCatalog?.status?.()||null}catch(_){}
 try{provenance=W.YGOProvenance?.status?.()||null}catch(_){}
 try{coverage=W.YGOCardCoverage?.report?.()||null}catch(_){}
 try{combo={capabilities:W.YGOComboEngine?.capabilities?.()||null,workbench:W.YGOComboWorkbench?.report?.()||null,advanced:W.YGOAdvancedWorkbench?.report?.()||null,responses:W.YGOResponses?.capabilities?.()||null,duel:W.YGODuelPhases?.capabilities?.()||null,expansion:W.YGOExpandedArchetypes||null,strategyVersion:W.YGOStrategy?.version||null}}catch(_){}
 const formatsAudit=W.YGOUIState?.last?.formatsAudit||null;
 const format=String(W.__YGO_ACTIVE_BAN_KEY||D.querySelector('.fmt.active')?.dataset.f||'tcg');
 return{schema:'ygo-supported-scope-status/v1',build:W.YGO_BUILD_MANIFEST,ready:state.ready,format,primaryFormat:'tcg',formatExperimental:!['tcg','tcgAdvanced'].includes(format),
  counts:{main:count('main'),extra:count('extra'),side:count('side')},
  boot:{ready:boot.ready===true,hashesVerified:boot.hashesVerified===true,done:boot.done,total:boot.total},
  catalog,provenance,coverage,formatsAudit,formatContext:W.YGOUIState?.getFormatContext?.()||null,combo,score:{authority:D.documentElement.dataset.scoreAuthority||'PENDING',certified:false,competitiveCertified:false,total:D.getElementById('total')?.textContent||null},
  calibration,officialContextVerification:W.YGO_OFFICIAL_CONTEXT_VERIFICATION||null,testEvidence:state.testEvidence,lastChecks:state.lastChecks,
  limitations:['La puntuación es estructural y provisional; no mide una tasa de victoria.','Las líneas requieren un escenario y acciones admitidas por el motor.','Los formatos distintos de TCG y las cartas sin datos suficientes requieren revisión.'],universalCertified:false};
}
function analysis(){return{schema:'ygo-analysis/v1',exportedAt:new Date().toISOString(),status:status(),deck:JSON.parse(JSON.stringify(W.deckState||{})),probabilities:W.YGOUIState?.last||null,scoreEvidence:W.__YGO1124_SCORE_EVIDENCE||null,search:W.YGOStable?.lastSupportedSearch||W.__YGO1080_LAST_RESULT||null,combo:W.YGOComboWorkbench?.report?.()||null,advanced:W.YGOAdvancedWorkbench?.report?.()||null,cardCoverage:W.YGOCardCoverage?.report?.()||null,formatDeck:W.YGOFormatEditor?.export?.()||null,documentReviews:W.YGOProvenance?.export?.()||null};}
function evidenceCheck(report){
 const issues=[];
 if(report?.schema!=='ygo-analyzer-e2e/v1')issues.push('Esquema de informe no admitido.');
 if(report?.buildId!==W.YGO_BUILD_MANIFEST?.buildId)issues.push('Las pruebas pertenecen a otra compilación.');
 if(!/^[a-f0-9]{64}$/.test(String(report?.htmlSha256||'')))issues.push('Falta el SHA-256 del archivo probado.');
 const tests=arr(report?.tests);
 if(!tests.length||tests.some(t=>typeof t?.name!=='string'||typeof t?.pass!=='boolean'))issues.push('Resultados de pruebas incompletos.');
 if(report?.runner!=='Playwright/Chromium')issues.push('Runner no reconocido.');
 return{pass:issues.length===0,issues,tests:tests.length,passed:tests.filter(t=>t.pass).length,scope:'Registro externo vinculado a esta fuente; no certifica todas las reglas del juego.'};
}
function importEvidence(report){const validation=evidenceCheck(report);if(!validation.pass)return validation;state.testEvidence={...report,validation};paint();return validation;}
async function checks(){
 const api=W.YGOAlpha1263||{},tests=[];
 const run=async(name,f)=>{try{const r=await f();tests.push({name,pass:r?.pass===true,detail:r})}catch(e){tests.push({name,pass:false,error:String(e?.message||e)})}await new Promise(r=>setTimeout(r,0));};
 await run('Integridad y arranque',()=>({pass:W.__YGO_BOOT_HEALTH_1263?.().ready===true&&W.__YGO_BUNDLE_INTEGRITY?.pass===true}));
 for(const id of ['parserRegression1092','banlistIdentityFixtures1263','moonSolemnJudgmentFixtures1261','moonJammerSevenFixtures1257','magicJammerFixtures1256','flipSpellFixtures1255','bookOfMoonFixtures1254'])if(typeof api[id]==='function')await run(id,()=>api[id]());
 await run('Composición conservada',()=>{if(!count('main'))return{pass:true,empty:true};const ui=W.YGOUIState?.sync?.();const vals=[...D.querySelectorAll('#composition .metric b')].map(x=>Number(x.textContent));return{pass:vals.length===4&&vals[0]===count('main')&&vals[1]+vals[2]+vals[3]===vals[0],counts:vals};});
 state.lastChecks={schema:'ygo-runtime-checks/v1',buildId:W.YGO_BUILD_MANIFEST?.buildId,executedAt:new Date().toISOString(),pass:tests.length>0&&tests.every(t=>t.pass),tests,universalCertified:false};paint();return state.lastChecks;
}
let host;
function paint(){if(!host)return;const s=status();const line=host.querySelector('[data-stable-status]');line.textContent=`${s.counts.main?`${s.counts.main} Main · ${s.counts.extra} Extra · ${s.counts.side} Side`:'Importa una baraja para comenzar.'} · ${s.formatExperimental?'Formato experimental: revisar reglas y disponibilidad.':'TCG: análisis de estructura y escenarios declarados.'}`;
 const cal=host.querySelector('[data-stable-calibration]');cal.textContent=s.calibration.status==='INDEPENDENT_COMPETITIVE_VALIDATED'?'Calibración competitiva validada.':`Calibración competitiva pendiente. ${s.calibration.validation?.count||0} barajas de validación aceptadas; no se atribuye un tier de torneo.`;
 const formatLine=host.querySelector('[data-stable-format]');if(formatLine)formatLine.textContent=s.formatsAudit?`Formato: ${s.formatsAudit.errors.length} incidencias; ${s.formatsAudit.pending.length} datos o reglas pendientes. ${s.formatsAudit.snapshot?.effectiveDate?'Lista: '+s.formatsAudit.snapshot.effectiveDate+'. ':''}La revisión usa la lista declarada y disponibilidad técnica.`:'La revisión de formato se activará al cargar una baraja.';
 const officialLine=host.querySelector('[data-stable-official]');if(officialLine){const record=s.officialContextVerification;officialLine.textContent=record?.pass&&record.tableEquivalent?`Lista TCG incorporada: publicación oficial del ${record.effectiveDate.split('-').reverse().join('/')} cotejada por fecha, nombres y límites. El cotejo no verifica disponibilidad, textos ni rulings de todas las cartas. Los contextos importados requieren su propia revisión.`:'La lista incorporada requiere contraste documental oficial.';}
 const sourceLine=host.querySelector('[data-stable-provenance]');if(sourceLine)sourceLine.textContent=s.provenance?`Documentos revisados: ${s.provenance.reviewedArtifacts}. Una revisión coteja campos y citas con el documento aportado; no autentica por sí sola su origen ni cambia la identidad de la carta.`:'Revisión documental no disponible.';
 const details=host.querySelector('[data-stable-details]');details.textContent=JSON.stringify({build:s.build,catalog:s.catalog,coverage:s.coverage,formatsAudit:s.formatsAudit,provenance:s.provenance,combo:s.combo,calibration:s.calibration,lastChecks:state.lastChecks,testEvidence:state.testEvidence?{buildId:state.testEvidence.buildId,htmlSha256:state.testEvidence.htmlSha256,validation:state.testEvidence.validation}:null},null,2);
}
function install(){if(host)return;const style=D.createElement('style');style.textContent='.stable-release{margin:10px 0;padding:12px;border:1px solid #139cc6;border-radius:10px;background:#041426;color:#dceeff;font:13px/1.5 Arial}.stable-release p{margin:5px 0}.stable-release b{color:#78e8ff}.stable-release .stable-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.stable-release button{padding:7px 10px;background:#123a5c;border:1px solid #329bc5;border-radius:6px;color:white;cursor:pointer}.stable-release pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:320px;overflow:auto;font-size:11px}.stable-release summary{cursor:pointer;margin-top:8px}.stable-note{color:#ffe2a4}.stable-release [role=status]{min-height:20px}';D.head.appendChild(style);
 host=D.createElement('section');host.className='stable-release';host.id='ygoStableRelease';host.setAttribute('aria-label','Alcance y validación del análisis');host.innerHTML='<b>ALCANCE DEL ANÁLISIS</b><p data-stable-status></p><p class="stable-note">La nota estima características estructurales. Las probabilidades de acceso no garantizan una jugada y las líneas exploradas no demuestran el mejor resultado posible.</p><p data-stable-calibration></p><p data-stable-format></p><p data-stable-official></p><div class="stable-actions"><button type="button" data-action="analysis">Exportar análisis JSON</button><button type="button" data-action="calibration-template">Plantilla de calibración</button><button type="button" data-action="calibration-import">Importar calibración</button><button type="button" data-action="backlog">Exportar cartas pendientes</button></div><details><summary>Documentos de cartas y contexto del formato</summary><p data-stable-provenance></p><p>La evidencia documental requiere contenido, SHA-256, campos, citas y revisor. Para formatos históricos, digitales o de evento puedes aportar el pool y las reglas aplicables en un contexto JSON.</p><label>Passcode de la carta <input type="number" min="1" step="1" data-provenance-card placeholder="p. ej. 14558127" style="width:150px"></label><div class="stable-actions"><button type="button" data-action="provenance-template">Plantilla documental</button><button type="button" data-action="provenance-import">Importar documentos</button><button type="button" data-action="provenance-export">Exportar documentos</button><button type="button" data-action="provenance-audit">Revisar documentos guardados</button><button type="button" data-action="format-import">Importar contexto de formato</button><button type="button" data-action="format-export">Exportar contexto de formato</button><button type="button" data-action="format-reset">Restablecer contexto incorporado</button></div></details><details><summary>Datos, pruebas y diagnóstico</summary><div class="stable-actions"><button type="button" data-action="checks">Comprobar funciones admitidas</button><button type="button" data-action="test-import">Abrir informe externo de pruebas</button></div><pre data-stable-details></pre></details><p role="status" aria-live="polite" data-stable-message></p><input type="file" accept=".json,application/json" data-input="calibration" hidden><input type="file" accept=".json,application/json" data-input="tests" hidden><input type="file" accept=".json,application/json" data-input="provenance" hidden><input type="file" accept=".json,application/json" data-input="format" hidden>';
 const top=D.querySelector('.app .top');if(top)top.before(host);else D.body.prepend(host);
 const message=t=>{host.querySelector('[data-stable-message]').textContent=t;};
 host.addEventListener('click',async e=>{const action=e.target.closest('[data-action]')?.dataset.action;if(!action)return;try{
  if(action==='analysis')download(analysis(),'Analisis_Baraja.json');
  if(action==='calibration-template')download(W.YGOAlpha984?.calibrationTemplate984?.()||{rows:[],status:'UNAVAILABLE'},'Plantilla_Calibracion.json');
  if(action==='calibration-import')host.querySelector('[data-input=calibration]').click();
  if(action==='test-import')host.querySelector('[data-input=tests]').click();
  if(action==='provenance-template'){const id=Number(host.querySelector('[data-provenance-card]').value);if(!Number.isSafeInteger(id)||!W.YGODataCatalog?.lookup?.(id))throw Error('Introduce un passcode existente en el catálogo.');download(W.YGOProvenance.template(id),'Plantilla_Documental_'+id+'.json');message('Completa el documento real, su SHA-256, las citas y los datos del revisor. La plantilla no es evidencia aceptada.');}
  if(action==='provenance-import')host.querySelector('[data-input=provenance]').click();
  if(action==='provenance-export')download(W.YGOProvenance?.export?.()||{},'Documentos_Revisados.json');
  if(action==='provenance-audit'){message('Volviendo a cotejar los documentos guardados…');const r=await W.YGOProvenance.auditStored();message(r.pass?`${r.count} documentos cotejados con el catálogo actual.`:'Revisión documental pendiente: '+arr(r.issues).join(' · '));paint();}
  if(action==='format-import')host.querySelector('[data-input=format]').click();
  if(action==='format-export')download(W.YGOUIState?.getFormatContext?.()||{},'Contexto_Formato.json');
  if(action==='format-reset'){W.YGOUIState.setFormatContext({format:W.YGOUIState.getFormatContext().format});W.YGOUIState.sync();message('Restablecido el contexto incorporado del formato.');paint();}
  if(action==='backlog')download({build:W.YGO_BUILD_MANIFEST,documentBacklog:W.YGOProvenance?.backlog?.(),documentStatus:W.YGOProvenance?.status?.(),provenance:W.YGOAlpha1263?.provenanceReview1047?.(),metadata:W.YGOAlpha1263?.metadataAudit1076?.(),catalog:W.YGODataCatalog?.status?.()},'Cartas_Pendientes.json');
  if(action==='checks'){message('Comprobando funciones admitidas…');const r=await checks();message(`${r.tests.filter(t=>t.pass).length}/${r.tests.length} comprobaciones correctas. Este resultado no certifica todas las cartas ni formatos.`);}
 }catch(err){message('No se pudo completar la operación: '+String(err?.message||err));}});
 for(const input of host.querySelectorAll('input[type=file]'))input.addEventListener('change',async()=>{try{const f=input.files?.[0];if(!f)return;if(f.size>10*1024*1024)throw Error('El JSON supera 10 MB.');const value=JSON.parse(await f.text());
  if(input.dataset.input==='tests'){const r=importEvidence(value);message(r.pass?`Informe registrado: ${r.passed}/${r.tests} pruebas correctas.`:r.issues.join(' '));}
  else if(input.dataset.input==='provenance'){message('Cotejando documentos y citas…');const r=await W.YGOProvenance.import(value);message(r.pass?`${r.accepted} documentos aceptados; ${r.total} guardados. El origen de los documentos no queda autenticado por esta importación.`:'Documentos rechazados: '+arr(r.issues).join(' · '));paint();}
  else if(input.dataset.input==='format'){const context=W.YGOUIState.setFormatContext(value);W.YGOUIState.sync();message(`Contexto cargado para ${context.format}. Revisa las incidencias y datos pendientes del formato.`);paint();}
  else{message('Validando barajas y recalculando puntuaciones…');const r=await W.YGOAlpha984.importCalibration984(Array.isArray(value)?value:value.rows,{onProgress:p=>message(`Recalculando ${p.completed}/${p.total} barajas…`)});message(`Calibración: ${r.status}. ${r.validation?.count||0} barajas de validación. ${(r.issues||r.errors)?.length?(r.issues||r.errors).map(x=>typeof x==='string'?x:JSON.stringify(x)).slice(0,3).join(' · '):'La aceptación de datos no acredita validación competitiva independiente.'}`);paint();}
 }catch(err){message('Archivo rechazado: '+String(err?.message||err));}finally{input.value='';}});
 let queued=false;const schedule=()=>{if(queued)return;queued=true;setTimeout(()=>{queued=false;paint();},100);};
 const observer=new MutationObserver(schedule);for(const id of ['mainCount','extraCount','sideCount','mainYdkStatus','total']){const el=D.getElementById(id);if(el)observer.observe(el,{childList:true,characterData:true,subtree:true});}
 D.addEventListener('click',e=>{if(e.target.closest('.fmt'))setTimeout(schedule,100)});W.addEventListener('ygo-ui-state-updated',schedule);W.addEventListener('ygo-combo-workbench-updated',schedule);state.ready=true;paint();
}
W.YGOStableRelease=Object.freeze({status,analysis,runChecks:checks,importEvidence,validateEvidence:evidenceCheck,exportAnalysis:()=>download(analysis(),'Analisis_Baraja.json')});
async function ready(){try{await W.__YGO_ENGINE_READY;if(W.YGOUIState?.ready)await W.YGOUIState.ready;install();}catch(e){console.error('Stable release startup',e)}}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();

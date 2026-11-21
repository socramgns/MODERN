/* Read-only diagnostics of the shipped technical catalogue. Name candidates
 * require review and never replace a passcode, card or deck entry. */
(()=>{'use strict';
const W=window,D=typeof document==='object'?document:null;
const clone=x=>structuredClone(x),arr=x=>Array.isArray(x)?x:[];
const normalize=x=>String(x||'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const VERSION='ygo-data-quality/v1',PAGE_SIZE=50;
let snapshot=null,lastError=null,mounted=false,page=0,summary,body,status,filter,kind,previous,next;
const sourceFiles=new Map(),namesByPrimary=new Map();
function classification(row){
 const source=String(row.source||''),name=String(row.name||'');
 if(row.typeBits&0x4000)return'NON_DECK_TOKEN_OR_PLACEHOLDER';
 if(/deckmaster|placeholder/i.test(source+' '+name))return'NONSTANDARD_DATABASE_ASSET';
 if(/unofficial/i.test(source))return'EXCLUDED_UNOFFICIAL_LEGACY';
 if(/skills/i.test(source))return'SEPARATE_SKILL_ASSET';
 if(/prerelease/i.test(source))return'OBSOLETE_PRERELEASE_PASSCODE_REVIEW';
 return'PRIMARY_SOURCE_IDENTITY_REVIEW';
}
function technicalSource(row){
 const pinned=sourceFiles.get(row.source),matched=!!pinned&&!snapshot.legacyIds.has(row.id);
 return{declaredFile:row.source,matchedToPinnedTechnicalSource:matched,
  declarationScope:matched?'PINNED_SECONDARY_TECHNICAL_SOURCE':'PRESERVED_LEGACY_DECLARATION_ONLY',
  pinned:matched?{file:pinned.file,url:pinned.url,sha256:pinned.sha256,commit:pinned.commit||snapshot.manifest.sourceCommit}:null,
  officialIdentityCertified:false};
}
function currentContext(){return{format:String(W.YGOAlpha973?.activeFormatKey?.()||W.__YGO_ACTIVE_BAN_KEY||W.YGOUIState?.last?.format||'tcg').toLowerCase(),
 formatContextVersion:W.YGOUIState?.contextVersion??null,formatContext:clone(W.YGOUIState?.getFormatContext?.()||{format:'tcg'})};}
function report(){
 if(!snapshot)return{schema:VERSION,pass:false,status:'CATALOGUE_NOT_READY',issues:lastError?[lastError]:[],counts:null,mutatesDeck:false,changesApplied:false};
 const active=arr(W.CARD_CATALOG),ids=new Set(),invalid=[];
 for(const card of active){const id=Number(card?.id??card?.cardId);if(!Number.isSafeInteger(id)||id<=0||ids.has(id))invalid.push(id);else ids.add(id);}
 const absent=snapshot.rows.filter(row=>!ids.has(row.id)).map(row=>row.id),additional=[...ids].filter(id=>!snapshot.byId.has(id));
 const inventoryMatches=active.length===snapshot.rows.length&&!invalid.length&&!absent.length&&!additional.length;
 const buildCurrent=(W.YGO_BUILD_MANIFEST?.buildId??null)===snapshot.buildId&&String(W.YGO_CATALOG_MANIFEST?.cardsSha256||'')===snapshot.catalogHash;
 const classifications={};for(const row of snapshot.unresolved)classifications[row.classification]=(classifications[row.classification]||0)+1;
 return{schema:VERSION,pass:buildCurrent&&inventoryMatches,status:!buildCurrent?'STALE_BUILD_CONTEXT':inventoryMatches?'TECHNICAL_CATALOGUE_DIAGNOSTIC':'ACTIVE_CATALOGUE_INVENTORY_MISMATCH',
  buildId:snapshot.buildId,catalogSha256:snapshot.catalogHash,sourceCommit:snapshot.manifest.sourceCommit,context:currentContext(),
  counts:{catalogueRecords:snapshot.rows.length,activeCatalogueRecords:active.length,activeUniquePasscodes:ids.size,
   technicalSourceMatched:snapshot.matchedCount,unresolvedIdentities:snapshot.unresolved.length,unknownMonsterStats:snapshot.unknown.length,
   migrationProposals:snapshot.proposals.length,incidentEntries:snapshot.unresolved.length+snapshot.unknown.length+snapshot.proposals.length},
  activeInventory:{matchesShippedSnapshot:inventoryMatches,invalidOrDuplicateIds:clone(invalid),missingPasscodes:absent,additionalPasscodes:additional},
  sourceSnapshot:{mode:'IMMUTABLE_MINIMUM_COPY_OF_SHIPPED_EMBEDDED_ROWS',technicalAuthority:'SECONDARY_PROJECT_IGNIS_DATABASE',
   sources:clone(snapshot.manifest.sources||[]),catalogueHashReauthenticatedHere:false},
  classifications,unresolvedIdentities:clone(snapshot.unresolved),unknownMonsterStats:clone(snapshot.unknown),migrationProposals:clone(snapshot.proposals),
  migrationPolicy:'EXACT_NORMALIZED_NAME_CANDIDATE_ONLY_NO_PASSCODE_REWRITE',mutatesDeck:false,changesApplied:false,
  officialIdentityCertified:false,officialAvailabilityVerified:false,completeCardRules:false,competitiveCertified:false,
  limitations:['El informe describe el catálogo técnico incorporado; no acredita disponibilidad oficial ni efectos implementados.',
   'Los nombres normalizados generan propuestas para revisión, no equivalencias oficiales de passcodes. No se sustituyen cartas ni se modifica la baraja.',
   'Las estadísticas desconocidas permanecen desconocidas. Cero y los marcadores técnicos conocidos no se confunden con datos ausentes.',
   'Las fuentes heredadas sin cotejo solo conservan su declaración original; no reciben una URL o hash de una fuente distinta.',
   'El inventario activo se contrasta con una copia mínima de las filas incorporadas, sin confiar en objetos de presentación mutables. La puntuación competitiva sigue provisional.']};
}
function buildSnapshot(raw){
 const manifest=clone(W.YGO_CATALOG_MANIFEST||{}),legacyIds=new Set(arr(manifest.unmatchedLegacyRows).map(x=>Number(x.id))),rows=[],byId=new Map();
 if(!Number.isSafeInteger(Number(manifest.cardCount))||raw.length!==Number(manifest.cardCount))throw Error('DATA_QUALITY_EMBEDDED_COUNT_MISMATCH');
 for(const item of raw){
  if(!Array.isArray(item)||!Number.isSafeInteger(Number(item[0]))||Number(item[0])<=0||byId.has(Number(item[0])))throw Error('DATA_QUALITY_EMBEDDED_IDENTITY_INVALID');
  const row=Object.freeze({id:Number(item[0]),name:String(item[1]||item[0]),typeBits:Number(item[3]),source:String(item[6]||''),atk:item[8],def:item[9],packed:item[10]});
  rows.push(row);byId.set(row.id,row);
 }
 sourceFiles.clear();for(const source of arr(manifest.sources))sourceFiles.set(source.file,Object.freeze(clone(source)));
 snapshot={rows:Object.freeze(rows),byId,legacyIds,manifest,buildId:W.YGO_BUILD_MANIFEST?.buildId??null,catalogHash:String(manifest.cardsSha256||''),matchedCount:0,unresolved:[],unknown:[],proposals:[]};
 namesByPrimary.clear();
 for(const row of rows){
  const source=technicalSource(row);if(source.matchedToPinnedTechnicalSource)snapshot.matchedCount++;
  if(source.matchedToPinnedTechnicalSource&&row.source==='cards.cdb'){
   const renamed=manifest.canonicalNames?.[row.id],name=renamed?.passcodeMatched===true&&renamed.source==='cards.cdb'?renamed.canonicalName:row.name,key=normalize(name);
   if(!namesByPrimary.has(key))namesByPrimary.set(key,[]);
   namesByPrimary.get(key).push({id:row.id,name,source:'cards.cdb',sourceCommit:source.pinned.commit,sourceSha256:source.pinned.sha256,alreadyInCatalogue:true});
  }
 }
 const missing=new Map(arr(manifest.unmatchedLegacyRows).map(row=>[Number(row.id),row]));
 for(const row of rows){
  const source=technicalSource(row),base={id:row.id,name:row.name,typeBits:row.typeBits,source};
  if(!source.matchedToPinnedTechnicalSource){
   const entry={...base,kind:'UNRESOLVED_IDENTITY',classification:classification(row),reason:missing.get(row.id)?.reason||'NO_EXACT_PINNED_TECHNICAL_SOURCE_MATCH',preserved:true};
   snapshot.unresolved.push(entry);
   const candidates=arr(namesByPrimary.get(normalize(row.name))).filter(x=>x.id!==row.id).sort((a,b)=>a.id-b.id);
   if(candidates.length)snapshot.proposals.push({...base,kind:'MIGRATION_PROPOSAL',reason:'EXACT_NORMALIZED_NAME_REQUIRES_IDENTITY_REVIEW',candidates:clone(candidates),policy:'REVIEW_ONLY_NO_PASSCODE_REWRITE',applied:false});
  }
  if(row.typeBits&1){
   const fields=[['atk',row.atk],[(row.typeBits&0x4000000)?'linkMarkers':'def',row.def],['packedLevel',row.packed]],missingFields=fields.filter(([,value])=>!Number.isFinite(value)).map(([name])=>name);
   if(missingFields.length)snapshot.unknown.push({...base,kind:'UNKNOWN_MONSTER_STATS',reason:'SHIPPED_MONSTER_STATS_ARE_INCOMPLETE',missingFields});
  }
 }
 for(const key of ['unresolved','unknown','proposals'])snapshot[key].sort((a,b)=>a.id-b.id);
}
// Review decisions are provenance-bound notes. They never resolve an identity,
// fill a statistic, promote a name candidate, or alter the active deck.
const REVIEW_SCHEMA='ygo-catalogue-review-ledger/v1',reviewDecisions=new Map();
const decisionLabels={UNREVIEWED:'Sin decisión registrada',PRESERVE_UNRESOLVED:'Conservar como no resuelto',REQUEST_IDENTITY_EVIDENCE:'Solicitar prueba de identidad',REQUEST_STATISTICS_EVIDENCE:'Solicitar estadísticas de la identidad exacta',CANDIDATE_REQUIRES_IDENTITY_PROOF:'Candidato pendiente de demostrar equivalencia',RECOMMEND_EXCLUSION:'Recomendar exclusión del análisis causal'};
function reviewPlain(value,depth=0){
 if(depth>20)throw Error('REVIEW_JSON_DEPTH');
 if(value===null||typeof value==='boolean'||typeof value==='string')return value;
 if(typeof value==='number'){if(!Number.isFinite(value))throw Error('REVIEW_NONFINITE_NUMBER');return value;}
 if(Array.isArray(value)){if(value.length>5000||Object.keys(value).length!==value.length)throw Error('REVIEW_ARRAY_INVALID');return value.map(x=>reviewPlain(x,depth+1));}
 if(!value||typeof value!=='object'||Object.prototype.toString.call(value)!=='[object Object]')throw Error('REVIEW_JSON_REQUIRED');
 const out={};for(const key of Object.keys(value).sort()){if(['__proto__','prototype','constructor'].includes(key))throw Error('REVIEW_RESERVED_KEY');const d=Object.getOwnPropertyDescriptor(value,key);if(d.get||d.set)throw Error('REVIEW_EXECUTABLE_PROPERTY');out[key]=reviewPlain(d.value,depth+1);}return out;
}
const reviewSame=(a,b)=>JSON.stringify(reviewPlain(a))===JSON.stringify(reviewPlain(b));
function reviewBytes(value){let n=0;for(const char of String(value)){const c=char.codePointAt(0);n+=c<128?1:c<2048?2:c<65536?3:4;}return n;}
function reviewRecords(){
 if(!snapshot)throw Error('CATALOGUE_NOT_READY');
 return[...snapshot.unresolved,...snapshot.unknown,...snapshot.proposals].map(row=>({key:row.kind+':'+row.id,kind:row.kind,id:row.id,name:row.name,classification:row.classification||null,missingFields:clone(row.missingFields||[]),candidateIds:arr(row.candidates).map(x=>x.id),source:clone(row.source)})).sort((a,b)=>a.key.localeCompare(b.key));
}
function reviewBinding(){const r=report();if(!r.pass)throw Error('REVIEW_STALE_CATALOGUE');return{buildId:r.buildId,catalogSha256:r.catalogSha256,sourceCommit:r.sourceCommit};}
function dataEvidenceRequest(){
 const binding=reviewBinding(),ids=new Set(snapshot.unresolved.map(row=>row.id));
 const records=snapshot.rows.filter(row=>ids.has(row.id)).map(row=>({id:row.id,name:row.name,typeBits:row.typeBits,declaredLegacySource:row.source,
  originalStatistics:{atk:row.atk??null,defOrLinkMarkers:row.def??null,packedLevel:row.packed??null},
  missingFields:clone(snapshot.unknown.find(x=>x.id===row.id)?.missingFields||[]),candidateIds:clone(snapshot.proposals.find(x=>x.id===row.id)?.candidates.map(x=>x.id)||[])})).sort((a,b)=>a.id-b.id);
 return{schema:'ygo-exact-id-evidence-request/v1',binding,records,counts:{identities:records.length,unknownMonsterStats:snapshot.unknown.length,migrationProposals:snapshot.proposals.length},
  requiredMatch:'ORIGINAL_PASSCODE_AND_CARD_TYPE_IN_HASH_VERIFIED_ORIGINAL_SOURCE_BYTES',
  policy:'REVIEW_PACKAGE_BEFORE_EXPLICIT_DETACHED_COPY_NO_NAME_MAPPING',sourceFingerprints:clone(snapshot.manifest.sources||[]),
  originalCatalogueChanged:false,activeDeckChanged:false,officialIdentityCertified:false,criteriaClosed:[],
  limitations:['La solicitud conserva los passcodes y los valores originales, incluidos cero y los campos desconocidos.',
   'Una coincidencia de nombre no permite transferir estadísticas ni sustituir identidades. La evidencia necesita el passcode exacto.',
   'El flujo de importación verifica bytes, procedencia declarada, tipos y valores antes de preparar una copia separada. No modifica este catálogo ni la baraja.']};
}
function verifyDataEvidenceRequest(value){try{const input=typeof value==='string'?(reviewBytes(value)>2*1024*1024?(()=>{throw Error('REVIEW_TRANSPORT_TOO_LARGE')})():JSON.parse(value)):value;if(!reviewSame(input,dataEvidenceRequest()))throw Error('EVIDENCE_REQUEST_CONTENT_OR_BINDING_MISMATCH');return{pass:true,status:'EVIDENCE_REQUEST_RECOMPUTED',originalCatalogueChanged:false,activeDeckChanged:false,officialIdentityCertified:false};}catch(error){return{pass:false,status:'EVIDENCE_REQUEST_REJECTED',issues:[String(error?.message||error)],previousPreserved:true};}}
function downloadDataEvidenceRequest(){const value=dataEvidenceRequest();if(!D)return value;const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'})),a=node('a');a.href=url;a.download='Solicitud_Evidencia_Passcodes_Exactos.json';D.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);return value;}
function normalizeDecision(value,record){
 const input=reviewPlain(value);if(!input||typeof input!=='object'||Array.isArray(input))throw Error('REVIEW_DECISION_REQUIRED');
 const allowed=['status','reviewer','note','reviewedAt','candidateId','references'];if(Object.keys(input).some(k=>!allowed.includes(k)))throw Error('REVIEW_DECISION_FIELD_UNKNOWN');
 if(!Object.prototype.hasOwnProperty.call(decisionLabels,input.status)||input.status==='UNREVIEWED')throw Error('REVIEW_DECISION_STATUS_INVALID');
 if(typeof input.reviewer!=='string'||!input.reviewer.trim()||input.reviewer.length>120||typeof input.note!=='string'||input.note.trim().length<10||input.note.length>4000)throw Error('REVIEW_DECISION_NOTE_AND_REVIEWER_REQUIRED');
 const stamp=String(input.reviewedAt||'');if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(stamp)||!Number.isFinite(Date.parse(stamp))||new Date(stamp).toISOString().slice(0,19)!==stamp.slice(0,19))throw Error('REVIEW_DECISION_DATE_INVALID');
 if(input.status==='REQUEST_STATISTICS_EVIDENCE'&&record.kind!=='UNKNOWN_MONSTER_STATS')throw Error('REVIEW_STATISTICS_INCIDENT_REQUIRED');
 if(input.status==='CANDIDATE_REQUIRES_IDENTITY_PROOF'&&record.kind!=='MIGRATION_PROPOSAL')throw Error('REVIEW_MIGRATION_PROPOSAL_REQUIRED');
 let candidateId=null;if(input.candidateId!==undefined&&input.candidateId!==null){if(!Number.isSafeInteger(input.candidateId)||!record.candidateIds.includes(input.candidateId))throw Error('REVIEW_CANDIDATE_NOT_PROPOSED');candidateId=input.candidateId;}
 if(input.status==='CANDIDATE_REQUIRES_IDENTITY_PROOF'&&candidateId===null)throw Error('REVIEW_CANDIDATE_REQUIRED');
 const references=arr(input.references);if(input.references!==undefined&&!Array.isArray(input.references)||references.length>8)throw Error('REVIEW_REFERENCES_INVALID');
 const cleaned=references.map(ref=>{if(!ref||typeof ref!=='object'||Array.isArray(ref)||Object.keys(ref).some(k=>!['url','title','sha256','verification'].includes(k))||typeof ref.url!=='string'||!/^https:\/\/[^\s/?#]+(?:[/?#][^\s]*)?$/.test(ref.url)||ref.url.length>2048||typeof ref.title!=='string'||!ref.title.trim()||ref.title.length>240)throw Error('REVIEW_REFERENCE_INVALID');if(ref.verification!==undefined&&ref.verification!=='USER_DECLARED_UNVERIFIED')throw Error('REVIEW_REFERENCE_VERIFICATION_INVALID');if(ref.sha256!==undefined&&!/^[a-f0-9]{64}$/.test(ref.sha256))throw Error('REVIEW_REFERENCE_HASH_INVALID');return{url:ref.url,title:ref.title,...(ref.sha256?{sha256:ref.sha256}:{}),verification:'USER_DECLARED_UNVERIFIED'};});
 return{status:input.status,reviewer:input.reviewer.trim(),note:input.note.trim(),reviewedAt:stamp,candidateId,references:cleaned};
}
function reviewLedger(decisions=reviewDecisions){
 const binding=reviewBinding(),records=reviewRecords().map(row=>({...row,decision:decisions.has(row.key)?clone(decisions.get(row.key)):{status:'UNREVIEWED'}})),reviewed=records.filter(x=>x.decision.status!=='UNREVIEWED').length;
 return{schema:REVIEW_SCHEMA,binding,records,counts:{incidents:records.length,decisionsRecorded:reviewed,unreviewed:records.length-reviewed,identitiesResolved:0,statisticsFilled:0,migrationsApplied:0},sourceEvidence:{role:'PINNED_SECONDARY_TECHNICAL_CDB_BASELINE',sources:clone(snapshot.manifest.sources||[]),officialIdentityAuthenticated:false,officialAvailabilityVerified:false},policy:'PROVENANCE_BOUND_REVIEW_NOT_CATALOGUE_MIGRATION',criteriaClosed:[],changesApplied:false,activeDeckChanged:false,officialIdentityCertified:false,currentListProven:false,competitiveCertified:false,limitations:['Una decisión registrada es una nota de revisión, no una identidad oficial demostrada ni una corrección de estadísticas.','Las referencias importadas son declaraciones no autenticadas; no se descargan ni se ejecutan.','El expediente conserva todas las incidencias y sus candidatos originales; ninguna selección modifica el catálogo o la baraja.']};
}
function recordReviewDecision(key,value){const record=reviewRecords().find(x=>x.key===key);if(!record)throw Error('REVIEW_INCIDENT_UNKNOWN');reviewBinding();const normalized=normalizeDecision(value,record);const staged=new Map(reviewDecisions);staged.set(key,normalized);const ledger=reviewLedger(staged);if(reviewBytes(JSON.stringify(ledger,null,2))>2*1024*1024)throw Error('REVIEW_TRANSPORT_TOO_LARGE');reviewDecisions.set(key,normalized);paintReviewLedger();return ledger;}
function resetReviewDecision(key){if(!reviewRecords().some(x=>x.key===key))throw Error('REVIEW_INCIDENT_UNKNOWN');reviewBinding();reviewDecisions.delete(key);paintReviewLedger();return reviewLedger();}
function checkedLedger(value){
 const input=typeof value==='string'?(reviewBytes(value)>2*1024*1024?(()=>{throw Error('REVIEW_TRANSPORT_TOO_LARGE')})():JSON.parse(value)):value,raw=reviewPlain(input),baseline=reviewRecords(),decisions=new Map();
 if(raw?.schema!==REVIEW_SCHEMA||!Array.isArray(raw.records)||raw.records.length!==baseline.length)throw Error('REVIEW_LEDGER_SHAPE_INVALID');
 const byKey=new Map(baseline.map(x=>[x.key,x]));for(const row of raw.records){const record=byKey.get(row?.key);if(!record||decisions.has(row.key))throw Error('REVIEW_LEDGER_INCIDENT_INVALID');if(row.decision?.status!=='UNREVIEWED')decisions.set(row.key,normalizeDecision(row.decision,record));}
 const expected=reviewLedger(decisions);if(reviewBytes(JSON.stringify(expected,null,2))>2*1024*1024)throw Error('REVIEW_TRANSPORT_TOO_LARGE');if(!reviewSame(raw,expected))throw Error('REVIEW_LEDGER_CONTENT_OR_BINDING_MISMATCH');return{expected,decisions};
}
function verifyReviewLedger(value){try{const r=checkedLedger(value);return{pass:true,status:'REVIEW_LEDGER_RECOMPUTED',incidents:r.expected.records.length,decisionsRecorded:r.decisions.size,officialIdentityCertified:false,changesApplied:false};}catch(error){return{pass:false,status:'REVIEW_LEDGER_REJECTED',issues:[String(error?.message||error)],previousPreserved:true};}}
function importReviewLedger(value){const r=checkedLedger(value);reviewDecisions.clear();for(const [key,decision]of r.decisions)reviewDecisions.set(key,decision);paintReviewLedger();return r.expected;}
function downloadReviewLedger(){const value=reviewLedger();if(!D)return value;const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'})),a=node('a');a.href=url;a.download='Revision_Datos_Catalogo.json';D.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);return value;}
function paintReviewLedger(){if(!mounted||!D?.getElementById('ygoDataReviewSummary'))return;const ledger=reviewLedger(),selected=D.getElementById('ygoDataReviewIncident').value,row=ledger.records.find(x=>x.key===selected);D.getElementById('ygoDataReviewSummary').textContent=ledger.counts.decisionsRecorded+' decisiones registradas de '+ledger.counts.incidents+' incidencias. Las identidades y estadísticas pendientes se conservan.';const candidate=D.getElementById('ygoDataReviewCandidate');candidate.replaceChildren(node('option','Sin candidato'));candidate.firstChild.value='';for(const id of row?.candidateIds||[]){const name=snapshot.proposals.find(x=>x.id===row.id)?.candidates.find(x=>x.id===id)?.name,option=node('option',(name?name+' · ':'')+id);option.value=String(id);candidate.append(option);}const decision=row?.decision;if(decision&&decision.status!=='UNREVIEWED'){D.getElementById('ygoDataReviewStatus').value=decision.status;D.getElementById('ygoDataReviewReviewer').value=decision.reviewer;D.getElementById('ygoDataReviewNote').value=decision.note;candidate.value=decision.candidateId===null?'':String(decision.candidateId);}else{D.getElementById('ygoDataReviewStatus').value='PRESERVE_UNRESOLVED';D.getElementById('ygoDataReviewNote').value='';}candidate.disabled=!row?.candidateIds.length;W.YGOAccessibility?.registerDisabledReason?.('ygoDataReviewCandidate',()=>candidate.disabled?'La incidencia seleccionada no tiene candidatos técnicos para elegir.':'');}
function mountReviewLedger(section){
 const details=node('details');details.id='ygoDataReviewLedger';details.append(node('summary','Registrar decisiones de revisión sin cambiar cartas'));const text=node('p','El expediente incluye cada incidencia de identidad, estadísticas y propuesta. Exporta el JSON para conservar decisiones y procedencia; importar un expediente no cambia cartas, efectos ni formatos.');details.append(text);const summary=node('p');summary.id='ygoDataReviewSummary';summary.setAttribute('role','status');summary.setAttribute('aria-live','polite');details.append(summary);const controls=node('div');controls.className='ygo-data-quality-controls';
 const field=(title,id,tag='input')=>{const label=node('label',title),input=node(tag);input.id=id;label.append(input);controls.append(label);return input;};
 const incident=field('Incidencia','ygoDataReviewIncident','select');for(const row of reviewRecords()){const option=node('option',row.name+' · '+row.id+' · '+labels[row.kind]);option.value=row.key;incident.append(option);}
 const decision=field('Decisión','ygoDataReviewStatus','select');for(const [value,label]of Object.entries(decisionLabels).filter(([v])=>v!=='UNREVIEWED')){const option=node('option',label);option.value=value;decision.append(option);}field('Candidato técnico (si corresponde)','ygoDataReviewCandidate','select');const reviewer=field('Persona que registra la revisión','ygoDataReviewReviewer');reviewer.maxLength=120;reviewer.required=true;const note=field('Motivo y evidencia pendiente','ygoDataReviewNote','textarea');note.maxLength=4000;note.minLength=10;note.required=true;note.rows=3;
 const save=node('button','Registrar decisión');save.type='button';save.id='ygoDataReviewSave';const clear=node('button','Borrar decisión seleccionada');clear.type='button';clear.id='ygoDataReviewClear';const exportButton=node('button','Exportar expediente JSON');exportButton.type='button';exportButton.id='ygoDataReviewExport';const evidenceButton=node('button','Exportar solicitud de evidencia exacta');evidenceButton.type='button';evidenceButton.id='ygoDataEvidenceRequestExport';const file=field('Importar expediente JSON','ygoDataReviewFile');file.type='file';file.accept='.json,application/json';controls.append(save,clear,exportButton,evidenceButton);details.append(controls);const message=node('p');message.id='ygoDataReviewMessage';message.setAttribute('role','status');message.setAttribute('aria-live','polite');details.append(message);section.append(details);
 const errorText=error=>({REVIEW_DECISION_NOTE_AND_REVIEWER_REQUIRED:'Escribe quién registra la revisión y un motivo de al menos diez caracteres.',REVIEW_CANDIDATE_REQUIRED:'Selecciona un candidato de esta propuesta.',REVIEW_MIGRATION_PROPOSAL_REQUIRED:'Esta decisión necesita una incidencia de propuesta de identidad.',REVIEW_STATISTICS_INCIDENT_REQUIRED:'Selecciona una incidencia de estadísticas desconocidas.',REVIEW_STALE_CATALOGUE:'El catálogo o la compilación cambió. Recarga el HTML y revisa el expediente.',REVIEW_LEDGER_CONTENT_OR_BINDING_MISMATCH:'El expediente no coincide con los datos y la compilación actuales.',REVIEW_TRANSPORT_TOO_LARGE:'El expediente supera el límite de 2 MB.'})[String(error?.message||error)]||'No se pudo completar la revisión. Comprueba el JSON, las referencias y la incidencia seleccionada.';
 const safe=fn=>()=>{try{fn();message.textContent='Operación completada; catálogo y baraja conservados.';}catch(error){message.textContent=errorText(error);}};
 evidenceButton.onclick=safe(downloadDataEvidenceRequest);
 save.onclick=safe(()=>recordReviewDecision(incident.value,{status:decision.value,reviewer:reviewer.value,note:note.value,reviewedAt:new Date().toISOString(),candidateId:D.getElementById('ygoDataReviewCandidate').value?Number(D.getElementById('ygoDataReviewCandidate').value):null}));clear.onclick=safe(()=>resetReviewDecision(incident.value));exportButton.onclick=safe(downloadReviewLedger);incident.onchange=paintReviewLedger;file.onchange=async()=>{try{const chosen=file.files[0];if(chosen){if(chosen.size>2*1024*1024)throw Error('REVIEW_TRANSPORT_TOO_LARGE');importReviewLedger(await chosen.text());message.textContent='Expediente validado e importado; las cartas se conservaron.';}}catch(error){message.textContent=errorText(error);}finally{file.value='';}};
}
const labels={UNRESOLVED_IDENTITY:'Identidad sin cotejo técnico',UNKNOWN_MONSTER_STATS:'Estadísticas desconocidas',MIGRATION_PROPOSAL:'Propuesta de identidad para revisar'};
const node=(tag,text)=>{const el=D.createElement(tag);if(text!==undefined)el.textContent=String(text);return el;};
function paint(reset=false){
 if(!mounted)return report();if(reset)page=0;const data=report();body.replaceChildren();
 if(!data.counts){summary.textContent='El catálogo aún no está disponible.';status.textContent=lastError||'';return data;}
 const c=data.counts;summary.textContent=`${c.catalogueRecords.toLocaleString('es')} registros incorporados · ${c.technicalSourceMatched.toLocaleString('es')} cotejados con fuentes técnicas fijadas · ${c.unresolvedIdentities} identidades sin cotejo · ${c.unknownMonsterStats} monstruos con estadísticas desconocidas · ${c.migrationProposals} propuestas para revisión.`;
 const query=filter.value.trim().toLocaleLowerCase(),selection=kind.value,all=[...data.unresolvedIdentities,...data.unknownMonsterStats,...data.migrationProposals],filtered=all.filter(row=>(selection==='all'||row.kind===selection)&&(!query||[row.id,row.name,row.source.declaredFile,...arr(row.candidates).flatMap(x=>[x.id,x.name])].join(' ').toLocaleLowerCase().includes(query)));
 page=Math.max(0,Math.min(page,Math.max(0,Math.ceil(filtered.length/PAGE_SIZE)-1)));const start=page*PAGE_SIZE;
 for(const row of filtered.slice(start,start+PAGE_SIZE)){
  const tr=node('tr'),identity=node('td',row.name+' ('+row.id+')'),issue=node('td',labels[row.kind]),origin=node('td',row.source.matchedToPinnedTechnicalSource?row.source.declaredFile+' · fuente técnica fijada':row.source.declaredFile+' · declaración heredada sin cotejo');
  if(row.kind==='MIGRATION_PROPOSAL')issue.append(node('p','Revisar: '+row.candidates.map(x=>x.name+' ('+x.id+')').join(' · ')+'. No aplicada.'));
  if(row.kind==='UNKNOWN_MONSTER_STATS')issue.append(node('p','Faltan: '+row.missingFields.map(x=>({atk:'ATK',def:'DEF',linkMarkers:'marcadores Link',packedLevel:'nivel/rango/Link'}[x])).join(', ')+'.'));
  tr.append(identity,issue,origin);body.append(tr);
 }
 previous.disabled=page===0;next.disabled=start+PAGE_SIZE>=filtered.length;
 status.textContent=`${filtered.length?start+1:0}–${Math.min(start+PAGE_SIZE,filtered.length)} de ${filtered.length} incidencias filtradas. Una carta puede tener varias incidencias. `+(data.pass?'El inventario activo coincide con el incorporado.':'El contexto o el inventario activo cambió; revisa el informe JSON.');
 return data;
}
function downloadReport(){const data=report();if(!D)return data;const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=node('a');a.href=url;a.download='Calidad_Datos_YuGiOh.json';D.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);return data;}
function mount(){
 if(mounted)return;const section=node('section');section.id='ygoDataQuality';section.className='box';section.setAttribute('aria-label','Calidad de los datos');section.append(node('h3','Calidad de los datos'),node('p','Revisa las incidencias del catálogo incorporado. El cotejo técnico, la disponibilidad oficial y los efectos implementados son comprobaciones diferentes. Las propuestas no cambian tu baraja.'));
 summary=node('p');summary.id='ygoDataQualitySummary';summary.setAttribute('role','status');summary.setAttribute('aria-live','polite');section.append(summary);
 const details=node('details');details.append(node('summary','Revisar incidencias y exportar informe'));const controls=node('div');controls.className='ygo-data-quality-controls';
 const filterLabel=node('label','Buscar carta, passcode o fuente ');filter=node('input');filter.id='ygoDataQualityFilter';filter.type='search';filter.placeholder='Nombre o passcode';filterLabel.append(filter);
 const kindLabel=node('label','Incidencia ');kind=node('select');kind.id='ygoDataQualityKind';for(const [value,label]of [['all','Todas'],...Object.entries(labels)]){const option=node('option',label);option.value=value;kind.append(option);}kindLabel.append(kind);
 const exportButton=node('button','Exportar calidad de datos JSON');exportButton.id='ygoDataQualityExport';exportButton.type='button';exportButton.onclick=downloadReport;
 const refreshButton=node('button','Actualizar diagnóstico');refreshButton.id='ygoDataQualityRefresh';refreshButton.type='button';refreshButton.onclick=()=>paint(false);controls.append(filterLabel,kindLabel,exportButton,refreshButton);details.append(controls);
 const container=node('div');container.className='ygo-data-quality-table';container.tabIndex=0;container.setAttribute('role','region');container.setAttribute('aria-label','Incidencias del catálogo');const table=node('table'),head=node('thead'),header=node('tr');for(const title of ['Carta y passcode','Revisión pendiente','Procedencia']){const th=node('th',title);th.scope='col';header.append(th);}head.append(header);body=node('tbody');body.id='ygoDataQualityRows';table.append(head,body);container.append(table);details.append(container);
 const paging=node('div');paging.className='ygo-data-quality-controls';previous=node('button','Página anterior');previous.type='button';previous.id='ygoDataQualityPrev';previous.onclick=()=>{page--;paint();};next=node('button','Página siguiente');next.type='button';next.id='ygoDataQualityNext';next.onclick=()=>{page++;paint();};paging.append(previous,next);details.append(paging);status=node('p');status.id='ygoDataQualityStatus';status.setAttribute('role','status');status.setAttribute('aria-live','polite');details.append(status,node('p','Las estadísticas desconocidas no se rellenan por aproximación y las propuestas necesitan revisión de identidad. La puntuación competitiva permanece provisional.'));section.append(details);
 const style=node('style');style.textContent='#ygoDataQuality{padding:14px;margin:12px 0;font-size:13px;line-height:1.5;min-width:0;max-width:100%}#ygoDataQuality h3{font-size:17px;color:#7ee7ff}.ygo-data-quality-controls{display:flex;flex-wrap:wrap;gap:10px;margin:10px 0}.ygo-data-quality-controls label{display:flex;flex:1 1 170px;min-width:0;flex-direction:column;gap:4px}.ygo-data-quality-controls input,.ygo-data-quality-controls select,.ygo-data-quality-controls textarea,.ygo-data-quality-controls button{min-height:44px;max-width:100%;min-width:0;padding:7px;color:#eaf7ff;background:#071d39;border:1px solid #376786;border-radius:5px}.ygo-data-quality-table{max-width:100%;overflow:auto}#ygoDataQuality table{width:100%;table-layout:fixed;border-collapse:collapse;text-align:left}#ygoDataQuality th,#ygoDataQuality td{padding:7px;border-bottom:1px solid #31516e;vertical-align:top;overflow-wrap:anywhere}#ygoDataQuality td p{margin:6px 0}#ygoDataQuality summary{cursor:pointer;min-height:44px;align-content:center}#ygoDataQuality :focus-visible{outline:3px solid #ffdb79;outline-offset:2px}';D.head.append(style);
 const host=D.getElementById('ygoCardCoverage')||D.getElementById('ygoFormatEditor')||D.getElementById('ygoStableRelease');if(host)host.after(section);else(D.querySelector('.app')||D.body).prepend(section);
 filter.addEventListener('input',()=>paint(true));kind.addEventListener('change',()=>paint(true));W.addEventListener('ygo-catalog-updated',()=>paint(false));W.addEventListener('ygo-ui-state-updated',()=>paint(false));mounted=true;mountReviewLedger(section);paint();paintReviewLedger();
}
async function initialize(){try{await W.__YGO_ENGINE_READY;await W.YGODataCatalog?.ready;const raw=await W.getEmbeddedDB?.();if(!Array.isArray(raw)||!raw.length)throw Error('DATA_QUALITY_EMBEDDED_CATALOGUE_REQUIRED');buildSnapshot(raw);if(D){await W.YGOUIState?.ready;await W.YGOCardCoverage?.ready;mount();}return true;}catch(error){lastError=String(error?.message||error);if(D)console.error('DATA_QUALITY_INIT',error);return false;}}
const ready=Promise.resolve().then(initialize);
W.YGODataQuality=Object.freeze({version:VERSION,ready,report,exportReport:report,downloadReport,refresh:()=>paint(false),reviewLedger,recordReviewDecision,resetReviewDecision,verifyReviewLedger,importReviewLedger,downloadReviewLedger,dataEvidenceRequest,verifyDataEvidenceRequest,downloadDataEvidenceRequest});
})();

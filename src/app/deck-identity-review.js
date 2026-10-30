/* User-reviewed identity copies. Candidates are technical name proposals,
 * never an automatic migration, official identity decision or active-deck edit. */
(()=>{'use strict';
const W=window,D=typeof document==='object'?document:null;
const VERSION='ygo-deck-identity-review/v1',SOURCE='ygo-identity-review-source/v1',COPY='ygo-reviewed-deck-copy/v1';
const ZONES=['main','extra','side','skills'],META=['legend','isLegend','legendMetadataVerified','speedDuelPrintVerified','releaseDates','tcgReleaseDate','constructionEvidence'];
const clone=x=>structuredClone(x),own=(x,k)=>Object.prototype.hasOwnProperty.call(x,k),arr=x=>Array.isArray(x)?x:[];
const TRANSPORT_MAX=4*1024*1024;
function utf8Bytes(value){let size=0;for(const char of value){const n=char.codePointAt(0);size+=n<0x80?1:n<0x800?2:n<0x10000?3:4;}return size;}
let initialized=false,lastError=null,catalog=new Map(),baseline=null,mounted=false,uiSource=null,uiSelections=[],preview=null;
function fail(code,message){const error=Error(message);error.code=code;throw error;}
function plain(value,label='dato',depth=0){
 if(depth>40)fail('INVALID_JSON','El '+label+' supera la profundidad permitida.');
 if(value===null||typeof value==='boolean'||typeof value==='string')return value;
 if(typeof value==='number'){if(!Number.isFinite(value))fail('INVALID_JSON','El '+label+' contiene un número no finito.');return value;}
 if(Array.isArray(value)){for(let i=0;i<value.length;i++)if(!own(value,i))fail('INVALID_JSON','El '+label+' contiene una lista incompleta.');return value.map(x=>plain(x,label,depth+1));}
 if(!value||typeof value!=='object'||Object.prototype.toString.call(value)!=='[object Object]')fail('INVALID_JSON','El '+label+' debe contener datos JSON.');
 const out={};for(const key of Object.keys(value).sort()){if(['__proto__','prototype','constructor'].includes(key))fail('INVALID_JSON','El '+label+' contiene una clave reservada.');const property=Object.getOwnPropertyDescriptor(value,key);if(property.get||property.set)fail('INVALID_JSON','El '+label+' no admite propiedades ejecutables.');out[key]=plain(value[key],label,depth+1);}return out;
}
const stable=x=>JSON.stringify(plain(x));
const same=(a,b)=>stable(a)===stable(b);
function integer(value,label,max=999999999999){if(typeof value!=='number'||!Number.isSafeInteger(value)||value<1||value>max)fail('INVALID_INPUT',label+' debe ser un entero positivo.');return value;}
function object(value,label){if(!value||typeof value!=='object'||Array.isArray(value))fail('INVALID_INPUT',label+' debe ser un objeto.');return value;}
function quality(){
 if(!initialized)fail('NOT_READY',lastError||'La revisión de identidades todavía no está disponible.');
 const q=W.YGODataQuality.report();if(!q.pass||q.buildId!==baseline.buildId||q.catalogSha256!==baseline.catalogSha256)fail('STALE_CATALOGUE','Cambió la compilación o el inventario del catálogo. Recarga el archivo antes de revisar identidades.');return q;
}
function binding(){const q=quality();return{buildId:q.buildId,catalogSha256:q.catalogSha256,sourceCommit:q.sourceCommit};}
function formatOf(value){const key=W.YGOFormats?.keyOf?.(value);if(key)return key;const simple=String(value||'').toLowerCase();if(simple==='tcg')return'tcg';fail('UNKNOWN_FORMAT','El formato de la copia no está disponible.');}
function capacity(deck){
 if(W.YGOUIState?.validateSession){W.YGOUIState.validateSession(clone(deck));return;}
 const format=formatOf(deck.fmt),p=W.YGOFormats?.policies?.[format]||{mainMax:60,extraMax:15,sideMax:15,skills:0},c=deck.formatContext;
 let extra=p.extraUnlimited?1000:p.extraMax;if(format==='timeWizard'||extra===null)extra=Number.isSafeInteger(c.extraDeckLimit)&&c.extraDeckLimit>=0?Math.min(1000,c.extraDeckLimit):format==='timeWizard'?1000:(p.extraSafetyMax||15);
 const max={main:p.mainMax,extra,side:Number.isSafeInteger(c.event?.sideMax)&&c.event.sideMax>=0&&c.event.sideMax<=15?c.event.sideMax:p.sideMax,skills:p.skills||0};
 for(const zone of ZONES){if(deck.deckState[zone].length>max[zone]||deck.deckState[zone].reduce((n,r)=>n+r.qty,0)>max[zone])fail('IMPORT_CAPACITY','La zona '+zone+' supera la capacidad de importación del formato.');}
}
function normalizeDeck(value){
 const input=plain(object(value,'La baraja'),'baraja');if(utf8Bytes(JSON.stringify(input))>TRANSPORT_MAX)fail('INPUT_TOO_LARGE','La baraja supera 4 MB de datos UTF-8.');
 const fmt=input.fmt;if(typeof fmt!=='string'||!fmt)fail('INVALID_FORMAT','La baraja debe declarar su formato.');const format=formatOf(fmt),context=plain(object(input.formatContext,'El contexto'),'contexto');
 if(typeof context.format!=='string'||formatOf(context.format)!==format)fail('FORMAT_MISMATCH','El contexto y la baraja deben declarar el mismo formato.');
 const state=object(input.deckState,'Las zonas'),deckState={};if(Object.keys(state).some(z=>!ZONES.includes(z)))fail('UNKNOWN_ZONE','La baraja contiene una zona desconocida.');
 for(const zone of ZONES){const rows=state[zone]??(zone==='skills'?[]:null);if(!Array.isArray(rows))fail('INVALID_ZONE','La zona '+zone+' debe ser una lista.');
  deckState[zone]=rows.map(row=>{object(row,'La carta');if(Object.keys(row).some(k=>!['id','qty',...META].includes(k)))fail('UNSUPPORTED_ROW_FIELD','La copia sólo admite identidad, cantidad y evidencias de construcción reconocidas.');const id=integer(row.id,'El passcode'),qty=integer(row.qty,'La cantidad',60);if(!catalog.has(id))fail('UNKNOWN_IDENTITY','El passcode '+id+' no está en el catálogo incorporado.');const saved={id,qty};for(const field of META)if(own(row,field))saved[field]=clone(row[field]);return saved;});
 }
 const text={};for(const key of ['name','arch','date']){if(input[key]!==undefined&&typeof input[key]!=='string')fail('INVALID_INPUT','El campo '+key+' debe ser texto.');text[key]=input[key]||'';}
 const result={schema:'ygo-format-deck/v1',...text,fmt,formatContext:context,deckState};capacity(result);return result;
}
function captureSource(){
 const bound=binding();let deck;
 if(W.YGOFormatEditor?.export)deck=W.YGOFormatEditor.export();
 else{const context=clone(W.YGOUIState?.getFormatContext?.()||{format:W.__YGO_ACTIVE_BAN_KEY||'tcg'});deck={name:D?.getElementById('name')?.value||'',arch:D?.getElementById('arch')?.value||'',date:D?.getElementById('date')?.value||'',fmt:D?.querySelector('.fmt.active')?.dataset.f||context.format,formatContext:context,deckState:Object.fromEntries(ZONES.map(z=>[z,arr(W.deckState?.[z]).map(r=>{const row={id:Number(r.id??r.cardId),qty:Number(r.qty??1)};for(const field of META)if(r[field]!==undefined)row[field]=clone(r[field]);return row;})]))};}
 deck=normalizeDeck(deck);return{schema:SOURCE,binding:bound,fingerprint:stable(deck),deck};
}
function validateSource(value){
 const s=plain(object(value,'La fuente'),'fuente');if(s.schema!==SOURCE||Object.keys(s).some(k=>!['schema','binding','fingerprint','deck'].includes(k)))fail('INVALID_SOURCE','La fuente de revisión no tiene el esquema esperado.');
 if(!same(s.binding,binding()))fail('STALE_BUILD','La fuente pertenece a otra compilación o catálogo.');const deck=normalizeDeck(s.deck);if(typeof s.fingerprint!=='string'||s.fingerprint!==stable(deck)||!same(s.deck,deck))fail('SOURCE_FINGERPRINT_MISMATCH','La fuente fue modificada después de capturar la baraja.');return{schema:SOURCE,binding:clone(s.binding),fingerprint:s.fingerprint,deck};
}
function proposals(source=captureSource()){
 const s=validateSource(source),q=quality(),present=new Map();for(const zone of ZONES)for(const row of s.deck.deckState[zone]){if(!present.has(row.id))present.set(row.id,{qty:0,zones:{}});const p=present.get(row.id);p.qty+=row.qty;p.zones[zone]=(p.zones[zone]||0)+row.qty;}
 return q.migrationProposals.filter(p=>present.has(p.id)).map(p=>({...clone(p),...clone(present.get(p.id))}));
}
function selected(value,available){
 if(!Array.isArray(value))fail('INVALID_SELECTIONS','Las decisiones deben ser una lista explícita de passcodes.');value=plain(value,'decisiones');const map=new Map();
 for(const choice of value){object(choice,'La decisión');if(Object.keys(choice).length!==2||!own(choice,'fromId')||!own(choice,'toId'))fail('INVALID_SELECTION','Cada decisión debe contener sólo fromId y toId.');const fromId=integer(choice.fromId,'El passcode original'),toId=integer(choice.toId,'El passcode candidato');if(map.has(fromId))fail('DUPLICATE_SELECTION','Hay más de una decisión para el passcode '+fromId+'.');const proposal=available.find(p=>p.id===fromId);if(!proposal)fail('SOURCE_NOT_PROPOSED','El passcode '+fromId+' no tiene una propuesta presente en esta baraja.');const candidate=proposal.candidates.find(c=>c.id===toId);if(!candidate)fail('CANDIDATE_NOT_LISTED','La decisión no es uno de los candidatos técnicos enumerados para '+fromId+'.');map.set(fromId,{fromId,toId,candidate,proposal});}
 return[...map.values()].sort((a,b)=>a.fromId-b.fromId);
}
function zoneCompatible(id,zone){const card=catalog.get(id),bits=card.typeBits,skill=!!(bits&0x8000000),extra=!!(bits&(0x40|0x2000|0x800000|0x4000000));return !(bits&0x4000)&&(zone==='skills'?skill:!skill&&(zone==='side'||zone==='main'&&!extra||zone==='extra'&&extra));}
const counts=deck=>Object.fromEntries(ZONES.map(z=>[z,deck[z].reduce((n,r)=>n+r.qty,0)]));
function family(id){const seen=new Set();let current=id;while(baseline.aliases[current]){if(seen.has(current))fail('AMBIGUOUS_ALIAS','La familia de alias tiene un ciclo y requiere revisión manual.');seen.add(current);current=Number(baseline.aliases[current]);}return current;}
function hydrated(deck){return Object.fromEntries(ZONES.map(z=>[z,deck[z].map(r=>({...clone(catalog.get(r.id)),...clone(r)}))]));}
function audit(deck,context){
 const families=new Map();for(const zone of ['main','extra','side'])for(const row of deck[zone]){const key=family(row.id);families.set(key,(families.get(key)||0)+row.qty);}
 const issues=[...families].filter(([,qty])=>qty>3).map(([canonicalId,qty])=>({reason:'ALIAS_FAMILY_OVER_THREE',canonicalId,qty}));
 for(const zone of ZONES)for(const row of deck[zone])if(!zoneCompatible(row.id,zone))issues.push({reason:'WRONG_DECK_ZONE',id:row.id,zone});
 const formatAudit=W.YGOFormats?.validateDeck?.(hydrated(deck),clone(context))||null;
 return{scope:'DIAGNOSTIC_OF_REVIEWED_COPY_ONLY',zoneCounts:counts(deck),issues,formatAudit:clone(formatAudit),officialLegalityCertified:false,certified:false};
}
function prepare(source,choices){
 const s=validateSource(source),available=proposals(s),decisions=selected(choices,available),byId=new Map(decisions.map(c=>[c.fromId,c])),deck=clone(s.deck),changes=[];
 for(const zone of ZONES){const merged=new Map();for(const row of s.deck.deckState[zone]){const choice=byId.get(row.id);let target=clone(row);
   if(choice){if(!zoneCompatible(choice.toId,zone))fail('ZONE_INCOMPATIBLE','El candidato '+choice.toId+' no pertenece a la zona '+zone+'; la copia no mueve cartas de zona.');target={id:choice.toId,qty:row.qty};changes.push({zone,qty:row.qty,from:{id:row.id,name:choice.proposal.name},to:{id:choice.toId,name:choice.candidate.name},technicalSource:clone(choice.candidate),sourceDeclaration:clone(choice.proposal.source),omittedIdentityEvidence:META.filter(k=>own(row,k))});}
   const prior=merged.get(target.id);if(prior){const a={...prior},b={...target};delete a.qty;delete b.qty;if(!same(a,b))fail('MERGE_EVIDENCE_CONFLICT','Dos entradas del passcode '+target.id+' tienen evidencias diferentes; no se elimina ninguna de forma implícita.');prior.qty+=target.qty;if(prior.qty>60)fail('MERGE_IMPORT_CAPACITY','La cantidad combinada supera el máximo por entrada que admite el importador.');}else merged.set(target.id,target);
  }deck.deckState[zone]=[...merged.values()];}
 capacity(deck);const before=counts(s.deck.deckState),after=counts(deck.deckState);if(!same(before,after))fail('QUANTITY_CONSERVATION_FAILED','La revisión no conserva las cantidades por zona.');
 const decisionList=decisions.map(({fromId,toId})=>({fromId,toId})),review={schema:VERSION,binding:clone(s.binding),source:clone(s),selections:decisionList,changes,beforeCounts:before,afterCounts:after,audit:audit(deck.deckState,deck.formatContext),policy:'EXPLICIT_USER_SELECTION_OF_EXACT_NAME_PROPOSALS_ONLY',sourceIntact:true,changesAppliedToActiveDeck:false,officialIdentityCertified:false,officialAvailabilityVerified:false,officialLegalityCertified:false,competitiveCertified:false,competitiveScoreStatus:'PROVISIONAL_BY_USER_REQUEST',limitations:['Los candidatos proceden de coincidencias técnicas de nombre; la selección del usuario no demuestra equivalencia oficial de passcodes.','La copia conserva cantidades, zonas, formato, contexto y Skills. Las evidencias individuales de un passcode cambiado no se transfieren a otra identidad.','Las incidencias de construcción se conservan como diagnóstico; esta copia no certifica legalidad, disponibilidad, reglas completas ni puntuación competitiva.','El vínculo con la fuente es una comparación de datos y compilación, no una firma digital ni autenticación de autoría.']};
 const result={...deck,schema:COPY,identityReview:review};if(utf8Bytes(JSON.stringify(result,null,2))>TRANSPORT_MAX)fail('COPY_TRANSPORT_TOO_LARGE','La copia con procedencia supera 4 MB de datos UTF-8 y el importador no puede abrirla. Reduce el contexto de la fuente antes de preparar esta copia.');return result;
}
function buildCopy(source,selections){const s=validateSource(source);if(!same(s,captureSource()))fail('STALE_SOURCE','Cambió la baraja o su contexto. Captura la fuente y revisa de nuevo las decisiones.');return clone(prepare(s,selections));}
function verify(value,options={}){
 try{object(options,'Las opciones');if(Object.keys(options).some(k=>k!=='source'))fail('INVALID_OPTIONS','La verificación sólo admite una fuente de comparación.');const report=plain(object(value,'La copia'),'copia'),expectedSource=validateSource(own(options,'source')?options.source:captureSource());if(report.schema!==COPY||!report.identityReview)fail('INVALID_REPORT','El archivo no es una copia revisada.');if(!same(report.identityReview.source,expectedSource))fail('SOURCE_MISMATCH','La copia no corresponde a la fuente de comparación.');const expected=prepare(expectedSource,report.identityReview.selections);if(!same(report,expected))fail('REVIEW_CONTENT_MISMATCH','Las identidades, cantidades, contexto, decisiones o diagnóstico no coinciden con la revisión recalculada.');return{pass:true,status:'REVIEWED_COPY_RECOMPUTED',officialIdentityCertified:false,officialLegalityCertified:false,sourceIntact:true,errors:[]};
 }catch(error){return{pass:false,status:error.code||'INVALID_REVIEWED_COPY',errors:[String(error?.message||error)],officialIdentityCertified:false,officialLegalityCertified:false};}
}
function report(){return preview?clone(preview):null;}
function exportReport(){if(!preview)fail('NO_REVIEWED_COPY','Selecciona al menos una identidad candidata para preparar la copia.');const check=verify(preview);if(!check.pass)fail('STALE_SOURCE',check.errors.join(' '));return clone(preview);}
function download(){const value=exportReport();if(!D)fail('DOWNLOAD_REQUIRES_BROWSER','La descarga requiere abrir el HTML en un navegador.');const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=D.createElement('a');a.href=url;a.download='Baraja_Identidades_Revisadas.json';D.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);return value;}
const $=id=>D?.getElementById(id),node=(tag,text)=>{const n=D.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
function status(text){const e=$('ygoDeckIdentityStatus');if(e)e.textContent=text;}
function paintPreview(){
 const host=$('ygoDeckIdentityPreview');if(!host)return;host.replaceChildren();preview=null;$('ygoDeckIdentityDownload').disabled=true;
 if(!uiSource||!uiSelections.length){status('Conserva cada passcode o elige un candidato para preparar una copia; la baraja activa permanece intacta.');return;}
 try{preview=buildCopy(uiSource,uiSelections);const table=node('table'),head=node('thead'),tr=node('tr');for(const label of ['Zona / copias','Antes','Después','Procedencia técnica'])tr.append(node('th',label));head.append(tr);table.append(head);const body=node('tbody');for(const c of preview.identityReview.changes){const r=node('tr');r.append(node('td',c.zone+' / '+c.qty),node('td',c.from.name+' · '+c.from.id),node('td',c.to.name+' · '+c.to.id),node('td',c.technicalSource.source+' · commit '+c.technicalSource.sourceCommit+' · SHA-256 '+c.technicalSource.sourceSha256));body.append(r);}table.append(body);host.append(table);
  const issues=preview.identityReview.audit.issues,format=preview.identityReview.audit.formatAudit,n=(issues.length+(format?.errors?.length||0)+(format?.pending?.length||0));host.append(node('p','Cantidades conservadas en Main, Extra, Side y Skills. '+(n?n+' incidencias o datos pendientes en el diagnóstico. ':'Consulta el diagnóstico incorporado al JSON. ')+'La copia no certifica legalidad ni identidad oficial.'));if(preview.identityReview.changes.some(c=>c.omittedIdentityEvidence.length))host.append(node('p','Se omiten las evidencias individuales de los passcodes sustituidos; revisa su impresión, fecha y condiciones para la nueva identidad.'));
  $('ygoDeckIdentityDownload').disabled=false;status('Copia preparada con '+uiSelections.length+' decisiones explícitas. Descargar conserva la baraja y el laboratorio actuales.');
 }catch(error){preview=null;status(String(error?.message||error));}
}
function refresh(){
 if(!mounted)return null;try{const source=captureSource(),changed=!uiSource||!same(source,uiSource);if(changed){uiSource=source;uiSelections=[];preview=null;}
  const body=$('ygoDeckIdentityRows');body.replaceChildren();const rows=proposals(source);for(const p of rows){const r=node('tr');r.append(node('td',p.name+' · '+p.id),node('td',Object.entries(p.zones).map(([z,q])=>z+': '+q).join(', ')+' · total '+p.qty));const td=node('td'),select=node('select');select.dataset.identityFrom=String(p.id);select.setAttribute('aria-label','Identidad revisada de '+p.name+' ('+p.id+')');const keep=node('option','Conservar passcode '+p.id);keep.value='keep';select.append(keep);for(const c of p.candidates){const option=node('option',c.name+' · '+c.id);option.value=String(c.id);select.append(option);}select.value=String(uiSelections.find(c=>c.fromId===p.id)?.toId||'keep');select.onchange=()=>{uiSelections=uiSelections.filter(c=>c.fromId!==p.id);if(select.value!=='keep')uiSelections.push({fromId:p.id,toId:Number(select.value)});paintPreview();};td.append(select);r.append(td);body.append(r);}
  $('ygoDeckIdentitySummary').textContent=rows.length?rows.length+' identidades con propuestas técnicas presentes en esta baraja. Revisa cada candidato; no se elige ninguno automáticamente.':'La baraja actual no contiene identidades con propuestas de revisión del catálogo incorporado.';paintPreview();if(changed&&rows.length)status('Fuente actualizada. Las decisiones anteriores se han descartado porque cambió la baraja o su contexto.');return{changed,proposals:rows.length};
 }catch(error){uiSource=null;uiSelections=[];preview=null;$('ygoDeckIdentityRows')?.replaceChildren();$('ygoDeckIdentityPreview')?.replaceChildren();if($('ygoDeckIdentityDownload'))$('ygoDeckIdentityDownload').disabled=true;status(String(error?.message||error));return{pass:false,error:String(error?.message||error)};}
}
function mount(){if(mounted||!$('ygoDataQuality'))return;const section=node('section');section.id='ygoDeckIdentityReview';section.innerHTML='<h4>Preparar copia con identidades revisadas</h4><p id="ygoDeckIdentitySummary"></p><p>Las coincidencias de nombre son propuestas técnicas para revisar. Cada decisión afecta sólo al JSON de la copia; conserva la baraja original. Puntuación competitiva provisional.</p><details><summary>Elegir identidades y revisar la copia</summary><table><thead><tr><th>Identidad original</th><th>Copias y zonas</th><th>Decisión explícita</th></tr></thead><tbody id="ygoDeckIdentityRows"></tbody></table><div id="ygoDeckIdentityPreview"></div><div class="ygo-data-quality-controls"><button id="ygoDeckIdentityRefresh" type="button">Actualizar fuente de la baraja</button><button id="ygoDeckIdentityDownload" type="button" disabled>Descargar copia revisada JSON</button></div></details><p id="ygoDeckIdentityStatus" role="status" aria-live="polite"></p>';
 const style=node('style');style.textContent='#ygoDeckIdentityReview{border-top:1px solid #376786;margin-top:16px;padding-top:12px;max-width:100%}#ygoDeckIdentityReview h4{font-size:16px;color:#78e8ff}#ygoDeckIdentityReview select{min-height:44px;width:100%;max-width:100%;white-space:normal}#ygoDeckIdentityReview button{min-height:44px}#ygoDeckIdentityReview select:focus-visible,#ygoDeckIdentityReview button:focus-visible{outline:3px solid #78e8ff;outline-offset:2px}#ygoDeckIdentityReview table{width:100%;table-layout:fixed}#ygoDeckIdentityReview td,#ygoDeckIdentityReview th{overflow-wrap:anywhere}#ygoDeckIdentityReview summary{min-height:44px;cursor:pointer}';D.head.append(style);$('ygoDataQuality').append(section);mounted=true;$('ygoDeckIdentityRefresh').onclick=refresh;$('ygoDeckIdentityDownload').onclick=()=>{try{download();status('Copia JSON descargada. La baraja activa y el laboratorio permanecen intactos.');}catch(error){refresh();status(String(error?.message||error));}};for(const name of ['ygo-ui-state-updated','ygo-format-deck-applied','ygo-catalog-updated'])W.addEventListener(name,refresh);refresh();}
const ready=(async()=>{try{await W.__YGO_ENGINE_READY;await W.YGODataCatalog.ready;await W.YGODataQuality.ready;const q=W.YGODataQuality.report();if(!q.pass)throw Error('El diagnóstico del catálogo no está disponible.');const manifest=clone(W.YGO_CATALOG_MANIFEST||{}),rows=await W.getEmbeddedDB();if(!Array.isArray(rows)||rows.length!==q.counts.catalogueRecords)throw Error('El catálogo de la revisión no coincide con el diagnóstico.');baseline={buildId:q.buildId,catalogSha256:q.catalogSha256,aliases:clone(manifest.aliases||{})};const unresolved=new Set(q.unresolvedIdentities.map(x=>x.id));for(const r of rows){const id=Number(r[0]),rename=manifest.canonicalNames?.[id];catalog.set(id,{id,name:rename?.passcodeMatched?rename.canonicalName:String(r[1]),canonicalName:rename?.passcodeMatched?rename.canonicalName:String(r[1]),typeBits:Number(r[3]),source:String(r[6]||''),ot:Number(r[12]),alias:Number(r[13]),technicalSourceMatched:!unresolved.has(id)});}initialized=true;if(D){await W.YGOUIState.ready;await W.YGOFormatEditor?.ready;mount();}return true;}catch(error){lastError=String(error?.message||error);console.error('DECK_IDENTITY_REVIEW_INIT',error);return false;}})();
W.YGODeckIdentityReview=Object.freeze({version:VERSION,ready,captureSource,snapshot:captureSource,proposals,buildCopy,verify,report,exportReport,download,refresh});
})();

/* Document-bound field review. A URL or user-controlled receipt is never an
 * independent official certificate and cannot promote universal rule coverage. */
(()=>{'use strict';
const W=window,KEY='ygo.provenance.document-reviews.v1',MAX_BYTES=4*1024*1024;
const arr=x=>Array.isArray(x)?x:[],plain=x=>x&&typeof x==='object'&&!Array.isArray(x);
const hash=()=>String(W.YGO_CATALOG_MANIFEST?.cardsSha256||W.YGO_BUILD_MANIFEST?.catalogSha256||'');
const normalize=x=>String(x??'').normalize('NFKC').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/\s+/g,' ').trim().toLowerCase();
const official=new Set(['db.yugioh-card.com','www.db.yugioh-card.com','yugioh-card.com','www.yugioh-card.com','konami.com','www.konami.com']);
const allowedFields=new Set(['name','desc','atk','def','level','rank','linkval','scaleL','scaleR','type','attribute']);
const fieldLabels={atk:['atk','attack','ataque'],def:['def','defense','defensa'],level:['level','nivel'],rank:['rank','rango'],linkval:['link','enlace'],scaleL:['scale','escala'],scaleR:['scale','escala']};
let lastStorageError=null;
const fail=(issues,status='EVIDENCE_REJECTED')=>({schema:'ygo-provenance-review/v1',pass:false,status,issues,independentlyVerified:false,officialIdentityCertified:false,universalCertified:false});
function authority(value){
 try{const u=new URL(String(value));if(u.protocol!=='https:'||u.username||u.password||u.port)return{kind:'INVALID',reason:'DIRECT_HTTPS_AUTHORITY_REQUIRED'};
  if(official.has(u.hostname)&&(!u.hostname.endsWith('konami.com')||u.pathname.startsWith('/yugioh')))return{kind:'OFFICIAL_DOCUMENT',url:u.href,hostname:u.hostname};
  if(['raw.githubusercontent.com','github.com'].includes(u.hostname)&&/^\/(?:ProjectIgnis|edo9300)\/(?:BabelCDB|CardScripts|edopro)\//i.test(u.pathname))return{kind:'SECONDARY_TECHNICAL_SOURCE',url:u.href,hostname:u.hostname};
 }catch(_){}
 return{kind:'INVALID',reason:'AUTHORITY_NOT_ALLOWED'};
}
async function sha256(text){
 const crypto=W.crypto||globalThis.crypto;
 if(!crypto?.subtle||typeof TextEncoder!=='function')throw Error('SHA256_CRYPTO_UNAVAILABLE');
 const bytes=new TextEncoder().encode(String(text)),sum=await crypto.subtle.digest('SHA-256',bytes);
 return Array.from(new Uint8Array(sum),n=>n.toString(16).padStart(2,'0')).join('');
}
function validDate(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z)?$/.test(value))return false;const time=Date.parse(value),today=Date.now();return Number.isFinite(time)&&time<=today+60000&&new Date(time).toISOString().slice(0,10)===value.slice(0,10);}
function classify(card){
 const source=String(card?.source||''),bits=Number(card?.typeBits),name=String(card?.name||'');
 if(bits&0x4000)return{classification:'NON_DECK_TOKEN_OR_PLACEHOLDER',ordinaryTcgIdentityReady:false};
 if(/deckmaster|placeholder/i.test(source+' '+name))return{classification:'NONSTANDARD_DATABASE_ASSET',ordinaryTcgIdentityReady:false};
 if(/unofficial/i.test(source))return{classification:'EXCLUDED_UNOFFICIAL_LEGACY',ordinaryTcgIdentityReady:false};
 if(/skills/i.test(source))return{classification:'SEPARATE_SKILL_ASSET',ordinaryTcgIdentityReady:false};
 if(/prerelease/i.test(source))return{classification:'OBSOLETE_PRERELEASE_PASSCODE_REVIEW',ordinaryTcgIdentityReady:false};
 return{classification:'PRIMARY_SOURCE_IDENTITY_REVIEW',ordinaryTcgIdentityReady:false};
}
function backlog(){
 const manifest=W.YGO_CATALOG_MANIFEST||{},rows=arr(manifest.unmatchedLegacyRows).map(row=>{const card=W.YGODataCatalog?.lookup?.(row.id)||row;return{...row,...classify(card),monsterStatsUnknown:arr(manifest.unknownMonsterIds).includes(row.id),preserved:true}});
 const counts={},monsterCounts={};for(const row of rows){counts[row.classification]=(counts[row.classification]||0)+1;if(row.monsterStatsUnknown)monsterCounts[row.classification]=(monsterCounts[row.classification]||0)+1;}
 return{schema:'ygo-provenance-backlog/v1',catalogueHash:hash(),unmatchedCount:rows.length,classifications:counts,unknownMonsterByClassification:monsterCounts,
  primaryStandardUnmatchedCount:counts.PRIMARY_SOURCE_IDENTITY_REVIEW||0,prereleaseIdentityReviewCount:counts.OBSOLETE_PRERELEASE_PASSCODE_REVIEW||0,rows,
  policy:'Unofficial assets and temporary prerelease IDs are separate from unresolved printed TCG passcodes. No ID is silently substituted.',officialIdentityCertified:false};
}
function expectedValue(card,field){if(field==='name')return card.canonicalName||card.name;if(field==='desc')return card.desc||card.text;if(field==='def'&&card.defApplicable===false)return undefined;return card[field];}
function nameMatches(card,value){return[card.name,card.canonicalName,...arr(card.legacyNames)].some(name=>normalize(name)===normalize(value));}
function witnessMatches(field,expected,witness){
 const quote=normalize(witness),value=normalize(expected);
 if(!value||!quote.includes(value))return false;
 if(typeof expected==='number'){
  const escaped=String(expected).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  if(!new RegExp('(^|[^0-9])'+escaped+'([^0-9]|$)').test(quote))return false;
  if(fieldLabels[field]&&!fieldLabels[field].some(label=>new RegExp('(^|\\W)'+label+'(\\W|$)','i').test(quote)))return false;
 }
 return true;
}
async function review(evidence){
 const issues=[];
 if(!plain(evidence)||evidence.schema!=='ygo-provenance-evidence/v1')return fail(['EVIDENCE_SCHEMA_REQUIRED']);
 if(!hash()||evidence.catalogueHash!==hash())issues.push('CATALOGUE_HASH_MISMATCH');
 if(!Number.isSafeInteger(evidence.cardId)||evidence.cardId<1)issues.push('CARD_ID_INVALID');
 const card=W.YGODataCatalog?.lookup?.(evidence.cardId);
 if(!card)issues.push('CARD_NOT_IN_CURRENT_CATALOGUE');
 const source=authority(evidence.authorityUrl);if(source.kind==='INVALID')issues.push(source.reason);
 if(evidence.certified===true||evidence.universalCertified===true||evidence.officialIdentityCertified===true||evidence.independentlyVerified===true)issues.push('SELF_DECLARED_CERTIFICATION_REJECTED');
 if(!validDate(evidence.reviewedAt))issues.push('REAL_NONFUTURE_REVIEW_DATE_REQUIRED');
 if(!plain(evidence.reviewer)||typeof evidence.reviewer.name!=='string'||evidence.reviewer.name.trim().length<2)issues.push('REVIEWER_REQUIRED');
 const expectedMethod=source.kind==='OFFICIAL_DOCUMENT'?'OFFICIAL_DOCUMENT_FIELD_REVIEW':'TECHNICAL_SOURCE_FIELD_REVIEW';
 if(evidence.reviewer?.method!==expectedMethod)issues.push('REVIEW_METHOD_AUTHORITY_MISMATCH');
 const document=evidence.document;
 if(!plain(document)||typeof document.content!=='string'||document.content.length<10||document.content.length>MAX_BYTES)issues.push('DOCUMENT_CONTENT_REQUIRED_WITHIN_LIMIT');
 if(!/^[a-f0-9]{64}$/.test(String(document?.sha256||'')))issues.push('DOCUMENT_SHA256_REQUIRED');
 if(!plain(evidence.fields)||!Object.prototype.hasOwnProperty.call(evidence.fields,'name')||Object.keys(evidence.fields).length>allowedFields.size)issues.push('NAME_AND_EXPLICIT_FIELDS_REQUIRED');
 if(issues.length)return fail(issues);
 let observed;
 try{observed=await sha256(document.content)}catch(e){return fail([String(e?.message||e)],'VERIFICATION_UNAVAILABLE')}
 if(observed!==document.sha256)return fail(['DOCUMENT_HASH_MISMATCH']);
 let documentText=document.content;
 if(/html/i.test(String(document.contentType||''))){const Parser=W.DOMParser||globalThis.DOMParser;if(typeof Parser==='function')documentText=new Parser().parseFromString(document.content,'text/html').body.textContent;else documentText=document.content.replace(/<[^>]*>/g,' ');}
 const content=normalize(documentText),fields={};
 for(const [field,entry] of Object.entries(evidence.fields)){
  if(!allowedFields.has(field)){issues.push('FIELD_NOT_ALLOWED:'+field);continue;}
  if(!plain(entry)||!Object.prototype.hasOwnProperty.call(entry,'value')||typeof entry.witness!=='string'||entry.witness.length<2||entry.witness.length>32000){issues.push('FIELD_VALUE_AND_WITNESS_REQUIRED:'+field);continue;}
  const expected=expectedValue(card,field);
  if(expected===undefined||expected===null||expected===''){issues.push('CURRENT_FIELD_UNKNOWN:'+field);continue;}
  const valueMatches=field==='name'?nameMatches(card,entry.value):(typeof expected==='number'?typeof entry.value==='number'&&Number.isFinite(entry.value)&&entry.value===expected:normalize(entry.value)===normalize(expected));
  if(!valueMatches){issues.push('FIELD_VALUE_DIFFERS_FROM_CURRENT_CATALOGUE:'+field);continue;}
  if(!content.includes(normalize(entry.witness))||!witnessMatches(field,entry.value,entry.witness)){issues.push('FIELD_WITNESS_NOT_BOUND_TO_DOCUMENT:'+field);continue;}
  fields[field]={value:entry.value,witness:entry.witness};
 }
 if(issues.length)return fail(issues);
 const retrieval=plain(evidence.retrieval)?evidence.retrieval:null;
 const matchingReceipt=!!retrieval&&retrieval.method==='HTTPS_TLS_VALIDATED'&&retrieval.documentSha256===observed&&authority(retrieval.finalUrl).kind===source.kind&&new URL(retrieval.finalUrl).href===source.url&&validDate(retrieval.retrievedAt);
 return{schema:'ygo-provenance-review/v1',pass:true,status:source.kind==='OFFICIAL_DOCUMENT'?'OFFICIAL_DOCUMENT_FIELDS_REVIEWED':'TECHNICAL_DOCUMENT_FIELDS_REVIEWED',
  catalogueHash:hash(),cardId:evidence.cardId,authorityUrl:source.url,authorityKind:source.kind,documentSha256:observed,
  fieldsVerified:Object.keys(fields),fields,reviewedAt:evidence.reviewedAt,reviewer:{name:evidence.reviewer.name.trim(),method:expectedMethod},
  transportReceipt:matchingReceipt?'MATCHING_EXTERNAL_RECEIPT_UNAUTHENTICATED':'NOT_PROVIDED_OR_INCONSISTENT',
  independentlyVerified:false,officialIdentityCertified:false,universalCertified:false,
  limitations:['The supplied document bytes, field values and witnesses agree.','The browser does not independently authenticate the origin of a supplied document or retrieval receipt.','Name agreement does not prove passcode identity or complete card/ruling correctness.']};
}
function load(){
 try{const raw=localStorage.getItem(KEY);if(raw===null)return{schema:'ygo-provenance-store/v1',catalogueHash:hash(),artifacts:[],reviews:[]};
  const value=JSON.parse(raw);if(!plain(value)||value.schema!=='ygo-provenance-store/v1'||!Array.isArray(value.artifacts)||!Array.isArray(value.reviews)||value.artifacts.length!==value.reviews.length||!value.artifacts.every((artifact,index)=>{const review=value.reviews[index];return plain(artifact)&&plain(review)&&artifact.catalogueHash===value.catalogueHash&&review.catalogueHash===value.catalogueHash&&artifact.cardId===review.cardId&&artifact.document?.sha256===review.documentSha256&&artifact.authorityUrl===review.authorityUrl}))throw Error('SAVED_PROVENANCE_INVALID');return value;
 }catch(e){lastStorageError=String(e?.message||e);return null;}
}
async function importEvidence(input){
 const artifacts=Array.isArray(input)?input:input?.schema==='ygo-provenance-export/v1'?input.artifacts:[input];
 if(!Array.isArray(artifacts)||!artifacts.length||artifacts.length>100)return fail(['ONE_TO_ONE_HUNDRED_ARTIFACTS_REQUIRED']);
 let serialized;try{serialized=JSON.stringify(artifacts);if(new TextEncoder().encode(serialized).length>MAX_BYTES)throw Error('IMPORT_EXCEEDS_FOUR_MIB')}catch(e){return fail([String(e?.message||e)])}
 const previousRaw=(()=>{try{return localStorage.getItem(KEY)}catch(_){return undefined}})();
 if(previousRaw===undefined)return fail(['STORAGE_UNREADABLE'],'STORAGE_ERROR');
 const previous=load();if(!previous)return fail(['SAVED_PROVENANCE_INVALID_PRESERVED'],'STORAGE_ERROR');
 if(previous.artifacts.length&&previous.catalogueHash!==hash())return fail(['SAVED_REVIEWS_BELONG_TO_ANOTHER_CATALOGUE_EXPORT_BEFORE_REPLACING'],'STALE_SAVED_CONTEXT');
 const reviews=[],seen=new Set();
 for(let index=0;index<artifacts.length;index++){
  const result=await review(artifacts[index]);
  if(!result.pass)return{...result,index,storedDatasetPreserved:true};
  const key=result.cardId+'|'+result.documentSha256+'|'+result.authorityUrl;
  if(seen.has(key))return fail(['DUPLICATE_ARTIFACT_IN_BATCH']);seen.add(key);reviews.push(result);
 }
 const combined=new Map();for(let i=0;i<previous.artifacts.length;i++){const artifact=previous.artifacts[i],r=await review(artifact);if(!r.pass)return fail(['SAVED_PROVENANCE_BINDING_INVALID_PRESERVED',...r.issues],'STORAGE_ERROR');combined.set(r.cardId+'|'+r.documentSha256+'|'+r.authorityUrl,{artifact,review:r});}
 for(let i=0;i<artifacts.length;i++){const r=reviews[i];combined.set(r.cardId+'|'+r.documentSha256+'|'+r.authorityUrl,{artifact:artifacts[i],review:r});}
 const value={schema:'ygo-provenance-store/v1',catalogueHash:hash(),artifacts:[...combined.values()].map(x=>x.artifact),reviews:[...combined.values()].map(x=>x.review)};
 try{const encoded=JSON.stringify(value);if(new TextEncoder().encode(encoded).length>MAX_BYTES)throw Error('SAVED_EVIDENCE_EXCEEDS_FOUR_MIB');localStorage.setItem(KEY,encoded);if(localStorage.getItem(KEY)!==encoded)throw Error('WRITE_NOT_CONFIRMED')}
 catch(e){let rollback=false;try{if(previousRaw===null)localStorage.removeItem(KEY);else localStorage.setItem(KEY,previousRaw);rollback=localStorage.getItem(KEY)===previousRaw}catch(_){}lastStorageError=String(e?.message||e);return{...fail([lastStorageError],'STORAGE_ERROR'),rollbackConfirmed:rollback}}
 lastStorageError=null;return{pass:true,status:'DOCUMENT_REVIEWS_SAVED',accepted:reviews.length,total:combined.size,independentlyVerified:false,officialIdentityCertified:false,universalCertified:false};
}
async function auditStored(){const saved=load();if(!saved)return fail(['SAVED_PROVENANCE_INVALID_PRESERVED'],'STORAGE_ERROR');if(saved.catalogueHash!==hash())return fail(['CATALOGUE_HASH_MISMATCH'],'STALE_SAVED_CONTEXT');const reviews=[];for(let index=0;index<saved.artifacts.length;index++){const r=await review(saved.artifacts[index]);if(!r.pass)return{...r,index,storedDatasetPreserved:true};reviews.push(r);}return{pass:true,status:'SAVED_DOCUMENTS_RECHECKED',count:reviews.length,reviews,independentlyVerified:false,officialIdentityCertified:false};}
function clear(options={}){const saved=load();if(!saved)return fail(['SAVED_PROVENANCE_INVALID_PRESERVED'],'STORAGE_ERROR');if(options.confirmCatalogueHash!==saved.catalogueHash)return fail(['EXPLICIT_SAVED_CATALOGUE_HASH_REQUIRED']);try{localStorage.removeItem(KEY);if(localStorage.getItem(KEY)!==null)throw Error('CLEAR_NOT_CONFIRMED');lastStorageError=null;return{pass:true,status:'REVIEWS_CLEARED'};}catch(e){lastStorageError=String(e?.message||e);return fail([lastStorageError],'STORAGE_ERROR')}}
function exportEvidence(){const saved=load();return{schema:'ygo-provenance-export/v1',catalogueHash:hash(),exportedAt:new Date().toISOString(),artifacts:saved?.artifacts||[],reviews:saved?.reviews||[],storageError:lastStorageError,backlog:backlog(),independentlyVerified:false,officialIdentityCertified:false};}
function status(){const saved=load(),current=saved?.catalogueHash===hash(),reviewRows=current?arr(saved?.reviews):[];return{schema:'ygo-provenance-status/v1',catalogueHash:hash(),savedCatalogueHash:saved?.catalogueHash||null,status:!saved?'SAVED_DATA_INVALID':!current?'STALE_CATALOGUE_CONTEXT':reviewRows.length?'DOCUMENT_REVIEWS_AVAILABLE':'NO_DOCUMENT_REVIEWS',
  reviewedArtifacts:reviewRows.length,reviewedCardIds:[...new Set(reviewRows.map(r=>r.cardId))],officialDocumentReviews:reviewRows.filter(r=>r.authorityKind==='OFFICIAL_DOCUMENT').length,technicalDocumentReviews:reviewRows.filter(r=>r.authorityKind==='SECONDARY_TECHNICAL_SOURCE').length,
  storageError:lastStorageError,backlogCounts:backlog().classifications,independentlyVerified:false,officialIdentityCertified:false,universalCertified:false};}
function template(cardId){const card=W.YGODataCatalog?.lookup?.(Number(cardId));return{schema:'ygo-provenance-evidence/v1',catalogueHash:hash(),cardId:card?.id||null,authorityUrl:'',document:{content:'',sha256:'',contentType:'text/html'},reviewedAt:null,reviewer:{name:'',method:'OFFICIAL_DOCUMENT_FIELD_REVIEW'},fields:{name:{value:card?.canonicalName||card?.name||'',witness:''}},retrieval:null,independentlyVerified:false};}
W.YGOProvenance=Object.freeze({version:'document-field-review-v1',review,import:importEvidence,export:exportEvidence,status,backlog,template,authority,sha256,auditStored,clear,ready:Promise.resolve(W.YGODataCatalog?.ready).then(()=>W.YGOProvenance),storageKey:KEY});
})();

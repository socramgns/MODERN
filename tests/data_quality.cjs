'use strict';
/* Technical catalogue diagnostics are checked against the pinned SQLite audit,
 * not against fabricated statistics or a name-based passcode rewrite. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),os=require('node:os');
const {spawnSync}=require('node:child_process'),assert=require('node:assert/strict');
const {harness,ROOT}=require('./combo_engine.cjs');
const copy=structuredClone,load=fs.readFileSync(path.join(ROOT,'src/app/data-quality.js'),'utf8');
const plain=x=>JSON.parse(JSON.stringify(x)),sorted=x=>Array.from(x).sort((a,b)=>a-b);

(async()=>{
 const {W,fixture}=await harness(),tests=[];
 W.deckState=copy(fixture('Invoked').deck);
 vm.runInNewContext(load,{window:W,structuredClone,console},{filename:'data-quality.js'});
 const Q=W.YGODataQuality;assert(await Q.ready,'Shipped data-quality snapshot must initialize');
 const raw=await W.getEmbeddedDB(),manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'src/data/catalog-manifest.json'),'utf8'));
 const baseline=plain(Q.report());
 async function test(name,fn){try{await fn();tests.push({name,pass:true});}catch(error){tests.push({name,pass:false,error:error.stack});}}
 let oracle;
 await test('The independent pinned-CDB audit is available and checks its source hash before comparison',()=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'ygo-r14-quality-'));
  try{
   const output=path.join(directory,'reference.json'),result=spawnSync('python3',['tools/audit_catalogue.py','--output',output],{cwd:ROOT,encoding:'utf8'});
   assert.equal(result.status,0,result.stderr||result.stdout);
   oracle=JSON.parse(fs.readFileSync(output,'utf8'));
   assert.equal(oracle.primarySourceCoverage.checkedAgainstCachedSource,true);
   assert(oracle.cacheChecks.some(x=>x.file==='cards.cdb'&&x.status==='SHA256_AND_SQLITE_PASS'));
   assert.equal(oracle.catalogueHash,manifest.cardsSha256);
  }finally{fs.rmSync(directory,{recursive:true,force:true});}
 });
 await test('Live counts conserve the shipped catalogue while separating unresolved IDs and missing statistics',()=>{
  const r=Q.report(),c=r.counts;
  assert.equal(r.pass,true);assert.equal(c.catalogueRecords,raw.length);assert.equal(c.activeCatalogueRecords,W.CARD_CATALOG.length);
  assert.equal(c.catalogueRecords,21986);assert.equal(c.technicalSourceMatched+c.unresolvedIdentities,c.catalogueRecords);
  assert.equal(c.technicalSourceMatched,21888);assert.equal(c.unresolvedIdentities,98);assert.equal(c.unknownMonsterStats,51);assert.equal(c.migrationProposals,32);
  assert.equal(c.incidentEntries,c.unresolvedIdentities+c.unknownMonsterStats+c.migrationProposals);
  assert.equal(r.activeInventory.matchesShippedSnapshot,true);assert.equal(r.mutatesDeck,false);assert.equal(r.changesApplied,false);
 });
 await test('Every unresolved ID, classification and unknown-stat identity agrees with the independent source audit',()=>{
  assert(oracle);const r=Q.report();
  assert.deepEqual(sorted(r.unresolvedIdentities.map(x=>x.id)),sorted(oracle.rows.map(x=>x.id)));
  assert.deepEqual(sorted(r.unknownMonsterStats.map(x=>x.id)),sorted(manifest.unknownMonsterIds));
  assert.deepEqual(plain(r.classifications),oracle.classifications);
  for(const row of r.unresolvedIdentities){const reference=oracle.rows.find(x=>x.id===row.id);assert.equal(row.classification,reference.classification);assert.equal(row.reason,reference.reason);}
 });
 await test('Candidate passcodes match the pinned primary SQLite names and remain proposals rather than replacements',()=>{
  assert(oracle);const r=Q.report(),expected=oracle.rows.filter(x=>x.migrationCandidates.length);
  assert.equal(r.migrationProposals.length,expected.length);
  for(const proposal of r.migrationProposals){
   const reference=expected.find(x=>x.id===proposal.id);assert(reference);
   assert.deepEqual(sorted(proposal.candidates.map(x=>x.id)),sorted(reference.migrationCandidates.map(x=>x.id)));
   assert.equal(proposal.applied,false);assert.equal(proposal.policy,'REVIEW_ONLY_NO_PASSCODE_REWRITE');
   for(const candidate of proposal.candidates){const saved=reference.migrationCandidates.find(x=>x.id===candidate.id);assert.equal(candidate.name,saved.name);assert.equal(candidate.sourceSha256,saved.sourceSha256);assert.equal(candidate.sourceCommit,saved.sourceCommit);assert.equal(candidate.source,'cards.cdb');assert.notEqual(candidate.id,proposal.id);}
  }
 });
 await test('Ambiguous name matches preserve every proposed identity without selecting or applying the first result',()=>{
  const row=Q.report().migrationProposals.find(x=>x.id===511009215);assert(row);assert.deepEqual(sorted(row.candidates.map(x=>x.id)),[21770261,79387393]);
  assert.equal(W.YGODataCatalog.lookup(511009215).id,511009215);assert.equal(row.applied,false);
 });
 await test('Legacy source declarations never acquire an unrelated pinned URL, hash or official identity claim',()=>{
  const r=Q.report();for(const row of [...r.unresolvedIdentities,...r.migrationProposals]){
   const original=raw.find(x=>Number(x[0])===row.id);assert.equal(row.source.declaredFile,original[6]);
   assert.equal(row.source.matchedToPinnedTechnicalSource,false);assert.equal(row.source.pinned,null);
   assert.equal(row.source.declarationScope,'PRESERVED_LEGACY_DECLARATION_ONLY');assert.equal(row.source.officialIdentityCertified,false);
  }
  assert.equal(r.officialIdentityCertified,false);assert.equal(r.officialAvailabilityVerified,false);assert.equal(r.completeCardRules,false);assert.equal(r.competitiveCertified,false);
 });
 await test('Known zero attack and question-mark technical values are not reclassified as missing statistics',()=>{
  const knownZero=raw.find(x=>(Number(x[3])&1)&&x[8]===0&&Number.isFinite(x[9])&&Number.isFinite(x[10]));
  const knownQuestion=raw.find(x=>(Number(x[3])&1)&&x[8]===-2&&Number.isFinite(x[9])&&Number.isFinite(x[10]));
  assert(knownZero);assert(knownQuestion);const missing=new Set(Q.report().unknownMonsterStats.map(x=>x.id));
  assert(!missing.has(Number(knownZero[0])));assert(!missing.has(Number(knownQuestion[0])));
  assert(Q.report().unknownMonsterStats.every(x=>(x.typeBits&1)!==0&&x.missingFields.length>0));
 });
 await test('Mutable presentation objects cannot invent a source match or fill unknown statistics',()=>{
  const missing=baseline.unknownMonsterStats[0],card=W.YGODataCatalog.lookup(missing.id),saved=copy(card);
  try{
   Object.assign(card,{name:'Invented presentation',source:'cards.cdb',technicalSourceMatched:true,statsKnown:true,atk:9000,def:9000,level:4});
   const r=Q.report(),row=r.unknownMonsterStats.find(x=>x.id===missing.id);
   assert(row);assert.equal(row.name,missing.name);assert.deepEqual(plain(row.source),missing.source);assert.equal(r.counts.unknownMonsterStats,51);
   assert.equal(r.counts.technicalSourceMatched,21888);
  }finally{for(const key of Object.keys(card))delete card[key];Object.assign(card,saved);}
 });
 await test('The diagnostic keeps its immutable minimum raw snapshot after shared embedded rows are changed',()=>{
  const missing=baseline.unknownMonsterStats[0],row=raw.find(x=>Number(x[0])===missing.id),saved=copy(row);
  try{
   row[1]='Unreviewed rename';row[6]='cards.cdb';row[8]=100;row[9]=100;row[10]=4;
   const r=Q.report(),entry=r.unknownMonsterStats.find(x=>x.id===missing.id);
   assert(entry);assert.equal(entry.name,missing.name);assert.equal(entry.source.declaredFile,missing.source.declaredFile);
   assert.equal(r.counts.unknownMonsterStats,51);assert.equal(r.counts.migrationProposals,32);
  }finally{row.splice(0,row.length,...saved);}
 });
 await test('An active inventory change is visible instead of silently changing the shipped identity baseline',()=>{
  const active=W.CARD_CATALOG,saved=active.slice(),removed=saved[0];
  try{
   active.shift();let r=Q.report();assert.equal(r.pass,false);assert.equal(r.status,'ACTIVE_CATALOGUE_INVENTORY_MISMATCH');assert.equal(r.counts.activeCatalogueRecords,21985);assert(r.activeInventory.missingPasscodes.includes(removed.id));assert.equal(r.counts.catalogueRecords,21986);
   active.splice(0,active.length,...saved,removed);r=Q.report();assert.equal(r.pass,false);assert(r.activeInventory.invalidOrDuplicateIds.includes(removed.id));
   active.splice(0,active.length,...saved,{id:999999999,name:'Unreviewed new identity'});r=Q.report();assert.equal(r.pass,false);assert(r.activeInventory.additionalPasscodes.includes(999999999));
  }finally{active.splice(0,active.length,...saved);}
  assert.equal(Q.report().pass,true);
 });
 await test('Exported reports retain build and catalogue bindings and cannot mutate later diagnostics',()=>{
  const first=Q.exportReport();assert.equal(first.schema,'ygo-data-quality/v1');assert.equal(first.buildId,W.YGO_BUILD_MANIFEST.buildId);assert.equal(first.catalogSha256,manifest.cardsSha256);
  first.counts.unresolvedIdentities=0;first.unresolvedIdentities[0].name='forged';first.sourceSnapshot.sources[0].url='https://invalid.test';first.migrationProposals[0].candidates.length=0;
  const next=Q.report();assert.equal(next.counts.unresolvedIdentities,98);assert.notEqual(next.unresolvedIdentities[0].name,'forged');assert.notEqual(next.sourceSnapshot.sources[0].url,'https://invalid.test');assert(next.migrationProposals[0].candidates.length>0);
  assert(!Object.hasOwn(next,'percentage'));assert(!Object.hasOwn(next,'score'));
 });
 await test('A changed build or catalogue hash is marked stale without rebinding the captured catalogue',()=>{
  const build=W.YGO_BUILD_MANIFEST.buildId,hash=W.YGO_CATALOG_MANIFEST.cardsSha256;
  try{
   W.YGO_BUILD_MANIFEST.buildId='other-build';let r=Q.report();assert.equal(r.pass,false);assert.equal(r.status,'STALE_BUILD_CONTEXT');assert.equal(r.buildId,build);
   W.YGO_BUILD_MANIFEST.buildId=build;W.YGO_CATALOG_MANIFEST.cardsSha256='other-catalogue';r=Q.report();assert.equal(r.pass,false);assert.equal(r.catalogSha256,hash);
  }finally{W.YGO_BUILD_MANIFEST.buildId=build;W.YGO_CATALOG_MANIFEST.cardsSha256=hash;}
 });
 await test('Format context is exported as a detached context without manufacturing availability evidence',()=>{
  const original={adapter:W.YGOAlpha973,state:W.YGOUIState},context={format:'masterduel',cardPool:{status:'DECLARED_ONLY'}};
  try{
   W.YGOAlpha973={activeFormatKey:()=>context.format};W.YGOUIState={contextVersion:7,getFormatContext:()=>context};
   const r=Q.report();assert.equal(r.context.format,'masterduel');assert.equal(r.context.formatContextVersion,7);r.context.formatContext.cardPool.status='FORGED';
   assert.equal(Q.report().context.formatContext.cardPool.status,'DECLARED_ONLY');assert.equal(context.cardPool.status,'DECLARED_ONLY');assert.equal(r.officialAvailabilityVerified,false);
  }finally{W.YGOAlpha973=original.adapter;W.YGOUIState=original.state;}
 });
 await test('Reporting, exporting, refreshing and the Node download adapter preserve every deck and raw catalogue row',()=>{
  const deck=JSON.stringify(W.deckState),embedded=JSON.stringify(raw),activeIds=JSON.stringify(W.CARD_CATALOG.map(x=>x.id));
  for(const result of [Q.report(),Q.exportReport(),Q.refresh(),Q.downloadReport()])assert.equal(result.changesApplied,false);
  assert.equal(JSON.stringify(W.deckState),deck);assert.equal(JSON.stringify(raw),embedded);assert.equal(JSON.stringify(W.CARD_CATALOG.map(x=>x.id)),activeIds);
 });
 await test('An incomplete embedded payload fails initialization instead of claiming a complete bound catalogue',async()=>{
  const minimal={YGO_CATALOG_MANIFEST:copy(manifest),YGO_BUILD_MANIFEST:copy(W.YGO_BUILD_MANIFEST),CARD_CATALOG:W.CARD_CATALOG,getEmbeddedDB:async()=>raw.slice(0,1)};
  vm.runInNewContext(load,{window:minimal,structuredClone,console});assert.equal(await minimal.YGODataQuality.ready,false);const r=minimal.YGODataQuality.report();assert.equal(r.pass,false);assert.equal(r.counts,null);assert(r.issues.some(x=>x.includes('COUNT_MISMATCH')));
 });
 const result={schema:'ygo-data-quality-tests/v1',pass:tests.every(x=>x.pass),total:tests.length,tests,
  limitations:['The pinned SQLite source is a secondary technical snapshot, not official identity, availability or ruling certification.',
   'No statistics, passcodes, proposals or decks are automatically rewritten; the tests do not validate a competitive score.']};
 fs.writeFileSync(path.join(ROOT,'tests/data-quality-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));if(!result.pass)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});

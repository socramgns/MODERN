'use strict';
/* Actual catalogue/CDB oracle plus the existing format JSON normalizer and
 * session validator. Browser file selection and active imports are GUI15. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const {harness,ROOT}=require('./combo_engine.cjs');
const copy=structuredClone,plain=x=>JSON.parse(JSON.stringify(x)),read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
(async()=>{
 const {W,fixture,make}=await harness(),tests=[];
 const text={name:{value:'Fuente revisada · prueba'},arch:{value:'Invoked'},date:{value:'2026-10-30'}};let formatLabel='TCG';
 const document={readyState:'loading',addEventListener(){},querySelector(){return{dataset:{f:formatLabel}}},getElementById:id=>text[id]||null};
 const globals={window:W,structuredClone,console,Date,Promise};
 for(const name of ['formats.js','data-quality.js'])vm.runInNewContext(read('src/app/'+name),globals,{filename:name});
 assert.equal(await W.YGODataQuality.ready,true);
 // These are the actual public import normalizer/session validator. DOM startup
 // is deliberately deferred; no fake validator replaces their implementation.
 for(const name of ['ui-state.js','format-editor.js'])vm.runInNewContext(read('src/app/'+name),{...globals,document},{filename:name});
 vm.runInNewContext(read('src/app/deck-identity-review.js'),globals,{filename:'deck-identity-review.js'});
 const R=W.YGODeckIdentityReview;assert.equal(await R.ready,true);
 const base=fixture('Invoked'),sourceMain=101111001,sourceExtra=100000023,ambiguous=511009215;
 let oracle,mainTarget,extraTarget,baselineSource,baselineCopy;
 const compact=deck=>Object.fromEntries(['main','extra','side','skills'].map(z=>[z,(deck[z]||[]).map(r=>({id:Number(r.id),qty:Number(r.qty)}))]));
 function setDeck(deck,context={format:'tcg'}){formatLabel=context.format;W.__YGO_ACTIVE_BAN_KEY=context.format;W.YGOUIState.setFormatContext(copy(context));W.deckState=compact(deck);}
 function reviewedDeck(){const deck=compact(base.deck);deck.main[0]={id:sourceMain,qty:3};deck.main[1]={id:mainTarget,qty:1};deck.extra.push({id:sourceExtra,qty:2});deck.side=[{id:sourceMain,qty:1}];return deck;}
 const before=()=>JSON.stringify({deck:W.deckState,context:W.YGOUIState.getFormatContext(),catalogue:W.CARD_CATALOG,lab:W.YGOComboLab,goal:W.__reviewGoal});
 const rejects=(fn,code)=>assert.throws(fn,error=>error instanceof Error||error?.message?(!code||error.code===code):false);
 async function test(name,fn){try{await fn();tests.push({name,pass:true});}catch(error){tests.push({name,pass:false,error:error.stack});}}
 await test('Exact candidate IDs and technical provenance are checked against the checksum-validated cached SQLite source',()=>{
  const result=spawnSync('python3',['-c','import json; from tools.audit_catalogue import build_report; print(json.dumps(build_report()))'],{cwd:ROOT,encoding:'utf8',maxBuffer:8*1024*1024});assert.equal(result.status,0,result.stderr);oracle=JSON.parse(result.stdout);assert(oracle.cacheChecks.some(x=>x.file==='cards.cdb'&&x.status==='SHA256_AND_SQLITE_PASS'));assert.equal(oracle.primarySourceCoverage.checkedAgainstCachedSource,true);
  const main=oracle.rows.find(r=>r.id===sourceMain),extra=oracle.rows.find(r=>r.id===sourceExtra);assert.equal(main.migrationCandidates.length,1);assert.equal(extra.migrationCandidates.length,1);mainTarget=main.migrationCandidates[0].id;extraTarget=extra.migrationCandidates[0].id;
  for(const proposal of W.YGODataQuality.report().migrationProposals){const expected=oracle.rows.find(r=>r.id===proposal.id);assert(expected);assert.deepEqual(proposal.candidates.map(c=>c.id).sort((a,b)=>a-b),expected.migrationCandidates.map(c=>c.id).sort((a,b)=>a-b));}
 });
 await test('Only proposals actually present in the source are listed with conserved quantities and zones',()=>{
  setDeck(reviewedDeck());baselineSource=R.captureSource();const rows=plain(R.proposals(baselineSource));assert.deepEqual(rows.map(p=>p.id).sort((a,b)=>a-b),[sourceExtra,sourceMain].sort((a,b)=>a-b));const main=rows.find(p=>p.id===sourceMain);assert.equal(main.qty,4);assert.deepEqual(main.zones,{main:3,side:1});const reference=oracle.rows.find(p=>p.id===sourceMain).migrationCandidates[0];assert.equal(main.candidates[0].name,reference.name);assert.equal(main.candidates[0].sourceSha256,reference.sourceSha256);
 });
 await test('An empty selection conserves all printed passcodes and does not select a candidate',()=>{
  const result=R.buildCopy(baselineSource,[]);assert.equal(result.identityReview.changes.length,0);assert.deepEqual(plain(result.deckState),plain(baselineSource.deck.deckState));assert.deepEqual(plain(result.identityReview.selections),[]);
 });
 await test('Explicit decisions produce the independently expected IDs and merge quantities without moving zones',()=>{
  const saved=before();baselineCopy=R.buildCopy(baselineSource,[{fromId:sourceMain,toId:mainTarget},{fromId:sourceExtra,toId:extraTarget}]);assert.equal(before(),saved);const deck=baselineCopy.deckState;
  assert.equal(deck.main.find(r=>r.id===mainTarget).qty,4);assert(!deck.main.some(r=>r.id===sourceMain));assert.equal(deck.side.find(r=>r.id===mainTarget).qty,1);assert.equal(deck.extra.find(r=>r.id===extraTarget).qty,2);assert(!deck.extra.some(r=>r.id===sourceExtra));assert.deepEqual(plain(baselineCopy.identityReview.beforeCounts),plain(baselineCopy.identityReview.afterCounts));assert.deepEqual(plain(baselineCopy.identityReview.changes.map(c=>[c.zone,c.from.id,c.to.id,c.qty])),[['main',sourceMain,mainTarget,3],['extra',sourceExtra,extraTarget,2],['side',sourceMain,mainTarget,1]]);
  for(const c of baselineCopy.identityReview.changes){const ref=oracle.rows.find(r=>r.id===c.from.id).migrationCandidates.find(r=>r.id===c.to.id);assert.equal(c.to.name,ref.name);assert.equal(c.technicalSource.sourceSha256,ref.sourceSha256);assert.equal(c.technicalSource.sourceCommit,ref.sourceCommit);}
 });
 await test('The exported JSON normalizes through the actual existing importer with all zones and context intact',()=>{
  const imported=W.YGOFormatEditor.normalize(JSON.stringify(baselineCopy));assert.deepEqual(plain(imported.deckState),plain(baselineCopy.deckState));assert.deepEqual(plain(imported.formatContext),plain(baselineSource.deck.formatContext));assert.equal(imported.fmt,baselineSource.deck.fmt);assert.equal(imported.name,baselineSource.deck.name);assert.equal(imported.arch,baselineSource.deck.arch);assert.equal(imported.date,baselineSource.deck.date);assert(W.YGOUIState.validateSession(imported));assert.equal(R.verify(plain(baselineCopy),{source:baselineSource}).pass,true);
 });
 await test('Merged families above three remain present and carry diagnostic incidents without legality claims',()=>{
  const audit=baselineCopy.identityReview.audit;assert(audit.issues.some(x=>x.reason==='ALIAS_FAMILY_OVER_THREE'&&x.canonicalId===mainTarget&&x.qty===5));assert.equal(audit.certified,false);assert.equal(audit.officialLegalityCertified,false);assert.equal(baselineCopy.identityReview.officialIdentityCertified,false);assert.equal(baselineCopy.identityReview.competitiveCertified,false);assert.equal(baselineCopy.identityReview.competitiveScoreStatus,'PROVISIONAL_BY_USER_REQUEST');
 });
 await test('Source, choices, output, active deck, actual engine state and goal are detached across successful and failed decisions',()=>{
  W.YGOComboLab={state:make(base),goal:copy(base.goal)};W.__reviewGoal=copy(base.goal);const originalDeck=W.deckState,originalLab=W.YGOComboLab,choices=[{fromId:sourceMain,toId:mainTarget}],saved=before(),source=R.captureSource(),result=R.buildCopy(source,choices);result.deckState.main[0].qty=59;result.identityReview.source.deck.name='Changed export';choices[0].toId=extraTarget;source.deck.name='Changed external snapshot';rejects(()=>R.buildCopy(source,choices));assert.equal(before(),saved);assert.equal(W.deckState,originalDeck);assert.equal(W.YGOComboLab,originalLab);
 });
 await test('Malformed, duplicate, unknown, absent and invented candidate choices are rejected transactionally',()=>{
  const saved=before(),source=R.captureSource();for(const value of [null,{},'auto',[null],[{fromId:String(sourceMain),toId:mainTarget}],[{fromId:sourceMain,toId:String(mainTarget)}],[{fromId:NaN,toId:mainTarget}],[{fromId:sourceMain,toId:mainTarget,auto:true}],[{fromId:sourceMain,toId:mainTarget},{fromId:sourceMain,toId:mainTarget}],[{fromId:sourceMain,toId:999999999999}],[{fromId:999999999999,toId:mainTarget}],[{fromId:100293099,toId:mainTarget}],[{fromId:sourceMain,toId:sourceMain}],[{fromId:sourceMain,toId:extraTarget}]])rejects(()=>R.buildCopy(source,value));assert.equal(before(),saved);
 });
 await test('Executable properties and sparse or non-JSON values cannot become review decisions or source data',()=>{
  const source=R.captureSource(),decision={fromId:sourceMain};let called=false;Object.defineProperty(decision,'toId',{enumerable:true,get(){called=true;return mainTarget}});rejects(()=>R.buildCopy(source,[decision]),'INVALID_JSON');assert.equal(called,false);const sparse=[];sparse.length=1;rejects(()=>R.buildCopy(source,sparse),'INVALID_JSON');for(const x of [new Date(),new Map(),undefined,Infinity]){const mutated=copy(source);mutated.deck.formatContext.bad=x;rejects(()=>R.buildCopy(mutated,[]));}
 });
 await test('A full source fingerprint binds quantities, all zones, name, build, format and declared context',()=>{
  for(const mutate of [s=>s.deck.deckState.main[0].qty++,s=>s.deck.deckState.side.push({id:mainTarget,qty:1}),s=>s.deck.name+=' changed',s=>s.deck.formatContext.event={id:'changed'},s=>s.binding.buildId='another-build',s=>s.binding.catalogSha256='invented',s=>s.deck.fmt='OCG']){const source=copy(baselineSource);mutate(source);rejects(()=>R.buildCopy(source,[{fromId:sourceMain,toId:mainTarget}]));}
 });
 await test('Changes to the live deck or semantic context invalidate old source snapshots without mutating them',()=>{
  const source=R.captureSource(),saved=plain(source);W.deckState.side[0].qty=2;rejects(()=>R.buildCopy(source,[]),'STALE_SOURCE');W.deckState.side[0].qty=1;W.YGOUIState.setFormatContext({format:'tcg',event:{id:'new-event'}});rejects(()=>R.buildCopy(source,[]),'STALE_SOURCE');W.YGOUIState.setFormatContext({format:'tcg'});assert.deepEqual(plain(source),saved);assert.equal(R.verify(baselineCopy).pass,true);
 });
 await test('Main and Extra incompatibility is rejected without automatic movement or source repair',()=>{
  const mainWrong=compact(base.deck);mainWrong.main[0]={id:sourceExtra,qty:1};setDeck(mainWrong);const mainSource=R.captureSource(),saved=before();rejects(()=>R.buildCopy(mainSource,[{fromId:sourceExtra,toId:extraTarget}]),'ZONE_INCOMPATIBLE');assert.equal(before(),saved);
  const extraWrong=compact(base.deck);extraWrong.extra=[{id:sourceMain,qty:1}];setDeck(extraWrong);rejects(()=>R.buildCopy(R.captureSource(),[{fromId:sourceMain,toId:mainTarget}]),'ZONE_INCOMPATIBLE');setDeck(reviewedDeck());
 });
 await test('Ambiguous technical token proposals retain every candidate and no manual choice makes Tokens deckable',()=>{
  const deck=compact(base.deck);deck.main[0]={id:ambiguous,qty:1};setDeck(deck);const source=R.captureSource(),rows=R.proposals(source),row=rows.find(p=>p.id===ambiguous);assert.deepEqual(row.candidates.map(c=>c.id).sort((a,b)=>a-b),[21770261,79387393]);const unselected=R.buildCopy(source,[]);assert(unselected.deckState.main.some(r=>r.id===ambiguous));assert.equal(unselected.identityReview.changes.length,0);for(const c of row.candidates)rejects(()=>R.buildCopy(source,[{fromId:ambiguous,toId:c.id}]),'ZONE_INCOMPATIBLE');setDeck(reviewedDeck());
 });
 await test('Recognized identity-specific evidence is retained for kept IDs and explicitly omitted for a changed ID',()=>{
  const deck=reviewedDeck();deck.main[0].speedDuelPrintVerified=true;deck.main[0].releaseDates={tcg:'2000-01-01'};deck.main[0].constructionEvidence={declared:'old identity'};deck.main[2].legend=false;W.deckState=copy(deck);const source=R.captureSource(),result=R.buildCopy(source,[{fromId:sourceMain,toId:mainTarget}]);const change=result.identityReview.changes.find(c=>c.zone==='main');assert.deepEqual([...change.omittedIdentityEvidence].sort(),['constructionEvidence','releaseDates','speedDuelPrintVerified'].sort());const target=result.deckState.main.find(r=>r.id===mainTarget);assert(!('speedDuelPrintVerified'in target));assert(!('releaseDates'in target));assert.equal(result.deckState.main.find(r=>r.id===deck.main[2].id).legend,false);assert.equal(W.deckState.main[0].speedDuelPrintVerified,true);setDeck(reviewedDeck());
 });
 await test('Conflicting evidence on converging rows is not silently dropped or promoted to the candidate',()=>{
  const deck=reviewedDeck();deck.main[1].constructionEvidence={for:'already present target'};W.deckState=copy(deck);const source=R.captureSource(),saved=before();rejects(()=>R.buildCopy(source,[{fromId:sourceMain,toId:mainTarget}]),'MERGE_EVIDENCE_CONFLICT');assert.equal(before(),saved);setDeck(reviewedDeck());
 });
 await test('Format context and independent Skills round-trip through the existing normalizer',()=>{
  const skill=(awaitRows()).find(r=>Number(r[3])===0x8000000&&r[6]==='cards-skills.cdb');assert(skill);const context={format:'speedDuel',event:{id:'declared-copy-event',sideMax:6,requiresBanlist:false},skill:{id:skill[0],note:'Declaración preservada'},skillConstructionVerified:false,extraDeckLimit:6,banlistVersion:'declared-version'};
  setDeck({main:[{id:sourceMain,qty:1},{id:89631139,qty:19}],extra:[],side:[],skills:[{id:Number(skill[0]),qty:1}]},context);const source=R.captureSource(),result=R.buildCopy(source,[{fromId:sourceMain,toId:mainTarget}]),normalized=W.YGOFormatEditor.normalize(JSON.stringify(result));assert.deepEqual(plain(normalized.formatContext),context);assert.deepEqual(plain(normalized.deckState.skills),[{id:Number(skill[0]),qty:1}]);assert.equal(normalized.fmt,'speedDuel');assert.equal(result.identityReview.audit.officialLegalityCertified,false);assert.equal(R.verify(result,{source}).pass,true);setDeck(reviewedDeck());
 });
 function awaitRows(){return JSON.parse(read('src/data/cards.json'));}
 await test('Reverification recomputes copy IDs, quantities, source decisions, provenance, summary, context and audit',()=>{
  const mutations=[r=>r.deckState.main[0].id=89631139,r=>r.deckState.main[0].qty++,r=>r.identityReview.selections.pop(),r=>r.identityReview.changes[0].to.id=extraTarget,r=>r.identityReview.changes[0].technicalSource.sourceSha256='forged',r=>r.identityReview.beforeCounts.main++,r=>r.identityReview.audit.issues=[],r=>r.formatContext.event={id:'forged'},r=>r.identityReview.source.deck.deckState.main[0].qty++,r=>r.identityReview.source.fingerprint='forged',r=>r.identityReview.officialIdentityCertified=true,r=>r.identityReview.competitiveScoreStatus='CERTIFIED',r=>r.deckState.skills=[{id:301262144,qty:1}]];
  for(const mutate of mutations){const forged=copy(baselineCopy);mutate(forged);assert.equal(R.verify(forged,{source:baselineSource}).pass,false);}
  assert.equal(R.verify(baselineCopy,{source:baselineSource}).pass,true);assert.equal(R.verify(baselineCopy,{source:{...baselineSource,binding:{}}}).pass,false);assert.equal(R.verify(baselineCopy,{acceptAnything:true}).pass,false);
 });
 await test('A candidate-valid edited source and recomputed fingerprint still fail against the expected original source',()=>{
  const forged=copy(baselineCopy);forged.identityReview.source.deck.deckState.main[0].qty=2;
  // Use a captured, internally consistent source for the alternative quantity.
  const deck=reviewedDeck();deck.main[0].qty=2;setDeck(deck);const alternative=R.captureSource(),other=R.buildCopy(alternative,[{fromId:sourceMain,toId:mainTarget},{fromId:sourceExtra,toId:extraTarget}]);assert.equal(R.verify(other,{source:baselineSource}).pass,false);setDeck(reviewedDeck());assert.equal(R.verify(other).pass,false);assert.equal(R.verify(baselineCopy).pass,true);
 });
 await test('Presentation edits and externally modified proposals cannot invent candidates or alter the immutable preview names',()=>{
  const proposal=R.proposals(baselineSource)[0];proposal.candidates.push({id:89631139,name:'Invented'});const mutable=W.YGODataCatalog.lookup(mainTarget),saved=copy(mutable);try{mutable.name='Injected display name';mutable.typeBits=0x40;const result=R.buildCopy(baselineSource,[{fromId:sourceMain,toId:mainTarget}]);assert.equal(result.identityReview.changes[0].to.name,oracle.rows.find(r=>r.id===sourceMain).migrationCandidates[0].name);rejects(()=>R.buildCopy(baselineSource,[{fromId:sourceMain,toId:89631139}]),'CANDIDATE_NOT_LISTED');}finally{for(const k of Object.keys(mutable))delete mutable[k];Object.assign(mutable,saved);}
 });
 await test('Build or inventory changes fail closed while source and catalogue diagnostics remain read-only',()=>{
  const build=W.YGO_BUILD_MANIFEST.buildId;W.YGO_BUILD_MANIFEST.buildId='changed';try{rejects(()=>R.buildCopy(baselineSource,[]),'STALE_CATALOGUE');assert.equal(R.verify(baselineCopy,{source:baselineSource}).pass,false);}finally{W.YGO_BUILD_MANIFEST.buildId=build;}const card=W.CARD_CATALOG.pop();try{rejects(()=>R.captureSource(),'STALE_CATALOGUE');}finally{W.CARD_CATALOG.push(card);}assert.equal(W.YGODataQuality.report().pass,true);assert.equal(R.verify(baselineCopy,{source:baselineSource}).pass,true);
 });
 await test('The final UTF-8 JSON copy cannot exceed the actual existing 4 MiB file import limit',()=>{
  // The compact source remains below 4 MiB, but the reviewed export repeats its
  // source/context/provenance and would exceed the file selector's byte limit.
  const savedName=text.name.value;try{text.name.value='界'.repeat(500000);const source=R.captureSource();assert(Buffer.byteLength(JSON.stringify(source.deck),'utf8')<4*1024*1024);rejects(()=>R.buildCopy(source,[{fromId:sourceMain,toId:mainTarget}]),'COPY_TRANSPORT_TOO_LARGE');}finally{text.name.value=savedName;}assert(Buffer.byteLength(JSON.stringify(baselineCopy,null,2),'utf8')<4*1024*1024);
 });
 await test('Backend-only use exposes no prepared browser download and does not apply any copy',()=>{
  assert.equal(R.report(),null);rejects(()=>R.exportReport(),'NO_REVIEWED_COPY');rejects(()=>R.download(),'NO_REVIEWED_COPY');const unchanged=JSON.stringify(W.deckState);assert.equal(R.refresh(),null);assert.equal(JSON.stringify(W.deckState),unchanged);
 });
 const result={schema:'ygo-deck-identity-review-tests/v1',pass:tests.every(t=>t.pass),total:tests.length,tests,limitations:['Technical exact-name candidates are not official passcode equivalence, release or ruling certification.','The copy workflow does not mutate or replace the active deck, catalogue, laboratory state, goal or competitive scoring.','Source comparison is an explicit data binding, not a cryptographic authorship signature; actual browser downloads/file imports and stale controls are tested in GUI15.']};
 fs.writeFileSync(path.join(ROOT,'tests/deck-identity-review-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));if(!result.pass)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});

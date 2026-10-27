'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {harness,ROOT}=require('./combo_engine.cjs');
(async()=>{
 const {W,E,fixture}=await harness(true),copy=structuredClone,tests=[];
 for(const module of ['duel-phases','responses','archetypes-expanded','blue-eyes-duel'])vm.runInNewContext(fs.readFileSync(path.join(ROOT,'src/app/'+module+'.js'),'utf8'),{window:W,structuredClone,console});
 let format='tcg',context={format:'tcg',cardPool:{status:'DECLARED'}},contextVersion=4;
 W.YGOAlpha973={activeFormatKey:()=>format};W.YGOUIState={ready:Promise.resolve(),getFormatContext:()=>copy(context),get contextVersion(){return contextVersion}};
 vm.runInNewContext(fs.readFileSync(path.join(ROOT,'src/app/coverage.js'),'utf8'),{window:W,structuredClone,console});
 const C=W.YGOCardCoverage;assert(await C.ready);
 const test=async(name,fn)=>{try{await fn();tests.push({name,pass:true});}catch(error){tests.push({name,pass:false,error:error.stack});}};
 const deck=(main=[],extra=[],side=[],skills=[])=>({main,extra,side,skills}),row=(report,id,zone='main')=>report.entries.find(x=>x.id===id&&x.zone===zone),has=(entry,id)=>entry.actions.some(a=>a.id===id);
 const input=copy(fixture('Invoked').deck),frozen=copy(input),deepFreeze=x=>{if(x&&typeof x==='object'){Object.freeze(x);for(const value of Object.values(x))deepFreeze(value);}return x;};
 await test('Real Invoked deck keeps technical data separate from its partial registered actions',()=>{
  const before=JSON.stringify(input),r=C.report(deepFreeze(input));assert.equal(JSON.stringify(input),before);assert.equal(r.pass,true);assert.equal(r.counts.totalCopies,42);assert.equal(row(r,86120751).technicalData.status,'TECHNICAL_SOURCE_MATCHED');assert(has(row(r,86120751),'ALEISTER_SEARCH'));assert.equal(row(r,86120751).actionCoverage,'PARTIAL_REGISTERED_ACTIONS');assert.equal(r.completeCardRules,false);assert.equal(r.certified,false);assert.equal(r.competitiveCertified,false);
 });
 await test('Blue-Eyes, Tenyi and Salamangreat report actual registered source effects',()=>{
  const r=C.report(deck([83994433,59822133,87052196,65124425,26889158,51339637].map(id=>({id,qty:1})),[{id:14812471,qty:1}]));
  for(const [id,action]of [[83994433,'STARDUST_SPARK_PROTECTION'],[59822133,'SPIRIT'],[87052196,'TENYI_ASHUNA_DECK'],[65124425,'TENYI_VESSEL'],[26889158,'SALAMANGREAT_GAZELLE_SEND'],[51339637,'SALAMANGREAT_ROAR_SET_FROM_GY']])assert(has(row(r,id),action),String(id));
  assert(has(row(r,51339637),'ROAR'));assert(has(row(r,26889158),'SALAMANGREAT_GAZELLE_HAND'));assert(has(row(r,14812471,'extra'),'SALAMANGREAT_BALELYNX'));assert.equal(row(r,14812471,'extra').actions.find(a=>a.id==='SALAMANGREAT_BALELYNX').registration,'DESTRUCTION_REPLACEMENT');assert(row(r,51339637).notes.some(x=>x.includes('límite de uso')));
 });
 await test('Albaz summon, Artemis summon and Chengying summon do not claim complete source effects',()=>{
  const r=C.report(deck([{id:68468459,qty:1}],[{id:34755994,qty:1},{id:96633955,qty:1}]));
  for(const [id,zone]of [[68468459,'main'],[34755994,'extra'],[96633955,'extra']]){assert.equal(row(r,id,zone).actionCoverage,'REGISTERED_SUMMON_ONLY');assert(!row(r,id,zone).actions.some(a=>a.kind==='EFFECT'));}
  assert(row(r,68468459).notes.some(x=>x.includes('declina')));
 });
 await test('Safe-cost membership and catalogue metadata never manufacture a card effect',()=>{
  const r=C.report(deck([{id:14934922,qty:2},{id:38033121,qty:1}]));for(const entry of r.entries){assert.equal(entry.technicalData.status,'TECHNICAL_SOURCE_MATCHED');assert.equal(entry.actionCoverage,'NO_REGISTERED_CARD_ACTIONS');assert.equal(entry.actions.length,0);}assert.equal(r.counts.noRegisteredActionCopies,3);
 });
 await test('Printed Normals get basic transport actions separately from specific effects',()=>{
  const r=C.report(deck([{id:89631139,qty:3}],[{id:89631139,qty:1}]));assert.equal(row(r,89631139).actionCoverage,'BASIC_NORMAL_ACTIONS_ONLY');assert(has(row(r,89631139),'DUEL_NORMAL_SUMMON_OR_SET'));assert.equal(row(r,89631139,'extra').actions.length,0);assert.equal(r.counts.basicOnlyCopies,3);assert.equal(r.counts.specificActionCopies,0);
 });
 await test('Unknown and invalid passcodes remain diagnostic without assumed actions',()=>{
  const r=C.report(deck([{id:9999999999999,qty:2},{id:'not-a-passcode',qty:1}]));assert.equal(row(r,9999999999999).technicalData.status,'UNKNOWN_PASSCODE');assert.equal(row(r,9999999999999).actions.length,0);assert.equal(r.entries[1].technicalData.status,'INVALID_PASSCODE');assert.equal(r.entries[1].id,null);assert.equal(r.counts.totalCopies,2);assert.equal(r.inputValid,false);assert.doesNotThrow(()=>JSON.stringify(r));
 });
 await test('Canonical alias families retain distinct passcodes and physical quantities',()=>{
  const mapped=new Set(C.registry().map(x=>x.id)),aliases=Object.keys(W.YGODataCatalog.manifest.aliases).map(Number).filter(id=>W.YGODataCatalog.lookup(id)&&mapped.has(W.YGODataCatalog.canonicalIdentity(id).canonicalId));assert(aliases.length,'The real catalogue must provide an alias to a registered identity');
  const alias=aliases[0],canonical=W.YGODataCatalog.canonicalIdentity(alias).canonicalId,r=C.report(deck([{id:alias,qty:2},{id:canonical,qty:1}]));assert.equal(r.counts.uniqueIds,2);assert.equal(r.counts.aliasFamilies,1);assert.equal(r.counts.totalCopies,3);assert.equal(row(r,alias).canonicalId,canonical);assert.deepEqual(JSON.parse(JSON.stringify(row(r,alias).actions)),JSON.parse(JSON.stringify(row(r,canonical).actions)));
 });
 await test('Duplicate rows are counted as declared copies and exposed rather than silently removed',()=>{
  const r=C.report(deck([{id:86120751,qty:2},{id:86120751,qty:1}]));assert.equal(r.counts.totalCopies,3);assert.equal(r.counts.uniqueIds,1);assert.equal(r.counts.specificActionCopies,3);assert(r.issues.some(x=>x.code==='DUPLICATE_ID_ROW'));assert.equal(r.entries.length,2);
 });
 await test('Invalid quantities never turn into a default copy or a partial probability',()=>{
  const values=[0,-1,NaN,Infinity,1.5,null,'bad',1001],r=C.report(deck(values.map(qty=>({id:86120751,qty}))));assert.equal(r.counts.totalCopies,0);assert.equal(r.counts.invalidEntries,values.length);assert(r.entries.every(x=>x.quantity===null&&x.issues.includes('INVALID_QUANTITY')));assert.equal(r.inputValid,false);assert.doesNotThrow(()=>JSON.stringify(r));
 });
 await test('Source evidence, stats, token, Extra and prerelease guards constrain generic Normal actions',()=>{
  const catalog=W.YGODataCatalog,base=catalog.rulesCard(89631139),changes=[{technicalSourceMatched:false},{statsKnown:false},{atk:-2},{typeBits:Number(base.typeBits)|0x4000},{typeBits:Number(base.typeBits)|0x40},{typeBits:Number(base.typeBits)|0x1000000},{source:'unofficial.cdb'},{ot:Number(base.ot)|256}];
  try{for(const change of changes){W.YGODataCatalog={...catalog,rulesCard:id=>id===89631139?{...base,...change}:catalog.rulesCard(id)};const r=C.report(deck([{id:89631139,qty:1}]));assert.equal(r.entries[0].actions.length,0,JSON.stringify(change));}}finally{W.YGODataCatalog=catalog;}
 });
 await test('Skills are separated even when a known action identity is accidentally put in their zone',()=>{
  const skill=W.CARD_CATALOG.find(c=>(Number(c.typeBits)&0x8000000)!==0);assert(skill,'Real Skill catalogue row required');const r=C.report(deck([{id:skill.id,qty:1}],[],[],[{id:86120751,qty:1}]));assert(r.entries.every(x=>x.actionCoverage==='SKILL_OUTSIDE_CAUSAL_ENGINE'&&x.actions.length===0));assert.equal(r.counts.skillsCopies,2);assert(r.issues.some(x=>x.code==='SKILL_OUTSIDE_SKILLS_ZONE'));
 });
 await test('Missing handlers and providers cannot be advertised by the declarative mapping',()=>{
  const engine=W.YGOComboEngine,caps=engine.capabilities();try{W.YGOComboEngine={...engine,capabilities:()=>({...caps,handlers:[],responseProviders:[],duelPhases:{...(caps.duelPhases||{}),destructionReplacementProviders:[]},opponentPolicies:[]})};const r=C.report(deck([{id:86120751,qty:1},{id:14558127,qty:1},{id:83994433,qty:1},{id:89631139,qty:1}],[{id:14812471,qty:1}]));assert(r.entries.every(x=>x.actions.length===0));assert.equal(r.counts.specificActionCopies,0);assert.equal(r.counts.basicOnlyCopies,0);}finally{W.YGOComboEngine=engine;}
 });
 await test('Ash is recognized through its real native policy rather than a nonexistent provider',()=>{
  assert(!E.capabilities().responseProviders.includes('ASH'));const r=C.report(deck([{id:14558127,qty:1}])),ash=row(r,14558127).actions.find(x=>x.id==='ASH_EXPLICIT');assert(ash);assert.equal(ash.registration,'NATIVE_POLICY');
 });
 await test('Mutable presentation objects cannot promote unknown effects into basic Normal support',()=>{
  const card=W.YGODataCatalog.lookup(38033121),saved=copy(card);try{card.typeBits=17;card.level=4;card.technicalSourceMatched=true;card.statsKnown=true;const r=C.report(deck([{id:38033121,qty:1}]));assert.equal(r.entries[0].actions.length,0);}finally{for(const key of Object.keys(card))delete card[key];Object.assign(card,saved);}
 });
 await test('Report context is fresh and non-TCG formats are explicitly outside the causal model',()=>{
  const r=C.report(frozen);assert.equal(r.format,'tcg');assert.equal(r.formatContextVersion,4);format='masterduel';context={format:'masterduel',cardPool:{status:'OTHER'}};contextVersion=5;const next=C.report(frozen);assert.equal(next.format,'masterduel');assert.equal(next.applicableInCurrentFormat,false);assert(next.entries.every(x=>x.applicableInCurrentFormat===false));assert.equal(next.formatContextVersion,5);assert.equal(r.formatContext.cardPool.status,'DECLARED');format='tcg';context={format:'tcg',cardPool:{status:'DECLARED'}};contextVersion=4;
 });
 await test('Export snapshots include build and catalogue identity without a coverage or project percentage',()=>{
  const r=C.exportReport(frozen);assert.equal(r.schema,'ygo-card-action-coverage/v1');assert.equal(r.buildId,W.YGO_BUILD_MANIFEST.buildId);assert.equal(r.catalogSha256,W.YGO_BUILD_MANIFEST.catalogSha256);assert(!Object.hasOwn(r,'percentage'));assert(!Object.hasOwn(r,'winRate'));assert.equal(r.completeCardRules,false);assert.equal(r.entries.every(x=>x.isCurrentLegalMove===false),true);
 });
 await test('Mutating exported mapping or report snapshots never changes later reports',()=>{
  const registry=C.registry(),r=C.report(deck([{id:86120751,qty:1}]));registry[0].actions.length=0;r.entries[0].actions.length=0;r.formatContext.cardPool.status='FORGED';const next=C.report(deck([{id:86120751,qty:1}]));assert(has(next.entries[0],'ALEISTER_SEARCH'));assert.equal(next.formatContext.cardPool.status,'DECLARED');
 });
 await test('All zones remain inventoried while aggregate categories conserve valid declared copies',()=>{
  const r=C.report(deck([{id:86120751,qty:2},{id:89631139,qty:3},{id:14934922,qty:1}],[{id:34755994,qty:1}],[{id:14558127,qty:1}],[{id:86120751,qty:1}])),c=r.counts;
  assert.equal(c.totalCopies,9);assert.equal(c.specificActionCopies+c.summonOnlyCopies+c.basicOnlyCopies+c.noRegisteredActionCopies+c.skillsCopies,c.totalCopies);assert.equal(c.technicalMatchedCopies+c.unresolvedTechnicalCopies,c.totalCopies);assert.equal(r.zones.side.copies,1);assert.equal(r.zones.skills.copies,1);
 });
 await test('Malformed zones, non-object rows and oversized input remain explicit diagnostic failures',()=>{
  assert.equal(C.report(null).pass,false);const malformed=C.report({main:'bad',extra:[null]});assert(malformed.issues.some(x=>x.code==='ZONE_NOT_ARRAY'));assert(malformed.issues.some(x=>x.code==='ENTRY_NOT_OBJECT'));const huge=C.report(deck(Array.from({length:1001},()=>({id:86120751,qty:1}))));assert.equal(huge.partial,true);assert.equal(huge.pass,false);assert.equal(huge.entries.length,1000);assert.equal(huge.expectedEntries,1001);assert(huge.issues.some(x=>x.code==='DECK_ENTRY_LIMIT'));
 });
 const result={schema:'ygo-card-coverage-tests/v1',pass:tests.every(x=>x.pass),total:tests.length,tests};fs.writeFileSync(path.join(ROOT,'tests/coverage-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));if(!result.pass)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});

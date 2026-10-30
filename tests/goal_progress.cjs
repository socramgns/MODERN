'use strict';
/* Progress is a description of a supplied state, not a played combo or a
 * competitive result. Malformed UID/visibility fixtures below test the public
 * assessment boundary only. Actual routes use the shipped physical Field Spell
 * scenario, its legal construction quantities and fresh engine replay. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const {harness,ROOT}=require('./combo_engine.cjs');
const copy=structuredClone;
const I={MAUSOLEUM:24382602,SANCTUARY:1295111,ROAR:51339637,WOLF:87871125,
 MONSTER:89631139,ALIAS:511002490,CANONICAL:44256816};

(async()=>{
 const {W,E}=await harness(true),tests=[];
 const load=(name,extra={})=>vm.runInNewContext(fs.readFileSync(path.join(ROOT,'src/app/'+name+'.js'),'utf8'),
  {window:W,structuredClone,console,Date,Promise,setTimeout,clearTimeout,performance,...extra},{filename:name+'.js'});
 for(const name of ['duel-phases','responses','archetypes-expanded','blue-eyes-duel','strategy','recommendations','scenario-examples'])load(name);
 const R=W.YGORecommendations;
 async function test(name,fn){try{await fn();tests.push({name,pass:true});}catch(error){tests.push({name,pass:false,error:error.stack});}}
 await test('Recommendations expose state progress before a workbench or browser is present',()=>{
  assert.equal(W.YGOComboWorkbench,undefined);assert.equal(typeof R.goalProgress,'function');
  const p=R.goalProgress({phase:'MAIN 1'},{phase:'MAIN 1'});
  assert.equal(p.schema,'ygo-goal-progress/v1');assert.equal(p.achieved,true);
 });
 const document={readyState:'loading',getElementById:()=>null,addEventListener:()=>{}};
 load('combo-workbench',{document});const C=W.YGOComboWorkbench;
 const item=(id,uid,faceUp)=>({uid,card:W.YGODataCatalog.rulesCard(id),...(faceUp===undefined?{}:{faceUp})});
 const blank=()=>({zones:[{monster:[],spelltrap:[],hand:[],gy:[],banished:[]},{monster:[],spelltrap:[],hand:[],gy:[],banished:[]}],lp:[8000,8000],phase:'MAIN 1',turn:2,activePlayer:0});
 const canonical=id=>Number(W.YGODataCatalog.canonicalIdentity(id)?.canonicalId??id);
 function assess(st,g){
  const before=JSON.stringify(st),goalBefore=JSON.stringify(g),a=C.goalProgress(st,g),b=R.goalProgress(st,g);
  assert.equal(JSON.stringify(a),JSON.stringify(b),'Workbench and recommendation assessments diverged');
  assert.equal(a.schema,'ygo-goal-progress/v1');assert.equal(a.achieved,C.goalMatches(st,C.validateGoal(g)));
  assert.equal(a.achieved,R.goalMatches(st,R.validateGoal(g)));
  assert.equal(JSON.stringify(st),before,'Assessment changed its supplied state');assert.equal(JSON.stringify(g),goalBefore,'Assessment changed the goal');
  assert.equal(a.totals.totalRequirements,a.requirements.length);
  assert.equal(a.totals.fulfilledRequirements,a.requirements.filter(row=>row.fulfilled).length);
  const cards=a.requirements.filter(row=>row.kind==='CARD');
  assert.equal(a.totals.requiredCopies,cards.reduce((sum,row)=>sum+row.required,0));
  assert.equal(a.totals.matchedCopies,cards.reduce((sum,row)=>sum+row.matched,0));
  for(const row of cards){assert.equal(row.missing,row.required-row.matched);assert(row.matched>=0&&row.matched<=row.required);assert.equal(row.fulfilled,row.missing===0);assert.equal(row.matchedUids.length,row.matched);assert.equal(new Set(row.matchedUids).size,row.matched);}
  return a;
 }
 const cardRow=(p,key,id)=>p.requirements.find(row=>row.kind==='CARD'&&row.key===key&&row.cardId===canonical(id));
 await test('Both progress APIs reject empty, unknown, executable and malformed goal definitions',()=>{
  for(const g of [null,[],()=>true,'goal',{}, {requiredFaceUpSpellTrapIds:[]},
   {opponent:'any'}, {requiredSetSpellTrapIds:[I.MONSTER]}, {requiredHandIds:['51339637']},
   {requiredHandIds:Array(21).fill(I.ROAR)}, {ownLpAtLeast:NaN}, {phase:'DAMAGE STEP'},
   {requiredHandIds:[I.ROAR],recoveredHandIds:[I.SANCTUARY]}])
   for(const api of [C,R])assert.throws(()=>api.goalProgress(blank(),g));
 });
 await test('All fourteen physical starting scenarios retain matcher and progress agreement',()=>{
  for(const {id}of W.YGOScenarioExamples.list()){
   const spec=W.YGOScenarioExamples.get(id),st=E.createState(spec);
   assert.equal(W.YGODataCatalog.auditDeck(spec.deck,{format:'tcg',banlist:W.BANLIST_PROFILES.tcg.data}).pass,true);
   assess(st,spec.goal);
   for(const g of [{phase:st.phase},{turn:st.turn},{activePlayer:st.activePlayer},
    {ownLpAtLeast:st.lp[0]},{ownLpAtLeast:st.lp[0]+1},{opponentLpAtMost:st.lp[1]-1}])assess(st,g);
  }
 });
 const spec=W.YGOScenarioExamples.get('field'),initial=E.createState(spec),H=E.helpers;
 await test('The Field guide reports its actual initial card shortfalls without playing an action',()=>{
  const original=JSON.stringify(initial),p=assess(initial,spec.goal);
  assert.equal(p.achieved,false);assert.deepEqual(copy(p.totals),{fulfilledRequirements:1,totalRequirements:3,matchedCopies:1,requiredCopies:3});
  assert.equal(cardRow(p,'requiredFieldIds',I.WOLF).matched,1);
  assert.equal(cardRow(p,'requiredHandIds',I.ROAR).missing,1);
  assert.equal(cardRow(p,'requiredFaceUpSpellTrapIds',I.SANCTUARY).missing,1);
  assert.equal(JSON.stringify(initial),original);assert.equal(initial.context.initialHistoryCertified,false);
 });
 await test('A declared initial Mausoleum and Set Roar satisfy the state without generating a replay',()=>{
  const p=assess(initial,{requiredFaceUpSpellTrapIds:[I.MAUSOLEUM],requiredSetSpellTrapIds:[I.ROAR]});
  assert.equal(p.achieved,true);assert.equal(p.totals.fulfilledRequirements,2);assert.equal(p.totals.matchedCopies,2);
  assert.equal(cardRow(p,'requiredFaceUpSpellTrapIds',I.MAUSOLEUM).faceUp,true);
  assert.equal(cardRow(p,'requiredSetSpellTrapIds',I.ROAR).faceUp,false);
  assert.equal('replay' in p,false);assert.equal('actions' in p,false);
 });
 await test('Field Spells and ordinary Spell/Trap rows use the same own physical zone',()=>{
  const p=assess(initial,{requiredFaceUpSpellTrapIds:[I.MAUSOLEUM],requiredSetSpellTrapIds:[I.ROAR]});
  for(const row of p.requirements)assert.equal(row.zone,'spelltrap');
  assert.equal(initial.zones[0].spelltrap.find(x=>H.card(x).id===I.MAUSOLEUM).fieldSpell,true);
  assert.equal(cardRow(p,'requiredFaceUpSpellTrapIds',I.MAUSOLEUM).matchedUids[0],initial.zones[0].spelltrap.find(x=>H.card(x).id===I.MAUSOLEUM).uid);
 });
 await test('Canonical aliases group requested quantities while preserving the physical shortage',()=>{
  const st=blank();st.zones[0].spelltrap.push(item(I.ALIAS,'alias-copy',true));
  let p=assess(st,{requiredFaceUpSpellTrapIds:[I.ALIAS,I.CANONICAL]});
  assert.equal(p.requirements.length,1);let row=p.requirements[0];
  assert.equal(row.cardId,I.CANONICAL);assert.equal(row.required,2);assert.equal(row.matched,1);assert.equal(row.missing,1);assert(row.name);
  st.zones[0].spelltrap.push(item(I.CANONICAL,'printed-copy',true));p=assess(st,{requiredFaceUpSpellTrapIds:[I.CANONICAL,I.ALIAS]});
  row=p.requirements[0];assert.equal(p.achieved,true);assert.equal(row.matched,2);assert.equal(row.missing,0);
 });
 await test('Three required copies do not become satisfied by a duplicated physical UID',()=>{
  const st=blank(),row=item(I.ROAR,'only-copy',false);st.zones[0].spelltrap.push(row,copy(row));
  const p=assess(st,{requiredSetSpellTrapIds:[I.ROAR,I.ROAR,I.ROAR]});
  assert.equal(p.requirements[0].matched,1);assert.equal(p.requirements[0].missing,2);assert.equal(p.achieved,false);
 });
 await test('A shared UID cannot satisfy both a hand requirement and a Set requirement',()=>{
  const st=blank();st.zones[0].hand.push(item(I.ROAR,'same-copy'));st.zones[0].spelltrap.push(item(I.ROAR,'same-copy',false));
  const p=assess(st,{requiredHandIds:[I.ROAR],requiredSetSpellTrapIds:[I.ROAR]});
  assert.equal(p.achieved,false);assert.equal(p.totals.requiredCopies,2);assert.equal(p.totals.matchedCopies,1);
  assert.equal(cardRow(p,'requiredHandIds',I.ROAR).matched,1);assert.equal(cardRow(p,'requiredSetSpellTrapIds',I.ROAR).missing,1);
 });
 await test('A physical identity present in contradictory face-up and Set rows is counted only once',()=>{
  const st=blank();st.zones[0].spelltrap.push(item(I.ROAR,'one-card',true),item(I.ROAR,'one-card',false));
  let p=assess(st,{requiredFaceUpSpellTrapIds:[I.ROAR],requiredSetSpellTrapIds:[I.ROAR]});
  assert.equal(p.achieved,false);assert.equal(p.totals.matchedCopies,1);
  st.zones[0].spelltrap[1].uid='second-card';p=assess(st,{requiredFaceUpSpellTrapIds:[I.ROAR],requiredSetSpellTrapIds:[I.ROAR]});
  assert.equal(p.achieved,true);assert.equal(p.totals.matchedCopies,2);
 });
 await test('Exact booleans control visible and Set progress, including undeclared visibility',()=>{
  for(const faceUp of [true,false,undefined,null,1,0]){
   const st=blank();st.zones[0].spelltrap.push(item(I.ROAR,'visibility',faceUp));
   const face=assess(st,{requiredFaceUpSpellTrapIds:[I.ROAR]}),set=assess(st,{requiredSetSpellTrapIds:[I.ROAR]});
   assert.equal(face.achieved,faceUp===true);assert.equal(set.achieved,faceUp===false);
   assert.equal(face.requirements[0].matched,faceUp===true?1:0);assert.equal(set.requirements[0].matched,faceUp===false?1:0);
  }
 });
 await test('Rival cards and own cards in hand, GY or banishment do not fill field requirements',()=>{
  for(const zone of ['hand','gy','banished']){const st=blank();st.zones[0][zone].push(item(I.SANCTUARY,'outside-field',true));const p=assess(st,{requiredFaceUpSpellTrapIds:[I.SANCTUARY]});assert.equal(p.requirements[0].matched,0);}
  const st=blank();st.zones[1].spelltrap.push(item(I.SANCTUARY,'rival',true),item(I.ROAR,'rival-set',false));
  const p=assess(st,{requiredFaceUpSpellTrapIds:[I.SANCTUARY],requiredSetSpellTrapIds:[I.ROAR]});assert.equal(p.totals.matchedCopies,0);
 });
 await test('Legacy monster goals still require face-up monster zone membership',()=>{
  const st=blank();st.zones[0].monster.push(item(I.WOLF,'wolf',false));
  let p=assess(st,{requiredFieldIds:[I.WOLF]});assert.equal(p.requirements[0].zone,'monster');assert.equal(p.requirements[0].faceUp,true);assert.equal(p.achieved,false);
  st.zones[0].monster[0].faceUp=true;p=assess(st,{requiredFieldIds:[I.WOLF]});assert.equal(p.achieved,true);
  st.zones[0].monster=[];st.zones[0].spelltrap.push(item(I.MAUSOLEUM,'field',true));p=assess(st,{requiredFieldIds:[I.MAUSOLEUM]});assert.equal(p.achieved,false);
 });
 await test('Legacy recovered-hand keys remain visible and equal dual aliases are not counted twice',()=>{
  const st=blank();st.zones[0].hand.push(item(I.ALIAS,'recovered'));
  let p=assess(st,{recoveredHandIds:[I.CANONICAL]});assert.equal(p.achieved,true);assert.equal(p.requirements[0].key,'recoveredHandIds');assert.equal(p.requirements[0].zone,'hand');
  p=assess(st,{requiredHandIds:[I.CANONICAL],recoveredHandIds:[I.ALIAS]});assert.equal(p.achieved,true);assert.equal(p.totals.requiredCopies,1);assert.equal(p.requirements.length,1);assert.equal(p.requirements[0].key,'requiredHandIds');
 });
 await test('State requirements report expected and actual values at both LP boundaries',()=>{
  const st=blank(),g={ownLpAtLeast:8000,opponentLpAtMost:8000,turn:2,phase:'MAIN 1',activePlayer:0};
  const p=assess(st,g);assert.equal(p.achieved,true);assert.equal(p.totals.requiredCopies,0);assert.equal(p.totals.matchedCopies,0);assert.equal(p.requirements.length,5);
  for(const row of p.requirements){assert.equal(row.kind,'STATE');assert.equal(row.actual,g[row.key]);assert.equal(row.expected,g[row.key]);assert.equal(row.fulfilled,true);}
  const patches=[{ownLpAtLeast:8001},{opponentLpAtMost:7999},{turn:3},{phase:'END'},{activePlayer:1}];
  for(const patch of patches){const a=assess(st,{...g,...patch});assert.equal(a.achieved,false);assert.equal(a.totals.fulfilledRequirements,4);const key=Object.keys(patch)[0];assert.equal(a.requirements.find(r=>r.key===key).fulfilled,false);}
 });
 await test('Absent state information stays unfulfilled rather than becoming a fabricated result',()=>{
  const g={requiredFieldIds:[I.WOLF],opponentLpAtMost:8000,phase:'MAIN 1',turn:2,activePlayer:0};
  for(const st of [null,undefined]){
   const p=assess(st,g);assert.equal(p.achieved,false);assert.equal(p.totals.fulfilledRequirements,0);
   for(const row of p.requirements)if(row.kind==='STATE')assert.equal(row.actual,null);
  }
  const p=assess({}, {ownLpAtLeast:1,opponentLpAtMost:8000});assert.equal(p.achieved,false);assert(p.requirements.every(row=>row.actual===null&&!row.fulfilled));
  assert.equal(assess({phase:'MAIN 1'},{phase:'MAIN 1'}).achieved,true);
 });
 await test('Returned progress is an independent snapshot and never mutates a frozen state or goal',()=>{
  const deepFreeze=value=>{if(value&&typeof value==='object'){for(const child of Object.values(value))deepFreeze(child);Object.freeze(value);}return value;};
  const st=deepFreeze(copy(initial)),g=deepFreeze({requiredFaceUpSpellTrapIds:[I.MAUSOLEUM]});
  const p=assess(st,g),expected=JSON.stringify(p);p.requirements[0].matchedUids.push('forged');p.requirements[0].name='forged';p.totals.requiredCopies=999;p.achieved=false;
  assert.equal(JSON.stringify(assess(st,g)),expected);
 });
 await test('Progress has no competitive score, percentage, win-rate, certificate or autoplay result',()=>{
  const p=assess(initial,{requiredFaceUpSpellTrapIds:[I.MAUSOLEUM]});
  for(const key of ['percentage','percent','competitiveScore','winRate','tier','certified','globalOptimalityProven','replay','actions'])assert.equal(Object.hasOwn(p,key),false,key);
 });
 const trace=()=>({before:copy(initial),state:copy(initial),actions:[]});
 const cid=(st,uid)=>Number(H.card(H.locate(st,uid)?.item).id);
 const uid=(st,p,z,id)=>st.zones[p][z].find(x=>Number(H.card(x).id)===id)?.uid;
 function step(t,type,predicate=()=>true){const action=E.enumerate(t.state).find(a=>a.type===type&&predicate(a));assert(action,'Expected '+type);const result=E.execute(t.state,action);assert.equal(result.pass,true,JSON.stringify(result));t.state=result.after;t.actions.push(result.action);return result;}
 function replay(t){const line={before:copy(t.before),after:copy(t.state),state:copy(t.state),actions:copy(t.actions),context:copy(t.before.context),deckFingerprint:E.deckFingerprint(spec.deck)};const proof=E.replay(line,{deck:spec.deck});assert.equal(proof.pass,true,JSON.stringify(proof));return line;}
 await test('Resolving Sanctuary updates the required copy from missing to present with fresh replay',()=>{
  const t=trace(),before=assess(t.state,{requiredFaceUpSpellTrapIds:[I.SANCTUARY]});assert.equal(before.totals.matchedCopies,0);
  step(t,'SALAMANGREAT_ACTIVATE_SANCTUARY',a=>!a.response&&!a.responseUid);
  const after=assess(t.state,{requiredFaceUpSpellTrapIds:[I.SANCTUARY]});assert.equal(after.achieved,true);assert.equal(after.requirements[0].matchedUids[0],uid(t.state,0,'spelltrap',I.SANCTUARY));
  assert.equal(assess(t.state,{requiredFaceUpSpellTrapIds:[I.MAUSOLEUM]}).achieved,false);replay(t);
 });
 await test('The actual Roar counter moves one goal backward while allowing the Field goal to advance',()=>{
  const t=trace(),g={requiredFaceUpSpellTrapIds:[I.SANCTUARY],requiredSetSpellTrapIds:[I.ROAR]};
  assert.equal(assess(t.state,g).totals.matchedCopies,1);
  step(t,'SALAMANGREAT_ACTIVATE_SANCTUARY',a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===1);
  const p=assess(t.state,g);assert.equal(p.achieved,false);assert.equal(p.totals.matchedCopies,1);assert.equal(cardRow(p,'requiredFaceUpSpellTrapIds',I.SANCTUARY).fulfilled,true);assert.equal(cardRow(p,'requiredSetSpellTrapIds',I.ROAR).missing,1);replay(t);
 });
 await test('A negated Field activation remains missing and does not recover the replaced Field goal',()=>{
  const t=trace(),result=step(t,'SALAMANGREAT_ACTIVATE_SANCTUARY',a=>a.response?.type==='MECHABA'&&!a.counterResponses);
  assert.equal(result.action.proof.activationNegated,true);
  const p=assess(t.state,{requiredFaceUpSpellTrapIds:[I.SANCTUARY,I.MAUSOLEUM]});assert.equal(p.achieved,false);assert.equal(p.totals.matchedCopies,0);assert.equal(p.totals.requiredCopies,2);
  assert.equal(H.locate(t.state,uid(t.state,0,'banished',I.SANCTUARY)).zone,'banished');replay(t);
 });
 await test('Recovering and physically Setting the same Roar updates the correct requirements',()=>{
  const t=trace();step(t,'SALAMANGREAT_ACTIVATE_SANCTUARY',a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===1);step(t,'SALAMANGREAT_REINCARNATE_WOLF',a=>a.destination===5);step(t,'SALAMANGREAT_WOLF_RECOVER_ST',a=>cid(t.state,a.targetUid)===I.ROAR);
  assert.equal(assess(t.state,spec.goal).achieved,true);
  const roar=uid(t.state,0,'hand',I.ROAR);assert(roar);assert.equal(assess(t.state,{requiredSetSpellTrapIds:[I.ROAR]}).achieved,false);
  step(t,'DUEL_SET_SPELL_TRAP',a=>a.sourceUid===roar);
  const set=assess(t.state,{requiredFaceUpSpellTrapIds:[I.SANCTUARY],requiredSetSpellTrapIds:[I.ROAR]});assert.equal(set.achieved,true);assert.equal(cardRow(set,'requiredSetSpellTrapIds',I.ROAR).matchedUids[0],roar);
  const hand=assess(t.state,spec.goal);assert.equal(hand.achieved,false);assert.equal(cardRow(hand,'requiredHandIds',I.ROAR).missing,1);replay(t);
 });
 await test('Undo by a recorded before-state recomputes progress and preserves the independent snapshot',()=>{
  const t=trace(),g={requiredFaceUpSpellTrapIds:[I.MAUSOLEUM],requiredSetSpellTrapIds:[I.ROAR]},initialProgress=assess(t.state,g);
  step(t,'SALAMANGREAT_ACTIVATE_SANCTUARY',a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===1);assert.equal(assess(t.state,g).achieved,false);
  const removed=t.actions.pop();t.state=copy(removed.before);assert.equal(JSON.stringify(assess(t.state,g)),JSON.stringify(initialProgress));assert.equal(t.actions.length,0);assert.equal(initialProgress.achieved,true);
 });
 await test('Progress and matcher agree for every observed state in the registered four-step Field route',()=>{
  const t=trace(),goals=[spec.goal,{requiredFaceUpSpellTrapIds:[I.SANCTUARY]},{requiredSetSpellTrapIds:[I.ROAR]},{recoveredHandIds:[I.ROAR]},{phase:'MAIN 1',ownLpAtLeast:8000}];
  const check=()=>goals.forEach(g=>assess(t.state,g));check();
  step(t,'SALAMANGREAT_ACTIVATE_SANCTUARY',a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===1);check();
  step(t,'SALAMANGREAT_REINCARNATE_WOLF',a=>a.destination===5);check();step(t,'SALAMANGREAT_WOLF_RECOVER_ST',a=>cid(t.state,a.targetUid)===I.ROAR);check();step(t,'DUEL_SET_SPELL_TRAP',a=>a.sourceUid===uid(t.state,0,'hand',I.ROAR));check();replay(t);
 });
 const report={schema:'ygo-goal-progress-tests/v1',pass:tests.every(row=>row.pass),total:tests.length,tests};
 fs.writeFileSync(path.join(ROOT,'tests/goal-progress-results.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));if(!report.pass)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});

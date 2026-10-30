'use strict';
/* Real-catalogue source regressions for explicitly hypothetical turn draws.
 * The fixture's shuffle and turn progression are replayed causal actions.
 * This suite does not turn an assumed draw into an observed game event. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const {harness,ROOT}=require('./combo_engine.cjs');
const copy=structuredClone,plain=x=>JSON.parse(JSON.stringify(x));
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const same=(a,b)=>assert.equal(stable(a),stable(b));
const I={ALEISTER:86120751,INVOCATION:74063034,MECHABA:75286621,
  MARMOT:75889523,FISH:23771716,MONKEY:47372349,MOYE:20001443,LONGYUAN:93490856,CHIXIAO:69248256,CED:94192409};

(async()=>{
 const {W,E,fixture}=await harness(true),H=E.helpers,tests=[];
 for(const name of ['duel-phases','responses','archetypes-expanded','blue-eyes-duel','recommendations','draw-continuation'])
  vm.runInNewContext(fs.readFileSync(path.join(ROOT,'src/app/'+name+'.js'),'utf8'),
   {window:W,structuredClone,console,Date,Promise,setTimeout,clearTimeout,performance});
 await Promise.resolve();
 const X=W.YGODrawContinuation;assert(X,'Hypothetical draw continuation module must load');
 async function test(name,fn){try{await fn();tests.push({name,pass:true});}catch(error){tests.push({name,pass:false,error:error.stack});}}
 const controls=a=>Object.fromEntries(Object.entries(a).filter(([k])=>!['before','after','paid','events','proof','witnesses','ashNegated','effectNegated','activationNegated'].includes(k)));
 const uid=(state,p,z,id)=>state.zones[p][z].find(x=>H.baseId(x)===id)?.uid;
 const has=(state,p,z,id)=>state.zones[p][z].filter(x=>H.baseId(x)===id);
 function line(before,state,actions){const value={before:copy(before),after:copy(state),state:copy(state),actions:copy(actions),
  context:copy(before.context),deckFingerprint:before.deckFingerprint,scope:E.version,certified:false,globalOptimalityProven:false};
  value.replay=E.replay(value,{deck:before.provenance.deck});assert.equal(value.replay.pass,true,JSON.stringify(value.replay));return value;}
 function sourceFrom(t,goal={requiredHandIds:[I.MARMOT]},count=t.actions.length){
  const current=count?t.actions[count-1].after:t.initial,scenario=count?line(t.initial,current,t.actions.slice(0,count)):null;
  return{schema:'ygo-advanced-workbench/v1',buildId:W.YGO_BUILD_MANIFEST.buildId,context:plain(X.sourceContext(t.initial)),
   initial:copy(t.initial),current:copy(current),scenario,goal:copy(goal),
   goalProgress:plain(W.YGORecommendations.goalProgress(current,goal)),comparison:null,comparisonInputs:null,
   competitiveScore:null,certified:false};
 }
 function step(t,type,pred=()=>true){const a=E.enumerate(t.state).find(x=>x.type===type&&pred(x));
  assert(a,'Missing '+type+'; actions: '+E.enumerate(t.state).map(x=>x.type));
  const before=stable(t.state),inventory=H.inventory(t.state),r=E.execute(t.state,a);
  assert.equal(r.pass,true,JSON.stringify(r));assert.equal(stable(t.state),before);assert.equal(H.inventory(r.after),inventory);
  t.state=r.after;t.actions.push(r.action);return r;
 }
 function make({swordsoul=false,manualBothPlayers=false,rivalTrap=false}={}){
  const f=copy(fixture('Invoked'));
  if(swordsoul){
   f.deck.main.find(x=>x.id===I.ALEISTER).qty=1;f.deck.main.find(x=>x.id===I.INVOCATION).qty=1;
   f.deck.main.push({id:I.MOYE,qty:2},{id:I.LONGYUAN,qty:2});f.deck.extra.push({id:I.CHIXIAO,qty:1});
   f.openingIds=[I.ALEISTER,I.MOYE,I.LONGYUAN,I.FISH,I.MONKEY];
   f.remainingDeckIds=f.deck.main.flatMap(row=>Array(row.qty).fill(row.id));
   for(const id of f.openingIds)f.remainingDeckIds.splice(f.remainingDeckIds.indexOf(id),1);
  }
  const rival=copy(fixture('Invoked').deck);rival.main=rival.main.filter(x=>![I.ALEISTER,I.INVOCATION].includes(x.id));
  rival.main.push({id:63749102,qty:3},{id:74367458,qty:3});rival.extra=[];
  if(rivalTrap){rival.main[0].qty--;rival.main.push({id:I.CED,qty:1});}
  const opponentOpeningIds=rival.main.slice(0,5).map(x=>x.id),opponentRemainingDeckIds=rival.main.flatMap(x=>Array(x.qty).fill(x.id));
  for(const id of opponentOpeningIds)opponentRemainingDeckIds.splice(opponentRemainingDeckIds.indexOf(id),1);
  for(const deck of [f.deck,rival])assert.equal(W.YGODataCatalog.auditDeck(deck,{format:'tcg',banlist:W.BANLIST_PROFILES.tcg.data}).pass,true);
  const spec={...f,opponentDeck:rival,opponentOpeningIds,opponentRemainingDeckIds,
   context:{...f.context,duelMode:true,opponentPolicy:'PASS',responseTypes:[],manualBothPlayers},
   setup:{turn:2,activePlayer:0,phase:'MAIN 1',placements:rivalTrap?[{player:1,cardId:I.CED,from:'deck',zone:'spelltrap',zoneIndex:0,faceUp:false,setTurn:1}]:[]}};
  const initial=E.createState(spec),t={initial,state:copy(initial),actions:[],spec};
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t.state,0,'hand',I.ALEISTER));step(t,'ALEISTER_SEARCH');
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='END');step(t,'DUEL_NEXT_TURN');step(t,'DUEL_DRAW_FOR_TURN');
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='STANDBY');step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='MAIN 1');
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='END');step(t,'DUEL_NEXT_TURN');
  assert.equal(t.state.turn,4);assert.equal(t.state.activePlayer,0);assert.equal(t.state.phase,'DRAW');
  assert.equal(t.state.deckOrderKnown[0],false);assert.equal(t.state.pendingTriggers.length,0);
  assert.equal(t.state.zones[0].deck.length,34);line(t.initial,t.state,t.actions);return t;
 }
 const base=make(),source=sourceFrom(base),N=source.current.zones[0].deck.length;
 const opts={maxDepth:0,maxStates:300,maxStatesPerBranch:2,maxBranches:60,maxMs:6000};
 let immediate,field,fusion;
 const ratio=(mass,numerator,denominator=N)=>{
  assert.equal(BigInt(mass.numerator),BigInt(numerator));assert.equal(BigInt(mass.denominator),BigInt(denominator));
 };
 function independentDraw(src,branch){
  const after=copy(src.current),original=H.inventory(after),hit=H.locate(after,branch.uid);
  assert.equal(hit.player,0);assert.equal(hit.zone,'deck');const cardId=Number(H.card(hit.item).id);
  const packet={kind:'UNIFORM_UNKNOWN_TURN_DRAW',uid:branch.uid,player:0,cardId,turn:after.turn,phase:'DRAW',
   from:'deck',to:'hand',remainingCopies:after.zones[0].deck.length,
   weight:{numerator:'1',denominator:String(after.zones[0].deck.length)},observedDraw:false,remainingOrderKnown:false,
   assumption:'UNIFORM_RANDOM_PERMUTATION_OF_REMAINING_PHYSICAL_CARDS'};
  same(branch.hypothesis,packet);H.move(after,branch.uid,'hand',{player:0});
  after.duel.drawCompleted[after.turn]=true;after.events.push({type:'HYPOTHETICAL_DRAW_FOR_TURN',...copy(packet)});
  assert.equal(after.deckOrderKnown[0],false);assert.equal(H.inventory(after),original);return after;
 }
 function independentWitness(src,branch){
  assert(branch.witness);let state=independentDraw(src,branch),inventory=H.inventory(state);
  for(const a of branch.witness.actions){same(a.before,state);const result=E.execute(state,controls(a));
   assert.equal(result.pass,true,JSON.stringify(result));same(result.action,a);assert.equal(H.inventory(result.after),inventory);
   assert.equal(result.after.deckOrderKnown[0],false);assert.equal(result.after.turn,src.current.turn);state=result.after;}
  same(state,branch.witness.after);assert.equal(W.YGORecommendations.goalMatches(state,src.goal),true);
  assert.equal(state.pendingTriggers.length,0);assert.equal(branch.witness.replay.pass,true);
  assert.equal(branch.witness.replay.status,'HYPOTHETICAL_CONTINUATION_REPLAY_VALID');
  assert.equal(branch.witness.replay.steps,branch.witness.actions.length);return state;
 }

 await test('The source contains a real nine-action shuffle prefix and two audited physical decks',()=>{
  assert.equal(source.scenario.actions.length,9);assert(source.scenario.actions.some(a=>a.events.some(e=>e.type==='SHUFFLE'&&e.player===0)));
  assert.equal(E.replay(source.scenario,{deck:base.spec.deck}).pass,true);assert.equal(X.validateSource(source).current.phase,'DRAW');
 });
 await test('A single assumed draw branches over every remaining physical copy without changing the source',async()=>{
  const before=stable(source);immediate=await X.analyze(source,opts);assert.equal(immediate.pass,true,JSON.stringify(immediate));
  assert.equal(stable(source),before);assert.equal(immediate.branches.length,N);
  const expected=new Set(source.current.zones[0].deck.map(x=>x.uid)),seen=new Set();
  for(const branch of immediate.branches){assert(expected.has(branch.uid));assert(!seen.has(branch.uid));seen.add(branch.uid);ratio(branch.weight,1);}
  assert.equal(seen.size,N);assert.equal(immediate.summary.remainingCopies,N);
  const unit=immediate.branches.reduce((n,b)=>n+BigInt(b.weight.numerator),0n);assert.equal(unit,BigInt(N));
 });
 await test('The unique Marmot draw has a zero-action conditional witness and exact one-in-34 mass',()=>{
  const branch=immediate.branches.find(b=>b.cardId===I.MARMOT);assert(branch);assert.equal(branch.status,'GOAL_WITNESS');
  assert.equal(branch.witness.actions.length,0);const after=independentWitness(source,branch);
  assert.equal(H.locate(after,branch.uid).zone,'hand');assert.equal(immediate.summary.verifiedSuccesses,1);
  assert.equal(immediate.summary.verifiedFailures,0);assert.equal(immediate.summary.unknown,N-1);
  ratio(immediate.summary.successWeight,1);ratio(immediate.summary.unknownWeight,N-1);
  assert.equal(immediate.summary.identificationInterval.low,1/N);assert.equal(immediate.summary.identificationInterval.high,1);
 });
 await test('Reports identify a hypothetical analysis and never certify an observed draw or competitive win rate',()=>{
  assert.equal(immediate.hypothetical,true);assert.equal(immediate.observedDraw,false);
  assert.equal(immediate.competitiveScore,null);assert.equal(immediate.winRate,null);assert.equal(immediate.summary.winRate,null);
  assert.equal(immediate.certified,false);assert.equal(immediate.globalOptimalityProven,false);
  for(const branch of immediate.branches){assert.equal(branch.hypothesis.observedDraw,false);assert.equal(branch.hypothesis.remainingOrderKnown,false);}
 });
 await test('The ordinary causal engine still refuses an unknown draw and offers no favorable-draw action',()=>{
  const before=stable(source.current);assert(!E.enumerate(source.current).some(a=>/DRAW_FOR_TURN|HYPOTHETICAL_DRAW/.test(a.type)));
  assert.throws(()=>H.draw(copy(source.current),0,1),/DRAW_ORDER_UNKNOWN/);
  assert.equal(E.execute(source.current,{type:'DUEL_HYPOTHETICAL_DRAW_FOR_TURN',player:0,sourceUid:source.current.zones[0].deck[0].uid}).pass,false);
  assert.equal(stable(source.current),before);
 });
 await test('A turn draw hypothesis does not open Droll or mutate its source response windows',()=>{
  const branch=immediate.branches.find(b=>b.witness),after=independentWitness(source,branch);
  for(const key of ['drollWindow','drollWindows','responseWindows'])same(after[key],source.current[key]);
  assert(!after.events.slice(source.current.events.length).some(e=>e.type==='SEARCH'||e.type==='DRAW'||/DROLL/.test(e.type)));
 });
 await test('Each branch can be re-verified freshly, including immediate goals with no fabricated combo step',()=>{
  const result=X.verify(copy(immediate),{source:copy(source)});assert.equal(result.pass,true,JSON.stringify(result));
  same(result.report.summary,immediate.summary);assert.equal(X.verify(copy(immediate)).pass,true);
 });
 await test('The drawn Normal Monster reaches the field through actual Standby, Main and Summon actions',async()=>{
  const src=sourceFrom(base,{requiredFieldIds:[I.MARMOT],phase:'MAIN 1',turn:4,activePlayer:0});
  field=await X.analyze(src,{...opts,maxDepth:3,maxStates:5000,maxStatesPerBranch:120,maxMs:12000});
  assert.equal(field.pass,true,JSON.stringify(field));const branch=field.branches.find(b=>b.cardId===I.MARMOT);
  assert.equal(branch.status,'GOAL_WITNESS');assert.equal(branch.witness.actions.length,3);
  assert.deepEqual(Array.from(branch.witness.actions,a=>a.type),['DUEL_ADVANCE_PHASE','DUEL_ADVANCE_PHASE','NORMAL_SUMMON']);
  const after=independentWitness(src,branch);assert.equal(H.locate(after,branch.uid).zone,'monster');assert.equal(after.phase,'MAIN 1');
  assert.equal(after.normalSummonAvailable[0],false);assert.equal(X.verify(field,{source:src}).pass,true);
 });
 await test('A conditional Fusion continuation preserves real material payments and source-zone consequences',async()=>{
  const src=sourceFrom(base,{requiredFieldIds:[I.MECHABA]});
  fusion=await X.analyze(src,{...opts,maxDepth:4,maxStates:1000,maxStatesPerBranch:300,maxBranches:1,maxMs:10000});
  assert.equal(fusion.pass,true,JSON.stringify(fusion));const branch=fusion.branches.find(b=>b.witness);assert(branch,'Expected a conditional Mechaba witness');
  const action=branch.witness.actions.find(a=>a.type==='INVOCATION_MECHABA');assert(action);
  const after=independentWitness(src,branch);assert.equal(has(after,0,'monster',I.MECHABA).length,1);
  assert.equal(action.paid.filter(p=>p.kind==='FUSION_MATERIAL').length,2);
  for(const paid of action.paid.filter(p=>p.kind==='FUSION_MATERIAL')){
   assert.equal(H.locate(action.before,paid.uid).zone,paid.from);assert.equal(H.locate(action.after,paid.uid).zone,paid.to);
   assert.equal(paid.to,paid.from==='hand'?'gy':'banished');
  }
 });
 await test('Two requested copies cannot be supplied by the one physical Marmot, and absence stays unknown',async()=>{
  const result=await X.analyze(sourceFrom(base,{requiredHandIds:[I.MARMOT,I.MARMOT]}),opts);
  assert.equal(result.pass,true);assert.equal(result.summary.verifiedSuccesses,0);assert.equal(result.summary.verifiedFailures,0);
  assert.equal(result.summary.unknown,N);ratio(result.summary.unknownWeight,N);assert.equal(result.summary.identificationInterval.high,1);
 });
 await test('Scalar goal conditions are evaluated together with the physical card requirement',async()=>{
  const good=await X.analyze(sourceFrom(base,{requiredHandIds:[I.MARMOT],phase:'DRAW',turn:4,activePlayer:0,ownLpAtLeast:8000,opponentLpAtMost:8000}),opts);
  assert.equal(good.summary.verifiedSuccesses,1);const impossible=await X.analyze(sourceFrom(base,{requiredHandIds:[I.MARMOT],ownLpAtLeast:8001}),opts);
  assert.equal(impossible.summary.verifiedSuccesses,0);assert.equal(impossible.summary.verifiedFailures,0);assert.equal(impossible.summary.unknown,N);
 });
 await test('Branch and state budgets preserve all unvisited probability mass instead of calling it failure',async()=>{
  const result=await X.analyze(sourceFrom(base,{ownLpAtLeast:8001}),{...opts,maxBranches:1,maxStates:1});
  assert.equal(result.pass,true);assert.equal(result.branches.length,N);assert.equal(result.summary.verifiedSuccesses,0);
  assert.equal(result.summary.verifiedFailures,0);assert.equal(result.summary.unknown,N);ratio(result.summary.unknownWeight,N);
  assert(result.branches.some(b=>b.reason&&/BUDGET|UNVISITED|LIMIT/.test(b.reason)));assert.equal(X.verify(result).pass,true);
 });
 await test('Mo Ye cannot reveal a second unknown card after a verified first-draw hypothesis',async()=>{
  const mixed=make({swordsoul:true}),src=sourceFrom(mixed),result=await X.analyze(src,opts),branch=result.branches.find(b=>b.cardId===I.MARMOT);
  assert.equal(branch.status,'GOAL_WITNESS');let state=independentWitness(src,branch);
  function advance(type,pred=()=>true){const a=E.enumerate(state).find(a=>a.type===type&&pred(a));assert(a,type);const r=E.execute(state,a);assert.equal(r.pass,true,JSON.stringify(r));state=r.after;}
  advance('DUEL_ADVANCE_PHASE',a=>a.toPhase==='STANDBY');advance('DUEL_ADVANCE_PHASE',a=>a.toPhase==='MAIN 1');
  advance('NORMAL_SUMMON',a=>a.sourceUid===uid(state,0,'hand',I.MOYE));advance('MOYE_TOKEN',a=>a.revealUid===uid(state,0,'hand',I.LONGYUAN));advance('SYNCHRO_CHIXIAO');
  assert.equal(state.deckOrderKnown[0],false);assert(state.pendingTriggers.some(t=>t.kind==='MOYE_DRAW'));
  assert(!E.enumerate(state).some(a=>a.type==='MOYE_DRAW'||a.type==='CHIXIAO_CL1_MOYE_CL2'));
  assert.throws(()=>H.draw(copy(state),0,1),/DRAW_ORDER_UNKNOWN/);
 });
 await test('Pre-cancellation returns a cancelled result and leaves the source intact',async()=>{
  const controller=new AbortController();controller.abort();const before=stable(source),result=await X.analyze(source,{...opts,signal:controller.signal});
  assert.equal(result.pass,false);assert.equal(result.status,'CANCELLED');assert.equal(stable(source),before);
 });
 await test('Out-of-range or noninteger exploration options are rejected',async()=>{
  for(const change of [{maxDepth:-1},{maxDepth:13},{maxStates:0},{maxStates:5001},{maxStatesPerBranch:0},{maxBranches:0},{maxBranches:61},{maxMs:0},{maxDepth:1.5}])
   await assert.rejects(async()=>X.analyze(source,{...opts,...change}),undefined,JSON.stringify(change));
 });
 await test('A legitimate prefix outside the own unknown Draw window is not admitted',()=>{
  for(const count of [0,2,4,5,8])assert.throws(()=>X.validateSource(sourceFrom(base,{requiredHandIds:[I.MARMOT]},count)));
 });
 await test('An unverified manual unknown-order declaration cannot replace the real shuffle prefix',()=>{
  const spec=copy(base.spec);delete spec.remainingDeckIds;spec.setup={turn:2,activePlayer:0,phase:'DRAW',placements:[]};
  const initial=E.createState(spec),fake={initial,state:initial,actions:[]};assert.equal(initial.deckOrderKnown[0],false);
  assert.throws(()=>X.validateSource(sourceFrom(fake)));
 });
 await test('Forged source state, prefix costs, context, goal and competitive claims are rejected',()=>{
  const mutations=[s=>{s.current.lp[0]-=1},s=>{s.current.deckOrderKnown[0]=true},s=>{s.current.duel.drawCompleted[s.current.turn]=true},
   s=>{s.scenario.actions[0].paid.push({kind:'LP',amount:123})},s=>{s.context.deckFingerprint='forged'},
   s=>{s.goal={winRate:1}},s=>{s.competitiveScore=100},s=>{s.certified=true}];
  for(const mutate of mutations){const bad=copy(source);mutate(bad);const before=stable(bad);assert.throws(()=>X.validateSource(bad));assert.equal(stable(bad),before);}
 });
 await test('An imported report rejects altered physical UID sets, card identities and exact weights',()=>{
  const mutations=[r=>{r.branches[0].uid='fabricated'},r=>{r.branches[0].uid=r.branches[1].uid},
   r=>{r.branches[0].cardId=I.MARMOT},r=>{r.branches[0].weight.numerator='2'},r=>{r.branches[0].weight.denominator='0'},
   r=>{r.branches.pop()},r=>{r.branches[0].hypothesis.weight.numerator='2'}];
  for(const mutate of mutations){const bad=copy(immediate);mutate(bad);assert.equal(X.verify(bad,{source}).pass,false);}
 });
 await test('Imported totals, source goals, context and assumed-draw claims cannot be inflated',()=>{
  const mutations=[r=>{r.summary.verifiedSuccesses=N},r=>{r.summary.successWeight.numerator=String(N)},
   r=>{r.summary.identificationInterval.low=1},r=>{r.source.goal={ownLpAtLeast:1}},r=>{r.source.context.deckFingerprint='forged'},
   r=>{r.observedDraw=true},r=>{r.certified=true},r=>{r.winRate=1},r=>{r.competitiveScore=99}];
  for(const mutate of mutations){const bad=copy(immediate);mutate(bad);assert.equal(X.verify(bad,{source}).pass,false);}
 });
 await test('A witness rejects tampered final state, recorded payment, phase and hypothesis event',()=>{
  const mutations=[r=>{r.branches.find(b=>b.witness).witness.after.lp[0]-=1},
   r=>{r.branches.find(b=>b.witness).witness.actions[0].paid.push({kind:'LP',amount:100})},
   r=>{r.branches.find(b=>b.witness).witness.actions[0].after.phase='END'},
   r=>{r.branches.find(b=>b.witness).hypothesis.observedDraw=true}];
  for(const mutate of mutations){const bad=copy(field);mutate(bad);assert.equal(X.verify(bad).pass,false);}
 });
 await test('A physically valid alternative goal is still a different import source',()=>{
  const alternative=copy(source);alternative.goal={requiredHandIds:[I.INVOCATION]};
  assert.equal(X.verify(immediate,{source:alternative}).pass,false);
 });
 await test('Changed build, catalogue and same-date restriction content invalidate old reports',()=>{
  for(const field of ['buildId','catalogSha256']){const saved=W.YGO_BUILD_MANIFEST[field];try{W.YGO_BUILD_MANIFEST[field]='different-context';assert.throws(()=>X.validateSource(source));assert.equal(X.verify(immediate).pass,false);}finally{W.YGO_BUILD_MANIFEST[field]=saved;}}
  const saved=W.BANLIST_PROFILES.tcg.data;try{W.BANLIST_PROFILES.tcg.data=[...saved,{id:I.MARMOT,name:'Archfiend Marmot of Nefariousness',max:0}];assert.throws(()=>X.validateSource(source));assert.equal(X.verify(immediate).pass,false);}finally{W.BANLIST_PROFILES.tcg.data=saved;}
  assert.equal(X.verify(immediate).pass,true);
 });
 await test('Return values remain detached, and invalid verification does not alter the original report',()=>{
  const before=stable(immediate),bad=copy(immediate);bad.branches[0].weight.numerator='999';const badBefore=stable(bad);
  assert.equal(X.verify(bad).pass,false);assert.equal(stable(bad),badBefore);assert.equal(stable(immediate),before);
  const verified=X.verify(immediate);assert.equal(verified.pass,true);verified.report.summary.unknown=999;
  assert.equal(stable(immediate),before);assert.equal(X.verify(immediate).pass,true);
 });
 await test('The manual laboratory may expose a real rival Trap while hypothetical continuations use only own actions',async()=>{
  const manual=make({manualBothPlayers:true,rivalTrap:true}),src=sourceFrom(manual,{phase:'MAIN 1'});
  assert.equal(X.validateSource(src).current.context.manualBothPlayers,true);
  const result=await X.analyze(src,{...opts,maxDepth:2,maxStates:80,maxStatesPerBranch:30,maxBranches:1});
  const branch=result.branches.find(b=>b.witness);assert(branch);const assumed=independentDraw(src,branch);
  assert(E.enumerate(assumed).some(a=>a.type==='ACTIVATE_COMPULSORY_EVACUATION_DEVICE'&&a.player===1),'Manual rival activation must really be available');
  assert.equal(branch.witness.actions.length,2);
  for(const action of branch.witness.actions)assert.equal(action.player??H.locate(action.before,action.sourceUid||action.attackerUid)?.player??0,0);
  const after=independentWitness(src,branch);assert.equal(has(after,1,'spelltrap',I.CED).length,1);
  assert.equal(has(after,1,'gy',I.CED).length,0);assert.equal(X.verify(result,{source:src}).pass,true);
 });
 await test('A changed live laboratory goal cancels exploration and rejects an otherwise valid old report',async()=>{
  let live=copy(source),changed=false;W.YGOAdvancedWorkbench={report:()=>copy(live)};
  try{
   assert.equal(X.verify(immediate).pass,true);
   const result=await X.analyze(source,{...opts,onProgress(){if(!changed){changed=true;live.goal={ownLpAtLeast:8001};}}});
   assert(changed);assert.equal(result.pass,false);assert.equal(result.status,'STALE_SOURCE_CANCELLED');
   assert.equal(X.verify(immediate).pass,false);live=copy(source);assert.equal(X.verify(immediate).pass,true);
  }finally{delete W.YGOAdvancedWorkbench;}
 });
 await test('The exported report limit is measured in UTF-8 bytes rather than JavaScript characters',()=>{
  const large=copy(source);large.padding='漢'.repeat(Math.ceil(X.capabilities().maximumReportBytes/3));
  assert.throws(()=>X.validateSource(large),/DRAW_CONTINUATION_REPORT_SIZE_LIMIT/);
 });

 const result={schema:'ygo-hypothetical-draw-source-regression/v1',pass:tests.every(t=>t.pass),total:tests.length,tests,
  limitations:['This Node suite uses source modules and pinned technical cards and TCG snapshot, not a new official-ruling authentication.',
   'The first draw is explicitly hypothetical under a uniform-shuffle assumption; all subsequent witnessed actions use the ordinary causal engine.',
   'Only a single own turn draw with opponent PASS is admitted. Unknown continuations are not proved failures, competitive win rates or general optimal play.']};
 fs.writeFileSync(path.join(ROOT,'tests/draw-continuation-results.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify(result,null,2));if(!result.pass)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});

'use strict';
/* Recommendations use real physical diagnostic openings and fresh engine
 * replay. None of these fixtures are competitive labels or tournament lists. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {harness}=require('./combo_engine.cjs');
const ROOT=path.resolve(__dirname,'..'),copy=structuredClone;
const I={ALEISTER:86120751,INVOCATION:74063034,ARTEMIS:34755994,MECHABA:75286621,ASH:14558127,MIRRORJADE:44146295};
(async()=>{
 const h=await harness(true),{W,E}=h,H=E.helpers;
 const load=name=>vm.runInNewContext(fs.readFileSync(path.join(ROOT,'src/app/'+name+'.js'),'utf8'),{window:W,structuredClone,console,Date,performance,setTimeout,clearTimeout});
 load('duel-phases');load('responses');load('strategy');load('recommendations');
 const R=W.YGORecommendations,fixture=h.fixture('Invoked'),deck=copy(fixture.deck),opponent=copy(h.opponent);
 const policies={pass:{opponentPolicy:'PASS'},ash:{opponentPolicy:'ASH_EXPLICIT',ashPolicy:'FIRST_ELIGIBLE'},choice:{opponentPolicy:'ASH_EXPLICIT',ashPolicy:'CHOICE_BRANCHES'}};
 const defaultHand=[I.ALEISTER,I.INVOCATION,23771716,47372349,97127906];
 function remaining(d,opening){const ids=d.main.flatMap(c=>Array(c.qty).fill(c.id));for(const id of opening){const index=ids.indexOf(id);assert(index>=0,'Opening must consume a real physical copy');ids.splice(index,1);}return ids;}
 function make(policy=policies.pass,options={}){
  const rival=options.rival||opponent,opening=copy(options.opening||defaultHand),order=remaining(deck,opening);if(options.swapOrder){const index=order.findIndex(id=>id!==order[0]);assert(index>0);[order[0],order[index]]=[order[index],order[0]];}
  const spec={deck,openingIds:opening,remainingDeckIds:order,...(!options.noOpponent?{opponentDeck:rival.deck,opponentOpeningIds:rival.openingIds,opponentRemainingDeckIds:rival.remainingDeckIds}:{}),context:{...fixture.context,...policy,...(options.duel?{duelMode:true}:{}),seed:options.seed||'controlled-opening'}};
  const initial=E.createState(spec);return{spec,initial:copy(initial),state:initial,actions:[],policy:copy(policy)};
 }
 function step(t,type,predicate=()=>true){const action=E.enumerate(t.state).find(a=>a.type===type&&predicate(a));assert(action,'Expected '+type+'; available: '+E.enumerate(t.state).map(a=>a.type).join(', '));const r=E.execute(t.state,action);assert.equal(r.pass,true,JSON.stringify(r));t.actions.push(r.action);t.state=r.after;return r;}
 function line(t){const value={index:1,scope:E.version,before:copy(t.initial),after:copy(t.state),state:copy(t.state),actions:copy(t.actions),context:copy(t.initial.context),deckFingerprint:E.deckFingerprint(deck),certified:false,globalOptimalityProven:false};value.replay=E.replay(value,{deck});assert.equal(value.replay.pass,true,JSON.stringify(value.replay));return value;}
 const cardId=(st,uid)=>Number(H.card(H.locate(st,uid)?.item).id);
 function normal(t,id){step(t,'NORMAL_SUMMON',a=>cardId(t.state,a.sourceUid)===id);return t;}
 function fusionRoute(t){normal(t,I.ALEISTER);step(t,'ALEISTER_SEARCH');step(t,'LINK_ARTEMIS');step(t,'INVOCATION_MECHABA');step(t,'INVOCATION_RECYCLE');return t;}
 function row(t,id,lines=[line(t)],extra={}){return{id,policy:copy(t.policy),initialState:copy(t.initial),lines,searchComplete:false,truncated:false,...extra};}
 const goal={requiredFieldIds:[I.MECHABA],requiredHandIds:[I.ALEISTER]};
 const pass=fusionRoute(make()),ash=fusionRoute(make(policies.ash));
 const passLine=line(pass),ashLine=line(ash);
 const input=(scenarios,extra={})=>({deck,scenarios,context:{format:'tcg',banlistVersion:fixture.context.banlistVersion,deckFingerprint:E.deckFingerprint(deck)},...extra});
 const tests=[];async function test(name,fn){try{await fn();tests.push({name,pass:true});}catch(error){tests.push({name,pass:false,error:error.stack});}}

 await test('PASS and forced Ash use the same full physical opening and fresh replay',()=>{
  assert(passLine.actions.every(a=>!a.responseUid));assert(ashLine.actions.some(a=>a.responseUid));assert.equal(ash.state.zones[1].gy.some(x=>Number(H.card(x).id)===I.ASH),true);
  const r=R.evaluate(input([row(pass,'pass'),row(ash,'ash')],{goal}));assert.equal(r.pass,true);assert.equal(r.coverage.scenariosWithVerifiedGoal,2);assert.equal(r.rejected.length,0);assert(r.matrix.every(x=>x.baselineVerified&&x.counts.goalReached===1));assert.equal(r.recommendations.length,1);assert.equal(r.recommendations[0].constrainedPolicyCoverageComplete,true);assert.equal(r.recommendations[0].claim,'A_REPLAYED_ADAPTATION_EXISTS_FOR_EACH_SUPPLIED_POLICY');
  const hands=r.recommendations[0].observedRanges.handCopies;assert.equal(hands.maximum-hands.minimum,1);assert.equal(r.competitiveScore,null);assert.equal(r.winRate,null);assert.equal(r.globalOptimalityProven,false);assert.equal(r.adversarialOptimalityProven,false);
 });
 await test('A real Ash discard is opponent cost, not an invented own discard',()=>{
  const r=R.evaluate(input([row(ash,'ash')],{goal})),outcome=r.matrix[0].outcomes[0];assert.equal(outcome.metrics.costs.discardedCopies,0);assert(outcome.metrics.costs.payments.some(p=>p.kind==='DISCARD'&&p.player===1));assert(outcome.replayFresh&&outcome.copiesConserved);
 });
 await test('A declared scenario policy must match its initial state',()=>{
  const r=R.evaluate(input([row(pass,'wrong-policy',[passLine],{policy:policies.ash})],{goal}));assert.equal(r.pass,false);assert(r.rejected.some(x=>x.issues.includes('INITIAL_POLICY_MISMATCH')));assert.equal(r.matrix[0].classification,'UNKNOWN');assert.equal(r.matrix[0].verifiedFailure,false);
 });
 await test('A line policy cannot be relabeled when no initial state was supplied',()=>{
  const r=R.evaluate(input([{id:'wrong-line-policy',policy:policies.ash,lines:[passLine]}],{goal}));assert.equal(r.pass,false);assert(r.rejected.some(x=>x.issues.includes('DECLARED_POLICY_DOES_NOT_MATCH_REPLAY_CONTEXT')));
 });
 await test('A changed physical opening is excluded from controlled comparison',()=>{
  const changed=make(policies.pass,{opening:[I.ALEISTER,I.INVOCATION,23771716,47372349,70924884]});normal(changed,70924884);const r=R.evaluate(input([row(pass,'baseline'),row(changed,'different-hand')],{goal}));assert.equal(r.pass,true);assert(r.rejected.some(x=>x.issues.includes('INITIAL_SCENARIO_BASELINE_MISMATCH')));assert.equal(r.matrix[1].counts.verifiedOutcomes,0);assert.equal(r.matrix[1].classification,'UNKNOWN');assert(r.recommendations.every(x=>x.unknownScenarios.includes('different-hand')));
 });
 await test('Known remaining deck order is part of the controlled physical baseline',()=>{
  const changed=fusionRoute(make(policies.pass,{swapOrder:true}));const r=R.evaluate(input([row(pass,'baseline'),row(changed,'different-order')],{goal}));assert(r.rejected.some(x=>x.issues.includes('INITIAL_SCENARIO_BASELINE_MISMATCH')));assert.equal(r.matrix[1].counts.verifiedOutcomes,0);
 });
 await test('PASS with no opponent inventory cannot be compared with an Ash deck',()=>{
  const empty=fusionRoute(make(policies.pass,{noOpponent:true}));const r=R.evaluate(input([row(empty,'empty-rival'),row(ash,'physical-rival')],{goal}));assert(r.rejected.some(x=>x.issues.includes('INITIAL_SCENARIO_BASELINE_MISMATCH')));assert.equal(r.matrix[1].counts.verifiedOutcomes,0);assert.equal(r.recommendations[0].constrainedPolicyCoverageComplete,false);
 });
 await test('Changing the final state defeats a prior replay.pass flag',()=>{
  const forged=copy(passLine);forged.after.lp[0]-=100;forged.state.lp[0]=forged.after.lp[0];assert.equal(forged.replay.pass,true);const r=R.evaluate(input([row(pass,'forged-final',[forged])],{goal}));assert.equal(r.pass,false);assert(r.rejected.some(x=>x.issues.includes('FRESH_REPLAY_REJECTED')));assert.equal(r.matrix[0].counts.verifiedOutcomes,0);
 });
 await test('A forged material payment cannot be promoted to recommendation evidence',()=>{
  const forged=copy(passLine),fusion=forged.actions.find(a=>a.type==='INVOCATION_MECHABA');assert(fusion.paid.length>0);fusion.paid[0].uid='invented-copy';const r=R.evaluate(input([row(pass,'forged-payment',[forged])],{goal}));assert.equal(r.pass,false);assert(r.rejected.some(x=>x.issues.includes('FRESH_REPLAY_REJECTED')));
 });
 await test('An unverified line cannot become evidence merely through a matching deck fingerprint',()=>{
  const forged=copy(passLine);delete forged.replay;const r=R.evaluate(input([row(pass,'no-replay',[forged])],{goal}));assert.equal(r.pass,false);assert(r.rejected.some(x=>x.issues.includes('PREVIOUS_REPLAY_MISSING_OR_REJECTED')));
 });
 await test('Changed model build invalidates initial reconstruction and all stored lines',()=>{
  const saved=W.YGO_BUILD_MANIFEST.buildId;try{W.YGO_BUILD_MANIFEST.buildId='changed-build';const r=R.evaluate(input([row(pass,'stale',[passLine])],{goal}));assert.equal(r.pass,false);assert(r.rejected.some(x=>x.issues.includes('INITIAL_RECONSTRUCTION_REJECTED')));assert(r.rejected.some(x=>x.issues.some(s=>s.includes('STALE_MODEL_CONTEXT'))));}finally{W.YGO_BUILD_MANIFEST.buildId=saved;}
 });
 await test('Changing the restriction contents without changing its date invalidates evidence',()=>{
  const saved=W.BANLIST_PROFILES.tcg.data;try{W.BANLIST_PROFILES.tcg.data=[...saved,{id:23771716,name:'7 Colored Fish',max:1}];const r=R.evaluate(input([row(pass,'stale-banlist',[passLine])],{goal}));assert.equal(r.pass,false);assert(r.rejected.some(x=>x.issues.some(s=>s.includes('STALE_BANLIST_CONTENT'))));}finally{W.BANLIST_PROFILES.tcg.data=saved;}
 });
 await test('A complete bounded search with no goal line remains unknown, not a proven failure',()=>{
  const r=R.evaluate(input([row(pass,'observed'),row(ash,'not-found',[],{searchComplete:true,truncated:false})],{goal}));assert.equal(r.pass,true);const unknown=r.matrix.find(x=>x.id==='not-found');assert.equal(unknown.classification,'UNKNOWN');assert.equal(unknown.declaredSearchComplete,true);assert.equal(unknown.verifiedFailure,false);assert.equal(unknown.bounds.impossibilityProven,false);assert.equal(r.coverage.failedScenariosProven,0);assert.equal(r.recommendations[0].constrainedPolicyCoverageComplete,false);assert(r.recommendations[0].unknownScenarios.includes('not-found'));
 });
 await test('Truncated unknown scenarios retain their uncertainty and missing-evidence reason',()=>{
  const r=R.evaluate(input([row(pass,'observed'),row(ash,'truncated',[],{truncated:true})],{goal}));assert.equal(r.matrix[1].classification,'UNKNOWN');assert(r.missingEvidence.some(x=>x.scenarioId==='truncated'&&x.reason==='NO_VERIFIED_GOAL_IS_NOT_A_PROVEN_FAILURE'&&x.truncated));assert.equal(r.recommendations[0].observedPolicyCoverageComplete,false);
 });
 await test('Choice branches cannot masquerade as constrained opponent resilience',()=>{
  const optimistic=make(policies.choice);normal(optimistic,I.ALEISTER);step(optimistic,'ALEISTER_SEARCH',a=>!a.responseUid);step(optimistic,'LINK_ARTEMIS');step(optimistic,'INVOCATION_MECHABA');step(optimistic,'INVOCATION_RECYCLE');const r=R.evaluate(input([row(pass,'pass'),row(optimistic,'opponent-choice')],{goal}));assert.equal(r.pass,true);assert(r.matrix[1].branchChoice);assert.equal(r.recommendations[0].observedPolicyCoverageComplete,true);assert.equal(r.recommendations[0].constrainedPolicyCoverageComplete,false);assert(r.missingEvidence.some(x=>x.reason==='CHOICE_BRANCHES_INCLUDE_OPTIMISTIC_ADVERSARY_CHOICES'));
 });
 await test('Two actual opening actions expose a hand-versus-ATK tradeoff on the partial Pareto front',()=>{
  const access=make();normal(access,I.ALEISTER);step(access,'ALEISTER_SEARCH');const attack=make();normal(attack,97127906);const r=R.evaluate(input([row(access,'one-opening',[line(access),line(attack)])]));assert.equal(r.pass,true);assert.equal(r.recommendations.length,2);assert(r.recommendations.every(x=>x.paretoFront===1&&x.scalarScore===null));const byId=new Map(r.recommendations.map(x=>[x.firstAction.cardId,x]));assert.equal(byId.get(I.ALEISTER).worstObserved.handCopies,5);assert.equal(byId.get(97127906).worstObserved.handCopies,4);assert(byId.get(I.ALEISTER).worstObserved.knownVisibleAttack<byId.get(97127906).worstObserved.knownVisibleAttack);assert(byId.get(I.ALEISTER).advantages.some(x=>x.metric==='handCopies'));assert(byId.get(I.ALEISTER).tradeoffs.some(x=>x.metric==='knownVisibleAttack'));assert(byId.get(97127906).tradeoffs.some(x=>x.metric==='handCopies'));
 });
 await test('The same first action ending in different phases is not ranked as an equivalent domain',()=>{
  const main=make(policies.pass,{duel:true});normal(main,97127906);const end=make(policies.pass,{duel:true});normal(end,97127906);step(end,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='END');const r=R.evaluate(input([row(main,'phase-domains',[line(main),line(end)])],{goal:{requiredFieldIds:[97127906]}}));assert.equal(r.recommendations.length,2);assert.equal(new Set(r.recommendations.map(x=>x.endDomain)).size,2);assert(r.recommendations.every(x=>x.dominators.length===0));
 });
 await test('An absent goal card is documented as a missing resource, not a fabricated deck recommendation',()=>{
  const r=R.evaluate(input([row(pass,'observed')],{goal:{requiredFieldIds:[I.MIRRORJADE]}}));assert.equal(r.pass,true);assert.equal(r.recommendations.length,0);assert.equal(r.matrix[0].classification,'UNKNOWN');assert.equal(r.missingGoalCards.length,1);assert.equal(r.missingGoalCards[0].cardId,I.MIRRORJADE);assert.equal(r.missingGoalCards[0].requiredZone,'extra');assert.equal(r.missingGoalCards[0].evidence.actualCopies,0);
 });
 await test('Invalid scenario IDs, malformed policies and unsupported goal claims are rejected',()=>{
  const duplicate=R.evaluate(input([row(pass,'same'),row(ash,'same')],{goal}));assert.equal(duplicate.pass,false);assert.equal(duplicate.status,'INVALID_SCENARIO_ID');const wrong=R.evaluate(input([{id:'bad-policy',policy:{opponentPolicy:'PASS',winRate:1},lines:[]}],{goal}));assert.equal(wrong.pass,false);assert(wrong.issues.includes('UNSUPPORTED_POLICY_FIELD'));const badGoal=R.evaluate(input([row(pass,'valid')],{goal:{requiredFieldIds:[I.MECHABA],guaranteedWin:true}}));assert.equal(badGoal.pass,false);assert(badGoal.issues.includes('UNSUPPORTED_GOAL_FIELD'));
 });
 await test('A mismatching declared fingerprint is rejected before recommending a move',()=>{
  const r=R.evaluate(input([row(pass,'valid')],{goal,context:{deckFingerprint:'other-deck'}}));assert.equal(r.pass,false);assert.equal(r.status,'DECK_FINGERPRINT_MISMATCH');assert.equal(r.recommendations.length,0);
 });

 await test('The same real five-card hand reaches its objective across PASS, Ash, Veiler and Impermanence',()=>{
  const rival=copy(opponent),replace=rival.deck.main.find(c=>Number(c.id)!==I.ASH&&c.qty>=3);replace.qty-=2;rival.deck.main.push({id:97268402,qty:1},{id:10045474,qty:1});rival.openingIds=[I.ASH,97268402,10045474,...opponent.openingIds.filter(x=>x!==I.ASH).slice(0,2)];rival.remainingDeckIds=remaining(rival.deck,rival.openingIds);
  const matrixPolicies=[policies.pass,policies.ash,{opponentPolicy:'RESPONSES_EXPLICIT',responseTypes:['VEILER'],responsePolicy:'FIRST_ELIGIBLE'},{opponentPolicy:'RESPONSES_EXPLICIT',responseTypes:['IMPERM'],responsePolicy:'FIRST_ELIGIBLE'}],ids=['pass','ash','veiler','imperm'];
  const traces=matrixPolicies.map(p=>fusionRoute(make(p,{rival}))),r=R.evaluate(input(traces.map((t,i)=>row(t,ids[i])),{goal}));assert.equal(r.pass,true);assert.equal(r.rejected.length,0);assert.equal(r.coverage.scenariosWithVerifiedGoal,4);assert.equal(r.recommendations[0].verifiedGoalScenarios,4);assert.equal(r.recommendations[0].constrainedPolicyCoverageComplete,true);assert(traces[2].actions.some(a=>a.response?.type==='VEILER'));assert(traces[3].actions.some(a=>a.response?.type==='IMPERM'));assert.equal(r.recommendations[0].worstObserved.handCopies,4);
 });
 await test('Repeated identical traces do not manufacture independent observed outcomes',()=>{
  const r=R.evaluate(input([row(pass,'duplicates',[passLine,copy(passLine)])],{goal}));assert.equal(r.pass,true);assert.equal(r.coverage.verifiedOutcomes,1);assert.equal(r.recommendations[0].observedOutcomes,1);assert.equal(r.matrix[0].outcomes.length,1);
 });
 await test('Different openings mixed inside one scenario are excluded while valid evidence survives',()=>{
  const changed=make(policies.pass,{opening:[I.ALEISTER,I.INVOCATION,23771716,47372349,70924884]});normal(changed,70924884);const r=R.evaluate(input([row(pass,'mixed',[passLine,line(changed)])],{goal}));assert.equal(r.pass,true);assert.equal(r.matrix[0].counts.verifiedOutcomes,1);assert(r.rejected.some(x=>x.issues.includes('SCENARIO_CONTAINS_DIFFERENT_PHYSICAL_OPENINGS')));
 });
 await test('A forged declared initial state cannot be paired with an otherwise valid trace',()=>{
  const scenario=row(pass,'forged-initial');scenario.initialState.lp[0]=9999;const r=R.evaluate(input([scenario],{goal}));assert.equal(r.pass,false);assert(r.rejected.some(x=>x.issues.includes('INITIAL_RECONSTRUCTION_MISMATCH')));assert.equal(r.matrix[0].counts.verifiedOutcomes,0);
 });
 const report={schema:'ygo-recommendations-regression/v1',pass:tests.every(x=>x.pass),total:tests.length,tests,limitations:['Diagnostic physical fixtures are not competitive observations.','The supplied response policies and registered actions are not an adversarial optimum.','Search failure remains unknown outside a proven domain.']};
 fs.writeFileSync(path.join(ROOT,'tests/recommendations-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.pass)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});

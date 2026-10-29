'use strict';
/* Compulsory Evacuation Device over the pinned physical catalogue and TCG
 * application snapshot. Declared starting fields do not certify prior history.
 * Explicit corrupt-metadata probes only inspect gates; they are not game lines. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const {harness,ROOT}=require('./combo_engine.cjs');
const copy=structuredClone,TYPE='ACTIVATE_COMPULSORY_EVACUATION_DEVICE';
const I={CED:94192409,IMPERM:10045474,MECHABA:75286621,ROAR:51339637,
 WOLF:87871125,BALELYNX:14812471,SPARK:83994433,SPIRIT:59822133,AZURE:40908371,
 BEWD:89631139,SAGE:8240199,ALEISTER:86120751,INVOCATION:74063034,
 MOYE:20001443,LONGYUAN:93490856,TOKEN:20001444,SHTHANA:24557335,
 BRANDED_FUSION:44362883,ALBAZ:68468459,DARK_MAGICIAN:46986414,
 GAZELLE:26889158,SPINNY:52277807,MIRRORJADE:44146295,LUBELLION:70534340,
 DROLL:94145021,ASH:14558127,XYz:16195942,PENDULUM:70026064,UNKNOWN:38033121};

(async()=>{
 const {W,E,fixture}=await harness(true),H=E.helpers,tests=[];
 for(const module of ['duel-phases','responses','archetypes-expanded','blue-eyes-duel'])
  vm.runInNewContext(fs.readFileSync(path.join(ROOT,'src/app/'+module+'.js'),'utf8'),
   {window:W,structuredClone,console,Date,Promise,setTimeout,clearTimeout,performance});
 await Promise.resolve();
 const id=x=>H.baseId(x),fillers=[...new Set(fixture('Invoked').deck.main
  .filter(row=>![I.ALEISTER,I.INVOCATION].includes(row.id)).map(row=>row.id)
  .concat([63749102,74367458,48305365,32452818,23771716]))];
 function deck(cards=[],extra=[]){
  const counts=new Map(),ex=new Map();for(const n of cards)counts.set(n,(counts.get(n)||0)+1);
  let size=cards.length;for(const n of fillers){if(size>=40)break;if(counts.has(n))continue;
   const q=Math.min(3,40-size);counts.set(n,q);size+=q;}
  assert.equal(size,40);for(const n of extra)ex.set(n,(ex.get(n)||0)+1);
  const d={main:[...counts].map(([id,qty])=>({id,qty})),extra:[...ex].map(([id,qty])=>({id,qty})),side:[]};
  const audit=W.YGODataCatalog.auditDeck(d,{format:'tcg',banlist:W.BANLIST_PROFILES.tcg.data});
  assert.equal(audit.pass,true,JSON.stringify(audit));return d;
 }
 function opening(d,wanted,reserved){const avail=new Map(d.main.map(row=>[row.id,row.qty])),out=[...wanted];
  for(const n of [...wanted,...reserved]){assert((avail.get(n)||0)>0,'Missing physical card '+n);avail.set(n,avail.get(n)-1);}
  for(const n of fillers)while(out.length<5&&(avail.get(n)||0)>0){out.push(n);avail.set(n,avail.get(n)-1);}
  assert.equal(out.length,5);return out;
 }
 function remaining(d,hand){const out=d.main.flatMap(row=>Array(row.qty).fill(row.id));
  for(const n of hand){const at=out.indexOf(n);assert(at>=0);out.splice(at,1);}return out;}
 const extra=n=>!!(Number(W.YGODataCatalog.rulesCard(n).typeBits)&(0x40|0x2000|0x800000|0x4000000));
 const monster=(player,cardId,zoneIndex=0,other={})=>({player,cardId,zone:'monster',from:extra(cardId)?'extra':'deck',faceUp:true,position:'ATTACK',summonTurn:1,zoneIndex,...other});
 const set=(player,cardId,zoneIndex=1,setTurn=1)=>({player,cardId,zone:'spelltrap',from:'deck',faceUp:false,zoneIndex,setTurn});
 const gy=(player,cardId)=>({player,cardId,zone:'gy',from:extra(cardId)?'extra':'deck'});
 function make(o={}){
  const p=o.player??0,q=1-p,from=o.from||'spelltrap',copies=o.copies??1,placements=[],wanted=[[],[]];
  if(from==='spelltrap')for(let n=0;n<copies;n++)placements.push(set(p,I.CED,(o.column??1)+n,o.setTurn??1));
  else wanted[p].push(...Array(copies).fill(I.CED));
  const targetPlayer=o.targetPlayer??q,targetId=o.targetId??I.BEWD;
  if(o.target!==false)placements.push(monster(targetPlayer,targetId,o.targetColumn??2,
   {...(o.targetProperties||{}),...(o.targetFaceUp===false?{faceUp:false,position:'SET'}:{})}));
  if(o.mechaba&&!(targetId===I.MECHABA&&targetPlayer===q&&o.target!==false))placements.push(monster(q,I.MECHABA,0));
  if(o.ownRoar)placements.push(monster(p,I.WOLF,5),set(p,I.ROAR,0));
  if(o.opponentRoar)placements.push(monster(q,I.WOLF,5),set(q,I.ROAR,4));
  if(o.mechaba&&o.cost!==null)wanted[q].push(o.cost??I.CED);
  for(let player=0;player<2;player++)wanted[player].push(...(o.hands?.[player]||[]));
  placements.push(...copy(o.placements||[]));
  const decks=[0,1].map(player=>deck([
   ...placements.filter(row=>row.player===player&&row.from==='deck').map(row=>row.cardId),
   ...wanted[player],...(o.cards?.[player]||[])],
   [...placements.filter(row=>row.player===player&&row.from==='extra').map(row=>row.cardId),...(o.extra?.[player]||[])]));
  const hands=decks.map((d,player)=>opening(d,wanted[player],placements.filter(row=>row.player===player&&row.from==='deck').map(row=>row.cardId)));
  const types=o.responseTypes||(o.mechaba||o.opponentRoar?['MECHABA','ROAR']:[]);
  const spec={deck:decks[0],openingIds:hands[0],remainingDeckIds:remaining(decks[0],hands[0]),
   opponentDeck:decks[1],opponentOpeningIds:hands[1],opponentRemainingDeckIds:remaining(decks[1],hands[1]),
   context:{format:'tcg',duelMode:true,manualBothPlayers:true,opponentPolicy:types.length?'RESPONSES_EXPLICIT':'PASS',responseTypes:types,responsePolicy:'CHOICE_BRANCHES',...(o.context||{})},
   setup:{turn:o.turn??2,activePlayer:o.activePlayer??0,phase:o.phase||'MAIN 1',placements}};
  const initial=E.createState(spec);return{p,q,from,deck:decks[0],spec,initial,state:copy(initial),actions:[]};
 }
 const cards=(t,p,z,n)=>t.state.zones[p][z].filter(x=>id(x)===n);
 const uid=(t,p,z,n)=>cards(t,p,z,n)[0]?.uid;
 const locate=(t,u)=>H.locate(t.state,u);
 const pass=a=>!a.response&&!a.responseUid;
 const options=t=>E.enumerate(t.state).filter(a=>a.type===TYPE);
 const selected=(t,target,pred=pass)=>a=>a.player===t.p&&a.targetUid===target&&pred(a);
 function step(t,type=TYPE,pred=pass){const action=E.enumerate(t.state).find(a=>a.type===type&&pred(a));
  assert(action,'Missing '+type+': '+JSON.stringify(E.enumerate(t.state).map(a=>({type:a.type,player:a.player,targetUid:a.targetUid,response:a.response?.type,counters:a.counterResponses?.length}))));
  const before=JSON.stringify(t.state),inventory=H.inventory(t.state),result=E.execute(t.state,action);
  assert.equal(result.pass,true,JSON.stringify(result));assert.equal(JSON.stringify(t.state),before,'Input changed');
  assert.equal(H.inventory(result.after),inventory,'Physical inventory changed');t.state=result.after;t.actions.push(result.action);return result;
 }
 function replay(t){const line={before:copy(t.initial),after:copy(t.state),state:copy(t.state),actions:copy(t.actions),
  context:copy(t.initial.context),deckFingerprint:E.deckFingerprint(t.deck),scope:E.version,certified:false,globalOptimalityProven:false};
  const result=E.replay(line,{deck:t.deck});assert.equal(result.pass,true,JSON.stringify(result));return line;
 }
 function packet(r,t,source,target,targetPlayer,column=1){const p=r.action.proof.normalTrapActivation;
  assert(p);assert.equal(p.kind,'NORMAL_TRAP_CARD_ACTIVATION');assert.equal(p.sourceUid,source);assert.equal(p.cardId,I.CED);
  assert.equal(p.player,t.p);assert.equal(p.originZone,'spelltrap');assert.equal(p.activationZone,'spelltrap');assert.equal(p.column,column);
  assert.equal(p.fromSet,true);assert.equal(p.setTurn,1);assert.equal(p.spellSpeed,2);
  assert.equal(p.targetUid,target);assert.equal(p.targetPlayer,targetPlayer);assert.equal(r.action.proof.activationOrigin.zone,'spelltrap');
  assert.equal(r.action.proof.activationOrigin.cardActivation,'NORMAL_TRAP');assert.equal(r.action.proof.activationOrigin.restriction,'NONE');
  assert.equal(r.action.proof.normalSpellActivation,null);assert.equal(r.action.proof.fieldSpellActivation,null);return p;
 }
 const lock=t=>t.state.locks.filter(x=>x.kind==='IMPERM_COLUMN_NEGATED');
 const noDestruction=r=>assert(!r.action.events.some(e=>/DESTROYED|SPARK_DESTRUCTION_PREVENTED|DESTRUCTION_REPLACED/.test(e.type)));
 async function test(name,fn){try{await fn();tests.push({name,pass:true});}catch(error){tests.push({name,pass:false,error:error.stack});}}

 await test('CED is an exact second registered Speed 2 Normal Trap with only a Set origin',()=>{
  const row=E.capabilities().normalTrapActivations.find(x=>x.type===TYPE);assert(row);
  assert.equal(row.cardId,I.CED);assert.equal(row.spellSpeed,2);assert.equal(row.restriction,'NONE');
  assert.deepEqual(Array.from(row.activationZones),['spelltrap']);assert.equal(Number(W.YGODataCatalog.rulesCard(I.CED).typeBits),4);
  assert(Array.from(W.YGOResponses.capabilities().mechabaNormalTrapActivations).includes(TYPE));
 });
 for(const p of [0,1])for(const targetPlayer of [0,1])await test('A Main monster returns to its physical owner hand: actor '+p+', target '+targetPlayer,()=>{
  const t=make({player:p,targetPlayer}),source=uid(t,p,'spelltrap',I.CED),target=uid(t,targetPlayer,'monster',I.BEWD);
  const r=step(t,TYPE,selected(t,target));packet(r,t,source,target,targetPlayer);
  assert.equal(locate(t,target).zone,'hand');assert.equal(locate(t,target).player,targetPlayer);
  assert.equal(locate(t,target).item.ownerPlayer,targetPlayer);assert.equal(locate(t,source).zone,'gy');
  assert.equal(r.action.paid.length,0);assert.equal(r.action.proof.activationNegated,false);
  assert(r.action.events.some(e=>e.type==='NORMAL_TRAP_RESOLUTION_CLEANUP'&&e.uid===source));
  for(const key of ['properlySummoned','summonType','declaredSummonType','faceUp','position','zoneIndex'])assert.equal(locate(t,target).item[key],undefined,key);
  noDestruction(r);replay(t);
 });
 for(const targetId of [I.MECHABA,I.SPIRIT,I.WOLF])for(const targetPlayer of [0,1])await test('Extra monster '+targetId+' returns hidden to player '+targetPlayer+' Extra instead of a hand',()=>{
  const t=make({targetId,targetPlayer,targetProperties:{properlySummoned:true,declaredSummonType:targetId===I.MECHABA?'FUSION':targetId===I.SPIRIT?'SYNCHRO':'LINK'}}),target=uid(t,targetPlayer,'monster',targetId);
  step(t,TYPE,selected(t,target));assert.equal(locate(t,target).zone,'extra');assert.equal(locate(t,target).player,targetPlayer);
  assert.equal(cards(t,targetPlayer,'hand',targetId).length,0);
  for(const key of ['properlySummoned','summonType','declaredSummonType','faceUp','position','zoneIndex'])assert.equal(locate(t,target).item[key],undefined,key);
  replay(t);
 });
 await test('A declared Set Main monster is a valid target and returns the same UID to its owner hand',()=>{
  const t=make({targetFaceUp:false}),target=uid(t,1,'monster',I.BEWD);step(t,TYPE,selected(t,target));
  assert.equal(locate(t,target).zone,'hand');assert.equal(locate(t,target).item.faceUp,undefined);replay(t);
 });
 await test('A Set Fusion also returns to the Extra without claiming a proper prior summon',()=>{
  const t=make({targetId:I.MECHABA,targetFaceUp:false}),target=uid(t,1,'monster',I.MECHABA);
  assert.equal(locate(t,target).item.properlySummoned,false);step(t,TYPE,selected(t,target));assert.equal(locate(t,target).zone,'extra');replay(t);
 });
 await test('There is no CED hand exception even with no controlled cards',()=>{
  const t=make({from:'hand'}),source=uid(t,0,'hand',I.CED);
  assert.equal(t.state.zones[0].monster.length+t.state.zones[0].spelltrap.length,0);
  assert.equal(options(t).length,0);assert.equal(H.normalTrapActivationEligible(t.state,source,I.CED,0),false);
  assert.equal(E.execute(t.state,{type:TYPE,player:0,sourceUid:source,targetUid:uid(t,1,'monster',I.BEWD),column:0}).pass,false);
 });
 await test('A Trap Set this turn cannot activate and a future Set declaration is rejected',()=>{
  assert.equal(options(make({setTurn:2})).length,0);assert.throws(()=>make({setTurn:3}),/DECLARED_SET_TURN_INVALID/);
 });
 await test('Actual setting consumes no Trap activation and permits activation only after the next turn starts',()=>{
  const t=make({from:'hand'}),source=uid(t,0,'hand',I.CED),target=uid(t,1,'monster',I.BEWD);
  step(t,'DUEL_SET_SPELL_TRAP',a=>a.player===0&&a.sourceUid===source);assert.equal(locate(t,source).item.setTurn,2);
  assert(!options(t).some(a=>a.sourceUid===source));step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='END');
  step(t,'DUEL_NEXT_TURN');step(t,'DUEL_DRAW_FOR_TURN',pass);
  assert(options(t).some(a=>a.sourceUid===source));step(t,TYPE,selected(t,target));assert.equal(locate(t,target).zone,'hand');replay(t);
 });
 await test('Two physical CED copies may resolve in one turn without an invented once-per-turn limit',()=>{
  const t=make({copies:2,placements:[monster(1,I.SAGE,0)]}),blue=uid(t,1,'monster',I.BEWD),sage=uid(t,1,'monster',I.SAGE);
  step(t,TYPE,selected(t,blue));step(t,TYPE,selected(t,sage));assert.equal(cards(t,0,'gy',I.CED).length,2);
  assert(!Object.keys(t.state.used).some(key=>/COMPULSORY|EVACUATION/.test(key)));replay(t);
 });
 await test('Returning an already-negated monster remains legal and clears its field negation',()=>{
  const t=make({targetId:I.SPIRIT,placements:[set(0,I.IMPERM,3)]}),target=uid(t,1,'monster',I.SPIRIT);
  step(t,'ACTIVATE_INFINITE_IMPERMANENCE',a=>a.player===0&&a.targetUid===target&&pass(a));
  assert.equal(locate(t,target).item.effectsNegated,true);step(t,TYPE,selected(t,target));
  assert.equal(locate(t,target).zone,'extra');assert.equal(locate(t,target).item.effectsNegated,undefined);replay(t);
 });
 await test('Real Spark protection does not prevent return or spend a destruction-prevention charge',()=>{
  const t=make({targetPlayer:0,placements:[monster(0,I.SPARK,0)]}),target=uid(t,0,'monster',I.BEWD),spark=uid(t,0,'monster',I.SPARK);
  step(t,'STARDUST_SPARK_PROTECTION',a=>a.player===0&&a.sourceUid===spark&&a.targetUid===target&&pass(a));
  assert.equal(locate(t,target).item.sparkProtection.remaining,1);const r=step(t,TYPE,selected(t,target));
  assert.equal(locate(t,target).zone,'hand');assert.equal(locate(t,target).item.sparkProtection,undefined);
  assert.equal(t.state.used['SPARK_PROTECT:'+spark],true);noDestruction(r);replay(t);
 });
 await test('Balelynx in the GY cannot pay a destruction replacement for an ordinary return',()=>{
  const t=make({targetPlayer:0,targetId:I.WOLF,placements:[gy(0,I.BALELYNX)]}),target=uid(t,0,'monster',I.WOLF),balelynx=uid(t,0,'gy',I.BALELYNX);
  const a=options(t).find(selected(t,target));assert(a);assert.equal(a.destructionReplacement,undefined);
  const r=step(t,TYPE,selected(t,target));assert.equal(locate(t,target).zone,'extra');assert.equal(locate(t,balelynx).zone,'gy');
  assert.equal(r.action.paid.length,0);noDestruction(r);replay(t);
 });
 await test('A real Mo Ye Token ceases, releases its live lock and creates no destruction trigger',()=>{
  const t=make({hands:[[I.MOYE,I.LONGYUAN,I.SHTHANA],[]]}),moye=uid(t,0,'hand',I.MOYE);
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===moye&&pass(a));assert.equal(options(t).length,0,'Resolve the pending trigger first');
  step(t,'MOYE_TOKEN',a=>a.revealUid===uid(t,0,'hand',I.LONGYUAN));
  const token=t.state.zones[0].monster.find(x=>x.token);assert(token);assert.equal(id(token),I.TOKEN);
  assert.equal(H.extraAllowed(t.state,'LINK'),false);const r=step(t,TYPE,selected(t,token.uid));
  assert.equal(locate(t,token.uid),null);assert.equal(t.state.tokenLedger[token.uid].destroyed,true);
  assert.equal(H.extraAllowed(t.state,'LINK'),true);assert(!t.state.pendingTriggers.some(x=>x.kind==='TENYI_SHTHANA_REVIVE'));
  assert.equal(cards(t,0,'hand',I.TOKEN).length,0);noDestruction(r);replay(t);
 });
 await test('A real revived Spinny honours its known banish redirect instead of fabricating a hand return',()=>{
  const t=make({placements:[monster(0,I.GAZELLE,0),gy(0,I.SPINNY)]}),spinny=uid(t,0,'gy',I.SPINNY);
  step(t,'SALAMANGREAT_SPINNY_REVIVE',a=>a.sourceUid===spinny&&pass(a));assert.equal(locate(t,spinny).item.leaveFieldRedirect,'banished');
  const r=step(t,TYPE,selected(t,spinny));assert.equal(locate(t,spinny).zone,'banished');assert.equal(cards(t,0,'hand',I.SPINNY).length,0);
  assert.equal(t.state.used.SALAMANGREAT_SPINNY_REVIVE,true);noDestruction(r);replay(t);
 });
 await test('Returning Mirrorjade to hidden Extra creates no End Phase activation or optional-decline event',()=>{
  const t=make({targetId:I.MIRRORJADE,targetProperties:{properlySummoned:true,declaredSummonType:'FUSION'}}),target=uid(t,1,'monster',I.MIRRORJADE);
  const r=step(t,TYPE,selected(t,target));assert.equal(locate(t,target).zone,'extra');
  assert(!t.state.delayedEffects?.some(x=>x.kind==='MIRRORJADE_END_PHASE_DESTROY'&&x.sourceUid===target));
  assert(!r.action.events.some(e=>e.type==='MIRRORJADE_LEAVING_TRIGGER_ACTIVATED'||e.effect==='MIRRORJADE_END_PHASE_DESTRUCTION'));
  noDestruction(r);replay(t);
 });
 function branded(o={}){return make({hands:[[I.BRANDED_FUSION],[]],cards:[[I.ALBAZ,I.DARK_MAGICIAN],[]],extra:[[I.LUBELLION,I.MIRRORJADE],[]],...o});}
 function fusionMirrorjade(t){
  step(t,'BRANDED_FUSION_LUBELLION',a=>pass(a)&&a.materialUids.every(u=>locate(t,u).zone==='deck'));
  step(t,'LUBELLION_FUSION_MIRRORJADE',pass);const target=uid(t,0,'monster',I.MIRRORJADE);
  assert(target);assert.equal(locate(t,target).item.summonType,'FUSION');return target;
 }
 await test('Returning an actually Fusion Summoned Mirrorjade clears local history without refunding global Branded budgets, locks or Extra history',()=>{
  const t=branded(),target=fusionMirrorjade(t),used=copy(t.state.used),locks=copy(t.state.locks),history=copy(t.state.extraHistory);
  assert.equal(t.state.used.BRANDED_FUSION_ACTIVATED,true);assert.equal(t.state.used.LUBELLION_FUSION,true);
  assert(locks.some(x=>x.kind==='FUSION_ONLY'));assert.deepEqual(history,['FUSION','FUSION']);
  const r=step(t,TYPE,selected(t,target));assert.equal(locate(t,target).zone,'extra');
  assert.equal(locate(t,target).item.summonType,undefined);assert.equal(locate(t,target).item.properlySummoned,undefined);
  assert.deepEqual(copy(t.state.used),used);assert.deepEqual(copy(t.state.locks),locks);assert.deepEqual(copy(t.state.extraHistory),history);
  assert(!r.action.events.some(e=>e.type==='MIRRORJADE_LEAVING_TRIGGER_ACTIVATED'||e.effect==='MIRRORJADE_END_PHASE_DESTRUCTION'));replay(t);
 });
 await test('Returning another Mirrorjade preserves an already scheduled real departure effect without scheduling a new hidden-return effect',()=>{
  const t=branded({targetId:I.MIRRORJADE,extra:[[I.LUBELLION,I.MIRRORJADE],[I.LUBELLION]]}),ownMirror=fusionMirrorjade(t),rivalMirror=uid(t,1,'monster',I.MIRRORJADE);
  step(t,'MIRRORJADE_BANISH',a=>a.player===1&&a.banishUid===ownMirror&&pass(a));
  assert(t.state.delayedEffects.some(x=>x.sourceUid===ownMirror&&x.player===0&&x.kind==='MIRRORJADE_END_PHASE_DESTROY'));
  const queued=copy(t.state.delayedEffects),r=step(t,TYPE,selected(t,rivalMirror));assert.equal(locate(t,rivalMirror).zone,'extra');
  assert.deepEqual(copy(t.state.delayedEffects),queued);assert(!r.action.events.some(e=>e.type==='MIRRORJADE_LEAVING_TRIGGER_ACTIVATED'));replay(t);
 });
 await test('Returning real Mo Ye keeps its spent name budget, Normal Summon and the surviving Token lock',()=>{
  const t=make({hands:[[I.MOYE,I.LONGYUAN],[]]}),moye=uid(t,0,'hand',I.MOYE);
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===moye&&pass(a));step(t,'MOYE_TOKEN',a=>a.revealUid===uid(t,0,'hand',I.LONGYUAN));
  assert.equal(t.state.used.MOYE_TOKEN,true);const token=t.state.zones[0].monster.find(x=>x.token),locks=copy(t.state.locks);
  step(t,TYPE,selected(t,moye));assert.equal(locate(t,moye).zone,'hand');assert.equal(t.state.used.MOYE_TOKEN,true);
  assert.equal(t.state.normalSummonAvailable[0],false);assert.equal(locate(t,token.uid).zone,'monster');
  assert.equal(H.extraAllowed(t.state,'LINK'),false);assert.deepEqual(copy(t.state.locks),locks);replay(t);
 });
 await test('A used Mechaba returned to hidden Extra loses only its field-instance use metadata',()=>{
  const t=make({targetId:I.MECHABA,mechaba:true,placements:[set(0,I.IMPERM,3)]}),target=uid(t,1,'monster',I.MECHABA);
  step(t,'ACTIVATE_INFINITE_IMPERMANENCE',a=>a.player===0&&a.targetUid===target&&a.response?.type==='MECHABA'&&!a.counterResponses);
  assert.equal(t.state.used['MECHABA_NEGATE:'+target],true);step(t,TYPE,selected(t,target));
  assert.equal(locate(t,target).zone,'extra');assert.equal(t.state.used['MECHABA_NEGATE:'+target],undefined);replay(t);
 });
 for(const targetId of [I.BEWD,I.MECHABA])await test('QA-only physical control-transfer state returns '+targetId+' to its owner, with no claim of a registered control-change history',()=>{
  const t=make({targetId}),target=uid(t,1,'monster',targetId),inventory=H.inventory(t.state);
  // Control-changing cards are not registered. This direct helper operation
  // supplies a physical diagnostic state, not a replay-certified game origin.
  H.move(t.state,target,'monster',{player:0,zoneIndex:0,faceUp:true});
  assert.equal(locate(t,target).player,0);assert.equal(locate(t,target).item.ownerPlayer,1);
  assert.equal(H.inventory(t.state),inventory);const r=step(t,TYPE,selected(t,target));
  assert.equal(locate(t,target).player,1);assert.equal(locate(t,target).zone,targetId===I.BEWD?'hand':'extra');
  const event=r.action.events.find(e=>e.type==='COMPULSORY_RETURN_MONSTER');assert(event);
  assert.equal(event.fromPlayer,0);assert.equal(event.ownerPlayer,1);assert.equal(event.toPlayer,1);
 });
 await test('A Main-to-hand return does not create a Deck search, shuffle, Ash or Droll window',()=>{
  const t=make({responseTypes:['DROLL','ASH','SPIRIT'],hands:[[],[I.DROLL,I.ASH]],placements:[monster(1,I.SPIRIT,0)]}),target=uid(t,1,'monster',I.BEWD);
  const known=copy(t.state.deckOrderKnown);assert(options(t).every(pass));const r=step(t,TYPE,selected(t,target));
  assert.deepEqual(copy(t.state.deckOrderKnown),known);assert(!E.enumerate(t.state).some(a=>a.type==='DROLL_LOCK'));
  assert(!r.action.events.some(e=>/SEARCH|SHUFFLE|DRAW/.test(e.type)));replay(t);
 });
 for(const cost of [I.CED,I.IMPERM,I.ROAR])await test('Mechaba pays real Trap '+cost+' and banishes CED without returning the selected monster',()=>{
  const t=make({mechaba:true,cost}),source=uid(t,0,'spelltrap',I.CED),target=uid(t,1,'monster',I.BEWD);
  const r=step(t,TYPE,selected(t,target,a=>a.response?.type==='MECHABA'&&!a.counterResponses));packet(r,t,source,target,1);
  assert.equal(r.action.response.matchingCardType,'TRAP');assert.equal(r.action.response.activationKind,'TRAP_CARD_ACTIVATION');
  assert.equal(r.action.response.activationZone,'spelltrap');assert.equal(r.action.response.nonTargeting,true);
  assert.equal(r.action.proof.activationNegated,true);assert.equal(locate(t,source).zone,'banished');assert.equal(locate(t,target).zone,'monster');
  assert.equal(locate(t,r.action.response.costUid).zone,'gy');assert(r.action.paid.some(x=>x.kind==='SEND_GY'&&x.uid===r.action.response.costUid&&x.from==='hand'&&x.player===1));
  assert(!r.action.events.some(e=>e.type==='NORMAL_TRAP_RESOLUTION_CLEANUP'&&e.uid===source));replay(t);
 });
 await test('Mechaba can negate CED aimed at its actor own monster and uses the other player cost',()=>{
  const t=make({player:1,targetPlayer:1,mechaba:true}),source=uid(t,1,'spelltrap',I.CED),target=uid(t,1,'monster',I.BEWD);
  const r=step(t,TYPE,selected(t,target,a=>a.response?.type==='MECHABA'&&!a.counterResponses));
  packet(r,t,source,target,1);assert.equal(r.action.response.player,0);assert.equal(locate(t,r.action.response.costUid).player,0);
  assert.equal(locate(t,source).zone,'banished');assert.equal(locate(t,target).zone,'monster');replay(t);
 });
 await test('Monster or Spell hand cards cannot pay the Trap matching cost',()=>{
  const t=make({mechaba:true,cost:null,hands:[[],[I.INVOCATION,I.MOYE]]});assert(!options(t).some(a=>a.response?.type==='MECHABA'));
 });
 await test('Roar negates CED card activation, destroys the source and leaves the target in place',()=>{
  const t=make({opponentRoar:true}),source=uid(t,0,'spelltrap',I.CED),target=uid(t,1,'monster',I.BEWD);
  const r=step(t,TYPE,selected(t,target,a=>a.response?.type==='ROAR'&&!a.counterResponses));
  assert.equal(r.action.proof.activationNegated,true);assert.equal(locate(t,source).zone,'gy');assert.equal(locate(t,target).zone,'monster');
  assert(r.action.events.some(e=>e.type==='DESTROYED_BY_EFFECT'&&e.uid===source));assert.equal(t.state.used['SALAMANGREAT_ROAR:1'],true);replay(t);
 });
 await test('Own Roar counters Mechaba, keeps its Trap cost paid and restores a return to the actor hand',()=>{
  const t=make({targetPlayer:0,mechaba:true,ownRoar:true}),target=uid(t,0,'monster',I.BEWD);
  const r=step(t,TYPE,selected(t,target,a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===1));
  assert.equal(r.action.proof.registeredResponseChain.firstResponseNegated,true);assert.equal(r.action.proof.activationNegated,false);
  assert.equal(locate(t,r.action.response.costUid).zone,'gy');assert.equal(locate(t,r.action.response.uid).zone,'gy');
  assert.equal(locate(t,target).zone,'hand');assert.equal(cards(t,0,'gy',I.ROAR).length,1);replay(t);
 });
 await test('If the selected Mechaba is destroyed by the counter, the Trap resolves without returning a different copy',()=>{
  const t=make({targetId:I.MECHABA,mechaba:true,ownRoar:true}),target=uid(t,1,'monster',I.MECHABA);
  const r=step(t,TYPE,selected(t,target,a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===1));
  assert.equal(r.action.proof.activationNegated,false);assert.equal(locate(t,target).zone,'gy');assert.equal(cards(t,1,'extra',I.MECHABA).length,0);
  assert.equal(cards(t,0,'gy',I.CED).length,1);assert.equal(locate(t,r.action.response.costUid).zone,'gy');replay(t);
 });
 await test('A Spark-protected Mechaba survives the counter destruction and is then returned to its Extra',()=>{
  const t=make({targetId:I.MECHABA,mechaba:true,ownRoar:true,placements:[monster(1,I.SPARK,3)]}),target=uid(t,1,'monster',I.MECHABA);
  step(t,'STARDUST_SPARK_PROTECTION',a=>a.player===1&&a.targetUid===target&&pass(a));
  const r=step(t,TYPE,selected(t,target,a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===1));
  assert(r.action.events.some(e=>e.type==='SPARK_DESTRUCTION_PREVENTED'&&e.uid===target));assert.equal(locate(t,target).zone,'extra');replay(t);
 });
 await test('Two Roar counter links resolve LIFO and restore the Mechaba negation without refunding costs',()=>{
  const t=make({mechaba:true,ownRoar:true,opponentRoar:true}),target=uid(t,1,'monster',I.BEWD);
  const r=step(t,TYPE,selected(t,target,a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===2));
  const chain=r.action.proof.registeredResponseChain;assert.deepEqual(Array.from(chain.resolutions.filter(e=>e.type==='REGISTERED_CHAIN_LINK_RESOLVED'),e=>e.chainLink),[4,3,2]);
  assert.equal(chain.firstResponseNegated,false);assert.equal(r.action.proof.activationNegated,true);assert.equal(locate(t,target).zone,'monster');
  assert.equal(locate(t,r.action.sourceUid).zone,'banished');assert.equal(locate(t,r.action.response.costUid).zone,'gy');
  assert(r.action.counterResponses.every(x=>x.type==='ROAR'));replay(t);
 });
 await test('A physical own Roar can counter a rival Roar to restore the return',()=>{
  const t=make({ownRoar:true,opponentRoar:true}),target=uid(t,1,'monster',I.BEWD);
  const r=step(t,TYPE,selected(t,target,a=>a.response?.type==='ROAR'&&a.counterResponses?.length===1));
  assert.equal(r.action.proof.registeredResponseChain.firstResponseNegated,true);assert.equal(locate(t,target).zone,'hand');replay(t);
 });
 await test('A real prior mirrored Impermanence column negates the CED effect while allowing its activation and cleanup',()=>{
  const t=make({targetId:I.SPIRIT,placements:[monster(0,I.SAGE,0),set(1,I.IMPERM,3)]}),target=uid(t,1,'monster',I.SPIRIT),source=uid(t,0,'spelltrap',I.CED);
  step(t,'ACTIVATE_INFINITE_IMPERMANENCE',a=>a.player===1&&a.targetUid===uid(t,0,'monster',I.SAGE)&&pass(a));assert.equal(lock(t)[0].column,1);
  const r=step(t,TYPE,selected(t,target));assert.equal(r.action.proof.activationNegated,false);assert.equal(r.action.proof.effectNegated,true);
  assert.equal(locate(t,target).zone,'monster');assert.equal(locate(t,source).zone,'gy');assert.equal(lock(t).length,1);replay(t);
 });
 await test('A blocked first Roar still uses its real Set source but cannot negate an unblocked CED return',()=>{
  const t=make({column:2,targetId:I.SPIRIT,responseTypes:['ROAR'],placements:[set(0,I.IMPERM,1),monster(1,I.WOLF,5),set(1,I.ROAR,3)]}),target=uid(t,1,'monster',I.SPIRIT);
  step(t,'ACTIVATE_INFINITE_IMPERMANENCE',a=>a.player===0&&a.targetUid===target&&pass(a));assert.equal(lock(t)[0].column,1);
  const r=step(t,TYPE,selected(t,target,a=>a.response?.type==='ROAR'&&!a.counterResponses));assert.equal(r.action.proof.activationNegated,false);
  assert.equal(locate(t,target).zone,'extra');assert.equal(cards(t,1,'gy',I.ROAR).length,1);assert.equal(t.state.used['SALAMANGREAT_ROAR:1'],true);
  assert(r.action.events.some(e=>e.type==='ROAR_EFFECT_NEGATED_BY_COLUMN'));replay(t);
 });
 await test('A blocked own Roar counter leaves Mechaba effective and preserves the paid Trap cost',()=>{
  const t=make({column:2,targetId:I.SPIRIT,mechaba:true,ownRoar:true,placements:[set(1,I.IMPERM,4),monster(0,I.SAGE,3)]}),target=uid(t,1,'monster',I.SPIRIT);
  step(t,'ACTIVATE_INFINITE_IMPERMANENCE',a=>a.player===1&&a.targetUid===uid(t,0,'monster',I.SAGE)&&pass(a));assert.equal(lock(t)[0].column,0);
  const r=step(t,TYPE,selected(t,target,a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===1));
  assert.equal(r.action.proof.registeredResponseChain.firstResponseNegated,false);assert.equal(r.action.proof.activationNegated,true);
  assert.equal(locate(t,target).zone,'monster');assert.equal(locate(t,r.action.sourceUid).zone,'banished');assert.equal(locate(t,r.action.response.costUid).zone,'gy');
  assert.equal(cards(t,0,'gy',I.ROAR).length,1);assert.equal(t.state.used.SALAMANGREAT_ROAR,true);replay(t);
 });
 for(const [label,o] of [
  ['unknown Effect monster',{targetId:I.UNKNOWN}],['Xyz monster',{targetId:I.XYz}],
  ['Pendulum monster',{targetId:I.PENDULUM}],['impossible Set Link',{targetId:I.WOLF,targetFaceUp:false}]
 ])await test('Unreviewed target profile is excluded: '+label,()=>{
  const t=make(o),target=uid(t,1,'monster',o.targetId);assert(!options(t).some(a=>a.targetUid===target));
 });
 await test('Read-only target gate probes exclude active target immunity, attachments and unknown redirects',()=>{
  for(const flags of [{effectTargetImmuneUntilTurn:2},{attachments:['unknown']},{overlayUids:['unknown']},{equippedCards:['unknown']},{leaveFieldRedirect:'UNREVIEWED'}]){
   const t=make(),target=uid(t,1,'monster',I.BEWD);Object.assign(locate(t,target).item,flags);const before=JSON.stringify(t.state);
   assert(!options(t).some(a=>a.targetUid===target),JSON.stringify(flags));assert.equal(JSON.stringify(t.state),before);
  }
 });
 await test('Source eligibility rejects wrong Trap identity, corrupt redirect and invalid or different columns',()=>{
  const t=make(),source=uid(t,0,'spelltrap',I.CED);assert.equal(H.normalTrapActivationEligible(t.state,source,I.CED,1),true);
  for(const column of [-1,5,1.2,'1',null,2])assert.equal(H.normalTrapActivationEligible(t.state,source,I.CED,column),false);
  assert.equal(H.normalTrapActivationEligible(t.state,source,I.ROAR,1),false);
  const changed=copy(t.state);H.locate(changed,source).item.leaveFieldRedirect='UNREVIEWED';assert.equal(H.normalTrapActivationEligible(changed,source,I.CED,1),false);
 });
 await test('Default policy offers player-zero CED during rival turn and manual mode alone exposes rival voluntary actions',()=>{
  const own=make({activePlayer:1,context:{manualBothPlayers:false}});assert(options(own).some(a=>a.player===0));
  const rival=make({player:1,context:{manualBothPlayers:false}});assert(!options(rival).some(a=>a.player===1));
  const manual=make({player:1});assert(options(manual).some(a=>a.player===1));
 });
 await test('Unfinished Draw, a pending trigger or an unmodeled phase does not create a Trap window',()=>{
  assert.equal(options(make({phase:'DRAW'})).length,0);
  const t=make({hands:[[I.MOYE,I.LONGYUAN],[]]});step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.MOYE));assert.equal(options(t).length,0);
  const damage=make();damage.state.phase='DAMAGE STEP';assert.equal(options(damage).length,0);
 });
 await test('Forged actor, source, unavailable target, column and hand-origin data are rejected transactionally',()=>{
  const t=make(),a=options(t).find(pass);assert(a);const before=JSON.stringify(t.state);
  for(const change of [{player:1},{sourceUid:'invented'},{targetUid:'invented'},{targetUid:uid(t,0,'spelltrap',I.CED)},{column:4},{normalTrapActivation:{originZone:'hand'}}])
   assert.equal(E.execute(t.state,{...a,...change}).pass,false,JSON.stringify(change));
  assert.equal(JSON.stringify(t.state),before);
 });
 await test('Forged matching cost, responder packet and illegal Speed 2 counter cannot replace a real Trap payment',()=>{
  const t=make({mechaba:true,ownRoar:true}),a=options(t).find(a=>a.response?.type==='MECHABA'&&!a.counterResponses);assert(a);const before=JSON.stringify(t.state);
  for(const change of [{costUid:'invented'},{matchingCardType:'SPELL'},{activationKind:'MONSTER_EFFECT'},{activationZone:'hand'},{targetUid:'invented'},{registeredNormalTrapPacket:'ACTIVATE_INFINITE_IMPERMANENCE'}])
   assert.equal(E.execute(t.state,{...a,response:{...a.response,...change}}).pass,false,JSON.stringify(change));
  assert.equal(E.execute(t.state,{...a,counterResponses:[{type:'MECHABA',uid:a.response.uid,player:0,targetUid:a.response.uid}]}).pass,false);
  assert.equal(JSON.stringify(t.state),before);
 });
 await test('Fresh replay rejects altered target owner, origin, Set status, card identity, cleanup and return destination',()=>{
  const t=make();step(t);const line=replay(t);
  for(const change of [{targetPlayer:0},{originZone:'hand'},{fromSet:false},{cardId:I.IMPERM},{column:4},{spellSpeed:3}]){
   const forged=copy(line);Object.assign(forged.actions[0].proof.normalTrapActivation,change);assert.equal(E.replay(forged,{deck:t.deck}).pass,false);
  }
  const altered=copy(line);altered.actions[0].events=altered.actions[0].events.filter(e=>e.type!=='NORMAL_TRAP_RESOLUTION_CLEANUP');assert.equal(E.replay(altered,{deck:t.deck}).pass,false);
  const moved=copy(line),target=moved.after.zones[1].hand.find(x=>id(x)===I.BEWD);moved.after.zones[1].hand=moved.after.zones[1].hand.filter(x=>x.uid!==target.uid);moved.after.zones[1].gy.push(target);moved.state=copy(moved.after);
  assert.equal(E.replay(moved,{deck:t.deck}).pass,false);
 });
 await test('Undo through the recorded before-state restores the same Set source and target, then re-executes identically',()=>{
  const t=make(),target=uid(t,1,'monster',I.BEWD),r=step(t),restored=copy(r.action.before);replay(t);
  assert.equal(H.locate(restored,target).zone,'monster');assert.equal(H.locate(restored,r.action.sourceUid).item.faceUp,false);
  const again=E.execute(restored,{type:TYPE,player:0,sourceUid:r.action.sourceUid,targetUid:target,column:1});assert.equal(again.pass,true);
  assert.deepEqual(copy(again.after),copy(t.state));
 });
 await test('Bounded search discovers the actual return and every accepted line replays without claiming a win rate',async()=>{
  const t=make(),target=uid(t,1,'monster',I.BEWD),before=JSON.stringify(t.initial);
  const result=await E.search(t.initial,{checkCurrentDeck:false,maxDepth:1,maxStates:250,maxMs:4000,maxTurns:1,goal:s=>H.locate(s,target)?.zone==='hand'});
  assert.equal(result.pass,true);assert(result.lines.length>0);assert(result.lines.every(line=>line.actions.some(a=>a.type===TYPE)&&E.replay(line,{deck:t.deck}).pass));
  assert.equal(result.certified,false);assert.equal(result.globalOptimalityProven,false);assert.equal(JSON.stringify(t.initial),before);
 });

 const report={schema:'ygo-compulsory-evacuation-regression/v1',pass:tests.every(x=>x.pass),total:tests.length,tests,
  limitations:['Pinned technical catalogue and application TCG snapshot are not independent official ruling authentication.',
   'Registered Set Compulsory and reviewed departure profiles only; Xyz, Pendulum, attachments, general priority, SEGOC and Damage Step remain outside scope.',
   'Declared fields and metadata gate probes do not certify prior history. The two direct helper control-transfer diagnostics do not certify an unregistered control-changing effect or a replay origin; competitive scoring remains provisional.']};
 fs.writeFileSync(path.join(ROOT,'tests/compulsory-evacuation-results.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));if(!report.pass)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});

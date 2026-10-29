'use strict';
/* Registered Normal Trap card activations using the pinned real catalogue.
 * Diagnostic decks and declared fields do not certify tournament results or
 * a complete priority/Damage Step model. No arbitrary card-text execution. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const {harness,ROOT}=require('./combo_engine.cjs');
const copy=structuredClone,TYPE='ACTIVATE_INFINITE_IMPERMANENCE';
const I={IMPERM:10045474,MECHABA:75286621,SPIRIT:59822133,ROAR:51339637,
  WOLF:87871125,BALELYNX:14812471,SPARK:83994433,ALEISTER:86120751,
  INVOCATION:74063034,MAUSOLEUM:24382602,BEWD:89631139,SAGE:8240199,
  MOYE:20001443,LONGYUAN:93490856,AZURE:40908371,CHIXIAO:69248256,UNKNOWN_EFFECT:38033121};

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
 function hand(d,wanted,reserved){const avail=new Map(d.main.map(row=>[row.id,row.qty])),out=[...wanted];
  for(const n of [...wanted,...reserved]){assert((avail.get(n)||0)>0,'Missing physical card '+n);avail.set(n,avail.get(n)-1);}
  for(const n of fillers)while(out.length<5&&(avail.get(n)||0)>0){out.push(n);avail.set(n,avail.get(n)-1);}
  assert.equal(out.length,5);return out;
 }
 function remaining(d,opening){const out=d.main.flatMap(row=>Array(row.qty).fill(row.id));
  for(const n of opening){const at=out.indexOf(n);assert(at>=0);out.splice(at,1);}return out;}
 const monster=(player,cardId,zoneIndex=0,from='extra',other={})=>
  ({player,cardId,zone:'monster',from,faceUp:true,position:'ATTACK',summonTurn:1,zoneIndex,...other});
 const set=(player,cardId,zoneIndex=1,setTurn=1)=>
  ({player,cardId,zone:'spelltrap',from:'deck',faceUp:false,zoneIndex,setTurn});
 function make(o={}){
  const p=o.player??0,q=1-p,from=o.from||'spelltrap',copies=o.copies??1,placements=[],wanted=[[],[]];
  if(from==='spelltrap')for(let n=0;n<copies;n++)placements.push(set(p,I.IMPERM,(o.column??1)+n,o.setTurn??1));
  else wanted[p].push(...Array(copies).fill(I.IMPERM));
  const targetId=o.targetId??I.SPIRIT,targetFrom=Number(W.YGODataCatalog.rulesCard(targetId).typeBits)&(0x40|0x2000|0x800000|0x4000000)?'extra':'deck';
  placements.push(monster(q,targetId,2,targetFrom,{...(o.targetProperties||{}),...(o.targetFaceUp===false?{faceUp:false,position:'DEFENSE'}:{})}));
  if(o.mechaba&&targetId!==I.MECHABA)placements.push(monster(q,I.MECHABA,0));
  if(o.ownRoar){placements.push(monster(p,I.WOLF,5),set(p,I.ROAR,0));}
  if(o.opponentRoar){placements.push(monster(q,I.WOLF,5),set(q,I.ROAR,4));}
  if(o.cost!==null&&o.mechaba)wanted[q].push(o.cost??I.IMPERM);
  for(let player=0;player<2;player++)wanted[player].push(...(o.hands?.[player]||[]));
  placements.push(...copy(o.placements||[]));
  const decks=[0,1].map(player=>deck([
   ...placements.filter(row=>row.player===player&&row.from==='deck').map(row=>row.cardId),
   ...wanted[player],...(o.cards?.[player]||[])],
   [...placements.filter(row=>row.player===player&&row.from==='extra').map(row=>row.cardId),...(o.extra?.[player]||[])]));
  const openings=decks.map((d,player)=>hand(d,wanted[player],placements.filter(row=>row.player===player&&row.from==='deck').map(row=>row.cardId)));
  const types=o.responseTypes||(o.mechaba||o.opponentRoar?['MECHABA','ROAR']:[]);
  const spec={deck:decks[0],openingIds:openings[0],remainingDeckIds:remaining(decks[0],openings[0]),
   opponentDeck:decks[1],opponentOpeningIds:openings[1],opponentRemainingDeckIds:remaining(decks[1],openings[1]),
   context:{format:'tcg',duelMode:true,manualBothPlayers:true,opponentPolicy:types.length?'RESPONSES_EXPLICIT':'PASS',responseTypes:types,responsePolicy:'CHOICE_BRANCHES',...(o.context||{})},
   setup:{turn:o.turn??2,activePlayer:o.activePlayer??0,phase:o.phase||'MAIN 1',placements}};
  const initial=E.createState(spec);return{p,q,from,deck:decks[0],spec,initial,state:copy(initial),actions:[]};
 }
 const cards=(t,p,z,n)=>t.state.zones[p][z].filter(x=>id(x)===n);
 const uid=(t,p,z,n)=>cards(t,p,z,n)[0]?.uid;
 const locate=(t,u)=>H.locate(t.state,u);
 const pass=a=>!a.response&&!a.responseUid;
 const options=t=>E.enumerate(t.state).filter(a=>a.type===TYPE);
 const root=(t,pred=pass)=>options(t).find(a=>a.player===t.p&&pred(a));
 function step(t,type=TYPE,pred=pass){const action=E.enumerate(t.state).find(a=>a.type===type&&pred(a));
  assert(action,'Missing '+type+': '+JSON.stringify(E.enumerate(t.state).map(a=>({type:a.type,player:a.player,response:a.response?.type,counterResponses:a.counterResponses?.length}))));
  const before=JSON.stringify(t.state),inventory=H.inventory(t.state),result=E.execute(t.state,action);
  assert.equal(result.pass,true,JSON.stringify(result));assert.equal(JSON.stringify(t.state),before,'Input changed');
  assert.equal(H.inventory(result.after),inventory,'Physical inventory changed');t.state=result.after;t.actions.push(result.action);return result;
 }
 function replay(t){const line={before:copy(t.initial),after:copy(t.state),state:copy(t.state),actions:copy(t.actions),
  context:copy(t.initial.context),deckFingerprint:E.deckFingerprint(t.deck),scope:E.version,certified:false,globalOptimalityProven:false};
  assert.equal(E.replay(line,{deck:t.deck}).pass,true);return line;
 }
 function packet(r,t,source,target,column=t.from==='spelltrap'?1:r.action.column){const p=r.action.proof.normalTrapActivation;
  assert(p);assert.equal(p.kind,'NORMAL_TRAP_CARD_ACTIVATION');assert.equal(p.sourceUid,source);assert.equal(p.cardId,I.IMPERM);
  assert.equal(p.player,t.p);assert.equal(p.originZone,t.from);assert.equal(p.activationZone,'spelltrap');assert.equal(p.column,column);
  assert.equal(p.fromSet,t.from==='spelltrap');assert.equal(p.setTurn,t.from==='spelltrap'?1:null);assert.equal(p.spellSpeed,2);
  assert.equal(p.targetUid,target);assert.equal(p.targetPlayer,t.q);assert.equal(r.action.proof.activationOrigin.zone,t.from);
  assert.equal(r.action.proof.activationOrigin.cardActivation,'NORMAL_TRAP');assert.equal(r.action.proof.activationOrigin.restriction,'NONE');
  assert.equal(r.action.proof.normalSpellActivation,null);assert.equal(r.action.proof.fieldSpellActivation,null);
  assert.equal(r.action.proof.activationColumn,column);return p;
 }
 const lock=t=>t.state.locks.filter(x=>x.kind==='IMPERM_COLUMN_NEGATED');
 const targetNegated=(t,u)=>locate(t,u)?.item.effectsNegated===true;
 async function test(name,fn){try{await fn();tests.push({name,pass:true});}catch(error){tests.push({name,pass:false,error:error.stack});}}

 await test('The registry preserves Impermanence and adds exactly the second reviewed Speed 2 Normal Trap',()=>{
  const caps=E.capabilities(),normal=caps.normalTrapActivations;
  assert.equal(normal.length,2);assert.equal(normal[0].type,TYPE);assert.equal(normal[0].cardId,I.IMPERM);
  const ced=normal.find(row=>row.cardId===94192409);assert(ced);assert.equal(ced.type,'ACTIVATE_COMPULSORY_EVACUATION_DEVICE');
  assert.deepEqual(Array.from(ced.activationZones),['spelltrap']);assert.deepEqual(Array.from(normal[0].activationZones),['hand','spelltrap']);
  assert.equal(normal[0].spellSpeed,2);assert.equal(normal[0].restriction,'NONE');
  assert.equal(caps.normalSpellActivations.length,3);assert.equal(caps.fieldSpellActivations.length,2);
  const response=W.YGOResponses.capabilities();assert(Array.from(response.mechabaModeledCardTypes).includes('TRAP'));
  assert.deepEqual(Array.from(response.mechabaNormalTrapActivations),[TYPE,'ACTIVATE_COMPULSORY_EVACUATION_DEVICE']);
  assert.equal(response.mechabaNonFieldMonsterActivations.length,15);
 });
 for(const from of ['hand','spelltrap'])await test('Resolving '+from+' Impermanence binds its source and target before cleanup, preserving every copy',()=>{
  const t=make({from}),source=uid(t,0,from,I.IMPERM),target=uid(t,1,'monster',I.SPIRIT),r=step(t);
  packet(r,t,source,target,r.action.column);assert.equal(locate(t,source).zone,'gy');assert(targetNegated(t,target));
  assert.equal(locate(t,target).item.negatedUntilTurn,2);assert.equal(r.action.paid.length,0);
  assert.equal(lock(t).length,from==='spelltrap'?1:0);
  assert(r.action.events.some(e=>e.type==='NORMAL_TRAP_CARD_ACTIVATION'&&e.sourceUid===source));
  assert(r.action.events.some(e=>e.type==='NORMAL_TRAP_RESOLUTION_CLEANUP'&&e.uid===source));
  assert.equal(r.action.proof.activationNegated,false);replay(t);
 });
 await test('An empty controlled field offers all five hand activation columns without inventing a Set column effect',()=>{
  const t=make({from:'hand'}),rows=options(t).filter(pass);assert.deepEqual([...new Set(rows.map(a=>a.column))].sort(),[0,1,2,3,4]);
  const r=step(t,TYPE,a=>pass(a)&&a.column===4);assert.equal(r.action.proof.normalTrapActivation.column,4);assert.equal(lock(t).length,0);replay(t);
 });
 await test('Opponent manual activation uses its own physical copy and mirrors the column into player-zero coordinates',()=>{
  const t=make({player:1,column:0}),source=uid(t,1,'spelltrap',I.IMPERM),target=uid(t,0,'monster',I.SPIRIT);
  const r=step(t,TYPE,a=>a.player===1&&pass(a));packet(r,t,source,target,0);assert(targetNegated(t,target));
  assert.equal(lock(t)[0].column,4);assert.equal(lock(t)[0].sourceColumn,0);replay(t);
 });
 await test('A Set Trap still activates when all five ordinary Spell/Trap zones are full',()=>{
  const s=make({placements:[set(0,I.ROAR,0),set(0,I.IMPERM,2),set(0,I.INVOCATION,3),set(0,I.INVOCATION,4)]});
  assert.equal(s.state.zones[0].spelltrap.filter(x=>!x.fieldSpell).length,5);step(s);assert.equal(cards(s,0,'gy',I.IMPERM).length,1);replay(s);
 });
 await test('A Trap Set this turn is not an activation source',()=>{
  const t=make({setTurn:2});assert.equal(options(t).filter(a=>a.player===0).length,0);
 });
 await test('A future declared Set turn is rejected before creating an initial state',()=>{
  assert.throws(()=>make({setTurn:3}),/DECLARED_SET_TURN_INVALID/);
 });
 await test('A Trap newly Set by an actual duel action cannot activate during the same turn',()=>{
  const t=make({from:'hand'}),source=uid(t,0,'hand',I.IMPERM);
  step(t,'DUEL_SET_SPELL_TRAP',a=>a.player===0&&a.sourceUid===source);assert.equal(locate(t,source).item.setTurn,2);
  assert(!options(t).some(a=>a.sourceUid===source));replay(t);
 });
 for(const [label,placement] of [
  ['monster',monster(0,I.ALEISTER,0,'deck')],
  ['Set Spell/Trap',set(0,I.ROAR,0)],
  ['Field Spell',{player:0,cardId:I.MAUSOLEUM,from:'deck',zone:'spelltrap',faceUp:true}]
 ])await test('A controlled '+label+' prevents the hand exception',()=>{
  const t=make({from:'hand',placements:[placement]});assert.equal(options(t).filter(a=>a.player===0).length,0);
 });
 await test('A real Mo Ye and generated Token block hand activation; unresolved triggers are not skipped',()=>{
  const t=make({from:'hand',hands:[[I.MOYE,I.LONGYUAN],[]]});
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.MOYE));assert(!options(t).length);
  step(t,'MOYE_TOKEN',a=>a.revealUid===uid(t,0,'hand',I.LONGYUAN));assert(t.state.zones[0].monster.some(x=>x.token));
  assert.equal(options(t).filter(a=>a.player===0).length,0);replay(t);
 });
 for(const targetId of [I.BEWD,I.UNKNOWN_EFFECT])await test('Unregistered/non-Effect targets are not inferred from card text: '+targetId,()=>{
  const t=make({targetId});assert.equal(options(t).length,0);
 });
 await test('A face-down opposing monster is not a legal target',()=>{assert.equal(options(make({targetFaceUp:false})).length,0);});
 await test('Targeting protection and already-negated target gates are explicit read-only probes',()=>{
  for(const flag of [{effectsNegated:true,negatedUntilTurn:2},{effectTargetImmuneUntilTurn:2}]){
   const t=make();Object.assign(locate(t,uid(t,1,'monster',I.SPIRIT)).item,flag);const before=JSON.stringify(t.state);
   assert.equal(options(t).length,0);assert.equal(JSON.stringify(t.state),before);
  }
 });
 await test('Normal Trap registry does not turn Roar or unknown Traps into standalone card activations',()=>{
  const t=make({placements:[set(0,I.ROAR,0)]});assert(options(t).every(a=>id(locate(t,a.sourceUid).item)===I.IMPERM));
  assert.equal(E.execute(t.state,{type:TYPE,player:0,sourceUid:uid(t,0,'spelltrap',I.ROAR),targetUid:uid(t,1,'monster',I.SPIRIT),column:0}).pass,false);
 });
 for(const from of ['hand','spelltrap'])for(const cost of [I.IMPERM,I.ROAR])await test('Mechaba pays an actual '+cost+' Trap and banishes the '+from+' root, preserving target and cost destinations',()=>{
  const t=make({from,mechaba:true,cost}),source=uid(t,0,from,I.IMPERM),target=uid(t,1,'monster',I.SPIRIT);
  const r=step(t,TYPE,a=>a.response?.type==='MECHABA'&&!a.counterResponses);packet(r,t,source,target,r.action.column);
  assert.equal(r.action.response.matchingCardType,'TRAP');assert.equal(r.action.response.activationKind,'TRAP_CARD_ACTIVATION');
  assert.equal(r.action.response.activationZone,from);assert.equal(r.action.response.nonTargeting,true);
  assert.equal(locate(t,source).zone,'banished');assert.equal(locate(t,r.action.response.costUid).zone,'gy');
  assert(r.action.paid.some(x=>x.kind==='SEND_GY'&&x.uid===r.action.response.costUid&&x.player===1&&x.from==='hand'));
  assert.equal(r.action.proof.activationNegated,true);assert.equal(targetNegated(t,target),false);assert.equal(lock(t).length,0);
  assert(!r.action.events.some(e=>e.type==='NORMAL_TRAP_RESOLUTION_CLEANUP'&&e.uid===source));replay(t);
 });
 await test('Monster and Spell hand cards cannot substitute for a Mechaba Trap cost',()=>{
  const t=make({mechaba:true,cost:null,hands:[[],[I.INVOCATION]]});assert(!options(t).some(a=>a.response?.type==='MECHABA'));
 });
 await test('Mechaba can answer the other player’s Trap using player zero’s own physical hand cost',()=>{
  const t=make({player:1,column:0,mechaba:true,cost:I.ROAR}),r=step(t,TYPE,a=>a.player===1&&a.response?.type==='MECHABA'&&!a.counterResponses);
  assert.equal(r.action.response.player,0);assert.equal(locate(t,r.action.response.costUid).player,0);
  assert.equal(locate(t,r.action.sourceUid).player,1);assert.equal(locate(t,r.action.sourceUid).zone,'banished');replay(t);
 });
 await test('Counter Trap Roar negates the card activation and sends the source to GY without a field-protection replacement',()=>{
  const t=make({opponentRoar:true}),source=uid(t,0,'spelltrap',I.IMPERM),target=uid(t,1,'monster',I.SPIRIT);
  const r=step(t,TYPE,a=>a.response?.type==='ROAR'&&!a.counterResponses);
  assert.equal(r.action.response.activationKind,'TRAP_CARD_ACTIVATION');assert.equal(r.action.proof.activationNegated,true);
  assert.equal(locate(t,source).zone,'gy');assert.equal(targetNegated(t,target),false);assert.equal(lock(t).length,0);
  const destruction=r.action.events.find(e=>e.type==='DESTROYED_BY_EFFECT'&&e.uid===source);assert(destruction);
  assert(!r.action.events.some(e=>e.uid===source&&/PREVENTED|REPLACED/.test(e.type)));replay(t);
 });
 await test('Own Roar counters Mechaba after its Trap cost and allows a different Spirit target plus the Set column effect',()=>{
  const t=make({mechaba:true,ownRoar:true}),target=uid(t,1,'monster',I.SPIRIT);
  const r=step(t,TYPE,a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===1);
  assert.equal(r.action.proof.registeredResponseChain.firstResponseNegated,true);assert.equal(r.action.proof.activationNegated,false);
  assert.equal(locate(t,r.action.response.costUid).zone,'gy');assert.equal(locate(t,r.action.response.uid).zone,'gy');
  assert(targetNegated(t,target));assert.equal(lock(t).length,1);assert.equal(cards(t,0,'gy',I.ROAR).length,1);replay(t);
 });
 await test('If the targeted Mechaba leaves through the Roar counter, THEN prevents both target negation and the column effect',()=>{
  const t=make({targetId:I.MECHABA,mechaba:true,ownRoar:true}),target=uid(t,1,'monster',I.MECHABA);
  const r=step(t,TYPE,a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===1);
  assert.equal(r.action.proof.activationNegated,false);assert.equal(locate(t,target).zone,'gy');
  assert.equal(lock(t).length,0);assert.equal(cards(t,0,'gy',I.IMPERM).length,1);replay(t);
 });
 await test('A real Spark shield keeps the targeted Mechaba present, so restored Impermanence can negate it and apply its column',()=>{
  const t=make({targetId:I.MECHABA,mechaba:true,ownRoar:true,placements:[monster(1,I.SPARK,3)]}),target=uid(t,1,'monster',I.MECHABA);
  step(t,'STARDUST_SPARK_PROTECTION',a=>a.player===1&&a.targetUid===target&&pass(a));
  const r=step(t,TYPE,a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===1);
  assert.equal(r.action.proof.activationNegated,false);assert.equal(locate(t,target).zone,'monster');assert(targetNegated(t,target));
  assert.equal(locate(t,target).item.sparkProtection.remaining,0);assert.equal(lock(t).length,1);replay(t);
 });
 await test('Roar counter-counter links resolve in LIFO order and cannot turn Mechaba into a Speed 3 responder',()=>{
  const t=make({mechaba:true,ownRoar:true,opponentRoar:true}),target=uid(t,1,'monster',I.SPIRIT);
  const r=step(t,TYPE,a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===2),chain=r.action.proof.registeredResponseChain;
  assert.deepEqual(Array.from(chain.resolutions.filter(e=>e.type==='REGISTERED_CHAIN_LINK_RESOLVED'),e=>e.chainLink),[4,3,2]);
  assert.equal(chain.firstResponseNegated,false);assert.equal(r.action.proof.activationNegated,true);assert.equal(targetNegated(t,target),false);
  assert.equal(lock(t).length,0);assert(r.action.counterResponses.every(c=>c.type==='ROAR'));replay(t);
 });
 await test('A physical Roar can counter another Roar, restoring the Set Trap activation',()=>{
  const t=make({ownRoar:true,opponentRoar:true}),target=uid(t,1,'monster',I.SPIRIT);
  const r=step(t,TYPE,a=>a.response?.type==='ROAR'&&a.counterResponses?.length===1);
  assert.equal(r.action.proof.registeredResponseChain.firstResponseNegated,true);assert(targetNegated(t,target));assert.equal(lock(t).length,1);replay(t);
 });
 await test('An actual previous Impermanence lock negates a later Set Trap effect in the mirrored column without forbidding its activation',()=>{
  const t=make({column:1,placements:[monster(0,I.SAGE,0,'deck'),set(1,I.IMPERM,3)]});
  step(t,TYPE,a=>a.player===0&&pass(a));assert.equal(lock(t).length,1);assert.equal(lock(t)[0].column,1);
  const target=uid(t,0,'monster',I.SAGE),r=step(t,TYPE,a=>a.player===1&&a.targetUid===target&&pass(a));
  assert.equal(r.action.proof.activationNegated,false);assert.equal(r.action.proof.effectNegated,true);
  assert.equal(targetNegated(t,target),false);assert.equal(lock(t).length,1);assert.equal(cards(t,1,'gy',I.IMPERM).length,1);replay(t);
 });
 await test('A Chixiao already negated by the root can still pay its real activation cost but cannot attract a second Impermanence response',()=>{
  const t=make({column:2,targetId:I.CHIXIAO,responseTypes:['IMPERM'],hands:[[],[I.MOYE]],
   placements:[set(0,I.IMPERM,1),monster(0,I.WOLF,5)]});
  const chixiao=uid(t,1,'monster',I.CHIXIAO),wolf=uid(t,0,'monster',I.WOLF),moye=uid(t,1,'hand',I.MOYE);
  const secondTrap=cards(t,0,'spelltrap',I.IMPERM).find(x=>x.zoneIndex===1).uid;
  step(t,TYPE,a=>a.player===0&&a.column===2&&pass(a));assert(targetNegated(t,chixiao));
  assert.equal(lock(t).length,1);assert.equal(lock(t)[0].column,2);
  const choices=E.enumerate(t.state).filter(a=>a.type==='CHIXIAO_NEGATE'&&a.player===1&&a.sourceUid===chixiao&&a.targetUid===wolf&&a.costUid===moye);
  assert(choices.some(pass),'Negated effects do not forbid activating Chixiao or paying its cost');
  assert(!choices.some(a=>a.response?.type==='IMPERM'),'Impermanence may not target an already-negated monster');
  const legal=choices.find(pass),before=JSON.stringify(t.state);
  const forged={...legal,response:{type:'IMPERM',uid:secondTrap,targetUid:chixiao,player:0,from:'spelltrap',column:1}};
  assert.equal(E.execute(t.state,forged).pass,false);assert.equal(JSON.stringify(t.state),before);
  const r=step(t,'CHIXIAO_NEGATE',a=>pass(a)&&a.player===1&&a.sourceUid===chixiao&&a.targetUid===wolf&&a.costUid===moye);
  assert.equal(r.action.proof.activationNegated,false);assert.equal(r.action.proof.effectNegated,true);
  assert(r.action.paid.some(p=>p.kind==='BANISH'&&p.uid===moye&&p.player===1&&p.from==='hand'));
  assert.equal(locate(t,moye).zone,'banished');assert.equal(t.state.used['CHIXIAO_EFFECT:1'],true);
  assert.equal(targetNegated(t,wolf),false);assert.equal(locate(t,secondTrap).zone,'spelltrap');
  assert.equal(locate(t,secondTrap).item.faceUp,false);assert.equal(locate(t,secondTrap).item.setTurn,1);
  assert.equal(lock(t).length,1);assert.equal(lock(t)[0].column,2);
  assert(!r.action.events.some(e=>e.type==='IMPERM_TRAP_ACTIVATION'&&e.uid===secondTrap));replay(t);
 });
 for(const [column,blocked] of [[3,true],[2,false]])await test('The existing Set Impermanence response respects the actual root column: '+(blocked?'mirrored same column':'different column'),()=>{
  const t=make({column:1,responseTypes:['IMPERM'],hands:[[I.ALEISTER],[]],cards:[[I.INVOCATION],[]],placements:[set(1,I.IMPERM,column)]});
  const respondingTrap=uid(t,1,'spelltrap',I.IMPERM),initialSource=uid(t,0,'spelltrap',I.IMPERM);
  step(t,TYPE,pass);assert.equal(lock(t).length,1);assert.equal(lock(t)[0].column,1);
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.ALEISTER));
  const aleister=uid(t,0,'monster',I.ALEISTER),r=step(t,'ALEISTER_SEARCH',a=>a.response?.type==='IMPERM'&&a.response.uid===respondingTrap);
  assert.equal(r.action.response.from,'spelltrap');assert.equal(r.action.response.column,column);
  assert.equal(locate(t,respondingTrap).zone,'gy');assert.equal(locate(t,initialSource).zone,'gy');
  assert.equal(r.action.proof.effectNegated,!blocked);assert.equal(targetNegated(t,aleister),!blocked);
  assert.equal(cards(t,0,'hand',I.INVOCATION).length,blocked?1:0);assert.equal(lock(t).length,blocked?1:2);
  assert.equal(r.action.events.some(e=>e.type==='IMPERM_EFFECT_NEGATED_BY_COLUMN'&&e.uid===respondingTrap),blocked);
  assert.equal(r.action.paid.length,0);replay(t);
 });
 function handResponseAfterRoot(){
  const t=make({column:4,responseTypes:['IMPERM'],hands:[[I.ALEISTER],[I.IMPERM]],cards:[[I.INVOCATION],[]],
   extra:[[],[I.AZURE]],targetProperties:{declaredSummonType:'SYNCHRO',properlySummoned:true}});
  const spirit=uid(t,1,'monster',I.SPIRIT);step(t,TYPE,pass);assert(targetNegated(t,spirit));
  // The negated Spirit still pays its registered tribute cost. Its effect
  // summons nothing, leaving a genuinely empty opposing controlled field.
  const tribute=step(t,'SPIRIT_DRAGON_TRIBUTE_SYNCHRO',a=>a.player===1&&id(locate(t,a.summonUid).item)===I.AZURE&&pass(a));
  assert.equal(tribute.action.proof.effectNegated,true);assert.equal(locate(t,spirit).zone,'gy');
  assert.equal(t.state.zones[1].monster.length,0);assert.equal(t.state.zones[1].spelltrap.length,0);
  assert.equal(lock(t).length,1);assert.equal(lock(t)[0].column,4);return t;
 }
 await test('The existing hand Impermanence response chooses the first unlocked mirrored column after actual field departure',()=>{
  const t=handResponseAfterRoot(),respondingTrap=uid(t,1,'hand',I.IMPERM);
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.ALEISTER));
  const a=E.enumerate(t.state).find(a=>a.type==='ALEISTER_SEARCH'&&a.response?.type==='IMPERM');assert(a);
  assert.equal(a.response.from,'hand');assert.equal(a.response.column,1,'Player one column zero maps to blocked canonical column four');
  const before=JSON.stringify(t.state);assert.equal(E.execute(t.state,{...a,response:{...a.response,column:0}}).pass,false);
  assert.equal(JSON.stringify(t.state),before);const r=step(t,'ALEISTER_SEARCH',a=>a.response?.uid===respondingTrap);
  assert.equal(r.action.proof.effectNegated,true);assert(targetNegated(t,uid(t,0,'monster',I.ALEISTER)));
  assert.equal(cards(t,0,'hand',I.INVOCATION).length,0);assert.equal(locate(t,respondingTrap).zone,'gy');
  assert.equal(lock(t).length,1,'A hand response adds no column effect');replay(t);
 });
 await test('QA-only all-five column locks consume the hand response without negating the actual search or adding another lock',()=>{
  const t=handResponseAfterRoot(),respondingTrap=uid(t,1,'hand',I.IMPERM),physicalBefore=H.inventory(t.state);
  // Explicit aggregate lock fixture: this is not a five-copy deck or a claim
  // that these additional four locks arose through certified game actions.
  for(const column of [0,1,2,3])t.state.locks.push({kind:'IMPERM_COLUMN_NEGATED',wholeTurn:true,untilTurn:2,column,
   appliesToPlayers:[0,1],qaOnly:true,description:'QA-only aggregate column blocker; not a certified five-copy route.'});
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.ALEISTER));
  const aleister=uid(t,0,'monster',I.ALEISTER),r=step(t,'ALEISTER_SEARCH',a=>a.response?.uid===respondingTrap);
  assert.equal(r.action.response.from,'hand');assert.equal(r.action.response.column,0);
  assert.equal(r.action.proof.effectNegated,false);assert.equal(targetNegated(t,aleister),false);
  assert.equal(cards(t,0,'hand',I.INVOCATION).length,1);assert.equal(locate(t,respondingTrap).zone,'gy');
  assert.equal(lock(t).length,5);assert.equal(H.inventory(t.state),physicalBefore);
  assert(r.action.events.some(e=>e.type==='IMPERM_EFFECT_NEGATED_BY_COLUMN'&&e.uid===respondingTrap&&e.canonicalColumn===4));
  assert.equal(r.action.paid.length,0);
 });
 for(const from of ['hand','spelltrap'])await test('Two real '+from+' copies can activate in the same turn without an invented Impermanence OPT',()=>{
  const t=make({from,copies:2,placements:[monster(1,I.SAGE,0,'deck')]});
  step(t,TYPE,a=>pass(a)&&a.targetUid===uid(t,1,'monster',I.SPIRIT));
  step(t,TYPE,a=>pass(a)&&a.targetUid===uid(t,1,'monster',I.SAGE));
  assert.equal(cards(t,0,'gy',I.IMPERM).length,2);assert.equal(t.actions[0].paid.length,0);assert.equal(t.actions[1].paid.length,0);
  assert(!Object.keys(t.state.used).some(key=>/IMPERM/.test(key)));replay(t);
 });
 await test('Ending the registered turn expires both the target negation and the Set-column lock',()=>{
  const t=make(),target=uid(t,1,'monster',I.SPIRIT);step(t);assert(targetNegated(t,target));assert.equal(lock(t).length,1);
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='END');step(t,'DUEL_NEXT_TURN');
  assert.equal(t.state.turn,3);assert.equal(t.state.phase,'DRAW');assert.equal(targetNegated(t,target),false);assert.equal(lock(t).length,0);replay(t);
 });
 await test('Draw-before-draw, unresolved chains and unmodeled Damage Step do not become open Trap windows',()=>{
  const draw=make({phase:'DRAW'});assert.equal(options(draw).length,0);
  const pending=make();pending.state.chain.push({kind:'QA_UNRESOLVED_CHAIN_GATE'});assert.equal(options(pending).length,0);
  const damage=make();damage.state.phase='DAMAGE STEP';assert.equal(options(damage).length,0);
 });
 await test('Default policy permits own Trap on the rival turn without inventing voluntary rival actions',()=>{
  const own=make({activePlayer:1,context:{manualBothPlayers:false}});assert(options(own).some(a=>a.player===0));
  const rival=make({player:1,context:{manualBothPlayers:false}});assert(!options(rival).some(a=>a.player===1));
  const manual=make({player:1,context:{manualBothPlayers:true}});assert(options(manual).some(a=>a.player===1));
 });
 await test('Corrupted source departure metadata and source identity are excluded by the exact core eligibility gate',()=>{
  const t=make(),source=uid(t,0,'spelltrap',I.IMPERM);assert.equal(H.normalTrapActivationEligible(t.state,source,I.IMPERM,1),true);
  const changed=copy(t.state);H.locate(changed,source).item.leaveFieldRedirect='UNREVIEWED';assert.equal(H.normalTrapActivationEligible(changed,source,I.IMPERM,1),false);
  for(const column of [-1,5,1.2,'1',null])assert.equal(H.normalTrapActivationEligible(t.state,source,I.IMPERM,column),false);
  assert.equal(H.normalTrapActivationEligible(t.state,source,I.ROAR,1),false);
 });
 await test('Forged actor, source, target and column are rejected without modifying the physical state',()=>{
  const t=make({ownRoar:true}),a=root(t);assert(a);const before=JSON.stringify(t.state);
  for(const change of [{player:1},{sourceUid:'invented'},{targetUid:uid(t,0,'monster',I.WOLF)},{targetUid:'invented'},{column:4}])
   assert.equal(E.execute(t.state,{...a,...change}).pass,false,JSON.stringify(change));
  assert.equal(JSON.stringify(t.state),before);
 });
 await test('Forged matching cost type, cost UID and counter provider cannot enter a registered response packet',()=>{
  const t=make({mechaba:true,ownRoar:true}),a=root(t,x=>x.response?.type==='MECHABA'&&!x.counterResponses);assert(a);
  const before=JSON.stringify(t.state),wrong=uid(t,1,'hand',fillers[0]);
  for(const change of [{costUid:'invented'},{costUid:wrong},{matchingCardType:'SPELL'},{activationKind:'MONSTER_EFFECT'},{activationZone:'hand'},{targetUid:'invented'}])
   assert.equal(E.execute(t.state,{...a,response:{...a.response,...change}}).pass,false,JSON.stringify(change));
  assert.equal(E.execute(t.state,{...a,counterResponses:[{type:'MECHABA',uid:a.response.uid,player:0,targetUid:a.response.uid}]}).pass,false);
  assert.equal(JSON.stringify(t.state),before);
 });
 await test('Fresh replay rejects altered Trap origin, Set status, column, target and recorded cleanup evidence',()=>{
  const t=make();step(t);const line=replay(t);
  for(const change of [{originZone:'hand'},{fromSet:false},{column:4},{targetUid:'invented'},{spellSpeed:3}]){
   const forged=copy(line);Object.assign(forged.actions[0].proof.normalTrapActivation,change);assert.equal(E.replay(forged,{deck:t.deck}).pass,false);
  }
  const forged=copy(line);forged.actions[0].events=forged.actions[0].events.filter(e=>e.type!=='NORMAL_TRAP_RESOLUTION_CLEANUP');
  assert.equal(E.replay(forged,{deck:t.deck}).pass,false);
 });
 await test('Restoring a recorded before-state restores the same physical Set source and target without retaining later locks',()=>{
  const t=make();const r=step(t),line=replay(t),restored=copy(r.action.before);
  assert.equal(H.locate(restored,r.action.sourceUid).zone,'spelltrap');assert.equal(H.locate(restored,r.action.sourceUid).item.faceUp,false);
  assert.equal(restored.locks.filter(x=>x.kind==='IMPERM_COLUMN_NEGATED').length,0);
  const again=E.execute(restored,{type:r.action.type,player:r.action.player,sourceUid:r.action.sourceUid,targetUid:r.action.targetUid,column:r.action.column});
  assert.equal(again.pass,true);assert.deepEqual(copy(again.after),copy(line.after));
 });
 await test('Bounded search finds the actual registered Trap transition and every resulting line replays freshly',async()=>{
  const t=make(),target=uid(t,1,'monster',I.SPIRIT),before=JSON.stringify(t.initial);
  const result=await E.search(t.initial,{checkCurrentDeck:false,maxDepth:1,maxStates:250,maxMs:4000,maxTurns:1,
   goal:st=>H.locate(st,target)?.item.effectsNegated===true&&st.locks.some(x=>x.kind==='IMPERM_COLUMN_NEGATED')});
  assert.equal(result.pass,true);assert(result.lines.length>0);assert(result.lines.every(line=>line.actions.length>0&&line.actions.some(a=>a.type===TYPE)&&E.replay(line,{deck:t.deck}).pass));
  assert.equal(JSON.stringify(t.initial),before);assert.equal(result.certified,false);assert.equal(result.globalOptimalityProven,false);
 });
 for(const blocked of [true,false])await test('A '+(blocked?'mirrored blocked':'different-column')+' first Roar response preserves activation use and obeys the real prior Impermanence lock',()=>{
  const t=make({column:1,placements:[monster(1,I.WOLF,5),set(1,I.ROAR,blocked?3:2)],
   hands:{0:[I.ALEISTER]},cards:{0:[I.INVOCATION]},responseTypes:['ROAR']});
  const roar=uid(t,1,'spelltrap',I.ROAR);step(t);assert.equal(lock(t)[0].column,1);
  step(t,'NORMAL_SUMMON',a=>pass(a)&&a.sourceUid===uid(t,0,'hand',I.ALEISTER));
  const aleister=uid(t,0,'monster',I.ALEISTER),r=step(t,'ALEISTER_SEARCH',a=>a.response?.type==='ROAR'&&!a.counterResponses);
  assert.equal(locate(t,roar).zone,'gy');assert.equal(t.state.used['SALAMANGREAT_ROAR:1'],true);
  assert.equal(r.action.proof.activationNegated,!blocked);assert.equal(r.action.proof.effectNegated,!blocked);
  assert.equal(locate(t,aleister).zone,blocked?'monster':'gy');assert.equal(cards(t,0,'hand',I.INVOCATION).length,blocked?1:0);
  const suppressed=r.action.events.filter(e=>e.type==='ROAR_EFFECT_NEGATED_BY_COLUMN');assert.equal(suppressed.length,blocked?1:0);
  if(blocked){assert.equal(suppressed[0].column,3);assert.equal(suppressed[0].canonicalColumn,1);assert(!r.action.events.some(e=>e.type==='ROAR_ACTIVATION_NEGATED'||e.type==='DESTROYED_BY_EFFECT'&&e.uid===aleister));}
  assert.equal(lock(t).length,1);replay(t);
 });
 for(const blocked of [true,false])await test('A '+(blocked?'blocked':'unblocked')+' Roar counter to Mechaba retains the real Monster cost and correct root resolution',()=>{
  const t=make({player:1,column:blocked?2:0,targetId:I.WOLF,
   placements:[monster(1,I.MECHABA,0),set(0,I.ROAR,2)],hands:{0:[I.ALEISTER],1:[I.MOYE]},
   cards:{0:[I.INVOCATION]},responseTypes:['MECHABA','ROAR']});
  const roar=uid(t,0,'spelltrap',I.ROAR),mechabaUid=uid(t,1,'monster',I.MECHABA),cost=uid(t,1,'hand',I.MOYE);
  step(t,TYPE,a=>a.player===1&&pass(a));assert.equal(lock(t)[0].column,blocked?2:4);
  step(t,'NORMAL_SUMMON',a=>pass(a)&&a.sourceUid===uid(t,0,'hand',I.ALEISTER));
  const aleister=uid(t,0,'monster',I.ALEISTER),r=step(t,'ALEISTER_SEARCH',a=>a.response?.type==='MECHABA'&&a.response.costUid===cost&&a.counterResponses?.length===1&&a.counterResponses[0].uid===roar);
  assert.equal(locate(t,roar).zone,'gy');assert.equal(t.state.used.SALAMANGREAT_ROAR,true);assert.equal(locate(t,cost).zone,'gy');
  assert(r.action.paid.some(p=>p.kind==='SEND_GY'&&p.uid===cost&&p.player===1));
  assert.equal(r.action.proof.registeredResponseChain.firstResponseNegated,!blocked);assert.equal(r.action.proof.activationNegated,blocked);
  assert.equal(locate(t,mechabaUid).zone,blocked?'monster':'gy');assert.equal(locate(t,aleister).zone,blocked?'banished':'monster');
  assert.equal(cards(t,0,'hand',I.INVOCATION).length,blocked?0:1);
  const link=r.action.proof.registeredResponseChain.resolutions.find(e=>e.type==='REGISTERED_CHAIN_LINK_RESOLVED'&&e.chainLink===3);
  assert.equal(link.activationNegated,false);assert.equal(link.negatesChainLink,blocked?null:2);
  assert.equal(r.action.events.some(e=>e.type==='ROAR_EFFECT_NEGATED_BY_COLUMN'&&e.uid===roar),blocked);replay(t);
 });
 await test('A higher unblocked Roar can negate the activation of a column-blocked Roar without refunding either shared use',()=>{
  const t=make({player:1,column:2,targetId:I.WOLF,placements:[monster(1,I.MECHABA,0),set(0,I.ROAR,2),monster(1,I.WOLF,5),set(1,I.ROAR,0)],
   hands:{0:[I.ALEISTER],1:[I.MOYE]},cards:{0:[I.INVOCATION]},responseTypes:['MECHABA','ROAR']});
  const ownRoar=uid(t,0,'spelltrap',I.ROAR),rivalRoar=uid(t,1,'spelltrap',I.ROAR),mechabaUid=uid(t,1,'monster',I.MECHABA),cost=uid(t,1,'hand',I.MOYE);
  step(t,TYPE,a=>a.player===1&&pass(a));step(t,'NORMAL_SUMMON',a=>pass(a)&&a.sourceUid===uid(t,0,'hand',I.ALEISTER));
  const aleister=uid(t,0,'monster',I.ALEISTER),r=step(t,'ALEISTER_SEARCH',a=>a.response?.type==='MECHABA'&&a.response.costUid===cost&&a.counterResponses?.length===2&&a.counterResponses[0].uid===ownRoar&&a.counterResponses[1].uid===rivalRoar);
  const chain=r.action.proof.registeredResponseChain;
  assert.equal(chain.firstResponseNegated,false);assert.equal(r.action.proof.activationNegated,true);
  assert.equal(locate(t,mechabaUid).zone,'monster');assert.equal(locate(t,aleister).zone,'banished');assert.equal(locate(t,cost).zone,'gy');
  for(const roar of [ownRoar,rivalRoar])assert.equal(locate(t,roar).zone,'gy');
  assert.equal(t.state.used.SALAMANGREAT_ROAR,true);assert.equal(t.state.used['SALAMANGREAT_ROAR:1'],true);
  assert(chain.resolutions.some(e=>e.type==='REGISTERED_CHAIN_LINK_RESOLVED'&&e.chainLink===4&&e.negatesChainLink===3));
  assert(chain.resolutions.some(e=>e.type==='REGISTERED_CHAIN_LINK_RESOLVED'&&e.chainLink===3&&e.activationNegated===true));
  assert(!r.action.events.some(e=>e.type==='ROAR_EFFECT_NEGATED_BY_COLUMN'&&e.uid===ownRoar));replay(t);
 });
 await test('A higher column-blocked Roar fails to negate a lower unblocked Roar while both cards and uses are consumed',()=>{
  const t=make({column:1,mechaba:true,cost:I.MOYE,
   placements:[monster(0,I.WOLF,5),set(0,I.ROAR,2),monster(1,I.WOLF,5),set(1,I.ROAR,3)],
   hands:{0:[I.ALEISTER]},cards:{0:[I.INVOCATION]},responseTypes:['MECHABA','ROAR']});
  const ownRoar=uid(t,0,'spelltrap',I.ROAR),rivalRoar=uid(t,1,'spelltrap',I.ROAR),mechabaUid=uid(t,1,'monster',I.MECHABA),cost=uid(t,1,'hand',I.MOYE);
  step(t);assert.equal(lock(t)[0].column,1);step(t,'NORMAL_SUMMON',a=>pass(a)&&a.sourceUid===uid(t,0,'hand',I.ALEISTER));
  const aleister=uid(t,0,'monster',I.ALEISTER),r=step(t,'ALEISTER_SEARCH',a=>a.response?.type==='MECHABA'&&a.response.costUid===cost&&a.counterResponses?.length===2&&a.counterResponses[0].uid===ownRoar&&a.counterResponses[1].uid===rivalRoar);
  const chain=r.action.proof.registeredResponseChain;
  assert.equal(chain.firstResponseNegated,true);assert.equal(r.action.proof.activationNegated,false);
  assert.equal(locate(t,mechabaUid).zone,'gy');assert.equal(locate(t,aleister).zone,'monster');assert.equal(locate(t,cost).zone,'gy');
  assert.equal(cards(t,0,'hand',I.INVOCATION).length,1);for(const roar of [ownRoar,rivalRoar])assert.equal(locate(t,roar).zone,'gy');
  assert.equal(t.state.used.SALAMANGREAT_ROAR,true);assert.equal(t.state.used['SALAMANGREAT_ROAR:1'],true);
  assert(chain.resolutions.some(e=>e.type==='REGISTERED_CHAIN_LINK_RESOLVED'&&e.chainLink===4&&e.negatesChainLink===null&&!e.activationNegated));
  assert(chain.resolutions.some(e=>e.type==='REGISTERED_CHAIN_LINK_RESOLVED'&&e.chainLink===3&&e.negatesChainLink===2));
  assert(r.action.events.some(e=>e.type==='ROAR_EFFECT_NEGATED_BY_COLUMN'&&e.uid===rivalRoar&&e.column===3&&e.canonicalColumn===1));replay(t);
 });
 const report={schema:'ygo-normal-trap-activation-tests/v1',pass:tests.every(x=>x.pass),total:tests.length,tests,
  limitations:['The registered Normal Trap roots are Impermanence and Compulsory Evacuation Device; this suite preserves Impermanence and the separate CED suite checks its return rules.','The catalogue and fixture fields are technical data, not full TCG ruling or prior-history certification.','Target-immunity, malformed-source, phase and pending-chain gate probes are explicitly un-replayed state probes. The all-five blocked-column case uses an explicitly marked QA-only aggregate lock fixture, not a physically certified five-copy route; other positive scenarios use actual physical cards and registered transitions.','General priority, arbitrary chains and Damage Step remain outside scope.']};
 fs.writeFileSync(path.join(ROOT,'tests/normal-trap-activations-results.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));if(!report.pass)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});

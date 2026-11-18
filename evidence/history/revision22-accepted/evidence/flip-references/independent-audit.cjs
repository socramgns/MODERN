'use strict';
/* Physical scenarios and fresh replays for the two reviewed second-attack
 * profiles. Declared starting fields do not certify a prior Fusion Summon.
 * Explicit QA-only microstates exercise counter compatibility and movement;
 * those altered microstates are never recorded as witnessed game histories. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const {harness,ROOT}=require('/workspace/MODERN/tests/combo_engine.cjs');
const copy=structuredClone;
const I={HAYABUSA:21015833,TWIN:74157028,BEWD:89631139,DM:46986414,IDOL:27125110,
 SHIELD:32012841,CHIXIAO:69248256,MOYE:20001443,SPARK:83994433,SPINNY:52277807,
 BALELYNX:14812471,MATAZA:22609617,WILDEDGE:10526791,IMPERM:10045474};
const SECOND_ATTACK_TEXT='This card can make a second attack during each Battle Phase.';
(async()=>{
 const {W,E,fixture}=await harness(true),H=E.helpers,tests=[],witnesses=[];
 for(const name of ['duel-phases','flip-effects','responses','archetypes-expanded','blue-eyes-duel'])
  vm.runInNewContext(fs.readFileSync(path.join(ROOT,'src/app/'+name+'.js'),'utf8'),
   {window:W,structuredClone,console,Date,Promise,setTimeout,clearTimeout,performance});
 await Promise.resolve();
 const D=W.YGODuelPhases,id=x=>H.baseId(x);
 const fillers=[...new Set(fixture('Invoked').deck.main.filter(x=>![86120751,74063034].includes(Number(x.id))).map(x=>Number(x.id)).concat([23771716,48305365,32452818,I.DM,I.IDOL,I.SHIELD]))];
 const isExtra=n=>!!(Number(W.YGODataCatalog.rulesCard(n).typeBits)&(0x40|0x2000|0x800000|0x4000000));
 const monster=(player,cardId,zoneIndex=0,extra={})=>({player,cardId,from:isExtra(cardId)?'extra':'deck',zone:'monster',zoneIndex,faceUp:true,position:'ATTACK',summonTurn:1,...extra});
 const gy=(player,cardId)=>({player,cardId,from:isExtra(cardId)?'extra':'deck',zone:'gy'});
 const set=(player,cardId,zoneIndex=0)=>({player,cardId,from:'deck',zone:'spelltrap',zoneIndex,faceUp:false,setTurn:1});
 function deck(main=[],extra=[]){const counts=new Map(),extras=new Map();for(const n of main)counts.set(n,(counts.get(n)||0)+1);let size=main.length;
  for(const n of fillers){if(size>=40)break;if(counts.has(n))continue;const qty=Math.min(3,40-size);counts.set(n,qty);size+=qty;}
  assert.equal(size,40);for(const n of extra)extras.set(n,(extras.get(n)||0)+1);
  const result={main:[...counts].map(([id,qty])=>({id,qty})),extra:[...extras].map(([id,qty])=>({id,qty})),side:[]};
  const audit=W.YGODataCatalog.auditDeck(result,{format:'tcg',banlist:W.BANLIST_PROFILES.tcg.data});assert.equal(audit.pass,true,JSON.stringify(audit));return result;}
 function opening(d,wanted,reserved){const avail=new Map(d.main.map(x=>[x.id,x.qty])),out=wanted.slice();
  for(const n of [...wanted,...reserved]){assert((avail.get(n)||0)>0,'Missing physical '+n);avail.set(n,avail.get(n)-1);}
  for(const n of fillers)while(out.length<5&&(avail.get(n)||0)>0){out.push(n);avail.set(n,avail.get(n)-1);}assert.equal(out.length,5);return out;}
 function remaining(d,hand){const result=d.main.flatMap(x=>Array(x.qty).fill(x.id));for(const n of hand){const i=result.indexOf(n);assert(i>=0);result.splice(i,1);}return result;}
 function make(o={}){const placements=copy(o.placements||[]),hands=o.hands||[[],[]];
  const decks=[0,1].map(p=>deck([...placements.filter(x=>x.player===p&&x.from==='deck').map(x=>x.cardId),...hands[p],...(o.cards?.[p]||[])],[...placements.filter(x=>x.player===p&&x.from==='extra').map(x=>x.cardId),...(o.extra?.[p]||[])]));
  const opened=decks.map((d,p)=>opening(d,hands[p],placements.filter(x=>x.player===p&&x.from==='deck').map(x=>x.cardId)));
  const spec={deck:decks[0],openingIds:opened[0],remainingDeckIds:remaining(decks[0],opened[0]),opponentDeck:decks[1],opponentOpeningIds:opened[1],opponentRemainingDeckIds:remaining(decks[1],opened[1]),
   setup:{turn:o.turn??2,activePlayer:o.activePlayer??0,phase:o.phase||'BATTLE',placements,...(o.lp?{lp:o.lp}:{})},
   context:{format:'tcg',duelMode:true,manualBothPlayers:true,opponentPolicy:'PASS',...(o.context||{})}};
  const initial=E.createState(spec);return{spec,deck:decks[0],initial:copy(initial),state:initial,actions:[]};}
 const uid=(t,p,z,n)=>t.state.zones[p][z].find(x=>id(x)===n)?.uid,locate=(t,u)=>H.locate(t.state,u);
 const pass=a=>!a.response&&!a.responseUid;
 function step(t,type,pred=pass){const action=E.enumerate(t.state).find(a=>a.type===type&&pred(a));assert(action,'Missing '+type+': '+JSON.stringify(E.enumerate(t.state).map(x=>({type:x.type,attackerUid:x.attackerUid,targetUid:x.targetUid,toPhase:x.toPhase}))));
  const before=JSON.stringify(t.state),inventory=H.inventory(t.state),r=E.execute(t.state,action);assert.equal(r.pass,true,JSON.stringify(r));assert.equal(JSON.stringify(t.state),before,'Input state mutated');assert.equal(H.inventory(r.after),inventory);t.state=r.after;t.actions.push(r.action);return r;}
 function attack(t,attacker,target,pred=pass){return step(t,'DUEL_ATTACK',a=>a.attackerUid===attacker&&(target===undefined||a.targetUid===target)&&pred(a));}
 const attacks=(t,attacker)=>E.enumerate(t.state).filter(a=>a.type==='DUEL_ATTACK'&&(!attacker||a.attackerUid===attacker));
 function reject(t,request){const before=JSON.stringify(t.state),r=E.execute(t.state,request);assert.equal(r.pass,false,JSON.stringify(r));assert.equal(JSON.stringify(t.state),before);return r;}
 function replay(t,keep=false){const line={scope:E.version,before:copy(t.initial),after:copy(t.state),state:copy(t.state),actions:copy(t.actions),context:copy(t.initial.context),deckFingerprint:E.deckFingerprint(t.deck),certified:false,globalOptimalityProven:false};
  const result=E.replay(line,{deck:t.deck});assert.equal(result.pass,true,JSON.stringify(result));assert.equal(result.steps,t.actions.length);assert.equal(H.inventory(t.initial),H.inventory(t.state));
  if(keep)witnesses.push({actions:t.actions.map(a=>({type:a.type,player:a.player,attackerUid:a.attackerUid,targetUid:a.targetUid,events:a.events.filter(e=>['ATTACK_DECLARED','ADDITIONAL_ATTACK_CONSUMED','CHIXIAO_NEGATE_EFFECT','SPARK_DESTRUCTION_PREVENTED','BALELYNX_DESTRUCTION_REPLACED'].includes(e.type))})),finalLP:copy(t.state.lp),replayPass:true});return line;}
 function phase(t,toPhase){return step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase===toPhase);}
 function next(t){phase(t,'END');step(t,'DUEL_NEXT_TURN');step(t,'DUEL_DRAW_FOR_TURN');phase(t,'STANDBY');phase(t,'MAIN 1');}
 function ready(n,p=0,other=[]){return make({activePlayer:p,placements:[monster(p,n),...other]});}
 function negate(t,attacker){return step(t,'CHIXIAO_NEGATE',a=>a.targetUid===attacker&&pass(a));}
 function negatable(n,p=0){return ready(n,p,[monster(p,I.CHIXIAO,1),gy(p,I.MOYE)]);}
 async function test(name,fn){try{await fn();tests.push({name,pass:true});}catch(error){tests.push({name,pass:false,error:error.stack});}}


 I.FAITH=31560081;I.INVOCATION=74063034;I.REBORN=83764718;I.MECHABA=75286621;I.ALEISTER=86120751;
 const faith=(p=0,o={})=>monster(p,I.FAITH,0,{faceUp:false,position:'SET',...o});
 const flips=t=>E.enumerate(t.state).filter(a=>a.type==='DUEL_FLIP_SUMMON');
 const recoveries=t=>E.enumerate(t.state).filter(a=>a.type==='DUEL_FLIP_FAITH_RECOVER');
 const flip=t=>step(t,'DUEL_FLIP_SUMMON');
 await test('Own controller GY is selected after control changes, not Faith owner GY (QA microstate)',()=>{const t=make({activePlayer:1,phase:'MAIN 1',placements:[faith(0),gy(0,I.INVOCATION),gy(1,I.REBORN)]}),f=uid(t,0,'monster',I.FAITH),ownTarget=uid(t,1,'gy',I.REBORN),wrong=uid(t,0,'gy',I.INVOCATION);H.move(t.state,f,'monster',{player:1,zoneIndex:0,faceUp:false,position:'SET'});assert.equal(locate(t,f).item.ownerPlayer,0);flip(t);const actions=recoveries(t);assert(actions.some(a=>a.player===1&&a.targetUid===ownTarget));assert(!actions.some(a=>a.targetUid===wrong));step(t,'DUEL_FLIP_FAITH_RECOVER');assert.equal(locate(t,ownTarget).player,1);assert.equal(locate(t,ownTarget).zone,'hand');assert.equal(locate(t,wrong).zone,'gy');});
 await test('No ownGYSpell keeps mandatory null activation with opponentGYSpell present',()=>{const t=make({phase:'MAIN 1',placements:[faith(),gy(1,I.INVOCATION)]});flip(t);assert.equal(t.state.pendingTriggers[0].mandatory,true);assert.equal(recoveries(t).length,1);assert.equal(recoveries(t)[0].targetUid,null);step(t,'DUEL_FLIP_FAITH_RECOVER');assert(t.actions.at(-1).events.some(e=>e.type==='FAITH_RECOVERY_NO_TARGET'));replay(t);});
 await test('Unknown reviewed movement does not create false null Spell branch',()=>{const t=make({phase:'MAIN 1',placements:[faith(),gy(0,14087893)]});assert.equal(W.YGODataCatalog.rulesCard(14087893).name,'Book of Moon');assert.equal(flips(t).length,0);reject(t,{type:'DUEL_FLIP_SUMMON',sourceUid:uid(t,0,'monster',I.FAITH),player:0});});
 await test('Mandatory activation persists but resolves negated with inherent true flag (QA microstate)',()=>{const t=make({phase:'MAIN 1',placements:[faith(),gy(0,I.INVOCATION)]}),spell=uid(t,0,'gy',I.INVOCATION);flip(t);locate(t,uid(t,0,'monster',I.FAITH)).item.effectsNegated=true;assert(recoveries(t).length>0);step(t,'DUEL_FLIP_FAITH_RECOVER');assert.equal(locate(t,spell).zone,'gy');assert(t.actions.at(-1).events.some(e=>e.type==='FAITH_EFFECT_NEGATED'));});
 await test('Battle pending retains source field, prevents other actions, rejects omitted victim, then finishesGY',()=>{const t=make({placements:[monster(0,I.BEWD),faith(1),gy(1,I.INVOCATION)]}),f=uid(t,1,'monster',I.FAITH);attack(t,uid(t,0,'monster',I.BEWD),f);assert.equal(locate(t,f).zone,'monster');assert.equal(t.state.duel.battlePacket.destroyVictims.length,1);assert(E.enumerate(t.state).every(a=>a.type==='DUEL_FLIP_FAITH_RECOVER'));const forged=copy(t.state);forged.duel.battlePacket.destroyVictims=[];assert.equal(E.enumerate(forged).length,0);const r=E.execute(forged,recoveries(t)[0]);assert.equal(r.pass,false);step(t,'DUEL_FLIP_FAITH_RECOVER');assert.equal(locate(t,f).zone,'gy');assert.equal(t.state.duel.battlePacket,undefined);replay(t);});
 await test('Battle Mechaba banishes field Faith before cleanup and never sends itGY afterward',()=>{const t=make({placements:[monster(0,I.MECHABA,5),faith(1),gy(1,I.INVOCATION)],hands:[[I.ALEISTER],[]],context:{opponentPolicy:'RESPONSES_EXPLICIT',responseTypes:['MECHABA','ROAR','IMPERM','DD_CROW','CHIXIAO','VEILER']}}),f=uid(t,1,'monster',I.FAITH);attack(t,uid(t,0,'monster',I.MECHABA),f);assert(recoveries(t).some(a=>a.response?.type==='MECHABA'));assert(!recoveries(t).some(a=>a.response&&['IMPERM','DD_CROW','CHIXIAO','VEILER'].includes(a.response.type)));step(t,'DUEL_FLIP_FAITH_RECOVER',a=>a.response?.type==='MECHABA'&&!a.counterResponses);assert.equal(locate(t,f).zone,'banished');const ev=t.actions.at(-1).events;assert(ev.findIndex(e=>e.type==='MECHABA_BANISH_ACTIVATED_CARD')<ev.findIndex(e=>e.type==='BATTLE_VICTIM_ALREADY_LEFT'));assert(!ev.some(e=>e.type==='DESTROYED_BY_BATTLE'&&e.uid===f));replay(t);});

 await test('Roar non-target destroys battle-marked Faith before final battleGY, without duplicate departure',()=>{const t=make({placements:[monster(0,I.BEWD),monster(0,I.BALELYNX,5),set(0,51339637),faith(1),gy(1,I.INVOCATION)],context:{opponentPolicy:'RESPONSES_EXPLICIT',responseTypes:['ROAR']}}),f=uid(t,1,'monster',I.FAITH);attack(t,uid(t,0,'monster',I.BEWD),f);assert.equal(t.state.duel.battlePacket.destroyVictims.length,1);step(t,'DUEL_FLIP_FAITH_RECOVER',a=>a.response?.type==='ROAR');assert.equal(locate(t,f).zone,'gy');const ev=t.actions.at(-1).events;assert(ev.some(e=>e.type==='DESTROYED_BY_EFFECT'&&e.uid===f));assert(!ev.some(e=>e.type==='DESTROYED_BY_BATTLE'&&e.uid===f));assert(ev.findIndex(e=>e.type==='DESTROYED_BY_EFFECT'&&e.uid===f)<ev.findIndex(e=>e.type==='BATTLE_VICTIM_ALREADY_LEFT'));assert(ev.findIndex(e=>e.type==='ROAR_RESOLUTION_CLEANUP')<ev.findIndex(e=>e.type==='BATTLE_PACKET_COMPLETED'));replay(t);});
 await test('Legal faceup Faith accepts Spark, consumes shield against battle and does not invent FLIP',()=>{const t=make({placements:[monster(0,I.TWIN,5),faith(1,{faceUp:true,position:'DEFENSE'}),monster(1,I.SPARK,5)]}),f=uid(t,1,'monster',I.FAITH),twin=uid(t,0,'monster',I.TWIN);step(t,'STARDUST_SPARK_PROTECTION',a=>a.player===1&&a.targetUid===f&&pass(a));attack(t,twin,f);assert.equal(locate(t,f).zone,'monster');assert(t.actions.at(-1).events.some(e=>e.type==='SPARK_DESTRUCTION_PREVENTED'));assert.equal(t.state.pendingTriggers.length,0);assert.equal(t.state.duel.battlePacket,undefined);attack(t,twin,f);assert.equal(locate(t,f).zone,'gy');assert.equal(t.state.pendingTriggers.length,0);replay(t);});
 await test('Mutated mandatory pending actor, zone, origin, turn, id and source stay are rejected',()=>{const t=make({phase:'MAIN 1',placements:[faith(),gy(0,I.INVOCATION)]});flip(t);const action=recoveries(t)[0];for(const change of [x=>x.mandatory=false,x=>x.player=1,x=>x.activationZone='gy',x=>x.origin='DECLARED_SETUP',x=>x.turn--,x=>x.triggerId+='forged',x=>x.fieldStay.monsterStay++]){const forged=copy(t.state);change(forged.pendingTriggers[0]);assert.equal(E.enumerate(forged).length,0);assert.equal(E.execute(forged,action).pass,false);}});
 const report={schema:'ygo-r22-independent-reference-audit/v1',pass:tests.every(t=>t.pass),total:tests.length,tests,scope:'FOCUSED_INDEPENDENT_AUDIT_NOT_FULL_SUITE',qaMicrostatesNotWitnessedHistory:true};fs.writeFileSync('/workspace/r22-reference-evidence/independent-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.pass)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});

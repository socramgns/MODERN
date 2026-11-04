'use strict';
/* Physical, pinned-catalogue regressions for the registered Spark procedure.
 * Starting Main Deck fields are explicit assumptions. Every accepted Spark
 * history below is created by execute and reconstructed from the initial spec.
 * Deliberately altered QA states are never presented as witnessed game lines. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const {harness,ROOT}=require('./combo_engine.cjs');
const copy=structuredClone,TYPE='SYNCHRO_STARDUST_SPARK_DRAGON',REBORN='ACTIVATE_MONSTER_REBORN';
const I={SPARK:83994433,GUARD:21615956,SERPENT:11066358,ANGEL:87979586,SKULL:32274490,
 DARK:46986414,FISH:23771716,BEWD:89631139,SAGE:8240199,ANCIENTS:71039903,
 REBORN:83764718,CED:94192409,IMPERM:10045474,ROAR:51339637,MECHABA:75286621,
 INVOCATION:74063034,ALEISTER:86120751,ASH:14558127,VEILER:97268402,SPIRIT:59822133,
 SPIRIT_LINK:42097666,WOLF:87871125,MONK:32519092,SHAMAN:78917791,ASHUNA:87052196,
 ADHARA:98159737,SHTHANA:24557335,MOYE:20001443,TOKEN:20001444,LONGYUAN:93490856,
 GAZELLE:26889158,SPINNY:52277807,BALELYNX:14812471,BF:44362883,ALBAZ:68468459,
 LUBELLION:70534340,UNKNOWN:38033121,XYZ:16195942,PENDULUM:70026064};
(async()=>{
 const {W,E,fixture}=await harness(true),H=E.helpers,tests=[];
 for(const module of ['duel-phases','responses','archetypes-expanded','blue-eyes-duel','monster-reborn','stardust-synchro'])
  vm.runInNewContext(fs.readFileSync(path.join(ROOT,'src/app/'+module+'.js'),'utf8'),
   {window:W,structuredClone,console,Date,Promise,setTimeout,clearTimeout,performance});
 await Promise.resolve();
 const id=x=>H.baseId(x),fillers=[...new Set(fixture('Invoked').deck.main
  .filter(row=>![I.ALEISTER,I.INVOCATION,I.REBORN].includes(row.id)).map(row=>row.id)
  .concat([63749102,74367458,48305365,32452818,I.FISH]))];
 const isExtra=n=>!!(Number(W.YGODataCatalog.rulesCard(n).typeBits)&(0x40|0x2000|0x800000|0x4000000));
 const monster=(player,cardId,zoneIndex=0,extra={})=>({player,cardId,from:isExtra(cardId)?'extra':'deck',zone:'monster',zoneIndex,faceUp:true,position:'ATTACK',summonTurn:1,...extra});
 const gy=(player,cardId,extra={})=>({player,cardId,from:isExtra(cardId)?'extra':'deck',zone:'gy',...extra});
 const set=(player,cardId,zoneIndex=0)=>({player,cardId,from:'deck',zone:'spelltrap',zoneIndex,faceUp:false,setTurn:1});
 function deck(cards=[],extras=[]){const count=new Map(),ex=new Map();for(const n of cards)count.set(n,(count.get(n)||0)+1);
  let size=cards.length;for(const n of fillers){if(size>=40)break;if(count.has(n))continue;const q=Math.min(3,40-size);count.set(n,q);size+=q;}
  assert.equal(size,40);for(const n of extras)ex.set(n,(ex.get(n)||0)+1);
  const result={main:[...count].map(([id,qty])=>({id,qty})),extra:[...ex].map(([id,qty])=>({id,qty})),side:[]};
  const audit=W.YGODataCatalog.auditDeck(result,{format:'tcg',banlist:W.BANLIST_PROFILES.tcg.data});
  assert.equal(audit.pass,true,JSON.stringify(audit));return result;}
 function opening(d,wanted,reserved){const avail=new Map(d.main.map(r=>[r.id,r.qty])),out=wanted.slice();
  for(const n of [...wanted,...reserved]){assert((avail.get(n)||0)>0,'Missing physical card '+n);avail.set(n,avail.get(n)-1);}
  for(const n of fillers)while(out.length<5&&(avail.get(n)||0)>0){out.push(n);avail.set(n,avail.get(n)-1);}assert.equal(out.length,5);return out;}
 function remaining(d,hand){const result=d.main.flatMap(r=>Array(r.qty).fill(r.id));for(const n of hand){const at=result.indexOf(n);assert(at>=0);result.splice(at,1);}return result;}
 function make(o={}){const placements=copy(o.placements||[]),hands=[[...(o.reborn===false?[]:[I.REBORN]),...(o.hands?.[0]||[])],[...(o.hands?.[1]||[])]];
  const extras=[...(o.extra?.[0]||[]),...placements.filter(r=>r.player===0&&r.from==='extra').map(r=>r.cardId)];
  if(o.spark!==false&&!extras.includes(I.SPARK))extras.push(I.SPARK);
  const decks=[0,1].map(p=>deck([...placements.filter(r=>r.player===p&&r.from==='deck').map(r=>r.cardId),...hands[p],...(o.cards?.[p]||[])],
   p===0?extras:[...(o.extra?.[1]||[]),...placements.filter(r=>r.player===1&&r.from==='extra').map(r=>r.cardId)]));
  const opened=decks.map((d,p)=>opening(d,hands[p],placements.filter(r=>r.player===p&&r.from==='deck').map(r=>r.cardId)));
  const types=o.responseTypes||[],spec={deck:decks[0],openingIds:opened[0],remainingDeckIds:remaining(decks[0],opened[0]),
   opponentDeck:decks[1],opponentOpeningIds:opened[1],opponentRemainingDeckIds:remaining(decks[1],opened[1]),
   context:{format:'tcg',duelMode:true,manualBothPlayers:true,opponentPolicy:types.length?'RESPONSES_EXPLICIT':'PASS',responseTypes:types,responsePolicy:'CHOICE_BRANCHES',...(o.context||{})},
   setup:{turn:o.turn??2,activePlayer:o.activePlayer??0,phase:o.phase||'MAIN 1',placements}};
  const initial=E.createState(spec);return{spec,deck:decks[0],initial,state:copy(initial),actions:[]};}
 const cards=(t,p,z,n)=>t.state.zones[p][z].filter(x=>id(x)===n),uid=(t,p,z,n)=>cards(t,p,z,n)[0]?.uid;
 const locate=(t,u)=>H.locate(t.state,u),pass=a=>!a.response&&!a.responseUid;
 const options=t=>E.enumerate(t.state).filter(a=>a.type===TYPE);
 function step(t,type=TYPE,pred=pass){const action=E.enumerate(t.state).find(a=>a.type===type&&pred(a));
  assert(action,'Missing '+type+': '+JSON.stringify(E.enumerate(t.state).map(a=>({type:a.type,sourceUid:a.sourceUid,targetUid:a.targetUid,materialUids:a.materialUids,destination:a.destination,position:a.position,response:a.response?.type,toPhase:a.toPhase}))));
  const before=JSON.stringify(t.state),inventory=H.inventory(t.state),result=E.execute(t.state,action);
  assert.equal(result.pass,true,JSON.stringify(result));assert.equal(JSON.stringify(t.state),before,'Supplied state mutated');
  assert.equal(H.inventory(result.after),inventory,'Physical inventory changed');t.state=result.after;t.actions.push(result.action);return result;}
 function replay(t){const line={before:copy(t.initial),after:copy(t.state),state:copy(t.state),actions:copy(t.actions),
  context:copy(t.initial.context),deckFingerprint:E.deckFingerprint(t.deck),scope:E.version,certified:false,globalOptimalityProven:false};
  const result=E.replay(line,{deck:t.deck});assert.equal(result.pass,true,JSON.stringify(result));assert.equal(result.steps,t.actions.length);return line;}
 function ready(o={}){return make({...o,placements:o.placements||[monster(0,I.GUARD,0),monster(0,I.DARK,1)]});}
 function synchro(t,destination=0,position='ATTACK'){return step(t,TYPE,a=>a.destination===destination&&a.position===position&&pass(a));}
 function protect(t,target=uid(t,0,'monster',I.SPARK)){return step(t,'STARDUST_SPARK_PROTECTION',a=>a.player===0&&a.targetUid===target&&pass(a));}
 function decline(t){let guard=0;while(t.state.pendingTriggers.length){assert(guard++<10);step(t,'DECLINE_OPTIONAL_TRIGGER',()=>true);}}
 function destroyOwnSpark(t){const spark=uid(t,0,'monster',I.SPARK),rival=uid(t,1,'monster',I.BEWD);assert(spark&&rival);
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='BATTLE');step(t,'DUEL_ATTACK',a=>a.attackerUid===spark&&a.targetUid===rival&&pass(a));
  assert.equal(locate(t,spark).zone,'gy');step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='MAIN 2');return spark;}
 function realRoute(o={}){const t=make({hands:[[I.GUARD],[]],placements:[monster(0,I.DARK,1),monster(1,I.BEWD,0),monster(1,I.BEWD,1)],...o});
  const guard=uid(t,0,'hand',I.GUARD);step(t,'NORMAL_SUMMON',a=>a.sourceUid===guard);const result=synchro(t,2);return{t,guard,spark:result.action.sourceUid,result};}
 function rejected(t,request){const before=JSON.stringify(t.state),r=E.execute(t.state,request);assert.equal(r.pass,false);assert.equal(JSON.stringify(t.state),before);return r;}
 async function test(name,fn){try{await fn();tests.push({name,pass:true});}catch(error){tests.push({name,pass:false,error:error.stack});}}

 await test('Spark exposes a bounded, non-chain Synchro procedure without adding a Spell activation or certification',()=>{
  const cap=W.YGOStardustSynchro.capabilities();assert.equal(cap.action,TYPE);assert.equal(cap.cardId,I.SPARK);assert.equal(cap.startsChain,false);
  assert.equal(cap.oncePerTurn,false);assert.equal(cap.properSummonType,'SYNCHRO');assert.equal(cap.enablesRegisteredMonsterReborn,true);assert.equal(cap.certified,false);
  assert(E.capabilities().handlers.includes(TYPE));assert.equal(E.capabilities().normalSpellActivations.length,4);
 });
 for(const destination of [0,1,2,3,4])for(const position of ['ATTACK','DEFENSE'])await test('Real Normal Summon and Spark Synchro in Main '+destination+' '+position,()=>{
  const t=make({hands:[[I.GUARD],[]],placements:[monster(0,I.DARK,1)]}),guard=uid(t,0,'hand',I.GUARD),dark=uid(t,0,'monster',I.DARK),spark=uid(t,0,'extra',I.SPARK);
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===guard);const used=copy(t.state.used),r=synchro(t,destination,position),x=locate(t,spark).item;
  assert.equal(x.zoneIndex,destination);assert.equal(x.position,position);assert.equal(x.summonType,'SYNCHRO');assert.equal(x.properlySummoned,true);assert.equal(x.properSummonType,'SYNCHRO');
  assert.equal(x.ownerPlayer,0);assert.equal(locate(t,spark).player,0);assert.equal(locate(t,guard).zone,'gy');assert.equal(locate(t,dark).zone,'gy');
  assert.deepEqual(t.state.extraHistory,['SYNCHRO']);assert.deepEqual(t.state.used,used);assert.equal(t.state.normalSummonAvailable[0],false);
  assert.equal(r.action.paid.length,2);assert(r.action.paid.every(p=>p.kind==='SYNCHRO_MATERIAL'&&p.from==='monster'&&p.to==='gy'&&p.toPlayer===0));
  assert(r.action.events.some(e=>e.type==='SYNCHRO_SUMMON_PROCEDURE'&&e.startsChain===false));assert(!r.action.events.some(e=>e.type==='REGISTERED_RESPONSE_CHAIN_CREATED'));
  assert.equal(r.action.proof.normalSpellActivation,null);assert.equal(r.action.proof.normalTrapActivation,null);replay(t);
 });
 await test('Complete witnessed Spark route revives and prevents exactly one later battle destruction without preventing damage',()=>{
  const {t,spark}=realRoute(),source=uid(t,0,'hand',I.REBORN);assert.equal(t.state.lp[0],8000);
  assert.equal(destroyOwnSpark(t),spark);assert.equal(t.state.lp[0],7500);assert.equal(locate(t,spark).item.properSummonType,'SYNCHRO');
  step(t,REBORN,a=>a.targetUid===spark&&a.destination===2&&a.position==='ATTACK'&&pass(a));assert.equal(locate(t,source).zone,'gy');
  assert.equal(locate(t,spark).item.summonType,'SPECIAL');assert.equal(locate(t,spark).item.properSummonType,'SYNCHRO');assert.equal(locate(t,spark).item.sparkProtection,undefined);
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='END');step(t,'DUEL_NEXT_TURN');step(t,'DUEL_DRAW_FOR_TURN');
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='STANDBY');step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='MAIN 1');protect(t,spark);
  assert.equal(locate(t,spark).item.sparkProtection.remaining,1);step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='BATTLE');
  const first=step(t,'DUEL_ATTACK',a=>a.player===1&&a.targetUid===spark&&pass(a));assert.equal(locate(t,spark).zone,'monster');assert.equal(locate(t,spark).item.sparkProtection.remaining,0);assert.equal(t.state.lp[0],7000);
  assert(first.action.events.some(e=>e.type==='SPARK_DESTRUCTION_PREVENTED'&&e.kind==='BATTLE'));assert(!E.enumerate(t.state).some(a=>a.type==='STARDUST_SPARK_PROTECTION'&&a.sourceUid===spark));
  const second=step(t,'DUEL_ATTACK',a=>a.player===1&&a.targetUid===spark&&pass(a));assert.equal(locate(t,spark).zone,'gy');assert.equal(t.state.lp[0],6500);
  assert(!second.action.events.some(e=>e.type==='SPARK_DESTRUCTION_PREVENTED'));assert.equal(locate(t,spark).item.sparkProtection,undefined);replay(t);
 });
 await test('A resolved shield survives source departure and revived Spark receives a new field-instance activation budget',()=>{
  const {t,spark}=realRoute({placements:[monster(0,I.DARK,1),monster(0,I.FISH,4),monster(1,I.BEWD,0),monster(1,I.BEWD,1)]}),fish=uid(t,0,'monster',I.FISH);
  protect(t,fish);assert.equal(t.state.used['SPARK_PROTECT:'+spark],true);destroyOwnSpark(t);
  assert.equal(locate(t,fish).item.sparkProtection.remaining,1);assert.equal(t.state.used['SPARK_PROTECT:'+spark],undefined);
  step(t,REBORN,a=>a.targetUid===spark&&a.destination===2&&a.position==='ATTACK'&&pass(a));protect(t,spark);
  assert.equal(locate(t,spark).item.sparkProtection.remaining,1);assert.equal(locate(t,fish).item.sparkProtection.remaining,1);replay(t);
 });
 await test('Declared proper flags and direct Extra-to-GY placement never substitute for the real Spark Synchro',()=>{
  const t=make({placements:[gy(0,I.SPARK,{properlySummoned:true,properSummonType:'SYNCHRO'})]}),spark=uid(t,0,'gy',I.SPARK);
  assert.equal(locate(t,spark).item.properSummonType,undefined);assert(!E.enumerate(t.state).some(a=>a.type===REBORN&&a.targetUid===spark));
  rejected(t,{type:REBORN,sourceUid:uid(t,0,'hand',I.REBORN),targetUid:spark,destination:0,position:'ATTACK'});
 });
 await test('Spirit-borrowed Spark has no proper Synchro history and cannot be revived after actual battle departure',()=>{
  const t=make({placements:[monster(0,I.SPIRIT,0,{declaredSummonType:'SYNCHRO',properlySummoned:true}),monster(1,I.BEWD,0)]});
  step(t,'SPIRIT_DRAGON_TRIBUTE_SYNCHRO',a=>id(locate(t,a.summonUid).item)===I.SPARK&&pass(a));const spark=uid(t,0,'monster',I.SPARK);
  assert.equal(locate(t,spark).item.properlySummoned,false);assert.equal(locate(t,spark).item.properSummonType,undefined);
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='BATTLE');
  // Borrowed Spark is in Defense, so opponent combat is reached through real phase transitions.
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='MAIN 2');step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='END');
  step(t,'DUEL_RESOLVE_BORROWED_SYNCHRO_END',a=>a.sourceUid===spark&&pass(a));assert.equal(locate(t,spark).zone,'gy');
  assert(!E.enumerate(t.state).some(a=>a.type===REBORN&&a.targetUid===spark));replay(t);
 });
 await test('Main Phase 2 supports the same procedure without requiring an Extra Monster Zone or Link arrows',()=>{
  const t=ready({phase:'MAIN 2',placements:[monster(0,I.GUARD,0),monster(0,I.DARK,1),monster(0,I.MONK,5)]});synchro(t,3,'DEFENSE');
  assert.equal(locate(t,uid(t,0,'monster',I.SPARK)).item.zoneIndex,3);assert(cards(t,0,'monster',I.MONK).length===1);replay(t);
 });
 await test('Full five Main zones are checked after physical materials leave, not before',()=>{
  const t=ready({placements:[monster(0,I.GUARD,0),monster(0,I.DARK,1),monster(0,I.FISH,2),monster(0,I.FISH,3),monster(0,I.FISH,4)]});
  assert.equal(t.state.zones[0].monster.length,5);assert.deepEqual([...new Set(options(t).map(a=>a.destination))].sort(),[0,1]);
  synchro(t,1);assert.equal(t.state.zones[0].monster.length,4);assert.equal(cards(t,0,'monster',I.FISH).length,3);replay(t);
 });
 await test('One Tuner plus four non-Tuners can consume all five zones for an exact total of eight',()=>{
  const t=ready({placements:[monster(0,I.GUARD,0),monster(0,I.SKULL,1),monster(0,I.SKULL,2),monster(0,I.SKULL,3),monster(0,I.FISH,4)]});
  const r=step(t,TYPE,a=>a.materialUids.length===5&&a.destination===4&&a.position==='ATTACK');assert.equal(r.action.paid.length,5);
  assert.equal(t.state.zones[0].monster.length,1);assert.equal(cards(t,0,'gy',I.SKULL).length,3);replay(t);
 });
 await test('A full Spell/Trap row does not require an activation column for the Synchro procedure',()=>{
  const t=ready({placements:[monster(0,I.GUARD,0),monster(0,I.DARK,1),set(0,I.CED,0),set(0,I.CED,1),set(0,I.IMPERM,2),set(0,I.IMPERM,3),set(0,I.ROAR,4)]});
  const before=t.state.zones[0].spelltrap.map(x=>x.uid),r=synchro(t);assert.deepEqual(t.state.zones[0].spelltrap.map(x=>x.uid),before);assert.equal(r.action.proof.activationColumn,null);replay(t);
 });
 await test('Duplicate material UID, an invented UID, and source outside Extra are rejected atomically',()=>{
  const t=ready(),a=options(t)[0];assert(a);for(const request of [{...a,materialUids:[a.materialUids[0],a.materialUids[0]]},{...a,materialUids:[a.materialUids[0],'invented']},{...a,sourceUid:a.materialUids[0]}])rejected(t,request);
 });
 await test('A material in hand, GY or the rival field cannot be injected into the procedure',()=>{
  const t=ready({hands:[[I.GUARD],[]],placements:[monster(0,I.GUARD,0),monster(0,I.DARK,1),gy(0,I.DARK),monster(1,I.GUARD,0)]}),a=options(t)[0];
  for(const bad of [uid(t,0,'hand',I.GUARD),uid(t,0,'gy',I.DARK),uid(t,1,'monster',I.GUARD)])rejected(t,{...a,materialUids:[bad,a.materialUids[1]]});
 });
 for(const [label,placements]of [
  ['no Tuner',[monster(0,I.FISH,0),monster(0,I.FISH,1)]],
  ['two Tuners',[monster(0,I.SERPENT,0),monster(0,I.SERPENT,1),monster(0,I.FISH,2)]],
  ['wrong total',[monster(0,I.GUARD,0),monster(0,I.FISH,1)]],
  ['face-down material',[monster(0,I.GUARD,0),monster(0,I.DARK,1,{faceUp:false,position:'SET'})]],
  ['unknown effect material',[monster(0,I.SERPENT,0),monster(0,I.UNKNOWN,1)]],
  ['Pendulum material',[monster(0,I.ANGEL,0),monster(0,I.PENDULUM,1)]],
  ['Xyz material',[monster(0,I.ANGEL,0),monster(0,I.XYZ,1)]],
  ['Link material',[monster(0,I.GUARD,0),monster(0,I.MONK,1)]]
 ])await test('The material subset rejects '+label,()=>{const t=ready({placements});assert.equal(options(t).length,0);});
 for(const [label,properties]of [['level override',{currentLevel:7}],['level modifier',{levelModifiers:[{amount:1}]}],['unreviewed attachment',{equipUids:['unreviewed']}],['material restriction',{cannotBeSynchroMaterial:true}],['unknown redirect',{leaveFieldRedirect:'banished'}]])
  await test('QA-only state with '+label+' cannot silently supply a legal material',()=>{const t=ready();Object.assign(locate(t,uid(t,0,'monster',I.DARK)).item,properties);assert.equal(options(t).length,0);});
 await test('Printed levels cannot be spoofed by altering the physical card snapshot',()=>{const t=ready();locate(t,uid(t,0,'monster',I.DARK)).item.card.level=6;assert.equal(options(t).length,0);});
 for(const [label,change]of [['opponent Main',{activePlayer:1}],['Battle',{phase:'BATTLE'}],['Standby',{phase:'STANDBY'}],['End',{phase:'END'}]])
  await test('The procedure stays unavailable during '+label,()=>{const t=ready(change);assert.equal(options(t).length,0);});
 await test('A pending registered optional effect must be resolved or declined before the procedure',()=>{
  const t=make({hands:[[I.SAGE],[]],placements:[monster(0,I.DARK,1)]});step(t,'BLUE_EYES_NORMAL_SUMMON_SAGE');assert(t.state.pendingTriggers.some(x=>x.kind==='SAGE_SEARCH'));assert.equal(options(t).length,0);
  step(t,'DECLINE_OPTIONAL_TRIGGER');synchro(t);replay(t);
 });
 await test('An opponent-owned Normal revived by a real Reborn is sent to its owner GY as a physical Synchro material',()=>{
  const t=make({hands:[[I.GUARD],[]],placements:[gy(1,I.DARK)]}),foreign=uid(t,1,'gy',I.DARK);
  step(t,REBORN,a=>a.targetUid===foreign&&a.destination===1&&a.position==='ATTACK'&&pass(a));step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.GUARD));
  const r=synchro(t,2),hit=locate(t,foreign);assert.equal(hit.zone,'gy');assert.equal(hit.player,1);assert.equal(hit.item.ownerPlayer,1);
  assert(r.action.paid.some(p=>p.uid===foreign&&p.fromPlayer===0&&p.toPlayer===1&&p.ownerPlayer===1));replay(t);
 });
 for(const [card,tuner]of [[I.MOYE,I.ANGEL],[I.LONGYUAN,I.SERPENT]])await test('A rival-owned '+card+' is excluded when its GY material trigger would require an unregistered owner actor',()=>{
  const t=make({hands:[[tuner],[]],placements:[gy(1,card)]}),foreign=uid(t,1,'gy',card);step(t,REBORN,a=>a.targetUid===foreign&&a.destination===1&&a.position==='ATTACK'&&pass(a));decline(t);
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',tuner));assert.equal(options(t).length,0);replay(t);
 });
 await test('Real Mo Ye Token is consumed once, ceases physically, and leaves the registered Mo Ye draw pending',()=>{
  const t=make({hands:[[I.MOYE,I.SHTHANA],[]]}),moye=uid(t,0,'hand',I.MOYE);step(t,'NORMAL_SUMMON',a=>a.sourceUid===moye);
  step(t,'MOYE_TOKEN',a=>a.revealUid===uid(t,0,'hand',I.SHTHANA));const token=t.state.zones[0].monster.find(x=>x.token);assert(token);
  const r=synchro(t);assert.equal(H.locate(t.state,token.uid),null);assert.equal(t.state.tokenLedger[token.uid].destroyed,true);assert(r.action.paid.some(p=>p.uid===token.uid&&p.to==='CEASES_TO_EXIST'));
  assert.equal(locate(t,moye).zone,'gy');assert.deepEqual(Array.from(t.state.pendingTriggers,x=>x.kind),['MOYE_DRAW']);
  const next=t.state.zones[0].deck[0].uid;step(t,'MOYE_DRAW');assert.equal(locate(t,next).zone,'hand');assert.equal(t.state.used.MOYE_DRAW,true);replay(t);
 });
 await test('A forged Token ledger cannot create a material outside a real generated Token record',()=>{
  const t=make({hands:[[I.MOYE,I.SHTHANA],[]]});step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.MOYE));step(t,'MOYE_TOKEN');
  const token=t.state.zones[0].monster.find(x=>x.token);assert(options(t).length);t.state.tokenLedger[token.uid].sourceUid='invented';assert.equal(options(t).length,0);
 });
 await test('Longyuan material invokes its existing real GY burn without turning Spark into a monster-effect activation',()=>{
  const t=make({hands:[[I.SERPENT],[]],placements:[monster(0,I.LONGYUAN,1)]});step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.SERPENT));
  const r=synchro(t);assert.equal(r.action.proof.responseType,null);assert(t.state.pendingTriggers.some(x=>x.kind==='LONGYUAN_BURN'));
  step(t,'LONGYUAN_BURN');assert.equal(t.state.lp[1],6800);assert.equal(t.state.used.LONGYUAN_BURN,true);replay(t);
 });
 await test('Ancients sent as a real material retains the existing optional End Phase opportunity',()=>{
  const t=ready({cards:[[I.BEWD],[]],placements:[monster(0,I.ANCIENTS,0),monster(0,I.DARK,1)]}),stone=uid(t,0,'monster',I.ANCIENTS);synchro(t);
  assert.equal(locate(t,stone).item.sentToGyTurn,2);step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='END');
  assert(E.enumerate(t.state).some(a=>a.type==='DUEL_ANCIENTS_END_SUMMON'&&a.sourceUid===stone));step(t,'DUEL_DECLINE_END_OPTIONAL',a=>a.sourceUid===stone);replay(t);
 });
 await test('Real Spinny revival redirects a Synchro material to banishment and records its actual destination',()=>{
  const t=ready({placements:[monster(0,I.SERPENT,0),monster(0,I.GAZELLE,1),gy(0,I.SPINNY)]}),spinny=uid(t,0,'gy',I.SPINNY);
  step(t,'SALAMANGREAT_SPINNY_REVIVE',a=>a.destination===2&&pass(a));assert.equal(locate(t,spinny).item.leaveFieldRedirect,'banished');
  const r=step(t,TYPE,a=>a.materialUids.length===3&&a.destination===0&&a.position==='ATTACK');assert.equal(locate(t,spinny).zone,'banished');assert(r.action.paid.some(p=>p.uid===spinny&&p.to==='banished'));replay(t);
 });
 await test('A live EMZ Wolf keeps its pending opportunity when Spark is Synchro Summoned into its reviewed arrow',()=>{
  const t=ready({placements:[monster(0,I.GUARD,0),monster(0,I.DARK,1),monster(0,I.WOLF,5)]});synchro(t,1);
  assert(t.state.pendingTriggers.some(x=>x.kind==='SALAMANGREAT_WOLF_FIRE'));assert(!E.enumerate(t.state).some(a=>a.type==='STARDUST_SPARK_PROTECTION'));
  decline(t);protect(t);replay(t);
 });
 await test('A real Branded Fusion resolution locks out the subsequent Spark Extra Deck procedure',()=>{
  const t=ready({hands:[[I.BF],[]],cards:[[I.ALBAZ,I.DARK],[]],extra:[[I.LUBELLION],[]]});assert(options(t).length);
  step(t,'BRANDED_FUSION_LUBELLION',a=>a.materialUids.every(u=>locate(t,u).zone==='deck')&&pass(a));decline(t);
  assert(t.state.locks.some(l=>l.kind==='FUSION_ONLY'&&l.wholeTurn));assert.equal(options(t).length,0);replay(t);
 });
 await test('A real Ashuna restriction blocks Dragon Spark even though its levels and Tuner recipe remain valid',()=>{
  const t=ready({placements:[monster(0,I.GUARD,0),monster(0,I.DARK,1),gy(0,I.ASHUNA)],cards:[[I.ADHARA],[]]}),source=uid(t,0,'gy',I.ASHUNA);assert(options(t).length);
  step(t,'TENYI_ASHUNA_DECK',a=>a.sourceUid===source&&pass(a));assert.equal(locate(t,source).zone,'banished');assert(t.state.locks.some(l=>l.kind==='WYRM_ONLY'));
  assert.equal(options(t).length,0);replay(t);
 });
 await test('Live Dragon-only Spirit and the opposing Spirit Dragon one-at-a-time limit both allow a single Dragon Synchro',()=>{
  const t=ready({placements:[monster(0,I.GUARD,0),monster(0,I.DARK,1),monster(0,I.SPIRIT_LINK,5),monster(1,I.SPIRIT,0)]});synchro(t,3);replay(t);
 });
 await test('The procedure offers no Ash, Spirit GY, Mechaba or Roar activation-response packet despite real available sources and costs',()=>{
  const t=ready({hands:[[],[I.ASH,I.FISH]],responseTypes:['ASH','SPIRIT','MECHABA','ROAR'],placements:[monster(0,I.GUARD,0),monster(0,I.DARK,1),monster(1,I.MECHABA,0),monster(1,I.SPIRIT,1),monster(1,I.WOLF,5),set(1,I.ROAR,0)]});
  const before=copy(t.state),list=options(t);assert(list.length);assert(list.every(a=>!a.response&&!a.responseUid&&!a.counterResponses));synchro(t,2);
  for(const n of [I.ASH,I.FISH])assert.equal(uid(t,1,'hand',n),before.zones[1].hand.find(x=>id(x)===n).uid);assert.equal(t.state.used['ASH:1'],undefined);replay(t);
 });
 function shamanScenario(){return realRoute({hands:[[I.GUARD,I.FISH],[]],placements:[monster(0,I.DARK,1),monster(0,I.SHAMAN,5),gy(0,I.ADHARA),monster(1,I.BEWD,0),monster(1,I.BEWD,1)]});}
 function reviveAdharaWithShaman(t){const target=uid(t,0,'gy',I.ADHARA),cost=uid(t,0,'hand',I.FISH);assert(target&&cost);
  const r=step(t,'TENYI_SHAMAN_REVIVE',a=>a.targetUid===target&&a.discardUid===cost&&pass(a));
  assert.equal(locate(t,cost).zone,'gy');assert(r.action.paid.some(p=>p.kind==='DISCARD'&&p.uid===cost&&p.to==='gy'));
  assert.equal(t.state.used.TENYI_SHAMAN_REVIVE,true);assert(t.state.locks.some(l=>l.kind==='TENYI_EXTRA_EFFECTS_ONLY'));return{target,cost};}
 await test('An actual Spark Synchro remains under the paid Shaman restriction on effects of monsters summoned from Extra',()=>{
  const t=ready({hands:[[I.FISH],[]],placements:[monster(0,I.DARK,1),monster(0,I.SHAMAN,5),gy(0,I.ADHARA)]});
  const {target,cost}=reviveAdharaWithShaman(t);assert.equal(locate(t,target).item.summonOriginZone,'gy');
  synchro(t,2);const spark=uid(t,0,'monster',I.SPARK);assert.equal(locate(t,spark).item.summonOriginZone,'extra');assert.equal(locate(t,spark).item.properSummonType,'SYNCHRO');
  assert(!E.enumerate(t.state).some(a=>a.type==='STARDUST_SPARK_PROTECTION'&&a.sourceUid===spark));
  rejected(t,{type:'STARDUST_SPARK_PROTECTION',player:0,sourceUid:spark,targetUid:spark});assert.equal(locate(t,cost).zone,'gy');assert.equal(t.state.used.TENYI_SHAMAN_REVIVE,true);replay(t);
 });
 await test('An actual proper Spark revived from GY can protect under Shaman while the real discard and lock remain paid',()=>{
  const {t,spark}=shamanScenario();assert.equal(locate(t,spark).item.summonOriginZone,'extra');destroyOwnSpark(t);assert.equal(locate(t,spark).item.summonOriginZone,undefined);
  const {cost}=reviveAdharaWithShaman(t);step(t,REBORN,a=>a.targetUid===spark&&a.destination===2&&a.position==='ATTACK'&&pass(a));
  assert.equal(locate(t,spark).item.summonOriginZone,'gy');assert.equal(locate(t,spark).item.summonType,'SPECIAL');assert.equal(locate(t,spark).item.properSummonType,'SYNCHRO');
  protect(t,spark);assert.equal(locate(t,spark).item.sparkProtection.remaining,1);assert.equal(locate(t,cost).zone,'gy');assert.equal(t.state.used.TENYI_SHAMAN_REVIVE,true);
  assert(t.state.locks.some(l=>l.kind==='TENYI_EXTRA_EFFECTS_ONLY'));replay(t);
 });
 await test('Fresh replay rejects a forged revival origin instead of treating the printed Extra type as summoning evidence',()=>{
  const {t,spark}=shamanScenario();destroyOwnSpark(t);reviveAdharaWithShaman(t);step(t,REBORN,a=>a.targetUid===spark&&a.destination===2&&a.position==='ATTACK'&&pass(a));protect(t,spark);
  const line=replay(t),bad=copy(line);H.locate(bad.after,spark).item.summonOriginZone='extra';bad.state=copy(bad.after);assert.equal(E.replay(bad,{deck:t.deck}).pass,false);
 });
 await test('Fresh replay rejects forged Synchro materials, paid destinations and final proper history',()=>{
  const {t}=realRoute(),line=replay(t),index=line.actions.findIndex(a=>a.type===TYPE);assert(index>=0);
  for(const mutate of [x=>{x.actions[index].materialUids[1]=x.actions[index].materialUids[0];},x=>{x.actions[index].paid[0].to='banished';},x=>{x.after.zones[0].monster.find(c=>id(c)===I.SPARK).properSummonType='FUSION';x.state=copy(x.after);}]){
   const bad=copy(line);mutate(bad);assert.equal(E.replay(bad,{deck:t.deck}).pass,false);
  }
 });
 await test('A real CED return clears Spark qualification in the hidden Extra and a new procedure creates it anew',()=>{
  const t=ready({placements:[monster(0,I.GUARD,0),monster(0,I.DARK,1),set(0,I.CED,0)],hands:[[I.GUARD],[]],cards:[[I.DARK],[]]});synchro(t,2);const spark=uid(t,0,'monster',I.SPARK);
  step(t,'ACTIVATE_COMPULSORY_EVACUATION_DEVICE',a=>a.targetUid===spark&&pass(a));assert.equal(locate(t,spark).zone,'extra');assert.equal(locate(t,spark).item.properSummonType,undefined);assert.equal(locate(t,spark).item.properlySummoned,undefined);
  const dark=uid(t,0,'gy',I.DARK);step(t,REBORN,a=>a.targetUid===dark&&a.destination===1&&a.position==='ATTACK'&&pass(a));
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.GUARD));synchro(t,2);assert.equal(uid(t,0,'monster',I.SPARK),spark);
  assert.equal(locate(t,spark).item.properSummonType,'SYNCHRO');assert.equal(locate(t,spark).item.summonOriginZone,'extra');assert.equal(t.state.extraHistory.filter(x=>x==='SYNCHRO').length,2);replay(t);
 });
 const report={schema:'ygo-stardust-synchro-tests/v1',pass:tests.every(x=>x.pass),total:tests.length,tests,
  limitations:['Fixtures use the pinned technical catalogue and dated TCG application snapshot, not independently authenticated universal rulings.','Initial Main Deck fields are declared physical assumptions; Spark proper history is established by executed procedures and fresh replay.','QA-only altered states test rejection and are not certified game lines.','Only registered material profiles, responses, Main Zone destinations and timing are tested; general summon negation, priority and all simultaneous triggers remain outside scope.','Competitive scoring remains provisional by user request.']};
 fs.writeFileSync(path.join(ROOT,'tests/stardust-synchro-results.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));if(!report.pass)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});

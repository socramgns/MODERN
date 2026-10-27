'use strict';
/* Physical Crow/Droll packets. The mirrored search and GY-to-hand recovery
 * providers are test-only mechanisms, not claimed TCG-legal product combos. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {harness,ROOT}=require('./combo_engine.cjs'),copy=structuredClone;
const I={CROW:24508238,DROLL:94145021,MECHABA:75286621,BEWD:89631139,ALEISTER:86120751,INVOCATION:74063034,
 SAGE:8240199,ANCIENTS:71039903,MAUSOLEUM:24382602,WOLF:87871125,ROAR:51339637,SPIRIT:59822133,VEILER:97268402,IMPERM:10045474};

(async()=>{
 const h=await harness(true),{W,E}=h,H=E.helpers,id=H.baseId,tests=[];
 for(const module of ['duel-phases','responses','archetypes-expanded','blue-eyes-duel'])
  vm.runInNewContext(fs.readFileSync(path.join(ROOT,'src/app/'+module+'.js'),'utf8'),{window:W,structuredClone,console,Date,Promise,setTimeout,clearTimeout,performance});
 await Promise.resolve();
 const fillers=[...new Set(h.fixture('Invoked').deck.main.filter(x=>![I.ALEISTER,I.INVOCATION].includes(x.id)).map(x=>x.id).concat([63749102,74367458,48305365,32452818]))];
 function deck(cards,extra){
  const counts=new Map();for(const n of cards)counts.set(n,(counts.get(n)||0)+1);let total=cards.length;
  for(const n of fillers){if(total===40)break;if(counts.has(n))continue;const qty=Math.min(3,40-total);counts.set(n,qty);total+=qty;}
  assert.equal(total,40);
  const d={main:[...counts].map(([id,qty])=>({id,qty})),extra:[...extra.reduce((m,n)=>m.set(n,(m.get(n)||0)+1),new Map())].map(([id,qty])=>({id,qty})),side:[]};
  const audit=W.YGODataCatalog.auditDeck(d,{format:'tcg',banlist:W.BANLIST_PROFILES.tcg.data});assert.equal(audit.pass,true,'TEST_DECK_CONSTRUCTION_REJECTED: '+JSON.stringify(audit));return d;
 }
 function opening(d,wanted,reserved){
  const quantities=new Map(d.main.map(x=>[x.id,x.qty])),out=[...wanted];
  for(const n of [...wanted,...reserved]){assert((quantities.get(n)||0)>0,'Missing physical card '+n);quantities.set(n,quantities.get(n)-1);}
  for(const n of fillers)while(out.length<5&&quantities.get(n)>0){out.push(n);quantities.set(n,quantities.get(n)-1);}
  assert.equal(out.length,5);return out;
 }
 function remaining(d,hand){const out=d.main.flatMap(x=>Array(x.qty).fill(x.id));for(const n of hand){const at=out.indexOf(n);assert(at>=0);out.splice(at,1);}return out;}
 const field=(player,cardId,zone='monster',from='extra',details={})=>({player,cardId,zone,from,faceUp:zone==='monster',position:'ATTACK',summonTurn:1,...details});
 function make(o={}){
  const placements=o.placements||[],decks=[0,1].map(p=>deck(o.cards?.[p]||[],o.extra?.[p]||[])),hands=[0,1].map(p=>opening(decks[p],o.hands?.[p]||[],placements.filter(x=>x.player===p&&x.from==='deck').map(x=>x.cardId))),spec={
   deck:decks[0],openingIds:hands[0],remainingDeckIds:remaining(decks[0],hands[0]),opponentDeck:decks[1],opponentOpeningIds:hands[1],opponentRemainingDeckIds:remaining(decks[1],hands[1]),
   context:{format:'tcg',duelMode:true,opponentPolicy:'RESPONSES_EXPLICIT',responseTypes:o.types||['MECHABA'],responsePolicy:o.policy||'CHOICE_BRANCHES',...(o.context||{})},
   setup:{turn:2,activePlayer:0,phase:o.phase||'MAIN 1',placements}};
  const initial=E.createState(spec);return{spec,deck:decks[0],initial,state:copy(initial),actions:[]};
 }
 const uid=(t,p,z,n)=>t.state.zones[p][z].find(x=>id(x)===n)?.uid;
 const where=(t,n)=>H.locate(t.state,n);
 const options=(t,type)=>E.enumerate(t.state).filter(a=>a.type===type);
 const pass=a=>!a.response&&!a.responseUid,mechaba=a=>a.response?.type==='MECHABA'&&!a.counterResponses;
 function step(t,type,choose=pass){
  const action=options(t,type).find(choose);assert(action,'Missing '+type+' '+JSON.stringify(options(t,type)));
  const before=JSON.stringify(t.state),physical=H.inventory(t.state),result=E.execute(t.state,action);
  assert.equal(result.pass,true,JSON.stringify(result));assert.equal(JSON.stringify(t.state),before);assert.equal(H.inventory(result.after),physical);
  t.state=result.after;t.actions.push(result.action);return result;
 }
 function replay(t){const line={before:copy(t.initial),after:copy(t.state),state:copy(t.state),actions:copy(t.actions),context:copy(t.initial.context),deckFingerprint:E.deckFingerprint(t.deck)};assert.equal(E.replay(line,{deck:t.deck}).pass,true);return line;}
 function noOwnUse(t){assert(!Object.keys(t.state.used).some(key=>/CROW|DROLL/.test(key)));}
 function roars(o,players){for(const p of players){o.cards[p].push(I.ROAR);o.extra[p].push(I.WOLF);o.placements.push(field(p,I.WOLF,'monster','extra',{zoneIndex:5}),field(p,I.ROAR,'spelltrap','deck',{zoneIndex:0,faceUp:false,setTurn:1}));}return o;}
 function crow(player=0,extra={}){
  const other=1-player,o={cards:[[],[]],hands:[[],[]],extra:[[],[]],placements:[],...extra};
  o.cards[player].push(...Array(extra.copies||1).fill(I.CROW));o.hands[player].push(...Array(extra.copies||1).fill(I.CROW));
  o.cards[other].push(I.BEWD);o.extra[other].push(I.MECHABA);o.placements.push(field(other,I.MECHABA),field(other,I.BEWD,'gy','deck'));
  if(extra.roars)roars(o,extra.roars);return make(o);
 }
 function droll(extra={}){
  const count=extra.copies||1,o={cards:[[I.SAGE,I.SAGE,I.MAUSOLEUM,I.ANCIENTS,I.ANCIENTS],Array(count).fill(I.DROLL)],hands:[[I.SAGE,I.SAGE,I.MAUSOLEUM],Array(count).fill(I.DROLL)],extra:[[I.MECHABA],[]],placements:[field(0,I.MECHABA)],...extra};
  if(extra.roars)roars(o,extra.roars);const t=make(o);
  step(t,'ACTIVATE_MAUSOLEUM_OF_WHITE');step(t,'BLUE_EYES_NORMAL_SUMMON_SAGE');step(t,'SAGE_SEARCH_LIGHT_TUNER',a=>pass(a)&&id(where(t,a.selectionUid).item)===I.ANCIENTS);
  assert(t.state.drollWindows.some(w=>w.player===0));return t;
 }
 function paidInHand(trace,source,kind,player){assert.equal(trace.paid.filter(p=>p.uid===source&&p.kind===kind&&p.player===player&&p.from==='hand'&&p.to==='gy').length,1);}
 async function test(name,run){try{await run();tests.push({name,pass:true});}catch(error){tests.push({name,pass:false,error:error.stack});}}

 // One Droll is legal in the fixed snapshot. This fixture returns the same UID
 // without claiming an implemented recovery effect or creating a second copy.
 E.registerHandler({type:'QA_RECOVER_DROLL_NO_EFFECT_MODEL',scope:'DUEL',enumerate:s=>s.context.qaRecoverDroll===true?[0,1].flatMap(player=>s.zones[player].gy.filter(x=>id(x)===I.DROLL).map(source=>({type:'QA_RECOVER_DROLL_NO_EFFECT_MODEL',player,sourceUid:source.uid}))):[],apply:(s,a)=>{
  const hit=H.locate(s,a.sourceUid);if(hit?.zone!=='gy'||hit.player!==a.player||id(hit.item)!==I.DROLL)throw Error('QA_RECOVERY_PHYSICAL_SOURCE_REQUIRED');
  H.move(s,a.sourceUid,'hand',{player:a.player});return{events:[{type:'QA_PHYSICAL_RECOVERY_NOT_MODELED_CARD_EFFECT',uid:a.sourceUid,player:a.player,from:'gy',to:'hand'}]};
 }});

 await test('Crow and Droll register exact hand packets with NONE rather than invented per-turn usage',()=>{
  const registry=W.YGOResponses.capabilities().mechabaNonFieldMonsterActivations;assert.equal(registry.length,15);
  for(const [type,card] of [['DD_CROW_BANISH',I.CROW],['DROLL_LOCK',I.DROLL]]){const row=registry.find(r=>r.type===type);assert(row);assert.deepEqual(Array.from(row.cardIds),[card]);assert.deepEqual(Array.from(row.activationZones),['hand']);assert.equal(row.restriction,'NONE');}
 });
 for(const player of [0,1])await test('Mechaba negates player '+player+' Crow while preserving discard, hand origin and the GY target',()=>{
  const t=crow(player),source=uid(t,player,'hand',I.CROW),target=uid(t,1-player,'gy',I.BEWD),r=step(t,'DD_CROW_BANISH',a=>mechaba(a)&&a.player===player).action;
  assert.equal(where(t,source).zone,'gy');assert.equal(where(t,target).zone,'gy');assert.equal(r.proof.activationOrigin.zone,'hand');assert.equal(r.proof.activationOrigin.player,player);assert.equal(r.proof.activationOrigin.restriction,'NONE');assert.equal(r.proof.activationNegated,true);
  paidInHand(r,source,'DISCARD',player);paidInHand(r,r.response.costUid,'SEND_GY',1-player);assert.notEqual(source,r.response.costUid);
  assert.equal(r.events.filter(e=>e.type==='TARGET'&&e.uid===target).length,1);assert(!r.events.some(e=>e.type==='DD_CROW_BANISH'||e.type==='MECHABA_BANISH_ACTIVATED_CARD'));
  assert(r.events.some(e=>e.type==='MECHABA_BANISH_NOT_APPLIED'&&e.activationZone==='hand'&&e.currentZone==='gy'));noOwnUse(t);replay(t);
 });
 await test('An unopposed Crow discards one physical source and banishes the selected physical target',()=>{
  const t=crow(),source=uid(t,0,'hand',I.CROW),target=uid(t,1,'gy',I.BEWD),r=step(t,'DD_CROW_BANISH').action;
  paidInHand(r,source,'DISCARD',0);assert.equal(where(t,source).zone,'gy');assert.equal(where(t,target).zone,'banished');assert.equal(r.events.filter(e=>e.type==='TARGET'&&e.uid===target).length,1);noOwnUse(t);replay(t);
 });
 await test('A second Crow remains usable after the first is negated and pays a separate single discard',()=>{
  const t=crow(0,{copies:2}),first=step(t,'DD_CROW_BANISH',mechaba).action,second=step(t,'DD_CROW_BANISH').action;
  assert.notEqual(first.sourceUid,second.sourceUid);paidInHand(first,first.sourceUid,'DISCARD',0);paidInHand(second,second.sourceUid,'DISCARD',0);
  assert.equal(where(t,first.sourceUid).zone,'gy');assert.equal(where(t,second.sourceUid).zone,'gy');assert.equal(where(t,second.targetUid).zone,'banished');noOwnUse(t);replay(t);
 });
 await test('Crow supports the registered Battle window without inferring Damage Step',()=>{const t=crow(0,{phase:'BATTLE'});step(t,'DD_CROW_BANISH',mechaba);assert.equal(t.state.phase,'BATTLE');replay(t);});
 await test('FIRST_ELIGIBLE requires the available real Mechaba response to Crow',()=>{const t=crow(0,{policy:'FIRST_ELIGIBLE'});assert(options(t,'DD_CROW_BANISH').length);assert(options(t,'DD_CROW_BANISH').every(mechaba));step(t,'DD_CROW_BANISH',mechaba);replay(t);});
 await test('Crow cannot activate without an opposing admitted physical GY target',()=>{
  const t=make({cards:[[I.CROW],[]],hands:[[I.CROW],[]],extra:[[],[I.MECHABA]],placements:[field(1,I.MECHABA)]});assert.equal(options(t,'DD_CROW_BANISH').length,0);
 });
 await test('Mechaba cannot answer Crow without a matching physical Monster in hand',()=>{
  const spells=[I.INVOCATION,I.INVOCATION,I.INVOCATION,I.ROAR,I.ROAR],t=crow(0,{cards:[[],[...spells]],hands:[[],[...spells]]});
  assert(options(t,'DD_CROW_BANISH').length);assert(options(t,'DD_CROW_BANISH').every(pass));step(t,'DD_CROW_BANISH');replay(t);
 });
 await test('Crow does not acquire Veiler, Impermanence or Spirit responses from its hand metadata',()=>{
  const t=crow(0,{types:['VEILER','IMPERM','SPIRIT'],cards:[[I.CROW],[I.VEILER,I.IMPERM]],hands:[[I.CROW],[I.VEILER,I.IMPERM]],extra:[[],[I.SPIRIT]],placements:[field(1,I.SPIRIT)]});
  assert(options(t,'DD_CROW_BANISH').length);assert(options(t,'DD_CROW_BANISH').every(pass));
 });
 await test('Roar can negate Crow but does not destroy its discarded source in the GY',()=>{
  const t=crow(0,{roars:[1],types:['ROAR']}),r=step(t,'DD_CROW_BANISH',a=>a.response?.type==='ROAR'&&!a.counterResponses).action;
  assert.equal(r.proof.activationNegated,true);paidInHand(r,r.sourceUid,'DISCARD',0);assert.equal(where(t,r.sourceUid).zone,'gy');assert.equal(where(t,r.targetUid).zone,'gy');assert(!r.events.some(e=>e.type==='DESTROYED_BY_EFFECT'&&e.uid===r.sourceUid));replay(t);
 });
 await test('Roar countering Mechaba restores Crow resolution while retaining both physical costs',()=>{
  const t=crow(0,{roars:[0],types:['MECHABA','ROAR']}),r=step(t,'DD_CROW_BANISH',a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===1).action;
  assert.equal(r.proof.activationNegated,false);assert.equal(r.proof.registeredResponseChain.firstResponseNegated,true);paidInHand(r,r.sourceUid,'DISCARD',0);paidInHand(r,r.response.costUid,'SEND_GY',1);
  assert.equal(where(t,r.sourceUid).zone,'gy');assert.equal(where(t,r.targetUid).zone,'banished');assert(uid(t,1,'gy',I.MECHABA));replay(t);
 });
 await test('A second Roar restores Mechaba against Crow in reverse chain order',()=>{
  const t=crow(0,{roars:[0,1],types:['MECHABA','ROAR']}),r=step(t,'DD_CROW_BANISH',a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===2).action;
  assert.equal(r.proof.activationNegated,true);assert.equal(where(t,r.sourceUid).zone,'gy');assert.equal(where(t,r.targetUid).zone,'gy');
  assert.deepEqual(Array.from(r.proof.registeredResponseChain.resolutions.filter(e=>e.type==='REGISTERED_CHAIN_LINK_RESOLVED'),e=>e.chainLink),[4,3,2]);replay(t);
 });
 await test('Droll cannot activate without a newly registered search or effect draw window',()=>{
  const t=make({cards:[[],[I.DROLL]],hands:[[],[I.DROLL]],extra:[[I.MECHABA],[]],placements:[field(0,I.MECHABA)]});assert.equal(options(t,'DROLL_LOCK').length,0);
 });
 await test('Mechaba negates Droll after a real Sage search without removing the searched card or applying a lock',()=>{
  const t=droll(),source=uid(t,1,'hand',I.DROLL),searched=uid(t,0,'hand',I.ANCIENTS),r=step(t,'DROLL_LOCK',mechaba).action;
  assert.equal(r.proof.activationOrigin.zone,'hand');assert.equal(r.proof.activationOrigin.restriction,'NONE');assert.equal(r.proof.activationNegated,true);assert.equal(where(t,source).zone,'gy');assert.equal(where(t,searched).zone,'hand');
  paidInHand(r,source,'SEND_GY',1);paidInHand(r,r.response.costUid,'SEND_GY',0);assert(!t.state.locks.some(l=>l.kind==='NO_DECK_TO_HAND'));assert(!r.events.some(e=>e.type==='TARGET'||e.type==='MECHABA_BANISH_ACTIVATED_CARD'));noOwnUse(t);replay(t);
 });
 await test('The pinned TCG snapshot rejects a fixture with two Droll copies',()=>{assert.throws(()=>droll({copies:2}),/TEST_DECK_CONSTRUCTION_REJECTED/);});
 await test('A negated Droll closes its old search window even if a test fixture returns the same physical UID',()=>{
  const t=droll({context:{qaRecoverDroll:true}}),source=uid(t,1,'hand',I.DROLL);step(t,'DROLL_LOCK',mechaba);step(t,'QA_RECOVER_DROLL_NO_EFFECT_MODEL');
  assert.equal(uid(t,1,'hand',I.DROLL),source);assert.equal(t.state.drollWindows.length,0);assert.equal(options(t,'DROLL_LOCK').length,0);noOwnUse(t);replay(t);
 });
 await test('The same Droll UID can use a new Sage search after a marked test-only recovery, without an invented OPT',()=>{
  const t=droll({context:{qaRecoverDroll:true}}),first=step(t,'DROLL_LOCK',a=>mechaba(a)&&fillers.includes(id(where(t,a.response.costUid).item))).action;step(t,'QA_RECOVER_DROLL_NO_EFFECT_MODEL');
  step(t,'MAUSOLEUM_ADDITIONAL_NORMAL_SUMMON',a=>pass(a)&&id(where(t,a.summonUid).item)===I.SAGE);
  step(t,'SAGE_SEARCH_LIGHT_TUNER',a=>pass(a)&&id(where(t,a.selectionUid).item)===I.ANCIENTS);
  assert(t.state.drollWindows.length);const second=step(t,'DROLL_LOCK').action;
  assert.equal(first.sourceUid,second.sourceUid);paidInHand(first,first.sourceUid,'SEND_GY',1);paidInHand(second,second.sourceUid,'SEND_GY',1);
  assert.equal(where(t,first.sourceUid).zone,'gy');assert.equal(where(t,second.sourceUid).zone,'gy');const lock=t.state.locks.find(l=>l.kind==='NO_DECK_TO_HAND');assert(lock);assert.deepEqual(Array.from(lock.appliesToPlayers),[0,1]);noOwnUse(t);replay(t);
 });
 await test('A resolved Droll lock blocks redundant activation after a marked recovery of its one physical copy',()=>{
  const t=droll({context:{qaRecoverDroll:true}}),source=uid(t,1,'hand',I.DROLL);step(t,'DROLL_LOCK');step(t,'QA_RECOVER_DROLL_NO_EFFECT_MODEL');
  assert.equal(uid(t,1,'hand',I.DROLL),source);assert(t.state.locks.some(l=>l.kind==='NO_DECK_TO_HAND'));assert.equal(options(t,'DROLL_LOCK').length,0);noOwnUse(t);replay(t);
 });
 await test('FIRST_ELIGIBLE can force Mechaba at the real Droll response window',()=>{const t=droll({policy:'FIRST_ELIGIBLE'});assert(options(t,'DROLL_LOCK').length);assert(options(t,'DROLL_LOCK').every(mechaba));step(t,'DROLL_LOCK',mechaba);replay(t);});
 await test('Roar negates Droll without destroying the source that paid its hand-to-GY cost',()=>{
  const t=droll({roars:[0],types:['ROAR']}),r=step(t,'DROLL_LOCK',a=>a.response?.type==='ROAR'&&!a.counterResponses).action;
  assert.equal(r.proof.activationNegated,true);paidInHand(r,r.sourceUid,'SEND_GY',1);assert.equal(where(t,r.sourceUid).zone,'gy');assert(!t.state.locks.some(l=>l.kind==='NO_DECK_TO_HAND'));assert(!r.events.some(e=>e.type==='DESTROYED_BY_EFFECT'&&e.uid===r.sourceUid));replay(t);
 });
 await test('Roar countering Mechaba allows Droll to resolve while every paid hand card remains spent',()=>{
  const t=droll({roars:[1],types:['MECHABA','ROAR']}),r=step(t,'DROLL_LOCK',a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===1).action;
  assert.equal(r.proof.activationNegated,false);assert.equal(r.proof.registeredResponseChain.firstResponseNegated,true);paidInHand(r,r.sourceUid,'SEND_GY',1);paidInHand(r,r.response.costUid,'SEND_GY',0);
  assert.equal(where(t,r.sourceUid).zone,'gy');assert(t.state.locks.some(l=>l.kind==='NO_DECK_TO_HAND'));assert(uid(t,0,'gy',I.MECHABA));replay(t);
 });
 await test('Droll actor zero uses an explicit physical opponent-search fixture with fresh replay',()=>{
  E.registerHandler({type:'QA_OPPONENT_SEARCH_FOR_DROLL',scope:'DUEL',monsterEffect:true,enumerate:s=>s.context.qaOpponentSearch&&!H.isUsed(s,'QA_OPPONENT_SEARCH')?s.zones[1].monster.filter(x=>id(x)===I.ALEISTER).flatMap(source=>s.zones[1].deck.filter(x=>id(x)===I.INVOCATION).map(target=>({type:'QA_OPPONENT_SEARCH_FOR_DROLL',player:1,sourceUid:source.uid,selectionUid:target.uid}))):[],apply:(s,a)=>{H.markUsed(s,'QA_OPPONENT_SEARCH');H.move(s,a.selectionUid,'hand',{player:1});H.shuffle(s,1);return{events:[{type:'SEARCH',uid:a.selectionUid,sourceUid:a.sourceUid,from:'deck',to:'hand',player:1}]};}});
  const t=make({cards:[[I.DROLL],[I.ALEISTER,I.INVOCATION]],hands:[[I.DROLL],[]],extra:[[],[I.MECHABA]],placements:[field(1,I.MECHABA),field(1,I.ALEISTER,'monster','deck',{zoneIndex:1})],context:{qaOpponentSearch:true}});
  step(t,'QA_OPPONENT_SEARCH_FOR_DROLL');const r=step(t,'DROLL_LOCK',a=>mechaba(a)&&a.player===0).action;
  assert.equal(r.proof.activationOrigin.player,0);assert.equal(r.proof.activationOrigin.zone,'hand');assert.equal(r.response.player,1);paidInHand(r,r.sourceUid,'SEND_GY',0);paidInHand(r,r.response.costUid,'SEND_GY',1);assert(!t.state.locks.some(l=>l.kind==='NO_DECK_TO_HAND'));replay(t);
 });
 await test('Forged Crow origin, actor, target and response cost fail atomically',()=>{
  const t=crow(),action=options(t,'DD_CROW_BANISH').find(mechaba),before=JSON.stringify(t.state);assert(action);
  for(const mutate of [a=>a.player=1,a=>a.targetUid=a.sourceUid,a=>a.response.activationZone='gy',a=>a.response.activationSourceCardId=I.DROLL,a=>a.response.costUid=a.sourceUid]){const bad=copy(action);mutate(bad);assert.equal(E.execute(t.state,bad).pass,false);assert.equal(JSON.stringify(t.state),before);}
 });
 await test('Forged Droll event witness, actor and source identity fail atomically',()=>{
  const t=droll(),action=options(t,'DROLL_LOCK').find(mechaba),before=JSON.stringify(t.state);assert(action);
  for(const mutate of [a=>a.eventIndex+=1,a=>a.afterPlayer=1,a=>a.player=0,a=>a.response.registeredMonsterPacket='DD_CROW_BANISH',a=>a.response.activationZone='gy']){const bad=copy(action);mutate(bad);assert.equal(E.execute(t.state,bad).pass,false);assert.equal(JSON.stringify(t.state),before);}
 });
 await test('Fresh Crow replay rejects changed discard, target declaration and activation origin',()=>{
  const t=crow();step(t,'DD_CROW_BANISH',mechaba);const valid=replay(t);
  for(const mutate of [a=>a.paid.find(p=>p.uid===a.sourceUid).kind='SEND_GY',a=>a.proof.activationOrigin.zone='gy',a=>a.events.find(e=>e.type==='TARGET').uid='forged',a=>a.response.activationSourceCardId=I.DROLL]){const bad=copy(valid);mutate(bad.actions[0]);assert.equal(E.replay(bad,{deck:t.deck}).pass,false);}
 });
 await test('Fresh Droll replay rejects changed send cost, event witness and activation origin',()=>{
  const t=droll();step(t,'DROLL_LOCK',mechaba);const valid=replay(t),index=t.actions.length-1;
  for(const mutate of [a=>a.paid.find(p=>p.uid===a.sourceUid).kind='DISCARD',a=>a.proof.activationOrigin.restriction='USE',a=>a.eventIndex+=1,a=>a.response.activationSourceCardId=I.CROW]){const bad=copy(valid);mutate(bad.actions[index]);assert.equal(E.replay(bad,{deck:t.deck}).pass,false);}
 });
 await test('Bounded search discovers the physical Mechaba-negated Crow branch and replays it',async()=>{
  const t=crow(0,{policy:'FIRST_ELIGIBLE'}),source=uid(t,0,'hand',I.CROW),target=uid(t,1,'gy',I.BEWD),r=await E.search(t.state,{maxDepth:1,maxStates:100,maxMs:1000,goal:s=>H.locate(s,source)?.zone==='gy'&&H.locate(s,target)?.zone==='gy'});
  assert(r.pass&&r.lines.length);assert(r.lines.some(l=>l.actions[0].response?.registeredMonsterPacket==='DD_CROW_BANISH'));assert(r.lines.every(l=>E.replay(l,{deck:t.deck}).pass));assert.equal(r.globalOptimalityProven,false);
 });

 const report={schema:'ygo-mechaba-quick-hand-tests/v1',pass:tests.every(t=>t.pass),total:tests.length,tests,
  limitations:['The actor-zero Droll regression uses an explicit test-only physical opponent-search provider; it does not claim mirrored product family routes.',
   'Repeat-use Droll regressions return the same UID through a marked test-only recovery provider. This is not a claimed TCG-legal combo or an implemented recovery effect. The actual snapshot and its one-copy Droll limit are unchanged.',
   'Droll has no per-turn use limit, but an old search window closes after resolving a packet; arbitrary same-chain Droll counter-responses remain outside scope.',
   'Registered hand effects, matching physical costs and bounded Mechaba/Roar chains only; no universal priority or competitive certification.']};
 fs.writeFileSync(path.join(ROOT,'tests/mechaba-quick-hand-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(!report.pass)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});

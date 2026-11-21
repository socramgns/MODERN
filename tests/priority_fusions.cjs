'use strict';
/* Physical priority Fusion histories and fresh replays. Declared starting
 * fields are assumptions. Explicitly QA-labelled adapters/mutations are
 * diagnostics, not production card implementations or legal-history claims. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict'),{harness,ROOT}=require('./combo_engine.cjs');
const copy=structuredClone,I={ALBAZ:68468459,LUBELLION:70534340,MIRRORJADE:44146295,DARK:46986414,FAITH:31560081,INVOCATION:74063034,REBORN:83764718,BRANDED:44362883,
 BEWD:89631139,IDOL:27125110,HAYABUSA:21015833,TWIN:74157028,ALEISTER:86120751,MST:5318639,
 MECHABA:75286621,ROAR:51339637,WOLF:87871125,CHIXIAO:69248256,MOYE:20001443,
 IMPERM:10045474,VEILER:97268402,CROW:24508238,ASH:14558127,DROLL:94145021,SPIRIT:59822133,SPARK:83994433};
(async()=>{
 const {W,E,fixture}=await harness(true),H=E.helpers,tests=[],witnesses=[];
 for(const name of ['duel-phases','responses','flip-effects','archetypes-expanded','blue-eyes-duel','monster-reborn','priority-chain','trigger-order','priority-fusions','priority-responses-expanded'])
  vm.runInNewContext(fs.readFileSync(path.join(ROOT,'src/app/'+name+'.js'),'utf8'),{window:W,structuredClone,console,Date,Promise,setTimeout,clearTimeout,performance});
 await Promise.resolve();
 const F=W.YGOFlipEffects,D=W.YGODuelPhases,id=x=>H.baseId(x);
 const fillers=[...new Set(fixture('Invoked').deck.main.filter(x=>![I.ALEISTER,I.INVOCATION].includes(Number(x.id))).map(x=>Number(x.id)).concat([I.IDOL,46986414,32012841,48305365,32452818]))];
 const isExtra=n=>!!(Number(W.YGODataCatalog.rulesCard(n).typeBits)&(0x40|0x2000|0x800000|0x4000000));
 const monster=(player,cardId,zoneIndex=0,extra={})=>({player,cardId,from:isExtra(cardId)?'extra':'deck',zone:'monster',zoneIndex,faceUp:true,position:'ATTACK',summonTurn:1,...extra});
 const down=(p,n=I.FAITH,slot=0,extra={})=>monster(p,n,slot,{faceUp:false,position:'SET',...extra});
 const gy=(player,cardId)=>({player,cardId,from:isExtra(cardId)?'extra':'deck',zone:'gy'});
 const trap=(player,n=I.ROAR,zoneIndex=0,setTurn=1)=>({player,cardId:n,from:'deck',zone:'spelltrap',zoneIndex,faceUp:false,setTurn});
 function deck(main=[],extra=[]){const counts=new Map(),extras=new Map();for(const n of main)counts.set(n,(counts.get(n)||0)+1);let size=main.length;
  for(const n of fillers){if(size>=40)break;if(counts.has(n))continue;const qty=Math.min(3,40-size);counts.set(n,qty);size+=qty;}assert.equal(size,40);
  for(const n of extra)extras.set(n,(extras.get(n)||0)+1);const d={main:[...counts].map(([id,qty])=>({id,qty})),extra:[...extras].map(([id,qty])=>({id,qty})),side:[]};
  assert.equal(W.YGODataCatalog.auditDeck(d,{format:'tcg',banlist:W.BANLIST_PROFILES.tcg.data}).pass,true);return d;}
 function hand(d,wanted,reserved){const avail=new Map(d.main.map(x=>[x.id,x.qty])),out=wanted.slice();for(const n of [...wanted,...reserved]){assert((avail.get(n)||0)>0,'Missing physical '+n);avail.set(n,avail.get(n)-1);}
  for(const n of fillers)while(out.length<5&&(avail.get(n)||0)>0){out.push(n);avail.set(n,avail.get(n)-1);}assert.equal(out.length,5);return out;}
 function remaining(d,h){const r=d.main.flatMap(x=>Array(x.qty).fill(x.id));for(const n of h){const at=r.indexOf(n);assert(at>=0);r.splice(at,1);}return r;}
 function make(o={}){const placements=copy(o.placements||[]),hands=o.hands||[[],[]],decks=[0,1].map(p=>deck([...placements.filter(x=>x.player===p&&x.from==='deck').map(x=>x.cardId),...hands[p],...(o.cards?.[p]||[])],[...placements.filter(x=>x.player===p&&x.from==='extra').map(x=>x.cardId),...(o.extra?.[p]||[])])),opened=decks.map((d,p)=>hand(d,hands[p],placements.filter(x=>x.player===p&&x.from==='deck').map(x=>x.cardId)));
  const spec={deck:decks[0],openingIds:opened[0],remainingDeckIds:remaining(decks[0],opened[0]),opponentDeck:decks[1],opponentOpeningIds:opened[1],opponentRemainingDeckIds:remaining(decks[1],opened[1]),setup:{turn:o.turn??2,activePlayer:o.activePlayer??0,phase:o.phase||'MAIN 1',placements,...(o.lp?{lp:o.lp}:{})},context:{format:'tcg',duelMode:true,manualBothPlayers:true,opponentPolicy:'RESPONSES_EXPLICIT',responseTypes:['MECHABA','ROAR','VEILER','IMPERM','SPIRIT','CHIXIAO','ASH'],priorityMode:true,triggerOrderMode:true,...(o.context||{})}},initial=E.createState(spec);
  return{spec,deck:decks[0],initial:copy(initial),state:initial,actions:[]};}
 const uid=(t,p,z,n)=>t.state.zones[p][z].find(x=>id(x)===n)?.uid,locate=(t,u)=>H.locate(t.state,u),pass=a=>!a.response&&!a.responseUid;
 const options=(t,type)=>E.enumerate(t.state).filter(a=>a.type===type);
 function step(t,type,pred=pass){const a=options(t,type).find(pred);assert(a,'Missing '+type+'; '+JSON.stringify(E.enumerate(t.state).map(x=>({type:x.type,player:x.player,sourceUid:x.sourceUid,response:x.response?.type,targetUid:x.targetUid}))));const before=JSON.stringify(t.state),inv=H.inventory(t.state),r=E.execute(t.state,a);assert.equal(r.pass,true,JSON.stringify(r));assert.equal(JSON.stringify(t.state),before,'Input state mutated');assert.equal(H.inventory(r.after),inv);t.state=r.after;t.actions.push(r.action);return r;}
 function reject(t,a){const before=JSON.stringify(t.state),r=E.execute(t.state,a);assert.equal(r.pass,false,JSON.stringify(r));assert.equal(JSON.stringify(t.state),before);return r;}
 function replay(t){const line={before:copy(t.initial),after:copy(t.state),state:copy(t.state),actions:copy(t.actions),context:copy(t.initial.context),deckFingerprint:E.deckFingerprint(t.deck)};const result=E.replay(line,{deck:t.deck});assert.equal(result.pass,true,JSON.stringify(result));witnesses.push({steps:t.actions.length,types:t.actions.map(x=>x.type),replayPass:true});return line;}
 const P=W.YGOPriorityChain;
 const spark=(p=0)=>make({activePlayer:p,placements:[monster(p,I.SPARK)]});
 const activate=(t,effectId,pred=()=>true)=>step(t,'PRIORITY_ACTIVATE',a=>a.effectId===effectId&&pred(a));
 const passPriority=t=>step(t,'PRIORITY_PASS');
 const seal=t=>{passPriority(t);passPriority(t);};
 const resolveOne=t=>step(t,'PRIORITY_RESOLVE');
 const finish=t=>{let guard=0;while(t.state.duel?.priorityChain&&guard++<50){if(P.resolvePending(t.state))resolveOne(t);else passPriority(t);}assert(guard<50);};
 async function test(name,fn){try{await fn();tests.push({name,pass:true});}catch(error){tests.push({name,pass:false,error:error.stack});}}

 const invocation=(p=0,o={})=>{const hands=[[],[]],extra=[[],[]];hands[p]=[I.INVOCATION,I.ALEISTER,I.VEILER];extra[p]=[I.MECHABA];return make({activePlayer:p,hands,extra,...o});};
 const branded=(p=0,o={})=>{const hands=[[],[]],cards=[[],[]],extra=[[],[]];hands[p]=[I.BRANDED];cards[p]=[I.ALBAZ,I.DARK];extra[p]=[I.LUBELLION,I.MIRRORJADE];return make({activePlayer:p,hands,cards,extra,...o});};
 const triggerDecline=t=>{if(t.state.duel?.triggerOrder)step(t,'TRIGGER_ORDER_DECLINE');finish(t);};
 const fusionResolve=(t,pred=()=>true)=>step(t,'PRIORITY_RESOLVE',a=>!!a.resolutionChoice.fusionUid&&pred(a.resolutionChoice));
 const ownBudget=(name,p)=>p===0?name:name+':'+p;
 W.YGOPriorityFusions.registerInvocationRecipe({cardId:I.LUBELLION,materialCardIds:[I.ALBAZ,I.DARK],note:'Bounded exact own-hand Albaz plus DARK Normal recipe used to witness Lubellion without a Branded whole-turn lock.'});
 for(const p of [0,1])await test('Invocation separates zero-cost non-targeting activation from physical material choice and Fusion resolution for player '+p,()=>{
  const t=invocation(p),source=uid(t,p,'hand',I.INVOCATION),al=uid(t,p,'hand',I.ALEISTER),light=uid(t,p,'hand',I.VEILER),fusion=uid(t,p,'extra',I.MECHABA);
  const r=activate(t,'INVOCATION_MECHABA');assert.equal(r.action.paid.length,0);assert.equal(r.action.materialUids,undefined);assert.equal(r.action.fusionUid,undefined);assert.equal(locate(t,source).zone,'spelltrap');assert.equal(locate(t,al).zone,'hand');assert.equal(locate(t,fusion).zone,'extra');
  assert(!r.action.events.some(e=>e.type==='TARGET'));seal(t);const resolved=fusionResolve(t,a=>a.materialUids.includes(al)&&a.materialUids.includes(light));assert(resolved.action.paid.every(x=>x.kind==='FUSION_MATERIAL'));assert.equal(locate(t,al).zone,'gy');assert.equal(locate(t,light).zone,'gy');assert.equal(locate(t,fusion).item.properSummonType,'FUSION');assert.equal(locate(t,fusion).player,p);finish(t);assert.equal(locate(t,source).zone,'gy');replay(t);
 });
 for(const p of [0,1])await test('Invocation banishes an actual opposing GY LIGHT and preserves its owner for player '+p,()=>{
  const hands=[[],[]],extra=[[],[]];hands[p]=[I.INVOCATION,I.ALEISTER];extra[p]=[I.MECHABA];const t=make({activePlayer:p,hands,extra,placements:[gy(1-p,I.BEWD)]}),light=uid(t,1-p,'gy',I.BEWD);
  activate(t,'INVOCATION_MECHABA');seal(t);fusionResolve(t,a=>a.materialUids.includes(light));finish(t);assert.equal(locate(t,light).zone,'banished');assert.equal(locate(t,light).player,1-p);assert.equal(locate(t,light).item.ownerPlayer,1-p);replay(t);
 });
 await test('Crow removes the available GY LIGHT before Invocation chooses materials; a different current physical LIGHT may be chosen',()=>{
  const t=invocation(0,{hands:[[I.INVOCATION,I.ALEISTER,I.VEILER],[I.CROW]],placements:[gy(0,I.BEWD)]}),removed=uid(t,0,'gy',I.BEWD),replacement=uid(t,0,'hand',I.VEILER);
  activate(t,'INVOCATION_MECHABA');activate(t,'DD_CROW_BANISH',a=>a.targetUid===removed);seal(t);resolveOne(t);assert.equal(locate(t,removed).zone,'banished');assert(options(t,'PRIORITY_RESOLVE').every(a=>!a.resolutionChoice.materialUids?.includes(removed)));fusionResolve(t,a=>a.materialUids.includes(replacement));finish(t);replay(t);
 });
 await test('Invocation resolves without moving a material if Crow removes its only legal LIGHT',()=>{
  const t=invocation(0,{hands:[[I.INVOCATION,I.ALEISTER],[I.CROW]],placements:[gy(0,I.BEWD)]}),material=uid(t,0,'gy',I.BEWD),al=uid(t,0,'hand',I.ALEISTER);
  activate(t,'INVOCATION_MECHABA');activate(t,'DD_CROW_BANISH',a=>a.targetUid===material);finish(t);assert.equal(locate(t,al).zone,'hand');assert.equal(t.state.zones[0].monster.length,0);assert(t.actions.some(a=>a.events.some(e=>e.type==='PRIORITY_FUSION_NO_LEGAL_MATERIALS')));replay(t);
 });
 for(const p of [0,1])await test('Mechaba negates Invocation activation, preserves its real Spell discard, and never pays Fusion materials for player '+p,()=>{
  const hands=[[],[]],extra=[[],[]];hands[p]=[I.INVOCATION,I.ALEISTER,I.VEILER];hands[1-p]=[I.BRANDED];extra[p]=[I.MECHABA];const t=make({activePlayer:p,hands,extra,placements:[monster(1-p,I.MECHABA)]}),source=uid(t,p,'hand',I.INVOCATION),al=uid(t,p,'hand',I.ALEISTER),cost=uid(t,1-p,'hand',I.BRANDED);
  activate(t,'INVOCATION_MECHABA');activate(t,'MECHABA_NEGATE',a=>a.costUid===cost);assert.equal(locate(t,cost).zone,'gy');finish(t);assert.equal(locate(t,source).zone,'banished');assert.equal(locate(t,al).zone,'hand');assert(!t.actions.flatMap(a=>a.paid).some(x=>x.kind==='FUSION_MATERIAL'));replay(t);
 });
 for(const p of [0,1])await test('Branded Fusion selects own physical Deck materials at resolution, then offers separate Lubellion trigger for player '+p,()=>{
  const t=branded(p),al=uid(t,p,'deck',I.ALBAZ),dark=uid(t,p,'deck',I.DARK),source=uid(t,p,'hand',I.BRANDED),fusion=uid(t,p,'extra',I.LUBELLION);
  activate(t,'BRANDED_FUSION_LUBELLION');assert.equal(locate(t,al).zone,'deck');assert.equal(locate(t,dark).zone,'deck');assert.equal(t.state.used[ownBudget('BRANDED_FUSION_ACTIVATED',p)],true);seal(t);fusionResolve(t,a=>a.materialUids.includes(al)&&a.materialUids.includes(dark));assert.equal(locate(t,fusion).item.properSummonType,'FUSION');assert.equal(t.state.deckOrderKnown[p],false);assert.equal(locate(t,source).zone,'gy');assert(t.state.duel.triggerOrder,JSON.stringify({pending:t.state.pendingTriggers,events:t.state.events.slice(-8),hand:t.state.zones[p].hand}));assert(t.state.duel.triggerOrder.entries.some(e=>e.kind==='LUBELLION_FUSION'&&e.player===p));triggerDecline(t);replay(t);
 });
 for(const p of [0,1])await test('Ash negates Branded effect while ACTIVATE budget and whole-turn Fusion restriction survive for player '+p,()=>{
  const hands=[[],[]];hands[p]=[I.BRANDED];hands[1-p]=[I.ASH];const t=branded(p,{hands}),al=uid(t,p,'deck',I.ALBAZ),ash=uid(t,1-p,'hand',I.ASH);
  activate(t,'BRANDED_FUSION_LUBELLION');activate(t,'ASH_BLOSSOM');assert.equal(locate(t,ash).zone,'gy');finish(t);assert.equal(locate(t,al).zone,'deck');assert.equal(t.state.used[ownBudget('BRANDED_FUSION_ACTIVATED',p)],true);assert(t.state.locks.some(x=>x.priorityFusionRestriction==='BRANDED'&&x.appliesToPlayer===p));assert(!options(t,'PRIORITY_ACTIVATE').some(a=>a.effectId==='BRANDED_FUSION_LUBELLION'));replay(t);
 });
 for(const p of [0,1])await test('Branded activation negation releases its ACTIVATE budget and lock, permitting the same legal one-copy Spell after real Faith recovery for player '+p,()=>{
  const t=branded(p,{placements:[down(p,I.FAITH),monster(1-p,I.WOLF,5),trap(1-p,I.ROAR)]}),source=uid(t,p,'hand',I.BRANDED),faith=uid(t,p,'monster',I.FAITH);activate(t,'BRANDED_FUSION_LUBELLION');activate(t,'SALAMANGREAT_ROAR');seal(t);resolveOne(t);assert.equal(t.state.used[ownBudget('BRANDED_FUSION_ACTIVATED',p)],undefined);assert(!t.state.locks.some(x=>x.priorityFusionRestriction==='BRANDED'));resolveOne(t);finish(t);assert.equal(locate(t,source).zone,'gy');step(t,'DUEL_FLIP_SUMMON',a=>a.sourceUid===faith);step(t,'TRIGGER_ORDER_ACTIVATE',a=>a.targetUid===source);finish(t);assert.equal(locate(t,source).zone,'hand');assert(options(t,'PRIORITY_ACTIVATE').some(a=>a.effectId==='BRANDED_FUSION_LUBELLION'));activate(t,'BRANDED_FUSION_LUBELLION');finish(t);triggerDecline(t);replay(t);
 });
 for(const p of [0,1])await test('Lubellion discards at separate trigger activation and chooses physical shuffle materials at resolution for player '+p,()=>{
  const hands=[[],[]];hands[p]=[I.BRANDED,I.VEILER];const t=branded(p,{hands}),cost=uid(t,p,'hand',I.VEILER),mirror=uid(t,p,'extra',I.MIRRORJADE);activate(t,'BRANDED_FUSION_LUBELLION');finish(t);const lub=uid(t,p,'monster',I.LUBELLION);step(t,'TRIGGER_ORDER_ACTIVATE',a=>a.discardUid===cost);assert.equal(locate(t,cost).zone,'gy');assert.equal(locate(t,lub).zone,'monster');assert.equal(locate(t,mirror).zone,'extra');assert.equal(t.actions.at(-1).materialUids,undefined);seal(t);fusionResolve(t,a=>a.materialUids.includes(lub));finish(t);assert.equal(locate(t,lub).zone,'extra');assert.equal(locate(t,mirror).item.properSummonType,'FUSION');assert.equal(t.state.used[ownBudget('LUBELLION_FUSION',p)],true);replay(t);
 });
 for(const p of [0,1])await test('Lubellion activation negation retains real discard and named USE while preserving the older Branded lock for player '+p,()=>{
  const hands=[[],[]];hands[p]=[I.BRANDED,I.VEILER];const t=branded(p,{hands,placements:[monster(1-p,I.WOLF,5),trap(1-p,I.ROAR)]}),cost=uid(t,p,'hand',I.VEILER),mirror=uid(t,p,'extra',I.MIRRORJADE);activate(t,'BRANDED_FUSION_LUBELLION');finish(t);const source=uid(t,p,'monster',I.LUBELLION);step(t,'TRIGGER_ORDER_ACTIVATE',a=>a.discardUid===cost);assert.equal(locate(t,source).item.cannotAttackTurn,undefined);assert(!t.state.locks.some(x=>x.priorityFusionRestriction==='LUBELLION'));activate(t,'SALAMANGREAT_ROAR');finish(t);assert.equal(locate(t,cost).zone,'gy');assert.equal(locate(t,mirror).zone,'extra');assert.equal(t.state.used[ownBudget('LUBELLION_FUSION',p)],true);assert(t.state.locks.some(x=>x.priorityFusionRestriction==='BRANDED'&&x.appliesToPlayer===p));assert(!t.state.locks.some(x=>x.priorityFusionRestriction==='LUBELLION'));replay(t);
 });
 for(const p of [0,1])await test('Negating Lubellion effect creates no rest-of-turn restrictions, while discard and named USE remain for player '+p,()=>{
  const hands=[[],[]];hands[p]=[I.BRANDED,I.VEILER];hands[1-p]=[I.VEILER];const t=branded(p,{hands}),cost=uid(t,p,'hand',I.VEILER);activate(t,'BRANDED_FUSION_LUBELLION');finish(t);const source=uid(t,p,'monster',I.LUBELLION);step(t,'TRIGGER_ORDER_ACTIVATE',a=>a.discardUid===cost);activate(t,'EFFECT_VEILER',a=>a.targetUid===source);finish(t);assert.equal(locate(t,cost).zone,'gy');assert.equal(locate(t,source).item.effectsNegated,true);assert.equal(locate(t,source).item.cannotAttackTurn,undefined);assert.equal(t.state.used[ownBudget('LUBELLION_FUSION',p)],true);assert(!t.state.locks.some(x=>x.priorityFusionRestriction==='LUBELLION'));replay(t);
 });
 for(const p of [0,1])await test('Unnegated Lubellion resolution applies rest-of-turn restrictions even when Compulsory removes its only Extra material for player '+p,()=>{
  const hands=[[],[]];hands[p]=[I.BRANDED,I.VEILER];const t=branded(p,{hands,placements:[trap(1-p,94192409)]}),cost=uid(t,p,'hand',I.VEILER);activate(t,'BRANDED_FUSION_LUBELLION');finish(t);const source=uid(t,p,'monster',I.LUBELLION);step(t,'TRIGGER_ORDER_ACTIVATE',a=>a.discardUid===cost);activate(t,'ACTIVATE_COMPULSORY_EVACUATION_DEVICE',a=>a.targetUid===source);finish(t);assert.equal(locate(t,source).zone,'extra');assert.equal(locate(t,cost).zone,'gy');assert(t.state.locks.some(x=>x.priorityFusionRestriction==='LUBELLION'&&x.restrictionPeriod==='REST_OF_THIS_TURN'&&x.appliedAt==='RESOLUTION'));assert(uid(t,p,'extra',I.MIRRORJADE));assert(t.actions.some(a=>a.events.some(e=>e.type==='PRIORITY_FUSION_NO_LEGAL_MATERIALS')));replay(t);
 });
 await test('An actual prior Link Summon does not prohibit Lubellion trigger activation after Invocation Fusion Summons it',()=>{
  const t=make({hands:[[I.INVOCATION,I.ALBAZ,I.DARK,I.VEILER],[]],placements:[monster(0,I.ALEISTER)],extra:[[34755994,I.LUBELLION,I.MIRRORJADE],[]]}),cost=uid(t,0,'hand',I.VEILER);step(t,'LINK_ARTEMIS');finish(t);activate(t,'INVOCATION_MECHABA');seal(t);fusionResolve(t,a=>id(locate(t,a.fusionUid).item)===I.LUBELLION);assert(t.state.duel.priorityExtraSummons.some(x=>x.kind==='LINK'));assert(options(t,'TRIGGER_ORDER_ACTIVATE').some(a=>a.discardUid===cost));step(t,'TRIGGER_ORDER_ACTIVATE',a=>a.discardUid===cost);finish(t);assert(uid(t,0,'monster',I.MIRRORJADE));assert(t.state.locks.some(x=>x.priorityFusionRestriction==='LUBELLION'));replay(t);
 });
 await test('A prior attack by the same physical Lubellion does not prohibit its fresh Fusion Summon trigger in Main Phase 2',()=>{
  const t=make({hands:[[I.INVOCATION,I.ALBAZ,I.DARK,I.VEILER],[]],placements:[monster(0,I.LUBELLION),trap(0,94192409)],extra:[[I.MIRRORJADE],[]]}),source=uid(t,0,'monster',I.LUBELLION),cost=uid(t,0,'hand',I.VEILER);seal(t);step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='BATTLE');finish(t);step(t,'DUEL_ATTACK',a=>a.attackerUid===source);finish(t);seal(t);step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='MAIN 2');finish(t);activate(t,'ACTIVATE_COMPULSORY_EVACUATION_DEVICE',a=>a.targetUid===source);finish(t);activate(t,'INVOCATION_MECHABA');seal(t);fusionResolve(t,a=>a.fusionUid===source);assert(options(t,'TRIGGER_ORDER_ACTIVATE').some(a=>a.discardUid===cost));step(t,'TRIGGER_ORDER_ACTIVATE',a=>a.discardUid===cost);finish(t);assert(uid(t,0,'monster',I.MIRRORJADE));replay(t);
 });
 for(const p of [0,1])await test('Invocation recycle fixes banished Aleister target, has no shuffle cost, and performs the shuffle before adding for player '+p,()=>{
  const t=make({activePlayer:p,placements:[gy(p,I.INVOCATION),{player:p,cardId:I.ALEISTER,from:'deck',zone:'banished'}]}),source=uid(t,p,'gy',I.INVOCATION),target=uid(t,p,'banished',I.ALEISTER);const r=activate(t,'INVOCATION_RECYCLE');assert.equal(r.action.paid.length,0);assert.equal(locate(t,source).zone,'gy');assert.equal(locate(t,target).zone,'banished');finish(t);assert.equal(locate(t,source).zone,'deck');assert.equal(locate(t,target).zone,'hand');assert.equal(t.state.deckOrderKnown[p],false);assert.equal(t.state.used[ownBudget('INVOCATION_RECYCLE',p)],true);replay(t);
 });
 await test('Real Crow removes the recycle source and its discarded copy remains spent; Aleister stays banished',()=>{
  const t=make({hands:[[],[I.CROW]],placements:[gy(0,I.INVOCATION),{player:0,cardId:I.ALEISTER,from:'deck',zone:'banished'}]}),source=uid(t,0,'gy',I.INVOCATION),target=uid(t,0,'banished',I.ALEISTER),crow=uid(t,1,'hand',I.CROW);activate(t,'INVOCATION_RECYCLE');activate(t,'DD_CROW_BANISH',a=>a.targetUid===source);finish(t);assert.equal(locate(t,source).zone,'banished');assert.equal(locate(t,target).zone,'banished');assert.equal(locate(t,crow).zone,'gy');assert.equal(t.state.used.INVOCATION_RECYCLE,true);replay(t);
 });
 await test('Spirit negates recycle GY activation without refunding named USE or moving Aleister',()=>{
  const t=make({placements:[gy(0,I.INVOCATION),{player:0,cardId:I.ALEISTER,from:'deck',zone:'banished'},monster(1,I.SPIRIT)]}),target=uid(t,0,'banished',I.ALEISTER);activate(t,'INVOCATION_RECYCLE');activate(t,'SPIRIT_GY_NEGATE');finish(t);assert.equal(locate(t,target).zone,'banished');assert.equal(t.state.used.INVOCATION_RECYCLE,true);assert(!options(t,'PRIORITY_ACTIVATE').some(a=>a.effectId==='INVOCATION_RECYCLE'));replay(t);
 });
 for(const p of [0,1])await test('Mechaba cannot respond to the activated GY Spell effect of Invocation recycle for player '+p,()=>{
  const hands=[[],[]];hands[1-p]=[I.BRANDED];const t=make({activePlayer:p,hands,placements:[gy(p,I.INVOCATION),{player:p,cardId:I.ALEISTER,from:'deck',zone:'banished'},monster(1-p,I.MECHABA)]});activate(t,'INVOCATION_RECYCLE');assert(!options(t,'PRIORITY_ACTIVATE').some(a=>a.effectId==='MECHABA_NEGATE'));finish(t);assert(uid(t,p,'hand',I.ALEISTER));replay(t);
 });
 await test('QA: a target leaving and returning is a different physical relation; Invocation still shuffles itself',()=>{
  const t=make({placements:[gy(0,I.INVOCATION),{player:0,cardId:I.ALEISTER,from:'deck',zone:'banished'}]}),source=uid(t,0,'gy',I.INVOCATION),target=uid(t,0,'banished',I.ALEISTER);activate(t,'INVOCATION_RECYCLE');H.move(t.state,target,'gy');H.move(t.state,target,'banished');finish(t);assert.equal(locate(t,source).zone,'deck');assert.equal(locate(t,target).zone,'banished');
 });
 await test('QA: source Spell leaving before an unnegated Fusion link resolves does not prevent Fusion',()=>{
  const t=invocation(),source=uid(t,0,'hand',I.INVOCATION);activate(t,'INVOCATION_MECHABA');H.move(t.state,source,'gy');finish(t);assert(uid(t,0,'monster',I.MECHABA));assert.equal(locate(t,source).zone,'gy');
 });
 await test('Only reviewed material profiles are offered; attachments and redirects exclude a physical candidate (QA fields)',()=>{
  const t=invocation(),light=uid(t,0,'hand',I.VEILER);for(const change of [{attachments:['unknown']},{leaveFieldRedirect:'banished'},{cannotBeFusionMaterial:true}]){const bad={...t,state:copy(t.state)};Object.assign(locate(bad,light).item,change);assert(!options(bad,'PRIORITY_ACTIVATE').some(a=>a.effectId==='INVOCATION_MECHABA'));}
 });
 await test('Fusion resolution controls and physical evidence are freshly replayed and forged material payment is rejected',()=>{
  const t=invocation();activate(t,'INVOCATION_MECHABA');seal(t);const valid=options(t,'PRIORITY_RESOLVE')[0];for(const changes of [{fusionUid:'invented'},{materialUids:['invented','invented']},{destination:5},{position:'SET'}])reject(t,{...valid,resolutionChoice:{...valid.resolutionChoice,...changes}});fusionResolve(t);finish(t);const line=replay(t);for(const mutate of [x=>x.actions.find(a=>a.type==='PRIORITY_RESOLVE').paid=[],x=>x.actions.find(a=>a.type==='PRIORITY_RESOLVE').resolutionChoice.materialUids[0]='invented',x=>x.after.zones[0].monster[0].properSummonType='LINK',x=>x.after.duel.priorityExtraSummons=[]]){const bad=copy(line);mutate(bad);assert.equal(E.replay(bad,{deck:t.deck}).pass,false);}
 });
 await test('Fusion adapters leave legacy atomic Invocation and Branded handlers available outside priority mode',()=>{
  assert(options(invocation(0,{context:{priorityMode:false,triggerOrderMode:false}}),'INVOCATION_MECHABA').length);assert(options(branded(0,{context:{priorityMode:false,triggerOrderMode:false}}),'BRANDED_FUSION_LUBELLION').length);
 });
 for(const p of [0,1])await test('Branded effect-negation restriction lasts through End Phase and expires with the actual turn for player '+p,()=>{
  const hands=[[],[]];hands[p]=[I.BRANDED];hands[1-p]=[I.ASH];const t=branded(p,{hands});activate(t,'BRANDED_FUSION_LUBELLION');activate(t,'ASH_BLOSSOM');finish(t);seal(t);step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='END');finish(t);assert(t.state.locks.some(x=>x.priorityFusionRestriction==='BRANDED'&&x.appliesToPlayer===p));seal(t);step(t,'DUEL_NEXT_TURN');assert.equal(t.state.turn,3);assert(!t.state.locks.some(x=>x.priorityFusionRestriction));assert.equal(t.state.used[ownBudget('BRANDED_FUSION_ACTIVATED',p)],undefined);assert.equal(t.state.duel.priorityExtraSummons.length,0);replay(t);
 });
 await test('An actual prior Link Summon prevents Branded activation for the rest of that turn',()=>{
  const t=branded(0,{placements:[monster(0,I.ALEISTER)],extra:[[34755994,I.LUBELLION,I.MIRRORJADE],[]]});assert(options(t,'PRIORITY_PASS').length,'A declared own monster preserves ordinary enumeration');step(t,'LINK_ARTEMIS');finish(t);assert(t.state.duel.priorityExtraSummons.some(x=>x.player===0&&x.kind==='LINK'));assert(!options(t,'PRIORITY_ACTIVATE').some(a=>a.effectId==='BRANDED_FUSION_LUBELLION'));replay(t);
 });
 await test('QA: Branded activation negation cannot remove an older lock from another link',()=>{
  const t=branded(0,{hands:[[I.BRANDED],[I.INVOCATION]],placements:[monster(1,I.MECHABA)]});t.state.locks.push({kind:'FUSION_ONLY',wholeTurn:true,appliesToPlayer:0,untilTurn:2,priorityFusionRestriction:'LUBELLION',priorityLinkId:'older-link'});activate(t,'BRANDED_FUSION_LUBELLION');activate(t,'MECHABA_NEGATE');finish(t);assert(t.state.locks.some(x=>x.priorityLinkId==='older-link'));assert(!t.state.locks.some(x=>x.priorityFusionRestriction==='BRANDED'));
 });
 await test('QA: Fusion cannot invent a replacement Extra copy if the physical Extra target leaves before resolution',()=>{
  const t=invocation(),target=uid(t,0,'extra',I.MECHABA),al=uid(t,0,'hand',I.ALEISTER);activate(t,'INVOCATION_MECHABA');H.move(t.state,target,'gy');finish(t);assert.equal(locate(t,al).zone,'hand');assert.equal(locate(t,target).zone,'gy');assert.equal(t.state.zones[0].monster.length,0);
 });
 await test('QA: unnegated Lubellion still restricts its remaining field source and future Extra summons if Albaz becomes unavailable',()=>{
  const t=branded(0,{hands:[[I.BRANDED,I.VEILER],[]]}),cost=uid(t,0,'hand',I.VEILER);activate(t,'BRANDED_FUSION_LUBELLION');finish(t);const source=uid(t,0,'monster',I.LUBELLION),al=uid(t,0,'gy',I.ALBAZ);step(t,'TRIGGER_ORDER_ACTIVATE',a=>a.discardUid===cost);H.move(t.state,al,'hand');finish(t);assert.equal(locate(t,source).zone,'monster');assert.equal(locate(t,source).item.cannotAttackTurn,2);assert(t.state.locks.some(x=>x.priorityFusionRestriction==='LUBELLION'));assert(uid(t,0,'extra',I.MIRRORJADE));
 });
 const report={schema:'ygo-priority-fusions-tests/v1',pass:tests.every(x=>x.pass),total:tests.length,tests,witnesses,capabilities:W.YGOPriorityFusions.capabilities(),limitations:['Declared starting fields are assumptions; QA-labelled helper moves are diagnostics.','Exact existing Mechaba, Lubellion and Mirrorjade routes; no arbitrary Fusion recipe, substitute, unknown material trigger or card-text evaluation.']};
 fs.writeFileSync(path.join(ROOT,'tests/priority-fusions-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(!report.pass)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});

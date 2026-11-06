'use strict';
/* Spirit revival regressions over physical decks and the pinned catalogue.
 * Actual Link, tribute or battle, and revival establish witnessed history.
 * Diagnostic state mutations are named QA-only and are never certified lines. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const {harness,ROOT}=require('./combo_engine.cjs');
const copy=structuredClone,TYPE='ACTIVATE_MONSTER_REBORN';
const I={REBORN:83764718,CED:94192409,IMPERM:10045474,MECHABA:75286621,
 SPIRIT:59822133,ROAR:51339637,WOLF:87871125,BEWD:89631139,SAGE:8240199,VEILER:97268402,
 ALEISTER:86120751,INVOCATION:74063034,ARTEMIS:34755994,MOYE:20001443,
 LONGYUAN:93490856,CHIXIAO:69248256,ASHUNA:87052196,ADHARA:98159737,MONK:32519092,
 SHTHANA:24557335,BRANDED_FUSION:44362883,ALBAZ:68468459,DARK_MAGICIAN:46986414,
 LUBELLION:70534340,MIRRORJADE:44146295,ASH:14558127,GAZELLE:26889158,
 UNKNOWN:38033121,XYZ:16195942,PENDULUM:70026064,SPIRIT_LINK:42097666,GUARD:21615956,MAUSOLEUM:24382602,FISH:23771716,ANCIENTS:71039903,SPARK:83994433,AZURE:40908371,SPINNY:52277807,BALELYNX:14812471,SHAMAN:78917791};

(async()=>{
 const {W,E,fixture}=await harness(true),H=E.helpers,tests=[];
 for(const module of ['duel-phases','responses','archetypes-expanded','blue-eyes-duel','monster-reborn','stardust-synchro','azure-synchro'])
  vm.runInNewContext(fs.readFileSync(path.join(ROOT,'src/app/'+module+'.js'),'utf8'),
   {window:W,structuredClone,console,Date,Promise,setTimeout,clearTimeout,performance});
 await Promise.resolve();
 const id=x=>H.baseId(x),fillers=[...new Set(fixture('Invoked').deck.main
  .filter(row=>![I.ALEISTER,I.INVOCATION,I.REBORN].includes(row.id)).map(row=>row.id)
  .concat([63749102,74367458,48305365,32452818,23771716]))];
 function deck(cards=[],extras=[]){
  const counts=new Map(),ex=new Map();for(const n of cards)counts.set(n,(counts.get(n)||0)+1);
  let size=cards.length;for(const n of fillers){if(size>=40)break;if(counts.has(n))continue;
   const qty=Math.min(3,40-size);counts.set(n,qty);size+=qty;}
  assert.equal(size,40);for(const n of extras)ex.set(n,(ex.get(n)||0)+1);
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
 const set=(player,cardId,zoneIndex=0,setTurn=1)=>({player,cardId,zone:'spelltrap',from:'deck',faceUp:false,zoneIndex,setTurn});
 const gy=(player,cardId,other={})=>({player,cardId,zone:'gy',from:extra(cardId)?'extra':'deck',...other});
 function make(o={}){
  const placements=copy(o.placements||[]),wanted=[[I.REBORN,...(o.hands?.[0]||[])],[...(o.hands?.[1]||[])]];
  if(o.target===true)placements.push(gy(o.targetPlayer??0,o.targetId??I.BEWD,o.targetProperties||{}));
  if(o.mechaba){placements.push(monster(1,I.MECHABA,0));wanted[1].push(o.cost??I.INVOCATION);}
  if(o.ownRoar)placements.push(monster(0,I.WOLF,5),set(0,I.ROAR,0));
  if(o.opponentRoar)placements.push(monster(1,I.WOLF,5),set(1,I.ROAR,4));
  const decks=[0,1].map(player=>deck([
   ...placements.filter(row=>row.player===player&&row.from==='deck').map(row=>row.cardId),
   ...wanted[player],...(o.cards?.[player]||[])],
   [...placements.filter(row=>row.player===player&&row.from==='extra').map(row=>row.cardId),...(player===0?[I.SPIRIT_LINK]:[]),...(o.extra?.[player]||[])]));
  const hands=decks.map((d,player)=>opening(d,wanted[player],placements.filter(row=>row.player===player&&row.from==='deck').map(row=>row.cardId)));
  const types=o.responseTypes||(o.mechaba||o.opponentRoar?['MECHABA','ROAR']:[]);
  const spec={deck:decks[0],openingIds:hands[0],remainingDeckIds:remaining(decks[0],hands[0]),
   opponentDeck:decks[1],opponentOpeningIds:hands[1],opponentRemainingDeckIds:remaining(decks[1],hands[1]),
   context:{format:'tcg',duelMode:true,manualBothPlayers:true,opponentPolicy:types.length?'RESPONSES_EXPLICIT':'PASS',responseTypes:types,responsePolicy:'CHOICE_BRANCHES',...(o.context||{})},
   setup:{turn:o.turn??2,activePlayer:o.activePlayer??0,phase:o.phase||'MAIN 1',placements}};
  const initial=E.createState(spec);return{deck:decks[0],spec,initial,state:copy(initial),actions:[]};
 }
 const cards=(t,p,z,n)=>t.state.zones[p][z].filter(x=>id(x)===n);
 const uid=(t,p,z,n)=>cards(t,p,z,n)[0]?.uid;
 const locate=(t,u)=>H.locate(t.state,u);
 const pass=a=>!a.response&&!a.responseUid;
 const options=t=>E.enumerate(t.state).filter(a=>a.type===TYPE);
 function step(t,type=TYPE,pred=pass){const action=E.enumerate(t.state).find(a=>a.type===type&&pred(a));
  assert(action,'Missing '+type+': '+JSON.stringify(E.enumerate(t.state).map(a=>({type:a.type,targetUid:a.targetUid,destination:a.destination,position:a.position,response:a.response?.type,counters:a.counterResponses?.length,triggerKind:a.triggerKind}))));
  const before=JSON.stringify(t.state),inventory=H.inventory(t.state),result=E.execute(t.state,action);
  assert.equal(result.pass,true,JSON.stringify(result));assert.equal(JSON.stringify(t.state),before,'Input changed');
  assert.equal(H.inventory(result.after),inventory,'Physical inventory changed');t.state=result.after;t.actions.push(result.action);return result;
 }
 function replay(t){const line={before:copy(t.initial),after:copy(t.state),state:copy(t.state),actions:copy(t.actions),
  context:copy(t.initial.context),deckFingerprint:E.deckFingerprint(t.deck),scope:E.version,certified:false,globalOptimalityProven:false};
  const result=E.replay(line,{deck:t.deck});assert.equal(result.pass,true,JSON.stringify(result));return line;
 }
 function packet(r,source,target){const p=r.action.proof.normalSpellActivation;assert(p);
  assert.equal(p.kind,'NORMAL_SPELL_CARD_ACTIVATION');assert.equal(p.sourceUid,source);assert.equal(p.cardId,I.REBORN);
  assert.equal(p.player,0);assert.equal(p.originZone,'hand');assert.equal(p.activationZone,'spelltrap');
  assert.equal(p.column,r.action.proof.activationColumn);assert.equal(r.action.targetUid,target);
  assert.equal(r.action.proof.activationOrigin.zone,'hand');assert.equal(r.action.proof.activationOrigin.cardActivation,'NORMAL_SPELL');
  assert.equal(r.action.proof.activationOrigin.restriction,'NONE');assert.equal(r.action.proof.normalTrapActivation,null);assert.equal(r.action.proof.fieldSpellActivation,null);
  assert(r.action.events.some(e=>e.type==='NORMAL_SPELL_CARD_ACTIVATION'&&e.sourceUid===source));return p;
 }
 const select=(target,destination=0,position='ATTACK',predicate=pass)=>a=>a.targetUid===target&&a.destination===destination&&a.position===position&&predicate(a);
 function battleToGY(t,target){const rival=uid(t,1,'monster',I.BEWD);assert(rival);
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='BATTLE');step(t,'DUEL_ATTACK',a=>a.attackerUid===target&&a.targetUid===rival&&pass(a));
  assert.equal(locate(t,target).zone,'gy');step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='MAIN 2');
 }
 function decline(t){let guard=0;while(t.state.pendingTriggers.length){assert(guard++<8);step(t,'DECLINE_OPTIONAL_TRIGGER',()=>true);}}
 function invoked(){const t=make({target:false,hands:[[I.ALEISTER],[]],cards:[[I.INVOCATION],[]],extra:[[I.ARTEMIS,I.MECHABA],[]],placements:[monster(1,I.BEWD,2)]});
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.ALEISTER)&&pass(a));step(t,'ALEISTER_SEARCH',pass);
  assert.equal(t.state.deckOrderKnown[0],false);step(t,'LINK_ARTEMIS',pass);step(t,'INVOCATION_MECHABA',pass);return t;
 }
 async function test(name,fn){try{await fn();tests.push({name,pass:true});}catch(error){tests.push({name,pass:false,error:error.stack});}}

 function tributeRoute(o={}){
  const t=make({hands:[[I.GUARD,I.BEWD,...(o.hands||[])],[]],cards:[[I.MAUSOLEUM],[]],...o});
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.GUARD)&&pass(a));
  step(t,'LINK_SPIRIT_WITH_EYES_OF_BLUE',pass);
  const spirit=uid(t,0,'monster',I.SPIRIT_LINK);
  step(t,'SPIRIT_SEARCH_MAUSOLEUM',pass);
  step(t,'SPIRIT_TRIBUTE_BLUE_EYES',a=>a.sourceUid===spirit&&a.summonUid===uid(t,0,'hand',I.BEWD)&&pass(a));
  assert.equal(locate(t,spirit).zone,'gy');
  return{t,spirit};
 }
 function battleRoute(o={}){
  const t=make({hands:[[I.GUARD],[]],cards:[[I.MAUSOLEUM],[]],placements:[monster(1,I.BEWD,2)],...o});
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.GUARD)&&pass(a));
  step(t,'LINK_SPIRIT_WITH_EYES_OF_BLUE',pass);step(t,'SPIRIT_SEARCH_MAUSOLEUM',pass);
  const spirit=uid(t,0,'monster',I.SPIRIT_LINK);battleToGY(t,spirit);
  assert.equal(t.state.lp[0],5300);return{t,spirit};
 }
 const actions=(t,type)=>E.enumerate(t.state).filter(a=>a.type===type);
 function reject(t,a){const before=JSON.stringify(t.state);assert.equal(E.execute(t.state,a).pass,false);assert.equal(JSON.stringify(t.state),before);}
 function nextTurn(t){step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='END');step(t,'DUEL_NEXT_TURN');}
 function support(){assert.equal(typeof H.spiritDragonOnly,'function');assert.equal(typeof H.spiritSpecialAllowed,'function');}

 await test('Pinned Spirit text distinguishes a continuous Dragon-only restriction and a Link-only search',()=>{
  const c=W.YGODataCatalog.rulesCard(I.SPIRIT_LINK);assert.equal(c.name,'Spirit with Eyes of Blue');
  assert.equal(Number(c.race),8192);assert(Number(c.typeBits)&0x4000000);
  const text=JSON.parse(fs.readFileSync(path.join(ROOT,'src/data/cards.json'),'utf8')).find(r=>r[0]===I.SPIRIT_LINK)[2];
  assert(text.includes('You cannot Special Summon, except Dragon monsters.'));assert(text.includes('If this card is Link Summoned:'));
 });
 await test('Reborn admits Spirit only as a reviewed properly Link Summoned Extra profile',()=>{
  const c=W.YGOMonsterReborn.capabilities(),p=c.extraProfiles.find(x=>x.cardId===I.SPIRIT_LINK);assert(p);
  assert.equal(p.properSummonType,'LINK');assert.equal(p.requiresRegisteredProperSummon,true);
  assert(!c.excludedProfiles.some(x=>x.id===I.SPIRIT_LINK));assert(!c.excludedProfiles.some(x=>x.id===I.WOLF));assert(c.extraProfiles.some(x=>x.cardId===I.WOLF&&x.properSummonType==='LINK'));assert(c.excludedProfiles.some(x=>x.id===I.ALBAZ));
 });
 for(const destination of [0,1,2,3,4])await test('A witnessed Link and paid tribute revive the same Spirit into Main '+destination+' in Attack',()=>{
  const {t,spirit}=tributeRoute(destination===0?{placements:[set(0,I.CED,0)]}:{}),beforeHistory=copy(t.state.extraHistory),blue=uid(t,0,'monster',I.BEWD),source=uid(t,0,'hand',I.REBORN);
  if(destination===0){step(t,'ACTIVATE_COMPULSORY_EVACUATION_DEVICE',a=>a.targetUid===blue&&pass(a));assert.equal(locate(t,blue).zone,'hand');}
  const offered=options(t).filter(a=>a.targetUid===spirit);assert(offered.length);assert(offered.every(a=>a.position==='ATTACK'&&a.destination!==5));
  const r=step(t,TYPE,select(spirit,destination));packet(r,source,spirit);
  const x=locate(t,spirit).item;assert.equal(locate(t,spirit).zone,'monster');assert.equal(x.zoneIndex,destination);assert.equal(x.ownerPlayer,0);assert.equal(x.summonType,'SPECIAL');assert.equal(x.summonOriginZone,'gy');
  assert.equal(x.properlySummoned,true);assert.equal(x.properSummonType,'LINK');assert.equal(x.position,'ATTACK');assert.equal(x.faceUp,true);
  assert.equal(x.reincarnated,undefined);assert.deepEqual(t.state.extraHistory,beforeHistory);assert.equal(t.state.pendingTriggers.length,0);assert.equal(cards(t,0,'hand',I.MAUSOLEUM).length,1);
  assert.equal(t.state.used.SPIRIT_TRIBUTE,true);assert.equal(t.state.used.SPIRIT_MAUSOLEUM,true);assert.equal(actions(t,'SPIRIT_SEARCH_MAUSOLEUM').length,0);assert.equal(actions(t,'SPIRIT_TRIBUTE_BLUE_EYES').length,0);
  assert(r.action.events.some(e=>e.type==='SPECIAL_SUMMON_FROM_GY'&&e.uid===spirit&&e.newProperSummon===false));replay(t);
 });
 await test('Real battle departure retains Spirit Link qualification and takes actual damage before revival',()=>{
  const {t,spirit}=battleRoute();assert.equal(locate(t,spirit).item.properSummonType,'LINK');assert.equal(locate(t,spirit).item.summonOriginZone,undefined);
  step(t,TYPE,select(spirit,3));assert.equal(locate(t,spirit).item.summonOriginZone,'gy');assert.equal(t.state.lp[0],5300);assert.equal(t.state.pendingTriggers.length,0);replay(t);
 });
 for(const player of [0,1])for(const forged of [false,true])await test('Declared GY Spirit owner '+player+' with '+(forged?'forged':'absent')+' history cannot become a legal witnessed revival',()=>{
  const t=make({placements:[gy(player,I.SPIRIT_LINK,forged?{properlySummoned:true,properSummonType:'LINK',summonType:'LINK'}:{})],extra:[[],player===1?[]:[]]});
  const spirit=uid(t,player,'gy',I.SPIRIT_LINK);assert(spirit);assert(!options(t).some(a=>a.targetUid===spirit));reject(t,{type:TYPE,sourceUid:uid(t,0,'hand',I.REBORN),targetUid:spirit,destination:0,position:'ATTACK'});
 });
 await test('A declared starting Spirit sent to GY by actual tribute still has no witnessed Link qualification',()=>{
  const t=make({hands:[[I.BEWD],[]],placements:[monster(0,I.SPIRIT_LINK,4,{declaredSummonType:'LINK',properlySummoned:true})]});
  const spirit=uid(t,0,'monster',I.SPIRIT_LINK);step(t,'SPIRIT_TRIBUTE_BLUE_EYES',pass);
  assert.equal(locate(t,spirit).zone,'gy');assert(!options(t).some(a=>a.targetUid===spirit));replay(t);
 });
 await test('Spirit cannot be revived in Defense, facedown, an EMZ, with a wrong UID or over an occupied destination',()=>{
  const {t,spirit}=tributeRoute(),a=options(t).find(a=>a.targetUid===spirit&&a.destination===2&&pass(a));assert(a);
  for(const change of [{position:'DEFENSE'},{position:'SET'},{destination:5},{targetUid:'invented'},{targetUid:uid(t,0,'monster',I.BEWD)},{destination:0}])reject(t,{...a,...change});replay(t);
 });
 await test('No reviewed Spirit Special Summon OPT is invented by its genuine Link or later GY revival',()=>{
  const {t,spirit}=tributeRoute();assert(!Object.keys(t.state.used).some(k=>/SPIRIT.*SPECIAL_SUMMON/.test(k)));
  step(t,TYPE,select(spirit,2));assert(!Object.keys(t.state.used).some(k=>/SPIRIT.*SPECIAL_SUMMON/.test(k)));assert.equal(t.state.extraHistory.filter(x=>x==='LINK').length,1);replay(t);
 });
 await test('A revived Spirit from battle can pay its unused tribute for a physical Blue-Eyes in GY',()=>{
  const {t,spirit}=battleRoute({hands:[[I.GUARD],[]],placements:[monster(1,I.BEWD,2),gy(0,I.BEWD)]}),blue=uid(t,0,'gy',I.BEWD);
  step(t,TYPE,select(spirit,3));assert.equal(t.state.used.SPIRIT_TRIBUTE,undefined);
  const r=step(t,'SPIRIT_TRIBUTE_BLUE_EYES',a=>a.sourceUid===spirit&&a.summonUid===blue&&pass(a));
  assert(r.action.paid.some(p=>p.kind==='TRIBUTE'&&p.uid===spirit&&p.to==='gy'));assert.equal(locate(t,spirit).zone,'gy');assert.equal(locate(t,blue).zone,'monster');assert.equal(t.state.used.SPIRIT_TRIBUTE,true);replay(t);
 });
 await test('Roar activation negation still pays the revived Spirit tribute and consumes its HOPT without moving Blue-Eyes',()=>{
  const {t,spirit}=battleRoute({hands:[[I.GUARD,I.BEWD],[]],placements:[monster(1,I.BEWD,2),monster(1,I.WOLF,5),set(1,I.ROAR,0)],responseTypes:['ROAR']});
  step(t,TYPE,select(spirit,3));const blue=uid(t,0,'hand',I.BEWD),r=step(t,'SPIRIT_TRIBUTE_BLUE_EYES',a=>a.sourceUid===spirit&&a.response?.type==='ROAR');
  assert.equal(r.action.proof.activationNegated,true);assert(r.action.paid.some(p=>p.kind==='TRIBUTE'&&p.uid===spirit));assert.equal(locate(t,spirit).zone,'gy');assert.equal(locate(t,blue).zone,'hand');assert.equal(t.state.used.SPIRIT_TRIBUTE,true);replay(t);
 });
 await test('Mechaba answers Reborn with a real hand Spell cost and never creates a revived Spirit or its restriction',()=>{
  const {t,spirit}=battleRoute({hands:[[I.GUARD],[I.INVOCATION]],placements:[monster(1,I.BEWD,2),monster(1,I.MECHABA,0)],responseTypes:['MECHABA']});
  const r=step(t,TYPE,select(spirit,3,'ATTACK',a=>a.response?.type==='MECHABA'&&!a.counterResponses));
  assert.equal(r.action.proof.activationNegated,true);assert.equal(locate(t,r.action.response.costUid).zone,'gy');assert.equal(locate(t,spirit).zone,'gy');assert.equal(H.spiritDragonOnly(t.state,0),false);replay(t);
 });
 await test('The live restriction starts on a witnessed Link, leaves on paid tribute and returns immediately on Reborn',()=>{
  support();const t=make({hands:[[I.GUARD,I.BEWD],[]],cards:[[I.MAUSOLEUM],[]]});assert.equal(H.spiritDragonOnly(t.state,0),false);
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.GUARD));step(t,'LINK_SPIRIT_WITH_EYES_OF_BLUE');const spirit=uid(t,0,'monster',I.SPIRIT_LINK);assert.equal(H.spiritDragonOnly(t.state,0),true);
  step(t,'SPIRIT_SEARCH_MAUSOLEUM',pass);step(t,'SPIRIT_TRIBUTE_BLUE_EYES');assert.equal(H.spiritDragonOnly(t.state,0),false);
  step(t,TYPE,select(spirit,2));assert.equal(H.spiritDragonOnly(t.state,0),true);assert.equal(H.spiritDragonOnly(t.state,1),false);replay(t);
 });
 await test('A declared live Spirit imposes its continuous restriction without any dynamically installed lock',()=>{
  support();const t=make({placements:[monster(0,I.SPIRIT_LINK,4),gy(0,I.BEWD),gy(0,I.FISH)]});assert(!t.state.locks.some(l=>l.kind==='DRAGON_ONLY'));
  assert.equal(H.spiritDragonOnly(t.state,0),true);assert.equal(H.spiritSpecialAllowed(t.state,0,W.YGODataCatalog.rulesCard(I.BEWD)),true);assert.equal(H.spiritSpecialAllowed(t.state,0,W.YGODataCatalog.rulesCard(I.FISH)),false);
  assert(options(t).some(a=>a.targetUid===uid(t,0,'gy',I.BEWD)));assert(!options(t).some(a=>a.targetUid===uid(t,0,'gy',I.FISH)));step(t,TYPE,select(uid(t,0,'gy',I.BEWD),2));replay(t);
 });
 await test('Opponent-controlled Spirit restricts its controller and does not forbid the actor non-Dragon revival',()=>{
  support();const t=make({placements:[monster(1,I.SPIRIT_LINK,4),gy(0,I.FISH)]});assert.equal(H.spiritDragonOnly(t.state,0),false);assert.equal(H.spiritDragonOnly(t.state,1),true);
  step(t,TYPE,select(uid(t,0,'gy',I.FISH),2));replay(t);
 });
 await test('A live Spirit never forbids Normal Summoning a non-Dragon Spellcaster',()=>{
  const t=make({hands:[[I.ALEISTER],[]],cards:[[I.INVOCATION],[]],placements:[monster(0,I.SPIRIT_LINK,4)]});step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.ALEISTER));assert.equal(cards(t,0,'monster',I.ALEISTER).length,1);step(t,'ALEISTER_SEARCH',pass);replay(t);
 });
 const nonDragonProbes=[
  ['Artemis Link',()=>make({extra:[[I.ARTEMIS],[]],placements:[monster(0,I.SPIRIT_LINK,4),monster(0,I.ALEISTER,0)]}),'LINK_ARTEMIS'],
  ['Invoked Mechaba Fusion',()=>make({hands:[[I.INVOCATION],[]],extra:[[I.MECHABA],[]],placements:[monster(0,I.SPIRIT_LINK,4),gy(0,I.ALEISTER),gy(0,I.VEILER)]}),'INVOCATION_MECHABA'],
  ['Longyuan hand Special Summon',()=>make({hands:[[I.LONGYUAN,I.ADHARA],[]],placements:[monster(0,I.SPIRIT_LINK,4)]}),'LONGYUAN_SPECIAL'],
  ['Ashuna Deck Special Summon',()=>make({cards:[[I.ADHARA],[]],placements:[monster(0,I.SPIRIT_LINK,4),monster(0,I.BEWD,0),gy(0,I.ASHUNA)]}),'TENYI_ASHUNA_DECK'],
  ['Spinny GY Special Summon',()=>make({placements:[monster(0,I.SPIRIT_LINK,4),monster(0,I.GAZELLE,0),gy(0,I.SPINNY)]}),'SALAMANGREAT_SPINNY_REVIVE'],
  ['Balelynx Link',()=>make({extra:[[I.BALELYNX],[]],placements:[monster(0,I.SPIRIT_LINK,4),monster(0,I.GAZELLE,0)]}),'SALAMANGREAT_LINK_BALELYNX'],
 ];
 for(const [label,prepare,type] of nonDragonProbes)await test('The active Spirit excludes '+label+' before payment; removing Spirit restores a genuine choice',()=>{
  const t=prepare(),source=uid(t,0,'monster',I.SPIRIT_LINK),before=JSON.stringify(t.state);assert.equal(actions(t,type).length,0);assert.equal(JSON.stringify(t.state),before);
  const diagnostic=copy(t.state);H.move(diagnostic,source,'gy');const candidates=E.enumerate(diagnostic).filter(a=>a.type===type);assert(candidates.length,'The control fixture must offer '+type+' without Spirit');
  reject(t,candidates[0]);assert.equal(locate(t,source).zone,'monster');
 });
 await test('A Spirit used as material cannot evade its own pre-attempt non-Dragon Fusion restriction',()=>{
  const t=make({hands:[[I.INVOCATION],[]],extra:[[I.MECHABA],[]],placements:[monster(0,I.SPIRIT_LINK,4),gy(0,I.ALEISTER)]});
  assert.equal(actions(t,'INVOCATION_MECHABA').length,0);const diagnostic=copy(t.state);const spirit=H.locate(diagnostic,uid(t,0,'monster',I.SPIRIT_LINK)).item;spirit.effectsNegated=true;
  const a=E.enumerate(diagnostic).find(a=>a.type==='INVOCATION_MECHABA'&&a.materialUids.includes(spirit.uid));assert(a);reject(t,a);
 });
 await test('A Dragon Lubellion Fusion remains available under the live restriction while its Wyrm continuation is excluded',()=>{
  const t=make({hands:[[I.BRANDED_FUSION],[]],cards:[[I.ALBAZ,I.DARK_MAGICIAN],[]],extra:[[I.LUBELLION,I.MIRRORJADE],[]],placements:[monster(0,I.SPIRIT_LINK,4)]});
  step(t,'BRANDED_FUSION_LUBELLION',a=>a.materialUids.every(u=>locate(t,u).zone==='deck')&&pass(a));assert.equal(cards(t,0,'monster',I.LUBELLION).length,1);assert.equal(actions(t,'LUBELLION_FUSION_MIRRORJADE').length,0);replay(t);
 });
 await test('A real Impermanence response suppresses Spirit restriction until turn cleanup and preserves physical cards',()=>{
  support();const t=make({hands:[[I.GUARD,I.LONGYUAN,I.ADHARA],[I.IMPERM]],cards:[[I.MAUSOLEUM],[]],responseTypes:['IMPERM']});
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.GUARD));step(t,'LINK_SPIRIT_WITH_EYES_OF_BLUE');const spirit=uid(t,0,'monster',I.SPIRIT_LINK);
  assert.equal(actions(t,'LONGYUAN_SPECIAL').length,0);step(t,'SPIRIT_SEARCH_MAUSOLEUM',a=>a.response?.type==='IMPERM');
  assert.equal(locate(t,spirit).item.effectsNegated,true);assert.equal(H.spiritDragonOnly(t.state,0),false);assert(actions(t,'LONGYUAN_SPECIAL').length>0);assert.equal(cards(t,1,'gy',I.IMPERM).length,1);
  nextTurn(t);assert.equal(locate(t,spirit).item.effectsNegated,undefined);assert.equal(H.spiritDragonOnly(t.state,0),true);replay(t);
 });
 for(const [type,n] of [['IMPERM',I.IMPERM],['VEILER',I.VEILER]])await test('A prior resolved '+type+' still negates Spirit tribute despite its physical cost departure',()=>{
  const t=make({hands:[[I.GUARD,I.BEWD],[n]],cards:[[I.MAUSOLEUM],[]],responseTypes:[type]});
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.GUARD));step(t,'LINK_SPIRIT_WITH_EYES_OF_BLUE');const spirit=uid(t,0,'monster',I.SPIRIT_LINK);
  step(t,'SPIRIT_SEARCH_MAUSOLEUM',a=>a.response?.type===type);assert.equal(locate(t,spirit).item.effectsNegated,true);const blue=uid(t,0,'hand',I.BEWD);
  const r=step(t,'SPIRIT_TRIBUTE_BLUE_EYES',a=>a.sourceUid===spirit&&pass(a));assert.equal(r.action.proof.effectNegated,true);assert(r.action.paid.some(p=>p.kind==='TRIBUTE'&&p.uid===spirit));assert.equal(locate(t,spirit).zone,'gy');assert.equal(locate(t,blue).zone,'hand');assert.equal(t.state.used.SPIRIT_TRIBUTE,true);replay(t);
 });
 for(const [type,n] of [['IMPERM',I.IMPERM],['VEILER',I.VEILER]])await test('A fresh '+type+' cannot target Spirit after its tribute activation cost is paid',()=>{
  const {t,spirit}=battleRoute({hands:[[I.GUARD,I.BEWD],[n]],cards:[[I.MAUSOLEUM],[]],placements:[monster(1,I.BEWD,2)],responseTypes:[type]});step(t,TYPE,select(spirit,3));
  const choices=actions(t,'SPIRIT_TRIBUTE_BLUE_EYES');assert(choices.length);assert(choices.every(pass));const cost=uid(t,1,'hand',n);assert(cost);
  step(t,'SPIRIT_TRIBUTE_BLUE_EYES',pass);assert.equal(locate(t,cost).zone,'hand');assert.equal(locate(t,spirit).zone,'gy');assert.equal(cards(t,0,'monster',I.BEWD).length,1);replay(t);
 });
 await test('Real CED returns a revived Spirit to Extra, clears qualification, and immediately releases its restriction',()=>{
  support();const {t,spirit}=tributeRoute({hands:[[I.GUARD,I.BEWD,I.LONGYUAN],[]],placements:[set(0,I.CED,0)]});step(t,TYPE,select(spirit,2));
  assert.equal(H.spiritDragonOnly(t.state,0),true);step(t,'ACTIVATE_COMPULSORY_EVACUATION_DEVICE',a=>a.targetUid===spirit&&pass(a));
  assert.equal(locate(t,spirit).zone,'extra');assert.equal(locate(t,spirit).item.properlySummoned,undefined);assert.equal(locate(t,spirit).item.properSummonType,undefined);assert.equal(H.spiritDragonOnly(t.state,0),false);replay(t);
 });
 await test('QA-only negated and facedown field instances do not sustain a stale Dragon-only lock',()=>{
  support();const {t,spirit}=tributeRoute();step(t,TYPE,select(spirit,2));
  for(const property of [{effectsNegated:true},{faceUp:false}]){const diagnostic=copy(t.state);Object.assign(H.locate(diagnostic,spirit).item,property);assert.equal(H.spiritDragonOnly(diagnostic,0),false);assert.equal(H.spiritSpecialAllowed(diagnostic,0,W.YGODataCatalog.rulesCard(I.FISH)),true);}
 });
 await test('QA-only controller and physical owner differ without applying the continuous effect to the owner',()=>{
  support();const {t,spirit}=tributeRoute();step(t,TYPE,select(spirit,2));const diagnostic=copy(t.state);const item=H.locate(diagnostic,spirit).item;item.ownerPlayer=1;
  assert.equal(H.spiritDragonOnly(diagnostic,0),true);assert.equal(H.spiritDragonOnly(diagnostic,1),false);
  H.move(diagnostic,spirit,'gy');assert.equal(H.locate(diagnostic,spirit).player,1);assert.equal(H.spiritDragonOnly(diagnostic,0),false);
  const action=E.enumerate(diagnostic).find(a=>a.type===TYPE&&a.targetUid===spirit);assert.equal(action,undefined,'The already-used physical Reborn is not invented again');
 });
 for(const property of [{leaveFieldRedirect:'banished'},{attachedUids:['unregistered']}])await test('QA-only redirected or attached Spirit target remains outside the revival packet '+JSON.stringify(property),()=>{
  const {t,spirit}=tributeRoute();Object.assign(locate(t,spirit).item,property);assert(!options(t).some(a=>a.targetUid===spirit));
 });
 await test('QA-only unknown face-up restriction excludes an otherwise witnessed Spirit revival without spending the spell or target',()=>{
  const {t,spirit}=tributeRoute({hands:[[I.GUARD,I.BEWD],[I.UNKNOWN]]}),source=uid(t,0,'hand',I.REBORN);assert(options(t).some(a=>a.targetUid===spirit));replay(t);
  const diagnostic=copy(t.state);H.move(diagnostic,uid(t,1,'hand',I.UNKNOWN),'monster',{player:1,zoneIndex:2,faceUp:true});t.state=diagnostic;
  assert.equal(options(t).length,0);reject(t,{type:TYPE,sourceUid:source,targetUid:spirit,destination:2,position:'ATTACK'});assert.equal(locate(t,source).zone,'hand');assert.equal(locate(t,spirit).zone,'gy');
 });
 await test('Fresh replay rejects forged revived history, origin, ownership, repeated Link search and tribute costs',()=>{
  const {t,spirit}=tributeRoute();step(t,TYPE,select(spirit,2));const good=replay(t);
  for(const mutate of [
   l=>{l.after.zones[0].monster.find(x=>x.uid===spirit).properSummonType='FUSION';},
   l=>{l.after.zones[0].monster.find(x=>x.uid===spirit).summonOriginZone='extra';},
   l=>{l.after.zones[0].monster.find(x=>x.uid===spirit).ownerPlayer=1;},
   l=>{l.after.pendingTriggers.push({kind:'SPIRIT_MAUSOLEUM',sourceUid:spirit});},
   l=>{l.actions.find(a=>a.type==='SPIRIT_TRIBUTE_BLUE_EYES').paid[0].to='hand';},
   l=>{l.actions.at(-1).proof.normalSpellActivation.cardId=I.INVOCATION;},
  ]){const bad=copy(good);mutate(bad);bad.state=copy(bad.after);assert.equal(E.replay(bad,{deck:t.deck}).pass,false);}
 });
 await test('Bounded search finds only a genuine GY Spirit revival and every returned continuation freshly replays',async()=>{
  const {t,spirit}=tributeRoute();const r=await E.search(t.initial,{goal:s=>s.zones[0].monster.some(x=>x.uid===spirit&&x.summonOriginZone==='gy'&&x.properSummonType==='LINK'&&x.zoneIndex===2),maxDepth:5,maxStates:1000,maxMs:15000,checkCurrentDeck:false});
  assert.equal(r.pass,true);assert(r.lines.length>0);for(const line of r.lines){assert(line.actions.some(a=>a.type===TYPE));assert.equal(E.replay(line,{deck:t.deck}).pass,true);}assert.equal(r.certified,false);assert.equal(r.globalOptimalityProven,false);
 });
 await test('A real resolved Veiler permits using the witnessed Spirit as LIGHT Fusion material without evading an active restriction',()=>{
  const t=make({hands:[[I.GUARD,I.INVOCATION],[I.VEILER]],cards:[[I.MAUSOLEUM],[]],extra:[[I.MECHABA],[]],placements:[gy(0,I.ALEISTER)],responseTypes:['VEILER']});
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.GUARD));step(t,'LINK_SPIRIT_WITH_EYES_OF_BLUE');const spirit=uid(t,0,'monster',I.SPIRIT_LINK);
  assert.equal(actions(t,'INVOCATION_MECHABA').length,0);step(t,'SPIRIT_SEARCH_MAUSOLEUM',a=>a.response?.type==='VEILER');
  assert.equal(locate(t,spirit).item.effectsNegated,true);assert.equal(H.spiritDragonOnly(t.state,0),false);
  const r=step(t,'INVOCATION_MECHABA',a=>a.materialUids.includes(spirit)&&pass(a));assert(r.action.paid.some(p=>p.uid===spirit&&p.to==='banished'));
  assert.equal(locate(t,spirit).zone,'banished');assert.equal(cards(t,0,'monster',I.MECHABA).length,1);replay(t);
 });
 await test('Mechaba negates a revived Spirit tribute using a physical Monster cost and never banishes the already-tributed copy again',()=>{
  const {t,spirit}=battleRoute({hands:[[I.GUARD,I.BEWD],[I.VEILER]],placements:[monster(1,I.BEWD,2),monster(1,I.MECHABA,0)],responseTypes:['MECHABA']});
  step(t,TYPE,select(spirit,3));const cost=uid(t,1,'hand',I.VEILER),blue=uid(t,0,'hand',I.BEWD);
  const r=step(t,'SPIRIT_TRIBUTE_BLUE_EYES',a=>a.sourceUid===spirit&&a.response?.type==='MECHABA');assert.equal(r.action.proof.activationNegated,true);
  assert.equal(locate(t,cost).zone,'gy');assert.equal(locate(t,spirit).zone,'gy');assert.equal(locate(t,blue).zone,'hand');assert.equal(t.state.used.SPIRIT_TRIBUTE,true);
  assert(r.action.paid.some(p=>p.kind==='TRIBUTE'&&p.uid===spirit));assert(r.action.paid.some(p=>p.kind==='SEND_GY'&&p.uid===cost));assert(!r.action.events.some(e=>e.type==='MECHABA_BANISH_ACTIVATED_CARD'&&e.targetUid===spirit));replay(t);
 });
 await test('Restriction witnesses derive the real current Spirit presence across Link, tribute and revival without persistent synthetic locks',()=>{
  const {t,spirit}=tributeRoute();const link=t.actions.find(a=>a.type==='LINK_SPIRIT_WITH_EYES_OF_BLUE').after;
  const live=E.witnesses(link).locks.filter(l=>l.kind==='DRAGON_ONLY');assert.equal(live.length,1);assert.equal(live[0].sourceUid,spirit);assert.equal(live[0].appliesToPlayer,0);assert.equal(live[0].active,true);assert.equal(live[0].continuous,true);
  assert.equal(E.witnesses(t.state).locks.filter(l=>l.kind==='DRAGON_ONLY').length,0);assert(!t.state.locks.some(l=>l.kind==='DRAGON_ONLY'));
  step(t,TYPE,select(spirit,2));assert.equal(E.witnesses(t.state).locks.find(l=>l.sourceUid===spirit).active,true);assert(!t.state.locks.some(l=>l.kind==='DRAGON_ONLY'));
  const diagnostic=copy(t.state);H.locate(diagnostic,spirit).item.effectsNegated=true;diagnostic.locks.push({kind:'DRAGON_ONLY',sourceUid:spirit});
  const inactive=E.witnesses(diagnostic).locks.filter(l=>l.kind==='DRAGON_ONLY');assert.equal(inactive.length,1);assert.equal(inactive[0].active,false);replay(t);
 });
 await test('An actual paid Ashuna Wyrm-only restriction excludes Spirit tribute before its cost even while Spirit is negated',()=>{
  const t=make({hands:[[I.GUARD,I.BEWD],[I.IMPERM]],cards:[[I.MAUSOLEUM,I.ADHARA],[]],placements:[monster(0,I.BEWD,1),gy(0,I.ASHUNA)],responseTypes:['IMPERM']});
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.GUARD));step(t,'LINK_SPIRIT_WITH_EYES_OF_BLUE');const spirit=uid(t,0,'monster',I.SPIRIT_LINK);
  step(t,'SPIRIT_SEARCH_MAUSOLEUM',a=>a.response?.type==='IMPERM');step(t,'TENYI_ASHUNA_DECK',a=>a.selectionUid===uid(t,0,'deck',I.ADHARA)&&pass(a));
  assert(t.state.locks.some(l=>l.kind==='WYRM_ONLY'));assert.equal(locate(t,spirit).item.effectsNegated,true);assert.equal(actions(t,'SPIRIT_TRIBUTE_BLUE_EYES').length,0);
  reject(t,{type:'SPIRIT_TRIBUTE_BLUE_EYES',sourceUid:spirit,summonUid:uid(t,0,'hand',I.BEWD)});assert.equal(locate(t,spirit).zone,'monster');assert.equal(t.state.used.SPIRIT_TRIBUTE,undefined);replay(t);
 });
 await test('An unreviewed face-up summon restriction excludes Spirit tribute without spending its source, target or use',()=>{
  const t=make({hands:[[I.BEWD],[]],placements:[monster(0,I.SPIRIT_LINK,4),monster(1,47084486,0)]}),spirit=uid(t,0,'monster',I.SPIRIT_LINK),blue=uid(t,0,'hand',I.BEWD);
  assert.equal(actions(t,'SPIRIT_TRIBUTE_BLUE_EYES').length,0);reject(t,{type:'SPIRIT_TRIBUTE_BLUE_EYES',sourceUid:spirit,summonUid:blue});
  assert.equal(locate(t,spirit).zone,'monster');assert.equal(locate(t,blue).zone,'hand');assert.equal(t.state.used.SPIRIT_TRIBUTE,undefined);assert.equal(t.actions.length,0);
 });
 for(const recoverFire of [false,true])await test('Witnessed Wolf and revived Spirit automatic arrival '+(recoverFire?'permits tribute after actual FIRE recovery':'records a new observed Wolf opportunity after the paid tribute'),()=>{
  const t=make({hands:[[I.GUARD,I.BEWD],[]],cards:[[I.MAUSOLEUM],[]],extra:[[I.WOLF],[]],placements:[monster(0,I.FISH,0),monster(0,I.GAZELLE,2),monster(0,I.SPINNY,3),monster(1,I.BEWD,2)]});
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.GUARD));step(t,'LINK_SPIRIT_WITH_EYES_OF_BLUE');step(t,'SPIRIT_SEARCH_MAUSOLEUM');const spirit=uid(t,0,'monster',I.SPIRIT_LINK);
  battleToGY(t,spirit);step(t,'SALAMANGREAT_LINK_WOLF',pass);const wolf=uid(t,0,'monster',I.WOLF);step(t,TYPE,select(spirit,1));assert(t.state.pendingTriggers.some(x=>x.kind==='SALAMANGREAT_WOLF_FIRE'));
  const blue=uid(t,0,'hand',I.BEWD);
  if(recoverFire){
   step(t,'SALAMANGREAT_WOLF_RECOVER_FIRE',a=>a.sourceUid===wolf&&a.targetUid===uid(t,0,'gy',I.GAZELLE)&&pass(a));assert.equal(t.state.used.SALAMANGREAT_WOLF_FIRE,true);
   step(t,'SPIRIT_TRIBUTE_BLUE_EYES',a=>a.sourceUid===spirit&&a.summonUid===blue&&pass(a));assert.equal(locate(t,blue).zone,'monster');assert.equal(locate(t,blue).item.zoneIndex,1);assert.equal(t.state.pendingTriggers.length,0);assert.equal(t.state.used.SPIRIT_TRIBUTE,true);
  }else{
   decline(t);assert.equal(t.state.used.SALAMANGREAT_WOLF_FIRE,undefined);assert(actions(t,'SPIRIT_TRIBUTE_BLUE_EYES').length>0);
   const r=step(t,'SPIRIT_TRIBUTE_BLUE_EYES',a=>a.sourceUid===spirit&&a.summonUid===blue&&pass(a));assert(r.action.paid.some(p=>p.kind==='TRIBUTE'&&p.uid===spirit));assert.equal(locate(t,spirit).zone,'gy');assert.equal(locate(t,blue).zone,'monster');assert.equal(locate(t,blue).item.zoneIndex,1);assert.equal(t.state.used.SPIRIT_TRIBUTE,true);
   assert.equal(t.state.pendingTriggers.filter(p=>p.kind==='SALAMANGREAT_WOLF_FIRE'&&p.sourceUid===wolf).length,1);decline(t);assert.equal(t.state.pendingTriggers.length,0);
  }
  assert.equal(locate(t,wolf).item.zoneIndex,5);replay(t);
 });
 const report={schema:'ygo-spirit-revival-tests/v1',pass:tests.every(t=>t.pass),total:tests.length,tests,limitations:[
  'Pinned technical CDB and dated TCG restriction snapshot do not independently authenticate new official rulings.',
  'Witnessed Spirit history comes from actual registered Link and tribute or battle actions; declared history remains unqualified.',
  'No registered opponent Link procedure or control-transfer action is added. Owner/controller differences are explicitly QA-only diagnostics, never an invented opponent-owned witnessed line.',
  'Only registered summon profiles, physical response packets and bounded continuations are covered; unknown effects, general priority and arbitrary simultaneous-trigger chains remain outside scope.',
  'Competitive scoring remains provisional; these diagnostic decks do not constitute tournament results.'
 ]};fs.writeFileSync(path.join(ROOT,'tests/spirit-revival-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));process.exitCode=report.pass?0:1;
})().catch(error=>{console.error(error);process.exitCode=1;});


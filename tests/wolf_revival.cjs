'use strict';
/* Physical Wolf regressions over audited forty-card decks and pinned data.
 * Registered Link, battle and Reborn actions witness revival qualification.
 * Explicit QA diagnostics never provide a legal replay witness. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const assert=require('node:assert/strict'),{harness,ROOT}=require('./combo_engine.cjs'),copy=structuredClone;
const I={REBORN:83764718,WOLF:87871125,GAZELLE:26889158,SPINNY:52277807,BALELYNX:14812471,
 SANCTUARY:1295111,ROAR:51339637,RAGE:14934922,BEWD:89631139,FISH:23771716,ALEISTER:86120751,
 ARTEMIS:34755994,INVOCATION:74063034,MECHABA:75286621,IMPERM:10045474,VEILER:97268402,
 ASH:14558127,ASH_ALT:14558128,CED:94192409,SPIRIT:59822133,SPARK:83994433,AZURE:40908371,
 SHAMAN:78917791,ADHARA:98159737,SHTHANA:24557335,MONK:32519092,BURST:58932615,BURST_ALT:58932616,UNKNOWN:38033121,CIRCLE:52155219,GIFT:20788863};
const FIRE='SALAMANGREAT_WOLF_RECOVER_FIRE',ST='SALAMANGREAT_WOLF_RECOVER_ST',REBORN='ACTIVATE_MONSTER_REBORN';

(async()=>{
 const {W,E,fixture}=await harness(true),H=E.helpers,tests=[];
 for(const name of ['duel-phases','responses','archetypes-expanded','blue-eyes-duel','monster-reborn','stardust-synchro','azure-synchro'])
  vm.runInNewContext(fs.readFileSync(path.join(ROOT,'src/app/'+name+'.js'),'utf8'),{window:W,structuredClone,console,Date,Promise,setTimeout,clearTimeout,performance});
 await Promise.resolve();
 const id=H.baseId,fillers=[...new Set(fixture('Invoked').deck.main.filter(r=>![I.ALEISTER,I.INVOCATION,I.REBORN,I.ASH,I.VEILER].includes(r.id)).map(r=>r.id).concat([63749102,74367458,48305365,32452818,I.FISH]))];
 function deck(cards,extra){const main=new Map(),ex=new Map();for(const n of cards)main.set(n,(main.get(n)||0)+1);
  let size=cards.length;for(const n of fillers){if(size>=40)break;if(main.has(n))continue;const q=Math.min(3,40-size);main.set(n,q);size+=q;}
  assert.equal(size,40);for(const n of extra)ex.set(n,(ex.get(n)||0)+1);
  const d={main:[...main].map(([id,qty])=>({id,qty})),extra:[...ex].map(([id,qty])=>({id,qty})),side:[]};
  const audit=W.YGODataCatalog.auditDeck(d,{format:'tcg',banlist:W.BANLIST_PROFILES.tcg.data});assert.equal(audit.pass,true,JSON.stringify(audit));return d;
 }
 function opening(d,wanted,reserved){const available=new Map(d.main.map(r=>[r.id,r.qty])),out=[...wanted];
  for(const n of [...wanted,...reserved]){assert((available.get(n)||0)>0,'Missing physical '+n);available.set(n,available.get(n)-1);}
  for(const n of fillers)while(out.length<5&&(available.get(n)||0)>0){out.push(n);available.set(n,available.get(n)-1);}assert.equal(out.length,5);return out;
 }
 function remaining(d,hand){const out=d.main.flatMap(r=>Array(r.qty).fill(r.id));for(const n of hand){const at=out.indexOf(n);assert(at>=0);out.splice(at,1);}return out;}
 const extra=n=>!!(Number(W.YGODataCatalog.rulesCard(n).typeBits)&(0x40|0x2000|0x800000|0x4000000));
 const monster=(player,cardId,zoneIndex=0,properties={})=>({player,cardId,zone:'monster',from:extra(cardId)?'extra':'deck',faceUp:true,position:'ATTACK',summonTurn:1,zoneIndex,...properties});
 const gy=(player,cardId,properties={})=>({player,cardId,zone:'gy',from:extra(cardId)?'extra':'deck',...properties});
 const set=(player,cardId,zoneIndex=0)=>({player,cardId,zone:'spelltrap',from:'deck',faceUp:false,setTurn:1,zoneIndex});
 function make(o={}){const placements=copy(o.placements||[]),wanted=[[...(o.reborn===false?[]:[I.REBORN]),...(o.hands?.[0]||[])],[...(o.hands?.[1]||[])]];
  const decks=[0,1].map(p=>deck([...placements.filter(x=>x.player===p&&x.from==='deck').map(x=>x.cardId),...wanted[p],...(o.cards?.[p]||[])],
   [...placements.filter(x=>x.player===p&&x.from==='extra').map(x=>x.cardId),...(o.extra?.[p]||[])]));
  const hands=decks.map((d,p)=>opening(d,wanted[p],placements.filter(x=>x.player===p&&x.from==='deck').map(x=>x.cardId)));
  const types=o.responseTypes||[],spec={deck:decks[0],openingIds:hands[0],remainingDeckIds:remaining(decks[0],hands[0]),opponentDeck:decks[1],opponentOpeningIds:hands[1],opponentRemainingDeckIds:remaining(decks[1],hands[1]),
   context:{format:'tcg',duelMode:true,manualBothPlayers:true,opponentPolicy:types.length?'RESPONSES_EXPLICIT':'PASS',responseTypes:types,responsePolicy:'CHOICE_BRANCHES',...(o.context||{})},
   setup:{turn:o.turn??2,activePlayer:o.activePlayer??0,phase:o.phase||'MAIN 1',placements}};
  const initial=E.createState(spec);return{deck:decks[0],spec,initial,state:copy(initial),actions:[]};
 }
 const cards=(t,p,z,n)=>t.state.zones[p][z].filter(x=>id(x)===id(W.YGODataCatalog.rulesCard(n)));
 const uid=(t,p,z,n)=>cards(t,p,z,n)[0]?.uid,locate=(t,u)=>H.locate(t.state,u),pass=a=>!a.response&&!a.responseUid;
 const actions=(t,type)=>E.enumerate(t.state).filter(a=>a.type===type),selected=(a,u)=>(a.selectionUid??a.targetUid)===u;
 function step(t,type,predicate=pass){const a=E.enumerate(t.state).find(a=>a.type===type&&predicate(a));assert(a,'Missing '+type+': '+JSON.stringify(E.enumerate(t.state).map(a=>({type:a.type,sourceUid:a.sourceUid,targetUid:a.targetUid,selectionUid:a.selectionUid,destination:a.destination,position:a.position,response:a.response?.type,player:a.player,triggerKind:a.triggerKind}))));
  const prior=JSON.stringify(t.state),inventory=H.inventory(t.state),r=E.execute(t.state,a);assert.equal(r.pass,true,JSON.stringify(r));assert.equal(JSON.stringify(t.state),prior);assert.equal(H.inventory(r.after),inventory);t.state=r.after;t.actions.push(r.action);return r;
 }
 function replay(t){const line={before:copy(t.initial),after:copy(t.state),state:copy(t.state),actions:copy(t.actions),context:copy(t.initial.context),deckFingerprint:E.deckFingerprint(t.deck),scope:E.version,certified:false,globalOptimalityProven:false};
  assert.equal(E.replay(line,{deck:t.deck}).pass,true);return line;
 }
 function reject(t,a){const before=JSON.stringify(t.state),r=E.execute(t.state,a);assert.equal(r.pass,false,JSON.stringify(r));assert.equal(JSON.stringify(t.state),before);return r;}
 function decline(t,kind){let guard=0;while(t.state.pendingTriggers.some(x=>!kind||x.kind===kind)){assert(guard++<20);step(t,'DECLINE_OPTIONAL_TRIGGER',a=>!kind||a.triggerKind===kind);}}
 const pending=(t,u)=>t.state.pendingTriggers.filter(x=>x.kind==='SALAMANGREAT_WOLF_FIRE'&&(!u||x.sourceUid===u));
 function battle(t,wolf){const rival=uid(t,1,'monster',I.BEWD);assert(rival);step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='BATTLE');step(t,'DUEL_ATTACK',a=>a.attackerUid===wolf&&a.targetUid===rival&&pass(a));assert.equal(locate(t,wolf).zone,'gy');step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='MAIN 2');}
 function route(o={}){const t=make({...o,extra:[[I.WOLF,...(o.extra?.[0]||[])],o.extra?.[1]||[]],placements:[monster(0,I.GAZELLE,0),monster(0,I.SPINNY,2),monster(1,I.BEWD,2),...(o.placements||[])]});
  step(t,'SALAMANGREAT_LINK_WOLF',a=>a.materialUids.includes(uid(t,0,'monster',I.GAZELLE))&&a.materialUids.includes(uid(t,0,'monster',I.SPINNY))&&a.destination===5&&pass(a));
  const wolf=uid(t,0,'monster',I.WOLF);decline(t);battle(t,wolf);return{t,wolf};
 }
 function reincarnated(o={}){const t=make({...o,extra:[[I.WOLF,I.WOLF,...(o.extra?.[0]||[])],o.extra?.[1]||[]],placements:[monster(0,I.GAZELLE,0),monster(0,I.SPINNY,2),monster(0,I.GAZELLE,3),...(o.placements||[])]});
  const material=uid(t,0,'monster',I.GAZELLE),spinny=uid(t,0,'monster',I.SPINNY);step(t,'SALAMANGREAT_LINK_WOLF',a=>a.materialUids.includes(material)&&a.materialUids.includes(spinny)&&pass(a));const first=uid(t,0,'monster',I.WOLF);decline(t);
  step(t,'SALAMANGREAT_LINK_WOLF',a=>a.materialUids.includes(first)&&pass(a));const wolf=uid(t,0,'monster',I.WOLF);return{t,wolf,first};
 }
 function fireOpportunity(o={}){const t=make({...o,hands:[[I.FISH,...(o.hands?.[0]||[])],o.hands?.[1]||[]],placements:[monster(0,I.WOLF,5),monster(0,I.BEWD,0),gy(0,I.ASH),...(o.placements||[])]});
  const wolf=uid(t,0,'monster',I.WOLF);step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.FISH)&&pass(a));assert.equal(pending(t,wolf).length,1);return{t,wolf};
 }
 async function test(name,fn){try{await fn();tests.push({name,pass:true});}catch(error){tests.push({name,pass:false,error:error.stack});}}

 await test('Pinned CDB and secondary Lua reference distinguish arrival triggers, resolution selection and current Link eligibility',()=>{
  const row=JSON.parse(fs.readFileSync(path.join(ROOT,'src/data/cards.json'),'utf8')).find(r=>r[0]===I.WOLF),receipt=JSON.parse(fs.readFileSync(path.join(ROOT,'src/data/technical-references/wolf-reference.json'),'utf8'));
  const lua=fs.readFileSync(path.join(ROOT,'src/data/technical-references/wolf-c87871125.lua'));assert.equal(crypto.createHash('sha256').update(lua).digest('hex'),receipt.sha256);assert.equal(lua.length,receipt.bytes);assert.equal(receipt.officialRulingAuthentication,false);assert.equal(receipt.executableInAnalyzer,false);
  assert.equal(receipt.commit,'915c6ff63518a04e18d16ee45962d75a8c8be264');assert.equal(receipt.httpStatus,200);assert.equal(W.YGODataCatalog.rulesCard(I.WOLF).linkMarkers,130);
  for(const text of ['except during the Damage Step','1 FIRE monster','cannot Normal Summon/Set or Special Summon','was Link Summoned using'])assert(row[2].includes(text));
  const text=lua.toString();assert(text.includes('Duel.SelectMatchingCard'));assert(!text.includes('Duel.SelectTarget'));assert(text.includes('tc:IsLocation(LOCATION_HAND)'));assert(text.includes('c:IsReincarnationSummoned() and c:IsLinkSummoned()'));
 });
 await test('Reborn exposes Wolf only as a reviewed Extra profile requiring registered proper Link history',()=>{const c=W.YGOMonsterReborn.capabilities(),p=c.extraProfiles.find(x=>x.cardId===I.WOLF);assert(p);assert.equal(p.properSummonType,'LINK');assert.equal(p.requiresRegisteredProperSummon,true);assert(!c.excludedProfiles.some(x=>x.id===I.WOLF));});
 for(const destination of [0,1,2,3,4])await test('Actual Link and battle revive the same physical Wolf in Main '+destination+' with unchanged proper history',()=>{
  const {t,wolf}=route(),history=copy(t.state.extraHistory),source=uid(t,0,'hand',I.REBORN);assert.equal(t.state.lp[0],6800);const choices=actions(t,REBORN).filter(a=>a.targetUid===wolf);assert.equal(choices.length,5);assert(choices.every(a=>a.position==='ATTACK'&&a.destination<5));
  const r=step(t,REBORN,a=>a.targetUid===wolf&&a.destination===destination&&pass(a)),x=locate(t,wolf).item;
  assert.equal(x.uid,wolf);assert.equal(x.zoneIndex,destination);assert.equal(x.ownerPlayer,0);assert.equal(x.faceUp,true);assert.equal(x.position,'ATTACK');assert.equal(x.summonType,'SPECIAL');assert.equal(x.summonOriginZone,'gy');assert.equal(x.properlySummoned,true);assert.equal(x.properSummonType,'LINK');assert.equal(x.reincarnated,undefined);assert.deepEqual(t.state.extraHistory,history);
  assert.equal(r.action.proof.normalSpellActivation.sourceUid,source);assert.equal(r.action.proof.normalSpellActivation.cardId,I.REBORN);assert(r.action.events.some(e=>e.type==='SPECIAL_SUMMON_FROM_GY'&&e.uid===wolf&&e.newProperSummon===false));assert.equal(actions(t,ST).length,0);replay(t);
 });
 for(const player of [0,1])for(const forged of [false,true])await test('Declared player '+player+' GY Wolf '+(forged?'with forged qualification':'without qualification')+' cannot replace witnessed Link history',()=>{
  const t=make({placements:[gy(player,I.WOLF,forged?{properlySummoned:true,properSummonType:'LINK',summonType:'LINK',reincarnated:true}:{})]}),wolf=uid(t,player,'gy',I.WOLF);assert(!actions(t,REBORN).some(a=>a.targetUid===wolf));reject(t,{type:REBORN,sourceUid:uid(t,0,'hand',I.REBORN),targetUid:wolf,destination:1,position:'ATTACK'});
 });
 await test('Actual battle of a declared field Wolf still cannot manufacture a registered Link qualification',()=>{const t=make({placements:[monster(0,I.WOLF,5,{properlySummoned:true,declaredSummonType:'LINK'}),monster(1,I.BEWD,2)]}),wolf=uid(t,0,'monster',I.WOLF);battle(t,wolf);assert(!actions(t,REBORN).some(a=>a.targetUid===wolf));replay(t);});
 await test('Wolf rejects Defense, facedown, EMZ, wrong UID and occupied revival destinations before spending Reborn',()=>{const {t,wolf}=route({placements:[monster(0,I.FISH,4)]}),a=actions(t,REBORN).find(a=>a.targetUid===wolf&&a.destination===2&&pass(a));assert(a);for(const change of [{position:'DEFENSE'},{position:'SET'},{destination:5},{destination:4},{targetUid:'invented'},{targetUid:uid(t,1,'monster',I.BEWD)}])reject(t,{...a,...change});assert.equal(locate(t,a.sourceUid).zone,'hand');replay(t);});

 for(const controller of [0,1])for(const zone of [0,1,2,3,4,5])await test('QA-only complete fixed-left-EMZ geometry for controller '+controller+' Wolf zone '+zone,()=>{
  assert.equal(typeof H.wolfPointsTo,'function');const t=make({placements:[monster(controller,I.WOLF,zone)]}),wolf=locate(t,uid(t,controller,'monster',I.WOLF)).item;
  for(const arrivalPlayer of [0,1])for(const arrivalZone of [0,1,2,3,4,5]){
   const expected=zone===5?(arrivalPlayer===controller&&arrivalZone===1||arrivalPlayer!==controller&&arrivalZone===3):zone===1?arrivalPlayer===controller&&arrivalZone===5:zone===3?arrivalPlayer!==controller&&arrivalZone===5:false;
   assert.equal(H.wolfPointsTo(t.state,controller,wolf,arrivalPlayer,arrivalZone),expected,'arrival '+arrivalPlayer+':'+arrivalZone);
  }
  const diagnostic=copy(t.state),x=H.locate(diagnostic,wolf.uid).item;x.effectsNegated=true;
  const linked=zone===5?[controller,1]:zone===1?[controller,5]:zone===3?[1-controller,5]:null;if(linked)assert.equal(H.wolfPointsTo(diagnostic,controller,x,...linked),true);
  x.faceUp=false;for(const p of [0,1])for(const z of [0,1,2,3,4,5])assert.equal(H.wolfPointsTo(diagnostic,controller,x,p,z),false);
 });
 for(const actor of [0,1])for(const position of ['ATTACK','SET'])await test('Central observer recognizes player '+actor+' actual Normal '+position+' and ignores setup and Normal Set',()=>{
  const t=make({phase:'MAIN 2',activePlayer:actor,hands:actor? [[],[I.FISH]]:[[I.FISH],[]],placements:[monster(actor,I.WOLF,5),monster(actor,I.BEWD,0),gy(actor,I.ASH)]}),wolf=uid(t,actor,'monster',I.WOLF);
  assert.equal(pending(t).length,0);const r=step(t,'DUEL_NORMAL_SUMMON_OR_SET',a=>a.player===actor&&a.sourceUid===uid(t,actor,'hand',I.FISH)&&a.position===position&&pass(a));
  assert.equal(pending(t,wolf).length,position==='ATTACK'?1:0);assert(r.action.events.some(e=>e.type===(position==='SET'?'NORMAL_SET':'NORMAL_SUMMON')));
  if(position==='ATTACK'){const fire=uid(t,actor,'gy',I.ASH);step(t,FIRE,a=>a.sourceUid===wolf&&selected(a,fire)&&pass(a));assert.equal(locate(t,fire).player,actor);assert.equal(locate(t,fire).zone,'hand');assert.equal(t.state.used[actor?'SALAMANGREAT_WOLF_FIRE:1':'SALAMANGREAT_WOLF_FIRE'],true);}replay(t);
 });
 for(const actor of [0,1])await test('Central observer recognizes actual player '+actor+' Spark Special Summon once and FIRE resolves in its real phase',()=>{
  const t=make({phase:'BATTLE',activePlayer:actor,placements:[monster(actor,I.WOLF,5),monster(actor,I.BEWD,0),monster(actor,I.SPIRIT,1,{declaredSummonType:'SYNCHRO',properlySummoned:true}),gy(actor,I.ASH)],extra:actor?[[],[I.SPARK]]:[[I.SPARK],[]]}),wolf=uid(t,actor,'monster',I.WOLF);
  step(t,'SPIRIT_DRAGON_TRIBUTE_SYNCHRO',a=>a.player===actor&&id(locate(t,a.summonUid).item)===I.SPARK&&pass(a));assert.equal(pending(t,wolf).length,1);const fire=uid(t,actor,'gy',I.ASH);step(t,FIRE,a=>a.sourceUid===wolf&&selected(a,fire)&&pass(a));assert.equal(locate(t,fire).player,actor);assert.equal(locate(t,fire).zone,'hand');replay(t);
 });
 for(const controller of [0,1])await test('Opponent Main 3 Normal arrival triggers controller '+controller+' EMZ Wolf, with controller-local recovery',()=>{
  const actor=1-controller,t=make({activePlayer:actor,phase:'MAIN 2',hands:actor?[[],[I.FISH]]:[[I.FISH],[]],placements:[monster(controller,I.WOLF,5),...Array.from({length:3},(_,i)=>monster(actor,I.BEWD,i)),gy(controller,I.ASH)]}),wolf=uid(t,controller,'monster',I.WOLF);
  step(t,'DUEL_NORMAL_SUMMON_OR_SET',a=>a.player===actor&&a.position==='ATTACK'&&a.sourceUid===uid(t,actor,'hand',I.FISH)&&pass(a));assert.equal(pending(t,wolf).length,1);const ash=uid(t,controller,'gy',I.ASH);step(t,FIRE,a=>a.sourceUid===wolf&&selected(a,ash)&&pass(a));assert.equal(locate(t,ash).player,controller);assert.equal(t.state.used[controller?'SALAMANGREAT_WOLF_FIRE:1':'SALAMANGREAT_WOLF_FIRE'],true);replay(t);
 });
 await test('Both controllers can use their independent Wolf FIRE HOPT on different actual arrival transitions in the same turn',()=>{
  const t=make({activePlayer:1,phase:'MAIN 2',hands:[[],[I.FISH]],placements:[monster(0,I.WOLF,5),monster(1,I.WOLF,5),monster(1,I.BEWD,0),monster(1,I.BEWD,2),monster(1,I.SPIRIT,3,{declaredSummonType:'SYNCHRO',properlySummoned:true}),gy(0,I.ASH),gy(1,I.ASH)],extra:[[],[I.SPARK]]}),wolves=[0,1].map(p=>uid(t,p,'monster',I.WOLF));
  step(t,'DUEL_NORMAL_SUMMON_OR_SET',a=>a.player===1&&a.sourceUid===uid(t,1,'hand',I.FISH)&&a.position==='ATTACK'&&pass(a));assert.equal(pending(t,wolves[1]).length,1);assert.equal(pending(t,wolves[0]).length,0);step(t,FIRE,a=>a.player===1&&selected(a,uid(t,1,'gy',I.ASH))&&pass(a));assert.equal(t.state.used.SALAMANGREAT_WOLF_FIRE,undefined);
  step(t,'SPIRIT_DRAGON_TRIBUTE_SYNCHRO',a=>a.player===1&&id(locate(t,a.summonUid).item)===I.SPARK&&pass(a));assert.equal(pending(t,wolves[0]).length,1);step(t,FIRE,a=>a.sourceUid===wolves[0]&&selected(a,uid(t,0,'gy',I.ASH))&&pass(a));assert.equal(t.state.used.SALAMANGREAT_WOLF_FIRE,true);assert.equal(t.state.used['SALAMANGREAT_WOLF_FIRE:1'],true);assert.equal(cards(t,0,'hand',I.ASH).length,1);assert.equal(cards(t,1,'hand',I.ASH).length,1);replay(t);
 });
 for(const zone of [1,0,2,4])await test('A revived Wolf in Main '+zone+' observes the subsequent real Artemis EMZ Link only when its up arrow reaches it',()=>{
  const {t,wolf}=route({hands:[[I.ALEISTER],[]],cards:[[I.INVOCATION],[]],extra:[[I.ARTEMIS],[]],placements:[gy(0,I.ASH)]});step(t,REBORN,a=>a.targetUid===wolf&&a.destination===zone&&pass(a));
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.ALEISTER)&&pass(a));decline(t,'ALEISTER_SEARCH');step(t,'LINK_ARTEMIS',pass);assert.equal(pending(t,wolf).length,zone===1?1:0);
  if(zone===1){const ash=uid(t,0,'gy',I.ASH);step(t,FIRE,a=>a.sourceUid===wolf&&selected(a,ash)&&pass(a));assert.equal(locate(t,ash).zone,'hand');}replay(t);
 });
 await test('Repeated enumeration neither duplicates an observed Wolf trigger nor invents another after its explicit decline',()=>{const {t,wolf}=fireOpportunity(),original=JSON.stringify(t.state);for(let i=0;i<5;i++)E.enumerate(t.state);assert.equal(JSON.stringify(t.state),original);assert.equal(pending(t,wolf).length,1);decline(t,'SALAMANGREAT_WOLF_FIRE');assert.equal(pending(t,wolf).length,0);assert.equal(t.state.used.SALAMANGREAT_WOLF_FIRE,undefined);for(let i=0;i<3;i++)assert.equal(actions(t,FIRE).length,0);replay(t);});
 await test('Actual battle destruction and Shthana revival remain in the Damage Step and never create Wolf FIRE recovery',()=>{
  const t=make({phase:'BATTLE',hands:[[I.SHTHANA],[]],placements:[monster(0,I.WOLF,5),monster(0,I.BEWD,0),monster(0,I.FISH,1),monster(1,I.BEWD,2),gy(0,I.ASH)]}),wolf=uid(t,0,'monster',I.WOLF),fish=uid(t,0,'monster',I.FISH),source=uid(t,0,'hand',I.SHTHANA);
  step(t,'DUEL_ATTACK',a=>a.attackerUid===fish&&a.targetUid===uid(t,1,'monster',I.BEWD)&&pass(a));assert.equal(locate(t,fish).zone,'gy');const trigger=t.state.pendingTriggers.find(x=>x.kind==='TENYI_SHTHANA_REVIVE'&&x.sourceUid===source);assert(trigger);assert.equal(trigger.destructionAction,'DUEL_ATTACK');
  const r=step(t,'TENYI_SHTHANA_REVIVE',a=>a.sourceUid===source&&a.targetUid===fish&&!a.destroyUid&&pass(a));assert.equal(locate(t,fish).item.zoneIndex,1);assert.equal(locate(t,source).zone,'banished');assert(r.action.paid.some(p=>p.kind==='BANISH'&&p.uid===source));assert.equal(pending(t,wolf).length,0);assert.equal(actions(t,FIRE).length,0);assert.equal(t.state.used.SALAMANGREAT_WOLF_FIRE,undefined);replay(t);
 });
 for(const declined of ['SALAMANGREAT_WOLF_FIRE','ALEISTER_SEARCH'])await test('A real Aleister arrival requires an explicit '+declined+' decline before the other trigger can resolve',()=>{
  const t=make({hands:[[I.ALEISTER],[]],cards:[[I.INVOCATION],[]],placements:[monster(0,I.WOLF,5),monster(0,I.BEWD,0),gy(0,I.ASH)]}),wolf=uid(t,0,'monster',I.WOLF);step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.ALEISTER)&&pass(a));assert.equal(pending(t,wolf).length,1);assert(t.state.pendingTriggers.some(x=>x.kind==='ALEISTER_SEARCH'));
  assert.equal(actions(t,FIRE).length,0);assert.equal(actions(t,'ALEISTER_SEARCH').length,0);assert(E.enumerate(t.state).every(a=>a.type==='DECLINE_OPTIONAL_TRIGGER'));step(t,'DECLINE_OPTIONAL_TRIGGER',a=>a.triggerKind===declined);
  if(declined==='ALEISTER_SEARCH'){const ash=uid(t,0,'gy',I.ASH);step(t,FIRE,a=>selected(a,ash)&&pass(a));assert.equal(locate(t,ash).zone,'hand');assert.equal(cards(t,0,'hand',I.INVOCATION).length,0);}else{step(t,'ALEISTER_SEARCH',pass);assert.equal(cards(t,0,'hand',I.INVOCATION).length,1);assert.equal(t.state.used.SALAMANGREAT_WOLF_FIRE,undefined);}assert.equal(t.state.pendingTriggers.length,0);replay(t);
 });
 await test('A mandatory Azure arrival into a pointed zone remains excluded before its Spirit tribute cost while Spark is a supported choice',()=>{
  const t=make({placements:[monster(0,I.WOLF,5),monster(0,I.BEWD,0),monster(0,I.SPIRIT,1,{declaredSummonType:'SYNCHRO',properlySummoned:true}),gy(0,I.ASH)],extra:[[I.AZURE,I.SPARK],[]]}),spirit=uid(t,0,'monster',I.SPIRIT),azure=uid(t,0,'extra',I.AZURE);assert(!actions(t,'SPIRIT_DRAGON_TRIBUTE_SYNCHRO').some(a=>a.summonUid===azure));reject(t,{type:'SPIRIT_DRAGON_TRIBUTE_SYNCHRO',player:0,sourceUid:spirit,summonUid:azure});assert.equal(locate(t,spirit).zone,'monster');assert.equal(locate(t,azure).zone,'extra');step(t,'SPIRIT_DRAGON_TRIBUTE_SYNCHRO',a=>id(locate(t,a.summonUid).item)===I.SPARK&&pass(a));assert.equal(pending(t).length,1);decline(t);replay(t);
 });
 await test('QA-only two-controller simultaneous Wolf geometry rejects an unregistered joint packet before Artemis materials',()=>{
  const t=make({extra:[[I.ARTEMIS],[]],placements:[monster(0,I.WOLF,1),monster(1,I.WOLF,3),monster(0,I.ALEISTER,0),gy(0,I.ASH),gy(1,I.ASH)]}),source=uid(t,0,'monster',I.ALEISTER),diagnostic=copy(t.state);H.move(diagnostic,uid(t,1,'monster',I.WOLF),'gy');const a=E.enumerate(diagnostic).find(a=>a.type==='LINK_ARTEMIS'&&a.materialUids.includes(source));assert(a);assert.equal(actions(t,'LINK_ARTEMIS').length,0);reject(t,a);assert.equal(locate(t,source).zone,'monster');assert.equal(pending(t).length,0);
 });

 await test('FIRE recovery selects a technically matched non-Salamangreat monster at resolution and emits no TARGET event',()=>{
  const {t,wolf}=fireOpportunity(),ash=uid(t,0,'gy',I.ASH),choices=actions(t,FIRE).filter(a=>a.sourceUid===wolf);assert(choices.some(a=>a.selectionUid===ash));assert(choices.every(a=>a.selectionUid===a.targetUid));const r=step(t,FIRE,a=>a.selectionUid===ash&&pass(a));assert.equal(locate(t,ash).zone,'hand');assert(!r.action.events.some(e=>e.type==='TARGET'));assert(!r.action.paid.some(p=>p.uid===ash));assert.equal(t.state.used.SALAMANGREAT_WOLF_FIRE,true);replay(t);
 });
 await test('Legacy targetUid recovery input is normalized to a non-targeting resolution selection',()=>{
  const {t}=fireOpportunity(),a=actions(t,FIRE).find(pass),legacy={...a,targetUid:a.selectionUid};delete legacy.selectionUid;const before=JSON.stringify(t.state),r=E.execute(t.state,legacy);assert.equal(r.pass,true,JSON.stringify(r));assert.equal(JSON.stringify(t.state),before);assert.equal(r.action.selectionUid,a.selectionUid);assert.equal(r.action.targetUid,a.selectionUid);assert(!r.action.events.some(e=>e.type==='TARGET'));t.state=r.after;t.actions.push(r.action);replay(t);
 });
 await test('A recovered FIRE Link returns to Extra and installs no same-name summon restriction',()=>{const {t}=fireOpportunity({placements:[gy(0,I.BALELYNX)]}),link=uid(t,0,'gy',I.BALELYNX);step(t,FIRE,a=>selected(a,link)&&pass(a));assert.equal(locate(t,link).zone,'extra');assert(!t.state.locks.some(l=>l.kind==='SALAMANGREAT_WOLF_NAME_LOCK'));replay(t);});
 await test('FIRE recovery admits a technically matched FIRE monster outside every registered summon family',()=>{
  const {t}=fireOpportunity({placements:[gy(0,102380)]}),target=uid(t,0,'gy',102380);assert.equal(W.YGODataCatalog.rulesCard(102380).name,'Lava Golem');assert.equal(W.YGODataCatalog.rulesCard(102380).technicalSourceMatched,true);step(t,FIRE,a=>selected(a,target)&&pass(a));assert.equal(locate(t,target).zone,'hand');assert(t.state.locks.some(l=>l.kind==='SALAMANGREAT_WOLF_NAME_LOCK'&&l.cardId===102380));replay(t);
 });
 await test('QA-only a pending Wolf source which leaves or becomes facedown cannot activate an old arrival opportunity',()=>{
  const {t,wolf}=fireOpportunity(),a=actions(t,FIRE).find(pass);assert(a);replay(t);for(const change of ['left','facedown']){const diagnostic=copy(t.state);if(change==='left')H.move(diagnostic,wolf,'gy');else H.locate(diagnostic,wolf).item.faceUp=false;const candidate={...t,state:diagnostic};assert.equal(actions(candidate,FIRE).length,0);reject(candidate,a);assert.equal(candidate.state.used.SALAMANGREAT_WOLF_FIRE,undefined);}
 });
 await test('QA-only player 1 control with player 0 ownership uses player 1 HOPT, player 0 physical response costs and owner-directed departure',()=>{
  const t=make({activePlayer:1,phase:'MAIN 2',hands:[[I.VEILER],[I.FISH]],placements:[monster(1,I.WOLF,5),monster(1,I.BEWD,0),monster(0,I.MECHABA,0),gy(1,I.ASH)],responseTypes:['MECHABA']}),wolf=uid(t,1,'monster',I.WOLF);H.locate(t.state,wolf).item.ownerPlayer=0;
  step(t,'DUEL_NORMAL_SUMMON_OR_SET',a=>a.player===1&&a.sourceUid===uid(t,1,'hand',I.FISH)&&a.position==='ATTACK'&&pass(a));const ash=uid(t,1,'gy',I.ASH),r=step(t,FIRE,a=>a.player===1&&selected(a,ash)&&a.response?.type==='MECHABA'&&!a.counterResponses);assert.equal(r.action.response.player,0);assert.equal(locate(t,r.action.response.costUid).player,0);assert.equal(locate(t,r.action.response.costUid).zone,'gy');assert.equal(locate(t,wolf).player,0);assert.equal(locate(t,wolf).zone,'banished');assert.equal(locate(t,ash).zone,'gy');assert.equal(t.state.used['SALAMANGREAT_WOLF_FIRE:1'],true);assert.equal(t.state.used.SALAMANGREAT_WOLF_FIRE,undefined);
 });
 await test('A physical FIRE hand recovery blocks alias-family Normal Summon, Normal Set and Reborn before spending resources',()=>{
  const t=make({phase:'MAIN 2',hands:[[I.BURST_ALT],[]],placements:[monster(0,I.WOLF,5),monster(0,I.BEWD,0),monster(0,I.SPIRIT,1,{declaredSummonType:'SYNCHRO',properlySummoned:true}),gy(0,I.BURST),gy(0,I.BURST_ALT)],extra:[[I.SPARK],[]]}),wolf=uid(t,0,'monster',I.WOLF),recovered=uid(t,0,'gy',I.BURST),target=cards(t,0,'gy',I.BURST).find(x=>x.uid!==recovered).uid,hand=uid(t,0,'hand',I.BURST_ALT);
  const normal=actions(t,'NORMAL_SUMMON').find(a=>a.sourceUid===hand),normalSet=actions(t,'DUEL_NORMAL_SUMMON_OR_SET').find(a=>a.sourceUid===hand&&a.position==='SET'),reborn=actions(t,REBORN).find(a=>a.targetUid===target&&a.destination===2&&pass(a));assert(normal);assert(normalSet);assert(reborn);
  step(t,'SPIRIT_DRAGON_TRIBUTE_SYNCHRO',a=>a.player===0&&id(locate(t,a.summonUid).item)===I.SPARK&&pass(a));step(t,FIRE,a=>selected(a,recovered)&&pass(a));const lock=t.state.locks.find(l=>l.kind==='SALAMANGREAT_WOLF_NAME_LOCK');assert(lock);assert.equal(lock.appliesToPlayer,0);assert.equal(lock.wholeTurn,true);assert.equal(lock.untilTurn,t.state.turn);
  assert.equal(H.wolfNameAllowed(t.state,0,locate(t,hand).item),false);assert.equal(H.wolfNameAllowed(t.state,1,locate(t,hand).item),true);assert(!actions(t,REBORN).some(a=>a.targetUid===target));reject(t,reborn);
  assert(!actions(t,'NORMAL_SUMMON').some(a=>a.sourceUid===hand));assert(!actions(t,'DUEL_NORMAL_SUMMON_OR_SET').some(a=>a.sourceUid===hand));reject(t,normal);reject(t,normalSet);assert.equal(t.state.normalSummonAvailable[0],true);assert.equal(locate(t,hand).zone,'hand');assert.equal(locate(t,target).zone,'gy');assert.equal(locate(t,reborn.sourceUid).zone,'hand');assert.equal(locate(t,wolf).zone,'monster');replay(t);
 });
 await test('Actual CED Wolf departure preserves its installed hand-recovery name lock through End Phase and turn cleanup removes it',()=>{
  const {t,wolf}=fireOpportunity({placements:[set(0,I.CED)]}),ash=uid(t,0,'gy',I.ASH);step(t,FIRE,a=>selected(a,ash)&&pass(a));step(t,'ACTIVATE_COMPULSORY_EVACUATION_DEVICE',a=>a.targetUid===wolf&&pass(a));assert.equal(locate(t,wolf).zone,'extra');assert.equal(H.wolfNameAllowed(t.state,0,locate(t,ash).item),false);
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='END');assert(t.state.locks.some(l=>l.kind==='SALAMANGREAT_WOLF_NAME_LOCK'));step(t,'DUEL_NEXT_TURN');assert(!t.state.locks.some(l=>l.kind==='SALAMANGREAT_WOLF_NAME_LOCK'));assert.equal(H.wolfNameAllowed(t.state,0,locate(t,ash).item),true);replay(t);
 });
 for(const responseType of ['MECHABA','ROAR','IMPERM','VEILER'])await test('A real '+responseType+' response consumes Wolf FIRE use and its physical response without inventing recovery or a name lock',()=>{
  const placements=responseType==='MECHABA'?[monster(1,I.MECHABA,0)]:responseType==='ROAR'?[monster(1,I.WOLF,5),set(1,I.ROAR,0)]:[],hands=responseType==='MECHABA'?[[],[I.VEILER]]:responseType==='IMPERM'?[[],[I.IMPERM]]:responseType==='VEILER'?[[],[I.VEILER]]:[[],[]];
  const {t,wolf}=fireOpportunity({hands,placements,responseTypes:[responseType]}),ash=uid(t,0,'gy',I.ASH);const a=actions(t,FIRE).find(a=>selected(a,ash)&&a.response?.type===responseType&&!a.counterResponses);assert(a);const responseUid=a.response.uid,cost=a.response.costUid;
  const r=step(t,FIRE,x=>selected(x,ash)&&x.response?.type===responseType&&!x.counterResponses);assert.equal(r.action.proof.effectNegated,true);assert.equal(t.state.used.SALAMANGREAT_WOLF_FIRE,true);assert.equal(locate(t,ash).zone,'gy');assert.equal(pending(t,wolf).length,0);assert(!t.state.locks.some(l=>l.kind==='SALAMANGREAT_WOLF_NAME_LOCK'));
  if(responseType==='MECHABA'){assert.equal(locate(t,cost).zone,'gy');assert(r.action.paid.some(p=>p.uid===cost&&p.kind==='SEND_GY'));assert.equal(locate(t,wolf).zone,'banished');}
  else if(responseType==='ROAR'){assert.equal(locate(t,responseUid).zone,'gy');assert.equal(locate(t,wolf).zone,'gy');assert.equal(r.action.proof.activationNegated,true);}
  else{assert.equal(locate(t,responseUid).zone,'gy');assert.equal(locate(t,wolf).item.effectsNegated,true);}replay(t);
 });
 await test('Physical Impermanence negation leaves Wolf arrows and permits a later observed trigger which resolves negated and consumes USE',()=>{
  const {t,wolf}=reincarnated({hands:[[],[I.IMPERM]],placements:[gy(0,I.ROAR),gy(0,I.ASH),gy(0,I.BURST)],responseTypes:['IMPERM']});decline(t,'SALAMANGREAT_ROAR_SET');step(t,ST,a=>a.response?.type==='IMPERM');assert.equal(locate(t,wolf).item.effectsNegated,true);step(t,REBORN,a=>a.targetUid===uid(t,0,'gy',I.BURST)&&a.destination===1&&pass(a));assert.equal(pending(t,wolf).length,1);
  const ash=uid(t,0,'gy',I.ASH),r=step(t,FIRE,a=>selected(a,ash)&&pass(a));assert.equal(r.action.proof.effectNegated,true);assert.equal(locate(t,ash).zone,'gy');assert.equal(t.state.used.SALAMANGREAT_WOLF_FIRE,true);replay(t);
 });

 await test('An ordinary two-material Link using Wolf qualifies for ST recovery and Roar GY set without Sanctuary',()=>{
  const {t,wolf,first}=reincarnated({placements:[gy(0,I.ROAR)]});assert.equal(locate(t,wolf).item.reincarnated,true);assert.equal(locate(t,wolf).item.summonType,'LINK');assert.equal(locate(t,first).zone,'gy');assert.equal(cards(t,0,'spelltrap',I.SANCTUARY).length,0);assert(t.state.pendingTriggers.some(x=>x.kind==='SALAMANGREAT_ROAR_SET'));decline(t,'SALAMANGREAT_ROAR_SET');const roar=uid(t,0,'gy',I.ROAR),r=step(t,ST,a=>a.sourceUid===wolf&&selected(a,roar)&&pass(a));assert.equal(locate(t,roar).zone,'hand');assert.equal(t.state.used.SALAMANGREAT_WOLF_ST,true);assert(!r.action.events.some(e=>e.type==='TARGET'));replay(t);
 });
 await test('Ordinary Wolf-as-material Link also permits the actual optional Roar GY set packet',()=>{
  const {t,wolf}=reincarnated({placements:[gy(0,I.ROAR)]}),roar=uid(t,0,'gy',I.ROAR);step(t,'SALAMANGREAT_ROAR_SET_FROM_GY',a=>a.sourceUid===roar&&pass(a));assert.equal(locate(t,roar).zone,'spelltrap');assert.equal(locate(t,roar).item.faceUp,false);assert.equal(locate(t,wolf).item.reincarnated,true);replay(t);
 });
 for(const targetId of [I.CIRCLE,I.GIFT])await test('A genuine Wolf-as-material Link can recover technically matched Salamangreat S/T '+targetId+' outside the old named allowlist',()=>{
  const {t,wolf}=reincarnated({placements:[gy(0,targetId),gy(0,I.CED)]}),target=uid(t,0,'gy',targetId),other=uid(t,0,'gy',I.CED);assert.equal(W.YGODataCatalog.rulesCard(targetId).technicalSourceMatched,true);assert(!actions(t,ST).some(a=>selected(a,other)));const r=step(t,ST,a=>a.sourceUid===wolf&&selected(a,target)&&pass(a));assert.equal(locate(t,target).zone,'hand');assert(!r.action.events.some(e=>e.type==='TARGET'));replay(t);
 });
 await test('A properly reincarnated Wolf loses current Link ST eligibility after actual battle and Reborn while preserving qualification',()=>{
  const {t,wolf}=reincarnated({placements:[gy(0,I.ROAR),monster(1,I.BEWD,2)]});decline(t);assert(actions(t,ST).length>0);battle(t,wolf);step(t,REBORN,a=>a.targetUid===wolf&&a.destination===1&&pass(a));const x=locate(t,wolf).item;assert.equal(x.properSummonType,'LINK');assert.equal(x.summonType,'SPECIAL');assert.equal(x.reincarnated,undefined);assert.equal(actions(t,ST).length,0);assert(!t.state.pendingTriggers.some(x=>x.kind==='SALAMANGREAT_ROAR_SET'));replay(t);
 });
 await test('FIRE HOPT persists across actual Wolf battle and revival and a different physical Wolf copy',()=>{
  const t=make({hands:[[I.FISH],[]],extra:[[I.WOLF],[]],placements:[monster(0,I.WOLF,0),monster(0,I.GAZELLE,2),monster(0,I.SPINNY,3),monster(1,I.BEWD,2),gy(0,I.ASH)]}),other=uid(t,0,'monster',I.WOLF);step(t,'SALAMANGREAT_LINK_WOLF',a=>a.materialUids.includes(uid(t,0,'monster',I.GAZELLE))&&a.materialUids.includes(uid(t,0,'monster',I.SPINNY))&&pass(a));const wolf=cards(t,0,'monster',I.WOLF).find(x=>x.uid!==other).uid;step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.FISH)&&pass(a));const ash=uid(t,0,'gy',I.ASH);step(t,FIRE,a=>a.sourceUid===wolf&&selected(a,ash)&&pass(a));battle(t,wolf);step(t,REBORN,a=>a.targetUid===wolf&&a.destination===2&&pass(a));assert.equal(actions(t,FIRE).length,0);assert.equal(t.state.used.SALAMANGREAT_WOLF_FIRE,true);assert.equal(locate(t,other).zone,'monster');replay(t);
 });
 await test('ST HOPT is USE even when a real Mechaba response negates activation and banishes the physical Wolf',()=>{
  const {t,wolf}=reincarnated({placements:[gy(0,I.ROAR),monster(1,I.MECHABA,0),monster(1,I.BEWD,2)],hands:[[],[I.VEILER]],responseTypes:['MECHABA']});decline(t);const roar=uid(t,0,'gy',I.ROAR),r=step(t,ST,a=>selected(a,roar)&&a.response?.type==='MECHABA'&&!a.counterResponses);assert.equal(r.action.proof.activationNegated,true);assert.equal(t.state.used.SALAMANGREAT_WOLF_ST,true);assert.equal(locate(t,roar).zone,'gy');assert.equal(locate(t,wolf).zone,'banished');assert.equal(actions(t,ST).length,0);replay(t);
 });
 await test('ST HOPT spans a third genuine Link copy and revival of the previous properly summoned Wolf after a real Veiler response',()=>{
  const {t,wolf}=reincarnated({extra:[[I.WOLF],[]],placements:[gy(0,I.ROAR),monster(0,I.GAZELLE,4)],hands:[[],[I.VEILER]],responseTypes:['VEILER']});decline(t);const roar=uid(t,0,'gy',I.ROAR);step(t,ST,a=>selected(a,roar)&&a.response?.type==='VEILER');assert.equal(t.state.used.SALAMANGREAT_WOLF_ST,true);assert.equal(locate(t,wolf).item.effectsNegated,true);
  step(t,'SALAMANGREAT_LINK_WOLF',a=>a.materialUids.includes(wolf)&&a.materialUids.includes(uid(t,0,'monster',I.GAZELLE))&&pass(a));decline(t);const current=uid(t,0,'monster',I.WOLF);assert.notEqual(current,wolf);assert.equal(locate(t,current).item.reincarnated,true);assert.equal(locate(t,current).item.summonType,'LINK');assert.equal(actions(t,ST).length,0);step(t,REBORN,a=>a.targetUid===wolf&&a.destination===1&&pass(a));decline(t);assert.equal(locate(t,wolf).item.summonType,'SPECIAL');assert.equal(locate(t,wolf).item.properSummonType,'LINK');assert.equal(t.state.used.SALAMANGREAT_WOLF_ST,true);assert.equal(actions(t,ST).length,0);assert.equal(locate(t,roar).zone,'gy');replay(t);
 });
 await test('A paid real Shaman prohibition excludes an Extra-summoned Wolf activation before payment with an explicit reason',()=>{
  const t=make({hands:[[I.FISH],[]],extra:[[I.WOLF],[]],placements:[monster(0,I.SHAMAN,4),monster(0,I.GAZELLE,0),monster(0,I.SPINNY,2),gy(0,I.ADHARA),gy(0,I.ASH)]});step(t,'SALAMANGREAT_LINK_WOLF',pass);const wolf=uid(t,0,'monster',I.WOLF);decline(t);step(t,'TENYI_SHAMAN_REVIVE',a=>a.targetUid===uid(t,0,'gy',I.ADHARA)&&a.discardUid===uid(t,0,'hand',I.FISH)&&a.destination===1&&pass(a));assert(t.state.locks.some(l=>l.kind==='TENYI_EXTRA_EFFECTS_ONLY'));assert.equal(actions(t,FIRE).length,0);assert.equal(t.state.used.SALAMANGREAT_WOLF_FIRE,undefined);assert(!pending(t,wolf).length);assert(t.state.events.some(e=>/WOLF.*(?:PROHIBITED|FORBIDDEN)|(?:PROHIBITED|FORBIDDEN).*WOLF/.test(e.type)));replay(t);
 });
 await test('Unreviewed face-up continuous restrictions exclude Wolf GY recovery without spending the physical source, selection or use',()=>{
  const {t,wolf}=fireOpportunity(),ash=uid(t,0,'gy',I.ASH),a=actions(t,FIRE).find(a=>selected(a,ash)&&pass(a));assert(a);replay(t);const diagnostic=copy(t.state),unknown=diagnostic.zones[1].deck.find(x=>id(x)===I.UNKNOWN);
  // A diagnostic may use an existing physical card only; its unreviewed
  // presence is not a legal witness or a certified unknown-effect line.
  if(!unknown){const t2=fireOpportunity({placements:[monster(1,I.UNKNOWN,0)]}).t;assert.equal(actions(t2,FIRE).length,0);assert.equal(t2.state.used.SALAMANGREAT_WOLF_FIRE,undefined);return;}
  H.move(diagnostic,unknown.uid,'monster',{player:1,zoneIndex:0,faceUp:true});t.state=diagnostic;assert.equal(actions(t,FIRE).length,0);reject(t,a);assert.equal(locate(t,wolf).zone,'monster');assert.equal(locate(t,ash).zone,'gy');assert.equal(t.state.used.SALAMANGREAT_WOLF_FIRE,undefined);
 });
 await test('Fresh replay rejects forged Wolf qualification, geometry, recovery UID, response cost and reported name lock',()=>{
  const {t,wolf}=route({hands:[[I.ALEISTER],[I.VEILER]],cards:[[I.INVOCATION],[]],extra:[[I.ARTEMIS],[]],placements:[gy(0,I.ASH),monster(1,I.MECHABA,0)],responseTypes:['MECHABA']});step(t,REBORN,a=>a.targetUid===wolf&&a.destination===1&&pass(a));step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.ALEISTER)&&pass(a));decline(t);step(t,'LINK_ARTEMIS',pass);const ash=uid(t,0,'gy',I.ASH);step(t,FIRE,a=>selected(a,ash)&&a.response?.type==='MECHABA'&&!a.counterResponses);const good=replay(t);
  for(const mutate of [l=>{l.actions.find(a=>a.type===REBORN).destination=3;},l=>{l.actions.at(-1).selectionUid='forged';},l=>{l.actions.at(-1).targetUid='different-from-selection';},l=>{l.actions.at(-1).nonTargeting=false;},l=>{l.actions.at(-1).selectionAtResolution=false;},l=>{l.actions.at(-1).paid.find(p=>p.kind==='SEND_GY').uid='invented-cost';},l=>{l.after.zones[0].banished.find(x=>x.uid===wolf).properSummonType='FUSION';},l=>{l.after.locks.push({kind:'SALAMANGREAT_WOLF_NAME_LOCK',cardId:I.ASH,wholeTurn:true,appliesToPlayer:0,untilTurn:l.after.turn});},l=>{l.after.pendingTriggers.push({kind:'SALAMANGREAT_WOLF_FIRE',sourceUid:wolf,summonedUid:'invented'});}]){const bad=copy(good);mutate(bad);bad.state=copy(bad.after);assert.equal(E.replay(bad,{deck:t.deck}).pass,false);}
 });
 await test('Closed bounded search finds a genuine Wolf Link battle revival continuation and every returned line freshly replays',async()=>{
  const {t,wolf}=route({hands:[[30606547,30606547,30606547,10000000],[]]}),r=await E.search(t.initial,{goal:s=>s.zones[0].monster.some(x=>x.uid===wolf&&x.zoneIndex===1&&x.summonOriginZone==='gy'&&x.properSummonType==='LINK'),maxDepth:5,maxStates:1200,maxMs:15000,checkCurrentDeck:false});assert.equal(r.pass,true);assert(r.lines.length>0,JSON.stringify({status:r.status,expanded:r.expanded,budgetReasons:r.budgetReasons}));for(const line of r.lines){assert(line.actions.some(a=>a.type==='SALAMANGREAT_LINK_WOLF'));assert(line.actions.some(a=>a.type==='DUEL_ATTACK'));assert(line.actions.some(a=>a.type===REBORN));assert.equal(E.replay(line,{deck:t.deck}).pass,true);}assert.equal(r.certified,false);assert.equal(r.globalOptimalityProven,false);
 });
 const report={schema:'ygo-wolf-revival-tests/v1',pass:tests.every(x=>x.pass),total:tests.length,tests,limitations:[
  'Pinned CDB and ProjectIgnis Lua are secondary technical evidence, not a newly authenticated official ruling; Lua is never evaluated.',
  'Only actual registered Link, battle and Reborn actions witness Wolf qualification. Declared initial fields are assumptions; QA-only mutations never establish a legal witness.',
  'The fixed left Extra Monster Zone model and reviewed action registry are bounded. General SEGOC, control transfer, arbitrary response priority and unsupported continuous/GY restrictions are excluded.',
  'Both-player Normal and Special arrivals use real registered actions. Opponent Spirit prior history in the Spark arrival fixture is a declared scenario assumption, not a registered opponent Synchro proof.',
  'Search is bounded, uncertified and does not prove global optimality or competitive tournament performance.'
 ]};fs.writeFileSync(path.join(ROOT,'tests/wolf-revival-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));process.exitCode=report.pass?0:1;
})().catch(error=>{console.error(error);process.exitCode=1;});

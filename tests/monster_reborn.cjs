'use strict';
/* Monster Reborn over the pinned physical catalogue and TCG application
 * restriction snapshot. Extra Deck history is established by actual registered
 * summons followed by actual battle destruction, never by initial metadata. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const {harness,ROOT}=require('./combo_engine.cjs');
const copy=structuredClone,TYPE='ACTIVATE_MONSTER_REBORN';
const I={REBORN:83764718,CED:94192409,IMPERM:10045474,MECHABA:75286621,
 SPIRIT:59822133,ROAR:51339637,WOLF:87871125,BEWD:89631139,SAGE:8240199,
 ALEISTER:86120751,INVOCATION:74063034,ARTEMIS:34755994,MOYE:20001443,
 LONGYUAN:93490856,CHIXIAO:69248256,ASHUNA:87052196,ADHARA:98159737,MONK:32519092,
 SHTHANA:24557335,BRANDED_FUSION:44362883,ALBAZ:68468459,DARK_MAGICIAN:46986414,
 LUBELLION:70534340,MIRRORJADE:44146295,ASH:14558127,GAZELLE:26889158,
 UNKNOWN:38033121,XYZ:16195942,PENDULUM:70026064};

(async()=>{
 const {W,E,fixture}=await harness(true),H=E.helpers,tests=[];
 for(const module of ['duel-phases','responses','archetypes-expanded','blue-eyes-duel','monster-reborn'])
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
  if(o.target!==false)placements.push(gy(o.targetPlayer??0,o.targetId??I.BEWD,o.targetProperties||{}));
  if(o.mechaba){placements.push(monster(1,I.MECHABA,0));wanted[1].push(o.cost??I.INVOCATION);}
  if(o.ownRoar)placements.push(monster(0,I.WOLF,5),set(0,I.ROAR,0));
  if(o.opponentRoar)placements.push(monster(1,I.WOLF,5),set(1,I.ROAR,4));
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

 await test('Monster Reborn is the exact fourth registered single Normal Spell, also registered for physical Spell negation',()=>{
  const row=E.capabilities().normalSpellActivations.find(x=>x.type===TYPE);assert(row);
  assert.equal(row.cardId,I.REBORN);assert.equal(row.restriction,'NONE');assert.equal(row.activationZone,'spelltrap');
  assert.equal(E.capabilities().normalSpellActivations.length,4);assert.equal(Number(W.YGODataCatalog.rulesCard(I.REBORN).typeBits),2);
  assert(Array.from(W.YGOResponses.capabilities().mechabaNormalSpellActivations).includes(TYPE));
 });
 for(const owner of [0,1])for(const destination of [0,1,2,3,4])for(const position of ['ATTACK','DEFENSE'])await test('Main GY owner '+owner+' revives under controller 0 in Main '+destination+' '+position,()=>{
  const t=make({targetPlayer:owner}),target=uid(t,owner,'gy',I.BEWD),source=uid(t,0,'hand',I.REBORN),normal=copy(t.state.normalSummonAvailable);
  const used=copy(t.state.used),history=copy(t.state.extraHistory),r=step(t,TYPE,select(target,destination,position));packet(r,source,target);
  const hit=locate(t,target);assert.equal(hit.player,0);assert.equal(hit.zone,'monster');assert.equal(hit.item.ownerPlayer,owner);
  assert.equal(hit.item.zoneIndex,destination);assert.equal(hit.item.position,position);assert.equal(hit.item.faceUp,true);
  assert.equal(hit.item.summonType,'SPECIAL');assert.equal(hit.item.summonTurn,2);assert.equal(locate(t,source).zone,'gy');
  assert.equal(r.action.paid.length,0);assert.equal(r.action.proof.activationNegated,false);
  assert.deepEqual(t.state.used,used);assert.deepEqual(t.state.extraHistory,history);assert.deepEqual(t.state.normalSummonAvailable,normal);
  assert(r.action.events.some(e=>e.type==='NORMAL_SPELL_RESOLUTION_CLEANUP'&&e.uid===source));replay(t);
 });
 await test('One physical Reborn chooses between both GYs without moving an unselected copy',()=>{
  const t=make({placements:[gy(1,I.DARK_MAGICIAN)]}),own=uid(t,0,'gy',I.BEWD),other=uid(t,1,'gy',I.DARK_MAGICIAN);
  assert(options(t).some(a=>a.targetUid===own));assert(options(t).some(a=>a.targetUid===other));step(t,TYPE,select(other,3));
  assert.equal(locate(t,own).zone,'gy');assert.equal(locate(t,other).player,0);assert.equal(locate(t,other).item.ownerPlayer,1);replay(t);
 });
 await test('Real opponent-owned revival followed by CED returns that same UID to its owner hand',()=>{
  const t=make({targetPlayer:1,placements:[set(0,I.CED,1)]}),target=uid(t,1,'gy',I.BEWD);
  step(t,TYPE,select(target,4));assert.equal(locate(t,target).player,0);assert.equal(locate(t,target).item.ownerPlayer,1);
  step(t,'ACTIVATE_COMPULSORY_EVACUATION_DEVICE',a=>a.player===0&&a.targetUid===target&&pass(a));
  assert.equal(locate(t,target).zone,'hand');assert.equal(locate(t,target).player,1);assert.equal(locate(t,target).item.ownerPlayer,1);replay(t);
 });
 await test('Outcome identity preserves physical owners by zone for identical controlled monsters and real CED returns',()=>{
  const lines=[];
  for(const foreignZone of [1,0]){
   const t=make({targetPlayer:1,placements:[monster(0,I.BEWD,1-foreignZone),set(0,I.CED,2)]}),foreign=uid(t,1,'gy',I.BEWD);
   step(t,TYPE,select(foreign,foreignZone));const own=cards(t,0,'monster',I.BEWD).find(x=>x.ownerPlayer===0);assert(own);
   assert.equal(locate(t,foreign).item.ownerPlayer,1);assert.equal(t.state.zones[0].monster.length,2);replay(t);
   if(foreignZone===1){
    // QA-only projection isolates ownership from DECLARED versus SPECIAL
    // starting history. It is never submitted as an executable game line.
    const diagnostic=copy(t.state),a=H.locate(diagnostic,own.uid).item,b=H.locate(diagnostic,foreign).item;
    for(const key of ['summonType','summonTurn','properlySummoned','properSummonType','declaredSummonType','sentToGyTurn']){
     if(b[key]===undefined)delete a[key];else a[key]=copy(b[key]);
    }
    const swapped=copy(diagnostic),first=H.locate(swapped,own.uid).item,second=H.locate(swapped,foreign).item;
    [first.zoneIndex,second.zoneIndex]=[second.zoneIndex,first.zoneIndex];
    assert.notEqual(E.outcomeKey(diagnostic),E.outcomeKey(swapped),'Owners at different Main zones have different future returns');
    // Restoring per-zone owners alone restores the canonical state: this
    // assertion prevents unrelated current-summon metadata hiding a bug.
    [first.ownerPlayer,second.ownerPlayer]=[second.ownerPlayer,first.ownerPlayer];
    assert.equal(E.outcomeKey(diagnostic),E.outcomeKey(swapped));
   }
   const atZero=t.state.zones[0].monster.find(x=>x.zoneIndex===0),owner=atZero.ownerPlayer;
   step(t,'ACTIVATE_COMPULSORY_EVACUATION_DEVICE',a=>a.player===0&&a.targetUid===atZero.uid&&pass(a));
   assert.equal(locate(t,atZero.uid).zone,'hand');assert.equal(locate(t,atZero.uid).player,owner);replay(t);lines.push(owner);
  }
  assert.deepEqual(lines,[0,1]);
 });
 await test('A revived opponent-owned monster destroyed in real mutual battle returns to the owner GY',()=>{
  const t=make({targetPlayer:1,placements:[monster(1,I.BEWD,2)]}),target=uid(t,1,'gy',I.BEWD),rival=uid(t,1,'monster',I.BEWD);
  step(t,TYPE,select(target));assert.equal(locate(t,target).player,0);assert.equal(locate(t,target).item.ownerPlayer,1);
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='BATTLE');step(t,'DUEL_ATTACK',a=>a.attackerUid===target&&a.targetUid===rival&&pass(a));
  assert.equal(locate(t,target).zone,'gy');assert.equal(locate(t,target).player,1);assert.equal(locate(t,target).item.ownerPlayer,1);
  assert.equal(locate(t,rival).zone,'gy');assert.equal(locate(t,rival).player,1);assert.equal(cards(t,0,'gy',I.BEWD).length,0);assert.equal(cards(t,1,'gy',I.BEWD).length,2);replay(t);
 });
 await test('A revived opponent-owned Aleister used by a real Artemis Link Summon goes to the owner GY',()=>{
  const t=make({targetPlayer:1,targetId:I.ALEISTER,extra:[[I.ARTEMIS],[]]}),target=uid(t,1,'gy',I.ALEISTER);
  step(t,TYPE,select(target));assert.equal(locate(t,target).player,0);assert.equal(locate(t,target).item.ownerPlayer,1);assert.equal(t.state.pendingTriggers.length,0);
  step(t,'LINK_ARTEMIS',a=>a.materialUids.includes(target)&&pass(a));assert.equal(locate(t,target).zone,'gy');assert.equal(locate(t,target).player,1);
  assert.equal(cards(t,0,'gy',I.ALEISTER).length,0);const artemis=cards(t,0,'monster',I.ARTEMIS)[0];assert(artemis);
  assert.equal(artemis.ownerPlayer,0);assert.equal(artemis.properSummonType,'LINK');assert.equal(artemis.properlySummoned,true);assert.equal(t.state.normalSummonAvailable[0],true);replay(t);
 });
 await test('Actual Artemis and Invocation establish Fusion history which survives battle and revival',()=>{
  const t=invoked(),target=uid(t,0,'monster',I.MECHABA),source=uid(t,0,'hand',I.REBORN);
  assert.equal(locate(t,target).item.properSummonType,'FUSION');assert.equal(locate(t,target).item.properlySummoned,true);
  battleToGY(t,target);assert.equal(t.state.lp[0],7500);const used=copy(t.state.used),history=copy(t.state.extraHistory);
  const r=step(t,TYPE,select(target,4,'DEFENSE'));packet(r,source,target);
  assert.equal(locate(t,target).item.summonType,'SPECIAL');assert.equal(locate(t,target).item.properSummonType,'FUSION');assert.equal(locate(t,target).item.properlySummoned,true);
  assert.equal(locate(t,target).item.zoneIndex,4);assert.deepEqual(t.state.extraHistory,history);assert.deepEqual(t.state.used,used);replay(t);
 });
 await test('Actual Artemis Link Summon and battle respect its Special Summon limit, then permit Main-zone revival on a later turn',()=>{
  const t=make({target:false,hands:[[I.ALEISTER],[]],extra:[[I.ARTEMIS],[]],placements:[monster(1,I.BEWD,2)]});
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.ALEISTER)&&pass(a));decline(t);step(t,'LINK_ARTEMIS',pass);
  const target=uid(t,0,'monster',I.ARTEMIS);assert.equal(locate(t,target).item.properSummonType,'LINK');battleToGY(t,target);
  assert.equal(t.state.lp[0],5800);assert(!options(t).some(a=>a.targetUid===target),'Artemis permits only one Special Summon per turn');
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='END');step(t,'DUEL_NEXT_TURN');step(t,'DUEL_DRAW_FOR_TURN',pass);
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='STANDBY');step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='MAIN 1');
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='END');step(t,'DUEL_NEXT_TURN');step(t,'DUEL_DRAW_FOR_TURN',pass);
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='STANDBY');step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='MAIN 1');
  assert(options(t).some(a=>a.targetUid===target));assert(!options(t).some(a=>a.targetUid===target&&(a.position==='DEFENSE'||a.destination===5)));
  step(t,TYPE,select(target,2));assert.equal(locate(t,target).item.properSummonType,'LINK');assert.equal(locate(t,target).item.summonType,'SPECIAL');replay(t);
 });
 await test('Actual Tenyi hand Special Summon and Monk Link history permit a same-turn Main-zone revival after battle',()=>{
  const t=make({target:false,hands:[[I.ASHUNA],[]],extra:[[I.MONK],[]],placements:[monster(1,I.BEWD,2)]});
  step(t,'TENYI_HAND_SPECIAL',a=>a.sourceUid===uid(t,0,'hand',I.ASHUNA)&&pass(a));step(t,'TENYI_LINK_MONK',pass);
  const target=uid(t,0,'monster',I.MONK);assert.equal(locate(t,target).item.properSummonType,'LINK');battleToGY(t,target);
  assert.equal(t.state.lp[0],6000);assert(options(t).some(a=>a.targetUid===target));assert(!options(t).some(a=>a.targetUid===target&&(a.position==='DEFENSE'||a.destination===5)));
  step(t,TYPE,select(target,4));assert.equal(locate(t,target).item.properlySummoned,true);assert.equal(locate(t,target).item.summonType,'SPECIAL');replay(t);
 });
 await test('Actual Mo Ye Token and Chixiao Synchro history survive battle and Reborn without repeating search or draw',()=>{
  const t=make({target:false,hands:[[I.MOYE,I.LONGYUAN],[]],extra:[[I.CHIXIAO],[]],placements:[monster(1,I.BEWD,2)]});
  step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.MOYE)&&pass(a));step(t,'MOYE_TOKEN',a=>a.revealUid===uid(t,0,'hand',I.LONGYUAN)&&pass(a));
  step(t,'SYNCHRO_CHIXIAO',pass);decline(t);const target=uid(t,0,'monster',I.CHIXIAO);
  assert.equal(locate(t,target).item.properSummonType,'SYNCHRO');battleToGY(t,target);assert.equal(t.state.lp[0],7800);
  step(t,TYPE,select(target,1,'DEFENSE'));assert.equal(locate(t,target).item.summonType,'SPECIAL');assert.equal(locate(t,target).item.properSummonType,'SYNCHRO');
  assert.equal(t.state.pendingTriggers.length,0);replay(t);
 });
 for(const targetId of [I.MECHABA,I.ARTEMIS,I.CHIXIAO,I.SPIRIT,I.LUBELLION])await test('Declared GY Extra '+targetId+' without a real proper summon is excluded',()=>{
  const t=make({targetId}),target=uid(t,0,'gy',targetId);assert(target);assert(!options(t).some(a=>a.targetUid===target));
  assert.equal(E.execute(t.state,{type:TYPE,sourceUid:uid(t,0,'hand',I.REBORN),targetUid:target,destination:0,position:'ATTACK'}).pass,false);
 });
 await test('Forged placement proper-history fields do not become executed history',()=>{
  const t=make({targetId:I.MECHABA,targetProperties:{properlySummoned:true,properSummonType:'FUSION',summonType:'FUSION'}}),target=uid(t,0,'gy',I.MECHABA);
  assert(!options(t).some(a=>a.targetUid===target));assert.notEqual(locate(t,target).item.properSummonType,'FUSION');
 });
 await test('A declared proper starting field destroyed by actual battle is still not an actual registered Fusion history',()=>{
  const t=make({target:false,placements:[monster(0,I.MECHABA,0,{properlySummoned:true,properSummonType:'FUSION',declaredSummonType:'FUSION'}),monster(1,I.BEWD,2)]});
  const target=uid(t,0,'monster',I.MECHABA);assert.equal(locate(t,target).item.summonType,'DECLARED_STARTING_FIELD');battleToGY(t,target);
  assert(!options(t).some(a=>a.targetUid===target));replay(t);
 });
 await test('Real Branded Fusion Extra-only restriction permits a Main monster GY revival',()=>{
  const t=make({hands:[[I.BRANDED_FUSION],[]],cards:[[I.ALBAZ,I.DARK_MAGICIAN],[]],extra:[[I.LUBELLION],[]]});
  step(t,'BRANDED_FUSION_LUBELLION',a=>pass(a)&&a.materialUids.every(u=>locate(t,u).zone==='deck'));decline(t);
  assert(t.state.locks.some(x=>x.kind==='FUSION_ONLY'));const target=uid(t,0,'gy',I.BEWD);step(t,TYPE,select(target,3));replay(t);
 });
 await test('Actual Ashuna banish cost and Wyrm-only lock exclude Dragon GY revival but permit a reviewed Wyrm',()=>{
  const t=make({hands:[[I.ASHUNA],[]],cards:[[I.ADHARA],[]],placements:[monster(0,I.DARK_MAGICIAN,0),gy(0,I.SHTHANA)]});
  const source=uid(t,0,'hand',I.ASHUNA);step(t,'TENYI_ASHUNA_DECK',a=>a.sourceUid===source&&a.selectionUid===uid(t,0,'deck',I.ADHARA)&&pass(a));
  assert.equal(locate(t,source).zone,'banished');assert(t.state.locks.some(x=>x.kind==='WYRM_ONLY'));
  const blue=uid(t,0,'gy',I.BEWD),wyrm=uid(t,0,'gy',I.SHTHANA);assert(!options(t).some(a=>a.targetUid===blue));assert(options(t).some(a=>a.targetUid===wyrm));
  step(t,TYPE,select(wyrm,4));assert.equal(locate(t,source).zone,'banished');replay(t);
 });
 await test('Reborn Mo Ye queues its real optional Token trigger without consuming a Normal Summon',()=>{
  const t=make({targetId:I.MOYE,hands:[[I.LONGYUAN],[]]}),target=uid(t,0,'gy',I.MOYE);
  step(t,TYPE,select(target,2));assert(t.state.pendingTriggers.some(x=>x.kind==='MOYE_TOKEN'&&x.sourceUid===target));assert.equal(t.state.normalSummonAvailable[0],true);
  step(t,'MOYE_TOKEN',a=>a.sourceUid===target&&a.revealUid===uid(t,0,'hand',I.LONGYUAN)&&pass(a));assert(t.state.zones[0].monster.some(x=>x.token));replay(t);
 });
 await test('Reborn Gazelle queues its reviewed on-summon send and that trigger uses an actual Deck card',()=>{
  const t=make({targetId:I.GAZELLE,cards:[[52277807],[]]}),target=uid(t,0,'gy',I.GAZELLE);
  step(t,TYPE,select(target,2));assert(t.state.pendingTriggers.some(x=>x.kind==='SALAMANGREAT_GAZELLE_SEND'&&x.sourceUid===target));
  step(t,'SALAMANGREAT_GAZELLE_SEND',a=>a.sourceUid===target&&a.selectionUid===uid(t,0,'deck',52277807)&&pass(a));assert.equal(cards(t,0,'gy',52277807).length,1);replay(t);
 });
 await test('Revival into the live EMZ Wolf linked Main zone queues its existing FIRE recovery trigger',()=>{
  const t=make({placements:[monster(0,I.WOLF,5),gy(0,52277807)]}),target=uid(t,0,'gy',I.BEWD),fire=uid(t,0,'gy',52277807),wolf=uid(t,0,'monster',I.WOLF);
  step(t,TYPE,select(target,1));assert(t.state.pendingTriggers.some(x=>x.kind==='SALAMANGREAT_WOLF_FIRE'&&x.sourceUid===wolf));
  step(t,'SALAMANGREAT_WOLF_RECOVER_FIRE',a=>a.sourceUid===wolf&&a.targetUid===fire&&pass(a));assert.equal(locate(t,fire).zone,'hand');replay(t);
 });
 await test('Mechaba pays an actual hand Spell and banishes the activated Reborn source while leaving the selected GY monster',()=>{
  const t=make({mechaba:true}),target=uid(t,0,'gy',I.BEWD),source=uid(t,0,'hand',I.REBORN);
  const r=step(t,TYPE,select(target,0,'ATTACK',a=>a.response?.type==='MECHABA'&&!a.counterResponses));packet(r,source,target);
  assert.equal(r.action.response.matchingCardType,'SPELL');assert.equal(locate(t,r.action.response.costUid).zone,'gy');assert.equal(locate(t,source).zone,'banished');assert.equal(locate(t,target).zone,'gy');
  assert.equal(r.action.proof.activationNegated,true);assert(r.action.paid.some(x=>x.kind==='SEND_GY'&&x.uid===r.action.response.costUid&&x.from==='hand'));replay(t);
 });
 await test('Opponent Roar negates the Normal Spell card activation and destroys the physical source',()=>{
  const t=make({opponentRoar:true}),target=uid(t,0,'gy',I.BEWD),source=uid(t,0,'hand',I.REBORN);
  const r=step(t,TYPE,select(target,0,'ATTACK',a=>a.response?.type==='ROAR'&&!a.counterResponses));packet(r,source,target);
  assert.equal(r.action.proof.activationNegated,true);assert.equal(locate(t,source).zone,'gy');assert.equal(locate(t,target).zone,'gy');
  assert(r.action.events.some(e=>e.type==='DESTROYED_BY_EFFECT'&&e.uid===source&&e.from==='spelltrap'));replay(t);
 });
 await test('Own Roar counters Mechaba without refunding its Spell cost and Reborn then revives its original target',()=>{
  const t=make({mechaba:true,ownRoar:true}),target=uid(t,0,'gy',I.BEWD),source=uid(t,0,'hand',I.REBORN);
  const r=step(t,TYPE,select(target,4,'DEFENSE',a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===1));packet(r,source,target);
  assert.equal(locate(t,r.action.response.costUid).zone,'gy');assert.equal(locate(t,r.action.response.uid).zone,'gy');assert.equal(locate(t,target).zone,'monster');assert.equal(locate(t,source).zone,'gy');
  assert.equal(r.action.proof.activationNegated,false);replay(t);
 });
 await test('A physical own Roar can counter the rival Roar and restore the declared revival',()=>{
  const t=make({ownRoar:true,opponentRoar:true}),target=uid(t,0,'gy',I.BEWD);
  const r=step(t,TYPE,select(target,3,'ATTACK',a=>a.response?.type==='ROAR'&&a.counterResponses?.length===1));
  assert.equal(locate(t,target).zone,'monster');assert.equal(cards(t,0,'gy',I.ROAR).length,1);assert.equal(cards(t,1,'gy',I.ROAR).length,1);assert.equal(r.action.proof.activationNegated,false);replay(t);
 });
 await test('Ash and Blue-Eyes Spirit Dragon cannot answer a Spell card activation from the hand',()=>{
  const t=make({hands:[[],[I.ASH]],placements:[monster(1,I.SPIRIT,0)],responseTypes:['ASH','SPIRIT']}),target=uid(t,0,'gy',I.BEWD);
  const rows=options(t);assert(rows.length);assert(rows.every(a=>!a.responseUid&&!a.response));step(t,TYPE,select(target));replay(t);
 });
 await test('Actual Set Impermanence column negates a forced Reborn column while retaining physical activation and cleanup',()=>{
  const t=make({placements:[monster(0,I.SAGE,0),set(1,I.IMPERM,4),set(0,I.INVOCATION,1),set(0,I.CED,2),set(0,I.ROAR,3),set(0,I.IMPERM,4)]});
  step(t,'ACTIVATE_INFINITE_IMPERMANENCE',a=>a.player===1&&a.targetUid===uid(t,0,'monster',I.SAGE)&&pass(a));
  assert(t.state.locks.some(x=>x.kind==='IMPERM_COLUMN_NEGATED'&&x.column===0));const target=uid(t,0,'gy',I.BEWD),source=uid(t,0,'hand',I.REBORN),r=step(t,TYPE,select(target,1));
  packet(r,source,target);assert.equal(r.action.proof.activationColumn,0);assert.equal(r.action.proof.effectNegated,true);assert.equal(r.action.proof.activationNegated,false);
  assert.equal(locate(t,target).zone,'gy');assert.equal(locate(t,source).zone,'gy');replay(t);
 });
 await test('A free unblocked Spell column is used after real Impermanence instead of an available blocked column',()=>{
  const t=make({placements:[monster(0,I.SAGE,0),set(1,I.IMPERM,4)]});step(t,'ACTIVATE_INFINITE_IMPERMANENCE',a=>a.player===1&&a.targetUid===uid(t,0,'monster',I.SAGE)&&pass(a));
  const target=uid(t,0,'gy',I.BEWD),r=step(t,TYPE,select(target,1));assert.notEqual(r.action.proof.activationColumn,0);assert.equal(locate(t,target).zone,'monster');replay(t);
 });
 await test('A real Impermanence column negates the own Roar counter while Mechaba still negates Reborn and keeps its Spell cost',()=>{
  const t=make({mechaba:true,ownRoar:true,placements:[monster(0,I.SAGE,3),set(1,I.IMPERM,4)]});
  step(t,'ACTIVATE_INFINITE_IMPERMANENCE',a=>a.player===1&&a.targetUid===uid(t,0,'monster',I.SAGE)&&pass(a));
  const target=uid(t,0,'gy',I.BEWD),source=uid(t,0,'hand',I.REBORN),r=step(t,TYPE,select(target,4,'ATTACK',a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===1));
  assert.equal(r.action.proof.activationNegated,true);assert.equal(locate(t,target).zone,'gy');assert.equal(locate(t,source).zone,'banished');assert.equal(locate(t,r.action.response.costUid).zone,'gy');assert.equal(locate(t,r.action.response.uid).zone,'monster');replay(t);
 });
 await test('No free Main zone blocks Reborn even when an Extra Monster Zone remains free',()=>{
  const t=make({placements:[I.DARK_MAGICIAN,23771716,63749102,74367458,48305365].map((n,i)=>monster(0,n,i))});assert.equal(options(t).length,0);
 });
 await test('All five ordinary Spell/Trap slots occupied block a hand Normal Spell source',()=>{
  const t=make({placements:[set(0,I.CED,0),set(0,I.ROAR,1),set(0,I.IMPERM,2),set(0,I.INVOCATION,3),set(0,I.INVOCATION,4)]});assert.equal(options(t).length,0);
 });
 for(const setup of [{phase:'BATTLE'},{phase:'END'},{activePlayer:1}])await test('Reborn remains an own Main Phase Speed 1 action: '+JSON.stringify(setup),()=>assert.equal(options(make(setup)).length,0));
 await test('Pending real Mo Ye trigger cannot be skipped to activate Reborn',()=>{
  const t=make({hands:[[I.MOYE,I.LONGYUAN],[]]});step(t,'NORMAL_SUMMON',a=>a.sourceUid===uid(t,0,'hand',I.MOYE)&&pass(a));assert(t.state.pendingTriggers.length);assert.equal(options(t).length,0);
 });
 for(const targetId of [I.UNKNOWN,I.XYZ,I.PENDULUM])await test('Unsupported revival profile '+targetId+' is excluded rather than executing arbitrary card text',()=>assert.equal(options(make({targetId})).length,0));
 await test('Forged source, target, destination and position are rejected without input mutation',()=>{
  const t=make(),a=options(t).find(pass);assert(a);const before=JSON.stringify(t.state);
  for(const change of [{sourceUid:'invented'},{targetUid:uid(t,0,'hand',I.REBORN)},{targetUid:'invented'},{destination:5},{destination:-1},{position:'SET'},{player:1}])assert.equal(E.execute(t.state,{...a,...change}).pass,false,JSON.stringify(change));
  assert.equal(JSON.stringify(t.state),before);
 });
 await test('An occupied Main destination cannot replace a physical monster',()=>{
  const t=make({placements:[monster(0,I.DARK_MAGICIAN,2)]}),a=options(t).find(pass);assert(a);assert(!options(t).some(x=>x.destination===2));assert.equal(E.execute(t.state,{...a,destination:2}).pass,false);
 });
 await test('Mechaba rejects forged Monster or Trap payment, activation location and copied activation packet claims',()=>{
  const t=make({mechaba:true,hands:[[],[I.ASH,I.IMPERM]]}),a=options(t).find(a=>a.response?.type==='MECHABA'&&!a.counterResponses);assert(a);const before=JSON.stringify(t.state);
  for(const change of [{costUid:uid(t,1,'hand',I.ASH)},{costUid:uid(t,1,'hand',I.IMPERM)},{matchingCardType:'TRAP'},{activationZone:'gy'},{activationKind:'MONSTER_EFFECT'},{targetUid:'invented'}])assert.equal(E.execute(t.state,{...a,response:{...a.response,...change}}).pass,false,JSON.stringify(change));
  assert.equal(JSON.stringify(t.state),before);
 });
 await test('Fresh replay rejects tampered target ownership, actual summon history, paid costs and activation proof',()=>{
  const t=invoked(),target=uid(t,0,'monster',I.MECHABA);battleToGY(t,target);step(t,TYPE,select(target));const line=replay(t);
  for(const mutation of [
   x=>{x.after.zones[0].monster.find(v=>v.uid===target).ownerPlayer=1;x.state=copy(x.after);},
   x=>{x.after.zones[0].monster.find(v=>v.uid===target).properSummonType='SYNCHRO';x.state=copy(x.after);},
   x=>x.actions.at(-1).paid.push({kind:'LP',amount:500}),
   x=>{x.actions.at(-1).proof.normalSpellActivation.cardId=I.INVOCATION;},
   x=>{x.actions.at(-1).targetUid='invented';}
  ]){const forged=copy(line);mutation(forged);assert.equal(E.replay(forged,{deck:t.deck}).pass,false);}
 });
 await test('Bounded search finds the real target/destination revival and every returned witness replays',async()=>{
  const t=make({targetPlayer:1}),target=uid(t,1,'gy',I.BEWD),result=await E.search(t.state,{goal:s=>s.zones[0].monster.some(x=>x.uid===target&&x.zoneIndex===3&&x.position==='DEFENSE'),maxDepth:1,maxStates:150,maxMs:5000,checkCurrentDeck:false});
  assert.equal(result.pass,true);assert(result.lines.length);assert(result.lines.every(line=>line.actions.some(a=>a.type===TYPE)&&E.replay(line,{deck:t.deck}).pass));assert.equal(result.certified,false);assert.equal(result.globalOptimalityProven,false);
 });
 const report={schema:'ygo-monster-reborn-tests/v1',pass:tests.every(t=>t.pass),total:tests.length,tests,
  limitations:['Pinned CDB metadata and the dated TCG application restriction snapshot are technical inputs, not new official rule authentication.','Starting GYs and fields are explicit declarations; Extra revival eligibility is tested using actual registered Fusion/Synchro/Link actions and battle destruction.','Only registered reviewed revival profiles and bounded response packets are covered; arbitrary card text, general priority, Xyz/Pendulum and unknown mandatory triggers are excluded.','Competitive scoring remains provisional by user request; diagnostic decks are not tournament evidence.']};
 fs.writeFileSync(path.join(ROOT,'tests/monster-reborn-results.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));if(!report.pass)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});

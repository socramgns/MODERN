'use strict';
/* Physical Field Zone activation regressions. Documentary references and the
 * technical catalogue do not certify the complete TCG rules or all cards. */
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const assert = require('node:assert/strict');
const {harness, ROOT} = require('./combo_engine.cjs');
const copy = structuredClone;
const I = {MAUSOLEUM:24382602, SANCTUARY:1295111, MECHABA:75286621,
  INVOCATION:74063034, ROAR:51339637, WOLF:87871125, BALELYNX:14812471,
  SPARK:83994433, ALEISTER:86120751, SAGE:8240199, ANCIENTS:71039903,
  IMPERM:10045474, BEWD:89631139, UNKNOWN_FIELD:33550694};
const TYPES = new Map([[I.MAUSOLEUM,'ACTIVATE_MAUSOLEUM_OF_WHITE'],
  [I.SANCTUARY,'SALAMANGREAT_ACTIVATE_SANCTUARY']]);

(async () => {
  const {W,E,fixture} = await harness(true), H = E.helpers, tests = [];
  const id = value => H.baseId(value);
  for (const name of ['duel-phases','responses','archetypes-expanded','blue-eyes-duel']) {
    vm.runInNewContext(fs.readFileSync(path.join(ROOT,'src/app/'+name+'.js'),'utf8'),
      {window:W,structuredClone,console,Promise,Date,setTimeout,clearTimeout,performance});
  }
  await Promise.resolve();
  const fillers = [...new Set(fixture('Invoked').deck.main.filter(row =>
    ![I.ALEISTER,I.INVOCATION].includes(row.id)).map(row => row.id)
    .concat([63749102,74367458,48305365,32452818]))];
  function deck(cards=[], extra=[]) {
    const counts = new Map();
    for (const n of cards) counts.set(n,(counts.get(n)||0)+1);
    let size = cards.length;
    for (const n of fillers) {
      if (size >= 40) break;
      if (counts.has(n)) continue;
      const qty = Math.min(3,40-size); counts.set(n,qty); size += qty;
    }
    assert.equal(size,40);
    const extras = new Map();
    for (const n of extra) extras.set(n,(extras.get(n)||0)+1);
    const value = {main:[...counts].map(([id,qty])=>({id,qty})),
      extra:[...extras].map(([id,qty])=>({id,qty})),side:[]};
    const audit = W.YGODataCatalog.auditDeck(value,{format:'tcg',banlist:W.BANLIST_PROFILES.tcg.data});
    assert.equal(audit.pass,true,JSON.stringify(audit));
    return value;
  }
  function hand(value,wanted,reserved) {
    const available = new Map(value.main.map(row=>[row.id,row.qty]));
    const out = [...wanted];
    for (const n of [...wanted,...reserved]) {
      assert((available.get(n)||0)>0,'Missing physical card '+n);
      available.set(n,available.get(n)-1);
    }
    for (const n of fillers) while (out.length<5 && available.get(n)>0) {
      out.push(n); available.set(n,available.get(n)-1);
    }
    assert.equal(out.length,5);
    return out;
  }
  function remaining(value,opening) {
    const cards = value.main.flatMap(row=>Array(row.qty).fill(row.id));
    for (const n of opening) { const at=cards.indexOf(n); assert(at>=0); cards.splice(at,1); }
    return cards;
  }
  const placement = (player,cardId,zone='monster',from='deck',extra={}) =>
    ({player,cardId,zone,from,faceUp:zone==='monster',position:'ATTACK',summonTurn:1,...extra});
  function make(o={}) {
    const field = o.field ?? I.MAUSOLEUM;
    const ownExtra = [...(o.ownExtra||[]),...(o.ownRoar?[I.WOLF]:[])];
    const opponentExtra = [...(o.noMechaba?[]:[I.MECHABA]),...(o.opponentRoar?[I.WOLF]:[]),
      ...(o.opponentExtra||[])];
    const cards = [field,...(o.oldField?[o.oldField]:[]),...(o.ownRoar?[I.ROAR]:[]),...(o.cards||[])];
    const opponentCards = [I.INVOCATION,...(o.opponentField?[o.opponentField]:[]),
      ...(o.opponentRoar?[I.ROAR]:[]),...(o.opponentCards||[])];
    const placements = [...(o.noMechaba?[]:[placement(1,I.MECHABA,'monster','extra',{zoneIndex:0})]),
      ...(o.oldField?[placement(0,o.oldField,'spelltrap','deck',{faceUp:o.oldFaceUp!==false})]:[]),
      ...(o.opponentField?[placement(1,o.opponentField,'spelltrap','deck',{faceUp:true})]:[]),
      ...(o.ownRoar?[placement(0,I.WOLF,'monster','extra',{zoneIndex:5}),
        placement(0,I.ROAR,'spelltrap','deck',{faceUp:false,setTurn:1,zoneIndex:0})]:[]),
      ...(o.opponentRoar?[placement(1,I.WOLF,'monster','extra',{zoneIndex:5}),
        placement(1,I.ROAR,'spelltrap','deck',{faceUp:false,setTurn:1,zoneIndex:2})]:[]),
      ...(o.placements||[])];
    const own = deck(cards,ownExtra), opponent = deck(opponentCards,opponentExtra);
    const reserved = p => placements.filter(row=>row.player===p&&row.from==='deck').map(row=>row.cardId);
    const opening = hand(own,[field,...(o.hand||[])],reserved(0));
    const opponentOpening = hand(opponent,o.opponentHand||[I.INVOCATION],reserved(1));
    const spec = {deck:own,openingIds:opening,remainingDeckIds:remaining(own,opening),
      opponentDeck:opponent,opponentOpeningIds:opponentOpening,
      opponentRemainingDeckIds:remaining(opponent,opponentOpening),
      context:{format:'tcg',duelMode:true,opponentPolicy:'RESPONSES_EXPLICIT',
        responseTypes:o.responseTypes||['MECHABA'],responsePolicy:o.policy||'CHOICE_BRANCHES',...(o.context||{})},
      setup:{turn:2,activePlayer:0,phase:'MAIN 1',placements}};
    const initial = E.createState(spec);
    return {deck:own,spec,field,initial,state:copy(initial),actions:[]};
  }
  const locate = (t,uid) => H.locate(t.state,uid);
  const uid = (t,p,zone,n) => t.state.zones[p][zone].find(row=>id(row)===n)?.uid;
  const pass = action => !action.response&&!action.responseUid;
  const mechaba = action => action.response?.type==='MECHABA'&&!action.counterResponses;
  const roar = action => action.response?.type==='ROAR'&&!action.counterResponses;
  const options = (t,type=TYPES.get(t.field)) => E.enumerate(t.state).filter(action=>action.type===type);
  function step(t,type=TYPES.get(t.field),predicate=pass) {
    const action = options(t,type).find(predicate);
    assert(action,'Missing '+type+': '+JSON.stringify(options(t,type)));
    const before = JSON.stringify(t.state), inventory = H.inventory(t.state), result = E.execute(t.state,action);
    assert.equal(result.pass,true,JSON.stringify(result));
    assert.equal(JSON.stringify(t.state),before,'Transition changed its input');
    assert.equal(H.inventory(result.after),inventory,'Physical inventory changed');
    t.state=result.after; t.actions.push(result.action); return result;
  }
  function replay(t) {
    const line={before:copy(t.initial),after:copy(t.state),state:copy(t.state),actions:copy(t.actions),
      deckFingerprint:E.deckFingerprint(t.deck),context:copy(t.initial.context)};
    assert.equal(E.replay(line,{deck:t.deck}).pass,true);
    return line;
  }
  function packet(result,source,cardId) {
    const p=result.action.proof.fieldSpellActivation;
    assert(p); assert.equal(p.kind,'FIELD_SPELL_CARD_ACTIVATION');
    assert.equal(p.sourceUid,source); assert.equal(p.cardId,cardId); assert.equal(p.player,0);
    assert.equal(p.originZone,'hand'); assert.equal(p.activationZone,'spelltrap');
    assert.equal(p.fieldSpell,true); assert.equal(p.column,null);
    assert.equal(result.action.proof.normalSpellActivation,null);
    assert.equal(result.action.proof.activationColumn,null);
    assert.equal(result.action.proof.activationOrigin.zone,'hand');
    assert.equal(result.action.proof.activationOrigin.cardActivation,'FIELD_SPELL');
    assert.equal(result.action.proof.activationOrigin.restriction,'NONE');
    return p;
  }
  function assertField(t,source) {
    const hit=locate(t,source); assert.equal(hit.zone,'spelltrap'); assert.equal(hit.item.fieldSpell,true);
    assert.equal(hit.item.faceUp,true); assert.equal(hit.item.zoneIndex,undefined);
  }
  async function test(name,fn) {
    try { await fn(); tests.push({name,pass:true}); }
    catch (error) { tests.push({name,pass:false,error:error.stack}); }
  }

  await test('Capabilities add exactly two Field Spell activations without changing prior registries',()=>{
    const fields=E.capabilities().fieldSpellActivations;
    assert.equal(fields.length,2);
    assert.deepEqual(Array.from(fields,row=>Number(row.cardId)).sort((a,b)=>a-b),[I.SANCTUARY,I.MAUSOLEUM].sort((a,b)=>a-b));
    assert(fields.every(row=>row.restriction==='NONE'&&row.activationZone==='spelltrap'));
    const responses=W.YGOResponses.capabilities();
    assert.deepEqual(Array.from(responses.mechabaFieldSpellActivations).sort(),[...TYPES.values()].sort());
    assert.equal(responses.mechabaNormalSpellActivations.length,3);
    assert.equal(responses.mechabaNonFieldMonsterActivations.length,15);
    assert.equal(E.capabilities().normalSpellActivations.length,3);
  });
  for (const field of TYPES.keys()) {
    await test('A successful Field Spell remains in the separate Field Zone: '+field,()=>{
      const t=make({field}),source=uid(t,0,'hand',field),r=step(t),p=packet(r,source,field);
      assertField(t,source); assert.equal(p.replaced.length,0); assert.equal(r.action.proof.activationNegated,false);
      assert.equal(r.action.paid.length,0);
      assert(r.action.events.some(event=>event.type==='FIELD_SPELL_ACTIVATION'&&event.uid===source));
      assert(!r.action.events.some(event=>event.type==='NORMAL_SPELL_RESOLUTION_CLEANUP'));
      replay(t);
    });
    await test('Mechaba pays a physical Spell hand cost and banishes the newly activated Field Spell: '+field,()=>{
      const t=make({field}),source=uid(t,0,'hand',field),r=step(t,undefined,mechaba);
      packet(r,source,field); assert.equal(locate(t,source).zone,'banished');
      assert.equal(r.action.response.matchingCardType,'SPELL'); assert.equal(r.action.response.nonTargeting,true);
      assert.equal(r.action.proof.activationNegated,true); assert.equal(t.state.zones[0].spelltrap.length,0);
      const cost=r.action.response.costUid; assert.equal(locate(t,cost).zone,'gy');
      assert(r.action.paid.some(row=>row.uid===cost&&row.player===1&&row.kind==='SEND_GY'&&row.from==='hand'));
      assert(r.action.events.some(event=>event.type==='MECHABA_BANISH_ACTIVATED_CARD'&&event.targetUid===source&&event.from==='spelltrap'));
      replay(t);
    });
    for (const oldField of TYPES.keys()) for (const oldFaceUp of [true,false]) {
      await test('Replacement remains sent by rule after Mechaba negation: '+[oldField,field,oldFaceUp].join('/'),()=>{
        const t=make({field,oldField,oldFaceUp}),old=uid(t,0,'spelltrap',oldField),source=uid(t,0,'hand',field),r=step(t,undefined,mechaba);
        const p=packet(r,source,field);
        assert.equal(locate(t,old).zone,'gy'); assert.equal(locate(t,source).zone,'banished');
        assert.deepEqual(copy(p.replaced),[{uid:old,cardId:oldField,from:'spelltrap',to:'gy',faceUp:oldFaceUp}]);
        const event=r.action.events.find(event=>event.type==='REPLACE_FIELD_SPELL'&&event.uid===old);
        assert(event); assert.equal(event.destroyed,false); assert.equal(event.cost,false);
        assert.equal(event.reason,'FIELD_ZONE_RULE_NOT_DESTRUCTION');
        assert(!r.action.paid.some(row=>row.uid===old));
        assert(!r.action.events.some(event=>event.type==='DESTROYED_BY_EFFECT'&&event.uid===old));
        assert.equal(t.state.zones[0].spelltrap.filter(row=>row.fieldSpell).length,0);
        replay(t);
      });
    }
  }
  await test('Replacement and staging are recorded before the opposing response resolves',()=>{
    const t=make({oldField:I.SANCTUARY}),old=uid(t,0,'spelltrap',I.SANCTUARY),r=step(t,undefined,mechaba),events=r.action.events;
    const send=events.findIndex(event=>event.type==='REPLACE_FIELD_SPELL'&&event.uid===old);
    const activate=events.findIndex(event=>event.type==='FIELD_SPELL_CARD_ACTIVATION');
    const negate=events.findIndex(event=>event.type==='MECHABA_NEGATE_ACTIVATION');
    assert(send>=0&&send<activate&&activate<negate); replay(t);
  });
  await test('Replacing one player Field Spell leaves the opposing Field Zone intact',()=>{
    const t=make({oldField:I.SANCTUARY,opponentField:I.MAUSOLEUM}),other=uid(t,1,'spelltrap',I.MAUSOLEUM),source=uid(t,0,'hand',I.MAUSOLEUM);
    step(t); assertField(t,source); assert.equal(locate(t,other).zone,'spelltrap'); assert.equal(locate(t,other).player,1); replay(t);
  });
  for (const field of TYPES.keys()) await test('Five occupied regular Spell/Trap columns do not block the separate Field Zone: '+field,()=>{
    const cards=[I.INVOCATION,I.INVOCATION,I.INVOCATION,I.ROAR,I.ROAR];
    const t=make({field,cards,placements:cards.map((cardId,zoneIndex)=>placement(0,cardId,'spelltrap','deck',{faceUp:false,setTurn:1,zoneIndex}))});
    const source=uid(t,0,'hand',field); step(t); assertField(t,source);
    assert.equal(t.state.zones[0].spelltrap.filter(row=>!row.fieldSpell).length,5); replay(t);
  });
  await test('A real set Impermanence column lock does not negate a Field Spell activation',()=>{
    const t=make({cards:[I.ALEISTER,I.INVOCATION],hand:[I.ALEISTER],opponentCards:[I.IMPERM],responseTypes:['IMPERM','MECHABA'],
      placements:[placement(1,I.IMPERM,'spelltrap','deck',{faceUp:false,setTurn:1,zoneIndex:2})]});
    step(t,'NORMAL_SUMMON',a=>pass(a)&&id(locate(t,a.sourceUid).item)===I.ALEISTER);
    step(t,'ALEISTER_SEARCH',a=>a.response?.type==='IMPERM');
    assert(t.state.locks.some(lock=>lock.kind==='IMPERM_COLUMN_NEGATED'));
    const source=uid(t,0,'hand',I.MAUSOLEUM),r=step(t);
    assert.equal(r.action.proof.activationColumn,null); assert.equal(r.action.proof.effectNegated,false); assertField(t,source); replay(t);
  });
  await test('Negating only an activation effect does not remove a successfully activated Field Spell',()=>{
    // This explicit QA provider exercises the engine contract. It is not a
    // claimed real negation card or an additional product response provider.
    E.registerResponse({id:'QA_FIELD_EFFECT_ONLY',enumerate(state,handler,action){
      if(!state.context.qaFieldEffectOnly||handler.cardActivation!=='FIELD_SPELL')return[];
      const source=state.zones[1].monster.find(row=>id(row)===I.MECHABA);
      return source?[{...action,response:{type:'QA_FIELD_EFFECT_ONLY',player:1,uid:source.uid,targetUid:action.sourceUid}}]:[];
    },apply(){return{negateEffect:true,events:[{type:'QA_FIELD_EFFECT_NEGATION_WITHOUT_ACTIVATION_NEGATION'}]};}});
    const t=make({oldField:I.SANCTUARY,context:{qaFieldEffectOnly:true},responseTypes:['QA_FIELD_EFFECT_ONLY']}),
      old=uid(t,0,'spelltrap',I.SANCTUARY),source=uid(t,0,'hand',I.MAUSOLEUM),
      r=step(t,undefined,action=>action.response?.type==='QA_FIELD_EFFECT_ONLY');
    assert.equal(r.action.proof.effectNegated,true); assert.equal(r.action.proof.activationNegated,false);
    assertField(t,source); assert.equal(locate(t,source).item.effectsNegated,undefined);
    assert.equal(locate(t,old).zone,'gy'); replay(t);
  });
  await test('Mechaba cannot pay a Monster instead of the required Spell cost',()=>{
    const t=make({opponentHand:fillers.slice(0,5)});
    assert(options(t).some(pass)); assert(options(t).every(action=>action.response?.type!=='MECHABA'));
  });
  await test('FIRST_ELIGIBLE forces the valid Mechaba response but CHOICE_BRANCHES preserves passing',()=>{
    const forced=make({policy:'FIRST_ELIGIBLE'}),choice=make();
    assert(options(forced).length&&options(forced).every(mechaba));
    assert(options(choice).some(mechaba)&&options(choice).some(pass));
  });
  for (const field of TYPES.keys()) await test('Roar negates the Field Spell card activation and sends its destroyed card to GY: '+field,()=>{
    const t=make({field,noMechaba:true,opponentRoar:true,oldField:field,
      ownExtra:[I.BALELYNX],placements:[placement(0,I.BALELYNX,'gy','extra')],responseTypes:['ROAR']}),
      old=uid(t,0,'spelltrap',field),source=uid(t,0,'hand',field),balelynx=uid(t,0,'gy',I.BALELYNX);
    const choices=options(t).filter(roar); assert(choices.length); assert(choices.every(action=>!action.response.destructionReplacement));
    const r=step(t,undefined,roar),destroy=r.action.events.find(event=>event.type==='DESTROYED_BY_EFFECT'&&event.uid===source);
    packet(r,source,field); assert.equal(locate(t,old).zone,'gy'); assert.equal(locate(t,source).zone,'gy');
    assert.equal(locate(t,balelynx).zone,'gy'); assert(destroy); assert.equal(destroy.activationNegated,true);
    assert.equal(destroy.treatedAsOnField,false); assert.equal(t.state.zones[0].spelltrap.filter(row=>row.fieldSpell).length,0);
    assert(!r.action.events.some(event=>event.type==='BALELYNX_DESTRUCTION_REPLACED'||event.type==='SPARK_DESTRUCTION_PREVENTED'));
    replay(t);
  });
  await test('A prior Spark shield does not prevent replacement of the old Field Spell',()=>{
    const t=make({oldField:I.SANCTUARY,ownExtra:[I.SPARK],
      placements:[placement(0,I.SPARK,'monster','extra',{zoneIndex:0})]}),old=uid(t,0,'spelltrap',I.SANCTUARY);
    step(t,'STARDUST_SPARK_PROTECTION',a=>pass(a)&&a.player===0&&a.targetUid===old);
    assert.equal(locate(t,old).item.sparkProtection.remaining,1);
    const r=step(t,undefined,mechaba); assert.equal(locate(t,old).zone,'gy'); assert.equal(locate(t,old).item.sparkProtection,undefined);
    assert(!r.action.events.some(event=>event.type==='SPARK_DESTRUCTION_PREVENTED')); replay(t);
  });
  await test('A second physical copy of Mausoleum can be activated in the same turn without inventing a card-activation limit',()=>{
    const t=make({cards:[I.MAUSOLEUM],hand:[I.MAUSOLEUM]}),first=uid(t,0,'hand',I.MAUSOLEUM);
    step(t,undefined,a=>pass(a)&&a.sourceUid===first); const second=uid(t,0,'hand',I.MAUSOLEUM);
    assert(second&&second!==first); step(t,undefined,a=>pass(a)&&a.sourceUid===second);
    assert.equal(locate(t,first).zone,'gy'); assertField(t,second); replay(t);
  });
  await test('Replacing Mausoleum does not reset the global additional Normal Summon allowance',()=>{
    const t=make({cards:[I.MAUSOLEUM,I.SAGE,I.SAGE],hand:[I.MAUSOLEUM,I.SAGE,I.SAGE]}),first=uid(t,0,'hand',I.MAUSOLEUM);
    step(t,undefined,a=>pass(a)&&a.sourceUid===first);
    step(t,'BLUE_EYES_NORMAL_SUMMON_SAGE'); step(t,'DECLINE_OPTIONAL_TRIGGER');
    step(t,'MAUSOLEUM_ADDITIONAL_NORMAL_SUMMON'); step(t,'DECLINE_OPTIONAL_TRIGGER');
    assert.equal(t.state.used.MAUSOLEUM_ADDITIONAL_NORMAL,true);
    step(t,undefined,pass); assert.equal(t.state.used.MAUSOLEUM_ADDITIONAL_NORMAL,true);
    assert.equal(options(t,'MAUSOLEUM_ADDITIONAL_NORMAL_SUMMON').length,0); replay(t);
  });
  await test('A resolved Mausoleum ATK and DEF gain survives replacement of its Field Spell source',()=>{
    const t=make({field:I.SANCTUARY,oldField:I.MAUSOLEUM,cards:[I.BEWD],
      placements:[placement(0,I.BEWD,'monster','deck',{zoneIndex:0})]}),old=uid(t,0,'spelltrap',I.MAUSOLEUM),target=uid(t,0,'monster',I.BEWD);
    step(t,'MAUSOLEUM_SEND_NORMAL_MONSTER',a=>pass(a)&&a.targetUid===target);
    const before=copy(locate(t,target).item),r=step(t);
    assert.equal(locate(t,old).zone,'gy'); assert.equal(locate(t,target).item.currentAtk,before.currentAtk);
    assert.equal(locate(t,target).item.currentDef,before.currentDef);
    assert.deepEqual(locate(t,target).item.temporaryModifiers,before.temporaryModifiers);
    assert(!r.action.events.some(event=>event.type==='TEMPORARY_ATK_DEF_GAIN')); replay(t);
  });
  await test('Replacing Sanctuary does not reset its globally shared reincarnation allowance',()=>{
    const t=make({field:I.SANCTUARY,oldField:I.SANCTUARY,ownExtra:[I.WOLF,I.WOLF,I.WOLF],
      placements:[placement(0,I.WOLF,'monster','extra',{zoneIndex:5})]});
    step(t,'SALAMANGREAT_REINCARNATE_WOLF'); assert.equal(t.state.used.SALAMANGREAT_SANCTUARY_REINCARNATION,true);
    step(t); assert.equal(t.state.used.SALAMANGREAT_SANCTUARY_REINCARNATION,true);
    assert.equal(options(t,'SALAMANGREAT_REINCARNATE_WOLF').length,0); replay(t);
  });
  await test('Roar countering Mechaba restores the new Field Spell without restoring the old one',()=>{
    const t=make({oldField:I.SANCTUARY,ownRoar:true,responseTypes:['MECHABA','ROAR']}),old=uid(t,0,'spelltrap',I.SANCTUARY),source=uid(t,0,'hand',I.MAUSOLEUM),
      r=step(t,undefined,a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===1);
    assertField(t,source); assert.equal(locate(t,old).zone,'gy'); assert.equal(r.action.proof.activationNegated,false);
    assert.equal(r.action.proof.registeredResponseChain.firstResponseNegated,true); assert(uid(t,1,'gy',I.MECHABA));
    assert(uid(t,0,'gy',I.ROAR)); assert.equal(locate(t,r.action.response.costUid).zone,'gy'); replay(t);
  });
  await test('Two opposing Roar counters restore Mechaba resolution in LIFO order while replacement remains paid by rule',()=>{
    const t=make({oldField:I.SANCTUARY,ownRoar:true,opponentRoar:true,responseTypes:['MECHABA','ROAR']}),old=uid(t,0,'spelltrap',I.SANCTUARY),source=uid(t,0,'hand',I.MAUSOLEUM),
      r=step(t,undefined,a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===2);
    assert.equal(locate(t,old).zone,'gy'); assert.equal(locate(t,source).zone,'banished');
    assert.deepEqual(Array.from(r.action.proof.registeredResponseChain.resolutions.filter(event=>event.type==='REGISTERED_CHAIN_LINK_RESOLVED'),event=>event.chainLink),[4,3,2]);
    assert(uid(t,0,'gy',I.ROAR)); assert(uid(t,1,'gy',I.ROAR)); replay(t);
  });
  await test('A Counter Trap countering the opposing root Roar restores Field Spell resolution',()=>{
    const t=make({oldField:I.SANCTUARY,noMechaba:true,ownRoar:true,opponentRoar:true,responseTypes:['ROAR']}),old=uid(t,0,'spelltrap',I.SANCTUARY),source=uid(t,0,'hand',I.MAUSOLEUM),
      r=step(t,undefined,a=>a.response?.type==='ROAR'&&a.counterResponses?.length===1);
    assertField(t,source); assert.equal(locate(t,old).zone,'gy');
    assert.equal(r.action.proof.registeredResponseChain.packets[0].spellSpeed,3);
    assert.equal(r.action.proof.registeredResponseChain.firstResponseNegated,true); replay(t);
  });
  await test('An activation-negated Mechaba kept by Spark can activate again after the Field Spell packet',()=>{
    const t=make({oldField:I.SANCTUARY,ownRoar:true,opponentExtra:[I.SPARK],
      responseTypes:['MECHABA','ROAR'],placements:[placement(1,I.SPARK,'monster','extra',{zoneIndex:1})]}),mechabaUid=uid(t,1,'monster',I.MECHABA),source=uid(t,0,'hand',I.MAUSOLEUM);
    step(t,'STARDUST_SPARK_PROTECTION',a=>pass(a)&&a.player===1&&a.targetUid===mechabaUid);
    const r=step(t,undefined,a=>a.response?.type==='MECHABA'&&a.counterResponses?.length===1);
    assertField(t,source); assert.equal(locate(t,mechabaUid).zone,'monster');
    assert.equal(t.state.used['MECHABA_NEGATE:'+mechabaUid],undefined);
    assert(r.action.events.some(event=>event.type==='MECHABA_ACTIVATION_LIMIT_RELEASED'));
    assert.equal(locate(t,r.action.response.costUid).zone,'gy'); replay(t);
  });
  await test('Field Spell effects already on the field are not mistaken for card activations',()=>{
    const t=make({field:I.SANCTUARY,oldField:I.MAUSOLEUM,cards:[I.BEWD],
      placements:[placement(0,I.BEWD,'monster','deck',{zoneIndex:0})]});
    const moves=options(t,'MAUSOLEUM_SEND_NORMAL_MONSTER'); assert(moves.length);
    assert(moves.every(action=>action.response?.type!=='MECHABA'));
  });
  await test('Sanctuary is an admitted physical Spell hand cost for the registered Mechaba packet',()=>{
    const t=make({opponentCards:[I.SANCTUARY],opponentHand:[I.SANCTUARY]}),cost=uid(t,1,'hand',I.SANCTUARY),
      r=step(t,undefined,a=>mechaba(a)&&a.response.costUid===cost);
    assert.equal(locate(t,cost).zone,'gy'); assert(r.action.paid.some(row=>row.uid===cost&&row.kind==='SEND_GY')); replay(t);
  });
  await test('An unreviewed previous Field Spell blocks this registered replacement before mutation',()=>{
    const t=make({oldField:I.UNKNOWN_FIELD}),source=uid(t,0,'hand',I.MAUSOLEUM),before=JSON.stringify(t.state);
    assert.equal(options(t).length,0); assert.equal(H.fieldSpellActivationEligible(t.state,source,I.MAUSOLEUM),false);
    assert.equal(E.execute(t.state,{type:TYPES.get(I.MAUSOLEUM),sourceUid:source}).pass,false);
    assert.equal(JSON.stringify(t.state),before);
  });
  await test('An unreviewed departure redirect is not silently applied to Field Zone replacement',()=>{
    const t=make({oldField:I.SANCTUARY}),old=uid(t,0,'spelltrap',I.SANCTUARY),source=uid(t,0,'hand',I.MAUSOLEUM);
    locate(t,old).item.leaveFieldRedirect='banished'; const before=JSON.stringify(t.state);
    assert.equal(options(t).length,0); assert.equal(E.execute(t.state,{type:TYPES.get(I.MAUSOLEUM),sourceUid:source}).pass,false);
    assert.equal(JSON.stringify(t.state),before);
  });
  await test('Forged actors, cost identity and Field Spell packet claims are rejected atomically',()=>{
    const t=make({oldField:I.SANCTUARY}),action=options(t).find(mechaba); assert(action);
    const before=JSON.stringify(t.state),monsterCost=t.state.zones[1].hand.find(row=>Number(H.card(row).typeBits)&1).uid;
    for (const patch of [{player:0},{costUid:monsterCost},{targetUid:uid(t,0,'spelltrap',I.SANCTUARY)},
      {registeredFieldSpellPacket:'TENYI_VESSEL'},{activationSourceCardId:I.SANCTUARY},
      {activationZone:'gy'},{matchingCardType:'MONSTER'}]) {
      const bad=copy(action); Object.assign(bad.response,patch); assert.equal(E.execute(t.state,bad).pass,false);
      assert.equal(JSON.stringify(t.state),before);
    }
  });
  await test('Fresh replay rejects altered pre-cost origins, replacement descriptors, staging and response payments',()=>{
    const t=make({oldField:I.SANCTUARY}); step(t,undefined,mechaba); const good=replay(t);
    for (const mutate of [line=>line.actions[0].proof.activationOrigin.zone='spelltrap',
      line=>line.actions[0].proof.fieldSpellActivation.sourceUid='fake',
      line=>line.actions[0].proof.fieldSpellActivation.player=1,
      line=>line.actions[0].proof.fieldSpellActivation.column=0,
      line=>line.actions[0].proof.fieldSpellActivation.replaced[0].faceUp=false,
      line=>line.actions[0].proof.fieldSpellActivation.replaced[0].to='banished',
      line=>line.actions[0].proof.fieldSpellActivation.replaced=[],
      line=>line.actions[0].paid[0].uid='fake',
      line=>line.actions[0].events.find(event=>event.type==='REPLACE_FIELD_SPELL').destroyed=true]) {
      const bad=copy(good); mutate(bad); assert.equal(E.replay(bad,{deck:t.deck}).pass,false);
    }
  });
  await test('Bounded search discovers a physical Field Spell negation and verifies its replay',async()=>{
    const t=make({oldField:I.SANCTUARY,policy:'FIRST_ELIGIBLE'});
    const result=await E.search(t.state,{maxDepth:1,maxStates:80,maxMs:5000,checkCurrentDeck:false,
      goal:state=>state.zones[0].banished.some(row=>id(row)===I.MAUSOLEUM)});
    assert.equal(result.pass,true); assert(result.lines.length);
    assert(result.lines.some(line=>line.actions.some(action=>action.type===TYPES.get(I.MAUSOLEUM))&&E.replay(line,{deck:t.deck}).pass));
  });
  const report={schema:'ygo-field-spell-activation-tests/v1',pass:tests.every(row=>row.pass),total:tests.length,tests,
    limitations:['Only Mausoleum of White and Salamangreat Sanctuary card activations and reviewed previous Field Spells are registered.',
      'Declared initial fields are physical assumptions, not certified preceding summon histories.',
      'The QA_FIELD_EFFECT_ONLY provider is a marked test fixture for effect-versus-activation cleanup, not an implemented TCG card or product response.',
      'Field Spell effect activations, arbitrary priority, Trap Card coverage and universal rulings remain outside this extension.']};
  fs.writeFileSync(path.join(ROOT,'tests/field-spell-activations-results.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2)); if(!report.pass) process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});

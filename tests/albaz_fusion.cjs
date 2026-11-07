'use strict';
/* Albaz uses actual registered arrivals over audited forty-card decks.
 * Starting rival fields/GYs are declared physical assumptions. QA-only
 * mutations below exercise rejection paths and never establish a witness. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const assert=require('node:assert/strict'),{harness,ROOT}=require('./combo_engine.cjs'),copy=structuredClone;
const I={ALBAZ:68468459,LUBELLION:70534340,MIRRORJADE:44146295,REBORN:83764718,
 DARK:46986414,FISH:23771716,BEWD:89631139,ARTEMIS:34755994,MECHABA:75286621,
 SPIRIT:59822133,SPIRIT_LINK:42097666,WOLF:87871125,ROAR:51339637,IMPERM:10045474,
 VEILER:97268402,ASH:14558127,CED:94192409,UNKNOWN:38033121,CLOWN:67696066,
 XYZ:16195942,PENDULUM:70026064,ASHUNA:87052196,ADHARA:98159737,MONK:32519092,
 BRANDED_FUSION:44362883,INVOCATION:74063034};
const TYPE='ALBAZ_FUSION',REBORN='ACTIVATE_MONSTER_REBORN',NORMAL='BRANDED_NORMAL_SUMMON_ALBAZ';

(async()=>{
 const {W,E,fixture}=await harness(true),H=E.helpers,tests=[],witnesses=[];
 for(const name of ['duel-phases','responses','archetypes-expanded','blue-eyes-duel','monster-reborn','albaz-fusion'])
  vm.runInNewContext(fs.readFileSync(path.join(ROOT,'src/app/'+name+'.js'),'utf8'),{window:W,structuredClone,console,Date,Promise,setTimeout,clearTimeout,performance},{filename:name+'.js'});
 await Promise.resolve();
 const id=H.baseId,fillers=[...new Set(fixture('Invoked').deck.main.filter(r=>![I.ALBAZ,I.REBORN,I.ASH,I.VEILER,I.INVOCATION].includes(r.id)).map(r=>r.id).concat([63749102,74367458,48305365,32452818,I.FISH]))];
 function deck(cards,extra){const main=new Map(),ex=new Map();for(const n of cards)main.set(n,(main.get(n)||0)+1);
  let size=cards.length;for(const n of fillers){if(size>=40)break;if(main.has(n))continue;const q=Math.min(3,40-size);main.set(n,q);size+=q;}
  assert.equal(size,40);for(const n of extra)ex.set(n,(ex.get(n)||0)+1);
  const d={main:[...main].map(([id,qty])=>({id,qty})),extra:[...ex].map(([id,qty])=>({id,qty})),side:[]};
  const audit=W.YGODataCatalog.auditDeck(d,{format:'tcg',banlist:W.BANLIST_PROFILES.tcg.data});assert.equal(audit.pass,true,JSON.stringify(audit));assert.equal(audit.counts.main,40);return d;
 }
 function opening(d,wanted,reserved){const available=new Map(d.main.map(r=>[r.id,r.qty])),out=[...wanted];
  for(const n of [...wanted,...reserved]){assert((available.get(n)||0)>0,'Missing physical '+n);available.set(n,available.get(n)-1);}
  for(const n of fillers)while(out.length<5&&(available.get(n)||0)>0){out.push(n);available.set(n,available.get(n)-1);}assert.equal(out.length,5);return out;
 }
 function remaining(d,hand){const out=d.main.flatMap(r=>Array(r.qty).fill(r.id));for(const n of hand){const at=out.indexOf(n);assert(at>=0);out.splice(at,1);}return out;}
 const isExtra=n=>!!(Number(W.YGODataCatalog.rulesCard(n).typeBits)&(0x40|0x2000|0x800000|0x4000000));
 const monster=(player,cardId,zoneIndex=0,properties={})=>({player,cardId,zone:'monster',from:isExtra(cardId)?'extra':'deck',faceUp:true,position:'ATTACK',summonTurn:1,zoneIndex,...properties});
 const gy=(player,cardId,properties={})=>({player,cardId,zone:'gy',from:isExtra(cardId)?'extra':'deck',...properties});
 const banished=(player,cardId,properties={})=>({player,cardId,zone:'banished',from:isExtra(cardId)?'extra':'deck',...properties});
 const set=(player,cardId,zoneIndex=0)=>({player,cardId,zone:'spelltrap',from:'deck',faceUp:false,setTurn:1,zoneIndex});
 function make(o={}){const placements=copy(o.placements||[]),wanted=[o.hands?.[0]||[I.ALBAZ,I.FISH,I.FISH],o.hands?.[1]||[]];
  const decks=[0,1].map(p=>deck([...placements.filter(x=>x.player===p&&x.from==='deck').map(x=>x.cardId),...wanted[p],...(o.cards?.[p]||[])],
   [...placements.filter(x=>x.player===p&&x.from==='extra').map(x=>x.cardId),...(o.extra?.[p]||[])]));
  const hands=decks.map((d,p)=>opening(d,wanted[p],placements.filter(x=>x.player===p&&x.from==='deck').map(x=>x.cardId)));
  const types=o.responseTypes||[],spec={deck:decks[0],openingIds:hands[0],remainingDeckIds:remaining(decks[0],hands[0]),opponentDeck:decks[1],opponentOpeningIds:hands[1],opponentRemainingDeckIds:remaining(decks[1],hands[1]),
   context:{format:'tcg',duelMode:true,manualBothPlayers:true,opponentPolicy:types.length?'RESPONSES_EXPLICIT':'PASS',responseTypes:types,responsePolicy:'CHOICE_BRANCHES',...(o.context||{})},
   setup:{turn:o.turn??2,activePlayer:o.activePlayer??0,phase:o.phase||'MAIN 1',placements}};
  const initial=E.createState(spec);return{deck:decks[0],spec,initial,state:copy(initial),actions:[]};
 }
 const cards=(t,p,z,n)=>t.state.zones[p][z].filter(x=>id(x)===n),uid=(t,p,z,n)=>cards(t,p,z,n)[0]?.uid,locate=(t,u)=>H.locate(t.state,u);
 const pass=a=>!a.response&&!a.responseUid,actions=(t,type=TYPE)=>E.enumerate(t.state).filter(a=>a.type===type);
 function step(t,type,predicate=pass){const a=E.enumerate(t.state).find(a=>a.type===type&&predicate(a));assert(a,'Missing '+type+': '+JSON.stringify(E.enumerate(t.state).map(a=>({type:a.type,sourceUid:a.sourceUid,targetUid:a.targetUid,fusionUid:a.fusionUid,discardUid:a.discardUid,materialUids:a.materialUids,destination:a.destination,position:a.position,response:a.response?.type,triggerKind:a.triggerKind}))));
  const prior=JSON.stringify(t.state),inventory=H.inventory(t.state),r=E.execute(t.state,a);assert.equal(r.pass,true,JSON.stringify(r));assert.equal(JSON.stringify(t.state),prior,'Input changed');assert.equal(H.inventory(r.after),inventory,'Physical inventory changed');t.state=r.after;t.actions.push(r.action);return r;
 }
 function reject(t,a){const before=JSON.stringify(t.state),r=E.execute(t.state,a);assert.equal(r.pass,false,JSON.stringify(r));assert.equal(JSON.stringify(t.state),before);return r;}
 function replay(t,save=false){const line=JSON.parse(JSON.stringify({before:t.initial,after:t.state,state:t.state,actions:t.actions,context:t.initial.context,deckFingerprint:E.deckFingerprint(t.deck),scope:E.version,certified:false,globalOptimalityProven:false}));
  const check=E.replay(line,{deck:t.deck});assert.equal(check.pass,true,JSON.stringify(check));if(save)witnesses.push({kind:t.actions.some(a=>a.type===TYPE)?'EXECUTED_ALBAZ_FUSION':'EXPLICIT_RESTRICTION_WITNESS',initialHistoryCertified:false,freshReplayPassed:true,actions:t.actions.map(a=>({type:a.type,sourceUid:a.sourceUid,targetUid:a.targetUid,discardUid:a.discardUid,fusionUid:a.fusionUid,materialUids:a.materialUids,destination:a.destination,position:a.position,triggerKind:a.triggerKind,response:a.response?{type:a.response.type,uid:a.response.uid,costUid:a.response.costUid}:undefined,paid:a.paid,activationOrigin:a.proof?.activationOrigin,activationNegated:a.proof?.activationNegated,effectNegated:a.proof?.effectNegated}))});return line;
 }
 function decline(t,kind){let guard=0;while(t.state.pendingTriggers.some(x=>!kind||x.kind===kind)){assert(guard++<20);step(t,'DECLINE_OPTIONAL_TRIGGER',a=>!kind||a.triggerKind===kind);}}
 function opportunity(recipe=I.LUBELLION,arrival='normal',o={}){const rival=o.rival??(recipe===I.LUBELLION?I.DARK:I.MECHABA),owner=o.owner??0;
  const placements=[monster(1,rival,2),...(arrival==='reborn'?[gy(owner,I.ALBAZ)]:[]),...(o.placements||[])];
  const t=make({...o,placements,hands:[o.hands?.[0]||(arrival==='reborn'?[I.REBORN,I.FISH,I.FISH]:[I.ALBAZ,I.FISH,I.FISH]),o.hands?.[1]||[]],extra:[[recipe,...(o.extra?.[0]||[])],o.extra?.[1]||[]]});
  const source=uid(t,arrival==='reborn'?owner:0,arrival==='reborn'?'gy':'hand',I.ALBAZ),cost=uid(t,0,'hand',I.FISH),other=uid(t,1,'monster',rival);
  assert.equal(t.state.pendingTriggers.filter(x=>x.kind===TYPE).length,0);
  if(arrival==='reborn')step(t,REBORN,a=>a.targetUid===source&&a.destination===(o.arrivalZone??0)&&a.position==='ATTACK'&&pass(a));
  else step(t,NORMAL,a=>a.sourceUid===source&&pass(a));
  return{t,source,cost,other,fusion:uid(t,0,'extra',recipe)};
 }
 const select=(source,cost,fusion,destination=0,position='ATTACK',response=pass)=>a=>a.sourceUid===source&&a.discardUid===cost&&a.fusionUid===fusion&&a.destination===destination&&a.position===position&&response(a);
 async function test(name,fn){try{await fn();tests.push({name,pass:true});}catch(error){tests.push({name,pass:false,error:error.stack});}}

 await test('The Albaz registry exposes a bounded actor-0 field effect and Reborn profile without executing card text',()=>{
  const c=W.YGOAlbazFusion.capabilities();assert(c);assert.equal(c.action,TYPE);assert.equal(c.cardId,I.ALBAZ);assert.equal(c.certified,false);
  assert.deepEqual(Array.from(c.players),[0]);assert.deepEqual(Array.from(c.arrivalActions),[NORMAL,REBORN]);assert.equal(c.activationZone,'monster');assert.equal(c.activationRestriction,'USE');assert.equal(c.damageStepTriggers,false);assert.equal(c.nonTargeting,true);
  const p=W.YGOMonsterReborn.capabilities();assert(Array.from(p.mainEffectCardIds).includes(I.ALBAZ));assert(!p.excludedProfiles.some(x=>x.id===I.ALBAZ));
  assert.equal(W.BANLIST_PROFILES.tcg.date,'19/10/2026');for(const n of [I.ALBAZ,I.LUBELLION,I.MIRRORJADE])assert.equal(W.YGODataCatalog.rulesCard(n).technicalSourceMatched,true);
 });
 await test('Pinned secondary Albaz Lua bytes and printed text identify the optional summon trigger, discard, forced source and opponent materials',()=>{
  const receipt=JSON.parse(fs.readFileSync(path.join(ROOT,'src/data/technical-references/albaz-reference.json'),'utf8')),lua=fs.readFileSync(path.join(ROOT,'src/data/technical-references/albaz-c68468459.lua'));
  assert.equal(receipt.cardId,I.ALBAZ);assert.equal(receipt.httpStatus,200);assert.equal(receipt.commit,'915c6ff63518a04e18d16ee45962d75a8c8be264');assert.equal(receipt.sha256,'99d39a6a0b1ef2ab7355898dac3046a5c2086732c18f8ca7b8c6bc914132695d');assert.equal(receipt.sha256,crypto.createHash('sha256').update(lua).digest('hex'));assert.equal(receipt.bytes,lua.length);assert.equal(receipt.officialRulingAuthentication,false);assert.equal(receipt.executableInAnalyzer,false);
  const source=lua.toString();for(const fragment of ['EFFECT_TYPE_TRIGGER_O','EVENT_SUMMON_SUCCESS','EVENT_SPSUMMON_SUCCESS','SetCountLimit(1,id)','not Duel.IsDamageStep()','SetCost(Cost.Discard())','Fusion.ForcedHandler','Fusion.CheckWithHandler(aux.FALSE)','Card.IsControler,Card.IsOnField','Card.IsFaceup'])assert(source.includes(fragment),fragment);
  const text=W.YGODataCatalog.rulesCard(I.ALBAZ).desc;for(const fragment of ['Normal or Special Summoned','except during the Damage Step','discard 1 card','including this card','cannot use other monsters you control','only use this effect'])assert(text.includes(fragment),fragment);
 });
 for(const recipe of [I.LUBELLION,I.MIRRORJADE])for(const arrival of ['normal','reborn'])await test('Actual '+arrival+' Albaz exposes the complete '+recipe+' Main-zone/position screen and every selected line freshly replays',()=>{
  const {t,source,cost,other,fusion}=opportunity(recipe,arrival),normal=copy(t.state.normalSummonAvailable),before=JSON.stringify(t.state),pending=t.state.pendingTriggers.filter(x=>x.kind===TYPE);
  assert.equal(pending.length,1);assert.equal(pending[0].sourceUid,source);assert.equal(pending[0].player,0);assert.equal(pending[0].observedAction,arrival==='normal'?NORMAL:REBORN);
  const screen=actions(t).filter(a=>a.discardUid===cost&&pass(a));assert.equal(screen.length,10);
  assert.deepEqual(Array.from(screen,a=>[a.destination,a.position]).sort(),[0,1,2,3,4].flatMap(z=>['ATTACK','DEFENSE'].map(p=>[z,p])).sort());
  for(const a of screen){assert.deepEqual(Array.from(a.materialUids),[source,other]);assert.equal(a.sourceUid,source);assert.equal(a.fusionUid,fusion);assert.equal(a.nonTargeting,true);assert(!a.materialUids.includes(cost));
   const branch={...t,state:copy(t.state),actions:copy(t.actions)},r=step(branch,TYPE,x=>JSON.stringify(x)===JSON.stringify(a)),x=locate(branch,fusion).item;
   assert.equal(x.ownerPlayer,0);assert.equal(x.summonType,'FUSION');assert.equal(x.properSummonType,'FUSION');assert.equal(x.properlySummoned,true);assert.equal(x.zoneIndex,a.destination);assert.equal(x.position,a.position);assert.equal(x.faceUp,true);
   assert.equal(locate(branch,source).zone,'gy');assert.equal(locate(branch,source).player,0);assert.equal(locate(branch,other).zone,'gy');assert.equal(locate(branch,other).player,1);assert.equal(locate(branch,cost).zone,'gy');
   assert.equal(r.action.paid.filter(p=>p.kind==='DISCARD'&&p.uid===cost).length,1);assert.equal(r.action.paid.filter(p=>p.kind==='FUSION_MATERIAL').length,2);assert(!r.action.events.some(e=>e.type==='TARGET'));assert.deepEqual(branch.state.normalSummonAvailable,normal);assert.equal(branch.state.used.ALBAZ_FUSION,true);assert.deepEqual(Array.from(branch.state.extraHistory),['FUSION']);
   assert.equal(branch.state.pendingTriggers.some(p=>p.kind==='LUBELLION_FUSION'),recipe===I.LUBELLION);replay(branch,a.destination===0&&a.position==='ATTACK');
  }
  for(let n=0;n<3;n++)E.enumerate(t.state);assert.equal(JSON.stringify(t.state),before,'Enumeration must not invent opportunities');
 });
 await test('Actual opponent-owned Reborn Albaz pays actor-0 cost and its Fusion material returns to the owner-1 GY',()=>{
  for(const recipe of [I.LUBELLION,I.MIRRORJADE]){const {t,source,cost,other,fusion}=opportunity(recipe,'reborn',{owner:1});assert.equal(locate(t,source).player,0);assert.equal(locate(t,source).item.ownerPlayer,1);
   step(t,TYPE,select(source,cost,fusion,4,'DEFENSE'));for(const u of [source,other]){assert.equal(locate(t,u).zone,'gy');assert.equal(locate(t,u).player,1);assert.equal(locate(t,u).item.ownerPlayer,1);}
   assert.equal(cards(t,0,'gy',I.ALBAZ).length,0);assert.equal(locate(t,cost).player,0);assert.equal(locate(t,fusion).player,0);if(recipe===I.LUBELLION)assert(!actions(t,'LUBELLION_FUSION_MIRRORJADE').some(a=>a.materialUids.includes(source)));replay(t,true);
  }
 });
 await test('Main Phase 2 admits the actual Normal arrival and a face-up Defense Reborn Albaz without changing trigger timing',()=>{
  const {t,source,cost,fusion}=opportunity(I.LUBELLION,'normal',{phase:'MAIN 2'});step(t,TYPE,select(source,cost,fusion,0,'DEFENSE'));replay(t,true);
  const q=make({phase:'MAIN 2',hands:[[I.REBORN,I.FISH],[]],placements:[gy(0,I.ALBAZ),monster(1,I.MECHABA,2)],extra:[[I.MIRRORJADE],[]]}),albaz=uid(q,0,'gy',I.ALBAZ),discard=uid(q,0,'hand',I.FISH),mirror=uid(q,0,'extra',I.MIRRORJADE);
  step(q,REBORN,a=>a.targetUid===albaz&&a.destination===3&&a.position==='DEFENSE'&&pass(a));assert.equal(locate(q,albaz).item.position,'DEFENSE');assert(q.state.pendingTriggers.some(p=>p.kind===TYPE&&p.sourceUid===albaz));step(q,TYPE,select(albaz,discard,mirror,3));replay(q,true);
 });
 await test('Material capacity is checked after Albaz leaves a full Main field, retaining the occupied zones',()=>{
  const placements=[monster(0,I.FISH,0),monster(0,I.BEWD,1),monster(0,I.DARK,2),monster(0,97127906,3)];
  const {t,source,cost,fusion}=opportunity(I.LUBELLION,'normal',{placements});assert.equal(locate(t,source).item.zoneIndex,4);assert.equal(t.state.zones[0].monster.length,5);assert(actions(t).length);assert(actions(t).every(a=>a.destination===4));
  const a=actions(t).find(pass);reject(t,{...a,destination:0});step(t,TYPE,select(source,cost,fusion,4));assert.equal(t.state.zones[0].monster.length,5);replay(t);
 });
 await test('The source itself is required and own field/hand/Deck/GY copies never substitute for the rival material',()=>{
  const {t,source,cost,other,fusion}=opportunity(I.LUBELLION,'normal',{hands:[[I.ALBAZ,I.FISH,I.DARK],[]],placements:[monster(0,I.DARK,3),gy(0,I.DARK)],cards:[[I.ALBAZ],[]]});
  assert(actions(t).every(a=>JSON.stringify(a.materialUids)===JSON.stringify([source,other])));const a=actions(t).find(pass);assert(a);
  for(const replacement of [uid(t,0,'monster',I.DARK),uid(t,0,'hand',I.DARK),uid(t,0,'gy',I.DARK),uid(t,0,'deck',I.ALBAZ),cost,'invented'])reject(t,{...a,materialUids:[source,replacement]});
  reject(t,{...a,materialUids:[other,source]});reject(t,{...a,materialUids:[source,source]});reject(t,{...a,sourceUid:other});reject(t,{...a,materialUids:[other,uid(t,0,'monster',I.DARK)]});
  step(t,TYPE,select(source,cost,fusion));replay(t);
 });
 await test('The DARK and Extra recipes use printed physical types: reviewed Fusion, Synchro and Link rivals qualify for Mirrorjade',()=>{
  for(const rival of [I.MECHABA,I.SPIRIT,I.ARTEMIS]){const {t,source,cost,other,fusion}=opportunity(I.MIRRORJADE,'normal',{rival});assert(actions(t).some(a=>a.materialUids.includes(other)));step(t,TYPE,select(source,cost,fusion));assert.equal(locate(t,other).player,1);assert.equal(locate(t,other).zone,'gy');replay(t);}
  const {t}=opportunity(I.LUBELLION,'normal',{rival:I.BEWD});assert.equal(actions(t).length,0);assert(t.state.events.some(x=>x.type==='ALBAZ_FUSION_TRIGGER_OUTSIDE_SCOPE'&&x.optional));decline(t,TYPE);replay(t);
 });
 await test('Setup Albaz and a real Normal Set create no synthetic summon-trigger opportunity',()=>{
  const t=make({placements:[monster(0,I.ALBAZ,0),monster(1,I.DARK,2)],extra:[[I.LUBELLION],[]]});assert.equal(actions(t).length,0);assert(!t.state.pendingTriggers.some(x=>x.kind===TYPE));
  const s=make({placements:[monster(1,I.DARK,2)],extra:[[I.LUBELLION],[]]});step(s,'DUEL_NORMAL_SUMMON_OR_SET',a=>a.sourceUid===uid(s,0,'hand',I.FISH)&&a.position==='SET'&&pass(a));assert.equal(actions(s).length,0);assert(!s.state.pendingTriggers.some(x=>x.kind===TYPE));replay(s);
 });
 await test('Explicit optional decline consumes only the observed opportunity and enumeration cannot recreate it',()=>{
  const {t,source,cost}=opportunity();const old=actions(t).find(pass);assert(old);decline(t,TYPE);assert.equal(t.state.used.ALBAZ_FUSION,undefined);assert.equal(locate(t,cost).zone,'hand');assert.equal(locate(t,source).zone,'monster');
  for(let n=0;n<4;n++)assert.equal(actions(t).length,0);reject(t,old);replay(t);
 });
 await test('No safe physical hand cost records the optional effect outside scope without borrowing a field or Deck card',()=>{
  const {t,source}=opportunity(I.LUBELLION,'normal',{hands:[[I.ALBAZ,I.CLOWN,I.CLOWN,I.CLOWN,10000000],[]]});assert.equal(actions(t).length,0);assert(t.state.events.some(p=>p.type==='ALBAZ_FUSION_TRIGGER_OUTSIDE_SCOPE'&&p.optional));assert.equal(t.state.used.ALBAZ_FUSION,undefined);decline(t,TYPE);assert.equal(locate(t,source).zone,'monster');replay(t);
 });
 await test('The genuine Lubellion continuation pays another discard and returns only actor-0 field/GY/face-up-banished materials',()=>{
  const {t,source,cost,fusion}=opportunity(I.LUBELLION,'normal',{extra:[[I.MIRRORJADE],[]],placements:[monster(0,I.ARTEMIS,5),gy(0,I.MECHABA),banished(0,I.SPIRIT),gy(1,I.ALBAZ),gy(1,I.ARTEMIS)]});
  step(t,TYPE,select(source,cost,fusion));const choices=actions(t,'LUBELLION_FUSION_MIRRORJADE');assert(choices.length);const admitted=[uid(t,0,'monster',I.ARTEMIS),uid(t,0,'gy',I.MECHABA),uid(t,0,'banished',I.SPIRIT),fusion];
  for(const u of admitted)assert(choices.some(a=>a.materialUids.includes(u)),u);for(const a of choices){assert(a.materialUids.includes(source));for(const u of a.materialUids){const hit=locate(t,u);assert.equal(hit.player,0);assert(['monster','gy','banished'].includes(hit.zone));assert.notEqual(hit.item.faceDown,true);}assert.notEqual(a.discardUid,cost);}
  const second=uid(t,0,'hand',I.FISH),mirror=uid(t,0,'extra',I.MIRRORJADE);step(t,'LUBELLION_FUSION_MIRRORJADE',a=>a.sourceUid===fusion&&a.discardUid===second&&a.fusionUid===mirror&&a.materialUids.includes(fusion)&&a.materialUids.includes(source)&&pass(a));
  assert.equal(locate(t,second).zone,'gy');assert.equal(locate(t,source).zone,'deck');assert.equal(locate(t,fusion).zone,'extra');assert.equal(locate(t,mirror).item.properSummonType,'FUSION');assert.equal(t.state.deckOrderKnown[0],false);assert.equal(t.state.used.LUBELLION_FUSION,true);assert(t.state.locks.some(l=>l.kind==='FUSION_ONLY'));replay(t,true);
 });
 for(const responseType of ['MECHABA','ROAR','VEILER','IMPERM'])await test('Real '+responseType+' pays its physical response and preserves Albaz discard plus printed USE on negation',()=>{
  const placements=responseType==='MECHABA'?[monster(1,I.MECHABA,0)]:responseType==='ROAR'?[monster(1,I.WOLF,5),set(1,I.ROAR,0)]:responseType==='IMPERM'?[set(1,I.IMPERM,0)]:[];
  const hands=responseType==='MECHABA'||responseType==='VEILER'?[[I.ALBAZ,I.FISH,I.FISH],[I.VEILER]]:undefined;
  const {t,source,cost,other,fusion}=opportunity(I.LUBELLION,'normal',{placements,hands,responseTypes:[responseType]}),a=actions(t).find(a=>select(source,cost,fusion,0,'ATTACK',()=>true)(a)&&a.response?.type===responseType&&!a.counterResponses);
  assert(a);const responseUid=a.response.uid,responseCost=a.response.costUid,r=step(t,TYPE,x=>JSON.stringify(x)===JSON.stringify(a));
  assert.equal(r.action.proof.effectNegated,true);assert.equal(t.state.used.ALBAZ_FUSION,true);assert.equal(locate(t,cost).zone,'gy');assert.equal(locate(t,fusion).zone,'extra');assert.equal(locate(t,other).zone,'monster');assert(!t.state.pendingTriggers.some(x=>x.kind===TYPE));assert(!t.state.pendingTriggers.some(x=>x.kind==='LUBELLION_FUSION'));assert(!r.action.paid.some(p=>p.kind==='FUSION_MATERIAL'));
  if(responseType==='MECHABA'){assert.equal(r.action.proof.activationNegated,true);assert.equal(locate(t,source).zone,'banished');assert.equal(locate(t,responseCost).zone,'gy');assert.equal(locate(t,responseCost).player,1);}else if(responseType==='ROAR'){assert.equal(r.action.proof.activationNegated,true);assert.equal(locate(t,source).zone,'gy');assert.equal(locate(t,responseUid).zone,'gy');}else{assert.equal(r.action.proof.activationNegated,false);assert.equal(locate(t,source).item.effectsNegated,true);assert.equal(locate(t,responseUid).zone,'gy');}replay(t,true);
 });
 await test('Albaz is a field activation with no Ash or Spirit GY reply despite a real Reborn arrival',()=>{
  const {t,source,cost,fusion}=opportunity(I.LUBELLION,'reborn',{hands:[[I.REBORN,I.FISH,I.FISH],[I.ASH]],placements:[monster(1,I.SPIRIT,0)],responseTypes:['ASH','SPIRIT']});
  assert(actions(t).length);assert(actions(t).every(a=>!a.responseUid&&a.response?.type!=='SPIRIT'));const a=actions(t).find(pass);reject(t,{...a,responseUid:uid(t,1,'hand',I.ASH)});reject(t,{...a,response:{type:'SPIRIT',uid:uid(t,1,'monster',I.SPIRIT),player:1,targetUid:source,activationZone:'gy',nonTargeting:true}});
  const r=step(t,TYPE,select(source,cost,fusion));assert.equal(r.action.proof.activationOrigin.zone,'monster');assert.equal(r.action.proof.activationOrigin.restriction,'USE');assert.equal(r.action.proof.activationOrigin.registeredForGyNegation,false);replay(t);
 });
 await test('QA-only prior field negation still permits activation, pays the physical cost and consumes USE without moving materials',()=>{
  const {t,source,cost,other,fusion}=opportunity();replay(t);const diagnostic=copy(t.state);H.locate(diagnostic,source).item.effectsNegated=true;const q={...t,state:diagnostic};
  const r=step(q,TYPE,select(source,cost,fusion));assert.equal(r.action.proof.effectNegated,true);assert.equal(locate(q,cost).zone,'gy');assert.equal(locate(q,source).zone,'monster');assert.equal(locate(q,other).zone,'monster');assert.equal(locate(q,fusion).zone,'extra');assert.equal(q.state.used.ALBAZ_FUSION,true);
 });
 await test('Printed Albaz USE persists across real activation negation, physical revival and another actual arrival in the same turn',()=>{
  const {t,source,cost,fusion}=opportunity(I.LUBELLION,'normal',{hands:[[I.ALBAZ,I.FISH,I.REBORN],[]],placements:[monster(1,I.WOLF,5),set(1,I.ROAR,0)],responseTypes:['ROAR']});
  step(t,TYPE,select(source,cost,fusion,0,'ATTACK',a=>a.response?.type==='ROAR'&&!a.counterResponses));assert.equal(t.state.used.ALBAZ_FUSION,true);assert.equal(locate(t,source).zone,'gy');
  step(t,REBORN,a=>a.targetUid===source&&a.destination===0&&a.position==='ATTACK'&&pass(a));assert.equal(locate(t,source).zone,'monster');assert(!t.state.pendingTriggers.some(x=>x.kind===TYPE));assert.equal(actions(t).length,0);replay(t);
 });
 await test('Actual Albaz and Wolf overlap requires explicit decline before either optional packet can resolve',()=>{
  const {t,source,cost,fusion}=opportunity(I.MIRRORJADE,'normal',{placements:[monster(0,I.FISH,0),monster(0,I.WOLF,5),gy(0,I.ASH)]}),wolf=uid(t,0,'monster',I.WOLF);
  assert.equal(locate(t,source).item.zoneIndex,1);assert(t.state.pendingTriggers.some(p=>p.kind===TYPE));assert(t.state.pendingTriggers.some(p=>p.kind==='SALAMANGREAT_WOLF_FIRE'&&p.sourceUid===wolf));assert.equal(actions(t).length,0);assert.equal(actions(t,'SALAMANGREAT_WOLF_RECOVER_FIRE').length,0);
  const first={...t,state:copy(t.state),actions:copy(t.actions)};decline(first,'SALAMANGREAT_WOLF_FIRE');assert(actions(first).length);step(first,TYPE,select(source,cost,fusion,1));decline(first);replay(first);
  const second={...t,state:copy(t.state),actions:copy(t.actions)},ash=uid(second,0,'gy',I.ASH);decline(second,TYPE);assert.equal(actions(second).length,0);step(second,'SALAMANGREAT_WOLF_RECOVER_FIRE',a=>a.sourceUid===wolf&&(a.selectionUid??a.targetUid)===ash&&pass(a));assert.equal(locate(second,source).zone,'monster');assert.equal(locate(second,cost).zone,'hand');assert.equal(second.state.used.ALBAZ_FUSION,undefined);assert.equal(locate(second,ash).zone,'hand');replay(second);
 });
 await test('QA-only an appended known or unknown mandatory packet cannot be skipped by Albaz activation or paid costs',()=>{
  const {t,source,cost}=opportunity(),candidate=actions(t).find(pass);assert(candidate);replay(t);
  for(const kind of ['AZURE_PROTECTION','UNREGISTERED_MANDATORY_DIAGNOSTIC']){const diagnostic=copy(t.state);diagnostic.pendingTriggers.push({kind,sourceUid:source,player:0,mandatory:true});const q={...t,state:diagnostic,actions:copy(t.actions)};
   assert.equal(actions(q).length,0);reject(q,candidate);assert.equal(locate(q,cost).zone,'hand');assert.equal(q.state.used.ALBAZ_FUSION,undefined);assert.equal(q.state.pendingTriggers.filter(p=>p.mandatory).length,1);
   assert(E.enumerate(q.state).every(a=>a.type==='DECLINE_OPTIONAL_TRIGGER'),'Only an explicit decline is admitted before the unresolved compound trigger');decline(q,TYPE);assert(q.state.pendingTriggers.some(p=>p.kind===kind&&p.mandatory));assert.equal(locate(q,cost).zone,'hand');
  }
 });
 await test('Mirrorjade control maximum is checked before payment, and an actual Albaz Fusion establishes later GY revival qualification',()=>{
  const blocked=opportunity(I.MIRRORJADE,'normal',{placements:[monster(0,I.MIRRORJADE,0)]});assert.equal(actions(blocked.t).length,0);assert.equal(locate(blocked.t,blocked.cost).zone,'hand');assert.equal(blocked.t.state.used.ALBAZ_FUSION,undefined);replay(blocked.t);
  const {t,source,cost,fusion}=opportunity(I.MIRRORJADE,'normal',{hands:[[I.ALBAZ,I.FISH,I.REBORN],[]],placements:[monster(1,I.BEWD,3)]});step(t,TYPE,select(source,cost,fusion));const qualified=copy(locate(t,fusion).item),history=copy(t.state.extraHistory);
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='BATTLE');step(t,'DUEL_ATTACK',a=>a.attackerUid===fusion&&a.targetUid===uid(t,1,'monster',I.BEWD)&&pass(a));assert.equal(locate(t,fusion).zone,'gy');assert(t.actions.at(-1).events.some(e=>e.type==='OPTIONAL_EFFECT_DECLINED'&&e.effect==='MIRRORJADE_END_PHASE_DESTRUCTION'));
  step(t,'DUEL_ADVANCE_PHASE',a=>a.toPhase==='MAIN 2');step(t,REBORN,a=>a.targetUid===fusion&&a.destination===4&&a.position==='DEFENSE'&&pass(a));const revived=locate(t,fusion).item;assert.equal(revived.uid,qualified.uid);assert.equal(revived.ownerPlayer,qualified.ownerPlayer);assert.equal(revived.summonType,'SPECIAL');assert.equal(revived.properSummonType,'FUSION');assert.equal(revived.properlySummoned,true);assert.deepEqual(t.state.extraHistory,history);replay(t,true);
 });
 await test('QA-only full stale controls and forged source/material/cost/target/destination declarations are rejected atomically',()=>{
  const {t,source,cost,other,fusion}=opportunity(),a=actions(t).find(x=>select(source,cost,fusion)(x));assert(a);
  for(const change of [{sourceUid:'invented'},{discardUid:'invented'},{discardUid:source},{discardUid:other},{fusionUid:'invented'},{fusionUid:other},{materialUids:[source,'invented']},{materialUids:[source,source]},{destination:5},{destination:-1},{position:'SET'},{player:1},{nonTargeting:false},{targetUid:other}])reject(t,{...a,...change});
  replay(t);for(const mutate of [q=>H.move(q,source,'gy'),q=>{H.locate(q,source).item.faceUp=false;},q=>H.move(q,cost,'gy'),q=>H.move(q,other,'gy'),q=>{H.locate(q,other).item.faceUp=false;},q=>H.move(q,fusion,'gy')]){const diagnostic=copy(t.state);mutate(diagnostic);const q={...t,state:diagnostic};reject(q,a);assert.equal(q.state.used.ALBAZ_FUSION,undefined);}
 });
 await test('QA-only attachments, leave redirects and unreviewed opponent departures never become admitted Fusion materials',()=>{
  const {t,other}=opportunity();replay(t);for(const change of [{attachments:['unmodeled']},{overlayUids:['unmodeled']},{equippedCards:['unmodeled']},{leaveFieldRedirect:'banished'}]){const diagnostic=copy(t.state);Object.assign(H.locate(diagnostic,other).item,change);assert.equal(actions({...t,state:diagnostic}).length,0);}
  for(const rival of [I.UNKNOWN,I.CLOWN,I.XYZ,I.PENDULUM,I.MIRRORJADE]){const {t:q}=opportunity(I.MIRRORJADE,'normal',{rival});assert.equal(actions(q).length,0);assert.equal(q.state.used.ALBAZ_FUSION,undefined);decline(q,TYPE);replay(q);}
 });
 await test('An unknown face-up continuous field excludes the packet before cost while facedown unknown cards disclose no effect',()=>{
  const {t,cost}=opportunity(I.LUBELLION,'normal',{placements:[monster(1,I.UNKNOWN,0)]});assert.equal(actions(t).length,0);assert.equal(locate(t,cost).zone,'hand');assert.equal(t.state.used.ALBAZ_FUSION,undefined);decline(t,TYPE);replay(t);
  const {t:q}=opportunity(I.LUBELLION,'normal',{placements:[monster(1,I.UNKNOWN,0,{faceUp:false,position:'SET'})]});assert(actions(q).length);replay(q);
 });
 await test('Spirit with Eyes of Blue and QA-only Wyrm, Synchro and Wolf-name locks are checked before discard; Fusion-only permits Fusion',()=>{
  const {t,source,cost,fusion}=opportunity(I.MIRRORJADE,'normal',{placements:[monster(0,I.SPIRIT_LINK,5)]});assert.equal(actions(t).length,0);assert.equal(locate(t,cost).zone,'hand');decline(t,TYPE);replay(t);
  const plain=opportunity(),candidate=actions(plain.t).find(pass);assert(candidate);replay(plain.t);
  for(const lock of [{kind:'WYRM_ONLY',wholeTurn:true,appliesToPlayer:0},{kind:'SYNCHRO_ONLY',sourceUid:plain.source},{kind:'SALAMANGREAT_WOLF_NAME_LOCK',cardId:I.LUBELLION,wholeTurn:true,appliesToPlayer:0,untilTurn:plain.t.state.turn}]){const diagnostic=copy(plain.t.state);diagnostic.locks.push(lock);const q={...plain.t,state:diagnostic};assert.equal(actions(q).length,0);reject(q,candidate);assert.equal(locate(q,plain.cost).zone,'hand');assert.equal(q.state.used.ALBAZ_FUSION,undefined);}
  const diagnostic=copy(plain.t.state);diagnostic.locks.push({kind:'FUSION_ONLY',wholeTurn:true,appliesToPlayer:0});const q={...plain.t,state:diagnostic};assert(actions(q).length);assert.equal(locate(q,plain.cost).zone,'hand');
 });
 await test('An actual paid Ashuna Wyrm restriction excludes Lubellion before any Albaz cost is spent',()=>{
  const t=make({hands:[[I.ASHUNA,I.ALBAZ,I.FISH],[]],cards:[[I.ADHARA],[]],placements:[monster(1,I.DARK,2)],extra:[[I.MONK,I.LUBELLION],[]]});
  step(t,'TENYI_HAND_SPECIAL',a=>a.sourceUid===uid(t,0,'hand',I.ASHUNA)&&pass(a));step(t,'TENYI_LINK_MONK',pass);step(t,'TENYI_ASHUNA_DECK',a=>a.selectionUid===uid(t,0,'deck',I.ADHARA)&&pass(a));assert(t.state.locks.some(l=>l.kind==='WYRM_ONLY'));
  const cost=uid(t,0,'hand',I.FISH);step(t,NORMAL,a=>a.sourceUid===uid(t,0,'hand',I.ALBAZ)&&pass(a));assert.equal(actions(t).length,0);assert.equal(locate(t,cost).zone,'hand');assert.equal(t.state.used.ALBAZ_FUSION,undefined);assert(t.state.events.some(e=>e.type==='ALBAZ_FUSION_TRIGGER_OUTSIDE_SCOPE'));replay(t,true);
 });
 await test('An actual Branded Fusion whole-turn Fusion-only restriction permits the subsequent real Albaz Fusion',()=>{
  const t=make({hands:[[I.BRANDED_FUSION,I.ALBAZ,I.FISH,I.FISH],[]],cards:[[I.ALBAZ,I.DARK],[]],placements:[monster(1,I.DARK,2)],extra:[[I.LUBELLION,I.LUBELLION],[]]});
  const first=uid(t,0,'extra',I.LUBELLION);step(t,'BRANDED_FUSION_LUBELLION',a=>a.fusionUid===first&&a.materialUids.includes(uid(t,0,'deck',I.ALBAZ))&&a.materialUids.includes(uid(t,0,'deck',I.DARK))&&pass(a));decline(t,'LUBELLION_FUSION');assert(t.state.locks.some(l=>l.kind==='FUSION_ONLY'&&l.wholeTurn));
  const source=uid(t,0,'hand',I.ALBAZ),cost=uid(t,0,'hand',I.FISH),second=uid(t,0,'extra',I.LUBELLION);step(t,NORMAL,a=>a.sourceUid===source&&pass(a));step(t,TYPE,select(source,cost,second,1));assert.equal(locate(t,first).zone,'monster');assert.equal(locate(t,second).item.properSummonType,'FUSION');assert.deepEqual(Array.from(t.state.extraHistory),['FUSION','FUSION']);replay(t,true);
 });
 await test('JSON-imported actual Fusion reports freshly replay and reject altered physical source, discard, material, ownership and proper history',()=>{
  const {t,source,cost,other,fusion}=opportunity(I.MIRRORJADE,'reborn',{owner:1});step(t,TYPE,select(source,cost,fusion));const line=replay(t);
  for(const mutate of [l=>{l.actions.at(-1).sourceUid='invented';},l=>{l.actions.at(-1).discardUid=other;},l=>{l.actions.at(-1).materialUids=[source,cost];},l=>{l.actions.at(-1).fusionUid=other;},l=>{l.actions.at(-1).paid.find(p=>p.kind==='DISCARD').uid='invented';},l=>{l.after.zones[1].gy.find(x=>x.uid===source).ownerPlayer=0;},l=>{l.after.zones[0].monster.find(x=>x.uid===fusion).properSummonType='LINK';},l=>{l.after.extraHistory=[];},l=>{l.after.pendingTriggers.push({kind:TYPE,sourceUid:source,player:0,observedAction:REBORN});},l=>{l.actions.at(-1).proof.activationOrigin.zone='gy';}]){const bad=JSON.parse(JSON.stringify(line));mutate(bad);bad.state=copy(bad.after);assert.equal(E.replay(bad,{deck:t.deck}).pass,false);}
 });
 await test('Bounded search from a real opening discovers the Normal Albaz Fusion route and every returned witness freshly replays',async()=>{
  const t=make({hands:[[I.ALBAZ,I.DARK,I.DARK,I.DARK,I.BEWD],[]],placements:[monster(1,I.DARK,2)],extra:[[I.LUBELLION],[]]}),before=JSON.stringify(t.initial);
  const r=await E.search(t.initial,{goal:s=>s.zones[0].monster.some(x=>id(x)===I.LUBELLION&&x.properSummonType==='FUSION'),maxDepth:3,maxStates:800,maxMs:10000,checkCurrentDeck:false});assert.equal(r.pass,true);assert(r.lines.length,JSON.stringify({status:r.status,expanded:r.expanded,budgetReasons:r.budgetReasons}));for(const l of r.lines){assert(l.actions.some(a=>a.type===NORMAL));assert(l.actions.some(a=>a.type===TYPE));assert.equal(E.replay(JSON.parse(JSON.stringify(l)),{deck:t.deck}).pass,true);}assert.equal(r.certified,false);assert.equal(r.globalOptimalityProven,false);assert.equal(JSON.stringify(t.initial),before);
 });

 const report={schema:'ygo-albaz-fusion-tests/v1',pass:tests.every(x=>x.pass),total:tests.length,tests,witnesses,limitations:[
  'Pinned CDB metadata, technical Lua and the dated TCG application restriction snapshot are secondary evidence; no new official ruling authentication is asserted, and Lua/card descriptions are never evaluated.',
  'Only actual registered Normal and Monster Reborn arrivals establish Albaz opportunities. Starting fields and GYs remain declared physical assumptions; QA-only mutations are diagnostics, never legal witnesses.',
  'Actor 0 alone uses the bounded Albaz packet: one safe physical hand discard, itself plus a reviewed rival field material, and own Extra Lubellion or Mirrorjade in a free Main zone. General Fusion selection, Xyz/Pendulum, attachments, redirects, unreviewed departures, Damage Step and general SEGOC remain excluded.',
  'Lubellion continuation uses the existing bounded own field/GY/face-up-banished packet; competitive quality, universal rules correctness and global search optimality are not certified.'
 ]};fs.writeFileSync(path.join(ROOT,'tests/albaz-fusion-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));process.exitCode=report.pass?0:1;
})().catch(error=>{console.error(error);process.exitCode=1;});

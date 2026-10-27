'use strict';
/* Integration regressions over the shipped causal engine, physical catalogue,
 * and pinned application restriction snapshot. Diagnostic setups declare their
 * prior history; executed transitions and every accepted trace replay freshly.
 * These tests do not authenticate official rulings or competitive performance. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {harness}=require('./combo_engine.cjs');
const ROOT=path.resolve(__dirname,'..'),copy=structuredClone;
const I={IMPERM:10045474,ALEISTER:86120751,INVOCATION:74063034,ARTEMIS:34755994,MECHABA:75286621,ASH:14558127,VEILER:97268402,CROW:24508238,DROLL:94145021,
 SPIRIT:59822133,AZURE:40908371,SPARK:83994433,BEWD:89631139,FISH:23771716,ANCIENTS:71039903,MOYE:20001443,CHIXIAO:69248256,
 ASHUNA:87052196,ADHARA:98159737,VISHUDA:23431858,MONK:32519092,SHAMAN:78917791,GAZELLE:26889158,SPINNY:52277807,WOLF:87871125,SANCTUARY:1295111,ROAR:51339637,
 MIRRORJADE:44146295,LUBELLION:70534340};
(async()=>{
 const h=await harness(true),{W,E}=h,H=E.helpers,id=x=>Number((x.card||x).id);
 for(const name of ['duel-phases','responses','archetypes-expanded','blue-eyes-duel','strategy'])vm.runInNewContext(fs.readFileSync(path.join(ROOT,'src/app/'+name+'.js'),'utf8'),{window:W,structuredClone,console,Date,performance,setTimeout,clearTimeout});
 const filler=h.fixture('Invoked').deck.main.filter(c=>![I.ALEISTER,I.INVOCATION].includes(Number(c.id))).map(c=>Number(c.id));
 for(const n of [63749102,74367458,48305365,32452818])if(!filler.includes(n))filler.push(n);
 function deckFrom(main=[],extra=[]){
  const counts=new Map();for(const row of main){const n=typeof row==='number'?row:row.id,q=typeof row==='number'?1:row.qty;counts.set(n,(counts.get(n)||0)+q);}
  let total=[...counts.values()].reduce((a,b)=>a+b,0);for(const n of filler){if(total>=40)break;if(counts.has(n))continue;const q=Math.min(3,40-total);counts.set(n,q);total+=q;}
  assert.equal(total,40,'Forty actual Main Deck copies are required');
  const d={main:[...counts].map(([id,qty])=>({id,qty})),extra:extra.map(row=>typeof row==='number'?{id:row,qty:1}:copy(row)),side:[]};
  const audit=W.YGODataCatalog.auditDeck(d,{format:'tcg',banlist:W.BANLIST_PROFILES.tcg.data});assert.equal(audit.pass,true,JSON.stringify(audit.errors));return d;
 }
 function opening(deck,wanted=[],reserved=[]){const result=wanted.slice(),available=new Map(deck.main.map(c=>[c.id,c.qty]));for(const n of reserved){assert((available.get(n)||0)>0,'Missing reserved setup card '+n);available.set(n,available.get(n)-1);}for(const n of wanted){assert((available.get(n)||0)>0,'Missing desired hand card '+n);available.set(n,available.get(n)-1);}for(const n of filler)if(result.length<5&&(available.get(n)||0)>0){result.push(n);available.set(n,available.get(n)-1);}assert.equal(result.length,5);return result;}
 function remaining(deck,hand){const ids=deck.main.flatMap(c=>Array(c.qty).fill(c.id));for(const n of hand){const at=ids.indexOf(n);assert(at>=0);ids.splice(at,1);}return ids;}
 function make(o={}){
  const reserved=p=>(o.placements||[]).filter(x=>x.player===p&&(!x.from||x.from==='deck')).map(x=>x.cardId);
  const deck=o.deck||deckFrom(o.main||[],o.extra||[]),rival=o.opponentDeck||deckFrom(o.opponentMain||[],o.opponentExtra||[]),hand=o.openingIds||opening(deck,o.hand||[],reserved(0)),opHand=o.opponentOpeningIds||opening(rival,o.opponentHand||[],reserved(1));
  const spec={deck,openingIds:hand,remainingDeckIds:o.remainingDeckIds||remaining(deck,hand),opponentDeck:rival,opponentOpeningIds:opHand,opponentRemainingDeckIds:o.opponentRemainingDeckIds||remaining(rival,opHand),
   setup:{turn:o.turn??2,activePlayer:o.activePlayer??0,phase:o.phase||'MAIN 1',placements:copy(o.placements||[])},
   context:{format:'tcg',banlistVersion:W.BANLIST_PROFILES.tcg.date,duelMode:true,opponentPolicy:o.responseTypes?.length?'RESPONSES_EXPLICIT':'PASS',responseTypes:o.responseTypes||[],responsePolicy:o.responsePolicy||'CHOICE_BRANCHES',...(o.context||{})}};
  const state=E.createState(spec);return{spec,deck,initial:copy(state),state,actions:[]};
 }
 const uid=(t,p,z,n)=>t.state.zones[p][z].find(x=>id(x)===n)?.uid;
 const has=(t,p,z,n)=>t.state.zones[p][z].some(x=>id(x)===n);
 function act(t,type,choose=a=>!a.response&&!a.responseUid){const a=E.enumerate(t.state).find(a=>a.type===type&&choose(a));assert(a,`Missing ${type}; got ${E.enumerate(t.state).map(x=>x.type+(x.response?':'+x.response.type:'')).join(', ')}`);const before=JSON.stringify(t.state),r=E.execute(t.state,a);assert.equal(r.pass,true,JSON.stringify(r));assert.equal(JSON.stringify(t.state),before,'execute must not mutate the supplied state');t.actions.push(r.action);t.state=r.after;return r;}
 function line(t){const l={scope:E.version,before:copy(t.initial),after:copy(t.state),state:copy(t.state),actions:copy(t.actions),context:copy(t.initial.context),deckFingerprint:E.deckFingerprint(t.deck),certified:false,globalOptimalityProven:false};l.replay=E.replay(l,{deck:t.deck});assert.equal(l.replay.pass,true,JSON.stringify(l.replay));assert.equal(l.replay.steps,t.actions.length);return l;}
 function protect(t,targetUid,sourceUid=uid(t,0,'monster',I.SPARK)){return act(t,'STARDUST_SPARK_PROTECTION',a=>a.sourceUid===sourceUid&&a.targetUid===targetUid&&!a.response);}
 const field=(player,cardId,from='deck',extra={})=>({player,cardId,from,zone:'monster',...extra});
 const gy=(player,cardId,extra={})=>({player,cardId,from:'deck',zone:'gy',...extra});
 function spiritScenario(o={}){return make({main:[I.INVOCATION,I.ALEISTER],opponentExtra:[I.SPIRIT],responseTypes:['SPIRIT'],placements:[field(1,I.SPIRIT,'extra')],...o});}
 const tests=[];async function test(name,fn){try{await fn();tests.push({name,pass:true});}catch(error){tests.push({name,pass:false,error:error.stack});}}


 await test('Mechaba responds physically to Spark in both Main Phases, Battle, Standby and End on either turn',()=>{
  for(const phase of ['MAIN 1','MAIN 2','BATTLE','STANDBY','END'])for(const activePlayer of [0,1]){
   const t=make({phase,activePlayer,main:[I.FISH],extra:[I.SPARK],opponentExtra:[I.MECHABA],responseTypes:['MECHABA'],placements:[field(0,I.SPARK,'extra'),field(0,I.FISH),field(1,I.MECHABA,'extra')]}),target=uid(t,0,'monster',I.FISH),spark=uid(t,0,'monster',I.SPARK),r=act(t,'STARDUST_SPARK_PROTECTION',a=>a.targetUid===target&&a.response?.type==='MECHABA');
   assert.equal(r.action.proof.activationNegated,true,phase);assert.equal(H.locate(t.state,spark).zone,'banished',phase);assert.equal(H.locate(t.state,target).item.sparkProtection,undefined);assert(r.action.paid.some(p=>p.kind==='SEND_GY'&&p.player===1&&H.locate(t.state,p.uid).zone==='gy'));line(t);
  }
 });
 await test('Veiler stays in the opposing Main Phase while Spark remains available in other registered windows',()=>{
  for(const phase of ['MAIN 1','MAIN 2','BATTLE','STANDBY','END'])for(const activePlayer of [0,1]){
   const t=make({phase,activePlayer,main:[I.FISH],extra:[I.SPARK],opponentMain:[I.VEILER],opponentHand:[I.VEILER],responseTypes:['VEILER'],placements:[field(0,I.SPARK,'extra'),field(0,I.FISH)]}),target=uid(t,0,'monster',I.FISH),actions=E.enumerate(t.state).filter(a=>a.type==='STARDUST_SPARK_PROTECTION'&&a.targetUid===target);
   assert(actions.length,phase);assert.equal(actions.some(a=>a.response?.type==='VEILER'),activePlayer===0&&['MAIN 1','MAIN 2'].includes(phase),phase+' player'+activePlayer);
   if(activePlayer===0&&['MAIN 1','MAIN 2'].includes(phase)){act(t,'STARDUST_SPARK_PROTECTION',a=>a.targetUid===target&&a.response?.type==='VEILER');assert(has(t,1,'gy',I.VEILER));line(t);}
  }
 });
 await test('Hand Impermanence answers registered monster effects in Battle, Standby and End with its empty-field condition',()=>{
  for(const phase of ['BATTLE','STANDBY','END']){
   const t=make({phase,main:[I.FISH],extra:[I.SPARK],opponentMain:[I.IMPERM],opponentHand:[I.IMPERM],responseTypes:['IMPERM'],placements:[field(0,I.SPARK,'extra'),field(0,I.FISH)]}),target=uid(t,0,'monster',I.FISH),source=uid(t,0,'monster',I.SPARK);act(t,'STARDUST_SPARK_PROTECTION',a=>a.targetUid===target&&a.response?.type==='IMPERM');assert(has(t,1,'gy',I.IMPERM));assert.equal(H.locate(t.state,source).item.effectsNegated,true);assert.equal(H.locate(t.state,target).item.sparkProtection,undefined);line(t);
  }
 });
 await test('Mechaba can negate Spirit tribute outside Main while retaining the tribute cost and not banishing its old field source',()=>{
  for(const phase of ['BATTLE','STANDBY','END']){
   const t=make({phase,extra:[I.SPIRIT,I.SPARK],opponentExtra:[I.MECHABA],responseTypes:['MECHABA'],placements:[field(0,I.SPIRIT,'extra',{declaredSummonType:'SYNCHRO',properlySummoned:true}),field(1,I.MECHABA,'extra')]}),spirit=uid(t,0,'monster',I.SPIRIT),r=act(t,'SPIRIT_DRAGON_TRIBUTE_SYNCHRO',a=>a.response?.type==='MECHABA');assert.equal(H.locate(t.state,spirit).zone,'gy');assert(!has(t,0,'monster',I.SPARK));assert(r.action.paid.some(x=>x.kind==='TRIBUTE'&&x.uid===spirit));assert(r.action.events.some(x=>x.type==='MECHABA_BANISH_NOT_APPLIED'));line(t);
  }
 });
 await test('Mechaba answers Azure revival in Standby with an actual monster hand cost and a fresh replay',()=>{
  const t=make({phase:'STANDBY',main:[I.FISH],extra:[I.AZURE],opponentExtra:[I.MECHABA],responseTypes:['MECHABA'],placements:[field(0,I.AZURE,'extra'),gy(0,I.FISH),field(1,I.MECHABA,'extra')]}),azure=uid(t,0,'monster',I.AZURE),fish=uid(t,0,'gy',I.FISH),r=act(t,'AZURE_EYES_STANDBY_REVIVE',a=>a.response?.type==='MECHABA');assert.equal(H.locate(t.state,azure).zone,'banished');assert.equal(H.locate(t.state,fish).zone,'gy');assert.equal(t.state.used['AZURE_REVIVE:'+azure],undefined);assert(r.action.paid.some(x=>x.kind==='SEND_GY'&&x.player===1));line(t);
 });
 await test('Own Invoked family route works in Main Phase 2 and replays from its declared physical setup',()=>{
  const f=h.fixture('Invoked'),t=make({phase:'MAIN 2',deck:f.deck,openingIds:f.openingIds,remainingDeckIds:f.remainingDeckIds});act(t,'NORMAL_SUMMON',a=>id(H.locate(t.state,a.sourceUid).item)===I.ALEISTER);act(t,'ALEISTER_SEARCH');act(t,'LINK_ARTEMIS');act(t,'INVOCATION_MECHABA');act(t,'INVOCATION_RECYCLE');assert(has(t,0,'monster',I.MECHABA));line(t);
 });
 await test('Hard-coded family inventories are not falsely mirrored to the rival during Main Phase 2',()=>{
  const f=h.fixture('Invoked'),t=make({phase:'MAIN 2',activePlayer:1,deck:f.deck,openingIds:f.openingIds,remainingDeckIds:f.remainingDeckIds});assert(!E.enumerate(t.state).some(a=>['NORMAL_SUMMON','ALEISTER_SEARCH','LINK_ARTEMIS','INVOCATION_MECHABA'].includes(a.type)));
 });
 await test('Quick-effect windows do not precede the compulsory turn draw; after the real draw Mechaba is available',()=>{
  const t=make({phase:'DRAW',main:[I.FISH],extra:[I.SPARK],opponentExtra:[I.MECHABA],responseTypes:['MECHABA'],placements:[field(0,I.SPARK,'extra'),field(0,I.FISH),field(1,I.MECHABA,'extra')]});assert(!E.enumerate(t.state).some(a=>a.type==='STARDUST_SPARK_PROTECTION'));act(t,'DUEL_DRAW_FOR_TURN');const target=uid(t,0,'monster',I.FISH);act(t,'STARDUST_SPARK_PROTECTION',a=>a.targetUid===target&&a.response?.type==='MECHABA');line(t);
 });
 await test('Optional triggers can be explicitly declined in Battle without allowing ordinary family ignition actions',()=>{
  const t=make({phase:'BATTLE',extra:[I.SPARK],placements:[field(0,I.SPARK,'extra')]});H.queueTrigger(t.state,'DIAGNOSTIC_OPTIONAL',uid(t,0,'monster',I.SPARK),{player:0});t.initial=copy(t.state);const a=E.enumerate(t.state).find(a=>a.type==='DECLINE_OPTIONAL_TRIGGER'&&a.triggerKind==='DIAGNOSTIC_OPTIONAL');assert(a);const r=E.execute(t.state,a);assert(r.pass,JSON.stringify(r));assert.equal(r.after.pendingTriggers.length,0);assert(!E.enumerate(t.state).some(x=>x.type==='NORMAL_SUMMON'));
 });
 await test('Forged response timing cannot be replayed by transplanting a Main Phase Veiler action into Battle',()=>{
  const base={main:[I.FISH],extra:[I.SPARK],opponentMain:[I.VEILER],opponentHand:[I.VEILER],responseTypes:['VEILER'],placements:[field(0,I.SPARK,'extra'),field(0,I.FISH)]},main=make(base),battle=make({...base,phase:'BATTLE'}),a=E.enumerate(main.state).find(x=>x.type==='STARDUST_SPARK_PROTECTION'&&x.response?.type==='VEILER');assert(a);const before=JSON.stringify(battle.state),r=E.execute(battle.state,a);assert.equal(r.pass,false);assert.equal(JSON.stringify(battle.state),before);
 });
 const report={schema:'ygo-response-window-tests/v1',pass:tests.every(x=>x.pass),total:tests.length,tests,limitations:['These are registered between-action windows, not a general Damage Step or arbitrary priority model.','Player-zero family handlers remain explicit; no rival inventory is silently mirrored.','Declared setup histories remain assumptions.']};fs.writeFileSync(path.join(ROOT,'tests/response-windows-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.pass)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});

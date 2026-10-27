/* Self-contained physical teaching scenarios. Declared fields are assumptions,
 * not reconstructed summons, competitive lists, or automatic played actions. */
(()=>{'use strict';
const W=typeof window==='object'?window:globalThis,clone=x=>structuredClone(x);
const NORMALS=[23771716,47372349,97127906,70924884,64428736,99785935,17968114,42431843,43230671,89904598,85639257,75889523,48202661];
const SCOPE='Ejemplo técnico TCG con relleno Normal y campo inicial declarado; no es una recomendación competitiva ni certifica la historia previa.';
function deck(special,extra){const main=special.map(([id,qty])=>({id,qty}));let left=40-main.reduce((sum,c)=>sum+c.qty,0);for(const id of NORMALS){if(!left)break;const qty=Math.min(3,left);main.push({id,qty});left-=qty;}if(left)throw Error('EXAMPLE_FILLER_INCOMPLETE');return{main,extra:extra.map(([id,qty])=>({id,qty})),side:[]};}
function order(d,opening){const ids=d.main.flatMap(c=>Array(c.qty).fill(c.id));for(const id of opening){const i=ids.indexOf(id);if(i<0)throw Error('EXAMPLE_OPENING_NOT_PHYSICAL');ids.splice(i,1);}return ids;}
function blue(){const d=deck([[89631139,3]],[[83994433,1],[59822133,1],[40908371,1]]),openingIds=NORMALS.slice(0,5);return{deck:d,openingIds,remainingDeckIds:order(d,openingIds)};}
function base(id,name,description,own,rival,setup,goal,steps,policy='PASS'){
 return{schema:'ygo-archetype-fixture/v1',id,name,description,scope:SCOPE,sourceCommit:'ae5dedb957c2c48ab86554fee08a0fca73d8b1cf',...own,opponentDeck:rival.deck,opponentOpeningIds:rival.openingIds,opponentRemainingDeckIds:rival.remainingDeckIds,setup,context:{format:'tcg',banlistVersion:'19/10/2026',duelMode:true,opponentPolicy:policy,responseTypes:policy==='RESPONSES_EXPLICIT'?['SPIRIT']:[],responsePolicy:'FIRST_ELIGIBLE'},goal,tutorial:{steps,replacesDeck:true,initialHistoryCertified:false,competitiveRecommendation:false}};
}
const spark=base('spark','Spark: una protección y dos ataques','Comprueba que Spark evita una destrucción y que ambos combates siguen causando daño.',blue(),blue(),{turn:2,activePlayer:0,phase:'BATTLE',placements:[{player:0,from:'deck',cardId:89631139,zone:'monster',position:'ATTACK',faceUp:true,summonTurn:1},{player:0,from:'deck',cardId:89631139,zone:'monster',position:'ATTACK',faceUp:true,summonTurn:1},{player:1,from:'extra',cardId:83994433,zone:'monster',position:'ATTACK',faceUp:true,summonTurn:1}]},{requiredFieldIds:[],opponentLpAtMost:7000},['Selecciona STARDUST SPARK PROTECTION del jugador 2 sobre su propio Spark y ejecuta el paso.','Ataca a Spark con el primer Blue-Eyes: recibe 500 de daño y conserva el monstruo.','Ataca con el otro Blue-Eyes: recibe otros 500 y Spark va al Cementerio.']);
const tenyiDeck=deck([[87052196,1],[98159737,1],[23431858,1],[24557335,1],[65124425,1]],[[32519092,2],[78917791,1],[5402805,1]]),tenyiOpening=[87052196,...NORMALS.slice(0,4)];
const spirit=base('spirit','Spirit Dragon: negar una activación en el Cementerio','Ashuna paga su destierro, pero Spirit Dragon niega la activación y no se invoca otro Tenyi.',{deck:tenyiDeck,openingIds:tenyiOpening,remainingDeckIds:order(tenyiDeck,tenyiOpening)},blue(),{turn:2,activePlayer:0,phase:'MAIN 1',placements:[{player:0,from:'hand',cardId:87052196,zone:'gy'},{player:0,from:'extra',cardId:32519092,zone:'monster',position:'ATTACK',faceUp:true,summonTurn:1},{player:1,from:'extra',cardId:59822133,zone:'monster',position:'DEFENSE',faceUp:true,summonTurn:1}]},{requiredFieldIds:[32519092,98159737]},['Selecciona TENYI ASHUNA DECK con respuesta SPIRIT y ejecuta el paso.','Comprueba que Ashuna permanece desterrada como coste y que no aparece otro monstruo Tenyi.','El replay conserva el origen de activación en el Cementerio. El campo previo sigue siendo un supuesto declarado.'],'RESPONSES_EXPLICIT');
const invokedDeck=deck([[86120751,3],[74063034,3]],[[34755994,1],[75286621,1]]),invokedOpening=[86120751,...NORMALS.slice(0,4)];
const invoked=base('invoked','Invoked: construir Mechaba desde la mano','Recorre una línea registrada desde Aleister en la mano hasta Mechaba y la recuperación de Aleister.',{deck:invokedDeck,openingIds:invokedOpening,remainingDeckIds:order(invokedDeck,invokedOpening)},blue(),{turn:1,activePlayer:0,phase:'MAIN 1',placements:[]},{requiredFieldIds:[75286621],requiredHandIds:[86120751]},['Invoca normalmente a Aleister y resuelve ALEISTER SEARCH para buscar Invocation.','Invoca Artemis con LINK ARTEMIS.','Usa INVOCATION MECHABA con Aleister y Artemis como materiales.','Ejecuta INVOCATION RECYCLE para recuperar a Aleister. Cada acción se elige y ejecuta en el laboratorio.']);
const templates=new Map([spark,spirit,invoked].map(value=>[value.id,value]));
const describe=value=>({id:value.id,name:value.name,description:value.description,scope:value.scope,steps:clone(value.tutorial.steps),replacesDeck:true,initialHistoryCertified:false,competitiveRecommendation:false});
function list(){return[...templates.values()].map(describe);}
function get(id){if(typeof id!=='string'||!templates.has(id))throw Error('SCENARIO_EXAMPLE_UNKNOWN');return clone(templates.get(id));}
let loading=false;
function preflight(spec){
 const E=W.YGOComboEngine,U=W.YGOUIState,F=W.YGOFormats;if(!E?.createState)throw Error('SCENARIO_EXAMPLE_ENGINE_REQUIRED');
 const context=U?.getFormatContext?.();
 if(context?.snapshot&&(!F?.snapshotIdentity||F.snapshotIdentity(context.snapshot,'tcg')!==F.snapshotIdentity(W.BANLIST_PROFILES?.tcg,'tcg')))throw Error('Los ejemplos requieren la lista TCG incorporada. Exporta tu contexto y restablécelo antes de cargar el ejemplo.');
 const skills=W.deckState?.skills;if(skills!==undefined&&(!Array.isArray(skills)||skills.length))throw Error('Los ejemplos TCG no usan Skills. Guarda tu baraja y carga un contexto TCG sin Skills antes de continuar.');
 return E.createState(spec);
}
async function load(id){const spec=get(id);if(loading)throw Error('SCENARIO_EXAMPLE_BUSY');loading=true;try{
 const C=W.YGOComboWorkbench,A=W.YGOAdvancedWorkbench;if(!C?.loadScenario||!A?.initialize||!A?.report)throw Error('SCENARIO_EXAMPLE_WORKBENCH_REQUIRED');
 const ready=await Promise.all([C.ready,A.ready,W.YGODataCatalog?.ready,W.YGOUIState?.ready]);if(ready.some(value=>value===false))throw Error('SCENARIO_EXAMPLE_WORKBENCH_NOT_READY');
 if(C.isBusy||A.isBusy)throw Error('SCENARIO_EXAMPLE_BUSY');preflight(spec);
 const imported=await C.loadScenario(spec);if(imported?.pass!==true)throw Error('SCENARIO_EXAMPLE_IMPORT_REJECTED');
 await A.initialize({goal:spec.goal});
 return{pass:true,status:'SCENARIO_EXAMPLE_LOADED',id,name:spec.name,message:'Ejemplo cargado. El campo inicial es un supuesto declarado; selecciona y ejecuta cada acción en el laboratorio.',steps:clone(spec.tutorial.steps),report:clone(A.report())};
 }finally{loading=false;}}
W.YGOScenarioExamples=Object.freeze({version:'self-contained-physical-examples-v1',list,get,load,get isBusy(){return loading;}});
})();

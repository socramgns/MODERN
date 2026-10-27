/* Self-contained physical teaching scenarios. Declared fields are assumptions,
 * not reconstructed summons, competitive lists, or automatic played actions. */
(()=>{'use strict';
const W=typeof window==='object'?window:globalThis,clone=x=>structuredClone(x);
const NORMALS=[23771716,47372349,97127906,70924884,64428736,99785935,17968114,42431843,43230671,89904598,85639257,75889523,48202661];
const HIGH_NORMALS=[48202661,89386122,67371383,14015067,49587396,47484352,48365709,18246479,11761845,42129512,89631139,81386177];
const SCOPE='Ejemplo técnico TCG con relleno Normal y campo inicial declarado; no es una recomendación competitiva ni certifica la historia previa.';
function deck(special,extra,fillers=NORMALS){const main=special.map(([id,qty])=>({id,qty}));let left=40-main.reduce((sum,c)=>sum+c.qty,0);for(const id of fillers){if(!left)break;if(main.some(row=>row.id===id))continue;const qty=Math.min(3,left);main.push({id,qty});left-=qty;}if(left)throw Error('EXAMPLE_FILLER_INCOMPLETE');return{main,extra:extra.map(([id,qty])=>({id,qty})),side:[]};}
function order(d,opening){const ids=d.main.flatMap(c=>Array(c.qty).fill(c.id));for(const id of opening){const i=ids.indexOf(id);if(i<0)throw Error('EXAMPLE_OPENING_NOT_PHYSICAL');ids.splice(i,1);}return ids;}
function blue(){const d=deck([[89631139,3]],[[83994433,1],[59822133,1],[40908371,1]]),openingIds=NORMALS.slice(0,5);return{deck:d,openingIds,remainingDeckIds:order(d,openingIds)};}
function base(id,name,description,own,rival,setup,goal,steps,policy='PASS',responseTypes=[],responsePolicy='FIRST_ELIGIBLE'){
 return{schema:'ygo-archetype-fixture/v1',id,name,description,scope:SCOPE,sourceCommit:'ae5dedb957c2c48ab86554fee08a0fca73d8b1cf',...own,opponentDeck:rival.deck,opponentOpeningIds:rival.openingIds,opponentRemainingDeckIds:rival.remainingDeckIds,setup,context:{format:'tcg',banlistVersion:'19/10/2026',duelMode:true,opponentPolicy:policy,responseTypes:[...responseTypes],responsePolicy},goal,tutorial:{steps,replacesDeck:true,initialHistoryCertified:false,competitiveRecommendation:false}};
}
const spark=base('spark','Spark: una protección y dos ataques','Comprueba que Spark evita una destrucción y que ambos combates siguen causando daño.',blue(),blue(),{turn:2,activePlayer:0,phase:'BATTLE',placements:[{player:0,from:'deck',cardId:89631139,zone:'monster',position:'ATTACK',faceUp:true,summonTurn:1},{player:0,from:'deck',cardId:89631139,zone:'monster',position:'ATTACK',faceUp:true,summonTurn:1},{player:1,from:'extra',cardId:83994433,zone:'monster',position:'ATTACK',faceUp:true,summonTurn:1}]},{requiredFieldIds:[],opponentLpAtMost:7000},['Selecciona STARDUST SPARK PROTECTION del jugador 2 sobre su propio Spark y ejecuta el paso.','Ataca a Spark con el primer Blue-Eyes: recibe 500 de daño y conserva el monstruo.','Ataca con el otro Blue-Eyes: recibe otros 500 y Spark va al Cementerio.']);
const tenyiDeck=deck([[87052196,1],[98159737,1],[23431858,1],[24557335,1],[65124425,1]],[[32519092,2],[78917791,1],[5402805,1]]),tenyiOpening=[87052196,...NORMALS.slice(0,4)];
const spirit=base('spirit','Spirit Dragon: negar una activación en el Cementerio','Ashuna paga su destierro, pero Spirit Dragon niega la activación y no se invoca otro Tenyi.',{deck:tenyiDeck,openingIds:tenyiOpening,remainingDeckIds:order(tenyiDeck,tenyiOpening)},blue(),{turn:2,activePlayer:0,phase:'MAIN 1',placements:[{player:0,from:'hand',cardId:87052196,zone:'gy'},{player:0,from:'extra',cardId:32519092,zone:'monster',position:'ATTACK',faceUp:true,summonTurn:1},{player:1,from:'extra',cardId:59822133,zone:'monster',position:'DEFENSE',faceUp:true,summonTurn:1}]},{requiredFieldIds:[32519092,98159737]},['Selecciona TENYI ASHUNA DECK con respuesta SPIRIT y ejecuta el paso.','Comprueba que Ashuna permanece desterrada como coste y que no aparece otro monstruo Tenyi.','El replay conserva el origen de activación en el Cementerio. El campo previo sigue siendo un supuesto declarado.'],'RESPONSES_EXPLICIT',['SPIRIT']);
const invokedDeck=deck([[86120751,3],[74063034,3]],[[34755994,1],[75286621,1]]),invokedOpening=[86120751,...NORMALS.slice(0,4)];
const invoked=base('invoked','Invoked: construir Mechaba desde la mano','Recorre una línea registrada desde Aleister en la mano hasta Mechaba y la recuperación de Aleister.',{deck:invokedDeck,openingIds:invokedOpening,remainingDeckIds:order(invokedDeck,invokedOpening)},blue(),{turn:1,activePlayer:0,phase:'MAIN 1',placements:[]},{requiredFieldIds:[75286621],requiredHandIds:[86120751]},['Invoca normalmente a Aleister y resuelve ALEISTER SEARCH para buscar Invocation.','Invoca Artemis con LINK ARTEMIS.','Usa INVOCATION MECHABA con Aleister y Artemis como materiales.','Ejecuta INVOCATION RECYCLE para recuperar a Aleister. Cada acción se elige y ejecuta en el laboratorio.']);
const emptyField=()=>({turn:1,activePlayer:0,phase:'MAIN 1',placements:[]});
const physical=(d,openingIds)=>({deck:d,openingIds,remainingDeckIds:order(d,openingIds)});
const swordsoulDeck=deck([[20001443,3],[93490856,3],[56465981,2]],[[69248256,1],[96633955,1]]),swordsoulOpening=[20001443,93490856,...NORMALS.slice(1,4)];
const swordsoul=base('swordsoul','Swordsoul: Chixiao, Chengying y daño','Construye dos Synchro desde una mano física; el robo de Mo Ye se resuelve antes de buscar y barajar.',physical(swordsoulDeck,swordsoulOpening),blue(),emptyField(),{requiredFieldIds:[69248256,96633955],opponentLpAtMost:6800},[
 'Invoca normalmente a Mo Ye desde la mano.',
 'Resuelve el efecto de Mo Ye revelando Longyuan para crear su Token; la carta revelada permanece en la mano.',
 'Invoca Chixiao con Mo Ye y su Token como materiales.',
 'Elige la cadena conjunta Chixiao CL1 / Mo Ye CL2: busca Swordsoul Emergence. Mo Ye roba primero la siguiente copia física de Mo Ye del orden declarado; después la búsqueda baraja.',
 'Invoca Longyuan descartando la Emergence recién buscada y elige crear su Token.',
 'Invoca Chengying con Longyuan y su Token como materiales.',
 'Resuelve el efecto de Longyuan en el Cementerio: el rival recibe 1200 de daño. Revisa los siete pasos y su replay.'
]);
const brandedDeck=deck([[44362883,1],[68468459,3],[46986414,2]],[[70534340,1],[44146295,1]]),brandedOpening=[44362883,...NORMALS.slice(0,4)];
const branded=base('branded','Branded: dos Fusiones y un descarte','Usa materiales reales del Deck y un descarte de la mano para llegar a Mirrorjade.',physical(brandedDeck,brandedOpening),blue(),emptyField(),{requiredFieldIds:[44146295]},[
 'Activa Branded Fusion usando Fallen of Albaz y Dark Magician del Deck para invocar Lubellion. La restricción de Fusión del Extra se aplica durante este turno.',
 'Resuelve Lubellion: descarta 7 Colored Fish de la mano y devuelve Lubellion y Albaz como materiales para invocar Mirrorjade. Comprueba el descarte, los destinos y el replay de los dos pasos.'
]);
const tenyiRouteDeck=deck([[87052196,1],[98159737,1],[23431858,1],[24557335,1],[65124425,1]],[[32519092,2],[78917791,1],[5402805,1]],HIGH_NORMALS),tenyiRouteOpening=[87052196,...HIGH_NORMALS.slice(0,4)];
const tenyi=base('tenyi','Tenyi: Shaman y Monk recuperado','Paga el destierro de Ashuna y un descarte para reconstruir un Monk invocado correctamente por esta ruta.',physical(tenyiRouteDeck,tenyiRouteOpening),blue(),emptyField(),{requiredFieldIds:[78917791,32519092]},[
 'Invoca especialmente Ashuna desde la mano, sin consumir la Invocación Normal.',
 'Invoca Monk of the Tenyi usando Ashuna como material Link.',
 'Destierra Ashuna del Cementerio para invocar Adhara del Deck en una zona principal. La restricción Wyrm se aplica al resolver.',
 'Invoca Shaman of the Tenyi con Monk y Adhara como materiales.',
 'Resuelve Shaman: descarta Aitsu de la mano y revive en una zona principal el Monk que invocaste en esta ruta. Revisa el coste y la restricción de efectos del Extra.'
]);
const salamangreatDeck=deck([[26889158,1],[52277807,1],[1295111,1],[51339637,1]],[[14812471,1],[87871125,2]],HIGH_NORMALS),salamangreatOpening=[26889158,52277807,...HIGH_NORMALS.slice(0,3)];
const salamangreat=base('salamangreat','Salamangreat: Wolf y Roar en la mano','Reincarna Sunlight Wolf y recupera Roar conservando el destierro de Spinny y las decisiones opcionales.',physical(salamangreatDeck,salamangreatOpening),blue(),emptyField(),{requiredFieldIds:[87871125],requiredHandIds:[51339637]},[
 'Invoca normalmente a Gazelle.',
 'Resuelve Gazelle enviando Roar del Deck al Cementerio; este envío no es un descarte ni un coste.',
 'Descarta Spinny desde la mano para dar 500 ATK a Gazelle.',
 'Invoca Balelynx usando Gazelle como material Link.',
 'Resuelve Balelynx para buscar Sanctuary.',
 'Invoca Spinny desde el Cementerio a una zona principal libre.',
 'Invoca Sunlight Wolf con Balelynx y Spinny; comprueba que Spinny queda desterrado al abandonar el campo.',
 'Activa Sanctuary desde la mano.',
 'Reincarna Sunlight Wolf usando el primer Wolf como único material para invocar la segunda copia.',
 'Declina la opción de colocar Roar desde el Cementerio: este ejemplo la recuperará a la mano.',
 'Resuelve Sunlight Wolf para recuperar Roar a la mano. Comprueba la reincarnación, el destierro de Spinny y el replay de los once pasos.'
]);
const roarOwnDeck=deck([[74063034,1],[86120751,1],[89631139,1],[51339637,1]],[[75286621,1],[87871125,1]]),roarOwnOpening=[74063034,86120751,89631139,...NORMALS.slice(0,2)],roarRivalDeck=deck([[51339637,1]],[[87871125,1]]),roarRivalOpening=NORMALS.slice(0,5);
const roar=base('roar','Roar: una negación y su contrarrespuesta','Compara una Fusión negada con una cadena física que permite resolverla; los Wolf y las Trampas previas son supuestos declarados.',physical(roarOwnDeck,roarOwnOpening),physical(roarRivalDeck,roarRivalOpening),{turn:2,activePlayer:0,phase:'MAIN 1',placements:[
 {player:0,from:'extra',cardId:87871125,zone:'monster',zoneIndex:5,position:'ATTACK',faceUp:true,summonTurn:1},
 {player:1,from:'extra',cardId:87871125,zone:'monster',zoneIndex:5,position:'ATTACK',faceUp:true,summonTurn:1},
 {player:0,from:'deck',cardId:51339637,zone:'spelltrap',zoneIndex:0,faceUp:false,setTurn:1},
 {player:1,from:'deck',cardId:51339637,zone:'spelltrap',zoneIndex:1,faceUp:false,setTurn:1}
 ]},{requiredFieldIds:[75286621]},[
 'Elige Invocation: Fusión de Mechaba con Aleister y Blue-Eyes de tu mano. Selecciona la variante con Roar rival y una contrarrespuesta de tu propia Roar; ambas Trampas estaban colocadas desde el turno anterior.',
 'Ejecuta ese paso: la cadena es Invocation CL1, Roar rival CL2 y Roar propia CL3. Se resuelve en orden inverso; la Roar rival queda negada y la Fusión puede resolver.',
 'Comprueba Mechaba en tu campo, los dos materiales en tu Cementerio y las dos Roar en sus respectivos Cementerios. Roar no exige descartar: los materiales de Fusión se usan al resolver Invocation.',
 'Para comparar, deshaz el paso y elige Invocation con Roar rival y sin contrarrespuesta: no se invoca Mechaba y los materiales permanecen en tu mano. El replay conserva ambos resultados por separado.'
 ],'RESPONSES_EXPLICIT',['ROAR'],'CHOICE_BRANCHES');
const templates=new Map([spark,spirit,invoked,swordsoul,branded,tenyi,salamangreat,roar].map(value=>[value.id,value]));
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
W.YGOScenarioExamples=Object.freeze({version:'self-contained-physical-examples-v2',list,get,load,get isBusy(){return loading;}});
})();

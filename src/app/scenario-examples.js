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
const crowOwnDeck=deck([[86120751,1],[74063034,1],[89631139,1]],[[75286621,2]]),crowOwnOpening=[74063034,89631139,...NORMALS.slice(0,3)],crowRivalDeck=deck([[24508238,1]],[]),crowRivalOpening=[24508238,...NORMALS.slice(0,4)];
const crow=base('crow','Crow: proteger Aleister y construir otro Mechaba','Niega a Crow rival para conservar el Aleister del Cementerio y usarlo en una segunda Fusión.',physical(crowOwnDeck,crowOwnOpening),physical(crowRivalDeck,crowRivalOpening),{turn:2,activePlayer:0,phase:'MAIN 1',placements:[
 {player:0,from:'deck',cardId:86120751,zone:'gy'},
 {player:0,from:'extra',cardId:75286621,zone:'monster',zoneIndex:0,position:'ATTACK',faceUp:true,summonTurn:1}
 ]},{requiredFieldIds:[75286621,75286621]},[
 'Selecciona D.D. Crow del jugador 2 sobre Aleister de tu Cementerio. Elige la respuesta de tu Mechaba pagando 7 Colored Fish de tu mano. El Mechaba y Aleister previos son un campo inicial declarado.',
 'Ejecuta el paso: Crow se descarta al Cementerio como coste y Mechaba niega su activación. Aleister permanece en tu Cementerio; Crow no se destierra desde su nueva zona. Comprueba ambos costes y el replay.',
 'Activa Invocation con Aleister de tu Cementerio y Blue-Eyes de tu mano como materiales para invocar tu segunda copia de Mechaba. El objetivo exige dos copias distintas en tu campo.',
 'Para comparar, deshaz la Fusión y el paso de Crow. Elige ahora Crow sin respuesta: paga su descarte y destierra a Aleister. Sin ese material ya no aparece esta Fusión de Invocation.'
 ],'RESPONSES_EXPLICIT',['MECHABA'],'CHOICE_BRANCHES');
const drollOwnDeck=deck([[86120751,1],[74063034,2]],[[75286621,1]]),drollOwnOpening=[86120751,...NORMALS.slice(0,4)],drollRivalDeck=deck([[94145021,1]],[]),drollRivalOpening=[94145021,...NORMALS.slice(0,4)];
const droll=base('droll','Droll: una búsqueda y su negación desde la mano','Busca Invocation con Aleister y compara Droll negado por tu Mechaba con su bloqueo resuelto.',physical(drollOwnDeck,drollOwnOpening),physical(drollRivalDeck,drollRivalOpening),{turn:2,activePlayer:0,phase:'MAIN 1',placements:[
 {player:0,from:'extra',cardId:75286621,zone:'monster',zoneIndex:0,position:'ATTACK',faceUp:true,summonTurn:1}
 ]},{requiredFieldIds:[75286621],requiredHandIds:[74063034]},[
 'Invoca normalmente a Aleister desde tu mano. El Mechaba que ya está en el campo es un supuesto inicial declarado.',
 'Resuelve Aleister para buscar Invocation. Esa búsqueda abre la ventana registrada de Droll rival; el robo ordinario no abre esta ventana.',
 'Elige Droll del jugador 2 con respuesta de tu Mechaba. Droll se envía de la mano al Cementerio y tu Mechaba paga un monstruo real de tu mano; al negarse la activación no se aplica el bloqueo de añadir cartas del Deck.',
 'Comprueba que Droll permanece en el Cementerio, conserva ambos costes y revisa el replay. Al terminar esta cadena se cierra la ventana de la búsqueda anterior; otra activación necesitaría un evento nuevo admitido. El ejemplo respeta el límite de una copia de Droll de la lista incorporada.',
 'Deshaz el último paso y elige Droll sin respuesta: el mismo coste permanece pagado y ahora el bloqueo se aplica a los dos jugadores durante el resto del turno.'
 ],'RESPONSES_EXPLICIT',['MECHABA'],'CHOICE_BRANCHES');
const fieldOwnDeck=deck([[24382602,1],[1295111,1],[51339637,1]],[[87871125,2]]),fieldOwnOpening=[1295111,...NORMALS.slice(0,4)],fieldRivalDeck=deck([[74063034,1]],[[75286621,1]]),fieldRivalOpening=[74063034,...NORMALS.slice(0,4)];
const field=base('field','Mágica de Campo: reemplazar, responder y reincarnar','Sustituye Mausoleum por Sanctuary y usa Roar para permitir que resuelva frente a Mechaba.',physical(fieldOwnDeck,fieldOwnOpening),physical(fieldRivalDeck,fieldRivalOpening),{turn:2,activePlayer:0,phase:'MAIN 1',placements:[
 {player:0,from:'deck',cardId:24382602,zone:'spelltrap',faceUp:true},
 {player:0,from:'deck',cardId:51339637,zone:'spelltrap',zoneIndex:0,faceUp:false,setTurn:1},
 {player:0,from:'extra',cardId:87871125,zone:'monster',zoneIndex:5,position:'ATTACK',faceUp:true,summonTurn:1},
 {player:1,from:'extra',cardId:75286621,zone:'monster',zoneIndex:0,position:'ATTACK',faceUp:true,summonTurn:1}
 ]},{requiredFieldIds:[87871125],requiredHandIds:[51339637],requiredFaceUpSpellTrapIds:[1295111]},[
 'Activa Sanctuary desde tu mano. Selecciona la variante con Mechaba rival y una contrarrespuesta de tu Roar colocada desde el turno anterior. Los monstruos y el campo previos son supuestos iniciales declarados.',
 'Ejecuta el paso: Mausoleum se envía al Cementerio por regla antes de la respuesta, sin destruirse. Mechaba paga Invocation de su mano, pero tu Roar niega a Mechaba y permite que Sanctuary permanezca en la Zona del Campo. Comprueba ambos Cementerios y el replay.',
 'Reincarna Sunlight Wolf usando tu primer Wolf como único material. Esta ruta necesita Sanctuary resuelto; la historia de esta nueva invocación sí queda registrada.',
 'Resuelve el Wolf reincarnado para recuperar Roar del Cementerio a tu mano. El objetivo exige Wolf en el campo, Sanctuary boca arriba en la Zona del Campo y esa Roar física en la mano.',
 'Para comparar, deshaz los tres pasos y activa Sanctuary con Mechaba rival pero sin tu Roar. Sanctuary queda desterrado y Mausoleum permanece en el Cementerio: el campo anterior no regresa y no aparece esta reincarnación.'
 ],'RESPONSES_EXPLICIT',['MECHABA','ROAR'],'CHOICE_BRANCHES');
const trapOwnDeck=deck([[10045474,1],[51339637,1],[86120751,1],[74063034,1]],[[87871125,1]]),trapOwnOpening=[86120751,...NORMALS.slice(0,4)],trapRivalDeck=deck([[10045474,1]],[[75286621,1],[59822133,1]]),trapRivalOpening=[10045474,...NORMALS.slice(0,4)];
const trap=base('trap','Infinite Impermanence: activar y responder a una Trampa','Activa Impermanence colocada, responde a Mechaba con Roar y conserva la negación del monstruo y la columna registradas.',physical(trapOwnDeck,trapOwnOpening),physical(trapRivalDeck,trapRivalOpening),{turn:2,activePlayer:0,phase:'MAIN 1',placements:[
 {player:0,from:'deck',cardId:10045474,zone:'spelltrap',zoneIndex:2,faceUp:false,setTurn:1},
 {player:0,from:'deck',cardId:51339637,zone:'spelltrap',zoneIndex:0,faceUp:false,setTurn:1},
 {player:0,from:'extra',cardId:87871125,zone:'monster',zoneIndex:5,position:'ATTACK',faceUp:true,summonTurn:1},
 {player:1,from:'extra',cardId:75286621,zone:'monster',zoneIndex:0,position:'ATTACK',faceUp:true,summonTurn:1},
 {player:1,from:'extra',cardId:59822133,zone:'monster',zoneIndex:1,position:'DEFENSE',faceUp:true,summonTurn:1}
 ]},{requiredHandIds:[74063034]},[
 'Activa tu Infinite Impermanence colocada en la columna 3, seleccionando Blue-Eyes Spirit Dragon rival. Elige la variante con Mechaba rival, su Infinite Impermanence de la mano como coste y una contrarrespuesta de tu Roar. El campo inicial y las colocaciones previas son supuestos declarados.',
 'Ejecuta el paso: Mechaba paga una Trampa física, pero Roar niega a Mechaba y lo destruye. Impermanence niega los efectos del Spirit Dragon que sigue en el campo y aplica su bloqueo de columna hasta el final del turno. Las dos Trampas propias terminan en el Cementerio; el coste rival permanece pagado.',
 'Invoca normalmente a Aleister desde tu mano.',
 'Resuelve Aleister para buscar Invocation. El objetivo exige esa carta en tu mano; comprueba los tres pasos, los costes y el replay. El objetivo no representa una probabilidad de ganar.',
 'Para comparar, deshaz los tres pasos y activa Impermanence con Mechaba rival pero sin tu Roar: tu Trampa queda desterrada, Spirit Dragon conserva sus efectos y no aparece un bloqueo nuevo de columna. Con Wolf en tu campo no puedes activar Impermanence desde la mano.'
 ],'RESPONSES_EXPLICIT',['MECHABA','ROAR'],'CHOICE_BRANCHES');
const evacuationOwnDeck=deck([[94192409,1],[51339637,1],[89631139,1]],[[87871125,1],[83994433,1]]),evacuationOwnOpening=NORMALS.slice(0,5),evacuationRivalDeck=deck([[94192409,1]],[[75286621,1]]),evacuationRivalOpening=[94192409,...NORMALS.slice(0,4)];
const evacuation=base('evacuation','Compulsory Evacuation Device: devolver sin destruir','Devuelve tu Blue-Eyes protegido a la mano y compara la negación de Mechaba o el regreso de un monstruo al Extra.',physical(evacuationOwnDeck,evacuationOwnOpening),physical(evacuationRivalDeck,evacuationRivalOpening),{turn:2,activePlayer:0,phase:'MAIN 1',placements:[
 {player:0,from:'deck',cardId:94192409,zone:'spelltrap',zoneIndex:1,faceUp:false,setTurn:1},
 {player:0,from:'deck',cardId:51339637,zone:'spelltrap',zoneIndex:0,faceUp:false,setTurn:1},
 {player:0,from:'extra',cardId:87871125,zone:'monster',zoneIndex:5,position:'ATTACK',faceUp:true,summonTurn:1},
 {player:0,from:'extra',cardId:83994433,zone:'monster',zoneIndex:0,position:'ATTACK',faceUp:true,summonTurn:1},
 {player:0,from:'deck',cardId:89631139,zone:'monster',zoneIndex:1,position:'ATTACK',faceUp:true,summonTurn:1},
 {player:1,from:'extra',cardId:75286621,zone:'monster',zoneIndex:0,position:'ATTACK',faceUp:true,summonTurn:1}
 ]},{requiredHandIds:[89631139]},[
 'Activa la protección de tu Stardust Spark Dragon sobre tu Blue-Eyes White Dragon y elige la variante sin respuesta. El campo y las colocaciones anteriores son supuestos declarados.',
 'Activa tu Compulsory Evacuation Device colocada en la columna 2 sobre tu propio Blue-Eyes. Elige Mechaba rival pagando su Compulsory de la mano como coste de Trampa y una contrarrespuesta de tu Roar. Roar niega y destruye Mechaba; Blue-Eyes vuelve a tu mano pese a la protección de Spark, porque devolver no es destruir.',
 'Comprueba el mismo Blue-Eyes en tu mano, ambas Trampas propias y el coste rival en sus Cementerios, el objetivo cumplido y el replay de los dos pasos.',
 'Deshaz solo la devolución y conserva la protección de Spark. Activa Compulsory sobre Blue-Eyes con Mechaba rival pero sin Roar: la Trampa propia queda desterrada, el coste rival permanece pagado y Blue-Eyes sigue en el campo con su protección disponible.',
 'Deshaz esa última activación y elige Compulsory sobre Mechaba rival sin respuesta. El mismo Mechaba vuelve al Extra de su dueño, no a la mano; tu Roar y la Trampa rival de la mano no se consumen. El objetivo de Blue-Eyes en mano es independiente de esta comparación.'
 ],'RESPONSES_EXPLICIT',['MECHABA','ROAR'],'CHOICE_BRANCHES');
const shuffleDeck=deck([[86120751,1],[74063034,1],[89631139,1]],[]),shuffleOpening=[86120751,...NORMALS.slice(0,4)],shuffleRival=deck([[89631139,1]],[]),shuffleRivalOpening=NORMALS.slice(0,5);
const shuffle=base('shuffle','Después de barajar: continuaciones hipotéticas','Llega al próximo robo desconocido mediante una búsqueda real y compara sus posibilidades sin cambiar la partida.',physical(shuffleDeck,shuffleOpening),physical(shuffleRival,shuffleRivalOpening),{turn:2,activePlayer:0,phase:'MAIN 1',placements:[]},{requiredHandIds:[89631139]},[
 'Invoca normalmente a Aleister desde tu mano y resuelve su búsqueda para añadir Invocation. La búsqueda baraja tu Deck; desde ese momento su orden deja de ser conocido.',
 'Pasa directamente de Main Phase 1 a End Phase y termina tu turno.',
 'En el turno rival, ejecuta su robo del orden todavía conocido. Pasa a Standby Phase, después a Main Phase 1 y luego a End Phase. En este ejemplo el rival pasa sin jugar cartas.',
 'Termina el turno rival. Tu cuarto turno comienza en Draw Phase, con el orden de tu Deck desconocido y sin un robo ordinario ejecutable.',
 'Abre «Continuaciones hipotéticas después de barajar» y pulsa «Analizar continuaciones». El objetivo exige Blue-Eyes White Dragon en tu mano; no se cumple en el estado real.',
 'Examina las ramas ponderadas y sus continuaciones verificadas. Una rama sin testigo permanece desconocida. El análisis no roba una carta en la partida ni convierte una posibilidad en un resultado observado.',
 'Puedes guardar y verificar el informe hipotético por separado. El replay del laboratorio conserva las nueve acciones reales anteriores y el Deck restante sigue sin orden conocido.'
]);
const rebornDeck=deck([[83764718,1],[51339637,1],[94192409,1],[89631139,1]],[[87871125,1]]),rebornOpening=[83764718,...NORMALS.slice(0,4)],rebornRivalDeck=deck([[74063034,1],[89631139,1]],[[75286621,1]]),rebornRivalOpening=[74063034,...NORMALS.slice(0,4)];
const reborn=base('reborn','Monster Reborn: revivir y conservar al propietario','Compara la negación de una Mágica, una resurrección y la devolución de una carta que pertenece al rival.',physical(rebornDeck,rebornOpening),physical(rebornRivalDeck,rebornRivalOpening),{turn:2,activePlayer:0,phase:'MAIN 1',placements:[
 {player:0,from:'deck',cardId:51339637,zone:'spelltrap',zoneIndex:0,faceUp:false,setTurn:1},
 {player:0,from:'deck',cardId:94192409,zone:'spelltrap',zoneIndex:2,faceUp:false,setTurn:1},
 {player:0,from:'extra',cardId:87871125,zone:'monster',zoneIndex:5,position:'ATTACK',faceUp:true,summonTurn:1},
 {player:0,from:'deck',cardId:89631139,zone:'gy'},
 {player:1,from:'extra',cardId:75286621,zone:'monster',zoneIndex:0,position:'ATTACK',faceUp:true,summonTurn:1},
 {player:1,from:'deck',cardId:89631139,zone:'gy'}
 ]},{requiredFieldIds:[89631139]},[
 'Activa Monster Reborn desde tu mano sobre el Blue-Eyes White Dragon de tu Cementerio. Elige una zona principal libre, posición de Defensa, Mechaba rival pagando Invocation de su mano y una contrarrespuesta de tu Roar. El campo y los Cementerios iniciales son supuestos declarados.',
 'Ejecuta el paso. Roar niega y destruye Mechaba; la Mágica revive la misma copia de Blue-Eyes bajo tu control. Monster Reborn, Roar y la Invocation usada como coste terminan en sus Cementerios. Comprueba el objetivo y el replay.',
 'Deshaz ese paso y compara la variante de Mechaba sin Roar: Monster Reborn queda desterrada, Blue-Eyes permanece en el Cementerio y el coste rival sigue pagado.',
 'Deshaz la comparación. Activa Monster Reborn sin respuesta sobre el Blue-Eyes del Cementerio rival y elige tu zona principal 3, en Ataque. Esa zona no está enlazada a Wolf en este ejemplo. La copia entra bajo tu control, pero sigue perteneciendo al rival.',
 'Activa tu Compulsory Evacuation Device colocada en la columna 3, sin respuesta, sobre ese Blue-Eyes. Regresa a la mano de su propietario rival, no a la tuya. El objetivo deja de cumplirse; revisa el replay de ambos pasos y la identidad de la carta.',
 'Estos monstruos del Main no requieren historial de Invocación propia. Un monstruo del Extra con perfil admitido requiere su Invocación apropiada verificada; colocarlo inicialmente en un Cementerio no acredita esa historia.'
 ],'RESPONSES_EXPLICIT',['MECHABA','ROAR'],'CHOICE_BRANCHES');
const synchroDeck=deck([[21615956,1],[46986414,1],[83764718,1]],[[83994433,1]]),synchroOpening=[21615956,83764718,...NORMALS.slice(0,3)],synchroRivalDeck=deck([[89631139,2]],[]),synchroRivalOpening=NORMALS.slice(0,5);
const synchro=base('synchro','Spark: Synchro real, resurrección y protección','Invoca a Spark con materiales físicos, llévalo al Cementerio, revívelo y comprueba su protección durante el turno rival.',physical(synchroDeck,synchroOpening),physical(synchroRivalDeck,synchroRivalOpening),{turn:2,activePlayer:0,phase:'MAIN 1',placements:[
 {player:0,from:'deck',cardId:46986414,zone:'monster',zoneIndex:0,position:'ATTACK',faceUp:true,summonTurn:1},
 {player:1,from:'deck',cardId:89631139,zone:'monster',zoneIndex:0,position:'ATTACK',faceUp:true,summonTurn:1},
 {player:1,from:'deck',cardId:89631139,zone:'monster',zoneIndex:1,position:'ATTACK',faceUp:true,summonTurn:1}
 ]},{requiredFieldIds:[83994433],phase:'MAIN 2'},[
 'Invoca normalmente a Flamvell Guard desde tu mano. Es un Cantante Normal de Nivel 1; el Dark Magician de Nivel 7 y los dos Blue-Eyes rivales pertenecen a la preparación inicial declarada.',
 'Invoca por Synchro a Stardust Spark Dragon en Ataque, en tu zona principal 1, usando Flamvell Guard y Dark Magician. Las dos copias físicas van al Cementerio; la Invocación Synchro de este Spark sí queda registrada por la jugada.',
 'Pasa a Battle Phase y ataca con Spark al primer Blue-Eyes rival. Spark tiene 2500 ATK frente a 3000: recibes 500 de daño y la misma copia de Spark va al Cementerio.',
 'Pasa a Main Phase 2. Activa Monster Reborn sobre ese Spark de tu Cementerio, en Ataque y en la zona principal 1. El objetivo se cumple en esta fase; la invocación actual es Especial, conservando la prueba de su Synchro anterior.',
 'Pasa a End Phase y termina el turno. En el turno 3 rival, ejecuta el robo de su siguiente carta física del orden conocido. Todavía no has aplicado una protección que deba cruzar el cambio de turno.',
 'Después del robo rival, activa la protección de tu Spark sobre sí mismo. La protección pertenece al turno 3 y evita una sola destrucción por batalla o efecto; no evita el daño de batalla.',
 'Pasa por Standby Phase y Main Phase 1 hasta Battle Phase rival. Ataca a Spark con el primer Blue-Eyes: recibes otros 500 de daño, Spark sobrevive y se consume su única protección.',
 'Ataca a Spark con el segundo Blue-Eyes rival: recibes otros 500 y Spark va al Cementerio. Tus LP quedan en 6500. Comprueba los materiales, las invocaciones, Monster Reborn, ambos ataques y el replay de las quince acciones.',
 'Puedes deshacer los ataques para comprobar que el primer combate consume la protección y el segundo no dispone de otra carga. El objetivo de Spark en Main Phase 2 describe un estado intermedio y no certifica ganar la partida.'
]);
const azureDeck=deck([[21615956,1],[89631139,1],[83764718,1]],[[40908371,1]]),azureOpening=[21615956,83764718,...NORMALS.slice(0,3)],azureRivalDeck=deck([[89631139,1]],[]),azureRivalOpening=NORMALS.slice(0,5);
const azure=base('azure','Azure-Eyes: Synchro, protección y resurrección en Standby','Invoca correctamente a Azure-Eyes, revívelo con Monster Reborn y recupera su Blue-Eyes material durante tu siguiente Standby.',physical(azureDeck,azureOpening),physical(azureRivalDeck,azureRivalOpening),{turn:2,activePlayer:0,phase:'MAIN 1',placements:[
 {player:0,from:'deck',cardId:89631139,zone:'monster',zoneIndex:0,position:'ATTACK',faceUp:true,summonTurn:1},
 {player:1,from:'deck',cardId:89631139,zone:'monster',zoneIndex:0,position:'ATTACK',faceUp:true,summonTurn:1}
 ]},{requiredFieldIds:[40908371,89631139],phase:'STANDBY',turn:4,activePlayer:0},[
 'Invoca normalmente a Flamvell Guard desde tu mano. Es un Cantante Normal de Nivel 1; los dos Blue-Eyes de Nivel 8 pertenecen a la preparación inicial declarada. Azure-Eyes sigue en tu Extra y todavía no tiene una Invocación apropiada registrada.',
 'Invoca por Synchro a Azure-Eyes Silver Dragon en Ataque, en tu zona principal 1, con Flamvell Guard y tu Blue-Eyes. Sus niveles suman 9 y el no Cantante es Normal. Las copias físicas van al Cementerio y el historial apropiado de Azure-Eyes queda registrado.',
 'Resuelve la protección obligatoria de Azure-Eyes antes de seguir. Afecta a los Dragones que controlas al resolver y dura hasta el final del turno siguiente: protege frente a selección por efectos y destrucción por efectos; no impide la destrucción ni el daño de batalla.',
 'Pasa a Battle Phase y ataca con Azure-Eyes al Blue-Eyes rival. Tus 2500 ATK pierden frente a 3000: recibes 500 de daño y Azure-Eyes va al Cementerio pese a la protección. Sus marcas de esa presencia en campo se retiran y conserva su historial Synchro.',
 'Pasa a Main Phase 2. Activa Monster Reborn sobre la misma copia de Azure-Eyes, en Ataque y en tu zona principal 1. Monster Reborn termina en el Cementerio; la llegada actual es Especial desde el Cementerio, no otra Synchro.',
 'Resuelve de nuevo la protección obligatoria generada por esta Invocación Especial. No se restaura un escudo antiguo ni se añade un límite por turno ficticio a esa protección.',
 'Pasa a End Phase y termina el turno. Ejecuta el robo conocido del rival en turno 3; pasa por Standby, Main Phase 1 y End Phase sin activar la resurrección de tu Azure-Eyes durante el Standby rival.',
 'Termina el turno rival, roba tu siguiente carta física conocida en turno 4 y pasa a tu Standby. La protección anterior ya caducó; no se inventa ningún robo ni se revela un orden desconocido.',
 'Activa la resurrección de Standby de Azure-Eyes sobre tu Blue-Eyes original, usado como material y conservado en el Cementerio. La misma copia vuelve a tu campo; la protección previa de Azure-Eyes no se aplica automáticamente a este nuevo Dragón.',
 'El objetivo se cumple con Azure-Eyes y Blue-Eyes en tu campo durante tu Standby del turno 4, con 7500 LP. Comprueba las dieciocho acciones, ambos disparos obligatorios, la Mágica pagada, el uso de la resurrección y el replay. El ejemplo no certifica ganar la partida.'
]);
const spiritRebornDeck=deck([[21615956,1],[83764718,1],[89631139,1],[93490856,1],[98159737,1],[24382602,1]],[[42097666,1]]),spiritRebornOpening=[21615956,83764718,89631139,93490856,98159737];
const spiritReborn=base('spirit-reborn','Spirit Link: tributar, revivir y conservar sus límites','Invoca correctamente a Spirit with Eyes of Blue, tribútalo y revive la misma copia sin repetir su búsqueda Link ni reiniciar su uso por turno.',physical(spiritRebornDeck,spiritRebornOpening),blue(),{turn:2,activePlayer:0,phase:'MAIN 1',placements:[]},{requiredFieldIds:[42097666,89631139],requiredHandIds:[24382602]},[
 'Invoca normalmente a Flamvell Guard desde tu mano. Antes de Spirit, Longyuan puede invocarse descartando Adhara; comprueba esa alternativa sin ejecutarla. Ningún monstruo inicial tiene una historia de Invocación apropiada declarada.',
 'Invoca por Link a Spirit with Eyes of Blue usando Flamvell Guard como material. Su historial Link se obtiene de esta acción real. Mientras controles a Spirit boca arriba y con sus efectos activos, sólo puedes Invocar de Modo Especial Dragones: la alternativa de Longyuan desaparece.',
 'Resuelve la búsqueda de Spirit para añadir Mausoleum of White del Deck a tu mano. La búsqueda corresponde a esta Invocación Link; consume su uso por turno y baraja el Deck.',
 'Activa SPIRIT TRIBUTE BLUE EYES: tributa la misma copia de Spirit como coste e invoca el Blue-Eyes de tu mano. Spirit va al Cementerio y conserva su historial Link. Su restricción continua deja de aplicarse al salir; Longyuan vuelve a estar disponible, pero no lo ejecutes.',
 'Activa Monster Reborn sobre la misma copia de Spirit, en Ataque y en tu zona principal 3. Su llegada actual es Especial desde el Cementerio, no otra Invocación Link. No genera una nueva búsqueda de Mausoleum ni reinicia el uso de su tributo; la restricción de sólo Dragones vuelve a aplicarse y Longyuan desaparece.',
 'El objetivo exige Spirit y Blue-Eyes en tu campo y Mausoleum en tu mano. Comprueba las cinco acciones, el tributo pagado, la Mágica enviada al Cementerio y el replay. El ejemplo no certifica ganar la partida ni registra todas las interacciones de Spirit.'
]);
const wolfRebornDeck=deck([[83764718,1],[86120751,1],[26889158,1],[52277807,1],[14558127,1],[51339637,1]],[[87871125,1],[34755994,1]]),wolfRebornOpening=[83764718,86120751,...NORMALS.slice(0,3)],wolfRebornRivalDeck=deck([[89631139,1]],[]),wolfRebornRivalOpening=NORMALS.slice(0,5);
const wolfReborn=base('wolf-reborn','Sunlight Wolf: Link, batalla y recuperación de FUEGO','Invoca a Wolf por Link, revive la misma copia y recupera Ash al invocar en la zona de Monstruos Extra a la que apunta.',physical(wolfRebornDeck,wolfRebornOpening),physical(wolfRebornRivalDeck,wolfRebornRivalOpening),{turn:2,activePlayer:0,phase:'MAIN 1',placements:[
 {player:0,from:'deck',cardId:26889158,zone:'monster',zoneIndex:0,position:'ATTACK',faceUp:true,summonTurn:1},
 {player:0,from:'deck',cardId:52277807,zone:'monster',zoneIndex:2,position:'ATTACK',faceUp:true,summonTurn:1},
 {player:0,from:'deck',cardId:14558127,zone:'gy'},
 {player:0,from:'deck',cardId:51339637,zone:'gy'},
 {player:1,from:'deck',cardId:89631139,zone:'monster',zoneIndex:0,position:'ATTACK',faceUp:true,summonTurn:1}
 ]},{requiredFieldIds:[87871125,34755994],requiredHandIds:[14558127],phase:'MAIN 2'},[
 'Gazelle en tu zona principal 1, Spinny en la 3, Ash Blossom y Roar en tu Cementerio y Blue-Eyes rival son supuestos iniciales declarados. Wolf y Artemis siguen en el Extra sin historial apropiado. Invoca por Link a Sunlight Wolf con Gazelle y Spinny: esta acción acredita su historial Link real.',
 'Pasa a Battle Phase y ataca al Blue-Eyes rival con Wolf. Sus 1800 ATK pierden frente a 3000: recibes 1200 de daño y la misma copia de Wolf va al Cementerio conservando su historial Link.',
 'Pasa a Main Phase 2 y activa Monster Reborn sobre ese Wolf, en Ataque y en tu zona principal 2. Su llegada actual es Especial desde el Cementerio. No es una nueva Invocación Link ni una reincarnación y no permite recuperar Roar.',
 'Desde esa zona principal 2, Wolf apunta a tu zona de Monstruos Extra. En este tablero se usa la zona de Monstruos Extra izquierda de cada controlador: desde allí Wolf apunta a su zona principal 2 y a la zona principal 4 rival; desde la principal 4 apunta a la zona de Monstruos Extra rival; desde las principales 1, 3 y 5 no apunta a una zona disponible.',
 'Invoca normalmente a Aleister en tu zona principal 1 y declina su búsqueda opcional. Invoca por Link a Artemis con ese Aleister en tu zona de Monstruos Extra. Esa llegada real a una zona apuntada abre la recuperación de FUEGO del Wolf revivido.',
 'Resuelve la recuperación de Wolf eligiendo Ash Blossom en tu Cementerio. No selecciona objetivo al activar: la carta se elige al resolver y puede ser cualquier monstruo FUEGO, aunque no sea Salamangreat. Ash vuelve a la mano y no puedes Invocar de Modo Normal, Colocar ni Invocar de Modo Especial monstruos con su nombre durante el resto de este turno.',
 'El objetivo exige Wolf y Artemis en tu campo y Ash en tu mano durante Main Phase 2. Comprueba las nueve acciones, los materiales físicos, la pérdida de 1200 LP, la Mágica en el Cementerio y el replay. Revivir no reinicia los límites por turno; devolver un Link al Extra mediante esta recuperación no aplicaría el bloqueo de nombre.'
]);
const albazDeck=deck([[68468459,1],[83764718,1]],[[70534340,1],[44146295,1]]),albazOpening=[68468459,83764718,...NORMALS.slice(0,3)],albazRivalDeck=deck([[46986414,1],[97268402,1],[10045474,1]],[[75286621,1]]),albazRivalOpening=[97268402,...NORMALS.slice(0,4)];
const albaz=base('albaz','Albaz: Fusión rival, descarte y resurrección','Invoca a Albaz, usa un monstruo rival como material de una Fusión real y revive la misma copia sin reiniciar su uso por turno.',physical(albazDeck,albazOpening),physical(albazRivalDeck,albazRivalOpening),{turn:2,activePlayer:0,phase:'MAIN 1',placements:[
 {player:1,from:'extra',cardId:75286621,zone:'monster',zoneIndex:0,position:'ATTACK',faceUp:true,summonTurn:1},
 {player:1,from:'deck',cardId:46986414,zone:'monster',zoneIndex:1,position:'ATTACK',faceUp:true,summonTurn:1},
 {player:1,from:'deck',cardId:10045474,zone:'spelltrap',zoneIndex:2,faceUp:false,setTurn:1}
 ]},{requiredFieldIds:[44146295,68468459]},[
 'Mechaba y Dark Magician rivales, junto con Infinite Impermanence colocada desde el turno anterior, son supuestos iniciales declarados. Albaz empieza en tu mano y no hay un efecto pendiente por preparar ese campo. Invoca normalmente a Fallen of Albaz sin respuesta.',
 'Activa la Fusión opcional de Albaz: descarta 7 Colored Fish de tu mano como coste, elige Mirrorjade de tu Extra y usa únicamente al propio Albaz y al Mechaba rival como materiales. No selecciona objetivo al activar. La receta de Mirrorjade exige, además de Albaz, un monstruo de Fusión, Synchro o Link revisado del rival; Lubellion permite el Dark Magician OSCURIDAD rival.',
 'Ejecuta esa Fusión sin respuesta, en Ataque y en tu zona principal 1. El descarte permanece pagado. Albaz va a tu Cementerio y Mechaba al Cementerio de su propietario rival; Mirrorjade obtiene su historial apropiado de Fusión de esta acción real.',
 'Activa Monster Reborn sin respuesta sobre la misma copia de Albaz en tu Cementerio, en Defensa y en tu zona principal 2. Un monstruo del Main como Albaz no necesita historial de invocación apropiada previo. Revivirlo no reinicia el uso por turno de su Fusión: no aparece otra activación de Albaz este turno.',
 'El objetivo exige Mirrorjade y Albaz en tu campo después de estas tres acciones. Comprueba la identidad, los propietarios, el coste físico, Monster Reborn en el Cementerio y el replay. Puedes deshacer la Fusión para comparar Mechaba con un monstruo real de su mano, Effect Veiler o la Infinite Impermanence colocada: negar conserva el descarte y consume el uso de Albaz.',
 'También puedes declinar el efecto opcional recién abierto sin pagar descarte ni consumir su uso. Una llegada real por Monster Reborn puede abrirlo si Albaz todavía no lo ha usado; la colocación inicial declarada no lo abre. La Fusión de Lubellion posterior necesita otro descarte y sólo devuelve tus propios materiales admitidos del campo o Cementerio.'
 ],'RESPONSES_EXPLICIT',['MECHABA','VEILER','IMPERM'],'CHOICE_BRANCHES');
const templates=new Map([spark,spirit,invoked,swordsoul,branded,tenyi,salamangreat,roar,crow,droll,field,trap,evacuation,shuffle,reborn,synchro,azure,spiritReborn,wolfReborn,albaz].map(value=>[value.id,value]));
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
W.YGOScenarioExamples=Object.freeze({version:'self-contained-physical-examples-v8',list,get,load,get isBusy(){return loading;}});
})();

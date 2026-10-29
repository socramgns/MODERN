# Alcance del motor causal de combos y fases

El motor verifica transiciones registradas de seis familias TCG y acciones de duelo acotadas. Parte de un Main de 40–60 cartas, una mano explícita y las copias físicas del escenario. El modo inicial usa cinco cartas, turno 1 y Main Phase 1. El laboratorio permite continuar por fases o declarar un inicio posterior; admite una mano de seis en los contextos posteriores correspondientes. Una línea verificada acredita los pasos ejecutados dentro de ese modelo.

## Datos y procedencia

Las identidades, tipos, materiales, niveles, estadísticas y textos técnicos proceden del catálogo incorporado, actualizado desde Project Ignis/BabelCDB en el commit `ae5dedb957c2c48ab86554fee08a0fca73d8b1cf`. Los hashes están en `src/data/catalog-manifest.json`. Es una fuente técnica secundaria: no autentica rulings, publicaciones oficiales o disponibilidad para un torneo. Las banderas heredadas de «verificado» y las URLs se conservan como afirmaciones; no certifican los datos. El motor reconstruye sus propiedades desde las filas fijadas, aunque un renderizador modifique un objeto de presentación.

La construcción se revisa contra el pool técnico y el snapshot TCG incorporado de fecha 19/10/2026. Una publicación oficial fue recuperada por HTTPS y cotejada en fecha, nombres restringidos y límites; sus bytes están fijados en `src/data/official/`. Este cotejo no acredita disponibilidad oficial de las cartas, todos los rulings ni que una publicación fechada siga siendo la última. Otro contexto importado se señala; no se mezcla silenciosamente con el motor causal. El replay queda ligado a baraja, contenido de la tabla de restricciones, reglas de formato, build y catálogo. Una modificación invalida la línea aunque conserve el nombre o fecha de la lista.

Los archivos `examples/Arquetipo_*.json`, `Expansion_*.json` y sus YDK usan identidades reales y relleno de monstruos Normales para aislar reglas. Son fixtures técnicos, no recomendaciones competitivas, listas de torneo ni datos para calibración. JSON añade mano, orden inicial y objetivo; YDK conserva las cantidades.

## Líneas de familias registradas

| Familia | Transiciones implementadas | Límites relevantes |
| --- | --- | --- |
| Invoked | Normal Summon de Aleister, búsqueda de Invocation, Link de Artemis, Fusion de Mechaba y recuperación de Invocation/Aleister | Materiales admitidos y consecuencias de zona conocidas. Materiales con disparos desconocidos se excluyen. La respuesta de Mechaba solo cubre el paquete indicado más abajo |
| Swordsoul | Mo Ye revela una carta real y crea Token; Synchro Chixiao con CL1 Chixiao/CL2 Mo Ye; Longyuan descarta, se invoca y crea Token opcional; Chengying y daño de Longyuan | Buscar con Chixiao consume el uso compartido con negar. El robo de Mo Ye necesita orden conocido o negación explícita. Los Tokens dejan de existir al abandonar el campo. Chengying recalcula ganancias y reducción rival según el destierro real |
| Branded | Branded Fusion con Albaz/DARK admitido, Lubellion con descarte físico y devolución de materiales, Fusion de Mirrorjade | Materiales y descartes restringidos a consecuencias conocidas. La restricción Fusion del Extra abarca todo el turno, incluso las invocaciones anteriores |
| Blue-Eyes | Sage, búsqueda de Tuner, Link Spirit with Eyes of Blue, Mausoleum, Normal adicional, envío de BEWD/ganancia temporal, tributo de Spirit, BEWD y Synchro Spirit Dragon | La restricción Dragon depende del Link boca arriba. Spirit Dragon tributa para Azure-Eyes/Spark; Azure aplica protección obligatoria y revive un Normal en Standby. Spark aplica una protección compartida de una destrucción por batalla o efecto hasta fin de turno; no evita daño, sobrevive a la salida de Spark y se reinicia al abandonar el objetivo su instancia de campo. Spirit Dragon niega activaciones GY registradas sin destruir la fuente |
| Tenyi | Special Summon desde mano sin monstruos de efecto, Monk, Ashuna/Adhara/Vishuda, Vessel, Shaman con descarte y resurrección, Link Berserker | Restricción Wyrm de Ashuna y de efectos Extra de Shaman; revivir exige historial apropiado. Vishuda solo devuelve monstruos Normales boca arriba y Field Spells admitidas. No cubre consecuencias desconocidas al abandonar el campo |
| Salamangreat | Gazelle envía una carta real; Spinny descarta/da ATK y revive con destierro al dejar el campo; Balelynx busca Sanctuary; Wolf, reincarnación, recuperación y Roar desde GY | Materiales limitados a Gazelle/Spinny/Balelynx/Wolf. Recuperar FIRE depende de colocaciones en zonas enlazadas registradas y aplica restricción de nombre. Roar se recupera o coloca con su sustitución de destino; añade activación de Counter Trap y contrarrespuestas en los paquetes registrados; no implementa prioridad arbitraria |

Las rutas pueden terminar antes si el objetivo ya se alcanzó. Obtener un campo no demuestra que sea la mejor decisión estratégica ni que sobreviva a todas las respuestas del juego. Los handlers de familia conservan sus ventanas registradas; habilitar fases no convierte todos sus efectos en acciones disponibles en cualquier turno o fase.

## Rival y respuestas físicas

El rival necesita mazo y mano completos para usar respuestas. El motor exige cartas reales, identidad, zona, coste y usos disponibles. Las políticas son `PASS`, `ASH_EXPLICIT` y `RESPONSES_EXPLICIT` con tipos seleccionados. `FIRST_ELIGIBLE` responde en la primera ventana admitida; `CHOICE_BRANCHES` explora ramas de decisión declaradas. Ninguna de las dos equivale a un adversario óptimo.

| Respuesta o acción | Alcance implementado |
| --- | --- |
| Ash Blossom | Descarte real y uso por jugador/turno. Niega accesos al Deck elegibles: búsquedas, envíos y robo por efecto registrados. En CL1 Chixiao/CL2 Mo Ye, Ash CL3 niega el robo de Mo Ye y Chixiao puede resolver |
| Effect Veiler | Envío real desde mano, Main Phase rival y efecto de monstruo en campo admitido; la negación termina con el turno |
| Infinite Impermanence | Conserva su proveedor de respuesta y añade activación directa registrada de Trampa Normal de Velocidad 2. Desde mano exige no controlar cartas; desde colocada exige turno anterior y columna física. La columna solo se aplica cuando se resuelve la negación del objetivo y la fuente colocada permanece al resolver; las columnas rivales se reflejan |
| Compulsory Evacuation Device | Activación de Trampa Normal de Velocidad 2 desde una colocación anterior. Selecciona un monstruo propio o rival con perfil revisado: Main a mano del propietario, Fusion/Synchro/Link admitidos a su Extra oculto y Tokens registrados cesan; no es destrucción |
| Chixiao | Destierra una carta Swordsoul/Wyrm real de mano/GY, niega el monstruo elegible y comparte presupuesto con su búsqueda |
| Mechaba | Envía de mano el tipo correspondiente: monstruo para un efecto individual registrado en campo, mano o GY; Mágica para las activaciones de Invocation, Branded Fusion, Vessel y las dos Mágicas de Campo registradas, o Trampa admitida para las activaciones directas de Impermanence o Compulsory Evacuation Device. Niega la activación y destierra la fuente solo si permanece en su lugar de activación registrado. Incluye Crow/Droll desde mano. No cubre efectos GY de Mágicas/Trampas, otras Mágicas de Campo, activaciones generales de Trampas ni el paquete conjunto Chixiao/Mo Ye |
| Spirit Dragon | Responde a paquetes individuales de efectos GY registrados, capturando la zona antes de costes. Niega la activación sin seleccionar objetivo ni destruir la fuente; conserva costes pagados y distingue restricciones por uso y por activación. No necesita historial Synchro para esta negación |
| D.D. Crow | Objetivo físico del GY rival registrado antes de resolver, descarte como coste y destierro si resuelve; `NONE`, sin límite por turno inventado. Mechaba puede negar la activación desde mano y el descarte permanece en GY |
| Droll | Ventana tras búsqueda o robo por efecto registrado, envío de mano a GY como coste y bloqueo de añadir del Deck a la mano para ambos jugadores durante el turno. `NONE`, sin límite por turno inventado; la oportunidad termina con la cadena y un evento elegible posterior puede abrir otra. El robo ordinario de Draw Phase no abre esa ventana |
| Mirrorjade | Envía Fusion admitido del Extra como coste, elige al resolver sin seleccionar objetivo al activar, destierra y aplica su restricción hasta el turno siguiente. Una salida elegible por el rival puede programar la destrucción End Phase |

La revisión 9 conserva el registro explícito de mano/GY de quince handlers, aceptado en revisión 8 dentro de su alcance:

| Paquete | Zona de activación registrada |
| --- | --- |
| `TENYI_HAND_SPECIAL` | Mano, para Ashuna, Adhara, Vishuda o Shthana |
| `TENYI_ASHUNA_DECK`, `TENYI_ADHARA_RECOVER`, `TENYI_VISHUDA_BOUNCE` | Mano o GY |
| `SALAMANGREAT_GAZELLE_HAND`, `SALAMANGREAT_SPINNY_DISCARD` | Mano |
| `SALAMANGREAT_SPINNY_REVIVE`, `MOYE_DRAW` | GY |
| `DUEL_ANCIENTS_END_SUMMON`, `ANCIENTS_RECOVER_BLUE_EYES` | GY |
| `TENYI_SHTHANA_REVIVE` | Mano o GY |
| `LONGYUAN_SPECIAL` | Mano |
| `LONGYUAN_BURN` | GY |
| `DD_CROW_BANISH` | Mano; D.D. Crow |
| `DROLL_LOCK` | Mano; Droll & Lock Bird |

El registro exige passcode, jugador, UID, zona y metadatos del handler compatibles. Una Invocación Normal o un procedimiento de invocación sin activación no se convierte en efecto negable. El robo separado de Mo Ye mantiene el requisito de orden conocido; no se habilita el paquete conjunto Chixiao/Mo Ye para Mechaba.

El origen se captura antes de pagar costes y se conserva en el replay. Spinny descartado desde la mano o Ashuna desterrada desde GY no se destierran de nuevo desde su nuevo destino. Si Gazelle permanece en la mano o Spinny en el GY al resolver Mechaba, puede aplicarse el destierro desde ese origen. Longyuan negado conserva su descarte y uso, sin invocación ni Token; su disparo GY negado conserva el uso y no causa daño. Spirit reconoce también ese disparo individual del GY.

Crow y Droll declaran `activationRestriction: NONE`: no se marcan usos por turno ficticios. Crow fija el objetivo antes de resolver y lo conserva en la traza, aunque su efecto no llegue a desterrarlo. Su descarte y el envío de Droll permanecen pagados al negarse sus activaciones; Mechaba no destierra de nuevo sus fuentes desde GY porque activaron en mano. La restricción propia de Mechaba se mantiene.

La oportunidad previa de Droll termina al cerrar la cadena, incluso si se negó Droll. Una nueva activación requiere una nueva ventana admitida y una copia disponible; un evento registrado elegible de búsqueda o robo por efecto puede crear esa ventana. `NONE` no exime las restricciones de construcción: Droll está limitada a una en el snapshot TCG actual. Esta ampliación no añade Droll como contrarrespuesta general ni prueba prioridad arbitraria dentro de cadenas.

Otras Mágicas de Campo y otras Trampas de Velocidad 2 siguen pendientes; revisión 13 conserva Impermanence y añade únicamente el paquete concreto de Compulsory Evacuation Device. Roar es una Counter Trap de Velocidad 3 y Mechaba, de Velocidad 2, no puede responder a su activación.

El criterio de Mechaba se documenta con las FAQ oficiales OCG en japonés 16041, 22388 y 23949. Sus originales y citas están fijados; las explicaciones españolas no sustituyen la evidencia original. Su alcance de referencia se distingue de una certificación general TCG en [FUENTES_OFICIALES.md](FUENTES_OFICIALES.md).

Los costes se pagan aunque la resolución quede negada cuando así lo exige el efecto. Negar Mo Ye no crea Token, pero conserva revelación y uso; negar Lubellion no devuelve el descarte. Los paquetes que no declaran un contrato de cadena admiten una respuesta registrada. Mechaba y Roar declaran paquetes que permiten hasta tres contrarrespuestas Roar con velocidad, alternancia de jugadores y resolución LIFO verificadas. La prioridad arbitraria, SEGOC y todas las cadenas posibles siguen fuera del alcance.

## Activaciones de Mágicas de Campo de la revisión 9

El registro se limita a `ACTIVATE_MAUSOLEUM_OF_WHITE` (Mausoleum of White, 24382602) y `SALAMANGREAT_ACTIVATE_SANCTUARY` (Salamangreat Sanctuary, 1295111), activadas desde la mano. Declaran `FIELD_SPELL`, paquete `SINGLE` y restricción de activación `NONE`. Se conservan los quince paquetes de monstruos y las tres activaciones de Mágicas Normales anteriores; no se infieren otras cartas o efectos desde el texto del catálogo.

Antes de ofrecer respuestas, la nueva carta ocupa su zona de Campo y el Field Spell propio anterior admitido, boca arriba o colocado, se envía al GY por regla. Ese envío no es destrucción ni coste de efecto y no se revierte si se niega la nueva activación. La preparación conserva UID, jugador, identidad, origen y reemplazos en la traza. Las salidas con consecuencias desconocidas no se incorporan como si estuvieran modeladas.

La zona de Campo es independiente de las cinco zonas de Mágicas/Trampas: llenarlas no impide esta activación. El bloqueo de una columna por Impermanence no se aplica a la zona de Campo. Esto no habilita todas las activaciones de cartas colocadas ni una activación rival simétrica de cada handler de familia.

Mechaba paga una Mágica física de la mano para negar la activación y destierra la nueva carta cuando corresponde. Roar niega y destruye la carta activada; una activación negada no se trata como carta en el campo a efectos de protección de Spark o reemplazo de Balelynx, por lo que termina en GY sin esos reemplazos. Si una contrarrespuesta Roar niega la primera respuesta y permite resolver la activación, permanece el Field Spell **nuevo**; el anterior ya enviado por regla no vuelve al campo.

Reemplazar copias no reinicia los presupuestos globales del turno: el Normal adicional de Mausoleum y la reincarnación de Sanctuary conservan sus usos gastados. Un aumento de ATK de Mausoleum que ya resolvió conserva su duración al salir el Field Spell. Los efectos propios posteriores siguen necesitando su acción registrada; activar la carta no ejecuta automáticamente todos sus efectos.

Esta ampliación no registra el efecto de Mausoleum desde GY, otras Mágicas de Campo ni efectos desconocidos de cartas nuevas. Las demás activaciones de Trampas de Velocidad 2 continúan pendientes; el paquete directo de Impermanence se describe a continuación. Mechaba, de Velocidad 2, no puede responder a la Counter Trap Roar de Velocidad 3.

## Activación directa de Infinite Impermanence en revisión 12

El registro añade únicamente `ACTIVATE_INFINITE_IMPERMANENCE` (10045474), `NORMAL_TRAP`/`SINGLE`/`NONE`, de Velocidad 2. No se infieren otras Trampas a partir del catálogo. Desde mano exige no controlar ninguna carta en monstruos o Mágicas/Trampas, incluida la zona de Campo, y conserva las cinco elecciones de columna. Desde colocada exige una copia física boca abajo, columna válida y colocación anterior al turno actual. No se inventa un límite de uso por turno.

La carta ocupa boca arriba su zona antes de responder y conserva origen, jugador, columna y objetivo. La negación del monstruo rival admitido dura hasta el final del turno. Si la negación no se resuelve porque el objetivo dejó el campo, no se aplica la negación de columna posterior. Esta última requiere además que Impermanence estuviera colocada antes de activarse y siga en el campo al resolver. La resolución normal limpia la carta al GY; ese envío no es un coste de activación.

Mechaba envía una Trampa física admitida de la mano como coste y niega y destierra la carta activada dentro del paquete registrado. Roar puede negar y destruir esa activación o participar en las contrarrespuestas existentes; los pagos permanecen. Negar la activación de una Mágica/Trampa no la trata como una carta que permanece en campo para aplicar protección de Spark o reemplazo de Balelynx. Mechaba no puede responder a la Counter Trap Roar de Velocidad 3. El proveedor de respuesta de Impermanence conserva sus ventanas y añade la corrección de bloqueos de columna anteriores: una respuesta colocada en una columna ya negada se activa y termina en el GY, pero no niega el efecto del monstruo ni añade otro bloqueo. Desde mano, la respuesta elige de forma determinista la primera columna no bloqueada, o la primera si las cinco están bloqueadas; en este último caso su efecto también queda negado. La activación directa mantiene sus cinco elecciones explícitas de columna.

Se admiten ventanas entre acciones del duelo registrado y perfiles concretos de objetivos y salidas. La búsqueda propia ofrece la activación del jugador 0 también durante el turno rival cuando la ventana lo permite; el laboratorio con `manualBothPlayers` permite elegir los jugadores 0 y 1. Esa selección no demuestra prioridad general. Siguen pendientes otras activaciones de Trampas, prioridad general, cadenas arbitrarias, SEGOC y Damage Step. Las pruebas de esta implementación y el texto técnico de carta no constituyen por sí solos una nueva certificación oficial de todos los rulings.

Una columna ya negada también anula el efecto de Roar, incluida su contrarrespuesta de Velocidad 3. La carta se activa y consume su uso; al resolver no niega ni destruye el eslabón anterior, y termina en el destino registrado. Otra Counter Trap admitida todavía puede negar esa activación.

## Compulsory Evacuation Device de revisión 13

`ACTIVATE_COMPULSORY_EVACUATION_DEVICE` (94192409) es la segunda Trampa Normal registrada: `NORMAL_TRAP`/`SINGLE`/`NONE`, Velocidad 2, solo desde `spelltrap`. Exige copia física colocada en turno anterior y su columna. No admite activación desde mano ni añade un límite por turno inventado. La excepción desde mano de Impermanence se conserva exclusivamente para aquella carta.

El objetivo puede ser propio o rival, boca arriba o colocado, siempre con un perfil de salida revisado. El origen y el objetivo se conservan antes de responder. Si resuelve, los monstruos admitidos del Main vuelven a la mano de su propietario y los Fusion/Synchro/Link admitidos a su Extra oculto, manteniendo el UID. Los Tokens registrados dejan de existir al salir y esa salida no se trata como destrucción. Xyz, Pendulum, equipos, materiales y consecuencias desconocidas permanecen fuera del paquete.

Al volver a mano o al Extra oculto se retiran las marcas ligadas al campo y la certificación de Invocación apropiada de esa presencia; no se reinician presupuestos globales del turno, restricciones ni la historia del Extra pertinente. La protección de Spark no evita devolver y Balelynx no paga un reemplazo por ello. Mirrorjade devuelto al Extra oculto no crea una nueva destrucción End Phase; los efectos diferidos ajenos ya pendientes no desaparecen. Un retorno campo→mano no abre la ventana de adición Deck→mano de Droll.

La redirección registrada de Spinny que fue revivido se respeta: su salida lo destierra en lugar de devolverlo a la mano. La traza conserva el destino solicitado y el real; otras redirecciones sin revisar permanecen excluidas.

Mechaba puede negar la activación pagando una Trampa física admitida; Roar conserva las respuestas y contrarrespuestas acotadas. Se mantienen los costes y usos aunque una respuesta se niegue. La negación de activación, la negación del efecto por columna y la desaparición del objetivo antes de resolver no producen la devolución correspondiente. La limpieza de la Trampa conserva los destinos registrados.

## Laboratorio de fases y campo

**Laboratorio de fases, campo rival y respuestas** permite iniciar desde mano/escenario o continuar la primera línea con replay nuevo. Muestra campo, mano declarada, GY, destierro y LP de ambos jugadores; ofrece acciones, deshacer, exportación JSON y reimportación del informe para reanudar. Reimportar exige la misma baraja y contexto vigentes; reconstruye el inicio y ejecuta el replay antes de cambiar la sesión. Un campo, traza o contexto alterado se rechaza de forma transaccional.

Un campo inicial mueve copias existentes desde las zonas permitidas del mazo. Conserva propietario e identidad; no inventa cartas. La fase, turno, posiciones e historia previa de invocación declarada son supuestos iniciales. El replay comprueba esa declaración física y las transiciones posteriores; no certifica retrospectivamente cómo se construyó el campo. `examples/Escenario_Segundo_Turno.json` ilustra un campo técnico Blue-Eyes frente a 7 Colored Fish en turno 2.

Las fases registradas son DRAW, STANDBY, MAIN 1, BATTLE, MAIN 2 y END. Se modelan:

- Robo de la siguiente carta física con orden conocido, omisión del primer robo y ausencia de cartas para robar.
- Invocación/Colocación Normal de Normales sin Pendulum, tributos físicos según nivel, colocación de Mágicas/Trampas admitidas y cambio manual de posición con sus límites.
- Un ataque por monstruo, ataque directo, ATK contra ATK/DEF y objetivos Normales declarados boca abajo; daño, destrucción y LP. El turno 1 no tiene Battle Phase.
- End Phase de Ancients para BEWD, destrucción diferida de Mirrorjade, destrucción de Synchro prestado por Spirit Dragon y protección registrada de Azure-Eyes. Efectos opcionales pueden declinarse; un disparo obligatorio no se descarta como opcional.
- Descarte simultáneo hasta seis cartas, expiración de modificadores/negaciones y limpieza de usos al pasar turno. Azure-Eyes puede revivir un Normal físico del GY en su Standby registrada.

El combate exige perfiles de estadísticas y efectos revisados. Una carta con efecto continuo, de batalla o de End Phase desconocido bloquea las transiciones afectadas. No se infieren Damage Step, efectos Flip arbitrarios, ataques múltiples ni efectos de todos los monstruos. Los Normales Pendulum quedan fuera por sus reglas de destino. El turno siguiente exige escenario rival y orden de robo verificable; después de barajar no se inventa la siguiente carta.

## Qué verifica el replay

Cada copia conserva UID, identidad y propietario al cambiar de zona. Los Tokens tienen registro separado y dejan de existir al salir del campo. Cada paso comprueba materiales distintos, revelaciones, costes, espacios y columnas, usos por turno, restricciones y efectos diferidos. Al abandonar el campo se retiran los modificadores y marcas vinculados a esa presencia, según el alcance modelado.

El replay reconstruye el inicio desde mazos, manos, orden de Deck y preparación declarada y vuelve a ejecutar las acciones. Compara estados intermedios, costes, eventos y estado final. Una bandera anterior `replay.pass` no sustituye esa ejecución. Alterar LP, materiales, pagos, mazos o contexto invalida la prueba.

Una búsqueda o envío desde Deck que baraja invalida el conocimiento del orden. Los límites de turnos o búsqueda no producen por sí mismos un resultado de partida.

## Objetivos, recursos y comparación

La revisión 13 conserva objetivos propios de monstruos boca arriba, Mágicas/Trampas boca arriba, Mágicas/Trampas colocadas y cartas en mano, además de cantidades, LP, fase, turno y jugador activo. `requiredFieldIds` conserva su significado de monstruos boca arriba. `requiredFaceUpSpellTrapIds` y `requiredSetSpellTrapIds` separan los estados boca arriba y colocado en Mágicas/Trampas; ambos incluyen Mágicas de Campo. Los objetivos de mano `requiredHandIds` y el nombre heredado `recoveredHandIds` se conservan. Cada copia requerida se cuenta por identidad canónica dentro de la zona; no cuenta una carta en mano, GY o campo rival. El ejemplo de Campo exige Sanctuary boca arriba, Wolf en campo y Roar en mano. Las métricas describen recursos observados: mano, zonas, ATK conocido, materiales, descartes, tributos y restricciones. Una capacidad condicional de negar no se contabiliza como una negación ya ejecutada; opciones que comparten uso no se suman como independientes.

La validación compartida comprueba los campos y las identidades antes de aplicar o importar el objetivo. El selector visual usa el inventario y los tipos correspondientes; Skills y Tokens no se ofrecen como Mágicas/Trampas. Los escenarios e informes conservan las zonas y cantidades. Las recomendaciones exigen el mismo objetivo completo; definirlo no habilita nuevas acciones ni certifica la historia inicial.

El seguimiento incorporado en revisión 11 desglosa de forma visible las copias y condiciones cumplidas o pendientes. Se recalcula al iniciar, ejecutar, deshacer, aplicar otro objetivo e importar un informe; un contexto caducado no conserva la indicación anterior. El tablero distingue las Mágicas/Trampas boca arriba, colocadas y de Campo. El resumen de progreso importado no sustituye el cálculo a partir del estado y objetivo validados.

Si el objetivo ya se cumple en la preparación inicial, el panel lo indica como un estado declarado. Las búsquedas pueden mostrar continuaciones, pero no crean una línea sin acciones para acreditar ese objetivo ni convierten el aviso en éxito de muestreo o resultado competitivo. Las jugadas posteriores mantienen replay nuevo y el campo previo sigue siendo un supuesto.

La interfaz compara PASS y Ash/Veiler/Imperm que existan en la mano rival y Spirit Dragon cuando una copia elegible está en el campo. La comparación parte del mismo campo físico inicial guardado y conserva sus políticas. `examples/Escenario_Respuestas_TCG.json` contiene mano e inventario físicos para las cuatro políticas. Cada escenario conserva exactamente la misma mano propia, orden restante, inventario y campo rival; solo cambia la política de respuesta. Todas las líneas aceptadas se reproducen de nuevo. Los recursos y el Pareto se comparan cuando hay cobertura y dominio final compatibles; si falta evidencia queda desconocida. Los resultados observados no son una garantía contra todas las decisiones rivales ni una tasa de victoria.

El acceso hipergeométrico a una carta/rol mide un evento de mano. El muestreo causal solo cuenta éxito cuando el objetivo se alcanza y pasa replay nuevo. Una búsqueda incompleta o fuera de alcance permanece **desconocida**, sin convertirse en derrota ni mano injugable. El muestreo no atribuye probabilidades a un campo propio inicial declarado.

## Límites de búsqueda y tareas pendientes

La búsqueda tiene límites de profundidad, estados, tiempo y turnos, y devuelve hasta cinco resultados distintos de los observados. Agotar acciones registradas no agota todas las acciones legales de Yu-Gi-Oh. La identidad de estado conserva información que afecta a continuaciones, como zonas/columnas, protección, historial y efectos diferidos; copias equivalentes no multiplican artificialmente resultados.

Quedan por ampliar cartas, disparos, cadenas, prioridad, Damage Step, decisiones adversariales, mecánicas y reglas de otros formatos. Los pools digitales/históricos, desbloqueos, Skills e impresión/evento requieren datos propios. El editor de formatos ya transporta Skills y Fusion Deck histórico; eso no certifica sus efectos ni disponibilidad. La lista TCG fechada y tres referencias OCG de Mechaba cuentan con capturas oficiales. La revisión completa del reglamento, los rulings restantes y la disponibilidad siguen pendientes; los bloqueos históricos y los alcances documentales están en [FUENTES_OFICIALES.md](FUENTES_OFICIALES.md).

La puntuación competitiva permanece provisional por decisión del usuario. El importador está preparado; requiere barajas y resultados reales con formato, lista, fechas y procedencia para calibrar y validar por separado.

## Verificación reproducible

Desde la raíz del proyecto:

```sh
python3 tests/run_all.py
```

El runner compila y agrupa las suites registradas en `tests/run_all.py`, incluidas núcleo, familias, fases, respuestas, recomendaciones, formatos, documentos y navegador. El resultado de la ejecución está en `dist/validation-summary.json`; el detalle, en `tests/*-results.json` y logs. Los informes de entrega identifican el build y hash del HTML probado. `--source-inject` en pruebas de desarrollo no constituye evidencia de los bytes del entregable.

La revisión 7 tiene una [aceptación local documentada de 44/44 grupos](https://github.com/socramgns/MODERN/blob/719897b2f9880507b15068c4a5ca9e1a3a02d038/evidence/validation-summary.json), con 114 archivos JavaScript comprobados, Chromium, Firefox y WebKit y apertura directa offline en Firefox. La ejecución inicial aprobó 43 grupos; el flujo de contexto pasó sus 18 comprobaciones al repetirse después de ajustar un selector de la prueba al panel anidado, sin cambiar la aplicación ni el HTML. La evidencia conserva ambos intentos. La revisión 8 también aprobó las comprobaciones entre los tres motores y la apertura directa offline en Firefox sobre sus propios bytes. Chromium mantiene el bloqueo administrativo de navegación local y WebKit tiene una limitación documentada de emulación offline local.

La protección Spark registrada no admite acumular dos protecciones aún sin consumir sobre el mismo objetivo ni modela la prioridad general del Damage Step. La negación GY de Spirit se limita a handlers registrados explícitamente; el descarte de Ash, Crow o Droll desde la mano no cambia el origen de su activación a GY.

## Diagnóstico y ejemplos incorporados

El diagnóstico por carta contrasta un registro explícito de acciones parciales con los handlers y proveedores realmente presentes en la compilación. Distingue datos técnicos, uso básico acotado de Normales y efectos registrados. No presenta reconocer una carta como haber implementado todos sus efectos. El informe incluye build, catálogo y contexto; su aplicabilidad causal se limita al formato registrado.

La revisión 13 conserva los doce ejemplos anteriores: Invoked, Spark, Spirit, Swordsoul, Branded, Tenyi, Salamangreat, Roar, Crow/Mechaba, Droll tras una búsqueda, activación/reemplazo de Campo e Impermanence. El de Campo requiere Sanctuary boca arriba además de Wolf en campo y Roar en mano. El de Impermanence conserva Mechaba con coste Trampa, Roar y la búsqueda de Invocation con Aleister. El decimotercero, `evacuation`, compara devolver Blue-Eyes a la mano y Mechaba a su Extra con la protección de Spark y respuestas físicas de Mechaba/Roar. Cargarlos sustituye la baraja actual y prepara las copias físicas y el campo declarado; no ejecuta jugadas automáticamente ni certifica la historia anterior. La aceptación corresponde a los bytes y las tareas identificados por el informe de cada revisión.


## Ampliaciones de la revisión 6

Los 14.759 registros de la fuente técnica principal fijada están representados en un catálogo de 21.986 entradas que conserva las anteriores. La actualización no modifica identidades heredadas por coincidencias de nombre.

Las ventanas registradas admiten acciones rápidas fuera de Main cuando corresponde y las acciones de familia propias en Main 2. Veiler mantiene su ventana de Main rival. Los handlers que usan explícitamente el inventario propio no se reflejan automáticamente al rival.

Gazelle incorpora un disparo de mano tras un envío Salamangreat elegible; Balelynx puede reemplazar destrucción con una copia física del GY; Shthana incorpora su oportunidad de resurrección y destrucción admitida; Roar niega activaciones registradas y participa en las cadenas acotadas. Las restricciones de turno, costes y destinos se verifican por acción.

El laboratorio mantiene JSON avanzado y añade formularios de objetivos, selección de copias físicas, zonas y columnas, nombres legibles, búsqueda y paginación. Las colocaciones iniciales siguen declaradas, sin certificar su historia anterior.

El panel de probabilidades del próximo robo calcula distribuciones exactas por identidad sobre las copias restantes. Con orden desconocido supone un barajado uniforme: no revela la siguiente carta, no cambia el mazo y no certifica una continuación. La búsqueda informa separadamente los horizontes de profundidad/turnos y los presupuestos alcanzados.


## Aceptación local de la revisión 13

La revisión 13 obtuvo aceptación local de **56/56 grupos** sobre el HTML final. La primera ejecución completa aprobó **55/56**: la prueba de exportación YDK podía comparar una baraja antes de terminar su importación. Se corrigió la espera de la prueba y se repitió la suite completa de entrega, con **14/14 tareas aprobadas sobre los mismos bytes**, sin modificar la aplicación. Se comprobó la sintaxis de **114 archivos JavaScript**, Chromium, Firefox y WebKit, y la apertura directa del HTML local sin conexión en Firefox. Build `62d595ef64824400782f54808fd32e70a9b2fcb21ef98ba2aeaec753c41ec79a`; SHA-256 `5f05c079f9a512c04e3d7978864461746e4bcb8d9cf0589440579663e6dceecb`; tamaño **6,989,766 bytes**. Los informes conservan el intento inicial y la repetición; la aceptación se limita al alcance registrado.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 13 se comprueban por separado y se registran con el commit correspondiente.

La revisión 12 conserva una [aceptación local de 54/54 grupos](https://github.com/socramgns/MODERN/blob/f538b8002106b4e0a9244e39fc3d82aecb8de78e/evidence/validation-summary.json), con 114 archivos JavaScript comprobados, Chromium, Firefox y WebKit y apertura directa del HTML sin conexión en Firefox. Su descarga HTTP fue cotejada con los bytes aceptados y su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40822517564) terminó **correctamente** para el commit `f538b8002106b4e0a9244e39fc3d82aecb8de78e`. Esta evidencia pertenece a revisión 12 y no sustituye la aceptación de los bytes nuevos.

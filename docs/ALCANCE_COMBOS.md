# Alcance de combos y reglas · revisión 19

VALIDACION_R19_PENDIENTE

Cuando un disparo de Wolf coincide con otra clase de disparo opcional, el subconjunto exige declinar explícitamente hasta conservar una sola clase antes de resolver; no permite representar una cadena simultánea mediante resoluciones independientes sucesivas. La selección de recuperación enumera cartas admitidas ya presentes en GY al activar y las vuelve a validar al resolver; no amplía automáticamente las opciones con cartas que entren en GY por costes de respuestas.

La revisión 19 amplía Sunlight Wolf con historial Link ejecutado, salida al GY y Monster Reborn en una zona principal, únicamente en Ataque. La llegada actual es Especial desde GY y conserva UID, propietario y cualificación apropiada, pero no restaura la condición de una presencia actual invocada por Link usando Wolf.

El tablero declara una EMZ izquierda fija por controlador. Con índices principales 0–4 y EMZ 5, Wolf en EMZ apunta a Main 1 propio y Main 3 rival; Wolf en Main 1 apunta a EMZ propia, y en Main 3 a EMZ rival. Main 0, 2 y 4 no apuntan a una Zona de Monstruos. Estas coordenadas son del modelo registrado y no añaden una elección general de las dos EMZ ni Extra Link.

El disparo se deriva de llegadas reales Normales, por Tributo o Especiales a una zona apuntada. No nace de un campo inicial, un Set ni una invocación durante Damage Step. Las flechas permanecen aunque Wolf tenga sus efectos negados. Negación aplicada y prohibición de activar por Shaman conservan tratamientos distintos. Los presupuestos de uso pertenecen al nombre y al controlador, y no se reinician al revivir o cambiar de copia.

La recuperación FIRE es no dirigida y selecciona al resolver una carta técnica admitida del GY; no se limita a Salamangreat. Una carta del Extra puede volver al Extra, pero sólo la llegada efectiva a la mano instala el bloqueo de nombre. Ese bloqueo se comprueba antes de costes y materiales para Normal, Set y Especiales, dura el resto del turno y persiste aunque salga Wolf. La recuperación de Magia/Trampa requiere una presencia actual obtenida por Link con Wolf como material; la receta de dos materiales también puede satisfacerla. Las recuperaciones del GY no son búsquedas del Deck.

Las seis familias siguen parciales. Cadenas generales, prioridad, SEGOC, elecciones simultáneas de varios disparos y Damage Step completo requieren modelos propios; los paquetes sin continuación registrada se excluyen explícitamente. Se mantienen los perfiles de campo y movimientos del GY revisados. Albaz al ser invocado conserva su ampliación pendiente y su exclusión pertinente de Reborn. La emulación móvil no acredita dispositivos físicos ni conformidad WCAG completa.

## Ejemplo y pruebas de la revisión 19

El ejemplo wolf-reborn declara Gazelle y Spinny como materiales iniciales y Ash/Roar en GY. Ejecuta Link de Wolf, batalla contra Blue-Eyes, Main Phase 2 y Reborn del mismo Wolf a Main 1 (segunda zona principal). Después invoca normalmente Aleister, declina su búsqueda opcional, invoca Artemis en EMZ y recupera Ash con Wolf. El objetivo exige Wolf, Artemis y Ash en mano; la historia apropiada de Wolf se obtiene en la ruta, no en la preparación.

Las pruebas específicas son tests/wolf_revival.cjs y tests/release19_browser.py. Los resultados deben vincular build, hash, entorno y commit; no se convierten ausencias de motores locales en aprobaciones. El runner añade únicamente esos dos grupos a la batería heredada. La aceptación, publicación y descarga se registran por separado.

El workflow aumenta sólo timeout-minutes de 20 a 25 en Ejecutar pruebas del entregable: la revisión anterior consumió 19 min 38 s y esta ampliación añade cobertura. La revisión de configuración exige exactamente esa sustitución; instalación de los tres motores, comandos, comprobación estricta entre navegadores y límite de 300 s por tarea permanecen sin cambios.

La referencia fijada de [ProjectIgnis/CardScripts](https://raw.githubusercontent.com/ProjectIgnis/CardScripts/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c87871125.lua) se conserva como datos en src/data/technical-references/wolf-c87871125.lua y wolf-reference.json: 3.224 bytes, SHA-256 da3a4b8edced408ae778dc6098fb8e2e37d83e86bc690e726514ee3674a1133f. Es una referencia técnica secundaria contrastada con el texto impreso del catálogo; no es una nueva autenticación de rulings oficiales y el analizador no ejecuta Lua.

La puntuación competitiva permanece estructural y provisional, por decisión del usuario. El importador de resultados reales está preparado; los fixtures técnicos no sustituyen resultados de torneos con formato, banlist, fecha y procedencia.

## Referencia histórica hasta la revisión 18

Los apartados siguientes conservan el alcance y la evidencia de las revisiones que identifican. Las exclusiones históricas de Wolf corresponden a esas entregas; la ampliación actual se describe arriba.

## Alcance del motor causal de combos y fases

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
| Blue-Eyes | Sage, búsqueda de Tuner, Link Spirit with Eyes of Blue, Mausoleum, Normal adicional, envío de BEWD/ganancia temporal, tributo de Spirit, BEWD, Synchro Spirit Dragon y Synchro de Azure-Eyes en duelo | La restricción Dragon depende de Spirit controlado boca arriba con efectos activos, también cuando su llegada actual procede de Reborn. Spirit Dragon tributa para Azure-Eyes/Spark; Azure aplica protección obligatoria y revive un Normal en Standby propia; Reborn de Azure exige historial apropiado y contexto de duelo. La resurrección admitida de Spirit with Eyes of Blue conserva su historial Link y no repite su búsqueda. Spark aplica una protección compartida de una destrucción por batalla o efecto hasta fin de turno; no evita daño, sobrevive a la salida de Spark y se reinicia al abandonar el objetivo su instancia de campo. Spirit Dragon niega activaciones GY registradas sin destruir la fuente |
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
| Mechaba | Envía de mano el tipo correspondiente: monstruo para un efecto individual registrado en campo, mano o GY; Mágica para las activaciones de Invocation, Branded Fusion, Vessel, Monster Reborn y las dos Mágicas de Campo registradas, o Trampa admitida para las activaciones directas de Impermanence o Compulsory Evacuation Device. Niega la activación y destierra la fuente solo si permanece en su lugar de activación registrado. Incluye Crow/Droll desde mano. No cubre efectos GY de Mágicas/Trampas, otras Mágicas de Campo, activaciones generales de Trampas ni el paquete conjunto Chixiao/Mo Ye |
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

## Continuaciones hipotéticas después de barajar · revisión 14

La partida normal conserva su regla de no robar con orden desconocido. Un análisis separado puede estudiar **un próximo robo de turno propio** en Draw Phase, en un turno posterior al primero, con rival `PASS`, sin una cadena o disparos pendientes. La fuente debe reconstruirse desde el inicio y el prefijo de acciones registrado; cambiar manualmente una bandera o presentar un estado sin ese origen no acredita el análisis.

Se crea una rama por copia física restante, con peso exacto `1/N` bajo el supuesto de barajado uniforme. Cada rama identifica una carta hipotética, la mueve en una copia del estado y conserva desconocido el orden del Deck restante. El laboratorio no recibe esa carta ni cambia su partida. Las decisiones posteriores pertenecen a los efectos y ventanas registrados; no se añade prioridad general, respuesta rival óptima ni una elección del robo favorable.

Solo los objetivos con un testigo reproducido aportan masa al límite inferior del objetivo. Los casos no explorados o sin demostración conservan masa desconocida, incluidos los presupuestos alcanzados, reglas fuera de alcance y próximos robos no cubiertos. No se clasifican como derrota. Si el objetivo se cumple al robo supuesto, puede no haber acciones posteriores, pero la hipótesis sigue siendo explícita. La suma de ramas y la parte desconocida se conservan con pesos racionales; el intervalo se refiere al objetivo condicionado a ese modelo, no a probabilidad de victoria.

El informe se exporta e importa con su fuente, objetivo, límites y evidencia. Su verificador separado reconstruye el prefijo, la hipótesis y cada continuación y rechaza cambios de UID, peso, contexto, pagos, estados o resumen. No basta con importar `replay.pass` ni con editar un porcentaje. Este replay acredita una continuación **bajo el robo supuesto**; no demuestra que ese robo se haya observado ni sustituye el replay de la partida real.

La ampliación no cubre robos de Mo Ye con orden desconocido, cadenas con varios robos, varios eventos sucesivos de azar o políticas rivales distintas. Esas situaciones requieren modelos y aceptación propios. El ejemplo `shuffle` alcanza manualmente el estado elegible y conserva el significado de campo inicial declarado.

El informe de calidad de datos distingue coincidencias técnicas, incidencias y propuestas sin aplicar migraciones. Las comprobaciones móviles describen emulación, accesibilidad y tareas sobre el HTML, sin certificar dispositivos físicos.

## Aceptación local de la revisión 14

La revisión 14 pasó **60/60 grupos de pruebas en una ejecución completa** sobre el HTML final, con **117 archivos JavaScript** comprobados. Chromium, Firefox y WebKit aprobaron sus tareas; Firefox completó la apertura directa del HTML local sin conexión. Las tareas móviles se ejecutaron en Chromium y WebKit emulados, sin acreditar teléfonos físicos ni conformidad WCAG completa. Build `20eb64b21d09ad48a1ad0f1eae39864302fd2aa96bd5d37bed83a40aeffbebbf`; SHA-256 `28e03daf44c632ad8edb358e9f216b745b332cc18643eca2e1f188213b15974d`; tamaño **7,037,392 bytes**. Estos resultados se limitan a las capacidades y tareas registradas; la puntuación competitiva sigue provisional.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 14 se comprueban por separado y se registran con el commit correspondiente.

La revisión 13 conserva una [aceptación local de 56/56 grupos](https://github.com/socramgns/MODERN/blob/508e1e9b1ea7707b9e4167e663bb98feb33c4614/evidence/validation-summary.json): 55/56 en la ejecución completa y 14/14 tareas al repetir el único grupo fallido después de corregir una espera de la prueba YDK, sobre los mismos bytes. Su [descarga HTTP verificada](https://github.com/socramgns/MODERN/raw/508e1e9b1ea7707b9e4167e663bb98feb33c4614/Analizador_YuGiOh.html?download=1) corresponde al commit `508e1e9b1ea7707b9e4167e663bb98feb33c4614` y al SHA-256 `5f05c079f9a512c04e3d7978864461746e4bcb8d9cf0589440579663e6dceecb`. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40936973430) terminó correctamente para ese commit. Esa evidencia pertenece a revisión 13 y no sustituye la aceptación de los bytes nuevos.


## Monster Reborn y revisión de identidades · revisión 15

`ACTIVATE_MONSTER_REBORN` (83764718) es la cuarta activación registrada de Mágica Normal: `NORMAL_SPELL`/`SINGLE`/`NONE`, Velocidad 1, desde mano en Main Phase 1 o 2 propia. La fuente se prepara físicamente antes de las respuestas. El paquete fija un UID objetivo de cualquiera de los dos GY, una zona principal propia libre entre 0 y 4 y posición de ataque o defensa; los Link solo admiten ataque. No usa la Extra Monster Zone para revivir desde GY.

El subconjunto de Main incluye Normales con datos técnicos y estadísticas conocidos y perfiles de efecto revisados: Ash, Veiler, Crow, Droll, Aleister, Mo Ye, Longyuan, Sage, Ancients, Ashuna, Adhara, Vishuda, Shthana, Gazelle y Spinny. Los disparos de Mo Ye y Gazelle al ser Invocados Especialmente se incorporan como pendientes; no se omiten sus oportunidades para admitirlos. Los procedimientos y disparos no revisados, como la fusión de Albaz al ser Invocado, permanecen excluidos. No se admiten Tokens, Xyz ni Pendulum.

Los perfiles Extra admitidos son Artemis, Mechaba, Chixiao, Chengying, Lubellion, Mirrorjade, Blue-Eyes Spirit Dragon, Stardust Spark Dragon, Azure-Eyes Silver Dragon, Spirit with Eyes of Blue, Monk, Shaman, Berserker y Balelynx. Requieren tanto la marca de Invocación apropiada como el tipo de procedimiento correspondiente ejecutado por el motor. Para este paquete de Reborn, una colocación inicial que declare `properlySummoned` no acredita ese procedimiento. Esta comprobación nueva no convierte los contratos de resurrección anteriores en una certificación global de historia de invocación. En revisión 15, Spark figuraba entre los perfiles revisados sin un procedimiento Synchro apropiado registrado. La revisión 16 añade ese procedimiento para el subconjunto descrito más abajo; declararlo inicialmente en el campo sigue sin acreditar por sí solo una historia apropiada. Hasta revisión 16, Azure-Eyes, Sunlight Wolf y Spirit with Eyes of Blue quedaban fuera de los objetivos de este paquete. La revisión 17 habilita Azure en el contexto de duelo y con historial apropiado y protección obligatoria registrados. La revisión 18 habilita Spirit with Eyes of Blue con historia Link apropiada y la restricción continua descrita más abajo; Sunlight Wolf conserva su exclusión por geometría de flechas revivido no registrada.

La resurrección conserva UID, propietario e historial apropiado de la copia, pero registra la invocación actual como Special Summon y cambia el control al jugador que activó Reborn. Las salidas por batalla, materiales o devolución llevan la copia a la zona de su propietario; el controlador temporal no se convierte en propietario. La agrupación de resultados distingue propietarios por zona. Revivir Mirrorjade no lo convierte en Invocado por Fusión y no crea por esa condición una destrucción diferida al abandonar el campo. Una devolución posterior a mano o Extra oculto retira la cualificación utilizable para otra resurrección. El replay reconstruye los procedimientos y las salidas desde la fuente; no acepta una bandera importada como prueba independiente.

Las restricciones se aplican por su alcance: Wyrm de Ashuna y Dragon de Spirit with Eyes of Blue afectan las Invocaciones Especiales pertinentes; una restricción que solo limita invocaciones desde el Extra no prohíbe por sí sola revivir un Synchro desde GY. Los bloqueos de nombre de Wolf y los perfiles continuos admitidos conservan sus condiciones. La limitación de Spirit Dragon contra invocar dos o más monstruos simultáneamente no convierte esta resurrección individual en una invocación múltiple.

Mechaba puede responder enviando una Mágica física admitida de su mano; Roar conserva sus respuestas y contrarrespuestas acotadas. Los pagos y usos permanecen aunque se niegue una activación o efecto. Una columna ya negada puede impedir el efecto sin devolver su fuente a la mano. La fuente termina en su destino registrado según la resolución; no existe un límite por turno ficticio de Reborn. Sí se conserva el límite impreso de una Invocación Especial de Artemis por turno: invocarla por Link y revivirla ese mismo turno no está permitido. La activación ordinaria de esta Mágica no abre por sí misma una respuesta de Ash ni una negación de activación GY de Spirit Dragon.

El ejemplo `reborn`, decimoquinto, parte de GY y campo declarados para aislar respuestas y propiedad: los Normales del Main no requieren probar una invocación previa apropiada. Compara Reborn con respuesta Mechaba y contrarrespuesta Roar, la negación sin Roar y revivir Blue-Eyes rival para devolverlo después con Compulsory a la mano de su propietario. Las rutas de aceptación de Extra parten de procedimientos reales y salidas al GY, separados de este ejemplo inicial.

`YGODeckIdentityReview` prepara una copia de baraja a partir de las propuestas vigentes de `YGODataQuality`. Solo admite elecciones explícitas entre candidatos de propuestas presentes; conservar el passcode actual es la opción inicial. Comprueba que la sustitución corresponde a la zona y conserva las cantidades por zona, combinando las filas que convergen en una identidad sin descartar copias. Conserva formato, contexto y Skills. Recalcula incidencias de construcción en la copia, que no adquiere por ello una certificación de legalidad.

La fuente, elecciones, cambios y diagnóstico quedan ligados al build, catálogo y estado de baraja/contexto. Cambiar el origen invalida el resultado pendiente; refrescar un origen idéntico conserva sus elecciones. El verificador recalcula la copia y su informe y rechaza cambios de cantidades, propuestas, origen o resumen. La exportación es compatible con el importador de barajas, pero prepararla o descargarla no sustituye la baraja activa, el catálogo ni la partida del laboratorio. Las evidencias documentales específicas del passcode modificado no se trasladan al candidato como si lo certificaran.

### Aceptación de la revisión 15

La revisión 15 pasó **63/63 grupos de pruebas en una ejecución completa** sobre el HTML final, con **119 archivos JavaScript** comprobados. Chromium, Firefox y WebKit aprobaron sus tareas; Firefox completó la apertura directa del HTML local sin conexión. Las tareas móviles se ejecutaron en Chromium y WebKit emulados, sin acreditar teléfonos físicos ni conformidad WCAG completa. Build `c4b3a88282d993fd538a0ecc5c80b62f99239bfbbfeb0fd47bdbfc70816388ed`; SHA-256 `2a4e2c76869e9fdfce9435152fd2c0b654180a0a71c1e0c082b08555c263b804`; tamaño **7,075,902 bytes**. Estos resultados se limitan a las capacidades y tareas registradas; la puntuación competitiva sigue provisional.

Las suites de fuentes y del HTML final acreditan solo los perfiles y tareas ejecutados. La puntuación competitiva permanece provisional y la aceptación móvil sigue describiendo emulación, sin acreditar hardware físico ni conformidad WCAG completa. La publicación, descarga y CI se observan por separado para el commit correspondiente.


## Synchro ejecutada de Stardust Spark Dragon · revisión 16

`SYNCHRO_STARDUST_SPARK_DRAGON` (83994433) registra el procedimiento para un Tuner y uno o más no Tuner admitidos, boca arriba, con identidades físicas distintas y nivel total 8. Los materiales deben estar en las zonas de monstruo controladas por el actor admitido; no se toman cartas de mano o Cementerio como materiales de este procedimiento. `materialUids` contiene el Tuner seguido de uno o más no Tuner; `destination` se limita a una zona principal propia 0–4 y `position` a `ATTACK` o `DEFENSE`. La zona se valida tras retirar materiales y no necesita una flecha Link; este paquete no enumera un destino en la Extra Monster Zone.

El subconjunto de materiales comprende Normales del Main con procedencia técnica, estadísticas y nivel conocidos (también Tuners Normales), los quince perfiles Main de efecto revisados por Reborn y Tokens Tuner de Swordsoul realmente generados y vivos en el registro. Los perfiles de efecto son Ash, Veiler, Crow, Droll, Aleister, Mo Ye, Longyuan, Sage, Ancients, Ashuna, Adhara, Vishuda, Shthana, Gazelle y Spinny. No se admiten materiales colocados, Pendulum, Xyz, Link, niveles modificados ni equipos o materiales adjuntos. Mo Ye y Longyuan conservan sus pendientes existentes si se envían al GY y el propietario admitido es el jugador 0; se excluyen los casos de propietario rival o desvío incompatibles con ese disparo. Spinny puede conservar su desvío a destierro ya revisado. Los Tokens cesan al salir; no se inventa una copia en GY.

La invocación registra una Synchro real y su cualificación apropiada. El estado inicial del ejemplo puede declarar la presencia de sus materiales, pero no declara una historia de Spark que sustituya el procedimiento. Sus salidas, destinos de materiales y pendientes revisados deben ejecutarse; los materiales o consecuencias desconocidos quedan excluidos. Una restricción Fusion-only de Branded impide esta Synchro desde el Extra; el bloqueo Wyrm-only de Ashuna impide invocar a Spark, de tipo Dragon. Una restricción viva a Dragon lo permite, y la restricción Synchro de un Token no prohíbe este procedimiento. Los bloqueos de nombre conservan su alcance. Al llegar a la zona apuntada revisada de un Sunlight Wolf vivo en su EMZ, su disparo no se omite.

La llegada desde el Extra no es una activación de Mágica ni de un efecto de monstruo. El paquete no inventa respuestas de Ash, Mechaba o Roar al procedimiento Synchro. Los efectos que ocurran después de la invocación o al enviar materiales conservan su registro y respuestas propias; esto no añade prioridad general ni negación de invocaciones sin un paquete registrado.

Después de una salida real de Spark al GY, Monster Reborn puede reconocer `properSummonType: 'SYNCHRO'`. Revivir conserva el historial apropiado, UID y propietario, pero la invocación actual es `SPECIAL`. El escudo de una presencia anterior no se recupera. `STARDUST_SPARK_PROTECTION` puede activarse sobre un objetivo propio boca arriba elegible con los usos, negaciones y respuestas ya registrados.

El bloqueo de Shaman distingue el origen de la presencia actual mediante `summonOriginZone`, sin confundirlo con el historial apropiado. Spark llegado desde el Extra sigue sujeto al bloqueo de activaciones de campo de monstruos no Tenyi invocados desde allí; después de revivir desde GY, su entrada actual es `gy` y ese bloqueo no se aplica por su tipo impreso de Synchro. El origen de campos iniciales queda `DECLARED_UNKNOWN` y conserva el criterio conservador. Al salir del campo se retira el marcador de esa presencia. Esta precisión no habilita contratos nuevos de activación de monstruos Extra en GY o destierro.

El escudo conserva un cargo compartido por destrucción de batalla y efecto hasta terminar ese turno. No anula daño de batalla ni una devolución. Si se activa antes de pasar al turno siguiente, caduca antes de una batalla posterior; la guía no debe presentarlo como protección permanente. Los retornos a zonas ocultas pertinentes borran cualificación y las salidas del objetivo retiran su protección de esa presencia.

El ejemplo decimosexto `synchro` conserva los quince anteriores y conecta Normal Summon de Flamvell Guard, Synchro con Dark Magician de nivel 7, salida de Spark al GY por batalla, Reborn en Main 2 y protección con replay. La protección de batalla se activa después del cambio al turno rival y de su robo conocido. El primer ataque de Blue-Eyes consume el cargo y el segundo puede destruir a Spark; ambos conservan su daño. La guía prevista consta de quince acciones y los LP pasan de 8000 a 7500, 7000 y 6500; la aceptación requiere ejecutar y comprobar esa secuencia. El historial declarado del campo inicial y las transiciones ejecutadas se presentan con sus alcances distintos. Las nuevas tareas de fuentes y del mismo HTML compilado verifican la ruta; exportar un informe no sustituye esa comprobación.

### Aceptación de la revisión 16

La aceptación de la revisión 16 se apoya en la ejecución remota del commit `329f1ba15e960a949ceecc971005eee0fb622e03`: el [workflow de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/41889817768) completó con éxito las etapas obligatorias de instalación de los tres motores, compilación y comparación del HTML, batería de **65 grupos** y comprobación entre motores. El recuento corresponde al runner versionado y sus salidas obligatorias; los informes remotos individuales no se descargaron. Las fuentes incluyen **120 archivos JavaScript**. La ejecución local completa conserva su resultado **63/65 grupos aprobados**, con Firefox y WebKit no disponibles; su informe original permanece con `pass: false`, sin conciliación ni conversión a éxito. Build `d49d56207cfff495f8a356974dc554fd77c063b9a9022da8ed041d26e1a1171e`; SHA-256 `fab64088c402372a2cf8d3c8c997bdf13612c11701640bb8172694fcf00aa0cc`; tamaño **7,089,078 bytes**. La puntuación competitiva sigue provisional; no se acreditan todas las reglas, dispositivos físicos ni conformidad WCAG completa.

La aceptación se limita al procedimiento y perfiles registrados. La publicación, descarga HTTP y CI se observan para el commit concreto, por separado de las pruebas locales. Permanecen pendientes prioridad y cadenas generales, SEGOC, Damage Step, Flip, ataques múltiples, Xyz, Pendulum y los demás perfiles no registrados.


## Azure-Eyes: procedimiento, Reborn y protección · revisión 17

`SYNCHRO_AZURE_EYES_SILVER_DRAGON` (40908371) registra una Synchro de nivel 9 con exactamente un Tuner y uno o más **no Tuner Normales** del Main admitidos. No basta sumar niveles con Mo Ye, Longyuan u otro no Tuner de efecto. Las copias son físicas, distintas y boca arriba, bajo el control del actor registrado, con niveles impresos conocidos. Los materiales de mano o GY, cartas colocadas, Extra, Ritual, Pendulum, niveles modificados, equipos y consecuencias no revisadas conservan su exclusión. Un Token Tuner sólo se admite si procede realmente del registro Swordsoul vivo y su perfil está habilitado; cesa al salir, sin inventar una carta en GY.

La API es `{sourceUid, materialUids, destination, position}`: `destination` enumera zonas principales propias 0–4 y `position` es `ATTACK` o `DEFENSE`. El espacio se comprueba después de retirar los materiales; este procedimiento no exige flechas Link ni ofrece EMZ. Conserva propietario, destinos y pendientes revisados. Branded Fusion-only prohíbe la Synchro desde el Extra; Ashuna Wyrm-only prohíbe Azure de tipo Dragon. Los bloqueos de Dragon, Synchro y nombre mantienen sus alcances respectivos. Una llegada a la zona apuntada revisada de un Sunlight Wolf vivo y elegible se excluye mientras no esté registrada la cadena de disparos simultáneos con la protección obligatoria de Azure; no se omite el disparo de Wolf para admitir la invocación. El procedimiento no es una activación de efecto y no abre por sí solo respuestas de Ash, Mechaba, Spirit o Roar.

Esta ampliación es explícita de duelo TCG. Azure no se ofrece como objetivo nuevo de Reborn ni como procedimiento nuevo fuera de `context.duelMode === true`, porque la protección obligatoria debe disponer de una continuación registrada. La Synchro ejecutada registra una cualificación apropiada. Una preparación inicial o una llegada por el efecto de Spirit Dragon no la sustituyen. Si la misma copia llega después al GY, Monster Reborn puede revivirla, conservando UID, propietario e historial; la invocación actual es Especial desde GY, sin convertirse en una Synchro nueva.

El helper `YGOBlueEyesDuel.queueAzureProtection(state, player, uid)` centraliza el pendiente después de las llegadas admitidas. Spirit Dragon, la nueva Synchro y Monster Reborn comparten el encolado de la protección obligatoria después de su Invocación Especial real admitida de Azure. No se inventa un disparo al montar un campo inicial ni un límite por turno para esta protección, y se evita duplicar el mismo pendiente. Una resolución negada que no invoca no crea una protección como si hubiera ocurrido la llegada. El pendiente, sus negaciones y las respuestas físicas registradas conservan su trazabilidad; esta integración no certifica prioridad ni cadenas generales.

`AZURE_EYES_PROTECTION` protege a los Dragones controlados al resolver contra selección y destrucción por efectos hasta el final del siguiente turno. Es un conjunto capturado en esa resolución, no una inmunidad continua para futuras llegadas. La salida de Azure no elimina el efecto ya resuelto sobre otros Dragones; salir y volver crea una presencia nueva y no recupera la protección anterior. No evita destrucción por batalla, daño ni salidas no cubiertas por su perfil. Se conserva la separación entre historial apropiado y `summonOriginZone`, incluido el alcance de Shaman.

`AZURE_EYES_STANDBY_REVIVE` conserva su ventana en la Standby propia y el uso de esa presencia, con un Normal Main de GY técnicamente conocido y espacio propio. Una carta invocada posteriormente no recibe automáticamente una protección anterior. Se excluyen Tokens, cartas del Extra, Ritual, Pendulum y consecuencias no revisadas. Si su llegada automática cae en la zona apuntada por Wolf y activaría su efecto, esa combinación queda fuera del perfil porque su recuperación no tiene una ventana Standby registrada.

El helper compartido de protección distingue una activación prohibida por Shaman de una negación de efectos: en el primer caso registra la prohibición y no crea un pendiente obligatorio sin resolución; después de Reborn, el origen actual GY conserva su propio alcance. La negación de efectos puede dejar una activación cuya resolución se niega.

El préstamo de Spirit hacia Azure o Spark y la resurrección de Azure en Standby exigen cobertura de los campos boca arriba de ambos jugadores. Monstruos o Mágicas/Trampas continuas sin perfil revisado bloquean esas operaciones; no se ignora una prohibición de invocar ni una consecuencia de la llegada.

El ejemplo decimoséptimo `azure` conserva los dieciséis anteriores. Parte de un Blue-Eyes y campo inicial declarados y ejecuta Guard Normal → Synchro de Azure → protección → batalla con 500 de daño y Azure al GY → Reborn → protección → fases y robos conocidos → resurrección de Blue-Eyes en la Standby propia del turno 4. El historial real pertenece a esas transiciones ejecutadas. El objetivo requiere ambas cartas, Standby, turno 4 y jugador activo propio; el replay vuelve a comprobar la ruta.

### Aceptación de la revisión 17

La aceptación de la revisión 17 se apoya en la ejecución remota del commit `b77b4ddd61885f8ed6e49df231ed305ad70d5b11`: el [workflow de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/42084234037) completó con éxito las etapas obligatorias de instalación de los tres motores, compilación y comparación del HTML, batería de **67 grupos** y comprobación entre motores. El recuento corresponde al runner versionado y sus salidas obligatorias; los informes remotos individuales no se descargaron. Las fuentes incluyen **121 archivos JavaScript**. La ejecución local completa conserva su resultado **65/67 grupos aprobados**, con Firefox y WebKit no disponibles; su informe original permanece con `pass: false`, sin conciliación ni conversión a éxito. Build `44adab61fe289978ed72e0ab2a116f521387641584ecb77a4a9e097ecc194ae1`; SHA-256 `41c301b7ec88125cf6403756a69406873fbfebce9fc96d90ef4739af20633312`; tamaño **7,107,206 bytes**. La puntuación competitiva sigue provisional; no se acreditan todas las reglas, dispositivos físicos ni conformidad WCAG completa.

La aceptación se limita a los perfiles y tareas ejecutados. Los informes distinguen fuentes, HTML compilado, emulación móvil y comprobaciones remotas; las ausencias locales no se convierten en éxito. Cada ampliación cerrada se publica como un HTML actualizado sin comprimir y conserva la entrega anterior.

## Spirit with Eyes of Blue y restricción continua · revisión 18

Monster Reborn admite Spirit with Eyes of Blue (42097666) cuando la misma copia tiene una cualificación Link apropiada obtenida por un procedimiento registrado y llegó después al GY. El contrato de `ACTIVATE_MONSTER_REBORN` conserva `sourceUid`, `targetUid`, `destination` de zona principal propia 0–4 y `position: 'ATTACK'` para este Link. Conserva UID, propietario y `properSummonType: 'LINK'`, pero la llegada actual es `summonType: 'SPECIAL'` desde GY. No se crea una Invocación Link adicional ni su búsqueda de Mausoleum. El tributo usa su presupuesto por nombre y turno existente: salir y revivir no restaura un uso gastado.

La restricción continua de Spirit se determina por la presencia viva bajo el controlador actual: boca arriba y con efectos activos. Se comprueba antes del intento de Invocación Especial de cada perfil registrado pertinente, incluidos Tokens y procedimientos con materiales. Comprobar sólo el campo final sería insuficiente cuando Spirit se usa como material; un intento prohibido no puede legitimarse retirando su propia fuente. Las Invocaciones Normales conservan su alcance independiente. La negación pertinente suspende la restricción mientras dure; la salida retira la presencia y el restablecimiento de efectos exige volver a comprobarla. Un lock antiguo no sustituye esos datos actuales.

La integración permanece cerrada sobre las acciones registradas. No añade reglas para toda condición de invocación, prioridad, cambios de control o negaciones del juego. Se conserva la diferencia entre propietario de una copia y controlador en campo. Los escenarios iniciales declaran sus supuestos; los casos diagnósticos modificados para rechazos o propiedad se identifican como tales y no acreditan una historia legal que no haya sido ejecutada.

El ejemplo decimoctavo `spirit-reborn` parte de Flamvell Guard, Monster Reborn y Blue-Eyes White Dragon en mano. Ejecuta Guard Normal → Link Spirit → búsqueda de Mausoleum → tributo de Spirit para Blue-Eyes desde mano → Reborn del mismo Spirit en una zona principal. El objetivo combina Spirit, Blue-Eyes y Mausoleum, y el replay reconstruye las cinco acciones. Longyuan y Adhara permiten observar que la restricción de Spirit cambia la disponibilidad de la Invocación Especial de Longyuan antes de Link, tras el tributo y después de Reborn. Los diecisiete ejemplos anteriores conservan sus identificadores.

`tests/spirit_revival.cjs` comprueba las reglas desde fuentes y `tests/release18_browser.py` comprueba el HTML compilado mediante la aplicación real. La aceptación debe identificar el build, los bytes y el entorno, sin transformar las ausencias locales de motores en aprobaciones. Albaz y Sunlight Wolf conservan sus exclusiones pertinentes de Reborn; la revisión no añade su consecuencia de llegada o geometría de flechas.

### Aceptación de la revisión 18

La aceptación de la revisión 18 se apoya en la ejecución remota del commit `0807cd758ee30c3824330bcf59eb11f5d298df60`: el [workflow de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/42152616194) completó con éxito las etapas obligatorias de instalación de los tres motores, compilación y comparación del HTML, batería de **69 grupos** y comprobación entre motores. El recuento corresponde al runner versionado y sus salidas obligatorias; los informes remotos individuales no se descargaron. Las fuentes incluyen **121 archivos JavaScript**. La ejecución local completa conserva su resultado **67/69 grupos aprobados**, con Firefox y WebKit no disponibles; su informe original permanece con `pass: false`, sin conciliación ni conversión a éxito. Build `7b027eadfd3aa793f479a4225b6a52e3e96471d9a11276ed8ad7754f6c9f16ab`; SHA-256 `622328ee699c2a6407c5f20e724fe0f613bc6479858d4c2b4f222c86e8fdc9bb`; tamaño **7,114,591 bytes**. La puntuación competitiva sigue provisional; no se acreditan todas las reglas, dispositivos físicos ni conformidad WCAG completa.

El tributo de Spirit comprueba también las restricciones vigentes de Wyrm y de nombre antes de pagar, y en el HTML completo excluye campos continuos no revisados. Su llegada automática a la zona apuntada por un Wolf activo con recuperación disponible queda fuera del subconjunto hasta registrar ese disparo; no se omite silenciosamente. Una negación de Veiler/Imperm ya resuelta sigue negando el efecto activado en campo aunque Spirit salga como coste; una nueva respuesta que lo apunte después del tributo no se ofrece. Mechaba y Roar conservan sus costes y la negación de activación sin retirar de nuevo una fuente ya tributada.

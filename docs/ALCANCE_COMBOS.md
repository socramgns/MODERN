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
| Infinite Impermanence | Desde mano solo con campo propio vacío, o colocada en un turno anterior. Niega un monstruo admitido; desde colocada registra su columna y el bloqueo Mágica/Trampa. Las columnas de ambos jugadores se relacionan por su posición física |
| Chixiao | Destierra una carta Swordsoul/Wyrm real de mano/GY, niega el monstruo elegible y comparte presupuesto con su búsqueda |
| Mechaba | Envía de mano el tipo correspondiente: monstruo para una activación individual de efecto de monstruo en campo o Mágica para las activaciones registradas de Invocation, Branded Fusion y Vessel. Niega activación y destierra la fuente cuando corresponde. No niega efectos GY de Mágicas/Trampas; las activaciones de Field Spells, Trampas y el paquete conjunto Chixiao/Mo Ye permanecen fuera del registro |
| Spirit Dragon | Responde a paquetes individuales de efectos GY registrados, capturando la zona antes de costes. Niega la activación sin seleccionar objetivo ni destruir la fuente; conserva costes pagados y distingue restricciones por uso y por activación. No necesita historial Synchro para esta negación |
| D.D. Crow | Descarte físico y destierro de una carta del GY rival con perfil de salida revisado |
| Droll | Ventana tras búsqueda o robo por efecto registrado, coste desde mano y bloqueo de añadir del Deck a la mano para ambos jugadores durante el turno. El robo ordinario de Draw Phase no abre esa ventana |
| Mirrorjade | Envía Fusion admitido del Extra como coste, elige al resolver sin seleccionar objetivo al activar, destierra y aplica su restricción hasta el turno siguiente. Una salida elegible por el rival puede programar la destrucción End Phase |

Los costes se pagan aunque la resolución quede negada cuando así lo exige el efecto. Negar Mo Ye no crea Token, pero conserva revelación y uso; negar Lubellion no devuelve el descarte. Los paquetes que no declaran un contrato de cadena admiten una respuesta registrada. Mechaba y Roar declaran paquetes que permiten hasta tres contrarrespuestas Roar con velocidad, alternancia de jugadores y resolución LIFO verificadas. La prioridad arbitraria, SEGOC y todas las cadenas posibles siguen fuera del alcance.

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

Los objetivos admiten cartas en campo/mano, cantidades, LP, fase, turno y jugador activo. Las métricas describen recursos observados: mano, zonas, ATK conocido, materiales, descartes, tributos y restricciones. Una capacidad condicional de negar no se contabiliza como una negación ya ejecutada; opciones que comparten uso no se suman como independientes.

La interfaz compara PASS y Ash/Veiler/Imperm que existan en la mano rival y Spirit Dragon cuando una copia elegible está en el campo. La comparación parte del mismo campo físico inicial guardado y conserva sus políticas. `examples/Escenario_Respuestas_TCG.json` contiene mano e inventario físicos para las cuatro políticas. Cada escenario conserva exactamente la misma mano propia, orden restante, inventario y campo rival; solo cambia la política de respuesta. Todas las líneas aceptadas se reproducen de nuevo. Los recursos y el Pareto se comparan cuando hay cobertura y dominio final compatibles; si falta evidencia queda desconocida. Los resultados observados no son una garantía contra todas las decisiones rivales ni una tasa de victoria.

El acceso hipergeométrico a una carta/rol mide un evento de mano. El muestreo causal solo cuenta éxito cuando el objetivo se alcanza y pasa replay nuevo. Una búsqueda incompleta o fuera de alcance permanece **desconocida**, sin convertirse en derrota ni mano injugable. El muestreo no atribuye probabilidades a un campo propio inicial declarado.

## Límites de búsqueda y tareas pendientes

La búsqueda tiene límites de profundidad, estados, tiempo y turnos, y devuelve hasta cinco resultados distintos de los observados. Agotar acciones registradas no agota todas las acciones legales de Yu-Gi-Oh. La identidad de estado conserva información que afecta a continuaciones, como zonas/columnas, protección, historial y efectos diferidos; copias equivalentes no multiplican artificialmente resultados.

Quedan por ampliar cartas, disparos, cadenas, prioridad, Damage Step, decisiones adversariales, mecánicas y reglas de otros formatos. Los pools digitales/históricos, desbloqueos, Skills e impresión/evento requieren datos propios. El editor de formatos ya transporta Skills y Fusion Deck histórico; eso no certifica sus efectos ni disponibilidad. Las fuentes oficiales siguen pendientes por el bloqueo HTTP 403 documentado en [FUENTES_OFICIALES.md](FUENTES_OFICIALES.md).

La puntuación competitiva permanece provisional por decisión del usuario. El importador está preparado; requiere barajas y resultados reales con formato, lista, fechas y procedencia para calibrar y validar por separado.

## Verificación reproducible

Desde la raíz del proyecto:

```sh
python3 tests/run_all.py
```

El runner compila y agrupa las suites registradas en `tests/run_all.py`, incluidas núcleo, familias, fases, respuestas, recomendaciones, formatos, documentos y navegador. El resultado de la ejecución está en `dist/validation-summary.json`; el detalle, en `tests/*-results.json` y logs. Los informes de entrega identifican el build y hash del HTML probado. `--source-inject` en pruebas de desarrollo no constituye evidencia de los bytes del entregable.

Chromium usa los bytes construidos. Firefox/WebKit siguen pendientes: la descarga de Firefox devolvió HTTP 403 y WebKit no está instalado. La política administrada bloquea `file:`; el arranque sin Internet se comprueba suministrando esos mismos bytes localmente con la red deshabilitada. Abrir directamente el archivo requiere validación externa donde se permita esa navegación.

La protección Spark registrada no admite acumular dos protecciones aún sin consumir sobre el mismo objetivo ni modela la prioridad general del Damage Step. La negación GY de Spirit se limita a handlers registrados explícitamente; el descarte de Ash, Crow o Droll desde la mano no cambia el origen de su activación a GY.

## Diagnóstico y ejemplos incorporados

El diagnóstico por carta contrasta un registro explícito de acciones parciales con los handlers y proveedores realmente presentes en la compilación. Distingue datos técnicos, uso básico acotado de Normales y efectos registrados. No presenta reconocer una carta como haber implementado todos sus efectos. El informe incluye build, catálogo y contexto; su aplicabilidad causal se limita al formato registrado.

Los ejemplos Invoked, Spark y Spirit se incluyen en el HTML. Cargarlos sustituye la baraja actual y prepara las copias físicas y el campo declarado; no ejecuta jugadas automáticamente ni certifica la historia anterior. Se usan como demostraciones técnicas, sin etiquetas ni resultados competitivos.


## Ampliaciones de la revisión 6

Los 14.759 registros de la fuente técnica principal fijada están representados en un catálogo de 21.986 entradas que conserva las anteriores. La actualización no modifica identidades heredadas por coincidencias de nombre.

Las ventanas registradas admiten acciones rápidas fuera de Main cuando corresponde y las acciones de familia propias en Main 2. Veiler mantiene su ventana de Main rival. Los handlers que usan explícitamente el inventario propio no se reflejan automáticamente al rival.

Gazelle incorpora un disparo de mano tras un envío Salamangreat elegible; Balelynx puede reemplazar destrucción con una copia física del GY; Shthana incorpora su oportunidad de resurrección y destrucción admitida; Roar niega activaciones registradas y participa en las cadenas acotadas. Las restricciones de turno, costes y destinos se verifican por acción.

El laboratorio mantiene JSON avanzado y añade formularios de objetivos, selección de copias físicas, zonas y columnas, nombres legibles, búsqueda y paginación. Las colocaciones iniciales siguen declaradas, sin certificar su historia anterior.

El panel de probabilidades del próximo robo calcula distribuciones exactas por identidad sobre las copias restantes. Con orden desconocido supone un barajado uniforme: no revela la siguiente carta, no cambia el mazo y no certifica una continuación. La búsqueda informa separadamente los horizontes de profundidad/turnos y los presupuestos alcanzados.

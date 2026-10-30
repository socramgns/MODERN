# Analizador de barajas Yu-Gi-Oh · revisión 14

El entregable publicado se llama `Analizador_YuGiOh.html`; se construye como `dist/Calculadora_de_Barajas_YuGiOh_Alpha_1263_Corregida.html`. Después de compilar, comprobar y publicar la revisión, esas copias deben ser idénticas. Abre el HTML en un navegador reciente. El catálogo y los motores están incorporados al HTML; las imágenes y las actualizaciones remotas necesitan Internet. El entregable es autónomo. En este entorno Chromium bloquea la navegación `file:` por política administrativa. Firefox permite comprobar directamente el HTML sin conexión; WebKit y los otros motores conservan sus resultados y límites específicos en los informes.

La puntuación es **estructural y provisional** por decisión del usuario. No representa una tasa de victoria ni un tier de torneo. TCG es el alcance principal; los otros perfiles mantienen advertencias sobre mecánicas, disponibilidad o listas que requieren revisión.

La revisión 14 pasó **60/60 grupos de pruebas en una ejecución completa** sobre el HTML final, con **117 archivos JavaScript** comprobados. Chromium, Firefox y WebKit aprobaron sus tareas; Firefox completó la apertura directa del HTML local sin conexión. Las tareas móviles se ejecutaron en Chromium y WebKit emulados, sin acreditar teléfonos físicos ni conformidad WCAG completa. Build `20eb64b21d09ad48a1ad0f1eae39864302fd2aa96bd5d37bed83a40aeffbebbf`; SHA-256 `28e03daf44c632ad8edb358e9f216b745b332cc18643eca2e1f188213b15974d`; tamaño **7,037,392 bytes**. Estos resultados se limitan a las capacidades y tareas registradas; la puntuación competitiva sigue provisional.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 14 se comprueban por separado y se registran con el commit correspondiente.

La revisión 13 conserva una [aceptación local de 56/56 grupos](https://github.com/socramgns/MODERN/blob/508e1e9b1ea7707b9e4167e663bb98feb33c4614/evidence/validation-summary.json): 55/56 en la ejecución completa y 14/14 tareas al repetir el único grupo fallido después de corregir una espera de la prueba YDK, sobre los mismos bytes. Su [descarga HTTP verificada](https://github.com/socramgns/MODERN/raw/508e1e9b1ea7707b9e4167e663bb98feb33c4614/Analizador_YuGiOh.html?download=1) corresponde al commit `508e1e9b1ea7707b9e4167e663bb98feb33c4614` y al SHA-256 `5f05c079f9a512c04e3d7978864461746e4bcb8d9cf0589440579663e6dceecb`. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40936973430) terminó correctamente para ese commit. Esa evidencia pertenece a revisión 13 y no sustituye la aceptación de los bytes nuevos.

## Uso

1. En **Baraja y zonas por formato**, importa JSON o YDK. El editor, la composición, las probabilidades y las diez categorías comparten el estado de esa baraja. JSON conserva también contexto y Skills; YDK transporta Main, Extra y Side.
2. Revisa los avisos de construcción, familias de alias y datos pendientes del formato. Una baraja inválida se conserva para diagnóstico. La biblioteca de este panel guarda todas las zonas y su contexto por nombre y formato; guardar otra vez el mismo nombre y formato reemplaza esa entrada.
3. Después de editar, pulsa **CALCULAR**. La nota previa queda invalidada hasta recalcular.
4. En **EXPLORAR COMBOS TCG VERIFICABLES**, abre **Probar un ejemplo incluido** para cargar ejemplos incorporados sin Internet. La revisión 14 incluye catorce ejemplos: conserva los trece anteriores, incluido `evacuation`, y añade `shuffle`, que llega mediante pasos reales a un próximo robo de turno con orden desconocido. El ejemplo de Campo exige Sanctuary boca arriba además de Wolf en campo y Roar en mano. El ejemplo sustituye la baraja actual y prepara un campo técnico declarado; no es una recomendación competitiva. También puedes importar escenarios externos. En este panel, selecciona cinco cartas o muestrea una mano y su orden inicial con una semilla. Importa `examples/Arquetipo_*.json` o `examples/Expansion_*.json` para reproducir rutas de Invoked, Swordsoul, Branded, Blue-Eyes, Tenyi y Salamangreat. Los YDK equivalentes conservan las cantidades, pero no la mano ni el objetivo. Son fixtures técnicos, no recomendaciones competitivas.
5. Elige que el rival pasa o importa su mazo y mano completos para activar las respuestas físicas disponibles. `examples/Escenario_Ash_TCG.json` proporciona una Ash real. El panel muestra pasos, costes, campo, estados intermedios, replay nuevo y recursos; las búsquedas sin demostración permanecen desconocidas. Consulta [docs/ALCANCE_COMBOS.md](ALCANCE_COMBOS.md).
6. El panel **Acciones registradas de esta baraja** separa datos técnicos de las acciones parciales que el motor tiene registradas. Puedes filtrar zonas/cartas y exportar el diagnóstico. Una acción registrada no garantiza disponibilidad en una mano concreta ni cobertura completa de los efectos. En **Laboratorio de fases, campo rival y respuestas**, pulsa **Continuar la primera línea verificada** o inicia desde la mano/escenario. Ejecuta acciones registradas, pasa de fase y deshaz pasos. Puedes preparar un campo con copias que existan en los mazos cargados: su historia anterior queda declarada como supuesto; las acciones posteriores sí se vuelven a ejecutar.
7. En el mismo laboratorio, define un objetivo visual o JSON con monstruos boca arriba, Mágicas/Trampas boca arriba, Mágicas/Trampas colocadas, mano, LP, turno, fase o jugador activo. Consulta sus cantidades y condiciones cumplidas o pendientes; el seguimiento cambia al ejecutar, deshacer y aplicar otro objetivo. El tablero distingue las Mágicas/Trampas boca arriba, colocadas y de Campo. **Comparar PASS y respuestas disponibles** conserva la misma mano e inventario rival frente a PASS y las políticas Ash, Veiler e Impermanence presentes en esa mano. La comparación conserva también el campo físico inicial y sus políticas; incluye Spirit Dragon cuando está disponible en ese campo. Describe resultados observados y límites; no calcula una tasa de victoria ni la mejor decisión de un adversario.
8. El modo **Preparación inicial con replay verificable** y los escenarios específicos heredados siguen disponibles bajo sus requisitos. La búsqueda genérica experimental corre en un Worker cancelable; una traza sin evidencia suficiente no acredita un combo.
9. Exporta YDK, análisis JSON o PNG; PDF usa la impresión del navegador. Los escenarios y trazas del laboratorio se exportan en JSON; el informe del laboratorio puede reimportarse para reanudar sus pasos con la misma baraja y contexto, tras ejecutar de nuevo el replay. Los enlaces compactos conservan identidades, cantidades, Skills y contexto y se recalculan al abrirse; un enlace `file:` requiere que el destinatario disponga de la calculadora.
10. La sesión se restaura al abrir el mismo archivo/origen y perfil de navegador. No sincroniza dispositivos. Exporta una copia antes de borrar el almacenamiento local.
11. Desde un estado elegible del laboratorio, abre **Continuaciones hipotéticas después de barajar**. El análisis guarda una fuente verificada y sus ramas por copia; permite cancelar, exportar e importar sin ejecutar el robo supuesto en la partida. Consulta también **Calidad de los datos** para exportar incidencias y propuestas de revisión sin aplicar cambios de identidad.

## Datos y límites

- Se conservaron los 19.617 passcodes originales y se incorporaron 36 passcodes reales que resuelven los 35 nombres restringidos ausentes, además de 2.333 registros de la fuente principal fijada; el catálogo contiene 21.986 registros.
- Se completaron 21.888 desde cinco bases CDB de Project Ignis, fijadas al commit `ae5dedb957c2c48ab86554fee08a0fca73d8b1cf` y con SHA-256 registrado por fuente.
- Se conservaron nombres anteriores y se añadieron nombres canónicos y familias de alias. No se sustituyen identidades por aproximación textual.
- El catálogo revisado tiene 13.061 monstruos: 13.010 con estadísticas conocidas y 51 con estadísticas desconocidas. Los 98 registros heredados sin coincidencia se clasificaron: 37 unofficial, 21 Tokens/placeholders y 40 IDs provisionales de prerelease; cero pertenecen a una fuente estándar primaria sin coincidencia. Los 51 monstruos sin estadísticas están en esas categorías. Hay 32 propuestas de migración por nombre exacto, sin cambiar automáticamente sus passcodes.
- La procedencia CDB es evidencia técnica secundaria, no certificación oficial de rulings. La lista incluida se trata como un snapshot versionado; no se presume actualizada por abrir el archivo.
- `src/data/catalog-manifest.json` incluye fuentes, hashes, cambios de nombres, alias y resolución de los nombres restringidos del snapshot. El panel permite exportar incidencias. `dist/catalogue-audit.json` contiene su clasificación y propuestas. Una bandera heredada o una URL no autentica metadatos oficiales; `rulesCard()` recompone los datos del motor desde las filas CDB fijadas, aunque un renderizador cambie el objeto compartido.
- El acceso hipergeométrico a un rol no equivale a una mano jugable. Las métricas no medidas se muestran como desconocidas. El clasificador contextual sigue siendo provisional y permite examinar sus evidencias mediante exportación JSON.

## Formatos y documentos

`src/app/formats.js` aplica reglas de construcción diferenciadas: TCG/OCG, Master Duel, Duel Links Speed/Rush, Speed Duel, Rush, GOAT y Time Wizard. Las listas comparten fecha, versión, fuente y controles de integridad; un fallo de actualización conserva la última lista válida. Duel Links aplica presupuestos compartidos Limit 1/2/3. Legend requiere metadatos explícitos. Los pools digitales, los desbloqueos y Skills, la impresión/evento Speed Duel y la disponibilidad histórica requieren contexto externo. No se inventan esos datos.

El panel **Documentos de cartas y contexto del formato** permite importar/exportar contexto JSON y restablecer el incorporado. La sesión y los enlaces compartidos conservan ese contexto. La búsqueda causal está ligada a la tabla TCG incorporada; otro snapshot importado se señala y no se mezcla silenciosamente con ella. El panel **Baraja y zonas por formato** amplía la importación, edición, biblioteca y recuperación a las capacidades del formato y mantiene una zona independiente de Skills. El Fusion Deck GOAT admite más de 15 cartas; se aplica un tope técnico de transporte de 1000 copias, que no es una regla oficial. TCG conserva sus límites de construcción. Las identidades desconocidas se rechazan antes de sustituir la baraja. Seleccionar una Skill no verifica sus efectos de construcción, disponibilidad o desbloqueo. Se bloquea exportar por YDK una baraja con Skills para evitar perderlas; usa JSON.

Las plantillas documentales exigen contenido, SHA-256, campos, citas, fecha y revisor. La revisión coteja el documento aportado con el catálogo; no autentica por sí sola su origen ni verifica rulings. Los documentos dañados u obsoletos se conservan y se rechazan transaccionalmente. Los bloqueos HTTP 403 anteriores quedaron registrados. En revisión 6 se recuperó y cotejó una publicación oficial TCG del 19/10/2026; el cotejo comprende fecha, nombres restringidos y límites, y conserva los bytes originales. No certifica pools, todos los textos/rulings ni vigencia posterior. La herramienta `tools/verify_official.py` permite capturar documentos y contrastar nombres, límites y fecha con hashes y citas. La revisión 7 añade tres FAQ OCG en japonés que documentan el criterio de lugar de activación de Mechaba. `tools/mechaba_references.py` comprueba los bytes, campos, citas e identidad del documento sin consultar la red. Las traducciones explicativas no son evidencia primaria y el cotejo local no reautentica el transporte. Consulta [FUENTES_OFICIALES.md](FUENTES_OFICIALES.md).

## Calibración

El panel **Plantilla de calibración** exporta el esquema y contexto actuales. Completa `rows` con barajas diferentes, etiquetas externas y procedencia real. Cada fila necesita `id`, `deck`, `label`, `format`, `banlistVersion`, `split`, `sourceUrl`, `labelMethod` y `labeledAt`.

La aplicación rechaza duplicados por ID y por composición, comprueba formato/banlist, separa ajuste (`tuning`) y validación (`validation`) y recalcula los scores. No utiliza como evidencia un `score` suministrado. Cambiar modelo, catálogo o banlist invalida el contexto previo.

Se informa error medio y correlación del conjunto reservado. El umbral interno de 50 barajas de validación no es una garantía científica de suficiencia. Una URL declarada y buenas métricas no convierten automáticamente la evaluación en certificación competitiva. No se generaron etiquetas ni resultados ficticios. Las exportaciones de vídeo heredadas no forman parte de la aceptación E2E realizada.

## Fuente y compilación

La fuente se divide en `src/scripts` (capas principales), `src/modules` (88 módulos históricos), `src/app` (catálogo, probabilidades, interfaz, búsquedas, exportaciones y alcance) y `src/data`. El HTML original se conserva fuera del proyecto sin modificaciones.

Requisitos de compilación: Python 3.12 o superior y Node.js. Acorn 8.15.0 se incluye con su licencia MIT para adaptar de forma segura los literales de tamaño del catálogo; no se necesita descargarlo al compilar. Ejecuta:

```sh
python3 tools/build.py
```

El compilador genera el HTML autónomo, comprime los payloads de forma determinista, calcula los hashes de cada módulo y escribe `dist/build-manifest.json` con el hash de los bytes finales. Las versiones de página y Worker comparten el contrato de manifiesto.

Para refrescar desde la misma fuente inmutable:

```sh
python3 tools/update_catalog.py --commit ae5dedb957c2c48ab86554fee08a0fca73d8b1cf
python3 tools/build.py
```

El actualizador verifica TLS y la integridad SQLite, y comprueba hashes ya registrados para el mismo commit. Conserva los passcodes originales y marca los que no resuelve. Añade coincidencias exactas de nombres restringidos desde la CDB de cartas fijada. El compilador adapta los tamaños esperados al manifiesto usando tokens JavaScript, sin modificar cadenas, expresiones regulares ni identidades de cartas.

## Pruebas

Requisitos: Python, Node.js y Playwright Python 1.62 (`python3 -m pip install -r requirements-dev.txt`). Las comprobaciones completas necesitan los binarios de Chromium, Firefox y WebKit con sus dependencias oficiales. Los runners de Chromium admiten `/usr/bin/chromium`; revisa las opciones de cada runner si tu sistema lo instala en otro lugar.

```sh
python3 tests/run_all.py
```

El runner abre y cierra su propio servidor temporal. Agrupa las suites registradas en `tests/run_all.py`: sintaxis, documentos oficiales, fases, respuestas físicas, seis familias de rutas con replay, Blue-Eyes/Azure-Eyes, protección de Stardust Spark, negación GY de Spirit Dragon, recuperación de sesiones, recomendaciones por escenario, interfaz de formatos y laboratorio, compatibilidad, catálogo, construcción, procedencia, estrategia, contexto/persistencia, probabilidades/calibración, continuaciones hipotéticas y su importación, calidad de datos, emulación móvil y accesibilidad, Worker, búsquedas y flujos de entrega. El número de suites describe la batería; su aprobación debe comprobarse en el informe del build correspondiente. Propaga los códigos de salida y escribe:

- `dist/validation-summary.json`: resultado de todas las suites y hash del archivo probado.
- `dist/test-evidence.json`: comprobaciones de los bytes entregados en Chromium.
- `tests/*-results.json` y `tests/*.log`: evidencia detallada.

Los resultados externos se pueden abrir en el panel de diagnóstico. Se rechazan informes de otra compilación. Estas pruebas acreditan las capacidades ejecutadas; no certifican el universo completo de reglas, todos los formatos ni una puntuación competitiva. El informe de compatibilidad distingue los resultados reales de Chromium, Firefox y WebKit. La aceptación directa del HTML sin conexión se ejecuta en Firefox. Las restricciones administrativas y las limitaciones de emulación offline de cada motor se registran separadamente; no se presentan como pruebas aprobadas.

Para empaquetar después de una ejecución satisfactoria, usa `python3 tools/package.py`. El empaquetador rechaza código sin recompilar, informes de otro build y un HTML diferente del probado. El ZIP incluye fuente, ejemplos y evidencia; no requiere descargar dependencias para compilar. La actualización y la auditoría completa de fuentes CDB usan la caché local o requieren descargar nuevamente el commit fijado.

Mechaba conserva las activaciones de Invocation, Branded Fusion y Vessel con una Mágica física como coste. La revisión 9 conserva los quince handlers de monstruos en mano/GY, incluidos `DD_CROW_BANISH` y `DROLL_LOCK`, aceptados en revisión 8 sobre sus bytes. El registro se publica en `YGOResponses.capabilities().mechabaNonFieldMonsterActivations`.

Los dos paquetes nuevos declaran `activationRestriction: NONE`. Crow registra su objetivo antes de resolver y descarta su fuente; Droll la envía al GY. Mechaba conserva sus pagos, exige un monstruo físico de su propia mano como coste y no destierra otra vez desde GY las fuentes activadas en mano. La ventana de Droll termina con la cadena aunque haya quedado negado; una nueva activación requiere una ventana admitida nueva y una copia disponible. `NONE` no exime las cantidades de construcción: el snapshot TCG actual limita Droll a una y los ejemplos conservan ese máximo. Las fixtures unitarias que recolocan la misma copia GY→mano para comprobar ausencia de un contador de uso no acreditan una ruta de recuperación: no se implementa allí un efecto real para recuperarla. No se habilita prioridad general ni Droll como contrarrespuesta arbitraria.

Se registran dos activaciones de Mágicas de Campo y las activaciones concretas de Infinite Impermanence y Compulsory Evacuation Device como Trampas Normales de Velocidad 2; otras Mágicas de Campo y otras activaciones de Trampas permanecen pendientes. Una Counter Trap Roar de Velocidad 3 no admite respuesta de Mechaba. Los efectos GY de Mágicas/Trampas y el paquete conjunto Chixiao/Mo Ye siguen excluidos. La negación de la activación de Branded Fusion/Vessel no consume su límite de activación; negar solo el efecto sí lo consume. Consulta [ALCANCE_COMBOS.md](ALCANCE_COMBOS.md).

## Preparación y resolución de Mágicas de Campo

Las dos activaciones registradas desde mano declaran `FIELD_SPELL`/`SINGLE`/`NONE`. El núcleo prepara la carta física y el reemplazo antes de respuestas, tanto en la vista previa de contrarrespuestas como en la ejecución. `activationOrigin` conserva el origen anterior a esa preparación; `fieldSpellActivation` describe la carta nueva y los reemplazos. Los protocolos y pruebas de Mágicas Normales anteriores se conservan.

Solo se admiten perfiles de salida conocidos de Mausoleum y Sanctuary, tanto boca arriba como colocados. Enviar la carta vieja a GY por regla no se registra como coste ni destrucción y no se revierte si se niega la activación. La zona de Campo se modela separada de las cinco zonas normales de Mágicas/Trampas y de los bloqueos de columna. La resolución correcta mantiene la nueva carta; negar la activación la retira por el destino correspondiente, sin usar sus efectos continuos o nuevos beneficios mientras está negada.

El replay debe volver a comprobar reemplazos, UID, zona, pagos, respuestas y resultados. Las protecciones de destrucción de campo no se aplican a una carta cuya activación fue negada como si permaneciera en campo. Los usos globales de Mausoleum y Sanctuary no se reinician por reemplazo, y el aumento de ATK ya resuelto de Mausoleum conserva su duración. No se implementa el efecto GY de Mausoleum ni se ejecutan todos los efectos de una carta por activarla.

## Activación de la Trampa Normal registrada en revisión 12

`ACTIVATE_INFINITE_IMPERMANENCE` (10045474) declara `NORMAL_TRAP`, paquete `SINGLE`, restricción `NONE` y Velocidad 2. Se ofrece en las ventanas entre acciones registradas del modelo de duelo; no añade prioridad general ni Damage Step. Desde mano exige no controlar monstruos ni Mágicas/Trampas, incluidas Mágicas de Campo, y permite elegir entre las cinco columnas. Desde una carta colocada exige su columna física y un `setTurn` válido anterior al turno actual.

El núcleo prepara la carta boca arriba antes de las respuestas en la vista previa y en la ejecución. `activationOrigin` conserva el origen anterior; `normalTrapActivation` registra copia, jugador, origen, columna, si estaba colocada y turno de colocación. Activarla no envía la carta como coste. Tras resolver, la limpieza la envía al GY; una activación negada por Mechaba puede acabar desterrada y una negada y destruida por Roar acaba en GY dentro del paquete registrado.

El efecto selecciona un monstruo rival admitido boca arriba, con efectos y sin negación o inmunidad de objetivo que impida esta activación registrada. Niega sus efectos hasta el final del turno. La negación de columna requiere que la carta estuviera colocada antes de activarse, siga en campo al resolver y se resuelva la negación del objetivo. Si el objetivo abandona el campo por una contrarrespuesta, no se niega ese monstruo ni se aplica la columna. La columna rival se refleja respecto a la propia; un bloqueo previo puede negar el efecto sin hacer ilegal la activación.

Mechaba responde a este paquete enviando una Trampa física admitida —Impermanence o Roar en los perfiles revisados— de su mano al GY. El pago permanece aunque una contrarrespuesta niegue a Mechaba. Roar conserva su límite compartido, Velocidad 3 y resolución LIFO, hasta tres contrarrespuestas según el contrato existente. Mechaba de Velocidad 2 no puede responder a la activación de Roar. El proveedor de respuesta de Impermanence no se sustituye por el nuevo handler. El proveedor de respuesta de Impermanence conserva sus ventanas y añade la corrección de bloqueos de columna anteriores: una respuesta colocada en una columna ya negada se activa y termina en el GY, pero no niega el efecto del monstruo ni añade otro bloqueo. Desde mano, la respuesta elige de forma determinista la primera columna no bloqueada, o la primera si las cinco están bloqueadas; en este último caso su efecto también queda negado. La activación directa mantiene sus cinco elecciones explícitas de columna.

La guía de Trampa activa Impermanence colocada sobre Spirit Dragon rival con una respuesta de Mechaba y una contrarrespuesta de Roar; después invoca a Aleister y busca Invocation. La comparación al deshacer permite observar el destierro de Impermanence sin esa contrarrespuesta. La historia anterior del campo sigue declarada, y completar ese objetivo de mano no equivale a ganar el duelo.

Una columna ya negada también anula el efecto de Roar, incluida su contrarrespuesta de Velocidad 3. La carta se activa y consume su uso; al resolver no niega ni destruye el eslabón anterior, y termina en el destino registrado. Otra Counter Trap admitida todavía puede negar esa activación.

## Reproducir la validación en un checkout nuevo

La compilación usa la fuente incluida. Las pruebas de ampliación contrastan también las bases CDB fijadas: antes de ejecutar toda la batería, recupera la caché con `python3 tools/update_catalog.py --commit ae5dedb957c2c48ab86554fee08a0fca73d8b1cf`. La actualización de ese mismo commit debe conservar exactamente los datos versionados. Las comprobaciones entre motores requieren instalar sus binarios y dependencias con los mecanismos oficiales de Playwright.

`.github/workflows/verify-html.yml` conserva Python 3.12, Node 22, la recuperación idempotente de la fuente fijada, la compilación y comparación del HTML, el runner completo, la exigencia entre motores y los artefactos con `always()`.

La revisión 8 separa instalación Python, dependencias del sistema y preparación de Chromium, Firefox y WebKit. La caché de binarios usa `runner.os` y el hash de `requirements-dev.txt`; no evita instalar las dependencias de sistema. Las instalaciones de motores se ejecutan incluso con caché y comprueban lo que falta para la versión fijada. Pip tiene timeout de conexión de 45 segundos y dos reintentos; Playwright usa 90 segundos de conexión. El job tiene 45 minutos y cada motor cinco. La revisión 14 amplía de quince a veinte minutos el presupuesto de pruebas: la etapa anterior tardó 821 segundos y esta entrega añade cuatro grupos. El YAML detalla los demás presupuestos. Los nombres de etapa y la salida nativa identifican dónde se detiene una preparación.

La cancelación histórica de CI7 ocurrió en instalación al superar 30 minutos, antes de las pruebas de aplicación. La [ejecución remota de CI8](https://github.com/socramgns/MODERN/actions/runs/40599777991) terminó correctamente, incluidas instalación, pruebas y comprobación entre motores. La [ejecución remota de CI9](https://github.com/socramgns/MODERN/actions/runs/40614521563) también terminó correctamente para su propio commit. La [ejecución remota de CI11](https://github.com/socramgns/MODERN/actions/runs/40741033245) terminó correctamente para su commit. Cada revisión nueva necesita observar y registrar su propia ejecución remota; los resultados anteriores no acreditan sus bytes. Los informes se guardan como artefactos cuando están disponibles.

## Objetivos propios de Mágicas y Trampas

`YGOComboWorkbench.validateGoal` concentra la validación compartida con el laboratorio. El contrato admite listas de hasta 20 IDs por zona y conserva los nombres anteriores:

| Campo JSON | Copias que cuentan |
| --- | --- |
| `requiredFieldIds` | Monstruos propios boca arriba |
| `requiredFaceUpSpellTrapIds` | Mágicas/Trampas propias boca arriba, incluidas Mágicas de Campo |
| `requiredSetSpellTrapIds` | Mágicas/Trampas propias colocadas, incluidas Mágicas de Campo |
| `requiredHandIds` | Cartas en la mano propia |
| `recoveredHandIds` | Nombre heredado admitido para objetivos de mano |

Cada repetición de una identidad exige otra copia física; los alias comparten identidad canónica. Las zonas boca arriba y colocada son disjuntas. Una carta en mano, GY o campo rival no satisface un requisito de Mágica/Trampa propia en campo. Los campos de LP, fase, turno y jugador activo siguen disponibles.

El formulario propone cartas del inventario Main/Extra con el tipo apropiado y excluye Skills y Tokens de las nuevas listas. La validación se aplica también al importar escenarios e informes antes de sustituir la sesión; las recomendaciones conservan el mismo significado del objetivo. Los objetivos son condiciones de estado y no ejecutan efectos por sí solos. El campo inicial declarado mantiene su condición de supuesto.


## Seguimiento de objetivos de la revisión 11

`YGORecommendations.goalProgress(state, goal)` y `YGOComboWorkbench.goalProgress(state, goal)` validan el objetivo y desglosan los requisitos del estado propio. Devuelven el esquema `ygo-goal-progress/v1`, la condición global `achieved`, requisitos de cartas o de estado y totales de requisitos y copias. Las cantidades se agrupan por identidad canónica y no reutilizan un UID para cubrir dos copias requeridas. `goalMatches` conserva el mismo significado como predicado de las búsquedas.

El laboratorio muestra ese desglose después de iniciar, ejecutar, deshacer, aplicar otro objetivo o reanudar un informe. El progreso de `report().goalProgress` se deriva del estado y objetivo actuales; un resumen importado no se acepta como evidencia. Si no hay un estado activo con contexto vigente, no se muestra como objetivo cumplido. La preparación anterior mantiene su condición de supuesto aunque el objetivo ya se cumpla al inicio.

La búsqueda incluye `initialGoalProgress` para distinguir un objetivo ya satisfecho en el estado inicial declarado de las continuaciones que sí ejecutan acciones. Este diagnóstico no crea una línea vacía, no acredita una historia de invocaciones y no añade por sí solo un éxito a la simulación de manos. Las líneas y el muestreo conservan sus requisitos de replay y sus límites.


## Compulsory Evacuation Device de la revisión 13

`ACTIVATE_COMPULSORY_EVACUATION_DEVICE` (94192409) declara `NORMAL_TRAP`/`SINGLE`/`NONE`, Velocidad 2 y origen `spelltrap`. Solo admite una copia física colocada en un turno anterior y su columna real. El registro del núcleo no extiende a esta carta la excepción desde mano de Impermanence.

El paquete conserva el objetivo propio o rival antes de las respuestas y vuelve a validar su presencia al resolver. Los perfiles revisados devuelven Main a mano del propietario y Fusion/Synchro/Link al Extra oculto del propietario. Los Tokens deben existir en el registro de creación real y cesan al salir; no se emite destrucción por su cese. Xyz, Pendulum, materiales, equipos y consecuencias no revisadas no se habilitan por leer el texto de la carta.

El retorno conserva identidad y UID, retira marcas de campo y descarta la certificación de Invocación apropiada de esa presencia al volver a mano o Extra oculto. No reinicia los presupuestos globales del turno ni las restricciones pertinentes. Spark no impide devolver, Balelynx no reemplaza esa salida y devolver Mirrorjade oculto no programa una nueva destrucción End. Los efectos diferidos ajenos ya pendientes se conservan.

Mechaba admite la activación con coste Trampa físico; Roar mantiene velocidad, usos y contrarrespuestas acotadas. Los pagos permanecen aunque se niegue la activación o la respuesta. Una negación previa de columna anula el efecto sin convertir la devolución en destrucción ni reembolsar la carta. El retorno campo→mano no es una adición Deck→mano y no abre esa ventana de Droll.

La redirección registrada de Spinny que fue revivido se respeta: su salida lo destierra en lugar de devolverlo a la mano. La traza conserva el destino solicitado y el real; otras redirecciones sin revisar permanecen excluidas.

Las suites `tests/compulsory_evacuation.cjs` y `tests/release13_browser.py` separan las regresiones de fuente de las comprobaciones del HTML compilado. La aceptación exige ambas y el runner completo sobre los mismos bytes, además de conservar las regresiones de Impermanence. No certifican prioridad general ni todas las salidas posibles del juego.


## Continuación hipotética de un robo en revisión 14

`src/app/draw-continuation.js` expone el análisis y la verificación de un informe hipotético separado. Reconstruye el inicio y el prefijo con el motor causal, exige un próximo robo propio elegible con rival `PASS` y enumera las copias físicas del Deck con peso exacto `1/N`. Aplica cada supuesto sobre una copia del estado, conserva desconocido el orden restante y explora únicamente continuaciones propias registradas dentro de los presupuestos declarados. No modifica `E.execute`, `E.replay` ni la búsqueda causal normal para permitir elegir un robo favorable.

La verificación vuelve a construir el prefijo y la transición supuesta y ejecuta los pasos de cada testigo, comparando estados, pagos, eventos y pruebas. Un objetivo alcanzado al robo puede tener cero acciones posteriores; la transición supuesta permanece explícita y no se convierte en una línea observada vacía. Los resúmenes y pesos importados se contrastan con lo que se reconstruye. El verificador no sustituye una búsqueda no determinista al importar ni certifica exhaustividad global.

`src/app/draw-continuation-workbench.js` presenta las ramas, el límite del objetivo demostrado y la masa desconocida, permite cancelación y mantiene el laboratorio sin sustituir su estado. Cambiar fuente, objetivo o contexto invalida el análisis vigente. Las situaciones sin testigo o con un siguiente evento aleatorio fuera de alcance siguen desconocidas; el informe no calcula una tasa de victoria.

`src/app/data-quality.js` deriva incidencias del catálogo y de su procedencia y exporta un diagnóstico ligado al build. Las propuestas de migración por nombre exacto permanecen pendientes de revisión y no cambian passcodes. Las pruebas de emulación móvil identifican motores y tamaños; su evidencia no sustituye aceptación en hardware real.

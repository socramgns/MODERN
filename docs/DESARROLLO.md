# Analizador de barajas Yu-Gi-Oh · revisión 8

El entregable publicado se llama `Analizador_YuGiOh.html`; se construye como `dist/Calculadora_de_Barajas_YuGiOh_Alpha_1263_Corregida.html`. Después de compilar, comprobar y publicar la revisión, esas copias deben ser idénticas. Abre el HTML en un navegador reciente. El catálogo y los motores están incorporados al HTML; las imágenes y las actualizaciones remotas necesitan Internet. El entregable es autónomo. En este entorno Chromium bloquea la navegación `file:` por política administrativa. Firefox permite comprobar directamente el HTML sin conexión; WebKit y los otros motores conservan sus resultados y límites específicos en los informes.

La puntuación es **estructural y provisional** por decisión del usuario. No representa una tasa de victoria ni un tier de torneo. TCG es el alcance principal; los otros perfiles mantienen advertencias sobre mecánicas, disponibilidad o listas que requieren revisión.

La revisión 8 pasó **46/46 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `d7c220eb32a7876a39fb6caaeee7bbde7ee96bde1fe5353672ed44e2369f9d6b`; SHA-256 `aa5e34480df69200c7355daf8fdbc589b584cd276d890ab22977867a9ea3aeca`; tamaño **6.940.108 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la comprobación de descarga HTTP y la ejecución remota de GitHub Actions se registran por separado; la aceptación local no acredita por sí sola esos pasos.

`dist/validation-summary.json` identifica esta aceptación local de revisión 8. En la rama de entrega, `evidence/validation-summary.json` debe conservar los mismos identificadores. La [evidencia histórica de revisión 7](https://github.com/socramgns/MODERN/blob/719897b2f9880507b15068c4a5ca9e1a3a02d038/evidence/validation-summary.json) se consulta en su commit, sin atribuir los informes antiguos a los bytes nuevos.

La revisión 7 tiene una [aceptación local documentada de 44/44 grupos](https://github.com/socramgns/MODERN/blob/719897b2f9880507b15068c4a5ca9e1a3a02d038/evidence/validation-summary.json), con 114 archivos JavaScript comprobados, Chromium, Firefox y WebKit y apertura directa offline en Firefox. La ejecución inicial aprobó 43 grupos; el flujo de contexto pasó sus 18 comprobaciones al repetirse después de ajustar un selector de la prueba al panel anidado, sin cambiar la aplicación ni el HTML. La evidencia conserva ambos intentos.

La [ejecución remota de revisión 7](https://github.com/socramgns/MODERN/actions/runs/40558997215/job/122382622102) terminó **cancelada** al superar 30 minutos durante «Instalar herramientas de comprobación», antes de ejecutar las pruebas del analizador. No es un CI aprobado ni demuestra un fallo de reglas de la aplicación. La revisión 8 separa las etapas de instalación y añade caché; su resultado remoto debe consultarse por separado.

## Uso

1. En **Baraja y zonas por formato**, importa JSON o YDK. El editor, la composición, las probabilidades y las diez categorías comparten el estado de esa baraja. JSON conserva también contexto y Skills; YDK transporta Main, Extra y Side.
2. Revisa los avisos de construcción, familias de alias y datos pendientes del formato. Una baraja inválida se conserva para diagnóstico. La biblioteca de este panel guarda todas las zonas y su contexto por nombre y formato; guardar otra vez el mismo nombre y formato reemplaza esa entrada.
3. Después de editar, pulsa **CALCULAR**. La nota previa queda invalidada hasta recalcular.
4. En **EXPLORAR COMBOS TCG VERIFICABLES**, abre **Probar un ejemplo incluido** para cargar ejemplos incorporados sin Internet. La revisión 8 incluye diez: Invoked, Stardust Spark, Spirit Dragon, Swordsoul, Branded, Tenyi, Salamangreat, Roar, Crow/Mechaba y Droll tras una búsqueda; sus pasos y replay se comprobaron dentro del alcance registrado. El ejemplo sustituye la baraja actual y prepara un campo técnico declarado; no es una recomendación competitiva. También puedes importar escenarios externos. En este panel, selecciona cinco cartas o muestrea una mano y su orden inicial con una semilla. Importa `examples/Arquetipo_*.json` o `examples/Expansion_*.json` para reproducir rutas de Invoked, Swordsoul, Branded, Blue-Eyes, Tenyi y Salamangreat. Los YDK equivalentes conservan las cantidades, pero no la mano ni el objetivo. Son fixtures técnicos, no recomendaciones competitivas.
5. Elige que el rival pasa o importa su mazo y mano completos para activar las respuestas físicas disponibles. `examples/Escenario_Ash_TCG.json` proporciona una Ash real. El panel muestra pasos, costes, campo, estados intermedios, replay nuevo y recursos; las búsquedas sin demostración permanecen desconocidas. Consulta [docs/ALCANCE_COMBOS.md](ALCANCE_COMBOS.md).
6. El panel **Acciones registradas de esta baraja** separa datos técnicos de las acciones parciales que el motor tiene registradas. Puedes filtrar zonas/cartas y exportar el diagnóstico. Una acción registrada no garantiza disponibilidad en una mano concreta ni cobertura completa de los efectos. En **Laboratorio de fases, campo rival y respuestas**, pulsa **Continuar la primera línea verificada** o inicia desde la mano/escenario. Ejecuta acciones registradas, pasa de fase y deshaz pasos. Puedes preparar un campo con copias que existan en los mazos cargados: su historia anterior queda declarada como supuesto; las acciones posteriores sí se vuelven a ejecutar.
7. En el mismo laboratorio, define un objetivo JSON con campo, mano, LP, turno o fase. **Comparar PASS y respuestas disponibles** conserva la misma mano e inventario rival frente a PASS y las políticas Ash, Veiler e Impermanence presentes en esa mano. La comparación conserva también el campo físico inicial y sus políticas; incluye Spirit Dragon cuando está disponible en ese campo. Describe resultados observados y límites; no calcula una tasa de victoria ni la mejor decisión de un adversario.
8. El modo **Preparación inicial con replay verificable** y los escenarios específicos heredados siguen disponibles bajo sus requisitos. La búsqueda genérica experimental corre en un Worker cancelable; una traza sin evidencia suficiente no acredita un combo.
9. Exporta YDK, análisis JSON o PNG; PDF usa la impresión del navegador. Los escenarios y trazas del laboratorio se exportan en JSON; el informe del laboratorio puede reimportarse para reanudar sus pasos con la misma baraja y contexto, tras ejecutar de nuevo el replay. Los enlaces compactos conservan identidades, cantidades, Skills y contexto y se recalculan al abrirse; un enlace `file:` requiere que el destinatario disponga de la calculadora.
10. La sesión se restaura al abrir el mismo archivo/origen y perfil de navegador. No sincroniza dispositivos. Exporta una copia antes de borrar el almacenamiento local.

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

El runner abre y cierra su propio servidor temporal. Agrupa las suites registradas en `tests/run_all.py`: sintaxis, documentos oficiales, fases, respuestas físicas, seis familias de rutas con replay, Blue-Eyes/Azure-Eyes, protección de Stardust Spark, negación GY de Spirit Dragon, recuperación de sesiones, recomendaciones por escenario, interfaz de formatos y laboratorio, compatibilidad, catálogo, construcción, procedencia, estrategia, contexto/persistencia, probabilidades/calibración, Worker, búsquedas y flujos de entrega. El número de suites describe la batería; su aprobación debe comprobarse en el informe del build correspondiente. Propaga los códigos de salida y escribe:

- `dist/validation-summary.json`: resultado de todas las suites y hash del archivo probado.
- `dist/test-evidence.json`: comprobaciones de los bytes entregados en Chromium.
- `tests/*-results.json` y `tests/*.log`: evidencia detallada.

Los resultados externos se pueden abrir en el panel de diagnóstico. Se rechazan informes de otra compilación. Estas pruebas acreditan las capacidades ejecutadas; no certifican el universo completo de reglas, todos los formatos ni una puntuación competitiva. El informe de compatibilidad distingue los resultados reales de Chromium, Firefox y WebKit. La aceptación directa del HTML sin conexión se ejecuta en Firefox. Las restricciones administrativas y las limitaciones de emulación offline de cada motor se registran separadamente; no se presentan como pruebas aprobadas.

Para empaquetar después de una ejecución satisfactoria, usa `python3 tools/package.py`. El empaquetador rechaza código sin recompilar, informes de otro build y un HTML diferente del probado. El ZIP incluye fuente, ejemplos y evidencia; no requiere descargar dependencias para compilar. La actualización y la auditoría completa de fuentes CDB usan la caché local o requieren descargar nuevamente el commit fijado.

Mechaba conserva las activaciones de Invocation, Branded Fusion y Vessel con una Mágica física como coste. La revisión 8 amplía el registro de monstruos en mano/GY de trece a quince handlers, añadiendo `DD_CROW_BANISH` y `DROLL_LOCK`, dentro de la aceptación local del HTML final. El registro se publica en `YGOResponses.capabilities().mechabaNonFieldMonsterActivations`.

Los dos paquetes nuevos declaran `activationRestriction: NONE`. Crow registra su objetivo antes de resolver y descarta su fuente; Droll la envía al GY. Mechaba conserva sus pagos, exige un monstruo físico de su propia mano como coste y no destierra otra vez desde GY las fuentes activadas en mano. La ventana de Droll termina con la cadena aunque haya quedado negado; una nueva activación requiere una ventana admitida nueva y una copia disponible. `NONE` no exime las cantidades de construcción: el snapshot TCG actual limita Droll a una y los ejemplos conservan ese máximo. Las fixtures unitarias que recolocan la misma copia GY→mano para comprobar ausencia de un contador de uso no acreditan una ruta de recuperación: no se implementa allí un efecto real para recuperarla. No se habilita prioridad general ni Droll como contrarrespuesta arbitraria.

Field Spells y activaciones de Trampas de Velocidad 2 permanecen pendientes; una Counter Trap Roar de Velocidad 3 no admite respuesta de Mechaba. Los efectos GY de Mágicas/Trampas y el paquete conjunto Chixiao/Mo Ye siguen excluidos. La negación de la activación de Branded Fusion/Vessel no consume su límite de activación; negar solo el efecto sí lo consume. Consulta [ALCANCE_COMBOS.md](ALCANCE_COMBOS.md).

## Reproducir la validación en un checkout nuevo

La compilación usa la fuente incluida. Las pruebas de ampliación contrastan también las bases CDB fijadas: antes de ejecutar toda la batería, recupera la caché con `python3 tools/update_catalog.py --commit ae5dedb957c2c48ab86554fee08a0fca73d8b1cf`. La actualización de ese mismo commit debe conservar exactamente los datos versionados. Las comprobaciones entre motores requieren instalar sus binarios y dependencias con los mecanismos oficiales de Playwright.

`.github/workflows/verify-html.yml` conserva Python 3.12, Node 22, la recuperación idempotente de la fuente fijada, la compilación y comparación del HTML, el runner completo, la exigencia entre motores y los artefactos con `always()`.

La revisión 8 separa instalación Python, dependencias del sistema y preparación de Chromium, Firefox y WebKit. La caché de binarios usa `runner.os` y el hash de `requirements-dev.txt`; no evita instalar las dependencias de sistema. Las instalaciones de motores se ejecutan incluso con caché y comprueban lo que falta para la versión fijada. Pip tiene timeout de conexión de 45 segundos y dos reintentos; Playwright usa 90 segundos de conexión. El job tiene 45 minutos, cada motor cinco y las pruebas quince; el YAML detalla los demás presupuestos. Los nombres de etapa y la salida nativa identifican dónde se detiene una preparación.

La cancelación histórica de CI7 ocurrió en instalación al superar 30 minutos, antes de las pruebas de aplicación. La nueva configuración tiene validación estática; su resultado remoto de CI8 debe consultarse por separado. Los informes se guardan como artefactos cuando están disponibles. Consulta el resultado real de GitHub Actions antes de afirmar una aprobación remota.

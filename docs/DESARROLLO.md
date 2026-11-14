# Desarrollo y entrega · revisión 22

La revisión 22 queda aceptada por la ejecución remota del commit `86b8f848635d1ac392625b6d9c1a6bb5674e5b04`: el [workflow de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/43558962065) completó los diez pasos obligatorios, incluida la batería de **79 grupos**, las instalaciones de Chromium, Firefox y WebKit y la puerta estricta entre motores. El recuento se contrasta con el runner versionado; no se descargaron los informes remotos individuales. Las fuentes incluyen **124 archivos JavaScript** y se conservan **22 ejemplos**. Build `afe53b8932901869aae05b80e3605ca6cb18625ec7984e41484ce71bf212fa94`; SHA-256 `7ec0ed4d6bee8ef655445bc7831aa6f5ad9fd6db332722212abbc43d316c1b04`; tamaño **7.192.465 bytes**. La descarga del candidato se comprobó por HTTP 200 y coincidencia exacta de bytes.

## Implementación de R22

`src/app/flip-effects.js` se carga después de respuestas. Registra `DUEL_FLIP_SUMMON` y `DUEL_FLIP_FAITH_RECOVER`; el motor difiere sólo las salidas por batalla hasta completar el paquete de Faith y las limpiezas de respuestas. No amplía el registro de 15 efectos de mano/Cementerio: Faith conserva un contrato de activación de campo separado. Los inspectores de pendientes admiten estados vacíos sin convertirlos en objetivos cumplidos.

Las referencias Lua y C++ archivadas en `evidence/flip-references/` se conservan como datos de revisión; no se ejecutan dentro del analizador. Los microestados sintéticos de QA están identificados y no sustituyen una jugada desde el origen.

La verificación focal aprobó **63/63 casos Node**, con **14 testigos reproducidos**, y **30/30 comprobaciones del HTML en Chromium**. Las seis suites correctivas sumaron **240 casos**, incluidos los 63 del perfil Flip; son resultados que se solapan y no se suman como pruebas distintas. La auditoría técnica independiente aprobó **9/9** casos; sus microestados diagnósticos no acreditan historiales de juego. Estas comprobaciones complementan la aceptación remota del candidato exacto.

El archivo único se genera desde `src`, `manifest.json` y `tools/build.py`. El build fija hashes de todas las fuentes y datos. La referencia `src/data/technical-references/multiple-attacks-reference.json` cita los textos ya incorporados de la fuente técnica fijada; no es un ruling oficial nuevo.

La revisión 21 registra el segundo ataque de Hayabusa Knight y Cyber Twin Dragon durante cada Battle Phase. Cada declaración consume un ataque de la copia física, incluso si una protección evita la destrucción. Negar sus efectos reduce el límite a uno sin devolver ataques gastados; retirar la copia del campo y volver a invocarla comienza una estancia nueva. El registro usado para impedir cambios manuales de posición se conserva por separado.

## Verificaciones

- `python3 tools/build.py`: compilación determinista y manifiesto; comparar después el HTML de `dist` con `Analizador_YuGiOh.html`.
- `node tests/flip_effects.cjs`: Volteo, efecto obligatorio, objetivos físicos, respuestas, búsquedas, reproducción y estados inválidos.
- `node tests/multiple_attacks.cjs`: presupuestos de ataques, objetivos, negación, propietarios y protecciones conservados.
- `node tests/scenario_examples.cjs`: los 22 ejemplos y sus estados iniciales declarados.
- `python3 tests/release22_browser.py`: flujo de Faith sobre los bytes compilados sin conexión, batalla, informes y reanudación.
- `python3 tests/release21_browser.py`: ataques múltiples e inventarios exactos, incluido el perfil Flip añadido.
- `python3 tests/accessibility_workflow.py`: comprobaciones automatizadas de teclado y foco sobre el HTML compilado.
- `python3 tools/audit_unresolved_sources.py --output dist/unresolved-source-audit.json`: cinco CDB, identidades y estadísticas sin inferencias.
- `python3 tests/run_all.py --no-build`: batería completa; cada informe conserva su resultado real.
- `python3 tests/compatibility_browser.py --require-cross-browser`: puerta adicional entre los motores disponibles.

El workflow de GitHub Actions conserva los mismos bytes y puertas obligatorias de R21: recuperación e idempotencia de la fuente técnica, comparación del HTML, batería completa y puerta estricta entre motores. R22 añade dos grupos a R21; el runner contiene 77 comandos, más sintaxis y conservación del artefacto, para un total de 79 grupos.

La puerta `--require-cross-browser` exige al menos dos motores ejecutados y que pasen todos los ejecutados; el flag por sí solo no exige tres. La ejecución de CI aprobó por separado las instalaciones de Chromium, Firefox y WebKit y después aprobó esa puerta. La cobertura se interpreta junto al workflow y al bucle de motores del runner; no se presenta como inspección de informes remotos individuales descargados.

La batería local completa conserva su resultado original **76/79, `pass:false`**. Dos grupos no pudieron completarse por Firefox y WebKit ausentes. El tercero contenía expectativas del inventario de acciones anteriores al Volteo; tras actualizarlas para exigir las acciones previas y el perfil Flip, su ejecución focal aprobó **39/39** sobre los mismos bytes. Ese seguimiento no convierte la batería original en un resultado 77/79 ni en éxito local completo. El informe íntegro y el seguimiento se conservan en `evidence/local-validation/`. La navegación `file://` de Chromium quedó bloqueada por la política del navegador; las pruebas con bytes entregados sin conexión no se presentan como navegación de archivo verificada en Chromium. El grupo de entrega por archivo mediante Firefox forma parte de la batería remota aprobada. No se elude la política del navegador.

Se amplían las etiquetas de búsqueda, el foco visible, el estado accesible de los selectores y el cierre y recorrido por teclado de ventanas registradas. Estas comprobaciones automáticas y emuladas no cierran C30 ni C31: faltan la evaluación completa con tecnologías de asistencia y pruebas en equipos físicos.

La puntuación competitiva permanece estructural y provisional por decisión del usuario. El importador de resultados reales está preparado; los escenarios diagnósticos no son resultados de torneos.

La revisión 20 conserva su [HTML publicado y verificado](https://github.com/socramgns/MODERN/raw/71b244b7594b5bae1f5042d1248bcf5fa4a50a64/Analizador_YuGiOh.html?download=1), SHA-256 `1bcd4ee98c2d8b694c7fd31b8c948fd4387ae94c0a944171f9dc1385aa8d9ac0`, y su [aceptación remota de 73 grupos](https://github.com/socramgns/MODERN/actions/runs/42337909290). Su resultado local original sigue en 71/73 con `pass:false` por Firefox y WebKit ausentes; no se convierte ese resultado en éxito.

Los [procedimientos y herramientas anteriores](https://github.com/socramgns/MODERN/blob/71b244b7594b5bae1f5042d1248bcf5fa4a50a64/docs/DESARROLLO.md) se conservan en la revisión 20; esta revisión mantiene sus funciones y añade el alcance indicado arriba.

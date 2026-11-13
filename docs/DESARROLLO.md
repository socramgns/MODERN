# Desarrollo y entrega · revisión 21

La revisión 21 queda aceptada por la ejecución remota del commit `c3c2ebeb9aaaf7df57481fdefadabf93292d66b3`: el [workflow de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/42440271007) completó los diez pasos obligatorios, incluida la batería de **77 grupos** y la comprobación estricta entre Chromium, Firefox y WebKit. El recuento se contrasta con el runner versionado; no se descargaron los informes remotos individuales. Las fuentes incluyen **123 archivos JavaScript** y se conservan **21 ejemplos**. Build `8e2f493167e60a1752237885db37d72063514109118aa937707e93c9819c4908`; SHA-256 `3838c78ea58ec52af9019fbc5ad2f132db26b6022eb3d9c1ff939543d8894531`; tamaño **7.165.831 bytes**. La recuperación actual reprodujo el HTML y aprobó **86 casos Node**, **29 casos de escenarios** y **39 comprobaciones GUI**. El informe completo local R21 no se recuperó al reemplazarse el ejecutor: se registra como no disponible, sin atribuirle resultados. La evidencia R20 original permanece íntegra en `evidence/history/revision20`. Las 30 comprobaciones previas de teclado/foco y la auditoría previa siguen vinculadas a los mismos bytes; no se presentan como ejecuciones nuevas. La puntuación continúa provisional; C30 y C31 siguen pendientes.

El archivo único se genera desde `src`, `manifest.json` y `tools/build.py`. El build fija hashes de todas las fuentes y datos. La referencia `src/data/technical-references/multiple-attacks-reference.json` cita los textos ya incorporados de la fuente técnica fijada; no es un ruling oficial nuevo.

La revisión 21 registra el segundo ataque de Hayabusa Knight y Cyber Twin Dragon durante cada Battle Phase. Cada declaración consume un ataque de la copia física, incluso si una protección evita la destrucción. Negar sus efectos reduce el límite a uno sin devolver ataques gastados; retirar la copia del campo y volver a invocarla comienza una estancia nueva. El registro usado para impedir cambios manuales de posición se conserva por separado.

## Verificaciones

- `python tools/build.py`: compilación determinista y manifiesto.
- `node tests/multiple_attacks.cjs`: presupuestos, objetivos, negación, propietarios, protecciones y replay.
- `python tests/release21_browser.py`: interacción con el HTML compilado, informes, búsqueda y deshacer.
- `python tests/accessibility_workflow.py`: paquete de accesibilidad automatizado sobre el HTML compilado.
- `python tools/audit_unresolved_sources.py --output dist/unresolved-source-audit.json`: cinco CDB, identidades y estadísticas sin inferencias.
- `python tests/run_all.py --no-build`: batería completa; cada informe conserva su resultado real.

El workflow de GitHub Actions conserva los mismos bytes y puertas obligatorias de la revisión 20: recuperación e idempotencia de la fuente técnica, comparación del HTML y comprobación estricta entre Chromium, Firefox y WebKit. El runner añade los cuatro grupos documentados y mantiene las pruebas previas.

Se amplían las etiquetas de búsqueda, el foco visible, el estado accesible de los selectores y el cierre y recorrido por teclado de ventanas registradas. Estas comprobaciones automáticas y emuladas no cierran C30 ni C31: faltan la evaluación completa con tecnologías de asistencia y pruebas en equipos físicos.

La puntuación competitiva permanece estructural y provisional por decisión del usuario. El importador de resultados reales está preparado; los escenarios diagnósticos no son resultados de torneos.

La revisión 20 conserva su [HTML publicado y verificado](https://github.com/socramgns/MODERN/raw/71b244b7594b5bae1f5042d1248bcf5fa4a50a64/Analizador_YuGiOh.html?download=1), SHA-256 `1bcd4ee98c2d8b694c7fd31b8c948fd4387ae94c0a944171f9dc1385aa8d9ac0`, y su [aceptación remota de 73 grupos](https://github.com/socramgns/MODERN/actions/runs/42337909290). Su resultado local original sigue en 71/73 con `pass:false` por Firefox y WebKit ausentes; no se convierte ese resultado en éxito.

Los [procedimientos y herramientas anteriores](https://github.com/socramgns/MODERN/blob/71b244b7594b5bae1f5042d1248bcf5fa4a50a64/docs/DESARROLLO.md) se conservan en la revisión 20; esta revisión mantiene sus funciones y añade el alcance indicado arriba.

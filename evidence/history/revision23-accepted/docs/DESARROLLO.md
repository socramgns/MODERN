# Desarrollo y entrega · revisión 23

El archivo único se genera desde `src`, `manifest.json` y `tools/build.py`. No necesita instalación para su uso final. El build liga fuentes y datos mediante hashes; el catálogo técnico permanece fijado y la compilación sigue siendo reproducible.

Build `ad379fc6b8cddeaff64a1895a2eb97fed493b037a7e725a3bd9681a185d94a64`; SHA-256 del HTML `017f4cd81211d2be486c6634e876254fe6dc2225e6419c02e459d69ea7022c9e`; **7.435.430 bytes**, **131 archivos JavaScript** y **28 ejemplos**. La descarga inmutable del candidato dio HTTP 200 y coincidió exactamente con el HTML de Git, raíz y `dist`.

## Módulos nuevos y estado conservado

`priority-chain.js`, `trigger-order.js` y `damage-step.js` incorporan las reglas opcionales de prioridad, SEGOC y oportunidades de batalla. `xyz-summon.js` y `pendulum-summon.js` conservan materiales físicos, propietarios, historial y espacios. `draw-sequences.js` separa hipótesis cronológicas del estado observado; `rules-workbench.js` expone sus controles y límites.

Los flags de contexto son `priorityMode`, `triggerOrderMode` y `damageStepMode`. Los efectos simultáneos necesitan prioridad; los pasos de daño necesitan ambos. La carga valida esas dependencias. El registro de perfiles que depende del catálogo espera su hidratación para evitar fallos de arranque del HTML autónomo.

La UI utiliza `YGOAdvancedWorkbench.snapshot()` para lecturas de presentación sin reproducir repetidamente todo el historial. `report()`, exportación, importación y análisis conservan la evidencia completa y su reconstrucción. Los análisis bloquean cambios, atienden cancelación y descartan contextos caducados. La importación hipotética usa `verifyAsync`, con verificación cooperativa y guardas del contexto; los resultados no se convierten en robos observados.

`tests/browser_offline.py` concentra la preparación nativa de páginas sin conexión. En 22 scripts GUI, el único cambio es importar ese helper y usar su fábrica para la primera página correspondiente. Las aserciones de juego, hash, estado sin conexión y los argumentos URL del runner permanecen iguales. La comprobación previa obligatoria del workflow usa ese mismo helper y prueba tráfico HTTP real bloqueado durante la desconexión y recuperado después. Los informes focales nuevos están separados de los registros anteriores conservados.

El selector Péndulo respeta una lista vacía de destinos legales. El cierre del combate por salida del objetivo antes del cálculo conserva el ataque gastado. Spark, Mechaba, Mirrorjade, Azure y Ancients mantienen los límites revisados de uso por instancia aunque se niegue una activación; los costes pagados tampoco se devuelven. La restricción OATH de ataque de Corn tiene su tratamiento separado. La [revisión técnica](REFERENCIAS_REGLAS_REVISION23.md) documenta estas distinciones.

## Comandos de verificación

```sh
python3 tools/build.py
cmp Analizador_YuGiOh.html dist/Calculadora_de_Barajas_YuGiOh_Alpha_1263_Corregida.html
node tests/priority_chain.cjs
node tests/trigger_order.cjs
node tests/damage_step.cjs
node tests/xyz_summon.cjs
node tests/pendulum_summon.cjs
node tests/draw_sequences.cjs
node tests/data_review_r23.cjs
node tests/scenario_examples.cjs
python3 tests/release23_browser.py
python3 tests/accessibility_r23.py
python3 tests/run_all.py --no-build
python3 tests/compatibility_browser.py --require-cross-browser
```

El runner contiene 86 comandos, más los grupos de sintaxis y conservación del artefacto: 88 en total. El workflow conserva los comandos de verificación y las puertas obligatorias de recuperación e idempotencia del catálogo, comparación del HTML, batería y comprobación estricta entre motores. La preparación usa la imagen oficial de Playwright 1.62.0 Noble fijada por el digest `sha256:aa81288e738725378becba5b3e06cb0f3a7f012a610e87e8d767a090ea3f740d`, con los tres navegadores y sus bibliotecas incorporados. No ejecuta APT ni utiliza la caché pip de setup-python. Comprueba que el directorio efímero `/github/home` sea un directorio real y ajusta únicamente su propietario al UID/GID del contenedor cuando procede; no recorre subdirectorios ni cambia la variable HOME. Después intenta arrancar los tres motores, publica cada resultado real y falla si cualquiera no supera la comprobación de título y versión. Antes del catálogo verifica que GITHUB_WORKSPACE coincida con el directorio de trabajo, exige los metadatos Git y añade únicamente esa ruta exacta a safe.directory; comprueba también que Git reconozca esa misma raíz. No habilita confianza global por comodín. La preparación también exige `python tests/browser_offline.py --probe --output tests/native-offline-preflight-results.json` antes de la batería. Ese control debe aprobar con el helper ligado por su SHA-256; no sustituye ninguno de los 88 grupos. Los límites son 75 minutos para el trabajo y 45 para la batería; no omiten grupos ni convierten un fallo en éxito.

La aceptación de R23 corresponde al candidato `c9537266d03535c305cb8e882c09be1a81376669` y al [workflow remoto](https://github.com/socramgns/MODERN/actions/runs/44686493687). Pasaron los diez pasos obligatorios, incluida la batería de **88 grupos** y la puerta adicional entre motores. El runner versionado contiene 86 comandos más sintaxis y conservación del artefacto. La anotación pública compacta `R23_CI_RESULT` declara 88 grupos sin fallos y vincula build, SHA-256 del HTML, commit y ejecución; se contrasta con ese contrato y los estados remotos. CI utiliza la imagen oficial de Playwright 1.62.0 fijada por digest y verifica el arranque real, título y versión de Chromium, Firefox y WebKit, además de sus preparaciones idempotentes. La puerta estricta exige al menos dos motores ejecutados y éxito en todos los ejecutados; la cobertura se interpreta junto a esos tres arranques y el bucle de motores del runner. No se descargaron el informe completo remoto ni los JSON de sus filas individuales: se conserva el resumen compacto y el SHA-256 anunciado del informe completo, sin afirmar que ese hash se recomputó sobre bytes descargados. El resumen móvil focal se registra por separado.

El HTML aprobó **42/42 comprobaciones GUI** y **24/24 comprobaciones nuevas de accesibilidad automatizada** en ejecuciones nuevas con el helper de conexión nativa revisado, sobre el mismo build y SHA-256 que el candidato aceptado. Los informes GUI/accesibilidad anteriores permanecen archivados y no se presentan como ejecuciones de ese helper. Una ejecución móvil focal anterior de Chromium y WebKit informó **35/35** sobre los mismos bytes: se observaron su resumen de anotación y las etapas del trabajo; el HTML y su propio archivo de pruebas móvil permanecen idénticos. La comparación de los scripts GUI importados delimita sus cambios al import y a la fábrica de página del helper; no se descargó el JSON de las 35 filas móviles individuales. Los **206 casos de las siete suites Node** y los seguimientos de Azure (**74 casos**) y Campo (**39 casos**) conservan sus informes originales de máquina virtual de fuente. La aplicación sólo difiere en CSS de presentación y sus archivos Node de prueba siguen idénticos; los 22 scripts GUI tienen el cambio de preparación de página verificado por separado. El runner, sus argumentos URL, presupuestos y aserciones permanecen intactos. Los registros originales no se relabelan ni se atribuyen a una ejecución con el helper nuevo, y no se suman como una batería local completa.

El candidato anterior `7b34e2075579771064a18d06d188dc018ba4e0b3` falló 87/88 grupos remotos; la cifra se infiere de la anotación pública de grupos fallidos y el runner de 88 grupos, sin reconstruir un JSON completo. Ese artefacto y su evidencia son históricos. Su ejecución local completa se interrumpió por la reconexión del entorno al llegar a `release17_in_browser`; no se recuperó un informe final único. Se conservan por separado el registro original de un prefijo de **58 comandos** y una reanudación de **28 comandos**. La reanudación terminó con `pass:false` por `mobile_accessibility`, al faltar WebKit local. No se combinan ambos registros para atribuir un resultado global a una batería local completa. Los fallos originales y sus seguimientos permanecen identificados. No se ejecutó ni se atribuye una batería local completa nueva al HTML con el CSS corregido.

Las comprobaciones GUI actuales entregan los bytes exactos por interceptación de rutas y mantienen el contexto nativo sin conexión. El helper aplica además el comando oficial CDP al crear la página y al confirmar el marco principal para conservar el estado que comunica el motor; no sustituye propiedades JavaScript. Una comprobación previa obligatoria verifica una petición HTTP real, su fallo sin conexión y su restauración, sin interceptar esa petición de control. El fallo histórico de navegación `file://` en Chromium, atribuido a la política de aquel entorno, se conserva por separado; estas GUI no acreditan una prueba nueva de archivo local en Chromium. La entrega directa mediante Firefox pertenece al comando obligatorio del runner remoto aceptado; no se presenta como inspección de su JSON individual. No se eludieron políticas del navegador.

## Evidencia y continuidad

Los resultados actuales están indexados en [evidence/README.md](../evidence/README.md). El [manifiesto de referencias](../evidence/revision23/references/manifest.json) conserva fuentes y recibos técnicos originales con tamaños y SHA-256. Los documentos Lua/C++ no se ejecutan en el analizador y no acreditan nuevos rulings oficiales TCG.

Permanecen abiertos C27–C31. Se conservan **98 identidades heredadas**, **51 monstruos con estadísticas desconocidas** y **32 propuestas**, sin sustituciones de identidad o estadísticas por coincidencia de nombre. El expediente de revisión permite aportar y cotejar decisiones, pero no autentica por sí solo documentos oficiales ni modifica silenciosamente el catálogo. Faltan fuentes fechadas y verificadas para disponibilidad, pools y reglas particulares de formato, además de la evaluación completa con tecnologías de asistencia y pruebas en equipos físicos. Las comprobaciones automáticas, emuladas o entre motores no sustituyen esos datos ni esas experiencias.

La puntuación competitiva permanece estructural y **provisional por decisión del usuario**. El importador de resultados reales está preparado. Los ejemplos y diagnósticos no son resultados de torneos ni una calibración competitiva independiente.

R22 conserva su [HTML aceptado](https://github.com/socramgns/MODERN/raw/35ad8188207f6a47be47b6bc361a011cf01c948b/Analizador_YuGiOh.html?download=1), su [CI de 79 grupos](https://github.com/socramgns/MODERN/actions/runs/43558962065) y su evidencia original en `evidence/history/revision22-accepted/`. Su informe local histórico permanece `pass:false`, 76/79; no se reescribe como un resultado de R23. También se preservan R20, R21 y los intentos previos de R22 con sus propios vínculos y limitaciones.

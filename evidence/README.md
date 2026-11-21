# Evidencia de la revisión 24

La aceptación corresponde al candidato inmutable `9977424e6bacee97dc607fa94cd894c46d3db557` y al [CI remoto](https://github.com/socramgns/MODERN/actions/runs/44848581354). Build `2d7de2e019f18f6524de0f72d8575ec12a981d145e360cd897397b2680a8c0c7`; SHA-256 del HTML `0d955d44e782d57db880a68b2dac80ad288172e570da647e6753cc8d1f6eb63c`; **7.546.537 bytes**, **135 archivos JavaScript** y **32 ejemplos**.

La aceptación completa procede del CI remoto: **95/95 grupos**, con 93 comandos más sintaxis y conservación del artefacto. Se observaron el resumen público compacto `R24_CI_RESULT`, vinculado al commit, ejecución, build y SHA-256, y los estados satisfactorios de los diez pasos obligatorios. No se descargaron el informe remoto completo ni los JSON de sus filas individuales; el hash anunciado del informe completo no se presenta como recomputado sobre bytes descargados.

La puerta estricta exige al menos dos motores ejecutados y éxito en todos los ejecutados. Además, un paso distinto del workflow exige tres arranques reales —Chromium, Firefox y WebKit— y comprueba título y versión de cada navegador; pasaron ese paso y las tres preparaciones. Estas afirmaciones combinan el código versionado con los estados remotos observados; no implican haber recuperado cada informe individual de motor.

## Índice y vínculo exacto

| Documento | Qué acredita |
| --- | --- |
| `release-acceptance.json` | Decisión de aceptación del candidato, artefacto y alcance de las verificaciones. |
| `project-criteria.json` | Las 32 definiciones originales: 27 verificadas y C27–C31 pendientes. |
| `remote-acceptance.json` y `revision24/remote-ci/acceptance-observation.json` | La misma observación portátil de los HTML públicos de ejecución/trabajo, estados obligatorios y `R24_CI_RESULT`. Las capturas referidas conservan sus hashes y tamaños. |
| `revision24/build-manifest.json` | Build, SHA-256, tamaño, fuentes y datos del artefacto aceptado. |
| `revision24/local/candidate-download.json` | Recibo HTTPS HTTP 200 y coincidencia de bytes del candidato comprometido, raíz y `dist`; no es una certificación de todas las reglas. |
| `revision24/local/gui-final-results.json` | Las 28 comprobaciones GUI sobre bytes entregados, sin inyección de fuente, con exportaciones/replays vinculados al artefacto. |
| `revision24/local/final-node-regressions-summary.json` | Las 51 suites Node de fuente y logs originales; igualdad con el candidato antes/después. No equivale a los 95 grupos completos del HTML. |
| `revision24/local/native-offline-control.json` | Control HTTP real del helper nativo sin conexión; conserva su ámbito de preparación. |
| `revision24/references/manifest.json` | Fuentes técnicas secundarias fijadas, recibos, bytes, SHA-256 y límites. Los scripts se conservan como documentos y no se ejecutan en la aplicación. |
| `../src/data/review/revision24/` | Consultas oficiales bloqueadas, cotejos secundarios por passcode exacto y expediente real sin parches sustentados. |

El resumen compacto declara grupos, fallos y vínculos del artefacto; no contiene las filas individuales del informe remoto. Su hash anunciado se conserva como anuncio del workflow. No se afirma que se haya descargado ese informe completo ni que se haya recalculado su hash a partir de sus bytes. Las instalaciones, el arranque de los tres motores y la puerta estricta son pasos distintos con estados comprobados.

## Pruebas locales e historia

La comprobación focal GUI pasó **28/28**, sobre los bytes entregados exactos, sin inyectar módulos de fuente. Sus páginas usan interceptación de rutas y el helper nativo sin conexión; no acredita por sí sola navegación `file://`, tecnologías de asistencia ni equipos físicos. La batería Node de fuente pasó **51/51 grupos**, ligada al candidato y con igualdad de fuentes/pruebas comprobada antes y después. Ambos registros son independientes: no se suman como una ejecución local completa de los 95 grupos.

Los registros fallidos o incompletos de integración y las revisiones anteriores mantienen su candidato y ámbito originales. Las repeticiones o seguimientos que se solapan no se suman como casos independientes. La documentación aceptada R23 conserva sus bytes en `history/revision23-accepted/`: `README.md`, `docs/ESTADO_PROYECTO.md`, `docs/DESARROLLO.md`, `docs/ALCANCE_COMBOS.md` y `evidence/README.md`. Los historiales anteriores conservan sus propias rutas; no respaldan por atribución los cambios de este HTML.

## Límites de aceptación

Se conservan las 32 definiciones originales: **27/32 verificadas y cinco pendientes (84,375 % del listado operativo sin ponderar)**. C27–C31 permanecen abiertos. Este cociente no mide todas las cartas o reglas del juego, esfuerzo, tiempo restante ni una tasa de victoria.

Siguen pendientes las **98 identidades heredadas**, las estadísticas de **51 monstruos** y **32 propuestas**, además de fuentes fechadas para disponibilidad, pools, Skills, Legend y reglas particulares de formato. El cotejo técnico nuevo sustentó cero cambios reales de identidad o estadísticas; no se transfieren cifras por nombre. C30 y C31 requieren evaluación real con tecnologías de asistencia y pruebas en dispositivos físicos. La puntuación principal sigue siendo estructural y **provisional por decisión del usuario**; el importador de resultados reales no equivale a calibración competitiva.

Los documentos de fuente no autentican nuevas identidades oficiales ni rulings TCG completos. La prueba GUI con bytes interceptados no se etiqueta como navegación local por archivo, sesión de lector de pantalla o uso de un dispositivo físico. La prueba de archivo local pertenece a su comando obligatorio del runner remoto y no a una recuperación de su JSON individual. Las rutas de probabilidad, búsqueda y reglas conservan perfiles y presupuestos declarados.

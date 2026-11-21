# Desarrollo y entrega · revisión 24

El HTML único se genera desde `src`, `manifest.json` y `tools/build.py`. El uso final no requiere herramientas de desarrollo. Build `2d7de2e019f18f6524de0f72d8575ec12a981d145e360cd897397b2680a8c0c7`; SHA-256 del HTML `0d955d44e782d57db880a68b2dac80ad288172e570da647e6753cc8d1f6eb63c`; **7.546.537 bytes**, **135 archivos JavaScript** y **32 ejemplos**.

## Módulos y contratos

Los cuatro módulos añadidos son `priority-fusions.js`, `priority-responses-expanded.js`, `card-profiles-expanded.js` y `metalfoes-effects.js`. Utilizan los registros de prioridad, disparos y llegadas físicas existentes; el catálogo se hidrata antes de registrar perfiles dependientes de sus datos. Las referencias secundarias archivadas se leen como documentación, nunca como código de reglas ejecutable.

`priorityMode`, `triggerOrderMode` y `damageStepMode` mantienen sus dependencias declaradas. Los adaptadores separan costes/objetivos de activación y elecciones de resolución; no llaman a los paquetes atómicos anteriores para simular una cadena. El registro físico conserva UID, propietario, controlador, destino e historial apropiado. Los disparos de ambos jugadores se recogen antes de cerrar SEGOC y se difieren durante una cadena en curso. Las restricciones de Shaman impiden abrir oportunidades Extra prohibidas sin crear un bloqueo pendiente.

Invocation, Branded Fusion y Metalfoes Fusion eligen materiales al resolver. Branded aplica su restricción de todo el turno; Lubellion conserva su descarte y uso por nombre y aplica las restricciones restantes al resolver sin negación. Un efecto de Mágica/Trampa mantiene su tipo y sus propias respuestas. Las restricciones de estos perfiles se detallan en [Uso R24](USO_REGLAS_REVISION24.md).

Librarian y Cyber Twin registran su procedimiento/historial para Reborn. El reemplazo de Chengying no activa una cadena ni paga un coste de activación; su estadística continua usa el cálculo central existente. Los efectos que barajan antes de robar conservan una resolución desconocida pendiente. El expediente de datos exactos genera una copia revisable y no modifica silenciosamente el catálogo ni la baraja.

## Reproducción y comprobaciones

```sh
python3 tools/build.py
cmp Analizador_YuGiOh.html dist/Calculadora_de_Barajas_YuGiOh_Alpha_1263_Corregida.html
node tests/priority_fusions.cjs
node tests/priority_responses_expanded.cjs
node tests/card_profiles_expanded.cjs
node tests/metalfoes_effects.cjs
node tests/data_formats_r24.cjs
node tests/priority_extension_contracts.cjs
node tests/scenario_examples.cjs
python3 tests/release24_browser.py
python3 tests/run_all.py --no-build
python3 tests/compatibility_browser.py --require-cross-browser
```

El runner versionado ejecuta **93 comandos**, más `source_syntax` y `artifact_unchanged_during_tests`: **95 grupos**. Ningún grupo se omite para convertir un fallo en éxito. El workflow conserva recuperación/idempotencia del catálogo fijado, comparación del HTML, batería completa y puerta estricta entre motores. Los presupuestos son **100 minutos para el trabajo** y **70 minutos para la batería completa**.

La preparación mantiene la imagen oficial de Playwright 1.62.0 Noble fijada por `mcr.microsoft.com/playwright/python@sha256:aa81288e738725378becba5b3e06cb0f3a7f012a610e87e8d767a090ea3f740d` y el helper nativo `tests/browser_offline.py`, SHA-256 `d8505a6c1ddfb170acc7a6b7c4641723a6681e816d0ea0b283b2d166b59da2f3`. El control obligatorio es `python tests/browser_offline.py --probe --output tests/native-offline-preflight-results.json`: verifica HTTP real bloqueado sin conexión y restaurado después. La preparación de páginas no sustituye propiedades JavaScript del navegador.

El workflow exige que `GITHUB_WORKSPACE` sea la raíz real de trabajo con metadatos Git, añade únicamente esa ruta exacta a `safe.directory` y comprueba la raíz reconocida por Git. `/github/home` debe ser un directorio real sin enlace simbólico; el ajuste, cuando procede, afecta sólo a su propietario en el montaje efímero y no cambia HOME ni recorre subdirectorios. No usa confianza global por comodín ni APT para rehacer los navegadores de la imagen.

La puerta estricta exige al menos dos motores ejecutados y éxito en todos los ejecutados. Además, un paso distinto del workflow exige tres arranques reales —Chromium, Firefox y WebKit— y comprueba título y versión de cada navegador; pasaron ese paso y las tres preparaciones. Estas afirmaciones combinan el código versionado con los estados remotos observados; no implican haber recuperado cada informe individual de motor.

## Qué ejecución respalda la aceptación

La aceptación completa procede del CI remoto: **95/95 grupos**, con 93 comandos más sintaxis y conservación del artefacto. Se observaron el resumen público compacto `R24_CI_RESULT`, vinculado al commit, ejecución, build y SHA-256, y los estados satisfactorios de los diez pasos obligatorios. No se descargaron el informe remoto completo ni los JSON de sus filas individuales; el hash anunciado del informe completo no se presenta como recomputado sobre bytes descargados.

La comprobación focal GUI pasó **28/28**, sobre los bytes entregados exactos, sin inyectar módulos de fuente. Sus páginas usan interceptación de rutas y el helper nativo sin conexión; no acredita por sí sola navegación `file://`, tecnologías de asistencia ni equipos físicos. La batería Node de fuente pasó **51/51 grupos**, ligada al candidato y con igualdad de fuentes/pruebas comprobada antes y después. Ambos registros son independientes: no se suman como una ejecución local completa de los 95 grupos.

Los informes actuales están ligados al candidato `9977424e6bacee97dc607fa94cd894c46d3db557`. Las ejecuciones históricas o de integración anteriores mantienen sus registros; no se relabelan ni se suman con las pruebas actuales. El [índice de evidencia](../evidence/README.md) conserva rutas y ámbitos. La [documentación de desarrollo R23](../evidence/history/revision23-accepted/docs/DESARROLLO.md) conserva los comandos y conteos históricos.

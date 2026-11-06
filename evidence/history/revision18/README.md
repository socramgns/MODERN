# Evidencia de la revisión 18

La aceptación es `REMOTE_FULL_EXECUTION_OBSERVED`. `remote-acceptance.json` identifica el commit candidato, el workflow y las pruebas versionadas, la ejecución pública, las diez etapas obligatorias exitosas y las capturas HTML con sus hashes. El workflow comparó el HTML publicado con la compilación y exigió la batería completa de 69 grupos y comprobación entre motores. Los resultados remotos individuales no se descargaron; no se atribuyen al entorno remoto los informes locales de esta carpeta.

La ejecución local completa terminó con 67/69 grupos aprobados. `validation-summary.json` y `local-validation-summary.json` son copias intactas de su informe original, con `pass: false`. Firefox y WebKit no estaban disponibles; `local-file-delivery.json`, `mobile-accessibility.json` y `compatibility.json` conservan ausencias, fallos e información de cobertura pendiente. La aceptación remota no reescribe esos resultados.

Los informes de interfaz y los 9 informes `*-source-tests.json` corresponden a las pruebas locales aprobadas sobre el mismo build. Los últimos distinguen Node sobre fuentes de tareas sobre bytes compilados en Chromium. La revisión 17 anterior está preservada en `history/revision17` y su commit original.

Spirit with Eyes of Blue revived through Monster Reborn, its current Main Zone presence and live Dragon-only restriction; physical history, cost, search and replay remain explicit.

Los campos y materiales iniciales siguen siendo declaraciones cuando corresponde; la historia apropiada se obtiene mediante transiciones registradas. Los perfiles sin revisar, la prioridad general y otras reglas permanecen fuera de alcance. La puntuación competitiva sigue provisional. Las comprobaciones móviles son emuladas y no acreditan teléfonos físicos ni conformidad WCAG completa.

La aceptación remota pertenece al commit candidato probado. Un commit posterior de documentación/evidencias debe conservar los mismos hashes de HTML, fuentes, pruebas y workflow; su propia nueva ejecución CI se observa por separado.

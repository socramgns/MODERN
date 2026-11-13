# Evidencia de la revisión 21

La aceptación corresponde al candidato `c3c2ebeb9aaaf7df57481fdefadabf93292d66b3`, build `8e2f493167e60a1752237885db37d72063514109118aa937707e93c9819c4908` y HTML `3838c78ea58ec52af9019fbc5ad2f132db26b6022eb3d9c1ff939543d8894531` (7,165,831 bytes). El workflow y el runner conservan sus puertas; los cuatro grupos nuevos producen 77 grupos totales.

`remote-acceptance.json` combina las diez etapas públicas exitosas del commit exacto con la revisión del runner, fuentes y hashes. Los HTML originales de GitHub están en `remote-ci/`; los recibos de observación y revisión originales, sin alterar, están en `recovery/`. La observación remota original no contó grupos; la revisión independiente sí contrasta 77. No se descargaron informes remotos individuales.

`validation-summary.json` es un índice de aceptación, no el informe local del runner. El informe completo local R21 no se recuperó: su estado es `NOT_RECOVERED_AFTER_EXECUTOR_REPLACEMENT`, con `pass:null` y sin cantidades inventadas. `local-recovery-validation.json` registra únicamente la compilación reproducible y las repeticiones actuales de 86 casos Node, 29 de escenarios y 39 checks GUI.

La evidencia focal R21 inicial está íntegra en `history/revision21-candidate-focused/`. La accesibilidad de 30 checks y la auditoría de cinco CDB se conservan en raíz con sus bindings originales: son comprobaciones previas sobre los mismos bytes, no nuevas ejecuciones locales. La accesibilidad completa, tecnologías de asistencia y equipos físicos siguen pendientes.

La evidencia activa de R20 se trasladó por bytes originales del commit aceptado a `history/revision20/`. Su informe local sigue con `pass:false`, 71/73 grupos; no se reetiqueta como R21 ni se convierte en éxito. La puntuación competitiva continúa provisional por petición del usuario. Los 19/32 criterios cuentan filas operativas, no esfuerzo ni todas las reglas del juego.

El commit posterior de documentación y evidencias conserva los bytes del candidato aceptado. Su ejecución CI se observa por separado y no sustituye la aceptación del candidato. La descarga del candidato está contrastada en `recovery/candidate-download-verification.json`; las tres exportaciones reales de la GUI recuperada están en `recovery-gui-exports/`.

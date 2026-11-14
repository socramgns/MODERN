# Evidencia de la revisión 22

La aceptación corresponde al candidato `86b8f848635d1ac392625b6d9c1a6bb5674e5b04` y al [CI completo](https://github.com/socramgns/MODERN/actions/runs/43558962065). Los diez pasos obligatorios terminaron con éxito. El runner exacto exige 77 comandos más sintaxis y conservación del artefacto: **79 grupos**. El recuento se infiere del runner versionado y su salida satisfactoria; no se descargaron los informes remotos individuales.

Build `afe53b8932901869aae05b80e3605ca6cb18625ec7984e41484ce71bf212fa94`; SHA-256 `7ec0ed4d6bee8ef655445bc7831aa6f5ad9fd6db332722212abbc43d316c1b04`; **7,192,465 bytes**. Se conservan **124 archivos JavaScript** y **22 ejemplos**. El HTML de raíz, el compilado, el Git candidato y la descarga HTTPS coinciden.

## Índice actual

- `release-acceptance.json`: aceptación remota del candidato exacto y límites de la evidencia.
- `validation-summary.json`: índice de aceptación, no un informe local fabricado.
- `remote-acceptance.json`, `remote-evidence-index.json` y `remote-ci/`: observación pública y copias byte idénticas de los HTML de ejecución y trabajo.
- `local-validation/full-run-raw.json`: ejecución local completa original, **76/79 con pass:false**, conservada sin modificar.
- `local-validation/release21-inventory-followup.json`: comprobación posterior **39/39** tras exigir las acciones anteriores y el Volteo revisado. No convierte el informe completo anterior en éxito.
- `flip-source-tests.json`: **63/63 casos**, con **14 testigos** reproducidos.
- `revision22-browser.json` y `revision22-gui-exports/`: **30/30 comprobaciones** sobre el HTML y sus informes exportados reales.
- `accessibility-workflow.json`: **30 comprobaciones** del subconjunto automático; no cierra accesibilidad completa ni equipos físicos.
- `unresolved-source-audit.json`: cinco CDB y límites de identidad/estadísticas; no cierra criterios de datos.
- `candidate-download-verification.json` y `reproducible-build.json`: transporte y compilación reproducible.
- `project-criteria.json`: **20/32 criterios verificados, 12 pendientes**; únicamente C21 se cierra de nuevo. Es un recuento operativo sin ponderar, no esfuerzo ni todas las reglas del juego.

## Navegadores y resultados locales

Las instalaciones remotas de Chromium, Firefox y WebKit y el gate entre motores terminaron con éxito. El flag estricto requiere al menos dos motores ejecutados y que todos los ejecutados pasen; no exige literalmente tres. La cobertura de los tres se infiere de las tres instalaciones satisfactorias y del bucle versionado. No se afirma haber observado sus JSON remotos individuales.

El resultado local original conserva los fallos de entrega Firefox, inventario antiguo y tareas WebKit. La repetición focal del inventario pasa 39/39; Firefox y WebKit seguían sin instalarse localmente. Las verificaciones locales parciales no se mezclan con la aceptación completa remota.

Los 30 checks GUI locales verifican bytes reales servidos sin red mediante interceptación de rutas; no prueban navegación directa `file://` en Chromium. La comprobación local de compatibilidad conserva `BLOCKED_BY_BROWSER_POLICY` para ese intento, sin eludir la política. La entrega directa en Firefox corresponde al comando obligatorio `local_file_delivery` del runner remoto aceptado; no se afirma haber descargado su JSON individual.

## Historial y alcance

`history/revision20` conserva sus resultados originales. `history/revision21` preserva sus 22 archivos mediante tamaños y SHA-256; `history/revision22-initial-candidate` y `history/revision22-first-focused` conservan intentos anteriores. Los archivos todavía presentes con nombres `revision21-*`, `multiple-attacks-source-tests.json`, `local-recovery-validation.json`, `recovery/` y `recovery-gui-exports/` son registros históricos R21, no resultados nuevos del candidato R22. Los HTML cuyo nombre contiene el SHA R21 dentro de `remote-ci/` también son históricos.

El nuevo perfil cubre el procedimiento de Volteo declarado y el efecto obligatorio de Magician of Faith. Generalizar prioridad, SEGOC, Damage Step u otros efectos FLIP sigue pendiente. Las referencias Lua/C++ son documentos técnicos secundarios y no se ejecutan en el analizador ni autentican rulings oficiales TCG.

La puntuación competitiva sigue estructural y **provisional por decisión del usuario**. El importador está preparado; no se afirma calibración con resultados de torneo ni validación en equipos físicos.

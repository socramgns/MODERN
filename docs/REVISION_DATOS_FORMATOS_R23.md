# Datos y formatos · revisión 23

Esta revisión incorpora un expediente de decisiones y un diagnóstico de procedencia por formato en el mismo HTML. El catálogo conserva sus 21.986 registros y sus datos originales. No se han reemplazado passcodes, rellenado estadísticas por nombre ni aplicado propuestas a la baraja activa.

## Trabajo realizado

El expediente distingue **181 incidencias**: 98 identidades sin cotejo exacto, 51 monstruos con estadísticas desconocidas y 32 propuestas de migración. Una misma carta puede tener varias incidencias. Cada fila conserva su clave, nombre, fuente declarada, campos ausentes y candidatos originales.

`YGODataQuality.reviewLedger()` exporta el expediente completo. `recordReviewDecision(key, decision)` registra una nota con persona revisora, motivo, fecha y referencias opcionales; `resetReviewDecision(key)` borra esa decisión de forma explícita. `verifyReviewLedger(value)` e `importReviewLedger(value)` reconstruyen el informe contra el catálogo y la compilación actuales. Rechazan cambios de identidad, fuente, candidatos, recuentos, certificaciones, claves desconocidas y vínculos de otra compilación. La importación se valida antes de reemplazar las notas.

Las referencias de una decisión conservan `USER_DECLARED_UNVERIFIED`. Registrar una nota o elegir un candidato para revisar no demuestra equivalencia oficial entre passcodes. El expediente mantiene a cero los campos de identidades resueltas, estadísticas rellenadas y migraciones aplicadas. Las decisiones se conservan mediante exportación e importación JSON, sin modificar la baraja ni el catálogo.

La sección «Calidad de los datos» permite seleccionar una incidencia, registrar o borrar su decisión, y exportar/importar el expediente. La copia de baraja con identidades elegidas mantiene su flujo anterior: las notas del expediente no seleccionan candidatos automáticamente.

## Fuentes y comprobaciones

Se volvieron a contrastar por SHA-256, recuento y `PRAGMA quick_check` las cinco CDB del commit técnico `ae5dedb957c2c48ab86554fee08a0fca73d8b1cf`. Ninguna contiene una coincidencia por passcode exacto de las 98 identidades heredadas. Este resultado repite una comparación negativa ya conocida; **no constituye nueva prueba de identidad ni cierra C27 o C28**.

Se intentaron dos consultas nuevas: la búsqueda de Photon Emperor en la base de Konami y la lista TCG de restricciones. El proxy rechazó los túneles con `403 Forbidden`, antes de obtener contenido oficial revisable. Los recibos no atribuyen ese rechazo al servidor de origen ni afirman que se autenticó una página oficial. No se desactivó TLS ni se eludió la política de red.

Los archivos de [src/data/review](../src/data/review) conservan el expediente inicial, la comprobación de fuentes, los recibos de transporte y el registro de requisitos de los diez formatos de construcción. Son datos documentales. El HTML genera su expediente a partir del catálogo incorporado y no necesita descargarlos para funcionar.

## Disponibilidad y restricciones por separado

`YGOFormats.normalizePoolSnapshot()` comprueba formato, versión, fecha, fuente HTTPS, declaración de completitud y passcodes enteros positivos únicos. Un pool de fecha futura conserva disponibilidad desconocida hasta la fecha declarada; un pool posterior a la fecha histórica seleccionada se rechaza para ese contexto. Los passcodes duplicados, fraccionarios o expresados como cadenas no convierten una lista malformada en un pool completo.

`contextEvidence()`, `restrictionEvidence()` y `availabilityEvidence()` muestran la procedencia y separan dos decisiones diferentes: pertenecer al pool declarado y estar limitado o prohibido en la lista proporcionada. La ausencia en un pool no fabrica una prohibición. La falta de pool puede coexistir con una fila explícita de prohibición en una lista declarada. Una declaración «sin lista general» tampoco inventa ausencia de restricciones de evento.

La sección «Baraja y zonas por formato» permite exportar un contexto fechado, importar uno para el formato seleccionado y exportar el diagnóstico por carta. La importación valida antes de cambiar el contexto y conserva las cantidades y zonas de la baraja. Las fuentes continúan siendo declaraciones; `currentListProven`, disponibilidad oficial y certificación competitiva permanecen en falso.

Los controles de fecha o versión incorrectos no se transforman en una lista actual. El motor causal conserva su alcance TCG; ofrecer validación de construcción para otros formatos no acredita simulación de todas sus reglas.

## Criterios que permanecen pendientes

- **C27:** demostrar la identidad exacta o documentar una decisión final suficientemente sustentada para los 98 registros y las 32 propuestas. El expediente prepara esa revisión y conserva sus dudas.
- **C28:** obtener estadísticas de las 51 identidades exactas mediante fuentes válidas. Las cifras de otro passcode con nombre parecido no se transfieren.
- **C29:** completar pools y reglas fechadas por formato, incluidos formatos digitales, Skills, desbloqueos de Extra, impresión Speed Duel, Legend y reglas históricas/eventuales. El registro de enlaces es un requisito documental, no una autenticación de su contenido.

La puntuación competitiva sigue provisional por decisión del usuario. La revisión de datos y formatos no convierte ejemplos diagnósticos en resultados de torneos.

## Verificación

La suite `tests/data_review_r23.cjs` comprueba el expediente completo, rechazo de datos alterados, importación transaccional, conservación de barajas, referencias no autenticadas, pools futuros/malformados y separación entre disponibilidad y prohibiciones. Los resultados definitivos pertenecen al informe emitido por el runner sobre la fuente final; no se atribuye aquí una aceptación de entrega ni una ejecución de CI que aún no haya ocurrido.

# Evidencia de la revisión 10

La validación local pasó 50/50 grupos sobre el build y SHA-256 indicados; se comprobaron 114 archivos JavaScript. Chromium, Firefox y WebKit aprobaron sus comprobaciones. Firefox abrió directamente el HTML mediante `file:` sin conexión.

La ejecución inicial aprobó 49 grupos. La auditoría del catálogo pasó sus 13 comprobaciones al restaurar y cotejar los cinco archivos de caché omitidos al crear el espacio nuevo. No cambió el HTML ni el código de producción o de pruebas. `validation-initial-attempt.json` y `catalogue-retest.json` conservan ambos resultados.

`release6-browser.json`, `expanded-examples-browser.json` y `revision8-browser.json` comprueban regresiones sobre los bytes nuevos. `revision9-browser.json` comprueba regresiones de Campo. `revision10-browser.json` comprueba objetivos tipados de Mágicas/Trampas, cantidades, guardado, importación y búsqueda con replay. La evidencia histórica de las revisiones anteriores permanece en sus commits publicados.

Las activaciones de Campo se limitan a Mausoleum of White y Salamangreat Sanctuary desde mano, con perfiles de reemplazo conocidos. El proveedor unitario de negación solo de efecto es un fixture QA, no una carta implementada. Las FAQ japonesas conservan su alcance de efectos de monstruos y no certifican el reemplazo de Campo. La puntuación sigue provisional. La aceptación local no equivale por sí sola a un resultado remoto de CI.

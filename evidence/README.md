# Evidencia de la revisión 7

Estos informes identifican el build y SHA-256 del HTML aceptado. La validación local pasó 44/44 grupos; se comprobaron 114 archivos JavaScript. Chromium, Firefox y WebKit aprobaron sus comprobaciones. El flujo `file:` sin conexión se ejecutó en Firefox. El informe `release6-browser.json` ejecuta las regresiones de aquella revisión sobre los bytes nuevos; `revision7-browser.json` comprueba las referencias y ampliaciones de esta entrega.

Las reglas y cadenas tienen un alcance registrado y la puntuación sigue provisional. Las FAQ japonesas son referencias OCG para el criterio modelado, no certificación general TCG. Los logs y otros informes se generan en `tests/` y en los artefactos del workflow. La aceptación local no equivale por sí sola a un resultado remoto de CI.

La ejecución inicial aprobó 43 de 44 grupos. Se ajustó el selector de la prueba de contexto al nuevo panel anidado y se repitió únicamente ese flujo: 18/18 comprobaciones aprobadas. No cambió la aplicación ni el HTML. El resumen final conserva la reejecución y el informe inicial se incluye en `validation-initial-attempt.json`.

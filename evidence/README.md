# Evidencia de la revisión 14

La validación local pasó 60/60 grupos en una ejecución completa sobre el mismo build y SHA-256. Se comprobaron 117 archivos JavaScript, Chromium, Firefox y WebKit y apertura directa offline en Firefox.

`revision14-browser.json` comprueba el análisis hipotético desde nueve acciones físicas, pesos, masa desconocida, estado intacto, exportación, importación y rechazos vinculados a la fuente. Comprueba también el diagnóstico de datos. `mobile-accessibility.json` identifica motores y tareas de viewport, controles táctiles, foco, texto ampliado, replay y exportación. Son emulaciones, sin prueba de teléfonos físicos o tecnologías asistivas ni certificación WCAG global. Los informes anteriores comprueban regresiones sobre los bytes actuales.

Los cuatro informes `*-source-tests.json` distinguen casos Node sobre fuentes de las tareas sobre el HTML compilado. Las hipótesis usan una suposición uniforme explícita, mantienen el orden restante desconocido y nunca sustituyen un robo observado. Las ramas sin testigo conservan masa desconocida. Las propuestas de identidad no cambian passcodes ni completan estadísticas. Los campos iniciales siguen declarados y el registro no cubre todas las reglas. Dos diagnósticos de propietario de Compulsory son QA con transferencia directa y no certifican un efecto de cambio de control.

La revisión 13 y su intento inicial/repetición permanecen en su commit 508e1e9b1ea7707b9e4167e663bb98feb33c4614 y su respaldo, ligados a su propio build. La puntuación competitiva sigue provisional; descarga y CI se verifican por separado.

# Evidencia de la revisión 8

La validación local pasó 46/46 grupos sobre el build y SHA-256 identificados en los informes; se comprobaron 114 archivos JavaScript. Chromium, Firefox y WebKit aprobaron sus comprobaciones. El HTML también se abrió directamente mediante `file:` sin conexión en Firefox.

`release6-browser.json` ejecuta las regresiones de aquella revisión sobre los bytes nuevos; `expanded-examples-browser.json` comprueba referencias y rutas anteriores; `revision8-browser.json` comprueba los ejemplos nuevos, costes, variantes, deshacer, exportación y replay. La evidencia histórica de revisión 7 permanece en su commit publicado.

La puntuación sigue provisional. Los paquetes registrados no certifican todas las reglas ni prioridad general. Droll está limitada a una copia por el snapshot TCG; los casos unitarios de repetición usan la misma copia con una recuperación declarada como fixture de pruebas, no como efecto o combo del producto. Las FAQ japonesas conservan su alcance OCG. La aceptación local no equivale a un resultado remoto de CI.

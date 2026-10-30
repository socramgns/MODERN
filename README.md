# Analizador de barajas Yu-Gi-Oh · revisión 14

La entrega sigue siendo **un único `Analizador_YuGiOh.html`**, con el catálogo y los motores incorporados.

[Descargar el HTML de esta rama: revisión 14](https://github.com/socramgns/MODERN/raw/refs/heads/entrega/analizador-yugioh-estable14/Analizador_YuGiOh.html?download=1)

La revisión 14 pasó **60/60 grupos de pruebas en una ejecución completa** sobre el HTML final, con **117 archivos JavaScript** comprobados. Chromium, Firefox y WebKit aprobaron sus tareas; Firefox completó la apertura directa del HTML local sin conexión. Las tareas móviles se ejecutaron en Chromium y WebKit emulados, sin acreditar teléfonos físicos ni conformidad WCAG completa. Build `20eb64b21d09ad48a1ad0f1eae39864302fd2aa96bd5d37bed83a40aeffbebbf`; SHA-256 `28e03daf44c632ad8edb358e9f216b745b332cc18643eca2e1f188213b15974d`; tamaño **7,037,392 bytes**. Estos resultados se limitan a las capacidades y tareas registradas; la puntuación competitiva sigue provisional.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 14 se comprueban por separado y se registran con el commit correspondiente.

La revisión 13 conserva una [aceptación local de 56/56 grupos](https://github.com/socramgns/MODERN/blob/508e1e9b1ea7707b9e4167e663bb98feb33c4614/evidence/validation-summary.json): 55/56 en la ejecución completa y 14/14 tareas al repetir el único grupo fallido después de corregir una espera de la prueba YDK, sobre los mismos bytes. Su [descarga HTTP verificada](https://github.com/socramgns/MODERN/raw/508e1e9b1ea7707b9e4167e663bb98feb33c4614/Analizador_YuGiOh.html?download=1) corresponde al commit `508e1e9b1ea7707b9e4167e663bb98feb33c4614` y al SHA-256 `5f05c079f9a512c04e3d7978864461746e4bcb8d9cf0589440579663e6dceecb`. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40936973430) terminó correctamente para ese commit. Esa evidencia pertenece a revisión 13 y no sustituye la aceptación de los bytes nuevos.

## Cómo usarlo

1. Guarda el archivo con extensión `.html` y ábrelo en un navegador reciente. Si el enlace muestra código, usa **Guardar como** y conserva el nombre `Analizador_YuGiOh.html`.
2. Importa una baraja JSON o YDK en **Baraja y zonas por formato**, revisa las incidencias y pulsa **CALCULAR**.
3. Abre **Probar un ejemplo incluido** y pulsa **Cargar ejemplo en el laboratorio**. El ejemplo sustituye la baraja actual y prepara un campo declarado; ejecuta sus pasos manualmente. `shuffle` muestra cómo llegar a un próximo robo cuyo orden ya no se conoce después de barajar.
4. Define cartas y cantidades en el objetivo y pulsa **Aplicar objetivo visual**. Consulta sus requisitos al ejecutar, deshacer o reanudar un informe.
5. En **Continuaciones hipotéticas después de barajar**, analiza las posibilidades desde el estado elegible. Lee la parte con objetivo demostrado y la parte desconocida; ninguna representa un robo observado o una tasa de victoria. Guarda o verifica de nuevo el análisis mediante JSON sin reemplazar la partida del laboratorio.
6. Consulta **Acciones registradas de esta baraja** y **Calidad de los datos** para conocer los efectos parciales y las incidencias técnicas. Exporta JSON para conservar la baraja y su contexto; YDK transporta Main, Extra y Side, pero no Skills.

El catálogo y los cálculos incorporados funcionan sin Internet. Las imágenes y actualizaciones remotas requieren conexión. La sesión se guarda en ese navegador/origen; exporta una copia para trasladarla o conservarla fuera de ese almacenamiento.

## Qué incluye esta revisión

- Añade un análisis separado de continuaciones hipotéticas tras un próximo robo de turno con orden desconocido, bajo el supuesto de barajado uniforme y rival `PASS`.
- Conserva una rama por copia física y su peso exacto `1/N`. Solo acredita un objetivo cuando existe una continuación registrada que vuelve a verificarse; los casos no explorados o sin demostración conservan masa desconocida.
- Reconstruye el prefijo real y verifica por separado la hipótesis y las acciones posteriores. Exportar o importar ese análisis no convierte el robo en observado ni sustituye el estado del laboratorio.
- Añade un informe de calidad de datos con incidencias, estadísticas desconocidas y propuestas de migración existentes. Los conteos se derivan del catálogo vigente; las propuestas no cambian automáticamente passcodes ni barajas.
- Amplía la aceptación de accesibilidad y pantallas móviles mediante emulación de navegador, diferenciándola de pruebas en teléfonos físicos.
- Añade el ejemplo `shuffle` y conserva los trece anteriores, los 21.986 registros, las seis familias parciales y las funciones registradas previas.

El análisis hipotético se limita a un próximo robo propio en Draw Phase, desde un turno posterior al primero, con orden desconocido y sin cadenas o disparos pendientes. La búsqueda conserva límites de profundidad, estados y tiempo. El resto del Deck permanece con orden desconocido; otro robo no cubierto, una búsqueda incompleta o una regla fuera de alcance no se convierten en derrota. Alcanzar el objetivo al propio robo puede no requerir acciones posteriores, pero sigue siendo una hipótesis identificada como tal.

Se conservan Compulsory e Impermanence, sus costes y columnas, la protección de Stardust Spark Dragon, la negación GY de Blue-Eyes Spirit Dragon, Mechaba y Roar, el seguimiento de objetivos y la reanudación de informes del laboratorio. Los informes hipotéticos tienen un verificador y un alcance separados de los pasos observados.

La puntuación competitiva sigue **estructural y provisional**, como solicitó el usuario. El importador está preparado para datos reales; esta ampliación no crea resultados de torneo. La revisión completa de efectos, prioridad, SEGOC, Damage Step, disponibilidad y otros formatos conserva los límites documentados. Una coincidencia técnica en el catálogo no certifica todos los rulings ni la legalidad en un evento.

## Evidencia y desarrollo

`dist/validation-summary.json` identifica el resultado local con build y SHA-256. En la rama de entrega, `evidence/validation-summary.json` conserva la aceptación del HTML correspondiente. Los informes móviles identifican emulación, motores y tamaños ejecutados; no acreditan uso en teléfonos físicos.

- [Estado y pendientes](docs/ESTADO_PROYECTO.md)
- [Análisis de lo que falta](docs/ANALISIS_PENDIENTES_REVISION14.md)
- [Alcance de reglas y búsquedas](docs/ALCANCE_COMBOS.md)
- [Fuentes oficiales](docs/FUENTES_OFICIALES.md)
- [Compilación, datos y pruebas](docs/DESARROLLO.md)

El avance se expresa por capacidades y comprobaciones. No se asigna un porcentaje global a todas las cartas y reglas del juego; la configuración de CI tampoco demuestra que una ejecución nueva haya aprobado.

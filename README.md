# Analizador de barajas Yu-Gi-Oh · revisión 16

La entrega sigue siendo **un único `Analizador_YuGiOh.html`**, con catálogo y motores incorporados. La revisión 16 conecta una invocación Synchro registrada de Stardust Spark Dragon con su salida al Cementerio, resurrección mediante Monster Reborn y protección posterior.

[Descargar el HTML de esta rama: revisión 16](https://github.com/socramgns/MODERN/raw/refs/heads/entrega/analizador-yugioh-estable16/Analizador_YuGiOh.html?download=1)

La aceptación de la revisión 16 se apoya en la ejecución remota del commit `329f1ba15e960a949ceecc971005eee0fb622e03`: el [workflow de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/41889817768) completó con éxito las etapas obligatorias de instalación de los tres motores, compilación y comparación del HTML, batería de **65 grupos** y comprobación entre motores. El recuento corresponde al runner versionado y sus salidas obligatorias; los informes remotos individuales no se descargaron. Las fuentes incluyen **120 archivos JavaScript**. La ejecución local completa conserva su resultado **63/65 grupos aprobados**, con Firefox y WebKit no disponibles; su informe original permanece con `pass: false`, sin conciliación ni conversión a éxito. Build `d49d56207cfff495f8a356974dc554fd77c063b9a9022da8ed041d26e1a1171e`; SHA-256 `fab64088c402372a2cf8d3c8c997bdf13612c11701640bb8172694fcf00aa0cc`; tamaño **7,089,078 bytes**. La puntuación competitiva sigue provisional; no se acreditan todas las reglas, dispositivos físicos ni conformidad WCAG completa.

La aceptación local, publicación, descarga HTTP y GitHub Actions se comprueban por separado para el build y commit correspondientes. La configuración de CI o el número previsto de grupos no demuestra su aprobación.

## Cómo usarlo

1. Guarda el archivo con extensión `.html` y ábrelo en un navegador reciente. Si el enlace muestra código, usa **Guardar como** y conserva el nombre `Analizador_YuGiOh.html`.
2. Importa una baraja JSON o YDK en **Baraja y zonas por formato**, revisa sus incidencias y pulsa **CALCULAR**.
3. En **Probar un ejemplo incluido**, selecciona `synchro` y pulsa **Cargar ejemplo en el laboratorio**. El ejemplo sustituye la baraja actual y prepara materiales y campo iniciales declarados. La invocación Synchro y los pasos posteriores sí se ejecutan y se vuelven a verificar; esa distinción se conserva en el informe.
4. Invoca de modo Normal a Flamvell Guard desde la mano y úsalo junto a Dark Magician de nivel 7 para invocar a Spark. La guía hace que Spark ataque a un Blue-Eyes más fuerte, llegue al Cementerio y reviva mediante Monster Reborn en Main Phase 2. Su historial apropiado se conserva, pero la llegada por Reborn figura como Invocación Especial y no como otra Synchro.
5. Para comprobar la protección en batalla, sigue hasta el turno rival, completa su robo físico conocido y activa entonces el escudo de Spark. El primer Blue-Eyes consume su cargo sin destruir a Spark; otro ataque puede destruirlo. La protección caduca al cambiar de turno y comparte un solo cargo entre destrucción por batalla y por efecto. No evita daño de batalla ni una devolución a mano.
6. Define cartas y cantidades en el objetivo y pulsa **Aplicar objetivo visual**. Revisa sus requisitos al ejecutar, deshacer o reanudar un informe.
7. En **Continuaciones hipotéticas después de barajar**, analiza únicamente estados elegibles. La parte demostrada y la desconocida no representan un robo observado ni una tasa de victoria; exportar o verificar ese JSON conserva la partida del laboratorio.
8. Consulta **Acciones registradas de esta baraja** y **Calidad de los datos**. La revisión de identidades permite elegir propuestas presentes y preparar una copia JSON importable. La baraja activa, el catálogo y el laboratorio conservan su contenido al preparar o descargar esa copia.

Se conservan los quince ejemplos anteriores, incluidos `spark`, `reborn` y `shuffle`. El catálogo y los cálculos incorporados funcionan sin Internet; imágenes y actualizaciones remotas necesitan conexión. La sesión pertenece a ese navegador/origen. JSON conserva contexto y Skills; YDK transporta Main, Extra y Side, pero no Skills.

## Qué incluye esta revisión

- Registra `SYNCHRO_STARDUST_SPARK_DRAGON` (83994433) con un Tuner y uno o más no Tuner admitidos, de niveles que suman 8. Comprueba copias físicas distintas, materiales boca arriba, restricciones y espacio después de retirar materiales.
- Registra una invocación Synchro apropiada ejecutada, en lugar de aceptar una bandera inicial como prueba. Monster Reborn puede usar ese historial cuando Spark llega después al Cementerio por una transición registrada.
- Conserva destinos de materiales, propietarios, Tokens registrados y las consecuencias admitidas. Los perfiles y efectos no revisados permanecen excluidos; no se infieren procedimientos desde el texto del catálogo.
- Reutiliza la protección de Spark y su cargo de destrucción compartido, con usos y duración vinculados a la presencia en campo. La resurrección no restaura una protección de una presencia anterior.
- Añade el decimosexto ejemplo `synchro`, conservando los quince anteriores, los 21.986 registros, las seis familias parciales, Monster Reborn y las copias revisadas de barajas.

Se mantienen Impermanence, Compulsory, las respuestas físicas de Mechaba y Roar, la negación de activaciones en Cementerio de Blue-Eyes Spirit Dragon, el seguimiento de objetivos, la búsqueda acotada y la reanudación de informes. La invocación Synchro es un procedimiento; sus efectos posteriores conservan sus propias ventanas y respuestas registradas.

La puntuación competitiva sigue **estructural y provisional**, por decisión del usuario. El importador para resultados reales está preparado; esta entrega no crea datos de torneo. Prioridad y cadenas generales, SEGOC, Damage Step, Flip, Xyz, Pendulum, disponibilidad y otros formatos conservan los límites documentados.

## Evidencia y desarrollo

`dist/validation-summary.json` identifica la aceptación local por build y SHA-256. En la rama de entrega, `evidence/validation-summary.json` conserva el resultado del HTML correspondiente. Las pruebas de fuentes y las tareas sobre el HTML compilado se distinguen. Los informes móviles describen emulación y no acreditan teléfonos físicos ni conformidad WCAG completa.

La revisión 15 conserva su [aceptación local de 63/63 grupos](https://github.com/socramgns/MODERN/blob/17eeb86257ba4bca01feffeb2c10f64d38fb3fbb/evidence/validation-summary.json), con 119 archivos JavaScript comprobados, 28 tareas de la interfaz nueva, 64 casos de Monster Reborn y 22 de copias revisadas. Su [descarga HTTP verificada](https://github.com/socramgns/MODERN/raw/17eeb86257ba4bca01feffeb2c10f64d38fb3fbb/Analizador_YuGiOh.html?download=1) corresponde al commit `17eeb86257ba4bca01feffeb2c10f64d38fb3fbb` y al SHA-256 `2a4e2c76869e9fdfce9435152fd2c0b654180a0a71c1e0c082b08555c263b804`. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/41102084215) terminó correctamente para ese commit. Sus tareas móviles fueron 35/35 comprobaciones emuladas, sin acreditar hardware físico. Esa evidencia pertenece a revisión 15 y no sustituye la aceptación de los bytes nuevos.

- [Estado del proyecto](docs/ESTADO_PROYECTO.md)
- [Análisis de pendientes](docs/ANALISIS_PENDIENTES_REVISION16.md)
- [Alcance de reglas y búsquedas](docs/ALCANCE_COMBOS.md)
- [Fuentes oficiales](docs/FUENTES_OFICIALES.md)
- [Compilación, datos y pruebas](docs/DESARROLLO.md)

El avance se expresa mediante capacidades y criterios de aceptación, sin asignar un porcentaje global a todas las cartas y reglas del juego.

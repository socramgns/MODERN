# Analizador de barajas Yu-Gi-Oh · revisión 15

La entrega sigue siendo **un único `Analizador_YuGiOh.html`**, con el catálogo y los motores incorporados. La revisión 15 amplía las jugadas registradas con Monster Reborn y permite preparar una copia de la baraja con identidades revisadas.

[Descargar el HTML de esta rama: revisión 15](https://github.com/socramgns/MODERN/raw/refs/heads/entrega/analizador-yugioh-estable15/Analizador_YuGiOh.html?download=1)

La revisión 15 pasó **63/63 grupos de pruebas en una ejecución completa** sobre el HTML final, con **119 archivos JavaScript** comprobados. Chromium, Firefox y WebKit aprobaron sus tareas; Firefox completó la apertura directa del HTML local sin conexión. Las tareas móviles se ejecutaron en Chromium y WebKit emulados, sin acreditar teléfonos físicos ni conformidad WCAG completa. Build `c4b3a88282d993fd538a0ecc5c80b62f99239bfbbfeb0fd47bdbfc70816388ed`; SHA-256 `2a4e2c76869e9fdfce9435152fd2c0b654180a0a71c1e0c082b08555c263b804`; tamaño **7,075,902 bytes**. Estos resultados se limitan a las capacidades y tareas registradas; la puntuación competitiva sigue provisional.

La aceptación local, la publicación, la descarga HTTP y GitHub Actions se comprueban por separado para el build y el commit correspondientes. Una configuración de CI o una cantidad prevista de pruebas no demuestra su aprobación.

## Cómo usarlo

1. Guarda el archivo con extensión `.html` y ábrelo en un navegador reciente. Si el enlace muestra código, usa **Guardar como** y conserva el nombre `Analizador_YuGiOh.html`.
2. Importa una baraja JSON o YDK en **Baraja y zonas por formato**, revisa las incidencias y pulsa **CALCULAR**.
3. Abre **Probar un ejemplo incluido** y pulsa **Cargar ejemplo en el laboratorio**. El ejemplo sustituye la baraja actual y prepara un campo declarado; ejecuta sus pasos manualmente. `reborn` permite comparar la resurrección, la negación con coste y la devolución de una carta a la mano de su propietario. Se conservan los catorce ejemplos anteriores, incluido `shuffle`.
4. Define cartas y cantidades en el objetivo y pulsa **Aplicar objetivo visual**. Consulta sus requisitos al ejecutar, deshacer o reanudar un informe.
5. En **Continuaciones hipotéticas después de barajar**, analiza las posibilidades desde un estado elegible. La parte demostrada y la parte desconocida no representan un robo observado ni una tasa de victoria. Guardar o verificar su JSON conserva la partida del laboratorio.
6. Consulta **Acciones registradas de esta baraja** y **Calidad de los datos**. La revisión de identidades permite elegir explícitamente entre propuestas presentes en la baraja y preparar una copia JSON importable. Revisa la vista previa y sus incidencias antes de descargarla. La baraja activa, el catálogo y el laboratorio conservan su contenido.

El catálogo y los cálculos incorporados funcionan sin Internet. Las imágenes y actualizaciones remotas requieren conexión. La sesión se guarda en ese navegador/origen; exporta una copia para trasladarla o conservarla fuera de ese almacenamiento. JSON conserva contexto y Skills; YDK transporta Main, Extra y Side, pero no Skills.

## Qué incluye esta revisión

- Registra Monster Reborn (83764718) desde mano en Main Phase propia para un subconjunto revisado de objetivos de ambos Cementerios. Conserva UID y propietario e invoca bajo el control de quien activa la carta, en una zona principal libre.
- Comprueba posiciones, restricciones y las respuestas físicas de Mechaba y Roar. Negar la activación o el efecto mantiene los pagos efectuados. No añade un límite por turno ficticio.
- Distingue una Invocación apropiada ejecutada por el motor de una historia inicial declarada. Los Fusion/Synchro/Link admitidos requieren el historial apropiado correspondiente; una resurrección es una Special Summon y no una nueva Fusion/Synchro/Link Summon.
- Añade una copia revisable de identidades con elecciones explícitas, verificación ligada al origen e incidencias de construcción. Conserva cantidades, zonas, formato, contexto y Skills; no aplica propuestas automáticamente ni certifica la legalidad de la copia.
- Añade el decimoquinto ejemplo `reborn` y conserva los 21.986 registros, las seis familias parciales y las funciones registradas previas.

Los objetivos con condiciones de Invocación Especial, disparos o consecuencias sin revisar permanecen fuera de este paquete. Reconocer una carta o mostrar su texto técnico no implementa todos sus efectos. Se conservan Compulsory e Impermanence, sus costes y columnas, la protección de Stardust Spark Dragon, la negación GY de Blue-Eyes Spirit Dragon, el seguimiento de objetivos y la reanudación de informes.

La puntuación competitiva sigue **estructural y provisional**, como solicitó el usuario. El importador está preparado para resultados reales; esta entrega no crea datos de torneo. La revisión completa de prioridad, cadenas generales, SEGOC, Damage Step, Flip, Pendulum, disponibilidad y otros formatos conserva los límites documentados. Una coincidencia técnica no certifica rulings ni disponibilidad en un evento.

## Evidencia y desarrollo

`dist/validation-summary.json` identifica la aceptación local por build y SHA-256. En la rama de entrega, `evidence/validation-summary.json` conserva el resultado del HTML correspondiente. Los informes móviles identifican emulación, motores y tamaños ejecutados; no acreditan teléfonos físicos ni conformidad WCAG completa.

La revisión 14 conserva su [aceptación local de 60/60 grupos](https://github.com/socramgns/MODERN/blob/97999625580fbab3b035edae25748148571cb205/evidence/validation-summary.json), con 117 archivos JavaScript comprobados, tres motores de escritorio, apertura directa offline en Firefox y 35/35 comprobaciones móviles emuladas. Su [descarga HTTP verificada](https://github.com/socramgns/MODERN/raw/97999625580fbab3b035edae25748148571cb205/Analizador_YuGiOh.html?download=1) corresponde al commit `97999625580fbab3b035edae25748148571cb205` y al SHA-256 `28e03daf44c632ad8edb358e9f216b745b332cc18643eca2e1f188213b15974d`. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40992556499) terminó correctamente para ese commit. Esa evidencia pertenece a revisión 14 y no sustituye la aceptación de los bytes nuevos.

- [Estado y pendientes](docs/ESTADO_PROYECTO.md)
- [Análisis de lo que falta](docs/ANALISIS_PENDIENTES_REVISION15.md)
- [Alcance de reglas y búsquedas](docs/ALCANCE_COMBOS.md)
- [Fuentes oficiales](docs/FUENTES_OFICIALES.md)
- [Compilación, datos y pruebas](docs/DESARROLLO.md)

El avance se expresa por capacidades y comprobaciones. No se asigna un porcentaje global a todas las cartas y reglas del juego.

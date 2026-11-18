# Alcance de jugadas · revisión 22

La revisión 22 queda aceptada por la ejecución remota del commit `86b8f848635d1ac392625b6d9c1a6bb5674e5b04`: el [workflow de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/43558962065) completó los diez pasos obligatorios, incluida la batería de **79 grupos**, las instalaciones de Chromium, Firefox y WebKit y la puerta estricta entre motores. El recuento se contrasta con el runner versionado; no se descargaron los informes remotos individuales. Las fuentes incluyen **124 archivos JavaScript** y se conservan **22 ejemplos**. Build `afe53b8932901869aae05b80e3605ca6cb18625ec7984e41484ce71bf212fa94`; SHA-256 `7ec0ed4d6bee8ef655445bc7831aa6f5ad9fd6db332722212abbc43d316c1b04`; tamaño **7.192.465 bytes**. La descarga del candidato se comprobó por HTTP 200 y coincidencia exacta de bytes.

## Volteo y recuperación de Faith

Se admite la Invocación por Volteo en las Main Phases de ambos jugadores para Normales técnicamente cotejados sin Péndulo, Hayabusa Knight, Cyber Twin Dragon y Magician of Faith. Exige una colocación de un turno anterior, ausencia de pendientes y los límites registrados de ataques y cambios manuales de posición. Mantiene UID, propietario, controlador, espacio y origen; no consume la Invocación Normal ni acredita una Invocación Especial apropiada.

El FLIP de Faith sólo nace de un volteo real. Es obligatorio, sin coste y sin límite por turno. Selecciona al activar una Magia física del Cementerio de su controlador; los objetivos revisados son Invocation, Monster Reborn y Branded Fusion. Se comprueba de nuevo al resolver, se muestra al rival y vuelve a la mano sin buscar ni barajar. La activación obligatoria persiste aunque Faith esté negada. Sólo se usa objetivo nulo cuando no existe ninguna Magia legal en todo el Cementerio propio; Magias sin movimiento revisado no fabrican esa ausencia. Invocarla boca arriba, colocarla o declararla en campo no dispara FLIP.

Cuando un ataque la revela, el daño, ataque gastado y prevención o reemplazos se registran antes del FLIP. Faith permanece en campo durante la activación y sólo después se completa el envío pendiente por batalla. La ventana acotada admite las negaciones de activación revisadas de Mechaba y Roar y sus contrarrespuestas registradas; conserva costes, origen, límites y salidas sin un segundo envío. No ofrece ventanas libres de Crow, Veiler, Imperm ni Chixiao dentro de ese paquete.

Búsqueda y evaluación de objetivos no presentan como final un estado con el FLIP obligatorio o batalla pendiente. Los informes intermedios sí pueden exportarse y reanudarse tras reconstruir su historial. El ejemplo `faith-flip` declara su estado inicial y no ejecuta acciones automáticamente.

El perfil no incorpora prioridad general, SEGOC, Damage Step completo ni el FLIP de cualquier monstruo de Efecto. Las [referencias técnicas](REFERENCIAS_FLIP_REVISION22.md) son fuentes secundarias tratadas como documentos; no autentican rulings oficiales TCG.

## Ataques múltiples y rutas conservadas

La revisión 21 registra el segundo ataque de Hayabusa Knight y Cyber Twin Dragon durante cada Battle Phase. Cada declaración consume un ataque de la copia física, incluso si una protección evita la destrucción. Negar sus efectos reduce el límite a uno sin devolver ataques gastados; retirar la copia del campo y volver a invocarla comienza una estancia nueva. El registro usado para impedir cambios manuales de posición se conserva por separado.

El límite de ataques se aplica a ambos jugadores con monstruos boca arriba en Ataque durante una Battle Phase permitida. Se comprueban objetivos, estadísticas y efectos de campo registrados antes de enumerar o ejecutar. Se conserva el inventario físico, los propietarios, LP y consecuencias de protección o destrucción. La negación reduce el límite disponible sin borrar el gasto; pasar de fase no concede ataques adicionales en el mismo turno.

Hayabusa puede llegar por una Invocación Normal registrada. Cyber Twin puede declararse en el campo inicial; ese supuesto no acredita una Fusión anterior. No se amplían los perfiles de Monster Reborn ni sus condiciones de resurrección.

Los dos perfiles permiten un segundo ataque contra el mismo monstruo superviviente, otro objetivo legal o directamente si el campo rival está vacío. No conceden un tercer ataque. Otros efectos de ataques adicionales, ataques limitados a monstruos, prioridad general, SEGOC completo, Damage Step completo, otros perfiles FLIP, Xyz y Péndulo continúan fuera de los perfiles verificados. No se añade un procedimiento de Fusión de Cyber Twin ni se acredita una historia previa por declararlo en el campo inicial.

La búsqueda acotada distingue los estados con distinto gasto de ataques. La reproducción verifica desde el origen las acciones, eventos, pagos y estado final; importar un informe no permite introducir un tercer ataque ni recuperar presupuesto alterando el informe.

Se conservan las rutas registradas de Invoked, Swordsoul, Branded, Tenyi, Salamangreat y Blue-Eyes, junto a Spark, Azure, Spirit, Wolf y Albaz. No se acreditan todos los efectos de esas familias ni una estrategia global óptima.

La puntuación competitiva permanece estructural y provisional por decisión del usuario. El importador de resultados reales está preparado; los escenarios diagnósticos no son resultados de torneos.

La revisión 20 conserva su [HTML publicado y verificado](https://github.com/socramgns/MODERN/raw/71b244b7594b5bae1f5042d1248bcf5fa4a50a64/Analizador_YuGiOh.html?download=1), SHA-256 `1bcd4ee98c2d8b694c7fd31b8c948fd4387ae94c0a944171f9dc1385aa8d9ac0`, y su [aceptación remota de 73 grupos](https://github.com/socramgns/MODERN/actions/runs/42337909290). Su resultado local original sigue en 71/73 con `pass:false` por Firefox y WebKit ausentes; no se convierte ese resultado en éxito.

Los [perfiles y rutas documentados anteriormente](https://github.com/socramgns/MODERN/blob/71b244b7594b5bae1f5042d1248bcf5fa4a50a64/docs/ALCANCE_COMBOS.md) se conservan en la revisión 20; esta revisión mantiene sus funciones y añade el alcance indicado arriba.

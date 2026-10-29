# Estado de la revisión 12

La aplicación se entrega como un único `Analizador_YuGiOh.html`. El original y las entregas anteriores se conservan; la puntuación permanece estructural y provisional por decisión del usuario.

La revisión 12 pasó **54/54 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `937c9e64aa9594ce8d60ad5fadf8fc66f8f220b7420461576f76f45ed700e247`; SHA-256 `73182845a1d7e2ede4496b50f04009f68dfeb9db7f1b1bc4c6fa9fdb68805007`; tamaño **6,981,312 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 12 se comprueban por separado y se registran con el commit correspondiente.

| Área | Implementación de esta revisión | Alcance |
| --- | --- | --- |
| Trampa Normal | Activación directa de Infinite Impermanence desde mano o una colocación anterior | Paquete concreto de Velocidad 2; desde mano exige no controlar cartas y desde colocada conserva turno y columna |
| Resolución de Impermanence | Niega el monstruo rival admitido hasta fin del turno; desde colocada puede aplicar la negación de columna | Requiere resolver la negación y conservar la fuente en campo al resolver para añadir la columna; no registra todos los efectos o inmunidades |
| Respuesta previa de Impermanence | Conserva sus ventanas y respeta bloqueos de columna anteriores | Si el efecto de la Trampa queda negado, no niega el monstruo ni añade otra negación de columna; la carta termina en GY |
| Mechaba y Roar | Mechaba paga una Trampa física admitida; Roar participa en las respuestas y contrarrespuestas acotadas | Costes, orígenes, destinos y límites registrados; Mechaba no responde a Roar de Velocidad 3 |
| Laboratorio y ejemplos | Doce ejemplos, con once identificadores anteriores conservados y uno de Trampa | Campos iniciales declarados; las tres acciones de la guía y los pasos siguientes se ejecutan manualmente |
| Seguimiento del objetivo | Cantidades y requisitos de cartas, LP, fase, turno y jugador activo | Se recalcula al ejecutar, deshacer o importar; el resumen importado no se usa como prueba |
| Rutas anteriores | Seis familias parciales, Spark, Spirit y respuestas registradas | Conserva quince paquetes de monstruos, tres Mágicas Normales y dos activaciones de Campo; no equivale al juego completo |
| Catálogo y lista | Conserva 21.986 registros y snapshot TCG del 19/10/2026 | Los datos técnicos no acreditan todos los efectos ni disponibilidad oficial |
| Calibración | Importador preparado y puntuación provisional | Necesita barajas y resultados externos reales con procedencia |
| Fuentes y mantenimiento | Capturas TCG fechadas, tres FAQ OCG de monstruos y compilación reproducible | Las nuevas pruebas de Trampa y el cotejo documental tienen alcances distintos |

Una columna ya negada también anula el efecto de Roar, incluida su contrarrespuesta de Velocidad 3. La carta se activa y consume su uso; al resolver no niega ni destruye el eslabón anterior, y termina en el destino registrado. Otra Counter Trap admitida todavía puede negar esa activación.

## Aceptación y antecedentes

`dist/validation-summary.json`, los informes de navegador y `evidence/` identifican el build y SHA-256 del HTML probado. La distribución y el resultado remoto de CI tienen sus propias comprobaciones.

La revisión 11 conserva una [aceptación local de 52/52 grupos](https://github.com/socramgns/MODERN/blob/9d177f20094c6697ae5cc5a26f4f2c1c789ee66d/evidence/validation-summary.json), aprobados en una ejecución completa sobre el mismo HTML. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40741033245) terminó **correctamente** para el commit `9d177f20094c6697ae5cc5a26f4f2c1c789ee66d`. Esa evidencia corresponde a revisión 11 y no sustituye la comprobación de los bytes nuevos.

Chromium mantiene una restricción administrativa de navegación local en este entorno. Firefox permite comprobar la apertura directa offline; WebKit conserva una limitación de emulación offline local. Los informes distinguen esas limitaciones de las comprobaciones ejecutadas sobre los bytes entregados.

## Pendientes posteriores

- Otras Trampas de Velocidad 2, más efectos, Mágicas de Campo y perfiles de salida revisados.
- Prioridad, cadenas generales, SEGOC, Damage Step, Flip, ataques múltiples y Pendulum.
- Continuación probabilística después de barajar, conservando la incertidumbre del orden.
- Decisiones rivales óptimas, metajuego y datos competitivos externos para calibrar y validar por separado.
- Disponibilidad, pools y reglas históricos/digitales, Skills, desbloqueos, Legend e impresión/evento.
- Reglamento y rulings restantes, identidades heredadas y aceptación en más dispositivos y sistemas reales.

El análisis actual está en [ANALISIS_PENDIENTES_REVISION12.md](ANALISIS_PENDIENTES_REVISION12.md). Los análisis anteriores permanecen como antecedentes ligados a sus propias revisiones. No se atribuye un porcentaje global a completar todas las cartas y reglas.

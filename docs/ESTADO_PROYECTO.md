# Estado de la revisión 13

La aplicación se entrega como un único `Analizador_YuGiOh.html`. El original y las entregas anteriores se conservan; la puntuación permanece estructural y provisional por decisión del usuario.

La revisión 13 obtuvo aceptación local de **56/56 grupos** sobre el HTML final. La primera ejecución completa aprobó **55/56**: la prueba de exportación YDK podía comparar una baraja antes de terminar su importación. Se corrigió la espera de la prueba y se repitió la suite completa de entrega, con **14/14 tareas aprobadas sobre los mismos bytes**, sin modificar la aplicación. Se comprobó la sintaxis de **114 archivos JavaScript**, Chromium, Firefox y WebKit, y la apertura directa del HTML local sin conexión en Firefox. Build `62d595ef64824400782f54808fd32e70a9b2fcb21ef98ba2aeaec753c41ec79a`; SHA-256 `5f05c079f9a512c04e3d7978864461746e4bcb8d9cf0589440579663e6dceecb`; tamaño **6,989,766 bytes**. Los informes conservan el intento inicial y la repetición; la aceptación se limita al alcance registrado.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 13 se comprueban por separado y se registran con el commit correspondiente.

| Área | Implementación de esta revisión | Alcance |
| --- | --- | --- |
| Trampas Normales | Compulsory Evacuation Device se añade a Infinite Impermanence | Dos paquetes concretos de Velocidad 2; Compulsory solo desde colocada en turno anterior, Impermanence conserva su excepción desde mano |
| Devolución de monstruos | Objetivo propio o rival con perfil de salida admitido | Main a mano de su propietario, Fusion/Synchro/Link admitidos a su Extra oculto y Tokens registrados dejan de existir; no equivale a destrucción |
| Costes y negación | Mechaba paga una Trampa física admitida; Roar conserva respuestas y contrarrespuestas | Costes y usos permanecen al negar; una columna previamente negada puede anular el efecto de la Trampa sin impedir su activación |
| Protecciones y salidas | Spark no impide devolver y Balelynx no reemplaza la devolución | Mirrorjade devuelto al Extra oculto no crea una nueva destrucción End; salidas desconocidas siguen excluidas |
| Laboratorio y ejemplos | Trece ejemplos, con los doce identificadores anteriores conservados y `evacuation` nuevo | Preparación inicial declarada; los pasos de la guía se ejecutan manualmente |
| Seguimiento del objetivo | Cantidades y requisitos de cartas, LP, fase, turno y jugador activo | Se recalcula al ejecutar, deshacer o importar; el resumen importado no se usa como prueba |
| Rutas anteriores | Seis familias parciales, Spark, Spirit y respuestas registradas | Conserva quince paquetes de monstruos fuera del campo, tres Mágicas Normales y dos activaciones de Campo; no equivale al juego completo |
| Catálogo y lista | Conserva 21.986 registros y snapshot TCG del 19/10/2026 | Los datos técnicos no acreditan todos los efectos ni disponibilidad oficial |
| Calibración | Importador preparado y puntuación provisional | Para validarla hacen falta barajas y resultados externos reales con procedencia; no bloquea las mejoras del HTML |
| Fuentes y mantenimiento | Capturas TCG fechadas, tres FAQ OCG de monstruos y compilación reproducible | Las pruebas del modelo y el cotejo documental tienen alcances distintos |

La redirección registrada de Spinny que fue revivido se respeta: su salida lo destierra en lugar de devolverlo a la mano. La traza conserva el destino solicitado y el real; otras redirecciones sin revisar permanecen excluidas.

## Aceptación y antecedentes

`dist/validation-summary.json`, los informes de navegador y `evidence/` identifican el build y SHA-256 del HTML probado. La distribución y el resultado remoto de CI tienen sus propias comprobaciones. Declarar dos nuevas suites en el runner no demuestra que hayan aprobado; el criterio de cierre exige ejecutar toda la batería contra los mismos bytes compilados.

La revisión 12 conserva una [aceptación local de 54/54 grupos](https://github.com/socramgns/MODERN/blob/f538b8002106b4e0a9244e39fc3d82aecb8de78e/evidence/validation-summary.json), con 114 archivos JavaScript comprobados, Chromium, Firefox y WebKit y apertura directa del HTML sin conexión en Firefox. Su descarga HTTP fue cotejada con los bytes aceptados y su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40822517564) terminó **correctamente** para el commit `f538b8002106b4e0a9244e39fc3d82aecb8de78e`. Esta evidencia pertenece a revisión 12 y no sustituye la aceptación de los bytes nuevos.

Chromium mantiene una restricción administrativa de navegación local en este entorno. Firefox permite comprobar la apertura directa offline; WebKit conserva una limitación de emulación offline local. Los informes distinguen esas limitaciones de las comprobaciones ejecutadas sobre los bytes entregados.

## Pendientes posteriores

- Más efectos, Trampas, Mágicas de Campo y perfiles de salida revisados; las seis familias conservan cobertura parcial.
- Prioridad, cadenas generales, SEGOC, Damage Step, Flip, ataques múltiples y Pendulum.
- Continuación probabilística después de barajar, conservando la incertidumbre del orden.
- Decisiones rivales óptimas y validación con metajuego y datos competitivos externos reales.
- Disponibilidad, pools y reglas históricos/digitales, Skills, desbloqueos, Legend e impresión/evento.
- Reglamento y rulings restantes, identidades heredadas y aceptación en más dispositivos y sistemas reales.

El análisis actual está en [ANALISIS_PENDIENTES_REVISION13.md](ANALISIS_PENDIENTES_REVISION13.md). Los análisis anteriores permanecen como antecedentes ligados a sus propias revisiones. No se atribuye un porcentaje global a completar todas las cartas y reglas.

# Cambios de la revisión 7

La revisión `2026.10-stable.7` amplía Mechaba y los ejemplos incorporados. Conserva las funciones anteriores, la entrega de un único HTML y la puntuación estructural provisional.

La revisión 7 pasó **44/44 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `9361b6748958d6adfd53f3c0efdcfb54a1115df58d9e8f37e142884fbf90142b`; SHA-256 `928bd2c76835e8ab75ef15ae58d288c6dc3a5dfcdcb384152b5ad2c0cec3fa6e`. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la comprobación de descarga y la ejecución remota de GitHub Actions se registran por separado; la aceptación local no acredita por sí sola esos pasos.

- Mechaba reconoce trece paquetes explícitos de efectos de monstruos activados en mano o Cementerio. Comprueba identidad, copia física, jugador, zona y restricciones del handler; no infiere cobertura a partir del texto del catálogo.
- El origen de activación se captura antes de los costes. Una fuente que salió de ese lugar como coste conserva su destino aunque Mechaba niegue la activación. El coste de respuesta tampoco se devuelve.
- Longyuan conserva descarte y límite de uso cuando se niega su activación de mano, sin invocarse ni crear Token. Su disparo GY negado conserva el uso y no causa daño; Spirit Dragon también reconoce ese paquete individual.
- Los ejemplos incorporados pasan de tres a ocho. Se conservan los identificadores originales y se añaden rutas Swordsoul, Branded, Tenyi, Salamangreat y una comparación de Roar/contrarrespuesta. Cargar un ejemplo prepara un campo físico declarado; cada jugada se ejecuta manualmente.
- La interfaz distingue la creación opcional de Token de Longyuan, los destinos de zona y las decisiones opcionales registradas.
- Se conservan tres FAQ oficiales OCG en japonés —16041, 22388 y 23949— con hashes de bytes, campos y citas. La compilación vuelve a comprobar esos documentos y el HTML presenta sus referencias. Las explicaciones en español acompañan al original; no se presentan como evidencia primaria ni como certificación general TCG.
- El workflow admite las ramas de entrega estable para continuar recompilando y comparando el único HTML publicado. Los resultados concretos dependen de la ejecución de cada revisión.

## Antecedente: revisión 6 aceptada

La [evidencia histórica de revisión 6](https://github.com/socramgns/MODERN/blob/acb9e81573b43318041fc7ab57500dc1f97adc11/evidence/validation-summary.json) se conserva en su commit de entrega; los informes actuales corresponden a revisión 7.

La revisión `2026.10-stable.6` amplía el catálogo y las acciones registradas, simplifica el laboratorio y añade evidencia documental y de distribución. Conserva el HTML único y la puntuación estructural provisional.

- Se incorporan 2.333 passcodes exactos de la fuente técnica principal fijada: total 21.986 registros. Se mantienen los IDs anteriores, alias, nombres heredados y la actualización idempotente. La auditoría distingue completitud de la fuente de la disponibilidad oficial.
- Se coteja por HTTPS una publicación oficial de la lista TCG del 19/10/2026: 255 nombres restringidos, con 156 prohibidas, 92 limitadas y 7 semilimitadas. Los bytes y metadatos quedan conservados; la compilación vuelve a contrastarlos sin reautenticar un recibo local.
- Mechaba y otras respuestas admitidas pueden actuar en sus ventanas registradas fuera de Main. Veiler mantiene Main rival. Las acciones de familia admitidas pueden continuar en Main 2.
- Se amplían Gazelle, Balelynx, Shthana y Roar. Las protecciones/reemplazos y los costes conservan copias físicas y eventos revisables.
- Se añaden cadenas registradas de Mechaba/Roar y Roar/Roar con resolución LIFO, velocidades, límites de uso, limpieza y replay estricto.
- El laboratorio incorpora objetivos visuales, más zonas y columnas para preparar campos, etiquetas, filtros/paginación y controles de teclado/foco.
- Un panel calcula las probabilidades del próximo robo o de obtener al menos una identidad en varios robos. El orden desconocido conserva su incertidumbre bajo un supuesto explícito de barajado uniforme.
- La búsqueda distingue límites de profundidad, turnos y presupuesto y no convierte una exploración incompleta en una prueba de derrota.
- Se añade aceptación directa del HTML offline en Firefox y se amplían las comprobaciones de compatibilidad y tareas de interfaz.
- El repositorio conserva fuente/pruebas y un workflow que recompila, compara el HTML y ejecuta la batería. El README público explica el analizador.

La versión no certifica todas las reglas, todos los formatos ni una puntuación competitiva. El estado exacto de las pruebas pertenece al informe de su compilación.

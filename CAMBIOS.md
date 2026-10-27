# Cambios de la revisión 8

La revisión `2026.10-stable.8` amplía Mechaba frente a Crow y Droll desde mano. Conserva el HTML único y la puntuación estructural provisional.

La revisión 8 pasó **46/46 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `d7c220eb32a7876a39fb6caaeee7bbde7ee96bde1fe5353672ed44e2369f9d6b`; SHA-256 `aa5e34480df69200c7355daf8fdbc589b584cd276d890ab22977867a9ea3aeca`; tamaño **6.940.108 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la comprobación de descarga HTTP y la ejecución remota de GitHub Actions se registran por separado; la aceptación local no acredita por sí sola esos pasos.

`dist/validation-summary.json` identifica esta aceptación local de revisión 8. En la rama de entrega, `evidence/validation-summary.json` debe conservar los mismos identificadores. La [evidencia histórica de revisión 7](https://github.com/socramgns/MODERN/blob/719897b2f9880507b15068c4a5ca9e1a3a02d038/evidence/validation-summary.json) se consulta en su commit, sin atribuir los informes antiguos a los bytes nuevos.

- El registro de monstruos de mano/GY pasa de trece a quince paquetes explícitos. Crow y Droll declaran `NONE`: se respetan sus ventanas sin inventar un límite de una vez por turno.
- Crow fija el objetivo antes de resolver. Crow descarta y Droll envía su fuente de mano al GY como costes; si se niega la activación, los pagos permanecen y Mechaba no destierra de nuevo esas fuentes desde otra zona.
- La oportunidad de Droll termina con la cadena, aunque quede negado. Una nueva activación requiere una nueva ventana admitida y una copia disponible; no se añade prioridad arbitraria. `NONE` no exime las cantidades de construcción: el snapshot TCG actual mantiene Droll limitada a una.
- Se incorporan diez ejemplos con los ocho anteriores conservados. Los nuevos muestran Crow frente a dos Mechaba que pueden proteger a Aleister en GY, y Droll tras una búsqueda. Sus campos iniciales son supuestos declarados y los pasos se ejecutan manualmente.
- El workflow separa instalación Python, dependencias de sistema y descarga idempotente de cada motor, añade caché por sistema y requisitos y acota tiempos/reintentos. El CI remoto de revisión 8 no se presenta como ejecutado ni aprobado por escribir esa configuración.
- Field Spells y activaciones de Trampas de Velocidad 2 siguen pendientes. Mechaba no puede responder a la Counter Trap Roar de Velocidad 3.

## Antecedente: revisión 7

La revisión `2026.10-stable.7` amplía Mechaba y los ejemplos incorporados. Conserva las funciones anteriores, la entrega de un único HTML y la puntuación estructural provisional.

La revisión 7 pasó **44/44 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `9361b6748958d6adfd53f3c0efdcfb54a1115df58d9e8f37e142884fbf90142b`; SHA-256 `928bd2c76835e8ab75ef15ae58d288c6dc3a5dfcdcb384152b5ad2c0cec3fa6e`. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La revisión 7 tiene una [aceptación local documentada de 44/44 grupos](https://github.com/socramgns/MODERN/blob/719897b2f9880507b15068c4a5ca9e1a3a02d038/evidence/validation-summary.json), con 114 archivos JavaScript comprobados, Chromium, Firefox y WebKit y apertura directa offline en Firefox. La ejecución inicial aprobó 43 grupos; el flujo de contexto pasó sus 18 comprobaciones al repetirse después de ajustar un selector de la prueba al panel anidado, sin cambiar la aplicación ni el HTML. La evidencia conserva ambos intentos.

La [ejecución remota de revisión 7](https://github.com/socramgns/MODERN/actions/runs/40558997215/job/122382622102) terminó **cancelada** al superar 30 minutos durante «Instalar herramientas de comprobación», antes de ejecutar las pruebas del analizador. No es un CI aprobado ni demuestra un fallo de reglas de la aplicación. La revisión 8 separa las etapas de instalación y añade caché; su resultado remoto debe consultarse por separado.

- Mechaba reconoce trece paquetes explícitos de efectos de monstruos activados en mano o Cementerio. Comprueba identidad, copia física, jugador, zona y restricciones del handler; no infiere cobertura a partir del texto del catálogo.
- El origen de activación se captura antes de los costes. Una fuente que salió de ese lugar como coste conserva su destino aunque Mechaba niegue la activación. El coste de respuesta tampoco se devuelve.
- Longyuan conserva descarte y límite de uso cuando se niega su activación de mano, sin invocarse ni crear Token. Su disparo GY negado conserva el uso y no causa daño; Spirit Dragon también reconoce ese paquete individual.
- Los ejemplos incorporados pasan de tres a ocho. Se conservan los identificadores originales y se añaden rutas Swordsoul, Branded, Tenyi, Salamangreat y una comparación de Roar/contrarrespuesta. Cargar un ejemplo prepara un campo físico declarado; cada jugada se ejecuta manualmente.
- La interfaz distingue la creación opcional de Token de Longyuan, los destinos de zona y las decisiones opcionales registradas.
- Se conservan tres FAQ oficiales OCG en japonés —16041, 22388 y 23949— con hashes de bytes, campos y citas. La compilación vuelve a comprobar esos documentos y el HTML presenta sus referencias. Las explicaciones en español acompañan al original; no se presentan como evidencia primaria ni como certificación general TCG.
- El workflow admite las ramas de entrega estable para continuar recompilando y comparando el único HTML publicado. Los resultados concretos dependen de la ejecución de cada revisión.

## Antecedente: revisión 6 aceptada

La [evidencia histórica de revisión 6](https://github.com/socramgns/MODERN/blob/acb9e81573b43318041fc7ab57500dc1f97adc11/evidence/validation-summary.json) y la [de revisión 7](https://github.com/socramgns/MODERN/blob/719897b2f9880507b15068c4a5ca9e1a3a02d038/evidence/validation-summary.json) se conservan en sus commits; no acreditan los bytes nuevos de revisión 8.

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

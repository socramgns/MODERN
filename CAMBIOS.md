# Cambios de la revisión 12

La revisión `2026.10-stable.12` registra la activación directa de Infinite Impermanence y conserva el HTML único y la puntuación estructural provisional.

La revisión 12 pasó **54/54 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `937c9e64aa9594ce8d60ad5fadf8fc66f8f220b7420461576f76f45ed700e247`; SHA-256 `73182845a1d7e2ede4496b50f04009f68dfeb9db7f1b1bc4c6fa9fdb68805007`; tamaño **6,981,312 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 12 se comprueban por separado y se registran con el commit correspondiente.

- Registra `ACTIVATE_INFINITE_IMPERMANENCE` (10045474) como activación de una Trampa Normal de Velocidad 2, desde mano sin cartas controladas o desde una colocación de un turno anterior.
- Conserva copia, origen, columna y objetivo antes de las respuestas. Negar su activación no devuelve los costes de Mechaba ni aplica la negación del monstruo o de la columna.
- Mechaba puede enviar una Trampa física admitida de su mano al GY para responder a ese paquete; Roar conserva sus respuestas y contrarrespuestas de Velocidad 3 dentro de la cadena acotada.
- La negación de columna solo se aplica si Impermanence estaba colocada antes de activarse, sigue en el campo al resolver y se resuelve la negación de su objetivo. Si el objetivo ya no está, no se añade esa negación de columna.
- Conserva el seguimiento de objetivos y añade un duodécimo ejemplo guiado, manteniendo los once identificadores anteriores, los 21.986 registros y las seis familias parciales.

La carta de Trampa se prepara boca arriba antes de las respuestas y conserva su origen de mano o colocación. Mechaba niega y destierra esa activación mediante el envío de una Trampa física admitida de la mano como coste. Roar niega y destruye la carta cuya activación se negó sin tratarla como una carta que permanece en el campo para aplicar Spark o Balelynx. Las contrarrespuestas conservan costes, límites compartidos y resolución LIFO dentro del contrato registrado.

El proveedor de respuesta de Impermanence conserva sus ventanas y añade la corrección de bloqueos de columna anteriores: una respuesta colocada en una columna ya negada se activa y termina en el GY, pero no niega el efecto del monstruo ni añade otro bloqueo. Desde mano, la respuesta elige de forma determinista la primera columna no bloqueada, o la primera si las cinco están bloqueadas; en este último caso su efecto también queda negado. La activación directa mantiene sus cinco elecciones explícitas de columna.

No se inventa un uso por turno de Impermanence. Una carta colocada este mismo turno no puede usar este paquete; desde mano exige no controlar monstruos ni Mágicas/Trampas, incluidas Mágicas de Campo. El selector conserva las cinco columnas legales de mano y la columna física de la carta previamente colocada. Esta revisión no amplía automáticamente todas las Trampas ni habilita Mechaba contra la Counter Trap Roar de Velocidad 3.

La revisión 11 conserva una [aceptación local de 52/52 grupos](https://github.com/socramgns/MODERN/blob/9d177f20094c6697ae5cc5a26f4f2c1c789ee66d/evidence/validation-summary.json), aprobados en una ejecución completa sobre el mismo HTML. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40741033245) terminó **correctamente** para el commit `9d177f20094c6697ae5cc5a26f4f2c1c789ee66d`. Esa evidencia corresponde a revisión 11 y no sustituye la comprobación de los bytes nuevos.

Una columna ya negada también anula el efecto de Roar, incluida su contrarrespuesta de Velocidad 3. La carta se activa y consume su uso; al resolver no niega ni destruye el eslabón anterior, y termina en el destino registrado. Otra Counter Trap admitida todavía puede negar esa activación.

# Antecedente: cambios de la revisión 11

La revisión `2026.10-stable.11` añade seguimiento visible de los objetivos en el laboratorio y conserva el HTML único y la puntuación estructural provisional.

La revisión 11 pasó **52/52 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `d51427f6537cba496a1e7998ab456cd913c118d733968542bc85922d41989d82`; SHA-256 `84dff70652ed8b7eceab7d6fdbbb4864396c745ecd5440beff482e96da7396ed`; tamaño **6,961,491 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 11 se comprueban por separado y se registran con el commit correspondiente.

- Desglosa cantidades y requisitos cumplidos o pendientes en monstruos, Mágicas/Trampas boca arriba, Mágicas/Trampas colocadas y mano, junto con LP, fase, turno y jugador activo.
- Conserva identidad canónica y copias físicas distintas; el seguimiento usa el mismo significado del objetivo que las búsquedas y recomendaciones.
- Actualiza el seguimiento al iniciar, ejecutar, deshacer, cambiar el objetivo y reanudar un informe. Un contexto caducado no conserva una indicación de objetivo cumplido.
- Distingue boca arriba, colocada y zona de Campo en las Mágicas/Trampas del tablero.
- Informa cuando el objetivo ya está satisfecho en el estado inicial declarado. Las líneas de búsqueda siguen requiriendo acciones reales y replay; ese aviso no fabrica una línea vacía ni se convierte en una victoria o éxito de muestreo.
- Recalcula el progreso desde el estado y objetivo validados. Un resumen de progreso importado no sustituye esa comprobación ni certifica la historia previa.
- Conserva once ejemplos, el catálogo de 21.986 registros, las seis familias parciales y todos los alcances registrados anteriores.

La revisión 10 conserva una [aceptación local de 50/50 grupos](https://github.com/socramgns/MODERN/blob/bfa5d3cd6fd307e529ab68d9b15469b558e8a9d1/evidence/validation-summary.json). La ejecución inicial aprobó 49 grupos; la auditoría del catálogo pasó 13 comprobaciones después de restaurar y cotejar la caché técnica omitida al crear el espacio nuevo, sin cambiar el HTML ni el código. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40736683938) terminó **correctamente**, incluidas las pruebas del entregable y la comprobación entre motores. Esta evidencia corresponde al commit `bfa5d3cd6fd307e529ab68d9b15469b558e8a9d1` y no sustituye la comprobación de los bytes nuevos.

# Antecedente: cambios de la revisión 10

La revisión `2026.10-stable.10` añade objetivos propios de Mágicas/Trampas en campo y conserva el HTML único y la puntuación estructural provisional.

La revisión 10 pasó **50/50 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `5ee44d69c129cc4db4d922c9f064723760b1b1f3596dfb9a0f21ef694ff7fb7a`; SHA-256 `c2cafe3fdba2bc8d5cefaa5f7a4fe5858204fc5a61b50b2723bc04a04dcad807`; tamaño **6,953,153 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado. La ejecución inicial aprobó 49 grupos; la auditoría del catálogo aprobó sus 13 comprobaciones al restaurar y cotejar la caché técnica omitida en el espacio nuevo, sin cambiar el HTML ni el código. La evidencia conserva ambos resultados.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 10 se comprueban por separado y se registran con el commit correspondiente.

- Añade `requiredFaceUpSpellTrapIds` para Mágicas/Trampas propias boca arriba y `requiredSetSpellTrapIds` para las colocadas. Ambas listas incluyen Mágicas de Campo en su zona independiente.
- Conserva `requiredFieldIds` para monstruos propios boca arriba y los objetivos de mano, incluidas las importaciones heredadas con `recoveredHandIds`. Las cantidades se cuentan por copias e identidad canónica dentro de cada zona.
- Comparte la validación entre los paneles y mantiene el objetivo en escenarios, informes y comparaciones. La búsqueda y la evaluación de recomendaciones deben exigir todas las condiciones del objetivo.
- Amplía el selector visual con las dos zonas nuevas y filtra por tipo e inventario. Skills y Tokens no se ofrecen como Mágicas/Trampas.
- Conserva once ejemplos; el ejemplo de Campo exige ahora Sanctuary boca arriba además de Wolf en campo y Roar en mano.
- Conserva las rutas y respuestas previas, la protección de Spark, la negación GY de Spirit y los costes, usos y replay de las activaciones registradas.
- Los objetivos nuevos no registran efectos adicionales de cartas ni certifican el juego completo. La calibración competitiva continúa pendiente de datos externos reales.

La revisión 9 conserva una [aceptación local de 48/48 grupos](https://github.com/socramgns/MODERN/blob/213d323f05fbb57cffce8b19a36afa6f132a989a/evidence/validation-summary.json). Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40614521563) terminó **correctamente** para el commit `213d323f05fbb57cffce8b19a36afa6f132a989a`. Esa evidencia corresponde a revisión 9 y no sustituye la comprobación de los bytes nuevos.

# Antecedente: cambios de la revisión 9

La revisión `2026.10-stable.9` incorpora dos activaciones de Mágicas de Campo registradas y conserva el HTML único y la puntuación estructural provisional.

La revisión 9 pasó **48/48 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `b2e655dc990e6951cf886945774c028ac97a3e55c4f84010a1edb9942f1b0ba7`; SHA-256 `0976989809a5c2c96404149679d4806a89d13a6e3efa61c500e94da3a9793a2b`; tamaño **6.951.935 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La [ejecución remota de revisión 9](https://github.com/socramgns/MODERN/actions/runs/40614521563) terminó **correctamente** para el commit `213d323f05fbb57cffce8b19a36afa6f132a989a`. La publicación y la descarga HTTP conservan sus propios registros.

- Mausoleum of White y Salamangreat Sanctuary activan desde mano como paquetes `FIELD_SPELL`/`SINGLE`/`NONE`, con preparación física antes de Mechaba o Roar.
- El Field Spell anterior admitido, boca arriba o colocado, se envía al GY por regla. No es destrucción ni coste de efecto y no se recupera al negarse la nueva activación.
- La zona de Campo no consume las cinco zonas de Mágicas/Trampas ni sus columnas; Impermanence no convierte esa zona en una columna bloqueada.
- Mechaba conserva el envío de una Mágica física como coste y destierra la nueva carta al negar su activación. Roar la manda a GY por destrucción de la carta cuya activación se negó, sin aplicar protección de Spark ni reemplazo de Balelynx como si siguiera en campo.
- Las contrarrespuestas Roar pueden permitir que resuelva la carta nueva; nunca restauran el Field Spell viejo. Los costes y la traza se conservan.
- Cambiar copias no reinicia los usos globales de Normal adicional de Mausoleum o reincarnación de Sanctuary. La ganancia de ATK de Mausoleum ya resuelta conserva su duración después de salir la fuente.
- Se incluyen once ejemplos, con un nuevo ejemplo de Campo y los diez anteriores conservados. Los escenarios físicos declarados y sus pasos manuales se comprobaron sobre los bytes finales de revisión 9.
- Se conserva el alcance parcial: no se ejecutan automáticamente todos los efectos de los Field Spells ni el efecto GY de Mausoleum, ni activaciones generales de Trampas. Mechaba no puede responder a Roar de Velocidad 3.

La revisión 8 conserva una [aceptación local de 46/46 grupos](https://github.com/socramgns/MODERN/blob/b1a478d95020a7a718b2de0ef01b7793013058fd/evidence/validation-summary.json), con 114 archivos JavaScript comprobados, Chromium, Firefox y WebKit y apertura directa sin conexión en Firefox. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40599777991) terminó **correctamente** para el commit `b1a478d95020a7a718b2de0ef01b7793013058fd`: instalación, actualización idempotente, compilación/comparación del HTML, pruebas y comprobación entre motores aprobadas. Esta evidencia pertenece a revisión 8 y no sustituye la aceptación de revisión 9.

# Antecedente: cambios de la revisión 8

La revisión `2026.10-stable.8` amplía Mechaba frente a Crow y Droll desde mano. Conserva el HTML único y la puntuación estructural provisional.

La revisión 8 pasó **46/46 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `d7c220eb32a7876a39fb6caaeee7bbde7ee96bde1fe5353672ed44e2369f9d6b`; SHA-256 `aa5e34480df69200c7355daf8fdbc589b584cd276d890ab22977867a9ea3aeca`; tamaño **6.940.108 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La [ejecución remota de revisión 8](https://github.com/socramgns/MODERN/actions/runs/40599777991) terminó correctamente. La publicación y la descarga HTTP tienen sus propios registros.

La [evidencia histórica de revisión 8](https://github.com/socramgns/MODERN/blob/b1a478d95020a7a718b2de0ef01b7793013058fd/evidence/validation-summary.json) se conserva en su commit. La [evidencia histórica de revisión 7](https://github.com/socramgns/MODERN/blob/719897b2f9880507b15068c4a5ca9e1a3a02d038/evidence/validation-summary.json) se consulta en su commit, sin atribuir los informes antiguos a los bytes nuevos.

- El registro de monstruos de mano/GY pasa de trece a quince paquetes explícitos. Crow y Droll declaran `NONE`: se respetan sus ventanas sin inventar un límite de una vez por turno.
- Crow fija el objetivo antes de resolver. Crow descarta y Droll envía su fuente de mano al GY como costes; si se niega la activación, los pagos permanecen y Mechaba no destierra de nuevo esas fuentes desde otra zona.
- La oportunidad de Droll termina con la cadena, aunque quede negado. Una nueva activación requiere una nueva ventana admitida y una copia disponible; no se añade prioridad arbitraria. `NONE` no exime las cantidades de construcción: el snapshot TCG actual mantiene Droll limitada a una.
- Se incorporan diez ejemplos con los ocho anteriores conservados. Los nuevos muestran Crow frente a dos Mechaba que pueden proteger a Aleister en GY, y Droll tras una búsqueda. Sus campos iniciales son supuestos declarados y los pasos se ejecutan manualmente.
- El workflow separa instalación Python, dependencias de sistema y descarga idempotente de cada motor, añade caché por sistema y requisitos y acota tiempos/reintentos. Su [ejecución remota](https://github.com/socramgns/MODERN/actions/runs/40599777991) terminó correctamente; ese resultado corresponde al commit de revisión 8.
- Field Spells y activaciones de Trampas de Velocidad 2 siguen pendientes. Mechaba no puede responder a la Counter Trap Roar de Velocidad 3.

## Antecedente: revisión 7

La revisión `2026.10-stable.7` amplía Mechaba y los ejemplos incorporados. Conserva las funciones anteriores, la entrega de un único HTML y la puntuación estructural provisional.

La revisión 7 pasó **44/44 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `9361b6748958d6adfd53f3c0efdcfb54a1115df58d9e8f37e142884fbf90142b`; SHA-256 `928bd2c76835e8ab75ef15ae58d288c6dc3a5dfcdcb384152b5ad2c0cec3fa6e`. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La revisión 7 tiene una [aceptación local documentada de 44/44 grupos](https://github.com/socramgns/MODERN/blob/719897b2f9880507b15068c4a5ca9e1a3a02d038/evidence/validation-summary.json), con 114 archivos JavaScript comprobados, Chromium, Firefox y WebKit y apertura directa offline en Firefox. La ejecución inicial aprobó 43 grupos; el flujo de contexto pasó sus 18 comprobaciones al repetirse después de ajustar un selector de la prueba al panel anidado, sin cambiar la aplicación ni el HTML. La evidencia conserva ambos intentos.

La [ejecución remota de revisión 7](https://github.com/socramgns/MODERN/actions/runs/40558997215/job/122382622102) terminó **cancelada** al superar 30 minutos durante «Instalar herramientas de comprobación», antes de ejecutar las pruebas del analizador. No es un CI aprobado ni demuestra un fallo de reglas de la aplicación. La revisión 8 separó las etapas de instalación y añadió caché; su [ejecución remota](https://github.com/socramgns/MODERN/actions/runs/40599777991) terminó correctamente. Esa aprobación no sustituye una ejecución nueva de revisión 9.

- Mechaba reconoce trece paquetes explícitos de efectos de monstruos activados en mano o Cementerio. Comprueba identidad, copia física, jugador, zona y restricciones del handler; no infiere cobertura a partir del texto del catálogo.
- El origen de activación se captura antes de los costes. Una fuente que salió de ese lugar como coste conserva su destino aunque Mechaba niegue la activación. El coste de respuesta tampoco se devuelve.
- Longyuan conserva descarte y límite de uso cuando se niega su activación de mano, sin invocarse ni crear Token. Su disparo GY negado conserva el uso y no causa daño; Spirit Dragon también reconoce ese paquete individual.
- Los ejemplos incorporados pasan de tres a ocho. Se conservan los identificadores originales y se añaden rutas Swordsoul, Branded, Tenyi, Salamangreat y una comparación de Roar/contrarrespuesta. Cargar un ejemplo prepara un campo físico declarado; cada jugada se ejecuta manualmente.
- La interfaz distingue la creación opcional de Token de Longyuan, los destinos de zona y las decisiones opcionales registradas.
- Se conservan tres FAQ oficiales OCG en japonés —16041, 22388 y 23949— con hashes de bytes, campos y citas. La compilación vuelve a comprobar esos documentos y el HTML presenta sus referencias. Las explicaciones en español acompañan al original; no se presentan como evidencia primaria ni como certificación general TCG.
- El workflow admite las ramas de entrega estable para continuar recompilando y comparando el único HTML publicado. Los resultados concretos dependen de la ejecución de cada revisión.

## Antecedente: revisión 6 aceptada

La [evidencia histórica de revisión 6](https://github.com/socramgns/MODERN/blob/acb9e81573b43318041fc7ab57500dc1f97adc11/evidence/validation-summary.json) y la [de revisión 7](https://github.com/socramgns/MODERN/blob/719897b2f9880507b15068c4a5ca9e1a3a02d038/evidence/validation-summary.json) se conservan en sus commits; no acreditan los bytes nuevos de revisión 9.

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

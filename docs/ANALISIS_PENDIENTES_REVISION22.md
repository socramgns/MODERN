# Qué falta para terminar el analizador · revisión 22 en validación

La revisión 22 incorpora un perfil de Invocación por Volteo y el FLIP de Magician of Faith. Esta descripción documenta el candidato; no sustituye la aceptación del HTML, las pruebas ni la comprobación de su descarga.

La última revisión aceptada es R21, publicada en `5d1a44c4bca27ec81c78983bfa29a969813a15a8`. Su aceptación remota conserva 77 grupos y tres motores; las limitaciones y resultados locales originales permanecen en el historial. El nuevo código debe obtener su propia evidencia vinculada al build y SHA-256 antes de atribuir esos resultados a R22.

## Alcance añadido

- Invocación por Volteo en Main Phase 1 y 2, para Normales técnicamente cotejados sin Péndulo y los perfiles revisados Hayabusa Knight, Cyber Twin Dragon y Magician of Faith. Exige una colocación de un turno anterior y respeta los cambios manuales de posición y ataques registrados.
- Misma copia física, propietario, controlador y espacio; el procedimiento no consume la Invocación Normal ni crea un historial de Invocación Especial apropiada.
- FLIP obligatorio de Faith desde un volteo real. Selecciona una copia de Magia propia en el Cementerio al activar y vuelve a comprobarla al resolver. Los objetivos iniciales revisados son Invocation, Monster Reborn y Branded Fusion.
- Sin coste ni límite por turno. Aun negada previamente, la activación obligatoria conserva su pendiente. La ausencia real de Magias legales produce una activación sin objetivo, no una recuperación inventada ni una omisión del efecto.
- Perfil de batalla después del cálculo de daño y antes del envío al Cementerio: el daño, ataques gastados y prevención o reemplazos se registran primero; las salidas por Mechaba o Roar evitan un segundo envío por batalla.
- Búsqueda y reproducción desde el origen deben resolver el pendiente obligatorio antes de declarar completo un objetivo. El ejemplo `faith-flip` declara su estado inicial y conserva los ejemplos anteriores.

El perfil no da permiso general para voltear cualquier monstruo de Efecto: Aleister y otros FLIP necesitan sus propias consecuencias revisadas. No incorpora prioridad general, SEGOC ni Damage Step completo. Las Magias sin movimiento revisado no se convierten en una falsa ausencia de objetivos. Las [referencias](REFERENCIAS_FLIP_REVISION22.md) explican el contrato técnico y sus límites.

## Lista cerrada de aceptación de la versión operativa

Se conservan los mismos 32 criterios y el mismo peso por fila. La lista cuenta entregables del alcance declarado; no mide esfuerzo, tiempo ni todas las reglas de Yu-Gi-Oh. El cierre de C21 requiere pruebas del procedimiento y efecto, las respuestas pertinentes, búsqueda y replay sobre el HTML finalmente entregado. No se aumenta el recuento por añadir código sin verificar.

RESUMEN_CRITERIOS_R22_CANDIDATO: se mantienen 19 de 32 criterios verificados por R21 (59,375 % del listado), 13 pendientes; C21 está en validación R22. Este porcentaje cuenta criterios del alcance operativo declarado, no un porcentaje universal del juego.

| ID | Entregable | Criterio de cierre | Estado |
| --- | --- | --- | --- |
| C01 | Entrega HTML única | Abrir el archivo sin instalación; catálogo y cálculo incorporados. | VERIFICADO_R21 |
| C02 | Compilación y descarga | Build reproducible, hash del HTML y bytes publicados/descargados iguales. | VERIFICADO_R21 |
| C03 | Catálogo técnico | Fuente CDB fijada, integridad y procedencia contrastadas; incertidumbre explícita. | VERIFICADO_R21 |
| C04 | Editor y construcción | Main, Extra, Side y Skills conservan cantidades y validación de construcción por formato. | VERIFICADO_R21 |
| C05 | Importación | JSON/YDK y escenarios físicos se importan con validación y rechazo de entradas inválidas. | VERIFICADO_R21 |
| C06 | Exportación | JSON/YDK e informes conservan lo que admite cada formato; las limitaciones de YDK se indican. | VERIFICADO_R21 |
| C07 | Estadísticas | Cálculos base verificados y estadísticas desconocidas diferenciadas de cero y variable. | VERIFICADO_R21 |
| C08 | Probabilidad inicial | Probabilidades y muestreo de mano inicial con supuestos, semilla y límites explícitos. | VERIFICADO_R21 |
| C09 | Estado físico y costes | UID, propietario/controlador, inventario, costes y presupuestos se conservan en paquetes registrados. | VERIFICADO_R21 |
| C10 | Búsqueda y replay | Búsqueda acotada y reproducción desde el origen rechazan costes/estados/historias falsificados. | VERIFICADO_R21 |
| C11 | Seis rutas de familias | Los seis ejemplos de familias registradas alcanzan sus objetivos y se reproducen; no todas sus cartas. | VERIFICADO_R21 |
| C12 | Spark y Azure | Synchro real, protección, historial, Reborn y ventanas registradas con sus restricciones. | VERIFICADO_R21 |
| C13 | Spirit | Negación GY y resurrección de Spirit Link conservan costes, origen, uso y restricción continua. | VERIFICADO_R21 |
| C14 | Sunlight Wolf | Geometría declarada, recuperación no dirigida, historial, usos por jugador y bloqueos de nombre. | VERIFICADO_R21 |
| C15 | Tres motores y archivo local | CI completo y comprobación entre Chromium/Firefox/WebKit; entrega por archivo local verificada. | VERIFICADO_R21 |
| C16 | Albaz al invocarse Normal | Descarte real y Fusión a perfiles Lubellion/Mirrorjade usando el propio Albaz y un material rival admitido. | VERIFICADO_R21 |
| C17 | Albaz tras Reborn | Llegada real desde GY, propietario conservado, disparo pertinente, coste/negación/HOPT y replay. | VERIFICADO_R21 |
| C18 | Prioridad y cadenas generales | Componer activaciones y respuestas generales de los perfiles revisados con controles de prioridad. | PENDIENTE |
| C19 | Efectos simultáneos generales | Registrar SEGOC y cadenas conjuntas de ambos jugadores, además de declinaciones explícitas. | PENDIENTE |
| C20 | Damage Step completo | Ventanas, respuestas y efectos pertinentes de los perfiles revisados se modelan explícitamente. | PENDIENTE |
| C21 | Flip | Invocación por Volteo y efectos Flip con sus oportunidades, costes y respuestas. | PENDIENTE_VALIDACION_R22 |
| C22 | Ataques múltiples | Presupuestos de ataques adicionales, objetivos y cambios de estado para perfiles registrados. | VERIFICADO_R21 |
| C23 | Xyz | Procedimiento, rangos, materiales superpuestos, costes y consecuencias de perfiles revisados. | PENDIENTE |
| C24 | Péndulo | Escalas, espacios y llegadas simultáneas desde mano/Extra para perfiles revisados. | PENDIENTE |
| C25 | Varios robos inciertos | Probabilidades conjuntas con varios eventos de azar, testigos, pesos y masa desconocida. | PENDIENTE |
| C26 | Decisiones rivales | Ampliar decisiones dentro de rutas probabilísticas, más allá de los paquetes y políticas actuales. | PENDIENTE |
| C27 | Identidades y propuestas | Revisión documentada de las 98 identidades heredadas y 32 propuestas sin sustituciones silenciosas. | PENDIENTE |
| C28 | Estadísticas por revisar | Contrastar los 51 monstruos con estadísticas desconocidas mediante fuentes y decisiones documentadas. | PENDIENTE |
| C29 | Disponibilidad y reglas por formato | Completar pools, fuentes fechadas, Skills/desbloqueos/Legend y reglas particulares anunciadas. | PENDIENTE |
| C30 | Accesibilidad completa del flujo | Cerrar evaluación de teclado, foco, contraste y tecnologías de asistencia del flujo admitido. | PENDIENTE |
| C31 | Dispositivos físicos | Registrar pruebas en equipos reales; la emulación y los tres motores no sustituyen esa evidencia. | PENDIENTE |
| C32 | Puntuación provisional e importador | Mantener puntuación estructural claramente provisional e importador de resultados reales; no exigir calibración que el usuario dejó provisional. | VERIFICADO_R21 |

La verificación de C32 acredita el etiquetado provisional y el importador, no precisión competitiva validada con torneos. C30 corresponde a accesibilidad completa y C31 a equipos físicos; ambas siguen pendientes.

## Evidencia requerida para aceptar R22

El cierre debe registrar el build, SHA-256 y tamaño del HTML; los resultados completos de Node y navegador; los ejemplos preservados; búsqueda y replay con estados y costes físicos; y las comprobaciones estrictas entre Chromium, Firefox y WebKit. Los informes anteriores deben permanecer identificados por su revisión y no convertirse en una ejecución nueva. Debe comprobarse además que el HTML publicado y descargado coincide byte a byte con el archivo probado.

La evidencia de referencias técnicas y su revisión no certifica todas las reglas ni autentica rulings oficiales TCG. Las fuentes Lua y C++ se tratan exclusivamente como documentos; el analizador no las ejecuta.

## Trabajo pendiente después de este perfil

Las cadenas generales requieren ventanas y decisiones de ambos jugadores. Los efectos simultáneos exigen SEGOC y decisiones explícitas. Damage Step completo sigue abierto, además de Xyz, Péndulo, varios robos inciertos y decisiones rivales más amplias. Otros FLIP y nuevas cartas necesitan perfiles con sus efectos y oportunidades revisados.

La auditoría de datos conserva 21.986 registros, 98 identidades heredadas sin cotejo técnico, 51 monstruos con estadísticas desconocidas y 32 propuestas. Esta revisión no transfiere estadísticas o identidades por coincidencia de nombre. La disponibilidad por formato requiere fuentes fechadas, pools, Skills, desbloqueos, Legend y reglas específicas; los datos técnicos de una CDB no autentican esas condiciones.

La evaluación completa de accesibilidad con tecnologías de asistencia y las pruebas en equipos físicos siguen pendientes. Las verificaciones automáticas, emuladas y entre tres motores no sustituyen esa evidencia.

La puntuación competitiva permanece estructural y provisional por decisión del usuario. El importador de resultados reales está preparado; no se exige una calibración competitiva que el usuario decidió mantener provisional.

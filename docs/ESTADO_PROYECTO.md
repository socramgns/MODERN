# Estado de la revisión 20

El producto se entrega en un único Analizador_YuGiOh.html sin comprimir. Conserva el original, las entregas anteriores y la puntuación provisional.

VALIDACION_R20_PENDIENTE

La revisión 20 registra el disparo opcional de Fallen of Albaz después de una llegada real por Invocación Normal o Monster Reborn bajo el control del actor 0. El descarte se paga al activar. La Fusión usa la misma copia de Albaz y un único monstruo rival boca arriba de perfil admitido; conserva propietarios, destinos, restricciones y reproducción desde el origen.

El nuevo ejemplo albaz parte de Albaz y Reborn en mano y Mechaba/Dark Magician rivales declarados. Ejecuta Normal de Albaz, descarta una carta Normal y usa el Mechaba rival para invocar Mirrorjade por Fusión; después revive el mismo Albaz con Reborn. El objetivo exige Mirrorjade y Albaz en campo. El uso ya gastado impide una segunda activación de Albaz ese turno. Las pruebas también contrastan una llegada inicial por Reborn y Lubellion seguido de su continuación registrada a Mirrorjade.

## Lista cerrada de aceptación de la versión operativa

Esta lista fija 32 criterios para el seguimiento de la versión operativa de perfiles registrados. El recuento mide criterios cerrados, con el mismo peso por fila; no mide tiempo, esfuerzo, líneas de código ni todas las reglas de Yu-Gi-Oh. Cambiar este alcance requiere versionar la lista, no añadir o quitar filas para alterar el resultado.

RESUMEN_CRITERIOS_R20: 16 verificados; 2 implementados en validación R20; 14 pendientes. Las verificaciones previas se apoyan en la aceptación R19, que no sustituye la aceptación de los bytes de R20.

| ID | Entregable | Criterio de cierre | Estado |
| --- | --- | --- | --- |
| C01 | Entrega HTML única | Abrir el archivo sin instalación; catálogo y cálculo incorporados. | VERIFICADO_R19 |
| C02 | Compilación y descarga | Build reproducible, hash del HTML y bytes publicados/descargados iguales. | VERIFICADO_R19 |
| C03 | Catálogo técnico | Fuente CDB fijada, integridad y procedencia contrastadas; incertidumbre explícita. | VERIFICADO_R19 |
| C04 | Editor y construcción | Main, Extra, Side y Skills conservan cantidades y validación de construcción por formato. | VERIFICADO_R19 |
| C05 | Importación | JSON/YDK y escenarios físicos se importan con validación y rechazo de entradas inválidas. | VERIFICADO_R19 |
| C06 | Exportación | JSON/YDK e informes conservan lo que admite cada formato; las limitaciones de YDK se indican. | VERIFICADO_R19 |
| C07 | Estadísticas | Cálculos base verificados y estadísticas desconocidas diferenciadas de cero y variable. | VERIFICADO_R19 |
| C08 | Probabilidad inicial | Probabilidades y muestreo de mano inicial con supuestos, semilla y límites explícitos. | VERIFICADO_R19 |
| C09 | Estado físico y costes | UID, propietario/controlador, inventario, costes y presupuestos se conservan en paquetes registrados. | VERIFICADO_R19 |
| C10 | Búsqueda y replay | Búsqueda acotada y reproducción desde el origen rechazan costes/estados/historias falsificados. | VERIFICADO_R19 |
| C11 | Seis rutas de familias | Los seis ejemplos de familias registradas alcanzan sus objetivos y se reproducen; no todas sus cartas. | VERIFICADO_R19 |
| C12 | Spark y Azure | Synchro real, protección, historial, Reborn y ventanas registradas con sus restricciones. | VERIFICADO_R19 |
| C13 | Spirit | Negación GY y resurrección de Spirit Link conservan costes, origen, uso y restricción continua. | VERIFICADO_R19 |
| C14 | Sunlight Wolf | Geometría declarada, recuperación no dirigida, historial, usos por jugador y bloqueos de nombre. | VERIFICADO_R19 |
| C15 | Tres motores y archivo local | CI completo y comprobación entre Chromium/Firefox/WebKit; entrega por archivo local verificada. | VERIFICADO_R19 |
| C16 | Albaz al invocarse Normal | Descarte real y Fusión a perfiles Lubellion/Mirrorjade usando el propio Albaz y un material rival admitido. | EN_VALIDACION_R20 |
| C17 | Albaz tras Reborn | Llegada real desde GY, propietario conservado, disparo pertinente, coste/negación/HOPT y replay. | EN_VALIDACION_R20 |
| C18 | Prioridad y cadenas generales | Componer activaciones y respuestas generales de los perfiles revisados con controles de prioridad. | PENDIENTE |
| C19 | Efectos simultáneos generales | Registrar SEGOC y cadenas conjuntas de ambos jugadores, además de declinaciones explícitas. | PENDIENTE |
| C20 | Damage Step completo | Ventanas, respuestas y efectos pertinentes de los perfiles revisados se modelan explícitamente. | PENDIENTE |
| C21 | Flip | Invocación por Volteo y efectos Flip con sus oportunidades, costes y respuestas. | PENDIENTE |
| C22 | Ataques múltiples | Presupuestos de ataques adicionales, objetivos y cambios de estado para perfiles registrados. | PENDIENTE |
| C23 | Xyz | Procedimiento, rangos, materiales superpuestos, costes y consecuencias de perfiles revisados. | PENDIENTE |
| C24 | Péndulo | Escalas, espacios y llegadas simultáneas desde mano/Extra para perfiles revisados. | PENDIENTE |
| C25 | Varios robos inciertos | Probabilidades conjuntas con varios eventos de azar, testigos, pesos y masa desconocida. | PENDIENTE |
| C26 | Decisiones rivales | Ampliar decisiones dentro de rutas probabilísticas, más allá de los paquetes y políticas actuales. | PENDIENTE |
| C27 | Identidades y propuestas | Revisión documentada de las 98 identidades heredadas y 32 propuestas sin sustituciones silenciosas. | PENDIENTE |
| C28 | Estadísticas por revisar | Contrastar los 51 monstruos con estadísticas desconocidas mediante fuentes y decisiones documentadas. | PENDIENTE |
| C29 | Disponibilidad y reglas por formato | Completar pools, fuentes fechadas, Skills/desbloqueos/Legend y reglas particulares anunciadas. | PENDIENTE |
| C30 | Accesibilidad completa del flujo | Cerrar evaluación de teclado, foco, contraste y tecnologías de asistencia del flujo admitido. | PENDIENTE |
| C31 | Dispositivos físicos | Registrar pruebas en equipos reales; la emulación y los tres motores no sustituyen esa evidencia. | PENDIENTE |
| C32 | Puntuación provisional e importador | Mantener puntuación estructural claramente provisional e importador de resultados reales; no exigir calibración que el usuario dejó provisional. | VERIFICADO_R19 |

La puntuación del criterio C32 sigue provisional por decisión del usuario. Su verificación acredita el etiquetado y el importador, no una precisión competitiva validada con torneos. C31 requiere evidencia de equipos físicos; la emulación y los tres motores no la sustituyen.


## Cómo interpretar la evidencia

VERIFICADO_R19 identifica requisitos contrastados en el predecesor; EN_VALIDACION_R20 identifica la ampliación actual antes de aceptar sus bytes. PENDIENTE conserva trabajo que no queda acreditado. El cierre de R20 debe registrar su ejecución remota y renovar los requisitos cubiertos sin convertir fallos locales originales en aprobaciones.

Las seis familias y el motor general siguen parciales. Esta ampliación no modela todos los destinos de Fusión de Albaz, todos los materiales o efectos de salida, prioridad general, SEGOC completo, Damage Step, Flip, ataques múltiples, Xyz o Péndulo. Las fases, perfiles de campo y consecuencias sin revisar se excluyen de las transiciones afectadas. Los campos iniciales declarados son supuestos; una historia apropiada se acredita mediante acciones registradas.

La puntuación competitiva permanece estructural y provisional por decisión del usuario. El importador de resultados reales está preparado. Las barajas y fixtures de prueba no son resultados de torneo.

La revisión 19 conserva la aceptación remota de 71 grupos sobre el candidato c5bfa6d74aec0d6ae1661170cd712c0daa49fe32 ([workflow](https://github.com/socramgns/MODERN/actions/runs/42305553910)). El commit final a0e283f0e5e3c66ccdd6b18a708d1840b222217c conserva el [HTML descargado y verificado](https://github.com/socramgns/MODERN/raw/a0e283f0e5e3c66ccdd6b18a708d1840b222217c/Analizador_YuGiOh.html?download=1), SHA-256 e03038a2d7932ded30cfb93e0d5d79a3e3dbe26efdadefc1b02b445632933fda. Su informe local original permanece con pass: false, 69/71 grupos y Firefox/WebKit no disponibles. Esa evidencia pertenece a R19; la aceptación de la ampliación actual se registra por separado.

Consulta [los pendientes y criterios](ANALISIS_PENDIENTES_REVISION20.md), [el desarrollo](DESARROLLO.md) y [el alcance](ALCANCE_COMBOS.md).

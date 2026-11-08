# Estado de la revisión 21

El producto se entrega en un único Analizador_YuGiOh.html sin comprimir.

VALIDACION_R21_PENDIENTE

La revisión 21 registra el segundo ataque de Hayabusa Knight y Cyber Twin Dragon durante cada Battle Phase. Cada declaración consume un ataque de la copia física, incluso si una protección evita la destrucción. Negar sus efectos reduce el límite a uno sin devolver ataques gastados; retirar la copia del campo y volver a invocarla comienza una estancia nueva. El registro usado para impedir cambios manuales de posición se conserva por separado.

## Lista cerrada de aceptación de la versión operativa

Esta lista mantiene los mismos 32 criterios y el mismo peso por fila. El recuento no mide tiempo, esfuerzo, líneas de código ni todas las reglas de Yu-Gi-Oh. Cerrar un criterio exige verificar el alcance declarado, y modificar la lista requiere una versión explícita.

RESUMEN_CRITERIOS_R21: 18 de 32 criterios verificados; 1 implementado en validación R21 (C22); 13 pendientes. Las verificaciones previas se apoyan en la aceptación R20, que no sustituye la aceptación de los bytes de R21.

| ID | Entregable | Criterio de cierre | Estado |
| --- | --- | --- | --- |
| C01 | Entrega HTML única | Abrir el archivo sin instalación; catálogo y cálculo incorporados. | VERIFICADO_R20 |
| C02 | Compilación y descarga | Build reproducible, hash del HTML y bytes publicados/descargados iguales. | VERIFICADO_R20 |
| C03 | Catálogo técnico | Fuente CDB fijada, integridad y procedencia contrastadas; incertidumbre explícita. | VERIFICADO_R20 |
| C04 | Editor y construcción | Main, Extra, Side y Skills conservan cantidades y validación de construcción por formato. | VERIFICADO_R20 |
| C05 | Importación | JSON/YDK y escenarios físicos se importan con validación y rechazo de entradas inválidas. | VERIFICADO_R20 |
| C06 | Exportación | JSON/YDK e informes conservan lo que admite cada formato; las limitaciones de YDK se indican. | VERIFICADO_R20 |
| C07 | Estadísticas | Cálculos base verificados y estadísticas desconocidas diferenciadas de cero y variable. | VERIFICADO_R20 |
| C08 | Probabilidad inicial | Probabilidades y muestreo de mano inicial con supuestos, semilla y límites explícitos. | VERIFICADO_R20 |
| C09 | Estado físico y costes | UID, propietario/controlador, inventario, costes y presupuestos se conservan en paquetes registrados. | VERIFICADO_R20 |
| C10 | Búsqueda y replay | Búsqueda acotada y reproducción desde el origen rechazan costes/estados/historias falsificados. | VERIFICADO_R20 |
| C11 | Seis rutas de familias | Los seis ejemplos de familias registradas alcanzan sus objetivos y se reproducen; no todas sus cartas. | VERIFICADO_R20 |
| C12 | Spark y Azure | Synchro real, protección, historial, Reborn y ventanas registradas con sus restricciones. | VERIFICADO_R20 |
| C13 | Spirit | Negación GY y resurrección de Spirit Link conservan costes, origen, uso y restricción continua. | VERIFICADO_R20 |
| C14 | Sunlight Wolf | Geometría declarada, recuperación no dirigida, historial, usos por jugador y bloqueos de nombre. | VERIFICADO_R20 |
| C15 | Tres motores y archivo local | CI completo y comprobación entre Chromium/Firefox/WebKit; entrega por archivo local verificada. | VERIFICADO_R20 |
| C16 | Albaz al invocarse Normal | Descarte real y Fusión a perfiles Lubellion/Mirrorjade usando el propio Albaz y un material rival admitido. | VERIFICADO_R20 |
| C17 | Albaz tras Reborn | Llegada real desde GY, propietario conservado, disparo pertinente, coste/negación/HOPT y replay. | VERIFICADO_R20 |
| C18 | Prioridad y cadenas generales | Componer activaciones y respuestas generales de los perfiles revisados con controles de prioridad. | PENDIENTE |
| C19 | Efectos simultáneos generales | Registrar SEGOC y cadenas conjuntas de ambos jugadores, además de declinaciones explícitas. | PENDIENTE |
| C20 | Damage Step completo | Ventanas, respuestas y efectos pertinentes de los perfiles revisados se modelan explícitamente. | PENDIENTE |
| C21 | Flip | Invocación por Volteo y efectos Flip con sus oportunidades, costes y respuestas. | PENDIENTE |
| C22 | Ataques múltiples | Presupuestos de ataques adicionales, objetivos y cambios de estado para perfiles registrados. | EN_VALIDACION_R21 |
| C23 | Xyz | Procedimiento, rangos, materiales superpuestos, costes y consecuencias de perfiles revisados. | PENDIENTE |
| C24 | Péndulo | Escalas, espacios y llegadas simultáneas desde mano/Extra para perfiles revisados. | PENDIENTE |
| C25 | Varios robos inciertos | Probabilidades conjuntas con varios eventos de azar, testigos, pesos y masa desconocida. | PENDIENTE |
| C26 | Decisiones rivales | Ampliar decisiones dentro de rutas probabilísticas, más allá de los paquetes y políticas actuales. | PENDIENTE |
| C27 | Identidades y propuestas | Revisión documentada de las 98 identidades heredadas y 32 propuestas sin sustituciones silenciosas. | PENDIENTE |
| C28 | Estadísticas por revisar | Contrastar los 51 monstruos con estadísticas desconocidas mediante fuentes y decisiones documentadas. | PENDIENTE |
| C29 | Disponibilidad y reglas por formato | Completar pools, fuentes fechadas, Skills/desbloqueos/Legend y reglas particulares anunciadas. | PENDIENTE |
| C30 | Accesibilidad completa del flujo | Cerrar evaluación de teclado, foco, contraste y tecnologías de asistencia del flujo admitido. | PENDIENTE |
| C31 | Dispositivos físicos | Registrar pruebas en equipos reales; la emulación y los tres motores no sustituyen esa evidencia. | PENDIENTE |
| C32 | Puntuación provisional e importador | Mantener puntuación estructural claramente provisional e importador de resultados reales; no exigir calibración que el usuario dejó provisional. | VERIFICADO_R20 |


La verificación de C32 acredita el etiquetado provisional y el importador, no precisión competitiva validada con torneos. C30 y C31 permanecen pendientes.

## Alcance y evidencia

Los dos perfiles permiten un segundo ataque contra el mismo monstruo superviviente, otro objetivo legal o directamente si el campo rival está vacío. No conceden un tercer ataque. Otros efectos de ataques adicionales, ataques limitados a monstruos, prioridad general, SEGOC completo, Damage Step completo, Flip, Xyz y Péndulo continúan fuera de este paquete. No se añade un procedimiento de Fusión de Cyber Twin ni se acredita una historia previa por declararlo en el campo inicial.

Se amplían las etiquetas de búsqueda, el foco visible, el estado accesible de los selectores y el cierre y recorrido por teclado de ventanas registradas. Estas comprobaciones automáticas y emuladas no cierran C30 ni C31: faltan la evaluación completa con tecnologías de asistencia y pruebas en equipos físicos.

La auditoría contrasta las cinco CDB fijadas, sus hashes y los casos sin identidad exacta. Se conservan 21.986 registros, 98 identidades heredadas sin cotejo técnico, 51 monstruos con estadísticas desconocidas y 32 propuestas. No se transfieren estadísticas ni identidades por coincidencia de nombre. Véase [auditoría de datos](AUDITORIA_DATOS_REVISION21.md).

La puntuación competitiva permanece estructural y provisional por decisión del usuario. El importador de resultados reales está preparado; los escenarios diagnósticos no son resultados de torneos.

VERIFICADO_R20 identifica el alcance previamente aceptado. EN_VALIDACION_R21 requiere la aceptación de los bytes nuevos. PENDIENTE conserva trabajo sin acreditar; no se suman los casos de datos como si fuesen cartas distintas.

La revisión 20 conserva su [HTML publicado y verificado](https://github.com/socramgns/MODERN/raw/71b244b7594b5bae1f5042d1248bcf5fa4a50a64/Analizador_YuGiOh.html?download=1), SHA-256 `1bcd4ee98c2d8b694c7fd31b8c948fd4387ae94c0a944171f9dc1385aa8d9ac0`, y su [aceptación remota de 73 grupos](https://github.com/socramgns/MODERN/actions/runs/42337909290). Su resultado local original sigue en 71/73 con `pass:false` por Firefox y WebKit ausentes; no se convierte ese resultado en éxito.

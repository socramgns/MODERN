# Estado del proyecto · revisión 23

La entrega continúa en un único HTML sin comprimir. [Descargar el candidato aceptado R23](https://github.com/socramgns/MODERN/raw/c9537266d03535c305cb8e882c09be1a81376669/Analizador_YuGiOh.html?download=1).

La aceptación de R23 corresponde al candidato `c9537266d03535c305cb8e882c09be1a81376669` y al [workflow remoto](https://github.com/socramgns/MODERN/actions/runs/44686493687). Pasaron los diez pasos obligatorios, incluida la batería de **88 grupos** y la puerta adicional entre motores. El runner versionado contiene 86 comandos más sintaxis y conservación del artefacto. La anotación pública compacta `R23_CI_RESULT` declara 88 grupos sin fallos y vincula build, SHA-256 del HTML, commit y ejecución; se contrasta con ese contrato y los estados remotos. CI utiliza la imagen oficial de Playwright 1.62.0 fijada por digest y verifica el arranque real, título y versión de Chromium, Firefox y WebKit, además de sus preparaciones idempotentes. La puerta estricta exige al menos dos motores ejecutados y éxito en todos los ejecutados; la cobertura se interpreta junto a esos tres arranques y el bucle de motores del runner. No se descargaron el informe completo remoto ni los JSON de sus filas individuales: se conserva el resumen compacto y el SHA-256 anunciado del informe completo, sin afirmar que ese hash se recomputó sobre bytes descargados. El resumen móvil focal se registra por separado.

Build `ad379fc6b8cddeaff64a1895a2eb97fed493b037a7e725a3bd9681a185d94a64`; SHA-256 del HTML `017f4cd81211d2be486c6634e876254fe6dc2225e6419c02e459d69ea7022c9e`; **7.435.430 bytes**, **131 archivos JavaScript** y **28 ejemplos**. La descarga inmutable del candidato dio HTTP 200 y coincidió exactamente con el HTML de Git, raíz y `dist`.

El candidato anterior `7b34e2075579771064a18d06d188dc018ba4e0b3` falló 87/88 grupos remotos; la cifra se infiere de la anotación pública de grupos fallidos y el runner de 88 grupos, sin reconstruir un JSON completo. Ese artefacto y su evidencia son históricos. Su ejecución local completa se interrumpió por la reconexión del entorno al llegar a `release17_in_browser`; no se recuperó un informe final único. Se conservan por separado el registro original de un prefijo de **58 comandos** y una reanudación de **28 comandos**. La reanudación terminó con `pass:false` por `mobile_accessibility`, al faltar WebKit local. No se combinan ambos registros para atribuir un resultado global a una batería local completa. Los fallos originales y sus seguimientos permanecen identificados. No se ejecutó ni se atribuye una batería local completa nueva al HTML con el CSS corregido.

El HTML aprobó **42/42 comprobaciones GUI** y **24/24 comprobaciones nuevas de accesibilidad automatizada** en ejecuciones nuevas con el helper de conexión nativa revisado, sobre el mismo build y SHA-256 que el candidato aceptado. Los informes GUI/accesibilidad anteriores permanecen archivados y no se presentan como ejecuciones de ese helper. Una ejecución móvil focal anterior de Chromium y WebKit informó **35/35** sobre los mismos bytes: se observaron su resumen de anotación y las etapas del trabajo; el HTML y su propio archivo de pruebas móvil permanecen idénticos. La comparación de los scripts GUI importados delimita sus cambios al import y a la fábrica de página del helper; no se descargó el JSON de las 35 filas móviles individuales. Los **206 casos de las siete suites Node** y los seguimientos de Azure (**74 casos**) y Campo (**39 casos**) conservan sus informes originales de máquina virtual de fuente. La aplicación sólo difiere en CSS de presentación y sus archivos Node de prueba siguen idénticos; los 22 scripts GUI tienen el cambio de preparación de página verificado por separado. El runner, sus argumentos URL, presupuestos y aserciones permanecen intactos. Los registros originales no se relabelan ni se atribuyen a una ejecución con el helper nuevo, y no se suman como una batería local completa.

Las comprobaciones GUI actuales entregan los bytes exactos por interceptación de rutas y mantienen el contexto nativo sin conexión. El helper aplica además el comando oficial CDP al crear la página y al confirmar el marco principal para conservar el estado que comunica el motor; no sustituye propiedades JavaScript. Una comprobación previa obligatoria verifica una petición HTTP real, su fallo sin conexión y su restauración, sin interceptar esa petición de control. El fallo histórico de navegación `file://` en Chromium, atribuido a la política de aquel entorno, se conserva por separado; estas GUI no acreditan una prueba nueva de archivo local en Chromium. La entrega directa mediante Firefox pertenece al comando obligatorio del runner remoto aceptado; no se presenta como inspección de su JSON individual. No se eludieron políticas del navegador.

## Lista de aceptación del alcance operativo

Se mantienen las definiciones y el peso de los 32 criterios originales. **27/32 están verificados y cinco pendientes: 84,375 % del listado operativo sin ponderar.** R23 cierra C18, C19, C20, C23, C24, C25 y C26 para los perfiles y dominios declarados. Este cociente no mide esfuerzo, tiempo pendiente, todas las cartas ni todas las reglas de Yu-Gi-Oh.

RESUMEN_CRITERIOS_R23: 27 de 32 criterios verificados (84,375 % del listado), cinco pendientes. Se incorporan C18, C19, C20, C23, C24, C25 y C26 para perfiles registrados.

| ID | Entregable | Criterio de aceptación | Estado |
| --- | --- | --- | --- |
| C01 | Entrega HTML única | Abrir el archivo sin instalación; catálogo y cálculo incorporados. | VERIFICADO_R23 |
| C02 | Compilación y descarga | Build reproducible, hash del HTML y bytes publicados/descargados iguales. | VERIFICADO_R23 |
| C03 | Catálogo técnico | Fuente CDB fijada, integridad y procedencia contrastadas; incertidumbre explícita. | VERIFICADO_R23 |
| C04 | Editor y construcción | Main, Extra, Side y Skills conservan cantidades y validación de construcción por formato. | VERIFICADO_R23 |
| C05 | Importación | JSON/YDK y escenarios físicos se importan con validación y rechazo de entradas inválidas. | VERIFICADO_R23 |
| C06 | Exportación | JSON/YDK e informes conservan lo que admite cada formato; las limitaciones de YDK se indican. | VERIFICADO_R23 |
| C07 | Estadísticas | Cálculos base verificados y estadísticas desconocidas diferenciadas de cero y variable. | VERIFICADO_R23 |
| C08 | Probabilidad inicial | Probabilidades y muestreo de mano inicial con supuestos, semilla y límites explícitos. | VERIFICADO_R23 |
| C09 | Estado físico y costes | UID, propietario/controlador, inventario, costes y presupuestos se conservan en paquetes registrados. | VERIFICADO_R23 |
| C10 | Búsqueda y replay | Búsqueda acotada y reproducción desde el origen rechazan costes/estados/historias falsificados. | VERIFICADO_R23 |
| C11 | Seis rutas de familias | Los seis ejemplos de familias registradas alcanzan sus objetivos y se reproducen; no todas sus cartas. | VERIFICADO_R23 |
| C12 | Spark y Azure | Synchro real, protección, historial, Reborn y ventanas registradas con sus restricciones. | VERIFICADO_R23 |
| C13 | Spirit | Negación GY y resurrección de Spirit Link conservan costes, origen, uso y restricción continua. | VERIFICADO_R23 |
| C14 | Sunlight Wolf | Geometría declarada, recuperación no dirigida, historial, usos por jugador y bloqueos de nombre. | VERIFICADO_R23 |
| C15 | Tres motores y archivo local | CI completo y comprobación entre Chromium/Firefox/WebKit; entrega por archivo local verificada. | VERIFICADO_R23 |
| C16 | Albaz al invocarse Normal | Descarte real y Fusión a perfiles Lubellion/Mirrorjade usando el propio Albaz y un material rival admitido. | VERIFICADO_R23 |
| C17 | Albaz tras Reborn | Llegada real desde GY, propietario conservado, disparo pertinente, coste/negación/HOPT y replay. | VERIFICADO_R23 |
| C18 | Prioridad y cadenas generales | Componer activaciones y respuestas generales de los perfiles revisados con controles de prioridad. | VERIFICADO_R23 |
| C19 | Efectos simultáneos generales | Registrar SEGOC y cadenas conjuntas de ambos jugadores, además de declinaciones explícitas. | VERIFICADO_R23 |
| C20 | Damage Step completo | Ventanas, respuestas y efectos pertinentes de los perfiles revisados se modelan explícitamente. | VERIFICADO_R23 |
| C21 | Flip | Invocación por Volteo y efectos Flip con sus oportunidades, costes y respuestas. | VERIFICADO_R23 |
| C22 | Ataques múltiples | Presupuestos de ataques adicionales, objetivos y cambios de estado para perfiles registrados. | VERIFICADO_R23 |
| C23 | Xyz | Procedimiento, rangos, materiales superpuestos, costes y consecuencias de perfiles revisados. | VERIFICADO_R23 |
| C24 | Péndulo | Escalas, espacios y llegadas simultáneas desde mano/Extra para perfiles revisados. | VERIFICADO_R23 |
| C25 | Varios robos inciertos | Probabilidades conjuntas con varios eventos de azar, testigos, pesos y masa desconocida. | VERIFICADO_R23 |
| C26 | Decisiones rivales | Ampliar decisiones dentro de rutas probabilísticas, más allá de los paquetes y políticas actuales. | VERIFICADO_R23 |
| C27 | Identidades y propuestas | Revisión documentada de las 98 identidades heredadas y 32 propuestas sin sustituciones silenciosas. | PENDIENTE |
| C28 | Estadísticas por revisar | Contrastar los 51 monstruos con estadísticas desconocidas mediante fuentes y decisiones documentadas. | PENDIENTE |
| C29 | Disponibilidad y reglas por formato | Completar pools, fuentes fechadas, Skills/desbloqueos/Legend y reglas particulares anunciadas. | PENDIENTE |
| C30 | Accesibilidad completa del flujo | Cerrar evaluación de teclado, foco, contraste y tecnologías de asistencia del flujo admitido. | PENDIENTE |
| C31 | Dispositivos físicos | Registrar pruebas en equipos reales; la emulación y los tres motores no sustituyen esa evidencia. | PENDIENTE |
| C32 | Puntuación provisional e importador | Mantener puntuación estructural claramente provisional e importador de resultados reales; no exigir calibración que el usuario dejó provisional. | VERIFICADO_R23 |

## Alcance añadido

| Criterio | Alcance incorporado y sus límites |
| --- | --- |
| C18 · Prioridad | Activaciones y respuestas de adaptadores revisados, elección real de ambos jugadores, costes al activar, dos cesiones y resolución LIFO de un eslabón por paso. No hay activaciones entre eslabones. |
| C19 · Efectos simultáneos | Cuatro grupos SEGOC, orden dentro del grupo y declinación explícita de opcionales. Los obligatorios de ambos jugadores se conservan; los efectos sin perfil no se inventan. |
| C20 · Damage Step | Declaración y seis oportunidades explícitas, momentos de respuesta registrados, daño, prevención, FLIP de Faith y salidas al final. Un blanco que sale antes del cálculo no deja el combate bloqueado ni devuelve el ataque gastado. |
| C23 · Xyz | Gem-Knight Pearl y Number 50: Blackship of Corn con dos Normales de Nivel 4 admitidos, materiales físicos superpuestos, desacople y salida de los materiales cuando deja el campo su anfitrión. |
| C24 · Péndulo | Goldriver, Silverd, Steelen y Volflame: escalas y efecto revisado para destruir otra carta propia y colocar una carta Metalfoes admitida. Grupos desde mano y Extra boca arriba respetan espacios y flechas revisadas; no se incorporan todos los efectos Péndulo. |
| C25 · Robos inciertos | De uno a tres eventos cronológicos de robo de turno desconocido, copias sin reemplazo, pesos racionales, testigos y masa desconocida conservada ante límites. |
| C26 · Decisiones rivales | MAX propio y MIN rival en el dominio de acciones declarado. Usa manos y campos declarados completos después de cada evento; no demuestra una estrategia óptima con información oculta ni una tasa de victoria. |

El catálogo contiene 21.986 registros técnicos; eso no representa 21.986 efectos implementados. Las transiciones fuera de los perfiles revisados se excluyen o conservan como desconocidas. Las búsquedas están acotadas y no prueban optimalidad global. Una colocación inicial es un supuesto explícito y no acredita las invocaciones de turnos anteriores.

Los seis ejemplos nuevos y los modos opcionales se explican en [Uso de reglas R23](USO_REGLAS_REVISION23.md). El modo anterior conserva sus paquetes atómicos registrados; sus descriptores de orden fijo y robo observado no limitan por sí solos las APIs explícitas e hipotéticas añadidas en R23.

## Trabajo pendiente y decisiones conservadas

Permanecen abiertos C27–C31. Se conservan **98 identidades heredadas**, **51 monstruos con estadísticas desconocidas** y **32 propuestas**, sin sustituciones de identidad o estadísticas por coincidencia de nombre. El expediente de revisión permite aportar y cotejar decisiones, pero no autentica por sí solo documentos oficiales ni modifica silenciosamente el catálogo. Faltan fuentes fechadas y verificadas para disponibilidad, pools y reglas particulares de formato, además de la evaluación completa con tecnologías de asistencia y pruebas en equipos físicos. Las comprobaciones automáticas, emuladas o entre motores no sustituyen esos datos ni esas experiencias.

La [revisión de datos y formatos](REVISION_DATOS_FORMATOS_R23.md) mantiene la procedencia y los expedientes. El [protocolo de accesibilidad y equipos](PRUEBAS_MANUALES_ACCESIBILIDAD_DISPOSITIVOS_R23.md) está preparado para registrar experiencias reales; una plantilla o un registro NOT_RUN no es una prueba aprobada.

La puntuación competitiva permanece estructural y **provisional por decisión del usuario**. El importador de resultados reales está preparado. Los ejemplos y diagnósticos no son resultados de torneos ni una calibración competitiva independiente.

## Evidencia e historial

La aceptación está en `evidence/release-acceptance.json`; el listado está en `evidence/project-criteria.json`. El [índice de evidencia](../evidence/README.md) separa el CI completo actual, sus pruebas focales y la evidencia histórica del artefacto anterior fallido. Las [referencias](REFERENCIAS_REGLAS_REVISION23.md) y su [manifiesto](../evidence/revision23/references/manifest.json) son evidencia técnica secundaria.

R22 conserva su [HTML aceptado](https://github.com/socramgns/MODERN/raw/35ad8188207f6a47be47b6bc361a011cf01c948b/Analizador_YuGiOh.html?download=1), su [CI de 79 grupos](https://github.com/socramgns/MODERN/actions/runs/43558962065) y su evidencia original en `evidence/history/revision22-accepted/`. Su informe local histórico permanece `pass:false`, 76/79; no se reescribe como un resultado de R23. También se preservan R20, R21 y los intentos previos de R22 con sus propios vínculos y limitaciones.

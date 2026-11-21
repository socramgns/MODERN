# Estado del proyecto · revisión 24

[Descargar el candidato aceptado R24](https://github.com/socramgns/MODERN/raw/9977424e6bacee97dc607fa94cd894c46d3db557/Analizador_YuGiOh.html?download=1). La entrega sigue siendo un HTML único con sus datos y motor incorporados.

La aceptación corresponde al commit `9977424e6bacee97dc607fa94cd894c46d3db557` y al [workflow remoto](https://github.com/socramgns/MODERN/actions/runs/44848581354). Build `2d7de2e019f18f6524de0f72d8575ec12a981d145e360cd897397b2680a8c0c7`; SHA-256 del HTML `0d955d44e782d57db880a68b2dac80ad288172e570da647e6753cc8d1f6eb63c`; **7.546.537 bytes**, **135 archivos JavaScript** y **32 ejemplos**.

La aceptación completa procede del CI remoto: **95/95 grupos**, con 93 comandos más sintaxis y conservación del artefacto. Se observaron el resumen público compacto `R24_CI_RESULT`, vinculado al commit, ejecución, build y SHA-256, y los estados satisfactorios de los diez pasos obligatorios. No se descargaron el informe remoto completo ni los JSON de sus filas individuales; el hash anunciado del informe completo no se presenta como recomputado sobre bytes descargados.

La puerta estricta exige al menos dos motores ejecutados y éxito en todos los ejecutados. Además, un paso distinto del workflow exige tres arranques reales —Chromium, Firefox y WebKit— y comprueba título y versión de cada navegador; pasaron ese paso y las tres preparaciones. Estas afirmaciones combinan el código versionado con los estados remotos observados; no implican haber recuperado cada informe individual de motor.

La comprobación focal GUI pasó **28/28**, sobre los bytes entregados exactos, sin inyectar módulos de fuente. Sus páginas usan interceptación de rutas y el helper nativo sin conexión; no acredita por sí sola navegación `file://`, tecnologías de asistencia ni equipos físicos. La batería Node de fuente pasó **51/51 grupos**, ligada al candidato y con igualdad de fuentes/pruebas comprobada antes y después. Ambos registros son independientes: no se suman como una ejecución local completa de los 95 grupos.

La descarga inmutable dio HTTP 200 y coincidió con los bytes comprometidos, el HTML de la raíz y el de `dist`. La evidencia y sus ámbitos se consultan en [el índice actual](../evidence/README.md).

## Lista de aceptación del alcance operativo

Se conservan las 32 definiciones originales: **27/32 verificadas y cinco pendientes (84,375 % del listado operativo sin ponderar)**. C27–C31 permanecen abiertos. Este cociente no mide todas las cartas o reglas del juego, esfuerzo, tiempo restante ni una tasa de victoria.

RESUMEN_CRITERIOS_R24: 27 de 32 criterios verificados (84,375 % del listado), cinco pendientes. Las definiciones y el peso no cambian; R24 amplía perfiles dentro del dominio declarado.

| ID | Entregable | Criterio de aceptación | Estado |
| --- | --- | --- | --- |
| C01 | Entrega HTML única | Abrir el archivo sin instalación; catálogo y cálculo incorporados. | VERIFICADO_R24 |
| C02 | Compilación y descarga | Build reproducible, hash del HTML y bytes publicados/descargados iguales. | VERIFICADO_R24 |
| C03 | Catálogo técnico | Fuente CDB fijada, integridad y procedencia contrastadas; incertidumbre explícita. | VERIFICADO_R24 |
| C04 | Editor y construcción | Main, Extra, Side y Skills conservan cantidades y validación de construcción por formato. | VERIFICADO_R24 |
| C05 | Importación | JSON/YDK y escenarios físicos se importan con validación y rechazo de entradas inválidas. | VERIFICADO_R24 |
| C06 | Exportación | JSON/YDK e informes conservan lo que admite cada formato; las limitaciones de YDK se indican. | VERIFICADO_R24 |
| C07 | Estadísticas | Cálculos base verificados y estadísticas desconocidas diferenciadas de cero y variable. | VERIFICADO_R24 |
| C08 | Probabilidad inicial | Probabilidades y muestreo de mano inicial con supuestos, semilla y límites explícitos. | VERIFICADO_R24 |
| C09 | Estado físico y costes | UID, propietario/controlador, inventario, costes y presupuestos se conservan en paquetes registrados. | VERIFICADO_R24 |
| C10 | Búsqueda y replay | Búsqueda acotada y reproducción desde el origen rechazan costes/estados/historias falsificados. | VERIFICADO_R24 |
| C11 | Seis rutas de familias | Los seis ejemplos de familias registradas alcanzan sus objetivos y se reproducen; no todas sus cartas. | VERIFICADO_R24 |
| C12 | Spark y Azure | Synchro real, protección, historial, Reborn y ventanas registradas con sus restricciones. | VERIFICADO_R24 |
| C13 | Spirit | Negación GY y resurrección de Spirit Link conservan costes, origen, uso y restricción continua. | VERIFICADO_R24 |
| C14 | Sunlight Wolf | Geometría declarada, recuperación no dirigida, historial, usos por jugador y bloqueos de nombre. | VERIFICADO_R24 |
| C15 | Tres motores y archivo local | CI completo y comprobación entre Chromium/Firefox/WebKit; entrega por archivo local verificada. | VERIFICADO_R24 |
| C16 | Albaz al invocarse Normal | Descarte real y Fusión a perfiles Lubellion/Mirrorjade usando el propio Albaz y un material rival admitido. | VERIFICADO_R24 |
| C17 | Albaz tras Reborn | Llegada real desde GY, propietario conservado, disparo pertinente, coste/negación/HOPT y replay. | VERIFICADO_R24 |
| C18 | Prioridad y cadenas generales | Componer activaciones y respuestas generales de los perfiles revisados con controles de prioridad. | VERIFICADO_R24 |
| C19 | Efectos simultáneos generales | Registrar SEGOC y cadenas conjuntas de ambos jugadores, además de declinaciones explícitas. | VERIFICADO_R24 |
| C20 | Damage Step completo | Ventanas, respuestas y efectos pertinentes de los perfiles revisados se modelan explícitamente. | VERIFICADO_R24 |
| C21 | Flip | Invocación por Volteo y efectos Flip con sus oportunidades, costes y respuestas. | VERIFICADO_R24 |
| C22 | Ataques múltiples | Presupuestos de ataques adicionales, objetivos y cambios de estado para perfiles registrados. | VERIFICADO_R24 |
| C23 | Xyz | Procedimiento, rangos, materiales superpuestos, costes y consecuencias de perfiles revisados. | VERIFICADO_R24 |
| C24 | Péndulo | Escalas, espacios y llegadas simultáneas desde mano/Extra para perfiles revisados. | VERIFICADO_R24 |
| C25 | Varios robos inciertos | Probabilidades conjuntas con varios eventos de azar, testigos, pesos y masa desconocida. | VERIFICADO_R24 |
| C26 | Decisiones rivales | Ampliar decisiones dentro de rutas probabilísticas, más allá de los paquetes y políticas actuales. | VERIFICADO_R24 |
| C27 | Identidades y propuestas | Revisión documentada de las 98 identidades heredadas y 32 propuestas sin sustituciones silenciosas. | PENDIENTE |
| C28 | Estadísticas por revisar | Contrastar los 51 monstruos con estadísticas desconocidas mediante fuentes y decisiones documentadas. | PENDIENTE |
| C29 | Disponibilidad y reglas por formato | Completar pools, fuentes fechadas, Skills/desbloqueos/Legend y reglas particulares anunciadas. | PENDIENTE |
| C30 | Accesibilidad completa del flujo | Cerrar evaluación de teclado, foco, contraste y tecnologías de asistencia del flujo admitido. | PENDIENTE |
| C31 | Dispositivos físicos | Registrar pruebas en equipos reales; la emulación y los tres motores no sustituyen esa evidencia. | PENDIENTE |
| C32 | Puntuación provisional e importador | Mantener puntuación estructural claramente provisional e importador de resultados reales; no exigir calibración que el usuario dejó provisional. | VERIFICADO_R24 |

## Alcance revisado de R24

| Perfil añadido en R24 | Comportamiento y límite |
| --- | --- |
| Invocation / Branded / Lubellion | Activación y resolución separadas; materiales elegidos al resolver. Lubellion descarta al activar y aplica las restricciones restantes al resolver sin negación. Branded conserva su restricción distinta de todo el turno. |
| Tenyi / Salamangreat / Ash | Costes físicos, respuestas por categorías de acceso al Deck expresamente registradas, límites por jugador y disparos SEGOC. No se asigna una respuesta por el nombre de una carta. |
| Chengying | Reemplazo de destrucción por efecto sin cadena ni límite por turno, con una carta propia GY admitida; protege una copia por elección. Disparo opcional de destierro sin objetivo, una vez por nombre/jugador; elige al resolver y exige ambas zonas rivales disponibles. Excluye Damage Step. |
| Librarian / Cyber Twin | Synchro de Nivel 5 con exactamente un Cantante Normal y uno o más no Cantantes Normales revisados. Cyber Twin usa exactamente dos Cyber Dragon de la mano mediante Invocation, sin sustitutos. Reborn exige historial apropiado realmente ejecutado. |
| Metalfoes | Fusion con materiales físicos admitidos para Adamante; Counter y Combination distinguen activación y disparos. Barajar antes de robar mantiene la resolución pendiente si el orden se desconoce; Counter en Damage Step sigue fuera del perfil. |
| Datos y formatos | Solicitud exacta vinculada a passcodes y copia revisable de datos; correcciones de construcción de los diez formatos. No autentica pools, disponibilidad ni nuevas estadísticas oficiales. |

Los costes se pagan una sola vez al activar cuando corresponde; los materiales de Fusión no se confunden con costes. Las cesiones, orden de disparos, elecciones al resolver y negaciones se reproducen desde el origen. Los efectos Mágica/Trampa conservan su tipo: Mechaba y Roar no reciben permiso general para responder a un efecto de una carta ya activa.

El catálogo conserva 21.986 registros técnicos; ese número no cuenta efectos implementados. Los materiales, restricciones y consecuencias de salida no revisados se excluyen o permanecen desconocidos. Las hipótesis de robo no se convierten en observaciones y un robo tras barajar no inventa una carta. Las búsquedas son acotadas y no prueban optimalidad universal.

## Pendientes y puntuación

Siguen pendientes las **98 identidades heredadas**, las estadísticas de **51 monstruos** y **32 propuestas**, además de fuentes fechadas para disponibilidad, pools, Skills, Legend y reglas particulares de formato. El cotejo técnico nuevo sustentó cero cambios reales de identidad o estadísticas; no se transfieren cifras por nombre. C30 y C31 requieren evaluación real con tecnologías de asistencia y pruebas en dispositivos físicos. La puntuación principal sigue siendo estructural y **provisional por decisión del usuario**; el importador de resultados reales no equivale a calibración competitiva.

La [revisión de datos y formatos R24](REVISION_DATOS_FORMATOS_R24.md) conserva consultas fallidas y recibos técnicos; un CONNECT 403 no demuestra contenidos oficiales. [Pendientes R24](ANALISIS_PENDIENTES_REVISION24.md) y el protocolo manual previo delimitan la evidencia externa que falta. Las plantillas y los estados NOT_RUN no son pruebas realizadas.

## Evidencia e historia

`evidence/release-acceptance.json` vincula la aceptación, `evidence/project-criteria.json` conserva las 32 definiciones y `evidence/revision24/` contiene los documentos de esta revisión. Las referencias fijadas de CardScripts son evidencia técnica secundaria y no se ejecutan en el analizador; no certifican rulings oficiales TCG.

La [documentación R23 aceptada](../evidence/history/revision23-accepted/docs/ESTADO_PROYECTO.md) se archiva sin reescribir sus cifras, resultados o limitaciones. Los intentos históricos fallidos o incompletos mantienen su propia identidad y no se agregan a las pruebas actuales.

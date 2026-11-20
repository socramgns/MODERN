# Pendientes después de la revisión 23

Se mantienen las definiciones y el peso de los 32 criterios originales. **27/32 están verificados y cinco pendientes: 84,375 % del listado operativo sin ponderar.** R23 cierra C18, C19, C20, C23, C24, C25 y C26 para los perfiles y dominios declarados. Este cociente no mide esfuerzo, tiempo pendiente, todas las cartas ni todas las reglas de Yu-Gi-Oh.

| Criterio | Alcance incorporado y sus límites |
| --- | --- |
| C18 · Prioridad | Activaciones y respuestas de adaptadores revisados, elección real de ambos jugadores, costes al activar, dos cesiones y resolución LIFO de un eslabón por paso. No hay activaciones entre eslabones. |
| C19 · Efectos simultáneos | Cuatro grupos SEGOC, orden dentro del grupo y declinación explícita de opcionales. Los obligatorios de ambos jugadores se conservan; los efectos sin perfil no se inventan. |
| C20 · Damage Step | Declaración y seis oportunidades explícitas, momentos de respuesta registrados, daño, prevención, FLIP de Faith y salidas al final. Un blanco que sale antes del cálculo no deja el combate bloqueado ni devuelve el ataque gastado. |
| C23 · Xyz | Gem-Knight Pearl y Number 50: Blackship of Corn con dos Normales de Nivel 4 admitidos, materiales físicos superpuestos, desacople y salida de los materiales cuando deja el campo su anfitrión. |
| C24 · Péndulo | Goldriver, Silverd, Steelen y Volflame: escalas y efecto revisado para destruir otra carta propia y colocar una carta Metalfoes admitida. Grupos desde mano y Extra boca arriba respetan espacios y flechas revisadas; no se incorporan todos los efectos Péndulo. |
| C25 · Robos inciertos | De uno a tres eventos cronológicos de robo de turno desconocido, copias sin reemplazo, pesos racionales, testigos y masa desconocida conservada ante límites. |
| C26 · Decisiones rivales | MAX propio y MIN rival en el dominio de acciones declarado. Usa manos y campos declarados completos después de cada evento; no demuestra una estrategia óptima con información oculta ni una tasa de victoria. |

Los nombres generales de C18–C20 se interpretan dentro de sus criterios originales: perfiles revisados y flujo operativo registrado. R23 no convierte esos cierres en una certificación universal de prioridad, SEGOC, Damage Step o todas las cartas. Los límites de información y acciones de C25/C26 forman parte del resultado.

## Cinco criterios todavía abiertos

| ID | Falta para cerrarlo |
| --- | --- |
| C27 | Revisar documentalmente las 98 identidades heredadas y 32 propuestas, manteniendo sus decisiones y sin asignar passcodes por coincidencias de nombre. |
| C28 | Contrastar las estadísticas de los 51 monstruos pendientes mediante fuentes y decisiones documentadas. Desconocido sigue siendo distinto de cero o variable. |
| C29 | Completar disponibilidad y pools con fuentes fechadas y las reglas particulares anunciadas: Skills, desbloqueos, Legend y condiciones históricas, digitales o de evento. |
| C30 | Completar la evaluación del flujo con tecnologías de asistencia reales, además de teclado, foco, contraste y emulación automatizados. |
| C31 | Registrar y revisar pruebas en equipos físicos. La emulación y los tres motores no sustituyen esa evidencia. |

Los importadores de expedientes, contexto de formato e informes manuales ya están preparados. Conservan incertidumbre y no certifican por sí mismos la procedencia oficial, la disponibilidad vigente o el uso físico del equipo. Véanse [Datos y formatos](REVISION_DATOS_FORMATOS_R23.md) y [Pruebas manuales](PRUEBAS_MANUALES_ACCESIBILIDAD_DISPOSITIVOS_R23.md).

El catálogo contiene 21.986 registros técnicos; eso no representa 21.986 efectos implementados. Las transiciones fuera de los perfiles revisados se excluyen o conservan como desconocidas. Las búsquedas están acotadas y no prueban optimalidad global. Una colocación inicial es un supuesto explícito y no acredita las invocaciones de turnos anteriores.

La puntuación competitiva permanece estructural y **provisional por decisión del usuario**. El importador de resultados reales está preparado. Los ejemplos y diagnósticos no son resultados de torneos ni una calibración competitiva independiente.

## Qué se comprobó

La aceptación de R23 corresponde al candidato `c9537266d03535c305cb8e882c09be1a81376669` y al [workflow remoto](https://github.com/socramgns/MODERN/actions/runs/44686493687). Pasaron los diez pasos obligatorios, incluida la batería de **88 grupos** y la puerta adicional entre motores. El runner versionado contiene 86 comandos más sintaxis y conservación del artefacto. La anotación pública compacta `R23_CI_RESULT` declara 88 grupos sin fallos y vincula build, SHA-256 del HTML, commit y ejecución; se contrasta con ese contrato y los estados remotos. CI utiliza la imagen oficial de Playwright 1.62.0 fijada por digest y verifica el arranque real, título y versión de Chromium, Firefox y WebKit, además de sus preparaciones idempotentes. La puerta estricta exige al menos dos motores ejecutados y éxito en todos los ejecutados; la cobertura se interpreta junto a esos tres arranques y el bucle de motores del runner. No se descargaron el informe completo remoto ni los JSON de sus filas individuales: se conserva el resumen compacto y el SHA-256 anunciado del informe completo, sin afirmar que ese hash se recomputó sobre bytes descargados. El resumen móvil focal se registra por separado.

El HTML aprobó **42/42 comprobaciones GUI** y **24/24 comprobaciones nuevas de accesibilidad automatizada** en ejecuciones nuevas con el helper de conexión nativa revisado, sobre el mismo build y SHA-256 que el candidato aceptado. Los informes GUI/accesibilidad anteriores permanecen archivados y no se presentan como ejecuciones de ese helper. Una ejecución móvil focal anterior de Chromium y WebKit informó **35/35** sobre los mismos bytes: se observaron su resumen de anotación y las etapas del trabajo; el HTML y su propio archivo de pruebas móvil permanecen idénticos. La comparación de los scripts GUI importados delimita sus cambios al import y a la fábrica de página del helper; no se descargó el JSON de las 35 filas móviles individuales. Los **206 casos de las siete suites Node** y los seguimientos de Azure (**74 casos**) y Campo (**39 casos**) conservan sus informes originales de máquina virtual de fuente. La aplicación sólo difiere en CSS de presentación y sus archivos Node de prueba siguen idénticos; los 22 scripts GUI tienen el cambio de preparación de página verificado por separado. El runner, sus argumentos URL, presupuestos y aserciones permanecen intactos. Los registros originales no se relabelan ni se atribuyen a una ejecución con el helper nuevo, y no se suman como una batería local completa.

El candidato anterior `7b34e2075579771064a18d06d188dc018ba4e0b3` falló 87/88 grupos remotos; la cifra se infiere de la anotación pública de grupos fallidos y el runner de 88 grupos, sin reconstruir un JSON completo. Ese artefacto y su evidencia son históricos. Su ejecución local completa se interrumpió por la reconexión del entorno al llegar a `release17_in_browser`; no se recuperó un informe final único. Se conservan por separado el registro original de un prefijo de **58 comandos** y una reanudación de **28 comandos**. La reanudación terminó con `pass:false` por `mobile_accessibility`, al faltar WebKit local. No se combinan ambos registros para atribuir un resultado global a una batería local completa. Los fallos originales y sus seguimientos permanecen identificados. No se ejecutó ni se atribuye una batería local completa nueva al HTML con el CSS corregido.

Las comprobaciones GUI actuales entregan los bytes exactos por interceptación de rutas y mantienen el contexto nativo sin conexión. El helper aplica además el comando oficial CDP al crear la página y al confirmar el marco principal para conservar el estado que comunica el motor; no sustituye propiedades JavaScript. Una comprobación previa obligatoria verifica una petición HTTP real, su fallo sin conexión y su restauración, sin interceptar esa petición de control. El fallo histórico de navegación `file://` en Chromium, atribuido a la política de aquel entorno, se conserva por separado; estas GUI no acreditan una prueba nueva de archivo local en Chromium. La entrega directa mediante Firefox pertenece al comando obligatorio del runner remoto aceptado; no se presenta como inspección de su JSON individual. No se eludieron políticas del navegador.

Los resultados originales de la ejecución interrumpida se conservan. Los seguimientos de Azure y Campo corrigen expectativas antiguas sobre usos negados y casos registrados; permanecen separados y no producen un informe global local nuevo.

## Continuar ampliando perfiles

El [uso de reglas](USO_REGLAS_REVISION23.md) y las [referencias](REFERENCIAS_REGLAS_REVISION23.md) delimitan cada incorporación. Otros efectos FLIP, otras recetas Xyz/Péndulo y cartas adicionales necesitan sus propios costes, límites, oportunidades, salidas y testigos de replay. Añadirlos amplía el catálogo de reglas; no cambia el denominador de este listado operativo cerrado.

El [estado completo](ESTADO_PROYECTO.md) conserva los 32 criterios y el [índice de evidencia](../evidence/README.md) enlaza CI, pruebas y archivos históricos.

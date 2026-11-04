# Qué falta para terminar el analizador · revisión 16

El proyecto mantiene catálogo, edición e importación de barajas, construcción por formato, estadísticas, probabilidades, exportaciones y laboratorio en un único `Analizador_YuGiOh.html`. La revisión 16 conecta una Synchro registrada de Stardust Spark Dragon con salida al Cementerio, Monster Reborn y protección. Las seis familias conservan cobertura parcial y la puntuación competitiva sigue **provisional**, por decisión del usuario.

La aceptación de la revisión 16 se apoya en la ejecución remota del commit `329f1ba15e960a949ceecc971005eee0fb622e03`: el [workflow de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/41889817768) completó con éxito las etapas obligatorias de instalación de los tres motores, compilación y comparación del HTML, batería de **65 grupos** y comprobación entre motores. El recuento corresponde al runner versionado y sus salidas obligatorias; los informes remotos individuales no se descargaron. Las fuentes incluyen **120 archivos JavaScript**. La ejecución local completa conserva su resultado **63/65 grupos aprobados**, con Firefox y WebKit no disponibles; su informe original permanece con `pass: false`, sin conciliación ni conversión a éxito. Build `d49d56207cfff495f8a356974dc554fd77c063b9a9022da8ed041d26e1a1171e`; SHA-256 `fab64088c402372a2cf8d3c8c997bdf13612c11701640bb8172694fcf00aa0cc`; tamaño **7,089,078 bytes**. La puntuación competitiva sigue provisional; no se acreditan todas las reglas, dispositivos físicos ni conformidad WCAG completa.

Publicación, descarga HTTP y GitHub Actions se observan por separado para el commit correspondiente; una configuración de CI o el número previsto de grupos no prueba su aceptación.

## Criterio de cierre de esta ampliación

| Área | Trabajo de revisión 16 | Criterio de aceptación |
| --- | --- | --- |
| Synchro de Spark | Procedimiento registrado sobre materiales físicos | Un Tuner y uno o más no Tuner admitidos, distintos, boca arriba y con nivel total 8 |
| Materiales y espacio | Destinos y zona de llegada después de retirar materiales | Propiedad conservada, Tokens reales y consecuencias revisadas; no usar mano/GY como materiales del procedimiento |
| Restricciones | Revisar ventanas, tipo de invocación y nombre | No habilitar Synchro desde el Extra bajo un bloqueo que la prohíbe ni omitir consecuencias desconocidas |
| Historial | Registrar el procedimiento y una salida posterior al GY | La cualificación de Spark procede de una transición ejecutada, no de una bandera inicial |
| Resurrección | Monster Reborn sobre la misma copia con historial válido | UID y propietario conservados, llegada actual como Invocación Especial y escudo anterior retirado |
| Origen actual y Shaman | Diferenciar llegada desde el Extra y resurrección desde GY | Conservar el bloqueo pertinente de activaciones de campo sin aplicar a la resurrección un origen actual que no tiene; origen inicial desconocido prudente |
| Protección | Usar el handler existente después de revivir | Un cargo compartido, daño de batalla conservado, uso y duración válidos; no proteger una batalla de otro turno con un escudo caducado |
| Interfaz y reproducción | Ejemplo `synchro`, informes y regresiones | Conservar los quince ejemplos anteriores, costes, estados, objetivos y replay desde el origen sobre el mismo HTML final |

La preparación del campo y sus materiales sigue siendo declarada. La invocación Synchro y sus transiciones posteriores se ejecutan y se vuelven a verificar. La ampliación no convierte el motor en un simulador de todas las cartas o de prioridad general; los materiales y consecuencias no revisados conservan sus exclusiones.

## Trabajo posterior

| Prioridad | Trabajo restante | Criterio de cierre |
| --- | --- | --- |
| 1 | Ampliar cartas, materiales y consecuencias | Más procedimientos y perfiles de invocación/salida; disparos y restricciones probados sin habilitar efectos por su texto |
| 2 | Completar mecánicas generales | Prioridad y cadenas, SEGOC, Damage Step, Flip, ataques múltiples, Xyz y Pendulum con modelos y pruebas propios |
| 3 | Ampliar probabilidades | Varios robos/eventos de azar y decisiones rivales, conservando pesos, testigos y masa desconocida |
| 4 | Resolver datos técnicos | Revisar identidades heredadas, estadísticas desconocidas y propuestas con fuentes, sin reescribir silenciosamente passcodes |
| 5 | Documentos y formatos | Rulings, disponibilidad, pools históricos/digitales, Skills, desbloqueos, Legend e impresión/evento con contexto propio |
| 6 | Aceptación y mantenimiento | Dispositivos y sistemas físicos, accesibilidad y evidencia nueva por build, descarga y CI |
| 7 | Métricas competitivas | Incorporar resultados reales con formato, banlist, fechas y procedencia, separando ajuste y validación; el importador está preparado |

Los datos externos competitivos no son necesarios para seguir ampliando las reglas del HTML. Su ausencia se conserva explícita; no se suple con etiquetas ficticias ni ejemplos técnicos de torneo.

## Datos y evidencia que conservan sus límites

El catálogo mantiene **21.986 registros**. El diagnóstico conservado identificó **98 identidades heredadas sin coincidencia técnica**, **51 monstruos con estadísticas desconocidas** y **32 propuestas de migración por nombre exacto**. Preparar una copia revisada de baraja no convierte esos casos en correcciones globales del catálogo. Cero y el marcador técnico de estadística variable «?» se distinguen de un dato ausente.

La revisión 15 conserva su [aceptación local de 63/63 grupos](https://github.com/socramgns/MODERN/blob/17eeb86257ba4bca01feffeb2c10f64d38fb3fbb/evidence/validation-summary.json), con 119 archivos JavaScript comprobados, 28 tareas de la interfaz nueva, 64 casos de Monster Reborn y 22 de copias revisadas. Su [descarga HTTP verificada](https://github.com/socramgns/MODERN/raw/17eeb86257ba4bca01feffeb2c10f64d38fb3fbb/Analizador_YuGiOh.html?download=1) corresponde al commit `17eeb86257ba4bca01feffeb2c10f64d38fb3fbb` y al SHA-256 `2a4e2c76869e9fdfce9435152fd2c0b654180a0a71c1e0c082b08555c263b804`. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/41102084215) terminó correctamente para ese commit. Sus tareas móviles fueron 35/35 comprobaciones emuladas, sin acreditar hardware físico. Esa evidencia pertenece a revisión 15 y no sustituye la aceptación de los bytes nuevos.

Las capturas TCG fechadas y FAQ oficiales OCG de Mechaba conservan sus alcances originales; no certifican de forma general este procedimiento ni todos los formatos o cadenas. La CDB fijada es una fuente técnica secundaria. Los accesos HTTP 403 anteriores siguen documentados en [FUENTES_OFICIALES.md](FUENTES_OFICIALES.md); no se presentan documentos no recibidos como revisados.

Las comprobaciones móviles emuladas no acreditan teléfonos físicos ni conformidad WCAG completa. Las pruebas de fuentes y las tareas sobre bytes compilados se distinguen. El progreso se mide con capacidades y criterios de aceptación; no existe una lista cerrada y ponderada de todas las reglas que permita un porcentaje global fiable.

Consulta el [estado del proyecto](ESTADO_PROYECTO.md), el [alcance de reglas](ALCANCE_COMBOS.md) y el [análisis histórico de revisión 15](ANALISIS_PENDIENTES_REVISION15.md).

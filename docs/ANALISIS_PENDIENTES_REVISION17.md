# Qué falta para terminar el analizador · revisión 17

El proyecto mantiene catálogo, edición e importación, construcción por formato, estadísticas, probabilidades, exportaciones y laboratorio en un único `Analizador_YuGiOh.html` sin comprimir. La revisión 17 conecta Azure-Eyes Silver Dragon con un procedimiento Synchro registrado, protección obligatoria, salida al GY, Reborn y resurrección de un Normal en Standby propia. Las seis familias siguen parciales y la puntuación competitiva permanece **provisional**, por decisión del usuario.

La aceptación de la revisión 17 se apoya en la ejecución remota del commit `b77b4ddd61885f8ed6e49df231ed305ad70d5b11`: el [workflow de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/42084234037) completó con éxito las etapas obligatorias de instalación de los tres motores, compilación y comparación del HTML, batería de **67 grupos** y comprobación entre motores. El recuento corresponde al runner versionado y sus salidas obligatorias; los informes remotos individuales no se descargaron. Las fuentes incluyen **121 archivos JavaScript**. La ejecución local completa conserva su resultado **65/67 grupos aprobados**, con Firefox y WebKit no disponibles; su informe original permanece con `pass: false`, sin conciliación ni conversión a éxito. Build `44adab61fe289978ed72e0ab2a116f521387641584ecb77a4a9e097ecc194ae1`; SHA-256 `41c301b7ec88125cf6403756a69406873fbfebce9fc96d90ef4739af20633312`; tamaño **7,107,206 bytes**. La puntuación competitiva sigue provisional; no se acreditan todas las reglas, dispositivos físicos ni conformidad WCAG completa.

El usuario pidió un HTML después de cada ampliación terminada. Cada entrega cerrada se liga a su build y bytes, conserva respaldos y verifica publicación y descarga; un resultado pendiente o una configuración de CI no se presenta como aceptación.

## Criterio de cierre de esta ampliación

| Área | Trabajo de revisión 17 | Criterio de aceptación |
| --- | --- | --- |
| Synchro de Azure | Un Tuner y uno o más no Tuner Normales de nivel total 9 | Copias distintas, boca arriba, perfiles revisados, restricciones y espacio tras retirar materiales |
| Contexto | Ruta explícita de duelo TCG | La protección obligatoria puede resolverse; no crear un pendiente sin continuación en análisis sin fases |
| Historial | Cualificación apropiada obtenida de una invocación ejecutada | Una preparación inicial o la llegada prestada por Spirit no sustituye el procedimiento |
| Reborn | Revivir desde GY la misma copia con historia válida | Propietario y UID conservados, llegada actual Especial desde GY y nueva protección obligatoria |
| Protección | Pendiente compartido por las tres Invocaciones Especiales revisadas | Una oportunidad obligatoria por llegada real, sin duplicación, setup ficticio ni OPT inventado |
| Duración y objetivos | Dragones actuales al resolver hasta fin del turno siguiente | No heredar a futuras llegadas, no restaurar otra presencia ni impedir batalla o daño |
| Standby | Resurrección de un Normal admitido en Standby propia | Ventana, uso, espacio, propietario, respuestas y consecuencias registrados |
| Interfaz y entrega | Ejemplo `azure`, objetivos, informes y regresiones | Conservar los dieciséis anteriores, replay y mismo HTML final verificado y sin comprimir |

La presencia inicial de Blue-Eyes y otros materiales sigue siendo un supuesto. La Synchro de Azure y las transiciones posteriores son las que se ejecutan y se vuelven a comprobar. La ampliación no crea una regla general para todas las resurrecciones, condiciones de invocación o cadenas del juego.

## Trabajo posterior

| Prioridad | Trabajo restante | Criterio de cierre |
| --- | --- | --- |
| 1 | Más cartas, procedimientos y consecuencias | Registrar disparos y restricciones de otros perfiles; Albaz, Wolf y Spirit Link conservan exclusiones pertinentes de Reborn |
| 2 | Mecánicas generales | Prioridad, cadenas, efectos simultáneos, Damage Step, Flip, ataques múltiples, Xyz y Pendulum con modelos y pruebas propios |
| 3 | Probabilidades | Varios robos y eventos de azar con decisiones rivales, pesos, testigos y masa desconocida explícitos |
| 4 | Datos técnicos | Fuentes y revisión de identidades heredadas, estadísticas desconocidas y propuestas, sin migraciones silenciosas |
| 5 | Documentos y formatos | Rulings, disponibilidad, pools históricos/digitales, Skills, desbloqueos, Legend e impresión/evento |
| 6 | Aceptación y mantenimiento | Dispositivos reales, accesibilidad y evidencia renovada de cada build, descarga y CI |
| 7 | Puntuación competitiva | Incorporar resultados reales con formato, banlist, fechas y procedencia, separando ajuste y validación |

El importador competitivo ya está preparado. La ausencia de datos externos no impide continuar con las reglas del HTML, pero tampoco se suple con fixtures técnicos ni etiquetas ficticias de torneo.

## Datos y antecedentes

Se mantienen **21.986 registros**, **98 identidades heredadas sin cotejo técnico**, **51 monstruos con estadísticas desconocidas** y **32 propuestas de identidad** por revisar. Esas categorías no representan correcciones globales aplicadas. Cero y el marcador técnico variable «?» se distinguen de un dato ausente, sin inventar estadísticas.

La revisión 16 conserva su [aceptación remota de 65 grupos](https://github.com/socramgns/MODERN/blob/309a8bdb983807d622c1ad5df8106a09688babf3/evidence/remote-acceptance.json) sobre el candidato `329f1ba15e960a949ceecc971005eee0fb622e03`, con 120 archivos JavaScript, 58 casos de Spark y 38 tareas de su interfaz. Su [workflow de aceptación](https://github.com/socramgns/MODERN/actions/runs/41889817768) y el [CI del commit final](https://github.com/socramgns/MODERN/actions/runs/41893149441) terminaron correctamente. El commit final `309a8bdb983807d622c1ad5df8106a09688babf3` conserva el [HTML descargado y verificado](https://github.com/socramgns/MODERN/raw/309a8bdb983807d622c1ad5df8106a09688babf3/Analizador_YuGiOh.html?download=1), SHA-256 `fab64088c402372a2cf8d3c8c997bdf13612c11701640bb8172694fcf00aa0cc`. Su informe local permanece con `pass: false`, 63/65 grupos y Firefox/WebKit no disponibles por el bloqueo de descarga. Esa evidencia pertenece a revisión 16; no sustituye la aceptación de los bytes nuevos.

Las capturas TCG fechadas y las FAQ OCG de Mechaba conservan sus alcances. La CDB fijada es una fuente técnica secundaria y no acredita todos los rulings o disponibilidad oficial. Los HTTP 403 anteriores permanecen documentados en [FUENTES_OFICIALES.md](FUENTES_OFICIALES.md); los documentos no recibidos no se presentan como revisados. La emulación móvil no acredita teléfonos físicos ni conformidad WCAG completa.

Consulta el [estado del proyecto](ESTADO_PROYECTO.md), el [alcance de reglas](ALCANCE_COMBOS.md) y el [análisis histórico de revisión 16](ANALISIS_PENDIENTES_REVISION16.md). El avance se mide por capacidades y criterios de aceptación; no existe un porcentaje global fiable para todas las cartas y reglas.

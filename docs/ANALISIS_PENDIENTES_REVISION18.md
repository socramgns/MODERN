# Qué falta para terminar el analizador · revisión 18

El proyecto mantiene catálogo, edición e importación, construcción por formato, estadísticas, probabilidades, exportaciones y laboratorio en un único `Analizador_YuGiOh.html` sin comprimir. La revisión 18 conecta una Invocación Link real de Spirit with Eyes of Blue con su tributo y resurrección por Monster Reborn, y corrige la vigencia de su restricción continua. Las seis familias siguen parciales y la puntuación competitiva permanece **provisional**, por decisión del usuario.

La aceptación de la revisión 18 se apoya en la ejecución remota del commit `0807cd758ee30c3824330bcf59eb11f5d298df60`: el [workflow de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/42152616194) completó con éxito las etapas obligatorias de instalación de los tres motores, compilación y comparación del HTML, batería de **69 grupos** y comprobación entre motores. El recuento corresponde al runner versionado y sus salidas obligatorias; los informes remotos individuales no se descargaron. Las fuentes incluyen **121 archivos JavaScript**. La ejecución local completa conserva su resultado **67/69 grupos aprobados**, con Firefox y WebKit no disponibles; su informe original permanece con `pass: false`, sin conciliación ni conversión a éxito. Build `7b027eadfd3aa793f479a4225b6a52e3e96471d9a11276ed8ad7754f6c9f16ab`; SHA-256 `622328ee699c2a6407c5f20e724fe0f613bc6479858d4c2b4f222c86e8fdc9bb`; tamaño **7,114,591 bytes**. La puntuación competitiva sigue provisional; no se acreditan todas las reglas, dispositivos físicos ni conformidad WCAG completa.

El tributo de Spirit comprueba también las restricciones vigentes de Wyrm y de nombre antes de pagar, y en el HTML completo excluye campos continuos no revisados. Su llegada automática a la zona apuntada por un Wolf activo con recuperación disponible queda fuera del subconjunto hasta registrar ese disparo; no se omite silenciosamente. Una negación de Veiler/Imperm ya resuelta sigue negando el efecto activado en campo aunque Spirit salga como coste; una nueva respuesta que lo apunte después del tributo no se ofrece. Mechaba y Roar conservan sus costes y la negación de activación sin retirar de nuevo una fuente ya tributada.

Cada ampliación cerrada se liga a su build y bytes, conserva respaldos y comprueba publicación y descarga; un resultado pendiente o una configuración de CI no se presenta como aceptación.

## Criterio de cierre de esta ampliación

| Área | Trabajo de revisión 18 | Criterio de aceptación |
| --- | --- | --- |
| Historial | Spirit obtiene cualificación mediante una Invocación Link ejecutada | Una declaración inicial o metadata importada no habilitan por sí solas su resurrección |
| Reborn | Revivir la misma copia de Spirit desde GY | UID, propietario e historial conservados; llegada Especial en Main, sólo Ataque |
| Búsqueda | Respetar la condición exclusiva de la Invocación Link | No crear un pendiente nuevo de Mausoleum al revivir |
| Límites y pagos | Conservar el tributo por nombre y turno y las respuestas físicas | Reborn no restaura un uso gastado; una negación conserva los pagos pertinentes |
| Restricción continua | Comprobar la presencia viva de Spirit antes del intento registrado | Controlador actual, cara, negación y salida; no evadirla usando Spirit como material |
| Interfaz y búsqueda | Ejemplo `spirit-reborn`, objetivos, búsqueda acotada y replay | Conservar los diecisiete ejemplos anteriores y verificar la ruta desde su origen |
| Entrega | Un HTML autónomo actualizado sin comprimir | Compilación reproducible, evidencias por entorno, publicación y descarga del mismo archivo |

La ruta del ejemplo parte de una mano física e invoca Spirit mediante el procedimiento real. Su tributo y posterior Reborn son transiciones ejecutadas. No se crea una transferencia de control ficticia para demostrar una historia rival que el motor actual no pueda producir. Los casos diagnósticos que alteren estado para comprobar rechazos o propiedad no equivalen a una ruta legal presenciada.

## Trabajo posterior

| Prioridad | Trabajo restante | Criterio de cierre |
| --- | --- | --- |
| 1 | Más cartas, procedimientos y consecuencias | Registrar Albaz al llegar y geometría de Wolf revivido; sus exclusiones pertinentes de Reborn permanecen |
| 2 | Mecánicas generales | Prioridad, cadenas, efectos simultáneos, Damage Step, Flip, ataques múltiples, Xyz y Pendulum con modelos propios |
| 3 | Probabilidades | Varios robos y azar con decisiones rivales, pesos, testigos y masa desconocida explícitos |
| 4 | Datos técnicos | Fuentes y revisión de identidades heredadas, estadísticas desconocidas y propuestas, sin migraciones silenciosas |
| 5 | Documentos y formatos | Rulings, disponibilidad, pools históricos/digitales, Skills, desbloqueos, Legend e impresión/evento |
| 6 | Aceptación y mantenimiento | Dispositivos reales, accesibilidad y evidencia renovada de cada build, descarga y CI |
| 7 | Puntuación competitiva | Resultados reales con formato, banlist, fechas y procedencia, separando ajuste y validación |

El importador competitivo ya está preparado. La ausencia de datos externos no impide continuar las reglas del HTML, pero no se suple con fixtures técnicos ni etiquetas ficticias de torneo.

## Datos y antecedentes

Se mantienen **21.986 registros**, **98 identidades heredadas sin cotejo técnico**, **51 monstruos con estadísticas desconocidas** y **32 propuestas de identidad** por revisar. Esas categorías no representan correcciones globales aplicadas. Cero y el marcador técnico variable «?» se distinguen de un dato ausente, sin inventar estadísticas.

La revisión 17 conserva su [aceptación remota de 67 grupos](https://github.com/socramgns/MODERN/actions/runs/42084234037) sobre el candidato `b77b4ddd61885f8ed6e49df231ed305ad70d5b11`. El commit final `d964eb57322dce3a78339f6ae6541ed18323792e` conserva el [HTML publicado y descargado](https://github.com/socramgns/MODERN/raw/d964eb57322dce3a78339f6ae6541ed18323792e/Analizador_YuGiOh.html?download=1), SHA-256 `41c301b7ec88125cf6403756a69406873fbfebce9fc96d90ef4739af20633312`. La ejecución local de esa revisión permanece con `pass: false`, 65/67 grupos y Firefox/WebKit no disponibles. El workflow del candidato validó el mismo código, pruebas, configuración y HTML; el resultado de un commit posterior de documentación se observa por separado. Esa evidencia pertenece a revisión 17 y no sustituye la aceptación de los bytes nuevos.

Las capturas TCG fechadas y las FAQ OCG de Mechaba conservan sus alcances. La CDB fijada es una fuente técnica secundaria y no acredita todos los rulings o disponibilidad oficial. Los HTTP 403 anteriores permanecen documentados en [FUENTES_OFICIALES.md](FUENTES_OFICIALES.md); los documentos no recibidos no se presentan como revisados. La emulación móvil no acredita teléfonos físicos ni conformidad WCAG completa.

Consulta el [estado del proyecto](ESTADO_PROYECTO.md), el [alcance de reglas](ALCANCE_COMBOS.md) y el [análisis histórico de revisión 17](ANALISIS_PENDIENTES_REVISION17.md). El avance se mide por capacidades y criterios de aceptación; no existe un porcentaje global fiable para todas las cartas y reglas.

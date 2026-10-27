# Estado de la revisión 7

La aplicación se entrega como un único `Analizador_YuGiOh.html`. El original y las revisiones previas se conservan. La puntuación permanece estructural y provisional por decisión del usuario.

La tabla describe la implementación de revisión 7 aceptada localmente. La aceptación identifica los bytes finales; los registros de distribución y CI remoto se consultan por separado.

| Área | Implementación de la fuente | Alcance |
| --- | --- | --- |
| Catálogo | 21.986 registros; incorporados los 2.333 passcodes que faltaban de la fuente principal fijada | Los 14.759 registros de `cards.cdb` están representados; la fuente secundaria no acredita disponibilidad oficial ni efectos completos |
| Identidad | IDs heredados conservados, alias físicos y procedencia; actualización idempotente | 98 registros heredados siguen clasificados; 32 migraciones propuestas requieren revisión, sin sustituciones silenciosas |
| Lista TCG | Publicación oficial de fecha 19/10/2026 recuperada por HTTPS y cotejada: 255 nombres restringidos y sus límites | No certifica pools, passcodes, todos los textos/rulings ni que una publicación fechada siga siendo la última |
| Ventanas | Respuestas registradas fuera de Main y acciones propias admitidas en Main 2 | Veiler conserva Main rival; no se habilita Damage Step general ni simetría ficticia de todos los handlers |
| Efectos | Se conservan Gazelle, Balelynx, Shthana y Roar; Mechaba añade trece paquetes de monstruos en mano/GY, incluidos los efectos registrados de Longyuan | Identidad, origen antes de costes, destinos y límites explícitos; seis familias todavía parciales |
| Referencias de Mechaba | Tres FAQ oficiales OCG en japonés con documentos, campos y citas fijados por hash | Referencias para el criterio modelado; no equivalen a certificación general de rulings TCG ni autentican de nuevo el transporte al compilar |
| Cadenas | Mechaba/Roar y contrarrespuestas Roar con pagos físicos, velocidad, LIFO y replay | Hasta tres contrarrespuestas registradas; sin prioridad arbitraria ni SEGOC universal |
| Laboratorio | Objetivos visuales, preparación física, filtros y ocho ejemplos incorporados con pasos manuales | Mantiene importación JSON, reanudación, deshacer y comparación; campo inicial declarado y sin ejecución automática |
| Robo incierto | Distribuciones exactas condicionadas al barajado uniforme y orden explícito cuando existe | No inventa el siguiente robo ni ejecuta acciones desconocidas |
| Búsqueda | Profundidad, turnos, tiempo y estados diferenciados | Una búsqueda vacía o acotada no acredita una derrota ni ausencia de jugadas |
| Mantenimiento | Fuente modular, pruebas y workflow para recompilar/comparar el HTML | La fuente puede versionarse sin alterar la entrega de un solo archivo |

## Aceptación local de la revisión 7

La revisión 7 pasó **44/44 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `9361b6748958d6adfd53f3c0efdcfb54a1115df58d9e8f37e142884fbf90142b`; SHA-256 `928bd2c76835e8ab75ef15ae58d288c6dc3a5dfcdcb384152b5ad2c0cec3fa6e`. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la comprobación de descarga y la ejecución remota de GitHub Actions se registran por separado; la aceptación local no acredita por sí sola esos pasos.

Los resultados definitivos se consultan en `dist/validation-summary.json`, `tests/local-file-delivery-results.json`, `tests/compatibility-results.json` y los informes específicos. Solo son válidos para el build y SHA-256 que identifican. Las sondas de desarrollo anteriores no sustituyen las comprobaciones del HTML final.

La revisión 7 comprobó el flujo mediante navegación directa `file:` sin Internet en Firefox, sin cambiar políticas. Chromium conserva una restricción administrativa de navegación local en este entorno. Firefox y WebKit están instalados; los tres motores aprobaron las comprobaciones registradas de compatibilidad. WebKit tiene una limitación de emulación offline local documentada. Estos límites no se presentan como un fallo demostrado del HTML en otros sistemas.

## Pendientes que conservan su alcance explícito

- Todos los efectos y arquetipos restantes, prioridad/cadenas generales, SEGOC, Damage Step, Flip, múltiples ataques y Pendulum.
- Decisiones adversariales óptimas, metajuego y predicción de resultados competitivos.
- Disponibilidad oficial y datos históricos/digitales por formato, Skills, desbloqueos, Legend e impresión/evento.
- Continuación probabilística completa después de barajar: el nuevo panel describe la incertidumbre, pero no convierte una rama hipotética en un robo observado.
- Datos competitivos externos reales para la calibración. El importador ya existe y no se fabrican etiquetas.
- Pruebas en dispositivos y sistemas operativos reales adicionales; una batería automatizada no certifica todas las combinaciones.

El análisis actual está en [ANALISIS_PENDIENTES_REVISION7.md](ANALISIS_PENDIENTES_REVISION7.md). `ANALISIS_PENDIENTES_REVISION5.md` se conserva como antecedente histórico; sus puntos ya resueltos no son pendientes actuales.

## Evidencia aceptada de la revisión 6

La revisión 6 pasó **41/41 grupos de pruebas** sobre el HTML final; se comprobaron 114 archivos JavaScript. Chromium, Firefox y WebKit aprobaron sus comprobaciones. Firefox completó también el flujo del archivo local sin conexión. Build `a214f91b5554fb95b64a72cce9a1729eab468b9729229d97494980688b3de119`; SHA-256 `9fb3b88702cd55655125975be8acba7340545619312e3242723908866957ea37`. El informe íntegro de revisión 6 está en su [evidencia histórica fijada por commit](https://github.com/socramgns/MODERN/blob/acb9e81573b43318041fc7ab57500dc1f97adc11/evidence/validation-summary.json). Los informes `dist/validation-summary.json` y `evidence/validation-summary.json` de revisión 7 corresponden a los bytes de revisión 7. El workflow de revisión 6 terminó correctamente en [GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40454637921). Estos resultados históricos pertenecen exclusivamente a revisión 6 y no sustituyen la aceptación propia de revisión 7.

# Estado de la revisión 6

La aplicación se entrega como un único `Analizador_YuGiOh.html`. El original y las revisiones previas se conservan. La puntuación permanece estructural y provisional por decisión del usuario.

| Área | Resultado de esta revisión | Alcance |
| --- | --- | --- |
| Catálogo | 21.986 registros; incorporados los 2.333 passcodes que faltaban de la fuente principal fijada | Los 14.759 registros de `cards.cdb` están representados; la fuente secundaria no acredita disponibilidad oficial ni efectos completos |
| Identidad | IDs heredados conservados, alias físicos y procedencia; actualización idempotente | 98 registros heredados siguen clasificados; 32 migraciones propuestas requieren revisión, sin sustituciones silenciosas |
| Lista TCG | Publicación oficial de fecha 19/10/2026 recuperada por HTTPS y cotejada: 255 nombres restringidos y sus límites | No certifica pools, passcodes, todos los textos/rulings ni que una publicación fechada siga siendo la última |
| Ventanas | Respuestas registradas fuera de Main y acciones propias admitidas en Main 2 | Veiler conserva Main rival; no se habilita Damage Step general ni simetría ficticia de todos los handlers |
| Efectos | Gazelle desde mano, protección de Balelynx desde GY, Shthana y activación de Roar en paquetes registrados | Consecuencias, materiales y ventanas explícitos; seis familias todavía parciales |
| Cadenas | Mechaba/Roar y contrarrespuestas Roar con pagos físicos, velocidad, LIFO y replay | Hasta tres contrarrespuestas registradas; sin prioridad arbitraria ni SEGOC universal |
| Laboratorio | Objetivos visuales, preparación de zonas/columnas/copias físicas, etiquetas y filtros/páginas de acciones | Mantiene importación JSON, reanudación, deshacer y comparación; campo inicial declarado |
| Robo incierto | Distribuciones exactas condicionadas al barajado uniforme y orden explícito cuando existe | No inventa el siguiente robo ni ejecuta acciones desconocidas |
| Búsqueda | Profundidad, turnos, tiempo y estados diferenciados | Una búsqueda vacía o acotada no acredita una derrota ni ausencia de jugadas |
| Mantenimiento | Fuente modular, pruebas y workflow para recompilar/comparar el HTML | La fuente puede versionarse sin alterar la entrega de un solo archivo |

## Aceptación

Los resultados definitivos se consultan en `dist/validation-summary.json`, `tests/local-file-delivery-results.json`, `tests/compatibility-results.json` y los informes específicos. Solo son válidos para el build y SHA-256 que identifican. Las sondas de desarrollo anteriores no sustituyen las comprobaciones del HTML final.

El flujo del usuario se comprueba mediante navegación directa `file:` sin Internet en Firefox, sin cambiar políticas. Chromium conserva una restricción administrativa de navegación local en este entorno. Firefox y WebKit se instalaron para ampliar las comprobaciones; los resultados exactos de cada motor y sus limitaciones se guardan en los informes.

## Pendientes que conservan su alcance explícito

- Todos los efectos y arquetipos restantes, prioridad/cadenas generales, SEGOC, Damage Step, Flip, múltiples ataques y Pendulum.
- Decisiones adversariales óptimas, metajuego y predicción de resultados competitivos.
- Disponibilidad oficial y datos históricos/digitales por formato, Skills, desbloqueos, Legend e impresión/evento.
- Continuación probabilística completa después de barajar: el nuevo panel describe la incertidumbre, pero no convierte una rama hipotética en un robo observado.
- Datos competitivos externos reales para la calibración. El importador ya existe y no se fabrican etiquetas.
- Pruebas en dispositivos y sistemas operativos reales adicionales; una batería automatizada no certifica todas las combinaciones.

El análisis de la revisión anterior se conserva en `ANALISIS_PENDIENTES_REVISION5.md` como antecedente fechado; los puntos resueltos aquí no deben interpretarse como pendientes actuales.

## Resultado de aceptación de esta entrega

La revisión 6 pasó **41/41 grupos de pruebas** sobre el HTML final; se comprobaron 114 archivos JavaScript. Chromium, Firefox y WebKit aprobaron sus comprobaciones. Firefox completó también el flujo del archivo local sin conexión. Build `a214f91b5554fb95b64a72cce9a1729eab468b9729229d97494980688b3de119`; SHA-256 `9fb3b88702cd55655125975be8acba7340545619312e3242723908866957ea37`. El informe íntegro está en `evidence/validation-summary.json` de la rama publicada y en `dist/validation-summary.json` de la fuente de trabajo. La ejecución remota del workflow se consulta por separado en GitHub Actions.

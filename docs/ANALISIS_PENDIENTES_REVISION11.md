# Qué falta para terminar el analizador · revisión 11

La entrega sigue siendo un único `Analizador_YuGiOh.html`, con catálogo, importación y edición de barajas, estadísticas, probabilidades, exportaciones y un laboratorio de jugadas registradas. La puntuación competitiva permanece **provisional**, como solicitó el usuario.

La revisión 11 pasó **52/52 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `d51427f6537cba496a1e7998ab456cd913c118d733968542bc85922d41989d82`; SHA-256 `84dff70652ed8b7eceab7d6fdbbb4864396c745ecd5440beff482e96da7396ed`; tamaño **6,961,491 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 11 se comprueban por separado y se registran con el commit correspondiente.

La revisión 10 conserva una [aceptación local de 50/50 grupos](https://github.com/socramgns/MODERN/blob/bfa5d3cd6fd307e529ab68d9b15469b558e8a9d1/evidence/validation-summary.json). La ejecución inicial aprobó 49 grupos; la auditoría del catálogo pasó 13 comprobaciones después de restaurar y cotejar la caché técnica omitida al crear el espacio nuevo, sin cambiar el HTML ni el código. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40736683938) terminó **correctamente**, incluidas las pruebas del entregable y la comprobación entre motores. Esta evidencia corresponde al commit `bfa5d3cd6fd307e529ab68d9b15469b558e8a9d1` y no sustituye la comprobación de los bytes nuevos.

## Avance de esta revisión

- Seguimiento visible de cantidades y requisitos cumplidos o pendientes: monstruos boca arriba, Mágicas/Trampas boca arriba, Mágicas/Trampas colocadas, mano, LP, fase, turno y jugador activo.
- Recalcula el seguimiento al ejecutar, deshacer, aplicar un objetivo y reanudar un informe. El resumen importado no reemplaza la comprobación del estado y objetivo validados; un contexto caducado no conserva el aviso anterior.
- Distingue las Mágicas/Trampas boca arriba, colocadas y de Campo en el tablero.
- Avisa cuando el objetivo ya se cumple en la preparación inicial declarada, sin fabricar jugadas ni certificar la historia previa. Las búsquedas y el muestreo conservan sus requisitos de acciones y replay.
- Conserva once ejemplos, 21.986 registros y seis familias parciales, incluidos Spark, Spirit, Mechaba, Roar y las dos activaciones de Mágicas de Campo registradas.

El seguimiento describe el objetivo del escenario; no es un porcentaje de terminación del proyecto ni una probabilidad de ganar. Definir un objetivo no registra automáticamente las acciones necesarias para alcanzarlo. Una búsqueda incompleta tampoco demuestra derrota ni imposibilidad fuera del registro.

## Trabajo restante y criterio de cierre

| Prioridad | Trabajo pendiente | Criterio de cierre |
| --- | --- | --- |
| 1 | Ampliar efectos y activaciones registradas | Más cartas y rutas con ventanas, velocidades, costes, objetivos, usos, destinos y replay revisados; otras Mágicas de Campo y Trampas de Velocidad 2 |
| 2 | Continuar tras barajar con orden desconocido | Ramas y pesos probabilísticos explícitos, sin presentar robos hipotéticos como observados ni búsquedas incompletas como derrota |
| 3 | Ampliar mecánicas generales | Modelos y aceptación propios para prioridad, SEGOC, Damage Step, Flip, ataques múltiples y Pendulum |
| 4 | Completar documentos, datos y formatos | Reglamento, rulings y disponibilidad con fuentes; pools históricos/digitales, Skills, desbloqueos, Legend e impresión/evento con contexto independiente |
| 5 | Validar métricas competitivas | Barajas y resultados externos reales con formato, banlist, fechas y procedencia, separados entre ajuste y validación; el importador ya está preparado |
| 6 | Ampliar aceptación y mantenimiento | Más dispositivos y sistemas, tareas de accesibilidad, evidencia renovada de los bytes finales y resultados de descarga y CI observados por revisión |

El catálogo conserva 98 identidades heredadas clasificadas, 32 propuestas de migración y 51 monstruos heredados sin estadísticas conocidas. Esa revisión de datos debe preservar la procedencia y los passcodes; no equivale a implementar efectos.

Las FAQ OCG guardadas documentan casos de monstruos y su lugar de activación. No certifican por sí solas las reglas de reemplazo de Mágicas de Campo ni todo el TCG. Los intentos de consulta del PDF/FAQ de Campo recibieron HTTP 403 y siguen documentados en [FUENTES_OFICIALES.md](FUENTES_OFICIALES.md).

El avance se mide por capacidades registradas y criterios de aceptación de cada entrega, sin asignar un porcentaje global a simular todas las cartas y reglas. Consulta el [estado del proyecto](ESTADO_PROYECTO.md) y el [alcance de los combos](ALCANCE_COMBOS.md). El [análisis de revisión 10](ANALISIS_PENDIENTES_REVISION10.md) se conserva como antecedente ligado a sus propios resultados.

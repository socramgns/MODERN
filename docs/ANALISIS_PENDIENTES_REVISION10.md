# Qué falta para terminar el analizador · revisión 10

La entrega sigue siendo un único `Analizador_YuGiOh.html`, con catálogo, importación y edición de barajas, estadísticas, probabilidades, exportaciones y un laboratorio de jugadas registradas. La puntuación competitiva permanece **provisional**, como solicitó el usuario.

La revisión 10 pasó **50/50 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `5ee44d69c129cc4db4d922c9f064723760b1b1f3596dfb9a0f21ef694ff7fb7a`; SHA-256 `c2cafe3fdba2bc8d5cefaa5f7a4fe5858204fc5a61b50b2723bc04a04dcad807`; tamaño **6,953,153 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado. La ejecución inicial aprobó 49 grupos; la auditoría del catálogo aprobó sus 13 comprobaciones al restaurar y cotejar la caché técnica omitida en el espacio nuevo, sin cambiar el HTML ni el código. La evidencia conserva ambos resultados.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 10 se comprueban por separado y se registran con el commit correspondiente.

La revisión 9 conserva una [aceptación local de 48/48 grupos](https://github.com/socramgns/MODERN/blob/213d323f05fbb57cffce8b19a36afa6f132a989a/evidence/validation-summary.json). Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40614521563) terminó **correctamente** para el commit `213d323f05fbb57cffce8b19a36afa6f132a989a`. Esa evidencia corresponde a revisión 9 y no sustituye la comprobación de los bytes nuevos.

## Avance de esta revisión

- Objetivos propios de Mágicas/Trampas boca arriba y colocadas, incluidas las Mágicas de Campo, separados de monstruos boca arriba y mano.
- Cantidades por copias físicas e identidad canónica, validación compartida y transporte del objetivo en escenarios e informes. Una misma carta no satisface a la vez las listas boca arriba y colocada.
- Selección de cartas por tipo e inventario y conservación de los objetivos anteriores. `requiredFieldIds` sigue significando monstruos propios boca arriba; los nuevos campos no cambian esa semántica.
- El ejemplo de Campo conserva sus pasos y exige ahora Sanctuary boca arriba además de Wolf en campo y Roar en mano. Los once identificadores de ejemplos permanecen disponibles.
- Se conservan los 21.986 registros, las seis familias parciales y las rutas previas, incluidas Spark, Spirit, Mechaba, Roar y las dos activaciones de Mágicas de Campo registradas.

Definir un objetivo comprueba un estado; no registra automáticamente la acción necesaria para alcanzarlo ni acredita la historia de un campo inicial declarado. Las búsquedas conservan sus límites y una búsqueda incompleta no demuestra derrota ni imposibilidad de una jugada legal fuera del registro.

## Trabajo restante y criterio de cierre

| Prioridad | Trabajo pendiente | Criterio de cierre |
| --- | --- | --- |
| 1 | Ampliar efectos y activaciones registradas | Cartas y rutas revisadas con ventanas, velocidades, costes, objetivos, usos, destinos y replay propios; incluir otras Mágicas de Campo y Trampas de Velocidad 2 |
| 2 | Continuar tras barajar con orden desconocido | Ramas probabilísticas y pesos explícitos, sin presentar un robo hipotético como observado ni una búsqueda incompleta como derrota |
| 3 | Ampliar mecánicas generales | Modelos y aceptación propios para prioridad, SEGOC, Damage Step, Flip, ataques múltiples y Pendulum |
| 4 | Completar documentos, datos y formatos | Reglamento/rulings y disponibilidad con fuentes; pools históricos/digitales, Skills, desbloqueos, Legend e impresión/evento con contexto independiente |
| 5 | Validar métricas competitivas | Barajas y resultados externos reales con formato, banlist, fechas y procedencia, separados entre ajuste y validación; el importador ya está preparado |
| 6 | Ampliar aceptación y mantenimiento | Más dispositivos y sistemas, tareas de accesibilidad, evidencia renovada de los bytes finales y resultados de distribución y CI observados para cada revisión |

El catálogo conserva 98 identidades heredadas clasificadas, 32 propuestas de migración y 51 monstruos heredados sin estadísticas conocidas. Revisarlas exige conservar procedencia y passcodes; esa tarea de datos no equivale a implementar sus efectos.

Las FAQ OCG guardadas documentan casos de monstruos y su lugar de activación. No certifican por sí solas las reglas de reemplazo de Mágicas de Campo ni todo el TCG. Los intentos de consulta del PDF/FAQ de Campo recibieron HTTP 403 y siguen documentados en [FUENTES_OFICIALES.md](FUENTES_OFICIALES.md).

No se asigna un porcentaje global a simular todas las cartas y reglas. El progreso se mide por las capacidades registradas y los criterios de aceptación de cada entrega. Consulta el [estado del proyecto](ESTADO_PROYECTO.md) y el [alcance de los combos](ALCANCE_COMBOS.md).

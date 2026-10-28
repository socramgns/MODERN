# Qué falta para terminar el analizador · revisión 9

La entrega sigue siendo un único `Analizador_YuGiOh.html`, con catálogo, importación y edición de barajas, estadísticas, probabilidades, exportaciones y un laboratorio de jugadas registradas.

La revisión 9 pasó **48/48 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `b2e655dc990e6951cf886945774c028ac97a3e55c4f84010a1edb9942f1b0ba7`; SHA-256 `0976989809a5c2c96404149679d4806a89d13a6e3efa61c500e94da3a9793a2b`; tamaño **6.951.935 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la comprobación de descarga HTTP y la ejecución remota de GitHub Actions de revisión 9 se registran por separado; esta aceptación local no acredita por sí sola esos pasos.

La revisión 8 conserva una [aceptación local de 46/46 grupos](https://github.com/socramgns/MODERN/blob/b1a478d95020a7a718b2de0ef01b7793013058fd/evidence/validation-summary.json), con 114 archivos JavaScript comprobados, Chromium, Firefox y WebKit y apertura directa sin conexión en Firefox. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40599777991) terminó **correctamente** para el commit `b1a478d95020a7a718b2de0ef01b7793013058fd`: instalación, actualización idempotente, compilación/comparación del HTML, pruebas y comprobación entre motores aprobadas. Esta evidencia pertenece a revisión 8 y no sustituye la aceptación de revisión 9.

## Qué incluye esta revisión

- Dos activaciones de cartas Mágicas de Campo desde mano: Mausoleum of White y Salamangreat Sanctuary, con identidad exacta, `SINGLE` y `NONE`. Se conservan quince paquetes de monstruos y tres Mágicas Normales.
- Preparación física anterior a respuestas: el Field Spell previo admitido, boca arriba o colocado, va a GY por regla, sin destrucción ni coste de efecto. No vuelve si se niega la carta nueva.
- Campo separado de las cinco zonas de Mágicas/Trampas y de sus columnas; Mechaba paga una Mágica real y puede negar/desterrar la carta nueva. Roar niega y destruye sin Spark o Balelynx como protección de una carta en campo cuando la activación quedó negada.
- Contrarrespuesta Roar que permite resolver la carta nueva, sin restaurar el Field Spell anterior. Se preservan costes, UID, objetivos y replay.
- Usos globales de Normal adicional de Mausoleum y reincarnación de Sanctuary conservados al cambiar copias. La ganancia de ATK ya resuelta de Mausoleum mantiene su duración al salir la fuente.
- Once ejemplos incluidos: los diez anteriores y uno de activación/reemplazo de Campo, con campos declarados y pasos manuales. Los flujos registrados y el replay se comprobaron sobre los bytes finales de revisión 9.

## Qué queda fuera

El efecto de Mausoleum desde GY y otros efectos no registrados no se ejecutan automáticamente por activar la carta. Otras Mágicas de Campo, perfiles de salida desconocidos y activaciones generales de Trampas de Velocidad 2 requieren una ampliación específica. Mechaba es Velocidad 2 y no puede responder a Roar, Counter Trap de Velocidad 3.

La exclusión de efectos GY de Mágicas/Trampas respeta el texto de Mechaba: activar un efecto allí no equivale a activar una carta Mágica/Trampa. El paquete conjunto Chixiao/Mo Ye, la prioridad arbitraria y los efectos desconocidos continúan fuera del registro.

Droll conserva su máximo de una copia del snapshot TCG y su restricción de efecto `NONE`; ningún ejemplo obtiene una segunda copia ilegal ni un contador de uso ficticio. Las fixtures unitarias de recuperación de la misma copia están identificadas como pruebas y no como combos del producto.

Los objetivos de campo de la interfaz cuentan actualmente monstruos boca arriba. Los objetivos directos de Mágicas/Trampas en campo siguen pendientes; el ejemplo nuevo usa Wolf y Roar en mano como resultado de la ruta que requiere Sanctuary.

Las consultas nuevas al PDF/FAQ oficial de Campo recibieron HTTP 403. Las tres FAQ japonesas guardadas desde revisión 7 documentan casos de monstruos y no certifican por sí solas estas nuevas reglas de Field Spells. Consulta [FUENTES_OFICIALES.md](FUENTES_OFICIALES.md).

El catálogo conserva 98 identidades heredadas clasificadas, 32 propuestas de migración y 51 monstruos heredados sin estadísticas conocidas. Esa revisión de datos debe respetar procedencia e identidades y no equivale a implementar efectos.

## Prioridades para continuar

| Prioridad | Trabajo pendiente | Criterio de cierre |
| --- | --- | --- |
| 1 | Ampliar efectos y activaciones registradas | Nuevas Mágicas de Campo, efectos revisados y Trampas de Velocidad 2 con preparación, ventana, velocidad, pagos, destinos y replay propios |
| 2 | Continuar después de barajar con orden desconocido | Ramas probabilísticas y pesos explícitos, sin tratar un robo hipotético como observado ni una búsqueda incompleta como derrota |
| 3 | Ampliar mecánicas generales | Prioridad, SEGOC, Damage Step, Flip, ataques múltiples y Pendulum con modelos y aceptación propios |
| 4 | Completar documentos y formatos | Reglamento/rulings, disponibilidad, pools históricos/digitales, Skills, desbloqueos, Legend e impresión/evento con fuentes y contextos independientes |
| 5 | Validar métricas competitivas | Barajas y resultados externos reales separados entre ajuste y validación; el importador ya existe y la puntuación permanece provisional |
| 6 | Ampliar aceptación de uso y mantenimiento | Más dispositivos, sistemas y tareas de accesibilidad, evidencia renovada de los bytes entregados y resultados de distribución y CI observados por separado |

No se asigna un porcentaje global a simular todas las cartas y reglas. El avance se mide por alcance registrado y criterios cerrados de cada entrega: el catálogo, los handlers y los grupos de pruebas miden cosas distintas. El estado actual está en [ESTADO_PROYECTO.md](ESTADO_PROYECTO.md).

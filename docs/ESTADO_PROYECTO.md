# Estado de la revisión 11

La aplicación se entrega como un único `Analizador_YuGiOh.html`. El original y las entregas anteriores se conservan; la puntuación permanece estructural y provisional por decisión del usuario.

La revisión 11 pasó **52/52 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `d51427f6537cba496a1e7998ab456cd913c118d733968542bc85922d41989d82`; SHA-256 `84dff70652ed8b7eceab7d6fdbbb4864396c745ecd5440beff482e96da7396ed`; tamaño **6,961,491 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 11 se comprueban por separado y se registran con el commit correspondiente.

| Área | Implementación de esta revisión | Alcance |
| --- | --- | --- |
| Seguimiento del objetivo | Requisitos y cantidades cumplidos o pendientes; LP, fase, turno y jugador activo | Describe el estado propio actual; no estima una probabilidad de victoria |
| Actualización del seguimiento | Se recalcula al iniciar, ejecutar, deshacer, aplicar un objetivo e importar un informe | Un contexto caducado no conserva la indicación anterior; el progreso importado no se usa como prueba |
| Estado inicial | Aviso cuando el objetivo ya está cumplido en la preparación declarada | No acredita la historia anterior ni crea una línea sin acciones |
| Campo y cantidades | Monstruos boca arriba, Mágicas/Trampas boca arriba, colocadas y mano con identidad canónica y copias distintas | La mano, GY y campo rival no satisfacen un requisito de campo propio |
| Interfaz del tablero | Distingue Mágicas/Trampas boca arriba, colocadas y zona de Campo | El seguimiento no registra automáticamente efectos nuevos |
| Laboratorio y ejemplos | Conserva once ejemplos; el de Campo exige Sanctuary boca arriba, Wolf en campo y Roar en mano | El campo inicial sigue declarado y las jugadas se ejecutan manualmente |
| Catálogo y lista | Conserva 21.986 registros y snapshot TCG del 19/10/2026 | Los datos técnicos no equivalen a todos los efectos ni a disponibilidad oficial |
| Rutas y respuestas | Seis familias parciales, protección de Spark, negación GY de Spirit y respuestas registradas | Mechaba conserva quince paquetes de monstruos, tres Mágicas Normales y dos activaciones de Campo |
| Mágicas de Campo | Mausoleum y Sanctuary desde mano, reemplazo físico y zona separada | No incluye todos sus efectos, otras cartas de Campo ni activaciones generales de Trampas |
| Calibración | Importador preparado y puntuación provisional | Necesita barajas y resultados externos reales con procedencia |
| Fuentes y mantenimiento | Restricciones TCG fechadas, tres FAQ OCG de monstruos, compilación reproducible y CI por etapas | La evidencia de aplicación y el cotejo documental acreditan alcances distintos |

## Aceptación y antecedentes

`dist/validation-summary.json`, los informes de navegador y `evidence/` identifican el build y el SHA-256 del HTML probado. La distribución y el resultado remoto de CI tienen sus propias comprobaciones.

La revisión 10 conserva una [aceptación local de 50/50 grupos](https://github.com/socramgns/MODERN/blob/bfa5d3cd6fd307e529ab68d9b15469b558e8a9d1/evidence/validation-summary.json). La ejecución inicial aprobó 49 grupos; la auditoría del catálogo pasó 13 comprobaciones después de restaurar y cotejar la caché técnica omitida al crear el espacio nuevo, sin cambiar el HTML ni el código. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40736683938) terminó **correctamente**, incluidas las pruebas del entregable y la comprobación entre motores. Esta evidencia corresponde al commit `bfa5d3cd6fd307e529ab68d9b15469b558e8a9d1` y no sustituye la comprobación de los bytes nuevos.

Chromium mantiene una restricción administrativa de navegación local en este entorno. Firefox permite comprobar la apertura directa offline; WebKit conserva una limitación de emulación offline local. Los informes distinguen esas limitaciones de las comprobaciones de compatibilidad ejecutadas sobre los bytes entregados.

## Pendientes posteriores

- Más efectos, Mágicas de Campo y perfiles de salida revisados; activaciones generales de Trampas de Velocidad 2.
- Prioridad, cadenas generales, SEGOC, Damage Step, Flip, ataques múltiples y Pendulum. Mechaba de Velocidad 2 no puede responder a Roar de Velocidad 3.
- Continuación probabilística después de barajar, conservando la incertidumbre del orden.
- Decisiones rivales óptimas, metajuego y datos competitivos externos para calibrar y validar por separado.
- Disponibilidad, pools y reglas históricos/digitales, Skills, desbloqueos, Legend e impresión/evento.
- Reglamento y rulings restantes, revisión de identidades heredadas y aceptación en más dispositivos y sistemas reales.

El análisis actual está en [ANALISIS_PENDIENTES_REVISION11.md](ANALISIS_PENDIENTES_REVISION11.md). Los análisis anteriores permanecen como antecedentes con resultados ligados a sus propias revisiones. No se atribuye un porcentaje global a completar todas las cartas y reglas.

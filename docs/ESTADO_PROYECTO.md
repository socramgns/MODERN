# Estado de la revisión 10

La aplicación se entrega como un único `Analizador_YuGiOh.html`. El original y las entregas anteriores se conservan; la puntuación permanece estructural y provisional por decisión del usuario.

La revisión 10 pasó **50/50 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `5ee44d69c129cc4db4d922c9f064723760b1b1f3596dfb9a0f21ef694ff7fb7a`; SHA-256 `c2cafe3fdba2bc8d5cefaa5f7a4fe5858204fc5a61b50b2723bc04a04dcad807`; tamaño **6,953,153 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado. La ejecución inicial aprobó 49 grupos; la auditoría del catálogo aprobó sus 13 comprobaciones al restaurar y cotejar la caché técnica omitida en el espacio nuevo, sin cambiar el HTML ni el código. La evidencia conserva ambos resultados.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 10 se comprueban por separado y se registran con el commit correspondiente.

| Área | Implementación de esta revisión | Alcance |
| --- | --- | --- |
| Objetivos de campo | Monstruos boca arriba, Mágicas/Trampas boca arriba y Mágicas/Trampas colocadas en listas separadas | Solo cartas propias; las Mágicas de Campo se incluyen en Mágicas/Trampas |
| Cantidades y transporte | Conteo de copias por identidad canónica; validación compartida en paneles, escenarios e informes | Una carta de mano o GY no satisface un objetivo de campo; los objetivos anteriores conservan su significado |
| Interfaz de objetivos | Selector de zona, carta y cantidad con inventario Main/Extra y tipos apropiados | No ofrece Skills ni Tokens como Mágicas/Trampas; definir un objetivo no registra efectos nuevos |
| Laboratorio | Conserva once ejemplos y amplía el objetivo de Campo para exigir Sanctuary boca arriba | El campo inicial sigue declarado y los pasos se ejecutan manualmente |
| Catálogo y lista | Conserva 21.986 registros y snapshot TCG del 19/10/2026 | Los datos técnicos no equivalen a todos los efectos ni a disponibilidad oficial |
| Rutas y respuestas | Seis familias parciales, protección de Spark, negación GY de Spirit y respuestas registradas | Mechaba conserva quince paquetes de monstruos, tres Mágicas Normales y dos activaciones de Campo |
| Mágicas de Campo | Mausoleum y Sanctuary desde mano, reemplazo físico anterior a respuestas y zona separada | No incluye todos sus efectos, todas las cartas de Campo ni activaciones generales de Trampas |
| Calibración | Importador preparado y puntuación provisional | Necesita barajas y resultados externos reales con procedencia |
| Fuentes y mantenimiento | Captura TCG de restricciones, tres FAQ OCG de casos de monstruos, compilación reproducible y CI por etapas | Las pruebas de aplicación y el cotejo documental acreditan alcances distintos |

## Aceptación y antecedentes

`dist/validation-summary.json`, los informes de navegador y `evidence/` identifican el build y el SHA-256 del HTML probado. La distribución y el resultado remoto de CI tienen sus propias comprobaciones.

La revisión 9 conserva una [aceptación local de 48/48 grupos](https://github.com/socramgns/MODERN/blob/213d323f05fbb57cffce8b19a36afa6f132a989a/evidence/validation-summary.json). Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40614521563) terminó **correctamente** para el commit `213d323f05fbb57cffce8b19a36afa6f132a989a`. Esa evidencia corresponde a revisión 9 y no sustituye la comprobación de los bytes nuevos.

Chromium mantiene una restricción administrativa de navegación local en este entorno. Firefox permite comprobar la apertura directa offline; WebKit conserva una limitación de emulación offline local. Los informes distinguen esas limitaciones de las comprobaciones de compatibilidad ejecutadas sobre los bytes entregados.

## Pendientes posteriores

- Más efectos, Mágicas de Campo y perfiles de salida revisados; activaciones generales de Trampas de Velocidad 2.
- Prioridad, cadenas generales, SEGOC, Damage Step, Flip, ataques múltiples y Pendulum. Mechaba de Velocidad 2 no puede responder a Roar de Velocidad 3.
- Continuación probabilística después de barajar, conservando la incertidumbre del orden.
- Decisiones rivales óptimas, metajuego y datos competitivos externos para calibrar y validar por separado.
- Disponibilidad, pools y reglas históricos/digitales, Skills, desbloqueos, Legend e impresión/evento.
- Reglamento y rulings restantes, revisión de identidades heredadas y aceptación en más dispositivos y sistemas reales.

El análisis actual está en [ANALISIS_PENDIENTES_REVISION10.md](ANALISIS_PENDIENTES_REVISION10.md). Los análisis anteriores permanecen como antecedentes con resultados ligados a sus propias revisiones. No se atribuye un porcentaje global a completar todas las cartas y reglas.

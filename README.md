# Analizador de barajas Yu-Gi-Oh · revisión 10

La entrega sigue siendo **un único `Analizador_YuGiOh.html`**, con el catálogo y los motores incorporados.

[Descargar el HTML de esta rama: revisión 10](https://github.com/socramgns/MODERN/raw/refs/heads/entrega/analizador-yugioh-estable10/Analizador_YuGiOh.html?download=1)

La revisión 10 pasó **50/50 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `5ee44d69c129cc4db4d922c9f064723760b1b1f3596dfb9a0f21ef694ff7fb7a`; SHA-256 `c2cafe3fdba2bc8d5cefaa5f7a4fe5858204fc5a61b50b2723bc04a04dcad807`; tamaño **6,953,153 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado. La ejecución inicial aprobó 49 grupos; la auditoría del catálogo aprobó sus 13 comprobaciones al restaurar y cotejar la caché técnica omitida en el espacio nuevo, sin cambiar el HTML ni el código. La evidencia conserva ambos resultados.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 10 se comprueban por separado y se registran con el commit correspondiente.

La revisión 9 conserva una [aceptación local de 48/48 grupos](https://github.com/socramgns/MODERN/blob/213d323f05fbb57cffce8b19a36afa6f132a989a/evidence/validation-summary.json). Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40614521563) terminó **correctamente** para el commit `213d323f05fbb57cffce8b19a36afa6f132a989a`. Esa evidencia corresponde a revisión 9 y no sustituye la comprobación de los bytes nuevos.

## Cómo usarlo

1. Guarda el archivo con extensión `.html` y ábrelo en un navegador reciente. Si el enlace muestra código, usa **Guardar como** y conserva el nombre `Analizador_YuGiOh.html`.
2. Importa una baraja JSON o YDK en **Baraja y zonas por formato**, revisa las incidencias y pulsa **CALCULAR**.
3. Abre **Probar un ejemplo incluido** y pulsa **Cargar ejemplo en el laboratorio**. El ejemplo sustituye la baraja actual y prepara un campo declarado; ejecuta cada paso manualmente.
4. En el laboratorio, añade al objetivo monstruos boca arriba, Mágicas/Trampas boca arriba, Mágicas/Trampas colocadas o cartas en mano. Indica la cantidad y pulsa **Aplicar objetivo visual**. Las Mágicas de Campo se incluyen entre las Mágicas/Trampas; el objetivo comprueba dónde están las copias físicas.
5. Consulta **Acciones registradas de esta baraja** para conocer los efectos parciales reconocidos. Exporta JSON para conservar la baraja y su contexto; YDK transporta Main, Extra y Side, pero no Skills.

El catálogo y los cálculos incorporados funcionan sin Internet. Las imágenes y actualizaciones remotas requieren conexión. La sesión se guarda en ese navegador/origen; exporta una copia para trasladarla o conservarla fuera de ese almacenamiento.

## Qué incluye esta revisión

- Añade objetivos propios separados de **Mágicas/Trampas boca arriba** y **Mágicas/Trampas colocadas**, incluidas las Mágicas de Campo. Los objetivos anteriores de monstruos boca arriba y mano conservan su significado.
- Comparte la validación del objetivo entre los paneles y mantiene sus cantidades y zonas al transportar escenarios e informes. Los selectores ofrecen cartas del inventario de la baraja y excluyen Skills y Tokens de las nuevas listas de Mágicas/Trampas.
- Conserva los **once ejemplos guiados**. El ejemplo de Campo exige ahora Sanctuary boca arriba, Wolf en campo y Roar en mano, de modo que conservar el Field Spell forma parte explícita del resultado.
- Conserva los **21.986 registros** y las rutas registradas de Invoked, Swordsoul, Branded, Blue-Eyes, Tenyi y Salamangreat, la protección de Stardust Spark y la negación de activaciones en GY de Spirit Dragon.
- Conserva las activaciones registradas desde mano de Mausoleum of White y Sanctuary, el reemplazo por regla del Field Spell previo, los costes y las respuestas acotadas de Mechaba y Roar.

La puntuación competitiva es **estructural y provisional**. El importador de calibración está preparado y requiere barajas y resultados externos reales. Los objetivos nuevos no implementan por sí solos más efectos de cartas. Las rutas, cadenas, prioridades y formatos mantienen los límites descritos en la documentación; el catálogo técnico no certifica disponibilidad ni todos los rulings.

## Evidencia y desarrollo

`dist/validation-summary.json` identifica el resultado local de esta revisión con su build y SHA-256. En la rama de entrega, `evidence/validation-summary.json` conserva los identificadores del HTML aceptado. Las evidencias anteriores permanecen ligadas a sus propios commits.

- [Estado y pendientes](docs/ESTADO_PROYECTO.md)
- [Análisis de lo que falta](docs/ANALISIS_PENDIENTES_REVISION10.md)
- [Alcance de reglas y búsquedas](docs/ALCANCE_COMBOS.md)
- [Fuentes oficiales](docs/FUENTES_OFICIALES.md)
- [Compilación, datos y pruebas](docs/DESARROLLO.md)

El repositorio conserva fuente, pruebas y workflow. El resultado remoto de CI se observa para cada revisión; conservar la configuración no demuestra que su ejecución nueva haya aprobado.

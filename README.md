# Analizador de barajas Yu-Gi-Oh · revisión 11

La entrega sigue siendo **un único `Analizador_YuGiOh.html`**, con el catálogo y los motores incorporados.

[Descargar el HTML de esta rama: revisión 11](https://github.com/socramgns/MODERN/raw/refs/heads/entrega/analizador-yugioh-estable11/Analizador_YuGiOh.html?download=1)

La revisión 11 pasó **52/52 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `d51427f6537cba496a1e7998ab456cd913c118d733968542bc85922d41989d82`; SHA-256 `84dff70652ed8b7eceab7d6fdbbb4864396c745ecd5440beff482e96da7396ed`; tamaño **6,961,491 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 11 se comprueban por separado y se registran con el commit correspondiente.

La revisión 10 conserva una [aceptación local de 50/50 grupos](https://github.com/socramgns/MODERN/blob/bfa5d3cd6fd307e529ab68d9b15469b558e8a9d1/evidence/validation-summary.json). La ejecución inicial aprobó 49 grupos; la auditoría del catálogo pasó 13 comprobaciones después de restaurar y cotejar la caché técnica omitida al crear el espacio nuevo, sin cambiar el HTML ni el código. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40736683938) terminó **correctamente**, incluidas las pruebas del entregable y la comprobación entre motores. Esta evidencia corresponde al commit `bfa5d3cd6fd307e529ab68d9b15469b558e8a9d1` y no sustituye la comprobación de los bytes nuevos.

## Cómo usarlo

1. Guarda el archivo con extensión `.html` y ábrelo en un navegador reciente. Si el enlace muestra código, usa **Guardar como** y conserva el nombre `Analizador_YuGiOh.html`.
2. Importa una baraja JSON o YDK en **Baraja y zonas por formato**, revisa las incidencias y pulsa **CALCULAR**.
3. Abre **Probar un ejemplo incluido** y pulsa **Cargar ejemplo en el laboratorio**. El ejemplo sustituye la baraja actual y prepara un campo declarado; ejecuta cada paso manualmente.
4. En el laboratorio, añade al objetivo monstruos boca arriba, Mágicas/Trampas boca arriba, Mágicas/Trampas colocadas o cartas en mano. Indica la cantidad y pulsa **Aplicar objetivo visual**. Las Mágicas de Campo se incluyen entre las Mágicas/Trampas. Consulta el seguimiento del objetivo para ver qué copias y condiciones faltan después de cada paso o al deshacer.
5. Consulta **Acciones registradas de esta baraja** para conocer los efectos parciales reconocidos. Exporta JSON para conservar la baraja y su contexto; YDK transporta Main, Extra y Side, pero no Skills.

El catálogo y los cálculos incorporados funcionan sin Internet. Las imágenes y actualizaciones remotas requieren conexión. La sesión se guarda en ese navegador/origen; exporta una copia para trasladarla o conservarla fuera de ese almacenamiento.

## Qué incluye esta revisión

- Muestra los requisitos cumplidos y pendientes del objetivo: copias físicas por zona, LP, fase, turno y jugador activo. El seguimiento se actualiza al ejecutar, deshacer, aplicar un objetivo o reanudar un informe.
- Distingue las Mágicas/Trampas boca arriba de las colocadas y señala las Mágicas de Campo en el tablero.
- Avisa si el objetivo ya se cumple en el estado inicial declarado. Ese aviso no añade una jugada ni acredita cómo se obtuvo el campo anterior.
- Recalcula el seguimiento a partir del estado y el objetivo validados al importar un informe; el resumen importado no se acepta como prueba.
- Conserva los once ejemplos, los **21.986 registros** y las seis familias parciales, incluidos Spark, Spirit, Mechaba, Roar y las dos activaciones de Mágicas de Campo registradas.

La puntuación competitiva es **estructural y provisional**. El importador de calibración está preparado y requiere barajas y resultados externos reales. El seguimiento de objetivos no implementa por sí solo más efectos de cartas. Las rutas, cadenas, prioridades y formatos mantienen los límites descritos en la documentación; el catálogo técnico no certifica disponibilidad ni todos los rulings.

## Evidencia y desarrollo

`dist/validation-summary.json` identifica el resultado local de esta revisión con su build y SHA-256. En la rama de entrega, `evidence/validation-summary.json` conserva los identificadores del HTML aceptado. Las evidencias anteriores permanecen ligadas a sus propios commits.

- [Estado y pendientes](docs/ESTADO_PROYECTO.md)
- [Análisis de lo que falta](docs/ANALISIS_PENDIENTES_REVISION11.md)
- [Alcance de reglas y búsquedas](docs/ALCANCE_COMBOS.md)
- [Fuentes oficiales](docs/FUENTES_OFICIALES.md)
- [Compilación, datos y pruebas](docs/DESARROLLO.md)

El repositorio conserva fuente, pruebas y workflow. El resultado remoto de CI se observa para cada revisión; conservar la configuración no demuestra que su ejecución nueva haya aprobado.

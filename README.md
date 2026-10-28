# Analizador de barajas Yu-Gi-Oh · revisión 9

La entrega sigue siendo **un único `Analizador_YuGiOh.html`**, con el catálogo y los motores incorporados.

[Descargar el HTML de esta rama: revisión 9](https://github.com/socramgns/MODERN/raw/refs/heads/entrega/analizador-yugioh-estable9/Analizador_YuGiOh.html?download=1)

La revisión 9 pasó **48/48 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `b2e655dc990e6951cf886945774c028ac97a3e55c4f84010a1edb9942f1b0ba7`; SHA-256 `0976989809a5c2c96404149679d4806a89d13a6e3efa61c500e94da3a9793a2b`; tamaño **6.951.935 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la comprobación de descarga HTTP y la ejecución remota de GitHub Actions de revisión 9 se registran por separado; esta aceptación local no acredita por sí sola esos pasos.

La revisión 8 conserva una [aceptación local de 46/46 grupos](https://github.com/socramgns/MODERN/blob/b1a478d95020a7a718b2de0ef01b7793013058fd/evidence/validation-summary.json), con 114 archivos JavaScript comprobados, Chromium, Firefox y WebKit y apertura directa sin conexión en Firefox. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40599777991) terminó **correctamente** para el commit `b1a478d95020a7a718b2de0ef01b7793013058fd`: instalación, actualización idempotente, compilación/comparación del HTML, pruebas y comprobación entre motores aprobadas. Esta evidencia pertenece a revisión 8 y no sustituye la aceptación de revisión 9.

## Cómo usarlo

1. Guarda el archivo con extensión `.html` y ábrelo en un navegador reciente. Si el enlace muestra código, usa **Guardar como** y conserva el nombre `Analizador_YuGiOh.html`.
2. Importa una baraja JSON o YDK en **Baraja y zonas por formato**, revisa las incidencias y pulsa **CALCULAR**.
3. Abre **Probar un ejemplo incluido** y pulsa **Cargar ejemplo en el laboratorio**. El ejemplo sustituye la baraja actual y prepara un campo declarado; ejecuta cada paso manualmente.
4. Consulta **Acciones registradas de esta baraja** para distinguir datos del catálogo y efectos parciales reconocidos.
5. Exporta JSON para conservar la baraja y su contexto. YDK transporta Main, Extra y Side, pero no Skills.

El catálogo y los cálculos incorporados funcionan sin Internet. Las imágenes y actualizaciones remotas requieren conexión. La sesión se guarda en ese navegador/origen; exporta una copia para trasladarla o conservarla fuera de ese almacenamiento.

## Qué incluye esta revisión

- Conserva los **21.986 registros** y las rutas registradas de Invoked, Swordsoul, Branded, Blue-Eyes, Tenyi y Salamangreat.
- Registra la activación desde mano de **Mausoleum of White y Salamangreat Sanctuary**, además de los quince paquetes de monstruos y tres Mágicas Normales anteriores.
- Envía el Field Spell previo admitido al GY por regla antes de respuestas, sin destrucción ni coste de efecto. El envío se conserva aunque se niegue la carta nueva.
- Permite que Mechaba pague una Mágica real para negar y desterrar la nueva carta; conserva las respuestas y contrarrespuestas de Roar dentro del contrato registrado.
- Separa la zona de Campo de las cinco zonas de Mágicas/Trampas y de sus columnas. El reemplazo no reinicia el Normal adicional de Mausoleum ni la reincarnación ya gastados en el turno.
- Incluye **once ejemplos guiados**: los diez anteriores y uno de activación/reemplazo de Campo con respuestas. Los flujos registrados de interfaz y replay se comprobaron sobre los bytes finales de revisión 9.

Crow y Droll conservan sus costes y su restricción `NONE`, sin contador de una vez por turno inventado. Una activación nueva de Droll exige ventana admitida y copia disponible; el snapshot TCG sigue limitándola a una. Mechaba no responde a la Counter Trap Roar de Velocidad 3. Las activaciones generales de Trampas de Velocidad 2 y los efectos no registrados siguen pendientes.

La puntuación competitiva es **estructural y provisional**. El importador de calibración está preparado y requiere barajas y resultados externos reales. El catálogo técnico y las FAQ OCG guardadas no certifican disponibilidad ni todos los rulings; los casos de monstruos documentados no certifican por sí solos el nuevo tratamiento de Mágicas de Campo.

## Evidencia y desarrollo

`dist/validation-summary.json` identifica la aceptación local de revisión 9 y su build y SHA-256. En la rama de entrega, `evidence/validation-summary.json` conserva los mismos identificadores. Los resultados de revisión 8 se consultan en su commit y mantienen su alcance histórico.

- [Estado y pendientes](docs/ESTADO_PROYECTO.md)
- [Análisis de lo que falta](docs/ANALISIS_PENDIENTES_REVISION9.md)
- [Alcance de reglas y búsquedas](docs/ALCANCE_COMBOS.md)
- [Fuentes oficiales](docs/FUENTES_OFICIALES.md)
- [Compilación, datos y pruebas](docs/DESARROLLO.md)

El repositorio conserva fuente, pruebas y workflow. Su resultado remoto se consulta por separado: escribir o conservar una configuración de CI no demuestra que la ejecución nueva haya aprobado.

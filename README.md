# Analizador de barajas Yu-Gi-Oh · revisión 8

La entrega sigue siendo **un único `Analizador_YuGiOh.html`**, con el catálogo y los motores incorporados.

[Descargar el HTML de esta rama: revisión 8](https://github.com/socramgns/MODERN/raw/refs/heads/entrega/analizador-yugioh-estable8/Analizador_YuGiOh.html?download=1)

La revisión 8 pasó **46/46 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `d7c220eb32a7876a39fb6caaeee7bbde7ee96bde1fe5353672ed44e2369f9d6b`; SHA-256 `aa5e34480df69200c7355daf8fdbc589b584cd276d890ab22977867a9ea3aeca`; tamaño **6.940.108 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la comprobación de descarga HTTP y la ejecución remota de GitHub Actions se registran por separado; la aceptación local no acredita por sí sola esos pasos.

`dist/validation-summary.json` identifica esta aceptación local de revisión 8. En la rama de entrega, `evidence/validation-summary.json` debe conservar los mismos identificadores. La [evidencia histórica de revisión 7](https://github.com/socramgns/MODERN/blob/719897b2f9880507b15068c4a5ca9e1a3a02d038/evidence/validation-summary.json) se consulta en su commit, sin atribuir los informes antiguos a los bytes nuevos.

La revisión 7 tiene una [aceptación local documentada de 44/44 grupos](https://github.com/socramgns/MODERN/blob/719897b2f9880507b15068c4a5ca9e1a3a02d038/evidence/validation-summary.json), con 114 archivos JavaScript comprobados, Chromium, Firefox y WebKit y apertura directa offline en Firefox. La ejecución inicial aprobó 43 grupos; el flujo de contexto pasó sus 18 comprobaciones al repetirse después de ajustar un selector de la prueba al panel anidado, sin cambiar la aplicación ni el HTML. La evidencia conserva ambos intentos.

La [ejecución remota de revisión 7](https://github.com/socramgns/MODERN/actions/runs/40558997215/job/122382622102) terminó **cancelada** al superar 30 minutos durante «Instalar herramientas de comprobación», antes de ejecutar las pruebas del analizador. No es un CI aprobado ni demuestra un fallo de reglas de la aplicación. La revisión 8 separa las etapas de instalación y añade caché; su resultado remoto debe consultarse por separado.

## Cómo usarlo

1. Guarda el archivo con extensión `.html` y ábrelo en un navegador reciente. Si el enlace muestra código, usa **Guardar como** y conserva el nombre `Analizador_YuGiOh.html`.
2. Importa una baraja JSON o YDK en **Baraja y zonas por formato**. Revisa sus incidencias y pulsa **CALCULAR**.
3. Para aprender el laboratorio, abre **Probar un ejemplo incluido** y pulsa **Cargar ejemplo en el laboratorio**. Cargar un ejemplo sustituye la baraja actual.
4. Revisa **Acciones registradas de esta baraja** para conocer qué efectos reconoce el motor.
5. Exporta JSON para conservar todos los datos y el contexto. YDK conserva Main, Extra y Side; no transporta Skills.

El catálogo y los cálculos incorporados funcionan sin Internet. Las imágenes y actualizaciones remotas requieren conexión. La sesión se guarda en ese navegador/origen; no sincroniza dispositivos. Conviene exportar una copia de la baraja.

## Qué incluye esta revisión

- Conserva el catálogo de **21.986 registros**, importación, edición, biblioteca, estadísticas, probabilidades y exportaciones.
- Mantiene rutas registradas de Invoked, Swordsoul, Branded, Blue-Eyes, Tenyi y Salamangreat, con copias físicas, costes, límites y reproducción de los pasos.
- Amplía Mechaba a **quince paquetes explícitos** de efectos de monstruos en mano/GY: los trece anteriores y Crow/Droll desde mano. Sus costes permanecen pagados aunque se niegue la activación; la fuente enviada al Cementerio no se destierra otra vez desde una zona distinta.
- Declara Crow y Droll sin límite de uso por turno (`NONE`); conserva sus ventanas y los límites propios de Mechaba. Crow fija su objetivo antes de resolver. Una nueva activación de Droll requiere una nueva ventana admitida y una copia disponible; las restricciones de construcción siguen vigentes, incluido el máximo de una Droll en el snapshot TCG actual.
- Incluye **diez ejemplos guiados**: los ocho anteriores y dos nuevos para Crow/Mechaba y Droll tras una búsqueda. Se cargan como escenarios físicos y cada paso se ejecuta manualmente.
- Conserva tres FAQ oficiales OCG en japonés como referencias del criterio de destierro de Mechaba, con bytes y citas fijados. No certifican todos los rulings TCG.

La puntuación competitiva es **estructural y provisional**. El importador de calibración está preparado; requiere resultados externos reales para evaluar su validez competitiva.

El catálogo técnico no certifica disponibilidad oficial ni todos los efectos de sus cartas. Las rutas y respuestas tienen un alcance registrado; los efectos desconocidos no se inventan. Field Spells, activaciones de Trampas de Velocidad 2 y la prioridad general siguen pendientes en esta ampliación. Mechaba no puede responder a la Counter Trap Roar de Velocidad 3.

## Evidencia y desarrollo

El estado exacto de las comprobaciones se guarda en `dist/validation-summary.json` después de ejecutar las pruebas. Los informes identifican la compilación y el SHA-256 del HTML probado. Los resultados de revisiones anteriores se consultan por commit y no se atribuyen a la fuente nueva.

- [Estado y pendientes](docs/ESTADO_PROYECTO.md)
- [Análisis de lo que falta](docs/ANALISIS_PENDIENTES_REVISION8.md)
- [Alcance de las reglas y las búsquedas](docs/ALCANCE_COMBOS.md)
- [Fuentes oficiales](docs/FUENTES_OFICIALES.md)
- [Compilación, datos y pruebas](docs/DESARROLLO.md)

La fuente y las pruebas se mantienen en el repositorio. El workflow recompila y compara el HTML, y ejecuta las pruebas cuando completa su preparación. Su configuración no equivale a un resultado remoto aprobado.

# Analizador de barajas Yu-Gi-Oh · revisión 17

La entrega sigue siendo **un único `Analizador_YuGiOh.html` sin comprimir**, con catálogo y motores incorporados. La revisión `2026.11-stable.17` conecta una Synchro registrada de Azure-Eyes Silver Dragon con su protección, salida al Cementerio, resurrección mediante Monster Reborn y efecto de Standby. Cada ampliación cerrada se entrega como un HTML actualizado; el original y los respaldos anteriores se conservan.

[Descargar el HTML de esta rama: revisión 17](https://github.com/socramgns/MODERN/raw/refs/heads/entrega/analizador-yugioh-estable17/Analizador_YuGiOh.html?download=1)

La aceptación de la revisión 17 se apoya en la ejecución remota del commit `b77b4ddd61885f8ed6e49df231ed305ad70d5b11`: el [workflow de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/42084234037) completó con éxito las etapas obligatorias de instalación de los tres motores, compilación y comparación del HTML, batería de **67 grupos** y comprobación entre motores. El recuento corresponde al runner versionado y sus salidas obligatorias; los informes remotos individuales no se descargaron. Las fuentes incluyen **121 archivos JavaScript**. La ejecución local completa conserva su resultado **65/67 grupos aprobados**, con Firefox y WebKit no disponibles; su informe original permanece con `pass: false`, sin conciliación ni conversión a éxito. Build `44adab61fe289978ed72e0ab2a116f521387641584ecb77a4a9e097ecc194ae1`; SHA-256 `41c301b7ec88125cf6403756a69406873fbfebce9fc96d90ef4739af20633312`; tamaño **7,107,206 bytes**. La puntuación competitiva sigue provisional; no se acreditan todas las reglas, dispositivos físicos ni conformidad WCAG completa.

La aceptación local, publicación, descarga HTTP y GitHub Actions se comprueban por separado para su build y commit. Un número previsto de grupos o la configuración de CI no demuestra su aprobación.

## Cómo usarlo

1. Guarda el archivo con extensión `.html` y ábrelo en un navegador reciente. Si el enlace muestra código, usa **Guardar como** y conserva `Analizador_YuGiOh.html`.
2. Importa una baraja JSON o YDK en **Baraja y zonas por formato**, revisa sus incidencias y pulsa **CALCULAR**.
3. En **Probar un ejemplo incluido**, elige `azure` y pulsa **Cargar ejemplo en el laboratorio**. Sustituye la baraja actual y prepara Blue-Eyes en campo como supuesto inicial; su presencia no acredita una historia de invocación de Azure.
4. Invoca de modo Normal a Flamvell Guard desde la mano y úsalo junto al Blue-Eyes de nivel 8 para la Synchro registrada de Azure. Resuelve después la protección obligatoria. La invocación ejecutada es la que acredita su historial apropiado.
5. La guía hace que Azure en ataque combata contra un Blue-Eyes más fuerte: la protección contra efectos no impide su destrucción por batalla ni los 500 de daño. En Main Phase 2, revive la misma copia con Monster Reborn y resuelve su nuevo disparo de protección. Esa llegada es una Invocación Especial desde GY, no otra Synchro.
6. Continúa con cambios de fase y robos físicos conocidos hasta tu Standby Phase del turno 4. Usa el efecto de Azure para revivir el Blue-Eyes enviado al GY como material. El objetivo exige ambas cartas en tu campo y ese contexto de turno/fase; los monstruos invocados después no heredan automáticamente una protección anterior.
7. Revisa objetivos, ejecuta o deshaz pasos y exporta o reanuda el informe. Las decisiones y estados importados vuelven a verificarse desde el origen.
8. Consulta **Acciones registradas de esta baraja**, **Calidad de los datos**, las copias revisadas de identidades y las continuaciones hipotéticas después de barajar. Estas herramientas conservan sus límites y no convierten una hipótesis de robo en un robo observado ni en tasa de victoria.

Se conservan los dieciséis ejemplos anteriores, incluidos `spark`, `synchro`, `reborn` y `shuffle`. Catálogo y cálculos están incorporados; imágenes y actualizaciones remotas necesitan conexión. JSON conserva contexto y Skills; YDK transporta Main, Extra y Side, pero no Skills. La sesión pertenece al navegador y origen donde se abrió el archivo.

## Qué incluye esta revisión

- `SYNCHRO_AZURE_EYES_SILVER_DRAGON` (40908371): un Tuner y uno o más no Tuner **Normales** admitidos, boca arriba, físicos y distintos, con niveles que suman 9. Comprueba materiales, restricciones y espacio después de retirarlos.
- Una ruta explícita de duelo TCG para esta Synchro y para Azure como objetivo de Monster Reborn. La protección obligatoria necesita sus fases y pendientes; el análisis causal sin ese contexto no obtiene una continuación incompleta.
- Un disparo obligatorio de protección después de cada Invocación Especial registrada de Azure por Spirit Dragon, Synchro o Reborn. Un campo inicial declarado no crea el disparo y la protección no recibe un límite por turno ficticio.
- Protección sobre los Dragones controlados al resolver, hasta el final del siguiente turno. Los Dragones llegados después no heredan ese efecto; salir y volver no restaura la protección de una presencia anterior. La protección resuelta puede persistir en los objetivos aunque salga Azure.
- Resurrección de un Normal admitido en tu propia Standby Phase, con sus usos, respuestas y consecuencias registradas. Conserva Spark, Spirit, Mechaba/Roar, Impermanence, Compulsory, edición, cálculo, importación, exportación, búsqueda acotada y replay.

La puntuación competitiva permanece **estructural y provisional**, por decisión del usuario. El importador de resultados reales está preparado; esta entrega no inventa datos de torneo ni acredita todas las cartas o reglas.

## Evidencia y desarrollo

Los informes distinguen pruebas Node sobre fuentes, tareas sobre el HTML compilado y evidencia remota del workflow. Las ausencias de motores locales conservan sus resultados originales; no se transforman en aprobaciones. Las comprobaciones móviles emuladas no acreditan teléfonos físicos ni conformidad WCAG completa. Al cerrar cada ampliación, la entrega y sus respaldos quedan ligados a los bytes aceptados.

La revisión 16 conserva su [aceptación remota de 65 grupos](https://github.com/socramgns/MODERN/blob/309a8bdb983807d622c1ad5df8106a09688babf3/evidence/remote-acceptance.json) sobre el candidato `329f1ba15e960a949ceecc971005eee0fb622e03`, con 120 archivos JavaScript, 58 casos de Spark y 38 tareas de su interfaz. Su [workflow de aceptación](https://github.com/socramgns/MODERN/actions/runs/41889817768) y el [CI del commit final](https://github.com/socramgns/MODERN/actions/runs/41893149441) terminaron correctamente. El commit final `309a8bdb983807d622c1ad5df8106a09688babf3` conserva el [HTML descargado y verificado](https://github.com/socramgns/MODERN/raw/309a8bdb983807d622c1ad5df8106a09688babf3/Analizador_YuGiOh.html?download=1), SHA-256 `fab64088c402372a2cf8d3c8c997bdf13612c11701640bb8172694fcf00aa0cc`. Su informe local permanece con `pass: false`, 63/65 grupos y Firefox/WebKit no disponibles por el bloqueo de descarga. Esa evidencia pertenece a revisión 16; no sustituye la aceptación de los bytes nuevos.

- [Estado del proyecto](docs/ESTADO_PROYECTO.md)
- [Análisis de pendientes](docs/ANALISIS_PENDIENTES_REVISION17.md)
- [Alcance de reglas y búsquedas](docs/ALCANCE_COMBOS.md)
- [Fuentes oficiales](docs/FUENTES_OFICIALES.md)
- [Compilación, datos y pruebas](docs/DESARROLLO.md)

El avance se mide por capacidades y criterios de aceptación; no se asigna un porcentaje global a todas las cartas y reglas del juego.

# Analizador de barajas Yu-Gi-Oh · revisión 18

La entrega sigue siendo **un único `Analizador_YuGiOh.html` sin comprimir**, con catálogo y motores incorporados. La revisión `2026.11-stable.18` conecta una Invocación Link real de Spirit with Eyes of Blue con su tributo, resurrección mediante Monster Reborn y restricción continua de Invocaciones Especiales. El original y las entregas anteriores se conservan.

[Descargar el HTML de esta rama: revisión 18](https://github.com/socramgns/MODERN/raw/refs/heads/entrega/analizador-yugioh-estable18/Analizador_YuGiOh.html?download=1)

VALIDACION_R18_PENDIENTE

El tributo de Spirit comprueba también las restricciones vigentes de Wyrm y de nombre antes de pagar, y en el HTML completo excluye campos continuos no revisados. Su llegada automática a la zona apuntada por un Wolf activo con recuperación disponible queda fuera del subconjunto hasta registrar ese disparo; no se omite silenciosamente. Una negación de Veiler/Imperm ya resuelta sigue negando el efecto activado en campo aunque Spirit salga como coste; una nueva respuesta que lo apunte después del tributo no se ofrece. Mechaba y Roar conservan sus costes y la negación de activación sin retirar de nuevo una fuente ya tributada.

## Cómo usarlo

1. Guarda el archivo con extensión `.html` y ábrelo en un navegador reciente. Si el enlace muestra código, usa **Guardar como** y conserva `Analizador_YuGiOh.html`.
2. Importa una baraja JSON o YDK en **Baraja y zonas por formato**, revisa sus incidencias y pulsa **CALCULAR**.
3. En **Probar un ejemplo incluido**, elige `spirit-reborn` y pulsa **Cargar ejemplo en el laboratorio**. Sustituye la baraja actual y prepara una mano física; no declara una historia anterior de Invocación de Spirit.
4. Invoca de modo Normal a Flamvell Guard. Úsalo para la Invocación Link registrada de Spirit with Eyes of Blue y resuelve su búsqueda de Mausoleum of White. Esa transición acredita el historial apropiado de la copia.
5. Tributa Spirit para invocar Blue-Eyes White Dragon desde la mano. Después revive el mismo Spirit con Monster Reborn en una zona principal libre y en Ataque. La llegada actual es Especial desde GY, conserva el historial Link y no repite la búsqueda exclusiva de la Invocación Link.
6. Observa que el tributo de Spirit sigue gastado ese turno. Mientras controles a Spirit boca arriba y con efectos activos, sólo se ofrecen las Invocaciones Especiales de Dragones admitidas; su salida o negación de efectos cambia esa restricción. Longyuan en la mano del ejemplo permite comparar la disponibilidad antes y después de esas llegadas.
7. Revisa objetivos, ejecuta o deshaz pasos y exporta o reanuda el informe. Las decisiones y estados importados vuelven a verificarse desde el origen.
8. Consulta **Acciones registradas de esta baraja**, **Calidad de los datos**, las copias revisadas de identidades y las continuaciones hipotéticas después de barajar. Una hipótesis de robo no se convierte en un robo observado ni en tasa de victoria.

Se conservan los diecisiete ejemplos anteriores, incluidos `azure`, `synchro`, `reborn` y `shuffle`. Catálogo y cálculos están incorporados; imágenes y actualizaciones remotas necesitan conexión. JSON conserva contexto y Skills; YDK transporta Main, Extra y Side. La sesión pertenece al navegador y origen donde se abrió el archivo.

## Qué incluye esta revisión

- Monster Reborn admite Spirit with Eyes of Blue (42097666) con historial Link apropiado obtenido por el procedimiento registrado. Una colocación inicial en GY o una bandera importada no sustituyen esa historia.
- Spirit revivido conserva UID, propietario e historial; entra bajo control del actor admitido en una zona principal, en Ataque y como Invocación Especial desde GY. No crea otra búsqueda de Mausoleum ni reinicia el uso por nombre y turno de su tributo.
- La restricción continua se comprueba antes del intento de Invocación Especial registrado, con el controlador actual, la presencia boca arriba y la negación de efectos. No basta quitar a Spirit como material para autorizar un intento prohibido. No se confunde esa restricción con una prohibición de Invocación Normal.
- El ejemplo `spirit-reborn` conserva los diecisiete anteriores, los objetivos, deshacer y replay. Conserva Azure, Spark, Spirit Dragon, Mechaba/Roar, Impermanence, Compulsory, edición, cálculo, importación, exportación y búsqueda acotada.

La puntuación competitiva permanece **estructural y provisional**, por decisión del usuario. El importador de resultados reales está preparado. Albaz y Sunlight Wolf conservan sus exclusiones pertinentes de Reborn; las seis familias siguen parciales y esta ampliación no acredita todas las cartas, reglas o cadenas.

## Evidencia y desarrollo

Los informes distinguen pruebas Node sobre fuentes, tareas sobre el HTML compilado y evidencia remota. Las ausencias de motores locales conservan sus resultados originales. La emulación móvil no acredita teléfonos físicos ni conformidad WCAG completa. Publicación, descarga HTTP y CI se verifican para el build y commit correspondientes.

La revisión 17 conserva su [aceptación remota de 67 grupos](https://github.com/socramgns/MODERN/actions/runs/42084234037) sobre el candidato `b77b4ddd61885f8ed6e49df231ed305ad70d5b11`. El commit final `d964eb57322dce3a78339f6ae6541ed18323792e` conserva el [HTML publicado y descargado](https://github.com/socramgns/MODERN/raw/d964eb57322dce3a78339f6ae6541ed18323792e/Analizador_YuGiOh.html?download=1), SHA-256 `41c301b7ec88125cf6403756a69406873fbfebce9fc96d90ef4739af20633312`. La ejecución local de esa revisión permanece con `pass: false`, 65/67 grupos y Firefox/WebKit no disponibles. El workflow del candidato validó el mismo código, pruebas, configuración y HTML; el resultado de un commit posterior de documentación se observa por separado. Esa evidencia pertenece a revisión 17 y no sustituye la aceptación de los bytes nuevos.

- [Estado del proyecto](docs/ESTADO_PROYECTO.md)
- [Análisis de pendientes](docs/ANALISIS_PENDIENTES_REVISION18.md)
- [Alcance de reglas y búsquedas](docs/ALCANCE_COMBOS.md)
- [Fuentes oficiales](docs/FUENTES_OFICIALES.md)
- [Compilación, datos y pruebas](docs/DESARROLLO.md)

El avance se mide por capacidades y criterios de aceptación; no se asigna un porcentaje global a todas las cartas y reglas del juego.

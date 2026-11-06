# Analizador de barajas Yu-Gi-Oh · revisión 19

La entrega sigue siendo **un único Analizador_YuGiOh.html sin comprimir**, con catálogo y motores incorporados. El original y las revisiones anteriores se conservan. Cada ampliación cerrada se entrega como otro HTML actualizado, como solicitó el usuario.

[Descargar el HTML de esta rama: revisión 19](https://github.com/socramgns/MODERN/raw/refs/heads/entrega/analizador-yugioh-estable19/Analizador_YuGiOh.html?download=1)

VALIDACION_R19_PENDIENTE

Cuando un disparo de Wolf coincide con otra clase de disparo opcional, el subconjunto exige declinar explícitamente hasta conservar una sola clase antes de resolver; no permite representar una cadena simultánea mediante resoluciones independientes sucesivas. La selección de recuperación enumera cartas admitidas ya presentes en GY al activar y las vuelve a validar al resolver; no amplía automáticamente las opciones con cartas que entren en GY por costes de respuestas.

La revisión 19 amplía Sunlight Wolf con historial Link ejecutado, salida al GY y Monster Reborn en una zona principal, únicamente en Ataque. La llegada actual es Especial desde GY y conserva UID, propietario y cualificación apropiada, pero no restaura la condición de una presencia actual invocada por Link usando Wolf.

## Cómo probar la ampliación

1. Guarda el archivo con extensión .html y ábrelo en un navegador reciente. Si el enlace muestra código, usa Guardar como y conserva Analizador_YuGiOh.html.
2. En Probar un ejemplo incluido, selecciona wolf-reborn y carga el escenario en el laboratorio. Sustituye la baraja actual y declara sus materiales iniciales.
3. Sigue la guía para invocar Wolf por Link, enviarlo al GY por batalla y revivir la misma copia mediante Monster Reborn en la segunda zona principal.
4. Invoca Aleister, declina su búsqueda opcional e invoca Artemis en EMZ. Resuelve después la recuperación FIRE de Wolf para añadir Ash a la mano.
5. Comprueba objetivos, costes, bloqueo de nombre, deshacer y replay; exporta o reimporta el informe para volver a verificarlo desde su origen.

Se conservan los dieciocho ejemplos anteriores, incluidos azure, spark, spirit-reborn y shuffle. También siguen disponibles edición, importación JSON/YDK, formatos, estadísticas, probabilidades, calidad de datos, revisión de identidades y exportación. Catálogo y cálculos están incorporados; las imágenes y actualizaciones remotas necesitan conexión.

## Alcance de Sunlight Wolf

El tablero declara una EMZ izquierda fija por controlador. Con índices principales 0–4 y EMZ 5, Wolf en EMZ apunta a Main 1 propio y Main 3 rival; Wolf en Main 1 apunta a EMZ propia, y en Main 3 a EMZ rival. Main 0, 2 y 4 no apuntan a una Zona de Monstruos. Estas coordenadas son del modelo registrado y no añaden una elección general de las dos EMZ ni Extra Link.

El disparo se deriva de llegadas reales Normales, por Tributo o Especiales a una zona apuntada. No nace de un campo inicial, un Set ni una invocación durante Damage Step. Las flechas permanecen aunque Wolf tenga sus efectos negados. Negación aplicada y prohibición de activar por Shaman conservan tratamientos distintos. Los presupuestos de uso pertenecen al nombre y al controlador, y no se reinician al revivir o cambiar de copia.

La recuperación FIRE es no dirigida y selecciona al resolver una carta técnica admitida del GY; no se limita a Salamangreat. Una carta del Extra puede volver al Extra, pero sólo la llegada efectiva a la mano instala el bloqueo de nombre. Ese bloqueo se comprueba antes de costes y materiales para Normal, Set y Especiales, dura el resto del turno y persiste aunque salga Wolf. La recuperación de Magia/Trampa requiere una presencia actual obtenida por Link con Wolf como material; la receta de dos materiales también puede satisfacerla. Las recuperaciones del GY no son búsquedas del Deck.

Las seis familias siguen parciales. Cadenas generales, prioridad, SEGOC, elecciones simultáneas de varios disparos y Damage Step completo requieren modelos propios; los paquetes sin continuación registrada se excluyen explícitamente. Se mantienen los perfiles de campo y movimientos del GY revisados. Albaz al ser invocado conserva su ampliación pendiente y su exclusión pertinente de Reborn. La emulación móvil no acredita dispositivos físicos ni conformidad WCAG completa.

La puntuación competitiva permanece estructural y provisional, por decisión del usuario. El importador de resultados reales está preparado; los fixtures técnicos no sustituyen resultados de torneos con formato, banlist, fecha y procedencia.

## Fuentes y evidencia

La referencia fijada de [ProjectIgnis/CardScripts](https://raw.githubusercontent.com/ProjectIgnis/CardScripts/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c87871125.lua) se conserva como datos en src/data/technical-references/wolf-c87871125.lua y wolf-reference.json: 3.224 bytes, SHA-256 da3a4b8edced408ae778dc6098fb8e2e37d83e86bc690e726514ee3674a1133f. Es una referencia técnica secundaria contrastada con el texto impreso del catálogo; no es una nueva autenticación de rulings oficiales y el analizador no ejecuta Lua.

La aceptación distingue pruebas Node sobre fuentes, tareas sobre el HTML compilado, ejecución remota, publicación y descarga HTTP. Los fallos locales originales se conservan; configurar un workflow o prever una cantidad de pruebas no acredita que hayan pasado. Fuentes, pruebas y HTML se ligan al commit y build correspondiente.

La revisión 18 conserva su aceptación remota de 69 grupos sobre el candidato 0807cd758ee30c3824330bcf59eb11f5d298df60 ([workflow](https://github.com/socramgns/MODERN/actions/runs/42152616194)). El commit final 89968d77be3cd4c7058c05b17e8fd9c103713269 conserva el [HTML publicado y descargado](https://github.com/socramgns/MODERN/raw/89968d77be3cd4c7058c05b17e8fd9c103713269/Analizador_YuGiOh.html?download=1), SHA-256 622328ee699c2a6407c5f20e724fe0f613bc6479858d4c2b4f222c86e8fdc9bb. Su informe local original mantiene pass: false, 67/69 grupos y Firefox/WebKit no disponibles. Esta evidencia pertenece a la revisión 18; la aceptación de los bytes nuevos se registra por separado.

Consulta [estado](docs/ESTADO_PROYECTO.md), [pendientes](docs/ANALISIS_PENDIENTES_REVISION19.md), [desarrollo](docs/DESARROLLO.md) y [alcance](docs/ALCANCE_COMBOS.md).

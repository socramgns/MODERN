# Qué falta para terminar el analizador · revisión 19

La revisión 19 amplía Sunlight Wolf con historial Link ejecutado, salida al GY y Monster Reborn en una zona principal, únicamente en Ataque. La llegada actual es Especial desde GY y conserva UID, propietario y cualificación apropiada, pero no restaura la condición de una presencia actual invocada por Link usando Wolf.

VALIDACION_R19_PENDIENTE

Cuando un disparo de Wolf coincide con otra clase de disparo opcional, el subconjunto exige declinar explícitamente hasta conservar una sola clase antes de resolver; no permite representar una cadena simultánea mediante resoluciones independientes sucesivas. La selección de recuperación enumera cartas admitidas ya presentes en GY al activar y las vuelve a validar al resolver; no amplía automáticamente las opciones con cartas que entren en GY por costes de respuestas.

## Criterios de cierre de esta ampliación

| Área | Criterio verificable |
| --- | --- |
| Identidad e historia | Wolf obtiene cualificación por Link real, no por flags de preparación; UID, propietario y origen actual se conservan |
| Reborn | Destinos Main libres, sólo Ataque, sin restaurar condición de Link con Wolf ni usos gastados |
| Geometría | Coordenadas coherentes con EMZ izquierda fija por controlador y eventos reales de ambos jugadores |
| Oportunidad | Normal/Tributo/Especial fuera de Damage Step; no setup, Set, Flip o duplicación de pendientes |
| Selección y destino | FIRE técnicamente admitido, selección no dirigida, retorno a mano o Extra y bloqueo sólo tras llegar a mano |
| Uso y prohibiciones | Presupuesto compartido por nombre/controlador, antes de costes y materiales; duración y negación diferenciadas |
| Segunda recuperación | Sólo presencia actual obtenida por Link usando Wolf, incluida receta real de dos materiales |
| Interfaz y entrega | wolf-reborn, dieciocho ejemplos preservados, búsqueda/replay/importación y mismos bytes publicados/descargados |

El tablero declara una EMZ izquierda fija por controlador. Con índices principales 0–4 y EMZ 5, Wolf en EMZ apunta a Main 1 propio y Main 3 rival; Wolf en Main 1 apunta a EMZ propia, y en Main 3 a EMZ rival. Main 0, 2 y 4 no apuntan a una Zona de Monstruos. Estas coordenadas son del modelo registrado y no añaden una elección general de las dos EMZ ni Extra Link.

El disparo se deriva de llegadas reales Normales, por Tributo o Especiales a una zona apuntada. No nace de un campo inicial, un Set ni una invocación durante Damage Step. Las flechas permanecen aunque Wolf tenga sus efectos negados. Negación aplicada y prohibición de activar por Shaman conservan tratamientos distintos. Los presupuestos de uso pertenecen al nombre y al controlador, y no se reinician al revivir o cambiar de copia.

La recuperación FIRE es no dirigida y selecciona al resolver una carta técnica admitida del GY; no se limita a Salamangreat. Una carta del Extra puede volver al Extra, pero sólo la llegada efectiva a la mano instala el bloqueo de nombre. Ese bloqueo se comprueba antes de costes y materiales para Normal, Set y Especiales, dura el resto del turno y persiste aunque salga Wolf. La recuperación de Magia/Trampa requiere una presencia actual obtenida por Link con Wolf como material; la receta de dos materiales también puede satisfacerla. Las recuperaciones del GY no son búsquedas del Deck.

El ejemplo wolf-reborn declara Gazelle y Spinny como materiales iniciales y Ash/Roar en GY. Ejecuta Link de Wolf, batalla contra Blue-Eyes, Main Phase 2 y Reborn del mismo Wolf a Main 1 (segunda zona principal). Después invoca normalmente Aleister, declina su búsqueda opcional, invoca Artemis en EMZ y recupera Ash con Wolf. El objetivo exige Wolf, Artemis y Ash en mano; la historia apropiada de Wolf se obtiene en la ruta, no en la preparación.

Las seis familias siguen parciales. Cadenas generales, prioridad, SEGOC, elecciones simultáneas de varios disparos y Damage Step completo requieren modelos propios; los paquetes sin continuación registrada se excluyen explícitamente. Se mantienen los perfiles de campo y movimientos del GY revisados. Albaz al ser invocado conserva su ampliación pendiente y su exclusión pertinente de Reborn. La emulación móvil no acredita dispositivos físicos ni conformidad WCAG completa.

## Trabajo posterior

1. Completar Albaz al ser invocado y más efectos/materiales de las familias parciales.
2. Registrar prioridad y cadenas generales, SEGOC, Damage Step completo, Flip, ataques múltiples, Xyz y Péndulo.
3. Ampliar probabilidades a varios robos con decisiones rivales y masa desconocida conservada.
4. Revisar 98 identidades heredadas, 51 monstruos con estadísticas desconocidas y 32 propuestas de identidad sin migraciones silenciosas. Son categorías de revisión y no cantidades que deban sumarse como cartas distintas.
5. Completar disponibilidad, pools históricos/digitales, Skills, desbloqueos, Legend y documentación por formato.
6. Validar dispositivos físicos y ampliar accesibilidad; renovar pruebas y descarga en cada build.
7. Incorporar resultados competitivos reales con procedencia, separando ajuste y validación.

La puntuación competitiva permanece estructural y provisional, por decisión del usuario. El importador de resultados reales está preparado; los fixtures técnicos no sustituyen resultados de torneos con formato, banlist, fecha y procedencia.

## Datos y fuentes

Se mantienen 21.986 registros. Cero y el marcador técnico variable ? se distinguen de estadísticas ausentes. Las fuentes técnicas y las capturas oficiales fechadas conservan sus alcances y no acreditan todas las cartas, reglas o disponibilidad actual.

La referencia fijada de [ProjectIgnis/CardScripts](https://raw.githubusercontent.com/ProjectIgnis/CardScripts/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c87871125.lua) se conserva como datos en src/data/technical-references/wolf-c87871125.lua y wolf-reference.json: 3.224 bytes, SHA-256 da3a4b8edced408ae778dc6098fb8e2e37d83e86bc690e726514ee3674a1133f. Es una referencia técnica secundaria contrastada con el texto impreso del catálogo; no es una nueva autenticación de rulings oficiales y el analizador no ejecuta Lua.

La revisión 18 conserva su aceptación remota de 69 grupos sobre el candidato 0807cd758ee30c3824330bcf59eb11f5d298df60 ([workflow](https://github.com/socramgns/MODERN/actions/runs/42152616194)). El commit final 89968d77be3cd4c7058c05b17e8fd9c103713269 conserva el [HTML publicado y descargado](https://github.com/socramgns/MODERN/raw/89968d77be3cd4c7058c05b17e8fd9c103713269/Analizador_YuGiOh.html?download=1), SHA-256 622328ee699c2a6407c5f20e724fe0f613bc6479858d4c2b4f222c86e8fdc9bb. Su informe local original mantiene pass: false, 67/69 grupos y Firefox/WebKit no disponibles. Esta evidencia pertenece a la revisión 18; la aceptación de los bytes nuevos se registra por separado.

Consulta [estado](ESTADO_PROYECTO.md), [desarrollo](DESARROLLO.md), [alcance](ALCANCE_COMBOS.md) y el [análisis histórico de revisión 18](ANALISIS_PENDIENTES_REVISION18.md).

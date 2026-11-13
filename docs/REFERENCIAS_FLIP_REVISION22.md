# Referencias técnicas del perfil de Volteo · revisión 22

Esta revisión usa fuentes técnicas secundarias fijadas por commit para el perfil de Magician of Faith (`31560081`). Los documentos se descargaron y revisaron como datos: ningún Lua o componente del núcleo se ejecuta dentro del analizador. No se presentan como una nueva FAQ oficial, una certificación TCG ni evidencia de cobertura general de Damage Step o SEGOC.

La [revisión estructurada](../evidence/flip-reference-review.json) conserva URLs, recibos HTTPS, bytes, hashes, citas y limitaciones. Los [documentos conservados](../evidence/flip-references/) permiten contrastar las citas sin depender del contenido futuro de una rama remota.

## Fuentes fijadas

Los scripts de cartas pertenecen a ProjectIgnis/CardScripts, commit `915c6ff63518a04e18d16ee45962d75a8c8be264`. El núcleo se fija por separado a edo9300/ygopro-core, commit `c2e0b697e031d3560c077c9cd2cc76474969dedf`. La revisión estática entre estos documentos no afirma que esas dos instantáneas se hayan probado juntas.

| Documento | SHA-256 | Criterio revisado |
| --- | --- | --- |
| [Magician of Faith](https://github.com/ProjectIgnis/CardScripts/blob/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c31560081.lua) | `43134bf40309f7c067b0e738fe2d6e48088aa3187c0bb3bb36975568e1c57682` | FLIP obligatorio, objetivo propio GY, comprobación al resolver y confirmación de la carta. |
| [Invoked Mechaba](https://github.com/ProjectIgnis/CardScripts/blob/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c75286621.lua) | `14ab80a51e638427b99d977c16584d454ac6825a78dd0491db08173353ceecd9` | Permiso de Damage Step, coste de mismo tipo y negación de activación con destierro. |
| [Salamangreat Roar](https://github.com/ProjectIgnis/CardScripts/blob/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c51339637.lua) | `91a8a8b80d0b979062efb301687dc9426a85956623e55698d9abbfe1d39b109e` | ContraTrampa, negación de activación y destrucción sin seleccionar objetivo. |
| [processor.cpp](https://github.com/edo9300/ygopro-core/blob/c2e0b697e031d3560c077c9cd2cc76474969dedf/processor.cpp) | `083b4da8e33f22890d186c7d19ebbcf0113aa4c89d59e30f73cef0d2dd8cda90` | FLIP diferido en batalla, prevención anterior a sus respuestas y envío posterior. |
| [operations.cpp](https://github.com/edo9300/ygopro-core/blob/c2e0b697e031d3560c077c9cd2cc76474969dedf/operations.cpp) | `2293f5693d3832561cc0395ab4ece8134b33560b522a38ab6d7133ea0bd31ad4` | Procedimiento real de Volteo y camino de destrucción por efecto. |
| [card.cpp](https://github.com/edo9300/ygopro-core/blob/c2e0b697e031d3560c077c9cd2cc76474969dedf/card.cpp) | `7903a19f84ddadf9fc792c7cb7eb3d8331c6fdab01e7c07fe00f16518902826b` | Distinción entre destruir sin seleccionar objetivo y seleccionar un monstruo marcado por batalla. |
| [effect.cpp](https://github.com/edo9300/ygopro-core/blob/c2e0b697e031d3560c077c9cd2cc76474969dedf/effect.cpp) | `5d76eeafd10260bc2d25a2297a635dd14d166ba418e22188806b33ceca82fe03` | Restricciones de activación en Damage Step y excepción de ContraTrampas. |

También se conservan los scripts cotejados de Infinite Impermanence, D.D. Crow, Effect Veiler y Swordsoul Grandmaster Chixiao. Sus recibos y hashes están en la revisión estructurada. La identidad y los datos técnicos de Faith proceden de la CDB fijada por el catálogo existente; esta revisión no cambia su identidad ni sus estadísticas.

## Contrato del efecto registrado

Faith crea un efecto `SINGLE+FLIP`, sin marcador opcional, coste ni límite de usos en el script revisado. La comprobación de activación `chk==0` devuelve `true` incluso si no hay Magias legales. Por ello, un volteo real genera un pendiente obligatorio también sin objetivo; la operación recupera únicamente si existe una copia seleccionada relacionada con el efecto. No se añade una carta inventada ni se omite la oportunidad de negar esa activación.

La selección corresponde al Cementerio del controlador que activa el efecto. El propietario original de Faith no cambia ese jugador. La Magia elegida conserva su UID y se comprueba de nuevo al resolver; si abandonó el Cementerio, no se elige otra. La operación lleva la copia a la mano y la muestra al rival. No es una búsqueda del Deck ni un barajado. Una negación previa del efecto de Faith no cancela por sí sola su activación obligatoria.

La lista inicial de movimientos revisados incluye Invocation (`74063034`), Monster Reborn (`83764718`) y Branded Fusion (`44362883`). Una rama sin objetivo exige que no haya ninguna Magia legal en todo el Cementerio pertinente. Si sólo hay objetivos cuyo movimiento no está modelado, se excluye la ruta afectada: estar fuera de esa lista no demuestra que una carta sea un objetivo ilegal según las reglas del juego.

## Orden de batalla y respuestas

En `processor.cpp`, líneas 2484–2606, se calcula daño, se evalúa prevención o reemplazos y se marca la destrucción por batalla antes de liberar los FLIP diferidos. El efecto se resuelve mientras Faith sigue en el campo; las líneas 2643–2656 completan después el envío de los supervivientes de la misma estancia. El perfil debe gastar primero la prevención pertinente y diferir únicamente la salida física. Si una respuesta ya desterró o destruyó a Faith, el cierre no puede enviarla por segunda vez.

Mechaba tiene permisos explícitos para Damage Step y cálculo de daño. La condición que excluye un monstruo ya marcado como destruido por batalla se refiere al propio Mechaba. No impide que Faith marcada active su FLIP o sea desterrada tras una negación pertinente. El coste sigue siendo un monstruo real de la mano al responder al efecto de monstruo de Faith.

Roar niega la activación y destruye sin seleccionar objetivo. El camino estático cotejado permite destruir por efecto a Faith ya marcada: el marcador de batalla no equivale a una inmunidad a destrucción por efecto. La prohibición separada de seleccionar como objetivo un monstruo marcado no se aplica a la destrucción no dirigida de Roar. Las condiciones de control, colocación previa y usos de Roar siguen siendo necesarias.

Infinite Impermanence, D.D. Crow y Chixiao no reciben permiso para la nueva ventana por encontrarse la fase general en BATTLE. Veiler requiere la Main Phase rival. Esta extensión no crea una ventana libre para sus activaciones ni amplía las cadenas generales. Las respuestas y contrarrespuestas deben pertenecer a los paquetes expresamente revisados.

## Límites de la evidencia

Los intentos HTTPS de capturar la base de datos, el libro de reglas y páginas oficiales de Damage Step de Konami devolvieron `403` desde el proxy del entorno. No hay una nueva captura oficial autenticada para este perfil. Los resultados documentan una revisión técnica secundaria y estática; sus referencias no se convierten en una certificación oficial por incorporarlas al HTML.

Los efectos simultáneos generales, otras cartas FLIP, las prohibiciones de activación arbitrarias, el Damage Step completo y la disponibilidad vigente por formato requieren revisión adicional. La puntuación competitiva permanece provisional y estas fuentes no aportan resultados de torneos.

# Uso de los perfiles añadidos en R24

La entrega sigue siendo `Analizador_YuGiOh.html`, un único archivo con catálogo, interfaz y motor incorporados. No hace falta instalar Python, Node ni Codex para utilizarlo. La compilación y las herramientas de revisión pertenecen al desarrollo del proyecto.

Los cuatro ejemplos nuevos aparecen en el selector del laboratorio. Cargar uno sustituye la baraja del laboratorio y prepara un estado inicial declarado; no juega automáticamente ni acredita invocaciones previas. Conserva los 28 ejemplos anteriores.

| Ejemplo | Qué permite comprobar |
| --- | --- |
| Branded con prioridad | Activar Branded Fusion, responder, ceder prioridad dos veces y elegir los materiales al resolver. Después, ordenar el disparo opcional de Lubellion, pagar su descarte y resolver su Fusión. |
| Tenyi con prioridad | Desterrar Ashuna como coste, responder con Ash y comprobar que negar el efecto no devuelve el coste. |
| Salamangreat con prioridad | Ordenar el disparo de Gazelle y separar su envío, el descarte de Spinny y su resurrección. |
| Metalfoes Fusion con prioridad | Elegir al resolver dos materiales físicos admitidos e invocar Adamante conservando su historial de Fusión. |

La restricción de Shaman también se comprueba antes de abrir los disparos registrados: un efecto Extra prohibido no deja una cadena obligatoria bloqueada ni impide cerrar un grupo opcional.

Estos ejemplos activan prioridad y orden de disparos. El panel indica qué jugador decide; cada cesión es una acción explícita. Dos cesiones consecutivas cierran la construcción de la cadena y sus eslabones se resuelven en orden inverso. Los controles de deshacer, exportar e importar reconstruyen las acciones desde el origen y vuelven a comprobar costes, elecciones e historial.

## Costes, límites y restricciones

Los materiales de Invocation, Branded Fusion y Metalfoes Fusion se eligen al resolver: no son costes de activación. Lubellion sí descarta al activar su disparo. Su uso por nombre permanece gastado si se niega la activación; las restricciones de ataque y de Invocaciones Extra restantes se aplican al resolver sin negación, incluso cuando ya no es posible realizar la Fusión. Una Invocación Extra anterior que no fuera Fusión no impide por sí sola este disparo de Lubellion. Branded Fusion conserva su restricción distinta de todo el turno y su límite de activación.

Invocation puede producir Mechaba con su receta revisada y Cyber Twin con exactamente dos Cyber Dragon de la mano. La regla adicional de materiales de campo/Cementerios se limita a las Fusiones Invoked admitidas; no se extiende a Cyber Twin. La recuperación de Invocation fija al activar el Aleister desterrado; barajar Invocation es parte del efecto, no un coste.

Mechaba y Salamangreat Roar responden a activaciones de monstruos y a activaciones de cartas Mágicas/Trampa. Un efecto de una Mágica/Trampa que ya estaba en su zona, como el efecto GY de Invocation o Counter, conserva su tipo propio. Blue-Eyes Spirit Dragon mantiene sus respuestas a activaciones pertinentes del Cementerio. Ash sólo se ofrece frente a las categorías de acceso al Deck expresamente registradas.

## Otros perfiles físicos

Chengying puede sustituir su destrucción por efecto desterrando una carta propia del Cementerio admitida. Es un reemplazo que no inicia una cadena, sin límite por turno; el destierro no es un coste de activación. Su disparo opcional por destierro usa una vez por nombre y jugador, excluye Damage Step y elige al resolver una carta del campo rival y otra de su Cementerio. Ambas zonas deben seguir ofreciendo una selección legal.

La Synchro registrada de Librarian usa un Cantante Normal y uno o más no Cantantes Normales técnicamente cotejados, con niveles impresos que sumen cinco. Excluye materiales con restricciones o modificaciones no modeladas. Su robo obligatorio conserva el perfil de disparos existente. Librarian y Cyber Twin sólo se convierten en objetivos Extra legales de Monster Reborn después de un procedimiento apropiado realmente ejecutado y de una salida posterior pertinente; un campo inicial no sustituye esa historia.

Metalfoes Counter exige una destrucción física registrada de una carta propia; su efecto GY destierra la copia como coste en un turno posterior al de su envío. Combination distingue su activación de sus efectos disparados: activarla después de una Fusión no genera retrospectivamente su resurrección. Su búsqueda por envío del campo al Cementerio conserva la copia y el evento reales. Las escalas revisadas pueden destruir una Combination propia admitida y generar ese disparo.

## Límites que siguen visibles

- Las recetas y selecciones son finitas. No cubren todos los materiales, sustitutos, cartas de salida, procedimientos ni efectos de estas familias.
- Las nuevas Fusiones usan zonas de monstruos principales; Sunlight Wolf conserva la geometría registrada del Extra izquierdo. Varios procedimientos Extra anteriores mantienen su alcance de jugador original.
- Metalfoes Fusion baraja como efecto antes de robar. Como no se conoce la carta resultante, la resolución positiva permanece pendiente: no inventa un orden ni convierte una hipótesis en un robo observado.
- La activación de Metalfoes Counter en Damage Step sigue fuera del perfil admitido. Los perfiles de batalla anteriores conservan sus ventanas revisadas.
- El reemplazo de Chengying protege una copia por elección de destrucción. Las protecciones compuestas de varias copias y los efectos de salida desconocidos requieren perfiles adicionales.
- Los análisis de azar conservan su dominio declarado de R23: no demuestran una estrategia óptima general con información oculta.

Las referencias secundarias fijadas están en [el manifiesto R24](../evidence/revision24/references/manifest.json). Se conservan sus bytes y hashes; los scripts externos se leen como documentación y nunca se ejecutan dentro del analizador. Esto no acredita una certificación general de reglas oficiales TCG. La puntuación competitiva permanece estructural y provisional.

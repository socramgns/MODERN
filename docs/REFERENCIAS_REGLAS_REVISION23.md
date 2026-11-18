# Referencias y alcance de las reglas de la revisión 23

Revisión documental del 16 de noviembre de 2026. Este documento describe los perfiles implementados y las referencias técnicas utilizadas. No declara una aceptación de CI, cierre de criterios del proyecto ni certificación de reglas TCG. La puntuación competitiva permanece provisional.

Los Lua de cartas y los archivos C++ citados se leen como datos documentales. No se ejecutan, compilan ni incorporan como código de reglas al analizador. Una ruta llamada `official/` en el repositorio de scripts no convierte su contenido en una publicación oficial de Konami.

## Fuentes fijadas y procedencia

Los scripts pertenecen a ProjectIgnis/CardScripts, commit `915c6ff63518a04e18d16ee45962d75a8c8be264`. El núcleo pertenece a edo9300/ygopro-core, commit `c2e0b697e031d3560c077c9cd2cc76474969dedf`. Son referencias secundarias de implementación; la revisión estática no demuestra que ambas instantáneas se hayan ejecutado juntas ni autentica una nueva FAQ oficial.

Los recibos de revisión se conservaron en el espacio de trabajo: `r23-priority-references/soft-opt-review.json`, `r23-priority-references/core-receipt.json`, `r23-xyz-pendulum-references/references.json` y los recibos de `r23-trigger-references/`. Las consultas documentadas datan del 14 y 15 de noviembre de 2026. La redacción de este documento no constituye una nueva descarga. Los enlaces siguientes fijan el contenido remoto por commit; los SHA-256 identifican las copias revisadas.

| Documento | SHA-256 | Uso en la revisión |
| --- | --- | --- |
| [Gem-Knight Pearl, 71594310](https://github.com/ProjectIgnis/CardScripts/blob/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c71594310.lua) | `ac34ec4a47f1569d9167aeb77e5b26058c1d21c43b0c707a0f349b39c4285811` | Procedimiento Xyz de dos monstruos de nivel 4; perfil sin efecto. |
| [Blackship of Corn, 51735257](https://github.com/ProjectIgnis/CardScripts/blob/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c51735257.lua) | `f7b5ebdd528d2809fbe4fb28d8201a472caf531fd639a60ff311233469073074` | Desacoplar, condición de ataque, objetivo, envío y daño; distinción entre cuenta local y restricción OATH. |
| [Metalfoes Goldriver, 33256280](https://github.com/ProjectIgnis/CardScripts/blob/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c33256280.lua) | `d132eb3e19bbf38689cdc1b83f7cdd17d653a0d742445ff6d026f2f07e12c2ac` | Efecto Péndulo de destruir otra carta propia y Colocar una Mágica/Trampa Metalfoes. |
| [Metalfoes Silverd, 7868571](https://github.com/ProjectIgnis/CardScripts/blob/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c7868571.lua) | `746a5f4b9cc689c6b222460fbcc2d798a07977a639bc86b679ae6c6b2f2b86f9` | Mismo perfil limitado de escala y efecto Péndulo. |
| [Metalfoes Steelen, 60473572](https://github.com/ProjectIgnis/CardScripts/blob/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c60473572.lua) | `90c2711836090e93a3d63256ae7fd1ab3a628150347c6d8d96cfd4e3ec594209` | Mismo perfil limitado de escala y efecto Péndulo. |
| [Metalfoes Volflame, 69351984](https://github.com/ProjectIgnis/CardScripts/blob/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c69351984.lua) | `8bd9ee7ad346d1b14b5771e8a5a0757e08089e5fd6d26eb9ed4639f2ae8ae867` | Mismo perfil limitado de escala y efecto Péndulo. |
| [T.G. Hyper Librarian, 90953320](https://github.com/ProjectIgnis/CardScripts/blob/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c90953320.lua) | `88f32e5fb125620cf30ab73758cdfb84b6ab75b028770c900b1a71ff8b50a266` | Disparo obligatorio ante una llegada Synchro registrada y relación de la fuente al resolver. |
| [Rush Recklessly, 70046172](https://github.com/ProjectIgnis/CardScripts/blob/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c70046172.lua) | `ce5c215d8ec38793fbf6c046f6b71704dfba788b70bfe35eb13d552abe5f675b` | Objetivo boca arriba, aumento temporal de ATK y ventana anterior al cálculo de daño. |
| [Stardust Spark Dragon, 83994433](https://github.com/ProjectIgnis/CardScripts/blob/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c83994433.lua) | `21bef8f13edda89986c1da005b3425a64c4027d56347384f375c618e455f182f` | Protección y cuenta local de uso. |
| [Invoked Mechaba, 75286621](https://github.com/ProjectIgnis/CardScripts/blob/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c75286621.lua) | `14ab80a51e638427b99d977c16584d454ac6825a78dd0491db08173353ceecd9` | Coste del mismo tipo, negación de activación, destierro y cuenta local. |
| [Mirrorjade, 44146295](https://github.com/ProjectIgnis/CardScripts/blob/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c44146295.lua) | `145576dad9dc6405d6eb67535b5f67b0dd0bf6cac50b80212abd1171f8a35875` | Cuenta local y restricción adicional del siguiente turno, tratadas por separado. |
| [Azure-Eyes Silver Dragon, 40908371](https://github.com/ProjectIgnis/CardScripts/blob/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c40908371.lua) | `3d2ca2918a5c9d5e43ac14af931f4d52e7c7f81fc29bd95424aa1afbc9b84727` | Límite local de la resurrección de Standby. |
| [The White Stone of Ancients, 71039903](https://github.com/ProjectIgnis/CardScripts/blob/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c71039903.lua) | `89cd5c7c6d4a1838936fbe365bec7b6ec3436e93b7c5778f0dda007e6df7fe60` | Cuenta del efecto concedido de End Phase y límite separado de recuperación. |
| [libeffect.cpp](https://github.com/edo9300/ygopro-core/blob/c2e0b697e031d3560c077c9cd2cc76474969dedf/libeffect.cpp) | `982dea45b688c4cba54caff08096d4dbb866cc449d2a81fffef37dc90ec3f504` | Parámetros por defecto de `SetCountLimit` y API explícita `RestoreCountLimit`. |
| [effect.cpp](https://github.com/edo9300/ygopro-core/blob/c2e0b697e031d3560c077c9cd2cc76474969dedf/effect.cpp) | `5d76eeafd10260bc2d25a2297a635dd14d166ba418e22188806b33ceca82fe03` | Consumo de la cuenta local al activar. |
| [processor.cpp](https://github.com/edo9300/ygopro-core/blob/c2e0b697e031d3560c077c9cd2cc76474969dedf/processor.cpp) | `083b4da8e33f22890d186c7d19ebbcf0113aa4c89d59e30f73cef0d2dd8cda90` | Negación de activación, retirada de restricciones OATH y orden de batalla. |

## Corrección de los límites por turno

El expediente `soft-opt-review.json` distingue tres mecanismos: cuenta local por instancia, cuenta por código compartido y restricción auxiliar marcada OATH. `SetCountLimit(1)` usa por defecto código y flags cero (`libeffect.cpp`, líneas 103–132); `dec_count` consume la cuenta local (`effect.cpp`, líneas 579–591). La ruta de negación retira efectos OATH y sólo devuelve la cuenta compartida cuando se declara `COUNT_CODE_OATH` (`processor.cpp`, líneas 1127–1152 y 4123–4127).

La revisión completa indicada en el expediente abarca 67 archivos del núcleo y 22 953 scripts Lua. `RestoreCountLimit` aparece en tres lugares de `proc_xyz.lua`, no como devolución global al negar activaciones. Es una conclusión de revisión estática de esas versiones, no una certificación oficial ni una regla inferida únicamente del nombre «soft OPT».

| Perfil implementado | Consecuencia de negar su activación |
| --- | --- |
| Spark: protección | Conserva consumido el uso de esa estancia de la instancia durante el turno. Si no resuelve, no aplica protección. |
| Mechaba: negación | Conserva consumido el uso de esa estancia y el envío físico pagado como coste. |
| Mirrorjade: destierro | Conserva el uso local y el envío del Extra pagado como coste. Su bloqueo adicional del siguiente turno se trata aparte; no se deduce de devolver o conservar esa cuenta. |
| Azure-Eyes: resurrección de Standby | Conserva el uso local de la resurrección; negar la activación no ofrece otra activación en la misma estancia y turno. |
| Ancients: invocación de End Phase | Conserva el uso del efecto concedido registrado. El efecto de recuperar Blue-Eyes tiene su propio límite por nombre y no recibe un reinicio por esta revisión. |
| Corn: envío y daño | Conserva el material desacoplado y el uso local. La negación de activación sí retira la restricción auxiliar OATH de no atacar cuando sigue siendo la misma estancia; una negación sólo del efecto no retira esa restricción. |

Salir y regresar al campo, cambiar de instancia, llegar al siguiente turno o reiniciar un límite por nombre son cuestiones distintas. Los perfiles validan su estancia y sus claves de uso; esta corrección no autoriza borrar indiscriminadamente todo `used` ni devolver costes.

## Alcance de los módulos nuevos

| Módulo | Contrato implementado y límites |
| --- | --- |
| [priority-chain.js](../src/app/priority-chain.js) | Dos pases consecutivos, elección real de ambos jugadores, costes y objetivos al activar, resolución LIFO de un eslabón por paso. Sólo adaptadores registrados; máximo documental de 128 eslabones como guarda computacional. |
| [trigger-order.js](../src/app/trigger-order.js) | Grupos obligatorio del jugador de turno, obligatorio rival, opcional del jugador de turno y opcional rival. Orden dentro del grupo y declinación opcional explícitos. Perfiles Mo Ye, Chixiao, Aleister, Longyuan, Faith, Librarian y Shthana; cada efecto tiene su propio registro y procedencia. |
| [damage-step.js](../src/app/damage-step.js) | Declaración, inicio, antes del cálculo, cálculo, después del cálculo y final. Rush sólo antes del cálculo; negaciones y ContraTrampas pertinentes según ventana. Faith se activa después del cálculo y sale por batalla al final. Si el blanco sale antes de calcular, el combate se cierra sin daño inventado, replay de ataque ni devolución del ataque. |
| [xyz-summon.js](../src/app/xyz-summon.js) | Pearl y Corn, rango 4, dos Normales de nivel 4 revisados y boca arriba; sin Tokens ni procedimientos alternativos. Materiales por UID, propietario y anfitrión; desacoplar paga un coste físico. Corn comprueba el umbral de ATK al activar y la relación del objetivo al resolver; no repite el umbral al resolver. |
| [pendulum-summon.js](../src/app/pendulum-summon.js) | Los cuatro Metalfoes Normales citados, escalas en columnas 0/4 y niveles estrictamente intermedios. Grupo simultáneo una vez por turno por jugador; mano a zonas principales, Extra boca arriba a la zona Extra fija o principales apuntadas según geometría revisada. Límite de enumeración de 4096 acciones, con informe de incompletitud y validación manual. |
| [draw-sequences.js](../src/app/draw-sequences.js) | De uno a tres robos de turno inciertos, cronológicos, de ambos jugadores. Pesos exactos por copia física; MAX propio/MIN rival en el dominio declarado y con estado completo declarado después de cada evento. Las ramas sin cobertura conservan intervalo desconocido. No es un modelo de información privada, una tasa de victoria ni un replay observado. |

Los destinos de Colocación Metalfoes revisados son `73594093`, `33327029` y `69711728`. Ese registro sólo admite su Colocación y consecuencias físicas pertinentes: no implementa por ello sus activaciones o efectos del Cementerio. Las restricciones de Spirit Dragon, Spirit with Eyes of Blue, Wolf y los bloqueos admitidos siguen comprobándose en los procedimientos correspondientes.

El registro base de prioridad admite los adaptadores de Spark, Veiler, D.D. Crow, Mechaba, negación de activaciones del Cementerio de Blue-Eyes Spirit Dragon, Roar, Infinite Impermanence, Chixiao, Monster Reborn y Compulsory Evacuation Device. Los módulos adicionales registran sus efectos de disparo, Rush, Corn y las escalas Metalfoes. `capabilities().effects` publica los adaptadores efectivamente cargados; un efecto de otro módulo, como el destierro anterior de Mirrorjade, no recibe un adaptador de prioridad por aparecer en esta revisión de límites por turno. Faith conserva sus objetivos de recuperación revisados: Invocation, Monster Reborn y Branded Fusion.

Las APIs de capacidades publican `generalCardRulesComplete:false`, `allXyzEffectsCovered:false`, `allPendulumCardEffectsCovered:false` o sus equivalentes de alcance. La [guía de uso](USO_REGLAS_REVISION23.md) identifica flags, seis ejemplos y reproducción de informes. La revisión de [datos y formatos](REVISION_DATOS_FORMATOS_R23.md) conserva por separado las identidades, estadísticas y contextos pendientes; estas referencias no resuelven esos datos por similitud de nombres.

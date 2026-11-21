# Alcance del motor de combos · revisión 24

El motor trabaja con copias físicas, zonas, propietario/controlador, costes, restricciones e historial. Los recorridos admitidos pueden buscarse y reproducirse desde su origen. El texto de una carta y sus metadatos no se ejecutan como reglas ni acreditan por sí solos que todos sus efectos estén implementados.

La entrega conserva las seis familias y los procedimientos registrados anteriores, las cadenas con prioridad, SEGOC, Damage Step, Xyz, Péndulo y análisis de robos inciertos de su dominio declarado. R24 amplía perfiles concretos y añade cuatro ejemplos guiados, hasta **32 ejemplos**. [Uso R24](USO_REGLAS_REVISION24.md) explica sus controles y las diferencias entre modos; cargar un escenario prepara supuestos físicos y no juega automáticamente.

| Perfil añadido en R24 | Comportamiento y límite |
| --- | --- |
| Invocation / Branded / Lubellion | Activación y resolución separadas; materiales elegidos al resolver. Lubellion descarta al activar y aplica las restricciones restantes al resolver sin negación. Branded conserva su restricción distinta de todo el turno. |
| Tenyi / Salamangreat / Ash | Costes físicos, respuestas por categorías de acceso al Deck expresamente registradas, límites por jugador y disparos SEGOC. No se asigna una respuesta por el nombre de una carta. |
| Chengying | Reemplazo de destrucción por efecto sin cadena ni límite por turno, con una carta propia GY admitida; protege una copia por elección. Disparo opcional de destierro sin objetivo, una vez por nombre/jugador; elige al resolver y exige ambas zonas rivales disponibles. Excluye Damage Step. |
| Librarian / Cyber Twin | Synchro de Nivel 5 con exactamente un Cantante Normal y uno o más no Cantantes Normales revisados. Cyber Twin usa exactamente dos Cyber Dragon de la mano mediante Invocation, sin sustitutos. Reborn exige historial apropiado realmente ejecutado. |
| Metalfoes | Fusion con materiales físicos admitidos para Adamante; Counter y Combination distinguen activación y disparos. Barajar antes de robar mantiene la resolución pendiente si el orden se desconoce; Counter en Damage Step sigue fuera del perfil. |
| Datos y formatos | Solicitud exacta vinculada a passcodes y copia revisable de datos; correcciones de construcción de los diez formatos. No autentica pools, disponibilidad ni nuevas estadísticas oficiales. |

## Prioridad, decisiones y conservación

- Cada jugador cede prioridad de forma explícita. Dos cesiones consecutivas cierran la construcción; la resolución es LIFO, un eslabón por acción y sin nuevas activaciones entre eslabones.
- SEGOC mantiene los cuatro grupos de turno/rival y obligatorio/opcional. Los efectos opcionales pueden declinarse; las consecuencias obligatorias revisadas no se descartan para admitir una ruta.
- Las respuestas se ofrecen por su tipo y categoría revisados. Negar una activación o efecto no devuelve costes físicos ni concede usos extra fuera de su regla propia.
- Los procedimientos nuevos de Fusión/Synchro usan zonas principales; las reglas revisadas de Sunlight Wolf conservan su geometría del Extra izquierdo. No se incorpora un procedimiento Extra universal.
- Un campo inicial es una declaración, no una invocación presenciada. Reborn requiere el procedimiento propio ejecutado cuando corresponde. Las hipótesis probabilísticas permanecen separadas de los robos observados.

## Límites abiertos

Las recetas, materiales, blancos y salidas de carta son finitos. Los efectos de sustitución desconocidos, materiales con restricciones o adjuntos no revisados y protecciones compuestas de varias copias de Chengying necesitan perfiles adicionales. Counter en Damage Step permanece excluido. Metalfoes Fusion puede barajarse, pero un robo positivo posterior queda pendiente cuando se desconoce el orden.

El análisis MAX/MIN y los robos cronológicos mantienen el alcance declarado de R23: manos/campos completos suministrados y búsqueda acotada. No prueban una estrategia óptima general con información oculta. Los 21.986 registros del catálogo no son 21.986 efectos implementados. La puntuación principal sigue estructural y provisional.

Se conservan las 32 definiciones originales: **27/32 verificadas y cinco pendientes (84,375 % del listado operativo sin ponderar)**. C27–C31 permanecen abiertos. Este cociente no mide todas las cartas o reglas del juego, esfuerzo, tiempo restante ni una tasa de victoria.

Siguen pendientes las **98 identidades heredadas**, las estadísticas de **51 monstruos** y **32 propuestas**, además de fuentes fechadas para disponibilidad, pools, Skills, Legend y reglas particulares de formato. El cotejo técnico nuevo sustentó cero cambios reales de identidad o estadísticas; no se transfieren cifras por nombre. C30 y C31 requieren evaluación real con tecnologías de asistencia y pruebas en dispositivos físicos. La puntuación principal sigue siendo estructural y **provisional por decisión del usuario**; el importador de resultados reales no equivale a calibración competitiva.

## Validación y documentos

[CI remoto](https://github.com/socramgns/MODERN/actions/runs/44848581354): **95/95 grupos**. GUI focal: **28/28** sobre el HTML exacto sin inyección. La batería Node de fuente tiene su propio registro de 51 grupos; no es una ejecución local completa del runner. Se observaron resumen compacto y estados de CI; no se recuperó el informe remoto completo ni se recomputó su hash anunciado.

Build `2d7de2e019f18f6524de0f72d8575ec12a981d145e360cd897397b2680a8c0c7`; SHA-256 del HTML `0d955d44e782d57db880a68b2dac80ad288172e570da647e6753cc8d1f6eb63c`; **7.546.537 bytes**, **135 archivos JavaScript** y **32 ejemplos**.

Los detalles técnicos están en [Uso R24](USO_REGLAS_REVISION24.md), [Datos y formatos R24](REVISION_DATOS_FORMATOS_R24.md) y [Evidencia](../evidence/README.md). Las referencias fijadas son secundarias y no certifican rulings oficiales TCG. El [alcance histórico R23](../evidence/history/revision23-accepted/docs/ALCANCE_COMBOS.md) conserva intactas sus afirmaciones y limitaciones originales.

# Analizador de barajas Yu-Gi-Oh · revisión 20

La entrega sigue siendo **un único Analizador_YuGiOh.html sin comprimir**, con catálogo y motores incorporados. El original y las revisiones anteriores se conservan. Cada ampliación cerrada produce otro HTML actualizado.

[Descargar el HTML de esta rama: revisión 20](https://github.com/socramgns/MODERN/raw/refs/heads/entrega/analizador-yugioh-estable20/Analizador_YuGiOh.html?download=1)

VALIDACION_R20_PENDIENTE

La revisión 20 registra el disparo opcional de Fallen of Albaz después de una llegada real por Invocación Normal o Monster Reborn bajo el control del actor 0. El descarte se paga al activar. La Fusión usa la misma copia de Albaz y un único monstruo rival boca arriba de perfil admitido; conserva propietarios, destinos, restricciones y reproducción desde el origen.

## Cómo probar Albaz

1. Guarda el archivo con extensión .html y ábrelo en un navegador reciente. Si el enlace muestra código, usa Guardar como y conserva Analizador_YuGiOh.html.
2. En Probar un ejemplo incluido, selecciona albaz y carga el escenario. Sustituye la baraja actual y declara sus materiales iniciales.
3. Invoca normalmente a Albaz. Activa ALBAZ FUSION con el descarte y el Mechaba rival indicados en la guía.
4. Comprueba la llegada real de Mirrorjade, el descarte y el destino de ambos materiales a sus respectivos GY.
5. Activa Monster Reborn sobre la misma copia de Albaz. Comprueba su propietario y que el uso gastado no se reinicia.
6. Revisa objetivos, deshacer, exportación/importación del informe y replay desde el origen.

Se conservan los diecinueve ejemplos anteriores, incluidos wolf-reborn, spirit-reborn, azure, spark y shuffle, además de edición, estadísticas, probabilidades, revisión de identidades y exportaciones. Catálogo y cálculo están incorporados; imágenes y actualizaciones remotas necesitan conexión.

Los destinos revisados son Lubellion the Searing Dragon (Albaz + un material DARK rival) y Mirrorjade the Iceblade Dragon (Albaz + un Fusion/Synchro/Link rival admitido). Se comprueban espacio tras retirar al propio Albaz, posición Ataque/Defensa y cualificación apropiada obtenida por la Fusión ejecutada. No se usan otros monstruos propios, ni materiales de mano, Deck o GY por inferencia. Los perfiles con consecuencias no registradas, incluido Mirrorjade rival como material, Xyz, adjuntos, redirecciones y otros materiales, siguen fuera de este paquete.

El uso por nombre de Albaz se consume incluso al negar su activación. Reborn conserva UID y propietario de la copia, registra su nueva llegada desde GY y no reinicia un uso gastado. La activación de Albaz ocurre en campo; no se presenta como activación en GY por haber sido revivido. No se deducen respuestas de Ash o Spirit donde el paquete no cumple sus condiciones.

Las respuestas físicas registradas de Mechaba, Roar, Veiler e Impermanence mantienen sus costes y consecuencias. El descarte de Albaz no se devuelve por una negación; los materiales de Fusión sólo se mueven cuando la Fusión resuelve. Los disparos opcionales superpuestos exigen declinaciones explícitas hasta conservar un paquete resoluble. Si existe un pendiente obligatorio junto al de Albaz/Lubellion, se debe declinar la oportunidad opcional antes de resolver el obligatorio; no se inventa una cadena SEGOC.

Las seis familias y el motor general siguen parciales. Esta ampliación no modela todos los destinos de Fusión de Albaz, todos los materiales o efectos de salida, prioridad general, SEGOC completo, Damage Step, Flip, ataques múltiples, Xyz o Péndulo. Las fases, perfiles de campo y consecuencias sin revisar se excluyen de las transiciones afectadas. Los campos iniciales declarados son supuestos; una historia apropiada se acredita mediante acciones registradas.

La puntuación competitiva permanece estructural y provisional por decisión del usuario. El importador de resultados reales está preparado. Las barajas y fixtures de prueba no son resultados de torneo.

## Seguimiento y evidencia

La lista de 32 criterios y sus estados se conserva en [estado del proyecto](docs/ESTADO_PROYECTO.md) y [pendientes](docs/ANALISIS_PENDIENTES_REVISION20.md). Un recuento de criterios no equivale a una cobertura universal del juego ni a un porcentaje de esfuerzo restante.

Las pruebas Node sobre fuentes, tareas sobre HTML compilado, ejecución remota, publicación y descarga se vinculan al commit y build. Se conservan los resultados locales originales; cantidades previstas o configuración de CI no acreditan aprobación. Las comprobaciones móviles emuladas no acreditan dispositivos físicos ni WCAG completa.

La referencia fijada de [ProjectIgnis/CardScripts](https://raw.githubusercontent.com/ProjectIgnis/CardScripts/915c6ff63518a04e18d16ee45962d75a8c8be264/official/c68468459.lua) se conserva como datos en src/data/technical-references/albaz-c68468459.lua y albaz-reference.json: 1.289 bytes, SHA-256 99d39a6a0b1ef2ab7355898dac3046a5c2086732c18f8ca7b8c6bc914132695d. Se contrasta con el texto fijado del catálogo. Es evidencia técnica secundaria; no autentica nuevos rulings oficiales y nunca se ejecuta como código del analizador.

La revisión 19 conserva la aceptación remota de 71 grupos sobre el candidato c5bfa6d74aec0d6ae1661170cd712c0daa49fe32 ([workflow](https://github.com/socramgns/MODERN/actions/runs/42305553910)). El commit final a0e283f0e5e3c66ccdd6b18a708d1840b222217c conserva el [HTML descargado y verificado](https://github.com/socramgns/MODERN/raw/a0e283f0e5e3c66ccdd6b18a708d1840b222217c/Analizador_YuGiOh.html?download=1), SHA-256 e03038a2d7932ded30cfb93e0d5d79a3e3dbe26efdadefc1b02b445632933fda. Su informe local original permanece con pass: false, 69/71 grupos y Firefox/WebKit no disponibles. Esa evidencia pertenece a R19; la aceptación de la ampliación actual se registra por separado.

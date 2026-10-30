# Qué falta para terminar el analizador · revisión 15

El proyecto conserva catálogo, importación y edición de barajas, construcción por formato, estadísticas, probabilidades, exportaciones y un laboratorio de jugadas registradas en un único `Analizador_YuGiOh.html`. La revisión 15 añade Monster Reborn en un subconjunto revisado y una herramienta para preparar copias de barajas con identidades elegidas entre propuestas. Las seis familias siguen siendo parciales y la puntuación competitiva permanece **provisional**, como solicitó el usuario.

La revisión 15 pasó **63/63 grupos de pruebas en una ejecución completa** sobre el HTML final, con **119 archivos JavaScript** comprobados. Chromium, Firefox y WebKit aprobaron sus tareas; Firefox completó la apertura directa del HTML local sin conexión. Las tareas móviles se ejecutaron en Chromium y WebKit emulados, sin acreditar teléfonos físicos ni conformidad WCAG completa. Build `c4b3a88282d993fd538a0ecc5c80b62f99239bfbbfeb0fd47bdbfc70816388ed`; SHA-256 `2a4e2c76869e9fdfce9435152fd2c0b654180a0a71c1e0c082b08555c263b804`; tamaño **7,075,902 bytes**. Estos resultados se limitan a las capacidades y tareas registradas; la puntuación competitiva sigue provisional.

La publicación, la descarga HTTP y GitHub Actions requieren observación independiente para el commit de esta revisión. No se deduce su resultado de la configuración de CI.

## Capacidades y criterio de cierre de esta ampliación

| Área | Trabajo de revisión 15 | Criterio de aceptación |
| --- | --- | --- |
| Resurrección | Monster Reborn desde mano en Main propia, sobre un objetivo revisado de ambos GY | UID y propietario conservados, control propio, posición legal, zona principal libre y restricciones pertinentes |
| Historial | Distinguir un procedimiento apropiado de una colocación inicial declarada | Los Extra admitidos deben tener historial apropiado correspondiente; la resurrección figura como Special Summon |
| Respuestas | Mechaba con coste Mágica, Roar y columnas negadas | Cartas físicas y costes trazables, pagos conservados al negar y limpieza correcta de la fuente |
| Propiedad | Revivir una carta rival y comprobar salidas por Compulsory, batalla o material | La carta vuelve a la zona de su propietario, no a la de su controlador temporal; replay desde el origen |
| Revisión de identidades | Elegir propuestas presentes y exportar una copia JSON importable | Elecciones explícitas, cantidades y zonas conservadas, contexto y Skills preservados, origen intacto y vista previa con incidencias |
| Verificación de copias | Recalcular contexto, elecciones y resultado antes de aceptar un informe | Rechazar alteraciones e invalidar una propuesta caducada; no certificar automáticamente legalidad |
| Ejemplos y regresiones | Añadir `reborn` y conservar los catorce anteriores | Pasos manuales y pruebas de fuentes y del mismo HTML compilado; conservar costes, búsqueda y replay previos |

Los monstruos con condiciones especiales, disparos o consecuencias no revisadas se excluyen de este paquete. Un texto técnico o una colocación manual en GY no acredita una historia apropiada de Invocación desde el Extra. Revivir un Fusion tampoco lo convierte en recién Invocado por Fusión: los efectos que exigen esa condición mantienen su requisito.

La copia de identidades es un resultado de revisión independiente. Mantener el passcode anterior sigue siendo una elección válida; seleccionar un candidato no resuelve por sí solo toda discrepancia de texto, disponibilidad o impresión. La herramienta conserva la baraja activa y el laboratorio. La copia puede contener incidencias de construcción que deben revisarse antes de usarla. Las evidencias específicas del passcode sustituido no se transfieren al candidato como si lo certificaran.

## Trabajo posterior

| Prioridad | Trabajo restante | Criterio de cierre |
| --- | --- | --- |
| 1 | Ampliar cartas y mecánicas | Perfiles y pruebas para condiciones de invocación, disparos y salidas adicionales; prioridad y cadenas generales, SEGOC, Damage Step, Flip, ataques múltiples y Pendulum |
| 2 | Más continuaciones bajo incertidumbre | Otros robos, varios eventos de azar y políticas rivales con pesos conservados, testigos verificables y masa no explorada explícita |
| 3 | Resolver incidencias técnicas | Fuentes y revisión de identidades heredadas, estadísticas desconocidas y propuestas; preservar passcodes y procedencia y comprobar las copias seleccionadas |
| 4 | Completar documentos y formatos | Reglamento y rulings restantes, disponibilidad y pools históricos/digitales, Skills, desbloqueos, Legend e impresión/evento con contexto propio |
| 5 | Validar métricas competitivas | Resultados externos reales con formato, banlist, fechas y procedencia, separando ajuste y validación; el importador ya está preparado |
| 6 | Ampliar aceptación física y mantenimiento | Dispositivos y sistemas reales, accesibilidad y evidencia renovada de build, bytes finales, descarga y CI por entrega |

Cada ampliación se cierra con sus propias pruebas y entrega. Los datos competitivos externos no son necesarios para seguir mejorando las reglas del HTML; su ausencia no se suple con ejemplos técnicos ni etiquetas ficticias de torneo.

## Datos, fuentes y pruebas que conservan sus límites

El catálogo conserva **21.986 registros**. El diagnóstico de revisión 14 identificó **98 identidades heredadas sin coincidencia técnica**, **51 monstruos con estadísticas desconocidas** y **32 propuestas de migración por nombre exacto**. La revisión de copias usa las propuestas vigentes y no convierte esos casos en migraciones globales resueltas. Cero y el marcador técnico de estadística variable «?» se distinguen de un dato ausente; no se inventan cifras.

La revisión 14 conserva su [aceptación local de 60/60 grupos](https://github.com/socramgns/MODERN/blob/97999625580fbab3b035edae25748148571cb205/evidence/validation-summary.json), con 117 archivos JavaScript comprobados, tres motores de escritorio, apertura directa offline en Firefox y 35/35 comprobaciones móviles emuladas. Su [descarga HTTP verificada](https://github.com/socramgns/MODERN/raw/97999625580fbab3b035edae25748148571cb205/Analizador_YuGiOh.html?download=1) corresponde al commit `97999625580fbab3b035edae25748148571cb205` y al SHA-256 `28e03daf44c632ad8edb358e9f216b745b332cc18643eca2e1f188213b15974d`. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40992556499) terminó correctamente para ese commit. Esa evidencia pertenece a revisión 14 y no sustituye la aceptación de los bytes nuevos.

Las capturas TCG fechadas y FAQ oficiales OCG de Mechaba mantienen sus alcances originales. No se convierten en evidencia general de Monster Reborn, todas las cadenas ni todos los formatos. La fuente CDB fijada es técnica y secundaria. Los accesos HTTP 403 anteriores están documentados en [FUENTES_OFICIALES.md](FUENTES_OFICIALES.md); no se presentan documentos no recibidos como revisados.

Las comprobaciones móviles en Chromium y WebKit emulados no acreditan teléfonos físicos ni conformidad WCAG completa. Los informes distinguen las pruebas de fuente y las tareas ejecutadas sobre los bytes compilados.

El avance se mide por capacidades y criterios de aceptación. No existe una lista cerrada y ponderada de todo el juego que permita asignar un porcentaje global fiable; el progreso de un objetivo o su intervalo hipotético tampoco es un porcentaje de terminación del proyecto.

Consulta el [estado del proyecto](ESTADO_PROYECTO.md), el [alcance de reglas y búsquedas](ALCANCE_COMBOS.md) y el [análisis histórico de revisión 14](ANALISIS_PENDIENTES_REVISION14.md).

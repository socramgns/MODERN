# Qué falta para terminar el analizador · revisión 14

El proyecto conserva catálogo, importación y edición de barajas, reglas de construcción por formato, estadísticas, probabilidades, exportaciones y un laboratorio de jugadas registradas en un único `Analizador_YuGiOh.html`. La revisión 14 amplía la continuación bajo incertidumbre, el diagnóstico de datos y la aceptación móvil emulada. Las seis familias de reglas siguen siendo parciales y la puntuación competitiva permanece **provisional**, como solicitó el usuario.

La revisión 14 pasó **60/60 grupos de pruebas en una ejecución completa** sobre el HTML final, con **117 archivos JavaScript** comprobados. Chromium, Firefox y WebKit aprobaron sus tareas; Firefox completó la apertura directa del HTML local sin conexión. Las tareas móviles se ejecutaron en Chromium y WebKit emulados, sin acreditar teléfonos físicos ni conformidad WCAG completa. Build `20eb64b21d09ad48a1ad0f1eae39864302fd2aa96bd5d37bed83a40aeffbebbf`; SHA-256 `28e03daf44c632ad8edb358e9f216b745b332cc18643eca2e1f188213b15974d`; tamaño **7,037,392 bytes**. Estos resultados se limitan a las capacidades y tareas registradas; la puntuación competitiva sigue provisional.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 14 se comprueban por separado y se registran con el commit correspondiente.

La revisión 13 conserva una [aceptación local de 56/56 grupos](https://github.com/socramgns/MODERN/blob/508e1e9b1ea7707b9e4167e663bb98feb33c4614/evidence/validation-summary.json): 55/56 en la ejecución completa y 14/14 tareas al repetir el único grupo fallido después de corregir una espera de la prueba YDK, sobre los mismos bytes. Su [descarga HTTP verificada](https://github.com/socramgns/MODERN/raw/508e1e9b1ea7707b9e4167e663bb98feb33c4614/Analizador_YuGiOh.html?download=1) corresponde al commit `508e1e9b1ea7707b9e4167e663bb98feb33c4614` y al SHA-256 `5f05c079f9a512c04e3d7978864461746e4bcb8d9cf0589440579663e6dceecb`. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40936973430) terminó correctamente para ese commit. Esa evidencia pertenece a revisión 13 y no sustituye la aceptación de los bytes nuevos.

## Capacidades y criterio de cierre de esta ampliación

| Área | Trabajo de revisión 14 | Criterio de aceptación |
| --- | --- | --- |
| Próximo robo desconocido | Analizar una rama por copia física, con peso `1/N` | Fuente reconstruida desde inicio y prefijo; Draw Phase propia elegible, rival `PASS`, orden restante desconocido y estado original intacto |
| Continuaciones | Buscar acciones propias registradas después de cada supuesto | Objetivos acreditados por testigos que se ejecutan de nuevo; presupuesto explícito y masa desconocida conservada |
| Informes | Exportar e importar el análisis separado | Rechazar cambios de identidad, peso, contexto, estados, pagos o resumen, sin sustituir la partida real |
| Datos | Derivar incidencias y propuestas vigentes | Conteos comprobables, procedencia e identidades preservadas, sin migraciones ni estadísticas inventadas |
| Uso móvil | Comprobar pantallas y accesibilidad en emulación | Informes ligados a los bytes, con motores y tamaños ejecutados y límites de emulación explícitos |
| Ejemplos y regresiones | Añadir `shuffle` y conservar los trece anteriores | Prefijo ejecutado manualmente, análisis hipotético identificado, funciones anteriores comprobadas en el mismo HTML |

Una rama sin testigo no demuestra fracaso. Si se alcanza un límite o aparece un próximo robo no cubierto, su peso sigue desconocido. La masa con objetivo demostrado describe continuaciones posibles dentro de las reglas y la política admitidas; no permite elegir el robo favorable ni acredita una tasa de victoria. Un objetivo alcanzado al propio robo puede tener cero acciones posteriores, manteniendo explícita la transición supuesta.

El análisis nuevo no recibe un orden inventado para el Deck restante y no transforma una semilla en una observación. El replay normal conserva sus requisitos; las hipótesis tienen un verificador y un informe propios. Las partidas, datos y decisiones del usuario se conservan al inspeccionar o importar ese informe.

## Trabajo posterior

| Prioridad | Trabajo restante | Criterio de cierre |
| --- | --- | --- |
| 1 | Ampliar continuaciones bajo incertidumbre | Otros robos, varios eventos de azar y políticas rivales con pesos conservados, testigos verificables y masa no explorada explícita |
| 2 | Más cartas y mecánicas | Perfiles revisados y aceptación para más efectos, prioridad y cadenas generales, SEGOC, Damage Step, Flip, ataques múltiples y Pendulum |
| 3 | Resolver incidencias técnicas | Fuentes y revisión explícita para identidades heredadas, estadísticas desconocidas y propuestas; preservar passcodes y procedencia |
| 4 | Completar documentos y formatos | Reglamento y rulings restantes, disponibilidad y pools históricos/digitales, Skills, desbloqueos, Legend e impresión/evento con contexto independiente |
| 5 | Validar métricas competitivas | Resultados externos reales con formato, banlist, fechas y procedencia, separando datos de ajuste y de validación; el importador ya está preparado |
| 6 | Ampliar aceptación física y mantenimiento | Dispositivos y sistemas reales, accesibilidad y evidencia renovada de build, bytes finales, descarga y CI por entrega |

Cada ampliación se cierra con sus propias pruebas y entrega. Los datos competitivos externos no son necesarios para seguir mejorando las reglas del HTML, y su ausencia no se suple con ejemplos técnicos o etiquetas ficticias de torneo.

## Datos, fuentes y pruebas que conservan sus límites

El catálogo conserva **21.986 registros**. En los datos de partida había **98 identidades heredadas clasificadas**, **51 monstruos con estadísticas desconocidas** y **32 propuestas de migración por nombre exacto**. El nuevo diagnóstico deriva las incidencias del catálogo vigente; mostrarlas no equivale a haberlas resuelto ni a implementar sus efectos. Cero es una estadística válida cuando la fuente la conoce; una cifra desconocida no se completa por aproximación.

Las capturas TCG fechadas y las FAQ oficiales OCG de Mechaba mantienen sus alcances originales. No se convierten en evidencia general de las nuevas hipótesis, todos los efectos o todos los formatos. La fuente CDB fijada es técnica y secundaria. Los accesos HTTP 403 anteriores están documentados en [FUENTES_OFICIALES.md](FUENTES_OFICIALES.md); no se presentan documentos no recibidos como revisados.

Las comprobaciones móviles en Chromium o WebKit emulados no acreditan teléfonos físicos. La aceptación local, la descarga y GitHub Actions se identifican por build y commit; sus resultados se observan por separado. El número previsto de suites o una entrada en la interfaz no sustituye la ejecución de sus pruebas.

El avance se mide por capacidades y criterios de aceptación. No existe una lista cerrada y ponderada de todo el juego que permita asignar un porcentaje global fiable; el progreso de un objetivo o su intervalo hipotético tampoco es un porcentaje de terminación del proyecto.

Consulta el [estado del proyecto](ESTADO_PROYECTO.md), el [alcance de reglas y búsquedas](ALCANCE_COMBOS.md) y el [análisis histórico de revisión 13](ANALISIS_PENDIENTES_REVISION13.md).

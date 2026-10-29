# Qué falta para terminar el analizador · revisión 13

El analizador ya conserva catálogo, importación y edición de barajas, reglas de construcción por formato, estadísticas, probabilidades, exportaciones y un laboratorio de jugadas registradas en un único `Analizador_YuGiOh.html`. Todavía no cubre todas las cartas y reglas de Yu-Gi-Oh. La puntuación competitiva permanece **provisional**, como solicitó el usuario.

La revisión 13 obtuvo aceptación local de **56/56 grupos** sobre el HTML final. La primera ejecución completa aprobó **55/56**: la prueba de exportación YDK podía comparar una baraja antes de terminar su importación. Se corrigió la espera de la prueba y se repitió la suite completa de entrega, con **14/14 tareas aprobadas sobre los mismos bytes**, sin modificar la aplicación. Se comprobó la sintaxis de **114 archivos JavaScript**, Chromium, Firefox y WebKit, y la apertura directa del HTML local sin conexión en Firefox. Build `62d595ef64824400782f54808fd32e70a9b2fcb21ef98ba2aeaec753c41ec79a`; SHA-256 `5f05c079f9a512c04e3d7978864461746e4bcb8d9cf0589440579663e6dceecb`; tamaño **6,989,766 bytes**. Los informes conservan el intento inicial y la repetición; la aceptación se limita al alcance registrado.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 13 se comprueban por separado y se registran con el commit correspondiente.

La revisión 12 conserva una [aceptación local de 54/54 grupos](https://github.com/socramgns/MODERN/blob/f538b8002106b4e0a9244e39fc3d82aecb8de78e/evidence/validation-summary.json), con 114 archivos JavaScript comprobados, Chromium, Firefox y WebKit y apertura directa del HTML sin conexión en Firefox. Su descarga HTTP fue cotejada con los bytes aceptados y su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40822517564) terminó **correctamente** para el commit `f538b8002106b4e0a9244e39fc3d82aecb8de78e`. Esta evidencia pertenece a revisión 12 y no sustituye la aceptación de los bytes nuevos.

## Cierre concreto de la revisión 13

Esta ampliación añade Compulsory Evacuation Device como segunda Trampa Normal registrada, con su fuente física colocada desde un turno anterior. El criterio de aceptación exige comprobar las siguientes capacidades en el HTML compilado:

1. Ofrecer la activación solo en una ventana admitida, con columna, jugador, origen y objetivo válidos. La excepción de activar desde mano sigue perteneciendo a Impermanence; una colocación del turno actual no sirve para Compulsory.
2. Devolver los monstruos admitidos del Main a la mano de su propietario y los Fusion/Synchro/Link admitidos al Extra oculto de su propietario. Los Tokens registrados deben dejar de existir sin tratar su salida como destrucción.
3. Conservar los costes reales y límites de Mechaba y Roar, incluidas las contrarrespuestas acotadas y la negación previa de columna. Una activación negada no aplica la devolución ni reembolsa pagos.
4. Mantener la diferencia entre devolver y destruir: Spark no impide el retorno, Balelynx no paga por reemplazarlo y Mirrorjade oculto en el Extra no crea una nueva destrucción diferida. Un retorno campo→mano no abre por sí mismo una ventana de Droll.
5. Retirar marcas de la instancia de campo y el historial de Invocación apropiada al volver a una zona oculta, conservando UID, propietario, presupuestos globales del turno, restricciones e historia del Extra pertinente.
6. Ejecutar el ejemplo `evacuation`, deshacer y reanudar informes con replay nuevo, conservar los doce ejemplos anteriores y comprobar que el objetivo distingue mano y Extra.
7. Compilar el único HTML, aprobar las suites sobre esos mismos bytes y cotejar entrega, descarga y CI de esta revisión por separado.

La redirección registrada de Spinny que fue revivido se respeta: su salida lo destierra en lugar de devolverlo a la mano. La traza conserva el destino solicitado y el real; otras redirecciones sin revisar permanecen excluidas.

Las suites añadidas al runner deben existir y aprobar antes de cerrar la aceptación. Ni una etiqueta de interfaz, ni una entrada en el catálogo, ni el número de grupos previstos constituyen por sí solos una capacidad verificada. Los campos iniciales siguen declarados; el replay verifica las transiciones posteriores.

## Trabajo restante para ampliar el proyecto

| Prioridad | Trabajo pendiente | Criterio de cierre |
| --- | --- | --- |
| 1 | Más efectos, objetivos y activaciones | Perfiles revisados por carta, ventanas, velocidades, costes, usos, destinos y replay; ampliar las seis familias parciales y las Trampas/Mágicas admitidas |
| 2 | Continuar después de barajar | Ramas y pesos probabilísticos explícitos para orden desconocido, sin presentar robos hipotéticos como observados ni búsquedas incompletas como derrota |
| 3 | Completar mecánicas generales | Modelos y aceptación propios para prioridad, cadenas generales, SEGOC, Damage Step, Flip, ataques múltiples y Pendulum |
| 4 | Completar documentos, datos y formatos | Reglamento, rulings y disponibilidad con fuentes; pools históricos/digitales, Skills, desbloqueos, Legend e impresión/evento con contexto independiente |
| 5 | Validar métricas competitivas | Barajas y resultados externos reales con formato, banlist, fechas y procedencia, separados entre ajuste y validación; el importador ya está preparado |
| 6 | Ampliar aceptación y mantenimiento | Más dispositivos y sistemas, accesibilidad y evidencia renovada de compilación, bytes finales, descarga y CI por entrega |

Cada ampliación se cierra con sus pruebas y entrega verificadas. Las demás filas describen ampliaciones independientes; no es necesario esperar a datos competitivos para mejorar las reglas del HTML.

El cálculo de acceso a cartas tras un barajado uniforme ya existe; no modifica el estado ni continúa jugadas. Falta conectar esa distribución con continuaciones hipotéticas ponderadas, diferenciando azar y decisiones. Un primer cierre acotado podría analizar un próximo robo de turno, conservar las copias y el orden restante desconocido, verificar cada hipótesis y declarar la masa no explorada; no permitiría escoger el robo favorable ni medir una tasa de victoria.

## Datos y evidencia que siguen pendientes

El catálogo conserva **21.986 registros**; reconocer esas identidades no equivale a implementar sus efectos. Hay **98 identidades heredadas clasificadas**, **32 propuestas de migración por nombre exacto** y **51 monstruos heredados con estadísticas desconocidas**. Revisarlas requiere preservar procedencia y passcodes, sin reemplazar cartas por una aproximación del nombre.

Las capturas TCG fechadas acreditan el contraste realizado de fecha, nombres y límites. Las tres FAQ oficiales OCG de Mechaba documentan casos concretos de monstruos y su lugar de activación. No certifican por sí solas las reglas nuevas de Trampa, los retornos ocultos, el reemplazo de Mágicas de Campo ni todos los rulings TCG. La fuente CDB fijada sigue siendo técnica y secundaria. Los accesos HTTP 403 anteriores al PDF/FAQ están documentados en [FUENTES_OFICIALES.md](FUENTES_OFICIALES.md); no se presentan documentos no recibidos como fuentes revisadas.

El avance se mide por capacidades y criterios de aceptación de cada entrega. No hay una lista cerrada y ponderada de todo el juego que permita asignar un porcentaje global fiable. El progreso del objetivo dentro de una jugada tampoco es un porcentaje de terminación del proyecto ni una probabilidad de ganar.

Consulta el [estado del proyecto](ESTADO_PROYECTO.md), el [alcance de las reglas y búsquedas](ALCANCE_COMBOS.md) y el [análisis histórico de revisión 12](ANALISIS_PENDIENTES_REVISION12.md).

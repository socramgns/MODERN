# Qué falta para terminar el analizador · revisión 12

La entrega sigue siendo un único `Analizador_YuGiOh.html`, con catálogo, importación y edición de barajas, estadísticas, probabilidades, exportaciones y un laboratorio de jugadas registradas. La puntuación competitiva permanece **provisional**, como solicitó el usuario.

La revisión 12 pasó **54/54 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `937c9e64aa9594ce8d60ad5fadf8fc66f8f220b7420461576f76f45ed700e247`; SHA-256 `73182845a1d7e2ede4496b50f04009f68dfeb9db7f1b1bc4c6fa9fdb68805007`; tamaño **6,981,312 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 12 se comprueban por separado y se registran con el commit correspondiente.

La revisión 11 conserva una [aceptación local de 52/52 grupos](https://github.com/socramgns/MODERN/blob/9d177f20094c6697ae5cc5a26f4f2c1c789ee66d/evidence/validation-summary.json), aprobados en una ejecución completa sobre el mismo HTML. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40741033245) terminó **correctamente** para el commit `9d177f20094c6697ae5cc5a26f4f2c1c789ee66d`. Esa evidencia corresponde a revisión 11 y no sustituye la comprobación de los bytes nuevos.

## Avance de esta revisión

- Registra `ACTIVATE_INFINITE_IMPERMANENCE` (10045474) como activación de una Trampa Normal de Velocidad 2, desde mano sin cartas controladas o desde una colocación de un turno anterior.
- Conserva copia, origen, columna y objetivo antes de las respuestas. Negar su activación no devuelve los costes de Mechaba ni aplica la negación del monstruo o de la columna.
- Mechaba puede enviar una Trampa física admitida de su mano al GY para responder a ese paquete; Roar conserva sus respuestas y contrarrespuestas de Velocidad 3 dentro de la cadena acotada.
- La negación de columna solo se aplica si Impermanence estaba colocada antes de activarse, sigue en el campo al resolver y se resuelve la negación de su objetivo. Si el objetivo ya no está, no se añade esa negación de columna.
- Conserva el seguimiento de objetivos y añade un duodécimo ejemplo guiado, manteniendo los once identificadores anteriores, los 21.986 registros y las seis familias parciales.

La activación directa distingue una Trampa Normal de Velocidad 2 de la Counter Trap Roar de Velocidad 3. La nueva capacidad se limita a Impermanence; no habilita todos los efectos de Trampas ni todas las cadenas. Mechaba conserva su coste físico correspondiente y las negaciones no devuelven los pagos. Los campos iniciales siguen declarados, y el replay verifica las transiciones posteriores.

El seguimiento describe los requisitos del objetivo, no un porcentaje de terminación del proyecto ni una probabilidad de ganar. Completar la búsqueda de Invocation en la guía no acredita un resultado competitivo. El catálogo y las capturas documentales mantienen sus propios alcances.

El proveedor de respuesta de Impermanence conserva sus ventanas y añade la corrección de bloqueos de columna anteriores: una respuesta colocada en una columna ya negada se activa y termina en el GY, pero no niega el efecto del monstruo ni añade otro bloqueo. Desde mano, la respuesta elige de forma determinista la primera columna no bloqueada, o la primera si las cinco están bloqueadas; en este último caso su efecto también queda negado. La activación directa mantiene sus cinco elecciones explícitas de columna.

Una columna ya negada también anula el efecto de Roar, incluida su contrarrespuesta de Velocidad 3. La carta se activa y consume su uso; al resolver no niega ni destruye el eslabón anterior, y termina en el destino registrado. Otra Counter Trap admitida todavía puede negar esa activación.

## Trabajo restante y criterio de cierre

| Prioridad | Trabajo pendiente | Criterio de cierre |
| --- | --- | --- |
| 1 | Ampliar efectos y activaciones registradas | Otras Trampas de Velocidad 2, Mágicas de Campo y rutas con ventanas, velocidades, costes, objetivos, usos, destinos y replay revisados |
| 2 | Continuar tras barajar con orden desconocido | Ramas y pesos probabilísticos explícitos, sin presentar robos hipotéticos como observados ni búsquedas incompletas como derrota |
| 3 | Ampliar mecánicas generales | Modelos y aceptación propios para prioridad, SEGOC, Damage Step, Flip, ataques múltiples y Pendulum |
| 4 | Completar documentos, datos y formatos | Reglamento, rulings y disponibilidad con fuentes; pools históricos/digitales, Skills, desbloqueos, Legend e impresión/evento con contexto independiente |
| 5 | Validar métricas competitivas | Barajas y resultados externos reales con formato, banlist, fechas y procedencia, separados entre ajuste y validación; el importador está preparado |
| 6 | Ampliar aceptación y mantenimiento | Más dispositivos y sistemas, accesibilidad, evidencia renovada de los bytes finales y descarga y CI observados por revisión |

El catálogo conserva 98 identidades heredadas clasificadas, 32 propuestas de migración y 51 monstruos heredados sin estadísticas conocidas. Revisarlas exige preservar procedencia y passcodes; no equivale a implementar sus efectos.

Las FAQ OCG conservadas documentan casos de monstruos y su lugar de activación. No certifican por sí solas las reglas nuevas de Trampa, el reemplazo de Mágicas de Campo ni todo el TCG. Los intentos anteriores de consulta del PDF/FAQ de Campo recibieron HTTP 403 y están documentados en [FUENTES_OFICIALES.md](FUENTES_OFICIALES.md). No se atribuye una captura oficial nueva a la fuente técnica CDB.

El avance se mide por capacidades registradas y criterios de aceptación de cada entrega, sin asignar un porcentaje global a simular todas las cartas y reglas. Consulta el [estado del proyecto](ESTADO_PROYECTO.md) y el [alcance de los combos](ALCANCE_COMBOS.md). El [análisis de revisión 11](ANALISIS_PENDIENTES_REVISION11.md) se conserva como antecedente ligado a su propio resultado.

# Qué falta para terminar el analizador

El proyecto ya ofrece una entrega de un único `Analizador_YuGiOh.html`, con catálogo, importación y edición de barajas, estadísticas, probabilidades, exportaciones y un laboratorio de jugadas registradas. La revisión 6 tiene una aceptación documentada de **41/41 grupos de pruebas**, comprobaciones en Chromium, Firefox y WebKit, apertura local offline en Firefox y CI remoto aprobado. Esa [evidencia histórica](https://github.com/socramgns/MODERN/blob/acb9e81573b43318041fc7ab57500dc1f97adc11/evidence/validation-summary.json) pertenece a su build `a214f91b5554fb95b64a72cce9a1729eab468b9729229d97494980688b3de119` y su SHA-256 `9fb3b88702cd55655125975be8acba7340545619312e3242723908866957ea37`.

La revisión 7 pasó **44/44 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `9361b6748958d6adfd53f3c0efdcfb54a1115df58d9e8f37e142884fbf90142b`; SHA-256 `928bd2c76835e8ab75ef15ae58d288c6dc3a5dfcdcb384152b5ad2c0cec3fa6e`. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la comprobación de descarga y la ejecución remota de GitHub Actions se registran por separado; la aceptación local no acredita por sí sola esos pasos. El estado de aceptación se mantiene en [ESTADO_PROYECTO.md](ESTADO_PROYECTO.md).

## Qué añade la revisión 7

- Mechaba reconoce **trece paquetes explícitos** de efectos de monstruos activados en mano o Cementerio, además de las respuestas de campo y Mágicas Normales ya registradas. Captura el lugar de activación antes de costes y conserva los destinos pagados: Ashuna desterrada o Spinny descartado no se destierran de nuevo desde otra zona.
- Longyuan conserva costes y límites de uso al negarse sus activaciones; una activación de mano negada no produce invocación ni Token, y su disparo GY negado no causa daño. Spirit Dragon reconoce también ese disparo individual del Cementerio.
- Se incorporan **ocho ejemplos guiados** dentro del HTML, con copias físicas y pasos que el usuario ejecuta: Invoked, Spark, Spirit, Swordsoul, Branded, Tenyi, Salamangreat y Roar. El campo inicial sigue siendo una declaración del escenario.
- Tres FAQ oficiales **OCG en japonés** respaldan el criterio de Mechaba con documentos y citas fijados por hash. Sirven como referencias del criterio modelado; no certifican todos los rulings TCG.

El registro de Mechaba mantiene límites: excluye Crow y Droll desde mano, efectos GY de Mágicas/Trampas, activaciones de Field Spells y Trampas, paquetes no registrados y la cadena conjunta Chixiao/Mo Ye. Las zonas e identidades concretas están en [ALCANCE_COMBOS.md](ALCANCE_COMBOS.md). Reconocer una carta en el catálogo no implica tener implementados todos sus efectos.

La exclusión de los efectos de Mágicas/Trampas activados en el Cementerio respeta el alcance de Mechaba: activar ese efecto no equivale a activar una carta Mágica/Trampa. No se debe convertir esa exclusión en una respuesta ilegal al ampliar el registro.

El catálogo conserva 98 identidades heredadas clasificadas y 32 propuestas de migración por nombre exacto para revisar; 51 monstruos heredados no tienen estadísticas conocidas. Deben resolverse según su procedencia, sin cambiar passcodes ni inventar estadísticas. Esto es trabajo de datos separado de implementar efectos.

## Prioridades para continuar después de esta entrega

| Prioridad | Qué falta | Criterio de cierre |
| --- | --- | --- |
| 1 | Ampliar efectos y cadenas registrados | Cada nuevo paquete necesita ventanas, costes físicos, destinos, límites de uso, respuestas y replay; los desconocidos conservan un resultado explícito fuera de alcance |
| 2 | Continuar después de robos de orden desconocido | Introducir ramas probabilísticas con supuestos y pesos explícitos, sin tratar un robo posible como observado ni convertir una búsqueda incompleta en derrota |
| 3 | Extender mecánicas generales | Prioridad, SEGOC, Damage Step, Flip, ataques múltiples y Pendulum requieren modelos y aceptación específicos; las cadenas acotadas actuales no sustituyen ese trabajo |
| 4 | Completar datos y reglas por formato | Aportar disponibilidad y pools oficiales, datos históricos/digitales, Skills, desbloqueos, Legend e impresión/evento, con contexto independiente de la tabla TCG incorporada |
| 5 | Validar las métricas competitivas | Incorporar barajas y resultados externos reales con formato, lista y procedencia; separar ajuste y validación. El importador ya está preparado y la puntuación permanece provisional por decisión del usuario |
| 6 | Ampliar aceptación de uso y mantenimiento | Renovar la batería con cada cambio, conservar fuente reproducible y comprobar más dispositivos, sistemas y tareas de accesibilidad |

La lista oficial TCG fechada y las tres FAQ de Mechaba tienen evidencia específica. Siguen pendientes la revisión completa del reglamento, los rulings restantes y la disponibilidad oficial; los rechazos HTTP históricos no significan que todas las fuentes estén actualmente inaccesibles. Consulta [FUENTES_OFICIALES.md](FUENTES_OFICIALES.md).

La siguiente ampliación acotada puede centrarse en las respuestas de Mechaba a Crow/Droll desde mano y a activaciones de cartas Trampa o Field Spell registradas. Antes de incorporarlas hay que revisar sus costes, usos, cambios de zona y contrarrespuestas; ampliar la lista de identidades por sí solo no completa esas reglas.

## Cómo medir el avance

No hay un porcentaje global defendible mientras «terminar» signifique simular cualquier baraja y todas las reglas de Yu-Gi-Oh. El catálogo total, el número de handlers y los grupos de pruebas miden cosas diferentes y no se suman como cobertura del juego.

El avance se puede medir por entregas con criterios cerrados: qué rutas se admiten, qué escenarios se reproducen, qué documentos se cotejaron y qué tareas pasan sobre el HTML final. La entrega sigue siendo un solo archivo HTML; el trabajo de fuente, pruebas y CI permite ampliar ese archivo sin exigir al usuario instalar herramientas para usarlo.

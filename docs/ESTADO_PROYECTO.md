# Estado de la revisión 8

La aplicación se entrega como un único `Analizador_YuGiOh.html`. El original y las revisiones previas se conservan. La puntuación permanece estructural y provisional por decisión del usuario.

La tabla describe la implementación de revisión 8 aceptada localmente. Los resultados de distribución y CI remoto se consultan por separado; cada aceptación identifica sus propios bytes.

| Área | Trabajo de esta revisión | Alcance |
| --- | --- | --- |
| Catálogo | Conserva 21.986 registros y los 14.759 passcodes de la fuente técnica principal fijada | Las identidades, alias y datos técnicos no equivalen a disponibilidad oficial ni a todos los efectos implementados |
| Identidad | Conserva IDs anteriores y procedencia | 98 registros heredados clasificados y 32 migraciones propuestas para revisar, sin sustituciones silenciosas |
| Lista TCG | Conserva el cotejo oficial de la publicación del 19/10/2026: 255 nombres y límites | No acredita pools, passcodes, todos los rulings ni vigencia posterior |
| Mechaba | Quince paquetes de monstruos en mano/GY: los trece anteriores más `DD_CROW_BANISH` y `DROLL_LOCK` | Registro explícito de UID, jugador, identidad y origen antes de costes; no infiere reglas del catálogo |
| Costes y objetivos | Crow descarta, Droll envía al GY y Mechaba envía un monstruo físico; Crow registra su objetivo antes de resolver | La negación conserva pagos y no destierra de nuevo fuentes que abandonaron su lugar de activación |
| Límites | Crow/Droll usan `NONE`, sin contador de una vez por turno inventado | Una nueva activación requiere ventana admitida y copia disponible; las cantidades de construcción siguen vigentes, con Droll limitada a una en el snapshot TCG actual |
| Droll | La oportunidad anterior termina al cerrar la cadena, aunque se niegue Droll; un nuevo evento registrado elegible abre otra | No representa prioridad arbitraria ni Droll como contrarrespuesta general dentro de cualquier cadena |
| Cadenas | Conserva Mechaba/Roar y contrarrespuestas acotadas con costes, velocidad, LIFO y replay | Field Spells y Trampas de Velocidad 2 permanecen pendientes; Mechaba no responde a Roar de Velocidad 3 |
| Laboratorio | Incluye diez ejemplos, conservando los ocho anteriores | Los dos nuevos muestran Crow/Mechaba y Droll tras una búsqueda; campo inicial declarado y pasos manuales, comprobados dentro del alcance registrado |
| Referencias | Conserva las tres FAQ oficiales OCG en japonés sobre el lugar de activación de Mechaba | Su alcance documental no se convierte en certificación integral TCG |
| Robo y búsqueda | Conserva distribuciones condicionadas y límites explícitos de exploración | No inventa robos desconocidos, derrota ni optimalidad global |
| CI | Instalación separada, caché de navegadores por requisitos y sistema, pasos con presupuestos propios | Dependencias de sistema siempre comprobadas; el resultado remoto se consulta por separado y la configuración no equivale a una ejecución aprobada |

## Aceptación local de la revisión 8

La revisión 8 pasó **46/46 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `d7c220eb32a7876a39fb6caaeee7bbde7ee96bde1fe5353672ed44e2369f9d6b`; SHA-256 `aa5e34480df69200c7355daf8fdbc589b584cd276d890ab22977867a9ea3aeca`; tamaño **6.940.108 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la comprobación de descarga HTTP y la ejecución remota de GitHub Actions se registran por separado; la aceptación local no acredita por sí sola esos pasos.

`dist/validation-summary.json` identifica esta aceptación local de revisión 8. En la rama de entrega, `evidence/validation-summary.json` debe conservar los mismos identificadores. La [evidencia histórica de revisión 7](https://github.com/socramgns/MODERN/blob/719897b2f9880507b15068c4a5ca9e1a3a02d038/evidence/validation-summary.json) se consulta en su commit, sin atribuir los informes antiguos a los bytes nuevos.

## Antecedente: aceptación local y CI de revisión 7

La revisión 7 tiene una [aceptación local documentada de 44/44 grupos](https://github.com/socramgns/MODERN/blob/719897b2f9880507b15068c4a5ca9e1a3a02d038/evidence/validation-summary.json), con 114 archivos JavaScript comprobados, Chromium, Firefox y WebKit y apertura directa offline en Firefox. La ejecución inicial aprobó 43 grupos; el flujo de contexto pasó sus 18 comprobaciones al repetirse después de ajustar un selector de la prueba al panel anidado, sin cambiar la aplicación ni el HTML. La evidencia conserva ambos intentos.

Build `9361b6748958d6adfd53f3c0efdcfb54a1115df58d9e8f37e142884fbf90142b`; SHA-256 `928bd2c76835e8ab75ef15ae58d288c6dc3a5dfcdcb384152b5ad2c0cec3fa6e`. Estos identificadores pertenecen exclusivamente a revisión 7.

La [ejecución remota de revisión 7](https://github.com/socramgns/MODERN/actions/runs/40558997215/job/122382622102) terminó **cancelada** al superar 30 minutos durante «Instalar herramientas de comprobación», antes de ejecutar las pruebas del analizador. No es un CI aprobado ni demuestra un fallo de reglas de la aplicación. La revisión 8 separa las etapas de instalación y añade caché; su resultado remoto debe consultarse por separado.

Chromium conserva una restricción administrativa de navegación `file:` en este entorno. La aceptación directa offline de revisión 7 fue en Firefox. WebKit tiene una limitación documentada de emulación offline local; sus resultados de compatibilidad no se presentan como prueba de todas las combinaciones de navegador y sistema.

## Pendientes que conservan su alcance explícito

- Más efectos y familias, prioridad/cadenas generales, SEGOC, Damage Step, Flip, múltiples ataques y Pendulum.
- Field Spells y activaciones de Trampas de Velocidad 2 registradas, respetando que una Counter Trap de Velocidad 3 no admite respuesta de Mechaba.
- Decisiones adversariales óptimas, metajuego y predicción de resultados competitivos.
- Disponibilidad y datos históricos/digitales por formato, Skills, desbloqueos, Legend e impresión/evento.
- Continuación probabilística completa después de barajar sin convertir un robo hipotético en observado.
- Datos competitivos externos reales. El importador existe y la puntuación se mantiene provisional.
- Pruebas en más dispositivos y sistemas reales.

El análisis actual está en [ANALISIS_PENDIENTES_REVISION8.md](ANALISIS_PENDIENTES_REVISION8.md). Los análisis de revisiones anteriores se conservan como antecedentes; sus puntos resueltos no se trasladan automáticamente al estado actual.

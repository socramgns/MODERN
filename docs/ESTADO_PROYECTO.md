# Estado de la revisión 14

La aplicación se entrega como un único `Analizador_YuGiOh.html`. El original y las entregas anteriores se conservan; la puntuación permanece estructural y provisional por decisión del usuario.

La revisión 14 pasó **60/60 grupos de pruebas en una ejecución completa** sobre el HTML final, con **117 archivos JavaScript** comprobados. Chromium, Firefox y WebKit aprobaron sus tareas; Firefox completó la apertura directa del HTML local sin conexión. Las tareas móviles se ejecutaron en Chromium y WebKit emulados, sin acreditar teléfonos físicos ni conformidad WCAG completa. Build `20eb64b21d09ad48a1ad0f1eae39864302fd2aa96bd5d37bed83a40aeffbebbf`; SHA-256 `28e03daf44c632ad8edb358e9f216b745b332cc18643eca2e1f188213b15974d`; tamaño **7,037,392 bytes**. Estos resultados se limitan a las capacidades y tareas registradas; la puntuación competitiva sigue provisional.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 14 se comprueban por separado y se registran con el commit correspondiente.

| Área | Implementación de esta revisión | Alcance |
| --- | --- | --- |
| Continuación tras barajar | Ramas hipotéticas por copia física del próximo robo propio | Draw Phase, turno posterior al primero, orden desconocido, rival `PASS`; el resto del Deck conserva orden desconocido |
| Pesos y objetivos | Peso exacto `1/N` y testigos de continuación registrados | Distingue azar y decisiones; solo la parte demostrada aporta al límite inferior del objetivo |
| Incertidumbre | Conserva la masa no explorada o sin demostración | Un presupuesto alcanzado, segundo robo no cubierto o regla desconocida no equivalen a derrota |
| Verificación e informes | Reconstruye prefijo, hipótesis y pasos posteriores; exportación/importación JSON | Rechaza alteraciones de copia, peso, contexto y evidencia; no sustituye la partida del laboratorio |
| Calidad de datos | Informe derivado de incidencias y propuestas vigentes | Conserva passcodes y procedencia, sin completar estadísticas por conjetura ni aplicar migraciones automáticas |
| Accesibilidad y pantallas móviles | Comprobaciones de emulación en motores y tamaños registrados | La aceptación pertenece a las tareas ejecutadas; no acredita teléfonos físicos ni todos los sistemas |
| Laboratorio y ejemplos | Catorce ejemplos, con `shuffle` y los trece anteriores | Prefijos iniciales declarados y pasos ejecutados manualmente; las hipótesis quedan separadas |
| Rutas conservadas | Seis familias parciales, Spark, Spirit y respuestas registradas | Quince paquetes de monstruos fuera del campo, tres Mágicas Normales, dos Mágicas de Campo y dos Trampas Normales; no equivale al juego completo |
| Catálogo y contexto | Conserva 21.986 registros y snapshot TCG del 19/10/2026 | Los datos técnicos y la captura fechada no acreditan todos los efectos ni disponibilidad oficial |
| Calibración | Importador preparado y puntuación provisional | Requiere resultados externos reales para validarla; no bloquea las mejoras del HTML |

## Aceptación y antecedentes

Los informes del build y del HTML probado distinguen pruebas de fuentes, tareas sobre los bytes compilados, emulación móvil, descarga y CI. Declarar una suite o su número previsto no acredita su aprobación. Los campos iniciales siguen siendo supuestos; el replay comprueba las transiciones posteriores y el verificador de hipótesis declara su robo supuesto.

La revisión 13 conserva una [aceptación local de 56/56 grupos](https://github.com/socramgns/MODERN/blob/508e1e9b1ea7707b9e4167e663bb98feb33c4614/evidence/validation-summary.json): 55/56 en la ejecución completa y 14/14 tareas al repetir el único grupo fallido después de corregir una espera de la prueba YDK, sobre los mismos bytes. Su [descarga HTTP verificada](https://github.com/socramgns/MODERN/raw/508e1e9b1ea7707b9e4167e663bb98feb33c4614/Analizador_YuGiOh.html?download=1) corresponde al commit `508e1e9b1ea7707b9e4167e663bb98feb33c4614` y al SHA-256 `5f05c079f9a512c04e3d7978864461746e4bcb8d9cf0589440579663e6dceecb`. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40936973430) terminó correctamente para ese commit. Esa evidencia pertenece a revisión 13 y no sustituye la aceptación de los bytes nuevos.

Chromium mantiene una restricción administrativa de navegación local en este entorno. Firefox permite comprobar la apertura directa offline; WebKit conserva una limitación de emulación offline local. Esas limitaciones se separan de las tareas ejecutadas en cada informe.

## Trabajo posterior

- Ampliar la continuación hipotética a otros robos, varios eventos de azar y políticas rivales, conservando pesos y masa desconocida.
- Más efectos y perfiles de salida revisados; las seis familias conservan cobertura parcial.
- Prioridad, cadenas generales, SEGOC, Damage Step, Flip, ataques múltiples y Pendulum.
- Resolver incidencias técnicas con fuentes y revisión explícita de identidades, estadísticas y propuestas.
- Completar disponibilidad, pools, reglas históricos/digitales, Skills, desbloqueos, Legend e impresión/evento.
- Revisar reglamento y rulings restantes, y ampliar aceptación en dispositivos y sistemas físicos.
- Validar métricas competitivas con resultados reales, manteniendo separados ajuste y validación.

El análisis actual está en [ANALISIS_PENDIENTES_REVISION14.md](ANALISIS_PENDIENTES_REVISION14.md). Los análisis anteriores permanecen ligados a sus revisiones. La cobertura se mide por capacidades y criterios de aceptación, sin asignar un porcentaje global a todo el juego.

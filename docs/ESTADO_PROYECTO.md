# Estado de la revisión 9

La aplicación se entrega como un único `Analizador_YuGiOh.html`. El original y las entregas anteriores se conservan; la puntuación permanece estructural y provisional por decisión del usuario.

La revisión 9 pasó **48/48 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `b2e655dc990e6951cf886945774c028ac97a3e55c4f84010a1edb9942f1b0ba7`; SHA-256 `0976989809a5c2c96404149679d4806a89d13a6e3efa61c500e94da3a9793a2b`; tamaño **6.951.935 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la comprobación de descarga HTTP y la ejecución remota de GitHub Actions de revisión 9 se registran por separado; esta aceptación local no acredita por sí sola esos pasos.

| Área | Implementación aceptada localmente | Alcance |
| --- | --- | --- |
| Catálogo y lista | Conserva 21.986 registros, identidades y snapshot TCG del 19/10/2026 | Los datos técnicos no equivalen a todos los efectos ni a disponibilidad oficial |
| Mechaba | Quince paquetes de monstruos, tres Mágicas Normales y dos activaciones de Campo explícitas | UID, jugador, identidad, origen, pagos y respuestas registrados; sin inferir cartas nuevas |
| Mágicas de Campo | Mausoleum of White y Sanctuary desde mano, `SINGLE` y `NONE` | No incluye todos sus efectos ni el efecto de Mausoleum desde GY |
| Reemplazo | Field Spell anterior admitido, boca arriba o colocado, enviado a GY por regla antes de respuesta | Sin destrucción ni coste de efecto; no se restaura al negar la carta nueva |
| Zonas y columnas | Campo independiente de las cinco zonas de Mágicas/Trampas | Cinco zonas llenas no lo bloquean; la columna de Impermanence no afecta a Campo |
| Negación y cadenas | Mechaba paga Mágica y destierra la nueva carta; Roar niega y destruye sin protección como carta en campo | Contrarrespuesta que permite resolver conserva el Field nuevo, nunca devuelve el viejo; cadenas acotadas |
| Usos y duración | Normal adicional de Mausoleum y reincarnación de Sanctuary no se reinician al reemplazar copias | La ganancia de ATK ya resuelta conserva su duración al salir Mausoleum |
| Crow/Droll | Conserva costes, `NONE` y ventana de Droll que termina con la cadena | Droll limitada a una en el snapshot TCG; sin prioridad general ni repetición de una ventana vieja |
| Laboratorio | Once ejemplos incluidos, con nuevo ejemplo de activación/reemplazo de Campo | Copias físicas, campo inicial declarado y pasos manuales comprobados dentro del alcance registrado |
| Fuentes | Conserva capturas TCG de restricciones y tres FAQ OCG de casos de monstruos | Los intentos nuevos de PDF/FAQ de Campo recibieron HTTP 403; no certifican estos Field Spells |
| Mantenimiento | Conserva compilación reproducible, pruebas y CI por etapas | CI8 aprobado; CI9 exige su propia ejecución y no se presume aprobado |

## Aceptación local de la revisión 9

La batería integrada y los flujos de interfaz se comprobaron sobre los bytes finales de revisión 9. `dist/validation-summary.json`, los informes de navegador y `evidence/` identifican el build y SHA-256 aceptados. La distribución y la ejecución remota de CI se observan por separado.

## Antecedente verificado: revisión 8

La revisión 8 conserva una [aceptación local de 46/46 grupos](https://github.com/socramgns/MODERN/blob/b1a478d95020a7a718b2de0ef01b7793013058fd/evidence/validation-summary.json), con 114 archivos JavaScript comprobados, Chromium, Firefox y WebKit y apertura directa sin conexión en Firefox. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40599777991) terminó **correctamente** para el commit `b1a478d95020a7a718b2de0ef01b7793013058fd`: instalación, actualización idempotente, compilación/comparación del HTML, pruebas y comprobación entre motores aprobadas. Esta evidencia pertenece a revisión 8 y no sustituye la aceptación de revisión 9.

Build histórico `d7c220eb32a7876a39fb6caaeee7bbde7ee96bde1fe5353672ed44e2369f9d6b`; SHA-256 `aa5e34480df69200c7355daf8fdbc589b584cd276d890ab22977867a9ea3aeca`; 6.940.108 bytes. Los informes actuales de la fuente R9 no deben citarse como archivos permanentes de aquella aceptación.

Chromium mantiene una restricción administrativa de navegación local en este entorno. Firefox completó la apertura directa offline de R9; WebKit conserva una limitación de emulación offline local. Los tres motores aprobaron las comprobaciones de compatibilidad sobre los bytes de R9. Estos resultados no certifican todas las combinaciones de sistema y navegador.

## Pendientes posteriores

- Más Mágicas de Campo y perfiles de salida revisados; efectos no registrados de las dos cartas actuales y activaciones generales de Trampas de Velocidad 2.
- Prioridad, cadenas generales, SEGOC, Damage Step, Flip, ataques múltiples y Pendulum. Roar es Velocidad 3 y no admite respuesta de Mechaba de Velocidad 2.
- Continuación probabilística después de barajar, sin inventar robos observados.
- Decisiones rivales óptimas, metajuego y datos competitivos externos; el importador existe y la puntuación sigue provisional.
- Disponibilidad, pools y reglas históricos/digitales, Skills, desbloqueos, Legend e impresión/evento.
- Revisión documental del reglamento y rulings restantes, y pruebas en más dispositivos y sistemas reales.

El análisis actual está en [ANALISIS_PENDIENTES_REVISION9.md](ANALISIS_PENDIENTES_REVISION9.md). Los análisis anteriores permanecen como antecedentes, con resultados ligados a sus propias revisiones.

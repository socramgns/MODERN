# Qué falta para terminar el analizador · revisión 8

La entrega sigue siendo un único `Analizador_YuGiOh.html`, con catálogo, edición e importación de barajas, estadísticas, probabilidades, exportaciones y jugadas registradas.

La revisión 8 pasó **46/46 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `d7c220eb32a7876a39fb6caaeee7bbde7ee96bde1fe5353672ed44e2369f9d6b`; SHA-256 `aa5e34480df69200c7355daf8fdbc589b584cd276d890ab22977867a9ea3aeca`; tamaño **6.940.108 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la comprobación de descarga HTTP y la ejecución remota de GitHub Actions se registran por separado; la aceptación local no acredita por sí sola esos pasos.

`dist/validation-summary.json` identifica esta aceptación local de revisión 8. En la rama de entrega, `evidence/validation-summary.json` debe conservar los mismos identificadores. La [evidencia histórica de revisión 7](https://github.com/socramgns/MODERN/blob/719897b2f9880507b15068c4a5ca9e1a3a02d038/evidence/validation-summary.json) se consulta en su commit, sin atribuir los informes antiguos a los bytes nuevos.

La revisión 7 tiene una [aceptación local documentada de 44/44 grupos](https://github.com/socramgns/MODERN/blob/719897b2f9880507b15068c4a5ca9e1a3a02d038/evidence/validation-summary.json), con 114 archivos JavaScript comprobados, Chromium, Firefox y WebKit y apertura directa offline en Firefox. La ejecución inicial aprobó 43 grupos; el flujo de contexto pasó sus 18 comprobaciones al repetirse después de ajustar un selector de la prueba al panel anidado, sin cambiar la aplicación ni el HTML. La evidencia conserva ambos intentos.

La [ejecución remota de revisión 7](https://github.com/socramgns/MODERN/actions/runs/40558997215/job/122382622102) terminó **cancelada** al superar 30 minutos durante «Instalar herramientas de comprobación», antes de ejecutar las pruebas del analizador. No es un CI aprobado ni demuestra un fallo de reglas de la aplicación. La revisión 8 separa las etapas de instalación y añade caché; su resultado remoto debe consultarse por separado.

## Qué añade la revisión 8

- Mechaba amplía de trece a **quince paquetes explícitos** de monstruos en mano/GY con Crow y Droll desde mano. Se exige identidad, jugador, UID, zona y metadatos compatibles.
- Crow declara su objetivo antes de resolver y paga un descarte. Droll paga el envío de la mano al GY. Si Mechaba niega sus activaciones, conserva esos costes: las fuentes activaron en mano y no se destierran de nuevo desde el GY.
- Crow y Droll usan restricción `NONE`, sin añadir una vez por turno. La ventana de Droll termina con esa cadena, incluso si quedó negado. Una nueva activación requiere una nueva ventana admitida y una copia disponible; las restricciones de construcción siguen vigentes. Droll está limitada a una en el snapshot TCG actual y los ejemplos conservan ese máximo.
- El replay conserva pagos, objetivos, origen y resultados. La extensión sigue usando cadenas registradas y no añade prioridad general ni Droll como contrarrespuesta arbitraria.
- Se incluyen diez ejemplos: los ocho anteriores y dos nuevos. El de Crow declara dos Mechaba y permite proteger a Aleister en el Cementerio usando pagos físicos; el de Droll lo sitúa después de una búsqueda. Los campos previos siguen siendo supuestos declarados, sin jugadas automáticas ni etiquetas competitivas.
- El workflow separa dependencias Python, dependencias del sistema y cada navegador; usa caché ligada a requisitos/sistema y límites de tiempo concretos. El resultado de su ejecución real de revisión 8 se consulta por separado.

## Qué queda fuera

Field Spells y activaciones registradas de Trampas de Velocidad 2 siguen pendientes. Roar es Counter Trap de Velocidad 3: Mechaba, de Velocidad 2, no puede responder a su activación. Esa restricción no debe tratarse como una función que falte habilitar.

La exclusión de efectos de Mágicas/Trampas activados en el Cementerio también respeta el texto de Mechaba: activar ese efecto no equivale a activar una carta Mágica/Trampa. El paquete conjunto Chixiao/Mo Ye y los efectos no registrados siguen fuera de esta extensión.

El catálogo conserva 98 identidades heredadas clasificadas y 32 propuestas de migración por nombre exacto; 51 monstruos heredados no tienen estadísticas conocidas. Requieren revisión según su procedencia, sin inventar estadísticas ni sustituir passcodes automáticamente. Ese trabajo es distinto de implementar efectos.

## Prioridades para continuar

| Prioridad | Trabajo pendiente | Criterio de cierre |
| --- | --- | --- |
| 1 | Completar efectos y cadenas registrados, incluidas Field Spells y Trampas de Velocidad 2 admitidas | Ventana legal, velocidad, costes, objetivos, cambios de zona, usos, contrarrespuestas y replay de cada paquete |
| 2 | Continuar después de barajar con orden desconocido | Ramas y pesos probabilísticos explícitos, sin tratar un robo posible como observado ni una búsqueda incompleta como derrota |
| 3 | Ampliar mecánicas generales | Prioridad, SEGOC, Damage Step, Flip, ataques múltiples y Pendulum con modelos y aceptación propios |
| 4 | Completar datos y reglas por formato | Disponibilidad y pools oficiales, históricos/digitales, Skills, desbloqueos, Legend e impresión/evento con procedencia independiente |
| 5 | Validar métricas competitivas | Barajas y resultados externos reales, con formato, lista y procedencia, separados entre ajuste y validación; el importador ya existe y la puntuación permanece provisional |
| 6 | Ampliar aceptación y mantenimiento | Pruebas renovadas del HTML final, CI observado y más dispositivos, sistemas y tareas de accesibilidad |

La publicación TCG fechada y las tres FAQ oficiales OCG mantienen sus alcances específicos. No certifican el reglamento completo, todos los rulings TCG ni la disponibilidad de todas las cartas. Consulta [FUENTES_OFICIALES.md](FUENTES_OFICIALES.md).

## Cómo medir el avance

Se mide por entregas y criterios cerrados: rutas, ventanas, pasos reproducidos, documentos cotejados y tareas que aprueban sobre los mismos bytes. El catálogo, los handlers y los grupos de pruebas no se suman como cobertura del juego. No se asigna un porcentaje global a simular todas las barajas y reglas de Yu-Gi-Oh.

El estado de aceptación se mantiene en [ESTADO_PROYECTO.md](ESTADO_PROYECTO.md).

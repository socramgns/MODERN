# Estado de la revisión 16

La aplicación se entrega como un único `Analizador_YuGiOh.html`. El original y las entregas anteriores se conservan; la puntuación permanece estructural y provisional por decisión del usuario.

VALIDACION_R16_PENDIENTE

La aceptación local, publicación, descarga HTTP y GitHub Actions corresponden a comprobaciones distintas y se registran con su build y commit.

| Área | Implementación de esta revisión | Alcance |
| --- | --- | --- |
| Synchro de Spark | Procedimiento registrado con materiales físicos y nivel total 8 | Un Tuner y uno o más no Tuner admitidos, boca arriba; restricciones y zona libre después de retirar materiales |
| Historial ejecutado | La invocación apropiada se obtiene de una transición registrada | Un campo inicial declarado no demuestra retrospectivamente esa invocación |
| Resurrección y protección | Spark puede salir al GY, revivir con Monster Reborn y activar su protección | La llegada por Reborn es una Invocación Especial; el escudo anterior no se restaura y el nuevo cargo caduca con su turno |
| Materiales y propiedad | Conserva UID, propietario y destinos reales de los materiales admitidos | Las consecuencias revisadas se mantienen; los perfiles desconocidos no se habilitan por el texto del catálogo |
| Laboratorio y ejemplos | Dieciséis ejemplos, con `synchro` y los quince anteriores | Preparación inicial declarada y acciones posteriores ejecutadas, con replay |
| Rutas conservadas | Seis familias parciales y respuestas físicas registradas | Quince paquetes de monstruos fuera del campo, cuatro Mágicas Normales, dos Mágicas de Campo y dos Trampas Normales |
| Copias revisadas | JSON importable con identidades seleccionadas explícitamente | Conserva origen, cantidades, zonas, formato, contexto y Skills; no aplica cambios a la baraja o laboratorio activos |
| Incertidumbre y objetivos | Continuación hipotética de un próximo robo y seguimiento de requisitos | Pesos y masa desconocida explícitos; no representan una tasa de victoria ni completitud global |
| Catálogo y contexto | 21.986 registros y snapshot TCG del 19/10/2026 | Datos técnicos y captura fechada, sin acreditar todos los efectos o disponibilidad oficial |
| Calibración | Importador preparado y puntuación provisional | Requiere resultados externos reales para validarla |

## Aceptación y antecedentes

Los informes distinguen pruebas de fuentes, tareas sobre bytes compilados, emulación móvil, descarga y CI. Una suite declarada o una cantidad prevista no acredita su aprobación. La historia inicial del campo sigue siendo un supuesto; el replay reconstruye las transiciones posteriores.

La revisión 15 conserva su [aceptación local de 63/63 grupos](https://github.com/socramgns/MODERN/blob/17eeb86257ba4bca01feffeb2c10f64d38fb3fbb/evidence/validation-summary.json), con 119 archivos JavaScript comprobados, 28 tareas de la interfaz nueva, 64 casos de Monster Reborn y 22 de copias revisadas. Su [descarga HTTP verificada](https://github.com/socramgns/MODERN/raw/17eeb86257ba4bca01feffeb2c10f64d38fb3fbb/Analizador_YuGiOh.html?download=1) corresponde al commit `17eeb86257ba4bca01feffeb2c10f64d38fb3fbb` y al SHA-256 `2a4e2c76869e9fdfce9435152fd2c0b654180a0a71c1e0c082b08555c263b804`. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/41102084215) terminó correctamente para ese commit. Sus tareas móviles fueron 35/35 comprobaciones emuladas, sin acreditar hardware físico. Esa evidencia pertenece a revisión 15 y no sustituye la aceptación de los bytes nuevos.

Chromium mantiene una restricción administrativa de navegación local en este entorno. Firefox permite comprobar la apertura directa offline; los demás motores conservan sus límites específicos en los informes. Las tareas móviles emuladas no acreditan teléfonos físicos ni conformidad WCAG completa.

## Trabajo posterior

- Ampliar materiales, condiciones de invocación, disparos y perfiles de salida revisados; las seis familias conservan cobertura parcial.
- Prioridad y cadenas generales, SEGOC, Damage Step, Flip, ataques múltiples, Xyz y Pendulum.
- Otros robos y varios eventos de azar con decisiones rivales, pesos conservados y masa desconocida.
- Resolver identidades heredadas, estadísticas desconocidas y propuestas con sus fuentes y revisión explícita.
- Completar disponibilidad, pools y reglas históricos/digitales, Skills, desbloqueos, Legend e impresión/evento.
- Revisar reglamento y rulings restantes, y ampliar aceptación en dispositivos y sistemas físicos.
- Validar las métricas competitivas con resultados reales, separando ajuste y validación.

El análisis actual está en [ANALISIS_PENDIENTES_REVISION16.md](ANALISIS_PENDIENTES_REVISION16.md). Los análisis anteriores conservan su revisión y evidencia. La cobertura se mide por capacidades y criterios de aceptación, sin un porcentaje global de todo el juego.

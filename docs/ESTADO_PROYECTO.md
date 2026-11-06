# Estado de la revisión 19

La aplicación se entrega como un único Analizador_YuGiOh.html sin comprimir. Las revisiones anteriores y el original se conservan; cada ampliación cerrada genera un HTML actualizado.

VALIDACION_R19_PENDIENTE

Cuando un disparo de Wolf coincide con otra clase de disparo opcional, el subconjunto exige declinar explícitamente hasta conservar una sola clase antes de resolver; no permite representar una cadena simultánea mediante resoluciones independientes sucesivas. La selección de recuperación enumera cartas admitidas ya presentes en GY al activar y las vuelve a validar al resolver; no amplía automáticamente las opciones con cartas que entren en GY por costes de respuestas.

| Área | Trabajo de esta revisión | Alcance |
| --- | --- | --- |
| Historial de Wolf | Link ejecutado, GY y Monster Reborn | Misma copia y propietario; llegada actual Especial en Main, sólo Ataque |
| Flechas | EMZ izquierda fija por controlador | Geometría declarada para EMZ, Main 1 y Main 3, incluidos destinos del rival |
| Disparos | Llegadas reales Normales/Especiales | Ambos controladores, sin setup, Set o Damage Step ficticios |
| Recuperación FIRE | Selección no dirigida al resolver | Perfiles técnicos admitidos; destino a mano o Extra y bloqueo sólo tras llegar a mano |
| Límites | Uso por nombre y controlador | Normal/Set/Especiales comprobadas antes de costes, duración y replay |
| Magia/Trampa | Condición de Link usando Wolf | La resurrección no recupera esa habilitación; receta de dos materiales revisada |
| Laboratorio | Diecinueve ejemplos | wolf-reborn y los dieciocho anteriores; objetivos, deshacer e informes |
| Datos | 21.986 registros | 98 identidades sin cotejo, 51 monstruos con estadísticas desconocidas y 32 propuestas sin aplicar automáticamente |
| Puntuación | Importador preparado | Estructural y provisional hasta disponer de resultados reales |

Las seis familias siguen parciales. Cadenas generales, prioridad, SEGOC, elecciones simultáneas de varios disparos y Damage Step completo requieren modelos propios; los paquetes sin continuación registrada se excluyen explícitamente. Se mantienen los perfiles de campo y movimientos del GY revisados. Albaz al ser invocado conserva su ampliación pendiente y su exclusión pertinente de Reborn. La emulación móvil no acredita dispositivos físicos ni conformidad WCAG completa.

## Trabajo posterior

- Albaz al invocarse y más materiales, perfiles y consecuencias de las seis familias parciales.
- Prioridad, cadenas y efectos simultáneos generales; Damage Step, Flip, ataques múltiples, Xyz y Péndulo.
- Probabilidades de varios robos y eventos de azar con decisiones rivales, pesos y masa desconocida explícitos.
- Revisión documentada de identidades, estadísticas, disponibilidad y reglas por formato.
- Dispositivos físicos, accesibilidad y mantenimiento de la evidencia de cada entrega.
- Resultados competitivos reales para separar ajuste y validación sin inventar datos de torneo.

La revisión 18 conserva su aceptación remota de 69 grupos sobre el candidato 0807cd758ee30c3824330bcf59eb11f5d298df60 ([workflow](https://github.com/socramgns/MODERN/actions/runs/42152616194)). El commit final 89968d77be3cd4c7058c05b17e8fd9c103713269 conserva el [HTML publicado y descargado](https://github.com/socramgns/MODERN/raw/89968d77be3cd4c7058c05b17e8fd9c103713269/Analizador_YuGiOh.html?download=1), SHA-256 622328ee699c2a6407c5f20e724fe0f613bc6479858d4c2b4f222c86e8fdc9bb. Su informe local original mantiene pass: false, 67/69 grupos y Firefox/WebKit no disponibles. Esta evidencia pertenece a la revisión 18; la aceptación de los bytes nuevos se registra por separado.

Los criterios concretos están en [ANALISIS_PENDIENTES_REVISION19.md](ANALISIS_PENDIENTES_REVISION19.md). El avance se mide por capacidades y criterios de cierre; no existe un porcentaje fiable de todas las reglas del juego.

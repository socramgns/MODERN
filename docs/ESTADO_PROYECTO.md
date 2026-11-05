# Estado de la revisión 17

La aplicación se entrega como un único `Analizador_YuGiOh.html` sin comprimir. El original y las entregas anteriores se conservan. Cada ampliación cerrada genera una entrega HTML actualizada, como solicitó el usuario; la puntuación sigue estructural y provisional.

VALIDACION_R17_PENDIENTE

| Área | Implementación de esta revisión | Alcance |
| --- | --- | --- |
| Synchro de Azure | Procedimiento registrado con un Tuner y uno o más no Tuner Normales, nivel total 9 | Materiales físicos admitidos, boca arriba, restricciones y espacio tras retirarlos; contexto DUEL explícito |
| Historial apropiado | La transición ejecutada acredita la cualificación de la misma copia | Un campo inicial declarado o la invocación prestada por Spirit no sustituyen el procedimiento |
| Protección obligatoria | Pendiente compartido por Spirit, Synchro y Reborn después de una Invocación Especial real | Dragones actuales al resolver, hasta fin del turno siguiente; no OPT inventado ni inmunidad a batalla |
| Monster Reborn | Azure con historial válido puede revivir desde GY bajo el control del actor admitido | UID, propietario e historial conservados; llegada actual Especial desde GY y nueva protección pendiente |
| Standby | Azure revive un Normal admitido en su Standby propia | Copia física, turno/fase, uso y respuestas registrados; futuras invocaciones no heredan el escudo anterior |
| Laboratorio | Diecisiete ejemplos, con `azure` y los dieciséis anteriores | Inicio declarado y acciones posteriores ejecutadas, deshacer, objetivos y replay |
| Rutas conservadas | Seis familias parciales, Spark y respuestas físicas | Cuatro Mágicas Normales, dos de Campo y dos Trampas Normales registradas; no prioridad general |
| Datos e incertidumbre | 21.986 registros, copias revisadas y análisis hipotético de un próximo robo | Propuestas e hipótesis explícitas; no una migración global ni una tasa de victoria |
| Calibración | Importador preparado; puntuación provisional | Requiere resultados externos reales para validar métricas competitivas |

La aceptación local, remota, publicación y descarga son comprobaciones distintas ligadas al build y commit. Una cantidad prevista no acredita su aprobación. Las ausencias de Firefox/WebKit en el entorno local conservan sus informes originales cuando correspondan; la validación remota se registra con su propia evidencia. La emulación móvil no acredita hardware físico ni conformidad WCAG completa.

## Antecedente verificado

La revisión 16 conserva su [aceptación remota de 65 grupos](https://github.com/socramgns/MODERN/blob/309a8bdb983807d622c1ad5df8106a09688babf3/evidence/remote-acceptance.json) sobre el candidato `329f1ba15e960a949ceecc971005eee0fb622e03`, con 120 archivos JavaScript, 58 casos de Spark y 38 tareas de su interfaz. Su [workflow de aceptación](https://github.com/socramgns/MODERN/actions/runs/41889817768) y el [CI del commit final](https://github.com/socramgns/MODERN/actions/runs/41893149441) terminaron correctamente. El commit final `309a8bdb983807d622c1ad5df8106a09688babf3` conserva el [HTML descargado y verificado](https://github.com/socramgns/MODERN/raw/309a8bdb983807d622c1ad5df8106a09688babf3/Analizador_YuGiOh.html?download=1), SHA-256 `fab64088c402372a2cf8d3c8c997bdf13612c11701640bb8172694fcf00aa0cc`. Su informe local permanece con `pass: false`, 63/65 grupos y Firefox/WebKit no disponibles por el bloqueo de descarga. Esa evidencia pertenece a revisión 16; no sustituye la aceptación de los bytes nuevos.

## Trabajo posterior

- Ampliar materiales, procedimientos, disparos y perfiles de salida revisados; las seis familias siguen parciales. Albaz, Sunlight Wolf y Spirit Link conservan sus exclusiones pertinentes de Reborn.
- Prioridad y cadenas generales, efectos simultáneos, Damage Step, Flip, ataques múltiples, Xyz y Pendulum.
- Varios robos y eventos de azar con decisiones rivales, pesos y masa desconocida conservados.
- Revisar 98 identidades sin cotejo técnico, 51 monstruos con estadísticas desconocidas y 32 propuestas sin aplicarlas automáticamente.
- Completar disponibilidad, pools y reglas de otros formatos, Skills, desbloqueos, Legend e impresión/evento.
- Ampliar rulings, dispositivos físicos y accesibilidad; renovar evidencia de cada entrega.
- Incorporar resultados competitivos reales, separando ajuste y validación y manteniendo provisional la puntuación mientras falten.

El análisis actual está en [ANALISIS_PENDIENTES_REVISION17.md](ANALISIS_PENDIENTES_REVISION17.md). Los análisis anteriores conservan su revisión y evidencia. No existe un porcentaje global fiable de todas las reglas del juego.

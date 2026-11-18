# Uso de los perfiles de reglas de la revisión 23

El proyecto sigue entregándose como un único `Analizador_YuGiOh.html`. Los controles siguientes pertenecen al laboratorio de escenarios TCG de ese archivo. Las reglas son parciales y la puntuación competitiva permanece provisional. Este documento no declara una aceptación de CI ni cierre de criterios del proyecto.

## Preparar el escenario y activar los modos

Guarda tu baraja y exporta el escenario que quieras conservar antes de cargar un ejemplo: los ejemplos reemplazan las barajas y la preparación del laboratorio. Requieren TCG, la lista incorporada y ausencia de Skills. Los campos iniciales son supuestos declarados; colocar un monstruo Extra en ellos no acredita sus invocaciones anteriores.

Abre **Reglas ampliadas y secuencias de robos** en el laboratorio. Marca las opciones y pulsa **Aplicar reglas y reiniciar escenario**. Aplicarlas reconstruye el estado inicial; no modifica retroactivamente el historial anterior.

| Opción | Flag de contexto | Dependencias |
| --- | --- | --- |
| Prioridad y cadenas explícitas | `priorityMode:true` | Escenario con `duelMode:true`. |
| Ordenar efectos simultáneos | `triggerOrderMode:true` | Prioridad explícita. |
| Resolver los pasos de daño | `damageStepMode:true` | En la interfaz y los escenarios importados: prioridad explícita y orden de efectos simultáneos. |

Xyz y Péndulo tienen procedimientos registrados propios; no necesitan un flag adicional de contexto. Sus activaciones usan adaptadores de prioridad cuando ese modo está activo. En prioridad explícita, las respuestas se eligen por jugador en el laboratorio, sin aplicar como si fueran decisiones propias los paquetes atómicos anteriores.

Después de una activación, el coste ya está pagado y los objetivos ya están fijados. Cede con ambos jugadores consecutivamente para sellar la cadena. Resuelve un eslabón cada vez, del último al primero. No se pueden insertar respuestas entre esas resoluciones. Completa también las ventanas posteriores y los dos pases necesarios para avanzar de fase. Un objetivo no se considera satisfecho mientras queden pendientes pertinentes.

## Seis ejemplos incorporados

Los identificadores se consultan con `YGOScenarioExamples.list()`. Cada ejemplo se carga desde el selector de ejemplos o mediante `await YGOScenarioExamples.load(id)`. Cargarlo prepara el estado; las acciones se eligen después en el laboratorio.

### 1. Prioridad: `priority-chain`

Activa la protección de Spark, responde con Mechaba rival enviando un Monstruo real de su mano y encadena Roar propia. Tras los dos pases, resuelve Roar, Mechaba y Spark. Comprueba que la carta enviada por Mechaba permanece en el Cementerio aunque se niegue su activación. La protección sólo aparece si su eslabón resuelve. El campo previo de Spark, Wolf y Mechaba se declara como supuesto.

### 2. Efectos simultáneos: `simultaneous-triggers`

Los dos Librarian comienzan declarados en el campo. Invoca a Mo Ye, revela Longyuan y resuelve la creación del Token. Tras cerrar la ventana, usa Mo Ye y el Token para la Invocación Synchro registrada de Chixiao. Ordena primero los obligatorios de ambos jugadores y después los opcionales de tu grupo. La ruta guiada declina la búsqueda de Chixiao y activa el robo de Mo Ye para conservar el orden conocido de los robos posteriores. Buscar y barajar puede dejar pendiente un robo ordinario cuyo orden pasa a ser desconocido.

### 3. Damage Step: `damage-step`

El rival declara un ataque de Blue-Eyes contra Faith colocada. Recorre las ventanas con dos pases y avance de etapa. Faith se revela antes del cálculo; el daño y las prevenciones se determinan antes de activar su FLIP obligatorio. Selecciona la Invocation de tu Cementerio, resuelve la cadena y completa el envío por batalla al final. El ataque ya se gastó al declararlo. Si el blanco sale durante Damage Step antes de calcular, el combate termina sin inventar daño ni devolver ese ataque.

### 4. Xyz: `xyz-corn`

Invoca normalmente Alexandrite Dragon y, con el Luster Dragon declarado, invoca Corn por Xyz. Los dos materiales pasan a `overlay`, conservando UID, propietario y anfitrión. Activa el efecto, desacopla una copia y elige el objetivo admitido. El envío no es destrucción; los 1000 de daño dependen de que el objetivo llegue realmente al Cementerio. Si sale el Xyz, los materiales restantes van al Cementerio de sus propietarios. Pearl usa el otro procedimiento Xyz revisado, con los mismos límites de materiales y sin efecto propio registrado.

### 5. Péndulo: `pendulum-metalfoes`

Establece Goldriver y Steelen en las columnas exteriores, resolviendo sus activaciones. Destruye el Silverd propio con el efecto de escala y Coloca Metalfoes Fusion del Deck. La misma copia destruida queda en el Extra boca arriba con procedencia registrada. En **Elegir un grupo de Invocación por Péndulo**, selecciona ese Silverd para la zona Extra y las copias pertinentes de la mano para zonas principales distintas. El grupo es simultáneo y gasta una Invocación Péndulo del turno. El selector manual valida escalas, espacios y restricciones aunque una enumeración grande haya alcanzado su límite.

### 6. Robos cronológicos: `draw-sequences`

Este ejemplo declara tres cartas restantes en tu Deck y siete en el rival, con ambos órdenes desconocidos. Elige dos eventos y **Sólo avance de fases y robos**, después pulsa **Analizar secuencia**. El primer evento corresponde a tu robo de turno y el segundo al rival; no son dos robos propios. El objetivo de tener Blue-Eyes se evalúa en el primer estado sin pendientes después de esos eventos. Con cobertura y límites suficientes, la ruta ilustrativa tiene peso `1/3`; si la exploración queda incompleta, conserva el intervalo y la masa desconocida que correspondan.

Exporta el análisis y usa **Verificar informe JSON** contra ese mismo escenario. La verificación reconstruye las ramas y su vinculación; no incorpora los robos hipotéticos a la partida observada.

## APIs y consulta del alcance

Estas APIs están disponibles después del arranque del catálogo y los laboratorios. Para trabajar desde la consola, espera `YGODataCatalog.ready`, `YGOComboWorkbench.ready`, `YGOAdvancedWorkbench.ready` y, para sus controles, `YGORulesWorkbench.ready`.

| API | Consultas y operaciones principales |
| --- | --- |
| `YGOPriorityChain` | `capabilities()`, `status(state)`, `decisionPlayer(state)`, `isOpen(state)`, `hasUnresolvedLinks(state)`. |
| `YGOTriggerOrder` | `capabilities()`, `status(state)`, `currentPlayer(state)`, `activationCandidates(state)`. |
| `YGODamageStep` | `capabilities()`, `status(state)`, `stage(state)`, `isOpen(state)`, `battleDestroyed(state,uid)`. |
| `YGOXyzSummon` | `capabilities()`, `summonActions(state)`, `validateSummonAction(state,action)`, `materials(state,hostUid)`. |
| `YGOPendulumSummon` | `capabilities()`, `scales(state,player)`, `candidates(state,player)`, `summonActions(state)`, `enumerationStatus(state)`, `validateSummonAction(state,action)`. |
| `YGODrawSequences` | `capabilities()`, `validateSource(source)`, `sourceContext(initial)`, `analyze(source,options)`, `verify(report,options)`, `verifyAsync(report,options)`. |
| `YGORulesWorkbench` | `applyModes()`, `analyze()`, `verifyFile()`, `lastReport`, `isBusy`. Las tres operaciones usan los controles del panel. |
| `YGOAdvancedWorkbench` | `report()`, `actions()`, `step(action)`, `undo()`, `loadReport(report)`, `analyzeSnapshot(analyzer,options)`, `cancel()`. |
| `YGOStableRelease` | `status().combo` incluye `priority`, `triggerOrder`, `damageStep`, `xyz`, `pendulum` y `drawSequences`, con las capacidades de los módulos cargados. |
| `YGOCardCoverage` | `report()` y `registry()` distinguen procedimientos, efectos y respuestas parciales; los perfiles nuevos se contrastan con los handlers y adaptadores cargados. |

Para ejecutar una acción conserva los controles exactos que devuelve `YGOAdvancedWorkbench.actions()` y pásalos a `step(action)`. Los nombres `PRIORITY_ACTIVATE`, `PRIORITY_PASS`, `PRIORITY_RESOLVE`, `TRIGGER_ORDER_ACTIVATE`, `TRIGGER_ORDER_DECLINE`, `DUEL_DECLARE_ATTACK`, `DUEL_ATTACK_REPLAY`, `DUEL_ADVANCE_DAMAGE_STEP`, `DUEL_XYZ_SUMMON`, `XYZ_CORN_SEND`, `DUEL_ACTIVATE_PENDULUM_SCALE`, `DUEL_PENDULUM_SUMMON` y `METALFOES_SCALE_SET` identifican procedimientos o acciones; conocer el nombre no demuestra que sean legales en el estado actual.

Los métodos de registro y los helpers de preparación de efectos están destinados a implementación. No deben usarse para saltarse una enumeración, crear disparos inventados o modificar el estado exportado. El replay causal vuelve a ejecutar las acciones desde la preparación original y conserva costes, eventos y pruebas.

## Interpretar los robos inciertos

`draws` cuenta de uno a tres eventos de robo de turno desconocido en orden cronológico, del jugador que corresponda. El objetivo se evalúa en el primer estado asentado después del número pedido, no al primer éxito intermedio. Un final de duelo anterior al punto pedido no acredita ese objetivo posterior.

Se supone una permutación uniforme de las copias físicas restantes de cada Deck. Si quedan `N` copias, cada UID tiene peso exacto `1/N`; la copia se retira antes del evento siguiente. Las decisiones anteriores al robo no conocen ese resultado ni los futuros. Después de cada evento, las decisiones sí utilizan todo el estado declarado, incluidas manos: es un modelo de información completa declarada, no un solucionador de información privada.

Las decisiones propias, jugador interno `0`, maximizan; las del rival, `1`, minimizan. La prioridad y el controlador de una elección de resolución determinan quién elige. Las respuestas atómicas anteriores, las elecciones internas de otro controlador sin separar y las decisiones ambiguas no se modelan como cooperación del rival: conservan incertidumbre.

Un resultado publica fracciones exactas e intervalo de identificación: `successWeight` es la cota inferior, `failureWeight` es uno menos la cota superior y `unknownWeight` es la diferencia entre cotas. La masa desconocida no es una derrota. Los recortes por nodos, profundidad, tiempo, acciones, ramas de azar, estados repetidos o falta de cobertura dejan resultados desconocidos. Una enumeración Péndulo incompleta dentro del dominio admitido tampoco demuestra que no existan acciones adicionales.

| Opción de `analyze` | Valor por defecto de la API | Rango admitido |
| --- | --- | --- |
| `draws` | `2` | `1..3` |
| `maxDepth` | `48` | `0..90` |
| `maxNodes` | `1200` | `1..5000` |
| `maxActionsPerNode` | `20` | `1..128` |
| `maxChanceBranches` | `60` | `1..60` |
| `maxMs` | `6000` | `50..30000` |
| `actionTypes` | `null` | Todos los tipos registrados o una lista explícita de hasta 128 tipos distintos. |
| `phaseTargets` | `null` | Todas las fases admitidas o una lista explícita sin duplicados. |

Los controles visibles pueden escoger otros límites dentro de esos rangos. `actionTypes` y `phaseTargets` restringen el problema analizado: un intervalo estrecho obtenido sólo con avance de fases no acredita el mismo resultado al permitir activaciones y ataques. El informe conserva ambas políticas. El tamaño máximo del informe es 8 MiB.

Ejemplo de API que analiza una copia vigente del laboratorio sin mover cartas en él:

```js
const resultado = await YGOAdvancedWorkbench.analyzeSnapshot(
  YGODrawSequences.analyze,
  {
    draws: 2,
    maxNodes: 1200,
    maxDepth: 72,
    maxMs: 10000,
    actionTypes: [
      'DUEL_ADVANCE_PHASE', 'DUEL_NEXT_TURN', 'DUEL_DRAW_FOR_TURN',
      'PRIORITY_PASS', 'PRIORITY_RESOLVE'
    ],
    phaseTargets: ['STANDBY', 'MAIN 1', 'END']
  }
);
```

El origen debe tener dos barajas físicas, estar en TCG sin Skills, conservar al menos un Deck restante con orden desconocido y vincular inicio, estado actual, objetivo, catálogo, build y contexto del formato. Un prefijo causal se reconstruye por replay; un estado actual arbitrario no sustituye ese prefijo. Cambiar baraja, objetivo o contexto invalida el análisis. `cancel()` permite detener el trabajo iniciado mediante el laboratorio; también se puede proporcionar `signal` a la API de análisis.

`verify(report,{source})` reconstruye pesos, decisiones, hijos, costes y eventos contra el mismo origen; su resultado devuelve `pass` y, si procede, `report`. `await verifyAsync(report,{source,signal,onProgress})` usa la misma semántica de comprobación, procesa grupos de ocho nodos y cede después el hilo. En cada cesión vuelve a comprobar la vigencia del origen; una cesión no garantiza una duración exacta en milisegundos. Si se cancela, devuelve `{pass:false,status:'CANCELLED',issues:['CANCELLED']}`. La importación visible utiliza la variante asíncrona.

Los robos quedan marcados `hypothetical:true` y `observedDraw:false`. El replay condicional del informe no permite reanudar esas hipótesis como una partida observada. `competitiveScore`, `winRate`, `certified` y las afirmaciones de optimalidad general permanecen respectivamente nulos o falsos.

## Costes, límites y asuntos pendientes

Spark y Mechaba conservan su uso local tras negar una activación en la misma estancia; lo mismo se aplica a los perfiles pertinentes de Mirrorjade, Azure-Eyes y Ancients. Los costes físicos no se devuelven. Corn distingue su uso y desacople de la restricción auxiliar OATH de no atacar, que se retira tras una negación de activación cuando corresponde. La [revisión de referencias](REFERENCIAS_REGLAS_REVISION23.md) documenta esa distinción y las fuentes técnicas secundarias.

Se conservan los límites de perfiles: Xyz sólo Pearl/Corn y materiales Normales revisados; Péndulo sólo cuatro Metalfoes Normales y destinos admitidos; SEGOC sólo los efectos registrados; Damage Step sólo ventanas y respuestas revisadas. La presencia en el catálogo o en el inventario de cobertura no demuestra disponibilidad oficial, reglas completas ni una jugada legal. Las identidades, estadísticas y contextos de formato aún sin resolver se explican en [datos y formatos R23](REVISION_DATOS_FORMATOS_R23.md).

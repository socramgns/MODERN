# Analizador de barajas Yu-Gi-Oh · revisión 12

La entrega sigue siendo **un único `Analizador_YuGiOh.html`**, con el catálogo y los motores incorporados.

[Descargar el HTML de esta rama: revisión 12](https://github.com/socramgns/MODERN/raw/refs/heads/entrega/analizador-yugioh-estable12/Analizador_YuGiOh.html?download=1)

La revisión 12 pasó **54/54 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `937c9e64aa9594ce8d60ad5fadf8fc66f8f220b7420461576f76f45ed700e247`; SHA-256 `73182845a1d7e2ede4496b50f04009f68dfeb9db7f1b1bc4c6fa9fdb68805007`; tamaño **6,981,312 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 12 se comprueban por separado y se registran con el commit correspondiente.

La revisión 11 conserva una [aceptación local de 52/52 grupos](https://github.com/socramgns/MODERN/blob/9d177f20094c6697ae5cc5a26f4f2c1c789ee66d/evidence/validation-summary.json), aprobados en una ejecución completa sobre el mismo HTML. Su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40741033245) terminó **correctamente** para el commit `9d177f20094c6697ae5cc5a26f4f2c1c789ee66d`. Esa evidencia corresponde a revisión 11 y no sustituye la comprobación de los bytes nuevos.

## Cómo usarlo

1. Guarda el archivo con extensión `.html` y ábrelo en un navegador reciente. Si el enlace muestra código, usa **Guardar como** y conserva el nombre `Analizador_YuGiOh.html`.
2. Importa una baraja JSON o YDK en **Baraja y zonas por formato**, revisa las incidencias y pulsa **CALCULAR**.
3. Abre **Probar un ejemplo incluido** y pulsa **Cargar ejemplo en el laboratorio**. El ejemplo sustituye la baraja actual y prepara un campo declarado; ejecuta cada paso manualmente. El nuevo ejemplo de Trampa muestra Impermanence, una respuesta de Mechaba y una contrarrespuesta de Roar.
4. En el laboratorio, define cartas y cantidades en el objetivo y pulsa **Aplicar objetivo visual**. Consulta sus requisitos cumplidos y pendientes al ejecutar, deshacer o reanudar un informe.
5. Consulta **Acciones registradas de esta baraja** para conocer los efectos parciales reconocidos. Exporta JSON para conservar la baraja y su contexto; YDK transporta Main, Extra y Side, pero no Skills.

El catálogo y los cálculos incorporados funcionan sin Internet. Las imágenes y actualizaciones remotas requieren conexión. La sesión se guarda en ese navegador/origen; exporta una copia para trasladarla o conservarla fuera de ese almacenamiento.

## Qué incluye esta revisión

- Registra `ACTIVATE_INFINITE_IMPERMANENCE` (10045474) como activación de una Trampa Normal de Velocidad 2, desde mano sin cartas controladas o desde una colocación de un turno anterior.
- Conserva copia, origen, columna y objetivo antes de las respuestas. Negar su activación no devuelve los costes de Mechaba ni aplica la negación del monstruo o de la columna.
- Mechaba puede enviar una Trampa física admitida de su mano al GY para responder a ese paquete; Roar conserva sus respuestas y contrarrespuestas de Velocidad 3 dentro de la cadena acotada.
- La negación de columna solo se aplica si Impermanence estaba colocada antes de activarse, sigue en el campo al resolver y se resuelve la negación de su objetivo. Si el objetivo ya no está, no se añade esa negación de columna.
- Conserva el seguimiento de objetivos y añade un duodécimo ejemplo guiado, manteniendo los once identificadores anteriores, los 21.986 registros y las seis familias parciales.

Impermanence no tiene un contador de uso por turno añadido por la aplicación; cada activación exige su copia y ventana admitida. Su activación no paga la carta como coste: la limpieza normal la envía al GY tras resolver. El proveedor de respuesta de Impermanence se conserva y corrige su aplicación cuando la columna ya estaba negada: la carta se consume al resolver, pero no aplica su efecto ni añade otro bloqueo. Mechaba, de Velocidad 2, no puede responder a Roar de Velocidad 3.

La puntuación competitiva es **estructural y provisional**. El importador de calibración está preparado y requiere barajas y resultados externos reales. La ampliación registra un paquete concreto de Trampa; las demás activaciones, las cadenas y prioridades generales, SEGOC, Damage Step y otros efectos permanecen dentro de los límites documentados. El catálogo técnico no certifica disponibilidad ni todos los rulings.

Una columna ya negada también anula el efecto de Roar, incluida su contrarrespuesta de Velocidad 3. La carta se activa y consume su uso; al resolver no niega ni destruye el eslabón anterior, y termina en el destino registrado. Otra Counter Trap admitida todavía puede negar esa activación.

## Evidencia y desarrollo

`dist/validation-summary.json` identifica el resultado local de esta revisión con su build y SHA-256. En la rama de entrega, `evidence/validation-summary.json` conserva los identificadores del HTML aceptado. Las evidencias anteriores permanecen ligadas a sus propios commits.

- [Estado y pendientes](docs/ESTADO_PROYECTO.md)
- [Análisis de lo que falta](docs/ANALISIS_PENDIENTES_REVISION12.md)
- [Alcance de reglas y búsquedas](docs/ALCANCE_COMBOS.md)
- [Fuentes oficiales](docs/FUENTES_OFICIALES.md)
- [Compilación, datos y pruebas](docs/DESARROLLO.md)

El repositorio conserva fuente, pruebas y workflow. El resultado remoto de CI se observa para cada revisión; conservar la configuración no demuestra que su ejecución nueva haya aprobado.

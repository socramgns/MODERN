# Analizador de barajas Yu-Gi-Oh · revisión 13

La entrega sigue siendo **un único `Analizador_YuGiOh.html`**, con el catálogo y los motores incorporados.

[Descargar el HTML de esta rama: revisión 13](https://github.com/socramgns/MODERN/raw/refs/heads/entrega/analizador-yugioh-estable13/Analizador_YuGiOh.html?download=1)

La revisión 13 obtuvo aceptación local de **56/56 grupos** sobre el HTML final. La primera ejecución completa aprobó **55/56**: la prueba de exportación YDK podía comparar una baraja antes de terminar su importación. Se corrigió la espera de la prueba y se repitió la suite completa de entrega, con **14/14 tareas aprobadas sobre los mismos bytes**, sin modificar la aplicación. Se comprobó la sintaxis de **114 archivos JavaScript**, Chromium, Firefox y WebKit, y la apertura directa del HTML local sin conexión en Firefox. Build `62d595ef64824400782f54808fd32e70a9b2fcb21ef98ba2aeaec753c41ec79a`; SHA-256 `5f05c079f9a512c04e3d7978864461746e4bcb8d9cf0589440579663e6dceecb`; tamaño **6,989,766 bytes**. Los informes conservan el intento inicial y la repetición; la aceptación se limita al alcance registrado.

La publicación, la descarga HTTP y el resultado remoto de GitHub Actions de revisión 13 se comprueban por separado y se registran con el commit correspondiente.

La revisión 12 conserva una [aceptación local de 54/54 grupos](https://github.com/socramgns/MODERN/blob/f538b8002106b4e0a9244e39fc3d82aecb8de78e/evidence/validation-summary.json), con 114 archivos JavaScript comprobados, Chromium, Firefox y WebKit y apertura directa del HTML sin conexión en Firefox. Su descarga HTTP fue cotejada con los bytes aceptados y su [ejecución remota de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/40822517564) terminó **correctamente** para el commit `f538b8002106b4e0a9244e39fc3d82aecb8de78e`. Esta evidencia pertenece a revisión 12 y no sustituye la aceptación de los bytes nuevos.

## Cómo usarlo

1. Guarda el archivo con extensión `.html` y ábrelo en un navegador reciente. Si el enlace muestra código, usa **Guardar como** y conserva el nombre `Analizador_YuGiOh.html`.
2. Importa una baraja JSON o YDK en **Baraja y zonas por formato**, revisa las incidencias y pulsa **CALCULAR**.
3. Abre **Probar un ejemplo incluido** y pulsa **Cargar ejemplo en el laboratorio**. El ejemplo sustituye la baraja actual y prepara un campo declarado; ejecuta cada paso manualmente. El nuevo ejemplo de Compulsory compara una devolución a mano con una devolución al Extra, con Spark, Mechaba y Roar.
4. En el laboratorio, define cartas y cantidades en el objetivo y pulsa **Aplicar objetivo visual**. Consulta sus requisitos cumplidos y pendientes al ejecutar, deshacer o reanudar un informe.
5. Consulta **Acciones registradas de esta baraja** para conocer los efectos parciales reconocidos. Exporta JSON para conservar la baraja y su contexto; YDK transporta Main, Extra y Side, pero no Skills.

El catálogo y los cálculos incorporados funcionan sin Internet. Las imágenes y actualizaciones remotas requieren conexión. La sesión se guarda en ese navegador/origen; exporta una copia para trasladarla o conservarla fuera de ese almacenamiento.

## Qué incluye esta revisión

- Añade `ACTIVATE_COMPULSORY_EVACUATION_DEVICE` (94192409) como segunda activación registrada de Trampa Normal de Velocidad 2. Solo se ofrece desde una copia colocada en un turno anterior, con su columna física; la excepción de activación desde mano sigue siendo exclusiva de Impermanence.
- Permite elegir un monstruo propio o rival con perfil de salida revisado. Los del Main vuelven a la mano de su propietario y los Fusion/Synchro/Link admitidos regresan a su Extra oculto; los Tokens registrados dejan de existir al salir.
- Conserva origen, objetivo y propietario, así como costes físicos, usos y contrarrespuestas de Mechaba y Roar. Negar la activación o el efecto impide la devolución correspondiente sin devolver los pagos.
- Distingue devolución de destrucción: la protección de Spark y el reemplazo de Balelynx no impiden una devolución admitida. Devolver Mirrorjade al Extra oculto no crea una nueva destrucción diferida de End Phase.
- Añade el ejemplo `evacuation`, conservando los doce anteriores, el seguimiento de objetivos, los 21.986 registros y las seis familias parciales.

La redirección registrada de Spinny que fue revivido se respeta: su salida lo destierra en lugar de devolverlo a la mano. La traza conserva el destino solicitado y el real; otras redirecciones sin revisar permanecen excluidas.

Compulsory e Impermanence no reciben un contador de uso por turno inventado; cada activación exige su copia y ventana admitida. Compulsory no puede activarse desde mano mediante este paquete ni desde una colocación del turno actual. Su envío normal al GY tras resolver no es un coste de activación. Los usos globales del turno y las restricciones no se reinician al devolver un monstruo a una zona oculta.

Se conserva la negación de columna de Impermanence, incluida su aplicación a Roar y a la nueva Trampa: una carta puede activarse y consumir sus recursos aunque su efecto quede negado. Mechaba, de Velocidad 2, no puede responder a Roar de Velocidad 3.

La puntuación competitiva es **estructural y provisional**, como solicitó el usuario. El importador de calibración está preparado y requiere barajas y resultados externos reales para validarla. Las otras activaciones, las cadenas y prioridades generales, SEGOC, Damage Step y otros efectos permanecen dentro de los límites documentados. El catálogo técnico no certifica disponibilidad ni todos los rulings.

## Evidencia y desarrollo

`dist/validation-summary.json` identifica el resultado local de esta revisión con su build y SHA-256. En la rama de entrega, `evidence/validation-summary.json` conserva los identificadores del HTML aceptado. Las evidencias anteriores permanecen ligadas a sus propios commits.

- [Estado y pendientes](docs/ESTADO_PROYECTO.md)
- [Análisis de lo que falta](docs/ANALISIS_PENDIENTES_REVISION13.md)
- [Alcance de reglas y búsquedas](docs/ALCANCE_COMBOS.md)
- [Fuentes oficiales](docs/FUENTES_OFICIALES.md)
- [Compilación, datos y pruebas](docs/DESARROLLO.md)

El repositorio conserva fuente, pruebas y workflow. El resultado remoto de CI se observa para cada revisión; conservar la configuración no demuestra que su ejecución nueva haya aprobado. El avance se expresa por capacidades y comprobaciones, sin asignar un porcentaje global a todas las cartas y reglas del juego.

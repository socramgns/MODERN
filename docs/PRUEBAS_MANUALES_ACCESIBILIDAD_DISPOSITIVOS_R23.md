# Pruebas manuales de accesibilidad y dispositivos · R23

El objetivo es reunir evidencia de uso real que las pruebas automáticas y la emulación no proporcionan. Este protocolo está preparado; no significa que sus tareas ya se hayan ejecutado.

En el entorno de desarrollo no se encontraron los ejecutables de Orca ni NVDA, ni una sesión gráfica `DISPLAY`, `WAYLAND_DISPLAY` o `DBUS_SESSION_BUS_ADDRESS`. Chromium permite comprobar nombres, roles, teclado y geometría en emulación. Eso no acredita una sesión con lector de pantalla ni una prueba en un teléfono o equipo físico. **C30 y C31 permanecen pendientes** hasta revisar evidencia suficiente del flujo completo.

## Registrar el archivo y el equipo realmente utilizados

1. Descarga el HTML de la revisión que vas a probar. En «Accesibilidad y pruebas del equipo», abre «Revisar pruebas manuales de este equipo» y descarga la plantilla. Incorpora el `buildId` de ese HTML sin alterar el archivo del proyecto.
2. Calcula el SHA-256 del HTML que abriste y anótalo en `htmlSha256`. Puedes usar `Get-FileHash .\Analizador_YuGiOh.html -Algorithm SHA256` en PowerShell, `shasum -a 256 Analizador_YuGiOh.html` en macOS o `sha256sum Analizador_YuGiOh.html` en Linux.
3. Registra fecha y hora con zona horaria, alias del evaluador, modelo del equipo, sistema operativo y versión, navegador y versión. No es necesario aportar nombre, correo ni información personal.
4. Elige `PHYSICAL`, `EMULATED` o `REMOTE_VIRTUAL`. Marca `physicalDeviceConfirmed: true` sólo si usaste realmente ese equipo físico y `emulationUsed: false` para esa ejecución. Registra por separado las pruebas emuladas.
5. Si usas NVDA, JAWS, VoiceOver, TalkBack, Orca u otra tecnología, registra su nombre y versión y `actualUse: true` solamente después de utilizarla durante las tareas. Si no la utilizaste, conserva `name: "NONE"` y `actualUse: false`.

La plantilla del repositorio [manual-device-template.json](../evidence/manual-device-template.json) está vacía. La plantilla descargada desde el HTML rellena únicamente su compilación. No presupone un dispositivo, una ejecución o un resultado favorable.

## Tres flujos obligatorios por ejecución

| ID del flujo | Tareas y observaciones |
| --- | --- |
| `open-import` | Abrir el HTML descargado; comprobar arranque; importar una baraja JSON o YDK; revisar cantidades Main/Extra/Side; recorrer controles con teclado o gestos nativos y confirmar nombres, estado seleccionado, errores y mensajes. Registrar si el archivo local, el selector nativo o alguna descarga quedan bloqueados por el navegador. |
| `play-save-resume` | Cargar un ejemplo físico; ejecutar sus pasos desde los controles; comprobar el objetivo y replay; deshacer un paso; exportar y reanudar el informe; verificar que se conserva el estado y que una importación inválida deja intacto el laboratorio. Registrar cada impedimento y el mensaje anunciado. |
| `keyboard-assistive` | Recorrer el flujo anterior sin ratón; activar los enlaces de salto; cambiar formato y zona; abrir/cerrar paneles y diálogos; comprobar foco visible, orden y retorno del foco, nombres/roles/selecciones, controles deshabilitados y su explicación. Con lector de pantalla, registrar lo anunciado realmente. Probar contraste aumentado, movimiento reducido, ampliación de texto y orientación/pantalla estrecha en el equipo utilizado. |

Resultados admitidos: `PASS`, `FAIL`, `BLOCKED`, `NOT_RUN`. Incluye una observación concreta para cada flujo ejecutado o bloqueado: acciones realizadas, resultado esperado, resultado observado y controles afectados. Conserva `NOT_RUN` donde no se haya probado. Una tarea bloqueada o un caso sin ejecutar no se convierte en éxito. `evidenceReference` puede indicar un archivo local de captura, audio, notas o identificación del informe; no se carga contenido privado automáticamente.

Para evaluar accesibilidad completa, un solo informe genérico no basta. Hace falta revisar también contraste de textos y gráficos, ampliación y reflujo, navegación con tecnología de asistencia y los flujos admitidos nuevos. Las combinaciones de navegador, plataforma y lector son evidencias diferenciadas. La emulación de WebKit no sustituye Safari o VoiceOver en un equipo real; una instantánea ARIA no equivale a oír y operar un lector de pantalla.

## Revisar e importar resultados

La sección del HTML permite cargar el JSON y comprobar su estructura, inventario de tres flujos y coincidencia de `buildId`. No cambia la baraja, el laboratorio, la nota competitiva ni los criterios de aceptación. El archivo se procesa localmente. El SHA-256 declarado requiere comparación con el archivo realmente probado; la interfaz no puede calcular retrospectivamente el hash del documento original a partir del DOM.

`YGOAccessibility.validateManualEvidence(informe, {buildId, htmlSha256})` permite contrastar además el SHA-256 cuando el revisor aporta un hash esperado obtenido de una fuente confiable. `pass` e `inputValid` significan que el formato y las declaraciones son consistentes. Los resultados del evaluador se presentan por separado en `flows.reportedAllPassed`. El informe siempre conserva `requiresHumanReview: true`, `physicalDevicesVerifiedByAgent: false` y `completeAccessibilityCertified: false`.

Importar una declaración de equipo físico no constituye verificación independiente. El cierre de C30 o C31 requiere revisar la evidencia, su procedencia, el alcance cubierto y los fallos abiertos. La puntuación competitiva continúa provisional por decisión del usuario.

## Comprobaciones automáticas complementarias

El módulo permite aumentar contraste de los paneles de trabajo, reducir transiciones y explicar controles deshabilitados sin alterar las reglas de la partida. Sus integraciones son `registerRegion(id)`, `registerDisabledReason(id, textoOFuncion)`, `announce(texto)` y `audit()`.

La nueva prueba `tests/accessibility_r23.py` comprueba los controles registrados, referencias ARIA, teclado, preferencias, contraste computado de textos opacos, foco, declaraciones manuales inválidas, conservación de la partida y tamaños de controles en vistas de 320/390 píxeles. Los controles nativos, fondos compuestos, gráficos, imágenes y situaciones no medidas permanecen explícitos. No se deduce conformidad WCAG completa de esa prueba.

`--diagnostic-source` sirve para revisar únicamente el módulo de presentación nuevo sobre un HTML anterior: marca `SOURCE_DIAGNOSTIC` y `sourceInjection: true`. Sus resultados no aceptan una entrega nueva. La aceptación exige repetir sobre el HTML compilado de la revisión final, sin esa opción.

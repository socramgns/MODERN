# Analizador de barajas Yu-Gi-Oh · revisión 21

La entrega sigue siendo **un único Analizador_YuGiOh.html sin comprimir**, con catálogo y cálculo incorporados. Se conservan el original y las revisiones anteriores.

[Descargar HTML de esta rama: revisión 21](https://github.com/socramgns/MODERN/raw/refs/heads/entrega/analizador-yugioh-estable21/Analizador_YuGiOh.html?download=1)

La revisión 21 queda aceptada por la ejecución remota del commit `c3c2ebeb9aaaf7df57481fdefadabf93292d66b3`: el [workflow de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/42440271007) completó los diez pasos obligatorios, incluida la batería de **77 grupos** y la comprobación estricta entre Chromium, Firefox y WebKit. El recuento se contrasta con el runner versionado; no se descargaron los informes remotos individuales. Las fuentes incluyen **123 archivos JavaScript** y se conservan **21 ejemplos**. Build `8e2f493167e60a1752237885db37d72063514109118aa937707e93c9819c4908`; SHA-256 `3838c78ea58ec52af9019fbc5ad2f132db26b6022eb3d9c1ff939543d8894531`; tamaño **7.165.831 bytes**. La recuperación actual reprodujo el HTML y aprobó **86 casos Node**, **29 casos de escenarios** y **39 comprobaciones GUI**. El informe completo local R21 no se recuperó al reemplazarse el ejecutor: se registra como no disponible, sin atribuirle resultados. La evidencia R20 original permanece íntegra en `evidence/history/revision20`. Las 30 comprobaciones previas de teclado/foco y la auditoría previa siguen vinculadas a los mismos bytes; no se presentan como ejecuciones nuevas. La puntuación continúa provisional; C30 y C31 siguen pendientes.

La revisión 21 registra el segundo ataque de Hayabusa Knight y Cyber Twin Dragon durante cada Battle Phase. Cada declaración consume un ataque de la copia física, incluso si una protección evita la destrucción. Negar sus efectos reduce el límite a uno sin devolver ataques gastados; retirar la copia del campo y volver a invocarla comienza una estancia nueva. El registro usado para impedir cambios manuales de posición se conserva por separado.

## Cómo probar los dos ataques

1. Guarda el archivo como Analizador_YuGiOh.html y ábrelo en un navegador reciente.
2. En los ejemplos incluidos selecciona `hayabusa` y carga el escenario; declara y reemplaza la baraja actual.
3. Invoca normalmente a Hayabusa Knight desde la mano y pasa a Battle Phase.
4. Declara dos ataques directos: cada uno resta 1.000 LP al rival. Comprueba el presupuesto restante y que no se ofrece un tercero.
5. Revisa deshacer, objetivos, búsqueda y exportación/importación del informe; el replay vuelve a ejecutar cada declaración desde el origen.

Se conservan los veinte ejemplos anteriores, incluidos Albaz, Wolf, Spirit, Azure y Spark, además de edición, estadísticas, probabilidades e importaciones y exportaciones. Catálogo y cálculo funcionan sin conexión; las imágenes y actualizaciones remotas la necesitan.

Los dos perfiles permiten un segundo ataque contra el mismo monstruo superviviente, otro objetivo legal o directamente si el campo rival está vacío. No conceden un tercer ataque. Otros efectos de ataques adicionales, ataques limitados a monstruos, prioridad general, SEGOC completo, Damage Step completo, Flip, Xyz y Péndulo continúan fuera de este paquete. No se añade un procedimiento de Fusión de Cyber Twin ni se acredita una historia previa por declararlo en el campo inicial.

Se amplían las etiquetas de búsqueda, el foco visible, el estado accesible de los selectores y el cierre y recorrido por teclado de ventanas registradas. Estas comprobaciones automáticas y emuladas no cierran C30 ni C31: faltan la evaluación completa con tecnologías de asistencia y pruebas en equipos físicos.

La puntuación competitiva permanece estructural y provisional por decisión del usuario. El importador de resultados reales está preparado; los escenarios diagnósticos no son resultados de torneos.

El [estado del proyecto](docs/ESTADO_PROYECTO.md) conserva los 32 criterios. Los [pendientes](docs/ANALISIS_PENDIENTES_REVISION21.md) y la [auditoría de datos](docs/AUDITORIA_DATOS_REVISION21.md) distinguen lo comprobado de lo desconocido.

La revisión 20 conserva su [HTML publicado y verificado](https://github.com/socramgns/MODERN/raw/71b244b7594b5bae1f5042d1248bcf5fa4a50a64/Analizador_YuGiOh.html?download=1), SHA-256 `1bcd4ee98c2d8b694c7fd31b8c948fd4387ae94c0a944171f9dc1385aa8d9ac0`, y su [aceptación remota de 73 grupos](https://github.com/socramgns/MODERN/actions/runs/42337909290). Su resultado local original sigue en 71/73 con `pass:false` por Firefox y WebKit ausentes; no se convierte ese resultado en éxito.

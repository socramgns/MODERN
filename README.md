# Analizador de barajas Yu-Gi-Oh · revisión 23 en validación

La entrega sigue siendo **un único Analizador_YuGiOh.html sin comprimir**, con catálogo y cálculo incorporados. R23 integra modos opcionales de prioridad, efectos simultáneos y pasos de daño, procedimientos Xyz/Péndulo revisados y análisis hipotético de varios robos. Conserva los 22 ejemplos anteriores y añade seis: **28 ejemplos**.

Esta rama contiene un candidato en comprobación. La aceptación anterior R22 está preservada y [su HTML sigue disponible](https://github.com/socramgns/MODERN/raw/35ad8188207f6a47be47b6bc361a011cf01c948b/Analizador_YuGiOh.html?download=1). La batería actual consta de **88 grupos**; el informe original de una ejecución incompleta o fallida no se convierte en éxito por un seguimiento.

La [guía de uso de R23](docs/USO_REGLAS_REVISION23.md) describe los controles y ejemplos. Las [referencias técnicas](docs/REFERENCIAS_REGLAS_REVISION23.md) delimitan los perfiles; no certifican todas las reglas del juego. La [revisión de datos y formatos](docs/REVISION_DATOS_FORMATOS_R23.md) prepara expedientes sin atribuir identidades o estadísticas no comprobadas. El [protocolo manual](docs/PRUEBAS_MANUALES_ACCESIBILIDAD_DISPOSITIVOS_R23.md) mantiene pendientes las pruebas con tecnologías de asistencia y equipos físicos.

La puntuación competitiva permanece estructural y provisional por decisión del usuario. El importador de resultados reales está preparado. Catálogo y cálculo funcionan sin conexión; las imágenes y las actualizaciones remotas requieren conexión.

## Aceptaciones anteriores

R21 fue aceptada mediante [GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/42440271007) sobre el commit `c3c2ebeb9aaaf7df57481fdefadabf93292d66b3`: 77 grupos y comprobación estricta entre Chromium, Firefox y WebKit. Su HTML publicado en `5d1a44c4bca27ec81c78983bfa29a969813a15a8` tiene SHA-256 `3838c78ea58ec52af9019fbc5ad2f132db26b6022eb3d9c1ff939543d8894531`, 7.165.831 bytes y build `8e2f493167e60a1752237885db37d72063514109118aa937707e93c9819c4908`. Se conserva la evidencia original: la batería local completa R21 no se recuperó al reemplazar el ejecutor y no se le atribuye un resultado nuevo.

La revisión 20 conserva su [HTML publicado](https://github.com/socramgns/MODERN/raw/71b244b7594b5bae1f5042d1248bcf5fa4a50a64/Analizador_YuGiOh.html?download=1) y su [aceptación remota de 73 grupos](https://github.com/socramgns/MODERN/actions/runs/42337909290). Su resultado local original permanece en 71/73 con `pass:false`; sus limitaciones se conservan en el historial.

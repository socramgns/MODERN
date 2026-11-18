# Analizador de barajas Yu-Gi-Oh · revisión 22

La entrega es **un único Analizador_YuGiOh.html sin comprimir**, con catálogo y cálculo incorporados. La revisión 22 integra la Invocación por Volteo y el perfil FLIP de Magician of Faith; su aceptación está vinculada al candidato exacto y a los mismos bytes publicados y descargados.

[Descargar el HTML de la revisión 22](https://github.com/socramgns/MODERN/raw/86b8f848635d1ac392625b6d9c1a6bb5674e5b04/Analizador_YuGiOh.html?download=1)

## Probar el nuevo perfil de Volteo

1. Abre Analizador_YuGiOh.html en un navegador reciente.
2. Selecciona el ejemplo `faith-flip` y carga su baraja y escenario. El estado inicial declara una Faith colocada en un turno anterior y una Magia propia en el Cementerio; no inventa las jugadas de esos turnos.
3. Realiza la Invocación por Volteo. Conserva la misma copia física, la coloca boca arriba en Ataque y no consume la Invocación Normal disponible.
4. Resuelve su efecto obligatorio seleccionando una Magia admitida de tu Cementerio. La copia elegida pasa a la mano y se muestra al rival; no se busca ni se baraja el Deck.
5. Comprueba la búsqueda, la reproducción desde el origen y la exportación e importación del informe.

El efecto de Faith no tiene coste ni límite de uso por turno. Una Invocación Normal boca arriba, colocarla o declararla en el campo inicial no genera un efecto FLIP. Si no existe ninguna Magia legal en su Cementerio, el efecto se activa obligatoriamente sin objetivo y resuelve sin recuperar. Si sólo hay Magias cuyo movimiento no está revisado, la ruta afectada queda fuera de las transiciones verificadas.

Al ser volteada por un ataque, el perfil registra cálculo, daño y prevención antes de resolver el FLIP; el envío pendiente por batalla se completa después. Mechaba y Salamangreat Roar conservan sus costes, condiciones y límites en esa ventana. Esto no implementa todas las ventanas de Damage Step, la prioridad general ni SEGOC. El resto de los monstruos de Efecto no recibe permiso de Volteo por compartir catálogo o familia.

Se conservan los ejemplos y funciones anteriores, incluidos los dos ataques de Hayabusa Knight y Cyber Twin Dragon, Albaz, Wolf, Spirit, Azure y Spark. Catálogo y cálculo funcionan sin conexión; las imágenes y actualizaciones remotas la necesitan. El Volteo admitido de Cyber Twin no incorpora su procedimiento de Fusión ni acredita una invocación apropiada previa.

La puntuación competitiva permanece estructural y provisional por decisión del usuario. El importador de resultados reales está preparado; los escenarios diagnósticos no son resultados de torneos.

El [estado del proyecto](docs/ESTADO_PROYECTO.md) conserva los 32 criterios. Los [pendientes de R22](docs/ANALISIS_PENDIENTES_REVISION22.md) registran 20/32 criterios verificados y 12 pendientes del alcance operativo; ese recuento no mide todas las reglas del juego. Las [referencias de Volteo](docs/REFERENCIAS_FLIP_REVISION22.md) son evidencia técnica secundaria: no autentican rulings oficiales TCG. La [auditoría de datos de R21](docs/AUDITORIA_DATOS_REVISION21.md) conserva las identidades y estadísticas todavía sin resolver.

## Verificación de R22

La revisión 22 queda aceptada por la ejecución remota del commit `86b8f848635d1ac392625b6d9c1a6bb5674e5b04`: el [workflow de GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/43558962065) completó los diez pasos obligatorios, incluida la batería de **79 grupos**, las instalaciones de Chromium, Firefox y WebKit y la puerta estricta entre motores. El recuento se contrasta con el runner versionado; no se descargaron los informes remotos individuales. Las fuentes incluyen **124 archivos JavaScript** y se conservan **22 ejemplos**. Build `afe53b8932901869aae05b80e3605ca6cb18625ec7984e41484ce71bf212fa94`; SHA-256 `7ec0ed4d6bee8ef655445bc7831aa6f5ad9fd6db332722212abbc43d316c1b04`; tamaño **7.192.465 bytes**. La descarga del candidato se comprobó por HTTP 200 y coincidencia exacta de bytes.

La batería local completa conserva su resultado original **76/79, `pass:false`**. Dos grupos no pudieron completarse por Firefox y WebKit ausentes. El tercero contenía expectativas del inventario de acciones anteriores al Volteo; tras actualizarlas para exigir las acciones previas y el perfil Flip, su ejecución focal aprobó **39/39** sobre los mismos bytes. Ese seguimiento no convierte la batería original en un resultado 77/79 ni en éxito local completo. El informe íntegro y el seguimiento se conservan en `evidence/local-validation/`. La navegación `file://` de Chromium quedó bloqueada por la política del navegador; las pruebas con bytes entregados sin conexión no se presentan como navegación de archivo verificada en Chromium. El grupo de entrega por archivo mediante Firefox forma parte de la batería remota aprobada. No se elude la política del navegador.

La verificación focal aprobó **63/63 casos Node**, con **14 testigos reproducidos**, y **30/30 comprobaciones del HTML en Chromium**. Las seis suites correctivas sumaron **240 casos**, incluidos los 63 del perfil Flip; son resultados que se solapan y no se suman como pruebas distintas. La auditoría técnica independiente aprobó **9/9** casos; sus microestados diagnósticos no acreditan historiales de juego. Estas comprobaciones complementan la aceptación remota del candidato exacto.

## Aceptaciones anteriores

R21 fue aceptada mediante [GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/42440271007) sobre el commit `c3c2ebeb9aaaf7df57481fdefadabf93292d66b3`: 77 grupos y comprobación estricta entre Chromium, Firefox y WebKit. Su HTML publicado en `5d1a44c4bca27ec81c78983bfa29a969813a15a8` tiene SHA-256 `3838c78ea58ec52af9019fbc5ad2f132db26b6022eb3d9c1ff939543d8894531`, 7.165.831 bytes y build `8e2f493167e60a1752237885db37d72063514109118aa937707e93c9819c4908`. Se conserva la evidencia original: la batería local completa R21 no se recuperó al reemplazar el ejecutor y no se le atribuye un resultado nuevo.

La revisión 20 conserva su [HTML publicado](https://github.com/socramgns/MODERN/raw/71b244b7594b5bae1f5042d1248bcf5fa4a50a64/Analizador_YuGiOh.html?download=1) y su [aceptación remota de 73 grupos](https://github.com/socramgns/MODERN/actions/runs/42337909290). Su resultado local original permanece en 71/73 con `pass:false`; sus limitaciones se conservan en el historial.

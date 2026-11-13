# Analizador de barajas Yu-Gi-Oh · revisión 22 en validación

La entrega sigue siendo **un único Analizador_YuGiOh.html sin comprimir**, con catálogo y cálculo incorporados. La revisión 22 integra la Invocación por Volteo y un perfil FLIP de Magician of Faith. Su aceptación depende de las pruebas y de comprobar que la descarga contiene los mismos bytes que el HTML validado.

[Descargar la revisión 21 aceptada](https://github.com/socramgns/MODERN/raw/5d1a44c4bca27ec81c78983bfa29a969813a15a8/Analizador_YuGiOh.html?download=1)

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

El [estado del proyecto](docs/ESTADO_PROYECTO.md) conserva los 32 criterios. Los [pendientes de R22](docs/ANALISIS_PENDIENTES_REVISION22.md) separan el alcance nuevo de su aceptación. Las [referencias de Volteo](docs/REFERENCIAS_FLIP_REVISION22.md) son evidencia técnica secundaria: no autentican rulings oficiales TCG. La [auditoría de datos de R21](docs/AUDITORIA_DATOS_REVISION21.md) conserva las identidades y estadísticas todavía sin resolver.

## Última aceptación cerrada

R21 fue aceptada mediante [GitHub Actions](https://github.com/socramgns/MODERN/actions/runs/42440271007) sobre el commit `c3c2ebeb9aaaf7df57481fdefadabf93292d66b3`: 77 grupos y comprobación estricta entre Chromium, Firefox y WebKit. Su HTML publicado en `5d1a44c4bca27ec81c78983bfa29a969813a15a8` tiene SHA-256 `3838c78ea58ec52af9019fbc5ad2f132db26b6022eb3d9c1ff939543d8894531`, 7.165.831 bytes y build `8e2f493167e60a1752237885db37d72063514109118aa937707e93c9819c4908`. Se conserva la evidencia original: la batería local completa R21 no se recuperó al reemplazar el ejecutor y no se le atribuye un resultado nuevo.

La revisión 20 conserva su [HTML publicado](https://github.com/socramgns/MODERN/raw/71b244b7594b5bae1f5042d1248bcf5fa4a50a64/Analizador_YuGiOh.html?download=1) y su [aceptación remota de 73 grupos](https://github.com/socramgns/MODERN/actions/runs/42337909290). Su resultado local original permanece en 71/73 con `pass:false`; sus limitaciones se conservan en el historial.

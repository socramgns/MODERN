# Contraste de fuentes oficiales

La revisión del **26 de octubre de 2026** recuperó mediante HTTPS normal la lista de la base de datos oficial y la página principal de construcción de barajas. La primera publica fecha efectiva **19/10/2026**. Se cotejaron sus **255 nombres restringidos**, sus límites (**156 prohibidas, 92 limitadas y 7 semilimitadas**) y la fecha con la tabla incorporada: coinciden sin sustituir identidades por similitud textual.

La lista usa secciones Neuron, no una tabla HTML convencional. El verificador ahora comprueba las cuatro secciones, títulos, fecha y recuentos por sección, nombres y enlaces CID únicos. Los rótulos de cambios de estado no se confunden con el límite actual de una carta.

Los bytes originales y el recibo de la misma consulta cotejada se conservan en `src/data/official/tcg-2026-10-19.html` y `src/data/official/tcg-2026-10-19-receipt.json`. El resumen `src/data/official-context-verification.json` liga la revisión a sus hashes y al contenido de la tabla incorporada. `dist/r6-official-comparison.json` contiene el contraste detallado. Un recibo guardado registra esa revisión; importarlo después no repite la autenticación HTTPS.

**El alcance es la publicación fechada, sus nombres y límites.** No autentica passcodes, disponibilidad por formato, todos los textos de cartas o rulings, ni demuestra que no exista una publicación posterior. La puntuación competitiva permanece provisional.

## Historial de acceso y pendientes

El 22 de octubre de 2026 el proxy rechazó las conexiones HTTPS con `Tunnel connection failed: 403 Forbidden` antes de recibir contenido de Konami. Se intentaron las tres publicaciones directas siguientes:

- Lista Forbidden & Limited de la base de datos oficial TCG.
- Página oficial de cartas limitadas TCG.
- PDF oficial del reglamento en inglés.

Las URLs, errores y fechas históricos están en `dist/official-verification.json`; el nuevo intento está en `dist/r6-official-verification.json`. No fue un rechazo de aprobación automática del agente. No se intentó eludir el bloqueo ni se sustituyó una fuente oficial por una copia de procedencia desconocida.

La consulta del PDF del reglamento redirige al dominio oficial `img.yugioh-card.com`; el acceso a ese archivo volvió a recibir HTTP 403. El verificador permite únicamente la ruta pública de descargas observada en ese dominio y mantiene TLS y validación de cada redirección. La captura del reglamento y la revisión de rulings restantes siguen pendientes. La revisión 7 sí conserva tres FAQ oficiales OCG de Mechaba, con el alcance específico descrito más abajo. El catálogo CDB fijado por commit y SHA-256 conserva su carácter de fuente técnica secundaria. El contraste de la lista no modificó sus límites ni creó resultados competitivos.

## Referencias de Mechaba incorporadas en la revisión 7

La fuente incluye tres respuestas de la base de datos oficial **OCG, en japonés**, vinculadas a Mechaba (CID oficial 12849; passcode técnico 75286621):

| FAQ | Criterio documentado |
| --- | --- |
| [16041](https://www.db.yugioh-card.com/yugiohdb/faq_search.action?ope=5&fid=16041&request_locale=ja) | Pankratops que se tributa como coste tiene su activación negada, pero no se destierra desde su nuevo destino |
| [22388](https://www.db.yugioh-card.com/yugiohdb/faq_search.action?ope=5&fid=22388&request_locale=ja) | Una fuente activada en mano y enviada al GY como coste permanece allí tras la negación; la respuesta enumera a Mechaba entre las cartas con el mismo tratamiento |
| [23949](https://www.db.yugioh-card.com/yugiohdb/faq_search.action?ope=5&fid=23949&request_locale=ja) | El destierro asociado depende de que la fuente permanezca en su lugar de activación |

`src/data/mechaba-ruling-references.json` conserva las URLs, jurisdicción OCG, campos y citas japonesas, con sus SHA-256. Los documentos originales y los metadatos de captura están en `src/data/official/mechaba-faq-*.html` y `*.metadata.json`. Las explicaciones españolas acompañan a esas citas; no son evidencia primaria.

`tools/mechaba_references.py` vuelve a comprobar bytes, campos, citas, identidad y alcance, sin red. `tools/build.py` incorpora la referencia validada en `YGO_RULE_REFERENCES` y en el manifiesto. El panel **Referencias de Mechaba y los costes** muestra los enlaces y explicaciones. La [aceptación local de revisión 7](https://github.com/socramgns/MODERN/blob/719897b2f9880507b15068c4a5ca9e1a3a02d038/evidence/validation-summary.json) comprende sus bytes y su comprobación documental. La [aceptación local de revisión 8](https://github.com/socramgns/MODERN/blob/b1a478d95020a7a718b2de0ef01b7793013058fd/evidence/validation-summary.json) también comprende sus propios bytes finales, referencias y comprobaciones documentales; su [CI remoto](https://github.com/socramgns/MODERN/actions/runs/40599777991) terminó correctamente. Estos resultados no acreditan revisión 9.

El alcance declarado es `TCG_REFERENCE_NOT_TCG_RULING_CERTIFICATION`: documenta el criterio utilizado por los paquetes registrados del analizador TCG y conserva su autoridad original OCG. No certifica todos los rulings TCG, los efectos de Pankratops o Maxx “C” en el simulador, los pools ni los resultados competitivos. Un recibo guardado describe la captura HTTPS; su comprobación local posterior no vuelve a autenticar ese transporte.

## Aplicación de estas referencias en la revisión 8

La revisión 8 conserva el criterio de lugar de activación para los nuevos paquetes Crow/Droll desde mano. Que su coste los lleve al GY no convierte su efecto en una activación de GY ni permite el destierro asociado desde ese nuevo destino. Las citas anteriores no se presentan como certificación universal de esos efectos, de sus ventanas o de todos los rulings TCG; la revisión 8 no afirma una captura documental oficial nueva para completar esos apartados.

La comprobación de documentos y las pruebas del motor son evidencias distintas. La [ejecución remota de revisión 7](https://github.com/socramgns/MODERN/actions/runs/40558997215/job/122382622102) terminó **cancelada** al superar 30 minutos durante «Instalar herramientas de comprobación», antes de ejecutar las pruebas del analizador. No es un CI aprobado ni demuestra un fallo de reglas de la aplicación. La revisión 8 separó las etapas de instalación y añadió caché; su [ejecución remota](https://github.com/socramgns/MODERN/actions/runs/40599777991) terminó correctamente. Esa aprobación no sustituye el resultado remoto de revisión 9.

## Alcance documental de las Mágicas de Campo de revisión 9

La revisión 9 pasó **48/48 grupos de pruebas** sobre el HTML final y la comprobación de sintaxis de **114 archivos JavaScript**. Chromium, Firefox y WebKit aprobaron sus comprobaciones; Firefox completó también la apertura directa del HTML local sin conexión. Build `b2e655dc990e6951cf886945774c028ac97a3e55c4f84010a1edb9942f1b0ba7`; SHA-256 `0976989809a5c2c96404149679d4806a89d13a6e3efa61c500e94da3a9793a2b`; tamaño **6.951.935 bytes**. Estos resultados acreditan las tareas ejecutadas dentro del alcance registrado.

La [ejecución remota de revisión 9](https://github.com/socramgns/MODERN/actions/runs/40614521563) terminó **correctamente** para el commit `213d323f05fbb57cffce8b19a36afa6f132a989a`. La publicación y la descarga HTTP conservan sus propios registros.

Se intentó consultar el PDF oficial del reglamento y una FAQ oficial pertinente a activación/reemplazo de Mágicas de Campo; las consultas recibieron HTTP 403. Son fallos de acceso HTTP, no rechazos de aprobación automática. No se presenta contenido no recibido como documento cotejado ni se afirma una captura oficial nueva para cerrar estas reglas.

Las FAQ OCG japonesas 16041, 22388 y 23949 guardadas desde revisión 7 muestran casos de efectos de monstruos y su lugar de activación. Conservan ese alcance y el criterio documentado de Mechaba; no certifican por sí solas el reemplazo de Field Spells, su zona de activación ni el tratamiento de una carta Mágica cuya activación fue negada. Las explicaciones españolas siguen siendo traducciones explicativas, no evidencia primaria.

La implementación y sus pruebas registradas son evidencia del comportamiento del modelo, separada de una certificación documental TCG. Mausoleum of White y Sanctuary conservan identidades y textos técnicos de la fuente CDB fijada; no se transforma esa procedencia secundaria en fuente oficial. La revisión completa del reglamento y los rulings restantes permanecen pendientes.

## Herramienta entregada

`tools/verify_official.py` permite:

1. Consultar URLs oficiales HTTPS mediante TLS validado, sin cambiar certificados ni transportes.
2. Capturar bytes originales y una plantilla de metadatos para su revisión.
3. Comparar una tabla de restricciones completa o las secciones Neuron con el snapshot incorporado o uno aportado.
4. Detectar diferencias de nombres, límites y fecha, además de identidades duplicadas.
5. Revisar documentos HTML, texto o PDF. Los PDF requieren `pdftotext`; sus bytes originales quedan ligados por SHA-256.

Los nombres conservan la puntuación y los símbolos significativos. Por ejemplo, `★` y `☆` no se consideran intercambiables. La coincidencia de conteos sin coincidencia de identidades se rechaza. Las filas con límite desconocido no se convierten en cartas sin restricción.

## Uso con acceso HTTPS normal

Para registrar consultas sin modificar la aplicación:

```sh
python3 tools/verify_official.py probe --output dist/official-verification.json
```

Para capturar una publicación y preparar sus metadatos:

```sh
python3 tools/verify_official.py capture \
  'https://www.yugioh-card.com/en/limited/' \
  --document /tmp/publicacion-oficial.html \
  --metadata /tmp/publicacion-oficial.json
```

La captura deja vacíos la fecha efectiva, su cita y el revisor; `complete` queda en `false`. Completa esos datos leyendo el documento real. Una captura no cierra por sí sola la revisión.

Cuando una página HTML tenga una tabla reconocible con columnas `Card Name` y `Advanced Format`, o las cuatro secciones Neuron completas, se puede consultar y comparar en el mismo proceso. Esta es la consulta realizada; fecha y cita se observaron en el documento:

```sh
python3 tools/verify_official.py compare-url \
  'https://www.db.yugioh-card.com/yugiohdb/forbidden_limited.action?request_locale=en' \
  --effective-date 2026-10-19 \
  --date-witness 'Status Updated 10/19/2026' \
  --complete-table \
  --document /tmp/lista-original.html \
  --metadata /tmp/recibo-y-contexto.json \
  --output /tmp/contraste-oficial.json
```

Una nueva consulta debe revisar la fecha y cita de esa publicación antes de reutilizar los argumentos. Si el documento anuncia otra fecha, el resultado informa la discrepancia. Las opciones `--document` y `--metadata` conservan los mismos bytes y entradas de revisión usados en ese proceso. Las redirecciones que abandonen las autoridades oficiales permitidas se rechazan antes de seguirlas.

## Uso con un documento local

```sh
python3 tools/verify_official.py compare \
  --document /ruta/publicacion.html \
  --metadata /ruta/metadatos.json \
  --output /tmp/contraste-local.json
```

Los metadatos necesitan `sourceUrl`, `sha256` de los bytes originales, `format: "tcg"`, `effectiveDate`, una `dateWitness` exacta, `contentType` y `complete: true`. Para texto o PDF también necesitan `reviewer.name`, `reviewer.reviewedAt` con zona horaria, y `rows` con `name`, `max` y `witness` por carta. Cada cita debe existir en el texto e identificar la carta y su límite sin ambigüedad. No basta con que aparezcan en lugares separados del documento.

`--snapshot /ruta/snapshot.json` permite comparar contra un snapshot propio con `format`, `effectiveDate` y `data: [{"name": "...", "max": 0}]`. Si no se proporciona, se lee la tabla incorporada como una afirmación de la aplicación, sin ejecutar su JavaScript.

El código de salida es `0` para una comparación coincidente, `1` para discrepancias y `2` para entrada inválida o fallo de acceso. Un resultado coincidente con un archivo local conserva `transportAuthenticatedInThisRun: false`; una URL o un recibo externo no autentican el origen. Una consulta TLS directa en el mismo proceso acredita el transporte y la tabla leída, pero no prueba que sea la publicación más reciente, todos los passcodes, todos los pools o todos los rulings.

## Pruebas y pendiente externo

```sh
python3 tests/official_validation.py
```

Las **29 regresiones** usan documentos sintéticos identificados como tales. Cubren hash, fechas, nombres, límites, citas, PDF, redirecciones, discrepancias, ausencia de mutaciones y estructura completa de Neuron. Son pruebas del verificador; la evidencia oficial es la captura HTTPS cotejada y registrada aparte.

Siguen pendientes la revisión completa del reglamento, los rulings restantes, los passcodes oficiales y la disponibilidad correspondiente a cada formato o evento. Las tres FAQ OCG citadas son evidencia específica con un alcance propio; no cierran esas tareas generales. No se generaron pools supuestamente verificados a partir de fechas inferidas ni de flags CDB. El importador de calibración competitiva permanece preparado y provisional por decisión del usuario; no se crearon etiquetas de torneo para completar este apartado.

## Alcance documental de los objetivos y su seguimiento

La ampliación de objetivos de Mágicas/Trampas distingue copias propias boca arriba y colocadas, incluidas las Mágicas de Campo. Es un contrato de selección y comprobación de estados; no constituye una fuente documental nueva ni amplía por sí solo los efectos registrados. Las capturas y referencias anteriores conservan sus alcances originales. La [aceptación del HTML de revisión 10](https://github.com/socramgns/MODERN/blob/bfa5d3cd6fd307e529ab68d9b15469b558e8a9d1/evidence/validation-summary.json) conserva su propio build y hash. El seguimiento de objetivos de revisión 11 deriva requisitos del estado y objetivo validados; tampoco añade una fuente documental ni certifica la historia del campo declarado. Su aceptación se identifica por separado en [ESTADO_PROYECTO.md](ESTADO_PROYECTO.md).

## Alcance documental de la Trampa registrada en revisión 12

La activación directa de Infinite Impermanence utiliza el texto y la identidad de la fuente técnica fijada y un paquete de reglas implementado y comprobado por la aplicación. No se presenta esa fuente CDB como una nueva captura oficial primaria ni como certificación general de prioridad, cadenas, Damage Step o todas las Trampas. Las FAQ OCG conservadas de Mechaba documentan casos de monstruos y su lugar de activación; no amplían automáticamente su evidencia a los casos nuevos de Trampa.

Las comprobaciones de origen, copia, columna, costes, negación, limpieza y replay se acreditan con los informes del HTML correspondiente. La corrección del proveedor de respuesta ante una columna ya negada se verifica como regresión del modelo; no se presenta como una captura oficial nueva. La aceptación local y CI de revisión 11 se consultan en su commit y ejecución propios; no acreditan los bytes nuevos. La aceptación de revisión 12 se identifica separadamente en [ESTADO_PROYECTO.md](ESTADO_PROYECTO.md). La puntuación competitiva permanece provisional y no se crearon resultados externos de torneo para validar esta ampliación.

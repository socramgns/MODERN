# Datos y formatos R24

Se conserva el catálogo de **21.986 registros** y el expediente de **181 incidencias**: 98 identidades sin cotejo, 51 monstruos con estadísticas desconocidas y 32 propuestas. C27, C28 y C29 permanecen abiertos. Esta revisión añade evidencia obtenida, un flujo de importación verificable y correcciones de construcción; no atribuye equivalencia de passcodes a una coincidencia de nombre.

## Fuentes consultadas y resultado real

El 20 de noviembre de 2026 se repitió una única consulta HTTPS a la base oficial de cartas y otra a la página oficial de listas dentro del contexto de red requerido. Ambas terminaron en **CONNECT 403 antes de recibir contenido del origen**. Se mantuvieron la validación TLS y el proxy. Las primeras pruebas dentro del sandbox devolvieron `Operation not permitted` y un fallo de conexión al proxy; se registran por separado porque no describen la política efectiva de red. No se volvió a intentar el mismo acceso tras el 403.

La lectura pública nativa de Git sí permitió obtener HEAD de `ProjectIgnis/BabelCDB`: `3d673dfe3b90471022cf11898e8ebe53443c8f17`. Se descargaron las cinco CDB de esa revisión inmutable por HTTPS y se verificaron sus bytes, SHA-256, SQLite y passcodes exactos. Son **fuentes técnicas secundarias**, no publicaciones oficiales de Konami.

| Archivo | Registros | SHA-256 | Coincidencias exactas de las 98 identidades |
| --- | ---: | --- | ---: |
| cards.cdb | 14.794 | `3aab211ae722881dad79fe25fb5d5c9636d3e5d03e8e3ca3e52078ca79666fa7` | 0 |
| cards-rush.cdb | 3.667 | `77f2f077ffb3f97afde2dd5be208fed1685f4a23cdcba48b2b2eee91637a8401` | 0 |
| cards-skills.cdb | 208 | `4bb2e1ad111d780a9dc217e865c3a915c4a8ea6606ea60c7141646c0ed443009` | 0 |
| cards-unofficial.cdb | 5.880 | `63a989e31a349fb2f127330007671267e1a6538488570f49636344e62db699b0` | 0 |
| cards-skills-unofficial.cdb | 19 | `d64bd027d347e3aa0bad2ab00af3d4749623542ab4323f5c1ce43593e674d933` | 0 |

También se verificaron de nuevo las cinco CDB incorporadas del commit `ae5dedb957c2c48ab86554fee08a0fca73d8b1cf`, sus hashes, integridad y ausencia de esos passcodes. El cotejo nuevo amplía la fuente secundaria respecto a R23, pero sigue sin proporcionar valores para las 51 identidades exactas. **Correcciones reales sustentadas: 0; estadísticas transferidas por nombre: 0; migraciones aplicadas: 0.**

Los recibos están en `src/data/review/revision24/official-transport.json`, `secondary-source-recheck.json` y `pinned-source-recheck.json`. `current-source-reviewed.json` contiene el expediente generado contra la nueva CDB principal: 98 registros preservados, cero coincidencias y cero parches admitidos. Las CDB originales descargadas se conservaron en `/tmp/r24-babelcdb` durante esta sesión; los recibos contienen URL inmutable, tamaño y hash para recuperarlas después. La presencia de un hash en el expediente no certifica por sí misma quién publicó un archivo local.

## Importación de evidencia y copia revisada

En «Calidad de los datos» se puede **exportar la solicitud de evidencia exacta**. Incluye los 98 passcodes originales, tipos, estadísticas originales, campos ausentes, candidatos y hashes del catálogo y sus fuentes. Cero, `null` y marcadores técnicos se mantienen distintos. `YGODataQuality.verifyDataEvidenceRequest()` vuelve a comparar íntegramente la solicitud con el catálogo cargado. `YGODeckIdentityReview.catalogueEvidenceRequest(source)` restringe la solicitud a las identidades presentes en una fuente de baraja vinculada a su huella.

El comando `src/data/review/revision24/import_reviewed_data.py` usa Python 3 con `sqlite3.Connection.deserialize`. Funciona sin red y exige el archivo CDB original. Tiene dos pasos explícitos:

```bash
python src/data/review/revision24/import_reviewed_data.py prepare \
  --source /tmp/r24-babelcdb/cards.cdb \
  --sha256 3aab211ae722881dad79fe25fb5d5c9636d3e5d03e8e3ca3e52078ca79666fa7 \
  --url https://raw.githubusercontent.com/ProjectIgnis/BabelCDB/3d673dfe3b90471022cf11898e8ebe53443c8f17/cards.cdb \
  --revision 3d673dfe3b90471022cf11898e8ebe53443c8f17 \
  --reviewer 'Revisión técnica' \
  --reason 'Cotejo por passcode exacto; conservar la incertidumbre oficial.' \
  --output /tmp/revision-exacta.json
```

`prepare` verifica el SHA-256 del catálogo contra el manifiesto y el SHA-256 de los bytes originales de la CDB. Consulta exactamente esos bytes en SQLite de memoria con `query_only` y `trusted_schema=OFF`, evitando reabrir un archivo que pudiera cambiar entre el hash y la extracción. Comprueba integridad, passcodes únicos y tipo. Sólo propone completar campos estadísticos ausentes de **ese mismo passcode y tipo**. Una diferencia con un valor ya conocido preserva todo el registro; `NULL` no aporta una cifra. No cambia nombres, fuentes heredadas, tipos ni identidades.

Tras revisar el expediente, el segundo comando exige su huella exacta:

```bash
python src/data/review/revision24/import_reviewed_data.py apply-copy \
  --source /ruta/a/la/fuente-original.cdb \
  --review /tmp/revision-exacta.json \
  --accept-review HUELLA_SHA256_DEL_EXPEDIENTE_REVISADO \
  --output /tmp/catalogo-copia-revisada.json
```

`apply-copy` vuelve a verificar fuente, catálogo, manifiesto y cada campo del expediente antes de producir la copia. Rechaza huellas incorrectas, valores inventados, certificaciones alteradas, cambios de fuente, claves JSON duplicadas y salidas existentes. Publica el archivo completo de forma atómica, sin sobrescribir archivos ni escribir dentro de `src`. La copia contiene sus 21.986 identidades originales y la procedencia de cada campo aplicado. Su formato es `ygo-reviewed-catalogue-copy/v1`; no se incorpora automáticamente a la aplicación ni modifica la baraja. Requiere una revisión de entrega independiente para convertirse en datos de una versión futura.

**El expediente real de esta revisión tiene cero parches:** el comando de copia lo rechaza con `EMPTY_REVIEW_NO_SUPPORTED_CHANGES`. Los casos positivos de la suite emplean CDB sintéticas claramente identificadas para demostrar el contrato de importación, sin atribuir sus cifras a cartas reales. No existe una ruta para registrar una nota y hacerla pasar por evidencia oficial.

## Construcción por formato

Se mantienen los diez formatos y el alcance de construcción. Las reglas de turnos del simulador continúan teniendo su propio alcance. La tabla resume los límites modelados; no autentica pools, listas ni reglas de evento actuales.

| Formato | Main | Extra / Fusion Deck | Side | Evidencia específica pendiente |
| --- | --- | --- | --- | --- |
| TCG Advanced | 40–60 | 15 | 15 | Pool regional y lista fechada |
| TCG Traditional | 40–60 | 15 | 15 | Lista fechada; prohibidas de Advanced limitadas a una copia en el modelo Traditional |
| OCG | 40–60 | 15 | 15 | Pool regional y lista fechada |
| Master Duel | 40–60 | 15 | 0 | Pool y lista de la versión digital |
| Duel Links Speed | 20–30 | Según desbloqueo o Skill declarado | 0 | Pool digital, límite de Extra y construcción de Skill |
| Duel Links Rush | 30–40 | Según desbloqueo o Skill declarado | 0 | Pool digital, Extra, Skill y Legend |
| Rush físico | 40–60 | 15 | 15 | Pool Rush, lista y metadatos Legend |
| Speed Duel físico | 20–30 | 6 | 6, incluidas Skills | Impresión admitida y restricciones del evento |
| GOAT | 40–60 | Fusion Deck sin límite de formato | 15 | Pool histórico y lista aplicable a la fecha |
| Time Wizard | 40–60 | Regla histórica declarada | 15 | Fecha, pool, lista y reglas de construcción de ese periodo |

Las correcciones R24 impiden ampliar el Extra fijo mediante una cifra importada y crear un Side Deck digital mediante `event.sideMax`. Un evento puede reducir el Side dentro del máximo modelado. Los límites digitales de Extra malformados o superiores al tope técnico permanecen pendientes. El modelo Traditional transforma una prohibición de la lista declarada en máximo uno; el mismo registro sigue prohibido en Advanced.

Los tipos e identidades de las cartas se recuperan del catálogo conservado: una fila importada no puede disfrazar un monstruo como Skill ni introducir una Skill con passcode desconocido. Las Skills activas y de Side participan en las restricciones y presupuestos compartidos declarados. Las cantidades deben ser enteros reales.

Una lista futura, una versión distinta o una fecha inválida queda pendiente y **no se aplica como prohibición**. Un registro con passcode explícito sólo alcanza esa identidad o su familia técnica de alias; no añade otra por compartir nombre. Se rechazan fuentes URL inválidas, listas declaradas incompletas, passcodes coercibles y declaraciones «sin lista» que simultáneamente contienen restricciones.

El diagnóstico conserva dos decisiones independientes: pertenencia al pool y restricción de copias. No tener prueba de disponibilidad no inventa una prohibición; no aparecer en una lista no demuestra disponibilidad. Una Skill, impresión Speed Duel, regla Legend o pool importado sigue siendo una declaración pendiente de autenticar. `officialIdentityCertified`, `officialAvailabilityVerified`, `currentListProven` y la certificación competitiva permanecen en falso.

## Verificación y límites

`node tests/data_formats_r24.cjs` cubre solicitudes vinculadas a la fuente, recibos reales, importación de CDB exacta, copia transaccional, conservación de valores y rechazos de alteraciones, además de las correcciones de los diez formatos. Las suites previas `formats`, `data_review_r23`, `data_quality` y `deck_identity_review` siguen comprobando la compatibilidad. Los resultados concretos se guardan en los JSON de pruebas; no representan autenticación oficial ni aceptación humana de la entrega.

La puntuación competitiva sigue provisional por elección del usuario (C32); no bloquea esta revisión. La evidencia aún necesaria para cerrar C27–C29 incluye identidades y estadísticas primarias exactas, pools fechados y reglas completas de los formatos y eventos correspondientes.

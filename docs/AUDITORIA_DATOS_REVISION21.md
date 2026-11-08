# Auditoría de fuentes de datos de la revisión 21

Esta auditoría amplía la comprobación de las identidades pendientes a las cinco bases CDB fijadas que ya utiliza el proyecto. No cambia el catálogo, la baraja, las propuestas ni las estadísticas. C27, C28 y C29 permanecen pendientes; la puntuación competitiva sigue provisional.

## Comprobación reproducible sin red

Desde la raíz de las fuentes:

```sh
python tools/audit_unresolved_sources.py --output dist/unresolved-source-audit.json
```

La herramienta necesita los cinco archivos de `.cache/catalog/` correspondientes al commit `ae5dedb957c2c48ab86554fee08a0fca73d8b1cf`. No los descarga. Si falta alguno o no coincide su SHA-256, tamaño, integridad SQLite o número de registros, termina con error y no escribe un nuevo informe satisfactorio. El archivo de salida solo se escribe después de superar todas las comprobaciones; un informe de una ejecución anterior no debe sustituir la comprobación del código de salida actual.

El SHA-256 de `src/data/cards.json` debe coincidir con `src/data/catalog-manifest.json`: `cc265022039bba09fc31e8e3a48afb0030e5a81cab0c30c386843fcd75e1cba6`. También se comprueban el inventario de IDs, sus cantidades y la relación entre los datos ausentes y la lista del manifiesto.

La comprobación existente `tools/audit_catalogue.py` valida la CDB primaria y obtiene propuestas por nombre normalizado. Se reutiliza ese mismo oráculo para las propuestas; la nueva herramienta añade el contraste por ID exacto de las cinco fuentes y de todas las estadísticas ausentes. No duplica el flujo de selección de identidades de `src/app/deck-identity-review.js` ni el diagnóstico de `src/app/data-quality.js`.

## Resultado sobre los datos conservados

| Fuente técnica fijada | Registros contrastados | IDs heredados pendientes encontrados por ID exacto |
| --- | ---: | ---: |
| `cards.cdb` | 14.759 | 0 |
| `cards-rush.cdb` | 3.586 | 0 |
| `cards-skills.cdb` | 208 | 0 |
| `cards-unofficial.cdb` | 5.880 | 0 |
| `cards-skills-unofficial.cdb` | 19 | 0 |

Se conserva un catálogo de **21.986 registros**, con **21.888 IDs cotejados** y **98 IDs heredados ausentes por ID exacto de las cinco fuentes fijadas**. Los 98 se clasifican en 37 entradas heredadas de fuente no oficial, 21 Tokens o marcadores y 40 IDs temporales de prerelease que requieren revisión. Las categorías describen el dato heredado; no autentican los archivos originales que ya no están presentes.

Los **51 monstruos con estadísticas ausentes** pertenecen todos al conjunto de esos 98 IDs. De ellos, 28 declaran `cards-unofficial(2).cdb` y 23 declaran `prerelease-phhy.cdb`. Ninguna de esas dos declaraciones recibe la URL, el hash o las estadísticas de una fuente distinta. ATK, DEF o marcadores Link y nivel/rango/Link ausentes permanecen desconocidos.

Se reproducen **32 propuestas con 33 passcodes candidatos**, todavía sin aplicar. `Slime Token` (`511009215`) tiene dos candidatos y no se selecciona ninguno de forma implícita. La coincidencia de nombre no demuestra que las identidades, efectos o estadísticas sean intercambiables. Por ejemplo, los datos heredados de `Shell of Chaos` (`101111010`) y `Core of Chaos` (`101111011`) difieren del candidato en la bandera técnica `SPECIAL_SUMMON_ONLY`; el informe no usa esa comparación para reescribirlos.

La salida incorpora los cinco hashes y resultados SQLite, los 98 IDs con su clasificación, los campos estadísticos ausentes y los IDs candidatos únicamente para revisión. Su resultado satisfactorio acredita el contraste técnico indicado, sin cerrar criterios de resolución de identidad, estadísticas o disponibilidad oficial.

## Verificación de fallos

Se ejecutaron comprobaciones con copias temporales del manifiesto y enlaces de solo lectura a la caché; los datos originales no se modificaron. La herramienta rechazó:

- Un SHA-256 del catálogo incorrecto.
- Un SHA-256 de `cards-rush.cdb` incorrecto, una fuente secundaria que la auditoría primaria por sí sola no contrasta.
- Un contenido que no era SQLite, aunque el manifiesto temporal declarara su tamaño y SHA-256 correspondientes.
- Un ID duplicado en la lista de estadísticas desconocidas.
- La ausencia de `cards-rush.cdb` en la caché temporal.

Dos ejecuciones consecutivas sobre las fuentes válidas produjeron el mismo objeto de informe. Estas comprobaciones del auditor no sustituyen la batería funcional del HTML ni se contabilizan como pruebas de reglas del juego.

## Qué impide cerrar C27, C28 y C29

**C27, identidades y propuestas.** El inventario y los candidatos están contrastados, pero no hay evidencia que autentique los 98 passcodes heredados o establezca equivalencia con otro passcode. Hace falta revisar cada caso con una fuente que identifique explícitamente la carta y documentar la decisión. El flujo de copia revisada ya permite decisiones expresas sin sustituir la baraja activa; elegir una propuesta no acredita por sí solo equivalencia oficial.

**C28, estadísticas.** Los cinco snapshots fijados no contienen ninguno de los 51 IDs exactos afectados. Recuperar estadísticas de una carta con nombre similar atribuiría a una identidad los campos de otra. Para rellenarlos hace falta una fuente verificable del mismo passcode o una revisión de identidad debidamente documentada. Los campos desconocidos se conservan mientras tanto.

**C29, disponibilidad y reglas por formato.** La caché CDB es una fuente técnica secundaria. Los documentos oficiales incluidos cubren un snapshot TCG y las FAQ registradas de Mechaba, no todos los pools digitales, fechas históricas, impresiones Speed Duel, Skills, desbloqueos o reglas Legend anunciados. Los validadores existentes aceptan contexto y snapshots declarados y señalan lo pendiente. Completar ese criterio exige incorporar y revisar fuentes fechadas para cada formato; esta auditoría offline no las inventa.

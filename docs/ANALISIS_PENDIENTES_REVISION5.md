# Análisis de pendientes de la revisión 5

Auditoría realizada el 26 de octubre de 2026 sobre `2026.10-stable.5`.

- Build: `d4685fce7c87f47bd5a1251bf9c50fdaf97c4113872b6f37dc1fdaf283c1b814`.
- SHA-256 del HTML: `ff027e45f0610a06f8cb7f28bcc33227955cc5b9d989a09c4bd8b3edb330d933`.
- Publicación: commit `9aa6f48799af62f52635b9241556d3cc74c1c4db`, rama `entrega/analizador-yugioh-estable5`.
- Se confirmó el hash local y la concordancia de los informes de compilación, validación y publicación. El informe existente acredita 31/31 grupos aprobados; esta auditoría no repitió la batería completa.
- El HTML no se modificó durante esta auditoría.

## Resultado

La aplicación es utilizable dentro del alcance documentado. Importar y editar barajas, calcular estadísticas, conservar sesiones, exportar y reproducir acciones registradas ya funciona. La terminación de un analizador general requiere ampliar datos, efectos y ventanas, además de cerrar la comprobación del archivo descargado. No existe una base para asignar un porcentaje de terminación universal.

## 1. Ampliar el catálogo retenido — prioridad alta

El actualizador enriquece los passcodes heredados y añade coincidencias exactas de nombres restringidos. No importa automáticamente todos los registros nuevos de la fuente. Los 19.653 registros actuales mezclan varias fuentes y categorías; ese total no acredita cobertura completa de TCG.

Comparación local reproducida con `cards.cdb` fijado al commit `ae5dedb957c2c48ab86554fee08a0fca73d8b1cf`, SHA-256 `d5166c35296a6c65dcc0230c7bc0e9f25721639159b80fa78bf724be61183a6a`:

| Medida | Resultado |
| --- | ---: |
| Registros de la CDB principal | 14.759 |
| Passcodes de esa fuente ausentes del catálogo retenido | 2.333 |
| Ausentes con bandera técnica TCG y sin Token | 2.115 |
| Familias de alias no representadas en ese último grupo | 1.805 |

Los passcodes ausentes incluyen variantes; no son 2.333 cartas únicas. Las banderas técnicas de una fuente secundaria tampoco demuestran disponibilidad oficial para un torneo. Ejemplos ausentes sin alias: Magnum the Reliever (`43227`), Ultimate Flame Swordsman (`324483`) y Dark Magician the Magician of Black Magic (`342673`).

Evidencia: `tools/update_catalog.py:109-125`, `147-176`; `src/data/cards.json`; `src/data/catalog-manifest.json`. Consulta de comprobación: `SELECT d.id,t.name,d.ot,d.type,d.alias FROM datas d JOIN texts t USING(id)`. Se comparan IDs con `row[0]` y familias con `row[13] or row[0]` del JSON.

Aceptación: incorporar registros con identidad y procedencia comprobadas, conservar los passcodes existentes, resolver alias y revisar las 32 propuestas de migración sin sustituciones silenciosas; recompilar y verificar importación, búsqueda, restricciones y persistencia. Estar en el catálogo no añadirá automáticamente efectos al motor.

## 2. Verificar el contexto oficial — prioridad alta

La lista TCG incorporada afirma fecha 19/10/2026; el informe de procedencia no autentica esa publicación. `dist/official-verification.json` conserva cero documentos oficiales recuperados y rechazos HTTP 403 anteriores. Las pruebas documentales comprueban el analizador con casos sintéticos, no la veracidad de la lista.

Aceptación: cotejar una publicación oficial completa y fechada, su contenido y restricciones, y registrar la procedencia de textos, rulings y disponibilidad. Un contexto diferente no debe mezclarse silenciosamente con el motor causal. Para otros formatos siguen pendientes pools digitales/históricos, Skills, desbloqueos, Legend e impresión/evento.

## 3. Completar ventanas de activación y respuesta — prioridad alta

Se reprodujo un hueco con Spark y Mechaba: el mismo escenario físico ofrece cinco variantes de respuesta de Mechaba a Spark en MAIN 1, y ninguna en BATTLE, pese a conservar cinco monstruos aptos para pagar el coste.

Causa: `src/app/responses.js:20` limita `fieldEffect` a Main Phase; Mechaba lo utiliza en `:92`. Spark admite ventanas fuera de Main. Otros handlers de familia todavía están limitados a MAIN 1 y al jugador propio (`src/app/combo-engine.js:122`).

Aceptación: declarar ventanas y actor por handler; probar MAIN 2, Battle, Standby y End según cada efecto. Veiler debe conservar su restricción a Main rival y Damage Step requiere reglas propias.

## 4. Completar cartas y cadenas — prioridad alta para ampliar el simulador

Las seis familias tienen rutas parciales. Faltan, entre otros, la protección GY de Balelynx, la Invocación Especial de Gazelle, el efecto GY de Shthana y la activación de Roar como Counter Trap. Mechaba no cubre activaciones de Field Spells, Trampas ni todas las zonas de efectos de monstruos. Spark no acumula protecciones pendientes de varias copias sobre un mismo objetivo.

Evidencia: `src/app/coverage.js:24-48`, `src/app/responses.js:85-100`, `docs/ALCANCE_COMBOS.md`.

Falta un motor más general de eslabones, prioridad y respuestas a respuestas. También quedan mecánicas de Damage Step, Flip, ataques múltiples y Pendulum fuera del alcance actual. Cada ampliación necesita costes, destinos, restricciones y replay físico, además de pruebas específicas.

## 5. Cerrar la distribución como archivo HTML — prioridad alta de entrega

La descarga pública fue verificada y coincide con el HTML probado. Chromium pasó las comprobaciones de arranque y uso sin Internet sobre los bytes entregados. Sigue pendiente el flujo descargar → doble clic → importar → calcular → guardar → reabrir, porque la política del navegador de pruebas bloquea la navegación directa `file:`.

Firefox y WebKit siguen sin comprobar. La comprobación móvil actual mide desbordamiento en un viewport de 390 × 844; no certifica interacción táctil ni dispositivos reales. Faltan verificaciones por tareas de teclado, foco, contraste y lector de pantalla.

Evidencia: `tests/compatibility-results.json`, `tests/compatibility_browser.py:94-169`, `README.md:3`.

## 6. Facilitar el laboratorio — prioridad media

Los objetivos personalizados todavía requieren JSON. La preparación visual de campo crea únicamente colocaciones de monstruos. Algunas acciones muestran identificadores internos por falta de etiquetas, y el selector muestra las primeras 500 acciones sin explicar el recorte.

Aceptación: formularios de objetivos, preparación de Mágicas/Trampas y zonas, etiquetas claras y filtros/recuentos. Son mejoras de uso; no se demostró un cálculo incorrecto por estos puntos.

Evidencia: `src/app/advanced-workbench.js:27-50,63-66`.

## 7. Mejorar los informes de búsqueda e incertidumbre — prioridad media

La búsqueda puede terminar en su profundidad máxima con `enumerationComplete:true` y `truncated:false`. La interfaz aclara que se completó el horizonte declarado; el muestreo actual no convierte automáticamente una búsqueda vacía en una derrota. Conviene distinguir explícitamente agotamiento del horizonte, tiempo, estados y turnos.

Aceptación: registrar los límites alcanzados y describir la completitud dentro del dominio correspondiente. Continuar después de barajar exige ramas probabilísticas u otro tratamiento explícito de incertidumbre; no se debe inventar el siguiente robo.

Evidencia: `src/app/combo-engine.js:157-164`, `src/app/combo-workbench.js:40-42`, `src/app/strategy.js:277-293`.

## 8. Calibración y mantenimiento

La puntuación competitiva sigue estructural y provisional por decisión del usuario. El importador, la deduplicación y la separación entre ajuste y validación ya existen. Su validación externa requiere barajas y resultados reales con formato, banlist y procedencia; no bloquea continuar desarrollando el HTML.

La rama publicada contiene el HTML y un README heredado de Angular ajeno al analizador. La fuente modular, documentación y pruebas están conservadas localmente y en el respaldo ZIP, pero aún falta versionarlas y automatizar sus comprobaciones. Es compatible con mantener un único HTML como entregable final.

## Orden recomendado

1. Ampliar el catálogo y comprobar el contexto oficial.
2. Corregir las ventanas de respuestas y MAIN 2; cubrirlas con escenarios reproducibles.
3. Verificar el archivo local descargado y simplificar el laboratorio.
4. Completar efectos de las familias existentes antes de aumentar el número de familias.
5. Ampliar cadenas, incertidumbre y mecánicas por etapas.
6. Versionar la fuente y automatizar las pruebas, manteniendo el HTML único.
7. Calibrar competitivamente cuando haya evidencia externa real.

La aceptación de una próxima entrega debe basarse en estos resultados concretos y en los informes de sus propios bytes, no en un porcentaje global ni en el número de pruebas de una compilación anterior.

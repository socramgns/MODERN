# Analizador de barajas Yu-Gi-Oh · revisión 6

La entrega es **un único `Analizador_YuGiOh.html`**, con el catálogo y los motores incorporados.

[Descargar el HTML](https://github.com/socramgns/MODERN/raw/refs/heads/entrega/analizador-yugioh-estable6/Analizador_YuGiOh.html?download=1)

## Cómo usarlo

1. Guarda el archivo con extensión `.html` y ábrelo en un navegador reciente. Si el enlace muestra código, usa **Guardar como** y conserva el nombre `Analizador_YuGiOh.html`.
2. Importa una baraja JSON o YDK en **Baraja y zonas por formato**. Revisa sus incidencias y pulsa **CALCULAR**.
3. Para aprender el laboratorio, abre **Probar un ejemplo incluido** y pulsa **Cargar ejemplo en el laboratorio**. Cargar un ejemplo sustituye la baraja actual.
4. Revisa **Acciones registradas de esta baraja** para conocer qué efectos reconoce el motor.
5. Exporta JSON para conservar todos los datos y el contexto. YDK conserva Main, Extra y Side; no transporta Skills.

El catálogo y los cálculos incorporados funcionan sin Internet. Las imágenes y actualizaciones remotas requieren conexión. La sesión se guarda en ese navegador/origen; no sincroniza dispositivos. Conviene exportar una copia de la baraja.

## Qué incluye

- Catálogo de **21.986 registros**, con los **14.759 passcodes** de la fuente técnica principal fijada representados y los registros anteriores conservados.
- Importación, edición, biblioteca, estadísticas, probabilidades y exportaciones.
- Rutas registradas de Invoked, Swordsoul, Branded, Blue-Eyes, Tenyi y Salamangreat, con copias físicas, costes, límites de uso y reproducción de los pasos.
- Laboratorio de fases, campos declarados, respuestas y comparación de escenarios.
- Diagnóstico por carta y ejemplos guiados dentro del HTML.

La puntuación competitiva es **estructural y provisional**. El importador de calibración está preparado; requiere resultados externos reales para evaluar su validez competitiva.

El catálogo técnico no certifica disponibilidad oficial ni todos los efectos de sus cartas. Las rutas y respuestas tienen un alcance registrado; los efectos desconocidos no se inventan. Los datos, escenarios y documentos no comprobados se mantienen explícitos.

## Evidencia y desarrollo

El estado exacto de las comprobaciones se guarda en `dist/validation-summary.json` después de ejecutar las pruebas. Los informes identifican la compilación y el SHA-256 del HTML probado. Las comprobaciones parciales de navegadores o documentos no se presentan como cobertura universal.

- [Estado y pendientes](docs/ESTADO_PROYECTO.md)
- [Alcance de las reglas y las búsquedas](docs/ALCANCE_COMBOS.md)
- [Fuentes oficiales](docs/FUENTES_OFICIALES.md)
- [Compilación, datos y pruebas](docs/DESARROLLO.md)

La fuente y las pruebas se mantienen en el repositorio. GitHub Actions recompila el proyecto, compara el resultado con el HTML publicado y ejecuta las pruebas. La fuente puede ampliarse sin cambiar la entrega de un único archivo HTML.

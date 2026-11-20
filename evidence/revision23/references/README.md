# Referencias técnicas conservadas · R23

Este paquete conserva copias idénticas de los documentos técnicos utilizados para revisar prioridad, costes y límites de uso, efectos simultáneos, Damage Step, Xyz y Péndulo. Los prefijos `r23-priority-references/`, `r23-trigger-references/` y `r23-xyz-pendulum-references/` mantienen las rutas originales para que sus citas y recibos sigan siendo legibles.

Son referencias secundarias de implementación de ProjectIgnis/CardScripts y edo9300/ygopro-core. No constituyen nuevos rulings oficiales autenticados de Konami ni certificación oficial TCG. Los Lua, C++ y encabezados se conservan exclusivamente como documentos y no se ejecutan en el analizador ni durante este empaquetado.

`verification.json` registra el cotejo local de SHA-256 y tamaños contra los JSON originales, más la igualdad de los archivos de código seleccionados con los miembros de los archivos comprimidos ya conservados en el espacio de trabajo. No se hizo ninguna consulta de red. Los recibos originales mantienen sus fechas y afirmaciones históricas; este empaquetado no las convierte en una nueva autenticación.

Se incluyen seis archivos del núcleo citados por la revisión de límites de uso, los scripts de cartas y utilidad revisados, el único archivo con las tres apariciones documentadas de RestoreCountLimit y los documentos de los perfiles de Xyz/Péndulo y Librarian/Rush. No se incluyen los archivos `.tar.gz` ni el conjunto completo de 22.953 scripts. Tampoco se vuelve a ejecutar la revisión textual completa de ese conjunto.

`manifest.json` enumera cada original conservado y los metadatos nuevos con tamaño y SHA-256. El manifiesto se excluye de su propio inventario para evitar una autorreferencia de hash. Este paquete no modifica el repositorio ni los bytes del HTML compilado.

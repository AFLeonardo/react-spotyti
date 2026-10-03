## Prompt utilizado

Necesito crear una nueva feature donde **El usuario pueda crear una lista de reproducción personalizada.**
La funcionalidad que debe permitir:

1. Crear una nueva playlist.
2. Asignarle un nombre.
3. Agregar canciones existentes de la aplicación.
4. Visualizar la playlist creada.
5. Mostrar las canciones que contiene.
6. Debe utilizar** React Native Paper.** Quiero agregar una nueva tab "Playlists" donde se muestran las playlist que el user ha creado.

# Plan propuesto por el agente

## Playlists personalizadas

### Problema y enfoque

Agregar una experiencia de playlists a la app Expo actual: el usuario podrá crear playlists con nombre y canciones del catálogo local, consultarlas desde una nueva tab y añadir canciones después. La información debe conservarse entre aperturas de la app.

La app ya usa React Native Paper, tiene navegación con `BottomNavigation.Bar`, y carga las canciones de `data.json`. Se usará almacenamiento local persistente apropiado para Expo SDK 54, guardando el nombre y los IDs de las canciones para reutilizar el catálogo en pantalla. La interfaz nueva seguirá los patrones del tema oscuro y usará componentes de React Native Paper.

### Tareas

1. Crear un contexto de playlists que cargue, exponga y persista playlists locales; cubrir estados de carga y errores de almacenamiento.
2. Crear la pantalla de Playlists: flujo de creación con nombre y selección de canciones, listado vacío/con contenido, detalle de playlist y opción para añadir canciones posteriormente.
3. Integrar el provider y la nueva tab «Playlists» sin alterar las tabs existentes ni la reproducción.
4. Validar la app con las herramientas disponibles y comprobar los cambios de navegación y persistencia.

### Consideraciones

- La persistencia será local al dispositivo; no hay backend ni identidad de usuario configurados en el proyecto.
- Cada playlist almacenará IDs de canciones, que se resolverán contra el catálogo existente.
- La creación puede permitir una playlist sin canciones; el detalle permitirá añadirlas más adelante.
- Mantener las playlists en un contexto separado del estado del reproductor y respetar el tema de Paper.
- Consultada la referencia versionada de Expo SDK 54 antes de implementar.

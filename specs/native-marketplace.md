# Native marketplace publication

The user explicitly requires publication to the CodexHost plugin market and supplied the official `codexhost-add-desktop-extension` guide. The traditional DSH-compatible client is insufficient for that publication.

- Provide root `manifest.json`, manifestVersion2, bilingual nonempty name/description/details, author, repository, categories and declared PNG assets.
- Declare only supported capability: Web entry `activate(api)`, self-contained ESM/CSS and no backend. Do not advertise Desktop/page/widget support that is unavailable.
- Use public WebExtensionApi panel/settings/storage/assets/signal/track surfaces. No private React/Cordis access, ModuleLoader bootstrap, private credential files, eval or Function constructor in native code.
- Reuse shared read-only insight UI/data safely inside an owned Shadow DOM, with complete disable/unmount cleanup and scoped styles. Public same-origin data reads only.
- Keep own language preferences independent of Host language/settings; expose a clear selector because the Web API lacks locale/current-thread information.
- Package a curated deterministic ZIP with the manifest, built native files, actual declared raster assets and licenses. Screenshots must be synthetic-data captures, not private conversations.
- Run parser/ZIP/static checks and isolated real Web import/enable/render/disable tests using separate data/port; stop test services and remove test data without touching live Host state.
- Publish a public stable GitHub Release with ZIP and matching individually uploaded images, then submit only the public repository URL through the official registry Issue Form. Native listing approval belongs to registry maintainers; do not claim approved/listed before it happens.
- Preserve optional compatibility installation as a distinct, clearly labeled format; do not call it the marketplace package.

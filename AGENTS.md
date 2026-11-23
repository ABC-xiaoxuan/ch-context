# ch-context

CodexHost context insight extension, forked from bowenliang123/dsh-context.

## Active targets

- Native market entry: `manifest.json` (`manifestVersion: 2`), `src/market/web.tsx`, prebuilt `web/index.mjs` and shadow-scoped `web/style.css`. Public `WebExtensionApi` only; bundle React and own all DOM/resources. Web-only, no backend.
- Optional compatibility entry: `src/codexhost/index.tsx`, `lib/client.js`, legacy DSH slots/ModuleLoader. It is not the native marketplace format.
- Shared UI/data: `src/codexhost/`. Inherited DSH source remains reference plus selected pure presentation imports; do not simulate its backend services.

The authoritative native development guide is `.agents/skills/codexhost-add-desktop-extension/SKILL.md` in BytePioneer-AI/codex-host. Follow its Host contracts, public APIs, ZIP packaging and isolated testing. Do not access Host-private React objects or credential files.

## Data and lifecycle

- Use authenticated, same-origin public client-channel reads; no fabricated zero values or prompt composition.
- Keep current occupancy, billed usage, loaded-window activity and observed samples distinct.
- Scope every async result to its Host/session and generation. Preserve older cuts until explicit latest/session change.
- Bound retained data, and dispose requests, readers, observers, storage subscriptions, React roots and owned DOM.
- Native entry uses an owned Shadow DOM and public API contributions. Never mutate native element styles/classes.
- Native language preferences are owned extension settings, not Host locale changes.

## Development and delivery

- English source/tests/developer docs; UI supports Chinese/English with fallback.
- No comments in new source/tests except required tooling directives. Each source/test file stays below 1000 lines.
- Temporary files belong in ignored `.tmp/`. Never publish real conversation captures or test credentials.
- `npm ci`, `npm run check`, `npm run test:browser`, `npm run test:market`, `npm run pack:market` are the workflow.
- Track deterministic prebuilt native and compatibility assets; CI checks source/artifact synchronization.
- Obtain independent code review before commits and resolve verified findings.
- Marketplace publication requires a curated native ZIP, matching individual image assets and a public stable GitHub Release, then the official registry's repository-URL submission. Do not claim listing until maintainers approve.
- Never change published ZIP bytes without a manifest version increase. npm publication is separate and not implied.
- Real native tests use a separate data directory and free port; never stop or replace the user's live Host.

## Attribution

Retain Apache-2.0, upstream history/credit, and bundled React/Marked notices. ch-context is an independent community extension, not an official CodexHost or DeepSeek product.

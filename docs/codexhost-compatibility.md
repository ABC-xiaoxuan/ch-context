# CodexHost compatibility

The native marketplace package follows the [official Host extension guide](https://github.com/BytePioneer-AI/codex-host/blob/main/.agents/skills/codexhost-add-desktop-extension/SKILL.md). Its contract is `manifestVersion: 2` with a **Web-only** `web` entry. Live native validation uses installed CodexHost **0.25.0** in a separate data directory and free port; no Desktop execution is claimed.

## Native entry

- `manifest.json` declares `web/index.mjs` and `web/style.css`, bilingual metadata, author, categories and raster assets.
- Standard ESM exports `activate(api)` and registers the main panel/settings through public `WebExtensionApi` contributions.
- React is bundled into the native entry and renders only owned nodes in an owned Shadow DOM. CSS selectors are shadow-scoped; a public body theme marker is mirrored only onto the owned host.
- The entry uses `api.assets.url`, `api.storage`, `api.signal`, `api.track`, `api.panels.register` and `api.settings.registerPage`. It does not access Host-private React/Cordis state or credential files.
- No `desktop`, `page`, `widget` or `backend` is declared. Targets therefore infer to `web` only. Native import/list verification confirms `backendState: none`.
- The public Web API does not expose current-thread or Host-locale subscriptions. Conversation selection is explicit. Auto language uses document/browser language; the extension-owned selector/settings persist independently of Host preferences.
- Every render/activation owns and releases its React root, shadow host, stylesheet link, observers, listeners and subscriptions. Disabling the extension removes its navigation and UI.

## Shared data contract

- All data reads use existing authenticated, same-origin browser-relative URLs, retaining proxy path prefixes.
- Usage: POST `api/ch/v1/rpc` with `codexhost/thread/usage/inspect`; GET `api/ch/v1/events` supplies invalidations. Absolute snapshots are reread; events are not summed into tokens.
- Conversation picker: POST `api/session/list`, following opaque cursors. Search is page-scoped.
- History: obtain `asOfSeq` from `api/session/projections`, then read `api/session/page`. Older reads preserve upper watermark and exclusive `beforeSeq`.
- Accepted-snapshot sequence drives latest-history refresh, independently of wall-clock precision. Refresh/Retry preserves an older cut; only Latest or changing conversations clears it.
- Native tool IDs/arguments/error flags and parent/fork/tree metadata are retained. Pairing requires unique ordered call IDs; ambiguous results remain unpaired. Subagent classification requires explicit origin evidence.
- Raw display/copy never reparses retained strings. Explicit errors are visible even without a matched call. HTML stays text, unsafe URL protocols are blocked and images do not fetch automatically.
- Current occupancy, billed usage, loaded-window activity and observed context samples have distinct scopes. Percent-only facts keep unknown counts unknown. Fractional credits and tiny costs retain nonzero display precision.
- Missing cache fields do not become zero; independently confirmed cache facts remain visible when full decomposition is unavailable.
- No exact prompt-section breakdown, historical per-request token curves, execution-phase durations or complete Fleet aggregate is inferred from this contract.

## Bounds

One displayed conversation page and history page are retained. History displays at most 200 events/8,000 characters each, with affected records marked. File/command counts describe observed attempts and exact supplied paths in that window. Context observations retain at most 120 changed samples for the selected conversation. Thread/generation changes abort stale HTTP work, event readers reconnect with bounded backoff, and unmount aborts all retained work.

## Optional compatibility entry

`lib/client.js` and `cordis.patch.yml` are a separate legacy DSH-compatible Web installation. It uses Host React/slots and provides the conversation tab plus a compatibility-labeled sidebar item. It is not the native market package. Only that optional embedded surface marks its owning conversation scroller to hide the ordinary composer; approval/review/question seats stay visible, and the mark is removed on cleanup.

Inherited standard-DSH sources/tests remain reference and selected pure display imports; they do not establish native Host extension compatibility.

## Verification and distribution

`npm run check` runs strict type checking, focused tests, both builds and native/compatibility validation. Browser fixtures exercise linked inspection, data boundaries, safe rich text, native entry lifecycle and shadow isolation. Real native ZIP import/enable/UI/disable was tested with a separate data directory; the user's live Web PID stayed unchanged, and the test Web/Host were stopped and data removed.

The curated native ZIP has no source tests, development executables or compatibility bootstrap. Registry parsing, ZIP reading, script static patterns, raster signatures and size limits are checked before stable Release publication. Matching image assets accompany the ZIP. Market listing remains pending until maintainers approve the repository submission.

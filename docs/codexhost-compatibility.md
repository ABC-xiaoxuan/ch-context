# CodexHost compatibility

The first integration targets the CodexHost **Web extension system**. The local installation was updated from 0.23.0 to 0.25.0 during investigation; live API and browser verification use **0.25.0**. The 0.23.0 packaged implementation was inspected, not independently reinstalled for an end-to-end run. Desktop renderer injection, remote-host switching and standard standalone DSH are not declared supported by this release.

## Plugin contract

- `dsh.bundle.patch` inserts a `ch-context` row.
- `dsh.client.platform` is `web`; the package exposes a local `./client` bundle.
- There is no root host entry, no runtime dependency on `@deepseek-ai/dsh-session`, and no hard injection of `sessionProjections`.
- The browser bundle registers through `window.__ModuleLoader__.load` and uses the Host's React modules.
- Client services are `slots` and `locale`; the global panel optionally observes `uiSession.adapter.current`. Conversation slots provide `sessionId` and the optional `useProjection` hook.
- Registered surfaces are `main`, `sidebar.panellist`, `conversation.view` and `settings.section`, all under the `ch-context` identity.

## Data contract

- Conversation view: read `codexhostUsage` through the injected projection hook. Explicit refresh uses the authenticated Host usage bridge. A changed native projection invalidates in-flight refresh successes and errors, so an older response cannot overwrite accepted native facts.
- Global view: POST browser-relative `api/ch/v1/rpc` with `codexhost/thread/usage/inspect` and the selected `threadId`. GET `api/ch/v1/events` provides invalidations; the plugin rereads absolute snapshots rather than summing events.
- Conversation picker: POST `api/session/list`, following opaque page cursors. Search is explicitly limited to the displayed page.
- History: POST `api/session/projections` to obtain `asOfSeq`, then POST `api/session/page`. Older reads retain the same upper watermark and use the prior page's first sequence as an exclusive boundary.
- Session ids must identify committed Host Threads. Draft/composer selections do not trigger usage/history requests.
- All HTTP calls use the browser's same-origin session, and URLs retain a deployment path prefix. No login tokens or private credential files are read by the plugin.

The installed 0.23.0 build synthesized all-zero `tokenUsage` buckets when telemetry was incomplete. Therefore availability is determined from optional fields in `codexhostUsage.usage`, never the mere presence of `tokenUsage`.

The common Host interface does not expose exact prompt bodies or a reliable system/tools/messages token composition. Native occupancy percentages take precedence over derived ratios; percentage-only snapshots do not synthesize token counts. Fractional credits and small costs retain nonzero display precision. There are no synthetic DSH events or fake projection services to fill those gaps. Historical Web events must not be labeled as exact request contents.

## Bounds and lifecycle

- Only the displayed conversation-list page and one history page are kept by the panel.
- Each history response displays at most 200 events and 8,000 text characters per event; unavailable/clipped content is explicitly described.
- At most 120 changed context observations are retained in memory for the selected conversation.
- Old HTTP requests and NDJSON readers are aborted on selection changes/unmount. Failed event feeds reconnect with bounded backoff; no timer scans every conversation.
- A failed usage refresh retains previously confirmed facts and shows the error. Switching sessions never displays the previous session's facts as the new session's data.

## Verification

`npm run check` covers source type checking, protocol/mapping/cancellation/pagination tests, the browser build and client-only package validation. Live smoke checks separately exercise the installed plugin and authenticated CodexHost. Browser evidence and logs stay in ignored `.tmp/` because real conversation titles and content are private.

The upstream standard-DSH compatibility matrix and test suite remain historical reference; they do not establish ch-context support for those hosts.

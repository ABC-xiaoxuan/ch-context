# CodexHost adaptation

Implement `ch-context` as an installable CodexHost Web extension, adapted from `dsh-context` and preserving its Apache-2.0 attribution.

- Rename the active package, bundle, plugin ids, metadata and repository references to `ch-context`.
- Use CodexHost's plugin packaging, ModuleLoader, shell slots, shared React, locale and theme services.
- Remove the active runtime's dependency on standard DSH session projection/persistence services.
- Provide both a global sidebar page and a conversation-scoped context tab.
- Read confirmed Host context occupancy, cumulative token/cache usage, cost and performance metrics. Unknown is distinct from zero; do not invent prompt composition.
- Support paginated Host conversation selection, read-only message/tool/event history and explicit older-page navigation.
- Show an explicitly scoped observation timeline with bounded retention, not a fabricated complete request history.
- Use authenticated same-origin, path-prefix-safe requests; no private credentials or third-party telemetry.
- Keep reads scoped to the selected Thread, abort stale requests, dispose listeners/readers and reject drafts without a committed Host Thread identity.
- Preserve native Host cost and metric semantics. Mark previews, missing telemetry and unsupported exact prompt composition clearly.
- Do not modify prompts, compact sessions or implement native operations without verified Host capabilities.
- Validate focused source/protocol tests, package admission, browser interaction, light/dark and narrow/wide layouts, and the running CodexHost.
- Deliver the source to the user's fork and a prebuilt local package. Publishing to npm is not part of this task.

Initial compatibility is CodexHost Web 0.25.0, the current local installation. Source investigation included 0.23.0; Desktop injection and remote-host switching require separate verification.

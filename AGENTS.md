# ch-context

CodexHost context insight plugin, forked from bowenliang123/dsh-context.

## Scope

The active runtime targets CodexHost's Web plugin system. Its entry points live in `src/codexhost/`. The inherited DSH implementation remains as reference and is excluded from the CodexHost package, build and checks. Standard DSH session-runtime services are not available in CodexHost and must not be simulated to satisfy dependency checks.

## Data integrity

- Use CodexHost's authenticated same-origin client channel and authoritative usage snapshots.
- Keep current context occupancy separate from cumulative billed tokens.
- Preserve unknown fields as unknown; never replace them with invented zero values.
- Never claim a complete prompt breakdown or full historical context timeline from partial observations.
- Scope async results and subscriptions to their Host/session identity; dispose them on unmount.
- Keep retention bounded and identify observed samples explicitly.
- Reuse existing shell slots, React, locale and theme services.

## Development

- English code, tests and developer documentation. UI dictionaries support Chinese and English, with English fallback.
- No comments in new source or tests; tooling directives are allowed.
- Source and test files remain below 1000 lines.
- Use container queries for pane responsiveness. Verify narrow and wide layouts in both themes.
- Temporary files belong in `.tmp/` and are not committed.
- `npm ci`, `npm run check`, `npm run build`, `npm pack --ignore-scripts` are the supported workflow.
- `npm run check` covers the active CodexHost source, focused tests and distributable validation. Inherited DSH tests are reference-only.
- Before committing, review the full diff and obtain an independent code review; resolve verified findings.
- Do not publish to npm or tag a release unless requested. CI must not publish under the upstream identity.

## Compatibility

Use `docs/codexhost-compatibility.md` for the supported host surface and limitations. The initial target is CodexHost 0.23.0. Feature-detect services and optional fields. Do not claim Desktop injection support merely because the Web plugin loads.

## Attribution

Retain the Apache-2.0 license and credit the upstream project. `ch-context` is an independent adaptation, not an official CodexHost or DeepSeek product.

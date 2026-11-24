# ch-context · Context Insights

Read-only context and conversation insights for **CodexHost Web**. An independent Apache-2.0 adaptation of [dsh-context](https://github.com/bowenliang123/dsh-context).

## Native CodexHost extension

The marketplace package follows CodexHost's [Host extension development guide](https://github.com/BytePioneer-AI/codex-host/blob/main/.agents/skills/codexhost-add-desktop-extension/SKILL.md):

- Root `manifest.json` with **`manifestVersion: 2`**.
- A standard ESM `web` entry exporting `activate(api)`.
- Main-panel and settings contributions through the public `WebExtensionApi`.
- Owned Shadow DOM with scoped CSS, self-contained React, abort/dispose cleanup and extension-owned language preferences.
- **CH Web only**, with no `desktop`, `page`, `widget` or `backend` declaration. No extension backend process is started.
- No private React/Cordis objects, ModuleLoader integration or credential files are used by the native entry. Data reads use the existing authenticated, same-origin Web client channel.

### Install

Use **Plugins → Plugin Center** in CodexHost 0.25.0 or newer. Import the public repository URL or the native ZIP from [Releases](https://github.com/ABC-xiaoxuan/ch-context/releases):

```text
https://github.com/ABC-xiaoxuan/ch-context
```

Enable **Context Insights / 上下文洞察**, then open its sidebar entry. Choose a conversation in the panel. The native Web API does not expose the current conversation selection, so the extension does not guess it from private application state. Use the panel's language selector or its settings page for Auto / English / Chinese.

First marketplace registration requires the catalog maintainers' review. A public GitHub Release alone does not mean the extension is already listed.

## Features

- `dsh-context`-inspired Apple Neutral UI layout: top Context Stats ledger (5 summary wells + 2×2 clickable category ledger), paired Token Stats donut & Performance/Cache card with loaded-window activity sequence strip, and a linked split workbench.
- Inline-expandable Context Browser: category accordions with subtle corner tinting, in-place structured tool-call argument tables and nested result cards, Find-in-Record match highlighting, a toggleable loaded-window character-volume treemap (strictly by text character length, never estimated tokens), and scoped keyboard shortcuts (`/` search, `[` / `]` step filtered records, `Esc` clear).
- Full-width File Activity card (read/write/search filters, path search, sorting, extension badges and expandable operation trails), full-width 2-pane Command Executions card (summary KPIs, attention callouts, searchable program distribution bars, inline output previews), and visual Session Network node tree.
- One-click Diagnostic Report export (copy Markdown or download `.md` / `.json`) summarizing reported usage, loaded-window activity, files, commands and relationships without inventing missing metrics.
- Context Insights Overview dashboard with 2×3 KPI tiles, queried-session usage comparison chart, aggregate token distribution, 8-week updated-date activity heatmap, workspace/harness breakdowns, high-context and relation quick filters, and up to 3-session side-by-side comparison.
- Markdown messages, tables, code blocks, raw-text view and copying. Raw mode preserves retained text verbatim; HTML stays escaped and remote images remain explicit links.
- Host context occupancy and window capacity, separate from cumulative billed usage. Unknown values stay `—` (never fabricated zeros).
- English/Chinese UI, Light/Dark theme support and responsive container layouts.

## Build and verify

Node.js 24 or newer is required for development.

```sh
npm ci
npm run check
npm run test:browser
npm run test:market
npm run pack:market
```

`npm run check` performs strict type checking, focused Node tests, both builds, and native/compatibility package validation. Browser commands require installed Chrome/Edge/Chromium; set `CH_CONTEXT_CHROME_PATH` when needed. Synthetic fixtures exercise UI and lifecycle without model turns or real conversation data.

`npm run pack:market` creates `dist/ch-context-0.3.3.zip` and its SHA-256 file. The ZIP contains only the native manifest, prebuilt ESM/CSS, declared raster assets, documentation and licenses. ZIP timestamps and text line endings are normalized. Release images are also attached individually for the official registry's byte comparison.

Tracked prebuilt files `web/index.mjs`, `web/style.css` and `lib/client.js` must be rebuilt with source changes. CI rejects stale artifacts. Never change published ZIP bytes without increasing the manifest version.

## Optional legacy compatibility entry

The repository retains a separate **DSH-compatible Web entry** for existing installations under CodexHost's legacy `/extensions` recovery/management page. It adds a conversation **Context** tab and a sidebar item labeled **Context Insights (compatibility)**. Its `.tgz` is not the native marketplace ZIP.

The compatibility entry uses Host React/slots and `lib/client.js`; the native entry uses the formal v2 manifest and public `WebExtensionApi`. They are separate installation systems. Disable the compatibility entry if you want a single sidebar entry; doing so also removes its conversation tab. The native marketplace package remains usable without it.

The npm name `ch-context` is not published by this project.

## Data boundaries

- Conversation data is read from the selected CodexHost instance and is not automatically sent to a third-party service.
- Missing telemetry stays unavailable. Reported percentages take precedence over derived ratios; unknown token counts remain unknown. Charts clamp visual geometry independently of native values.
- Cost is the Host's native amount or public-price estimate, not necessarily a subscription invoice. Unpriced models retain the Host's lower-bound indication.
- The common Host contract does not provide exact system-prompt/tool-definition/message token composition, complete historical request-token curves or execution phase timing. These are not fabricated.
- Activity counts/searches cover the loaded history window. File rows group exact supplied paths and count observed attempts, including failed calls; they do not prove successful filesystem changes.
- Call/result pairing requires unique, ordered native call IDs. Event bars show sequence positions, not inferred duration or tokens. Raw native sequence IDs remain available in details/tooltips.
- Latest history refreshes on accepted usage invalidations. Older cuts survive Refresh and Retry, and reset only on explicit Latest navigation or changing conversations.
- History displays at most 200 events and 8,000 characters per event. Affected records identify previews, local clipping and unavailable content.
- Relationship navigation covers reported metadata on the loaded page, not a complete Agent inventory or aggregate Fleet cost.
- At most 120 changed context observations are retained in memory for the selected conversation; they are not the full request history.
- The extension does not modify conversations, prompts or model settings. Its native language preference is stored only in its own Host-managed settings.
- Desktop execution is not supported by this release.

See [compatibility and verification](docs/codexhost-compatibility.md).

## Attribution

Forked from [bowenliang123/dsh-context](https://github.com/bowenliang123/dsh-context). The upstream donut/format primitives and source history are retained under Apache-2.0. See [NOTICE](NOTICE) and [third-party notices](THIRD_PARTY_NOTICES.md). This is not an official CodexHost or DeepSeek product.

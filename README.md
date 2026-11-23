# ch-context

Read-only context and conversation insights for **CodexHost Web**.

An independent Apache-2.0 adaptation of [dsh-context](https://github.com/bowenliang123/dsh-context), with a CodexHost-native data source and a client-only plugin package. It does not require a separate DeepSeek Harness instance or its session runtime.

## Features

- **Context insights** in the sidebar and a **Context** tab inside each conversation.
- Confirmed context occupancy and window capacity, separate from cumulative token usage.
- Native Host input/output/cache usage, session cost, cache-hit rates, output speed and first-output latency when available.
- A paginated conversation picker with page-scoped search.
- Read-only message, tool and event history with older-page navigation.
- An in-memory context observation curve for the selected conversation, capped at 120 changed samples.
- Chinese and English UI, with English fallback for other locales.
- Host-provided React, locale and theme integration; no runtime npm dependencies.

## Install

In CodexHost's own Web UI extension installer, install from:

```text
https://github.com/ABC-xiaoxuan/ch-context
```

Enable **CH Context** and reload the Web page. The repository includes the prebuilt `lib/client.js` because CodexHost intentionally skips installation scripts. CI rebuilds it and rejects stale artifacts.

The npm name `ch-context` is not published by this project yet. You can also build or obtain a **prebuilt `.tgz`**, then use CodexHost's own Web UI extension installer:

1. Build the package with the commands below.
2. In CodexHost's extension management, enter the absolute path to `ch-context-0.1.0.tgz` and install it.
3. Enable **CH Context** and reload the Web page.
4. Open **Context insights** in the sidebar, or the **Context** tab inside a conversation.

Use the CodexHost extension installer that manages `ch-context` in the running Host. A standard DSH marketplace may install into a different DSH profile or require pnpm; that does not adapt the plugin to CodexHost.

## Build and verify

Node.js 24 or newer is required for development and the native TypeScript test runner.

```sh
npm ci
npm run check
npm pack --ignore-scripts
```

`npm run check` runs strict type checking, focused Node tests, the browser build and a package/ModuleLoader check. With Chrome, Edge or Chromium installed, `npm run test:browser` exercises the packaged plugin against an explicit synthetic Host fixture; set `CH_CONTEXT_CHROME_PATH` when the browser is not in a standard location. The browser test never opens a model turn or reads your real conversations. `npm run build` produces the tracked, deterministic `lib/client.js`; rebuild and include it with source changes. The package exports only `./client` and its manifest; CodexHost composes the browser plugin through `dsh.bundle.patch` and `dsh.client`.

The active implementation is in `src/codexhost/`; inherited `src/client`, `src/host` and other DSH sources remain for attribution/reference and selected reusable display primitives. They are not the active plugin entry. The active checks use `tsconfig.codexhost.json` and `tests/codexhost/`.

## Data and limitations

- Values come from the selected CodexHost instance. No conversation data is sent to a third-party service.
- Missing telemetry stays unavailable. Zero is displayed only when the Host actually reports zero. Reported context percentages take precedence over derived ratios, including percentage-only snapshots; unknown token counts stay unavailable. Chart geometry is bounded independently of the displayed percentage.
- Cost is the Host's native cost or public-price estimate; it is not necessarily the charge on a subscription invoice. Unpriced models retain the Host's lower-bound indication.
- Current context occupancy is not cumulative billed usage. Cache figures are displayed independently and are not added into an invented composition.
- The Host does not expose confirmed system-prompt/tool-definition/message token breakdowns through this interface. The corresponding composition is explicitly unavailable.
- Observations cover changes seen while the panel is mounted. They are not complete historical requests, and are discarded when the selected conversation changes or the page closes.
- History is a bounded page of Web conversation events. Long text is clipped to 8,000 characters; each affected record identifies local text clipping, Host previews and unavailable content. These records do not become complete model requests. Use older-page navigation for earlier records.
- The plugin does not edit prompts, compact/clear conversations, change models, or modify settings.
- Native CodexHost Desktop renderer injection is not verified; this release targets its Web extension system.

See [CodexHost compatibility](docs/codexhost-compatibility.md) for the exact host surface and validation scope.

## Attribution

Forked from [bowenliang123/dsh-context](https://github.com/bowenliang123/dsh-context). The upstream donut and formatting primitives are reused, and the original Apache-2.0 license is retained. See [NOTICE](NOTICE). `ch-context` is not an official CodexHost or DeepSeek product.

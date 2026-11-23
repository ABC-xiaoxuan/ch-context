# Restore the upstream inspection experience

The user found the 0.1.0 adaptation noticeably poorer than dsh-context. Restore the upstream's compact information architecture and connected inspection workflow while retaining truthful CodexHost data semantics.

- Replace the large summary-only layout with compact conversation statistics, native billed-token visualization, performance/cache metrics, current context, and a split timeline/browser workbench.
- Link event selection, category/search filtering, previous/next navigation, and record details. Provide keyboard operation and preserve user focus across background updates when possible.
- Render readable messages, Markdown tables/code, and raw text. HTML must not execute, unsafe URL schemes must not become links, and remote images must not load automatically.
- Retain native tool call IDs, arguments and explicit error states. Match calls/results only for unambiguous native identities. File and shell-command activity must point back to real records.
- Label counters and searches as loaded-window activity. Do not infer successful writes, native execution timing, exact prompt composition, or per-request token history from unrelated records.
- Provide Host-reported parent/child navigation for the loaded page, without treating every parent link as a subagent or claiming a complete family inventory.
- Refresh the latest history page on usage invalidations. Keep older-page reads pinned to their watermark until the user requests latest.
- Preserve 0.1.0 unknown/zero distinctions, fractional credits, native percentages, stale-refresh protection, authenticated path-prefix-safe requests, bounded retention and cleanup.
- Keep both sidebar and native conversation entry points; reduce redundant embedded headings and collapse the conversation picker after selection.
- Verify real interactions, package loading, responsive themes/locales, and actual Host data. Maintain the prebuilt GitHub-installable client and source/artifact synchronization.

The original DSH-only exact prompt decomposition, complete historical request chart, phase timings and Fleet cost are not available from the common CodexHost contract; they must not be fabricated to make the interface look equivalent.

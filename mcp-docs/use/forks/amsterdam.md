# Amsterdam — preview hardfork

> **Status:** **Ready for the public MCP** (not launched). Named fork capability — run under Amsterdam **without naming an EIP**. Website explorations stay per-EIP; this page is the fork bundle.

## What became possible

**Amsterdam** (alias **Glamsterdam**) is the upcoming execution-layer fork and the **default** lab fork on this server. You can run caller-supplied bytecode, a paid transaction, or a small lab block under Amsterdam rules and get deterministic gas, stack, logs, and provenance.

You do **not** need to name an EIP. Omit `fork` (or pass `{ "baseHardfork": "amsterdam", "eips": [] }`). The live probe lists this fork as a catalog row: `summary`, `keywords`, `shapes`, advertised `relatedEips`, and Planned `7928`.

Advertised runnable modules today: **8024**, **7843**, **7708**, **8037**, **8038**. Block-level access lists (**7928**) are Planned until the generate verb ships.

## What you can ask your agent

Once the public MCP is live ([Connect](/use/connect)), try prompts like:

- *“Run this bytecode under Amsterdam and tell me the gas used.”*
- *“Simulate a 1 wei transfer to an empty account under Amsterdam.”*
- *“What can I run under Amsterdam on this server — without picking an EIP?”*
- *“Run the same program on Osaka then Amsterdam and diff gas and success.”*
- *“Run two transfers as one Amsterdam block and show the receipts.”*

These are **inspiration prompts** — ask in plain language; your agent uses the connected server and reports results back to you.

## What the server does

| Step | Action | Purpose |
| --- | --- | --- |
| 1 | [Discover support](/use/tools/describe-capabilities) | Read the `amsterdam` named-fork row (related EIPs, shapes, comparison) |
| 2 | [Run bytecode](/use/tools/run-bytecode), [Run transaction](/use/tools/run-transaction), or [Run block](/use/tools/run-block) | Execute under Amsterdam (default). Osaka is optional for a mainnet compare |

## Fork caveat

Amsterdam in EthereumJS v10 **already bundles** the advertised modules. Passing `eips: [8024]` is accepted but is **not** a before/after toggle on Amsterdam itself.

For **preview vs mainnet today** (optional), run the same input on baseline fork **`osaka`**, then on **`amsterdam`**. The catalog exposes this pair on the named-fork row as `comparison: { baselineForkId: "osaka", previewForkId: "amsterdam" }`. You do not need Osaka for Amsterdam-only runs.

Other protocol changes may execute because they are bundled in the EthereumJS hardfork, but they are **not catalogued** here until a shipped verb can honestly show them.

A generic Amsterdam result’s provenance keeps `eips: []` on the fork config and lists **advertised modules** (7708, 7843, 8024, 8037, 8038) so you can see what this server claims for that run.

## Twins and spec

| | Link |
| --- | --- |
| **EIP catalogue** (per-change twins) | [Coverage](/use/coverage) — 8024, 7843, 7708, 8037, 8038 runnable; 7928 planned |
| **Osaka** (mainnet baseline) | [Osaka](/use/forks/osaka) |
| **Canonical fork meta** | [EIP-7773](https://eips.ethereum.org/EIPS/eip-7773) (Glamsterdam / Amsterdam) |

## Changelog

<Changelog
  title="Amsterdam Fork Catalogue Changelog"
  :entries="[
    { version: 'v0.1', date: '2026-09-16', summary: 'Named fork capability — generic Amsterdam runs; advertised modules; no per-fork MCP tool.' },
  ]"
/>

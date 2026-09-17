# Preview & upcoming forks — Glamsterdam

> **Status:** **Ready for the public MCP** (not launched). **Default lab fork** — run under Glamsterdam **without naming an EIP**.

This page is the home for **preview** execution-layer hardforks on the MCP: what you can run *before* mainnet catches up. When mainnet moves on, the [current mainnet](/use/forks/fusaka) page is updated; the next scheduled fork gets a page here (e.g. **Hegota** after Glamsterdam ships — same section, new row in the probe).

## Glamsterdam today

**Glamsterdam** (EL alias **`amsterdam`**) is the upcoming EL fork and the **default** when you omit `fork`. You can run caller-supplied bytecode, a paid transaction, or a small lab block under Glamsterdam rules.

You do **not** need to name an EIP. Omit `fork` or pass `{ "baseHardfork": "glamsterdam", "eips": [] }`. The probe lists `summary`, `keywords`, `shapes`, and advertised **`relatedEips`**.

**Advertised runnable twins:**

| EIP | Page |
| --- | --- |
| 8024 | [DUPN / SWAPN / EXCHANGE](/use/eips/eip-8024) |
| 7843 | [SLOTNUM](/use/eips/eip-7843) |
| 7708 | [ETH transfer logs](/use/eips/eip-7708) |
| 7928 | [BAL](/use/eips/eip-7928) (`generate` / `inspect`) |
| 7954 | [Contract size limits](/use/eips/eip-7954) |
| 8037 | [State creation gas](/use/eips/eip-8037) |
| 8038 | [State-access gas](/use/eips/eip-8038) |

## What you can ask your agent

- *“Run this bytecode under Glamsterdam and tell me the gas used.”*
- *“Simulate a 1 wei transfer to an empty account under Glamsterdam.”*
- *“What can I run under Glamsterdam on this server — without picking an EIP?”*
- *“Run the same program on Fusaka then Glamsterdam and diff gas and success.”*

## Workflow

| Step | Action |
| --- | --- |
| 1 | [Describe Capabilities](/use/tools/describe-capabilities) — `namedForks`, `eipIntroductions`, Glamsterdam `relatedEips` |
| 2 | [Run bytecode](/use/tools/run-bytecode), [Run transaction](/use/tools/run-transaction), or [Run block](/use/tools/run-block) — default Glamsterdam; [Fusaka](/use/forks/fusaka) optional for mainnet-today compare |

## Fork caveat

The Glamsterdam hardfork **bundles** the advertised modules. `eips: [8024]` is accepted but is **not** a before/after toggle on Glamsterdam itself.

**Preview vs mainnet today:** run **`fusaka`** then **`glamsterdam`** (`baselineForkId` is Fusaka until mainnet changes). For one EIP, use **`eipIntroductions`**: compare predecessor vs **`introducedAt`** (Glamsterdam twins → usually Fusaka vs Glamsterdam).

Other bundled changes may execute in the client but stay **uncatalogued** until a shipped verb can show them honestly. Generic Glamsterdam provenance keeps `eips: []` and lists advertised modules in **`perEip`**.

## Related

| | |
| --- | --- |
| [Current mainnet (Fusaka)](/use/forks/fusaka) | Today’s EL baseline |
| [Historical forks](/use/forks/historical-forks) | Paris → Pectra |
| [EIP catalogue](/use/coverage) | Lineage + EIP twins |
| [EIP-7773](https://eips.ethereum.org/EIPS/eip-7773) | Glamsterdam meta |

## Changelog

<Changelog
  title="Preview Forks (Glamsterdam) Changelog"
  :entries="[
    { version: 'v0.5', date: '2026-09-17', summary: 'EIP-7954 contract creation added to advertised runnable twins.' },
    { version: 'v0.4', date: '2026-09-17', summary: 'Twin pages linked from this fork doc (sidebar no longer lists EIPs).' },
    { version: 'v0.3', date: '2026-09-17', summary: 'Canonical catalog id is glamsterdam; amsterdam is the EL alias.' },
    { version: 'v0.2', date: '2026-09-16', summary: 'Framed as preview/upcoming section; room for post-Glamsterdam forks (e.g. Hegota).' },
    { version: 'v0.1', date: '2026-09-16', summary: 'Named fork capability — generic Glamsterdam runs.' },
  ]"
/>

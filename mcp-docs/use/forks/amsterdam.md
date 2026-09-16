# Preview & upcoming forks — Amsterdam

> **Status:** **Ready for the public MCP** (not launched). **Default lab fork** — run under Amsterdam **without naming an EIP**.

This page is the home for **preview** execution-layer hardforks on the MCP: what you can run *before* mainnet catches up. When mainnet moves on, the [current mainnet](/use/forks/osaka) page is updated; the next scheduled fork gets a page here (e.g. **Hegota** after Amsterdam ships — same section, new row in the probe).

## Amsterdam today

**Amsterdam** (alias **Glamsterdam**) is the upcoming EL fork and the **default** when you omit `fork`. You can run caller-supplied bytecode, a paid transaction, or a small lab block under Amsterdam rules.

You do **not** need to name an EIP. Omit `fork` or pass `{ "baseHardfork": "amsterdam", "eips": [] }`. The probe lists `summary`, `keywords`, `shapes`, advertised **`relatedEips`**, and planned **7928**.

**Advertised runnable modules:** **8024**, **7843**, **7708**, **8037**, **8038**. **7928** (BAL generate) is planned.

## What you can ask your agent

- *“Run this bytecode under Amsterdam and tell me the gas used.”*
- *“Simulate a 1 wei transfer to an empty account under Amsterdam.”*
- *“What can I run under Amsterdam on this server — without picking an EIP?”*
- *“Run the same program on Osaka then Amsterdam and diff gas and success.”*

## Workflow

| Step | Action |
| --- | --- |
| 1 | [Describe Capabilities](/use/tools/describe-capabilities) — `namedForks`, `eipIntroductions`, Amsterdam `relatedEips` |
| 2 | [Run bytecode](/use/tools/run-bytecode), [Run transaction](/use/tools/run-transaction), or [Run block](/use/tools/run-block) — default Amsterdam; [Osaka](/use/forks/osaka) optional for mainnet-today compare |

## Fork caveat

The Amsterdam hardfork **bundles** the advertised modules. `eips: [8024]` is accepted but is **not** a before/after toggle on Amsterdam itself.

**Preview vs mainnet today:** run **`osaka`** then **`amsterdam`** (`baselineForkId` is Osaka until mainnet changes). For one EIP, use **`eipIntroductions`**: compare predecessor vs **`introducedAt`** (Amsterdam twins → usually Osaka vs Amsterdam).

Other bundled changes may execute in the client but stay **uncatalogued** until a shipped verb can show them honestly. Generic Amsterdam provenance keeps `eips: []` and lists advertised modules in **`perEip`**.

## Related

| | |
| --- | --- |
| [Current mainnet (Osaka)](/use/forks/osaka) | Today’s EL baseline |
| [Historical forks](/use/forks/historical-forks) | Paris → Prague |
| [Coverage](/use/coverage) | Lineage + EIP twins |
| [EIP-7773](https://eips.ethereum.org/EIPS/eip-7773) | Amsterdam / Glamsterdam meta |

## Changelog

<Changelog
  title="Preview Forks (Amsterdam) Changelog"
  :entries="[
    { version: 'v0.2', date: '2026-09-16', summary: 'Framed as preview/upcoming section; room for post-Amsterdam forks (e.g. Hegota).' },
    { version: 'v0.1', date: '2026-09-16', summary: 'Named fork capability — generic Amsterdam runs.' },
  ]"
/>

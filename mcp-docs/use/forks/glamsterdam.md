# Amsterdam now

::: info Naming
**Glamsterdam** is the catalog id; **`amsterdam`** is the Ethereum execution-layer alias. Both mean the same fork here. Default when you omit `fork`.
:::

At launch this is the **free** product surface: the full upcoming Amsterdam hardfork on the hosted MCP, plus everything bundled with it. You do not need to name an EIP — ask about behavior and let your agent pick the run shape.

Prefer the visual twin? Many of these changes have [browser explorations](https://feelyourprotocol.org) on the main site.

## Start with these questions

These are the highest-signal checks for integrators and auditors — exact gas and receipts, not LLM guesses.

| Question | Twin |
| --- | --- |
| What intrinsic gas does a simple transfer use? | [EIP-2780](/use/eips/eip-2780) |
| What does the first 1 wei to an empty account cost? | [EIP-8037](/use/eips/eip-8037) |
| How does SSTORE on an existing slot price vs today’s mainnet? | [EIP-8038](/use/eips/eip-8038) |
| Does a value transfer show up as a receipt log? | [EIP-7708](/use/eips/eip-7708) |

**Example prompts**

- *“What intrinsic gas does a plain ETH transfer use on Amsterdam?”*
- *“Send 1 wei to an empty account on Amsterdam — wallet gas breakdown.”*
- *“SSTORE value 7 into slot 3 — Amsterdam vs Fusaka gas.”*
- *“Transfer 1 ETH — what logs appear in the receipt on Amsterdam?”*

## Also on Amsterdam

| Topic | Twin |
| --- | --- |
| Contract creation size limit | [EIP-7954](/use/eips/eip-7954) |
| Block access lists (generate / inspect) | [EIP-7928](/use/eips/eip-7928) |
| DUPN / SWAPN / EXCHANGE | [EIP-8024](/use/eips/eip-8024) |
| SLOTNUM opcode / header slot in lab blocks | [EIP-7843](/use/eips/eip-7843) |
| Calldata floor (64 gas per byte when the call does little else) | [EIP-7976](/use/eips/eip-7976) |

## Compare to mainnet today

When you care about **before vs after**, ask for the same experiment on **Fusaka** (today’s mainnet EL) and **Amsterdam**, then diff gas or success. One Amsterdam-only run is always valid.

[Fusaka (mainnet)](/use/forks/fusaka) · [Historical forks](/use/forks/historical-forks)

## How your agent runs it

1. Connect — [Connect](/use/connect)
2. Ask in plain language — [What you can ask](/use/capabilities)
3. Optional deep dive — per-EIP pages above or the full [EIP catalogue](/use/coverage)

Bundled rule changes that do not have their own exploration still apply on Amsterdam. SELFDESTRUCT no longer burns ETH. Access-list bytes pay the same 64-gas floor as calldata. Your agent uses generic Amsterdam runs without naming those ids.

Consensus-layer and networking EIPs scheduled beside Amsterdam are **not** executed in this lab — the [EIP catalogue](/use/coverage) notes which ids to omit.

## Related

| | |
| --- | --- |
| [Pricing](/use/pricing) | Free at launch; paid tier for EIPs ahead of Amsterdam later |
| [Limits](/use/guarantees) | Determinism, BYOS, ceilings |
| [EIP-7773](https://eips.ethereum.org/EIPS/eip-7773) | Glamsterdam meta |

## Changelog

<Changelog
  title="Preview Forks (Glamsterdam) Changelog"
  :entries="[
    { version: 'v1.1', date: '2026-10-01', summary: 'EIP-7976 calldata floor joins the advertised twins. EIP-7981 stays bundled.' },
    { version: 'v1.0', date: '2026-10-01', summary: 'User-first Amsterdam page — gas/receipt questions first; probe jargon moved to catalogue.' },
    { version: 'v0.9', date: '2026-09-29', summary: 'EIP-2780 intrinsic gas joins the advertised Glamsterdam twins.' },
    { version: 'v0.8', date: '2026-09-29', summary: 'Networking (7975, 8070, 8136, 8159, 8189) and informational (7904, 8261) EIPs are out of this lab.' },
    { version: 'v0.7', date: '2026-09-29', summary: 'Consensus EIPs 7688, 7732, 8045, and 8061 are coverage consensus — out of this lab.' },
    { version: 'v0.6', date: '2026-09-29', summary: 'EIP-8246 is coverage supported: bundled on Glamsterdam, no twin page.' },
    { version: 'v0.5', date: '2026-09-17', summary: 'EIP-7954 contract creation added to advertised runnable twins.' },
    { version: 'v0.4', date: '2026-09-17', summary: 'Twin pages linked from this fork doc (sidebar no longer lists EIPs).' },
    { version: 'v0.3', date: '2026-09-17', summary: 'Canonical catalog id is glamsterdam; amsterdam is the EL alias.' },
    { version: 'v0.2', date: '2026-09-16', summary: 'Framed as preview/upcoming section; room for post-Glamsterdam forks (e.g. Hegota).' },
    { version: 'v0.1', date: '2026-09-16', summary: 'Named fork capability — generic Glamsterdam runs.' },
  ]"
/>

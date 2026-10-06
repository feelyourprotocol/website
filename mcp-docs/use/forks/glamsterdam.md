# Amsterdam now

::: info Naming
**Glamsterdam** is the catalog id; **`amsterdam`** is the Ethereum execution-layer alias. Both mean the same fork here. Default when you omit `fork`.
:::

At launch this is the **free** product surface: the full upcoming Amsterdam hardfork on the hosted MCP, plus everything bundled with it. You do not need to name an EIP — ask about behavior and let your agent pick the run shape.

Prefer the visual twin? Many of these changes have [browser explorations](https://feelyourprotocol.org) on the main site.

## Start with these questions

These are the highest-signal checks for integrators and auditors — exact gas and receipts, not LLM guesses.

<PromptList
  :groups="[
    {
      label: 'Prompts to copy',
      prompts: [
        { text: `On Glamsterdam, what intrinsic gas does a plain 1 wei transfer to an existing account use?`, fork: 'Amsterdam', href: '/use/eips/eip-2780', hrefLabel: 'EIP-2780' },
        { text: `Run a 1 wei transfer to an empty account on Glamsterdam — what gas would a wallet need?`, fork: 'Amsterdam', href: '/use/eips/eip-8037', hrefLabel: 'EIP-8037' },
        { text: `Cold SSTORE 9 into storage slot 1 when slot 1 already holds 7 — prefund slot 1 with 7 on the contract, run on Fusaka and on Glamsterdam, and compare call gas.`, fork: 'Fusaka vs Amsterdam', href: '/use/eips/eip-8038', hrefLabel: 'EIP-8038' },
        { text: `Run a plain 1 wei transfer on Glamsterdam — decode the EIP-7708 Transfer log in the result.`, fork: 'Amsterdam', href: '/use/eips/eip-7708', hrefLabel: 'EIP-7708' },
        { text: `Run a lab block on Amsterdam with a transaction that clears storage and earns a refund — does the block header total still count the full gas for each transaction?`, fork: 'Amsterdam', href: '/use/eips/eip-7778', hrefLabel: 'EIP-7778' },
      ],
    },
  ]"
/>

## Also on Amsterdam

<IconGrid
  :items="[
    { icon: 'boundary', title: 'Contract creation size limit', detail: 'EIP-7954', href: '/use/eips/eip-7954' },
    { icon: 'shield', title: 'Block access lists', detail: 'EIP-7928 — generate and inspect', href: '/use/eips/eip-7928' },
    { icon: 'stack', title: 'DUPN / SWAPN / EXCHANGE', detail: 'EIP-8024', href: '/use/eips/eip-8024' },
    { icon: 'clock', title: 'SLOTNUM opcode', detail: 'EIP-7843 — header slot in lab blocks', href: '/use/eips/eip-7843' },
    { icon: 'scale', title: 'Calldata floor', detail: 'EIP-7976 — 64 gas per byte when the call does little else', href: '/use/eips/eip-7976' },
  ]"
/>

## Compare to mainnet today

When you care about **before vs after**, ask for the same experiment on **Fusaka** (today’s mainnet EL) and **Amsterdam**, then diff gas or success. One Amsterdam-only run is always valid.

[Fusaka (mainnet)](/use/forks/fusaka) · [Historical forks](/use/forks/historical-forks)

## How your agent runs it

<Steps
  :steps="[
    { title: 'Connect', href: '/use/connect' },
    { title: 'Ask in plain language', href: '/use/capabilities' },
    { title: 'Optional deep dive', href: '/use/coverage', detail: 'Per-EIP pages above or the full EIP catalogue.' },
  ]"
/>

Bundled rule changes that do not have their own exploration still apply on Amsterdam. SELFDESTRUCT no longer burns ETH. Access-list bytes pay the same 64-gas floor as calldata. Your agent uses generic Amsterdam runs without naming those ids.

EIP-7997 is unshown. The chain must already contain the CREATE2 factory, and this lab does not install it. EIP-8282 is unshown. A lab block does not return builder deposit or exit requests, and whether a builder is accepted is consensus.

Consensus-layer and networking EIPs scheduled beside Amsterdam are **not** executed in this lab — the [EIP catalogue](/use/coverage) notes which ids to omit.

## Related

| | |
| --- | --- |
| [Pricing](/use/pricing) | Free now; paid tier for EIPs ahead of Amsterdam later |
| [Limits](/use/guarantees) | Determinism, BYOS, ceilings |
| [EIP-7773](https://eips.ethereum.org/EIPS/eip-7773) | Glamsterdam meta |

<CollapsibleChangelog
  title="Preview Forks (Glamsterdam) Changelog"
  :entries="[
    { version: 'v1.6', date: '2026-10-06', summary: 'Amsterdam on the hosted MCP is open, the same day as Glamsterdam Sepolia.' },
    { version: 'v1.5', date: '2026-10-06', summary: 'Launch polish — prompt cards and icon cards; wording unchanged.' },
    { version: 'v1.4', date: '2026-10-04', summary: 'EIP-7778 joins the advertised twins — refunds stay on the bill, not the block.' },
    { version: 'v1.3', date: '2026-10-04', summary: 'EIP-8282 is coverage unshown. Lab blocks do not return builder requests.' },
    { version: 'v1.2', date: '2026-10-04', summary: 'EIP-7997 is coverage unshown. The fork does not install the CREATE2 factory.' },
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

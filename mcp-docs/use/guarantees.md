# Limits and trust

What you can rely on when the hosted MCP is connected — and what it will never pretend to be.

## Deterministic answers

Same inputs and fork → same result (within EthereumJS semantics). That is the product: **ground truth for your agent**, not a plausible paragraph.

Each result carries **provenance** — engine version, fork config, and (when relevant) which EIP spec snapshot the lab implements. Your agent should mention fork and version when reporting numbers to you; integrators read the full `provenance` object in JSON.

## Isolated lab — bring your own state

- **No mainnet RPC.** We do not pull live chain state.
- **Empty world by default.** You pass bytecode, transactions, and optional [demo accounts](/use/tools/run-bytecode#byos-prestate-accounts) in the **same call**.
- **No memory between calls.** The next question does not see the last run unless you send that state again.

That keeps workers parallel and honest: the answer is a function of what you supplied, not a hidden database.

## Hard ceilings

| Limit | Value |
| --- | --- |
| Max bytecode / lab-block gas limit | 30_000_000 |
| Max single-transaction gas limit | 110_000_000 |
| Default gas limit | 1_000_000 |
| Max bytecode size | 24_576 bytes |
| Max trace steps | 10_000 |
| Max transactions per lab block | 8 |

Payment (when the paid tier exists) does **not** raise these ceilings.

## Out of scope

- **Solidity compilation** — send bytecode or calldata you already have.
- **ERC / application-layer semantics** — base-layer execution only.
- **Historical multi-block replay** — archive-node territory; one lab block (≤8 txs) is the block-shaped tool.

<CollapsibleChangelog
  title="Guarantees Changelog"
  :entries="[
    { version: 'v0.9', date: '2026-10-01', summary: 'User-facing Limits page — determinism, BYOS, ceilings; provenance in one paragraph.' },
    { version: 'v0.8', date: '2026-09-18', summary: 'Named eips[] runs put a compact Spec: snapshot on provenance.caveat.' },
    { version: 'v0.7', date: '2026-09-17', summary: '110M transaction-only ceiling supports Glamsterdam EIP-8037 state gas for large contract creation.' },
    { version: 'v0.6', date: '2026-09-16', summary: 'Generic hardfork runs list advertised modules on provenance when eips[] is empty.' },
    { version: 'v0.4', date: '2026-09-10', summary: 'Max 8 transactions on run_block.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from execution-engine — user-facing limits and provenance under use/.' },
  ]"
/>

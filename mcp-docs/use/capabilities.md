# Capabilities

> **Status:** Six tools **implemented** (`describe_capabilities`, `run_bytecode`, `run_transaction`, `run_block`, `generate`, `inspect`). **Public MCP not launched.**

The MCP server exposes **intent-driven tools** — verbs that match how agents and integrators think about protocol work, not raw library APIs one-to-one.

## Query shapes

| Shape | MCP tool | What it does | Status |
| --- | --- | --- | --- |
| **Probe** | `describe_capabilities` | Supported forks, runnable EIP modules, opcodes, encoding | Implemented — public launch pending |
| **Run bytecode** | `run_bytecode` | Run raw bytecode as a message-call; optional trace and accounts | Implemented — public launch pending |
| **Run transaction** | `run_transaction` | Paid tx gas, receipt logs, EIP-8037 dimensions | Implemented — public launch pending |
| **Run block** | `run_block` | 1–8 txs as a lab block; header snapshot (optional slot) | Implemented — public launch pending |
| **Generate** | `generate` | Derive lab artifacts (BAL / EIP-7928 first) | Implemented — public launch pending |
| **Inspect** | `inspect` | Structure + hash on caller blobs (BAL, 7702 auth, typed tx, withdrawals, requests) | Implemented — public launch pending |

To **optionally** compare baseline vs preview, call the same verb twice — **fusaka** (current mainnet EL), then **glamsterdam** (preview) — and diff gas, success, traces, or logs. One run on Glamsterdam only is fully supported — you do **not** need to name an EIP. One run on **fusaka** is also first-class when the question is a current-mainnet feature (ModExp, P-256, a generic mainnet-EL program).

## Scope boundaries

- **Isolated lab / BYOS** — You supply bytecode or transaction fields and any constructed prestate. No archive node, no mainnet or L2 sync. Prefund / code / storage / a short lab block in **one call** is in scope.
- **Call isolation (default)** — The next prompt does not see the last run’s EVM unless you pass that prestate again (or a future snapshot handle).
- **Raw bytecode, base-layer only** — No Solidity compilation in the service. ERC/application-layer concerns are out of scope.
- **Observability first** — Rich execution traces (stack, gas, opcodes) are a primary deliverable.
- **Hard wall** — No sequential multi-block **historical** backtesting (archive-node / `revm` territory).

See [Guarantees](/use/guarantees) for limits and provenance details.

## Changelog

<Changelog
  title="Capabilities Changelog"
  :entries="[
    { version: 'v0.16', date: '2026-09-17', summary: 'Fusaka runs are first-class for current-mainnet features, not only preview compares.' },
    { version: 'v0.15', date: '2026-09-16', summary: 'generate + inspect — BAL from lab block; inspect without chain state.' },
    { version: 'v0.14', date: '2026-09-16', summary: 'Generic hardfork runs (Glamsterdam default) are first-class — EIP modules remain the per-change catalogue.' },
    { version: 'v0.12', date: '2026-09-14', summary: 'BYOS clarified: isolated from chain, demand-built prestate in-call; not an empty-world rule.' },
    { version: 'v0.11', date: '2026-09-10', summary: 'Fourth tool run_block — lab header snapshot and per-tx receipts.' },
    { version: 'v0.10', date: '2026-09-08', summary: 'Third tool run_transaction; renamed run_evm_bytecode → run_bytecode.' },
    { version: 'v0.9', date: '2026-09-02', summary: 'Status is implemented vs public launch — no stdio / self-host product path.' },
    { version: 'v0.8', date: '2026-08-27', summary: 'Renamed simulate_evm_bytecode → run_evm_bytecode.' },
    { version: 'v0.6', date: '2026-08-27', summary: 'Probe lists opcode/encoding facts; no demo scenarios on the catalog.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Probe + simulate MCP tools live on stdio gateway v0.1.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from overview — end-user capability summary under use/.' },
  ]"
/>

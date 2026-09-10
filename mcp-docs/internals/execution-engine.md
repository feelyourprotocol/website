# Execution Engine

> **Status:** v0.1 — `simulateBytecode`, `runTransaction`, `runBlock`, capability registry, provenance.

The **`mcp-execution-engine`** is a pure TypeScript library: stateless EthereumJS v10 simulations with no HTTP, MCP transport, or payments. The gateway (Step 3+) depends on it one-way.

Repository: [feelyourprotocol/mcp-execution-engine](https://github.com/feelyourprotocol/mcp-execution-engine) (v0.1.0). Consumed by `mcp-gateway` via `LocalTaskProcessor`.

End-user tool semantics: [Describe Capabilities](/use/tools/describe-capabilities), [Run Bytecode](/use/tools/run-bytecode), [Run Transaction](/use/tools/run-transaction), [Run Block](/use/tools/run-block), [Coverage](/use/coverage), [Guarantees](/use/guarantees).

## Design principles

- **Query shapes, not library APIs** — the MCP surface exposes generic verbs (`simulate`, `transaction`, `block`, `generate`, `probe`); the engine returns structured results.
- **Fork = capability set** — `(baseHardfork, eips[])` à la carte; named forks (`osaka` baseline, `amsterdam` preview) are curated shortcuts.
- **Provenance on every result** — engine version, fork config, optional EIP maturity metadata, stability rollup, human caveat.
- **Boundaries** — raw bytecode or impersonated transaction fields; no Solidity compile; no archive node; no multi-block historical backtesting.

See also [Design Principles](/internals/design-principles).

## Public API (v0.1)

| Export | Role |
| --- | --- |
| `simulateBytecode(input)` | Run bytecode under a fork config; optional opcode trace |
| `runTransaction(input)` | Run a value-bearing transaction (paid gas, receipt logs) |
| `runBlock(input)` | Run 1–8 txs as a lab block (header snapshot + per-tx receipts) |
| `describeCapabilities()` | Registry snapshot — runnable EIP modules (opcodes, encoding, no demos) |
| `listEipModules()` | Live EIP module list (source of the catalog) |
| `buildCommon(config)` | Resolve `(baseHardfork, eips[])` → EthereumJS `Common` |

## Input / output

```typescript
// SimulateBytecodeInput
{
  bytecode: string
  fork?: { baseHardfork: string; eips?: number[] }
  gasLimit?: string
  trace?: boolean
}

// SimulateBytecodeResult — gasUsedScope: 'call-frame'

// RunTransactionInput
{
  from: string
  to: string
  value?: string
  data?: string
  code?: string
  accounts?: { address: string; balance?: string; code?: string }[]
  fork?: { baseHardfork: string; eips?: number[] }
  gasLimit?: string
}

// RunTransactionResult — gasUsedScope: 'transaction'
// gasUsed is paid tx gas. Amsterdam may include txRegularGas / txStateGas.

// RunBlockInput
{
  transactions: { from: string; to: string; value?: string; data?: string; code?: string; gasLimit?: string }[]
  header?: { slotNumber?: string; number?: string; timestamp?: string }
  accounts?: { address: string; balance?: string; code?: string }[]
  fork?: { baseHardfork: string; eips?: number[] }
}

// RunBlockResult — gasUsedScope: 'block'
// header.gasUsed is the generated header field (Amsterdam may be the 8037 state-gas dimension).
// Paid gas / logs live on transactions[].
```

## Ceilings (guardrails)

| Limit | Value |
| --- | --- |
| Max gas limit | 30_000_000 |
| Default gas limit | 1_000_000 |
| Max bytecode size | 24_576 bytes |
| Max trace steps | 10_000 |
| Max transactions per lab block | 8 |

## Registered capabilities (live)

| EIP | Nature | Runnable | Shapes |
| --- | --- | --- | --- |
| 8024 | new-capability | yes | simulate |
| 7843 | new-capability | yes | block |
| 7708 | new-capability | yes | transaction, simulate |
| 7883 | repricing | yes | simulate |
| 7951 | new-capability | yes | simulate |
| 8037 | new-exec-model | yes | transaction, simulate |

Only runnable modules appear in `describeCapabilities()`. Wallet / receipt questions use **transaction**; opcode / precompile questions use **simulate**; header slot / multi-tx questions use **block**.

Amsterdam in EthereumJS v10 already bundles EIP-8024 and EIP-7843 — `eips: [8024]` / `eips: [7843]` are not pre/post toggles. Use **osaka** baseline vs **amsterdam** preview for those comparisons.

## Development

See [Quality](/internals/quality).

## Changelog

<Changelog
  title="Execution Engine Changelog"
  :entries="[
    { version: 'v0.1.7', date: '2026-09-10', summary: 'EIP-7843 SLOTNUM module — runBlock header.slotNumber; catalog row live.' },
    { version: 'v0.1.6', date: '2026-09-10', summary: 'runBlock lab verb — header snapshot, per-tx receipts, optional slotNumber.' },
    { version: 'v0.1.5', date: '2026-09-08', summary: 'runTransaction (VM tx path); paid gas, 8037 dimensions, 7708 receipt logs.' },
    { version: 'v0.1.4', date: '2026-09-08', summary: 'Simulate result: gasUsedScope plus messageCall approxTxGasUsed (21000 + call-frame).' },
    { version: 'v0.1.3', date: '2026-08-27', summary: 'Osaka mainnet baseline fork; baselineForkId and EIP comparison pairs in probe.' },
    { version: 'v0.1.2', date: '2026-08-27', summary: 'Removed compareVariants — agents call simulateBytecode twice to diff.' },
    { version: 'v0.1.1', date: '2026-08-27', summary: 'EIP module catalog (8024 opcodes/encoding only); stub EIPs and demo scenarios removed.' },
    { version: 'v0.1.0', date: '2026-07-20', summary: 'Initial engine — simulateBytecode, registry, provenance, compareVariants composer, seed presets.' },
  ]"
/>

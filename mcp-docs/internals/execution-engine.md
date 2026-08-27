# Execution Engine

> **Status:** v0.1 — `simulateBytecode`, capability registry, provenance.

The **`mcp-execution-engine`** is a pure TypeScript library: stateless EthereumJS v10 simulations with no HTTP, MCP transport, or payments. The gateway (Step 3+) depends on it one-way.

Repository: [feelyourprotocol/mcp-execution-engine](https://github.com/feelyourprotocol/mcp-execution-engine) (v0.1.0). Consumed by `mcp-gateway` via `LocalTaskProcessor`.

End-user tool semantics: [Describe Capabilities](/use/tools/describe-capabilities), [Run Bytecode](/use/tools/run-bytecode), [Coverage](/use/coverage), [Guarantees](/use/guarantees).

## Design principles

- **Query shapes, not library APIs** — the MCP surface exposes generic verbs (`simulate`, `generate`, `probe`); the engine returns structured results.
- **Fork = capability set** — `(baseHardfork, eips[])` à la carte; named forks (`osaka` baseline, `amsterdam` preview) are curated shortcuts.
- **Provenance on every result** — engine version, fork config, optional EIP maturity metadata, stability rollup, human caveat.
- **Boundaries** — raw bytecode only; no Solidity compile; no archive node; no multi-block historical backtesting.

See also [Design Principles](/internals/design-principles).

## Public API (v0.1)

| Export | Role |
| --- | --- |
| `simulateBytecode(input)` | Run bytecode under a fork config; optional opcode trace |
| `describeCapabilities()` | Registry snapshot — runnable EIP modules (opcodes, encoding, no demos) |
| `listEipModules()` | Live EIP module list (source of the catalog) |
| `buildCommon(config)` | Resolve `(baseHardfork, eips[])` → EthereumJS `Common` |

## Input / output

```typescript
// SimulateBytecodeInput
{
  bytecode: string          // hex, 0x-prefixed or not
  fork?: { baseHardfork: string; eips?: number[] }
  gasLimit?: string         // default 1_000_000
  trace?: boolean           // stack-only steps when true
}

// SimulateBytecodeResult (JSON-safe)
{
  success: boolean
  gasUsed: string
  returnValue: string
  finalStack: string[]
  error: string | null
  steps?: StepTrace[]
  provenance: Provenance    // always present
}
```

## Ceilings (guardrails)

| Limit | Value |
| --- | --- |
| Max gas limit | 30_000_000 |
| Default gas limit | 1_000_000 |
| Max bytecode size | 24_576 bytes |
| Max trace steps | 10_000 |

## Registered capabilities (live)

| EIP | Nature | Runnable | Shapes |
| --- | --- | --- | --- |
| 8024 | new-capability | yes | simulate |

Only runnable modules appear in `describeCapabilities()`. Each module declares `summary`, `opcodes` (with encoding), and `keywords`. EIP-8024 lives in `src/modules/eip-8024/`. Demo programs belong in tests, not the catalog.

Amsterdam in EthereumJS v10 already bundles EIP-8024 — `eips: [8024]` is not a pre/post toggle. Use **osaka** baseline vs **amsterdam** preview for 8024 comparisons.

## Development

See [Quality](/internals/quality).

## Changelog

<Changelog
  title="Execution Engine Changelog"
  :entries="[
    { version: 'v0.1.3', date: '2026-08-27', summary: 'Osaka mainnet baseline fork; baselineForkId and EIP comparison pairs in probe.' },
    { version: 'v0.1.2', date: '2026-08-27', summary: 'Removed compareVariants — agents call simulateBytecode twice to diff.' },
    { version: 'v0.1.1', date: '2026-08-27', summary: 'EIP module catalog (8024 opcodes/encoding only); stub EIPs and demo scenarios removed.' },
    { version: 'v0.1.0', date: '2026-07-20', summary: 'Initial engine — simulateBytecode, registry, provenance, compareVariants composer, seed presets.' },
  ]"
/>

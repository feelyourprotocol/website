# Execution Engine

> **Status:** v0.1 — `simulateBytecode`, capability registry, provenance, variant-based compare composer.

The **`mcp-execution-engine`** is a pure TypeScript library: stateless EthereumJS v10 simulations with no HTTP, MCP transport, or payments. The gateway (Step 3+) depends on it one-way.

Repository: local scaffold at `feelyourprotocol/mcp-execution-engine` (GitHub publish planned).

End-user tool semantics: [Simulate Bytecode](/use/tools/simulate-bytecode), [Coverage](/use/coverage), [Guarantees](/use/guarantees).

## Design principles

- **Query shapes, not library APIs** — the MCP surface will expose generic verbs (`simulate`, `compare`, `generate`, `probe`); the engine returns structured, diffable results.
- **Fork = capability set** — `(baseHardfork, eips[])` à la carte; named forks (e.g. `amsterdam`) are curated shortcuts.
- **Provenance on every result** — engine version, fork config, optional EIP maturity metadata, stability rollup, human caveat.
- **Boundaries** — raw bytecode only; no Solidity compile; no archive node; no multi-block historical backtesting.

See also [Design Principles](/internals/design-principles).

## Public API (v0.1)

| Export | Role |
| --- | --- |
| `simulateBytecode(input)` | Run bytecode under a fork config; optional opcode trace |
| `compareVariants(input)` | N variants (each with own fork + bytecode) → diff |
| `describeCapabilities()` | Registry snapshot for future `describe_capabilities` MCP tool |
| `buildCommon(config)` | Resolve `(baseHardfork, eips[])` → EthereumJS `Common` |
| `listPresets()` | Seed preset definitions (light curation) |

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

## Registered capabilities (seed)

| EIP | Nature | Shapes |
| --- | --- | --- |
| 8024 | new-capability | simulate, compare |
| 7883 | repricing | simulate, compare |
| 7928 | new-structure | generate, simulate |
| 7951 | new-capability | simulate, compare |
| 8141 | new-exec-model | simulate (not yet implemented) |

Provenance fields are **basic and mostly optional** in v0.1 — we will tighten and automate ingestion over time.

## Development

See [Quality](/internals/quality).

## Changelog

<Changelog
  title="Execution Engine Changelog"
  :entries="[
    { version: 'v0.1.0', date: '2026-07-20', summary: 'Initial engine — simulateBytecode, registry, provenance, compareVariants composer, seed presets.' },
  ]"
/>

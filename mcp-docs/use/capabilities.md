# Capabilities

> **Status:** Gateway v0.1 **live (stdio)** — `describe_capabilities` + `simulate_evm_bytecode` + `compare_evm_variants`. Remote HTTP planned.

The MCP server exposes **intent-driven tools** — verbs that match how agents and integrators think about protocol work, not raw library APIs one-to-one.

## Query shapes

| Shape | MCP tool | What it does | Status |
| --- | --- | --- | --- |
| **Probe** | `describe_capabilities` | Supported forks, runnable EIP modules, opcodes, encoding | **Live** (stdio) |
| **Simulate** | `simulate_evm_bytecode` | Run raw bytecode under a fork; optional trace | **Live** (stdio) |
| **Compare** | `compare_evm_variants` | N variants (each with own fork + bytecode) → diff | **Live** (stdio) |
| **Generate** | — | Block-level access lists (EIP-7928) | Planned (Step 6) |

## Scope boundaries

- **Stateless / BYOS** — You supply bytecode and state overrides. No archive node, no mainnet sync.
- **Raw bytecode, base-layer only** — No Solidity compilation in the service. ERC/application-layer concerns are out of scope.
- **Observability first** — Rich execution traces (stack, gas, opcodes) are a primary deliverable.
- **Hard wall** — No sequential multi-block historical backtesting (archive-node / `revm` territory).

See [Guarantees](/use/guarantees) for limits and provenance details.

## Changelog

<Changelog
  title="Capabilities Changelog"
  :entries="[
    { version: 'v0.6', date: '2026-08-27', summary: 'Probe lists opcode/encoding facts; no demo scenarios on the catalog.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Probe + simulate MCP tools live on stdio gateway v0.1.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from overview — end-user capability summary under use/.' },
  ]"
/>

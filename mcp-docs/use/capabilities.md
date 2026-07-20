# Capabilities

> **Status:** Bytecode simulation is in progress (engine v0.1 local). Gateway tools and remote endpoint — not live yet.

The MCP server exposes **intent-driven tools** — verbs that match how agents and integrators think about protocol work, not raw library APIs one-to-one.

## Query shapes

| Shape | What it does | Status |
| --- | --- | --- |
| **Simulate** | Run raw bytecode under a fork / EIP configuration; optional execution trace | Engine v0.1 (local) |
| **Compare** | Run multiple variants (each with its own fork + bytecode) and diff results | Engine v0.1 (local) |
| **Generate** | Produce structured outputs such as block-level access lists | Planned |
| **Probe** | Describe what the server supports — forks, EIPs, limits | Planned |

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
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from overview — end-user capability summary under use/.' },
  ]"
/>

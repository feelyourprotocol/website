# Design Principles

These boundaries apply to everything we ship.

## Service boundaries

- **Stateless / BYOS** — Callers supply bytecode and state overrides. No archive node, no mainnet sync.
- **Raw bytecode, base-layer only** — No Solidity compilation in the service. ERC/application-layer concerns are out of scope.
- **Observability first** — Rich execution traces (stack, memory, gas, opcodes) are a primary deliverable.
- **Intent-driven MCP tools** — Tools match use cases (simulate bytecode, generate BAL, …), not raw library APIs one-to-one.
- **Exploration twins** — Every live website exploration has an MCP-docs EIP page mapping the same problem set; engine modules ship when a verb can run the change. Canonical metadata lives in website `canonical.ts`.
- **Hard wall** — No sequential multi-block historical backtesting (archive-node / `revm` territory).

## Engine design

- **Query shapes, not library APIs** — generic verbs (`simulate`, `generate`, `probe`); structured results.
- **Fork = capability set** — `(baseHardfork, eips[])` à la carte; named forks are curated shortcuts.
- **Provenance on every result** — engine version, fork config, optional EIP maturity metadata.

End-user summary: [Capabilities](/use/capabilities), [Guarantees](/use/guarantees).

## Changelog

<Changelog
  title="Design Principles Changelog"
  :entries="[
    { version: 'v0.3', date: '2026-07-20', summary: 'Consolidated from overview and execution-engine under internals/.' },
  ]"
/>

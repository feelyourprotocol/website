# Design Principles

These boundaries apply to everything we ship.

## Service boundaries

- **Isolated lab, not a node (BYOS)** — We never attach to mainnet, an L2, or an archive RPC. The caller brings — or we **construct in this request** — the accounts, code, and storage the run needs. That is what “stateless” meant: not a full node, **not** “the lab world must be empty.”
- **Demand-built prestate is in scope** — Prefund, install code, seed storage, several txs in one `run_block`. “Pre-deploy this contract, then EXTCODESIZE it” is one call. Default after the call: discard that world (cheap, parallelizable).
- **Call isolation is the default** — Each tool call is a fresh lab from **that payload**. An MCP transport session (stdio process, HTTP `mcp-session-id`) is not an EVM. Continuation across prompts (“use the contract we just deployed”) is optional later (caller-held snapshot or a short-lived gateway handle) — not shipped, not implied.
- **Raw bytecode, base-layer only** — No Solidity compilation in the service. ERC/application-layer concerns are out of scope.
- **Observability first** — Rich execution traces (stack, memory, gas, opcodes) are a primary deliverable.
- **Intent-driven MCP tools** — Tools match use cases (run bytecode, run transaction, run block, generate BAL, …), not raw library APIs one-to-one.
- **Exploration twins** — Every live website exploration has an MCP-docs EIP page mapping the same problem set; engine modules ship when a verb can run the change. Canonical metadata lives in website `canonical.ts`.
- **Hard wall** — No sequential multi-block **historical** backtesting (archive-node / `revm` territory). A lab block of 1–8 constructed txs is not that.

## Engine design

- **Query shapes, not library APIs** — generic verbs (`simulate`, `transaction`, `block`, `generate`, `probe`); structured results.
- **Fork = capability set** — `(baseHardfork, eips[])` à la carte; named forks are curated shortcuts.
- **Provenance on every result** — engine version, fork config, optional EIP maturity metadata.

End-user summary: [Capabilities](/use/capabilities), [Guarantees](/use/guarantees).

## Changelog

<Changelog
  title="Design Principles Changelog"
  :entries="[
    { version: 'v0.6', date: '2026-09-14', summary: 'Isolated lab vs empty world — BYOS includes demand-built prestate; MCP session is not EVM state.' },
    { version: 'v0.5', date: '2026-09-10', summary: 'block shape (run_block) alongside simulate / transaction / generate / probe.' },
    { version: 'v0.4', date: '2026-09-08', summary: 'transaction shape alongside simulate / generate / probe.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Consolidated from overview and execution-engine under internals/.' },
  ]"
/>

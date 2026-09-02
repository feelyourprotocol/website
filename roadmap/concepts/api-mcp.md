# Agent API & MCP Server (Concept)

> **Strategic sketch — operational docs on [mcp-docs.feelyourprotocol.org](https://mcp-docs.feelyourprotocol.org).** The execution engine and gateway tools exist; the **public hosted endpoint** is not launched yet. See [Launch week](/roadmap/launch).

## What we're building

**Feel Your Protocol MCP server**: a headless service wrapping the EthereumJS stack so an AI agent can run **exact, deterministic simulations of the future Ethereum protocol** — upcoming forks, EIPs, and research — and get back not just a result, but a step-by-step trace it can reason over.

**Delivery shape:** primarily an **MCP server** over HTTP at `mcp.feelyourprotocol.org` — not a bare REST API, not a self-host tutorial. [MCP](https://modelcontextprotocol.io) is the agent↔tool standard: discover tools, read schemas, call without custom prompt engineering.

## Live tool surface _(v0.1 — generic verbs)_

We deliberately ship **intent-driven tools**, not per-EIP endpoints:

| MCP tool | Shape | Purpose |
| --- | --- | --- |
| `describe_capabilities` | probe | Registry: forks, runnable EIP modules, opcodes, encoding |
| `run_evm_bytecode` | run | Run caller-supplied bytecode under a fork config; optional trace |

EIP coverage is advertised through the probe response and human catalogue pages under `mcp-docs/use/eips/` — not separate tools like `simulate_eip8024_stack`. Compare baseline vs preview by calling **run** twice (e.g. `osaka` then `amsterdam`).

Full schemas and limits: [mcp-docs/use/tools/](https://mcp-docs.feelyourprotocol.org/use/tools/describe-capabilities.html).

## Design principles _(still hold)_

- **Stateless / bring-your-own-state (BYOS).** The caller supplies bytecode and any state overrides; we run in an isolated context and discard state after.
- **Raw bytecode, base-layer only.** No Solidity compilation in the service. ERC application-layer concerns are out of scope.
- **Observability first.** Rich JSON traces (stack, memory, gas, opcodes) are a primary deliverable.
- **Guardrails for agents.** Tool schemas, hard ceilings, and gas-based pricing protect the service (see [Pricing](/monetization/pricing)).

## Use-case scopes _(candidates)_

Three scopes mapped onto the stack — v1 focuses on **run** under upcoming fork rules:

1. **Future-fork gas & opcode simulator** — run bytecode under Osaka vs Amsterdam; compare gas, logs, stack. _Audience:_ DeFi engineers, MEV searchers, auditors. _(8024, 7708, 7883, 7951 in catalogue today.)_
2. **Deep-state security tracer** — return exact stack/memory at sensitive opcodes via optional trace. _Audience:_ security auditors._
3. **Block-level access lists (EIP-7928)** — **generate** shape planned; website exploration is the textbook twin today.

## Likely first users _(hypothesis — to validate at launch)_

Programmatic actors with urgent incentive to understand upcoming forks **before** mainnet: **MEV searchers**, **DeFi/security auditors**, and **L2 / infra teams** running automated integration tests. The website builds trust; the hosted MCP is what they allowlist.

## Illustrative handler _(early sketch — superseded by generic tools)_

An early design explored per-EIP tool names. We rejected that in favour of generic verbs + a live catalogue. The handler shape is still instructive:

```typescript
// Today: one run tool, fork config selects Amsterdam + bundled EIPs
const common = new Common({ chain: 'mainnet', hardfork: 'amsterdam' })
const result = await simulateBytecode({ bytecode, fork: { baseHardfork: 'amsterdam' } })
// → gasUsed, stack, logs, provenance JSON back to the agent
```

## Tech readiness & boundaries

- **TypeScript is fine for this.** Isolated single simulations; the LLM round-trip dominates timing. Modularity and observability matter more than raw speed.
- **Concurrency via worker pool.** CPU-bound sims in Node `worker_threads` so the network layer stays responsive. See [AWS & Hosting](/infrastructure/aws).
- **The hard wall to avoid:** sequential multi-block **historical** backtesting. Archive-node / `revm` territory — outside scope and margins.

## Open questions

- **EIP-7928 generate** — when it ships relative to launch week.
- **x402 integration** — facilitator, proxy, token discount check (build-in-public on the personal dev channel).
- **Registry listings** — metadata and discovery after the hosted endpoint is live.

Resolved: MCP-first delivery (not REST-primary); docs split (roadmap = strategy, mcp-docs = operational).

## Changelog

<Changelog
  title="Agent API Concept Changelog"
  :entries="[
    { version: 'v0.4', date: '2026-09-02', summary: 'Generic MCP tools shipped (describe_capabilities, run_evm_bytecode); per-EIP tool sketch retired; public launch pending.' },
    { version: 'v0.3', date: '2026-07-15', summary: 'MCP docs site live at mcp-docs.feelyourprotocol.org — this page remains the strategic sketch.' },
    { version: 'v0.2', date: '2026-06-30', summary: 'Reframed as in-progress concept — no shipped API.' },
    { version: 'v0.1', date: '2026-06-30', summary: 'Initial outline — MCP-first delivery, stateless/BYOS design, three use-case scopes.' },
  ]"
/>

_Add a one-line entry here whenever the Agent API concept changes._

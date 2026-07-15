# Agent API & MCP Server (Concept)

> **Concept in progress — MCP docs site live; server not shipped yet.** There is no live MCP endpoint today. **Concrete documentation** (as capabilities ship) lives at **[mcp-docs.feelyourprotocol.org](https://mcp-docs.feelyourprotocol.org)**. This roadmap page keeps the strategic sketch and open questions.

## What we're aiming for

The working name is **Feel Your Protocol API / MCP server**: a headless service that would wrap the EthereumJS stack so an AI agent can run **exact, deterministic simulations of the future Ethereum protocol** — upcoming forks, EIPs, and research — and get back not just a result, but a step-by-step trace it can reason over.

**Current lean:** deliver primarily as an **MCP server** rather than a bare REST API. [MCP](https://modelcontextprotocol.io) (Model Context Protocol) is the emerging standard for agent↔tool communication: it lets an agent discover which tools exist, what arguments they take, and how to format calls — without custom prompt engineering. The same core could also be exposed over plain HTTP for non-agent callers. We haven't finalized tool names, schemas, or the HTTP/MCP split yet.

## Design principles _(draft)_

Directional constraints we're using while designing — open to revision:

- **Stateless / bring-your-own-state (BYOS).** The caller supplies the bytecode and any state overrides; we run it in an isolated context and throw the state away after. No archive node, no mainnet sync.
- **Raw bytecode, base-layer only.** The API speaks EVM bytecode. Compiling Solidity is the caller's job; ERC application-layer concerns are out of scope.
- **Observability first.** Rich JSON traces (stack, memory, gas, opcodes) would be a primary deliverable — something EthereumJS's TypeScript core makes easy.
- **Guardrails for agents.** Tool schemas, hard ceilings, and gas-based pricing would protect the service from accidental or malicious heavy queries (see [Pricing & Cost Model](/monetization/pricing)).

## Use-case scopes _(candidates)_

Three scopes we're mapping onto existing libraries — immediate → advanced. Which become v1 tools is still TBD:

1. **Future-fork gas & access-list simulator** — simulate a payload under current vs. upcoming fork rules; generate Block-level Access Lists (EIP-7928). _Audience:_ DeFi engineers, MEV searchers, auditors.
2. **Deep-state security tracer** — return the exact stack/memory at every `DELEGATECALL`/`SSTORE` to verify an auditor agent's assumptions step-by-step.
3. **Hegotá-era execution sandbox** — simulate EL rule changes still scoping under [EIP-8081](https://eips.ethereum.org/EIPS/eip-8081) / [Forkcast](https://forkcast.org/upgrade/hegota/) (e.g. state tiering by write age, `SELFDESTRUCT` deactivation, call/return opcodes); expose Noble crypto primitives where relevant. _Audience:_ infra researchers, protocol engineers.

## Likely first users _(hypothesis)_

If we build this, the earliest adopters would probably be programmatic actors with an urgent incentive to understand upcoming forks **before** mainnet: **MEV searchers**, **DeFi/security auditors**, and **L2 / infra teams** running automated integration tests. Still a hypothesis — to be validated once a PoC exists.

## Illustrative snippet _(sketch, not spec)_

A rough sense of the shape we're exploring — an MCP tool wrapping an EthereumJS EVM run (e.g. for the Glamsterdam stack opcodes in EIP-8024). **Not a committed interface**; names, args, and return shape will change as we prototype.

```typescript
// MCP tool definition the agent would read (schema = the agent's instructions)
server.tool(
  'simulate_eip8024_stack',
  'Executes EVM bytecode to test EIP-8024 stack ops (SWAPN, DUPN, EXCHANGE). ' +
    'Returns deterministic final stack state and gas used.',
  { bytecode: z.string(), gasLimit: z.number().optional() },
  async ({ bytecode, gasLimit }) => runEip8024(bytecode, gasLimit),
)

// Handler: isolated, stateless EthereumJS run, configured for the target fork
const common = new Common({ chain: 'mainnet', hardfork: 'glamsterdam', eips: [8024] })
const vm = await VM.create({ common })
const result = await vm.evm.runCode({ code, gasLimit: BigInt(gasLimit) })
// → serialize gasUsed + final stack + trace back to the agent as JSON
```

## Tech readiness & boundaries

- **TypeScript is fine for this.** The workload is latency-bound, isolated single simulations — and the LLM round-trip dominates timing anyway. Modularity and observability matter more than raw speed here.
- **Concurrency via worker pool.** CPU-bound sims would run in Node `worker_threads` (a fixed pool, e.g. Piscina) so they never block the network layer. No need to make the libraries multi-threaded. See [AWS & Hosting](/infrastructure/aws).
- **The hard wall to avoid:** sequential multi-block **historical** backtesting (stateful chain synchronization). That is archive-node / Rust (`revm`) territory and would wreck both performance and margins. We would restrict or heavily price-gate it.

## Open questions

- Exact MCP tool surface for v1 — which of the three scopes above ship first?
- REST vs MCP-only vs both — and how x402 gates each path.
- Where conceptual docs live vs future API docs — likely split once the PoC stabilizes.

## Changelog

<Changelog
  title="Agent API Concept Changelog"
  :entries="[
    { version: 'v0.3', date: '2026-07-15', summary: 'MCP docs site live at mcp-docs.feelyourprotocol.org — this page remains the strategic sketch; concrete docs move there as capabilities ship.' },
    { version: 'v0.2', date: '2026-06-30', summary: 'Reframed as in-progress concept — no shipped API; removed references to separate API docs as existing destination.' },
    { version: 'v0.1', date: '2026-06-30', summary: 'Initial outline — MCP-first delivery, stateless/BYOS design, three use-case scopes, TypeScript + worker-pool boundaries.' },
  ]"
/>

_Add a one-line entry here whenever the Agent API concept changes._

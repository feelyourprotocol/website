# The Agent API & MCP Server

> High-level outline. The full API surface, tool schemas, and worked examples will live in the dedicated **API docs** (a separate subdomain). This page captures the shape and the boundaries.

## What it is

The **Feel Your Protocol API / MCP server** is a headless service that wraps the EthereumJS stack so an AI agent can run **exact, deterministic protocol simulations** — and get back not just a result, but a step-by-step trace it can reason over.

It is delivered primarily as an **MCP server** rather than a bare REST API. [MCP](https://modelcontextprotocol.io) (Model Context Protocol) is the emerging standard for agent↔tool communication: it lets an agent discover exactly which tools exist, what arguments they take, and how to format calls — no custom prompt engineering. The same core can also be exposed over plain HTTP for non-agent callers.

## Design principles

- **Stateless / bring-your-own-state (BYOS).** The caller supplies the bytecode and any state overrides; we run it in an isolated context and throw the state away after. No archive node, no mainnet sync.
- **Raw bytecode, base-layer only.** The API speaks EVM bytecode. Compiling Solidity is the caller's job; ERC application-layer concerns are out of scope.
- **Observability first.** Rich JSON traces (stack, memory, gas, opcodes) are a primary deliverable — something EthereumJS's TypeScript core makes easy.
- **Guardrails for agents.** Tool schemas, hard ceilings, and gas-based pricing protect the service from accidental or malicious heavy queries (see [Pricing & Cost Model](/monetization/pricing)).

## Use-case scopes

Three scopes, immediate → advanced (all map directly onto existing libraries):

1. **Future-fork gas & access-list simulator** — simulate a payload under current vs. upcoming fork rules; generate Block-level Access Lists (EIP-7928). _Audience:_ DeFi engineers, MEV searchers, auditors.
2. **Deep-state security tracer** — return the exact stack/memory at every `DELEGATECALL`/`SSTORE` to verify an auditor agent's assumptions step-by-step.
3. **Data-structure & cryptography sandbox** — insert state into a Verkle/Hegota-configured manager, generate inclusion proofs, expose Noble crypto primitives. _Audience:_ rollup/ZK/infra researchers.

## Target users (first)

Programmatic actors with an urgent incentive to understand upcoming forks **before** mainnet: **MEV searchers**, **DeFi/security auditors**, and **L2 / infra teams** running automated integration tests.

## Illustrative snippet

A minimal sense of the shape — an MCP tool wrapping an EthereumJS EVM run (e.g. for the Glamsterdam stack opcodes in EIP-8024). The full walkthrough belongs in the API docs.

```typescript
// MCP tool definition the agent reads (schema = the agent's instructions)
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
- **Concurrency via worker pool.** CPU-bound sims run in Node `worker_threads` (a fixed pool, e.g. Piscina) so they never block the network layer. No need to make the libraries multi-threaded. See [AWS & Hosting](/infrastructure/aws).
- **The hard wall to avoid:** sequential multi-block **historical** backtesting (stateful chain synchronization). That is archive-node / Rust (`revm`) territory and would wreck both performance and margins. We restrict or heavily price-gate it.

## Changelog

<Changelog
  title="Agent API Standard Changelog"
  :entries="[
    { version: 'v0.1', date: '2026-06-30', summary: 'Initial outline — MCP-first delivery, stateless/BYOS design, three use-case scopes, TypeScript + worker-pool boundaries.' },
  ]"
/>

_Add a one-line entry here whenever the API standard changes._

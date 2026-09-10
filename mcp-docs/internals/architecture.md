# Architecture

> **Status:** MCP docs site live. Execution engine v0.1. **Public MCP not launched** (HTTP — Step 5). Gateway stdio exists as a development transport in the gateway repo — not a public product path.

## What we are building

| Piece | Role |
| --- | --- |
| **`mcp-execution-engine`** | Pure TypeScript library — stateless EthereumJS simulations (bytecode, transactions, BALs, traces). No HTTP, no payments, no agent protocol. |
| **`mcp-gateway`** | MCP transport + tool registry (+ later observability, x402). Depends one-way on the engine. **HTTP public path planned**; stdio is the current development transport. |
| **`mcp-docs`** (this site) | Public documentation — [Use](/use/introduction) for end users, [Internals](/internals/architecture) for us and deep-divers. |
| **`server-config`** (private) | Nginx blocks, deploy scripts, secrets — not in this public repo. |

**Mental model** (from the [two-legs vision](https://roadmap.feelyourprotocol.org/vision/two-legs.html)): the explorations **website** is the textbook; the **MCP server** is the lab equipment.

## Roots in the website

The MCP server reuses the same EthereumJS v10 patterns already proven in the [explorations website](https://feelyourprotocol.org):

- EIP-8024 stack ops — `createEVM` + `evm.runCode` (see the EIP-8024 exploration)
- EIP-8037 state gas — `createVM` + `runTx` (see the EIP-8037 exploration)
- EIP-7708 transfer logs — `createVM` + `runBlock` (receipts; see the EIP-7708 exploration)
- EIP-7928 block-level access lists — `createVM` + `runBlock` + `blockLevelAccessList` (see the BAL exploration)

The browser `eComponents` layer and the server execution engine are **separate code paths today**; converging shared core logic is a future DRY seam.

## Endpoints

| URL / transport | Purpose | Status |
| --- | --- | --- |
| `https://mcp-docs.feelyourprotocol.org` | This documentation site | **Live** (static on Strato) |
| `https://mcp.feelyourprotocol.org/mcp` | Remote MCP over HTTP | Planned (Step 5, AWS EC2) |

## Status {#status}

Build sequence (see [roadmap timeline](https://roadmap.feelyourprotocol.org/roadmap/timeline.html)):

1. ~~**MCP docs site**~~ — this site
2. ~~**Execution engine**~~ — `simulateBytecode()` + `runTransaction()` + `runBlock()` + capability registry ([reference](/internals/execution-engine))
3. ~~**Gateway (stdio)**~~ — development transport / PoC — **four tools implemented**
4. **AWS bootstrap** — EC2, nginx, TLS, deploy pipeline
5. **HTTP transport** — remote MCP endpoint
6. **Further tools** — EIP-7928 BAL generate, observability, x402, …

## Changelog

<Changelog
  title="Architecture Changelog"
  :entries="[
    { version: 'v0.10', date: '2026-09-10', summary: 'run_block lab verb — header snapshot and per-tx receipts; BAL generate still planned.' },
    { version: 'v0.9', date: '2026-09-08', summary: 'Engine/gateway surface: run_transaction plus run_bytecode rename; 8037/7708 website primitives documented.' },
    { version: 'v0.8', date: '2026-09-02', summary: 'Public endpoints table is hosted-only; stdio is development transport, not a user path.' },
    { version: 'v0.7', date: '2026-08-27', summary: 'compare_evm_variants removed — probe + simulate only.' },
    { version: 'v0.6', date: '2026-08-27', summary: 'EIP-8024 module is opcode/encoding support; callers supply bytecode.' },
    { version: 'v0.5', date: '2026-08-27', summary: 'compare_evm_variants live; EIP-8024 module catalog (runnable only).' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Gateway stdio v0.1 live — Step 3 core tools shipped.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Docs restructure — use/ vs internals/ split; architecture page replaces overview internals.' },
    { version: 'v0.2', date: '2026-07-20', summary: 'Execution engine v0.1.0 — simulateBytecode, registry, provenance, compare composer (local repo).' },
    { version: 'v0.1', date: '2026-07-15', summary: 'Initial MCP docs site — overview, roadmap relationship, terminal-green skin.' },
  ]"
/>

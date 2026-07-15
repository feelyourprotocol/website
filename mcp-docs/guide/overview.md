# Overview

> **Status:** MCP docs site live (Step 1). Execution engine and gateway repositories — next steps.

Feel Your Protocol is building a **headless MCP server** that wraps the EthereumJS stack so AI agents can run **exact, deterministic simulations** of the *future* Ethereum protocol — upcoming forks, EIPs, and research — and receive rich JSON traces they can reason over.

This site is the **concrete reference**: what we have built, how to use it, and how we operate it. For vision, strategy, and draft concepts, see the [roadmap site](https://roadmap.feelyourprotocol.org).

## What we are building

| Piece | Role |
| --- | --- |
| **`mcp-execution-engine`** | Pure TypeScript library — stateless EthereumJS simulations (bytecode, BALs, traces). No HTTP, no payments, no agent protocol. |
| **`mcp-gateway`** | Public face on AWS — MCP transport, tool registry, observability, and (later) x402 payments. Depends one-way on the engine. |
| **`mcp-docs`** (this site) | Public documentation for users (human + AI) and for our own replication/extension workflow. |
| **`server-config`** (private) | Nginx blocks, deploy scripts, secrets — not in this public repo. |

**Mental model** (from the [two-legs vision](https://roadmap.feelyourprotocol.org/vision/two-legs.html)): the explorations **website** is the textbook; the **MCP server** is the lab equipment.

## Design principles

These boundaries apply to everything we ship:

- **Stateless / BYOS** — Callers supply bytecode and state overrides. No archive node, no mainnet sync.
- **Raw bytecode, base-layer only** — No Solidity compilation in the service. ERC/application-layer concerns are out of scope.
- **Observability first** — Rich execution traces (stack, memory, gas, opcodes) are a primary deliverable.
- **Intent-driven MCP tools** — Tools match use cases (simulate bytecode, generate BAL, …), not raw library APIs one-to-one.
- **Hard wall** — No sequential multi-block historical backtesting (archive-node / `revm` territory).

## Roots in the website

The MCP server reuses the same EthereumJS v10 patterns already proven in the [explorations website](https://feelyourprotocol.org):

- EIP-8024 stack ops — `createEVM` + `evm.runCode` (see the EIP-8024 exploration)
- EIP-7928 block-level access lists — `createVM` + `runBlock` + `blockLevelAccessList` (see the BAL exploration)

The browser `eComponents` layer and the server execution engine are **separate code paths today**; converging shared core logic is a future DRY seam.

## Repositories {#repositories}

| Repo | Visibility | Status |
| --- | --- | --- |
| [feelyourprotocol/website](https://github.com/feelyourprotocol/website) | Public | Live — explorations + this docs site |
| `feelyourprotocol/mcp-execution-engine` | Public | **Planned** (Step 2) |
| `feelyourprotocol/mcp-gateway` | Public | **Planned** (Step 3+) |
| `feelyourprotocol/server-config` | Private | Ops configs for all sites + future MCP host |

## Endpoints (planned)

| URL | Purpose | Status |
| --- | --- | --- |
| `https://mcp-docs.feelyourprotocol.org` | This documentation site | **Live** (static on Strato) |
| `https://mcp.feelyourprotocol.org/mcp` | Remote MCP over HTTP | Planned (Step 5, AWS EC2) |

## Status {#status}

Build sequence (see [roadmap timeline](https://roadmap.feelyourprotocol.org/roadmap/timeline.html)):

1. **MCP docs site** — this site (you are here)
2. **Execution engine** — `simulateBytecode()` + tests
3. **Gateway (stdio)** — local agent PoC
4. **AWS bootstrap** — EC2, nginx, TLS, deploy pipeline
5. **HTTP transport** — remote MCP endpoint
6. **Further tools** — EIP-7928 BAL, observability, x402, …

## Changelog

<Changelog
  title="Overview Changelog"
  :entries="[
    { version: 'v0.1', date: '2026-07-15', summary: 'Initial MCP docs site — overview, roadmap relationship, terminal-green skin.' },
  ]"
/>

_Add a one-line entry here whenever this overview changes materially._

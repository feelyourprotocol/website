# Architecture

> **Status:** MCP docs site live. Execution engine v0.1. **Gateway stdio v0.1 live.** Remote HTTP — Step 5.

## What we are building

| Piece | Role |
| --- | --- |
| **`mcp-execution-engine`** | Pure TypeScript library — stateless EthereumJS simulations (bytecode, BALs, traces). No HTTP, no payments, no agent protocol. |
| **`mcp-gateway`** | MCP transport + tool registry (+ later observability, x402). Depends one-way on the engine. **Stdio live**; AWS HTTP later. |
| **`mcp-docs`** (this site) | Public documentation — [Use](/use/introduction) for end users, [Internals](/internals/architecture) for us and deep-divers. |
| **`server-config`** (private) | Nginx blocks, deploy scripts, secrets — not in this public repo. |

**Mental model** (from the [two-legs vision](https://roadmap.feelyourprotocol.org/vision/two-legs.html)): the explorations **website** is the textbook; the **MCP server** is the lab equipment.

## Roots in the website

The MCP server reuses the same EthereumJS v10 patterns already proven in the [explorations website](https://feelyourprotocol.org):

- EIP-8024 stack ops — `createEVM` + `evm.runCode` (see the EIP-8024 exploration)
- EIP-7928 block-level access lists — `createVM` + `runBlock` + `blockLevelAccessList` (see the BAL exploration)

The browser `eComponents` layer and the server execution engine are **separate code paths today**; converging shared core logic is a future DRY seam.

## Endpoints

| URL / transport | Purpose | Status |
| --- | --- | --- |
| `https://mcp-docs.feelyourprotocol.org` | This documentation site | **Live** (static on Strato) |
| stdio — `mcp-gateway` | Local MCP (Cursor, Claude Desktop) | **Live** (v0.1) |
| `https://mcp.feelyourprotocol.org/mcp` | Remote MCP over HTTP | Planned (Step 5, AWS EC2) |

## Status {#status}

Build sequence (see [roadmap timeline](https://roadmap.feelyourprotocol.org/roadmap/timeline.html)):

1. ~~**MCP docs site**~~ — this site
2. ~~**Execution engine**~~ — `simulateBytecode()` + capability registry ([reference](/internals/execution-engine))
3. ~~**Gateway (stdio)**~~ — local agent PoC — **two tools live**
4. **AWS bootstrap** — EC2, nginx, TLS, deploy pipeline
5. **HTTP transport** — remote MCP endpoint
6. **Further tools** — EIP-7928 BAL generate, observability, x402, …

## Changelog

<Changelog
  title="Architecture Changelog"
  :entries="[
    { version: 'v0.4', date: '2026-07-22', summary: 'Gateway stdio v0.1 live — Step 3 core tools shipped.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Docs restructure — use/ vs internals/ split; architecture page replaces overview internals.' },
    { version: 'v0.2', date: '2026-07-20', summary: 'Execution engine v0.1.0 — simulateBytecode, registry, provenance, compare composer (local repo).' },
    { version: 'v0.1', date: '2026-07-15', summary: 'Initial MCP docs site — overview, roadmap relationship, terminal-green skin.' },
  ]"
/>

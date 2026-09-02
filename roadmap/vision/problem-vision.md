# Problem & Vision

## About this site

**roadmap.feelyourprotocol.org** is the Phase 3 **strategy and history workspace** — vision, tracks, timeline, and draft concepts for the sustainable business layer. It records where our thinking stands, including open questions, so we have a stable place to iterate.

**What exists today:** the [explorations website](https://feelyourprotocol.org), [website docs](https://website-docs.feelyourprotocol.org), [MCP docs](https://mcp-docs.feelyourprotocol.org), the execution engine and gateway (tools implemented), and years of EthereumJS work behind both legs. **What we're shipping next:** the **public hosted MCP** at `mcp.feelyourprotocol.org` with [x402](/concepts/x402) payment rails — [launch week 5–9 October 2026](/roadmap/launch).

This scope is deliberate: we are **not** building general mainnet infrastructure, RPC, or testnet ops — that work lives elsewhere in the ecosystem. FYP targets the gap between probabilistic LLMs and **deterministic simulation of protocol changes not yet on mainnet**.

For tracks, horizons, and how ideas evolve over time, see [Roadmap & Tracks](/roadmap/roadmap) — fast-moving sections there and on the [Agent API concept](/concepts/api-mcp) and [pricing model](/monetization/pricing) pages each carry a **micro-changelog** at the bottom.

## The Problem

There is a large and growing gap between the **Ethereum protocol layer** and the **application layer**. Protocol changes — EIPs, hard forks, and research — are hard to follow, hard to explain, and hard to build against. Feel Your Protocol started to help close that gap: to explain and educate on protocol updates, hands on.

Phase 3 adds a second axis to the same problem. As AI agents take on real protocol work — auditing contracts, optimizing MEV, testing upgrades — they hit a hard wall:

> **LLMs are probabilistic; the Ethereum protocol is strictly deterministic.**

An AI model cannot reliably simulate cascading state changes, calculate exact gas under an unreleased EIP, or trace deep stack manipulations. It will confidently hallucinate. What agents lack is a deterministic **ground-truth oracle** they can call to get the real answer.

## The Vision

Build Feel Your Protocol into the **deterministic oracle for the future Ethereum protocol** — a headless **MCP server** that wraps the modular [EthereumJS](https://github.com/ethereumjs/ethereumjs-monorepo) stack so that AI agents (and the researchers behind them) can run real, exact simulations of upcoming fork rules, EIPs, and research targets on demand.

In one line: **deterministic truth for probabilistic machines.**

The lab equipment **exists** — engine, gateway tools, and a growing EIP catalogue on [mcp-docs](https://mcp-docs.feelyourprotocol.org). The product milestone is the **hosted, paid endpoint** agents connect to without self-hosting. Concrete tool schemas and limits live on mcp-docs; this site keeps the strategic sketch.

The educational website does not get left behind — it remains the **visual front door** and DevRel engine while keeping its teaching mission. See [Two Legs, One Engine](/vision/two-legs).

## Why us (the moat)

- **Domain depth.** Years of building EIP prototypes and maintaining critical infrastructure inside the Ethereum ecosystem — context an LLM cannot synthesize on its own.
- **A uniquely suited stack.** EthereumJS is highly modular (13+ libraries), TypeScript-native, and exceptionally observable — easy to switch fork contexts, manipulate state, dump step-by-step traces, and expose cryptographic primitives (via the Noble ecosystem). This is hard to replicate with a monolithic Rust node.
- **Founder & brand trust.** A recognizable, education-first brand and an open-source track record lower the barrier for developers to trust — and allowlist — the infrastructure.
- **Proof over promise.** We document **without MCP vs with MCP** comparisons — same prompt, same model, different outcome — so the oracle thesis is checked, not asserted.

## Target product — what we're aiming for (and what we're not)

Boundaries we hold to keep scope honest:

- **Aiming for:** a headless, **stateless** EVM simulation & cryptographic oracle. Bring-your-own-state; raw bytecode in, deterministic JSON trace out. Delivered as a **hosted MCP server** (not a self-host tutorial).
- **Explicitly not:** a generic RPC provider, an archive node, or a high-throughput indexer. We deliberately avoid sequential multi-block historical processing (see [Tech Readiness & Boundaries](/concepts/api-mcp#tech-readiness-boundaries)).

These lines will move as we learn — operational detail lives on [mcp-docs](https://mcp-docs.feelyourprotocol.org).

## Where this fits

- **[Two Legs, One Engine](/vision/two-legs)** — how the website and the MCP server reinforce each other.
- **[Principles & Operating Discipline](/vision/principles)** — the guardrails we hold ourselves to.
- **[Roadmap & Tracks](/roadmap/roadmap)** · **[Timeline](/roadmap/timeline)** · **[Launch week](/roadmap/launch)** — how and when we ship.

## Changelog

<Changelog
  title="Problem & Vision Changelog"
  :entries="[
    { version: 'v0.4', date: '2026-09-02', summary: 'Lab equipment built — public hosted launch is the next milestone; mcp-docs and generic MCP tools acknowledged.' },
    { version: 'v0.3', date: '2026-07-15', summary: 'MCP docs site live — strategic sketch stays here; concrete docs on mcp-docs.' },
    { version: 'v0.2', date: '2026-06-30', summary: 'Reframed as conceptualization workspace — conditional language for unshipped API.' },
    { version: 'v0.1', date: '2026-06-30', summary: 'Initial problem & vision outline.' },
  ]"
/>

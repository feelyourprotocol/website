# Problem & Vision

## About this site

**roadmap.feelyourprotocol.org** is the Phase 3 **conceptualization workspace** — not a product manual for something that already ships. It records where our thinking stands right now, including open questions and placeholders, so we have a stable place to iterate over the coming weeks.

**What exists today:** the [explorations website](https://feelyourprotocol.org), the [website docs](https://docs.feelyourprotocol.org), and years of EthereumJS work behind both. **What we're still designing step by step:** a deterministic API and MCP server for the future Ethereum protocol — upcoming forks, EIPs, and research — for AI agents; how it connects to the website; and how it gets paid for. Nothing here is final until it's built and checked.

This scope is deliberate: we are **not** building general mainnet infrastructure, RPC, or testnet ops — that work lives elsewhere in the ecosystem. FYP targets the gap between probabilistic LLMs and **deterministic simulation of protocol changes not yet on mainnet**.

For tracks, horizons, and how ideas evolve over time, see [Roadmap & Tracks](/roadmap/roadmap) — fast-moving sections there and on the [Agent API concept](/concepts/api-mcp) and [pricing model](/monetization/pricing) pages each carry a **micro-changelog** at the bottom.

## The Problem

There is a large and growing gap between the **Ethereum protocol layer** and the **application layer**. Protocol changes — EIPs, hard forks, and research — are hard to follow, hard to explain, and hard to build against. Feel Your Protocol started to help close that gap: to explain and educate on protocol updates, hands on.

Phase 3 adds a second axis to the same problem. As AI agents take on real protocol work — auditing contracts, optimizing MEV, testing upgrades — they hit a hard wall:

> **LLMs are probabilistic; the Ethereum protocol is strictly deterministic.**

An AI model cannot reliably simulate cascading state changes, calculate exact gas under an unreleased EIP, or trace deep stack manipulations. It will confidently hallucinate. What agents lack is a deterministic **ground-truth oracle** they can call to get the real answer.

## The Vision

The direction we're working toward: build Feel Your Protocol into the **deterministic oracle for the future Ethereum protocol** — a headless API and **MCP server** that wraps the modular [EthereumJS](https://github.com/ethereumjs/ethereumjs-monorepo) stack so that AI agents (and the researchers behind them) can run real, exact simulations of upcoming fork rules, EIPs, and research targets on demand.

In one line: **deterministic truth for probabilistic machines.**

This is a **target product shape**, not something that exists yet. The first job over the coming weeks is to turn that vision into a concrete design — API boundaries, MCP tool surface, payment flow — and then into a working PoC.

The educational website does not get left behind — it becomes the **visual front door** to the programmatic offering while keeping its original teaching mission. See [Two Legs, One Engine](/vision/two-legs).

## Why us (the moat)

- **Domain depth.** Years of building EIP prototypes and maintaining critical infrastructure inside the Ethereum ecosystem — context an LLM cannot synthesize on its own.
- **A uniquely suited stack.** EthereumJS is highly modular (13+ libraries), TypeScript-native, and exceptionally observable — easy to switch fork contexts, manipulate state, dump step-by-step traces, and expose cryptographic primitives (via the Noble ecosystem). This is hard to replicate with a monolithic Rust node.
- **Founder & brand trust.** A recognizable, education-first brand and an open-source track record lower the barrier for developers to trust — and eventually adopt — the infrastructure.

## Target product — what we're aiming for (and what we're not)

Draft boundaries we're using to keep scope honest while we conceptualize:

- **Aiming for:** a headless, **stateless** EVM simulation & cryptographic oracle. Bring-your-own-state; raw bytecode in, deterministic JSON trace out.
- **Explicitly not:** a generic RPC provider, an archive node, or a high-throughput indexer. We deliberately avoid sequential multi-block historical processing (see [Tech Readiness & Boundaries](/concepts/api-mcp#tech-readiness-boundaries)).

These lines will move as we learn — that's what the [Agent API concept page](/concepts/api-mcp) is for.

## Where this fits

- **[Two Legs, One Engine](/vision/two-legs)** — how the website and the planned API reinforce each other.
- **[Principles & Operating Discipline](/vision/principles)** — the guardrails we hold ourselves to.
- **[Roadmap & Tracks](/roadmap/roadmap)** · **[Timeline](/roadmap/timeline)** — how and when we plan to build it.

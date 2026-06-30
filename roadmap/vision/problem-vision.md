# Problem & Vision

## The Problem

There is a large and growing gap between the **Ethereum protocol layer** and the **application layer**. Protocol changes — EIPs, hard forks, and research — are hard to follow, hard to explain, and hard to build against. Feel Your Protocol started to help close that gap: to explain and educate on protocol updates, hands on.

Phase 3 adds a second axis to the same problem. As AI agents take on real protocol work — auditing contracts, optimizing MEV, testing upgrades — they hit a hard wall:

> **LLMs are probabilistic; the Ethereum protocol is strictly deterministic.**

An AI model cannot reliably simulate cascading state changes, calculate exact gas under an unreleased EIP, or trace deep stack manipulations. It will confidently hallucinate. What agents lack is a deterministic **ground-truth oracle** they can call to get the real answer.

## The Vision

Build Feel Your Protocol into the **deterministic EVM oracle for the agent economy** — a headless API and **MCP server** that wraps the modular [EthereumJS](https://github.com/ethereumjs/ethereumjs-monorepo) stack so that AI agents (and the researchers behind them) can run real, exact protocol simulations on demand.

In one line: **deterministic truth for probabilistic machines.**

The educational website does not get left behind — it becomes the **visual front door** to the programmatic offering while keeping its original teaching mission. See [Two Legs, One Engine](/vision/two-legs).

## Why us (the moat)

- **Domain depth.** Years of building EIP prototypes and maintaining critical infrastructure inside the Ethereum ecosystem — context an LLM cannot synthesize on its own.
- **A uniquely suited stack.** EthereumJS is highly modular (13+ libraries), TypeScript-native, and exceptionally observable — easy to switch fork contexts, manipulate state, dump step-by-step traces, and expose cryptographic primitives (via the Noble ecosystem). This is hard to replicate with a monolithic Rust node.
- **Founder & brand trust.** A recognizable, education-first brand and an open-source track record lower the barrier for developers to trust — and adopt — the infrastructure.

## What this is — and isn't

- **Is:** a headless, **stateless** EVM simulation & cryptographic oracle. Bring-your-own-state; raw bytecode in, deterministic JSON trace out.
- **Isn't:** a generic RPC provider, an archive node, or a high-throughput indexer. We deliberately avoid sequential multi-block historical processing (see [Tech Readiness & Boundaries](/concepts/api-mcp#tech-readiness-boundaries)).

## Where this fits

- **[Two Legs, One Engine](/vision/two-legs)** — how the website and the API reinforce each other.
- **[Principles & Operating Discipline](/vision/principles)** — the guardrails we hold ourselves to.
- **[Roadmap & Tracks](/roadmap/roadmap)** · **[Timeline](/roadmap/timeline)** — how and when this gets built.

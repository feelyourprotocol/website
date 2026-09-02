# Principles & Operating Discipline

The shift from "fun side project" to "sustainable business" is a vulnerable moment — community attention, personal pride, and reputation all raise the stakes. These principles are the guardrails we hold ourselves to so ambition stays grounded and the project stays honest.

## Operating principles

- **Deterministic truth above all.** The product's entire value is exactness. Correctness, reproducibility and transparent traces beat speed and breadth.
- **Scope discipline.** Be the best at one thing — isolated, stateless EVM simulation and cryptographic primitives. Say no to archive-node territory, `solc`, ERC-app-layer logic, and consensus-layer mechanics. (See [boundaries](/concepts/api-mcp#tech-readiness-boundaries).)
- **Frictionless for outsiders, rewarding for insiders.** Never put the community token in the critical path of a paying agent; let it be a [discount and a perk](/monetization/token), not a gate.
- **Hosted is the product.** Open source stays open; official docs and marketing describe the **public endpoint**, not a self-host path. Permissionless builders can still read the repos — that is ethos, not go-to-market.
- **Prove the oracle, don't assert it.** Run and publish **without MCP vs with MCP** comparisons (same prompt, same model) before we claim the thesis in public.
- **Cypherpunk character.** Permissionless access, open standards, privacy-respecting, code-first — carried forward from the side-project era into the business.

## Launch discipline _(Oct 2026)_

Before we call the MCP "live":

- HTTP endpoint reachable at `mcp.feelyourprotocol.org`
- x402 path exercised end-to-end (not only designed)
- Connect docs describe the hosted path only
- Catalogue honestly lists Runnable vs Planned EIPs
- At least one checked without/with MCP proof published

See [Launch week](/roadmap/launch) for the public checklist framing.

## Founder traps we watch for

The vision was pressure-tested against a set of recurring psychological/strategic traps. Keeping them visible is part of the discipline:

| Trap | The risk |
| --- | --- |
| **Over- / under-promising** | Hype beyond checked fundamentals, or playing it so safe the idea doesn't matter. |
| **Undervaluing assets** | "AI can do everything" fatalism — forgetting the stack + experience aren't replaceable overnight. |
| **AI sycophancy** | Asking suggestive questions and getting confident confirmation instead of neutral analysis. |
| **Forgetting economics / tech** | Treating monetization or feasibility as an afterthought. |
| **The community trap** | Letting token-community tempo dictate the engineering roadmap. |
| **Audience identity crisis** | Building in the uncanny valley between human-visual and machine-headless — solved by [two legs, one engine](/vision/two-legs). |
| **The infinite-AI-leverage illusion** | Assuming easy creation means easy maintenance; over-committing as a solo builder. |
| **Solution looking for a problem** | Building the API first and hunting for users later. |
| **Agentic-UX blindspot** | Designing for humans when the consumer is an LLM that will silently misuse a bad schema. |
| **Automated-debt avalanche** | Trusting the AI-managed fork pipeline's happy path until a silent logic error surfaces. |
| **Perfect-protocol procrastination** | Over-engineering before a single agent has queried the hosted server in the wild. |
| **x402 as the product** | Payment rails are how agents access the oracle — not the reason to exist. |

> These also make good public-thread material — the project documents its own reasoning in the open.

_This page is a living checklist; refine as the project teaches us new lessons._

## Changelog

<Changelog
  title="Principles Changelog"
  :entries="[
    { version: 'v0.3', date: '2026-09-02', summary: 'PoC shipped — added hosted-product, oracle-proof, and launch-checklist principles; x402-as-product trap.' },
    { version: 'v0.2', date: '2026-06-30', summary: 'Initial founder-traps table and operating principles.' },
  ]"
/>

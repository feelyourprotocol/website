# Two Legs, One Engine

Feel Your Protocol is designed around **two legs that share one engine**. The same EthereumJS core would power both the educational website (which exists today) and a headless agent API for the future Ethereum protocol (which we're still designing) — but each leg serves a different audience and is framed differently.

## The two legs

| | **Leg A — Website** _(live)_ | **Leg B — Future-protocol API & MCP server** _(planned)_ |
| --- | --- | --- |
| Audience | Humans: protocol enthusiasts, devs, the Bankr community | Machines: AI agents, and the researchers/teams behind them |
| Experience | Interactive, visual, educational explorations | Headless, deterministic, well-documented; pre-built LLM tool bindings |
| Optimizes for | Intuition, narrative, trust | Latency, reliability, exact deterministic output |
| Economics | Community, fan token, education | [x402 pay-per-use](/monetization/pricing) in USDC _(concept)_ |

The shared engine is the modular EthereumJS stack and the fork/EIP pipeline behind it — already real on the website side; the agent-facing layer is what Phase 3 adds.

## They reinforce each other (the DevRel funnel)

An early instinct was to fully separate "marketing" the website from the API. That's wrong: **aesthetics don't sell infrastructure, but trust, reputation and educational authority absolutely do.** The website is the project's DevRel engine — and it's already running:

- **Proof-of-work halo.** A meticulous, interactive breakdown of a fork is undeniable proof of competence — it should convert into technical trust for the API underneath once that exists.
- **Education as top-of-funnel.** People arrive to *learn* about an upcoming protocol change; the natural next step will be to *use* the API to act on it.
- **The agent trust proxy.** Humans configure which tools their agents may use. A developer will be far more likely to allowlist our MCP server if they already know and trust the FYP website.

A simple mental model:

> **The website is the textbook. The API is the lab equipment.**

Leg B doesn't exist yet — but we're building the website *as if* that connection is coming, so the funnel is ready when the API lands.

## How they connect, concretely

- The website remains the **visual entry point** — each exploration can eventually link to the specific API capability it showcases.
- Both legs would live as **separate sites/subdomains**, with the [main website](https://feelyourprotocol.org) acting as the **binding ground** that ties the fleet together (`docs.`, `community-token.`, this `roadmap.`, and a future API-docs subdomain once there is something to document).

## The discipline this requires

Two legs means two kinds of work — UI/narrative polish vs. ruthless uptime and deterministic testing. As a small team this is a real resource tension; we manage it explicitly rather than pretending both can move at full speed at once. See [Principles & Operating Discipline](/vision/principles).

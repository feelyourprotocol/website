# Two Legs, One Engine

Feel Your Protocol runs on **two legs that share one engine**. The same EthereumJS core powers both an educational website and a headless agent API — but each leg serves a different audience and is framed differently.

## The two legs

| | **Leg A — Website** | **Leg B — Agent API & MCP server** |
| --- | --- | --- |
| Audience | Humans: protocol enthusiasts, devs, the Bankr community | Machines: AI agents, and the researchers/teams behind them |
| Experience | Interactive, visual, educational explorations | Headless, deterministic, well-documented; pre-built LLM tool bindings |
| Optimizes for | Intuition, narrative, trust | Latency, reliability, exact deterministic output |
| Economics | Community, fan token, education | [x402 pay-per-use](/monetization/pricing) in USDC |

The shared engine is the modular EthereumJS stack and the fork/EIP pipeline behind it.

## They reinforce each other (the DevRel funnel)

An early instinct was to fully separate "marketing" the website from the API. That's wrong: **aesthetics don't sell infrastructure, but trust, reputation and educational authority absolutely do.** The website is the project's DevRel engine:

- **Proof-of-work halo.** A meticulous, interactive breakdown of a fork is undeniable proof of competence — it converts directly into technical trust for the API underneath.
- **Education as top-of-funnel.** People arrive to *learn* about an upcoming protocol change; the natural next step is to *use* the API to act on it.
- **The agent trust proxy.** Humans configure which tools their agents may use. A developer is far more likely to allowlist our MCP server if they already know and trust the FYP website.

A simple mental model:

> **The website is the textbook. The API is the lab equipment.**

## How they connect, concretely

- The website remains the **visual entry point** — each exploration can link to the specific API capability it showcases.
- Both legs live as **separate sites/subdomains**, with the [main website](https://feelyourprotocol.org) acting as the **binding ground** that ties the fleet together (`docs.`, `community-token.`, this `roadmap.`, and a future API-docs subdomain).

## The discipline this requires

Two legs means two kinds of work — UI/narrative polish vs. ruthless uptime and deterministic testing. As a small team this is a real resource tension; we manage it explicitly rather than pretending both can move at full speed at once. See [Principles & Operating Discipline](/vision/principles).

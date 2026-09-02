# Two Legs, One Engine

Feel Your Protocol is designed around **two legs that share one engine**. The same EthereumJS core powers both the educational website (live today) and the headless MCP server for the future Ethereum protocol (built, **not yet publicly launched**) — but each leg serves a different audience and is framed differently.

## The two legs

| | **Leg A — Website** _(live)_ | **Leg B — MCP server** _(built; public launch pending)_ |
| --- | --- | --- |
| Audience | Humans: protocol enthusiasts, devs, the Bankr community | Machines: AI agents, and the researchers/teams behind them |
| Experience | Interactive, visual, educational explorations | Headless, deterministic, well-documented; MCP tool bindings |
| Optimizes for | Intuition, narrative, trust | Latency, reliability, exact deterministic output |
| Economics | Community, fan token, education | [x402 pay-per-use](/monetization/pricing) in USDC on the hosted endpoint |
| Docs | [website-docs](https://website-docs.feelyourprotocol.org) | [mcp-docs](https://mcp-docs.feelyourprotocol.org) |

The shared engine is the modular EthereumJS stack and the fork/EIP pipeline behind it — real on the website side and in the execution engine; the **public hosted gateway** is what [launch week](/roadmap/launch) ships.

## They reinforce each other (the DevRel funnel)

An early instinct was to fully separate "marketing" the website from the API. That's wrong: **aesthetics don't sell infrastructure, but trust, reputation and educational authority absolutely do.** The website is the project's DevRel engine — and it's already running:

- **Proof-of-work halo.** A meticulous, interactive breakdown of a fork is undeniable proof of competence — it converts into technical trust for the MCP underneath.
- **Education as top-of-funnel.** People arrive to *learn* about an upcoming protocol change; the natural next step is to *use* the hosted MCP through their agent.
- **The agent trust proxy.** Humans configure which tools their agents may use. A developer will be far more likely to allowlist our MCP server if they already know and trust the FYP website.

A simple mental model:

> **The website is the textbook. The MCP server is the lab equipment.**

The textbook is live. The lab equipment is built; the hosted door opens in [launch week](/roadmap/launch).

## How they connect, concretely

- The website remains the **visual entry point** — each exploration links to its MCP twin on `mcp-docs/use/eips/`.
- Both legs live as **separate sites/subdomains**, with the [main website](https://feelyourprotocol.org) acting as the **binding ground** that ties the fleet together (`docs.`, `community-token.`, this `roadmap.`, `mcp-docs.`, and `mcp.` at launch).

## The discipline this requires

Two legs means two kinds of work — UI/narrative polish vs. ruthless uptime and deterministic testing. As a small team this is a real resource tension; we manage it explicitly rather than pretending both can move at full speed at once. See [Principles & Operating Discipline](/vision/principles).

## Changelog

<Changelog
  title="Two Legs Changelog"
  :entries="[
    { version: 'v0.3', date: '2026-09-02', summary: 'Leg B is built (not publicly launched); mcp-docs exists; launch week is the hosted milestone.' },
    { version: 'v0.2', date: '2026-06-30', summary: 'Initial two-legs model — website live, API planned.' },
  ]"
/>

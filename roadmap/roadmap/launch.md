# Public MCP Launch Week

> **Target: 5–9 October 2026.** The hosted MCP at `mcp.feelyourprotocol.org` is **not live yet**. Until then, explore EIPs on [feelyourprotocol.org](https://feelyourprotocol.org) and read the catalogue on [mcp-docs](https://mcp-docs.feelyourprotocol.org).

## What we're launching

Feel Your Protocol's **deterministic oracle for the future Ethereum protocol** — a headless MCP server so AI agents run exact EVM simulations under upcoming fork rules (Amsterdam / Glamsterdam and beyond).

| At launch | Status today |
| --- | --- |
| Hosted MCP at `https://mcp.feelyourprotocol.org/mcp` | Not launched |
| Tools: `describe_capabilities`, `run_evm_bytecode` | Implemented (gateway v0.1) |
| EIP catalogue on mcp-docs | Growing — Amsterdam EIPs filling |
| [x402](/concepts/x402) payment (USDC on Base) | In progress — target for launch week |
| [Token holder discounts](/monetization/token) | Planned alongside x402 — never a gate |

**Hosted is the product.** We do not promote self-host or local stdio in official docs. The repos stay open; the public path is the endpoint above.

## Why this week

The lab equipment is built — engine, generic MCP tools, round-trip pipeline from EIP to exploration to catalogue. Launch week is when we open the **hosted door**: HTTP transport, payment rails, and connect docs for integrators.

The [website](/vision/two-legs) keeps running as the textbook — ~two Amsterdam explorations per week until launch, each with an MCP twin on mcp-docs.

## What “green” means

Before we call it live:

- Public HTTP MCP reachable and stable
- x402 path exercised end-to-end (not only designed)
- Connect page documents the hosted path only
- Catalogue honestly marks Runnable vs Planned EIPs
- At least one published **without MCP vs with MCP** comparison — same prompt, same model, checked outcomes

See [Principles — Launch discipline](/vision/principles#launch-discipline-oct-2026) for the internal checklist framing.

## What we're not promising

- “The entire Amsterdam ecosystem is ready” — scope is the live catalogue, not every EIP on earth
- Per-EIP MCP tools, Solidity compile, archive-node RPC, or multi-block historical backtesting
- A finished visual template for every use case — proofs land as we run them

## Where to follow

- **Explorations (today):** [feelyourprotocol.org](https://feelyourprotocol.org)
- **MCP catalogue & tools (today):** [mcp-docs.feelyourprotocol.org](https://mcp-docs.feelyourprotocol.org)
- **Tracks & history:** [Roadmap](/roadmap/roadmap) · [Timeline](/roadmap/timeline)
- **Strategy:** [Problem & Vision](/vision/problem-vision) · [Distribution](/go-to-market/distribution)

Updates during the countdown on [X @FeelEthereum](https://x.com/FeelEthereum).

## Changelog

<Changelog
  title="Launch Week Changelog"
  :entries="[
    { version: 'v0.1', date: '2026-09-02', summary: 'Initial public launch week page — 5–9 Oct 2026 target, hosted MCP + x402, honest scope.' },
  ]"
/>

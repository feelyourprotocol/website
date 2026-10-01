# Public MCP Launch Week

> **Target: 5–9 October 2026.** The hosted MCP at `mcp.feelyourprotocol.org` is **not live yet**. Until then, explore EIPs on [feelyourprotocol.org](https://feelyourprotocol.org) and read the catalogue on [mcp-docs](https://mcp-docs.feelyourprotocol.org).

## What we're launching

Feel Your Protocol's **deterministic oracle for the future Ethereum protocol** — a headless MCP server so AI agents run exact EVM simulations under upcoming fork rules (starting with the Glamsterdam hardfork).

| At launch | Status today |
| --- | --- |
| Hosted MCP at `https://mcp.feelyourprotocol.org/mcp` | Not launched |
| **Open access** — no payment, no x402, no API key | Decided for launch week |
| Tools: `describe_capabilities`, `run_bytecode`, `run_transaction`, `run_block`, `generate_artifact`, `inspect_artifact` | Implemented (gateway) |
| **Full Glamsterdam hardfork** (EL alias Amsterdam) plus the Berlin→Fusaka lineage already in the lab | Catalogue filling; ships with the public endpoint |
| [x402](/concepts/x402) and the first paid EIPs | **After** launch — see [Access cycle](/monetization/pricing#access-cycle) |

**Hosted is the product.** We do not promote self-host or local stdio in official docs. The repos stay open; the public path is the endpoint above.

## Why this week

The lab equipment is built — engine, generic MCP tools, round-trip pipeline from EIP to exploration to catalogue. Launch week opens the **hosted door** as a public lab: HTTP transport, the Glamsterdam ruleset, and connect docs. Payment comes once that door has real usage and has been hardened.

The [website](/vision/two-legs) keeps running as the textbook — ~two Amsterdam explorations per week until launch, each with an MCP twin on mcp-docs.

## What “green” means

Before we call it live:

- Public HTTP MCP reachable and stable
- Open to connect — no payment required
- Connect page documents the hosted path only
- Catalogue honestly marks Runnable vs Planned EIPs, including the Glamsterdam hardfork
- At least one published **without MCP vs with MCP** comparison — same prompt, same model, checked outcomes

See [Principles — Launch discipline](/vision/principles#launch-discipline-oct-2026) for the internal checklist framing.

## What we're not promising

- Payment, x402, or a token discount on day one — those open with the [paid tier](/monetization/pricing#access-cycle), weeks after launch
- “Every future EIP is free forever” — new EIPs ahead of the next hardfork start on the paid tier (first expected: [EIP-8141](https://eips.ethereum.org/EIPS/eip-8141) frame transactions)
- “The entire Amsterdam ecosystem is ready” — scope is the live Glamsterdam catalogue, not every draft on earth
- Per-EIP MCP tools, Solidity compile, archive-node RPC, or multi-block historical backtesting
- A finished visual template for every use case — proofs land as we run them

## Where to follow

- **Explorations (today):** [feelyourprotocol.org](https://feelyourprotocol.org)
- **MCP catalogue & tools (today):** [mcp-docs.feelyourprotocol.org](https://mcp-docs.feelyourprotocol.org)
- **Tracks & history:** [Roadmap](/roadmap/roadmap) · [Timeline](/roadmap/timeline)
- **Strategy:** [Problem & Vision](/vision/problem-vision) · [Two Audiences](/vision/two-audiences) · [Distribution](/go-to-market/distribution)

Updates during the countdown on [X @FeelEthereum](https://x.com/FeelEthereum).

## Changelog

<Changelog
  title="Launch Week Changelog"
  :entries="[
    { version: 'v0.4', date: '2026-10-01', summary: 'Launch week is the open Glamsterdam MCP. x402 and paid EIPs start after usage and hardening.' },
    { version: 'v0.3', date: '2026-09-24', summary: 'Six launch tools; strategy links include Two Audiences.' },
    { version: 'v0.2', date: '2026-09-02', summary: 'x402 payment decided for launch week — USDC on Base; facilitator wiring still build-in-public.' },
    { version: 'v0.1', date: '2026-09-02', summary: 'Initial public launch week page — 5–9 Oct 2026 target, hosted MCP + x402, honest scope.' },
  ]"
/>

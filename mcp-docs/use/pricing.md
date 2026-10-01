# Pricing

> **Status:** The public MCP opens **free**. No wallet, no API key, no x402 at launch.

## What you get at launch

[Launch week (5–9 October 2026)](https://roadmap.feelyourprotocol.org/roadmap/launch.html) is an open hosted server at `https://mcp.feelyourprotocol.org/mcp`.

Included:

- The six tools (`describe_capabilities`, `run_bytecode`, `run_transaction`, `run_block`, `generate_artifact`, `inspect_artifact`)
- The **full Glamsterdam hardfork** (EL alias `amsterdam`) — the default when you omit `fork`
- The Berlin→Fusaka lineage already in the catalogue, including today’s mainnet rules on **fusaka**

Connect instructions: [Connect](/use/connect). What you can run: [Coverage](/use/coverage).

## What comes later

A few weeks after launch, once the open service has real usage and has been hardened, newer EIPs that are **not yet part of Glamsterdam** move onto a paid tier. Agents pay per run with [x402](https://x402.org) (USDC on Base). The first paid capability we expect is **frame transactions (EIP-8141)**.

When the next hardfork (Hegota / Bogota) is on the horizon, those paid EIPs join the free tier, and the following wave of new EIPs starts paid. That cycle, the per-gas draft, and token-holder discounts live on the [roadmap pricing page](https://roadmap.feelyourprotocol.org/monetization/pricing.html). This page will grow a quote shape and a client example when the paid tier actually ships.

## Changelog

<Changelog
  title="Pricing Changelog"
  :entries="[
    { version: 'v0.4', date: '2026-10-01', summary: 'Launch is free and includes Glamsterdam. x402 is the later paid tier for new EIPs, starting with EIP-8141.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Placeholder under use/ — pointer to roadmap.' },
  ]"
/>

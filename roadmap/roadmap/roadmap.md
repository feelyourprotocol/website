# Roadmap & Tracks

The roadmap runs along a few **parallel execution streams**. Each track moves at its own pace; together they turn the [vision](/vision/problem-vision) into something shippable. Concrete dates live on the [timeline](/roadmap/timeline) and the [launch week](/roadmap/launch) page — the board below uses **Now / Next / Later** horizons instead.

Phase 3 is in **build-to-launch**: the MCP engine and catalogue exist; the public hosted endpoint is what we're shipping next. Payment rails follow once that endpoint has been used. Fast-moving sections — this page, the [Agent API concept](/concepts/api-mcp), and [pricing](/monetization/pricing) — each have a **micro-changelog** at the bottom.

The board is **data-driven** — edit [`roadmap/data/roadmap.ts`](https://github.com/feelyourprotocol/website/blob/main/roadmap/data/roadmap.ts) to add or reorder tracks (rows), horizons (columns), and items. Built to stay readable with **2–5 tracks**.

<RoadmapBoard />

## The tracks

- **Engine & API** — the [MCP server](/concepts/api-mcp) on EthereumJS: generic tools shipped, Glamsterdam catalogue filling, **open public launch** in [launch week](/roadmap/launch), then a paid cadence for new EIPs and Hegota scope.
- **Website & Education** — explorations (~2/week), MCP twin links on [mcp-docs](https://mcp-docs.feelyourprotocol.org), and documented **without vs with MCP** proofs for the oracle thesis.
- **Infrastructure** — website on Strato; [AWS EC2](/infrastructure/aws) for the headless MCP host. x402 plumbing lands with the paid tier.
- **Business & Community** — [access cycle and x402 pricing](/monetization/pricing), [token discounts](/monetization/token), [distribution](/go-to-market/distribution), agent-readable onboarding and registry discovery. (Granular as separate doc pages; grouped here for board readability.)

## Phasing

Within Phase 3, the sequence we're in: **catalogue + pipeline done** → **open public MCP** (launch week, full Glamsterdam) → **harden and watch usage** → **x402 paid tier for new EIPs** (EIP-8141 first) → those EIPs **graduate to free** when Hegota / Bogota is in view → **registry + enterprise tier** when demand appears. See the [timeline](/roadmap/timeline). Order and dates are **targets under discussion**, not commitments.

## Changelog

<Changelog
  title="Roadmap Changelog"
  :entries="[
    { version: 'v0.6', date: '2026-10-01', summary: 'Open Glamsterdam launch in Now; x402 paid tier moved to Next (EIP-8141 first, then graduation).' },
    { version: 'v0.5', date: '2026-09-24', summary: 'Agent-readable onboarding and registry listings on the board.' },
    { version: 'v0.4', date: '2026-09-02', summary: 'Board refreshed — PoC done, launch week in Now column; Amsterdam vs Glamsterdam naming clarified in notes.' },
    { version: 'v0.3', date: '2026-06-30', summary: 'Reframed roadmap as conceptualization workspace — tracks describe planned work, not shipped product.' },
    { version: 'v0.2', date: '2026-06-30', summary: 'Reworked tracks to four execution streams (Engine & API, Website, Infrastructure, Business & Community) and Phase-3 build sequence, based on the strategy session.' },
    { version: 'v0.1', date: '2026-06-30', summary: 'Initial roadmap scaffold — placeholder tracks and Now/Next/Later horizons.' },
  ]"
/>

_Add a one-line entry here every time the roadmap board changes._

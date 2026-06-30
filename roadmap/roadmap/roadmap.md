# Roadmap & Tracks

The roadmap runs along a few **parallel execution streams**. Each track moves at its own pace; together they turn the [vision](/vision/problem-vision) into something shippable. Concrete dates live on the [timeline](/roadmap/timeline) — the board below uses **Now / Next / Later** horizons instead.

The board is **data-driven** — edit [`roadmap/data/roadmap.ts`](https://github.com/feelyourprotocol/website/blob/main/roadmap/data/roadmap.ts) to add or reorder tracks (rows), horizons (columns), and items. Built to stay readable with **2–5 tracks**.

<RoadmapBoard />

## The tracks

- **Engine & API** — the EthereumJS pipeline and the [MCP server](/concepts/api-mcp): the local PoC, the Amsterdam EIP pipeline, then expanding fork coverage (Glamsterdam → Hegota).
- **Website & Education** — explorations and the [visual funnel](/vision/two-legs) that links each exploration to its API capability.
- **Infrastructure** — keeping the website on Strato while moving the headless API to [AWS](/infrastructure/aws), plus the payments plumbing.
- **Business & Community** — [pricing](/monetization/pricing), [token utility](/monetization/token), [distribution](/gtm/distribution), and community alignment. (Granular as separate doc pages; grouped here for board readability.)

## Phasing

Within Phase 3, the build sequences roughly as: prove the local PoC → ship the **Amsterdam pipeline (~Sep 1 target)** → layer on **x402 + token discounts** → introduce an **enterprise tier** when demand appears. See the [timeline](/roadmap/timeline) for the dated view.

## Changelog

<Changelog
  title="Roadmap Changelog"
  :entries="[
    { version: 'v0.2', date: '2026-06-30', summary: 'Reworked tracks to four execution streams (Engine & API, Website, Infrastructure, Business & Community) and Phase-3 build sequence, based on the strategy session.' },
    { version: 'v0.1', date: '2026-06-30', summary: 'Initial roadmap scaffold — placeholder tracks and Now/Next/Later horizons.' },
  ]"
/>

_Add a one-line entry here every time the roadmap board changes._

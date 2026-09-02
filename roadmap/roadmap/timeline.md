# Timeline

A linear, left→right view of the project's journey, grouped into phases. It is **data-driven** — edit [`roadmap/data/timeline.ts`](https://github.com/feelyourprotocol/website/blob/main/roadmap/data/timeline.ts) to add events or open a new phase. Filled dots are reached events; hollow dots are upcoming.

The MCP **lab equipment is built** (engine, gateway tools, [mcp-docs](https://mcp-docs.feelyourprotocol.org)); the next hollow marker is the **public hosted launch** — see [Launch week](/roadmap/launch).

<Timeline />

## Phases

### Phase 1 · Side Project _(Sep 2025 – Jun 2026)_

Started for fun, out of a need to better explain and educate on protocol updates and to help close the gap between the Ethereum protocol and the application layer.

- **2025-09-11** — First commit on GitHub.

### Phase 2 · Funded & Focused _(Jun 2026)_

The Bankr community token launched at the start of June and was claimed on **Friday, June 5** — bringing new urgency, initial ~2-month funding, and a regular work schedule.

- **2026-06-05** — Bankr community token claimed.
- **2026-06-06** — Twitter / X set up.
- **2026-06** — New explorations built (EIP-8024, BAL, …).

### Phase 3 · Sustainable Business _(Jun 2026 →)_

Evolve into a sustainable business: a deterministic [MCP server](/concepts/api-mcp) for AI agents — simulating upcoming forks, EIPs, and research — built in parallel to the website. The engineering core landed in summer 2026; the current chapter is **build to public launch**.

- **2026-07** — MCP docs live; execution engine v0.1; gateway tools implemented.
- **2026-08** — EIP catalogue twins; Osaka vs Amsterdam compare; runnable modules (8024, 7708, 7883, 7951).
- **2026-09** — Round-trip pipeline (EIP → exploration → MCP catalogue in ~30 minutes).
- **2026-10-05 – 09 (target)** — [Public MCP launch week](/roadmap/launch): hosted HTTP + x402 payment rails.
- **Later** — Enterprise annual tier and revenue→token loop, "when they come".

_As Phase 3 milestones land (or shift), update them in the data file so the chart and this page stay in sync._

## Changelog

<Changelog
  title="Timeline Changelog"
  :entries="[
    { version: 'v0.2', date: '2026-09-02', summary: 'Phase 3 events updated — PoC and pipeline done; public launch week 5–9 Oct 2026 as next marker.' },
    { version: 'v0.1', date: '2026-06-30', summary: 'Initial timeline scaffold with Phase 1–3 events.' },
  ]"
/>

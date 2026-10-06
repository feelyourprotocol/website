# Pricing

## At launch — free Amsterdam

**Launch week (5–9 October 2026):** connect to `https://mcp.feelyourprotocol.org/mcp` with **no wallet, no API key, no x402**.

Included:

- All six MCP tools (probe, bytecode, transaction, block, generate, inspect)
- The **full Glamsterdam / Amsterdam hardfork** — default fork when you omit `config`
- The Berlin→Fusaka lineage already in the catalogue (including today’s mainnet on **Fusaka**)

[Connect](/use/connect) · [Amsterdam now](/use/forks/glamsterdam) · [What you can ask](/use/capabilities)

## Later — paid tier for the next EIPs

A few weeks after launch, once the open service has real usage and has been hardened, **new execution-layer EIPs that are not part of Amsterdam** move onto a paid tier. Agents pay per run with **x402** (USDC on Base). We expect **frame transactions ([EIP-8141](https://eips.ethereum.org/EIPS/eip-8141))** to be the first paid capability.

| Tier | What you get | Payment |
| --- | --- | --- |
| **Open (launch)** | Full Amsterdam bundle + historical/mainnet forks in the catalogue | None |
| **Paid (post-launch)** | EIPs still ahead of the free hardfork | x402 quote per run |
| **Graduation** | When the next hardfork (Hegota / Bogota horizon) approaches, today’s paid EIPs join the open tier; the following wave starts paid again | Cycle repeats |

Per-gas rates, token-holder discounts, and facilitator details are still being finalized — see the [roadmap pricing model](https://roadmap.feelyourprotocol.org/monetization/pricing.html#access-cycle). This page will add a **402 quote shape** and a client example when the paid tier ships.

<CollapsibleChangelog
  title="Pricing Changelog"
  :entries="[
    { version: 'v0.5', date: '2026-10-01', summary: 'Dual-tier table — free Amsterdam at launch; paid EIP-8141+ cycle with roadmap pointer.' },
    { version: 'v0.4', date: '2026-10-01', summary: 'Launch is free and includes Glamsterdam. x402 is the later paid tier for new EIPs, starting with EIP-8141.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Placeholder under use/ — pointer to roadmap.' },
  ]"
/>

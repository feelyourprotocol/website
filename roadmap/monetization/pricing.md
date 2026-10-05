# Pricing

How a call is priced once the paid tier exists. The direction is much simpler than the first drafts, and it is still **probable** — not a locked decision. Nothing is billed yet.

<Motto>A fixed price per tool, visible before the call.</Motto>

## Why this got simpler

The first model priced simulated gas, then bent that price with curves and several holder tiers. The current lean is a flat USDC amount on the tool itself.

<IconGrid :columns="3" :items="[
  { icon: 'server', title: 'A sturdier service', detail: 'Less quoting logic, fewer edge cases, and a payment path that is easier to keep up.' },
  { icon: 'people', title: 'Easier to explain', detail: 'Two cents and four cents can be said in a sentence. A gas curve cannot.' },
  { icon: 'scale', title: 'An agent can choose', detail: 'The price is known before the call, so the buyer can take it or leave it.' },
]" />

## The price

USDC, via [x402](/concepts/x402), on the calls that run **EIPs ahead of the free hardfork**. The open hardfork stays free. See the [access cycle](#access-cycle).

| Call | Standard | With the [token holding](/monetization/token) |
| --- | --- | --- |
| `describe_capabilities` | Free | Free |
| `run_bytecode`, `run_transaction` | 2¢ | 1¢ |
| `run_block` | 4¢ | 2¢ |
| `generate_artifact`, `inspect_artifact` | Free, for now | Free, for now |

Discovery stays free, so an agent can read the catalogue and the price before it spends. Artifact calls likely stay free as well. That is the current lean, not a promise.

Two and four cents may turn out high. If they do, the next look is **batch calls**, or another shape that is still a fixed amount. A per-gas quote is not the fallback.

<IconNote icon="clock" title="Probable, not final">

These amounts, and which calls stay free, are the working assumption for the paid beta. They move if real usage says they should.

</IconNote>

## One tool, one price

The paid tier will likely be a **second set of tools**, not a hidden meter on the free ones. A discounted set may follow, so the agent picks the price by picking the tool. Whether that third name ships is still open.

| Open hardfork | Paid | Discounted |
| --- | --- | --- |
| `run_bytecode` | `run_future_bytecode` | `run_future_bytecode_discounted` |
| `run_transaction` | `run_future_transaction` | `run_future_transaction_discounted` |
| `run_block` | `run_future_block` | `run_future_block_discounted` |

The names are examples. What matters is the choice: schema, price, and fork scope are properties of the tool. That fits MCP better than a discount computed after the call has started.

`describe_capabilities` stays a single free tool. It is how an agent learns that the paid names exist, and what they cost.

## Access cycle

The public server opens **free** at [launch week](/roadmap/launch). Payment is a later layer, and the line between free and paid moves with the hardfork calendar.

1. **Open launch (5–9 October 2026).** Hosted MCP, no [x402](/concepts/x402), no API key. The free tier is the **full Glamsterdam hardfork** (EL alias Amsterdam) plus the Berlin→Fusaka lineage the lab already runs. The first weeks are for real usage, and for hardening the open service.
2. **Paid tier, a few weeks later.** Once that open path has adoption data and has settled, we turn on x402 (USDC on Base). The delimiter is **new EIPs** that are not yet part of the hardfork on the free tier. The first paid capability we expect to ship is **frame transactions ([EIP-8141](https://eips.ethereum.org/EIPS/eip-8141))**. Further EIPs join this tier on a shorter, more automated cadence.
3. **Graduation.** When the next hardfork (**Hegota / Bogota**) is on the horizon, the EIPs that were paid while they were ahead of mainnet — including EIP-8141 — **move into the free tier** as part of that hardfork. The next wave of post-fork EIPs starts paid again.

That loop is the product rhythm: **today’s hardfork is open; tomorrow’s EIPs are paid until they become today’s hardfork.**

The [token holding](/monetization/token) cuts those paid prices in half. It is never a gate, and it is not part of launch week.

## What changed

| Earlier draft | Current lean |
| --- | --- |
| Price by simulated gas, with a steeper curve for deep calls | A fixed amount per tool |
| Holder tiers around $5, $20, and $100 | One modest holding, then half price |
| An annual enterprise subscription | Not in the plan |
| Charge from the first request, with no free tier | Free hardfork at launch; pay only for EIPs ahead of it |

## Ceilings

A flat price only works if a call cannot be arbitrarily large. Hard ceilings stay on the open tier and on the paid tier. Four cents does not buy a bigger block. The schema tells the agent the limit before it calls.

## Cost {#cost-model}

The bill is still mostly [AWS EC2](/infrastructure/aws) for the simulation workers, plus a small facilitator fee when x402 is on. The website stays on the Strato V-Server. Because the price no longer tracks gas, the ceiling is what bounds the worst case. Unit economics are still to be modeled against real calls.

## Changelog

<Changelog
  title="Pricing Changelog"
  :entries="[
    { version: 'v0.7', date: '2026-10-05', summary: 'Fixed price per tool — 2¢, 4¢ for run_block, artifacts likely free. One token holding halves it. Separate future-tool names are the likely shape. Per-gas curves, tiered discounts, and the enterprise subscription left the plan.' },
    { version: 'v0.6', date: '2026-10-01', summary: 'Access cycle — free Glamsterdam at launch; x402 paid tier weeks later, starting with EIP-8141; graduation into the next hardfork.' },
    { version: 'v0.5', date: '2026-09-02', summary: 'x402 decided for launch week (USDC on Base) — per-gas model unchanged; payment not live yet.' },
    { version: 'v0.4', date: '2026-09-02', summary: 'Coupled to launch week — x402 target on public hosted MCP; engine exists, payment not live.' },
    { version: 'v0.3', date: '2026-06-30', summary: 'Reframed as draft pricing model — no live payment flow; conditional language throughout.' },
    { version: 'v0.2', date: '2026-06-30', summary: 'Decided: linear x402 per-gas pricing, no free tier; token = tiered discount; enterprise annual tier later.' },
    { version: 'v0.1', date: '2026-06-30', summary: 'Initial scaffold — pricing/cost-model placeholders.' },
  ]"
/>

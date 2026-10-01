# Pricing & Cost Model

How access and price work on the hosted MCP. A fast-moving section with its own [changelog](#changelog). Exact per-gas numbers below stay **placeholders**; no payment flow is live yet.

## Access cycle

The public server opens **free** at [launch week](/roadmap/launch). Payment is a later layer, and the line between free and paid moves with the hardfork calendar.

1. **Open launch (5–9 October 2026).** Hosted MCP, no [x402](/concepts/x402), no API key. The free tier is the **full Glamsterdam hardfork** (EL alias Amsterdam) plus the Berlin→Fusaka lineage the lab already runs. Goal of the first weeks: real usage, and time to harden the open service.
2. **Paid tier, a few weeks later.** Once that open path has adoption data and has settled, we turn on x402 (USDC on Base). The delimiter is **new EIPs** that are not yet part of the hardfork on the free tier. The first paid capability we expect to ship is **frame transactions ([EIP-8141](https://eips.ethereum.org/EIPS/eip-8141))**. Further interesting EIPs join this tier on a shorter, more automated cadence — that needs more of the EthereumJS fork pipeline than we have today.
3. **Graduation.** When the next hardfork (**Hegota / Bogota**) is on the horizon, the EIPs that were paid while they were ahead of mainnet — including EIP-8141 — **move into the free tier** as part of that hardfork. The next wave of post-fork EIPs starts paid again.

That loop is the product rhythm: **today’s hardfork is open; tomorrow’s EIPs are paid until they become today’s hardfork.**

[Token holder discounts](/monetization/token) attach to the paid tier when it exists. They are never a gate, and they are not part of launch week.

## Pricing model _(draft, paid tier)_

On the paid tier the direction is still **linear pay-per-use via x402**, in USDC on Base. The open hardfork stays free; we do not charge the Glamsterdam catalogue from request #1.

An earlier draft charged every request and skipped a free tier, on the theory that a sub-cent signature is the same friction as a free auth challenge. Launch week tests the other side of that: agents need a door they can walk through before we ask them to pay. Spam on the open tier is handled by hard ceilings, not by a quote. The paid tier can stay stateless — the quote is per call, with no usage account.

### Price per simulated gas

We're leaning toward pricing by the EVM's native compute unit — **gas** — not per HTTP request. The caller would supply a `gasLimit`; the server would quote `gasLimit × base_rate` in the `402` response **before** touching the engine, and an out-of-gas halt would protect the worker.

- Base rate: _TBD (e.g. ~$0.0000001 / gas — under discussion)._
- Deep/multi-step endpoints could use an **exponential curve** so expensive queries self-price out of an agent's budget.

### Discounts (token)

Token holders would get a **discount on the gas price**, not free access — see [Token Utility](/monetization/token). Indicative tiers (under discussion): `$5 → 15%`, `$20 → 30%`, `$100 → 50%`. Non-holders would simply pay the base rate; zero token friction.

### Future: enterprise tier

A flat **annual stablecoin subscription** (e.g. ~$799 USDC/yr) for budget predictability and for firms that can't hold tokens — a hybrid SaaS model to introduce **"when they come."**

## Anti-abuse _(planned defenses)_

Because agents are tireless cost-optimizers, defenses would be economic and architectural rather than human-friction based:

- **Hard ceilings** at the gateway reject queries beyond a max simulation depth — on the open tier and on the paid tier. Payment does not buy a larger ceiling.
- **MCP schema guardrails** instruct the agent not to issue oversized requests in the first place.
- On the **paid tier**, the quote makes spam economically self-limiting.
- Optional later: a **minimum on-chain balance** or **ERC-8004 identity** check if the open tier needs a Sybil brake beyond ceilings.

## Cost model _(early estimate)_

Revenue would need to clearly exceed the cost of compute. Main drivers we're modeling:

- **Compute** — [AWS EC2](/infrastructure/aws) for the headless MCP (the dominant variable cost; scales with simulation volume × gas).
- **Hosting** — the website remains on a low-cost Strato V-Server.
- **Settlement** — x402 facilitator fees.

The `$100` discount tier is deliberately pitched near the **real per-call cost level**, so heavy users would be nudged toward holding the token while margins stay healthy. Detailed unit economics: _to be modeled in a future round._

## Changelog

<Changelog
  title="Pricing Changelog"
  :entries="[
    { version: 'v0.6', date: '2026-10-01', summary: 'Access cycle — free Glamsterdam at launch; x402 paid tier weeks later, starting with EIP-8141; graduation into the next hardfork.' },
    { version: 'v0.5', date: '2026-09-02', summary: 'x402 decided for launch week (USDC on Base) — per-gas model unchanged; payment not live yet.' },
    { version: 'v0.4', date: '2026-09-02', summary: 'Coupled to launch week — x402 target on public hosted MCP; engine exists, payment not live.' },
    { version: 'v0.3', date: '2026-06-30', summary: 'Reframed as draft pricing model — no live payment flow; conditional language throughout.' },
    { version: 'v0.2', date: '2026-06-30', summary: 'Decided: linear x402 per-gas pricing, no free tier; token = tiered discount; enterprise annual tier later.' },
    { version: 'v0.1', date: '2026-06-30', summary: 'Initial scaffold — pricing/cost-model placeholders.' },
  ]"
/>

_Add a one-line entry here whenever the pricing or cost model changes._

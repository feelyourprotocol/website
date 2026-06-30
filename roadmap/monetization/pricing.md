# Pricing & Cost Model

How the API is priced, and how that relates to what it costs to run. A fast-moving section with its own [changelog](#changelog). Exact numbers below are **placeholders under discussion**.

## Pricing model

The base model is **linear pay-per-use via [x402](/concepts/x402)**, in USDC on Base, **charged from request #1 — no free tier.**

Why no free trial: to an autonomous agent, signing a sub-cent payment costs the same effort as signing a free auth challenge — the friction is in the *process*, not the price. So a free tier buys nothing but complexity and an attack surface. Charging linearly from the first request keeps the server **stateless and hyper-lean** (no usage DB, no trial logic) and filters out spam automatically.

### Price per simulated gas

We price by the EVM's native compute unit — **gas** — not per HTTP request. The caller supplies a `gasLimit`; the server quotes `gasLimit × base_rate` in the `402` response **before** touching the engine, and an out-of-gas halt protects the worker.

- Base rate: _TBD (e.g. ~$0.0000001 / gas — under discussion)._
- Deep/multi-step endpoints can use an **exponential curve** so expensive queries self-price out of an agent's budget.

### Discounts (token)

Token holders get a **discount on the gas price**, not free access — see [Token Utility](/monetization/token). Indicative tiers (under discussion): `$5 → 15%`, `$20 → 30%`, `$100 → 50%`. Non-holders simply pay the base rate; zero token friction.

### Future: enterprise tier

A flat **annual stablecoin subscription** (e.g. ~$799 USDC/yr) for budget predictability and for firms that can't hold tokens — a hybrid SaaS model introduced **"when they come."**

## Anti-abuse

Because agents are tireless cost-optimizers, defenses are economic and architectural rather than human-friction based:

- **Pay-from-#1** makes spam economically self-limiting.
- **Hard ceilings** at the gateway (`413`/`400`) reject queries beyond a max simulation depth — no buying your way into a DoS.
- **MCP schema guardrails** instruct the agent not to issue oversized requests in the first place.
- For any optional free/identity path: a **minimum on-chain balance** (e.g. ~$5 USDC/ETH) or **ERC-8004 identity** check defeats Sybil/empty-wallet farming. (Net conclusion from the strategy session: with linear x402, an explicit free tier likely isn't needed at all.)

## Cost model

Revenue must clearly exceed the cost of compute. Main drivers:

- **Compute** — [AWS EC2](/infrastructure/aws) for the headless API (the dominant variable cost; scales with simulation volume × gas).
- **Hosting** — the website remains on a low-cost Strato V-Server.
- **Settlement** — x402 facilitator fees.

The `$100` discount tier is deliberately pitched near the **real per-call cost level**, so heavy users are nudged toward holding the token while margins stay healthy. Detailed unit economics: _to be modeled in a future round._

## Changelog

<Changelog
  title="Pricing Changelog"
  :entries="[
    { version: 'v0.2', date: '2026-06-30', summary: 'Decided: linear x402 per-gas pricing, no free tier; token = tiered discount; enterprise annual tier later. From the strategy session.' },
    { version: 'v0.1', date: '2026-06-30', summary: 'Initial scaffold — pricing/cost-model placeholders.' },
  ]"
/>

_Add a one-line entry here whenever the pricing or cost model changes._

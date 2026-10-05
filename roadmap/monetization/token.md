# Token Utility

The community token is a **half-price switch** on the [paid tier](/monetization/pricing#the-price). It is not a key, and it is not part of [launch week](/roadmap/launch). Nothing here is wired up yet.

<Motto>A small holding. Half the price. Or skip it and pay the listed rate.</Motto>

## The rule

One threshold. No ladder.

If the wallet that pays [x402](/concepts/x402) holds a **modest** balance of the community token — on the order of a dollar when we set the number, already allowing for a likely rise in price — the paid tool prices are cut in half.

The exact token count is not pinned. There is no rate on this page worth freezing.

| Call | Standard | Holding met |
| --- | --- | --- |
| `run_bytecode`, `run_transaction` | 2¢ | 1¢ |
| `run_block` | 4¢ | 2¢ |
| Probe and artifact calls | Free | Free |

Below the line, the caller pays the standard price in USDC and never has to touch the token. The check is that paying wallet. There is no separate stake.

<IconNote icon="shield" title="Never a gate">

The open hardfork does not check a balance. A new agent can buy a future EIP with USDC alone. The token is a discount for people who already hold it, not a step in onboarding.

</IconNote>

## Why one line

An earlier sketch used several dollar tiers — about $5, $20, and $100 — each taking a different percentage off a gas price. That asked the agent to understand a curve and a portfolio.

One line is easier to run, easier to say, and easier to accept or refuse before the call. The holding is deliberately small: a reason to keep a little of the token on the paying wallet, not a treasury requirement.

## How an agent would see it

The likely shape is a **separate tool** for the discounted price, next to the paid one. An agent would choose `run_future_transaction` or `run_future_transaction_discounted` up front, the same way it chooses any other tool.

Whether that second name actually ships is still open. The requirement is that the discount is visible before the call, not applied as a surprise inside it.

Names and the reasoning are on [Pricing](/monetization/pricing#one-tool-one-price).

## What this is not

- Not part of the free Glamsterdam server.
- Not a stake, a subscription, or a percentage ladder.
- Not buybacks, holder votes, or exploration bounties. Those were later ideas. They are not part of this model.

Token news is also not a stand-in for a product milestone. The launch is the hosted MCP.

## Changelog

<Changelog
  title="Token Utility Changelog"
  :entries="[
    { version: 'v0.4', date: '2026-10-05', summary: 'One modest holding — about a dollar, count not pinned — halves the fixed per-tool price. Tiered gas discounts, and later buyback or governance ideas, left the plan.' },
    { version: 'v0.3', date: '2026-10-01', summary: 'Token discounts belong to the paid tier, not launch week.' },
    { version: 'v0.2', date: '2026-09-02', summary: 'Framed around hosted MCP launch week; explicit no-hype-for-holders note.' },
    { version: 'v0.1', date: '2026-06-30', summary: 'Initial dual-lane discount model outline.' },
  ]"
/>

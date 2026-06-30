# Token Utility

How the Bankr community token relates to the API — without ever becoming a barrier to adoption.

## The core rule

> **The token is a VIP pass for insiders, never a gate for newcomers.**

The community's energy sparked this whole direction, so cutting them out would be wrong — but forcing a stranger to bridge to Base and swap for a niche token just to try the API would kill conversion. We resolve this by keeping the token **out of the critical path** and attaching value *around* it.

## The dual-lane model

| Lane | Who | How they pay |
| --- | --- | --- |
| **Enterprise / outsider** | MEV bots, auditors, institutions, any new agent | Plain USDC via [x402](/monetization/pricing) — no token, no friction |
| **Community / insider** | Existing token holders | Same x402 flow, but with a **gas-price discount** |

Holders get the discount with a single gasless wallet check; non-holders never see the token at all.

## Discount tiers _(indicative, under discussion)_

| Token held | Discount on gas price |
| --- | --- |
| < $5 | 0% (base rate) |
| > $5 | 15% |
| > $20 | 30% |
| > $100 | 50% |

This turns the token into a **non-speculative volume discount**: heavy API users find it rational to hold it (it pays for itself), creating genuine, usage-driven demand — the on-chain analogue of a B2B volume contract.

## Optional value-capture & alignment _(later / "when they come")_

- **Engine exhaust (buyback & burn):** route ~10–20% of USDC API revenue to programmatically buy and burn (or distribute) the token — the token becomes a proxy for the API's success, and the community becomes a distribution force.
- **Roadmap governance:** let holders vote on which fork/endpoint to prioritize next.
- **Visualization bounties:** pay the community in tokens to build explorations on top of new API capabilities — funding [Leg A](/vision/two-legs) from token utility.

## Why this is risk-free

Because the base layer is always plain USDC, the discount model adds upside for the community **without** introducing onboarding friction, token-gated errors, or compliance headaches for enterprises. Permissionless access stays intact; the community is rewarded for being early.

_Tier numbers and the buyback/governance/bounty mechanics are directional — to be finalized in a later round._

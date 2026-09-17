# Current mainnet EL — Fusaka

> **Status:** **Ready for the public MCP** (not launched). **`baselineForkId`** in the probe — today’s mainnet execution-layer rules.

This page tracks **whatever fork mainnet EL is on right now**. Today that is **Fusaka** (EL alias **`osaka`**; role alias **`mainnet-el`**). After Glamsterdam activates on mainnet, this doc (and probe metadata) will switch to Glamsterdam as `current` / `baselineForkId`, and the next preview fork moves under [Preview forks](/use/forks/glamsterdam).

## Fusaka today

ModExp repricing (**7883**), secp256r1 precompile (**7951**), and related Fusaka EL changes are active on mainnet. **Predecessor in lineage:** Pectra ([historical table](/use/forks/historical-forks)). **Preview successor:** [Glamsterdam](/use/forks/glamsterdam).

Activated EIP numbers are in the probe (`namedForks[].activatedEips`, **`eipIntroductions`**). PeerDAS and blob-sidecar behaviour are not fully observable in this lab.

## Runnable FYP twins on Fusaka

| EIP | Page |
| --- | --- |
| 7883 | [ModExp gas](/use/eips/eip-7883) |
| 7951 | [secp256r1](/use/eips/eip-7951) |

Full index: [EIP catalogue](/use/coverage).

## Compare

| Goal | Run twice |
| --- | --- |
| One Fusaka EIP vs before it existed | **Pectra** → **Fusaka** (from derived module `comparison` or `eipIntroductions`) |
| Upcoming fork vs mainnet today | **Fusaka** → **Glamsterdam** |

## What you can ask your agent

- *“Run this under current mainnet EL (Fusaka / mainnet-el).”*
- *“Compare ModExp gas: Pectra then Fusaka.”*
- *“Same transfer on Fusaka vs Glamsterdam.”*

Pass `{ "baseHardfork": "fusaka", "eips": [] }` (or aliases `osaka`, `mainnet-el`). Fusaka is **not** the default lab fork — Glamsterdam is.

Provenance on a generic Fusaka run lists advertised modules **7883** and **7951** with `eips: []`.

## Related

| | |
| --- | --- |
| [Preview (Glamsterdam)](/use/forks/glamsterdam) | Default lab / upcoming |
| [Historical forks](/use/forks/historical-forks) | Paris → Pectra |
| [EIP catalogue](/use/coverage) | Lineage + EIP twins |
| [Fork timeline](https://ethereum.org/ethereum-forks/) | External reference |

## Changelog

<Changelog
  title="Current Mainnet Fork Changelog"
  :entries="[
    { version: 'v0.5', date: '2026-09-17', summary: 'Twin pages linked from this fork doc (sidebar no longer lists EIPs).' },
    { version: 'v0.4', date: '2026-09-17', summary: 'Canonical catalog id is fusaka; osaka is the EL alias; mainnet-el remains the role alias.' },
    { version: 'v0.3', date: '2026-09-16', summary: 'Doc framed as rotating mainnet section (Fusaka now; updates when mainnet fork changes).' },
    { version: 'v0.2', date: '2026-09-16', summary: 'Lineage and predecessor compare pattern.' },
    { version: 'v0.1', date: '2026-09-16', summary: 'Named fork capability — generic Fusaka runs.' },
  ]"
/>

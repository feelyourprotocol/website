# Current mainnet EL — Osaka

> **Status:** **Ready for the public MCP** (not launched). **`baselineForkId`** in the probe — today’s mainnet execution-layer rules.

This page tracks **whatever fork mainnet EL is on right now**. Today that is **Osaka** (Fusaka; aliases **`fusaka`**, **`mainnet-el`**). After Amsterdam activates on mainnet, this doc (and probe metadata) will switch to Amsterdam as `current` / `baselineForkId`, and the next preview fork moves under [Preview forks](/use/forks/amsterdam).

## Osaka today

ModExp repricing (**7883**), secp256r1 precompile (**7951**), and related Fusaka EL changes are active on mainnet. **Predecessor in lineage:** Prague ([historical table](/use/forks/historical-forks)). **Preview successor:** [Amsterdam](/use/forks/amsterdam).

Activated EIP numbers are in the probe (`namedForks[].activatedEips`, **`eipIntroductions`**). PeerDAS and blob-sidecar behaviour are not fully observable in this lab.

## Runnable FYP twins on Osaka

**7883**, **7951** — [Coverage](/use/coverage).

## Compare

| Goal | Run twice |
| --- | --- |
| One Osaka EIP vs before it existed | **Prague** → **Osaka** (from derived module `comparison` or `eipIntroductions`) |
| Upcoming fork vs mainnet today | **Osaka** → **Amsterdam** |

## What you can ask your agent

- *“Run this under current mainnet EL (Osaka / mainnet-el).”*
- *“Compare ModExp gas: Prague then Osaka.”*
- *“Same transfer on Osaka vs Amsterdam.”*

Pass `{ "baseHardfork": "osaka", "eips": [] }` (or alias `mainnet-el`). Osaka is **not** the default lab fork — Amsterdam is.

Provenance on a generic Osaka run lists advertised modules **7883** and **7951** with `eips: []`.

## Related

| | |
| --- | --- |
| [Preview (Amsterdam)](/use/forks/amsterdam) | Default lab / upcoming |
| [Historical forks](/use/forks/historical-forks) | Paris → Prague |
| [Fork timeline](https://ethereum.org/ethereum-forks/) | External reference |

## Changelog

<Changelog
  title="Current Mainnet Fork Changelog"
  :entries="[
    { version: 'v0.3', date: '2026-09-16', summary: 'Doc framed as rotating mainnet section (Osaka now; updates when mainnet fork changes).' },
    { version: 'v0.2', date: '2026-09-16', summary: 'Lineage and predecessor compare pattern.' },
    { version: 'v0.1', date: '2026-09-16', summary: 'Named fork capability — generic Osaka runs.' },
  ]"
/>

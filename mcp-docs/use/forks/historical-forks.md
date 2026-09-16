# Historical forks (Berlin → Prague)

> **Status:** **Ready for the public MCP** (not launched). One catalogue page for **past** execution-layer hardforks.

## Why this page exists

The probe exposes the **Berlin→Amsterdam lineage** so agents can answer “when did this EIP appear?” and run **predecessor compares**. Human docs use **three buckets**:

| Bucket | Doc page | Probe `role` |
| --- | --- | --- |
| Preview / upcoming | [Amsterdam](/use/forks/amsterdam) (later e.g. Hegota) | `preview` |
| Current mainnet EL | [Osaka](/use/forks/osaka) | `current` |
| History | **This page** (Berlin → Prague) | `historical` |

Historical forks are generic run targets: `{ "baseHardfork": "<id>", "eips": [] }` on the three run tools. Use **`eipIntroductions`** from [Describe Capabilities](/use/tools/describe-capabilities) for facts and compare pairs.

**Not in the catalogue:** difficulty-bomb delay forks (Arrow Glacier, Gray Glacier, Muir Glacier, …) and blob-parameter-only upgrades — the lineage jumps **Berlin → London → Paris** on mainnet.

## Compare pattern

1. Look up the EIP or keyword in **`eipIntroductions`**.
2. Note **`introducedAt`**.
3. Run the same verb on **`predecessorFork(introducedAt)`** and on **`introducedAt`**.

Examples:

- **EIP-1559** → **`london`** → compare **`berlin`** then **`london`** on the same [Run transaction](/use/tools/run-transaction) (fee market / paid `gasUsed`).
- **PUSH0** (3855) → **`shanghai`** → compare **`paris`** then **`shanghai`** (`0x5f00` on bytecode).
- **ModExp repricing** (7883) → **`osaka`** → compare **`prague`** then **`osaka`** ([EIP-7883](/use/eips/eip-7883)).

## Lineage table (historical rows)

| Order | `baseHardfork` | Aliases | Notable activations (full lists in probe) |
| --- | --- | --- | --- |
| 0 | `berlin` | — | 2565 ModExp, 2718 typed txs, 2929 cold/warm gas, 2930 access lists |
| 1 | `london` | — | **1559** fee market, 3198 BASEFEE, 3529 refunds, 3541 initcode prefix |
| 2 | `paris` | `merge`, `the-merge` | 3675 Merge (not replayable here), 4399 PREVRANDAO |
| 3 | `shanghai` | `shapella` | 3855 PUSH0, 3860 initcode, 4895 withdrawals (limited in lab) |
| 4 | `cancun` | `dencun` | 1153 transient storage, 5656 MCOPY, 4844 blobs (no blob txs in lab) |
| 5 | `prague` | `pectra` | 7702 set-code, 2537 BLS precompiles, 7623 calldata |

**Floor:** **Berlin** — Istanbul and earlier hardforks are out of scope for this MCP round.

## Honesty

The lab does not replay Merge consensus, beacon withdrawals, blob sidecars, or PeerDAS. Those EIPs still appear in **`eipIntroductions`** with honest summaries.

## What you can ask your agent

- *“Compare the same transfer on Berlin vs London — when did 1559 activate?”*
- *“Run BASEFEE opcode bytecode on London vs Berlin.”*
- *“When did PUSH0 activate — Paris vs Shanghai?”*

## Changelog

<Changelog
  title="Historical Forks Catalogue Changelog"
  :entries="[
    { version: 'v0.2', date: '2026-09-16', summary: 'Berlin and London added to lineage floor; glacier delay forks excluded from catalog.' },
    { version: 'v0.1', date: '2026-09-16', summary: 'Combined historical doc; preview / mainnet / history trio.' },
  ]"
/>

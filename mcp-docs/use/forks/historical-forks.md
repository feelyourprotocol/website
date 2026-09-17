# Historical forks (Berlin → Pectra)

> **Status:** **Ready for the public MCP** (not launched). One catalogue page for **past** execution-layer hardforks.

## Why this page exists

The probe exposes the **Berlin→Glamsterdam lineage** so agents can answer “when did this EIP appear?” and run **predecessor compares**. Human docs use **three buckets**:

| Bucket | Doc page | Probe `role` |
| --- | --- | --- |
| Preview / upcoming | [Glamsterdam](/use/forks/glamsterdam) (later e.g. Hegota) | `preview` |
| Current mainnet EL | [Fusaka](/use/forks/fusaka) | `current` |
| History | **This page** (Berlin → Pectra) | `historical` |

Historical forks are generic run targets: `{ "baseHardfork": "<id>", "eips": [] }` on the three run tools. Use **`eipIntroductions`** from [Describe Capabilities](/use/tools/describe-capabilities) for facts and compare pairs. Advertised twins on a historical fork stay (7702 on Pectra today; Fusaka twins follow when that role rotates) — history is still a place to **run** those features, not only to compare them.

From **Shapella** on, the catalog id is the combined upgrade name; the EL city name is an alias. **Paris** has no Shapella-style portmanteau — `paris` stays canonical (aliases `merge`, `the-merge`).

**Not in the catalogue:** difficulty-bomb delay forks (Arrow Glacier, Gray Glacier, Muir Glacier, …) and blob-parameter-only upgrades — the lineage jumps **Berlin → London → Paris** on mainnet.

## Compare pattern

1. Look up the EIP or keyword in **`eipIntroductions`**.
2. Note **`introducedAt`**.
3. Run the same verb on **`predecessorFork(introducedAt)`** and on **`introducedAt`**.

Examples:

- **EIP-1559** → **`london`** → compare **`berlin`** then **`london`** on the same [Run transaction](/use/tools/run-transaction) (fee market / paid `gasUsed`).
- **PUSH0** (3855) → **`shapella`** → compare **`paris`** then **`shapella`** (`0x5f00` on bytecode).
- **ModExp repricing** (7883) → **`fusaka`** → compare **`pectra`** then **`fusaka`** ([EIP-7883](/use/eips/eip-7883)).

## Lineage table (historical rows)

| Order | `baseHardfork` | Aliases | Notable activations (full lists in probe) |
| --- | --- | --- | --- |
| 0 | `berlin` | — | 2565 ModExp, 2718 typed txs, 2929 cold/warm gas, 2930 access lists |
| 1 | `london` | — | **1559** fee market, 3198 BASEFEE, 3529 refunds, 3541 initcode prefix |
| 2 | `paris` | `merge`, `the-merge` | 3675 Merge (not replayable here), 4399 PREVRANDAO |
| 3 | `shapella` | `shanghai` | 3855 PUSH0, 3860 initcode, 4895 withdrawals (limited in lab) |
| 4 | `dencun` | `cancun` | 1153 transient storage, 5656 MCOPY, 4844 blobs (no blob txs in lab) |
| 5 | `pectra` | `prague` | [7702 set-code](/use/eips/eip-7702), 2537 BLS precompiles, 7623 calldata |

**Floor:** **Berlin** — Istanbul and earlier hardforks are out of scope for this MCP round.

## Honesty

The lab does not replay Merge consensus, beacon withdrawals, blob sidecars, or PeerDAS. Those EIPs still appear in **`eipIntroductions`** with honest summaries.

## What you can ask your agent

- *“Compare the same transfer on Berlin vs London — when did 1559 activate?”*
- *“Run BASEFEE opcode bytecode on London vs Berlin.”*
- *“When did PUSH0 activate — Paris vs Shapella?”*

## Changelog

<Changelog
  title="Historical Forks Catalogue Changelog"
  :entries="[
    { version: 'v0.5', date: '2026-09-17', summary: 'Historical forks still host advertised twins for adoption runs, not only compares.' },
    { version: 'v0.4', date: '2026-09-17', summary: 'Pectra 7702 twin linked from the lineage table.' },
    { version: 'v0.3', date: '2026-09-17', summary: 'Canonical ids from Shapella on are combined names (shapella, dencun, pectra); EL city names are aliases.' },
    { version: 'v0.2', date: '2026-09-16', summary: 'Berlin and London added to lineage floor; glacier delay forks excluded from catalog.' },
    { version: 'v0.1', date: '2026-09-16', summary: 'Combined historical doc; preview / mainnet / history trio.' },
  ]"
/>

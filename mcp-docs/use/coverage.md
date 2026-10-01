# Coverage

> **Status:** Catalogue for the **upcoming public MCP** (not launched). At launch this catalogue is **free**, including the full Glamsterdam hardfork. Runnable modules are those the hosted server will advertise via probe. Until then, use the [website explorations](https://feelyourprotocol.org). Newer EIPs after launch may sit on a [paid tier](/use/pricing).

This page is the **human EIP index**. Per-EIP pages live at `/use/eips/eip-NNNN` but are not listed in the sidebar — open them from the tables below, from a [fork page](/use/forks/glamsterdam), or via search. Agents use `describe_capabilities`, not this nav.

Fork configuration is **à la carte**: a base hardfork plus an optional EIP list (runnable modules only — history is “run under Shapella”, not “enable 3855 on Paris”). Named forks are **catalog capabilities** in the **Berlin→Glamsterdam lineage**. A generic run under a named fork does **not** require naming an EIP.

**State (BYOS):** each run starts an **empty world** (no mainnet RPC). Put demo prestate in **`accounts[]`** on the same tool call — wei balances, optional nonce, runtime `code`, storage slots. The agent builds that JSON from natural language; the server validates and applies it. The same shape can be filled later by an external state provider.

**Default:** one simulation on the fork the user names (`amsterdam`, `osaka`, `glamsterdam`, …). **Compare (only when asked):** find the change in `eipIntroductions` → run the same verb on **predecessorFork(introducedAt)** and on **introducedAt**.

## Lineage (live)

| Order | Fork        | Role       | Aliases              | Runnable twins | Doc bucket |
| ----- | ----------- | ---------- | -------------------- | -------------- | ---------- |
| 0–5   | `berlin` … `pectra` | historical | see probe | (generic runs; no advertised twins) | [Historical forks](/use/forks/historical-forks) |
| 6     | `fusaka`     | current    | `osaka`, `mainnet-el` | 7883, 7951 | [Mainnet — Fusaka](/use/forks/fusaka) |
| 7     | `glamsterdam` | preview    | `amsterdam`          | 2780, 8024, 7843, 7708, 7928, 7954, 8037, 8038   | [Preview — Glamsterdam](/use/forks/glamsterdam) |

Full per-fork ids, aliases, and `activatedEips` live in **`describe_capabilities`** — the table above is the human map to three doc pages.

`baselineForkId` is **`fusaka`** (current mainnet EL). Default lab fork is **`glamsterdam`**. Current-mainnet twins (7883, 7951) stay in this live catalog — they are first-class runs, not only a compare baseline vs preview. When mainnet moves on, those twins stay advertised on Fusaka (then a historical row). `docsStatus: sunset` on the website is for retired explorations or no honest lab shape — not for “already activated.”

## Runnable capabilities (live catalog)

These appear in `describe_capabilities()` — engine modules with `runnable: true`. **Comparison pairs** on each row are lookup metadata from `eipIntroductions` (predecessor vs `introducedAt`) — use them when the user asks for a before/after, not on every run. **Tools** are MCP names (`eips[].tools`).

| EIP  | Nature         | Tools   | Introduced at | Compare (typical)        | Catalogue                      |
| ---- | -------------- | -------- | ------------- | ------------------------ | ------------------------------ |
| 2780 | repricing      | run_transaction | glamsterdam | fusaka → glamsterdam | [EIP-2780](/use/eips/eip-2780) |
| 8024 | new-capability | run_bytecode | glamsterdam     | fusaka → glamsterdam        | [EIP-8024](/use/eips/eip-8024) |
| 7843 | new-capability | run_block    | glamsterdam     | fusaka → glamsterdam        | [EIP-7843](/use/eips/eip-7843) |
| 7708 | new-capability | run_transaction, run_bytecode | glamsterdam | fusaka → glamsterdam | [EIP-7708](/use/eips/eip-7708) |
| 7928 | new-structure  | generate_artifact, inspect_artifact | glamsterdam | fusaka → glamsterdam | [EIP-7928](/use/eips/eip-7928) |
| 7883 | repricing      | run_bytecode | fusaka         | pectra → fusaka           | [EIP-7883](/use/eips/eip-7883) |
| 7951 | new-capability | run_bytecode | fusaka         | pectra → fusaka           | [EIP-7951](/use/eips/eip-7951) |
| 7954 | limit          | run_transaction | glamsterdam   | fusaka → glamsterdam      | [EIP-7954](/use/eips/eip-7954) |
| 8037 | new-exec-model | run_transaction, run_bytecode | glamsterdam | fusaka → glamsterdam | [EIP-8037](/use/eips/eip-8037) |
| 8038 | repricing      | run_bytecode, run_transaction | glamsterdam | fusaka → glamsterdam | [EIP-8038](/use/eips/eip-8038) |

**Glamsterdam note (8024 / 7843):** The Glamsterdam hardfork already bundles these EIPs. Passing `eips: [8024]` or `eips: [7843]` is accepted but is not a pre/post toggle.

## Exploration twins (human catalogue)

Every **live** website exploration has an MCP-docs page mapping the same problem set. Status may be Runnable or Planned.

| EIP  | Exploration twin   | MCP status             | Page                           |
| ---- | ------------------ | ---------------------- | ------------------------------ |
| 2780 | Intrinsic transaction gas | Runnable | [EIP-2780](/use/eips/eip-2780) |
| 8024 | Stack opcodes      | Runnable               | [EIP-8024](/use/eips/eip-8024) |
| 7883 | ModExp gas         | Runnable               | [EIP-7883](/use/eips/eip-7883) |
| 7951 | secp256r1          | Runnable               | [EIP-7951](/use/eips/eip-7951) |
| 7954 | Contract size limits | Runnable               | [EIP-7954](/use/eips/eip-7954) |
| 7928 | Block access lists | **Runnable** (`generate_artifact`, `inspect_artifact`) | [EIP-7928](/use/eips/eip-7928) |
| 7843 | SLOTNUM opcode     | Runnable               | [EIP-7843](/use/eips/eip-7843) |
| 7708 | ETH transfer logs  | Runnable               | [EIP-7708](/use/eips/eip-7708) |
| 8037 | State creation gas | Runnable               | [EIP-8037](/use/eips/eip-8037) |
| 8038 | State-access gas   | Runnable               | [EIP-8038](/use/eips/eip-8038) |

Canonical metadata for twins lives in website `src/explorations/eip-NNNN/canonical.ts`.

## Bundled, no page

`eipIntroductions[].coverage` of **`supported`** means the hardfork already applies the EIP. There is no exploration and no page in this catalogue. Omit the id from `eips` and use the fork's tools. EIP-8246 (SELFDESTRUCT no longer burns ETH) is the first, on Glamsterdam. **`listed`** rows are a name and a fork only.

**`consensus`** means the EIP is consensus-layer and this lab does not execute it. There is no page here. Already marked: 3675 (Paris), 4895 (Shapella), 6110 and 7251 (Pectra), 7594 (Fusaka), and on Glamsterdam 7688, 7732, 8045, 8061.

**`networking`** means a wire-protocol EIP. This lab does not speak it, and there is no page here. Glamsterdam: 7975, 8070, 8136, 8159, 8189. Naming one in `eips` is rejected.

**`informational`** means an analysis or a schedule. This lab does not execute it, and there is no page here. Glamsterdam: 7904, 8261. Naming one in `eips` is rejected.

## Changelog

<Changelog
  title="Coverage Changelog"
  :entries="[
    { version: 'v0.35', date: '2026-09-29', summary: 'EIP-2780 intrinsic gas is a runnable twin on run_transaction.' },
    { version: 'v0.34', date: '2026-09-29', summary: 'Networking and informational EIPs use those coverages and stay off this catalogue.' },
    { version: 'v0.33', date: '2026-09-29', summary: 'Consensus-layer EIPs use coverage consensus and stay off this catalogue.' },
    { version: 'v0.32', date: '2026-09-29', summary: 'Supported bundle EIPs (EIP-8246) stay off this catalogue; probe coverage is supported.' },
    { version: 'v0.28', date: '2026-09-17', summary: 'EIP-7954 exploration twin — Planned until run_transaction supports contract creation.' },
    { version: 'v0.27', date: '2026-09-17', summary: 'EIP-7702 is fork-level run_transaction/inspect — not a catalogue twin or EIP docs page.' },
    { version: 'v0.26', date: '2026-09-17', summary: 'Retired PeerDAS exploration removed from website catalogue; Fusaka-only EIPs stay in probe.' },
    { version: 'v0.26', date: '2026-10-01', summary: 'Launch catalogue is free, including full Glamsterdam. Newer EIPs may be paid later.' },
    { version: 'v0.25', date: '2026-09-17', summary: 'Current-mainnet twins stay first-class; sunset is not “already activated.”' },
    { version: 'v0.24', date: '2026-09-17', summary: 'Human EIP index — per-EIP pages stay linked from this catalogue, not the sidebar.' },
    { version: 'v0.23', date: '2026-09-16', summary: 'Lineage extended with Berlin and London (historical floor); glacier BPO forks excluded.' },
    { version: 'v0.22', date: '2026-09-16', summary: 'Fork docs: preview (Glamsterdam), mainnet (Fusaka), combined historical page.' },
    { version: 'v0.21', date: '2026-09-16', summary: 'Paris→Glamsterdam lineage table; eipIntroductions compare pattern; Pectra no longer ModExp-only.' },
    { version: 'v0.20', date: '2026-09-16', summary: 'Named forks are catalog capabilities — generic Glamsterdam / Fusaka / Pectra runs; advertised relatedEips; fork catalogue pages.' },
    { version: 'v0.18', date: '2026-09-14', summary: 'EIP-8038 named catalog row — SSTORE via run_transaction; SLOAD/EXTCODESIZE via run_bytecode.' },
    { version: 'v0.17', date: '2026-09-11', summary: 'EIP-8038 exploration twin — simulate gasUsed shows the SSTORE write jump; named catalog row follows.' },
    { version: 'v0.16', date: '2026-09-10', summary: 'EIP-7843 SLOTNUM runnable — run_block header.slotNumber; catalog row live.' },
    { version: 'v0.15', date: '2026-09-10', summary: 'run_block lab verb shipped — header.slotNumber; 7843 catalog still Planned.' },
    { version: 'v0.14', date: '2026-09-10', summary: 'EIP-7843 exploration twin — Planned until run_block / header slot on simulate.' },
    { version: 'v0.13', date: '2026-09-08', summary: '7708/8037 shapes include transaction (run_transaction); simulate remains for bytecode/precompiles.' },
    { version: 'v0.12', date: '2026-09-08', summary: 'EIP-8037 named catalog row — simulate gasUsed (Glamsterdam vs Fusaka first-touch and new-slot).' },
    { version: 'v0.11', date: '2026-09-07', summary: 'EIP-8037 exploration twin — simulate gasUsed already shows first-touch state gas; named catalog row follows with the engine module.' },
    { version: 'v0.10', date: '2026-09-02', summary: 'Catalogue is for the hosted MCP — removed self-host / local early-access framing.' },
    { version: 'v0.9', date: '2026-08-31', summary: 'Split runnable catalog vs exploration twins; note public MCP not launched.' },
    { version: 'v0.8', date: '2026-08-27', summary: 'Fusaka mainnet baseline fork — run-twice comparisons against Glamsterdam preview.' },
    { version: 'v0.7', date: '2026-08-27', summary: 'EIP catalogue pages under use/eips/ — 8024 human entrypoint.' },
    { version: 'v0.6', date: '2026-08-27', summary: '8024 module is opcode/encoding support, not demo replay.' },
    { version: 'v0.5', date: '2026-08-27', summary: 'Slim catalog to runnable EIP-8024 only — questions, scenarios, no stub EIPs.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from execution-engine — user-facing EIP coverage under use/.' },
  ]"
/>

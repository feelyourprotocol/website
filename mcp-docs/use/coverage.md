# Coverage

> **Status:** Catalogue for the MCP server (local early access today; **public launch not yet**). Only **runnable** EIP modules appear in probe output when you self-host.

Fork configuration is **à la carte**: a base hardfork plus an optional EIP list. Named forks are curated shortcuts — **`osaka`** (current mainnet EL baseline), **`prague`** (pre-Fusaka ModExp compare), and **`amsterdam`** (preview; alias `glamsterdam`).

## Named forks (live)

| Fork | Role | Alias | Use |
| --- | --- | --- | --- |
| `osaka` | baseline | `mainnet-el` | Current mainnet rules |
| `prague` | historical | — | Pre-Fusaka ModExp gas (7883 compare) |
| `amsterdam` | preview | `glamsterdam` | Upcoming fork — EIP deltas (e.g. 8024) |

## Runnable capabilities (live catalog)

These appear in `describe_capabilities()` — engine modules with `runnable: true`.

| EIP | Nature | Shapes | Fork notes | Catalogue |
| --- | --- | --- | --- | --- |
| 8024 | new-capability | simulate | Amsterdam | [EIP-8024](/use/eips/eip-8024) |
| 7883 | repricing | simulate | Osaka; Prague compare | [EIP-7883](/use/eips/eip-7883) |
| 7951 | new-capability | simulate | Osaka | [EIP-7951](/use/eips/eip-7951) |

**Amsterdam note (8024):** EthereumJS v10 already bundles EIP-8024 in the Amsterdam hardfork. Passing `eips: [8024]` is accepted but is not a pre/post toggle.

## Exploration twins (human catalogue)

Every **live** website exploration has an MCP-docs page mapping the same problem set. Status may be Runnable or Planned.

| EIP | Exploration twin | MCP status | Page |
| --- | --- | --- | --- |
| 8024 | Stack opcodes | Runnable | [EIP-8024](/use/eips/eip-8024) |
| 7883 | ModExp gas | Runnable | [EIP-7883](/use/eips/eip-7883) |
| 7951 | secp256r1 | Runnable | [EIP-7951](/use/eips/eip-7951) |
| 7928 | Block access lists | **Planned** (generate) | [EIP-7928](/use/eips/eip-7928) |
| 7708 | ETH transfer logs | **Planned** (simulate logs) | [EIP-7708](/use/eips/eip-7708) |

PeerDAS (7594) has no MCP twin — sunset path per exploration policy.

Canonical metadata for twins lives in website `src/explorations/eip-NNNN/canonical.ts`.

## Changelog

<Changelog
  title="Coverage Changelog"
  :entries="[
    { version: 'v0.9', date: '2026-08-31', summary: 'Split runnable catalog vs exploration twins; note public MCP not launched.' },
    { version: 'v0.8', date: '2026-08-27', summary: 'Osaka mainnet baseline fork — run-twice comparisons against Amsterdam preview.' },
    { version: 'v0.7', date: '2026-08-27', summary: 'EIP catalogue pages under use/eips/ — 8024 human entrypoint.' },
    { version: 'v0.6', date: '2026-08-27', summary: '8024 module is opcode/encoding support, not demo replay.' },
    { version: 'v0.5', date: '2026-08-27', summary: 'Slim catalog to runnable EIP-8024 only — questions, scenarios, no stub EIPs.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from execution-engine — user-facing EIP coverage under use/.' },
  ]"
/>

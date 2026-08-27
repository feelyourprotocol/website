# Coverage

> **Status:** Honest live catalog. Only **runnable** EIP modules are listed.

Fork configuration is **à la carte**: a base hardfork plus an optional EIP list. Named forks are curated shortcuts — **`osaka`** (current mainnet EL baseline) and **`amsterdam`** (preview; alias `glamsterdam`).

## Named forks (live)

| Fork | Role | Alias | Use |
| --- | --- | --- | --- |
| `osaka` | baseline | `mainnet-el` | Current mainnet rules — compare “today” |
| `amsterdam` | preview | `glamsterdam` | Upcoming fork — EIP deltas (e.g. 8024) |

## Registered capabilities (live)

| EIP | Nature | Runnable | Shapes | Catalogue |
| --- | --- | --- | --- | --- |
| 8024 | new-capability | yes | simulate | [EIP-8024](/use/eips/eip-8024) |

EIP-8024 means the Amsterdam EVM **executes** DUPN, SWAPN, and EXCHANGE. See the [EIP-8024 catalogue page](/use/eips/eip-8024) for inspiration prompts and twin links to the website exploration.

**Amsterdam note:** EthereumJS v10 already bundles EIP-8024 in the Amsterdam hardfork. Passing `eips: [8024]` is accepted but is not a pre/post toggle.

Unimplemented EIPs (ModExp repricing, BALs, secp256r1, …) are **not** listed until a module can actually run.

## Changelog

<Changelog
  title="Coverage Changelog"
  :entries="[
    { version: 'v0.8', date: '2026-08-27', summary: 'Osaka mainnet baseline fork — run-twice comparisons against Amsterdam preview.' },
    { version: 'v0.7', date: '2026-08-27', summary: 'EIP catalogue pages under use/eips/ — 8024 human entrypoint.' },
    { version: 'v0.6', date: '2026-08-27', summary: '8024 module is opcode/encoding support, not demo replay.' },
    { version: 'v0.5', date: '2026-08-27', summary: 'Slim catalog to runnable EIP-8024 only — questions, scenarios, no stub EIPs.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from execution-engine — user-facing EIP coverage under use/.' },
  ]"
/>

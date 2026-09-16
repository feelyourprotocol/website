# Osaka — mainnet baseline

> **Status:** **Ready for the public MCP** (not launched). Named fork capability — current mainnet EL rules (alias **mainnet-el**).

## What became possible

**Osaka** is the current mainnet execution-layer baseline (`baselineForkId`). Run caller-supplied bytecode, a transaction, or a lab block under Osaka without naming an EIP. Use it to compare against [Amsterdam](/use/forks/amsterdam), or for Osaka-era precompiles (ModExp, P-256).

Advertised runnable modules: **7883**, **7951**. Prague is the historical ModExp compare fork.

## What you can ask your agent

- *“Run this bytecode under Osaka (current mainnet) and tell me if it succeeds.”*
- *“Compare this transfer on Osaka vs Amsterdam.”*
- *“Run ModExp on Osaka.”*

## What the server does

Probe `namedForks` for the `osaka` row, then the same verbs as Amsterdam. Osaka is **not** the default — pass `{ "baseHardfork": "osaka", "eips": [] }` (alias `mainnet-el`).

## Fork caveat

Omit `eips[]` for a generic mainnet-rules run. Provenance lists advertised modules 7883 and 7951. For upcoming-fork deltas, run twice against Amsterdam.

## Twins and spec

| | Link |
| --- | --- |
| **Amsterdam** (preview) | [Amsterdam](/use/forks/amsterdam) |
| **Prague** (ModExp history) | [Prague](/use/forks/prague) |
| **EIP catalogue** | [Coverage](/use/coverage) — 7883, 7951 |

## Changelog

<Changelog
  title="Osaka Fork Catalogue Changelog"
  :entries="[
    { version: 'v0.1', date: '2026-09-16', summary: 'Named fork capability — generic Osaka / mainnet-el runs as the comparison baseline.' },
  ]"
/>

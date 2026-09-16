# Prague — historical ModExp baseline

> **Status:** **Ready for the public MCP** (not launched). Named fork capability — pre-Fusaka EL rules for ModExp gas compare.

## What became possible

**Prague** is in the catalog so you can compare **ModExp** (precompile `0x05`) gas against Osaka (Fusaka). Generic bytecode / transaction / lab-block runs are supported; you do not need to name an EIP.

Advertised runnable module: **7883**.

## What you can ask your agent

- *“Compare ModExp gas on Prague vs Osaka.”*
- *“Run this bytecode under Prague.”*

## What the server does

Probe the `prague` named-fork row, then [Run bytecode](/use/tools/run-bytecode) with `{ "baseHardfork": "prague", "eips": [] }`. For the teaching compare, run the same program on Prague then Osaka.

## Fork caveat

Prague is **not** current mainnet. Use Osaka for mainnet-today and Amsterdam for the upcoming preview.

## Twins and spec

| | Link |
| --- | --- |
| **EIP-7883** | [ModExp gas](/use/eips/eip-7883) |
| **Osaka** | [Osaka](/use/forks/osaka) |

## Changelog

<Changelog
  title="Prague Fork Catalogue Changelog"
  :entries="[
    { version: 'v0.1', date: '2026-09-16', summary: 'Named fork capability — generic Prague runs for ModExp compare vs Osaka.' },
  ]"
/>

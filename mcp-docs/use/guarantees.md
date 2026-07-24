# Guarantees

> **Status:** v0.1 — basic provenance; limits enforced in engine.

## What you can rely on

- **Deterministic execution** — Same bytecode + fork config → same result (within EthereumJS semantics).
- **Stateless / BYOS** — No archive node; you supply bytecode and any state overrides.
- **Provenance on every result** — Engine version, fork config, optional EIP maturity metadata, stability rollup, human caveat. Fields are **basic and mostly optional** in v0.1 — we will tighten over time.
- **Guardrails** — Hard limits below prevent runaway resource use.

## Limits

| Limit | Value |
| --- | --- |
| Max gas limit | 30_000_000 |
| Default gas limit | 1_000_000 |
| Max bytecode size | 24_576 bytes |
| Max trace steps | 10_000 |

## Out of scope

- Solidity compilation
- ERC / application-layer semantics
- Sequential multi-block historical backtesting

## Changelog

<Changelog
  title="Guarantees Changelog"
  :entries="[
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from execution-engine — user-facing limits and provenance under use/.' },
  ]"
/>

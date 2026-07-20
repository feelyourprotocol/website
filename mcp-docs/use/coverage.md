# Coverage

> **Status:** Seed registry in engine v0.1. Expands as EIPs ship.

Fork configuration is **à la carte**: a base hardfork plus an optional EIP list. Named forks (e.g. `amsterdam`) are curated shortcuts.

## Registered capabilities (seed)

| EIP | Nature | Shapes |
| --- | --- | --- |
| 8024 | new-capability | simulate, compare |
| 7883 | repricing | simulate, compare |
| 7928 | new-structure | generate, simulate |
| 7951 | new-capability | simulate, compare |
| 8141 | new-exec-model | simulate (not yet implemented) |

The explorations [website](https://feelyourprotocol.org) demonstrates several of these EIPs interactively (e.g. EIP-8024 stack ops, EIP-7928 block-level access lists).

For registry internals and API details, see [Execution Engine](/internals/execution-engine).

## Changelog

<Changelog
  title="Coverage Changelog"
  :entries="[
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from execution-engine — user-facing EIP coverage under use/.' },
  ]"
/>

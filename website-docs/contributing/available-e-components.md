# Available E-Components

When briefing an agent, name the pattern and reference folder — not API details (those live in `types.ts` and the skill).

Integration model: [E-Components](/contributing/e-components).

## Overview

| E-Component | Use case | Copy this folder |
| --- | --- | --- |
| Precompile Interface | Precompile input, execution, results | [eip-7951](https://github.com/feelyourprotocol/website/tree/main/src/explorations/eip-7951) |
| Bytecode Stepper | Step/run bytecode, stack/memory/gas | [eip-8024](https://github.com/feelyourprotocol/website/tree/main/src/explorations/eip-8024) |

## Extension points

| E-Component | Scoped slots | Layout slots | Inject |
| --- | --- | --- | --- |
| Precompile Interface | `#result` | — | — |
| Bytecode Stepper | — | `#below` | `BYTECODE_STEPPER_CONTEXT` |

## Precompile Interface

**E-Component owns:** example selection, hex input, value fields, URL sharing.

**Exploration owns:** `run` callback and result visualization (`#result` slot). Standard pre/post hardfork compare: `useStandardPrecompileRun` in reference folder.

Config: `src/eComponents/precompileInterfaceEC/types.ts`.

Non-trivial input formats (e.g. ModExp): see [EIP-7883 config](https://github.com/feelyourprotocol/website/blob/main/src/explorations/eip-7883/config.ts).

## Bytecode Stepper

**E-Component owns:** bytecode editor, disassembly, run/step/reset, stack/memory display.

**Exploration owns:** configured EVM instance (`:evm` prop). Example presets: `values[0]` = unprefixed hex bytecode.

Config: `src/eComponents/bytecodeStepperEC/types.ts`. Companion panels: `#below` slot in [EIP-8024](https://github.com/feelyourprotocol/website/tree/main/src/explorations/eip-8024).

## New E-Components

Two explorations share a pattern → promote to `src/eComponents/` and add a row here.

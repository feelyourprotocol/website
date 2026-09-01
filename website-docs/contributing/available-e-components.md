# Available E-Components

When briefing an agent, name the pattern and reference folder — not API details (those live in `types.ts` and the skill).

Integration model: [E-Components](/contributing/e-components).

## Overview

| E-Component | Use case | Copy this folder |
| --- | --- | --- |
| Precompile Interface | Precompile input, execution, results | [eip-7951](https://github.com/feelyourprotocol/website/tree/main/src/explorations/eip-7951) |
| Bytecode Stepper | Step/run bytecode, stack/memory/gas | [eip-8024](https://github.com/feelyourprotocol/website/tree/main/src/explorations/eip-8024) |
| Receipt Logs | Transaction receipt log list + decoded rows | [eip-7708](https://github.com/feelyourprotocol/website/tree/main/src/explorations/eip-7708) |

## Extension points

| E-Component | Scoped slots | Layout slots | Inject |
| --- | --- | --- | --- |
| Precompile Interface | `#result` | — | — |
| Bytecode Stepper | — | `#below` | `BYTECODE_STEPPER_CONTEXT` |
| Receipt Logs | — | — (Teleport panel) | `RECEIPT_LOGS_CONTEXT` (optional) |

## Precompile Interface

**E-Component owns:** example selection, hex input, value fields, URL sharing.

**Exploration owns:** `run` callback and result visualization (`#result` slot). Standard pre/post hardfork compare: `useStandardPrecompileRun` in reference folder.

Config: `src/eComponents/precompileInterfaceEC/types.ts`.

Non-trivial input formats (e.g. ModExp): see [EIP-7883 config](https://github.com/feelyourprotocol/website/blob/main/src/explorations/eip-7883/config.ts).

## Bytecode Stepper

**E-Component owns:** bytecode editor, disassembly, run/step/reset, stack/memory display.

**Exploration owns:** configured EVM instance (`:evm` prop). Example presets: `values[0]` = unprefixed hex bytecode.

Config: `src/eComponents/bytecodeStepperEC/types.ts`. Companion panels: `#below` slot in [EIP-8024](https://github.com/feelyourprotocol/website/blob/main/src/explorations/eip-8024).

## Receipt Logs

**E-Component owns:** receipt log list UI, decoded row layout, empty/idle states, optional provide/inject publisher.

**Exploration owns:** VM/`runBlock` execution, mapping `@ethereumjs/evm` logs to `ReceiptLogRow` (see [EIP-7708 receiptAdapter](https://github.com/feelyourprotocol/website/blob/main/src/explorations/eip-7708/receiptAdapter.ts)). Teleport `ReceiptLogsPanelEC` into `#exploration-right-panel` when `rightPanel: true`.

Types: `src/eComponents/receiptLogsEC/types.ts`. Format helpers: `src/eComponents/receiptLogsEC/format.ts`.

## New E-Components

Two explorations share a pattern — or briefing identifies likely future reuse — → add `src/eComponents/` and a row here (sub-round: design, test, document, then integrate).

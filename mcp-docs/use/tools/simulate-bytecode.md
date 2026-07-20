# Simulate Bytecode

> **Status:** Engine v0.1 (local). MCP tool `simulate_evm_bytecode` — planned with gateway (Step 3).

## Purpose

Run raw EVM bytecode under a chosen fork / EIP configuration and receive a structured result — gas used, return data, final stack, optional opcode trace, and provenance.

## When to use

- Test how bytecode behaves under an upcoming fork or à la carte EIP set
- Inspect stack-level execution with an optional trace
- Compare behaviour across fork configurations (see Compare, or run multiple simulations)

## Inputs

| Field | Required | Description |
| --- | --- | --- |
| `bytecode` | Yes | Hex-encoded bytecode (`0x` prefix optional) |
| `fork` | No | `{ baseHardfork, eips[] }` — named forks (e.g. `amsterdam`) or à la carte EIP list |
| `gasLimit` | No | Execution gas limit (default 1_000_000) |
| `trace` | No | When true, include stack-only execution steps |

## Outputs

| Field | Description |
| --- | --- |
| `success` | Whether execution completed without revert |
| `gasUsed` | Gas consumed |
| `returnValue` | Hex return data |
| `finalStack` | Stack items after execution (hex strings) |
| `error` | Error message if execution failed |
| `steps` | Optional trace steps when `trace` is true |
| `provenance` | Always present — engine version, fork config, capability metadata |

## Example

_Input (conceptual):_

```json
{
  "bytecode": "0x…",
  "fork": { "baseHardfork": "amsterdam", "eips": [] },
  "trace": true
}
```

_Output (conceptual):_

```json
{
  "success": true,
  "gasUsed": "…",
  "returnValue": "0x",
  "finalStack": ["0x…"],
  "error": null,
  "provenance": { "…": "…" }
}
```

## Limits

See [Guarantees](/use/guarantees) for ceilings (max gas, bytecode size, trace steps).

## Changelog

<Changelog
  title="Simulate Bytecode Changelog"
  :entries="[
    { version: 'v0.3', date: '2026-07-20', summary: 'Tool page shell under use/tools/ — reframed from execution-engine reference.' },
  ]"
/>

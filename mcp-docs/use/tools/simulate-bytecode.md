# Simulate Bytecode

> **Status:** **Live** (gateway v0.1, stdio). MCP tool: `simulate_evm_bytecode`.

## Purpose

Run **caller-supplied** raw EVM bytecode under a chosen fork / EIP configuration and receive a structured result — gas used, return data, final stack, optional opcode trace, and provenance.

## When to use

- Test how bytecode behaves under an upcoming fork (e.g. **Amsterdam** with bundled EIP-8024 opcodes)
- Inspect stack-level execution with an optional trace
- Deterministic gas and opcode results for agent reasoning (do not guess EVM outcomes)

## MCP tool name

`simulate_evm_bytecode`

## Inputs

| Field | Required | Description |
| --- | --- | --- |
| `bytecode` | Yes | Hex-encoded bytecode (`0x` prefix optional). Max 24 576 bytes. |
| `fork` | No | `{ baseHardfork, eips[] }` — default engine fork is `amsterdam` |
| `gasLimit` | No | Decimal string. Default `1000000`. Max `30000000`. |
| `trace` | No | When true, include stack-only execution steps (max 10 000) |

### Fork note (Amsterdam)

Named fork `amsterdam` uses `{ "baseHardfork": "amsterdam", "eips": [] }`. EIP-8024 and other Amsterdam EIPs are **bundled in the hardfork** in `@ethereumjs/common` v10.1.2 — you do not need `eips: [8024]` for DUPN/SWAPN/EXCHANGE to work.

## Outputs

| Field | Description |
| --- | --- |
| `success` | Whether execution completed without revert |
| `gasUsed` | Gas consumed (string) |
| `returnValue` | Hex return data |
| `finalStack` | Stack after execution (hex strings). With `trace: true`, full stack from last step. |
| `error` | Error message if execution failed (e.g. `stack underflow`) |
| `steps` | Optional trace steps when `trace` is true |
| `provenance` | Always present — `engineVersion`, `forkConfig`, optional EIP metadata |

## Examples

### Minimal — PUSH1 STOP (3 gas)

```json
{
  "bytecode": "0x600100",
  "fork": { "baseHardfork": "amsterdam", "eips": [] }
}
```

Expected: `success: true`, `gasUsed: "3"`.

### Amsterdam-only — EIP-8024 EXCHANGE (15 gas)

```json
{
  "bytecode": "0x6001600260036004e88e00",
  "fork": { "baseHardfork": "amsterdam", "eips": [] },
  "trace": true
}
```

Pushes `1, 2, 3, 4`, runs `EXCHANGE`, then `STOP`. Trace includes opcode `EXCHANGE`.

### Amsterdam-only — EIP-8024 DUPN (54 gas)

```json
{
  "bytecode": "0x600160026003600460056006600760086009600a600b600c600d600e600f60106011e68000",
  "fork": { "baseHardfork": "amsterdam", "eips": [] },
  "trace": true
}
```

Deep stack + `DUPN` — opcodes invalid pre-Amsterdam.

## JSON schema

[simulate_evm_bytecode.input.json](/schemas/simulate_evm_bytecode.input.json)

## Limits

See [Guarantees](/use/guarantees) for ceilings (max gas, bytecode size, trace steps).

## Changelog

<Changelog
  title="Simulate Bytecode Changelog"
  :entries="[
    { version: 'v0.4', date: '2026-07-22', summary: 'Live MCP tool — real tool name, Amsterdam examples, JSON schema link.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Tool page shell under use/tools/ — reframed from execution-engine reference.' },
  ]"
/>

# Run Bytecode

> **Status:** Implemented — ships on the public MCP at launch. MCP tool: `run_evm_bytecode`. **Public endpoint not live.**

## Purpose

Run **caller-supplied** raw EVM bytecode under a chosen fork / EIP configuration and receive a structured result — gas used, return data, final stack, optional opcode trace, optional **logs** / **decodedLogs**, and provenance.

## When to use

- Test how bytecode behaves under an upcoming fork (e.g. **Amsterdam** with bundled EIP-8024 opcodes)
- Inspect stack-level execution with an optional trace
- Deterministic gas and opcode results for agent reasoning (do not guess EVM outcomes)

## MCP tool name

`run_evm_bytecode`

## Inputs

| Field | Required | Description |
| --- | --- | --- |
| `bytecode` | One of bytecode / messageCall | Hex-encoded bytecode (`0x` prefix optional). Max 24 576 bytes. |
| `messageCall` | One of bytecode / messageCall | `{ caller, to, value?, data?, code? }` — value-bearing call (EIP-7708 plain ETH moves). |
| `fork` | No | `{ baseHardfork, eips[] }` — default **`amsterdam`**. Use **`osaka`** only when you want current mainnet baseline |
| `gasLimit` | No | Decimal string. Default `1000000`. Max `30000000`. |
| `trace` | No | When true, include stack-only execution steps (max 10 000) |

### Fork notes

- **`amsterdam`** — preview fork (`{ "baseHardfork": "amsterdam", "eips": [] }`; alias `glamsterdam`). Default. EIP-8024 and other Amsterdam EIPs are **bundled in the hardfork** in `@ethereumjs/common` v10.1.2 — you do not need `eips: [8024]` for DUPN/SWAPN/EXCHANGE to work.
- **`osaka`** — optional current mainnet EL baseline (`{ "baseHardfork": "osaka", "eips": [] }`; alias `mainnet-el`). Use only when comparing against mainnet today.

### Optional: compare baseline vs preview

When you need a before/after view, run the **same bytecode twice** — `osaka`, then `amsterdam` — and diff `gasUsed`, `success`, and optional `steps`. See `baselineForkId` and `eips[].comparison` from [Describe Capabilities](/use/tools/describe-capabilities). Skip this if you only care about Amsterdam behavior.

```json
{
  "bytecode": "0x600160026003600460056006600760086009600a600b600c600d600e600f60106011e68000",
  "fork": { "baseHardfork": "osaka", "eips": [] }
}
```

Expected on baseline: `success: false` (invalid opcode `0xe6`). Re-run with `amsterdam` to see DUPN succeed.

## Outputs

| Field | Description |
| --- | --- |
| `success` | Whether execution completed without revert |
| `gasUsed` | Gas consumed (string) |
| `returnValue` | Hex return data |
| `finalStack` | Stack after execution (hex strings). With `trace: true`, full stack from last step. |
| `error` | Error message if execution failed (e.g. `stack underflow`) |
| `steps` | Optional trace steps when `trace` is true |
| `logs` | Raw logs emitted during execution (when any) |
| `decodedLogs` | Indexed logs with optional EIP-7708 Transfer/Burn decorations |
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

Deep stack + `DUPN` — invalid on osaka baseline; valid on Amsterdam preview.

## JSON schema

[run_evm_bytecode.input.json](/schemas/run_evm_bytecode.input.json)

## Limits

See [Guarantees](/use/guarantees) for ceilings (max gas, bytecode size, trace steps).

## Changelog

<Changelog
  title="Run Bytecode Changelog"
  :entries="[
    { version: 'v0.7', date: '2026-09-02', summary: 'Implemented for public launch — not a local stdio product path.' },
    { version: 'v0.6', date: '2026-08-27', summary: 'Osaka mainnet baseline fork for run-twice comparisons against Amsterdam preview.' },
    { version: 'v0.5', date: '2026-08-27', summary: 'Renamed MCP tool simulate_evm_bytecode → run_evm_bytecode.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Live MCP tool — real tool name, Amsterdam examples, JSON schema link.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Tool page shell under use/tools/ — reframed from execution-engine reference.' },
  ]"
/>

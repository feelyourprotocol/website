# Run Bytecode

> **Status:** Implemented — ships on the public MCP at launch. MCP tool: `run_bytecode`. **Public endpoint not live.**

## Purpose

Run **caller-supplied** raw EVM bytecode under a chosen fork / EIP configuration and receive a structured result — call-frame gas used, return data, final stack, optional opcode trace, and provenance.

Bytecode runs as a **VM message-call** (real execution account, call-frame gas — no 21,000 intrinsic). `SSTORE` persists for the duration of that call. Optional `accounts` seeds code, balance, and storage in the **same** request.

## When to use

- Generic hardfork runs (bytecode under **Glamsterdam** with no EIP named)
- Opcode and stack questions (e.g. **Glamsterdam** EIP-8024 DUPN / SWAPN / EXCHANGE)
- Precompile CALL programs (ModExp, P-256)
- Program-gas `SSTORE` / `SLOAD` (EIP-8038) — existing-slot write is about **5,006 vs 12,106**
- Inspect stack-level execution with an optional trace
- Pre-deploy a contract in `accounts[].code` and observe `EXTCODESIZE` in one call

Wallet gas limits, first-touch ETH transfers, receipt logs, and paid **`txStateGas`** belong on [Run Transaction](/use/tools/run-transaction).

## MCP tool name

`run_bytecode`

## Inputs

| Field | Required | Description |
| --- | --- | --- |
| `bytecode` | Yes | Hex-encoded bytecode (`0x` prefix optional). Max 24 576 bytes. |
| `accounts` | No | BYOS prestate on **this call** (see below). |
| `fork` | No | `{ baseHardfork, eips[] }` — default **`glamsterdam`**. Use **`fusaka`** when the user asks for current-mainnet EL behavior |
| `gasLimit` | No | Decimal string. Default `1000000`. Max `30000000`. |
| `trace` | No | When true, include stack-only execution steps (max 10 000) |

### BYOS prestate (`accounts[]`)

Each run starts an **empty world**. To model “five accounts, two with 3 ETH, one unfunded, deploy this runtime bytecode at `0x…`”, build **`accounts[]`** on the **same** `run_bytecode` call — the server does not invent demo state.

| Field | Meaning |
| --- | --- |
| `address` | Hex address (required) |
| `balance` | Wei as decimal string. Omit → default **1 ETH** prefund; `"0"` → unfunded |
| `nonce` | Decimal string. Default `0` |
| `code` | Runtime bytecode **already** at this address (not CREATE) |
| `storage` | `{ slot, value }` hex words for existing-slot SLOAD/SSTORE |

- **`bytecode`** (top-level) is the program executed at the lab address `0x00000000000000000000000000000000000000b1`.
- Other contracts and callers live in **`accounts[]`**. Precompiles (`0x05`, `0x100`, …) need no seeding.
- Protocol system contracts are **not** pre-installed; if a test needs one, supply caller-provided runtime code at the known address.

Example — 3 ETH sender and a contract already deployed:

```json
{
  "bytecode": "0x…",
  "accounts": [
    { "address": "0x0000000000000000000000000000000000000001", "balance": "3000000000000000000" },
    { "address": "0x00000000000000000000000000000000000000aa", "code": "0x600100", "storage": [{ "slot": "0x00", "value": "0x01" }] }
  ]
}
```

### Fork notes

- **`glamsterdam`** — preview fork (`{ "baseHardfork": "glamsterdam", "eips": [] }`; alias `amsterdam`). Default. EIP-8024 and other Glamsterdam EIPs are **bundled in the hardfork** — you do not need `eips: [8024]` for DUPN/SWAPN/EXCHANGE to work.
- **`fusaka`** — current mainnet EL (`{ "baseHardfork": "fusaka", "eips": [] }`; aliases `osaka`, `mainnet-el`). First-class for Fusaka twins (ModExp, P-256).

### Compare (only when the user asks)

When the user wants a before/after view, run the **same bytecode twice** on the pair from `eipIntroductions` / `eips[].comparison` (often predecessor vs `introducedAt`) and diff `gasUsed`, `success`, and optional `steps`. For a single-fork question, run once on the fork they named.

```json
{
  "bytecode": "0x600160026003600460056006600760086009600a600b600c600d600e600f60106011e68000",
  "fork": { "baseHardfork": "fusaka", "eips": [] }
}
```

Expected on baseline: `success: false` (invalid opcode `0xe6`). Re-run with `glamsterdam` to see DUPN succeed.

## Outputs

| Field | Description |
| --- | --- |
| `success` | Whether execution completed without revert |
| `gasUsed` | Call-frame gas consumed (string). Does **not** include the 21,000 transaction intrinsic. |
| `gasUsedScope` | Always `call-frame` |
| `stateGasSpilled` | Present when non-zero (Glamsterdam new-slot SSTORE). Program write cost ≈ `gasUsed` − `stateGasSpilled`. |
| `returnValue` | Hex return data |
| `finalStack` | Stack after execution (hex strings). With `trace: true`, full stack from last step. |
| `error` | Error message if execution failed (e.g. `stack underflow`) |
| `steps` | Optional trace steps when `trace` is true |
| `logs` | Raw logs emitted during execution (when any) |
| `decodedLogs` | Indexed logs with optional decorations |
| `provenance` | Always present — `engineVersion`, `forkConfig`, `perEip` spec snapshot; named `eips[]` also add a compact `Spec:` clause on `caveat` |

## Examples

### Minimal — PUSH1 STOP (3 gas)

```json
{
  "bytecode": "0x600100",
  "fork": { "baseHardfork": "glamsterdam", "eips": [] }
}
```

Expected: `success: true`, `gasUsed: "3"`.

### Glamsterdam-only — EIP-8024 EXCHANGE (15 gas)

```json
{
  "bytecode": "0x6001600260036004e88e00",
  "fork": { "baseHardfork": "glamsterdam", "eips": [] },
  "trace": true
}
```

Pushes `1, 2, 3, 4`, runs `EXCHANGE`, then `STOP`. Trace includes opcode `EXCHANGE`.

### Glamsterdam-only — EIP-8024 DUPN (54 gas)

```json
{
  "bytecode": "0x600160026003600460056006600760086009600a600b600c600d600e600f60106011e68000",
  "fork": { "baseHardfork": "glamsterdam", "eips": [] },
  "trace": true
}
```

Deep stack + `DUPN` — invalid on fusaka baseline; valid on Glamsterdam preview.

## JSON schema

[run_bytecode.input.json](/schemas/run_bytecode.input.json)

## Limits

See [Guarantees](/use/guarantees) for ceilings (max gas, bytecode size, trace steps).

## Changelog

<Changelog
  title="Run Bytecode Changelog"
  :entries="[
    { version: 'v0.14', date: '2026-09-18', summary: 'Named eips[] provenance.caveat includes a compact Spec: snapshot.' },
    { version: 'v0.13', date: '2026-09-17', summary: 'Fusaka is first-class for current-mainnet features, not only a compare baseline.' },
    { version: 'v0.12', date: '2026-09-16', summary: 'Generic Glamsterdam bytecode (no EIP named) is a first-class when-to-use.' },
    { version: 'v0.10', date: '2026-09-14', summary: 'SSTORE belongs on run_transaction — run_bytecode cannot persist storage writes.' },
    { version: 'v0.9', date: '2026-09-08', summary: 'Renamed run_evm_bytecode → run_bytecode. Value transfers moved to run_transaction.' },
    { version: 'v0.8', date: '2026-09-08', summary: 'messageCall results include approxTxGasUsed (21000 + call-frame); gasUsedScope always call-frame.' },
    { version: 'v0.7', date: '2026-09-02', summary: 'Implemented for public launch — not a local stdio product path.' },
    { version: 'v0.6', date: '2026-08-27', summary: 'Fusaka mainnet baseline fork for run-twice comparisons against Glamsterdam preview.' },
    { version: 'v0.5', date: '2026-08-27', summary: 'Renamed MCP tool simulate_evm_bytecode → run_evm_bytecode.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Live MCP tool — real tool name, Glamsterdam examples, JSON schema link.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Tool page shell under use/tools/ — reframed from execution-engine reference.' },
  ]"
/>

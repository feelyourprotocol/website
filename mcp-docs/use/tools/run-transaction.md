# Run Transaction

> **Status:** Implemented — ships on the public MCP at launch. MCP tool: `run_transaction`. **Public endpoint not live.**

## Purpose

Run a **message-call or contract-creation transaction** under a chosen fork and receive **paid transaction gas** plus receipt logs. The sender is impersonated from `from` — no private key.

This is the verb for wallet gas limits, contract deployment boundaries (EIP-7954), first-touch ETH transfers (EIP-8037), EIP-7708 Transfer logs on **tx value**, and paid **`txStateGas`** (new-slot SSTORE / first-touch). Program-gas SSTORE / SLOAD belongs on [Run Bytecode](/use/tools/run-bytecode).

Raw opcode / stack / precompile programs belong on [Run Bytecode](/use/tools/run-bytecode).

## When to use

- A generic **Glamsterdam** or **Fusaka** transaction (no EIP named)
- “Is 21,000 gas enough for this transfer after Glamsterdam?”
- Paid gas of a simple ETH transfer (Fusaka ≈ 21,000; Glamsterdam first-touch ≈ 204,600)
- Receipt logs / decoded EIP-7708 Transfer rows
- Glamsterdam `txRegularGas` / `txStateGas` when present
- Contract creation with caller-supplied initcode and deployed runtime-code size

## MCP tool name

`run_transaction`

## Inputs

| Field | Required | Description |
| --- | --- | --- |
| `from` | Yes | Hex sender (impersonated) |
| `to` | No | Hex recipient. Omit for contract creation; then `data` is initcode |
| `value` | No | Wei as a decimal string (default `0`) |
| `data` | No | Calldata hex, or initcode when `to` is omitted |
| `code` | No | Runtime bytecode installed at `to` before the tx (contract-wallet / SSTORE) |
| `accounts` | No | Extra accounts to prefund (`address`, optional `balance`, `code`, `storage` slots) |
| `fork` | No | `{ baseHardfork, eips[] }` — default **`glamsterdam`** |
| `gasLimit` | No | Decimal string. Default `1000000`. Tool ceiling `110000000`; fork validity rules still apply |
| `authorizationList` | No | Signed EIP-7702 JSON items — **Pectra+** type-4 set-code tx. Use [Inspect](/use/tools/inspect) `authorization-list` to validate first. |

### Fork notes

Same named forks as [Run Bytecode](/use/tools/run-bytecode): default **glamsterdam**; **fusaka** for current-mainnet features or a compare baseline.

## Outputs

| Field | Description |
| --- | --- |
| `success` | Tx completed without revert or intrinsic failure |
| `gasUsed` | **Paid** transaction gas (intrinsic + execution − refund) |
| `gasUsedScope` | Always `transaction` |
| `txRegularGas` | Glamsterdam only — regular-gas total |
| `txStateGas` | Glamsterdam only — state-gas total |
| `returnValue` | Hex return data |
| `error` | Failure message (e.g. intrinsic gas too low), else `null` |
| `createdAddress` | Successful creation only — deployed contract address |
| `deployedCodeSize` | Successful creation only — stored runtime-code bytes |
| `logs` / `decodedLogs` | Receipt logs; EIP-7708 Transfer/Burn decorations when present |
| `provenance` | Always present — named `eips[]` add a compact `Spec:` clause on `caveat` |

## Example — first-touch 1 wei (Glamsterdam)

```json
{
  "from": "0x00000000000000000000000000000000000000ee",
  "to": "0x00000000000000000000000000000000000000aa",
  "value": "1",
  "fork": { "baseHardfork": "glamsterdam" }
}
```

Expected: `success: true`, `gasUsed: "204600"`, `txStateGas: "183600"`. The same call on **fusaka** is `gasUsed: "21000"`. With `"gasLimit": "21000"` Glamsterdam fails.

## JSON schema

[run_transaction.input.json](/schemas/run_transaction.input.json)

## Limits

See [Guarantees](/use/guarantees) for gas ceilings. The higher transaction-only ceiling supports Glamsterdam's EIP-8037 state-gas reservoir for large deployments.

## Changelog

<Changelog
  title="Run Transaction Changelog"
  :entries="[
    { version: 'v0.7', date: '2026-09-18', summary: 'Named eips[] provenance.caveat includes a compact Spec: snapshot.' },
    { version: 'v0.6', date: '2026-09-17', summary: 'Contract creation via omitted to; createdAddress and deployedCodeSize; 110M transaction-only ceiling.' },
    { version: 'v0.5', date: '2026-09-17', summary: 'Fusaka fork note: current-mainnet features, not only a compare baseline.' },
    { version: 'v0.4', date: '2026-09-16', summary: 'Generic Glamsterdam / Fusaka transaction is a first-class when-to-use.' },
    { version: 'v0.2', date: '2026-09-14', summary: 'accounts[].storage seeds slots (EIP-8038 existing-slot SSTORE).' },
    { version: 'v0.1', date: '2026-09-08', summary: 'New MCP tool — VM transaction execution; paid gas, 8037 dimensions, 7708 receipt logs.' },
  ]"
/>

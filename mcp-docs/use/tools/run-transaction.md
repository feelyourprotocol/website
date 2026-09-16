# Run Transaction

> **Status:** Implemented — ships on the public MCP at launch. MCP tool: `run_transaction`. **Public endpoint not live.**

## Purpose

Run a **value-bearing transaction** under a chosen fork and receive **paid transaction gas** plus receipt logs. The sender is impersonated from `from` — no private key.

This is the verb for wallet gas limits, first-touch ETH transfers (EIP-8037), EIP-7708 Transfer logs on **tx value**, and paid **`txStateGas`** (new-slot SSTORE / first-touch). Program-gas SSTORE / SLOAD belongs on [Run Bytecode](/use/tools/run-bytecode).

Raw opcode / stack / precompile programs belong on [Run Bytecode](/use/tools/run-bytecode).

## When to use

- A generic **Amsterdam** or **Osaka** transaction (no EIP named)
- “Is 21,000 gas enough for this transfer after Amsterdam?”
- Paid gas of a simple ETH transfer (Osaka ≈ 21,000; Amsterdam first-touch ≈ 204,600)
- Receipt logs / decoded EIP-7708 Transfer rows
- Amsterdam `txRegularGas` / `txStateGas` when present

## MCP tool name

`run_transaction`

## Inputs

| Field | Required | Description |
| --- | --- | --- |
| `from` | Yes | Hex sender (impersonated) |
| `to` | Yes | Hex recipient |
| `value` | No | Wei as a decimal string (default `0`) |
| `data` | No | Calldata hex |
| `code` | No | Runtime bytecode installed at `to` before the tx (contract-wallet / SSTORE) |
| `accounts` | No | Extra accounts to prefund (`address`, optional `balance`, `code`, `storage` slots) |
| `fork` | No | `{ baseHardfork, eips[] }` — default **`amsterdam`** |
| `gasLimit` | No | Decimal string. Default `1000000`. Pass **`21000`** for the wallet-era simple-transfer limit. |

### Fork notes

Same named forks as [Run Bytecode](/use/tools/run-bytecode): default **amsterdam**, optional **osaka** for a mainnet baseline compare.

## Outputs

| Field | Description |
| --- | --- |
| `success` | Tx completed without revert or intrinsic failure |
| `gasUsed` | **Paid** transaction gas (intrinsic + execution − refund) |
| `gasUsedScope` | Always `transaction` |
| `txRegularGas` | Amsterdam only — regular-gas total |
| `txStateGas` | Amsterdam only — state-gas total |
| `returnValue` | Hex return data |
| `error` | Failure message (e.g. intrinsic gas too low), else `null` |
| `logs` / `decodedLogs` | Receipt logs; EIP-7708 Transfer/Burn decorations when present |
| `provenance` | Always present |

## Example — first-touch 1 wei (Amsterdam)

```json
{
  "from": "0x00000000000000000000000000000000000000ee",
  "to": "0x00000000000000000000000000000000000000aa",
  "value": "1",
  "fork": { "baseHardfork": "amsterdam" }
}
```

Expected: `success: true`, `gasUsed: "204600"`, `txStateGas: "183600"`. The same call on **osaka** is `gasUsed: "21000"`. With `"gasLimit": "21000"` Amsterdam fails.

## JSON schema

[run_transaction.input.json](/schemas/run_transaction.input.json)

## Limits

See [Guarantees](/use/guarantees) for gas ceilings.

## Changelog

<Changelog
  title="Run Transaction Changelog"
  :entries="[
    { version: 'v0.4', date: '2026-09-16', summary: 'Generic Amsterdam / Osaka transaction is a first-class when-to-use.' },
    { version: 'v0.2', date: '2026-09-14', summary: 'accounts[].storage seeds slots (EIP-8038 existing-slot SSTORE).' },
    { version: 'v0.1', date: '2026-09-08', summary: 'New MCP tool — VM transaction execution; paid gas, 8037 dimensions, 7708 receipt logs.' },
  ]"
/>

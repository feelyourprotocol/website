# Run Block

> **Status:** Implemented — ships on the public MCP at launch. MCP tool: `run_block`. **Public endpoint not live.**

## Purpose

Run **1–8 impersonated transactions as one lab block** and receive a **header snapshot** plus **per-tx receipts**. Senders are impersonated from each `from` — no private key.

This is the verb for a chosen beacon slot (`header.slotNumber` / [EIP-7843](/use/eips/eip-7843)), several txs in one block, or a lab `number` / `timestamp`.

A **single** paid transfer still belongs on [Run Transaction](/use/tools/run-transaction). Raw opcode / stack programs belong on [Run Bytecode](/use/tools/run-bytecode). Block-level access lists stay on planned **generate**.

## When to use

- “What does SLOTNUM push if the header slot is 42?”
- Two transfers in one block — receipts in order
- Lab header `timestamp` or `number` the EVM can read

## MCP tool name

`run_block`

## Inputs

| Field | Required | Description |
| --- | --- | --- |
| `transactions` | Yes | 1–8 txs. Each has `from`, `to`, optional `value` / `data` / `code` / `gasLimit` |
| `header.slotNumber` | No | Beacon slot (decimal). **Amsterdam only** |
| `header.number` | No | Block number (decimal). Default `1` |
| `header.timestamp` | No | Unix timestamp (decimal). Default `1` |
| `accounts` | No | Extra accounts to prefund |
| `fork` | No | `{ baseHardfork, eips[] }` — default **`amsterdam`** |

### Fork notes

Same named forks as [Run Bytecode](/use/tools/run-bytecode): default **amsterdam**, optional **osaka** for a mainnet baseline compare. `slotNumber` is rejected on Osaka.

## Outputs

| Field | Description |
| --- | --- |
| `success` | Every tx completed without revert or intrinsic failure |
| `gasUsed` | Header `gasUsed` after lab generate (`gasUsedScope: block`) |
| `header` | `number`, `timestamp`, `gasUsed`, optional `slotNumber` |
| `transactions[]` | Per-tx paid gas, optional Amsterdam `txRegularGas` / `txStateGas`, logs |
| `error` | First tx failure or a block-level catch, else `null` |
| `provenance` | Always present |

On Amsterdam, header `gasUsed` may track the state-gas dimension (EIP-8037). Paid tx gas lives on `transactions[].gasUsed`.

Not in this version: BAL JSON, builder requests, historical replay.

## Example — first-touch 1 wei (Amsterdam)

```json
{
  "transactions": [
    {
      "from": "0x00000000000000000000000000000000000000ee",
      "to": "0x00000000000000000000000000000000000000aa",
      "value": "1"
    }
  ],
  "fork": { "baseHardfork": "amsterdam" }
}
```

Expected: `success: true`, `transactions[0].gasUsed: "204600"`, `txStateGas: "183600"`. The same call on **osaka** is paid `21000`.

## JSON schema

[run_block.input.json](/schemas/run_block.input.json)

## Limits

Max **8** transactions. See [Guarantees](/use/guarantees) for gas ceilings.

## Changelog

<Changelog
  title="Run Block Changelog"
  :entries="[
    { version: 'v0.1', date: '2026-09-10', summary: 'New MCP tool — lab runBlock; header snapshot, per-tx receipts, optional slotNumber.' },
  ]"
/>

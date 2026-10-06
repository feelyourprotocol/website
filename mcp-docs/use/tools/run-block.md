# Run Block

> **Status:** Live on the public MCP. Tool: `run_block`.

<PromptCard
  text="Run a lab block on Amsterdam with two plain 1 wei transfers — show each receipt."
  fork="Amsterdam"
  lookFor="per-transaction receipts plus the header snapshot"
  tool="run_block"
  toolHref="/use/tools/run-block"
  hrefLabel="What you can ask"
  href="/use/capabilities"
/>

## Purpose

Run **1–8 impersonated transactions as one lab block** and receive a **header snapshot** plus **per-tx receipts**. Senders are impersonated from each `from` — no private key.

This is the verb for a chosen beacon slot (`header.slotNumber` / [EIP-7843](/use/eips/eip-7843)), several txs in one block, a lab `number` / `timestamp`, or a **generic Glamsterdam / Fusaka lab block** with no EIP named.

A **single** paid transfer still belongs on [Run Transaction](/use/tools/run-transaction). Raw opcode / stack programs belong on [Run Bytecode](/use/tools/run-bytecode). Block-level access list JSON belongs on **`generate_artifact`** (not this tool).

## Agent voice

Tell the user **per-transaction paid gas**, receipts, and **regular-gas deltas** in plain language — not `transactions[].gasUsed` or header field names unless they asked for raw output.

## When to use

- “What does SLOTNUM push if the header slot is 42?”
- Two transfers in one **Glamsterdam** block — receipts in order
- Lab header `timestamp` or `number` the EVM can read

## MCP tool name

`run_block`

## Inputs

| Field | Required | Description |
| --- | --- | --- |
| `transactions` | Yes | 1–8 txs. Each has `from`, `to`, optional `value` / `data` / `code` / `gasLimit` |
| `header.slotNumber` | No | Beacon slot (decimal). **Glamsterdam only** |
| `header.number` | No | Block number (decimal). Default `1` |
| `header.timestamp` | No | Unix timestamp (decimal). Default `1` |
| `accounts` | No | Extra accounts to prefund |
| `fork` | No | `{ baseHardfork, eips[] }` — default **`glamsterdam`** |

### Fork notes

Same named forks as [Run Bytecode](/use/tools/run-bytecode): default **glamsterdam**; **fusaka** when the user asks for current-mainnet EL behavior. One run per named fork unless they ask to compare. `slotNumber` is rejected on Fusaka.

## Outputs

| Field | Description |
| --- | --- |
| `success` | Every tx completed without revert or intrinsic failure |
| `gasUsed` | Header `gasUsed` after lab generate (`gasUsedScope: block`) |
| `header` | `number`, `timestamp`, `gasUsed`, optional `slotNumber` |
| `transactions[]` | Per-tx paid gas, optional Glamsterdam `txRegularGas` / `txStateGas`, `regularGas`, `recipientPrestate`, logs |
| `regularGasDelta` | When per-tx `regularGas.total` differs — part names and values per tx index |
| `error` | First tx failure or a block-level catch, else `null` |
| `provenance` | Always present — named `eips[]` add a compact `Spec:` clause on `caveat` |

On Glamsterdam, header `gasUsed` may track the state-gas dimension (EIP-8037). Paid tx gas lives on `transactions[].gasUsed`.

When two receipts disagree on paid regular gas, explain from `regularGas` / `regularGasDelta` — not from matching `txStateGas`.

Not in this version: BAL JSON, builder requests, historical replay.

## Example — first-touch 1 wei (Glamsterdam)

```json
{
  "transactions": [
    {
      "from": "0x00000000000000000000000000000000000000ee",
      "to": "0x00000000000000000000000000000000000000aa",
      "value": "1"
    }
  ],
  "fork": { "baseHardfork": "glamsterdam" }
}
```

Expected: `success: true`, `transactions[0].gasUsed: "204600"`, `txStateGas: "183600"`. The same call on **fusaka** is paid `21000`.

## JSON schema

[run_block.input.json](/schemas/run_block.input.json)

## Limits

Max **8** transactions. See [Guarantees](/use/guarantees) for gas ceilings.

<CollapsibleChangelog
  title="Run Block Changelog"
  :entries="[
    { version: 'v0.4', date: '2026-10-06', summary: 'Public endpoint is live.' },
    { version: 'v0.3', date: '2026-09-17', summary: 'Fusaka fork note: current-mainnet features, not only a compare baseline.' },
    { version: 'v0.2', date: '2026-09-16', summary: 'Generic Glamsterdam / Fusaka lab block is a first-class when-to-use.' },
  ]"
/>

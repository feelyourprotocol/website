# Inspect

> **Status:** Implemented — MCP tool: `inspect`. **Public endpoint not live.**

## Purpose

Judge a **caller-supplied** structured artifact **without chain state** — encoding (layer A), canonical structure and item cap (layer B), optional hash match (layer C). Not consensus replay against mainnet.

Kinds (see probe **`inspectKinds`**): **`block-access-list`** (7928), **`authorization-list`** (7702), **`typed-transaction`** (2718 RLP), **`withdrawals`** (4895), **`execution-requests`** (7685).

## MCP tool name

`inspect`

## Inputs

| Field | Required | Description |
| --- | --- | --- |
| `artifact` | Yes | BAL JSON array or RLP hex string |
| `kind` | No | Default `block-access-list` |
| `blockGasLimit` | No | Decimal string for item cap check |
| `expectedHash` | No | 32-byte hex `blockAccessListHash` |

## Outputs

`wellFormed`, `structureOk`, optional `hashMatch` / `itemCapOk`, `errors[]`, `computedHash`, `itemCount`.

See [Describe Capabilities](/use/tools/describe-capabilities) for `inspectKinds`.

# Inspect

> **Status:** Implemented — MCP tool: `inspect`. **Public endpoint not live.**

## Purpose

Judge a **caller-supplied** structured artifact **without chain state** — encoding (layer A), canonical structure and item cap (layer B), optional hash match (layer C). Not consensus replay against mainnet.

First kind: **`block-access-list`** (EIP-7928).

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

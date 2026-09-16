# Generate

> **Status:** Implemented — MCP tool: `generate`. **Public endpoint not live.**

## Purpose

Derive **structured artifacts** from a lab block run — same inputs as [Run Block](/use/tools/run-block) (1–8 txs, accounts, optional header). First kind: **`block-access-list`** (EIP-7928 BAL JSON + hash).

BYOS lab only. Does **not** verify the BAL of a mainnet block without archive parent state.

## MCP tool name

`generate`

## Inputs

Same as `run_block`, plus optional `kind` (`block-access-list`, default).

## Outputs

| Field | Description |
| --- | --- |
| `artifactKind` | `block-access-list` |
| `bal` | Engine API JSON |
| `hash` | `blockAccessListHash` commitment |
| `itemCount` / `maxItems` | EIP-7928 item cap vs lab block gas limit |
| `provenance` | Fork and engine metadata |

Pair with [Inspect](/use/tools/inspect) on caller-supplied BAL payloads.

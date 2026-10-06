# Inspect Artifact

> **Status:** Implemented — MCP tool: `inspect_artifact`. **Public endpoint not live.**

<PromptCard
  text="Inspect this BAL JSON — is the structure valid, and does the hash match?"
  fork="Amsterdam"
  lookFor="validation layers and the hash check"
  tool="inspect_artifact"
  toolHref="/use/tools/inspect-artifact"
  hrefLabel="What you can ask"
  href="/use/capabilities"
/>

## Purpose

Judge a **caller-supplied** structured artifact **without chain state** — encoding (layer A), canonical structure and item cap (layer B), optional hash match (layer C). Not consensus replay against mainnet.

Kinds (see probe **`inspectKinds`**): **`block-access-list`** (7928 BAL), **`authorization-list`** (Pectra+ set-code JSON), **`typed-transaction`** (2718 RLP), **`withdrawals`** (4895), **`execution-requests`** (7685).

## MCP tool name

`inspect_artifact`

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

## JSON schema

[inspect_artifact.input.json](/schemas/inspect_artifact.input.json)

<CollapsibleChangelog
  title="Inspect Artifact Changelog"
  :entries="[
    { version: 'v0.2', date: '2026-09-22', summary: 'Renamed MCP tool inspect → inspect_artifact (query shape stays inspect).' },
    { version: 'v0.1', date: '2026-09-16', summary: 'Implemented — structure and hash without chain state.' },
  ]"
/>

# Generate Artifact

> **Status:** Live on the public MCP. Tool: `generate_artifact`.

<PromptCard
  text="Generate a BAL for a block with one plain ETH transfer on Amsterdam."
  fork="Amsterdam"
  lookFor="BAL JSON and its hash"
  tool="generate_artifact"
  toolHref="/use/tools/generate-artifact"
  hrefLabel="What you can ask"
  href="/use/capabilities"
/>

## Purpose

Derive **structured artifacts** from a lab block run — same inputs as [Run Block](/use/tools/run-block) (1–8 txs, accounts, optional header). First kind: **`block-access-list`** (EIP-7928 BAL JSON + hash).

BYOS lab only. Does **not** verify the BAL of a mainnet block without archive parent state.

## MCP tool name

`generate_artifact`

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

Pair with [Inspect Artifact](/use/tools/inspect-artifact) on caller-supplied BAL payloads.

## JSON schema

[generate_artifact.input.json](/schemas/generate_artifact.input.json)

<CollapsibleChangelog
  title="Generate Artifact Changelog"
  :entries="[
    { version: 'v0.3', date: '2026-10-06', summary: 'Public endpoint is live.' },
    { version: 'v0.2', date: '2026-09-22', summary: 'Renamed MCP tool generate → generate_artifact (query shape stays generate).' },
    { version: 'v0.1', date: '2026-09-16', summary: 'Implemented — BAL from lab block on Glamsterdam.' },
  ]"
/>

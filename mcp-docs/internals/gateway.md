# Gateway

> **Status:** **v0.1** — six tools on the public HTTP endpoint. Stdio remains a development transport. Connect at [Connect](/use/connect).

The **`mcp-gateway`** repo is the public face of the MCP server:

- **MCP transport** — HTTP `/mcp` on EC2 is the public product; stdio stays a development transport
- **Tool registry** — intent-driven tools → `mcp-execution-engine`
- **TaskProcessor seam** — `LocalTaskProcessor` now; worker pool / queue later
- **Observability** — planned (Step 7)
- **x402 payments** — after this open launch (paid tier for new EIPs; not part of the free server)

It depends one-way on **`mcp-execution-engine`**. End-user connection (hosted): [Connect](/use/connect).

## Live tools (v0.1)

| MCP tool | Engine call |
| --- | --- |
| `describe_capabilities` | `describeCapabilities()` |
| `run_bytecode` | `simulateBytecode()` |
| `run_transaction` | `runTransaction()` |
| `run_block` | `runBlock()` |
| `generate_artifact` | `generateArtifact()` |
| `inspect_artifact` | `inspectArtifact()` |

Server name: `FeelYourProtocol` v0.1.0. Entry: `node dist/index.js` (bin: `fyp-mcp`).

## Repository layout

```
mcp-gateway/
├── src/
│   ├── index.ts                 # stdio entry
│   ├── engine/TaskProcessor.ts  # scaling seam
│   ├── tools/                   # MCP tool registration
│   └── schemas/                 # Zod — runtime validation (source of truth)
└── schemas/                     # Published *.input.json + manifest.json
```

Published JSON in gateway `schemas/` is copied byte-for-byte to [mcp-docs/public/schemas/](/schemas/describe_capabilities.input.json) (one file per tool). CI in both repos fails when copies drift.

## Changelog

<Changelog
  title="Gateway Changelog"
  :entries="[
    { version: 'v0.1.10', date: '2026-10-06', summary: 'Public HTTP is the product path. x402 stays on the later paid tier.' },
    { version: 'v0.1.9', date: '2026-10-01', summary: 'x402 is after the open public launch, for the paid EIP tier.' },
    { version: 'v0.1.8', date: '2026-09-22', summary: 'Six tools; Zod vs published JSON schema workflow and manifest.' },
    { version: 'v0.1.7', date: '2026-09-16', summary: 'Server instructions claim generic hardfork prompts; named forks stay on the same verbs.' },
    { version: 'v0.1.5', date: '2026-09-08', summary: 'Added run_transaction; renamed run_evm_bytecode → run_bytecode.' },
    { version: 'v0.1.4', date: '2026-09-02', summary: 'Stdio framed as development transport; public path is hosted Connect.' },
    { version: 'v0.1.3', date: '2026-08-27', summary: 'Renamed simulate_evm_bytecode → run_evm_bytecode.' },
    { version: 'v0.1.1', date: '2026-08-27', summary: 'compare_evm_variants live on stdio.' },
    { version: 'v0.1.0', date: '2026-07-22', summary: 'Stdio gateway — describe_capabilities + run_evm_bytecode, TaskProcessor seam, integration tests.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Placeholder under internals/.' },
  ]"
/>

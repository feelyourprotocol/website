# Gateway

> **Status:** **v0.1** — four tools implemented (development transport). HTTP on AWS planned (Steps 4–5). Public product path is the hosted endpoint — see [Connect](/use/connect).

The **`mcp-gateway`** repo is the public face of the MCP server:

- **MCP transport** — stdio as development transport today; HTTP `/mcp` on EC2 for the public product
- **Tool registry** — intent-driven tools → `mcp-execution-engine`
- **TaskProcessor seam** — `LocalTaskProcessor` now; worker pool / queue later
- **Observability** — planned (Step 7)
- **x402 payments** — planned (Steps 8–9)

It depends one-way on **`mcp-execution-engine`**. End-user connection (hosted): [Connect](/use/connect).

## Live tools (v0.1)

| MCP tool | Engine call |
| --- | --- |
| `describe_capabilities` | `describeCapabilities()` |
| `run_bytecode` | `simulateBytecode()` |
| `run_transaction` | `runTransaction()` |
| `run_block` | `runBlock()` |

Server name: `FeelYourProtocol` v0.1.0. Entry: `node dist/index.js` (bin: `fyp-mcp`).

## Repository layout

```
mcp-gateway/
├── src/
│   ├── index.ts                 # stdio entry
│   ├── engine/TaskProcessor.ts  # scaling seam
│   ├── tools/                   # MCP tool registration
│   └── schemas/                 # zod (mirrored in public/schemas on docs site)
└── schemas/                     # JSON Schema copies for docs
```

## Changelog

<Changelog
  title="Gateway Changelog"
  :entries="[
    { version: 'v0.1.6', date: '2026-09-10', summary: 'Added run_block (lab header snapshot + per-tx receipts).' },
    { version: 'v0.1.5', date: '2026-09-08', summary: 'Added run_transaction; renamed run_evm_bytecode → run_bytecode.' },
    { version: 'v0.1.4', date: '2026-09-02', summary: 'Stdio framed as development transport; public path is hosted Connect.' },
    { version: 'v0.1.3', date: '2026-08-27', summary: 'Renamed simulate_evm_bytecode → run_evm_bytecode.' },
    { version: 'v0.1.1', date: '2026-08-27', summary: 'compare_evm_variants live on stdio.' },
    { version: 'v0.1.0', date: '2026-07-22', summary: 'Stdio gateway — describe_capabilities + run_evm_bytecode, TaskProcessor seam, integration tests.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Placeholder under internals/.' },
  ]"
/>

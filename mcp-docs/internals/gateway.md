# Gateway

> **Status:** **Planned** (Step 3+).

The **`mcp-gateway`** is the public face of the MCP server on AWS:

- MCP transport (stdio first, HTTP later)
- Tool registry mapping intent-driven tools to the execution engine
- Observability
- x402 payments (later)

It depends one-way on **`mcp-execution-engine`**. End-user connection docs will live under [Connect](/use/connect) as the gateway ships.

## Changelog

<Changelog
  title="Gateway Changelog"
  :entries="[
    { version: 'v0.3', date: '2026-07-20', summary: 'Placeholder under internals/.' },
  ]"
/>

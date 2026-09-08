# Connect

> **Status:** **Public MCP — not launched.** **Launch week target: 5–9 October 2026.** Planned URL: **`https://mcp.feelyourprotocol.org/mcp`**. [Roadmap launch details](https://roadmap.feelyourprotocol.org/roadmap/launch.html).

::: tip Looking to explore EIPs in the browser?
Go to **[feelyourprotocol.org](https://feelyourprotocol.org)** — no MCP setup required. Come back here when the hosted MCP endpoint ships.
:::

## What is available today

| URL / transport | Purpose | Status |
| --- | --- | --- |
| [feelyourprotocol.org](https://feelyourprotocol.org) | Interactive explorations | **Live** — start here |
| `https://mcp-docs.feelyourprotocol.org` | This documentation site | **Live** |
| `https://mcp.feelyourprotocol.org/mcp` | Remote MCP over HTTP | **Not launched** |

There is **no** public URL to connect an agent today. **Launch week: 5–9 October 2026** — see the [roadmap launch page](https://roadmap.feelyourprotocol.org/roadmap/launch.html).

This page documents the **hosted** product. It is not a self-host guide.

## What agents will connect to (at launch)

The hosted server will expose:

| MCP tool | Shape | Purpose |
| --- | --- | --- |
| `describe_capabilities` | probe | Registry snapshot — forks, runnable EIP modules, opcodes, encoding |
| `run_bytecode` | simulate | Run raw bytecode under a fork config |
| `run_transaction` | transaction | Paid tx gas, receipt logs, first-touch / wallet gasLimit |

To **optionally** compare baseline vs preview, call the **same verb** twice — **`osaka`** then **`amsterdam`** — and diff gas or outcomes. A single run on Amsterdam alone is fine.

Payments (x402) and the exact client config for Cursor, Claude, and other MCP hosts will be documented here when the endpoint ships. Same tools; remote HTTP — no local build required.

## Example prompts (when the public server is connected)

You do not need to memorize tool names. Examples:

- *"Simulate bytecode `0x600100` under Amsterdam and tell me the gas used."*
- *"What EIPs does the Feel Your Protocol MCP server support?"*
- *"Run a 1 wei transfer to an empty account on Amsterdam vs Osaka — what gas would a wallet need?"*
- *"Run ModExp gas compare on Prague vs Osaka."*

The agent should route these to `run_bytecode`, `run_transaction`, or `describe_capabilities`.

## Changelog

<Changelog
  title="Connect Changelog"
  :entries="[
    { version: 'v0.10', date: '2026-09-08', summary: 'Added run_transaction; renamed run_evm_bytecode → run_bytecode.' },
    { version: 'v0.9', date: '2026-09-02', summary: 'Launch week countdown — 5–9 Oct 2026 target; link to roadmap launch page.' },
    { version: 'v0.7', date: '2026-08-31', summary: 'Not publicly launched — reframe page as developer early access; point most users to website explorations.' },
    { version: 'v0.6', date: '2026-08-27', summary: 'Two live tools — compare_evm_variants removed.' },
    { version: 'v0.5', date: '2026-08-27', summary: 'Third live tool: compare_evm_variants; catalog is EIP-8024 only.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Local stdio gateway live — Cursor config, tool list, restart notes, agent guidance.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from overview — connection placeholder under use/.' },
  ]"
/>

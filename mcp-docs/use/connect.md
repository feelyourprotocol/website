# Connect

> **Status:** **Public MCP — not launched.** **`https://mcp.feelyourprotocol.org/mcp`** is planned (Step 5). This page is for **developers** running the local stdio gateway (v0.1).

::: tip Looking to explore EIPs in the browser?
Go to **[feelyourprotocol.org](https://feelyourprotocol.org)** — no MCP setup required. Come back here when the hosted MCP endpoint ships or if you are building from source.
:::

## What is available today

| URL / transport | Purpose | Status |
| --- | --- | --- |
| [feelyourprotocol.org](https://feelyourprotocol.org) | Interactive explorations | **Live** — start here |
| `https://mcp-docs.feelyourprotocol.org` | This documentation site | **Live** |
| `https://mcp.feelyourprotocol.org/mcp` | Remote MCP over HTTP | **Not launched** (Step 5, AWS EC2) |
| **stdio** — `mcp-gateway` (`fyp-mcp`) | Local MCP in Cursor, Claude Desktop, etc. | **Early access** (v0.1 — self-hosted only) |

There is **no** public URL to connect an agent today. Community announcements about “MCP” refer to this **upcoming** capability and to the documentation/catalogue we are publishing ahead of launch.

## Early access: local stdio (developers)

If you clone the repos and build locally, the gateway exposes:

| MCP tool | Shape | Purpose |
| --- | --- | --- |
| `describe_capabilities` | probe | Registry snapshot — forks, runnable EIP modules, opcodes, encoding |
| `run_evm_bytecode` | run | Run raw bytecode under a fork config |

To **optionally** compare baseline vs preview, call **run** twice with the same bytecode — **`osaka`** then **`amsterdam`** — and diff gas or outcomes. A single run on Amsterdam alone is fine.

**Agents:** If the `feel-your-protocol` MCP server is connected locally, **call these tools directly**. Do not fall back to the local execution engine or `npm run lab` unless MCP is unavailable.

### 1. Build

```bash
cd feelyourprotocol/mcp-execution-engine && npm ci && npm run build
cd ../mcp-gateway && npm ci && npm run build
```

### 2. MCP config

Add to Cursor MCP settings (`~/.cursor/mcp.json` or project config):

```json
{
  "mcpServers": {
    "feel-your-protocol": {
      "command": "node",
      "args": ["/absolute/path/to/feelyourprotocol/mcp-gateway/dist/index.js"]
    }
  }
}
```

Use an **absolute path** to `dist/index.js`.

### 3. Restart MCP after code changes

Cursor caches the tool list from the running process:

1. `npm run build` in `mcp-gateway` after any gateway change
2. **Restart** the MCP server in Cursor (Settings → MCP → restart `feel-your-protocol`), or reload the window

On startup the server logs to **stderr** (visible in MCP logs):

```
[fyp-mcp] FeelYourProtocol v0.1.0 ready — tools: describe_capabilities, run_evm_bytecode
```

If that line lists only one tool, the running binary is stale — rebuild and restart.

### 4. Verify

Ask your agent:

> *"List the MCP tools on feel-your-protocol and call describe_capabilities."*

You should see **two** tools and a JSON registry with `engineVersion`, `baselineForkId` (`osaka`), named forks, and runnable EIP modules.

## Example prompts (when connected locally)

You do not need to memorize tool names. Examples:

- *"Simulate bytecode `0x600100` under Amsterdam and tell me the gas used."*
- *"What EIPs does the Feel Your Protocol MCP server support?"*
- *"Run ModExp gas compare on Prague vs Osaka."*

The agent should route these to `run_evm_bytecode` or `describe_capabilities`.

## Public launch (planned)

Step 5 will document `https://mcp.feelyourprotocol.org/mcp` (Express + Streamable HTTP on AWS EC2). Same tools; different transport — no local build required.

## Changelog

<Changelog
  title="Connect Changelog"
  :entries="[
    { version: 'v0.7', date: '2026-08-31', summary: 'Not publicly launched — reframe page as developer early access; point most users to website explorations.' },
    { version: 'v0.6', date: '2026-08-27', summary: 'Two live tools — compare_evm_variants removed.' },
    { version: 'v0.5', date: '2026-08-27', summary: 'Third live tool: compare_evm_variants; catalog is EIP-8024 only.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Local stdio gateway live — Cursor config, tool list, restart notes, agent guidance.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from overview — connection placeholder under use/.' },
  ]"
/>

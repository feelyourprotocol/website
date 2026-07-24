# Connect

> **Status:** **Local stdio gateway live** (v0.1). Remote HTTP endpoint planned (Step 5).

## Endpoints

| URL / transport | Purpose | Status |
| --- | --- | --- |
| `https://mcp-docs.feelyourprotocol.org` | This documentation site | **Live** |
| **stdio** — `mcp-gateway` (`fyp-mcp`) | Local MCP in Cursor, Claude Desktop, etc. | **Live** (v0.1) |
| `https://mcp.feelyourprotocol.org/mcp` | Remote MCP over HTTP | Planned (Step 5, AWS EC2) |

## Live MCP tools (stdio v0.1)

When connected, the server exposes:

| MCP tool | Shape | Purpose |
| --- | --- | --- |
| `describe_capabilities` | probe | Registry snapshot — forks, EIPs, ceilings |
| `simulate_evm_bytecode` | simulate | Run raw bytecode under a fork config |

**Agents:** If the `feel-your-protocol` MCP server is connected, **call these tools directly**. Do not fall back to the local execution engine or `npm run lab` unless the MCP server is unavailable.

## Local setup (Cursor / Claude Desktop)

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
[fyp-mcp] FeelYourProtocol-EVM v0.1.0 ready — tools: describe_capabilities, simulate_evm_bytecode
```

If that line lists only one tool, the running binary is stale — rebuild and restart.

### 4. Verify

Ask your agent:

> *"List the MCP tools on feel-your-protocol and call describe_capabilities."*

You should see both tools and a JSON registry with `engineVersion`, `amsterdam`, and EIP entries.

## Example prompts (natural language)

You do not need to memorize tool names. Examples:

- *"Simulate bytecode `0x600100` under Amsterdam and tell me the gas used."*
- *"Run the EIP-8024 EXCHANGE demo on Amsterdam with trace: `0x6001600260036004e88e00`."*
- *"What EIPs does the Feel Your Protocol MCP server support?"*

The agent should route these to `simulate_evm_bytecode` or `describe_capabilities`.

## Remote HTTP (planned)

Step 5 will document `https://mcp.feelyourprotocol.org/mcp` (Express + Streamable HTTP on AWS EC2). Same tools; different transport.

## Changelog

<Changelog
  title="Connect Changelog"
  :entries="[
    { version: 'v0.4', date: '2026-07-22', summary: 'Local stdio gateway live — Cursor config, tool list, restart notes, agent guidance.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from overview — connection placeholder under use/.' },
  ]"
/>

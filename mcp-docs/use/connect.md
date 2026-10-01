# Connect

::: tip Launch timing
**Target: 5–9 October 2026.** The hosted URL below is **not live yet**. You can prepare config now; reconnect or refresh tools once we announce the endpoint on [X @FeelEthereum](https://x.com/FeelEthereum).
:::

**Endpoint (at launch):** `https://mcp.feelyourprotocol.org/mcp`  
**Cost at launch:** free — full Glamsterdam hardfork, no wallet, no API key.

This page is the **hosted** product only — not a self-host guide. For browser learning, use **[feelyourprotocol.org](https://feelyourprotocol.org)**.

## After you connect — try this first

Ask your agent:

> *“Send 1 wei to an empty account under Amsterdam and tell me the gas the wallet would need.”*

That exercises first-touch state gas ([EIP-8037](/use/eips/eip-8037)) without you naming tools or JSON fields. Then browse [Amsterdam now](/use/forks/glamsterdam) for more prompts.

---

## Cursor

1. Open **Cursor Settings → MCP** (or edit your user `mcp.json`).
2. Add a server entry (name is yours; `feel-your-protocol` matches our docs):

```json
{
  "mcpServers": {
    "feel-your-protocol": {
      "url": "https://mcp.feelyourprotocol.org/mcp"
    }
  }
}
```

3. Save and **restart Cursor** or reload MCP servers from settings.
4. In chat, confirm tools appear (six verbs including run and probe capabilities).
5. Run the [first prompt](#after-you-connect-try-this-first) above.

Remote HTTP MCP requires a Cursor build that supports URL transport — update Cursor if the server fails to connect once the endpoint is live.

---

## Claude (Desktop)

1. Open **Settings → Developer → Edit Config** (MCP configuration location varies slightly by Claude Desktop version — use the official “custom MCP server” docs for your install).
2. Register the same URL:

```json
{
  "mcpServers": {
    "feel-your-protocol": {
      "url": "https://mcp.feelyourprotocol.org/mcp"
    }
  }
}
```

3. Restart Claude Desktop.
4. Start a new conversation and ask the [first prompt](#after-you-connect-try-this-first).

If your Claude product only lists pre-approved connectors today, save this config and retry at launch — we document the stable URL here.

---

## OpenAI Codex / CLI agents

Point your MCP-capable Codex or agent CLI at the same HTTP endpoint. Exact flag names depend on the client; the invariant is:

- **Transport:** HTTP MCP at `https://mcp.feelyourprotocol.org/mcp`
- **Discovery:** allow the host to list tools from the server
- **First test:** the [8037 prompt](#after-you-connect-try-this-first)

When OpenAI ships or updates Codex MCP wiring, this URL stays the single integration point — no per-EIP endpoints.

---

## Other MCP hosts

Any host that supports **remote MCP over HTTP** can use:

| Field | Value |
| --- | --- |
| URL | `https://mcp.feelyourprotocol.org/mcp` |
| Auth at launch | none |

After connect, prefer natural-language questions. The agent should call the server’s generic tools (`run_bytecode`, `run_transaction`, `run_block`, …) — you do not need to memorize them. Optional compare: ask for the **same question on Fusaka then Amsterdam** and diff gas or receipts.

## What the server exposes

At launch you get probe + run + artifact tools covering Amsterdam and the earlier fork lineage. Machine-readable schemas live under [Reference → Tool schemas](/use/tools/describe-capabilities). Human “what can I ask?” lives on [What you can ask](/use/capabilities).

## Changelog

<Changelog
  title="Connect Changelog"
  :entries="[
    { version: 'v0.14', date: '2026-10-01', summary: 'Cursor, Claude, Codex, and generic HTTP MCP setup; first-test prompt; launch still pending.' },
    { version: 'v0.13', date: '2026-10-01', summary: 'Launch connect is free. Client config still lands with the endpoint.' },
    { version: 'v0.12', date: '2026-09-16', summary: 'Example prompt for a generic Glamsterdam run with no EIP named.' },
    { version: 'v0.10', date: '2026-09-08', summary: 'Added run_transaction; renamed run_evm_bytecode → run_bytecode.' },
    { version: 'v0.9', date: '2026-09-02', summary: 'Launch week countdown — 5–9 Oct 2026 target; link to roadmap launch page.' },
    { version: 'v0.7', date: '2026-08-31', summary: 'Not publicly launched — reframe page as developer early access; point most users to website explorations.' },
    { version: 'v0.6', date: '2026-08-27', summary: 'Two live tools — compare_evm_variants removed.' },
    { version: 'v0.5', date: '2026-08-27', summary: 'Third live tool: compare_evm_variants; catalog is EIP-8024 only.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Local stdio gateway live — Cursor config, tool list, restart notes, agent guidance.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from overview — connection placeholder under use/.' },
  ]"
/>

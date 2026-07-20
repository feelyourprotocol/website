# Deployment

> **Status:** MCP docs site deployed on Strato. MCP server host — planned (AWS EC2).

## MCP docs (this site)

- **Production:** [mcp-docs.feelyourprotocol.org](https://mcp-docs.feelyourprotocol.org)
- **Build:** `npm run mcp-docs:build` → `dist/mcp-docs/`
- **Deploy:** `npm run build:deploy` on the server after `git pull` (see `server-config/deployment/fyp_deploy.sh`)

Public nginx shape is documented in the private **`server-config`** repo. Sensitive values (SSH, secrets, env) stay there.

## MCP server endpoint (planned)

| URL | Purpose | Status |
| --- | --- | --- |
| `https://mcp.feelyourprotocol.org/mcp` | Remote MCP over HTTP | Planned (Step 5) |

AWS target architecture is on the [roadmap](https://roadmap.feelyourprotocol.org). Deploy shape for the gateway will be added here when Step 4 lands.

## Changelog

<Changelog
  title="Deployment Changelog"
  :entries="[
    { version: 'v0.3', date: '2026-07-20', summary: 'Deployment page under internals/.' },
  ]"
/>

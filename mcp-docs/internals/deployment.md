# Deployment

> **Status:** MCP docs site deployed on Strato. MCP server host — planned (AWS EC2).

## MCP docs (this site)

- **Production:** [mcp-docs.feelyourprotocol.org](https://mcp-docs.feelyourprotocol.org)
- **Build:** `npm run mcp-docs:build` → `dist/mcp-docs/`
- **Deploy:** GitHub Actions on `main` builds `dist/` and rsyncs it to Strato (see private `server-config` `strato-fyp/deployment/README.md`)

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
    { version: 'v0.4', date: '2026-09-14', summary: 'Production: GitHub Actions rsync of dist/ to Strato (not git pull on the box).' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Deployment page under internals/.' },
  ]"
/>

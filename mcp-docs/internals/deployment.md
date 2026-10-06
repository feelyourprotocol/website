# Deployment

> **Status:** MCP docs site deployed on Strato. MCP server host live on AWS (6 October 2026).

## MCP docs (this site)

- **Production:** [mcp-docs.feelyourprotocol.org](https://mcp-docs.feelyourprotocol.org)
- **Build:** `npm run mcp-docs:build` → `dist/mcp-docs/`
- **Deploy:** GitHub Actions on `main` builds `dist/` and rsyncs it to Strato (see private `server-config` `strato-fyp/deployment/README.md`)

Public nginx shape is documented in the private **`server-config`** repo. Sensitive values (SSH, secrets, env) stay there.

## MCP server endpoint

| URL | Purpose | Status |
| --- | --- | --- |
| `https://mcp.feelyourprotocol.org/mcp` | Remote MCP over HTTP | **Live** (6 October 2026) |

AWS shape is on the [roadmap](https://roadmap.feelyourprotocol.org). Client setup is on [Connect](/use/connect).

## Changelog

<Changelog
  title="Deployment Changelog"
  :entries="[
    { version: 'v0.5', date: '2026-10-06', summary: 'Hosted MCP endpoint is live. Docs site deploy is unchanged.' },
    { version: 'v0.4', date: '2026-09-14', summary: 'Production: GitHub Actions rsync of dist/ to Strato (not git pull on the box).' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Deployment page under internals/.' },
  ]"
/>

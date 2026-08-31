# Roadmap vs MCP Docs

Feel Your Protocol maintains **two documentation layers** with different jobs. Both are public; both use VitePress; both share the FYP design language — but they answer different questions.

## The split

| | **Roadmap** (`roadmap.feelyourprotocol.org`) | **MCP Docs** (`mcp-docs.feelyourprotocol.org`) |
| --- | --- | --- |
| **Tense** | Future-facing — vision, strategy, draft concepts | Present-facing — what exists, how to use it |
| **Audience** | Community, investors, strategic readers | Agent operators, integrators, us (human + AI) replicating setup |
| **Content** | Problem/vision, tracks, timeline, pricing *concepts*, AWS *targets* | Tool reference ([Use](/use/introduction)), repo layout ([Internals](/internals/architecture)) |
| **Character** | Purple "Strategy HQ" skin | Terminal-green "Machine Room" skin |
| **Changes when** | Thinking evolves | Capabilities ship |

**Rule of thumb:** if it is a hypothesis or a target, it lives on the **roadmap**. If you can curl it, clone it, or call it from an agent today, it lives in **MCP docs**.

## How they stay in sync

When a roadmap concept graduates to shipped reality:

1. **Implement** the capability in `mcp-execution-engine` / `mcp-gateway`.
2. **Document** the concrete outcome under [Use](/use/introduction) (tool reference) and [Internals](/internals/architecture) (setup, changelog).
3. **Update** the roadmap concept page with a short status note — e.g. _"Now shipped — see [MCP docs](https://mcp-docs.feelyourprotocol.org/use/introduction.html)"_ — without duplicating the full technical detail.

The roadmap [Agent API & MCP concept](https://roadmap.feelyourprotocol.org/concepts/api-mcp.html) remains the strategic sketch; this site becomes the operational manual as pieces land.

## What lives where (examples)

| Topic | Roadmap | MCP Docs | Private `server-config` |
| --- | --- | --- | --- |
| Why build an MCP server? | Yes | Brief pointer | — |
| x402 pricing *model* (draft) | Yes | — | — |
| x402 middleware *wiring* | Pointer only | Yes (when shipped) | Secrets, treasury address |
| AWS *target* architecture | Yes | Deploy shape (public) | Real nginx, SSH, env |
| `run_evm_bytecode` tool schema | — | Yes (when shipped) | — |
| Token discount tiers (concept) | Yes | Yes (when shipped) | Token contract address |

## Fleet map

All sites are separate subdomains; the [main website](https://feelyourprotocol.org) is the binding ground:

- [feelyourprotocol.org](https://feelyourprotocol.org) — interactive explorations (Leg A)
- [website-docs.feelyourprotocol.org](https://website-docs.feelyourprotocol.org) — website contributor docs
- [docs.feelyourprotocol.org](https://docs.feelyourprotocol.org) — documentation hub (all four sites)
- [roadmap.feelyourprotocol.org](https://roadmap.feelyourprotocol.org) — vision & strategy
- [community-token.feelyourprotocol.org](https://community-token.feelyourprotocol.org) — token transparency
- **mcp-docs.feelyourprotocol.org** — MCP server reference (this site)
- `mcp.feelyourprotocol.org` — MCP server endpoint (planned, AWS)

## Changelog

<Changelog
  title="Roadmap Relationship Changelog"
  :entries="[
    { version: 'v0.3', date: '2026-07-20', summary: 'Moved to internals/; updated links for use/ split.' },
    { version: 'v0.1', date: '2026-07-15', summary: 'Initial split definition — roadmap vs MCP docs vs server-config.' },
  ]"
/>

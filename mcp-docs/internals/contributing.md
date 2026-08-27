# Contributing

MCP docs content lives in the [website](https://github.com/feelyourprotocol/website) repo under `mcp-docs/`.

## Structure

| Section | Path | Audience |
| --- | --- | --- |
| **Use** | `use/` | End users and agents — capabilities, tools, connection |
| **Internals** | `internals/` | Us and deep-divers — architecture, engine API, quality, deploy |

When a capability ships:

1. Add or update a page under `use/tools/` (generic MCP tool reference)
2. Add or update `use/eips/eip-NNNN.md` when a **runnable** engine module ships (human catalogue — prompts, twins; not demo bytecode)
3. Update `use/coverage.md` index and sidebar in `.vitepress/config.ts`
4. Update `internals/execution-engine` or `internals/gateway` as needed
5. Add a changelog entry on the affected page
6. Update `public/llms.txt` and `public/llms-full.txt`

Builder invariants for engine/gateway code: [mcp-execution-engine/AGENTS.md](https://github.com/feelyourprotocol/mcp-execution-engine/blob/main/AGENTS.md), [mcp-gateway/AGENTS.md](https://github.com/feelyourprotocol/mcp-gateway/blob/main/AGENTS.md).

See [Quality](/internals/quality) for test and lint commands.

## Changelog

<Changelog
  title="Contributing Changelog"
  :entries="[
    { version: 'v0.4', date: '2026-08-27', summary: 'EIP catalogue under use/eips/; link to engine/gateway AGENTS.md for builders.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Contributing page under internals/.' },
  ]"
/>

# Contributing

MCP docs content lives in the [website](https://github.com/feelyourprotocol/website) repo under `mcp-docs/`.

## Structure

| Section | Path | Audience |
| --- | --- | --- |
| **Use** | `use/` | End users and agents — capabilities, tools, connection |
| **Internals** | `internals/` | Us and deep-divers — architecture, engine API, quality, deploy |

When a capability ships:

1. Add or update a page under `use/tools/` (end-user tool reference)
2. Update `internals/execution-engine` or `internals/gateway` as needed
3. Add a changelog entry on the affected page
4. Update `public/llms.txt` and `public/llms-full.txt`

See [Quality](/internals/quality) for test and lint commands.

## Changelog

<Changelog
  title="Contributing Changelog"
  :entries="[
    { version: 'v0.3', date: '2026-07-20', summary: 'Contributing page under internals/.' },
  ]"
/>

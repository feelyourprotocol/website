# Quality

> **Status:** Engine v0.1 local — tooling aligned with the [website](https://website-docs.feelyourprotocol.org/guide/getting-started.html) stack.

## Execution engine

```bash
cd mcp-execution-engine
npm install
npm run test:ci
npm run lf:ci
npm run typecheck
npm run build
```

| Script | Purpose |
| --- | --- |
| `test:ci` | Vitest — unit and integration tests |
| `lf:ci` | ESLint + Prettier check |
| `typecheck` | TypeScript |
| `build` | Emit `dist/` |

CI workflow: `.github/workflows/ci.yml` in the engine repo (runs on push when published).

## MCP docs site

```bash
npm run mcp-docs:build
```

Built output: `dist/mcp-docs/` (deployed via `npm run build:deploy` on the server).

## Changelog

<Changelog
  title="Quality Changelog"
  :entries="[
    { version: 'v0.3', date: '2026-07-20', summary: 'Quality procedures under internals/.' },
  ]"
/>

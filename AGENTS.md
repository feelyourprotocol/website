# Agent notes

Short entrypoint for coding agents in this monorepo.

## Docs map

| Task | Read first |
| --- | --- |
| Add or change an exploration | `website-docs/contributing/adding-an-exploration.md` |
| E-Components, styling, conventions | `website-docs/` (see `website-docs/public/llms.txt` for index) |
| MCP server docs | `mcp-docs/README.md` — not `website-docs/` |
| Roadmap site | `roadmap/README.md` — internal, maintainer-facing |
| Community token site | `community-token/README.md` — internal, maintainer-facing |
| Docs hub landing | `docs-hub/README.md` |

**Website docs** (`website-docs/`) document **only** the explorations website. Other sites keep dev notes in their own README.

## Cursor rules

Rules live in [`.cursor/rules/`](.cursor/rules/) — catalog in [`repo-structure.mdc`](.cursor/rules/repo-structure.mdc). Primitives: `repo-structure.mdc`, `quality.mdc`, `testing.mdc`. Specialized: `video-recording.mdc`, `og-images.mdc`.

## Habits

- Run `npm run dev` while iterating on explorations; `npm run lf:ci` before finishing code changes.
- Do not commit unless asked.
- Root [README.md](README.md) lists all npm scripts for maintainers; prefer scoped commands when working on one site.

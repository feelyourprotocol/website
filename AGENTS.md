# Agent notes

Tool-agnostic entrypoint for coding agents (Cursor, Claude Code, Codex, etc.) in this monorepo.

**Read this file first.** Then load the task skill if one exists.

**website-docs** are the human conceptual guide — taxonomies, how to brief and review, structural rules. **Skills** are the executable path for implementation. Canonical field names and CSS live in **source** (`REGISTRY.ts`, `types.ts`, `main.css`) — do not duplicate catalogs into prompts.

## Docs map

| Task | Read first |
| --- | --- |
| **Create or change an exploration** | [`.cursor/skills/add-exploration/SKILL.md`](.cursor/skills/add-exploration/SKILL.md) → [adding-an-exploration.md](website-docs/contributing/adding-an-exploration.md) |
| **Generate cover art** | [`.cursor/skills/cover-image/SKILL.md`](.cursor/skills/cover-image/SKILL.md) → [images.md](website-docs/contributing/images.md) |
| E-Components, styling, conventions | [website-docs/](website-docs/) (index: [llms.txt](website-docs/public/llms.txt)) |
| MCP server docs | [mcp-docs/README.md](mcp-docs/README.md) — not `website-docs/` |
| Roadmap site | [roadmap/README.md](roadmap/README.md) — internal, maintainer-facing |
| Community token site | [community-token/README.md](community-token/README.md) — internal, maintainer-facing |
| Docs hub landing | [docs-hub/README.md](docs-hub/README.md) |

**Website docs** (`website-docs/`) document **only** the explorations website. Other sites keep dev notes in their own README.

## Create an exploration

Most new explorations are **agent-scaffolded** with a short human review pass (pedagogy, spec accuracy, examples).

1. Load [add-exploration skill](.cursor/skills/add-exploration/SKILL.md)
2. Follow [adding-an-exploration.md](website-docs/contributing/adding-an-exploration.md) for field reference and checklist
3. Read taxonomies from source (`TOPICS.ts`, `TIMELINE.ts`, `TAGS.ts`) — do not guess IDs
4. **Stop before claiming done** — human must review intro, usage, and examples even when tests pass

MCP server endpoint generation is **out of scope** for the add-exploration skill (separate workflow later).

## Rules and skills

| Layer | Location | Role |
| --- | --- | --- |
| **Rules** | [`.cursor/rules/`](.cursor/rules/) | Short invariants (always-on or glob-scoped) |
| **Skills** | [`.cursor/skills/`](.cursor/skills/) | Ordered task playbooks |

Catalog: [`repo-structure.mdc`](.cursor/rules/repo-structure.mdc).

- **Primitives (always-on):** `repo-structure.mdc`, `quality.mdc`, `testing.mdc`
- **Task invariants (glob):** `explorations.mdc` when editing `src/explorations/` or `src/eComponents/`
- **Specialized:** `video-recording.mdc`, `og-images.mdc`

If your tool supports attaching folders (e.g. `@website-docs/`), include the relevant doc pages — but AGENTS.md + skill + source remain authoritative.

## Habits

- Run `npm run dev` while iterating on explorations; `npm run lf:ci` before finishing code changes.
- Do not commit unless asked.
- Root [README.md](README.md) lists all npm scripts for maintainers; prefer scoped commands when working on one site.

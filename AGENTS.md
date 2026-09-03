# Agent notes

Tool-agnostic entrypoint for coding agents (Cursor, Claude Code, Codex, etc.) in this monorepo.

**Read this file first.** Then load the task skill if one exists.

**website-docs** are the human conceptual guide — taxonomies, how to brief and review, structural rules. **Skills** are the executable path for implementation. Canonical field names and CSS live in **source** (`REGISTRY.ts`, `types.ts`, `main.css`) — do not duplicate catalogs into prompts.

## Docs map

| Task | Read first |
| --- | --- |
| **Full round-trip** (EIP → exploration → MCP → optional comic) | [`.cursor/skills/round-trip-protocol-change/SKILL.md`](.cursor/skills/round-trip-protocol-change/SKILL.md) |
| **Brief a protocol change** (round-trip phase 1) | [`.cursor/skills/brief-protocol-change/SKILL.md`](.cursor/skills/brief-protocol-change/SKILL.md) |
| **Create or change an exploration** (round-trip phase 2) | [`.cursor/skills/add-exploration/SKILL.md`](.cursor/skills/add-exploration/SKILL.md) → [adding-an-exploration.md](website-docs/contributing/adding-an-exploration.md) |
| **Generate cover art** | [`.cursor/skills/cover-image/SKILL.md`](.cursor/skills/cover-image/SKILL.md) → [images.md](website-docs/contributing/images.md) |
| **Bro & Bruh comic** (round-trip phase 4) | [`.cursor/skills/bro-bruh-comic/SKILL.md`](.cursor/skills/bro-bruh-comic/SKILL.md) → [`design/comics/`](design/comics/) |
| E-Components, styling, conventions | [website-docs/](website-docs/) (index: [llms.txt](website-docs/public/llms.txt)) |
| MCP server docs | [mcp-docs/README.md](mcp-docs/README.md) — not `website-docs/` |
| MCP EIP catalogue (human) | `https://mcp-docs.feelyourprotocol.org/use/eips/eip-NNNN.html` — one page per **live** exploration, Runnable or Planned (e.g. [EIP-8024](https://mcp-docs.feelyourprotocol.org/use/eips/eip-8024.html)) |
| Roadmap site | [roadmap/README.md](roadmap/README.md) — internal, maintainer-facing |
| Community token site | [community-token/README.md](community-token/README.md) — internal, maintainer-facing |
| Docs hub landing | [docs-hub/README.md](docs-hub/README.md) |

**Website docs** (`website-docs/`) document **only** the explorations website. Other sites keep dev notes in their own README.

## Create an exploration

Default path for a **new protocol change** is the [round-trip skill](.cursor/skills/round-trip-protocol-change/SKILL.md). Human work is high-level triggers; do not ask for mid-phase micro-approvals.

| Phase | Human trigger | Agent |
| --- | --- | --- |
| **1 — Brief** | “Round-trip for EIP-xxxx” | [brief-protocol-change](.cursor/skills/brief-protocol-change/SKILL.md) — EIP report, suitability, who/why, taxonomy (topic / timeline / tags + reasoning), exploration idea, MCP outline — then **stop** |
| **2 — Exploration** | GO | [add-exploration](.cursor/skills/add-exploration/SKILL.md) — design with care, then implement; tests; cover; home Latest — then **stop** |
| **3 — MCP** | GO (optional hints from the widget) | Engine [add-mcp-module](https://github.com/feelyourprotocol/mcp-execution-engine/blob/main/.cursor/skills/add-mcp-module/SKILL.md) — module and/or catalogue page; tests; MCP report — then **ask** whether to generate the comic |
| **4 — Comic** | Yes on that ask (skippable) | [bro-bruh-comic](.cursor/skills/bro-bruh-comic/SKILL.md) — strip + `design/comics/eip-NNNN.yml` |

Standalone widget work (no round-trip) still briefs first, then add-exploration. Read taxonomies from source (`TOPICS.ts`, `TIMELINE.ts`, `TAGS.ts`) — do not guess IDs. Tests passing is the quality bar, not the pedagogy bar — human reviews intro, usage, and examples.

Website explorations and MCP are **twins** (same core question). Every **live** exploration needs `mcp-docs/use/eips/eip-NNNN.html` (Runnable or Planned); engine modules ship when a verb can run the change. A future website “See associated MCP docs” icon links to `/use/eips/<id>` when that page exists.

Field reference and human checklist: [adding-an-exploration.md](website-docs/contributing/adding-an-exploration.md).

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

---
name: add-exploration
description: >-
  Scaffold a new Feel Your Protocol exploration (EIP, ERC, or research widget):
  folder, info.ts, MyC.vue, examples, tests, REGISTRY entry. Use when the user
  asks to add, create, or implement an exploration or protocol widget on the
  explorations website.
---

# Add an exploration

Executable playbook for the **explorations website** only (`src/explorations/`). Canonical field reference: [adding-an-exploration.md](../../website-docs/contributing/adding-an-exploration.md). Do not paste that page into context — read it and the source files listed below.

Repo boundaries: [AGENTS.md](../../AGENTS.md), [repo-structure.mdc](../rules/repo-structure.mdc).

## Before coding

1. Read the EIP/ERC spec (or research note) the user pointed at.
2. Read taxonomies from source — **do not guess**:
   - `src/explorations/TOPICS.ts`
   - `src/explorations/TIMELINE.ts`
   - `src/explorations/TAGS.ts`
3. Skim [architecture.md](../../website-docs/guide/architecture.md) for the content model.

## Choose a building block

In order:

1. [available-e-components.md](../../website-docs/contributing/available-e-components.md) — wire config + examples + execution (often &lt;30 lines in `MyC.vue`).
2. E-Component + slots/companion components — see [adding-an-exploration.md § extending](../../website-docs/contributing/adding-an-exploration.md#extending-when-the-core-e-component-is-not-enough).
3. Custom widget with `ExplorationC` + shared UI — [ui-components.md](../../website-docs/contributing/ui-components.md), [styling.md](../../website-docs/contributing/styling.md).

Reference explorations by pattern:

| Pattern | Folder |
| --- | --- |
| Precompile | `src/explorations/eip-7951/` |
| Bytecode stepper + companion panel | `src/explorations/eip-8024/` |
| Custom / scenario-driven | `src/explorations/eip-7928/` |

## Implementation steps

Follow [adding-an-exploration.md](../../website-docs/contributing/adding-an-exploration.md) **steps 1–7** in order:

1. Create `src/explorations/<id>/`
2. `info.ts` — metadata, `seoDescription`, taxonomies from source files
3. `examples.ts`
4. `MyC.vue` (+ `config.ts` if E-Component-backed)
5. Register in `src/explorations/REGISTRY.ts`
6. Dependencies — prefer existing `package.json` entries; new runtime deps need **explicit human ask** ([third-party-libraries.md](../../website-docs/contributing/third-party-libraries.md))
7. `tests.spec.ts` — see step 7 in the doc

Run `npm run dev` and keep it running; verify the exploration route in the browser after each major step.

## Invariants (also in explorations.mdc)

- **No hardcoded Tailwind colors** — use `e-text`, `e-result-box`, and other `e-*` classes ([styling.md](../../website-docs/contributing/styling.md)).
- **Libraries only in the exploration folder** — not in E-Components or shared UI.
- **Companion UI inside E-Component slots** — provide/inject needs descendants; no sibling panels next to the E-Component root.
- **Register in REGISTRY.ts** — exploration is invisible until imported.
- **Verify components exist** — search the codebase before using unfamiliar names/props.

## Finish gates

Before reporting implementation complete:

```bash
npm run lf:ci
npm run type-check
npx vitest run src/explorations/<id>/
```

Apply [quality.mdc](../rules/quality.mdc) and [testing.mdc](../rules/testing.mdc).

## Human review gate (mandatory)

**Do not treat green tests as “done”.** Stop and ask the human to review:

- **Pedagogy** — does the widget help understand the protocol change?
- **introText / usageText** — accurate vs the spec?
- **Examples** — meaningful inputs, not only `0x00` / `0xff`?
- **Visual pass** — spacing, overflow, topic colors in the browser

Only proceed to OG image generation or PR prep after human sign-off on copy and UX.

## Optional follow-ups (not required for v1)

- **OG image:** `npm run generate:og:exploration -- <id>` per [og-images.mdc](../rules/og-images.mdc) — never substitute ad-hoc image generation for the OG pipeline.
- **Cover art:** [images.md](../../website-docs/contributing/images.md)

## Out of scope

- MCP server tool/endpoint generation (separate skill later)
- Edits to roadmap, community-token, mcp-docs, or docs-hub sites
- New E-Components (unless explicitly requested — see [e-components.md](../../website-docs/contributing/e-components.md))

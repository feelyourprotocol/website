---
name: add-exploration
description: >-
  Scaffold a new Feel Your Protocol exploration (EIP, ERC, or research widget):
  folder, info.ts, MyC.vue, examples, tests, REGISTRY entry. Use when the user
  asks to add, create, or implement an exploration or protocol widget on the
  explorations website.
---

# Add an exploration

Executable playbook for the **explorations website** only (`src/explorations/`).

**Concepts** (taxonomies, reuse, human review): [architecture.md](../../website-docs/guide/architecture.md), [e-components.md](../../website-docs/contributing/e-components.md), [adding-an-exploration.md](../../website-docs/contributing/adding-an-exploration.md).

**Lookups** (field names, types, CSS): source files below — do not guess IDs or re-list CSS tables in chat.

Repo boundaries: [AGENTS.md](../../AGENTS.md), [repo-structure.mdc](../rules/repo-structure.mdc).

## Before coding

1. Read the EIP/ERC spec (or research note) the user pointed at.
2. Read taxonomies from source — **do not guess**:
   - `src/explorations/TOPICS.ts`
   - `src/explorations/TIMELINE.ts`
   - `src/explorations/TAGS.ts`
3. Field reference: JSDoc on `Exploration` in `src/explorations/REGISTRY.ts`.

## Choose a building block

In order:

1. [available-e-components.md](../../website-docs/contributing/available-e-components.md) + reference folder — wire config + examples + execution.
2. E-Component + slots/companion components — [e-components.md § extension points](../../website-docs/contributing/e-components.md#extension-points).
3. Custom widget with `ExplorationC` + shared UI — [ui-components.md](../../website-docs/contributing/ui-components.md).

Reference explorations by pattern:

| Pattern | Folder | Config types |
| --- | --- | --- |
| Precompile | `src/explorations/eip-7951/` | `src/eComponents/precompileInterfaceEC/types.ts` |
| Bytecode stepper + companion | `src/explorations/eip-8024/` | `src/eComponents/bytecodeStepperEC/types.ts` |
| Custom / scenario-driven | `src/explorations/eip-7928/` | — |

Copy the closest folder; adapt `info.ts`, `examples.ts`, `MyC.vue`, and `config.ts` as needed.

## Implementation steps

1. Create `src/explorations/<id>/`
2. `info.ts` — metadata, `seoDescription`, taxonomies from source files
3. `examples.ts`
4. `MyC.vue` (+ `config.ts` if E-Component-backed)
5. Register in `src/explorations/REGISTRY.ts`
6. Dependencies — prefer existing `package.json` entries; new runtime deps need **explicit human ask** ([third-party-libraries.md](../../website-docs/contributing/third-party-libraries.md))
7. `tests.spec.ts` — metadata, examples, config sanity

Run `npm run dev` and verify the exploration route in the browser after each major step.

## Invariants (also in explorations.mdc)

- **No hardcoded Tailwind colors** — use `e-*` classes from `src/main.css`; do not invent color utilities.
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

Only proceed to OG image generation, cover art, or PR prep after human sign-off on copy and UX.

## Optional follow-ups (not required for v1)

- **OG image:** `npm run generate:og:exploration -- <id>` per [og-images.mdc](../rules/og-images.mdc) — never substitute ad-hoc image generation for the OG pipeline.
- **Cover art:** [cover-image skill](../cover-image/SKILL.md) after human review — separate from OG.

## Out of scope

- MCP server tool/endpoint generation (separate skill later)
- Edits to roadmap, community-token, mcp-docs, or docs-hub sites
- New E-Components (unless explicitly requested — see [e-components.md](../../website-docs/contributing/e-components.md))

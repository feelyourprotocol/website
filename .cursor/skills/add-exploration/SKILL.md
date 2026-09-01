---
name: add-exploration
description: >-
  Design and implement a Feel Your Protocol exploration (EIP, ERC, or research
  widget) in one go: canonical.ts, info, widget, examples, tests, REGISTRY.
  Use for round-trip phase 2, or when the user asks to add or implement an
  exploration after briefing sign-off.
---

# Add an exploration

Executable playbook for the **explorations website** only (`src/explorations/`). Phase 2 of the [round-trip](../round-trip-protocol-change/SKILL.md).

**Brief first:** [brief-protocol-change](../brief-protocol-change/SKILL.md) must already have a human GO (or this session *is* that GO). Signed-off core question, nature, and proposed `CANONICAL` are inputs — do not re-litigate them unless the spec contradicts the briefing.

**This phase is plan + implement in one go.** Design is not a separate human gate. Stop only on [exception gates](#exception-gates).

**Concepts:** [architecture.md](../../website-docs/guide/architecture.md), [e-components.md](../../website-docs/contributing/e-components.md), [adding-an-exploration.md](../../website-docs/contributing/adding-an-exploration.md).

**Lookups:** `canonicalTypes.ts`, `REGISTRY.ts`, `types.ts` — do not guess IDs or re-list CSS tables in chat.

Repo boundaries: [AGENTS.md](../../AGENTS.md), [repo-structure.mdc](../rules/repo-structure.mdc).

## Design (same turn, before files)

Keep this short — then code. Use the briefing’s exploration idea; tighten it against source.

1. Read the spec + the signed-off briefing (core question, nature, not-the-point, example stories).
2. Read taxonomies from source — **do not guess**:
   - `src/explorations/TOPICS.ts`
   - `src/explorations/TIMELINE.ts`
   - `src/explorations/TAGS.ts`
3. Field reference: `ProtocolChangeCanonical` in `canonicalTypes.ts`; `Exploration` in `REGISTRY.ts`.
4. Choose a building block (below). Confirm result UI matches `changeNature`.
5. Pedagogical **slice**: what the widget lets someone *feel*; what MCP will own as the superset. Do not clone a full lab into the page.
6. Examples: 2–4 stories that answer the core question (meaningful inputs, not only edge hex).

## Choose a building block

In order:

1. [available-e-components.md](../../website-docs/contributing/available-e-components.md) + reference folder — wire config + examples + execution.
2. E-Component + slots/companion components — [e-components.md § extension points](../../website-docs/contributing/e-components.md#extension-points).
3. Custom widget with `ExplorationC` + shared UI — [ui-components.md](../../website-docs/contributing/ui-components.md).

Reference explorations by pattern:

| Pattern | Folder | Config types |
| --- | --- | --- |
| Precompile (repricing) | `src/explorations/eip-7883/` | `precompileInterfaceEC/types.ts` |
| Precompile (new-capability) | `src/explorations/eip-7951/` | `precompileInterfaceEC/types.ts` |
| Bytecode stepper + companion | `src/explorations/eip-8024/` | `bytecodeStepperEC/types.ts` |
| Custom / scenario-driven | `src/explorations/eip-7928/` | — |

Copy the closest folder; adapt `canonical.ts`, `info.ts`, `examples.ts`, `MyC.vue`, and `config.ts` as needed. **Do not copy result UI across change natures.**

Do **not** create a new shared E-Component unless two explorations already share the pattern, or the human explicitly asked. Prefer slots / local companions.

## Exception gates

Stop and ask (do not improvise past these):

- New **runtime** dependency (explicit human ask)
- New **shared** E-Component (not a local companion)
- Briefing verdict no longer holds (spec cannot be taught honestly)
- Spec too underspecified for a truthful widget

## Implementation steps

1. Create `src/explorations/<id>/`
2. `canonical.ts` — `CANONICAL` per `canonicalTypes.ts` (SoT), from the signed-off proposal
3. `info.ts` — website chrome; `introText` starts with `coreQuestion` from `CANONICAL`
4. `examples.ts`
5. `MyC.vue` (+ `config.ts` if E-Component-backed)
6. Register in `src/explorations/REGISTRY.ts`
7. Dependencies — prefer existing `package.json` entries
8. `tests.spec.ts` — metadata, canonical, examples, config sanity

Run `npm run dev` and verify the exploration route in the browser after each major step.

If the briefing promised a twin, add or stub `mcp-docs/use/eips/eip-NNNN.md` in this phase when that is the ship gate for a **live** exploration (Runnable or Planned). Do **not** implement the engine module here.

## Ship gates

| Gate | Required |
| --- | --- |
| Human review | intro, usage, examples, pedagogy — after this phase’s report |
| `mcp-docs/use/eips/eip-NNNN.md` | Every **live** exploration (same PR or immediate follow-up) |
| Engine module | When `CANONICAL.mcp.shapes` includes a **shipped** verb — round-trip phase 3 |

## Invariants (also in explorations.mdc)

- **No hardcoded Tailwind colors** — use `e-*` classes from `src/main.css`
- **Libraries only in the exploration folder**
- **Companion UI inside E-Component slots**
- **Register in REGISTRY.ts**
- **New shared fields only on `canonicalTypes.ts`**

## Finish gates

```bash
npm run lf:ci
npm run type-check
npx vitest run src/explorations/<id>/
```

Apply [quality.mdc](../rules/quality.mdc) and [testing.mdc](../rules/testing.mdc).

Tests passing is the quality bar, not the pedagogy bar. The report below is the handoff; the human reviews intro, usage, and examples before MCP GO (round-trip) or before OG/PR (standalone).

## Report template — then STOP (round-trip) or wait for review (standalone)

```markdown
## Phase 2 — Exploration (eip-NNNN)

**Core question:** …
**Route:** `/…`
**Change nature / building block:** … (reference folder or custom)
**Slice:** what the widget teaches vs what MCP should own

**eComponents / UI:** reused | slotted | local companion | new shared (only if asked)
**Touched / evolved / created:** paths + one line each
**Files:** created / modified (short list)

**Tests:** `npx vitest run src/explorations/<id>/` — N specs, pass/fail
**Quality:** `lf:ci`, `type-check`
**Browser:** route checked — yes/no; notes

**Carry to MCP:** hints (bytecode vs widget, comparison forks, prompts, what not to clone)
**Open questions:** …
```

## Optional follow-ups

- **OG image:** `npm run generate:og:exploration -- <id>`
- **Cover art:** [cover-image skill](../cover-image/SKILL.md)
- **MCP module:** round-trip phase 3, or [add-mcp-module](https://github.com/feelyourprotocol/mcp-execution-engine/blob/main/.cursor/skills/add-mcp-module/SKILL.md) when a verb is ready

## Out of scope

- Engine module implementation (phase 3)
- Edits to roadmap, community-token, or docs-hub sites (mcp-docs EIP pages are a **ship gate**, not out of scope)
- New E-Components unless explicitly requested or an exception gate was approved

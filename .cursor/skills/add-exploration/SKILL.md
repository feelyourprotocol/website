---
name: add-exploration
description: >-
  Design and implement a Feel Your Protocol exploration in one go: careful UX
  design, canonical.ts, widget, tests (logic + UI), REGISTRY, home Latest, cover
  art. Use for round-trip phase 2, or after briefing sign-off.
---

# Add an exploration

Executable playbook for the **explorations website** only (`src/explorations/`). Phase 2 of the [round-trip](../round-trip-protocol-change/SKILL.md).

**Brief first:** [brief-protocol-change](../brief-protocol-change/SKILL.md) must already have a human GO (or this session *is* that GO). Signed-off core question, nature, and proposed `CANONICAL` are inputs — do not re-litigate them unless the spec contradicts the briefing.

**This phase is plan + implement in one go.** Design is not a separate human gate — but it **is** the quality of the exploration. Spend real care here before creating files. Stop only on [exception gates](#exception-gates).

**Concepts:** [architecture.md](../../website-docs/guide/architecture.md), [e-components.md](../../website-docs/contributing/e-components.md), [adding-an-exploration.md](../../website-docs/contributing/adding-an-exploration.md).

**Lookups:** `canonicalTypes.ts`, `REGISTRY.ts`, `types.ts` — do not guess IDs or re-list CSS tables in chat.

Repo boundaries: [AGENTS.md](../../AGENTS.md), [repo-structure.mdc](../rules/repo-structure.mdc).

## Design (same turn, before files)

The widget should **show and let someone feel** the core question. UX is an easy play loop: capture curiosity, invite poking around, teach without a side-knowledge wall or frustrating hurdles. If the first minute is confusing, the exploration failed — even if the spec is correct.

Do this **before creating files**. Use the signed-off briefing; tighten against source. Taxonomy (topic / timeline / tags) was proposed at briefing and confirmed at GO — do not re-pick unless the spec contradicts it.

1. Read the spec + signed-off briefing (core question, nature, not-the-point, example stories, taxonomy).
2. Confirm taxonomy IDs against source (`TOPICS.ts`, `TIMELINE.ts`, `TAGS.ts`) — do not guess.
3. Field reference: `ProtocolChangeCanonical` in `canonicalTypes.ts`; `Exploration` in `REGISTRY.ts`.
4. **Capture statement** — one sentence: after ~30 seconds of play, what did they grasp?
5. **First action** — the default example and the primary control answer the core question with **no spec reading**. Labels live on the widget, not in a footnote.
6. **Play loop** — 2–3 obvious next moves (other examples or one control). Each should confirm or surprise. No hidden “you must know X.”
7. **Honest failure** — invalid and beyond-edge inputs are teaching, not a crash or a blank panel.
8. Choose a building block (below). Result UI matches `changeNature`.
9. Pedagogical **slice**: what the widget lets someone *feel*; what MCP owns as the superset.
10. **Form factors (dedicated pass)** — mobile (single column, no horizontal overflow, usable tap targets), tablet, desktop (right-panel / companions stack or collapse). Verify these in the browser before the report.

Write 4–8 lines of design notes (capture, first action, play loop, form-factor plan) into the phase-2 report. Then code.

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
| Receipt logs + VM scenarios | `src/explorations/eip-7708/` | `receiptLogsEC/types.ts` |

Copy the closest folder; adapt `canonical.ts`, `info.ts`, `examples.ts`, `MyC.vue`, and `config.ts` as needed. **Do not copy result UI across change natures.**

Do **not** create a new shared E-Component by default — but when briefing or design identifies a **reusable logic/API + UX/UI structure** likely needed for future EIP integrations, take a focused **sub-round** first: design, implement, test, and document the new E-Component (`src/eComponents/<name>EC/`, [available-e-components.md](../../website-docs/contributing/available-e-components.md)), then return to the exploration and integrate it (tweak if real use teaches better shapes). Prefer slots / local companions when the pattern is truly one-off.

**Sub-round checklist:** typed config + neutral display types (no third-party imports in E-Component), unit tests, catalogue row, optional provide/inject for loose coupling to exploration execution.

## Exception gates

Stop and ask (do not improvise past these):

- New **runtime** dependency (explicit human ask)
- New **shared** E-Component — only when the sub-round above was skipped without human approval and the pattern is still one-off
- Briefing verdict no longer holds (spec cannot be taught honestly)
- Spec too underspecified for a truthful widget

## Tests (test-first)

Prefer tests **before** (or in the same turn as) chrome polish — lock the protocol claim first. Tests are for **logic and UI**, and they must stay usable past the happy path.

Write `tests.spec.ts` (and Vue mounts) that cover:

- Metadata, `CANONICAL`, examples, config sanity
- Execution / transform helpers — happy path **and** beyond-edge (empty, junk, out-of-range, “too big”). Must not crash; fail in a way the widget can show
- Vue: mount `MyC` (or companions); the play path is present (example picker or primary control, result region)

Also update `FEATURED_EXPLORATION_IDS` in `src/views/homeCatalog.ts` (HomeView tests import the helper — no duplicate array).

Invariants and finish commands: [testing.mdc](../rules/testing.mdc), [quality.mdc](../rules/quality.mdc).

## Implementation steps

1. Create `src/explorations/<id>/`
2. `canonical.ts` — `CANONICAL` per `canonicalTypes.ts` (SoT), from the signed-off proposal
3. `info.ts` — website chrome; `introText` starts with `coreQuestion` from `CANONICAL`; copy `coreQuestion` and `mcpDocsStatus` onto `INFO` for home preview cards
4. `examples.ts` + execution helpers — **tests for the protocol claim first** (or immediately with these files)
5. `MyC.vue` (+ `config.ts` if E-Component-backed) — then Vue mount tests
6. Register in `src/explorations/REGISTRY.ts` (nav dropdown is `Object.values(EXPLORATIONS)`)
7. **Latest on the home page:** prepend `<id>` to `FEATURED_EXPLORATION_IDS` in `src/views/homeCatalog.ts`. `latestExplorationIds()` is the first 3 — the new one is Latest; the previous third Latest drops into Catalog. Home tests import the same helper.
8. **Cover art (required):** [cover-image skill](../cover-image/SKILL.md). Round-trip default: Template B from signed-off `coreQuestion` unless the human named a subject at GO. Import `image.webp` in `info.ts`. Then `npm run generate:og:exploration -- <id>`.
9. Dependencies — prefer existing `package.json` entries
10. Finish `tests.spec.ts` per [Tests](#tests-test-first)

Run `npm run dev` and verify the exploration route **and** home Latest cards. Do the form-factor pass (mobile / tablet / desktop) before the report.

If the briefing promised a twin, add or stub `mcp-docs/use/eips/eip-NNNN.md` in this phase when that is the ship gate for a **live** exploration (Runnable or Planned). Do **not** implement the engine module here.

## Ship gates

| Gate | Required |
| --- | --- |
| Human review | intro, usage, examples, pedagogy, play loop, form factors — after this phase’s report |
| Cover art | `image.webp` + `info.ts` import — every exploration |
| Home Latest | prepended on `FEATURED_EXPLORATION_IDS` in `homeCatalog.ts` |
| `mcp-docs/use/eips/eip-NNNN.md` | Every **live** exploration (same PR or immediate follow-up) |
| Engine module | When `CANONICAL.mcp.shapes` includes a **shipped** verb — round-trip phase 3 |

## Invariants (also in explorations.mdc)

- **No hardcoded Tailwind colors** — use `e-*` classes from `src/main.css`
- **Libraries only in the exploration folder**
- **Companion UI inside E-Component slots**
- **Register in REGISTRY.ts** (nav)
- **Cover art** — `image.webp` on every exploration
- **New shared fields only on `canonicalTypes.ts`**

## Finish gates

```bash
npm run lf:ci
npm run type-check
npx vitest run src/explorations/<id>/
```

Apply [quality.mdc](../rules/quality.mdc) and [testing.mdc](../rules/testing.mdc).

Tests passing is the quality bar, not the pedagogy bar. The report below is the handoff; the human reviews intro, usage, examples, play loop, and form factors before MCP GO (round-trip) or before OG/PR (standalone).

## Report template — then STOP (round-trip) or wait for review (standalone)

```markdown
## Phase 2 — Exploration (eip-NNNN)

**Core question:** …
**Capture / first action / play loop:** …
**Route:** `/…`
**Change nature / building block:** … (reference folder or custom)
**Slice:** what the widget teaches vs what MCP should own

**eComponents / UI:** reused | slotted | local companion | new shared (only if asked)
**Touched / evolved / created:** paths + one line each
**Files:** created / modified (short list)
**Latest:** prepended to `FEATURED_EXPLORATION_IDS` — dropped from Latest trio: …
**Cover:** `image.webp` — Template A/B — shown in context

**Tests:** `npx vitest run src/explorations/<id>/` — N specs, pass/fail (logic + UI + beyond-edge)
**Quality:** `lf:ci`, `type-check`
**Browser:** route + home Latest; mobile / tablet / desktop — notes

**Carry to MCP:** hints (bytecode vs widget, comparison forks, prompts, what not to clone)
**Open questions:** …
```

## Follow-ups

- **MCP module:** round-trip phase 3, or [add-mcp-module](https://github.com/feelyourprotocol/mcp-execution-engine/blob/main/.cursor/skills/add-mcp-module/SKILL.md) when a verb is ready
- **Bro & Bruh comic:** round-trip phase 4 ([bro-bruh-comic](../bro-bruh-comic/SKILL.md)) — after MCP, on a separate yes
- Cover and OG are **in this phase**, not follow-ups

## Out of scope

- Engine module implementation (phase 3)
- Bro & Bruh comic (phase 4)
- Edits to roadmap, community-token, or docs-hub sites (mcp-docs EIP pages are a **ship gate**, not out of scope)
- New E-Components unless the briefing/design sub-round applies, the human explicitly asked, or an exception gate was approved

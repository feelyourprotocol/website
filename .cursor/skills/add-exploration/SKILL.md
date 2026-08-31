---
name: add-exploration
description: >-
  Scaffold a new Feel Your Protocol exploration (EIP, ERC, or research widget):
  folder, canonical.ts, info.ts, MyC.vue, examples, tests, REGISTRY entry. Use when the user
  asks to add, create, or implement an exploration or protocol widget on the
  explorations website.
---

# Add an exploration

Executable playbook for the **explorations website** only (`src/explorations/`).

**Brief first:** [brief-protocol-change skill](../brief-protocol-change/SKILL.md) → answers in `canonical.ts`.

**Concepts:** [architecture.md](../../website-docs/guide/architecture.md), [e-components.md](../../website-docs/contributing/e-components.md), [adding-an-exploration.md](../../website-docs/contributing/adding-an-exploration.md).

**Lookups:** `canonicalTypes.ts`, `REGISTRY.ts`, `types.ts` — do not guess IDs or re-list CSS tables in chat.

Repo boundaries: [AGENTS.md](../../AGENTS.md), [repo-structure.mdc](../rules/repo-structure.mdc).

## Before coding

1. Read the EIP/ERC spec (or research note) the user pointed at.
2. Complete briefing — write `canonical.ts` before `info.ts`.
3. Read taxonomies from source — **do not guess**:
   - `src/explorations/TOPICS.ts`
   - `src/explorations/TIMELINE.ts`
   - `src/explorations/TAGS.ts`
4. Field reference: `ProtocolChangeCanonical` in `src/explorations/canonicalTypes.ts`; `Exploration` in `REGISTRY.ts`.

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

## Implementation steps

1. Create `src/explorations/<id>/`
2. `canonical.ts` — `CANONICAL` per `canonicalTypes.ts` (SoT)
3. `info.ts` — website chrome; `introText` starts with `coreQuestion` from `CANONICAL`
4. `examples.ts`
5. `MyC.vue` (+ `config.ts` if E-Component-backed)
6. Register in `src/explorations/REGISTRY.ts`
7. Dependencies — prefer existing `package.json` entries; new runtime deps need **explicit human ask**
8. `tests.spec.ts` — metadata, canonical, examples, config sanity

Run `npm run dev` and verify the exploration route in the browser after each major step.

## Ship gates

| Gate | Required |
| --- | --- |
| Human review | intro, usage, examples, pedagogy |
| `mcp-docs/use/eips/eip-NNNN.md` | Every **live** exploration (same PR or immediate follow-up) |
| Engine module | When `CANONICAL.mcp.shapes` includes a **shipped** verb |

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

## Human review gate (mandatory)

**Do not treat green tests as “done”.** Stop and ask the human to review pedagogy, copy, examples, visual pass.

## Optional follow-ups

- **OG image:** `npm run generate:og:exploration -- <id>`
- **Cover art:** [cover-image skill](../cover-image/SKILL.md)
- **MCP module:** [add-mcp-module skill](https://github.com/feelyourprotocol/mcp-execution-engine/blob/main/.cursor/skills/add-mcp-module/SKILL.md) when verb is ready

## Out of scope

- Edits to roadmap, community-token, or docs-hub sites (mcp-docs EIP pages are a **ship gate**, not out of scope)
- New E-Components unless explicitly requested

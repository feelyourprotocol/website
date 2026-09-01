---
name: brief-protocol-change
description: >-
  Brief a Feel Your Protocol protocol change (EIP, ERC, research) before
  scaffolding. Produces an EIP report, suitability verdict, who/why, exploration
  idea, and MCP outline. Use for round-trip phase 1, choosing what to build
  next, or starting an exploration or MCP twin.
---

# Brief a protocol change

Phase 1 of the [round-trip](../round-trip-protocol-change/SKILL.md). Also run standalone before [add-exploration](../add-exploration/SKILL.md) or engine [add-mcp-module](https://github.com/feelyourprotocol/mcp-execution-engine/blob/main/.cursor/skills/add-mcp-module/SKILL.md).

**This phase is a report.** Propose `CANONICAL` in chat. Do **not** create the exploration folder, widget, or engine module until the human GOs.

Answers later land in `src/explorations/eip-NNNN/canonical.ts` — not only in chat. Schema: [`canonicalTypes.ts`](../../src/explorations/canonicalTypes.ts).

Read the spec (EIP/ERC/research note). Skim one close existing exploration so the idea is comparative, not generic.

## Who (name at least one; curiosity is enough)

1. **Who cares — and why?** Blocked builder, excited protocol-watcher, researcher shaping a draft, or a mix. Do not force a “who is blocked” story.
2. **What would they ask an agent to understand?** And (if relevant) what would they run with *their* data? Include play/understand prompts, not only production cases. These become MCP docs page prompts.

## Nature

Read `ChangeNature` in `canonicalTypes.ts`.

3. **Primary change nature?** Drives widget center and MCP summary.
4. **What is *not* the point?** (Avoid copying the wrong sibling UI — e.g. gas compare for a new-capability precompile.)

## Question worth centering

5. **Core question** — one sentence. Becomes bold `introText` lead and MCP page “what became possible.”
6. Worth centering if **any** of: changes what someone can do or must pay; surprising invariant prevents a mistake; distinctive new/research piece people want to *feel*; further-out work can feed spec or tests.

## Shape / twin (no orphan explorations)

7. **Query shape:** `simulate` · `generate` · (future) other verb.
8. **MCP docs page:** Can we honestly explain how MCP addresses this problem set *today* or with a **named planned verb**? If neither — do not add the exploration (or sunset it).

## Suitability

Verdict for Feel Your Protocol — not “is the EIP important.”

| Fit | When |
| --- | --- |
| **GO** | Honest slice we can *feel* in a widget; MCP twin (runnable or planned) is nameable |
| **GO with caveats** | Fit, but call out widget limits, draft instability, or “planned-module only” |
| **Not a fit** | No teachable slice, no honest MCP story, or the work is app-layer / Solidity-only |

Caveats the human must see: underspecified mechanics, no existing E-Component (custom or new shared pattern), needs a new runtime dep, engine cannot run it yet.

## High-level ideas (not an implementation plan)

**Exploration** — widget center (what the user *does*), likely building block (see add-exploration reference table), pedagogical slice vs what we leave to MCP, 2–3 example stories.

**MCP** — shipped verb vs `planned-module`; what the agent constructs (bytecode, overrides); what we will **not** put in the catalog (no widget demo programs); comparison forks if useful.

## Ship gates (for later phases)

| Artifact | Required when |
| --- | --- |
| `canonical.ts` | Every exploration (written in phase 2) |
| Website exploration | First-round feeling |
| `mcp-docs/use/eips/eip-NNNN.md` | Every **live** exploration (Runnable or Planned) |
| Engine module | When a shipped verb can actually run the change |

## Report template — then STOP

```markdown
## Phase 1 — Briefing (EIP-NNNN)

**Spec:** …
**Status / fork:** …
**One-paragraph EIP:** what changed, in protocol terms

**Suitability:** GO | GO with caveats | not a fit
**Caveats:** …

**Who / why:** …
**What they would ask:** 2–4 prompts (play + understand, not only production)

**Change nature:** …  |  **Not the point:** …
**Core question:** …

**Exploration idea:** widget center, building block, slice, example stories
**MCP outline:** shape(s), runnable vs planned-module, comparison, catalog vs tests

**Proposed CANONICAL:** (TypeScript object matching `ProtocolChangeCanonical`)

**Verdict:** GO for exploration | wait for X | stop (not a fit)
```

Do not start [add-exploration](../add-exploration/SKILL.md) until the human GOs. If this briefing is **not** part of a round-trip, still stop for sign-off on core question and audience before widget or MCP work.

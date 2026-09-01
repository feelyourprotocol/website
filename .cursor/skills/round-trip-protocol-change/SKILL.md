---
name: round-trip-protocol-change
description: >-
  Orchestrates the full Feel Your Protocol round-trip for a protocol change
  (EIP, ERC, or research): brief, exploration, then MCP twin. Use when the user
  asks to do the round-trip for an EIP, add an exploration plus MCP integration,
  or integrate a protocol change end-to-end.
---

# Protocol-change round-trip

Orchestrator for a **full integration**. Implementation lives in subskills — this file is the phase map, the hard stops, and the report contracts.

**Human work:** 2–4 high-level triggers (start, briefing GO, exploration GO, optional hints). Do not ask for mid-phase micro-approvals.

| Phase | Subskill | Then **STOP** until human |
| --- | --- | --- |
| **1 — Brief** | [brief-protocol-change](../brief-protocol-change/SKILL.md) | Explicit **GO** for the exploration |
| **2 — Exploration** | [add-exploration](../add-exploration/SKILL.md) | Explicit **GO** for MCP (optional hints from the widget) |
| **3 — MCP** | [add-mcp-module](https://github.com/feelyourprotocol/mcp-execution-engine/blob/main/.cursor/skills/add-mcp-module/SKILL.md) | Done (PR is an optional follow-up) |

Local engine checkout (sibling of `website/`): `../mcp-execution-engine/.cursor/skills/add-mcp-module/SKILL.md`.

## Workflow gates (mandatory)

This is a **multi-phase workflow with hard stops**. After each phase, **stop completely** — do not start the next phase in the same turn, even if the user said “let’s go” at the outset. “Let’s do the round-trip for EIP-xxxx” means **begin phase 1**. Later “go” / “yes” / “ship it” means **begin the next phase only**.

- Do **not** skip briefing.
- Do **not** start MCP work during the exploration phase (planned `mcp-docs` page in the same exploration PR is allowed when the briefing already committed to a twin).
- Do **not** treat green tests as a waiver of the human GO.
- Do **not** commit, push, or open a PR unless asked.
- Cover art and OG cards are **part of phase 2** (every exploration), not a later optional skill. PR remains optional.

**Exception stops** (ask, then wait) — new runtime dependency, new shared E-Component, briefing verdict flips to unfit, spec too underspecified to teach honestly.

---

## Trigger

Human names the change, typically:

- “Let’s do the round-trip for EIP-xxxx”
- “Add EIP-xxxx end-to-end (exploration + MCP)”

Confirm the id (`eip-NNNN`) once, then run phase 1. Spec fetch lives in the briefing skill ([ethereum/EIPs](https://github.com/ethereum/EIPs) `master`, plus `discussions-to` and `ethereum/pm` issues) — do not brief from memory.

---

## Phase 1 — Brief

Load and follow [brief-protocol-change](../brief-protocol-change/SKILL.md).

**Agent does:** EIP report, suitability, who/why, taxonomy suggestions (topic / timeline / tags + reasoning), exploration idea, MCP outline. Propose `CANONICAL` in the report — **do not** scaffold the exploration folder yet.

**Output:** the briefing report template from that skill — then **STOP**.

If the verdict is **not a fit**, stop the round-trip. Do not proceed to phase 2.

---

## Phase 2 — Exploration

Only after explicit GO.

Load and follow [add-exploration](../add-exploration/SKILL.md). **Plan and implement in one go** (design is not a separate human gate).

**Agent does:** write `canonical.ts` from the signed-off briefing, widget, tests (logic + UI, including beyond-edge), cover art, home Latest, quality gates. Close with the exploration report from that skill.

**Output:** working exploration + report — then **STOP** for MCP GO.

The human may add MCP hints here (what the widget made obvious, what the engine should *not* clone). Fold those into phase 3.

---

## Phase 3 — MCP

Only after explicit GO. Website `CANONICAL` is the source of truth.

Load and follow [add-mcp-module](https://github.com/feelyourprotocol/mcp-execution-engine/blob/main/.cursor/skills/add-mcp-module/SKILL.md).

**Agent does:** engine module and/or catalogue page per `docsStatus` and shipped verbs; tests; quality gates. Close with the MCP report from that skill.

**Output:** MCP twin in the state the briefing promised (runnable module or planned-module page) — round-trip complete.

---

## What “done” means

| Layer | Done when |
| --- | --- |
| Briefing | Human signed off core question, audience, suitability, taxonomy |
| Exploration | Route + home Latest work; cover art; tests + `lf:ci` / typecheck; pedagogy + form-factor report |
| MCP | Catalogue page exists for every **live** exploration; engine module only if a shipped verb can run the change |

PR is **out of this round-trip** unless the human asks.

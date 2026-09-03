---
name: video-short
description: >-
  Generate a ~45–60 s vertical short (YouTube Shorts / Reels / X) for a
  Feel Your Protocol exploration — draft content / playbook / narration
  from `canonical.ts` (coreQuestion is the anchor), run QA, synthesize
  voice with ElevenLabs, record with Playwright, mux with ffmpeg. Use
  for round-trip phase 5, or when the user asks for a short / video for
  EIP-xxxx.
---

# Video short

Playbook for one short per exploration. Output lives in `video/projects/<id>/output/*-final.mp4`. Architecture, schemas, ElevenLabs recipe, security rules, and troubleshooting: [reference.md](reference.md).

**Round-trip:** phase 5 of [round-trip-protocol-change](../round-trip-protocol-change/SKILL.md). After the phase-4 (comic) report — or the phase-3 (MCP) report if comic was skipped — **ask** whether to generate; do not start this skill in the same turn as that report. On skip, stop. Standalone ("video for EIP-xxxx") is an implicit GO.

**Human work in this phase:** one GO. Then narration script + intermediate artefacts are shown in the final report for review; iteration is a follow-up. No mid-phase micro-approvals.

## Inputs (do not invent)

Read, then derive. Do not re-brief the EIP. Do not invent verbs, numbers, or fork names.

1. `src/explorations/<id>/canonical.ts` — `identity`, `question.coreQuestion`, `question.changeNature`, `taxonomy.topic`, `mcp.comparison` (baseline / preview fork pair)
2. `src/explorations/<id>/info.ts` — `path`, `introText`, `usageText`
3. `src/explorations/<id>/examples.ts` (+ any `exampleMeta`, `SCENARIOS`, `SCENARIO_ORDER`) — per-example `title` and `lesson`, expected outcomes
4. **Every** existing `video/projects/*/` — consumed openings, hooks, outro CTAs, pacing (look at `narration.json`, `content.json`, `playbook.json`; do not repeat their exact phrasing)
5. `video/src/explorationRegistry.ts` — must contain the exploration id (add if missing)

**Core-question rule (hard):** the title-card overlay AND the first narration segment (`hook`) both carry `CANONICAL.question.coreQuestion` — verbatim or a punchy ≤10-word paraphrase. Everything else answers it. The outro references `mcp.comparison` when present ("try baseline on Osaka to see it silent").

## Workflow

1. **Preflight** — [Preflight](#preflight-hard-gates). Bail early if any gate fails.
2. **Inventory** from prior `video/projects/*` — list consumed openings, hooks, outro CTAs.
3. **Derive** the video plan — [Derivation](#derivation). Write it in chat before drafting files.
4. **Draft the four project files** — [Project files](#project-files). Use existing project as a shape guide, not a copy target.
5. **QA Tier 1–3** — [QA gates](#qa-gates). Hard stop on any error.
6. **Cost gate (transparency only, no human GO)** — print the full narration script + estimated duration in chat before spending ElevenLabs credits. Continue in the same turn.
7. **Synthesize + plan + record + mux** — [Recording](#recording).
8. **Verify** — frame 0 is title band, audio starts at 0:00, duration is 30–90 s.
9. **Report** — [Report](#report), then **STOP**.

Do not commit, push, or open a PR unless asked. Do not upload to any platform. Do not modify existing videos.

## Preflight (hard gates)

Run in order. Each must pass before the next.

1. **Registry entry:** `video/src/explorationRegistry.ts` contains `<id>`. If missing, add `{ path: <INFO.path>, topic: <CANONICAL.taxonomy.topic> }`. Valid topic keys: `scaling | privacy | ux | security | robustness | interoperability`.
2. **Video-readiness hooks:** the exploration widget mounts `data-testid="exploration-ready"` (from `ExplorationC`), `data-testid="example-select"` (from `ExamplesUIC`), a primary-action `data-testid` (e.g. `run-block`, `bytecode-run`, `bytecode-step`), and any per-widget hooks the playbook will target (e.g. `receipts-panel`, `hardfork-toggle`, `stack`, `disassembly`). Add missing hooks in the exploration — do not paper over selectors in the playbook.
3. **Video-readiness spec:** `src/explorations/<id>/videoReady.spec.ts` exists and passes. If missing, create it — mount `MyC` with `?fyp-video=1&example=<default>`, assert every hook the playbook depends on, plus `?example=<other>` deep-link. Pattern in [`eip-7708/videoReady.spec.ts`](../../src/explorations/eip-7708/videoReady.spec.ts).
4. **Chromium ready:** `npm run video:preflight` with `required_permissions: ["all"]`. Statuses: `ready` → proceed; `needs_agent_permissions` → re-run with `["all"]`; `needs_human_setup` → **stop**, ask the human to run `npm run og:check` locally (never run `og:setup` / `video:setup` / `playwright install` yourself, see [`.cursor/rules/video-recording.mdc`](../../.cursor/rules/video-recording.mdc)).
5. **ElevenLabs key present** without echoing it: run a non-printing check — `cd video && node -e "process.exit(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID ? 0 : 1)"` after loading `.env` via the CLI. If unset, **stop** and tell the human to copy `video/.env.example` → `video/.env` and add their key. **Never `Read` or `cat video/.env`, never print the key value, never pass it as a CLI flag.** See [reference.md § Security](reference.md#security).

## Derivation

Do **not** copy title-card wording, hook lines, or outro CTAs from prior videos. They teach the *shape*, not the words.

1. **Anchor** = `CANONICAL.question.coreQuestion`. Title-card carries it (or a ≤10-word punchy paraphrase); first narration `hook` segment carries the same anchor.
2. **Arc** (≈45–60 s):
   - `hook` — anchor + fork context (`CANONICAL.maturity.forkInclusion` when present)
   - `context` — 1 sentence: what problem, why now
   - one beat per **teaching example** from `examples.ts` (usually 2–4 beats) — read `exampleMeta[id].lesson` (or `SCENARIOS[id].lesson`); each beat ends by running the primary action so the viewer sees the effect
   - `climax` — the beat that makes the anchor visible (e.g. the transfer log row appearing, the stack copying depth 17); use `highlightSet` if the widget exposes cell-level `data-*` hooks
   - `recap` — text-only on the current state; tie back to the anchor
   - `outro` — one-line closing + 2 CTAs (Forkcast for the spec, `feelyourprotocol.org<INFO.path>` for the exploration)
3. **Comparison beat** — if `CANONICAL.mcp.comparison` is set, the outro or recap must acknowledge it ("run the same on `<baseline>` to see it silent").
4. **Do not** invent numbers, verbs, or fork names not present in `canonical.ts` / `examples.ts`. If a scenario has `expectedTransferLogsOnAmsterdam: 1`, the narration says "one Transfer log", not "a transfer log or two".
5. **Diversity check** — scan prior `narration.json` `hook` and `outro` segments. If your draft repeats a stock phrase ("Read the EIP on Forkcast. Explore it on Feel Your Protocol."), reword. The URL and platform names can repeat; the framing cannot.

## Project files

Layout under `video/projects/<id>/` — mirror [`video/projects/eip-8024/`](../../video/projects/eip-8024/):

| File | What it holds | Anchoring rule |
| --- | --- | --- |
| `content.json` | `overlays` (title-card, punch, split, list-flash, outro-card), `annotations`, `highlightSets`, `meta` | title-card = anchor; per-example overlays = `exampleMeta[<id>].lesson` compressed |
| `playbook.json` | Ordered `steps`: `beat`, `overlay`, `annotate`, `placement`, `focus`, `cue`, `wait`, `selectExample`, `step`, `expandCompanion`, `click`, climax fields | one step per beat from the arc; `defaultExample` = `DEFAULT_SCENARIO_ID` (or the exploration's default) |
| `zones.json` | `format: { width: 540, height: 960 }`, `safeZone`, `focusAreas`, `placements` | `focusAreas` keys = every `focus` used in the playbook |
| `narration.json` | `segmentGapMs` (~350) + `segments[{ beat, text }]` | `hook.text` = anchor; last segment references the CTA on-screen |

Schemas + overlay type details: [reference.md § Schemas](reference.md#schemas). Overlay layout / safe zone: [reference.md § Overlays](reference.md#overlays-and-safe-zones).

**Do not create a `README.md` under `video/projects/<id>/` unless asked.** The README stays optional.

## QA gates

Run in order. Any error stops the phase.

**Tier 1 — repo suite** (must be green before drafting is called "done"):

```bash
npx vitest run src/video/ video/src/               # render layer + pipeline internals
npx vitest run src/explorations/<id>/              # exploration + videoReady spec
npm run type-check
```

**Tier 2 — pipeline validation** (JSON + timing):

```bash
npm run video:storyboard -- <id>                   # focus areas, overlay ids, ~30–90 s duration
npm run video:record -- <id> --dry-run             # playbook runs headlessly, no capture
```

Fix any `error` severity from the storyboard before Tier 3. Warnings are informative.

**Tier 3 — Chromium probe** (once): `npm run video:preflight` with `required_permissions: ["all"]`. Handle statuses per [Preflight](#preflight-hard-gates).

## Recording

Every command below runs from `website/`. All Playwright-backed commands (`video:preflight`, `video:record`, `video:generate*`) need `required_permissions: ["all"]`.

```bash
# 1. Synthesize narration (spends ElevenLabs credits; cost gate already printed the script)
npm run video:voice:synth -- <id>

# 2. Preview voice-aligned timing
npm run video:voice:plan -- <id>

# 3. Preview record (silent .webm at 540×960) — sanity-scrub against voice/full.mp3
npm run video:record -- <id> --preview

# 4. Or: one-shot final (recommended once voice + storyboard are settled)
npm run video:generate:preview -- <id>   # 540×960 *-final.mp4 with voice
npm run video:generate -- <id>           # 1080×1920 *-final.mp4 (2× upscale of same layout)
```

`video:generate*` runs `website:build` first — do not skip it manually. `.webm` intermediates are silent; muxed `*-final.mp4` is the deliverable.

**Never** run `npm run video:setup`, `og:setup`, or `playwright install` — see [`.cursor/rules/video-recording.mdc`](../../.cursor/rules/video-recording.mdc). If record fails on selectors, fix the widget or playbook, not the browser install.

## Verify

Look at (do not just assert) the final `.mp4`:

1. **Frame 0** — title band with the anchor visible. Recorder logs the trim result; expect dark-pixel ratio ~0.8, mean luminance ~40 in the center crop.
2. **Audio start** — voice begins at 0:00 (title beat) or within ~200 ms.
3. **Duration** — 30–90 s (Shorts sweet spot 45–60 s).
4. **Highlights** — if a `highlightSet` is used, the payoff cell(s) actually light up on the climax beat.

## Report

```markdown
## Phase 5 — Video short (eip-NNNN)

**Anchor (coreQuestion):** …
**Files:** `video/projects/eip-NNNN/{content,playbook,zones,narration}.json`
**Output:** `video/projects/eip-NNNN/output/<id>-<timestamp>-final.mp4`
**Duration:** ~XX s (voice), ~XX s (total)
**Beats:** hook · context · … · climax · recap · outro
**Comparison:** baseline `<fork>` ↔ preview `<fork>` (from CANONICAL.mcp.comparison) — used in <beat>

**Precondition patches applied:**
- Registered `eip-NNNN` in `video/src/explorationRegistry.ts` — `<yes|already present>`
- Added `data-testid` hooks: `<list or "none needed">`
- Created `src/explorations/eip-NNNN/videoReady.spec.ts` — `<yes|already present>`

**Narration script** (paste for review):

```
hook:    <text>
context: <text>
…
outro:   <text>
```

**QA:**
- Tier 1: `vitest src/video/ video/src/ src/explorations/eip-NNNN/` — N specs
- Tier 1: `npm run type-check`
- Tier 2: `video:storyboard` (0 errors), `video:record --dry-run` (OK)
- Tier 3: `video:preflight` — `ready`

**What to check on phone (Shorts vertical):**
- Title band visible; anchor readable in ≤2 s
- Voice sync at climax
- Outro CTAs (Forkcast, feelyourprotocol.org<INFO.path>) both legible

**Consumed for future videos:** hook openings, outro CTA phrasing
**Open:** (voice edits, timing tweaks — human can ask)
```

Then **STOP**.

## Follow-ups (out of this phase)

- Re-render at 1080×1920 — `npm run video:generate -- <id>` (2× upscale of the same layout)
- Iterate a beat — edit `narration.json` and re-run `voice:synth` + `voice:mux` (voice/segments cache by text hash so unchanged beats do not re-spend)
- Upload / caption / thumbnail — human, out of skill scope
- Root-level `**/.env` gitignore, macOS Keychain fallback in `loadEnv.ts` — see [reference.md § Security](reference.md#security)

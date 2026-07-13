# Authoring a video short

How to plan, write, and record a Feel Your Protocol vertical short (~45–60 s) from a
live exploration.

Operational commands and file layout: [Video pipeline](/contributing/video-pipeline).
Reference project: `video/projects/eip-8024/`.

---

## Goals

Each short should:

1. Show **real** exploration UI (not mockups).
2. Use the **video overlay language** (black bars, Bebas Neue / Barlow Condensed) — not site chrome.
3. Guide the viewer's eye with layered overlays without overcrowding the frame.
4. Start with a **title-card thumbnail** (frame 0 after trim).

Rendering lives in `src/video/`; copy and timing live in `video/projects/<id>/`.
Run `npm run website:build` before recording whenever overlay components change.

---

## Workflow overview

```
Plan story arc → content.json (overlays, annotations, highlights)
              → zones.json (focus areas)
              → playbook.json (beats + structure)
              → npm run video:generate   ← final *-final.mp4 (video + voice)
              → npm run video:record --no-voice   ← silent .webm only
              → verify frame 0 thumbnail + audio sync
```

Silent-only path (no voice): omit `narration.json` / `voice/` and set manual `cue`/`wait` in `playbook.json`.
See [Voice-over pipeline](/contributing/video-voice).

---

## 1. Plan the story arc

Break the video into **beats** — one playbook step each. Each beat can include:

| Phase | Playbook | Purpose |
|-------|----------|---------|
| Guide | `annotate` | Pointer on live UI (parallel through the beat) |
| Cue | `overlay` + `cue` | Story text the viewer reads before action |
| Reveal | `selectExample`, `step`, `scroll`, `expandCompanion` | Exploration action |
| Hold | `wait` | Pause after action so the result sinks in |

Typical arc for an opcode demo:

1. **Title** — hook and topic
2. **Context** — hardfork / problem statement
3. **Setup** — select example, grow state (steps)
4. **Climax** — the one opcode that matters (slow step + highlights)
5. **Extra** — companion panel, calculator, etc. (optional)
6. **Recap** — tie back to the takeaway (text-only on current state)
7. **Outro** — closing line + CTAs

Use `npm run video:storyboard -- <project-id>` to preview timing before recording.

---

## 2. Project files

Create `video/projects/<exploration-id>/`:

| File | Contents |
|------|----------|
| `content.json` | `overlays`, `annotations`, `highlightSets` |
| `playbook.json` | Ordered beats with timing and actions |
| `zones.json` | Focus-area selectors for `focus` and annotation targets |
| `output/` | Recorded `.webm` (gitignored) |

Add the exploration to `video/src/explorationRegistry.ts` if not already listed.

### `zones.json` — focus areas + YouTube Shorts safe zone

`focusAreas` / `placements` drive playbook `focus` scrolling. Add **`safeZone`** (540×960 px) so readable content clears Shorts platform chrome:

| Edge | Default | Notes |
|------|---------|-------|
| top | 56px | Username / top controls (text sits lower inside black bars) |
| bottom | 120px | Like / comment / caption row |
| left | 32px | Edge crop — e.g. keep “3 NEW OPCODES” fully visible |
| right | 48px | Right-side action column |

Black overlay bars stay **edge-to-edge**; only the **text inside** is inset (same horizontal safe zone as exploration UI). CSS applies `--video-safe-left` / `--video-safe-right` to `.video-banner__line`, punch lines, and title/outro band content — not as outer margin on the black box.

Vertical rhythm inside top/bottom ribbons uses `--video-ribbon-clear-top` (Shorts chrome clearance, ~60% of `--video-safe-top`), `--video-ribbon-pad-top`, and `--video-ribbon-pad-bottom` (top still larger than bottom). Tune in `src/video/video.css` if a project’s banner feels cramped.

---

## 3. Story overlays (`content.json` → `overlays`)

Story overlays carry the narrator text.

| Type | Use |
|------|-----|
| `title-card` | Opening — full band layout (see [Title and outro cards](#title-and-outro-cards)) |
| `outro-card` | Closing + CTAs |
| `punch` | Single headline + optional subline |
| `split` | Two staggered lines |
| `list-flash` | Headline + bullet list |

In the playbook, pair overlays with **`placement: "top-banner"`** and a **`focus`** key
so the exploration panel stays visible below the banner.

**Pattern:**

```json
{
  "beat": "stack-grow",
  "overlay": "stack-cue",
  "placement": "top-banner",
  "focus": "stack",
  "cue": 3000,
  "step": { "count": 9, "interval": 360 },
  "wait": 1600
}
```

Show overlay → `cue` ms → hide → run actions → `wait` ms.

---

## 4. UI annotations (`content.json` → `annotations`)

Annotations are black callouts with a ring on a UI target. They answer: *where should I look?*

```json
"annotations": {
  "guide-stack": {
    "target": "stack",
    "label": "Live stack",
    "hint": "Watch depth grow",
    "side": "top"
  }
}
```

In the playbook: `"annotate": "guide-stack"`. The annotation **stays visible** while the
beat runs — including after the story overlay hides and steps begin — whenever the banner
alone does not point at the action area. If a **top-banner story overlay** covers the
annotation target, the callout is suppressed automatically (avoids collisions like
“Example presets” over “3 NEW OPCODES”).

Targets are keys from `zones.json` `focusAreas`, or built-in aliases:

| Target key | Resolves to |
|------------|-------------|
| `disassembly-active` | `[data-disassembly-active="true"]` |
| `stack-top` | `[data-stack-depth="1"]` |
| `stack-depth-{n}` | `[data-stack-depth="{n}"]` |

Explorations used in videos need stable `data-testid` / `data-stack-depth` attributes on
the elements you annotate (see `BytecodeStepperEC` for the EIP-8024 pattern).

---

## 5. Climax highlights (`content.json` → `highlightSets`)

Use a third layer for the **peak moment** — translucent yellow **area boxes** over the
exact text cells (opcode mnemonic, stack value). No labels, no full-row width, no site chrome.

Target the **text cell**, not the full row:

| Target key | Highlights |
|------------|------------|
| `disassembly-active-opcode` | Opcode text on the active PC row (windup) |
| `disassembly-dupn` | `DUPN …` mnemonic row (payoff — PC may have moved on) |
| `stack-top-value` | `[0x…]` on stack depth 1 |
| `stack-depth-{n}-value` | Value cell at depth *n* |

Requires `data-disassembly-opcode`, `data-stack-value` on exploration widgets (see
`BytecodeStepperEC`).

Define sets in `content.json`:

```json
"highlightSets": {
  "dupn-windup": {
    "marks": [
      { "target": "disassembly-active-opcode", "padX": 12, "padY": 10 },
      { "target": "stack-depth-17-value", "padX": 12, "padY": 10 }
    ]
  },
  "dupn-payoff": {
    "marks": [
      { "target": "disassembly-dupn", "padX": 14, "padY": 12 },
      { "target": "stack-top-value", "padX": 14, "padY": 12 }
    ]
  }
}
```

Wire timing in the playbook `step` action:

```json
"step": {
  "count": 9,
  "interval": 380,
  "climaxFrom": 9,
  "climaxInterval": 1050,
  "climaxPauseMs": 550,
  "highlightSet": "dupn-windup",
  "highlightAfterStep": 9,
  "highlightSetAfter": "dupn-payoff",
  "holdAfterClimaxMs": 1500
}
```

| Field | Purpose |
|-------|---------|
| `climaxFrom` | 1-based step index to enter slow motion |
| `climaxInterval` | Step delay during climax (ms) |
| `climaxPauseMs` | Pause before the first climax step |
| `highlightSet` | Highlights shown when climax starts |
| `highlightAfterStep` | Step number after which to switch sets |
| `highlightSetAfter` | Payoff highlight set |
| `holdAfterClimaxMs` | Extra hold after payoff highlights |

---

## 6. Pacing and cue times

Allocate enough read time for overlay density:

| Overlay density | Recommended `cue` |
|-----------------|-------------------|
| Headline + subline (`punch`, `split`) | 3000–3400 ms |
| Headline + list (`list-flash`, 3+ items) | 4000–4200 ms |
| Title / outro band cards | 4500–5000 ms |
| Text-only recap (no actions) | 4000+ ms (`wait` only) |

Step intervals: ~360–400 ms for routine steps; ~1000 ms+ for the climax step.

Example timings from `eip-8024`:

| Beat | Overlay | Timing |
|------|---------|--------|
| hook | title-card | `wait` 4500 ms |
| context | glamsterdam | `cue` 3400 ms |
| opcodes | three-opcodes | `cue` 4200 ms, `wait` 1200 ms |
| stack-grow | stack-cue | `cue` 3000 ms, `wait` 1600 ms |
| dupn-hit | dupn-cue | `cue` 3000 ms + climax step |
| calculator | calculator-tease | `cue` 2800 ms, `wait` 2400 ms |
| recap | old-limit-cue | `wait` 4200 ms (no actions) |
| outro | outro-card | `wait` 5000 ms |

Storyboard validation warns when `cue` is missing on overlay+action beats or when ids
do not resolve in `content.json` / `zones.json`.

---

## 7. Title and outro cards

Full-screen cards use **`VideoBandShell`**:

- Middle **~3/5** — black band with hero type (title, subtitle, hook / closing, CTAs).
- Top and bottom **~1/5** — live exploration peeking through.

| Card | Peek role |
|------|-----------|
| Title | Show that a live demo runs underneath |
| Outro | Keep exploration visible behind CTAs |

Outro CTAs support `variant: "secondary"` (smaller, e.g. Forkcast) and `"primary"`
(larger, e.g. FYP). Use `"READ ABOUT THE EIP"` for Forkcast, not generic "READ MORE".

CSS: `html.fyp-video-capture` locks hero font sizes; `html.fyp-video-band-active` during band cards.

---

## 8. Recap and example switches

**Recap beats** should stay on the current exploration state — overlay text only, no
`selectExample` or `step`. Point `focus` at the result the viewer just watched (e.g. stack).

```json
{
  "beat": "recap",
  "overlay": "old-limit-cue",
  "annotate": "guide-stack",
  "focus": "stack",
  "wait": 4200
}
```

Write recap copy that references what already happened ("You just copied depth 17"), not
a new demo.

Switch examples mid-video only when the overlay **introduces** a new scenario and the
reset is intentional. Pick an example that matches the overlay message (e.g. do not use
`invalid-dupn` to explain the historical DUP depth-16 limit — that example shows a
shallow-stack revert, a different concept).

---

## 9. Record and verify

```bash
npm run website:build
npm run video:record -- <project-id> --preview   # 540×960 — fast iteration
npm run video:generate -- <project-id>           # 1080×1920 *-final.mp4 (2× upscale on mux)
```

All captures use a **540×960 Playwright viewport** — the layout reference. Preview and
full-res differ only at mux: `video:generate` upscales 2× to 1080×1920 (lanczos). Composition
is identical; do not hand-upscale a preview file.

After recording:

1. Check the trim log — frame 0 should be the title band (valid stats: dark pixel ratio
   ~0.8, mean luminance ~40 in the center crop).
2. Scrub the `.webm` at **0:00** (thumbnail), the climax timestamp, and the outro.
3. Confirm overlays, annotations, and highlights appear as storyboarded.

The recorder hides the exploration until the title card is ready, preloads display fonts,
and post-trims lead-in with ffmpeg. Requires `ffmpeg` on PATH.

---

## Troubleshooting

| If you see… | Check… |
|-------------|--------|
| Missing overlays / annotations in output | Run `npm run website:build` before record |
| Gray letterboxing | Playwright `recordVideo.size` matches viewport dimensions |
| Frame 0 shows exploration UI | Trim log; title-band detection needs black center band |
| Small fallback font on thumbnail | Font preload (`display=block`) and capture CSS |
| Top banner covers example selector | Banner max-height CSS; `focus` uses `block: 'start'` scroll |
| Climax highlights / slow motion absent | All climax fields present on `step` in playbook JSON |
| UI resets without explanation | Remove mid-video `selectExample`; use text-only recap |
| Banner overlaps during focus | `zones.json` scroll margins; `--video-top-banner-max-h` |

---

## Guidelines

- Keep **three layers separate**: story overlays, annotations, climax highlights.
- Use **area highlights** on text cells (`*-opcode`, `*-value`) — not full rows.
- Give **dense overlays ≥ 3 s** cue time; run storyboard before recording.
- Make **frame 0** the title card; verify after every record.
- Put **`data-testid`** on controls the playbook clicks.

---

## Reference example: EIP-8024

| ~Time | Beat | Content |
|-------|------|---------|
| 0:00 | title-card | EIP-8024, Glamsterdam, opcodes, stack-too-deep hook |
| 0:08 | glamsterdam → opcodes | Hardfork; three opcodes; select DUPN |
| 0:14 | stack-grow | 17 pushes — stack grows |
| 0:22 | dupn-hit | DUPN copies depth 17 — climax with markers + slow step |
| 0:34 | calculator | Companion / magic-byte calculator |
| 0:39 | recap | Classic DUP depth 16 vs depth 17 just demonstrated |
| 0:44 | outro | Closing + Forkcast + FYP CTAs |

Files: `video/projects/eip-8024/{content,playbook,zones}.json`.

---

## Checklist

- [ ] Story arc defined in beats
- [ ] `zones.json` covers every `focus` and annotation target
- [ ] Dense overlays have adequate `cue` (3000–4200 ms); storyboard reviewed
- [ ] Annotations on beats with UI action after overlay hides
- [ ] Climax beat has `highlightSets` + climax timing (if applicable)
- [ ] Recap beats are text-only on current state; no unexplained example switches
- [ ] First step is `title-card`
- [ ] `npm run website:build` before record
- [ ] Frame 0 thumbnail verified after record

---

## Related

- [Video pipeline](/contributing/video-pipeline) — architecture, overlay types, selectors
- [Voice-over pipeline](/contributing/video-voice) — ElevenLabs narration, timing, mux
- [Architecture — Video pipeline](/guide/architecture#video-pipeline-short-form)
- `video/README.md` — CLI and Playwright selectors

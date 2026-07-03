# Video pipeline

Short-form vertical videos (YouTube Shorts, Instagram Reels, X) that educate about
EIPs using live Feel Your Protocol explorations.

## Architecture

Two layers stay separate:

1. **Website (`src/video/`)** — overlay rendering and video-mode chrome stripping.
   Activated with `?fyp-video=1`. Does not contain video copy or playbooks.
2. **Video package (`video/`)** — `content.json`, `playbook.json`, Playwright recording CLI.
   Mirrors the isolated `og/` package pattern.

```
website:build → static server → Playwright recordVideo
                     ↑
              ?fyp-video=1 + injected __FYP_VIDEO_CONFIG__
```

## URL parameters

| Param | Scope | Description |
|-------|-------|-------------|
| `fyp-video=1` | Any route | Video capture mode — hides header, footer, roadmap banner |
| `example=<key>` | Explorations | Pre-selects an example preset on load |

Example deep link:

```
/eip-8024-stack-opcodes-dupn-swapn-exchange?fyp-video=1&example=swapn
```

The `example` param works for **all** explorations:

- E-Component explorations (`BytecodeStepperEC`, `PrecompileInterfaceEC`) via shared init logic
- Custom explorations (`eip-7594`, `eip-7928`) via `resolveInitialExample()` and `useExplorationExampleQuery()`

Invalid keys fall back to each exploration's default example.

For precompile explorations that also support field-level share URLs (`?b=`, `?hash=`, …),
`?example=` takes precedence when present.

## Overlay system

Overlays use a **separate visual language** from the main site: black bars, Bebas Neue /
Barlow Condensed, no rounded corners, topic color as accent only.

Components in `src/video/`:

| File | Role |
|------|------|
| `VideoShell.vue` | Overlay layer + `window.__FYP_VIDEO__` bridge |
| `VideoOverlay.vue` | Routes to type-specific overlay components |
| `overlays/VideoTitleCard.vue` | Full-screen movie title |
| `overlays/VideoSplitOverlay.vue` | Staggered split read flow |
| `video.css` | Capture-only typography and animations |

Overlay types in `content.json`:

| Type | Use |
|------|-----|
| `title-card` | Full-screen opening (black, movie poster) |
| `outro-card` | Full-screen closing |
| `punch` | Massive single-line highlight bar |
| `split` | Staggered black bars (upper-left → lower-right) |
| `list-flash` | Bold bullet list |

Copy is injected via `window.__FYP_VIDEO_CONFIG__` before navigation.

Full-screen **title** and **outro** cards use `VideoBandShell`: middle ~3/5 black hero band,
top/bottom ~1/5 peek zones show live exploration. See
[Authoring a video short](/contributing/video-authoring#title-and-outro-cards).

### UI annotations (`content.json` → `annotations`)

Parallel **guide callouts** point at exploration regions while story text may hide:

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

Reference playbook step: `"annotate": "guide-stack"`. Targets use `zones.json` focus area keys
or built-in aliases (`disassembly-active`, `stack-top`, `stack-depth-{n}`).

### Climax highlights (`content.json` → `highlightSets`)

Third overlay layer — **neon-yellow marker strokes** over exact UI elements during peak
moments (no labels, no site-style borders). Playbook climax fields on `step`:

| Field | Purpose |
|-------|---------|
| `climaxFrom` | 1-based step index to enter slow motion |
| `climaxInterval` | Step delay during climax (ms) |
| `climaxPauseMs` | Pause before first climax step |
| `highlightSet` | Highlight set id before climax step |
| `highlightAfterStep` | Switch highlights after this step completes |
| `highlightSetAfter` | Payoff highlight set id |
| `holdAfterClimaxMs` | Extra hold after payoff |

See [Authoring a video short](/contributing/video-authoring#climax-highlights-content-json-highlightsets).

## Story beats (cue → reveal)

Each playbook step can tell a **story beat** synchronized with the exploration:

| Field | Purpose |
|-------|---------|
| `beat` | Label for storyboard / validation |
| `overlay` | Text the viewer reads **before** the action |
| `annotate` | UI guide callout id — **stays visible** while story overlay hides and actions run |
| `placement` | `top-banner` or `bottom-banner` — keeps the focus area clear |
| `focus` | UI region to keep visible (see `zones.json`) |
| `cue` | Read time (ms) — overlay stays up, then hides before actions |
| `wait` | Hold time (ms) after actions — let the viewer absorb |

**Pattern:** show overlay → `cue` → hide → step / select example → `wait`

Preview the narrative timeline:

```bash
npm run video:storyboard -- eip-8024
npm run video:record -- eip-8024 --dry-run   # storyboard + validation
```

### Safe zones (`zones.json`)

Per-project map of exploration focus areas and overlay placements (540×960 reference).
Author overlays in `top-banner` so stack, disassembly, or companion stay visible below.

## Playbook format

Each project lives in `video/projects/<exploration-id>/`:

| File | Purpose |
|------|---------|
| `content.json` | Overlay copy, annotations, highlight sets |
| `playbook.json` | Story beats: `overlay`, `cue`, `focus`, `selectExample`, `step`, … |
| `zones.json` | Focus-area selectors + banner placement metadata |
| `output/` | Recorded `.webm` (gitignored) |

Example beat — read, then step with stack visible:

```json
{
  "beat": "stack-grow",
  "overlay": "stack-cue",
  "placement": "top-banner",
  "focus": "stack",
  "cue": 2400,
  "step": { "count": 9, "interval": 340 },
  "wait": 1400
}
```

## Automation hooks

Stable selectors for Playwright (see `video/README.md` for the full list).

When adding new interactive controls to explorations, add a `data-testid` if the
video playbook needs to click them.

`BytecodeStepperEC` auto-scrolls the disassembly and stack panels during stepping
(active PC row + deep stack entries stay in view). Playwright also syncs panel
scroll after each `step` action in the playbook.

## Local development

Preview video mode in the dev server (overlays only appear when config is injected — use record dry-run to validate copy):

```bash
npm run dev
# /eip-8024-stack-opcodes-dupn-swapn-exchange?fyp-video=1&example=dupn
```

## Recording

From `website/`:

```bash
npm run website:build
npm run video:record -- eip-8024 --dry-run   # print playbook steps
npm run video:record -- eip-8024 --preview   # 540×960 .webm (faster)
npm run video:record -- eip-8024             # 1080×1920 .webm
```

Output: `video/projects/eip-8024/output/eip-8024-<timestamp>.webm`

**Always run `npm run website:build` before recording** if `src/video/` changed.

Recordings auto-trim lead-in (Playwright captures black/hidden frames before the title
card renders) and verify frame 0 shows the title band for preview thumbnails. Detection
uses center-crop dark-pixel ratio — not brightness alone. Requires `ffmpeg` on PATH.

Details: [Record and verify](/contributing/video-authoring#record-and-verify).

## Tests

Unit tests cover:

- `src/libs/__tests__/exampleFromQuery.spec.ts` — query parsing and resolution
- `src/libs/__tests__/exampleFromQuery.explorations.spec.ts` — all live explorations
- `src/video/__tests__/` — video mode detection and bridge logic
- `video/src/__tests__/` — project loading, playbook duration, lead-in trim

Playwright recording is **not** run in CI (same policy as OG images).

## Authoring guide

[Authoring a video short](/contributing/video-authoring) — how to plan beats, write
overlays/annotations/highlights, set pacing, record, and verify thumbnails. Reference:
`video/projects/eip-8024/`.

## Adding a new video

1. Create `video/projects/<exploration-id>/content.json` and `playbook.json`
2. Add exploration to `video/src/explorationRegistry.ts` if not already listed
3. Run `npm run video:record -- <exploration-id>`

No website changes required if the exploration type is already supported.

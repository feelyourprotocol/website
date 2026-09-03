# Video short — reference

Architecture, JSON schemas, ElevenLabs recipe, security rules, troubleshooting. Playbook: [SKILL.md](SKILL.md).

## Architecture

Two layers, kept apart:

1. **Website (`src/video/`)** — Vue overlay layer + `window.__FYP_VIDEO__` bridge, activated by `?fyp-video=1`. Overlays: `VideoTitleCard`, `VideoOutroCard`, `VideoPunchOverlay`, `VideoSplitOverlay`, `VideoListFlashOverlay`, `VideoAnnotation`, `VideoHighlights` (+ `VideoHighlightMark`). Container: `VideoShell` + `VideoOverlay`. Capture-only CSS: `src/video/video.css`.
2. **Isolated `video/` package** — `content.json`, `playbook.json`, `zones.json`, `narration.json`, Playwright recording CLI, ElevenLabs synthesis / ffmpeg mux. Own `package.json`; CI never installs Playwright.

Pipeline:

```
website:build → static server → Playwright recordVideo (540×960)
                     ↑                     ↓
              ?fyp-video=1 + injected      output/*.webm (silent)
              __FYP_VIDEO_CONFIG__                ↓
                                            ffmpeg mux + voice
                                                  ↓
                                            output/*-final.mp4
```

## URL parameters

| Param | Scope | Description |
|-------|-------|-------------|
| `fyp-video=1` | Any route | Hides site chrome, mounts overlay shell |
| `example=<key>` | Explorations | Pre-selects an example preset (all explorations) |

`?example=` works for every exploration via `resolveInitialExample()` + `useExplorationExampleQuery()`. Invalid keys fall back to the exploration's `DEFAULT_*_ID`. For precompile explorations that also support field-level share URLs (`?b=`, `?hash=`), `?example=` takes precedence.

## Selectors (automation contract)

Stable `data-testid` the video pipeline expects. Add missing ones to the exploration widget; do not paper over selectors in the playbook.

| Selector | Element | Provided by |
|----------|---------|-------------|
| `[data-testid="exploration-ready"]` | Widget mount confirmation | `ExplorationC.vue` (automatic) |
| `[data-testid="example-select"]` | Example dropdown trigger | `ExamplesUIC.vue` (automatic) |
| `[data-testid="example-<key>"]` | Example list item | `ExamplesUIC.vue` (automatic, one per key) |
| `[data-testid="bytecode-step"]` / `[data-testid="bytecode-run"]` | Bytecode stepper actions | `BytecodeStepperEC.vue` |
| `[data-testid="run-block"]` | Run scenario action | `ActionButtonUIC` with `test-id="run-block"` |
| `[data-testid="hardfork-<id>"]` | Per-fork toggle button | Add per exploration |
| `[data-testid="receipts-panel"]` | Receipt logs panel root | `ReceiptLogsPanelEC.vue` |
| `[data-testid="receipts-log-row"]` + `[data-log-decoration="<kind>"]` | Individual log row | `ReceiptLogsPanelEC.vue` |
| `[data-testid="companion-sheet"]` / `[data-testid="companion-peek"]` | Mobile companion | `CompanionSheet.vue` |
| `[data-testid="video-shell"]` | Overlay layer root | `VideoShell.vue` |

Built-in target aliases (resolvable in `annotate` / highlight `target` without a zone entry):

- `disassembly-active` → `[data-disassembly-active="true"]`
- `disassembly-active-opcode` → `[data-disassembly-active="true"] [data-disassembly-opcode]`
- `disassembly-<mnemonic>` → `[data-disassembly-opcode][data-disassembly-mnemonic*="<MNEMONIC>"]`
- `stack-top` → `[data-stack-depth="1"]`
- `stack-top-value` → `[data-stack-depth="1"] [data-stack-value]`
- `stack-depth-{n}` / `stack-depth-{n}-value` → depth-`n` row (+ value cell)

Any bare word not matched above resolves to `[data-testid="<word>"]` — cheap escape hatch.

## Schemas

### `content.json`

```jsonc
{
  "meta": { "exploration": "<id>", "defaultExample": "<key>" },
  "overlays": {
    "<overlay-id>": { "type": "title-card|outro-card|punch|split|list-flash", ... }
  },
  "annotations": {
    "<annotation-id>": { "target": "<zone-key|selector|alias>", "label": "…", "hint": "…", "side": "top|bottom" }
  },
  "highlightSets": {
    "<set-id>": { "marks": [{ "target": "<zone-key|selector|alias>", "padX": 12, "padY": 10 }] }
  }
}
```

Overlay types (from `src/video/overlays/`):

| Type | Fields | Use |
|------|--------|-----|
| `title-card` | `eyebrow`, `title`, `subtitle`, `hook: string[]` | Opening (full band; middle 3/5 black, top/bottom 1/5 peek) |
| `outro-card` | `closing`, `ctas: [{ label, url, variant }]` | Closing; `variant: primary|secondary` |
| `punch` | `layout: "banner"`, `placement`, `text`, `sub`, `invert` | Single headline + optional subline |
| `split` | `layout: "banner"`, `placement`, `segments: [{ text, size, emphasis }]` | Staggered two-line read |
| `list-flash` | `placement`, `headline`, `items: string[]` | Headline + bullets |

### `playbook.json`

```jsonc
{
  "format": "shorts",
  "exploration": "<id>",
  "defaultExample": "<key>",
  "steps": [
    {
      "beat": "<id, matches narration.json>",
      "overlay": "<overlay-id from content.json>",
      "annotate": "<annotation-id>",     // optional; stays visible while overlay hides
      "placement": "top-banner|bottom-banner",
      "focus": "<focusAreas key>",       // optional; scrolls target into view
      "cue": 3000,                       // read time before hide, ms
      "hideOverlay": true,               // optional explicit hide before actions
      "selectExample": "<key>",          // optional action
      "step": { "count": 9, "interval": 380, ...climax },
      "expandCompanion": "half",         // optional action ('half' | 'full')
      "click": "<data-testid>",          // optional action; passed to page.getByTestId(...)
      "scroll": { "selector": "<css-selector>", "y": 120 },
      "wait": 1600                       // hold time after actions, ms
    }
  ]
}
```

Climax fields on `step`:

| Field | Purpose |
|-------|---------|
| `climaxFrom` | 1-based step index that enters slow motion |
| `climaxInterval` | Step delay during climax (ms) |
| `climaxPauseMs` | Pause before first climax step |
| `highlightSet` | Set id shown before climax step |
| `highlightAfterStep` | Switch set after this step completes |
| `highlightSetAfter` | Payoff set id |
| `holdAfterClimaxMs` | Hold after payoff |

### `zones.json`

```jsonc
{
  "format": { "width": 540, "height": 960 },
  "safeZone": { "topPx": 56, "bottomPx": 120, "leftPx": 32, "rightPx": 48 },
  "focusAreas": {
    "<key>": { "selector": "[data-testid=\"…\"]", "description": "…" }
  },
  "placements": {
    "top-banner":    { "anchor": "top",    "insetPx": 0,   "maxHeightPx": 184 },
    "bottom-banner": { "anchor": "bottom", "insetPx": 120, "maxHeightPx": 140 }
  }
}
```

Safe zone defaults (YouTube Shorts platform chrome clearance): top 56, bottom 120, left 32, right 48. Black bars stay edge-to-edge; text is inset via `--video-safe-*` / `--video-ribbon-*` CSS vars (see `src/video/video.css`).

### `narration.json`

```jsonc
{
  "segmentGapMs": 350,
  "segments": [
    { "beat": "<id, matches playbook.json>", "text": "…" }
  ]
}
```

Beats without a segment stay silent (pure action holds). Do not use inline v3 tags (`[excited]`, `[slowly]`) except on the climax beat, and even then only when the extra credit is justified.

## Overlays and safe zones

Vertical rhythm inside top/bottom ribbons: `--video-ribbon-clear-top` (~60 % of `--video-safe-top`), `--video-ribbon-pad-top`, `--video-ribbon-pad-bottom` (top always larger than bottom). Tune in `src/video/video.css` if a project's banner feels cramped.

**Pacing table** (from live projects):

| Overlay density | Recommended `cue` |
|-----------------|-------------------|
| `punch` / `split` headline + subline | 3000–3400 ms |
| `list-flash` (3+ items) | 4000–4200 ms |
| `title-card` / `outro-card` band | 4500–5000 ms |
| Text-only recap (no actions) | 4000+ ms (`wait` only) |

Step intervals: 360–400 ms for routine, ≥1000 ms for climax. Storyboard validation warns when `cue` is missing on `overlay + action` beats or when ids do not resolve.

**Annotation suppression:** if a `top-banner` overlay covers the annotation target's bounding box, the callout is auto-hidden (avoids "Example presets" over "3 NEW OPCODES"). Logic: `targetOverlapsTopBanner()` in `src/video/annotationTarget.ts`.

**Highlight targeting:** area boxes over **text cells** only (opcode mnemonic, stack value, transfer-log row) — never full rows, never labels, never site chrome. Requires per-cell `data-*` on the widget (see `BytecodeStepperEC` for the pattern).

## Recording

Capture is always 540×960 (layout reference). Full-res deliverables are 2× upscaled (lanczos) at mux time — never a separate 1080 CSS viewport.

Trim: recorder auto-trims Playwright's black lead-in via center-crop dark-pixel ratio (not brightness alone) and verifies frame 0 shows the title band. Requires `ffmpeg` on PATH.

Commands (all from `website/`, all need `required_permissions: ["all"]` for Playwright-backed ones):

| Command | Effect |
|---------|--------|
| `npm run video:preflight` | Chromium probe (statuses: `ready` \| `needs_agent_permissions` \| `needs_human_setup`) |
| `npm run video:storyboard -- <id>` | Print cue → reveal timeline; validate focus areas + overlay ids |
| `npm run video:record -- <id> --dry-run` | Run playbook headlessly without capturing |
| `npm run video:record -- <id> --preview --no-voice` | Silent 540×960 `.webm` |
| `npm run video:voice:synth -- <id>` | ElevenLabs → `voice/segments/*.mp3` + alignments (cache by text hash) |
| `npm run video:voice:plan -- <id>` | Voice-aligned storyboard |
| `npm run video:voice:mux -- <id>` | Ffmpeg mux silent `.webm` + voice → `*-final.mp4` |
| `npm run video:generate:preview -- <id>` | Build + record + mux (540×960 *-final.mp4) |
| `npm run video:generate -- <id>` | Build + record + mux (1080×1920 *-final.mp4, 2× upscale) |

**Never** run `npm run video:setup` / `npm run og:setup` / `npx playwright install`. If preflight says `needs_human_setup`, ask the human to run `npm run og:check` locally. Rule: [`.cursor/rules/video-recording.mdc`](../../.cursor/rules/video-recording.mdc).

## Voice-over (ElevenLabs)

Voice drives the clock. ElevenLabs returns character-level timestamps; playbook `cue` / `wait` / `step.interval` are derived from them via `voice/mergeTiming.ts`. Recording stays silent; ffmpeg muxes at the end.

Endpoint: `POST /v1/text-to-speech/{voice_id}/with-timestamps` — request body `{ text, model_id }`; response has `audio_base64` + `alignment: { characters, character_start_times_seconds, character_end_times_seconds }`.

Per-segment mp3 + alignment JSON are stored under `video/projects/<id>/voice/segments/` (gitignored). `voice:synth` **caches by text hash** — unchanged beats do not re-spend credits.

Derivation rules (`mergeTiming.ts`):

| Playbook field | Derivation |
|----------------|------------|
| `cue` | Segment duration while overlay is visible |
| Overlay hide | End of segment (or slightly before last word if the action should land on final syllable) |
| `step.interval` | Fit N steps into `(nextBeat.startMs - actionStartMs - holdBudget)` |
| Climax `climaxInterval` | Stretch to cover spoken emphasis on the climax beat |
| `wait` | `nextBeat.startMs - currentBeatEndMs - transitionMs`, floored ~400 ms |

If `voice/manifest.json` is absent, `loadProject.ts` falls back to manual `cue`/`wait` (silent-video mode).

## Security

The ElevenLabs API key is a **paid credential**. Treat it like any other secret.

- **Storage:** `video/.env` only. Never commit. `video/.gitignore` covers `.env`, `output/`, `projects/*/voice/`. `loadEnv.ts` reads it; `elevenlabs.ts` sends it as the `xi-api-key` header.
- **Skill rules (agent-side):**
  - Never `Read` / `cat` / `head` / `less` on `video/.env`.
  - Never print, echo, or log the key value. Never `env | grep ELEVENLABS`.
  - Never pass the key as a CLI flag or in a URL.
  - Never write the key to another file (including `.md`, `.env.example`, tests, or reports).
  - Preflight the key via a non-printing exit code: `cd video && node -e "process.exit(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID ? 0 : 1)"` after the CLI's `loadVideoEnv()` has run. Report only "present / missing".
- **On missing key:** stop the phase, tell the human to copy `video/.env.example` → `video/.env` and paste their key + voice id. Do not offer to write the file.
- **On accidental exposure:** stop, tell the human to rotate the key in the ElevenLabs dashboard, and audit `git log -p -- video/.env` + any recent commits touching `video/`.
- **Follow-ups (out of skill scope):** root-level `**/.env` gitignore for the whole `feelyourprotocol` workspace; macOS Keychain lookup fallback in `loadEnv.ts`; a `gitleaks` pre-commit hook.

## Testing

Unit tests already cover the pipeline surface. Do not treat them as a substitute for the video-readiness spec.

| Path | What it covers |
|------|----------------|
| `src/video/__tests__/videoBridge.spec.ts` | Overlay bridge (`showOverlay`, `hideOverlay`, highlight sets, wait) |
| `src/video/__tests__/useVideoMode.spec.ts` | `?fyp-video=1` parsing |
| `src/video/__tests__/splitText.spec.ts` | Overlay text splitting |
| `video/src/__tests__/loadProject.spec.ts` | `loadVideoProject`, `estimatePlaybookDurationMs`, `themeForExploration`, `parseRecordCliArgs` |
| `video/src/__tests__/storyboard.spec.ts` | Timeline build + validation |
| `video/src/__tests__/annotationTarget.spec.ts` | Selector resolution + banner overlap |
| `video/src/__tests__/mergeTiming.spec.ts` | Voice → playbook timing merge |
| `video/src/__tests__/alignment.spec.ts` | ElevenLabs alignment parsing |
| `video/src/__tests__/trimLeadIn.spec.ts` | Frame-0 trim heuristic |
| `video/src/__tests__/formats.spec.ts` | Output formats |
| `video/src/__tests__/parseGenerateArgs.spec.ts` | Generate-CLI args |
| `src/explorations/<id>/videoReady.spec.ts` | **Per exploration** — mounts widget with `?fyp-video=1&example=<default>`, asserts every `data-testid` the playbook depends on + `?example=<key>` deep-link. See [`eip-7708/videoReady.spec.ts`](../../src/explorations/eip-7708/videoReady.spec.ts) |

## Troubleshooting

| Symptom | Check |
|---------|-------|
| Preflight `needs_agent_permissions` | Re-run with `required_permissions: ["all"]` |
| Preflight `needs_human_setup` | Ask human for `npm run og:check`; never run `og:setup` yourself |
| Record hangs on selector | Playbook targets a `data-testid` the widget does not expose — add it in the exploration, add to `videoReady.spec.ts`, do not rewrite the playbook to a fragile selector |
| Missing overlays / annotations in output | `npm run website:build` before record (or use `video:generate*` which does it for you) |
| Gray letterboxing | Playwright `recordVideo.size` mismatch — do not touch capture viewport, always 540×960 |
| Frame 0 shows exploration UI (not title band) | Trim log; title-band detection needs dark center band — check title-card overlay renders early enough |
| Small fallback font on thumbnail | Font preload (`display=block`) + capture CSS in `video.css` |
| Top banner covers example selector | Banner max-height CSS; use `focus` with `block: 'start'` scroll, or move overlay to `bottom-banner` |
| Climax slow motion absent | All climax fields present on `step` in playbook JSON (`climaxFrom`, `climaxInterval`, `climaxPauseMs`) |
| UI resets without explanation | Remove mid-video `selectExample` from recap beats; recap = text-only on current state |
| Banner overlaps during focus | `zones.json` scroll margins; `--video-top-banner-max-h` in CSS |
| `voice:synth` HTTP 401 | Missing / stale `ELEVENLABS_API_KEY` — do not print it; ask human to rotate in the ElevenLabs dashboard |
| `voice:synth` HTTP 429 | Rate limit — re-run after backoff; cache hits do not re-request |
| Audio starts before video | Trim offset — see `voice/mux-cli.ts`; default is `anchor on title beat` (silence before hook is trimmed from narration source) |
| Title-card second hook line clipped by peek zone | The accent (last) line uses a larger italic font (`--hook-line--accent`). Keep it short — 5–12 chars, one line — otherwise it wraps and the peek zone crops it. Compare `eip-8024` (`GONE SOON…`) |
| Receipts / right-panel content not visible on 540×960 | Right-panel explorations (`<Teleport to="#exploration-right-panel">`) render inside `CompanionSheet` at the bottom. `expandCompanion: 'half'` shows ~50 % viewport, `'full'` shows ~92 %. For a receipts-heavy climax, prefer `'full'` so the log rows are large enough to read; hold the beat longer (`wait ≥ 3 s`) to let the sheet animate open |
| X/Twitter upload fails with "Incompatible video codecs" | The MP4 carries **VP9** (Chromium's default recording codec) inside an MP4 container. X only accepts H.264. Before 2026-09-03, `muxVideoAudio` only transcoded when it also had to scale (i.e. only in the 1080×1920 `shorts` path); the 540×960 `shorts-preview` path did `-c:v copy` and carried VP9 through. Fixed by always transcoding — every mux now emits H.264 + `yuv420p` + `+faststart`. If `ffprobe` reports VP9 on an old file, re-mux: `npm run video:voice:mux -- <id>`. YouTube accepts VP9 natively, which is why it silently worked there |
| YouTube Studio won't accept / show custom thumbnail | Use **Datei hochladen** (*Upload file*), not *Aus Video auswählen* (in-video frames only). File must be **JPEG** (or PNG/GIF/BMP) at **≥1280 px wide**, 9:16, **≤2 MB**. `video:thumb` emits `-final-thumb.jpg` at 1280×2276 — re-run `npm run video:thumb -- <id>` if you still have an old 1080-wide `.png`. Custom Shorts thumbnails may require a verified channel / YPP |

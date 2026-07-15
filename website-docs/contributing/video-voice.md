# Voice-over pipeline

How to add ElevenLabs narration to Feel Your Protocol short-form videos.

Operational baseline: [Video pipeline](/contributing/video-pipeline),
[Authoring a video short](/contributing/video-authoring).

---

## Core idea

**Today:** you hand-pick `cue` / `wait` / step `interval` ms in `playbook.json`, record a
silent `.webm`, publish.

**With voice:** ElevenLabs drives the **clock**. You write spoken copy, the API returns audio
plus **character-level timestamps**. The playbook timing is **derived** (then refined) to
match that audio. Recording stays silent; **ffmpeg muxes** video + voice at the end.

ElevenLabs does **not** accept our time markers — it gives markers **back**. The workflow
flips:

```
OLD:  story plan → manual ms timing → record
NEW:  story plan → narration script → synthesize → derive ms timing → record → mux
```

You still need a **rough visual plan before synthesis** (which beats, which actions, climax).
Voice generation is a **refinement step**, not a substitute for storyboarding.

---

## What we keep

| Layer | Change |
|-------|--------|
| Title / outro cards | Keep — can be spoken over (band still shows peek + type) |
| Story overlays (`punch`, `split`, …) | Keep copy — may differ from spoken script |
| Annotations | Keep — still guide the eye during action |
| Climax highlights | Keep — timing derived from voice + action budget |
| Playwright recording | Keep — still drives the browser |
| `zones.json`, exploration actions | Keep |

On-screen text and spoken narration **may diverge** (shorter banners, fuller voice). Link
them by **beat id**, not by identical strings.

---

## Project layout (planned)

Per project `video/projects/<id>/`:

| File / dir | Role |
|------------|------|
| `playbook.json` | **Structure** — beats, overlay ids, actions, focus, climax fields (intervals optional once voice timing exists) |
| `narration.json` | **Spoken copy** — segments tied to beat ids |
| `content.json` | Unchanged — visual overlay copy, annotations, highlights |
| `voice/` | Generated artifacts (gitignored): `full.mp3`, `alignment.json`, `manifest.json` |
| `output/` | Silent `.webm` + final muxed `.mp4` |

Credentials: `video/.env` (`ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, optional `ELEVENLABS_MODEL_ID=eleven_v3`).

---

## `narration.json` format (proposed)

One segment per beat that has speech. Beats without an entry stay silent (e.g. pure action
holds) or use `"text": ""`.

```json
{
  "model": "eleven_v3",
  "segments": [
    {
      "beat": "hook",
      "text": "EIP-8024. Three new stack opcodes. Glamsterdam is coming."
    },
    {
      "beat": "context",
      "text": "Solidity developers know this error — stack too deep."
    },
    {
      "beat": "opcodes",
      "text": "DUPN, SWAPN, and EXCHANGE let the EVM reach deeper into the stack."
    },
    {
      "beat": "stack-grow",
      "text": "Watch the stack grow — seventeen values pushed."
    },
    {
      "beat": "dupn-hit",
      "text": "Now DUPN copies from depth seventeen. No compiler gymnastics."
    },
    {
      "beat": "recap",
      "text": "Classic DUP stops at depth sixteen. You just copied depth seventeen."
    },
    {
      "beat": "outro",
      "text": "Read the EIP on Forkcast. Explore it on Feel Your Protocol."
    }
  ]
}
```

**Segment strategy:** synthesize **one segment per beat** (multiple API calls), then
concatenate with a short crossfade or silence gap (~200–400 ms). This gives clean
`startMs` / `endMs` per beat without parsing a monologue. Alternative: one full script +
substring alignment lookup (see below) — better prosody, harder mapping.

---

## ElevenLabs API artifacts

Endpoint (already validated):

`POST /v1/text-to-speech/{voice_id}/with-timestamps`

Response (per call):

```json
{
  "audio_base64": "…",
  "alignment": {
    "characters": ["E", "I", "P", …],
    "character_start_times_seconds": [0.0, 0.04, …],
    "character_end_times_seconds": [0.04, 0.09, …]
  }
}
```

From alignment we can:

1. **Duration** — last `character_end_times_seconds` × 1000.
2. **Substring timing** — find beat text in the character stream → `startMs`, `endMs`.
3. **Word boundaries** — group characters between spaces for caption-style overlays (v2+).

Store per segment in `voice/manifest.json`:

```json
{
  "generatedAt": "2026-07-04T…",
  "audioFile": "voice/full.mp3",
  "totalDurationMs": 47200,
  "beats": {
    "context": { "startMs": 5200, "endMs": 9100, "segmentFile": "voice/seg-context.mp3" },
    "opcodes": { "startMs": 9300, "endMs": 14200 }
  }
}
```

---

## Deriving playbook timing from voice

For each playbook step with a narration segment:

| Playbook field | Derivation |
|----------------|------------|
| `cue` | `beat.endMs - beat.startMs` while overlay is visible (narrator reads banner copy or parallel narration) |
| Overlay hide | When beat speech ends (or slightly before last word if action should start on final syllable) |
| `step.interval` | Fit N steps into `(nextBeat.startMs - actionStartMs - holdBudget)` |
| Climax `climaxInterval` | Stretch to cover spoken emphasis on dupn-hit beat |
| `wait` | `nextBeat.startMs - currentBeatEndMs - transitionMs`, floored at ~400 ms |

**Action beats** (stack-grow, dupn-hit): speech often plays **during** overlay (`cue`), then
overlay hides and steps run **while the next segment hasn't started yet**. Budget step
intervals from the **gap** between segment end and next segment start, minus highlight holds.

**Text-only beats** (recap): `wait` = segment duration (no `cue` split).

**Title / outro:** treat like overlay-only beats — speech over the band; `wait` = voice
duration (+ optional 300 ms tail).

### Merge strategy

Do **not** hand-edit derived ms in `playbook.json`. Use a generated overlay:

- `playbook.json` — structure only (or legacy manual timing as fallback).
- `voice/manifest.json` — authoritative timestamps from ElevenLabs.
- `playbookRunner` loads **merged** step timing: `structure ⊕ voice manifest`.

If voice files are missing, fall back to manual `cue`/`wait` (silent video mode).

---

## Pipeline commands (planned)

From `website/`:

```bash
# One-shot final (video + voice) — open the *-final.mp4, not the .webm
npm run video:generate:preview -- eip-8024
npm run video:generate -- eip-8024
npm run video:generate -- eip-8024 --skip-synth --preview   # reuse voice/, re-record + mux

# Silent webm only (visual iteration, no audio):
npm run video:record -- eip-8024 --preview --no-voice

# Or step-by-step:
npm run video:voice:synth -- eip-8024
npm run video:voice:plan -- eip-8024
npm run website:build
npm run video:record -- eip-8024 --preview
npm run video:voice:mux -- eip-8024
```

Skip synth/plan to record with manual timing (no `voice/manifest.json`).

Implementation modules (under `video/src/voice/`):

| Module | Responsibility |
|--------|----------------|
| `loadEnv.ts` | Load `video/.env` |
| `elevenlabs.ts` | API client (`with-timestamps`) |
| `synthesize.ts` | Segment loop, write mp3 + raw alignments |
| `concatAudio.ts` | ffmpeg concat segments → `full.mp3` |
| `alignBeats.ts` | Build `manifest.json` beat → start/end ms |
| `mergeTiming.ts` | Apply manifest to playbook steps |
| `mux.ts` | ffmpeg: copy video, encode AAC, `-shortest` |

---

## Lead-in trim and audio sync

Recording trims black/hidden lead-in from the `.webm` (see `trimLeadIn.ts`). Audio must
start at the **same** timeline origin as trimmed video.

Options (pick one in implementation):

1. **Anchor on title beat** — narration segments exclude pre-title silence; manifest
   `startMs` is relative to first title frame (after trim). Simplest.
2. **Prepend silence** — mux step adds `trimOffsetMs` silence to audio to match ffmpeg trim.
3. **Record trim offset** — `recordVideo` writes `output/trim-meta.json`; mux reads it.

Recommend **(1)** for v1: first segment is `hook` title speech; video timeline zero = title
card visible; no voice before that.

---

## Procedural workflow (agent + human)

Use this checklist for each new exploration short.

### Phase A — Story (mostly unchanged)

1. Define beats in `playbook.json` — overlay ids, actions, focus, climax fields.
2. Write visual copy in `content.json` (overlays, annotations, highlightSets).
3. Define `zones.json` focus areas.
4. Run `npm run video:storyboard -- <id>` — validate structure **without** voice.

Rough target length: ~45–60 s total voice (YouTube Shorts).

### Phase B — Narration script

1. Add `narration.json` — one segment per spoken beat.
2. Write for **ear**, not screen: conversational, present tense, short sentences.
3. Eleven v3: optional inline tags (`[excited]`, `[slowly]`) sparingly on climax beat.
4. Read aloud yourself once — aim ~130–150 wpm equivalent.

### Phase C — Synthesize

1. Ensure `video/.env` is set.
2. `npm run video:voice:synth -- <id>`
3. Listen to `voice/full.mp3` — re-run after script edits (cache segments by text hash to save credits).

### Phase D — Timing plan

1. `npm run video:voice:plan -- <id>` — prints voice-aligned storyboard:
   ```
   00:00  hook      voice 4.2s  (overlay)
   00:04  context   voice 3.8s  → hide → wait 0.6s
   00:08  opcodes   voice 5.1s  → selectExample
   …
   ```
2. Refine: if stack-grow speech is longer than 9 steps can fill, either shorten script or
   slow step interval / reduce step count.
3. Climax beat: ensure `climaxInterval` + highlight holds fit inside segment + gap.

### Phase E — Record + verify

1. `npm run website:build && npm run video:record -- <id> --preview`
2. Scrub silent video against `voice/full.mp3` in a player (manual sync check).
3. Fix timing via narration edits or `voice/plan overrides` (optional small manual offsets in manifest).

### Phase F — Mux + publish

1. `npm run video:voice:mux -- <id>` → `output/<id>-<timestamp>-final.mp4`
2. Verify frame 0 thumbnail (title band) and audio start.
3. Full-res record + mux when satisfied.

---

## Implementation order (suggested)

| Step | Deliverable |
|------|-------------|
| 1 | `narration.json` schema + EIP-8024 sample script |
| 2 | `voice/synthesize` CLI + segment mp3 + alignment JSON |
| 3 | `concatAudio` + `manifest.json` beat timestamps |
| 4 | `mergeTiming` integrated into `playbookRunner` / storyboard |
| 5 | Record eip-8024 preview with voice-derived timing |
| 6 | `mux` CLI + docs update in video-pipeline.md |
| 7 | Optional: word-level captions from alignment (v2) |

---

## Testing

- Unit tests: substring → ms lookup, merge timing math, manifest validation against playbook beat ids.
- No ElevenLabs calls in CI — fixture alignment JSON from real API response.
- Manual: preview record + mux for one project before merging pipeline defaults.

---

## Agent instructions

When the user asks to add voice to a video project:

1. Read this doc + existing `playbook.json` / `content.json`.
2. Draft `narration.json` segments for beats that should be spoken.
3. Run synth → plan → storyboard; report total duration and per-beat ms.
4. Adjust narration length if derived step intervals fall below ~280 ms or total exceeds ~60 s.
5. Record preview, mux, ask user to listen on phone.
6. Do **not** commit `video/.env` or `voice/` artifacts.

---

## Related

- [Video pipeline](/contributing/video-pipeline) — recording, overlays, trim
- [Authoring a video short](/contributing/video-authoring) — beats, pacing, climax
- `video/src/loadEnv.ts` — env loading for ElevenLabs
- `video/.env.example` — credential template

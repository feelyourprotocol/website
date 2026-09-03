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
2. **Inventory** from prior `video/projects/*` — list consumed openings, hooks, outro CTAs, and prior `tweet.yml` openers.
3. **Derive** the video plan — [Derivation](#derivation). Write it in chat before drafting files.
4. **Draft the four project files** — [Project files](#project-files). Use existing project as a shape guide, not a copy target.
5. **QA Tier 1–3** — [QA gates](#qa-gates). Hard stop on any error.
6. **Cost gate (transparency only, no human GO)** — print the full narration script + estimated duration in chat before spending ElevenLabs credits. Continue in the same turn.
7. **Synthesize + plan + record + mux** — [Recording](#recording).
8. **Verify** — frame 0 is title band, audio starts at 0:00, duration is 30–90 s.
9. **Announcement tweet** — [Announcement tweet](#announcement-tweet). Write `tweet.yml`; include paste-ready copy in the report.
10. **YouTube Shorts publication assets** — [YouTube Shorts publication](#youtube-shorts-publication). Extract thumbnail (`npm run video:thumb -- <id>`) and write `youtube.yml`; include paste-ready copy in the report.
11. **Report** — [Report](#report), then **STOP**.

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
| `tweet.yml` | Announcement tweet (T1 + optional T2 reply) + video description | Written after mux; see [Announcement tweet](#announcement-tweet) |
| `youtube.yml` | YouTube Shorts title + description + tags + playlist + thumbnail reference | Written after mux; see [YouTube Shorts publication](#youtube-shorts-publication) |

Schemas + overlay type details: [reference.md § Schemas](reference.md#schemas). Overlay layout / safe zone: [reference.md § Overlays](reference.md#overlays-and-safe-zones).

**Do not create a `README.md` under `video/projects/<id>/` unless asked.** The README stays optional.

**Output pruning:** the recorder keeps only the newest **generation** per project (a generation = every file sharing the `<projectId>-<isoTimestamp>` prefix: `.webm`, `-final.mp4`, `-final-thumb.jpg`). Older generations are deleted automatically after each successful record. Mux and thumb operate inside an existing generation (no fork), so they do not prune. If you need to preserve an old take, copy it out of `output/` before re-recording.

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

1. **Codecs** — `ffprobe` must report `codec_name=h264` (profile `High`, `pix_fmt=yuv420p`) for the video stream and `codec_name=aac` (`profile=LC`) for audio. VP9-in-MP4 is a hard reject on X/Twitter ("Incompatible video codecs") and several other timelines. `muxVideoAudio` always transcodes to H.264 + `+faststart`, so this should hold — but check on every project until a post-mux assertion lands. One-liner:
   ```bash
   ffprobe -v error -show_entries stream=codec_name,profile,pix_fmt,width,height -of default video/projects/<id>/output/*-final.mp4
   ```
2. **Frame 0** — title band with the anchor visible. Recorder logs the trim result; expect dark-pixel ratio ~0.8, mean luminance ~40 in the center crop.
3. **Audio start** — voice begins at 0:00 (title beat) or within ~200 ms.
4. **Duration** — 30–90 s (Shorts sweet spot 45–60 s).
5. **Highlights** — if a `highlightSet` is used, the payoff cell(s) actually light up on the climax beat.

## Announcement tweet

The video is the **second announcement** of the exploration on @FeelEthereum ([Marketing Strategy → cadence](../../roadmap/go-to-market/marketing.md#announcement-cadence-per-exploration)). The [Bro & Bruh comic](../bro-bruh-comic/SKILL.md) already sparked interest. This tweet lands the *substance* and asks for real mental engagement: watch, poke the exploration, then decide "does this touch my domain?". Later, a third tweet will introduce the MCP twin — that one is **out of this skill**.

**Job:** get a protocol-curious reader to (a) watch the 45–60 s clip, and (b) either open the exploration, or open the spec / Forkcast to check the EIP against their own use case. Not entertainment; not vibe recap; not hype.

**Voice:** warm, honest, precise. Protocol-curious peer, not analyst, not shill. Second person is fine when it invites reflection ("does your indexer see …"); avoid imperative marketing verbs ("check out", "don't miss", "must-see").

### Shape — default is a 2-tweet mini-thread

The video needs the whole first tweet. Piling all three URLs on the media dilutes both the "watch" ask and the "dive in" ask. Split cleanly:

- **T1 (with video)** — 2 short lines (context + mechanism, or mechanism + diagnostic question) + primary CTA + naked exploration URL. Media = the muxed `*-final.mp4`.
- **T2 (reply, no media)** — spec + Forkcast (when a Forkcast page exists). One line of framing is fine.

Single-tweet form is allowed **only** when context + one line of mechanism + all three URLs fit under 240 chars without cramping. If the `coreQuestion` is long or the EIP needs setup, use the thread — do not compress.

### T1 — write order

Pick **two** of these three, in this order, then the URL:

1. **Context** (1 line, no fluff) — `EIP-NNNN · <fork>` and one verb that says what ships. Use `CANONICAL.maturity.forkInclusion` when set. Fork wording: **Glamsterdam** = hardfork, **Amsterdam** = EL rules — one label, whichever is truer for this EIP; not both as a sequence.
2. **Mechanism** (1 line, plain words) — the video's climax / recap distilled. Say what *happens* (a Transfer log fires; the stack copies depth 17), not what an app should *do*. Derived from `canonical.ts` + the recap narration segment, not invented.
3. **Diagnostic** (1 line, invites reflection) — a question that maps the mechanism to the reader's own surface. Examples of the shape: "Does your indexer see native ETH the way it sees ERC-20?", "How deep does your compiler pack the stack?". Never generic ("Is your dapp ready?") — always something they can actually check.

Then a blank line, then the naked exploration URL: `https://feelyourprotocol.org<INFO.path>`.

### T2 (reply) — write order

Two naked URLs stacked. Optional one line of framing before them (e.g. "Where it fits + why").

- `Spec: https://eips.ethereum.org/EIPS/eip-NNNN` (from `CANONICAL.identity.specUrl`)
- `Forkcast: https://forkcast.org/eips/NNNN/` — include **only if** the Forkcast page for this EIP exists. Forkcast URL pattern is `/eips/NNNN/` (plural, trailing slash). Verify the page returns 200 before writing the URL; omit the whole line rather than link to a 404.

### Do not

- Clone the comic caption or its opener
- Recap the video ("in this 60-second clip…")
- Hashtag block, self-`@FeelEthereum`, "check out", "you've been waiting", "don't miss"
- Analyst tone, price, MCP / x402 / token
- Mention Glamsterdam **and** Amsterdam in the same tweet as if they were a sequence
- Invent numbers, fork names, or verbs not present in `canonical.ts` / `examples.ts`
- Emojis by default. One "↓" or "→" as an arrow is fine when it earns its character; skip otherwise

### Diversity check

Scan every existing `video/projects/*/tweet.yml` `t1.body` opener. If your draft repeats a stock phrase ("Feel it live", "Watch the mechanic", "See it in the receipt"), reword. Video CTAs will repeat over time — that's OK; framing must stay fresh across the franchise.

### Video description (X accessibility)

X calls this "Add description" on the video composer (opens on click of the uploaded video thumbnail). Write it — screen readers get only this + the tweet body.

- 2–3 sentences, plain prose
- What's on screen (title band → widget → payoff) + one line summarising the spoken narration
- Not tweet copy, not marketing
- ≤ 1000 chars; aim 300–600

### Length

- T1 comfortably under **270 chars** with the URL (which counts as 23). Prefer shorter — 200–240 is the sweet spot.
- T2 comfortably under **240 chars** with both URLs.
- If you cannot land T1 under 270 without cutting the mechanism line, drop the diagnostic and keep context + mechanism.

### File — `video/projects/<id>/tweet.yml`

Copy the key set. Do not add ad-hoc top-level keys. `null` allowed for `t2.body` (single-tweet form) or `sources.forkcast_url` (no Forkcast page).

```yaml
schema: video-short-tweet/v1
id: eip-NNNN

# Shape decision — 'thread' is default; 'single' only when T1 fits all three URLs under 240 chars
shape: thread | single

t1:
  body: |
    <paste-ready caption, naked exploration URL on its own last line>
  media: <basename of the muxed *-final.mp4 under output/>
  video_description: |
    <2–3 sentences for the X "Add description" field; screen-reader accessible>

# When shape: single, set t2: null and put all URLs in t1.body.
t2:
  body: |
    <paste-ready reply, spec + Forkcast URLs on their own lines>

sources:
  exploration_url: https://feelyourprotocol.org<INFO.path>
  spec_url: <CANONICAL.identity.specUrl>
  forkcast_url: https://forkcast.org/eips/NNNN/   # or null when no page exists (pattern: /eips/NNNN/ with trailing slash)

notes: <consumed opener + anything a later LLM must not repeat>
```

## YouTube Shorts publication

The muxed `*-final.mp4` is uploadable **as-is** to YouTube Shorts. YouTube Studio asks for **title**, **description**, and **thumbnail** at minimum; we fill all three plus tags + playlist + category. Everything lives in `youtube.yml`; the thumbnail is auto-extracted from the video by `npm run video:thumb -- <id>`.

The X arc (comic + video tweet) is the primary channel; YouTube Shorts is a **secondary evergreen index** — same clip, tuned for search rather than for a timeline hit. Copy is more descriptive, keywords matter more than voice. Publishing on YouTube is **optional per project** (human decides); the skill always produces the assets so the decision is one paste-and-upload away.

### Title (aim ≤ 70 chars, hard cap 100)

- Lead with **`EIP-NNNN`** — that's the search anchor
- Follow with the mechanism in plain words (verb + object)
- Optional fork label in parens: `(Amsterdam)`
- End with ` #Shorts` (unlocks Shorts shelf placement)

Do **not** clone the X tweet opener — YouTube is a different intent surface (search, not timeline). Do not add emojis, question marks, or clickbait phrasing.

### Description (aim 300–600 chars; hard cap 5000)

Write in this order — the first ~100 chars are what shows in search snippets, so front-load:

1. **Snippet line** (1 sentence) — a rephrased mechanism or coreQuestion. Not the tweet body; not a title restatement.
2. **Context paragraph** (2–3 sentences) — what the EIP does, what fork, what the video shows. Written in third person / narrator voice, not "in this video…".
3. **Blank line**, then CTA + full exploration URL on its own line: `Explore it interactively:\n<url>`.
4. **Blank line**, then `Spec: <url>` and (if the page exists) `Forkcast: <url>` on their own lines.
5. **Blank line**, then a hashtag row: 3–5 tags, `#Shorts` at the end.

Do **not** front-load hashtags or emojis. Do not paste the tweet body. Do not include video timestamps ("0:00 intro …") — Shorts are too short.

### Thumbnail — always the title-card frame

Run `npm run video:thumb -- <id>` after mux. It extracts a still at `t=1.5s` (inside the ~4.5 s title-card window) into `output/<basename>-final-thumb.jpg` — **JPEG, 1280×2276 (9:16), under 2 MB**. That frame already carries the anchor question in high-contrast type.

YouTube Studio upload rules (Shorts custom thumbnail):
- **Format:** JPG (default from `video:thumb`), PNG/GIF/BMP also accepted — prefer JPG for Studio compatibility
- **Size:** 1280 px wide minimum (9:16 → 1280×2276); do **not** upload a 1080-wide PNG grab — Studio often rejects it silently
- **Upload path:** *Datei hochladen* / *Upload file* — **not** *Aus Video auswählen* (that picker only shows in-video frames)
- Different frame (e.g. the payoff): `npm run video:thumb -- <id> --time <seconds>`. Record the choice in `youtube.yml` `thumbnail.time_sec`.

**Do not** synthesize a custom AI thumbnail per project. The title card is the brand-consistent choice; a bespoke thumbnail costs time and drifts from the video.

### Tags (5–10 loose keywords)

Weak signal but still helps related-video ranking. Pick: `Ethereum`, `EIP-NNNN`, the fork name (both `Amsterdam` and `Glamsterdam` are OK here — this is search metadata, not tweet copy), the topic (`taxonomy.topic`), and 1–3 mechanism words drawn from `CANONICAL.mcp.keywords`.

### Category + Playlist

- **Category:** *Science & Technology* (default for every FYP short).
- **Playlist:** bucket by fork — e.g. *Feel Your Protocol · Amsterdam EIPs*. Create the playlist once per fork; add every new short to it.

### Diversity check

Scan every existing `video/projects/*/youtube.yml` `title` and `description` snippet lines. If the title formula ("EIP-NNNN Explained: …") starts to feel identical across a run of 4–5 shorts, vary the verb (`Explained`, `In 60 Seconds`, `The Feel`, `Under the Hood`) — but keep `EIP-NNNN` in the lead position always.

### File — `video/projects/<id>/youtube.yml`

```yaml
schema: video-short-youtube/v1
id: eip-NNNN

title: <≤ 100 chars, ends with " #Shorts">

description: |
  <snippet line — first ~100 chars show in search results>

  <2-3 sentence context: EIP, fork, what the video shows>

  Explore it interactively:
  https://feelyourprotocol.org<INFO.path>

  Spec: https://eips.ethereum.org/EIPS/eip-NNNN
  Forkcast: https://forkcast.org/eips/NNNN/   # omit line when no page exists

  #Ethereum #<fork> #<mechanism> #FeelYourProtocol #Shorts

tags:
  - Ethereum
  - EIP-NNNN
  - <fork>
  - <topic>
  - <mechanism keyword>

category: Science & Technology
playlist: Feel Your Protocol · <fork> EIPs

thumbnail:
  file: <basename>-final-thumb.jpg
  width: 1280
  time_sec: 1.5
  source: title-card

sources:
  exploration_url: https://feelyourprotocol.org<INFO.path>
  spec_url: <CANONICAL.identity.specUrl>
  forkcast_url: https://forkcast.org/eips/NNNN/   # or null
```

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

**Announcement tweet** (`video/projects/eip-NNNN/tweet.yml`, shape: <thread|single>):

T1 (attach the muxed `*-final.mp4`):

```
<t1.body>
```

Video description (X composer → "Add description"):

```
<t1.video_description>
```

<!-- omit the block below when shape: single -->
T2 (reply, no media):

```
<t2.body>
```

Human may edit; do not ask for a tweet-only GO.

**YouTube Shorts** (`video/projects/eip-NNNN/youtube.yml`) — upload the muxed `*-final.mp4` as a Short:

Titel (Title, ≤ 100 chars):

```
<title>
```

Beschreibung (Description):

```
<description>
```

- **Tags:** <comma-separated>
- **Kategorie / Category:** Science & Technology
- **Playlist:** <playlist name>
- **Thumbnail:** `video/projects/eip-NNNN/output/<basename>-final-thumb.jpg` (1280×2276 JPEG — upload via *Datei hochladen* / *Upload file*, not *Aus Video auswählen*)

Human may edit; do not ask for a YouTube-only GO.

**Consumed for future videos:** hook openings, outro CTA phrasing, T1 opener, YouTube title verb
**Open:** (voice edits, timing tweaks — human can ask)
```

Then **STOP**.

## Follow-ups (out of this phase)

- Re-render at 1080×1920 — `npm run video:generate -- <id>` (2× upscale of the same layout)
- Iterate a beat — edit `narration.json` and re-run `voice:synth` + `voice:mux` (voice/segments cache by text hash so unchanged beats do not re-spend)
- Upload / caption / thumbnail — human, out of skill scope
- Root-level `**/.env` gitignore, macOS Keychain fallback in `loadEnv.ts` — see [reference.md § Security](reference.md#security)

# fyp-video — short-form exploration video pipeline

Records vertical 9:16 videos (YouTube Shorts, Instagram Reels, X) from live Feel
Your Protocol explorations. Text overlays are rendered in the browser; Playwright
records the viewport while a Node playbook drives timing and interactions.

This is an **isolated package** (sibling to `og/`): own `package.json`, own
`node_modules`. CI never installs Playwright.

## One-time setup

If you already ran `npm run og:setup`, Chromium is shared — you only need:

```bash
npm run video:setup    # npm install in video/
npm run video:check    # verify Chromium launch
```

Otherwise run `npm run og:setup` once from `website/` (covers both pipelines).

## Usage

```bash
npm run website:build

# Final output (video + voice) — use these for upload / review with audio:
npm run video:generate:preview -- eip-8024   # 540×960 *-final.mp4
npm run video:generate -- eip-8024           # 1080×1920 *-final.mp4 (2× upscale, same layout)

# Silent intermediate only (no audio) — always 540×960 capture:
npm run video:record -- eip-8024 --preview --no-voice

npm run video:record -- eip-8024 --dry-run   # inspect playbook steps
```

Output: `video/projects/<id>/output/<id>-<timestamp>-final.mp4` (upload) and `.webm` (silent intermediate).

Step-by-step voice tooling: `video:voice:synth`, `video:voice:plan`, `video:voice:mux`. Recipe + timing derivation: `.cursor/skills/video-short/reference.md`.

Output: `video/projects/<id>/output/<id>-<timestamp>.webm`

## Website integration

Open any exploration in video mode:

```
/eip-8024-stack-opcodes-dupn-swapn-exchange?fyp-video=1&example=dupn
```

| Query param | Purpose |
|-------------|---------|
| `fyp-video=1` | Hide site chrome; show overlay shell |
| `example=<key>` | Pre-select an example preset (all explorations) |

Playwright automation selectors (stable `data-testid`):

| Selector | Element |
|----------|---------|
| `[data-testid="exploration-ready"]` | Exploration widget loaded |
| `[data-testid="example-select"]` | Example dropdown trigger |
| `[data-testid="example-<key>"]` | Example list item |
| `[data-testid="bytecode-step"]` | Bytecode stepper Step button |
| `[data-testid="bytecode-run"]` | Run button |
| `[data-testid="run-block"]` | EIP-7928 Run block button |
| `[data-testid="companion-sheet"]` | Mobile companion panel |
| `[data-testid="companion-peek"]` | Companion peek bar (tap to expand) |
| `[data-testid="video-shell"]` | Overlay layer root |

Inject overlay copy before navigation (Phase 2 playbook runner):

```typescript
await page.addInitScript((config) => {
  window.__FYP_VIDEO_CONFIG__ = config
}, contentYamlParsed)
```

Drive overlays from Playwright:

```typescript
await page.evaluate(() => window.__FYP_VIDEO__!.showOverlay('hook'))
```

## Project layout

```
video/
├── projects/
│   └── eip-8024/
│       ├── content.json      # overlay copy
│       ├── playbook.json     # sequential steps + timing
│       └── output/           # rendered .webm (gitignored)
└── src/
    ├── record-cli.ts
    ├── recordVideo.ts
    ├── playbookRunner.ts
    ├── loadProject.ts
    └── formats.ts
```

## Agent rules

Same Playwright rules as OG images — see `.cursor/rules/video-recording.mdc`.
**Never** run `video:setup` or `playwright install` unless the user explicitly asks.

Run record/preflight with `required_permissions: ["all"]`.

## See also

- `.cursor/skills/video-short/SKILL.md` — end-to-end authoring playbook (agent-driven)
- `.cursor/skills/video-short/reference.md` — architecture, JSON schemas, ElevenLabs recipe, security rules, troubleshooting
- `og/README.md` — shared Chromium bootstrap pattern

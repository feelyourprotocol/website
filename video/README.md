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
npm run video:preflight
npm run video:record -- eip-8024 --dry-run   # inspect playbook steps
npm run video:record -- eip-8024 --preview   # 540×960 .webm (faster iteration)
npm run video:record -- eip-8024             # 1080×1920 .webm
```

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

Same Playwright rules as OG images — see `.cursor/rules/video-playwright.mdc`.
**Never** run `video:setup` or `playwright install` unless the user explicitly asks.

Run record/preflight with `required_permissions: ["all"]`.

## See also

- `docs/contributing/video-pipeline.md` — full architecture and workflow
- `docs/contributing/video-authoring.md` — how to author a short (beats, pacing, recording)
- `og/README.md` — shared Chromium bootstrap pattern

# fyp-og — social preview (OG/Twitter) image pipeline

Renders exploration- and topic-specific Open Graph / Twitter card images
(1200×630 WebP) from HTML templates filled with registry data.

This is an **isolated package**: it has its own `package.json` and
`node_modules`, and the main website's `package.json` has no `workspaces`
field, so CI (`npm ci` in `website/`) never installs Playwright.

## One-time setup (do this once per machine)

From **`website/`** (not from `og/` — use the root scripts):

```bash
npm run og:setup
npm run og:check
```

`og:setup` runs `npm install` inside `og/` and downloads Chromium via Playwright.
`og:check` launches headless Chromium once to confirm everything works.

Browsers are stored in the **OS user cache** (e.g. `~/Library/Caches/ms-playwright`
on macOS), not in git. Root `npm install` does **not** install `og/` deps — you
must run `og:setup` explicitly.

`og/` entry scripts redirect Cursor's sandbox `PLAYWRIGHT_BROWSERS_PATH` to your
real user cache automatically — agents should not need setup again after you run
`og:check` once.

### When to re-run setup

- New machine or fresh clone
- After a Playwright major version bump in `og/package.json`
- If `npm run og:check` fails

## Usage

From `website/`:

```bash
npm run generate:og:exploration -- eip-7594
npm run generate:og:topic -- scaling
npm run generate:og:roadmap
npm run generate:og:all
```

Output paths (committed to git):

```
public/og/explorations/<id>.webp
public/og/topics/<topicId>.webp
public/og/manifest.json
```

The main site's SEO layer reads `manifest.json` and falls back to
`public/og/default.webp` when a specific image has not been generated yet.

## Roadmap social cards (Twitter / threads)

Timeline, roadmap board, and hero cards for `@FeelEthereum` threads — built from
the same Vue components as the live roadmap. See
[`roadmap/social/README.md`](../roadmap/social/README.md).

```bash
npm run capture:social
```

Output: `roadmap/social/out/{hero,timeline,board}.{png,webp}`

## Tests

```bash
npx vitest run roadmap/social/src/__tests__/ og/src/social/__tests__/
```

Unit tests cover card registry, CLI parsing, paths, and Vue frame rendering (no Playwright in CI).

## Cursor / agent note

AI agents must **not** run `og:setup` or `playwright install`. Use the npm scripts below with full shell permissions (`all`). If Chromium is missing, ask the human to run `og:setup` — see `.cursor/rules/og-playwright.mdc`.

Quick agent preflight (no browser launch):

```bash
npm run og:preflight
```

- `status: ready` — proceed with `generate:og:*` or `capture:social`
- `status: needs_agent_permissions` — re-run with `required_permissions: ["all"]`
- `status: needs_human_setup` — ask the user to run `npm run og:check`

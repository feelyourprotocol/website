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

### When to re-run setup

- New machine or fresh clone
- After a Playwright major version bump in `og/package.json`
- If `npm run og:check` fails

## Usage

From `website/`:

```bash
npm run generate:og:exploration -- eip-7594
npm run generate:og:topic -- scaling
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

## Cursor / agent note

AI agents should use the npm scripts above with full shell permissions (`all`),
not install Playwright in a sandbox. If Chromium is missing, run `og:setup`
locally — see `.cursor/rules/og-playwright.mdc`.

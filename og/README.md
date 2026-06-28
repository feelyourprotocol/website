# fyp-og — social preview (OG/Twitter) image pipeline

Renders exploration- and topic-specific Open Graph / Twitter card images
(1200×630 WebP) from HTML templates filled with registry data.

This is an **isolated package**: it has its own `package.json` and
`node_modules`, and the main website's `package.json` has no `workspaces`
field, so CI (`npm ci` in `website/`) never installs Playwright.

## Prerequisites

```bash
cd website/og
npm install
npx playwright install chromium
```

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

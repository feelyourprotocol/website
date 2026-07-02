# Roadmap social cards — Twitter / thread images

Reusable pipeline for **screenshot cards** built from the same Vue components and
data as the live roadmap site (`Timeline`, `RoadmapBoard`). When you update
`roadmap/data/timeline.ts` or `roadmap/data/roadmap.ts`, rebuild and re-capture —
no manual Figma work.

## Cards

| Id | Content | Data source |
|----|---------|-------------|
| `hero` | Phase 3 headline + one-liner | `src/cards.ts` (edit copy there) |
| `timeline` | Three-phase timeline | `roadmap/data/timeline.ts` |
| `board` | Track × horizon grid | `roadmap/data/roadmap.ts` |

Output lands in `roadmap/social/out/` (gitignored PNG + WebP at 1200px wide).

## Prerequisites

One-time Playwright setup (from `website/`):

```bash
npm run og:setup
npm run og:check
```

## Workflow

**1. Preview in browser** (optional — tweak layout/copy):

```bash
npm run social:dev
```

Open:

- http://localhost:5175/?card=hero (or the next free port if 5175 is taken — other dev servers may be running)
- http://localhost:5175/?card=timeline
- http://localhost:5175/?card=board
- http://localhost:5175/?card=all — all cards stacked (dev only)

**2. Capture images for Twitter:**

```bash
npm run capture:social
# or specific cards:
npm run capture:social -- timeline board
```

This runs `social:build` then Playwright capture (via the isolated `og/` package).

**3. Attach to thread** — use PNG or WebP from `roadmap/social/out/`.

## Customizing card copy

- **Frame titles/subtitles** (eyebrow, headline under the bar): edit `roadmap/social/src/cards.ts`
- **Hero body text**: edit `roadmap/social/src/cards.ts` (title/subtitle) and `heroFeatures.ts` (feature tiles)
- **Timeline / board content**: edit `roadmap/data/*.ts` (same as the website)

## Architecture

```
roadmap/social/          ← Vite preview app (reuses .vitepress Vue components)
roadmap/social/dist/     ← built static HTML (capture target)
roadmap/social/out/     ← generated PNG/WebP (gitignored)
og/src/social/           ← Playwright capture (shares og:setup Chromium)
```

Playwright rules: see `.cursor/rules/og-playwright.mdc` — agents run capture with
`required_permissions: ["all"]`; never run `og:setup` or `playwright install`.
Preflight: `npm run og:preflight`.

## Tests

```bash
npx vitest run roadmap/social/src/__tests__/ og/src/social/__tests__/
# or the full CI suite:
npm run test:unit:ci
```

Covers card metadata, `?card=` routing, social frame markup, CLI arg parsing, and output paths — not browser capture (requires `og:setup`).

## Adding a new card later

1. Add an id to `SOCIAL_CARD_IDS` in `roadmap/social/src/cards.ts`
2. Add metadata in `SOCIAL_CARDS` and render it in `App.vue` inside a `<SocialCard>`
3. Add/adjust tests in `roadmap/social/src/__tests__/cards.spec.ts`
4. Re-run `npm run capture:social -- your-new-id`

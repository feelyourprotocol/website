# Images

Cover art is **required** for every exploration — it appears on topic cards, the home Latest section, and the exploration sidebar. The widget is the serious work; the image expresses what the protocol change *feels* like.

::: tip Generating cover art
Round-trip / add-exploration: the agent generates in the same phase (Template B from the signed-off core question unless you named a subject). Standalone: [cover-image skill](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/cover-image/SKILL.md) — you approve subject/mood first. Rules on this page always apply.
:::

## Format & files

| Property | Recommendation |
|----------|---------------|
| Format | WebP preferred |
| Size | 768×1024 portrait, 3:4 |
| **File weight** | **`image.webp` ≤ 300 KB** (cards and home Latest load this on every visit) |
| File | `src/explorations/<id>/image.webp` |
| Thumbnail | `image_small.webp` at **300×400**, typically ≤ 50 KB, for cards |

Import in `info.ts` as `image` and optional `imageSmall`.

## On the exploration page

The page always shows `image.webp` (not the thumbnail). How large it appears depends on layout:

- **No companion** (`rightPanel` unset) — set `imageBoxHeight` to `COVER_COLUMN_IMAGE_HEIGHT` (`48rem` in `src/explorations/layout.ts`) so the cover matches a typical left widget, not an uncapped 3:4 portrait.
- **Companion panel** (`rightPanel: true`) — set `imageBoxHeight` to about `16rem`–`19rem` so the cover stays compact above logs or a stepper.

Copying `imageBoxHeight: '16rem'` from a companion exploration onto a cover-only page leaves a postage stamp. Leaving it unset lets the cover dwarf the widget on a wide desktop. Agent rule: [exploration-design.mdc](https://github.com/feelyourprotocol/website/blob/main/.cursor/rules/exploration-design.mdc).

## Color rules (strict)

Allowed palette only:

1. **Full greyscale** (black → white)
2. **Shades of the exploration's topic color**

No other hues. Keep greyscale and topic color visually separate. Topic hues: `TOPICS.ts`.

## Style & composition

Abstract **technical illustration** — blueprint, sketch, pen-and-ink. Not photorealistic or cartoon.

- One focal point; generous white margins
- No text, labels, or watermarks
- Subtle Ethereum association (geometry, networks) — no prominent logos

## Social preview (OG)

Link cards (1200×630) are **generated**, not hand-drawn:

```bash
npm run generate:og:exploration -- eip-XXXX
```

Regenerate when title, `seoDescription`, topic, or cover changes. See `website/og/README.md`. This is not cover art.

## Quick reference

| Rule | Detail |
|------|--------|
| Colors | Greyscale + topic shades only |
| Lettering | None |
| Generate art | [cover-image skill](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/cover-image/SKILL.md) |
| Link previews | `npm run generate:og:exploration -- <id>` |

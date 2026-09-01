# Images

Cover art is **required** for every exploration — it appears on topic cards, the home Latest pair, and the exploration sidebar. The widget is the serious work; the image expresses what the protocol change *feels* like.

::: tip Generating cover art
Round-trip / add-exploration: the agent generates in the same phase (Template B from the signed-off core question unless you named a subject). Standalone: [cover-image skill](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/cover-image/SKILL.md) — you approve subject/mood first. Rules on this page always apply.
:::

## Format & files

| Property | Recommendation |
|----------|---------------|
| Format | WebP preferred |
| Size | 768×1024 portrait, 3:4 |
| File | `src/explorations/<id>/image.webp` |
| Thumbnail | Optional `image_small.webp` (~300px) for cards |

Import in `info.ts` as `image` and optional `imageSmall`.

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

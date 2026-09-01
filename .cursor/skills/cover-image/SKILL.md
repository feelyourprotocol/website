---
name: cover-image
description: >-
  Generate an exploration cover image (image.webp) following FYP art rules:
  topic hue + greyscale, technical illustration, no lettering. Use when adding
  an exploration (required) or when the user asks to create or replace cover art.
---

# Cover image

Executable playbook for **exploration cover art** (`src/explorations/<id>/image.webp`). Human-facing rules: [images.md](../../website-docs/contributing/images.md). Do not duplicate that page — read it for format and composition intent.

**OG/social cards are separate.** Never use Playwright OG output as cover art. OG: `npm run generate:og:exploration -- <id>` per [og-images.mdc](../rules/og-images.mdc).

## Human-ask gate

**Standalone** (human asked for cover only): before calling an image model, ask Template A vs B and subject/mood. Do not generate until they confirm (or say “fully AI-derived, you pick”).

**From add-exploration / round-trip:** cover is required in the same phase. Default **Template B** from signed-off `coreQuestion` + title unless the human already named a subject at GO. Do **not** insert an extra stop before generating. Still show the result in context (`npm run dev`) in the phase-2 report.

## Before generating

1. Read `info.ts` for `topic`, `title`, and spec link.
2. Resolve topic → color from `src/explorations/TOPICS.ts` (`TOPICS[topic].color`).
3. Look up hex range below (Tailwind default palette, shades 50–900).

## Topic hex ranges (for prompts)

| Topic ID | Color | Hex range (50 → 900) |
| --- | --- | --- |
| `scaling` | orange | `#fff7ed` → `#7c2d12` |
| `privacy` | yellow | `#fefce8` → `#713f12` |
| `ux` | blue | `#eff6ff` → `#1e3a8a` |
| `security` | green | `#f0fdf4` → `#14532d` |
| `robustness` | purple | `#faf5ff` → `#581c87` |
| `interoperability` | red | `#fef2f2` → `#7f1d1d` |

Prompt snippet form: `shades of {color} (hex range: {light} to {dark})`

## Color & composition (strict)

- Allowed: full greyscale **and** shades of the topic color only — no other hues.
- Keep greyscale and topic color visually separate (elements are grey **or** colored, not muddy mixes).
- Portrait 3:4, ~768×1024; abstract technical illustration (blueprint, pen-and-ink, etching).
- One focal point; generous white margins; subject fades at edges.
- No text, labels, watermarks; subtle Ethereum geometry OK — no prominent logos.

## Prompt templates

Replace `[TOPIC COLOR]`, `[LIGHTEST HEX]`, `[DARKEST HEX]` from the table above.

### Template A — human-chosen subject

```text
Create a portrait-format (3:4) abstract illustration in the style of an
architectural blueprint or industrial design sketch.

Subject: [SUBJECT FROM HUMAN]

Style and composition:
- Abstract, reduced — focus on ONE central action, detail, or movement
- Pen-and-ink drafting, technical etching, crosshatching
- The subject fades naturally into generous white margins at all edges
- Very subtle Ethereum association (faint geometric patterns, not logos)
- Cypherpunk / futurist mood
- No text, no lettering, no watermarks

Colors — strict:
- Greyscale tones (black, white, greys) AND [TOPIC COLOR]
  (hex range: [LIGHTEST HEX] to [DARKEST HEX]). No other hues.
- Use the color palette boldly and vividly across the full shade range
- Keep greyscale and color clearly separated
```

### Template B — AI-derived subject

```text
I'm creating a cover image for an interactive exploration of [EIP TITLE]
([EIP NUMBER]) on an Ethereum protocol education site.

The EIP in one sentence: [ONE-SENTENCE SUMMARY — confirmed by human]

Create a portrait-format (3:4) abstract illustration that visually represents
this protocol change. Choose an evocative subject — goal, architecture, or process.

Style and composition:
- Abstract, reduced — ONE central action, detail, or movement
- Architectural blueprint / industrial design sketch / pen-and-ink etching
- Generous white margins; subject fades at edges
- Very subtle Ethereum association — no prominent logos
- Cypherpunk / futurist mood
- No text, no lettering, no watermarks

Colors — strict:
- Greyscale AND [TOPIC COLOR] (hex range: [LIGHTEST HEX] to [DARKEST HEX])
- Bold vivid shades; greyscale and color clearly separated
```

## After generation

1. Save as WebP: `src/explorations/<id>/image.webp` (optional `image_small.webp` ~300px wide for cards).
2. Import in `info.ts`:

```typescript
import image from './image.webp'
// optional: import imageSmall from './image_small.webp'
```

3. Show the human the result in context (`npm run dev`) before treating as done.
4. Regenerate OG when metadata or cover changes: `npm run generate:og:exploration -- <id>`.

## Out of scope

- OG/Twitter card design (Playwright pipeline only)
- Non-cover site imagery

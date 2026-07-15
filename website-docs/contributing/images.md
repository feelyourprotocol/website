# Images

Each exploration can have a cover image that represents the protocol change visually. Images appear on the home page topic cards and on the topic overview pages. They are optional but strongly encouraged — they make the site more engaging and help visitors quickly identify explorations.

::: tip The fun part
Think of the image as the icing on the cake after building your exploration. The code and the widget are the serious work — the image is where you get to be artistic, experiment with AI tools, and create something visually striking. It's your chance to express what the protocol change *feels* like, not just what it does. Enjoy it!
:::

## Format & Size

### Allowed Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| **WebP** | `.webp` | Preferred — best compression-to-quality ratio |
| **PNG** | `.png` | Good for sharp lines and transparency |
| **JPEG** | `.jpg` / `.jpeg` | Fine for photographic or painterly styles |
| **SVG** | `.svg` | Great for vector illustrations, resolution-independent |

WebP is recommended and used by all existing explorations. Avoid formats like BMP, TIFF, or GIF.

### Dimensions & File Size

| Property | Recommendation |
|----------|---------------|
| **Orientation** | Portrait |
| **Aspect ratio** | 3:4 |
| **Resolution** | 768×1024 |
| **Minimum** | 512px on the shorter side |
| **Maximum** | 1536px on the longer side |
| **File size** | Under 200 KB (WebP), under 400 KB (PNG/JPEG) |

The image file goes into your exploration folder as `image.webp` (or `.png`, `.jpg`) and is imported in `info.ts`:

```typescript
import image from './image.webp'
import imageSmall from './image_small.webp'

export const INFO: Exploration = {
  // ...
  image,
  imageSmall, // optional — see Thumbnail below
  // ...
}
```

### Thumbnail (`image_small`)

Exploration pages use the full cover image; **home page topic cards**, **topic overview pages**, and similar compact layouts use a smaller variant when available.

| File | Role |
|------|------|
| `image.webp` (or `.jpg`, …) | Full cover — exploration sidebar and detail pages |
| `image_small.webp` | Optional thumbnail — same format, `_small` suffix |

Naming: if the cover is `image.webp`, the thumbnail is `image_small.webp`; for `image.jpg` use `image_small.jpg`.

| Property | Recommendation |
|----------|---------------|
| **Width** | ~300px (matches max display ~144–224px at 2× retina) |
| **Aspect ratio** | Same as cover |
| **File size** | Under 40 KB |

If `image_small` is omitted, compact layouts fall back to the full cover image.

## Color Palette

This is the one area with strict rules. The color palette for your image must be derived from the **topic color** assigned to your exploration. This keeps the site visually coherent across contributions.

### Allowed Colors

Every image may use:

1. **The full greyscale range** — black, white, and all greys in between
2. **Shades of the topic color** — from the lightest tint (50) to the deepest shade (900), including tones in between the Tailwind steps

No other hues are allowed. The image should feel monochromatic with the topic color as its accent.

### Topic Color Reference

Use this table to find the palette for your exploration's topic. Each topic includes a visual swatch, a hex table, and a **copy-paste snippet** you can drop straight into your AI image prompt.

#### Scaling — Orange

<div style="display:flex;gap:2px;margin:8px 0 4px">
  <div style="width:40px;height:28px;background:#fff7ed;border:1px solid #e5e7eb;border-radius:4px" title="#fff7ed (50)"></div>
  <div style="width:40px;height:28px;background:#ffedd5;border-radius:4px" title="#ffedd5 (100)"></div>
  <div style="width:40px;height:28px;background:#fed7aa;border-radius:4px" title="#fed7aa (200)"></div>
  <div style="width:40px;height:28px;background:#fdba74;border-radius:4px" title="#fdba74 (300)"></div>
  <div style="width:40px;height:28px;background:#fb923c;border-radius:4px" title="#fb923c (400)"></div>
  <div style="width:40px;height:28px;background:#f97316;border-radius:4px" title="#f97316 (500)"></div>
  <div style="width:40px;height:28px;background:#ea580c;border-radius:4px" title="#ea580c (600)"></div>
  <div style="width:40px;height:28px;background:#c2410c;border-radius:4px" title="#c2410c (700)"></div>
  <div style="width:40px;height:28px;background:#9a3412;border-radius:4px" title="#9a3412 (800)"></div>
  <div style="width:40px;height:28px;background:#7c2d12;border-radius:4px" title="#7c2d12 (900)"></div>
</div>

| Shade | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|-------|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| Hex | `#fff7ed` | `#ffedd5` | `#fed7aa` | `#fdba74` | `#fb923c` | `#f97316` | `#ea580c` | `#c2410c` | `#9a3412` | `#7c2d12` |

Prompt snippet:

```text
shades of orange (hex range: #fff7ed to #7c2d12)
```

#### Privacy — Yellow

<div style="display:flex;gap:2px;margin:8px 0 4px">
  <div style="width:40px;height:28px;background:#fefce8;border:1px solid #e5e7eb;border-radius:4px" title="#fefce8 (50)"></div>
  <div style="width:40px;height:28px;background:#fef9c3;border-radius:4px" title="#fef9c3 (100)"></div>
  <div style="width:40px;height:28px;background:#fef08a;border-radius:4px" title="#fef08a (200)"></div>
  <div style="width:40px;height:28px;background:#fde047;border-radius:4px" title="#fde047 (300)"></div>
  <div style="width:40px;height:28px;background:#facc15;border-radius:4px" title="#facc15 (400)"></div>
  <div style="width:40px;height:28px;background:#eab308;border-radius:4px" title="#eab308 (500)"></div>
  <div style="width:40px;height:28px;background:#ca8a04;border-radius:4px" title="#ca8a04 (600)"></div>
  <div style="width:40px;height:28px;background:#a16207;border-radius:4px" title="#a16207 (700)"></div>
  <div style="width:40px;height:28px;background:#854d0e;border-radius:4px" title="#854d0e (800)"></div>
  <div style="width:40px;height:28px;background:#713f12;border-radius:4px" title="#713f12 (900)"></div>
</div>

| Shade | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|-------|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| Hex | `#fefce8` | `#fef9c3` | `#fef08a` | `#fde047` | `#facc15` | `#eab308` | `#ca8a04` | `#a16207` | `#854d0e` | `#713f12` |

Prompt snippet:

```text
shades of yellow (hex range: #fefce8 to #713f12)
```

#### UX — Blue

<div style="display:flex;gap:2px;margin:8px 0 4px">
  <div style="width:40px;height:28px;background:#eff6ff;border:1px solid #e5e7eb;border-radius:4px" title="#eff6ff (50)"></div>
  <div style="width:40px;height:28px;background:#dbeafe;border-radius:4px" title="#dbeafe (100)"></div>
  <div style="width:40px;height:28px;background:#bfdbfe;border-radius:4px" title="#bfdbfe (200)"></div>
  <div style="width:40px;height:28px;background:#93c5fd;border-radius:4px" title="#93c5fd (300)"></div>
  <div style="width:40px;height:28px;background:#60a5fa;border-radius:4px" title="#60a5fa (400)"></div>
  <div style="width:40px;height:28px;background:#3b82f6;border-radius:4px" title="#3b82f6 (500)"></div>
  <div style="width:40px;height:28px;background:#2563eb;border-radius:4px" title="#2563eb (600)"></div>
  <div style="width:40px;height:28px;background:#1d4ed8;border-radius:4px" title="#1d4ed8 (700)"></div>
  <div style="width:40px;height:28px;background:#1e40af;border-radius:4px" title="#1e40af (800)"></div>
  <div style="width:40px;height:28px;background:#1e3a8a;border-radius:4px" title="#1e3a8a (900)"></div>
</div>

| Shade | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|-------|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| Hex | `#eff6ff` | `#dbeafe` | `#bfdbfe` | `#93c5fd` | `#60a5fa` | `#3b82f6` | `#2563eb` | `#1d4ed8` | `#1e40af` | `#1e3a8a` |

Prompt snippet:

```text
shades of blue (hex range: #eff6ff to #1e3a8a)
```

#### Security — Green

<div style="display:flex;gap:2px;margin:8px 0 4px">
  <div style="width:40px;height:28px;background:#f0fdf4;border:1px solid #e5e7eb;border-radius:4px" title="#f0fdf4 (50)"></div>
  <div style="width:40px;height:28px;background:#dcfce7;border-radius:4px" title="#dcfce7 (100)"></div>
  <div style="width:40px;height:28px;background:#bbf7d0;border-radius:4px" title="#bbf7d0 (200)"></div>
  <div style="width:40px;height:28px;background:#86efac;border-radius:4px" title="#86efac (300)"></div>
  <div style="width:40px;height:28px;background:#4ade80;border-radius:4px" title="#4ade80 (400)"></div>
  <div style="width:40px;height:28px;background:#22c55e;border-radius:4px" title="#22c55e (500)"></div>
  <div style="width:40px;height:28px;background:#16a34a;border-radius:4px" title="#16a34a (600)"></div>
  <div style="width:40px;height:28px;background:#15803d;border-radius:4px" title="#15803d (700)"></div>
  <div style="width:40px;height:28px;background:#166534;border-radius:4px" title="#166534 (800)"></div>
  <div style="width:40px;height:28px;background:#14532d;border-radius:4px" title="#14532d (900)"></div>
</div>

| Shade | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|-------|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| Hex | `#f0fdf4` | `#dcfce7` | `#bbf7d0` | `#86efac` | `#4ade80` | `#22c55e` | `#16a34a` | `#15803d` | `#166534` | `#14532d` |

Prompt snippet:

```text
shades of green (hex range: #f0fdf4 to #14532d)
```

#### Robustness — Purple

<div style="display:flex;gap:2px;margin:8px 0 4px">
  <div style="width:40px;height:28px;background:#faf5ff;border:1px solid #e5e7eb;border-radius:4px" title="#faf5ff (50)"></div>
  <div style="width:40px;height:28px;background:#f3e8ff;border-radius:4px" title="#f3e8ff (100)"></div>
  <div style="width:40px;height:28px;background:#e9d5ff;border-radius:4px" title="#e9d5ff (200)"></div>
  <div style="width:40px;height:28px;background:#d8b4fe;border-radius:4px" title="#d8b4fe (300)"></div>
  <div style="width:40px;height:28px;background:#c084fc;border-radius:4px" title="#c084fc (400)"></div>
  <div style="width:40px;height:28px;background:#a855f7;border-radius:4px" title="#a855f7 (500)"></div>
  <div style="width:40px;height:28px;background:#9333ea;border-radius:4px" title="#9333ea (600)"></div>
  <div style="width:40px;height:28px;background:#7e22ce;border-radius:4px" title="#7e22ce (700)"></div>
  <div style="width:40px;height:28px;background:#6b21a8;border-radius:4px" title="#6b21a8 (800)"></div>
  <div style="width:40px;height:28px;background:#581c87;border-radius:4px" title="#581c87 (900)"></div>
</div>

| Shade | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|-------|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| Hex | `#faf5ff` | `#f3e8ff` | `#e9d5ff` | `#d8b4fe` | `#c084fc` | `#a855f7` | `#9333ea` | `#7e22ce` | `#6b21a8` | `#581c87` |

Prompt snippet:

```text
shades of purple (hex range: #faf5ff to #581c87)
```

#### Interoperability — Red

<div style="display:flex;gap:2px;margin:8px 0 4px">
  <div style="width:40px;height:28px;background:#fef2f2;border:1px solid #e5e7eb;border-radius:4px" title="#fef2f2 (50)"></div>
  <div style="width:40px;height:28px;background:#fee2e2;border-radius:4px" title="#fee2e2 (100)"></div>
  <div style="width:40px;height:28px;background:#fecaca;border-radius:4px" title="#fecaca (200)"></div>
  <div style="width:40px;height:28px;background:#fca5a5;border-radius:4px" title="#fca5a5 (300)"></div>
  <div style="width:40px;height:28px;background:#f87171;border-radius:4px" title="#f87171 (400)"></div>
  <div style="width:40px;height:28px;background:#ef4444;border-radius:4px" title="#ef4444 (500)"></div>
  <div style="width:40px;height:28px;background:#dc2626;border-radius:4px" title="#dc2626 (600)"></div>
  <div style="width:40px;height:28px;background:#b91c1c;border-radius:4px" title="#b91c1c (700)"></div>
  <div style="width:40px;height:28px;background:#991b1b;border-radius:4px" title="#991b1b (800)"></div>
  <div style="width:40px;height:28px;background:#7f1d1d;border-radius:4px" title="#7f1d1d (900)"></div>
</div>

| Shade | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|-------|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| Hex | `#fef2f2` | `#fee2e2` | `#fecaca` | `#fca5a5` | `#f87171` | `#ef4444` | `#dc2626` | `#b91c1c` | `#991b1b` | `#7f1d1d` |

Prompt snippet:

```text
shades of red (hex range: #fef2f2 to #7f1d1d)
```

## Drawing Style

The visual style should lean towards **abstract technical illustration** rather than photorealistic rendering or cartoons. Think along these lines:

- **Architectural blueprints** — clean lines, measured precision, schematic layouts
- **Industrial design sketches** — product concepts, exploded views, annotated diagrams
- **Pen-and-ink drafting** — crosshatching, fine linework, hand-drawn texture
- **Etching / engraving** — dense parallel lines, high contrast, vintage technical feel

### Composition Rules

- **One focal point.** The image should concentrate on a single action, detail, or movement at its center. Avoid busy scenes with many competing elements — abstract and reduce.
- **White margins.** The subject should naturally fade or dissolve towards the edges so that generous white space surrounds it. The image borders should be purely white.
- **No lettering.** No text, labels, captions, or watermarks anywhere in the image.

### Color Separation

Keep greyscale tones and topic color tones clearly separate. Elements should be either drawn in black/grey/white *or* rendered in topic color shades — avoid muddying the two together. Within the allowed color palette, be **bold and vivid**: use the full range from light tints to deep shades for visual punch.

## Theming

### Ethereum Association

The image should evoke a **subtle** connection to Ethereum, its ecosystem, or decentralized technology — think geometric patterns reminiscent of blockchain structure, faint diamond shapes woven into the composition, or network-like line patterns. Avoid prominent Ethereum logos or brand marks; the association should feel organic, not stamped on.

### Mood & Aesthetic

Styles that work well with the technical illustration approach:

- **Cypherpunk** — encrypted transmissions, masked identities, circuit traces
- **Futurism** — kinetic forms, velocity, overlapping geometric planes
- **Solarpunk** — organic-meets-technical, optimistic infrastructure
- **Constructivism** — bold structure, angular composition, propaganda-poster energy

These are suggestions, not requirements. The key is that the image feels intentional and technically grounded, not generic or decorative.

## Finding a Subject

This is where the creative freedom kicks in. The hardest part is often deciding *what* to depict — but it's also the most rewarding. There's no single right answer; different people will find wildly different visual metaphors for the same protocol change, and that's exactly what makes the gallery interesting. Here are three approaches to get you started:

### Goal-Oriented

Visualize the *outcome* the protocol change aims for.

- "Post-Quantum Cryptography" → a lattice structure shielding a diamond
- "Scaling" → a network expanding outward from a central beacon
- "Privacy" → layered veils over a geometric identity

### Structure-Oriented

Depict the *architecture* described in the specification.

- "Proposer-Builder Separation" → two interlocking mechanisms, one assembling, one validating
- "PeerDAS" → a distributed mesh of nodes with data shards flowing between them
- "Account Abstraction" → a key morphing into multiple authentication pathways

### Process-Oriented

Illustrate the *flow* of how the change works.

- "Frame Transactions" → a figure moving through sequential frames, each transforming the state
- "Blob Transactions" → data parcels ascending from an execution layer into a beacon above
- "Gas Repricing" → a balance scale recalibrating under shifting weights

## AI Prompt Templates

Most images will be generated with AI tools (ChatGPT/DALL-E, Midjourney, Stable Diffusion, etc.). Don't be shy about iterating — generating a few variations and picking the one that clicks is part of the fun. Below are two ready-to-use prompt templates. Copy the **prompt snippet** from your topic's color section above and paste it into the `[TOPIC COLOR]` placeholder.

### Template A — You Choose the Subject

Use this when you have a specific visual idea for your exploration. Replace the placeholders:

```text
Create a portrait-format (3:4) abstract illustration in the style of an
architectural blueprint or industrial design sketch.

Subject: [YOUR SUBJECT DESCRIPTION — e.g. "a lattice-based cryptographic
shield emerging from intersecting geometric planes"]

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
- Keep greyscale and color clearly separated — elements are either
  drawn in black/grey OR rendered in color, not mixed together
```

**Example** (for an exploration in the **Scaling / Orange** topic):

```text
Create a portrait-format (3:4) abstract illustration in the style of an
architectural blueprint or industrial design sketch.

Subject: a distributed mesh network expanding outward from a central beacon
node, with data shards flowing between peers in concentric rings.

Style and composition:
- Abstract, reduced — focus on ONE central action, detail, or movement
- Pen-and-ink drafting, technical etching, crosshatching
- The subject fades naturally into generous white margins at all edges
- Very subtle Ethereum association (faint geometric patterns, not logos)
- Cypherpunk / futurist mood
- No text, no lettering, no watermarks

Colors — strict:
- Greyscale tones (black, white, greys) AND shades of orange
  (hex range: #fff7ed to #7c2d12). No other hues.
- Use the color palette boldly and vividly across the full shade range
- Keep greyscale and color clearly separated — elements are either
  drawn in black/grey OR rendered in color, not mixed together
```

### Template B — Fully AI-Derived

Use this when you want the AI to pick the subject based on the EIP title and summary. Just fill in the EIP details:

```text
I'm creating a cover image for an interactive exploration of [EIP TITLE]
([EIP NUMBER]) on an Ethereum protocol education site.

The EIP in one sentence: [ONE-SENTENCE SUMMARY OF THE EIP]

Create a portrait-format (3:4) abstract illustration that visually represents
this protocol change. Choose an evocative subject — it can represent the goal,
the internal architecture, or the process flow of the change.

Style and composition:
- Abstract, reduced — concentrate on ONE central action, detail, or movement
- Architectural blueprint / industrial design sketch / pen-and-ink etching
- The subject fades naturally into generous white margins at all edges
- Very subtle Ethereum association (faint geometric patterns woven into the
  composition — no prominent logos or brand marks)
- Cypherpunk / futurist mood
- No text, no lettering, no watermarks

Colors — strict:
- Greyscale tones (black, white, greys) AND [TOPIC COLOR]
  (hex range: [LIGHTEST HEX] to [DARKEST HEX]). No other hues.
- Use the color palette boldly and vividly across the full shade range
- Keep greyscale and color clearly separated — elements are either
  drawn in black/grey OR rendered in color, not mixed together
```

**Example** (for EIP-7883, **Robustness / Purple** topic):

```text
I'm creating a cover image for an interactive exploration of "ModExp Gas Cost
Increase" (EIP-7883) on an Ethereum protocol education site.

The EIP in one sentence: EIP-7883 recalibrates the gas cost formula for the
ModExp precompile to better reflect actual computation costs on modern hardware.

Create a portrait-format (3:4) abstract illustration that visually represents
this protocol change. Choose an evocative subject — it can represent the goal,
the internal architecture, or the process flow of the change.

Style and composition:
- Abstract, reduced — concentrate on ONE central action, detail, or movement
- Architectural blueprint / industrial design sketch / pen-and-ink etching
- The subject fades naturally into generous white margins at all edges
- Very subtle Ethereum association (faint geometric patterns woven into the
  composition — no prominent logos or brand marks)
- Cypherpunk / futurist mood
- No text, no lettering, no watermarks

Colors — strict:
- Greyscale tones (black, white, greys) AND shades of purple
  (hex range: #faf5ff to #581c87). No other hues.
- Use the color palette boldly and vividly across the full shade range
- Keep greyscale and color clearly separated — elements are either
  drawn in black/grey OR rendered in color, not mixed together
```

## Social Preview (OG Images)

Cover images (3:4 portrait) and social preview images (1200×630 landscape) serve different purposes. Cover art lives in your exploration folder; OG/Twitter cards are **generated** from HTML templates and shared metadata.

| Property | Detail |
|----------|--------|
| Size | 1200×630 (standard Open Graph / Twitter large card) |
| Format | WebP |
| Location | `public/og/explorations/<id>.webp` |
| Generator | `npm run generate:og:exploration -- <id>` (from `website/`) |
| Fallback | Site-wide `public/og/default.webp` until generated |

The template includes your exploration title, EIP label, `seoDescription`, topic badge, and cover image inset. Regenerate after changing any of those fields.

Topic pages use a separate template:

```bash
npm run generate:og:topic -- scaling
```

Output: `public/og/topics/<topicId>.webp`. Batch-regenerate everything with `npm run generate:og:all`.

The generator lives in the isolated `website/og/` package (Playwright). Install it once locally — see `website/og/README.md`.

## Quick Reference

| Rule | Detail |
|------|--------|
| Format | WebP preferred; PNG, JPEG, SVG also accepted |
| Cover | `image.webp` — 768×1024 recommended |
| Thumbnail | `image_small.webp` — optional ~300px for cards |
| File size | < 200 KB (WebP) or < 400 KB (PNG/JPEG) |
| Colors | Greyscale + topic color shades only; keep the two clearly separated |
| Composition | Abstract, one focal point, generous white margins at edges |
| Style | Technical illustration — blueprints, sketches, etching |
| Theme | Subtle Ethereum association; cypherpunk / futurist mood optional |
| Lettering | None — no text, labels, or watermarks |
| File location | `src/explorations/<id>/image.webp` |

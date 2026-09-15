# X profile banner

Committed master for **@FeelEthereum** profile header (1500×500, 3:1).

| File | Description |
| ---- | ----------- |
| `profile-banner.png` | Upload to X → Profile → Edit profile → Header image |
| `profile-banner.webp` | Same render, WebP archive |
| `panorama.png` | Wide background illustration (Vue layer, not uploaded alone) |

## Regenerate

From `website/` (requires one-time `npm run og:setup`):

```bash
npm run capture:twitter-banner
```

Preview layout in browser (dev overlays show avatar / crop safe zones):

```bash
npm run social:dev
# http://localhost:5175/?card=twitter-banner
```

Capture uses `?mode=capture` (no guide overlays).

Copy and layout: `roadmap/social/src/cards.ts` (`twitter-banner`) and `TwitterBannerCard.vue`. Featured exploration covers are static — update when home **Latest** three change (`FEATURED_EXPLORATION_IDS` in `src/views/homeCatalog.ts`).

Safe zone: keep critical type and covers in the centered strip (see CSS `--` offsets in `social.css`); lower-left ~260×260 is reserved for the circular avatar on desktop.

## Background art

Replace `panorama.png` when refreshing the illustration (greyscale + FYP purple/cyan only; no text or figures). Re-run capture after changing the master.

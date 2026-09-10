# YouTube channel banner

Committed master for **@FeelEthereum** channel art (2560×1440, YouTube-recommended).

| File | Description |
| ---- | ----------- |
| `channel-banner.png` | Upload to YouTube Studio → Customisation → Banner image |
| `channel-banner.webp` | Same render, WebP archive |

## Regenerate

From `website/` (requires one-time `npm run og:setup`):

```bash
npm run capture:youtube-banner
```

Preview layout in browser:

```bash
npm run social:dev
# http://localhost:5175/?card=youtube-banner
```

Copy and preview panels are in `roadmap/social/src/cards.ts` (`youtube-banner`) and `YouTubeBannerCard.vue`. Shorts-style preview tiles are static — update when the featured EIP set changes.

Safe zone: critical text sits in the centered 1546×423 strip (see CSS `--` offsets in `social.css`).

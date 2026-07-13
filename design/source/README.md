# Design source assets

Raw masters — **not** served directly and **not** imported by the app at runtime. Process into production assets (`src/logo.png`, `community-token/public/`, etc.) as needed.

| You have… | Put it here | Production copy ends up in… |
| --------- | ----------- | --------------------------- |
| Logos, brand lockups | `design/source/logos/<flavor>/` | App `src/` or relevant `public/` |
| Exploration cover art (working files) | `src/explorations/<id>/` | Bundled via `info.ts` |
| Feature art (ice cream, etc.) | `src/<feature>/assets/` | Bundled or `public/<feature>/` |
| OG / social cards | — | `public/og/` via `npm run generate:og:*` |

## Logos

One folder per flavor under `design/source/logos/`. Each folder holds the same four tiers:

```text
logos/<flavor>/{master,compact,small,tiny}.png
```

| Folder | Description |
| ------ | ----------- |
| `with-circle` | Circular badge, white fill, black border |
| `with-circle-on-transparent` | Same badge, transparent outside the ring |
| `icon` | Network mark only, opaque background |
| `icon-on-transparent` | Network mark only, transparent background |
| `community-site` | Community token site brand sheet |

### Size tiers

Square PNGs, derived from `master.png` (2048×2048) via Lanczos downscale.

| File | Target size | Pixels |
| ---- | ----------- | ------ |
| `master.png` | ~4–6 MB | 2048 |
| `compact.png` | ~1–2 MB | 1433 |
| `small.png` | ~400–700 KB | 900 (820 for `community-site`) |
| `tiny.png` | ~50–120 KB | 320 |

### Regenerate derivatives

Requires [ImageMagick](https://imagemagick.org/) (`magick`). From `website/`:

```bash
FLAVOR=design/source/logos/icon
PX=1433   # compact — 900 for small, 320 for tiny (820 for community-site/small)

magick "$FLAVOR/master.png" -filter Lanczos -resize ${PX}x${PX} \
  -strip -define png:compression-level=9 "$FLAVOR/compact.png"
```

After changing a master, re-run for every tier. Note production paths in your PR if the visible logo changed.

### Transparency (`icon-on-transparent`, `with-circle-on-transparent`)

AI exports may bake a checkerboard into RGB instead of alpha. Check / fix:

```bash
node scripts/process-logo-transparency.mjs analyze design/source/logos/
node scripts/process-logo-transparency.mjs fix design/source/logos/icon-on-transparent/master.png
node scripts/process-logo-transparency.mjs fix design/source/logos/with-circle-on-transparent/master.png
```

Then regenerate `compact` / `small` / `tiny`. Script uses **sharp** from `og/node_modules` (`npm install` in `website/og/` once).

# Ice Cream Week

Temporary home-page gag (see [Special Actions overview](/special-actions/)): a meme ice cream stand where visitors buy a scoop with **$FYP on Base** and receive a **soulbound NFT** receipt.

::: info Archived on home (July 2026)
The stand is **off the home page**. **IceCreamStand** remains on Base; `public/ice-cream/` metadata URLs stay live for soulbound receipts. Code lives in `src/ice-cream/` for reference and possible reuse.
:::

## Scope

| Item | Detail |
| ---- | ------ |
| Duration | ~1–2 weeks (“Ice Cream Week”) |
| Network | Base mainnet (chain ID `8453`) |
| Token | FYP `0x8eae800ff67778057941792acdbab29904962ba3` |
| Price | 10 FYP per scoop |
| **Contract** | `IceCreamStand` — [`0xac39d6219C5e45Ba37C64F1604919ff80040eF7e`](https://basescan.org/address/0xac39d6219C5e45Ba37C64F1604919ff80040eF7e) |
| Revenue wallet | FYP Special Actions `0x4AEef6965A4cBcddb2e96555dCD0cB1afA7Bd202` ([Base](https://basescan.org/address/0x4AEef6965A4cBcddb2e96555dCD0cB1afA7Bd202)) — separate from main treasury |
| NFT | ERC-1155 soulbound receipt (per vendor `nftId`) |

## On-chain deployment (Base mainnet)

Public record for **IceCreamStand** — also mirrored in `src/ice-cream/constants.ts` and `contracts/ice-cream-stand/README.md`.

| Field | Value |
| ----- | ----- |
| Contract | [`0xac39d6219C5e45Ba37C64F1604919ff80040eF7e`](https://basescan.org/address/0xac39d6219C5e45Ba37C64F1604919ff80040eF7e) |
| Deploy transaction | [`0xa537550cb1a54230c652c34838e60dcdd45249d973c9fa22fe5759bca0e42e86`](https://basescan.org/tx/0xa537550cb1a54230c652c34838e60dcdd45249d973c9fa22fe5759bca0e42e86) |
| Block | `47812253` |
| Owner | `0x4AEef6965A4cBcddb2e96555dCD0cB1afA7Bd202` (FYP Special Actions wallet) |
| FYP token | `0x8eAE800Ff67778057941792aCdBAB29904962bA3` |
| Scoop revenue | `0x4AEef6965A4cBcddb2e96555dCD0cB1afA7Bd202` (immutable in contract) |
| Metadata base URI | `https://feelyourprotocol.org/ice-cream/metadata/{id}.json` |
| Allowed token IDs | `2, 3, 9, 10, 13, 14, 16, 18` |

Source verification on Basescan is optional transparency (not required for purchases). If needed: `forge verify-contract` — see [contract README](https://github.com/feelyourprotocol/website/tree/main/contracts/ice-cream-stand#verify-failed-etherscan-api-v2).

## Architecture

```
src/ice-cream/
├── index.ts                 # export IceCreamHomeSection only
├── IceCreamHomeSection.vue  # SectionLabel + widget
├── IceCreamWidget.vue       # UI + flow states
├── useIceCreamStand.ts      # composable (phase, vendor, purchase)
├── purchasePort.ts          # IceCreamPurchasePort — viem later
├── memes.ts                 # vendor + NFT image pairs
├── assets/                  # vendor WebP + nft/ PNG masters
└── __tests__/               # module + IceCreamHomeSection.spec.ts (keep when archived)
```

**Home integration (single point — currently removed):**

```vue
import { IceCreamHomeSection } from '@/ice-cream'
<!-- … -->
<IceCreamHomeSection />
```

To **activate:** add the import and `<IceCreamHomeSection />` in `HomeView.vue` (above Latest).

To **deactivate:** remove those two lines only. Keep `src/ice-cream/` and its tests. Do **not** add special-action assertions to `HomeView.spec.ts` — home placement is covered by `IceCreamHomeSection.spec.ts`. See [Special Actions lifecycle](/special-actions/#lifecycle).

## Purchase flow (phases)

1. **idle** — random vendor, promotional copy, Buy / Different vendor
2. **purchasing** — wallet + transfer + mint (simulated in round 1)
3. **success** — soulbound NFT art (same PNG as on-chain master)
4. **error** — humorous FYP-side feedback + retry

The `IceCreamPurchasePort` interface is the seam for real wallet code:

```typescript
interface IceCreamPurchasePort {
  buy(meme: IceCreamMeme): Promise<PurchaseOutcome>
}
```

Round 1 used `createSimulatedPurchasePort()` (delay + configurable outcome). Production uses `createViemPurchasePort()` via `createDefaultPurchasePort()` — MetaMask on Base, `approve` + `buyScoop`.

## Meme data

Each entry in `memes.ts`:

| Field | Purpose |
| ----- | ------- |
| `vendorImg` | Landscape stand banner (`{id}-vendor.webp`) |
| `successImg` | Soulbound receipt — `{id}-master.png` (shared with on-chain metadata) |
| `nftId` | ERC-1155 token id |
| `quote` | In-character sales pitch |
| `flavor` | Collectible flavor name |

## Meme & NFT assets

Notes for creating vendor banners and pixel NFTs (image generators / AI prompts).

### Meme identity (both assets)

Every vendor pair should read as the **same joke** in two formats: a cinematic stand and a wallet-sized scoop.

| Rule | Detail |
| ---- | ------ |
| **Character** | Keep the meme's recognizable look, palette, and focal character. |
| **Recontext** | Original meme energy, but as an ice cream pitch. |
| **Text in images** | **English only.** Short, legible signage. No `$` or fiat. **Price lives in the UI** (`10 FYP`) — omit from stand art if easier. |
| **Continuity** | The scoop the vendor holds in the stand **is** the NFT. |

### Vendor banner — `{id}-vendor.webp`

Wide landscape storefront (`vendorImg`); aspect ratio follows source art (~16:9).

- Meme character **behind a stand**, facing the viewer — no customer in frame.
- **Signage:** promo line + tip jar **“FYP TOKEN PAYMENTS”**. Price board optional.
- Vendor **holds the exact scoop** that becomes the NFT.

| Property | Value |
| -------- | ----- |
| **File** | `src/ice-cream/assets/{id}-vendor.webp` |
| **Format** | WebP q85 or PNG |
| **Size** | ~1024 px wide; keep headroom |
| **Reference** | `this-is-fine-vendor.webp`, 1024×571, ~96 KB |

### Soulbound NFT — `assets/nft/{id}-master.png`

Same PNG for **on-chain metadata** and the **success screen**.

| Property | Value |
| -------- | ----- |
| **Native** | 64×64 px pixel grid → `{id}-native.png` |
| **Master** | 512×512, nearest-neighbor upscale → `{id}-master.png` |
| **Style** | 8-bit / CryptoPunks; transparent PNG OK; no text in art |
| **Reference** | This is Fine: 64×64 → 512×512, ~1.3 KB |

Metadata template (`metadata/{tokenId}.json`):

Hosted at deploy time under `public/ice-cream/` (Vite static assets):

| Path | Purpose |
| ---- | ------- |
| `public/ice-cream/metadata/{id}.json` | On-chain `uri(tokenId)` target |
| `public/ice-cream/images/{slug}-master.png` | NFT image referenced in JSON |

Source copies live in `src/ice-cream/assets/nft/metadata/` — keep in sync when regenerating art.

```json
{
  "name": "FYP Ice Cream — Smoky Resilience Ripple",
  "description": "Soulbound receipt for one scoop from Feel Your Protocol Ice Cream Week. Non-transferable summer gag on Base.",
  "image": "https://feelyourprotocol.org/ice-cream/images/this-is-fine-master.png",
  "external_url": "https://feelyourprotocol.org/",
  "attributes": [
    { "trait_type": "Vendor", "value": "This is Fine Dog" },
    { "trait_type": "Flavor", "value": "Smoky Resilience Ripple" },
    { "trait_type": "Season", "value": "Ice Cream Week 2026" },
    { "trait_type": "Soulbound", "value": "Yes" }
  ]
}
```

## Boundaries

- **No imports** from `community-token/` or treasury modules into `ice-cream/`
- **No shared eComponents** unless reused elsewhere later
- Generic libs (`viem`, optional `wagmi`) only when wallet integration lands

## Tests

```bash
npm run test:unit -- src/ice-cream
```

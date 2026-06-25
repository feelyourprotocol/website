import { ICE_CREAM_PRICE_FYP } from './constants'
import pepeNft from './assets/nft/pepe-master.png'
import pepeVendor from './assets/pepe-vendor.webp'
import dogeNft from './assets/nft/doge-master.png'
import dogeVendor from './assets/doge-vendor.webp'
import neonCatNft from './assets/nft/neon-cypher-cat-master.png'
import neonCatVendor from './assets/neon-cypher-cat-vendor.webp'
import thisIsFineNft from './assets/nft/this-is-fine-master.png'
import thisIsFineVendor from './assets/this-is-fine-vendor.webp'
import type { IceCreamMeme } from './types'

export const ICE_CREAM_MEMES: IceCreamMeme[] = [
  {
    id: 'this-is-fine',
    name: 'This is Fine Dog',
    quote:
      'Everything is perfectly normal here. The room is warm, the batch is limited, and the scoops ' +
      'are served at exactly the temperature the chart deserves. This is fine.',
    flavor: 'Smoky Resilience Ripple',
    flavorBlurb:
      'Still melting, still fine. Flames add crunch. One soulbound scoop — non-transferable, like your conviction.',
    successLine:
      'The dog slides the cone across the counter with a calm paw. The room keeps burning. The receipt stays yours on Base.',
    vendorImg: thisIsFineVendor,
    successImg: thisIsFineNft,
    priceFyp: ICE_CREAM_PRICE_FYP,
    nftId: 1,
  },
  {
    id: 'doge',
    name: 'Doge',
    quote:
      'Much artisanal. Very churn. So Base. Original internet Shiba behind the counter — tip jar takes $FYP, ' +
      'wow not optional.',
    flavor: 'Much Vanilla Wow',
    flavorBlurb: 'Very cold. Such cream. One soulbound scoop per wallet — much receipt, very yours.',
    successLine: 'Much minted. Very cone. So soulbound. Wow — show it off, it stays on Base forever.',
    vendorImg: dogeVendor,
    successImg: dogeNft,
    priceFyp: ICE_CREAM_PRICE_FYP,
    nftId: 3,
  },
  {
    id: 'pepe',
    name: 'Pepe',
    quote:
      'Rain on the window, mint-green in the cup. Cozy scoops for grey evenings — wrap up, pay in $FYP, ' +
      'feels good man.',
    flavor: 'Comfy Frog Ripple',
    flavorBlurb:
      'Blanket-soft serve for soft nights. One soulbound scoop — stay comfy, stay on-chain.',
    successLine:
      'Feels good, man. Pepe passes you the cone. Non-transferable, infinitely cozy — yours on Base.',
    vendorImg: pepeVendor,
    successImg: pepeNft,
    priceFyp: ICE_CREAM_PRICE_FYP,
    nftId: 4,
  },
  {
    id: 'neon-cypher-cat',
    name: 'Neon Cypher Cat',
    quote:
      'Encrypted vanilla, Base-chilled. Hand-scooped by a cat who read the whitepaper twice — ciphertext ' +
      'sprinkles, purring mempool, $FYP only at the counter.',
    flavor: 'Encrypted Vanilla Beam',
    flavorBlurb:
      'Zero-knowledge sprinkles. Glowing receipt. One soulbound scoop — decrypt at your own risk.',
    successLine:
      'Slow blink. Receipt minted. The beam is soulbound — flash the neon cone, keep your keys on Base.',
    vendorImg: neonCatVendor,
    successImg: neonCatNft,
    priceFyp: ICE_CREAM_PRICE_FYP,
    nftId: 2,
  },
]

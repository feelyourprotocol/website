import clownVendor from './assets/clown-vendor.webp'
import dealWithItVendor from './assets/deal-with-it-vendor.webp'
import dogeVendor from './assets/doge-vendor.webp'
import galaxyBrainVendor from './assets/galaxy-brain-vendor.webp'
import laserEyesVendor from './assets/laser-eyes-vendor.webp'
import neonCatVendor from './assets/neon-cypher-cat-vendor.webp'
import clownNft from './assets/nft/clown-master.png'
import dealWithItNft from './assets/nft/deal-with-it-master.png'
import dogeNft from './assets/nft/doge-master.png'
import galaxyBrainNft from './assets/nft/galaxy-brain-master.png'
import laserEyesNft from './assets/nft/laser-eyes-master.png'
import neonCatNft from './assets/nft/neon-cypher-cat-master.png'
import partyParrotNft from './assets/nft/party-parrot-master.png'
import monkeNft from './assets/nft/return-to-monke-master.png'
import partyParrotVendor from './assets/party-parrot-vendor.webp'
import monkeVendor from './assets/return-to-monke-vendor.webp'
import { ICE_CREAM_PRICE_FYP } from './constants'
import type { IceCreamMeme } from './types'

export const ICE_CREAM_MEMES: IceCreamMeme[] = [
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
  {
    id: 'doge',
    name: 'Doge',
    quote:
      'Much artisanal. Very churn. So Base. Original internet Shiba behind the counter — tip jar takes $FYP, ' +
      'wow not optional.',
    flavor: 'Much Vanilla Wow',
    flavorBlurb:
      'Very cold. Such cream. One soulbound scoop per wallet — much receipt, very yours.',
    successLine:
      'Much minted. Very cone. So soulbound. Wow — show it off, it stays on Base forever.',
    vendorImg: dogeVendor,
    successImg: dogeNft,
    priceFyp: ICE_CREAM_PRICE_FYP,
    nftId: 3,
  },
  {
    id: 'clown',
    name: 'Clown Makeup',
    quote:
      'You said you would buy the dip. Welcome to the counter, honk. Full makeup, full cope — ' +
      '$FYP or walk away the same clown.',
    flavor: 'Self-Own Surprise Swirl',
    flavorBlurb: 'Rainbow chaos scoop. One soulbound receipt — honk if you minted.',
    successLine: 'Honk. Receipt minted. Soulbound clown cone on Base — you asked for this.',
    vendorImg: clownVendor,
    successImg: clownNft,
    priceFyp: ICE_CREAM_PRICE_FYP,
    nftId: 9,
  },
  {
    id: 'galaxy-brain',
    name: 'Galaxy Brain',
    quote:
      'Big brain energy, frozen neurons. IQ rises, wallet shrinks — $FYP well spent at the ' +
      'cosmic gelato counter.',
    flavor: 'Cosmic Brainfreeze Beam',
    flavorBlurb: 'Purple nebula scoop. Soulbound enlightenment — non-transferable.',
    successLine: 'Brain expands. Receipt minted. Galaxy-brain cone locked on Base forever.',
    vendorImg: galaxyBrainVendor,
    successImg: galaxyBrainNft,
    priceFyp: ICE_CREAM_PRICE_FYP,
    nftId: 10,
  },
  {
    id: 'return-to-monke',
    name: 'Return to Monke',
    quote:
      'Reject humanity. Return to monke. Banana notes acceptable. Jungle stand, $FYP only — ' +
      'no civilization required.',
    flavor: 'Banana Humanity Split',
    flavorBlurb: 'Monkey scoop, banana pixel. Soulbound — civilization not included.',
    successLine: 'Monke approves. Receipt minted. Return to Base; stay monke.',
    vendorImg: monkeVendor,
    successImg: monkeNft,
    priceFyp: ICE_CREAM_PRICE_FYP,
    nftId: 13,
  },
  {
    id: 'laser-eyes',
    name: 'Laser Eyes Maxi',
    quote:
      'Laser eyes ON. Orange scoop incoming. Bitcoin maxi summer service — $FYP accepted, ' +
      'few understand the cone.',
    flavor: 'Laser Orange Maxi Beam',
    flavorBlurb: 'Orange pill scoop, red beams. Soulbound — have fun staying scoopless.',
    successLine: 'Lasers fire. Receipt minted. Soulbound maxi cone — locked on Base.',
    vendorImg: laserEyesVendor,
    successImg: laserEyesNft,
    priceFyp: ICE_CREAM_PRICE_FYP,
    nftId: 14,
  },
  {
    id: 'party-parrot',
    name: 'Party Parrot',
    quote:
      'FULL SEND. Rainbow feathers, tropical beats, scoops that dance. $FYP at the counter — ' +
      'squawk if you minted.',
    flavor: 'Full Send Squawk Split',
    flavorBlurb: 'Neon feathers, confetti crunch. One soulbound scoop — party never stops on Base.',
    successLine: 'Parrot spins. Receipt minted. Soulbound party cone — full send on Base.',
    vendorImg: partyParrotVendor,
    successImg: partyParrotNft,
    priceFyp: ICE_CREAM_PRICE_FYP,
    nftId: 16,
  },
  {
    id: 'deal-with-it',
    name: 'Deal With It',
    quote:
      'Sunglasses drop. Confidence rises. Cool scoops for cool wallets — $FYP, no questions, ' +
      'deal with it.',
    flavor: 'Pixel Shade Crunch',
    flavorBlurb:
      '8-bit shades, zero chill needed. One soulbound scoop — transfer is not your problem.',
    successLine: 'Shades slide down. Receipt minted. Soulbound cool cone — deal with it on Base.',
    vendorImg: dealWithItVendor,
    successImg: dealWithItNft,
    priceFyp: ICE_CREAM_PRICE_FYP,
    nftId: 18,
  },
]

import type { Exploration } from '@/explorations/REGISTRY'
import { Tag } from '@/explorations/TAGS'

import image from './image.webp'

export const INFO: Exploration = {
  id: 'eip-7883',
  path: '/eip-7883-modexp-gas-cost-increase',
  title: 'EIP-7883 ModExp Gas Cost Increase',
  seoDescription:
    'EIP-7883 ModExp gas cost increase — interactive look at Ethereum precompile gas recalibration and its security motivation.',
  infoURL: 'https://eips.ethereum.org/EIPS/eip-7883',
  topic: 'robustness',
  timeline: 'fusaka',
  tags: [Tag.GasCosts, Tag.Precompiles],
  image,
  introText:
    '<b>How are ModExp gas costs changing with Fusaka?</b> ' +
    'EIP-7883 replaces the ModExp precompile gas formula with one that better reflects real ' +
    'computational cost — especially for larger inputs. EIP-7823 (same fork) tightens allowed ' +
    'input bounds.',
  usageText:
    'Pick an example preset or enter your own ModExp input hex. Values around 32 bytes are ' +
    'especially interesting — that size shows up often when verifying RSA signatures in ' +
    'airdrop contracts. Compare the before/after gas costs side by side.',
  creatorName: 'HolgerD77',
  creatorURL: 'https://x.com/HolgerD77',
  poweredBy: [{ name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' }],
}

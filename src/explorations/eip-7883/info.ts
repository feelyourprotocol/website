import type { Exploration } from '@/explorations/REGISTRY'

import { CANONICAL } from './canonical'
import image from './image.webp'
import imageSmall from './image_small.webp'

export const INFO: Exploration = {
  id: CANONICAL.identity.id,
  path: '/eip-7883-modexp-gas-cost-increase',
  title: CANONICAL.identity.name,
  seoDescription:
    'EIP-7883 ModExp gas cost increase — interactive look at Ethereum precompile gas recalibration and its security motivation.',
  infoURL: CANONICAL.identity.specUrl,
  topic: CANONICAL.taxonomy.topic,
  timeline: CANONICAL.taxonomy.timeline,
  tags: CANONICAL.taxonomy.tags,
  image,
  imageSmall,
  coreQuestion: CANONICAL.question.coreQuestion,
  mcpDocsStatus: CANONICAL.mcp.docsStatus,
  introText:
    `<b>${CANONICAL.question.coreQuestion}</b> ` +
    'EIP-7883 replaces the ModExp precompile gas formula with one that better reflects real ' +
    'computational cost — especially for larger inputs. EIP-7823 (same fork) tightens allowed ' +
    'input bounds.',
  usageText:
    'Pick an example preset or enter your own ModExp input hex. Values around 32 bytes are ' +
    'especially interesting — that size shows up often when verifying RSA signatures in ' +
    'airdrop contracts. Compare the before/after gas costs side by side. The ' +
    '<b>1025-byte invalid</b> example shows EIP-7823 rejection on Osaka.',
  creatorName: 'HolgerD77',
  creatorURL: 'https://x.com/HolgerD77',
  poweredBy: [{ name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' }],
}

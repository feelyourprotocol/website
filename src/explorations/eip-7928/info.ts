import type { Exploration } from '@/explorations/REGISTRY'

import { CANONICAL } from './canonical'
import image from './image.webp'
import imageSmall from './image_small.webp'

export const INFO: Exploration = {
  id: CANONICAL.identity.id,
  path: '/eip-7928-block-level-access-lists',
  title: CANONICAL.identity.name,
  seoDescription:
    'Explore Ethereum block-level access lists (BAL) with EIP-7928 — interactive walkthrough of block access patterns and blockAccessListHash.',
  infoURL: CANONICAL.identity.specUrl,
  topic: CANONICAL.taxonomy.topic,
  timeline: CANONICAL.taxonomy.timeline,
  tags: CANONICAL.taxonomy.tags,
  image,
  imageSmall,
  imageBoxHeight: '19rem',
  rightPanel: true,
  introText:
    `<b>${CANONICAL.question.coreQuestion}</b> ` +
    'EIP-7928 adds a block-level access list (BAL): a structured record of every balance, nonce, ' +
    'code, and storage touch during block execution. The list is hashed into ' +
    '<code>blockAccessListHash</code> in the block header.',
  usageText:
    'Work through the curriculum steps in order — each builds on the previous one. Read the ' +
    'scenario summary, then press <b>Run block</b>. The highlighted panel shows what changed in ' +
    'the BAL; expand the JSON on the right for the full structure.',
  creatorName: 'HolgerD77',
  creatorURL: 'https://x.com/HolgerD77',
  poweredBy: [{ name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' }],
}

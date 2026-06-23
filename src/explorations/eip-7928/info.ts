import type { Exploration } from '@/explorations/REGISTRY'
import { Tag } from '@/explorations/TAGS'

import image from './image.webp'

export const INFO: Exploration = {
  id: 'eip-7928',
  path: '/eip-7928-block-level-access-lists',
  title: 'EIP-7928 Block Level Access Lists',
  seoDescription:
    'Explore Ethereum block-level access lists (BAL) with EIP-7928 — interactive walkthrough of block access patterns and blockAccessListHash.',
  infoURL: 'https://eips.ethereum.org/EIPS/eip-7928',
  topic: 'scaling',
  timeline: 'glamsterdam',
  tags: [Tag.BAL, Tag.EVM],
  image,
  imageBoxHeight: '19rem',
  rightPanel: true,
  introText:
    '<b>What does the block commit to besides state root?</b> ' +
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

import type { Exploration } from '@/explorations/REGISTRY'
import { Tag } from '@/explorations/TAGS'

import image from './image.png'

export const INFO: Exploration = {
  id: 'eip-8141',
  path: '/eip-8141-frame-transactions',
  title: 'EIP-8141 Frame Transactions',
  infoURL: 'https://eips.ethereum.org/EIPS/eip-8141',
  topic: 'ux',
  timeline: 'research',
  tags: [Tag.AccountAbstraction, Tag.PostQuantum],
  added: '2026-03-24 13:20',
  image,
  introText:
    '<b>What are Frame Transactions and why do they matter?</b> ' +
    'Frame transactions (EIP-8141) introduce a flexible new transaction type that decouples ' +
    'validation and gas payment from the traditional ECDSA signature scheme. This opens the ' +
    'door to post-quantum secure authentication, native account abstraction, and user-defined ' +
    'verification logic — all at the protocol level.',
  usageText:
    'This exploration is under active development. It will provide an interactive transaction ' +
    'composer letting you assemble frame transactions, inspect state transitions, and run them ' +
    'against demo accounts — powered by real EVM execution in the browser.',
  creatorName: 'HolgerD77',
  creatorURL: 'https://x.com/HolgerD77',
  poweredBy: [{ name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' }],
}

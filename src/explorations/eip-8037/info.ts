import { COVER_COLUMN_IMAGE_HEIGHT } from '@/explorations/layout'
import type { Exploration } from '@/explorations/REGISTRY'

import { CANONICAL } from './canonical'
import image from './image.webp'
import imageSmall from './image_small.webp'

export const INFO: Exploration = {
  id: CANONICAL.identity.id,
  path: '/eip-8037-state-creation-gas',
  title: CANONICAL.identity.name,
  seoDescription:
    'EIP-8037 state-creation gas — see why a 21,000 gas limit is not enough for a first-touch ETH transfer on Amsterdam, and how execution vs state gas split.',
  infoURL: CANONICAL.identity.specUrl,
  topic: CANONICAL.taxonomy.topic,
  timeline: CANONICAL.taxonomy.timeline,
  tags: CANONICAL.taxonomy.tags,
  image,
  imageSmall,
  coreQuestion: CANONICAL.question.coreQuestion,
  mcpDocsStatus: CANONICAL.mcp.docsStatus,
  imageBoxHeight: COVER_COLUMN_IMAGE_HEIGHT,
  introText:
    `<b>${CANONICAL.question.coreQuestion}</b> ` +
    'EIP-8037 splits gas into an <b>execution</b> dimension and a <b>state</b> dimension. ' +
    'Creating a new account (or a new storage slot) charges state gas — about 183,600 for a ' +
    'first-touch transfer — on top of the familiar 21,000. Osaka still fits in 21,000.',
  usageText:
    'The default run is Amsterdam + first-touch + a <b>recommended</b> gas limit, so the ' +
    'transfer succeeds and the two bars appear with a 21,000 marker. Switch to ' +
    '<b>21,000</b> to see the out-of-gas failure wallets still hit. Try Osaka, or a funded ' +
    'recipient, to watch the state bar collapse.',
  creatorName: 'HolgerD77',
  creatorURL: 'https://x.com/HolgerD77',
  poweredBy: [{ name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' }],
}

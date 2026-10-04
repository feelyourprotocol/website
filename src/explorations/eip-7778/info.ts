import { COVER_COLUMN_IMAGE_HEIGHT } from '@/explorations/layout'
import type { Exploration } from '@/explorations/REGISTRY'

import { CANONICAL } from './canonical'
import image from './image.webp'
import imageSmall from './image_small.webp'

export const INFO: Exploration = {
  id: CANONICAL.identity.id,
  path: '/eip-7778-block-gas-accounting',
  title: CANONICAL.identity.name,
  seoDescription:
    'EIP-7778 block gas accounting — a storage-clear refund still lowers what you pay, but on Glamsterdam the block keeps counting the full gas.',
  infoURL: CANONICAL.identity.specUrl,
  specDate: CANONICAL.identity.specDate,
  specStatus: CANONICAL.identity.status,
  testReleaseUrl: CANONICAL.identity.testReleaseUrl,
  testReleaseName: CANONICAL.identity.testReleaseName,
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
    'EIP-7778 keeps the refund on your bill. The block still counts the gas from before that ' +
    'refund. A storage clear on Glamsterdam shows two different numbers. The same clear on ' +
    'Fusaka shows one.',
  usageText:
    'Start on <b>Glamsterdam</b> with <b>Clear a slot</b> and run. You pay less than the block ' +
    'counts. Switch to <b>Fusaka</b> and the two numbers match. Then try <b>Rewrite the slot</b> ' +
    '(no refund, they match on both forks) and <b>Put the value back</b> (restoring the original ' +
    'stays cheap for the block; on Glamsterdam the extra refund still comes off your bill only).',
}

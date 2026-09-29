import { COVER_COLUMN_IMAGE_HEIGHT } from '@/explorations/layout'
import type { Exploration } from '@/explorations/REGISTRY'

import { CANONICAL } from './canonical'
import image from './image.webp'
import imageSmall from './image_small.webp'

export const INFO: Exploration = {
  id: CANONICAL.identity.id,
  path: '/eip-2780-intrinsic-transaction-gas',
  title: CANONICAL.identity.name,
  seoDescription:
    'EIP-2780 intrinsic gas — see why a normal ETH send still costs 21,000 while a self-send costs 12,000 on Glamsterdam.',
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
    'EIP-2780 splits the old flat charge into named pieces. A send to someone else is still ' +
    '12,000 for the sender, plus 3,000 to touch them, plus 6,000 to move the value. ' +
    'A send to yourself keeps only the 12,000. Fusaka still charges 21,000 for all of these.',
  usageText:
    'The default is Glamsterdam and a send to someone else, so the three pieces add to 21,000. ' +
    'Step to a self-send, then a call that moves no value. Switch to Fusaka to see the flat charge return.',
}

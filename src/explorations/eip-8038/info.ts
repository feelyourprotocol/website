import { COVER_COLUMN_IMAGE_HEIGHT } from '@/explorations/layout'
import type { Exploration } from '@/explorations/REGISTRY'

import { CANONICAL } from './canonical'
import image from './image.webp'
import imageSmall from './image_small.webp'

export const INFO: Exploration = {
  id: CANONICAL.identity.id,
  path: '/eip-8038-state-access-gas',
  title: CANONICAL.identity.name,
  seoDescription:
    'Interactive explainer for EIP-8038 — see why an SSTORE on Glamsterdam pays separately for touching a slot, changing it, or creating it.',
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
    'EIP-8038 splits state-touching costs into <b>touch</b> (load), <b>change</b> (write), and ' +
    '<b>create</b> (new leaf). Cold reads barely move. The change surcharge on an existing slot ' +
    'jumps from about 2,800 to 10,000. Creating a slot still uses EIP-8037 state gas.',
  usageText:
    'The default is Glamsterdam + an <b>existing slot</b>. Press <b>Run</b> and the three rows ' +
    'fill: touch stays 2,100, change jumps, create stays empty. Switch to <b>Fusaka</b> to see ' +
    'the smaller write. Try a <b>read</b> (touch only) or a <b>new slot</b> (create becomes ' +
    'state gas).',
}

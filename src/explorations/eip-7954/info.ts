import { COVER_COLUMN_IMAGE_HEIGHT } from '@/explorations/layout'
import type { Exploration } from '@/explorations/REGISTRY'

import { CANONICAL } from './canonical'
import image from './image.webp'
import imageSmall from './image_small.webp'

export const INFO: Exploration = {
  id: CANONICAL.identity.id,
  path: '/eip-7954-contract-size-limit',
  title: CANONICAL.identity.name,
  seoDescription:
    'Explore EIP-7954 contract size limits interactively: compare 24 KiB with 64 KiB runtime code and 48 KiB with 128 KiB initcode.',
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
    'EIP-7954 raises deployed runtime code from <b>24 KiB to 64 KiB</b> and deployment ' +
    'initcode from <b>48 KiB to 128 KiB</b>. Existing contracts stay untouched; new ' +
    'deployments get substantially more room before hitting either validity wall.',
  usageText:
    'The first example crosses the old runtime-code wall by exactly one byte. Press ' +
    '<b>Deploy</b> to try the same contract on Fusaka and Glamsterdam, then test the new ' +
    'ceiling, one byte beyond it, and the separate initcode boundary.',
}

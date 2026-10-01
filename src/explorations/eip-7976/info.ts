import { COVER_COLUMN_IMAGE_HEIGHT } from '@/explorations/layout'
import type { Exploration } from '@/explorations/REGISTRY'

import { CANONICAL } from './canonical'
import image from './image.webp'
import imageSmall from './image_small.webp'

export const INFO: Exploration = {
  id: CANONICAL.identity.id,
  path: '/eip-7976-calldata-floor-cost',
  title: CANONICAL.identity.name,
  seoDescription:
    'EIP-7976 calldata floor — see when calldata costs 64 gas per byte, and when a normal call still pays 4 and 16.',
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
    'A transaction that mostly carries data pays a floor: 64 gas per byte on Glamsterdam, ' +
    'whether the byte is zero or not. A call that does real work still pays ' +
    '4 gas per zero byte and 16 per nonzero byte. Zero bytes are the ones that rise the most.',
  usageText:
    'The default is Glamsterdam and 100 zero bytes. The picture is one byte. The box under it ' +
    'is that price times every byte. The charged line updates as you step through the shapes ' +
    'or switch to Fusaka. Nonzero bytes, a call that does real work, then bytes tucked into an access list.',
}

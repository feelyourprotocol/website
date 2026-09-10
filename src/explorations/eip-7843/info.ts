import type { Exploration } from '@/explorations/REGISTRY'

import { CANONICAL } from './canonical'
import image from './image.webp'
import imageSmall from './image_small.webp'

export const INFO: Exploration = {
  id: CANONICAL.identity.id,
  path: '/eip-7843-slotnum-opcode',
  title: CANONICAL.identity.name,
  seoDescription:
    'Interactive EVM explainer for EIP-7843 SLOTNUM — see why TIMESTAMP ÷ 12 is a trap, and read the beacon slot from the block header on Amsterdam.',
  infoURL: CANONICAL.identity.specUrl,
  topic: CANONICAL.taxonomy.topic,
  timeline: CANONICAL.taxonomy.timeline,
  tags: CANONICAL.taxonomy.tags,
  image,
  imageSmall,
  coreQuestion: CANONICAL.question.coreQuestion,
  mcpDocsStatus: CANONICAL.mcp.docsStatus,
  imageBoxHeight: '19rem',
  rightPanel: true,
  introText:
    `<b>${CANONICAL.question.coreQuestion}</b> ` +
    'Contracts that need beacon time often divide the block timestamp by 12. That bakes the slot ' +
    'length into bytecode. EIP-7843 adds <code>SLOTNUM</code> (<code>0x4b</code>): the consensus ' +
    'layer puts the slot on the block header, and the opcode pushes it for 2 gas.',
  usageText:
    'The default example is Amsterdam + slot <b>42</b>. Press <b>Run</b> (or <b>Step</b> twice) and ' +
    'the stack top should match the slot on the right. Change the slot, compare ' +
    '<code>TIMESTAMP</code> with <code>SLOTNUM</code>, or try the divide-by-12 trap. Switch to ' +
    'Osaka to see the opcode fail.',
  creatorName: 'HolgerD77',
  creatorURL: 'https://x.com/HolgerD77',
  poweredBy: [{ name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' }],
}

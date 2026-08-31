import type { Exploration } from '@/explorations/REGISTRY'

import { CANONICAL } from './canonical'
import image from './image.jpg'
import imageSmall from './image_small.jpg'

export const INFO: Exploration = {
  id: CANONICAL.identity.id,
  path: '/eip-8024-stack-opcodes-dupn-swapn-exchange',
  title: CANONICAL.identity.name,
  seoDescription:
    'Interactive EVM explainer for EIP-8024 DUPN, SWAPN, and EXCHANGE stack opcodes — step through deep stack access in an Amsterdam-fork EVM in your browser.',
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
    'Solidity contracts often hit "stack too deep" when juggling many locals. EIP-8024 adds three ' +
    'backward-compatible opcodes — <code>DUPN</code> (0xe6), <code>SWAPN</code> (0xe7), and ' +
    '<code>EXCHANGE</code> (0xe8) — that extend <code>DUP</code>/<code>SWAP</code> to depths ' +
    '17–235 using a single-byte immediate.',
  usageText:
    'Pick an example, then use <b>Step</b> to walk opcode by opcode or <b>Run</b> for the full ' +
    'sequence. Watch the stack panel update after each step; the immediate decoder on the right ' +
    'latches when you rest on DUPN, SWAPN, or EXCHANGE. The DUPN demo uses a 17-item stack ' +
    '(the minimum for depth 16); SWAPN needs one slot more at the same depth; EXCHANGE fits in ' +
    'four pushes. Execution runs on an Amsterdam-fork EVM via EthereumJS.',
  creatorName: 'HolgerD77',
  creatorURL: 'https://x.com/HolgerD77',
  poweredBy: [{ name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' }],
}

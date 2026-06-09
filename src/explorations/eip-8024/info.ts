import type { Exploration } from '@/explorations/REGISTRY'
import { Tag } from '@/explorations/TAGS'

export const INFO: Exploration = {
  id: 'eip-8024',
  path: '/eip-8024-stack-opcodes-dupn-swapn-exchange',
  title: 'EIP-8024 DUPN, SWAPN & EXCHANGE Stack Opcodes',
  infoURL: 'https://eips.ethereum.org/EIPS/eip-8024',
  topic: 'robustness',
  timeline: 'glamsterdam',
  tags: [Tag.EVM],
  introText:
    '<b>How do you manipulate deep stack items without blowing the 1024 limit?</b> ' +
    'Smart contracts often hit the classic "stack too deep" compiler error when juggling ' +
    'many local variables. EIP-8024 adds three backward-compatible opcodes — ' +
    '<code>DUPN</code> (0xe6), <code>SWAPN</code> (0xe7), and <code>EXCHANGE</code> (0xe8) — ' +
    'that extend <code>DUP</code>/<code>SWAP</code> to depths 17–235 using a single-byte immediate.',
  usageText:
    'Pick an example below, then use <b>Step</b> to walk through each opcode and watch the stack ' +
    'change. Use <b>Run</b> to execute the full sequence at once. The widget runs bytecode on an ' +
    'Amsterdam-hardfork EVM via EthereumJS — the same stack semantics the EIP specifies.',
  creatorName: 'HolgerD77',
  creatorURL: 'https://x.com/HolgerD77',
  poweredBy: [{ name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' }],
}

import type { Exploration } from '@/explorations/REGISTRY'
import { Tag } from '@/explorations/TAGS'

export const INFO: Exploration = {
  id: 'eip-7928',
  path: '/eip-7928-block-level-access-lists',
  title: 'EIP-7928 Block Level Access Lists',
  infoURL: 'https://eips.ethereum.org/EIPS/eip-7928',
  topic: 'robustness',
  timeline: 'glamsterdam',
  tags: [Tag.EVM],
  rightPanel: true,
  introText:
    '<b>What does the block commit to besides state root?</b> ' +
    'EIP-7928 adds a block-level access list (BAL): a structured record of balance, nonce, code, ' +
    'and storage touches during block execution, hashed into <code>blockAccessListHash</code>. ' +
    'This exploration runs real Amsterdam blocks via EthereumJS and inspects the generated BAL step by step.',
  usageText:
    'Pick a curriculum step, read the scenario summary, then press <b>Run block</b>. ' +
    'The highlighted panel shows what changed in the BAL compared to the previous step. ' +
    'Expand the full JSON for details. Work through the examples in order for the guided tour.',
  creatorName: 'HolgerD77',
  creatorURL: 'https://x.com/HolgerD77',
  poweredBy: [{ name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' }],
}

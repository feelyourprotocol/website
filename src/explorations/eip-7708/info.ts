import type { Exploration } from '@/explorations/REGISTRY'

import { CANONICAL } from './canonical'
import image from './image.webp'
import imageSmall from './image_small.webp'

export const INFO: Exploration = {
  id: CANONICAL.identity.id,
  path: '/eip-7708-eth-transfer-logs',
  title: CANONICAL.identity.name,
  seoDescription:
    'EIP-7708 ETH transfer logs — see when native ETH shows up as an ERC-20-style Transfer event in the receipt, and when it stays silent.',
  infoURL: CANONICAL.identity.specUrl,
  topic: CANONICAL.taxonomy.topic,
  timeline: CANONICAL.taxonomy.timeline,
  tags: CANONICAL.taxonomy.tags,
  image,
  imageSmall,
  imageBoxHeight: '16rem',
  rightPanel: true,
  introText:
    `<b>${CANONICAL.question.coreQuestion}</b> ` +
    'EIP-7708 emits synthetic <code>Transfer(address,address,uint256)</code> logs from the ' +
    'system address whenever ETH moves between accounts — tx value, <code>CALL</code> value, ' +
    '<code>CREATE</code> endowment, and <code>SELFDESTRUCT</code>. Zero-value moves and reverted ' +
    'transfers stay silent.',
  usageText:
    'Pick a scenario, choose <b>Amsterdam</b> or <b>Osaka</b>, then press <b>Run block</b>. ' +
    'Decoded Transfer rows appear in the receipt panel on the right. Try the same scenario on ' +
    'Osaka to see the baseline without EIP-7708 logs.',
  creatorName: 'HolgerD77',
  creatorURL: 'https://x.com/HolgerD77',
  poweredBy: [{ name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' }],
}

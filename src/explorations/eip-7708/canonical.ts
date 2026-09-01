/**
 * Source of truth for this protocol change (website + MCP).
 * Replicate into engine EipCapability and mcp-docs; do not invent shared meaning in replicas.
 */
import type { ProtocolChangeCanonical } from '@/explorations/canonicalTypes'
import { Tag } from '@/explorations/TAGS'

export const CANONICAL: ProtocolChangeCanonical = {
  identity: {
    id: 'eip-7708',
    eip: 7708,
    specUrl: 'https://eips.ethereum.org/EIPS/eip-7708',
    name: 'EIP-7708 ETH transfers emit a log',
  },
  question: {
    coreQuestion:
      'When does native ETH show up as a Transfer log — and when does it stay invisible to log filters?',
    changeNature: 'new-capability',
  },
  taxonomy: {
    topic: 'ux',
    timeline: 'glamsterdam',
    tags: [Tag.EVM, Tag.GasCosts, Tag.Logs],
  },
  maturity: {
    eipStatus: 'Review',
    forkInclusion: 'Scheduled (Amsterdam)',
    implMaturity: 'Implemented in EthereumJS (Amsterdam)',
    testMaturity: 'execution-specs eip7708_eth_transfer_logs',
  },
  mcp: {
    shapes: ['simulate'],
    keywords: [
      'ETH transfer log',
      'Transfer event',
      'SYSTEM_ADDRESS',
      'contract wallet',
      'receipt logs',
    ],
    comparison: {
      baselineForkId: 'osaka',
      previewForkId: 'amsterdam',
      note: 'Transfer logs only on preview; same tx on baseline has no EIP-7708 logs.',
    },
    docsStatus: 'planned-module',
  },
}

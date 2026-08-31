/**
 * Source of truth for this protocol change (website + MCP).
 * Replicate into engine EipCapability and mcp-docs; do not invent shared meaning in replicas.
 */
import type { ProtocolChangeCanonical } from '@/explorations/canonicalTypes'
import { Tag } from '@/explorations/TAGS'

export const CANONICAL: ProtocolChangeCanonical = {
  identity: {
    id: 'eip-8024',
    eip: 8024,
    specUrl: 'https://eips.ethereum.org/EIPS/eip-8024',
    name: 'EIP-8024 DUPN, SWAPN & EXCHANGE Stack Opcodes',
  },
  question: {
    coreQuestion: 'How do you reach deep stack items without blowing the 1024 limit?',
    changeNature: 'new-capability',
  },
  taxonomy: {
    topic: 'robustness',
    timeline: 'glamsterdam',
    tags: [Tag.EVM],
  },
  maturity: {
    eipStatus: 'Review',
    forkInclusion: 'Scheduled (Amsterdam)',
    implMaturity: 'Implemented in EthereumJS',
    testMaturity: 'Opcode execution tests',
  },
  mcp: {
    shapes: ['simulate'],
    keywords: ['DUPN', 'SWAPN', 'EXCHANGE', 'stack opcodes', 'stack too deep'],
    comparison: {
      baselineForkId: 'osaka',
      previewForkId: 'amsterdam',
      note: 'Opcodes 0xe6–0xe8 are invalid on baseline; valid on preview.',
    },
    docsStatus: 'runnable',
  },
}

/**
 * Source of truth for this protocol change (website + MCP).
 * Replicate into engine EipCapability and mcp-docs; do not invent shared meaning in replicas.
 */
import type { ProtocolChangeCanonical } from '@/explorations/canonicalTypes'
import { Tag } from '@/explorations/TAGS'

export const CANONICAL: ProtocolChangeCanonical = {
  identity: {
    id: 'eip-7843',
    eip: 7843,
    specUrl: 'https://eips.ethereum.org/EIPS/eip-7843',
    name: 'EIP-7843 SLOTNUM opcode',
  },
  question: {
    coreQuestion: 'How do you read the beacon slot on-chain without hardcoding 12-second slots?',
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
    implMaturity: 'Implemented in EthereumJS (Amsterdam)',
    testMaturity: 'EthereumJS eip7843 opcode tests; glamsterdam-devnet EST',
  },
  mcp: {
    shapes: ['block'],
    keywords: ['SLOTNUM', 'slot number', 'beacon slot', 'TIMESTAMP', 'header.slotNumber'],
    comparison: {
      baselineForkId: 'osaka',
      previewForkId: 'amsterdam',
      note: 'Opcode 0x4b is invalid on baseline; on preview it pushes header.slotNumber (2 gas).',
    },
    docsStatus: 'runnable',
  },
}

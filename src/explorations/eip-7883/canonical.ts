/**
 * Source of truth for this protocol change (website + MCP).
 * Replicate into engine EipCapability and mcp-docs; do not invent shared meaning in replicas.
 */
import type { ProtocolChangeCanonical } from '@/explorations/canonicalTypes'
import { Tag } from '@/explorations/TAGS'

export const CANONICAL: ProtocolChangeCanonical = {
  identity: {
    id: 'eip-7883',
    eip: 7883,
    specUrl: 'https://eips.ethereum.org/EIPS/eip-7883',
    name: 'EIP-7883 ModExp Gas Cost Increase',
  },
  question: {
    coreQuestion: 'How are ModExp gas costs changing with Fusaka?',
    changeNature: 'repricing',
  },
  taxonomy: {
    topic: 'robustness',
    timeline: 'fusaka',
    tags: [Tag.GasCosts, Tag.Precompiles],
  },
  maturity: {
    eipStatus: 'Final',
    forkInclusion: 'Fusaka (Osaka on mainnet)',
    implMaturity: 'Implemented in EthereumJS',
    testMaturity: 'Precompile gas tests',
  },
  mcp: {
    shapes: ['simulate'],
    keywords: ['ModExp', 'modular exponentiation', 'gas repricing', 'precompile 0x05', 'RSA'],
    comparison: {
      baselineForkId: 'prague',
      previewForkId: 'osaka',
      note: 'ModExp gas formula changed at Fusaka; EIP-7823 input bounds apply on Osaka.',
    },
    docsStatus: 'runnable',
  },
}

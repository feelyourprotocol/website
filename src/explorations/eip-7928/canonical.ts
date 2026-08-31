/**
 * Source of truth for this protocol change (website + MCP).
 * Replicate into engine EipCapability and mcp-docs; do not invent shared meaning in replicas.
 */
import type { ProtocolChangeCanonical } from '@/explorations/canonicalTypes'
import { Tag } from '@/explorations/TAGS'

export const CANONICAL: ProtocolChangeCanonical = {
  identity: {
    id: 'eip-7928',
    eip: 7928,
    specUrl: 'https://eips.ethereum.org/EIPS/eip-7928',
    name: 'EIP-7928 Block Level Access Lists',
  },
  question: {
    coreQuestion: 'What does the block commit to besides state root?',
    changeNature: 'new-structure',
  },
  taxonomy: {
    topic: 'scaling',
    timeline: 'glamsterdam',
    tags: [Tag.BAL, Tag.EVM],
  },
  maturity: {
    eipStatus: 'Draft',
    forkInclusion: 'Scheduled (Amsterdam)',
    implMaturity: 'Implemented in EthereumJS (experimental)',
    testMaturity: 'Scenario curriculum tests',
  },
  mcp: {
    shapes: ['generate'],
    keywords: ['BAL', 'block-level access list', 'blockAccessListHash'],
    docsStatus: 'planned-module',
  },
}

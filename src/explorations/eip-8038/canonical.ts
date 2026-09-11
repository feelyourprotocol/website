/**
 * Source of truth for this protocol change (website + MCP).
 * Replicate into engine EipCapability and mcp-docs; do not invent shared meaning in replicas.
 */
import type { ProtocolChangeCanonical } from '@/explorations/canonicalTypes'
import { Tag } from '@/explorations/TAGS'

export const CANONICAL: ProtocolChangeCanonical = {
  identity: {
    id: 'eip-8038',
    eip: 8038,
    specUrl: 'https://eips.ethereum.org/EIPS/eip-8038',
    name: 'EIP-8038 State-Access Gas Cost Update',
  },
  question: {
    coreQuestion:
      'When you SSTORE on Amsterdam, what are you paying for — touching the slot, changing it, or creating it?',
    changeNature: 'repricing',
  },
  taxonomy: {
    topic: 'robustness',
    timeline: 'glamsterdam',
    tags: [Tag.GasCosts, Tag.EVM],
  },
  maturity: {
    eipStatus: 'Review',
    forkInclusion: 'Scheduled (Amsterdam)',
    implMaturity: 'Implemented in EthereumJS (Amsterdam, experimental)',
    testMaturity: 'execution-specs / glamsterdam-devnet (v8.1.x)',
  },
  mcp: {
    shapes: ['simulate', 'transaction'],
    keywords: ['state access gas', 'STORAGE_WRITE', 'ACCOUNT_WRITE', 'SSTORE', 'EXTCODESIZE'],
    comparison: {
      baselineForkId: 'osaka',
      previewForkId: 'amsterdam',
      note: 'Existing-slot first SSTORE (cold): Amsterdam regular gas 12_100 (2_100 access + 10_000 write) vs Osaka ~5_000. Cold SLOAD stays 2_100. EXTCODESIZE adds an extra 100 for the second read.',
    },
    docsStatus: 'runnable',
  },
}

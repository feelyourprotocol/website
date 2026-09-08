/**
 * Source of truth for this protocol change (website + MCP).
 * Replicate into engine EipCapability and mcp-docs; do not invent shared meaning in replicas.
 */
import type { ProtocolChangeCanonical } from '@/explorations/canonicalTypes'
import { Tag } from '@/explorations/TAGS'

export const CANONICAL: ProtocolChangeCanonical = {
  identity: {
    id: 'eip-8037',
    eip: 8037,
    specUrl: 'https://eips.ethereum.org/EIPS/eip-8037',
    name: 'EIP-8037 State Creation Gas Cost Increase',
  },
  question: {
    coreQuestion: "Why isn't 21,000 gas enough for a simple ETH transfer anymore?",
    changeNature: 'new-exec-model',
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
    shapes: ['simulate'],
    keywords: [
      'state gas',
      'two-dimensional gas',
      'cost per state byte',
      'first-touch transfer',
      'gas limit 21000',
    ],
    comparison: {
      baselineForkId: 'osaka',
      previewForkId: 'amsterdam',
      note: 'Value call to empty account: Amsterdam gas used includes ~183600 state-creation gas; Osaka does not. Widget uses a full transaction so 21000 vs a recommended gas limit is visible.',
    },
    docsStatus: 'runnable',
  },
}

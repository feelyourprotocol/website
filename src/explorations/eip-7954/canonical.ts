/**
 * Source of truth for this protocol change (website + MCP).
 * Replicate into engine EipCapability and mcp-docs; do not invent shared meaning in replicas.
 */
import type { ProtocolChangeCanonical } from '@/explorations/canonicalTypes'
import { Tag } from '@/explorations/TAGS'

export const CANONICAL: ProtocolChangeCanonical = {
  identity: {
    id: 'eip-7954',
    eip: 7954,
    specUrl: 'https://eips.ethereum.org/EIPS/eip-7954',
    name: 'EIP-7954 Increase Maximum Contract Size',
  },
  question: {
    coreQuestion: 'How much contract code can you deploy before the protocol rejects it?',
    changeNature: 'limit',
  },
  taxonomy: {
    topic: 'ux',
    timeline: 'glamsterdam',
    tags: [Tag.Contracts, Tag.EVM],
  },
  maturity: {
    eipStatus: 'Review',
    implMaturity: 'Implemented in EthereumJS (Glamsterdam, experimental)',
    testMaturity: 'execution-specs Glamsterdam development fixtures',
  },
  mcp: {
    shapes: ['transaction'],
    keywords: [
      'contract size',
      'runtime code',
      'initcode',
      'deployment limit',
      'EIP-170',
      'EIP-3860',
    ],
    comparison: {
      baselineForkId: 'fusaka',
      previewForkId: 'glamsterdam',
      note: 'Deploy identical boundary-size initcode before and after the limit increase.',
    },
    docsStatus: 'planned-module',
  },
}

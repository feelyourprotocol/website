/**
 * Source of truth for this protocol change (website + MCP).
 * Replicate into engine EipCapability and mcp-docs; do not invent shared meaning in replicas.
 */
import type { ProtocolChangeCanonical } from '@/explorations/canonicalTypes'
import { Tag } from '@/explorations/TAGS'

export const CANONICAL: ProtocolChangeCanonical = {
  identity: {
    id: 'eip-7951',
    eip: 7951,
    specUrl: 'https://eips.ethereum.org/EIPS/eip-7951',
    name: 'EIP-7951 secp256r1 Precompile Support',
  },
  question: {
    coreQuestion: 'Why add a secp256r1 precompile?',
    changeNature: 'new-capability',
  },
  taxonomy: {
    topic: 'ux',
    timeline: 'fusaka',
    tags: [Tag.Precompiles, Tag.Signatures],
  },
  maturity: {
    eipStatus: 'Final',
    forkInclusion: 'Fusaka (Osaka on mainnet)',
    implMaturity: 'Implemented in EthereumJS',
    testMaturity: 'Precompile verification vectors',
  },
  mcp: {
    shapes: ['simulate'],
    keywords: ['secp256r1', 'P-256', 'passkey', 'precompile 0x100', 'WebAuthn'],
    docsStatus: 'runnable',
  },
}

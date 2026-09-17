/**
 * Source of truth for this protocol change (website + MCP).
 * Replicate into engine EipCapability and mcp-docs; do not invent shared meaning in replicas.
 */
import type { ProtocolChangeCanonical } from '@/explorations/canonicalTypes'
import { Tag } from '@/explorations/TAGS'

export const CANONICAL: ProtocolChangeCanonical = {
  identity: {
    id: 'eip-7594',
    eip: 7594,
    specUrl: 'https://eips.ethereum.org/EIPS/eip-7594',
    name: 'EIP-7594 Peer Data Availability Sampling',
  },
  question: {
    coreQuestion: 'How do blob transactions change with PeerDAS?',
    changeNature: 'new-structure',
  },
  taxonomy: {
    topic: 'scaling',
    timeline: 'fusaka',
    tags: [Tag.PeerDAS],
  },
  maturity: {
    eipStatus: 'Final',
    implMaturity: 'Browser KZG only (website)',
    testMaturity: 'Manual blob verification',
  },
  mcp: {
    shapes: [],
    keywords: ['PeerDAS', 'cell proofs', 'KZG', 'blob transactions'],
    // Not observable in this EL lab (no blob sidecars) — not sunset because Fusaka is on mainnet.
    docsStatus: 'sunset',
  },
}

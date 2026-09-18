/**
 * Source of truth for this protocol change (website + MCP).
 * Replicate into engine EipCapability and mcp-docs; do not invent shared meaning in replicas.
 */
import type { ProtocolChangeCanonical } from '@/explorations/canonicalTypes'
import { GLAMSTERDAM_DEVNET_TEST_RELEASE_URL } from '@/explorations/canonicalTypes'
import { Tag } from '@/explorations/TAGS'

export const CANONICAL: ProtocolChangeCanonical = {
  identity: {
    id: 'eip-8024',
    eip: 8024,
    specUrl:
      'https://github.com/ethereum/EIPs/blob/34b49095ca5f7343045da279f04e7ecd1e451393/EIPS/eip-8024.md',
    specDate: '2026-06-10',
    name: 'EIP-8024 DUPN, SWAPN & EXCHANGE Stack Opcodes',
    status: 'Review',
    testReleaseUrl: GLAMSTERDAM_DEVNET_TEST_RELEASE_URL,
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
  mcp: {
    shapes: ['simulate'],
    keywords: ['DUPN', 'SWAPN', 'EXCHANGE', 'stack opcodes', 'stack too deep'],
    comparison: {
      baselineForkId: 'fusaka',
      previewForkId: 'glamsterdam',
      note: 'Opcodes 0xe6–0xe8 are invalid on baseline; valid on preview.',
    },
    docsStatus: 'runnable',
  },
}

/**
 * Source of truth for this protocol change (website + MCP).
 * Replicate into engine EipCapability and mcp-docs; do not invent shared meaning in replicas.
 */
import type { ProtocolChangeCanonical } from '@/explorations/canonicalTypes'
import { GLAMSTERDAM_DEVNET_TEST_RELEASE_URL } from '@/explorations/canonicalTypes'
import { Tag } from '@/explorations/TAGS'

export const CANONICAL: ProtocolChangeCanonical = {
  identity: {
    id: 'eip-7708',
    eip: 7708,
    specUrl:
      'https://github.com/ethereum/EIPs/blob/f7230c46a743313957d8f38a159bda934cc735b2/EIPS/eip-7708.md',
    specDate: '2026-07-10',
    name: 'EIP-7708 ETH transfers emit a log',
    status: 'Review',
    testReleaseUrl: GLAMSTERDAM_DEVNET_TEST_RELEASE_URL,
  },
  question: {
    coreQuestion:
      'When does native ETH show up as a Transfer log — and when does it stay invisible to log filters?',
    changeNature: 'new-capability',
  },
  taxonomy: {
    topic: 'ux',
    timeline: 'glamsterdam',
    tags: [Tag.EVM, Tag.GasCosts, Tag.Logs],
  },
  mcp: {
    shapes: ['transaction', 'simulate'],
    keywords: [
      'ETH transfer log',
      'Transfer event',
      'SYSTEM_ADDRESS',
      'contract wallet',
      'receipt logs',
    ],
    comparison: {
      baselineForkId: 'fusaka',
      previewForkId: 'glamsterdam',
      note: 'Transfer logs only on preview; same tx on baseline has no EIP-7708 logs.',
    },
    docsStatus: 'runnable',
  },
}

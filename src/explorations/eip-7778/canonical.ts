/**
 * Source of truth for this protocol change (website + MCP).
 * Replicate into engine EipCapability and mcp-docs; do not invent shared meaning in replicas.
 */
import type { ProtocolChangeCanonical } from '@/explorations/canonicalTypes'
import {
  GLAMSTERDAM_DEVNET_TEST_RELEASE_NAME,
  GLAMSTERDAM_DEVNET_TEST_RELEASE_URL,
} from '@/explorations/canonicalTypes'
import { Tag } from '@/explorations/TAGS'

export const CANONICAL: ProtocolChangeCanonical = {
  identity: {
    id: 'eip-7778',
    eip: 7778,
    specUrl:
      'https://github.com/ethereum/EIPs/blob/3929b1aab57b493417eccec7457d1485eccb9768/EIPS/eip-7778.md',
    specDate: '2026-01-28',
    name: 'EIP-7778 Block Gas Accounting without Refunds',
    status: 'Draft',
    testReleaseUrl: GLAMSTERDAM_DEVNET_TEST_RELEASE_URL,
    testReleaseName: GLAMSTERDAM_DEVNET_TEST_RELEASE_NAME,
  },
  question: {
    coreQuestion:
      'I cleared storage and got a refund — why does the block still count the full gas?',
    changeNature: 'new-exec-model',
  },
  taxonomy: {
    topic: 'robustness',
    timeline: 'glamsterdam',
    tags: [Tag.GasCosts, Tag.EVM],
  },
  mcp: {
    shapes: ['block', 'transaction'],
    keywords: ['gas refund', 'block gas', 'storage clear', 'SSTORE refund', 'calldata floor'],
    comparison: {
      baselineForkId: 'fusaka',
      previewForkId: 'glamsterdam',
      note: 'Clear a nonzero slot with no new state: Glamsterdam paid gas is below the block count; Fusaka the two match. A rewrite with no refund matches on both. Restoring the original value stays cheap for the block; on Glamsterdam the cash refund still comes off the bill only.',
    },
    docsStatus: 'runnable',
  },
}

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
    id: 'eip-7976',
    eip: 7976,
    specUrl:
      'https://github.com/ethereum/EIPs/blob/c998ef94eb16a6af8a9b8e2084f947b17ea14865/EIPS/eip-7976.md',
    specDate: '2026-07-07',
    name: 'EIP-7976 Increase Calldata Floor Cost',
    status: 'Review',
    testReleaseUrl: GLAMSTERDAM_DEVNET_TEST_RELEASE_URL,
    testReleaseName: GLAMSTERDAM_DEVNET_TEST_RELEASE_NAME,
  },
  question: {
    coreQuestion:
      'When does calldata cost 64 gas per byte, and when does a normal call still pay 4 and 16?',
    changeNature: 'repricing',
  },
  taxonomy: {
    topic: 'robustness',
    timeline: 'glamsterdam',
    tags: [Tag.GasCosts, Tag.EVM],
  },
  mcp: {
    shapes: ['transaction'],
    keywords: ['7976', 'calldata', 'floor', '64', '7623'],
    comparison: {
      baselineForkId: 'fusaka',
      previewForkId: 'glamsterdam',
      note: 'Data-heavy, little execution: floor is 64 gas per byte on Glamsterdam (zeros and nonzeros) vs 10 per zero byte and 40 per nonzero byte on Fusaka. A call that does enough work stays on 4 and 16 on both forks.',
    },
    docsStatus: 'runnable',
  },
}

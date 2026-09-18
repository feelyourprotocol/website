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
    id: 'eip-8037',
    eip: 8037,
    specUrl:
      'https://github.com/ethereum/EIPs/blob/5a8c80897aeb0952322cd0dfff767c541002b8c3/EIPS/eip-8037.md',
    specDate: '2026-07-31',
    name: 'EIP-8037 State Creation Gas Cost Increase',
    status: 'Review',
    testReleaseUrl: GLAMSTERDAM_DEVNET_TEST_RELEASE_URL,
    testReleaseName: GLAMSTERDAM_DEVNET_TEST_RELEASE_NAME,
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
  mcp: {
    shapes: ['transaction', 'simulate'],
    keywords: [
      'state gas',
      'two-dimensional gas',
      'cost per state byte',
      'first-touch transfer',
      'gas limit 21000',
    ],
    comparison: {
      baselineForkId: 'fusaka',
      previewForkId: 'glamsterdam',
      note: 'Value tx to empty account: Glamsterdam gasUsed ≈ 204600 (21000 + 183600 state); Fusaka 21000. gasLimit 21000 fails on Glamsterdam.',
    },
    docsStatus: 'runnable',
  },
}

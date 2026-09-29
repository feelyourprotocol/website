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
    id: 'eip-2780',
    eip: 2780,
    specUrl:
      'https://github.com/ethereum/EIPs/blob/8331fb3eed0a5366b28b25a016f1ad04fac0fa8e/EIPS/eip-2780.md',
    specDate: '2026-08-04',
    name: 'EIP-2780 Resource-based Intrinsic Transaction Gas',
    status: 'Review',
    testReleaseUrl: GLAMSTERDAM_DEVNET_TEST_RELEASE_URL,
    testReleaseName: GLAMSTERDAM_DEVNET_TEST_RELEASE_NAME,
  },
  question: {
    coreQuestion:
      'Why does sending ETH to someone else still cost 21,000 gas, while sending it to yourself costs 12,000?',
    changeNature: 'repricing',
  },
  taxonomy: {
    topic: 'robustness',
    timeline: 'glamsterdam',
    tags: [Tag.GasCosts, Tag.EVM, Tag.Contracts],
  },
  mcp: {
    shapes: ['transaction'],
    keywords: ['intrinsic gas', '2780', 'tx base cost', 'self-transfer', '21000'],
    comparison: {
      baselineForkId: 'fusaka',
      previewForkId: 'glamsterdam',
      note: 'Value transfer to an existing account stays 21,000. Self-transfer is 12,000 and a zero-value call is 15,000 on Glamsterdam; Fusaka is 21,000 for all three.',
    },
    docsStatus: 'runnable',
  },
}

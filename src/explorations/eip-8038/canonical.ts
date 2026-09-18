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
    id: 'eip-8038',
    eip: 8038,
    specUrl:
      'https://github.com/ethereum/EIPs/blob/8331fb3eed0a5366b28b25a016f1ad04fac0fa8e/EIPS/eip-8038.md',
    specDate: '2026-08-04',
    name: 'EIP-8038 State-Access Gas Cost Update',
    status: 'Review',
    testReleaseUrl: GLAMSTERDAM_DEVNET_TEST_RELEASE_URL,
    testReleaseName: GLAMSTERDAM_DEVNET_TEST_RELEASE_NAME,
  },
  question: {
    coreQuestion:
      'When you SSTORE on Glamsterdam, what are you paying for — touching the slot, changing it, or creating it?',
    changeNature: 'repricing',
  },
  taxonomy: {
    topic: 'robustness',
    timeline: 'glamsterdam',
    tags: [Tag.GasCosts, Tag.EVM],
  },
  mcp: {
    shapes: ['simulate', 'transaction'],
    keywords: ['state access gas', 'STORAGE_WRITE', 'ACCOUNT_WRITE', 'SSTORE', 'EXTCODESIZE'],
    comparison: {
      baselineForkId: 'fusaka',
      previewForkId: 'glamsterdam',
      note: 'Existing-slot first SSTORE (cold): Glamsterdam regular gas 12_100 (2_100 access + 10_000 write) vs Fusaka ~5_000. Cold SLOAD stays 2_100. EXTCODESIZE adds an extra 100 for the second read.',
    },
    docsStatus: 'runnable',
  },
}

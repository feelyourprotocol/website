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
    id: 'eip-7843',
    eip: 7843,
    specUrl:
      'https://github.com/ethereum/EIPs/blob/c3bfd4ba41cf0fcbfe8c404f33ba89f5174971e0/EIPS/eip-7843.md',
    specDate: '2026-01-20',
    name: 'EIP-7843 SLOTNUM opcode',
    status: 'Draft',
    testReleaseUrl: GLAMSTERDAM_DEVNET_TEST_RELEASE_URL,
    testReleaseName: GLAMSTERDAM_DEVNET_TEST_RELEASE_NAME,
  },
  question: {
    coreQuestion: 'How do you read the beacon slot on-chain without hardcoding 12-second slots?',
    changeNature: 'new-capability',
  },
  taxonomy: {
    topic: 'robustness',
    timeline: 'glamsterdam',
    tags: [Tag.EVM],
  },
  mcp: {
    shapes: ['block'],
    keywords: ['SLOTNUM', 'slot number', 'beacon slot', 'TIMESTAMP', 'header.slotNumber'],
    comparison: {
      baselineForkId: 'fusaka',
      previewForkId: 'glamsterdam',
      note: 'Opcode 0x4b is invalid on baseline; on preview it pushes header.slotNumber (2 gas).',
    },
    docsStatus: 'runnable',
  },
}

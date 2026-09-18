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
    id: 'eip-7954',
    eip: 7954,
    specUrl:
      'https://github.com/ethereum/EIPs/blob/1dc9bc870f864d7ad1095fc73ba8ca098d02c732/EIPS/eip-7954.md',
    specDate: '2026-05-21',
    name: 'EIP-7954 Increase Maximum Contract Size',
    status: 'Draft',
    testReleaseUrl: GLAMSTERDAM_DEVNET_TEST_RELEASE_URL,
    testReleaseName: GLAMSTERDAM_DEVNET_TEST_RELEASE_NAME,
  },
  question: {
    coreQuestion: 'How much contract code can you deploy before the protocol rejects it?',
    changeNature: 'limit',
  },
  taxonomy: {
    topic: 'ux',
    timeline: 'glamsterdam',
    tags: [Tag.Contracts, Tag.EVM],
  },
  mcp: {
    shapes: ['transaction'],
    keywords: [
      'contract size',
      'runtime code',
      'initcode',
      'deployment limit',
      'EIP-170',
      'EIP-3860',
    ],
    comparison: {
      baselineForkId: 'fusaka',
      previewForkId: 'glamsterdam',
      note: 'Deploy identical boundary-size initcode before and after the limit increase.',
    },
    docsStatus: 'runnable',
  },
}

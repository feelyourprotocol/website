/**
 * Source of truth for this protocol change (website + MCP).
 * Replicate into engine EipCapability and mcp-docs; do not invent shared meaning in replicas.
 */
import type { ProtocolChangeCanonical } from '@/explorations/canonicalTypes'
import { GLAMSTERDAM_DEVNET_TEST_RELEASE_URL } from '@/explorations/canonicalTypes'
import { Tag } from '@/explorations/TAGS'

export const CANONICAL: ProtocolChangeCanonical = {
  identity: {
    id: 'eip-7928',
    eip: 7928,
    specUrl:
      'https://github.com/ethereum/EIPs/blob/6c666b8d646df8ea6dcef9638de7b48e3c45ab96/EIPS/eip-7928.md',
    specDate: '2026-07-09',
    name: 'EIP-7928 Block Level Access Lists',
    status: 'Review',
    testReleaseUrl: GLAMSTERDAM_DEVNET_TEST_RELEASE_URL,
  },
  question: {
    coreQuestion: 'What does the block commit to besides state root?',
    changeNature: 'new-structure',
  },
  taxonomy: {
    topic: 'scaling',
    timeline: 'glamsterdam',
    tags: [Tag.BAL, Tag.EVM],
  },
  mcp: {
    shapes: ['generate', 'inspect'],
    keywords: ['BAL', 'block-level access list', 'blockAccessListHash'],
    docsStatus: 'runnable',
  },
}

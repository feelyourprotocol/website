/**
 * Source of truth for this protocol change (website + MCP).
 * Replicate into engine EipCapability and mcp-docs; do not invent shared meaning in replicas.
 */
import type { ProtocolChangeCanonical } from '@/explorations/canonicalTypes'
import { Tag } from '@/explorations/TAGS'

export const CANONICAL: ProtocolChangeCanonical = {
  identity: {
    id: 'eip-7702',
    eip: 7702,
    specUrl: 'https://eips.ethereum.org/EIPS/eip-7702',
    name: 'Set EOA account code for one transaction',
  },
  question: {
    coreQuestion:
      'How can an EOA run contract code for a single transaction — and what must be signed beforehand?',
    changeNature: 'new-exec-model',
  },
  taxonomy: {
    topic: 'account-abstraction',
    timeline: 'pectra',
    tags: [Tag.EVM, Tag.Signatures],
  },
  maturity: {
    eipStatus: 'Final',
    forkInclusion: 'Pectra (Prague)',
    implMaturity: 'Implemented in EthereumJS (Prague hardfork)',
    testMaturity: 'EthereumJS vm eip-7702; FYP MCP run_transaction + inspect',
  },
  mcp: {
    shapes: ['transaction', 'inspect'],
    keywords: ['7702', 'eoa', 'delegation', 'set-code', 'authorization list', 'type-4'],
    comparison: {
      baselineForkId: 'cancun',
      previewForkId: 'prague',
      note: 'Type-4 set-code txs and delegation require Prague; Cancun rejects authorizationList runs.',
    },
    docsStatus: 'runnable',
  },
}

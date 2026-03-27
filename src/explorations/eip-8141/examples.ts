import type { Examples } from '@/explorations/REGISTRY'

import type { FrameExampleDefinition } from './types'

/**
 * Frame transaction examples for the EIP-8141 exploration.
 *
 * VERIFY frame `dataHex` is a placeholder — the actual signature bytes are
 * computed at execution time by `frameRunner.ts` using the tx's signing hash.
 * SENDER frame `dataHex` can be edited by the user.
 */

export const FRAME_EXAMPLES: Record<string, FrameExampleDefinition> = {
  'simple-transfer': {
    id: 'simple-transfer',
    title: 'Simple Value Transfer',
    description:
      'The minimal frame transaction: a VERIFY frame proves sender identity via ECDSA, ' +
      'then a SENDER frame transfers 1000 wei to a recipient.',
    senderBalance: BigInt('10000000000000000'),
    extraAccounts: [
      { label: 'Recipient', addressHex: 'cc'.repeat(20), balance: 0n },
    ],
    frames: [
      {
        mode: 'VERIFY',
        label: 'ECDSA Signature Verification',
        targetLabel: 'sender (self)',
        gasLimit: 50000n,
        dataHex: '',
        description:
          'Default EOA verification: recovers the signer from an ECDSA signature and ' +
          'calls APPROVE with scope 0x2 (combined sender + payer). ' +
          'Data is auto-computed from the transaction hash.',
      },
      {
        mode: 'SENDER',
        label: 'Value Transfer',
        targetLabel: 'sender (self)',
        gasLimit: 200000n,
        dataHex: '',
        description:
          'Default EOA sender logic: decodes an RLP batch of [target, value, calldata] ' +
          'tuples and executes each call. This frame sends 1000 wei to the recipient.',
      },
    ],
    expectSuccess: true,
  },

  'verify-failure': {
    id: 'verify-failure',
    title: 'Verify Failure',
    description:
      'What happens when VERIFY fails? The frame data is too short (1 byte instead of 66), ' +
      'so the default code cannot recover a valid signature. APPROVE is never called and ' +
      'the entire transaction is rejected.',
    senderBalance: BigInt('10000000000000000'),
    frames: [
      {
        mode: 'VERIFY',
        label: 'Invalid Signature (too short)',
        targetLabel: 'sender (self)',
        gasLimit: 50000n,
        dataHex: '00',
        description:
          'Intentionally invalid: only 1 byte of data. The default ECDSA verification ' +
          'expects exactly 66 bytes [scope+type, v, r(32), s(32)]. ' +
          'Verification fails silently and APPROVE is never called.',
      },
    ],
    expectSuccess: false,
  },

  'batch-calls': {
    id: 'batch-calls',
    title: 'Batch Calls',
    description:
      'A single SENDER frame can batch multiple calls. After VERIFY approves the sender, ' +
      'the SENDER frame executes three value transfers to different recipients in sequence.',
    senderBalance: BigInt('1000000000000000000'),
    extraAccounts: [
      { label: 'Recipient A', addressHex: 'a1'.repeat(20), balance: 0n },
      { label: 'Recipient B', addressHex: 'b2'.repeat(20), balance: 0n },
      { label: 'Recipient C', addressHex: 'c3'.repeat(20), balance: 0n },
    ],
    frames: [
      {
        mode: 'VERIFY',
        label: 'ECDSA Signature Verification',
        targetLabel: 'sender (self)',
        gasLimit: 50000n,
        dataHex: '',
        description:
          'Same as the simple example: default EOA verification with scope 0x2.',
      },
      {
        mode: 'SENDER',
        label: 'Batch Value Transfers (3 calls)',
        targetLabel: 'sender (self)',
        gasLimit: 500000n,
        dataHex: '',
        description:
          'Executes three value transfers in a single frame: ' +
          '100 wei to Recipient A, 200 wei to Recipient B, 300 wei to Recipient C.',
      },
    ],
    expectSuccess: true,
  },
}

export const examples: Examples = Object.fromEntries(
  Object.entries(FRAME_EXAMPLES).map(([key, def]) => [
    key,
    { title: def.title, values: [def.description] },
  ]),
)

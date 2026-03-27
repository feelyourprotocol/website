/**
 * Frame transaction execution engine for the EIP-8141 exploration.
 *
 * Takes a FrameExampleDefinition, sets up a VM with the required pre-state,
 * builds the transaction (computing VERIFY signatures on the fly), executes
 * it with the per-frame callback, and returns a structured result.
 */

import { Common, Hardfork, Mainnet } from '@fyp-8141/common'
import { RLP } from '@fyp-8141/rlp'
import { createFrameEIP8141Tx, type FrameEIP8141TxData } from '@fyp-8141/tx'
import {
  Account,
  Address,
  BIGINT_0,
  bigIntToUnpaddedBytes,
  bytesToHex,
  concatBytes,
  hexToBytes,
} from '@fyp-8141/util'
import { createVM, runTx } from '@fyp-8141/vm'

import type {
  FrameExampleDefinition,
  FrameMode,
  FrameStepResult,
  FrameTxExecutionResult,
} from '../types'
import { buildVerifyData } from './runSimpleFrameTx'
import { PRIVATE_KEY, SENDER_ADDR } from './constants'

const MODE_MAP: Record<FrameMode, number> = { DEFAULT: 0, VERIFY: 1, SENDER: 2 }
const MODE_LABELS: Record<number, FrameMode> = { 0: 'DEFAULT', 1: 'VERIFY', 2: 'SENDER' }

function buildSenderFrameData(example: FrameExampleDefinition): Uint8Array {
  const recipients = example.extraAccounts ?? []
  if (recipients.length === 0) return concatBytes(new Uint8Array([0x00]), new Uint8Array(0))

  if (example.id === 'simple-transfer') {
    const addr = hexToBytes(('0x' + recipients[0].addressHex) as `0x${string}`)
    const calls = [[addr, bigIntToUnpaddedBytes(1000n), new Uint8Array(0)]]
    return concatBytes(new Uint8Array([0x00]), RLP.encode(calls))
  }

  if (example.id === 'batch-calls') {
    const amounts = [100n, 200n, 300n]
    const calls = recipients.map((r, i) => [
      hexToBytes(('0x' + r.addressHex) as `0x${string}`),
      bigIntToUnpaddedBytes(amounts[i]),
      new Uint8Array(0),
    ])
    return concatBytes(new Uint8Array([0x00]), RLP.encode(calls))
  }

  return concatBytes(new Uint8Array([0x00]), new Uint8Array(0))
}

function observationForFrame(
  mode: FrameMode,
  status: number,
  senderApproved: boolean,
  payerApproved: boolean,
  exampleId: string,
): string {
  if (mode === 'VERIFY' && status === 1) {
    return 'APPROVE called — sender and payer approved (scope 0x2, combined)'
  }
  if (mode === 'VERIFY' && status === 0) {
    return 'Verification failed — APPROVE was NOT called'
  }
  if (mode === 'SENDER' && status === 1) {
    if (exampleId === 'batch-calls') return 'All 3 batch calls executed successfully'
    return 'Value transfer executed successfully'
  }
  if (mode === 'SENDER' && status === 0) {
    return 'Sender frame execution reverted'
  }
  return status === 1 ? 'Frame executed successfully' : 'Frame execution failed'
}

export async function executeFrameExample(
  example: FrameExampleDefinition,
): Promise<FrameTxExecutionResult> {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague, eips: [8141] })
  const vm = await createVM({ common })

  await vm.stateManager.putAccount(SENDER_ADDR, new Account(0n, example.senderBalance))

  for (const acc of example.extraAccounts ?? []) {
    const addr = new Address(hexToBytes(('0x' + acc.addressHex) as `0x${string}`))
    await vm.stateManager.putAccount(addr, new Account(0n, acc.balance))
  }

  type FrameTuple = [Uint8Array, Uint8Array, Uint8Array, Uint8Array]
  const rawFrames: FrameTuple[] = example.frames.map((f) => {
    const modeBytes = MODE_MAP[f.mode] === 0
      ? new Uint8Array(0)
      : new Uint8Array([MODE_MAP[f.mode]])
    const targetBytes = new Uint8Array(0)
    const gasBytes = bigIntToUnpaddedBytes(f.gasLimit)

    let data: Uint8Array
    if (f.mode === 'VERIFY' && f.dataHex === '') {
      data = new Uint8Array(0)
    } else if (f.mode === 'SENDER' && f.dataHex === '') {
      data = buildSenderFrameData(example)
    } else {
      data = f.dataHex.length > 0
        ? hexToBytes(('0x' + f.dataHex) as `0x${string}`)
        : new Uint8Array(0)
    }

    return [modeBytes, targetBytes, gasBytes, data]
  })

  const txData: FrameEIP8141TxData = {
    chainId: 1n,
    nonce: 0n,
    sender: SENDER_ADDR.toString() as `0x${string}`,
    maxPriorityFeePerGas: 1n,
    maxFeePerGas: 100n,
    maxFeePerBlobGas: 0n,
    frames: rawFrames,
  }

  const txPlaceholder = createFrameEIP8141Tx(txData, { common })

  const verifyIndices = example.frames
    .map((f, i) => (f.mode === 'VERIFY' && f.dataHex === '' ? i : -1))
    .filter((i) => i >= 0)

  if (verifyIndices.length > 0) {
    const sigHash = txPlaceholder.getHashedMessageToSign()
    for (const idx of verifyIndices) {
      rawFrames[idx][3] = buildVerifyData(0x2, sigHash, PRIVATE_KEY)
    }
  }

  const tx = createFrameEIP8141Tx({ ...txData, frames: rawFrames }, { common })

  const frameSteps: FrameStepResult[] = []

  try {
    await runTx(vm, {
      tx: tx as Parameters<typeof runTx>[1]['tx'],
      skipBalance: true,
      skipNonce: true,
      skipHardForkValidation: true,
      onFrameExecuted: async (info) => {
        const senderAccount = await vm.stateManager.getAccount(SENDER_ADDR)
        const mode = MODE_LABELS[info.frame.mode] ?? 'DEFAULT'
        frameSteps.push({
          frameIndex: info.frameIndex,
          mode,
          label: example.frames[info.frameIndex].label,
          status: info.result.status,
          gasUsed: info.result.gasUsed,
          senderApproved: info.state.senderApproved,
          payerApproved: info.state.payerApproved,
          senderBalance: senderAccount?.balance ?? BIGINT_0,
          senderNonce: senderAccount?.nonce ?? 0n,
          observation: observationForFrame(
            mode,
            info.result.status,
            info.state.senderApproved,
            info.state.payerApproved,
            example.id,
          ),
        })
      },
    })

    const recipientBalances: Record<string, bigint> = {}
    for (const acc of example.extraAccounts ?? []) {
      const addr = new Address(hexToBytes(('0x' + acc.addressHex) as `0x${string}`))
      const account = await vm.stateManager.getAccount(addr)
      recipientBalances[bytesToHex(addr.bytes)] = account?.balance ?? BIGINT_0
    }

    return {
      success: true,
      txType: tx.type,
      gasLimit: tx.gasLimit,
      totalGasSpent: frameSteps.reduce((sum, s) => sum + s.gasUsed, 0n),
      frameSteps,
      recipientBalances,
    }
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : String(e),
      txType: tx.type,
      gasLimit: tx.gasLimit,
      totalGasSpent: frameSteps.reduce((sum, s) => sum + s.gasUsed, 0n),
      frameSteps,
      recipientBalances: {},
    }
  }
}

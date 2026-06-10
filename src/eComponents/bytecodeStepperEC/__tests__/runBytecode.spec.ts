import { describe, expect, it } from 'vitest'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'

import { dupnBytecode } from '@/explorations/eip-8024/bytecode'

import { createStepGate, runBytecode } from '../runBytecode'

const PUSH1_STOP = new Uint8Array([0x60, 0x01, 0x00])

async function createAmsterdamEvm() {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  return createEVM({ common })
}

describe('runBytecode', () => {
  it('runs push-add to completion and records step events', async () => {
    const evm = await createAmsterdamEvm()
    const code = new Uint8Array([0x60, 0x01, 0x60, 0x02, 0x01, 0x00])
    const recorded: number[] = []

    const result = await runBytecode({
      evm,
      code,
      gasLimit: 1_000_000n,
      stepMode: false,
      onStep: (_snap, index) => {
        recorded.push(index)
      },
      shouldAbort: () => false,
    })

    expect(recorded).toHaveLength(4)
    expect(result.executionGasUsed).toBeTypeOf('bigint')
    expect(result.executionGasUsed).toBeGreaterThan(0n)
    expect(result.exceptionError).toBeUndefined()
  })

  it('step gate pauses between opcodes', async () => {
    const evm = await createAmsterdamEvm()
    const gate = createStepGate()
    let stepCount = 0

    const runPromise = runBytecode({
      evm,
      code: PUSH1_STOP,
      gasLimit: 1_000_000n,
      stepMode: true,
      stepGate: gate,
      onStep: () => {
        stepCount++
      },
      shouldAbort: () => false,
    })

    await viWaitFor(() => stepCount === 1)
    gate.advance()

    await viWaitFor(() => stepCount === 2)
    gate.advance()

    const result = await runPromise
    expect(stepCount).toBe(2)
    expect(result.exceptionError).toBeUndefined()
  })

  it('DUPN duplicates stack item at depth 17 onto top', async () => {
    const evm = await createAmsterdamEvm()
    const code = dupnBytecode()

    const result = await runBytecode({
      evm,
      code,
      gasLimit: 1_000_000n,
      stepMode: false,
      onStep: () => {},
      shouldAbort: () => false,
    })

    const stack = result.runState?.stack
    expect(stack).toBeDefined()
    const top = stack!
      .peek(3)
      .map((w) => Number(w))
      .reverse()
    expect(top).toEqual([16, 17, 1])
  })
})

async function viWaitFor(predicate: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now()
  while (!predicate()) {
    if (Date.now() - start > timeoutMs) {
      throw new Error('viWaitFor timeout')
    }
    await new Promise((r) => setTimeout(r, 10))
  }
}

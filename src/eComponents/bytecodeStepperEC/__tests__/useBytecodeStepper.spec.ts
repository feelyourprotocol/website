import { describe, expect, it, vi } from 'vitest'

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ resolve: vi.fn(() => ({ href: '' })) }),
}))

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'

import type { Examples } from '@/explorations/REGISTRY'

import type { BytecodeStepperConfig } from '../types'
import { useBytecodeStepper } from '../useBytecodeStepper'

const config: BytecodeStepperConfig = {
  explorationId: 'test',
  defaultExample: 'push-add',
}

const examples: Examples = {
  'push-add': { title: 'Push + Add', values: ['600160020100'] },
  'push-stop': { title: 'Push + Stop', values: ['60016000'] },
}

async function createEvm() {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  return createEVM({ common })
}

describe('useBytecodeStepper', () => {
  it('loads default example on init and arms step mode', async () => {
    const evm = await createEvm()
    const state = useBytecodeStepper(config, evm)

    await state.init(examples)

    expect(state.bytecodeHex.value).toBe('600160020100')
    expect(state.instructions.value.length).toBeGreaterThan(0)
    await vi.waitFor(() => state.mode.value === 'stepping', { timeout: 2000 })
    expect(state.steps.value.length).toBeGreaterThan(0)
  })

  it('bytecode change clears execution state and re-arms at PC 0', async () => {
    const evm = await createEvm()
    const state = useBytecodeStepper(config, evm)
    await state.init(examples)

    await state.runAll()
    expect(state.mode.value).toBe('finished')

    state.bytecodeHex.value = '60006000'
    await state.onBytecodeChange()

    expect(state.execResult.value).toBeUndefined()
    expect(state.mode.value).toBe('stepping')
    expect(state.currentSnapshot.value?.pc).toBe(0)
    expect(state.currentSnapshot.value?.stack).toEqual([])
    expect(state.steps.value).toHaveLength(1)
  })

  it('switching example clears execution state and re-arms at PC 0', async () => {
    const evm = await createEvm()
    const state = useBytecodeStepper(config, evm)
    await state.init(examples)

    await state.runAll()
    expect(state.execResult.value).toBeDefined()

    state.example.value = 'push-stop'
    await state.selectExample(examples)

    expect(state.bytecodeHex.value).toBe('60016000')
    expect(state.execResult.value).toBeUndefined()
    expect(state.mode.value).toBe('stepping')
    expect(state.currentSnapshot.value?.pc).toBe(0)
    expect(state.currentSnapshot.value?.stack).toEqual([])
    expect(state.steps.value).toHaveLength(1)
  })

  it('switching example after stepping clears stack progress', async () => {
    const evm = await createEvm()
    const state = useBytecodeStepper(config, evm)
    await state.init(examples)

    await vi.waitFor(() => state.mode.value === 'stepping', { timeout: 2000 })
    await state.stepOnce()
    await state.stepOnce()
    await vi.waitFor(() => (state.currentSnapshot.value?.stack.length ?? 0) > 0, {
      timeout: 2000,
    })

    state.example.value = 'push-stop'
    await state.selectExample(examples)

    expect(state.currentSnapshot.value?.pc).toBe(0)
    expect(state.currentSnapshot.value?.stack).toEqual([])
    expect(state.mode.value).toBe('stepping')
  })

  it('reset preserves bytecode and re-arms step mode', async () => {
    const evm = await createEvm()
    const state = useBytecodeStepper(config, evm)
    await state.init(examples)

    await state.runAll()
    await state.reset()

    expect(state.bytecodeHex.value).toBe('600160020100')
    expect(state.execResult.value).toBeUndefined()
    await vi.waitFor(() => state.mode.value === 'stepping', { timeout: 2000 })
    expect(state.currentSnapshot.value?.pc).toBe(0)
    expect(state.currentSnapshot.value?.stack).toEqual([])
  })

  it('reset during stepping clears stack and returns to first opcode', async () => {
    const evm = await createEvm()
    const state = useBytecodeStepper(config, evm)
    await state.init(examples)

    await vi.waitFor(() => state.mode.value === 'stepping', { timeout: 2000 })
    await state.stepOnce()
    await state.stepOnce()
    await vi.waitFor(() => (state.currentSnapshot.value?.stack.length ?? 0) > 0, {
      timeout: 2000,
    })

    await state.reset()

    expect(state.execResult.value).toBeUndefined()
    expect(state.error.value).toBeUndefined()
    expect(state.mode.value).toBe('stepping')
    expect(state.currentSnapshot.value?.pc).toBe(0)
    expect(state.currentSnapshot.value?.stack).toEqual([])
    expect(state.steps.value).toHaveLength(1)
  })

  it('reset after finished does not restore stale result from prior run', async () => {
    const evm = await createEvm()
    const state = useBytecodeStepper(config, evm)
    await state.init(examples)

    await state.runAll()
    expect(state.execResult.value).toBeDefined()

    await state.reset()
    await vi.waitFor(() => state.mode.value === 'stepping', { timeout: 2000 })

    expect(state.execResult.value).toBeUndefined()
    expect(state.mode.value).toBe('stepping')
  })

  it('transitions to finished after run', async () => {
    const evm = await createEvm()
    const state = useBytecodeStepper(config, evm)
    await state.init(examples)

    await state.runAll()

    expect(state.mode.value).toBe('finished')
    expect(state.execResult.value).toBeDefined()
    expect(state.gasUsed.value).toBeGreaterThan(0n)
  })

  it('stepOnce advances one opcode when already armed', async () => {
    const evm = await createEvm()
    const state = useBytecodeStepper(config, evm)
    await state.init(examples)

    await vi.waitFor(() => state.mode.value === 'stepping', { timeout: 2000 })
    const pcBefore = state.currentSnapshot.value!.pc

    await state.stepOnce()

    await vi.waitFor(
      () => state.currentSnapshot.value!.pc !== pcBefore || state.steps.value.length > 1,
      { timeout: 2000 },
    )
    expect(state.mode.value).toBe('stepping')
  })
})

import { describe, expect, it, vi } from 'vitest'

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ resolve: vi.fn(() => ({ href: '' })) }),
}))

import type { Examples } from '@/explorations/REGISTRY'

import type { PrecompileConfig } from '../types'
import { usePrecompileState } from '../usePrecompileState'

const config: PrecompileConfig = {
  explorationId: 'test',
  defaultExample: 'ex1',
  values: [{ title: 'A', urlParam: 'a', expectedLen: 4n }],
}

const examples: Examples = {
  ex1: { title: 'Example 1', values: ['deadbeef'] },
}

describe('usePrecompileState', () => {
  it('calls run with assembled data on init', async () => {
    const run = vi.fn().mockResolvedValue(undefined)
    const state = usePrecompileState(config, examples, run)

    await state.init()

    expect(run).toHaveBeenCalledWith('deadbeef')
  })

  it('calls run on data input change', async () => {
    const run = vi.fn().mockResolvedValue(undefined)
    const state = usePrecompileState(config, examples, run)
    await state.init()
    run.mockClear()

    state.data.value = 'cafebabe'
    await state.onDataInputFormChange()

    expect(run).toHaveBeenCalledWith('cafebabe')
  })

  it('calls run on value input change', async () => {
    const run = vi.fn().mockResolvedValue(undefined)
    const state = usePrecompileState(config, examples, run)
    await state.init()
    run.mockClear()

    state.hexVals.value[0] = 'aabbccdd'
    await state.onValueInputFormChange()

    expect(run).toHaveBeenCalledWith('aabbccdd')
  })

  it('clears example on manual data input', async () => {
    const run = vi.fn().mockResolvedValue(undefined)
    const state = usePrecompileState(config, examples, run)
    await state.init()
    expect(state.example.value).toBe('ex1')

    state.data.value = 'cafebabe'
    await state.onDataInputFormChange()

    expect(state.example.value).toBe('')
  })

  it('exposes result ref populated by run return value', async () => {
    const mockResult = { gas: 42n }
    const run = vi.fn().mockResolvedValue(mockResult)
    const state = usePrecompileState(config, examples, run)

    expect(state.result.value).toBeUndefined()

    await state.init()

    expect(state.result.value).toEqual(mockResult)
  })

  it('exposes input state without legacy execution refs', () => {
    const run = vi.fn().mockResolvedValue(undefined)
    const state = usePrecompileState(config, examples, run)

    expect(state.data).toBeDefined()
    expect(state.hexVals).toBeDefined()
    expect(state.bigIntVals).toBeDefined()
    expect(state.byteLengths).toBeDefined()
    expect(state.example).toBeDefined()
    expect(state.inputValues).toBeDefined()
    expect(state.result).toBeDefined()
    expect(state).not.toHaveProperty('execResultPre')
    expect(state).not.toHaveProperty('execResultPost')
  })
})

import { describe, expect, it } from 'vitest'
import { computed, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'

import { BYTECODE_STEPPER_CONTEXT } from '@/eComponents/bytecodeStepperEC/bytecodeStepperContext'
import type { InstructionRow, RunMode } from '@/eComponents/bytecodeStepperEC/types'
import ImmediateQuoVadis from '@/explorations/eip-8024/ImmediateQuoVadis.vue'

function dupnRow(): InstructionRow {
  return {
    pc: 34,
    opcodeByte: 0xe6,
    name: 'DUPN 0x80',
    rawBytes: 'e6 80',
    size: 2,
  }
}

function swapnRow(): InstructionRow {
  return {
    pc: 36,
    opcodeByte: 0xe7,
    name: 'SWAPN 0x80',
    rawBytes: 'e7 80',
    size: 2,
  }
}

function exchangeRow(): InstructionRow {
  return {
    pc: 8,
    opcodeByte: 0xe8,
    name: 'EXCHANGE 0x8e',
    rawBytes: 'e8 8e',
    size: 2,
  }
}

function mountPanel(
  overrides: {
    mode?: RunMode
    activeInstruction?: InstructionRow
    bytecodeHex?: string
    example?: string
  } = {},
) {
  return mount(ImmediateQuoVadis, {
    props: {
      mode: overrides.mode ?? 'stepping',
      activeInstruction: overrides.activeInstruction,
      bytecodeHex: overrides.bytecodeHex ?? 'abc',
      example: overrides.example ?? 'exchange',
    },
  })
}

function clickTab(wrapper: ReturnType<typeof mountPanel>, label: string) {
  const tab = wrapper.findAll('button').find((b) => b.text().includes(label))
  expect(tab).toBeDefined()
  return tab!.trigger('click')
}

describe('ImmediateQuoVadis', () => {
  it('reserves height while waiting for an EIP-8024 opcode in step mode', () => {
    const wrapper = mountPanel({ activeInstruction: undefined })
    expect(wrapper.text()).toContain('DUPN / SWAPN / EXCHANGE — immediate, quo vadis?')
    expect(wrapper.text()).toContain('Waiting for step mode at a DUPN, SWAPN, or EXCHANGE opcode')
    expect(wrapper.text()).toContain('🧮 DUPN')
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('DUPN calculator encodes default depth 17 to 0x80 without stepping', async () => {
    const wrapper = mountPanel({ activeInstruction: undefined })
    await clickTab(wrapper, 'DUPN')
    await nextTick()
    expect(wrapper.text()).toContain('depth 17 → n=17 → 0x80')
  })

  it('SWAPN calculator encodes default swap depth 18 to 0x80 without stepping', async () => {
    const wrapper = mountPanel({ activeInstruction: undefined })
    await clickTab(wrapper, 'SWAPN')
    await nextTick()
    expect(wrapper.text()).toContain('depth 18 → n=17 → 0x80')
  })

  it('EXCHANGE calculator encodes default stack depths 2 & 3 to 0x8e without stepping', async () => {
    const wrapper = mountPanel({ activeInstruction: undefined })
    await clickTab(wrapper, 'EXCHANGE')
    await nextTick()
    expect(wrapper.text()).toContain('depths 2 & 3 → n=1, m=2 → 0x8e')
  })

  it('EXCHANGE calculator updates when stack depths change', async () => {
    const wrapper = mountPanel({ activeInstruction: undefined })
    await clickTab(wrapper, 'EXCHANGE')
    await wrapper.find('#calc-exchange-depth-a').setValue('3')
    await wrapper.find('#calc-exchange-depth-b').setValue('4')
    await nextTick()
    expect(wrapper.text()).toContain('0x9d')
  })

  it('EXCHANGE calculator shows validation errors for invalid depths', async () => {
    const wrapper = mountPanel({ activeInstruction: undefined })
    await clickTab(wrapper, 'EXCHANGE')
    await wrapper.find('#calc-exchange-depth-a').setValue('4')
    await wrapper.find('#calc-exchange-depth-b').setValue('4')
    await nextTick()
    expect(wrapper.text()).toContain('Choose two different stack depths')
  })

  it('latches DUPN decode when the pointer rests on DUPN in step mode', async () => {
    const wrapper = mountPanel({ activeInstruction: dupnRow() })
    await nextTick()
    expect(wrapper.text()).toContain('DUPN:')
    expect(wrapper.text()).toContain('0x80 → n=17 → copy depth 17')
    expect(wrapper.text()).toContain('🪄 Magic')
    expect(wrapper.text()).toContain('🔬 Expert')
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('latches SWAPN decode when the pointer rests on SWAPN in step mode', async () => {
    const wrapper = mountPanel({ activeInstruction: swapnRow() })
    await nextTick()
    expect(wrapper.text()).toContain('SWAPN:')
    expect(wrapper.text()).toContain('0x80 → n=17 → swap top with depth 18')
  })

  it('latches EXCHANGE decode when the pointer rests on EXCHANGE in step mode', async () => {
    const wrapper = mountPanel({ activeInstruction: exchangeRow() })
    await nextTick()
    expect(wrapper.text()).toContain('EXCHANGE:')
    expect(wrapper.text()).toContain('0x8e → n=1, m=2 → depths 2 & 3')
  })

  it('does not update while running through with Run', async () => {
    const wrapper = mountPanel({
      mode: 'running',
      activeInstruction: exchangeRow(),
    })
    await nextTick()
    expect(wrapper.text()).toContain('Waiting for step mode at a DUPN, SWAPN, or EXCHANGE opcode')
  })

  it('keeps the last decode after stepping past the opcode', async () => {
    const wrapper = mountPanel({ activeInstruction: exchangeRow() })
    await nextTick()
    await wrapper.setProps({
      activeInstruction: {
        pc: 10,
        opcodeByte: 0x00,
        name: 'STOP',
        rawBytes: '00',
        size: 1,
      },
    })
    await nextTick()
    expect(wrapper.text()).toContain('0x8e → n=1, m=2 → depths 2 & 3')
  })

  it('latches decode when fed by provide/inject from the stepper', async () => {
    const activeInstruction = computed(() => exchangeRow())
    const mode = ref<RunMode>('stepping')
    const bytecodeHex = ref('6001600260036004e88e00')
    const example = ref('exchange')

    const wrapper = mount(ImmediateQuoVadis, {
      global: {
        provide: {
          [BYTECODE_STEPPER_CONTEXT]: {
            activeInstruction,
            mode,
            bytecodeHex,
            example,
          },
        },
      },
    })
    await nextTick()
    expect(wrapper.text()).toContain('0x8e → n=1, m=2 → depths 2 & 3')
  })

  it('clears latched decode when bytecode changes', async () => {
    const wrapper = mountPanel({ activeInstruction: exchangeRow() })
    await nextTick()
    await wrapper.setProps({ bytecodeHex: 'deadbeef' })
    await nextTick()
    expect(wrapper.text()).toContain('Waiting for step mode at a DUPN, SWAPN, or EXCHANGE opcode')
  })
})

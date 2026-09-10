import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import SlotCompanion from './SlotCompanion.vue'

describe('SlotCompanion', () => {
  it('shows Amsterdam readout for the default slot', () => {
    const wrapper = mount(SlotCompanion, {
      props: {
        slotInput: '42',
        hardfork: 'amsterdam',
      },
    })

    expect(wrapper.get('[data-testid="slot-readout-push"]').text()).toContain('42')
    expect(wrapper.text()).toContain('Timestamp ÷ 12')
  })

  it('shows Osaka invalid copy when the fork is Osaka', async () => {
    const wrapper = mount(SlotCompanion, {
      props: {
        slotInput: '42',
        hardfork: 'amsterdam',
      },
    })

    await wrapper.setProps({ hardfork: 'osaka' })

    expect(wrapper.get('[data-testid="slot-readout"]').text()).toContain('not a valid opcode')
    expect(wrapper.find('[data-testid="slot-readout-push"]').exists()).toBe(false)
  })

  it('shows an error for junk input without crashing', async () => {
    const wrapper = mount(SlotCompanion, {
      props: {
        slotInput: '42',
        hardfork: 'amsterdam',
      },
    })

    await wrapper.setProps({ slotInput: 'nope' })

    expect(wrapper.get('[data-testid="slot-number-error"]').text()).toMatch(/whole number/i)
    expect(wrapper.get('[data-testid="slot-readout-push"]').text()).toContain('42')
  })

  it('emits preset clicks onto the slot input', async () => {
    const wrapper = mount(SlotCompanion, {
      props: {
        slotInput: '42',
        hardfork: 'amsterdam',
      },
    })

    await wrapper.get('[data-testid="slot-preset-0"]').trigger('click')

    expect(wrapper.emitted('update:slotInput')?.at(-1)).toEqual(['0'])
  })
})

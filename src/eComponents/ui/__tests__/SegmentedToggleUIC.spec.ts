import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import SegmentedToggleUIC from '@/eComponents/ui/SegmentedToggleUIC.vue'

const twoOptions = [
  { value: 'amsterdam', label: 'Amsterdam', testId: 'hardfork-amsterdam' },
  { value: 'osaka', label: 'Osaka', testId: 'hardfork-osaka' },
]

describe('SegmentedToggleUIC', () => {
  it('marks the selected option as pressed and exposes group + option test ids', () => {
    const wrapper = mount(SegmentedToggleUIC, {
      props: {
        modelValue: 'amsterdam',
        options: twoOptions,
        groupLabel: 'Hardfork',
        testId: 'hardfork-toggle',
      },
    })

    expect(wrapper.find('[data-testid="hardfork-toggle"]').exists()).toBe(true)
    expect(wrapper.find('[role="group"]').attributes('aria-label')).toBe('Hardfork')
    expect(wrapper.find('[role="group"]').classes()).toContain('e-segmented-toggle')
    expect(wrapper.find('[data-testid="hardfork-amsterdam"]').attributes('aria-pressed')).toBe(
      'true',
    )
    expect(wrapper.find('[data-testid="hardfork-amsterdam"]').classes()).toContain(
      'e-segmented-toggle-option-selected',
    )
    expect(wrapper.find('[data-testid="hardfork-osaka"]').attributes('aria-pressed')).toBe('false')
    expect(wrapper.find('[data-testid="hardfork-osaka"]').classes()).toContain(
      'e-segmented-toggle-option-idle',
    )
    expect(wrapper.find('[data-testid="hardfork-osaka"]').classes()).not.toContain(
      'e-segmented-toggle-option-selected',
    )
    expect(wrapper.text()).toContain('Amsterdam')
    expect(wrapper.text()).toContain('Osaka')
  })

  it('emits the new value when a different option is clicked', async () => {
    const wrapper = mount(SegmentedToggleUIC, {
      props: {
        modelValue: 'amsterdam',
        options: twoOptions,
        groupLabel: 'Hardfork',
      },
    })

    await wrapper.find('[data-testid="hardfork-osaka"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['osaka']])
  })

  it('does not emit when the already-selected option is clicked', async () => {
    const wrapper = mount(SegmentedToggleUIC, {
      props: {
        modelValue: 'amsterdam',
        options: twoOptions,
        groupLabel: 'Hardfork',
      },
    })

    await wrapper.find('[data-testid="hardfork-amsterdam"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders more than two options', () => {
    const wrapper = mount(SegmentedToggleUIC, {
      props: {
        modelValue: 'b',
        options: [
          { value: 'a', label: 'A', testId: 'opt-a' },
          { value: 'b', label: 'B', testId: 'opt-b' },
          { value: 'c', label: 'C', testId: 'opt-c' },
        ],
        groupLabel: 'Choice',
      },
    })

    expect(wrapper.findAll('button')).toHaveLength(3)
    expect(wrapper.find('[data-testid="opt-b"]').attributes('aria-pressed')).toBe('true')
  })

  it('stays usable with an empty options list', () => {
    const wrapper = mount(SegmentedToggleUIC, {
      props: {
        modelValue: '',
        options: [],
        groupLabel: 'Empty',
        testId: 'empty-toggle',
      },
    })

    expect(wrapper.find('[data-testid="empty-toggle"]').exists()).toBe(true)
    expect(wrapper.findAll('button')).toHaveLength(0)
  })
})

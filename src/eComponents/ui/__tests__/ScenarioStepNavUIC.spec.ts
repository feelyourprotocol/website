import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import ScenarioStepNavUIC from '@/eComponents/ui/ScenarioStepNavUIC.vue'

describe('ScenarioStepNavUIC', () => {
  it('disables prev on first step and emits next', async () => {
    const wrapper = mount(ScenarioStepNavUIC, {
      props: {
        label: 'Step 1 of 4',
        canGoPrev: false,
        canGoNext: true,
      },
    })

    expect(wrapper.get('[data-testid="scenario-step-prev"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-testid="scenario-step-label"]').text()).toBe('Step 1 of 4')

    await wrapper.get('[data-testid="scenario-step-next"]').trigger('click')
    expect(wrapper.emitted('next')).toHaveLength(1)
  })

  it('emits prev when allowed', async () => {
    const wrapper = mount(ScenarioStepNavUIC, {
      props: {
        canGoPrev: true,
        canGoNext: false,
      },
    })

    await wrapper.get('[data-testid="scenario-step-prev"]').trigger('click')
    expect(wrapper.emitted('prev')).toHaveLength(1)
    expect(wrapper.find('[data-testid="scenario-step-label"]').exists()).toBe(false)
  })
})

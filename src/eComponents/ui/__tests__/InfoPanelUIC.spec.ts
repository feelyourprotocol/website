import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

import InfoPanelUIC from '@/eComponents/ui/InfoPanelUIC.vue'

describe('InfoPanelUIC', () => {
  it('keeps the panel closed until the labelled trigger is clicked', async () => {
    const wrapper = mount(InfoPanelUIC, {
      props: { label: 'Spec', testId: 'spec-pin' },
      slots: { default: '<p>Pinned snapshot</p>' },
    })

    expect(wrapper.get('[data-testid="spec-pin"]').text()).toBe('Spec')
    expect(wrapper.get('[data-testid="spec-pin"]').attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('[data-testid="spec-pin-panel"]').exists()).toBe(false)

    await wrapper.get('[data-testid="spec-pin"]').trigger('click')

    expect(wrapper.get('[data-testid="spec-pin"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[data-testid="spec-pin-panel"]').text()).toContain('Pinned snapshot')
  })

  it('stops the trigger click from reaching a parent (safe on RouterLink cards)', async () => {
    const parentClick = vi.fn()
    const Host = defineComponent({
      components: { InfoPanelUIC },
      setup: () => ({ parentClick }),
      template: `
        <div @click="parentClick">
          <InfoPanelUIC label="Spec" test-id="spec-pin">
            <p>Body</p>
          </InfoPanelUIC>
        </div>
      `,
    })

    const wrapper = mount(Host)
    await wrapper.get('[data-testid="spec-pin"]').trigger('click')
    expect(parentClick).not.toHaveBeenCalled()
  })
})

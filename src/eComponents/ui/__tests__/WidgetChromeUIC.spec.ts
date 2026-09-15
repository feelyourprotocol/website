import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import WidgetChromeUIC from '@/eComponents/ui/WidgetChromeUIC.vue'

describe('WidgetChromeUIC', () => {
  it('omits steps and toggles bands when slots are empty', () => {
    const wrapper = mount(WidgetChromeUIC, {
      slots: {
        examples: '<span data-testid="ex">Examples</span>',
        run: '<button type="button" class="e-action-button">Run</button>',
      },
    })

    expect(wrapper.get('[data-testid="widget-chrome"]').classes()).toContain('e-widget-chrome')
    expect(wrapper.find('.e-widget-chrome-steps').exists()).toBe(false)
    expect(wrapper.find('.e-widget-chrome-toggles').exists()).toBe(false)
    expect(wrapper.find('.e-widget-chrome-action').exists()).toBe(true)
    expect(wrapper.find('.e-widget-chrome-run').exists()).toBe(true)
    expect(wrapper.find('[data-testid="ex"]').exists()).toBe(true)
  })

  it('renders all bands when slots are provided', () => {
    const wrapper = mount(WidgetChromeUIC, {
      slots: {
        steps: '<span>steps</span>',
        toggles: '<span>toggles</span>',
        examples: '<span>examples</span>',
        run: '<span>run</span>',
      },
    })

    expect(wrapper.find('.e-widget-chrome-steps').exists()).toBe(true)
    expect(wrapper.find('.e-widget-chrome-toggles').exists()).toBe(true)
    expect(wrapper.find('.e-widget-chrome-execute').exists()).toBe(true)
  })
})

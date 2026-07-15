import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import IceCreamHomeSection from '../IceCreamHomeSection.vue'

/**
 * Home placement tests for this special action — keep here, not in HomeView.spec.ts.
 * HomeView only tests permanent content; see website-docs/special-actions/index.md.
 */
describe('IceCreamHomeSection', () => {
  it('renders the section label and stand widget', () => {
    const wrapper = mount(IceCreamHomeSection)

    expect(wrapper.find('[data-ice-cream-week]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Ice Cream')
    expect(wrapper.find('[data-ice-cream-stand]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Buy Ice Cream')
  })
})

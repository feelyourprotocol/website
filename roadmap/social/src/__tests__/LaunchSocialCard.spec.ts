import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import LaunchSocialCard from '../components/LaunchSocialCard.vue'

describe('LaunchSocialCard', () => {
  it('renders the launched copy and data attribute', () => {
    const wrapper = mount(LaunchSocialCard)

    expect(wrapper.find('[data-social-card="launch"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Open · Glamsterdam Sepolia')
    expect(wrapper.text()).toContain('6 October 2026')
    expect(wrapper.text()).toContain('The MCP server has launched.')
    expect(wrapper.text()).toContain('No wallet')
  })
})

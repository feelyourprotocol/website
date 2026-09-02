import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import LaunchSocialCard from '../components/LaunchSocialCard.vue'

describe('LaunchSocialCard', () => {
  it('renders launch week copy and data attribute', () => {
    const wrapper = mount(LaunchSocialCard)

    expect(wrapper.find('[data-social-card="launch"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('We have a launch date')
    expect(wrapper.text()).toContain('5–9 October 2026')
    expect(wrapper.text()).toContain('Hosted MCP goes public')
    expect(wrapper.text()).toContain('describe_capabilities')
  })
})

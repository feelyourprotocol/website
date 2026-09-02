import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import McpLaunchHomeSection from '../McpLaunchHomeSection.vue'

/**
 * Home placement tests for this special action — keep here, not in HomeView.spec.ts.
 */
describe('McpLaunchHomeSection', () => {
  it('renders launch week section with links', () => {
    const wrapper = mount(McpLaunchHomeSection)

    expect(wrapper.find('[data-mcp-launch-week]').exists()).toBe(true)
    expect(wrapper.text()).toContain('MCP launch week')
    expect(wrapper.text()).toContain('5–9 October 2026')
    expect(wrapper.find('a[href*="roadmap/launch"]').exists()).toBe(true)
    expect(wrapper.find('a[href*="mcp-docs"]').exists()).toBe(true)
  })
})

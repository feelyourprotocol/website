import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import McpLaunchHomeSection from '../McpLaunchHomeSection.vue'

/**
 * Home placement tests for this special action — keep here, not in HomeView.spec.ts.
 */
describe('McpLaunchHomeSection', () => {
  it('renders the launched section with connect and question links', () => {
    const wrapper = mount(McpLaunchHomeSection)

    expect(wrapper.find('[data-mcp-launch-week]').exists()).toBe(true)
    expect(wrapper.text()).toContain('MCP is live')
    expect(wrapper.text()).toContain('6 October 2026')
    expect(wrapper.text()).toContain('The hosted lab is')
    expect(wrapper.find('a[href*="use/connect"]').exists()).toBe(true)
    expect(wrapper.find('a[href*="use/capabilities"]').exists()).toBe(true)
    expect(wrapper.find('a[href*="status/2107839782525325437"]').exists()).toBe(true)
  })
})

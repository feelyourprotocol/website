import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import McpLaunchedBanner from '../McpLaunchedBanner.vue'

describe('McpLaunchedBanner', () => {
  it('announces the open server and links the two entry points', () => {
    const wrapper = mount(McpLaunchedBanner)

    expect(wrapper.get('[data-mcp-launched]').attributes('aria-label')).toBe(
      'The MCP server has launched.',
    )
    expect(wrapper.text()).toContain('Live')
    expect(wrapper.text()).toContain('6 October 2026')
    expect(wrapper.get('a[href*="use/connect"]').text()).toBe('Connect')
    expect(wrapper.get('a[href*="use/capabilities"]').attributes('target')).toBe('_blank')
    expect(wrapper.get('a[href*="status/2107839782525325437"]').text()).toBe(
      'Read announcement on X',
    )
  })
})

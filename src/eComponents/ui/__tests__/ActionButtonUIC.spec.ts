import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import ActionButtonUIC from '@/eComponents/ui/ActionButtonUIC.vue'

function mockMatchMedia(canHover: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
    matches: query === '(hover: hover) and (pointer: fine)' ? canHover : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('ActionButtonUIC', () => {
  it('shows the tooltip as inline copy when hover is unavailable', () => {
    mockMatchMedia(false)

    const wrapper = mount(ActionButtonUIC, {
      props: {
        text: 'Run',
        tooltip: 'Run the program and split touch, change, and create',
        onClick: async () => {},
        testId: 'run-program',
      },
    })

    expect(wrapper.get('.help-hint-host').classes()).toContain('min-w-0')
    expect(wrapper.get('[data-testid="run-program"]').text()).toBe('Run')
    expect(wrapper.get('.help-hint-inline').text()).toContain('split touch')
  })
})

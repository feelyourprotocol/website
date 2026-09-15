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
  it('keeps the touch inline hint from setting the host intrinsic width', () => {
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
    expect(wrapper.get('.help-hint-host').classes()).toContain('flex')
    expect(wrapper.get('.help-hint-host').classes()).not.toContain('inline-flex')
    expect(wrapper.get('.help-hint-inline').classes()).toContain('w-0')
    expect(wrapper.get('.help-hint-inline').classes()).toContain('min-w-full')
  })
})

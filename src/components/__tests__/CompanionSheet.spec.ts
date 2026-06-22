import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import CompanionSheet from '@/components/CompanionSheet.vue'

function mockMobileViewport() {
  return vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
    matches: query.includes('max-width: 767px'),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('CompanionSheet', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('expands from peek to half when the peek bar is tapped', async () => {
    const wrapper = mount(CompanionSheet, {
      props: {
        label: 'EXCHANGE: 0x8e → n=1, m=2',
        active: true,
        pulseKey: 0,
      },
      slots: {
        default: '<p class="companion-body">Panel body</p>',
      },
      attachTo: document.body,
    })

    const vm = wrapper.vm as { snap: string }
    expect(vm.snap).toBe('peek')

    await wrapper.find('.companion-sheet-peek').trigger('click')
    expect(vm.snap).toBe('half')
    expect(wrapper.find('.companion-body').exists()).toBe(true)

    wrapper.unmount()
  })

  it('applies pulse class when pulseKey changes while active', async () => {
    const wrapper = mount(CompanionSheet, {
      props: {
        label: 'Waiting…',
        active: false,
        pulseKey: 0,
      },
      attachTo: document.body,
    })

    expect(wrapper.classes()).not.toContain('companion-sheet-pulse')

    await wrapper.setProps({ pulseKey: 1, label: 'Access list · 3 changes', active: true })
    expect(wrapper.classes()).toContain('companion-sheet-pulse')

    wrapper.unmount()
  })

  it('auto-expands from peek to half when active becomes true on mobile', async () => {
    mockMobileViewport()

    const wrapper = mount(CompanionSheet, {
      props: {
        label: 'Waiting…',
        active: false,
        pulseKey: 0,
      },
      slots: {
        default: '<p class="companion-body">Panel body</p>',
      },
      attachTo: document.body,
    })

    const vm = wrapper.vm as { snap: string }
    const contentWrapper = wrapper.find('.companion-body').element.parentElement!
    expect(vm.snap).toBe('peek')
    expect(contentWrapper.classList.contains('max-md:hidden')).toBe(true)

    await wrapper.setProps({
      active: true,
      label: 'DUPN: 0x11 → depth 17',
      pulseKey: 1,
    })
    expect(vm.snap).toBe('half')
    expect(contentWrapper.classList.contains('max-md:hidden')).toBe(false)

    wrapper.unmount()
  })

  it('does not pulse when status updates while idle', async () => {
    const wrapper = mount(CompanionSheet, {
      props: {
        label: 'Waiting…',
        active: false,
        pulseKey: 0,
      },
      attachTo: document.body,
    })

    await wrapper.setProps({ pulseKey: 1, label: 'Still waiting…', active: false })
    expect(wrapper.classes()).not.toContain('companion-sheet-pulse')

    wrapper.unmount()
  })
})

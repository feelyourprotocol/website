import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import type { Exploration } from '@/explorations/REGISTRY'
import { EXPLORATIONS } from '@/explorations/REGISTRY'
import SpecSnapshotUIC from '@/explorations/SpecSnapshotUIC.vue'

function mountSnapshot(exploration: Exploration) {
  return mount(SpecSnapshotUIC, { props: { exploration } })
}

describe('SpecSnapshotUIC', () => {
  it('shows pinned spec URL, date, status, and named test release', async () => {
    const exploration = EXPLORATIONS['eip-7708']!
    const wrapper = mountSnapshot(exploration)

    await wrapper.get('[data-testid="spec-pin"]').trigger('click')

    expect(wrapper.get('[data-testid="spec-pin-panel"]').text()).toContain(
      'built from the following EIP snapshot',
    )
    expect(wrapper.get('[data-testid="spec-pin-url"]').attributes('href')).toBe(exploration.infoURL)
    expect(wrapper.get('[data-testid="spec-pin-url"]').text()).toContain('EIP-7708')
    expect(wrapper.get('[data-testid="spec-pin-date"]').text()).toBe('10 Jul 2026')
    expect(wrapper.get('[data-testid="spec-pin-status"]').text()).toBe('Review')
    const tests = wrapper.get('[data-testid="spec-pin-test-release"]')
    expect(tests.attributes('href')).toBe(exploration.testReleaseUrl)
    expect(tests.text()).toContain('tests-glamsterdam-devnet@v8.1.0')
  })

  it('explains a live EIP page when no test release is pinned', async () => {
    const exploration = EXPLORATIONS['eip-7883']!
    const wrapper = mountSnapshot(exploration)

    await wrapper.get('[data-testid="spec-pin"]').trigger('click')

    expect(wrapper.get('[data-testid="spec-pin-panel"]').text()).toContain('live EIP page')
    expect(wrapper.get('[data-testid="spec-pin-date"]').text()).toBe('Not pinned')
    expect(wrapper.get('[data-testid="spec-pin-status"]').text()).toBe('Final')
    expect(wrapper.get('[data-testid="spec-pin-tests"]').text()).toContain(
      'No matching test release yet.',
    )
    expect(wrapper.find('[data-testid="spec-pin-test-release"]').exists()).toBe(false)
  })
})

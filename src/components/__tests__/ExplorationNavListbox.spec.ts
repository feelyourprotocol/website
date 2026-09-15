import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'

import ExplorationNavListbox from '@/components/ExplorationNavListbox.vue'
import { EXPLORATIONS } from '@/explorations/REGISTRY'

function mountNav(modelValue = '') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  })

  return mount(ExplorationNavListbox, {
    props: { modelValue },
    global: { plugins: [router] },
  })
}

describe('ExplorationNavListbox', () => {
  it('exposes catalog trigger with switch label (mobile icon control)', () => {
    const wrapper = mountNav()
    const button = wrapper.get('#exploration-navi')

    expect(button.attributes('aria-label')).toBe('Switch exploration')
    expect(button.find('svg').exists()).toBe(true)
  })

  it('shows desktop label when an exploration is selected', () => {
    const exploration = Object.values(EXPLORATIONS)[0]!
    const wrapper = mountNav(exploration.path)

    expect(wrapper.get('#exploration-navi').text()).toContain(exploration.title)
  })

  it('emits update when an exploration is chosen', async () => {
    const wrapper = mountNav()
    const [, target] = Object.entries(EXPLORATIONS)[0]!

    await wrapper.get('#exploration-navi').trigger('click')
    await flushPromises()

    const options = wrapper.findAll('li')
    const row = options.find((li) => li.text() === target.title)
    expect(row).toBeDefined()
    await row!.trigger('click')
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([target.path])
  })
})

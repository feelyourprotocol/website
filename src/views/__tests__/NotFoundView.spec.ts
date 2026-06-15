import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount } from '@vue/test-utils'

import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { DOCS_ADD_EXPLORATION } from '@/libs/docsUrls'
import NotFoundView from '@/views/NotFoundView.vue'

function makeRouter() {
  const explorationRoutes = Object.entries(EXPLORATIONS).map(([id, e]) => ({
    path: e.path,
    name: id,
    component: { template: '<div />' },
  }))

  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }, ...explorationRoutes],
  })
}

describe('NotFoundView', () => {
  it('shows a 404 headline and contributor call-to-action', () => {
    const wrapper = mount(NotFoundView, {
      global: { plugins: [makeRouter()] },
    })

    expect(wrapper.text()).toContain('404')
    expect(wrapper.text()).toContain("This path isn't in the registry.")
    expect(wrapper.text()).toContain('Add an exploration')
    expect(wrapper.text()).toContain('← Home')
  })

  it('links to the contributor guide', () => {
    const wrapper = mount(NotFoundView, {
      global: { plugins: [makeRouter()] },
    })

    const docsLinks = wrapper.findAll(`a[href="${DOCS_ADD_EXPLORATION}"]`)
    expect(docsLinks.length).toBeGreaterThanOrEqual(1)
  })

  it('shows a random exploration image when available', () => {
    const wrapper = mount(NotFoundView, {
      global: { plugins: [makeRouter()] },
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(wrapper.text()).toContain('Random pick')
  })
})

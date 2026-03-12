import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount, RouterLinkStub } from '@vue/test-utils'

import { EXPLORATIONS, getTopicExplorationIds } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'

import TopicView from '../TopicView.vue'

const topicId = Object.keys(TOPICS)[0]
const topic = TOPICS[topicId]
const explorationIds = getTopicExplorationIds(topicId)

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: topic.path, name: topicId, component: TopicView }],
})

async function mountTopicView() {
  router.push({ name: topicId })
  await router.isReady()
  return mount(TopicView, {
    global: {
      plugins: [router],
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

describe('TopicView', () => {
  it('renders all exploration cards for the topic', async () => {
    const wrapper = await mountTopicView()
    const cards = wrapper.findAll('.exploration-c')
    expect(cards).toHaveLength(explorationIds.length)
  })

  it('exploration cards display correct titles', async () => {
    const wrapper = await mountTopicView()
    const titles = wrapper.findAll('.exploration-c').map((c) => c.find('h3').text())
    for (const id of explorationIds) {
      expect(titles).toContainEqual(EXPLORATIONS[id].title)
    }
  })

  it('exploration cards link to correct paths', async () => {
    const wrapper = await mountTopicView()
    const links = wrapper.findAllComponents(RouterLinkStub)
    for (const id of explorationIds) {
      expect(links.some((l) => l.props('to') === EXPLORATIONS[id].path)).toBe(true)
    }
  })

  it('renders topic intro with image', async () => {
    const wrapper = await mountTopicView()
    expect(wrapper.findAll('img').length).toBeGreaterThanOrEqual(1)
  })

  it('filters explorations by timeline query param', async () => {
    const timeline = EXPLORATIONS[explorationIds[0]].timeline
    await router.push({ name: topicId, query: { timeline } })
    const wrapper = mount(TopicView, {
      global: { plugins: [router], stubs: { RouterLink: RouterLinkStub } },
    })
    const expected = explorationIds.filter((id) => EXPLORATIONS[id].timeline === timeline)
    expect(wrapper.findAll('.exploration-c')).toHaveLength(expected.length)
  })

  it('shows all explorations when no timeline query param', async () => {
    await router.push({ name: topicId })
    const wrapper = mount(TopicView, {
      global: { plugins: [router], stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.findAll('.exploration-c')).toHaveLength(explorationIds.length)
  })

  it('shows no-explorations message for non-matching timeline', async () => {
    await router.push({ name: topicId, query: { timeline: 'nonexistent' } })
    const wrapper = mount(TopicView, {
      global: { plugins: [router], stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.findAll('.exploration-c')).toHaveLength(0)
    expect(wrapper.text()).toContain('No explorations here yet')
  })
})

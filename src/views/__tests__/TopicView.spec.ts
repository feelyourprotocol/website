import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import TopicView from '../TopicView.vue'
import { TOPICS } from '@/explorations/TOPICS'
import { EXPLORATIONS, getTopicExplorationIds } from '@/explorations/REGISTRY'

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
})

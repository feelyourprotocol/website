import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

import ExplorationC from '@/explorations/ExplorationC.vue'
import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'

describe('ExplorationC', () => {
  it('external info link stops click propagation (safe inside RouterLink cards)', async () => {
    const exploration = EXPLORATIONS['eip-8024']
    const topic = TOPICS[exploration.topic]
    const parentClick = vi.fn()

    const Host = defineComponent({
      components: { ExplorationC },
      setup: () => ({ exploration, topic, parentClick }),
      template: `
        <div @click="parentClick">
          <ExplorationC
            exploration-id="eip-8024"
            :exploration="exploration"
            :topic="topic"
            :show-usage-instructions="false"
          />
        </div>
      `,
    })

    const wrapper = mount(Host)
    const infoLink = wrapper.find('a.visit-exploration-button')

    expect(infoLink.attributes('href')).toBe(exploration.infoURL)
    expect(infoLink.attributes('target')).toBe('_blank')

    await infoLink.trigger('click')
    expect(parentClick).not.toHaveBeenCalled()
  })
})

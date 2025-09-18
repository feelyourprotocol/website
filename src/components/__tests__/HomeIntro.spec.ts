import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeIntro from '../HomeIntro.vue'

describe('HomeIntro', () => {
  it('renders properly', () => {
    const wrapper = mount(HomeIntro, { props: { msg: 'Hello' } })
    expect(wrapper.text()).toContain('Hello')
  })
})

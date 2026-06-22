import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'

import { provideCompanionStatus } from '../companionStatus'

describe('companionStatus', () => {
  it('increments changeTick when setStatus is called', () => {
    let ctx: ReturnType<typeof provideCompanionStatus> | undefined

    const Host = defineComponent({
      setup() {
        ctx = provideCompanionStatus('Idle label')
        return () => null
      },
    })

    mount(Host)
    expect(ctx!.status.changeTick).toBe(0)
    expect(ctx!.status.label).toBe('Idle label')
    expect(ctx!.status.state).toBe('idle')

    ctx!.setStatus({ label: 'Active now', state: 'active' })
    expect(ctx!.status.changeTick).toBe(1)
    expect(ctx!.status.label).toBe('Active now')
    expect(ctx!.status.state).toBe('active')

    ctx!.setStatus({ state: 'idle' })
    expect(ctx!.status.changeTick).toBe(2)
    expect(ctx!.status.label).toBe('Active now')
    expect(ctx!.status.state).toBe('idle')
  })
})

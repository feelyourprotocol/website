import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'
import { flushPromises, mount } from '@vue/test-utils'

import BytecodeStepperEC from '@/eComponents/bytecodeStepperEC/BytecodeStepperEC.vue'

import { createLabBlock } from './block'
import { config } from './config'
import { examples } from './examples'
import { INFO as exploration } from './info'
import { DEFAULT_SLOT } from './parseSlot'
import SlotCompanion from './SlotCompanion.vue'

async function mountExploration(): Promise<ReturnType<typeof mount>> {
  document.body.innerHTML = '<div id="root"></div><div id="exploration-right-panel"></div>'

  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  const evm = await createEVM({ common })
  const block = createLabBlock(common, DEFAULT_SLOT)

  const Host = defineComponent({
    components: { BytecodeStepperEC, SlotCompanion },
    setup: () => ({
      config,
      examples,
      exploration,
      evm,
      block,
      slotInput: DEFAULT_SLOT.toString(),
      hardfork: 'amsterdam' as const,
    }),
    template: `
      <Suspense>
        <BytecodeStepperEC
          :config="config"
          :examples="examples"
          :exploration="exploration"
          :evm="evm"
          :block="block"
        >
          <template #below>
            <Teleport to="#exploration-right-panel">
              <SlotCompanion v-model:slot-input="slotInput" v-model:hardfork="hardfork" />
            </Teleport>
          </template>
        </BytecodeStepperEC>
      </Suspense>
    `,
  })

  const wrapper = mount(Host, { attachTo: document.getElementById('root')! })
  await flushPromises()
  await flushPromises()
  return wrapper
}

describe('EIP-7843 MyC play path', () => {
  it('shows example picker, run/step, and slot companion', async () => {
    const wrapper = await mountExploration()

    expect(wrapper.text()).toContain('SLOTNUM — push the beacon slot')
    expect(wrapper.find('[data-testid="bytecode-run"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="bytecode-step"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="bytecode-disassembly"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="bytecode-stack"]').exists()).toBe(true)

    const panel = document.getElementById('exploration-right-panel')
    expect(panel?.textContent).toContain('Beacon slot')
    expect(panel?.querySelector('[data-testid="slot-number-input"]')).not.toBeNull()
    expect(panel?.querySelector('[data-testid="slot-readout-push"]')?.textContent).toContain('42')
  })
})

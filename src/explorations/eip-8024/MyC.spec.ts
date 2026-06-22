import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'
import { flushPromises, mount } from '@vue/test-utils'

import BytecodeStepperEC from '@/eComponents/bytecodeStepperEC/BytecodeStepperEC.vue'

import { config } from './config'
import { examples } from './examples'
import ImmediateQuoVadis from './ImmediateQuoVadis.vue'
import { INFO as exploration } from './info'

async function createHost(panelMount: 'below-slot' | 'sibling'): Promise<ReturnType<typeof mount>> {
  document.body.innerHTML = '<div id="root"></div><div id="exploration-right-panel"></div>'

  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  const evm = await createEVM({ common })

  const Host = defineComponent({
    components: { BytecodeStepperEC, ImmediateQuoVadis },
    setup: () => ({ config, examples, exploration, evm, panelMount }),
    template:
      panelMount === 'below-slot'
        ? `
          <Suspense>
            <BytecodeStepperEC :config="config" :examples="examples" :exploration="exploration" :evm="evm">
              <template #below>
                <Teleport to="#exploration-right-panel">
                  <ImmediateQuoVadis />
                </Teleport>
              </template>
            </BytecodeStepperEC>
          </Suspense>
        `
        : `
          <Suspense>
            <div>
              <BytecodeStepperEC :config="config" :examples="examples" :exploration="exploration" :evm="evm" />
              <Teleport to="#exploration-right-panel">
                <ImmediateQuoVadis />
              </Teleport>
            </div>
          </Suspense>
        `,
  })

  const wrapper = mount(Host, { attachTo: document.getElementById('root')! })
  await flushPromises()
  await flushPromises()
  return wrapper
}

function rightPanelText(): string {
  return document.getElementById('exploration-right-panel')?.textContent ?? ''
}

async function waitForStepButton(): Promise<HTMLButtonElement> {
  for (let i = 0; i < 100; i++) {
    const stepButton = Array.from(
      document.querySelectorAll<HTMLButtonElement>('button.e-action-button'),
    ).find((button) => button.textContent?.includes('Step') && !button.disabled)
    if (stepButton) return stepButton
    await flushPromises()
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
  throw new Error('Step button did not become ready')
}

async function clickStepUntil(predicate: () => boolean, maxSteps = 20): Promise<void> {
  for (let i = 0; i < maxSteps; i++) {
    if (predicate()) return
    const stepButton = await waitForStepButton()
    await stepButton.click()
    await flushPromises()
    await flushPromises()
  }
}

async function selectExchangeExample(wrapper: ReturnType<typeof mount>): Promise<void> {
  const examplesListbox = wrapper
    .findAll('button')
    .find((button) => button.text().includes('DUPN — copy stack item at depth 17'))
  expect(examplesListbox).toBeDefined()
  await examplesListbox!.trigger('click')
  await flushPromises()

  const exchangeOption = wrapper
    .findAll('li')
    .find((item) => item.text().includes('EXCHANGE — swap stack items at depths 2 & 3'))
  expect(exchangeOption).toBeDefined()
  await exchangeOption!.trigger('click')
  await flushPromises()
  await flushPromises()
}

describe('EIP-8024 MyC right panel', () => {
  it('latches EXCHANGE decode in the teleported panel when mounted in #below', async () => {
    const wrapper = await createHost('below-slot')
    await selectExchangeExample(wrapper)
    await clickStepUntil(() => rightPanelText().includes('EXCHANGE:'))

    expect(rightPanelText()).toContain('0x8e → n=1, m=2 → depths 2 & 3')
    expect(document.getElementById('exploration-right-panel')?.querySelector('img')).not.toBeNull()
  })

  it('does not latch when ImmediateQuoVadis is a sibling outside BytecodeStepperEC', async () => {
    const wrapper = await createHost('sibling')
    await selectExchangeExample(wrapper)
    await clickStepUntil(() => false, 6)

    expect(rightPanelText()).toContain('Waiting for step mode at a DUPN, SWAPN, or EXCHANGE opcode')
    expect(rightPanelText()).not.toContain('EXCHANGE:')
    expect(document.getElementById('exploration-right-panel')?.querySelector('img')).toBeNull()
  })
})

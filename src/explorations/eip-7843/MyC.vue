<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'

import BytecodeStepperEC from '@/eComponents/bytecodeStepperEC/BytecodeStepperEC.vue'
import { useExplorationExampleQuery } from '@/libs/useExplorationExampleQuery'

import { createLabBlock } from './block'
import { config } from './config'
import { examples } from './examples'
import { INFO as exploration } from './info'
import { DEFAULT_SLOT, parseSlotNumber } from './parseSlot'
import SlotCompanion from './SlotCompanion.vue'
import type { HardforkChoice } from './types'

const amsterdamCommon = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
const osakaCommon = new Common({ chain: Mainnet, hardfork: Hardfork.Osaka })
const amsterdamEvm = await createEVM({ common: amsterdamCommon })
const osakaEvm = await createEVM({ common: osakaCommon })

const exampleQuery = useExplorationExampleQuery()
const hardfork = ref<HardforkChoice>('amsterdam')
const slotInput = ref(DEFAULT_SLOT.toString())
const appliedSlot = ref(DEFAULT_SLOT)

watch(slotInput, (raw) => {
  const parsed = parseSlotNumber(raw)
  if (parsed.ok) appliedSlot.value = parsed.value
})

const evm = computed(() => (hardfork.value === 'amsterdam' ? amsterdamEvm : osakaEvm))
const common = computed(() => (hardfork.value === 'amsterdam' ? amsterdamCommon : osakaCommon))
const block = computed(() => createLabBlock(common.value, appliedSlot.value))
</script>

<template>
  <BytecodeStepperEC
    :config="config"
    :examples="examples"
    :exploration="exploration"
    :evm="evm"
    :block="block"
    :example-query="exampleQuery"
  >
    <template #below>
      <Teleport to="#exploration-right-panel">
        <SlotCompanion v-model:slot-input="slotInput" v-model:hardfork="hardfork" />
      </Teleport>
    </template>
  </BytecodeStepperEC>
</template>

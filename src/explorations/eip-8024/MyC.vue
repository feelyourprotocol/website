<script setup lang="ts">
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'

import BytecodeStepperEC from '@/eComponents/bytecodeStepperEC/BytecodeStepperEC.vue'
import { useExplorationExampleQuery } from '@/libs/useExplorationExampleQuery'

import { config } from './config'
import { examples } from './examples'
import ImmediateQuoVadis from './ImmediateQuoVadis.vue'
import { INFO as exploration } from './info'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
const evm = await createEVM({ common })
const exampleQuery = useExplorationExampleQuery()
</script>

<template>
  <BytecodeStepperEC
    :config="config"
    :examples="examples"
    :exploration="exploration"
    :evm="evm"
    :example-query="exampleQuery"
  >
    <template #below>
      <Teleport to="#exploration-right-panel">
        <ImmediateQuoVadis />
      </Teleport>
    </template>
  </BytecodeStepperEC>
</template>

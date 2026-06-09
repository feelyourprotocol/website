<script setup lang="ts">
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'

import BytecodeStepperEC from '@/eComponents/bytecodeStepperEC/BytecodeStepperEC.vue'

import { config } from './config'
import { examples } from './examples'
import { INFO as exploration } from './info'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
const evm = await createEVM({ common })
</script>

<template>
  <BytecodeStepperEC :config="config" :examples="examples" :exploration="exploration" :evm="evm" />
</template>

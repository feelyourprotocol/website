<script setup lang="ts">
import type { ExecResult } from '@ethereumjs/evm'
import { bytesToHex } from '@ethereumjs/util'

import PPBoxC from '@/components/ui/PPBoxC.vue'

const execResult = defineModel<ExecResult>()

defineProps(['title', 'left'])
</script>

<template>
  <PPBoxC :title="title" :left="true">
    <p v-if="execResult" class="e-result-text-lg">{{ execResult?.executionGasUsed }} Gas</p>
    <p v-if="execResult" class="e-result-text-sm">
      Result: {{ execResult ? bytesToHex(execResult.returnValue) : '' }}
    </p>
    <p v-else class="e-result-text-md mt-5">Not available</p>
  </PPBoxC>
</template>

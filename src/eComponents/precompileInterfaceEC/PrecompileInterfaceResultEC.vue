<script setup lang="ts">
import type { ExecResult } from '@ethereumjs/evm'
import { bytesToHex } from '@ethereumjs/util'

import ResultBoxC from '@/eComponents/ui/resultBox/ResultBoxC.vue'

const execResult = defineModel<ExecResult>()

defineProps(['title', 'left'])
</script>

<template>
  <ResultBoxC :title="title" :left="true">
    <p v-if="execResult" class="e-result-text-lg">{{ execResult?.executionGasUsed }} Gas</p>
    <p v-if="execResult" class="e-result-text-sm">
      Result: {{ execResult ? bytesToHex(execResult.returnValue) : '' }}
    </p>
    <p v-else class="e-result-text-md mt-5">Not available</p>
  </ResultBoxC>
</template>

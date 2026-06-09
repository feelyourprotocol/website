<script setup lang="ts">
import type { ExecResult } from '@ethereumjs/evm'
import { bytesToHex } from '@ethereumjs/util'

import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'

defineProps<{
  execResult?: ExecResult
  error?: string
}>()
</script>

<template>
  <ResultBoxUIC title="Result" :left="true" :errorText="error">
    <template v-if="execResult && !error">
      <p class="e-result-text-lg">{{ execResult.executionGasUsed }} Gas used</p>
      <p v-if="execResult.exceptionError" class="e-result-text-sm">
        Exception: {{ execResult.exceptionError.error }}
      </p>
      <p v-else class="e-result-text-sm">
        Return data: {{ bytesToHex(execResult.returnValue) || '(empty)' }}
      </p>
    </template>
    <p v-else-if="!error" class="e-result-text-md mt-5">
      Run or step through bytecode to see results.
    </p>
  </ResultBoxUIC>
</template>

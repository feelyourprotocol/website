<script setup lang="ts">
import type { ExecResult } from '@ethereumjs/evm'
import { bytesToHex } from '@ethereumjs/util'

const execResult = defineModel<ExecResult>()

defineProps(['title', 'left'])
</script>

<template>
  <div class="bg-blue-900 rounded-sm p-2.5" :class="[left ? 'text-left' : 'text-right']">
    <span class="text-xs bg-white p-1 text-blue-900 rounded-xs">{{ title }}</span>
    <p class="text-2xl font-bold text-white mt-2.5">{{ execResult?.executionGasUsed }} Gas</p>
    <p class="text-xs font-bold font-mono text-white mt-1 break-words w-full overflow-hidden">
      Result: {{ execResult ? bytesToHex(execResult.returnValue) : '' }}
    </p>
  </div>
</template>

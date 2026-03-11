<script setup lang="ts">
import { bytesToHex } from '@ethereumjs/util'

import PrecompileInterfaceEC from '@/eComponents/precompileInterfaceEC/PrecompileInterfaceEC.vue'
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'

import { config } from './config'
import { run } from './custom/run'
import { examples } from './examples'
import { INFO as exploration } from './info'
</script>

<template>
  <PrecompileInterfaceEC
    :config="config" :examples="examples" :exploration="exploration" :run="run"
  >
    <template #result="{ result }">
      <div class="e-grid-single">
        <ResultBoxUIC title="Addition Result" :left="true">
          <template v-if="result">
            <p class="text-4xl font-mono font-bold mt-2 mb-4 break-all e-text">
              {{ result.sum }}
            </p>
            <p class="text-sm font-mono break-all text-slate-500">
              {{ bytesToHex(result.execResult.returnValue) }}
            </p>
            <p class="text-xs text-slate-400 mt-3">
              Gas used: {{ result.execResult.executionGasUsed }}
            </p>
          </template>
          <p v-else class="e-result-text-md mt-5">Waiting for input...</p>
        </ResultBoxUIC>
      </div>
    </template>
  </PrecompileInterfaceEC>
</template>

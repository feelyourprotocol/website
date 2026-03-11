<script setup lang="ts">
import { ref } from 'vue'
import { bytesToHex } from '@ethereumjs/util'
import type { ExecResult } from '@ethereumjs/evm'

import PrecompileInterfaceEC from '@/eComponents/precompileInterfaceEC/PrecompileInterfaceEC.vue'
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'

import { config } from './config'
import { run as runAddition, type RunResult } from './custom/run'
import { examples } from './examples'
import { INFO as exploration } from './info'

const result = ref<RunResult>()
const execResult = ref<ExecResult>()

async function run(data: string) {
  const r = await runAddition(data)
  result.value = r
  execResult.value = r.execResult
}
</script>

<template>
  <PrecompileInterfaceEC
    :config="config" :examples="examples" :exploration="exploration" :run="run"
  >
    <template #result>
      <div class="e-grid-single">
        <ResultBoxUIC title="Addition Result" :left="true">
          <template v-if="result">
            <p class="text-4xl font-mono font-bold mt-2 mb-4 break-all e-text">
              {{ result.sum }}
            </p>
            <p class="text-sm font-mono break-all text-slate-500">
              {{ bytesToHex(execResult!.returnValue) }}
            </p>
            <p class="text-xs text-slate-400 mt-3">
              Gas used: {{ execResult!.executionGasUsed }}
            </p>
          </template>
          <p v-else class="e-result-text-md mt-5">Waiting for input...</p>
        </ResultBoxUIC>
      </div>
    </template>
  </PrecompileInterfaceEC>
</template>

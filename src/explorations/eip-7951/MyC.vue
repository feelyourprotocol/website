<script setup lang="ts">
import { Hardfork } from '@ethereumjs/common'
import type { ExecResult } from '@ethereumjs/evm'
import { bytesToHex, equalsBytes } from '@ethereumjs/util'

import PrecompileInterfaceEC from '@/eComponents/precompileInterfaceEC/PrecompileInterfaceEC.vue'
import { useStandardPrecompileRun } from '@/eComponents/precompileInterfaceEC/run'
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'

import { config } from './config'
import { examples } from './examples'
import { INFO as exploration } from './info'

const { run } = useStandardPrecompileRun(Hardfork.Osaka, Hardfork.Osaka, '100')

const VALID_RETURN = new Uint8Array(32).fill(0)
VALID_RETURN[31] = 1

function verificationLabel(result: ExecResult | undefined): string {
  if (!result) return 'Not available'
  if (result.exceptionError) return 'Invalid — precompile reverted or errored'
  const ok = result.returnValue.length === 32 && equalsBytes(result.returnValue, VALID_RETURN)
  return ok ? 'Valid signature' : 'Invalid signature'
}

function verificationDetail(result: ExecResult | undefined): string {
  if (!result) return ''
  if (result.exceptionError) {
    return result.exceptionError.error?.toString() ?? 'Execution failed'
  }
  return `Return: ${bytesToHex(result.returnValue)}`
}
</script>

<template>
  <PrecompileInterfaceEC
    :config="config"
    :examples="examples"
    :exploration="exploration"
    :run="run"
  >
    <template #result="{ result }">
      <ResultBoxUIC title="Verification (Osaka)" :left="true">
        <div class="min-h-[4.5rem]">
          <template v-if="result">
            <p class="e-result-text-lg">{{ verificationLabel(result.post) }}</p>
            <p class="e-result-text-sm">{{ verificationDetail(result.post) }}</p>
            <p v-if="result.post" class="e-result-text-sm mt-2">
              Gas: {{ result.post.executionGasUsed }}
            </p>
          </template>
          <template v-else>
            <p class="e-result-text-lg opacity-40">—</p>
            <p class="e-result-text-sm opacity-40 mt-2">Run to verify the signature</p>
          </template>
        </div>
      </ResultBoxUIC>
    </template>
  </PrecompileInterfaceEC>
</template>

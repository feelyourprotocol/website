<script setup lang="ts">
import type { ExecResult } from '@ethereumjs/evm'
import { Hardfork } from '@ethereumjs/common'
import { bytesToHex, equalsBytes } from '@ethereumjs/util'

import PrecompileInterfaceEC from '@/eComponents/precompileInterfaceEC/PrecompileInterfaceEC.vue'
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'
import { useStandardPrecompileRun } from '@/eComponents/precompileInterfaceEC/run'

import { config } from './config'
import { examples } from './examples'
import { INFO as exploration } from './info'

const { run } = useStandardPrecompileRun(Hardfork.Osaka, Hardfork.Osaka, '100')

const VALID_RETURN = new Uint8Array(32).fill(0)
VALID_RETURN[31] = 1

function verificationLabel(result: ExecResult | undefined): string {
  if (!result) return 'Not available'
  if (result.exceptionError) return 'Invalid — precompile reverted or errored'
  const ok =
    result.returnValue.length === 32 && equalsBytes(result.returnValue, VALID_RETURN)
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
      <ResultBoxUIC v-if="result" title="Verification (Osaka)" :left="true">
        <p class="e-result-text-lg">{{ verificationLabel(result.post) }}</p>
        <p class="e-result-text-sm">{{ verificationDetail(result.post) }}</p>
        <p v-if="result.post" class="e-result-text-sm mt-2">
          Gas: {{ result.post.executionGasUsed }}
        </p>
      </ResultBoxUIC>
    </template>
  </PrecompileInterfaceEC>
</template>

<script setup lang="ts">
import type { ExecResult } from '@ethereumjs/evm'
import { bytesToHex } from '@ethereumjs/util'

import { PP_BOX_TEXT_BIG, PP_BOX_TEXT_MIDDLE, PP_BOX_TEXT_SMALL } from '@/components/lib/layout'
import PPBoxC from '@/components/ui/PPBoxC.vue'

const execResult = defineModel<ExecResult>()

defineProps(['title', 'left'])
</script>

<template>
  <PPBoxC :title="title" :left="left">
    <p v-if="execResult" :class="PP_BOX_TEXT_BIG">{{ execResult?.executionGasUsed }} Gas</p>
    <p v-if="execResult" :class="PP_BOX_TEXT_SMALL">
      Result: {{ execResult ? bytesToHex(execResult.returnValue) : '' }}
    </p>
    <p v-else :class="PP_BOX_TEXT_MIDDLE" class="mt-5">Not available</p>
  </PPBoxC>
</template>

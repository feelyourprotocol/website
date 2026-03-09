<script setup lang="ts">
import { Hardfork } from '@ethereumjs/common'

import PrecompileInterfaceEC from '@/eComponents/precompileInterfaceEC/PrecompileInterfaceEC.vue'
import PrecompileInterfaceResultEC from '@/eComponents/precompileInterfaceEC/PrecompileInterfaceResultEC.vue'
import { useStandardPrecompileRun } from '@/eComponents/precompileInterfaceEC/run'

import { config } from './config'
import { examples } from './examples'
import { INFO as exploration } from './info'

const { run, execResultPre, execResultPost } = useStandardPrecompileRun(
  Hardfork.Prague,
  Hardfork.Osaka,
  '100',
)
</script>

<template>
  <PrecompileInterfaceEC
    :config="config"
    :examples="examples"
    :exploration="exploration"
    :run="run"
  >
    <template #result>
      <div class="e-grid-double">
        <PrecompileInterfaceResultEC v-model="execResultPre" title="Pre-Osaka" :left="true" />
        <PrecompileInterfaceResultEC v-model="execResultPost" title="Post-Osaka" :left="false" />
      </div>
    </template>
  </PrecompileInterfaceEC>
</template>

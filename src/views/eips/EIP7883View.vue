<script setup lang="ts">
import EIP7883C from '@/components/eips/EIP7883C.vue'
import PrecompileC from '@/components/precompiles/PrecompileC.vue'
import { EIP7883 } from '../lib/eips'
</script>

<template>
  <div class="grid grid-cols-1">
    <p class="text-right text-3xl">
      <span class="ml-1">EIP</span>
    </p>
  </div>

  <div class="grid grid-cols-2">
    <PrecompileC
      :title="EIP7883['title']"
      :eip="EIP7883['num']"
      :descriptionHTML="EIP7883['descriptionHTML']"
    >
      <suspense>
        <EIP7883C />
      </suspense>
    </PrecompileC>
  </div>
</template>

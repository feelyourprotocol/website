<script setup lang="ts">
import EIP7823EVM from '@/components/EIP7823EVM.vue'
</script>

<template>
  <div class="bg-blue-300 bg-clip-border p-5 rounded-xl">

    <div class="grid grid-cols-2 mb-5">
      <h3 class="font-bold text-blue-900">Modexp upper bounds</h3>
      <h3 class="font-mono text-right">EIP-7823</h3>
    </div>

    <p class="text-blue-900 font-mono text-xs">The modexp precompile provides upper bounds for the input values.</p>

    <p>
      <EIP7823EVM />
    </p>
  </div>
</template>

<script setup lang="ts">
import EIP7823EVM from '@/components/EIP7883EVM.vue'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <div class="bg-blue-300 bg-clip-border p-5 rounded-xl">
    <div class="grid grid-cols-2 mb-3">
      <h3 class="font-bold text-xl text-blue-900">ModExp Gas Cost Increase</h3>
      <h3 class="font-mono text-right text-xl">
        <a
          href="https://eips.ethereum.org/EIPS/eip-7883"
          title="Visit EIP Specification"
          target="_blank"
        >
          <ArrowTopRightOnSquareIcon class="size-4 inline align-baseline text-blue-600" />
        </a>
        EIP-7883
      </h3>
    </div>

    <div class="text-blue-900 font-mono text-xs mb-6">
      Gas cost increases for the modexp precompile. There is a lot more to say here, but we won't
      say it right now.
    </div>

    <suspense>
      <EIP7823EVM />
    </suspense>
  </div>
</template>

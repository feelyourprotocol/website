<script setup lang="ts">
import EIP7883C from '@/components/eips/EIP7883C.vue'
import HardforkView from '../HardforkView.vue'
import DancerView from '../DancerView.vue'
</script>

<template>
  <HardforkView>
    <Suspense>
      <EIP7883C />
    </Suspense>
    <DancerView nameId="fusaka" />
    <Suspense>
      <EIP7951C />
    </Suspense>
  </HardforkView>
</template>

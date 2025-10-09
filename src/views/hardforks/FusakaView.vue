<script setup lang="ts">
import EIP7883C from '@/components/eips/EIP7883C.vue'
import HardforkView from '../HardforkView.vue'
import DancerView from '../DancerView.vue'
</script>

<template>
  <HardforkView>
    <suspense>
      <EIP7883C />
    </suspense>
    <DancerView />
  </HardforkView>
</template>

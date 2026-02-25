<script setup lang="ts">
import EIP7594C from '@/components/eips/EIP7594C.vue'
import EIP7883C from '@/components/eips/EIP7883C.vue'
import EIP7951C from '@/components/eips/EIP7951C.vue'
import TopicView from '../TopicView.vue'
import DancerView from '../DancerView.vue'
</script>

<template>
  <TopicView>
    <Suspense>
      <EIP7883C />
    </Suspense>
    <DancerView nameId="fusaka" />
    <Suspense>
      <EIP7594C />
    </Suspense>
    <Suspense>
      <EIP7951C />
    </Suspense>
  </TopicView>
</template>

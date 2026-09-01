<script setup lang="ts">
import { computed } from 'vue'

import HelpHintUIC from '@/eComponents/ui/HelpHintUIC.vue'

import { isValidByteInputForm } from './utils'

const val = defineModel<string>()

const props = defineProps<{
  title: string
  input: (event: Event) => void
  len: bigint
  expectedLen: bigint | undefined
  bigIntVal: bigint | undefined
}>()

const errors = computed(() => isValidByteInputForm(val?.value ?? '', props.expectedLen))

const validation = computed(() => {
  return errors.value.length > 0 ? 'text-red-400' : 'text-slate-600'
})

const hintText = computed(() => {
  if (errors.value.length > 0) {
    return errors.value.join(' | ')
  }
  return ''
})
</script>

<template>
  <div class="precompile-value-input">
    <div class="grid grid-cols-6 items-center gap-y-1">
      <p class="col-span-1 font-bold text-lg sm:text-xl e-text">{{ title }}</p>
      <HelpHintUIC
        :text="hintText"
        tier="essential"
        host-class="col-span-5 min-w-0"
        trigger-class="block w-full min-w-0"
        inline-class="text-right text-red-400"
      >
        <input @input="input" v-model="val" :class="validation" class="e-input text-right" />
      </HelpHintUIC>

      <p class="col-span-1 text-xs shrink-0">{{ len }} Bytes</p>
      <p class="col-span-5 text-right font-mono text-xs break-words min-w-0 overflow-hidden">
        {{ bigIntVal }}
      </p>
    </div>
  </div>
</template>

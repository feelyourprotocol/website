<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { InformationCircleIcon } from '@heroicons/vue/20/solid'

defineProps<{
  text: string
  label?: string
}>()
</script>

<template>
  <Popover v-if="text.trim()" v-slot="{ open }" class="relative shrink-0">
    <PopoverButton
      type="button"
      class="help-hint-popover-trigger inline-flex min-h-9 min-w-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
      :aria-label="label ?? 'More information'"
      :aria-expanded="open"
      @click.stop
    >
      <InformationCircleIcon class="size-4" aria-hidden="true" />
    </PopoverButton>

    <PopoverPanel
      class="help-hint-popover-panel absolute right-0 z-[100] mt-1 w-max max-w-[min(18rem,calc(100vw-2rem))] rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-xs leading-snug text-slate-600 shadow-lg"
      @click.stop
    >
      {{ text }}
    </PopoverPanel>
  </Popover>
</template>

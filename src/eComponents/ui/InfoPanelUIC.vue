<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

defineProps<{
  label: string
  ariaLabel?: string
  testId?: string
}>()
</script>

<template>
  <div class="relative shrink-0" @click.stop>
    <Popover v-slot="{ open }" class="relative">
      <PopoverButton
        type="button"
        class="e-info-panel-trigger"
        :data-testid="testId"
        :aria-label="ariaLabel ?? label"
        :aria-expanded="open"
      >
        {{ label }}
      </PopoverButton>
      <PopoverPanel
        class="e-info-panel"
        :data-testid="testId ? `${testId}-panel` : undefined"
        @click.stop
      >
        <slot />
      </PopoverPanel>
    </Popover>
  </div>
</template>

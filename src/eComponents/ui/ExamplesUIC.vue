<script setup lang="ts">
import { computed } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'

interface Examples {
  [key: string]: {
    title: string
    values: string[]
  }
}

const example = defineModel<string>()

const props = defineProps<{
  examples: Examples
  change: () => void
}>()

const selectedTitle = computed(() => {
  if (!example.value || !props.examples[example.value]) return 'Examples'
  return props.examples[example.value].title
})

function onSelect(key: string) {
  example.value = key
  props.change()
}
</script>

<template>
  <div class="text-right">
    <Listbox :model-value="example" @update:model-value="onSelect">
      <div class="relative inline-block">
        <ListboxButton class="e-select inline-flex items-center gap-1">
          {{ selectedTitle }}
          <ChevronUpDownIcon class="size-3.5 opacity-60" />
        </ListboxButton>

        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <ListboxOptions
            class="e-listbox-options absolute right-0 z-20 mt-1 w-max max-h-60 overflow-auto rounded-sm border text-xs shadow-lg focus:outline-none"
          >
            <ListboxOption
              v-for="(val, key) in examples"
              :key="key"
              :value="key"
              v-slot="{ active, selected }"
              as="template"
            >
              <li
                :class="[
                  'e-listbox-option cursor-pointer whitespace-nowrap px-3 py-1.5 select-none first:rounded-t-sm last:rounded-b-sm',
                  active ? 'e-listbox-option-active' : '',
                  selected ? 'font-bold' : '',
                ]"
              >
                {{ val.title }}
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

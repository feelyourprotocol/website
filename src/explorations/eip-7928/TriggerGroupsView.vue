<script setup lang="ts">
import type { TriggerGroupViewModel } from './transitions'

defineProps<{
  groups: TriggerGroupViewModel[]
  activePath: string | null
}>()

const emit = defineEmits<{
  hoverPath: [path: string | null]
}>()

function onEnter(path: string) {
  emit('hoverPath', path)
}

function onLeave() {
  emit('hoverPath', null)
}

function itemClass(
  path: string,
  activePath: string | null,
  groupClasses: TriggerGroupViewModel['group']['classes'],
) {
  const base = `rounded border px-2.5 py-2 cursor-default transition-all ${groupClasses.bgItem} ${groupClasses.border}`
  if (activePath === path) {
    return `${base} ring-2 ${groupClasses.ring} ${groupClasses.bg}`
  }
  return base
}
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="{ group, items } in groups"
      :key="group.id"
      :class="[
        'rounded-md border overflow-hidden',
        group.classes.borderCard,
        items.length === 0 ? 'opacity-40' : '',
      ]"
    >
      <div
        :class="[
          'flex items-center gap-2 px-3 py-2 border-b',
          group.classes.bg,
          group.classes.border,
        ]"
      >
        <component :is="group.icon" :class="['size-5 shrink-0', group.classes.accent]" />
        <div class="min-w-0">
          <p :class="['font-semibold text-sm', group.classes.text]">{{ group.name }}</p>
          <p class="text-xs text-slate-500 truncate">{{ group.triggerLabel }}</p>
        </div>
        <span v-if="items.length === 0" class="ml-auto text-xs font-mono text-slate-400 shrink-0">
          none
        </span>
        <span v-else class="ml-auto text-xs font-mono text-slate-500 shrink-0">
          {{ items.length }}
        </span>
      </div>

      <ul v-if="items.length > 0" class="p-2 space-y-1.5">
        <li
          v-for="item in items"
          :key="item.balPath"
          :class="itemClass(item.balPath, activePath, group.classes)"
          @mouseenter="onEnter(item.balPath)"
          @mouseleave="onLeave"
        >
          <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span :class="['font-medium text-sm', group.classes.text]">{{ item.summary }}</span>
            <span class="text-xs text-slate-400 font-mono">{{ item.addressLabel }}</span>
            <span
              v-if="item.indexBadge"
              class="text-xs px-1.5 py-0.5 rounded bg-white/60 text-slate-500 ml-auto"
            >
              {{ item.indexBadge }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mcpIcon, type McpIconId } from '../icons'

export type IconId = McpIconId

export interface IconGridItem {
  icon: IconId
  title: string
  detail: string
  href?: string
}

withDefaults(
  defineProps<{
    items: IconGridItem[]
    columns?: 2 | 3
  }>(),
  { columns: 2 },
)

function external(href: string | undefined): boolean {
  return !!href && /^https?:\/\//.test(href)
}
</script>

<template>
  <div
    class="fyp-icon-grid"
    :class="{ 'fyp-icon-grid--three': columns === 3 }"
    role="list"
    data-testid="icon-grid"
  >
    <component
      :is="item.href ? 'a' : 'div'"
      v-for="item in items"
      :key="item.title"
      class="fyp-icon-card"
      :class="{ 'fyp-icon-card--link': !!item.href }"
      role="listitem"
      :href="item.href || undefined"
      :target="external(item.href) ? '_blank' : undefined"
      :rel="external(item.href) ? 'noopener noreferrer' : undefined"
    >
      <component
        :is="mcpIcon(item.icon)"
        v-if="mcpIcon(item.icon)"
        class="fyp-icon-card__glyph"
        aria-hidden="true"
      />
      <p class="fyp-icon-card__title">{{ item.title }}</p>
      <p class="fyp-icon-card__detail">{{ item.detail }}</p>
    </component>
  </div>
</template>

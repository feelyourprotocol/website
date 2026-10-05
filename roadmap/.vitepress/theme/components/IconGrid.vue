<script setup lang="ts">
/**
 * Icon cards for a roadmap page. Icons are the site's Heroicons outline set.
 *
 *   <IconGrid :items="[
 *     { icon: 'book', title: 'Textbook', detail: 'A person learns the change.' },
 *   ]" />
 */
import { roadmapIcon, type RoadmapIconId } from '../icons'

export type IconId = RoadmapIconId

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

function glyph(icon: string) {
  return roadmapIcon(icon)
}

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
        :is="glyph(item.icon)"
        v-if="glyph(item.icon)"
        class="fyp-icon-card__glyph"
        aria-hidden="true"
      />
      <p class="fyp-icon-card__title">{{ item.title }}</p>
      <p class="fyp-icon-card__detail">{{ item.detail }}</p>
    </component>
  </div>
</template>

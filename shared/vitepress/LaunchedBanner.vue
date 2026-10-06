<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

withDefaults(
  defineProps<{
    kicker: string
    headline: string
    lede: string
    primaryHref: string
    primaryLabel: string
    secondaryHref: string
    secondaryLabel: string
    primaryExternal?: boolean
    secondaryExternal?: boolean
  }>(),
  {
    primaryExternal: false,
    secondaryExternal: false,
  },
)

let observer: ResizeObserver | undefined

onMounted(() => {
  const el = document.querySelector<HTMLElement>('[data-mcp-launched]')
  if (!el) return
  const apply = () => {
    document.documentElement.style.setProperty(
      '--vp-layout-top-height',
      `${Math.ceil(el.getBoundingClientRect().height)}px`,
    )
  }
  apply()
  observer = new ResizeObserver(apply)
  observer.observe(el)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <aside class="fyp-launched" data-mcp-launched :aria-label="headline">
    <div class="fyp-launched__rule" aria-hidden="true" />
    <div class="fyp-launched__inner">
      <div class="fyp-launched__mark" aria-hidden="true">
        <svg class="fyp-launched__glyph" viewBox="0 0 24 24" fill="none">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>
      </div>
      <div class="fyp-launched__copy">
        <p class="fyp-launched__kicker">
          <span class="fyp-launched__pill">
            <span class="fyp-launched__dot" aria-hidden="true" />
            Live
          </span>
          <span>{{ kicker }}</span>
        </p>
        <p class="fyp-launched__headline">{{ headline }}</p>
        <p class="fyp-launched__lede">{{ lede }}</p>
      </div>
      <div class="fyp-launched__actions">
        <a
          class="fyp-launched__cta"
          :href="primaryHref"
          :target="primaryExternal ? '_blank' : undefined"
          :rel="primaryExternal ? 'noopener noreferrer' : undefined"
        >
          {{ primaryLabel }}
        </a>
        <a
          class="fyp-launched__cta fyp-launched__cta--quiet"
          :href="secondaryHref"
          :target="secondaryExternal ? '_blank' : undefined"
          :rel="secondaryExternal ? 'noopener noreferrer' : undefined"
        >
          {{ secondaryLabel }}
        </a>
      </div>
    </div>
  </aside>
</template>

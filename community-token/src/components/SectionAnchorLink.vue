<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useLocationHash } from '@ct/composables/useLocationHash'

const props = defineProps<{
  id: string
}>()

const { hash, setHash } = useLocationHash()
const isActive = computed(() => hash.value === props.id)

const copied = ref(false)
let copiedTimeout: ReturnType<typeof setTimeout> | undefined

function onClick(event: MouseEvent): void {
  event.preventDefault()
  const url = `${window.location.origin}${window.location.pathname}#${props.id}`
  setHash(props.id)
  void navigator.clipboard.writeText(url).then(() => {
    copied.value = true
    clearTimeout(copiedTimeout)
    copiedTimeout = setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

onBeforeUnmount(() => {
  clearTimeout(copiedTimeout)
})
</script>

<template>
  <a
    :href="`#${id}`"
    class="ct-section-link"
    :class="{ 'ct-section-link--active': isActive }"
    :aria-current="isActive ? 'true' : undefined"
    :aria-label="copied ? 'Link copied' : `Link to this section`"
    :title="copied ? 'Copied!' : 'Copy link to this section'"
    @click="onClick"
  >
    <span aria-hidden="true">#</span>
  </a>
</template>

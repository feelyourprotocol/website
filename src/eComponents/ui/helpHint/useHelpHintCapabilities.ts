import { onMounted, onUnmounted, ref } from 'vue'

const HOVER_FINE_QUERY = '(hover: hover) and (pointer: fine)'

/** True when the primary input supports hover tooltips (fine pointer + hover). */
export function useHelpHintCapabilities() {
  const canHover = ref(false)

  let media: MediaQueryList | undefined

  function sync() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      canHover.value = false
      return
    }
    canHover.value = window.matchMedia(HOVER_FINE_QUERY).matches
  }

  onMounted(() => {
    sync()
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    media = window.matchMedia(HOVER_FINE_QUERY)
    media.addEventListener('change', sync)
  })

  onUnmounted(() => {
    media?.removeEventListener('change', sync)
  })

  return { canHover }
}

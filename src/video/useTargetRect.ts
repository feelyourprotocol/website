import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue'

export function useTargetRect(selector: Ref<string>): Ref<DOMRect | null> {
  const targetRect = ref<DOMRect | null>(null)
  let observer: ResizeObserver | undefined
  let raf = 0

  function measure() {
    const el = document.querySelector(selector.value)
    if (!el) {
      targetRect.value = null
      return
    }
    const rect = el.getBoundingClientRect()
    if (rect.width <= 0 && rect.height <= 0) {
      targetRect.value = null
      return
    }
    targetRect.value = rect
  }

  function scheduleMeasure() {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(measure)
  }

  function attachObserver() {
    observer?.disconnect()
    observer = new ResizeObserver(scheduleMeasure)
    const el = document.querySelector(selector.value)
    if (el) observer.observe(el)
    scheduleMeasure()
  }

  watch(selector, attachObserver)

  onMounted(() => {
    scheduleMeasure()
    window.addEventListener('scroll', scheduleMeasure, { passive: true, capture: true })
    window.addEventListener('resize', scheduleMeasure, { passive: true })
    attachObserver()
  })

  onUnmounted(() => {
    cancelAnimationFrame(raf)
    observer?.disconnect()
    window.removeEventListener('scroll', scheduleMeasure, true)
    window.removeEventListener('resize', scheduleMeasure)
  })

  return targetRect
}

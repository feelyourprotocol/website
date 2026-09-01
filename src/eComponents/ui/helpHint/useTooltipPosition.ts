import { nextTick, onMounted, onUnmounted, type Ref, ref, watch } from 'vue'

const VIEWPORT_PAD = 8
const GAP = 8

export interface TooltipPosition {
  top: number
  left: number
}

/** Viewport-safe fixed coordinates for a tooltip anchored to a trigger element. */
export function useTooltipPosition(
  visible: Ref<boolean>,
  triggerEl: Ref<HTMLElement | null | undefined>,
  tooltipEl: Ref<HTMLElement | null | undefined>,
) {
  const position = ref<TooltipPosition>({ top: 0, left: 0 })

  function updatePosition() {
    const trigger = triggerEl.value
    const tooltip = tooltipEl.value
    if (!trigger || !tooltip) return

    const tr = trigger.getBoundingClientRect()
    const tt = tooltip.getBoundingClientRect()
    const vw = window.innerWidth

    let top = tr.top - tt.height - GAP
    if (top < VIEWPORT_PAD) {
      top = tr.bottom + GAP
    }

    let left = tr.left + tr.width / 2 - tt.width / 2
    left = Math.max(VIEWPORT_PAD, Math.min(left, vw - tt.width - VIEWPORT_PAD))

    position.value = { top, left }
  }

  watch(visible, async (show) => {
    if (!show) return
    await nextTick()
    updatePosition()
  })

  function onViewportChange() {
    if (visible.value) updatePosition()
  }

  onMounted(() => {
    window.addEventListener('scroll', onViewportChange, true)
    window.addEventListener('resize', onViewportChange)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onViewportChange, true)
    window.removeEventListener('resize', onViewportChange)
  })

  return { position, updatePosition }
}

import { onBeforeUnmount, ref } from 'vue'

/** Clipboard copy with a short "copied" flag for button feedback. */
export function useCopy(resetMs = 2000) {
  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        copied.value = false
      }, resetMs)
      return true
    } catch {
      copied.value = false
      return false
    }
  }

  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer)
  })

  return { copied, copy }
}

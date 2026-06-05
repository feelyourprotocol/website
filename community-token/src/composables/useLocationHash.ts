import { onBeforeUnmount, onMounted, type Ref, ref } from 'vue'

const hash: Ref<string> = ref('')
let listenerCount = 0

function readHash(): void {
  hash.value = window.location.hash.replace(/^#/, '')
}

function setHash(id: string): void {
  window.history.replaceState(null, '', `#${id}`)
  hash.value = id
}

export function useLocationHash(): { hash: Ref<string>; setHash: (id: string) => void } {
  onMounted(() => {
    if (listenerCount === 0) {
      readHash()
      window.addEventListener('hashchange', readHash)
    }
    listenerCount++
  })

  onBeforeUnmount(() => {
    listenerCount--
    if (listenerCount === 0) {
      window.removeEventListener('hashchange', readHash)
    }
  })

  return { hash, setHash }
}

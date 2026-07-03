import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'

/** URL query key that activates the video overlay shell (no site chrome). */
export const FYP_VIDEO_QUERY_PARAM = 'fyp-video'

export function isVideoModeQuery(query: Record<string, unknown>): boolean {
  const value = query[FYP_VIDEO_QUERY_PARAM]
  return value === '1' || value === 'true' || value === ''
}

export function useVideoMode(): ComputedRef<boolean> {
  const route = useRoute()
  return computed(() => isVideoModeQuery(route.query as Record<string, unknown>))
}

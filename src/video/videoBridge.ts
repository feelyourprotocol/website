import { type CompanionExpandMode,dispatchCompanionExpand } from './companionSheetEvents'
import type {
  ActiveVideoAnnotation,
  ActiveVideoHighlightSet,
  ActiveVideoOverlay,
  ShowOverlayOptions,
  VideoContentConfig,
  VideoOverlayPlacement,
} from './types'

export interface FypVideoBridge {
  showOverlay(id: string, options?: ShowOverlayOptions): Promise<void>
  hideOverlay(): Promise<void>
  showAnnotation(id: string): Promise<void>
  hideAnnotation(): Promise<void>
  showHighlightSet(id: string): Promise<void>
  hideHighlights(): Promise<void>
  expandCompanion(mode: CompanionExpandMode): Promise<void>
  wait(ms: number): Promise<void>
  ready(): boolean
}

declare global {
  interface Window {
    __FYP_VIDEO__?: FypVideoBridge
    __FYP_VIDEO_CONFIG__?: VideoContentConfig
  }
}

export interface VideoBridgeHandlers {
  onShowOverlay: (id: string, options?: ShowOverlayOptions) => void
  onHideOverlay: () => void
  onShowAnnotation: (id: string) => void
  onHideAnnotation: () => void
  onShowHighlightSet: (id: string) => void
  onHideHighlights: () => void
  isReady: () => boolean
}

export function createVideoBridge(handlers: VideoBridgeHandlers): FypVideoBridge {
  return {
    showOverlay(id: string, options?: ShowOverlayOptions) {
      handlers.onShowOverlay(id, options)
      return Promise.resolve()
    },
    hideOverlay() {
      handlers.onHideOverlay()
      return Promise.resolve()
    },
    showAnnotation(id: string) {
      handlers.onShowAnnotation(id)
      return Promise.resolve()
    },
    hideAnnotation() {
      handlers.onHideAnnotation()
      return Promise.resolve()
    },
    showHighlightSet(id: string) {
      handlers.onShowHighlightSet(id)
      return Promise.resolve()
    },
    hideHighlights() {
      handlers.onHideHighlights()
      return Promise.resolve()
    },
    expandCompanion(mode: CompanionExpandMode) {
      dispatchCompanionExpand(mode)
      return Promise.resolve()
    },
    wait(ms: number) {
      return new Promise((resolve) => window.setTimeout(resolve, ms))
    },
    ready() {
      return handlers.isReady()
    },
  }
}

export function installVideoBridge(handlers: VideoBridgeHandlers): () => void {
  const bridge = createVideoBridge(handlers)
  window.__FYP_VIDEO__ = bridge
  return () => {
    delete window.__FYP_VIDEO__
  }
}

export function readVideoConfigFromWindow(): VideoContentConfig | undefined {
  return window.__FYP_VIDEO_CONFIG__
}

const FULLSCREEN_TYPES = new Set(['title-card', 'outro-card', 'title', 'outro'])

export function defaultPlacementForOverlay(
  type: string | undefined,
): VideoOverlayPlacement | undefined {
  if (!type || FULLSCREEN_TYPES.has(type)) return undefined
  return 'top-banner'
}

export function resolveActiveOverlay(
  config: VideoContentConfig | undefined,
  overlayId: string | null,
  options?: ShowOverlayOptions,
): ActiveVideoOverlay | null {
  if (!config || overlayId === null) return null
  const definition = config.overlays[overlayId]
  if (!definition) return null
  const placement =
    options?.placement ?? definition.placement ?? defaultPlacementForOverlay(definition.type)
  return { id: overlayId, definition, placement }
}

export function resolveActiveAnnotation(
  config: VideoContentConfig | undefined,
  annotationId: string | null,
): ActiveVideoAnnotation | null {
  if (!config || annotationId === null) return null
  const definition = config.annotations?.[annotationId]
  if (!definition) return null
  return { id: annotationId, definition }
}

export function resolveActiveHighlightSet(
  config: VideoContentConfig | undefined,
  setId: string | null,
): ActiveVideoHighlightSet | null {
  if (!config || setId === null) return null
  const definition = config.highlightSets?.[setId]
  if (!definition) return null
  return { id: setId, marks: definition.marks }
}

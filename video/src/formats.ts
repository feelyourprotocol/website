/** Vertical short-form presets (YouTube Shorts, Reels, X) — strict 9:16. */
const REFERENCE_WIDTH = 540
const REFERENCE_HEIGHT = 960
const OUTPUT_WIDTH = 1080
const OUTPUT_HEIGHT = 1920

/**
 * Layout is authored at 540×960 (`shorts-preview`). Full deliverables are a 2× upscale
 * during mux — never a separate 1080px CSS viewport (that diverged from preview).
 *
 * Playwright records at the reference viewport; `recordVideo.size` must match it exactly.
 */
export const VIDEO_FORMATS = {
  shorts: {
    width: OUTPUT_WIDTH,
    height: OUTPUT_HEIGHT,
    viewportWidth: REFERENCE_WIDTH,
    viewportHeight: REFERENCE_HEIGHT,
    deviceScaleFactor: 1,
  },
  'shorts-preview': {
    width: REFERENCE_WIDTH,
    height: REFERENCE_HEIGHT,
    viewportWidth: REFERENCE_WIDTH,
    viewportHeight: REFERENCE_HEIGHT,
    deviceScaleFactor: 1,
  },
} as const

export type VideoFormatId = keyof typeof VIDEO_FORMATS

export type VideoFormat = (typeof VIDEO_FORMATS)[VideoFormatId]

/** Viewport used for Playwright capture (layout reference). */
export const VIDEO_RECORD_FORMAT = VIDEO_FORMATS['shorts-preview']

export function parseVideoFormatId(value: string | undefined): VideoFormatId {
  if (value === 'shorts-preview') return 'shorts-preview'
  return 'shorts'
}

/** Deliverable may be 2× reference; recording viewport is always the reference size. */
export function assertFormatViewportMatchesOutput(format: VideoFormat): void {
  const scaleW = format.width / format.viewportWidth
  const scaleH = format.height / format.viewportHeight
  if (!Number.isInteger(scaleW) || !Number.isInteger(scaleH) || scaleW !== scaleH) {
    throw new Error(
      `Video format ${format.width}×${format.height}: output must be an uniform integer scale of viewport (${format.viewportWidth}×${format.viewportHeight})`,
    )
  }
}

export function deliverableScale(format: VideoFormat): number {
  return format.width / format.viewportWidth
}

/** Vertical short-form presets (YouTube Shorts, Reels, X) — strict 9:16. */
const OUTPUT_WIDTH = 1080
const OUTPUT_HEIGHT = 1920

/**
 * Viewport must equal output dimensions so Playwright recordVideo fills the frame.
 * Set `recordVideo.size` to the same values — if omitted, Playwright downscales to fit 800×800;
 * if size exceeds viewport, Playwright pads with gray letterboxing.
 *
 * Mobile companion-sheet layout at 1080px width is forced via `html.fyp-video-capture` CSS.
 */
export const VIDEO_FORMATS = {
  shorts: {
    width: OUTPUT_WIDTH,
    height: OUTPUT_HEIGHT,
    viewportWidth: OUTPUT_WIDTH,
    viewportHeight: OUTPUT_HEIGHT,
    deviceScaleFactor: 1,
  },
  'shorts-preview': {
    width: 540,
    height: 960,
    viewportWidth: 540,
    viewportHeight: 960,
    deviceScaleFactor: 1,
  },
} as const

export type VideoFormatId = keyof typeof VIDEO_FORMATS

export function parseVideoFormatId(value: string | undefined): VideoFormatId {
  if (value === 'shorts-preview') return 'shorts-preview'
  return 'shorts'
}

/** Viewport and output dimensions must match (no Playwright recordVideo letterboxing). */
export function assertFormatViewportMatchesOutput(format: (typeof VIDEO_FORMATS)[VideoFormatId]): void {
  if (format.viewportWidth !== format.width || format.viewportHeight !== format.height) {
    throw new Error(
      `Video format ${format.width}×${format.height}: viewport must match output (got ${format.viewportWidth}×${format.viewportHeight})`,
    )
  }
}

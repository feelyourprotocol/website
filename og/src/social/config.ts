import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { SocialCardId } from './cardIds.ts'

const here = dirname(fileURLToPath(import.meta.url))

/** website/og */
export const PACKAGE_ROOT = resolve(here, '..', '..')
/** website/ */
export const WEBSITE_ROOT = resolve(here, '..', '..', '..')
/** Built social preview app (run `npm run social:build` first). */
export const SOCIAL_DIST_DIR = resolve(WEBSITE_ROOT, 'roadmap', 'social', 'dist')
/** PNG + WebP output for tweets (gitignored — copy what you need). */
export const SOCIAL_OUTPUT_DIR = resolve(WEBSITE_ROOT, 'roadmap', 'social', 'out')

/** Twitter-friendly width; cards are captured at natural height then normalized. */
export const SOCIAL_CAPTURE_WIDTH = 1200

/** YouTube channel art — recommended upload size (safe zone 1546×423 centered). */
export const YOUTUBE_BANNER_WIDTH = 2560
export const YOUTUBE_BANNER_HEIGHT = 1440

/** Committed master — not gitignored like roadmap/social/out/. */
export const YOUTUBE_BANNER_OUTPUT_DIR = resolve(WEBSITE_ROOT, 'design/source/youtube')

export type SocialCardCaptureSpec = {
  width: number
  height?: number
  deviceScaleFactor: number
}

export function socialCardCaptureSpec(id: SocialCardId): SocialCardCaptureSpec {
  if (id === 'youtube-banner') {
    return {
      width: YOUTUBE_BANNER_WIDTH,
      height: YOUTUBE_BANNER_HEIGHT,
      deviceScaleFactor: 1,
    }
  }
  return { width: SOCIAL_CAPTURE_WIDTH, deviceScaleFactor: 2 }
}

export function socialCardOutputBase(id: SocialCardId): string {
  if (id === 'youtube-banner') {
    return join(YOUTUBE_BANNER_OUTPUT_DIR, 'channel-banner')
  }
  return join(SOCIAL_OUTPUT_DIR, id)
}

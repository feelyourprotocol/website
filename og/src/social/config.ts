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

export function socialCardOutputBase(id: SocialCardId): string {
  return join(SOCIAL_OUTPUT_DIR, id)
}

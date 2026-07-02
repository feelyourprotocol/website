import { resolve } from 'node:path'

import { WEBSITE_ROOT } from './config.ts'

/** roadmap/public/og — render template + generated default.webp (no Playwright import). */
export const ROADMAP_OG_PUBLIC_DIR = resolve(WEBSITE_ROOT, 'roadmap', 'public', 'og')
export const ROADMAP_OG_RENDER_HTML = resolve(ROADMAP_OG_PUBLIC_DIR, 'render.html')
export const ROADMAP_OG_OUTPUT = resolve(ROADMAP_OG_PUBLIC_DIR, 'default.webp')

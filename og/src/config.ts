import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

/** website/og */
export const PACKAGE_ROOT = resolve(here, '..')
/** website/ */
export const WEBSITE_ROOT = resolve(here, '..', '..')
/** website/src/explorations */
export const EXPLORATIONS_DIR = resolve(WEBSITE_ROOT, 'src', 'explorations')
export const TOPICS_FILE = resolve(WEBSITE_ROOT, 'src', 'explorations', 'TOPICS.ts')
export const LOGO_PATH = resolve(WEBSITE_ROOT, 'src', 'logo.png')
export const TEMPLATES_DIR = resolve(PACKAGE_ROOT, 'templates')
export const TMP_DIR = resolve(PACKAGE_ROOT, '.tmp')
export const PUBLIC_OG_DIR = resolve(WEBSITE_ROOT, 'public', 'og')
export const EXPLORATIONS_OG_DIR = resolve(PUBLIC_OG_DIR, 'explorations')
export const TOPICS_OG_DIR = resolve(PUBLIC_OG_DIR, 'topics')
export const MANIFEST_PATH = resolve(PUBLIC_OG_DIR, 'manifest.json')

/** Standard Open Graph / Twitter card size. */
export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

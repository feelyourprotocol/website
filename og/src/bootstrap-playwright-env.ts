import { existsSync } from 'node:fs'
import { homedir, platform } from 'node:os'
import { join } from 'node:path'

/** Playwright cache dir for the logged-in user (not Cursor's sandbox copy). */
export function defaultPlaywrightCacheDir(home = homedir()): string {
  switch (platform()) {
    case 'darwin':
      return join(home, 'Library/Caches/ms-playwright')
    case 'win32':
      return join(home, 'AppData', 'Local', 'ms-playwright')
    default:
      return join(home, '.cache', 'ms-playwright')
  }
}

export function isCursorSandboxBrowsersPath(path: string): boolean {
  return /cursor-sandbox-cache|cursor-sandbox/i.test(path)
}

/**
 * Cursor injects PLAYWRIGHT_BROWSERS_PATH pointing at an empty sandbox cache.
 * Redirect to the developer's real cache so og:check / capture use Holger's Chromium.
 * Must run before any `playwright` import (side-effect import this module first).
 */
export function bootstrapPlaywrightEnv(): void {
  const current = process.env.PLAYWRIGHT_BROWSERS_PATH ?? ''
  const userCache = defaultPlaywrightCacheDir()

  if (current && isCursorSandboxBrowsersPath(current)) {
    process.env.PLAYWRIGHT_BROWSERS_PATH = userCache
    return
  }

  if (!current && existsSync(userCache)) {
    process.env.PLAYWRIGHT_BROWSERS_PATH = userCache
  }
}

bootstrapPlaywrightEnv()

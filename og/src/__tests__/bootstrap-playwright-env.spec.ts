import { describe, expect, it } from 'vitest'

import {
  bootstrapPlaywrightEnv,
  defaultPlaywrightCacheDir,
  isCursorSandboxBrowsersPath,
} from '../bootstrap-playwright-env.ts'

describe('bootstrap-playwright-env', () => {
  it('detects Cursor sandbox browser paths', () => {
    expect(
      isCursorSandboxBrowsersPath(
        '/var/folders/xx/cursor-sandbox-cache/abc/playwright/chromium',
      ),
    ).toBe(true)
    expect(isCursorSandboxBrowsersPath('/Users/holger/Library/Caches/ms-playwright')).toBe(false)
  })

  it('redirects sandbox PLAYWRIGHT_BROWSERS_PATH to user cache', () => {
    const sandboxPath = '/tmp/cursor-sandbox-cache/abc/playwright'
    process.env.PLAYWRIGHT_BROWSERS_PATH = sandboxPath
    bootstrapPlaywrightEnv()
    expect(process.env.PLAYWRIGHT_BROWSERS_PATH).toBe(defaultPlaywrightCacheDir())
    delete process.env.PLAYWRIGHT_BROWSERS_PATH
  })
})

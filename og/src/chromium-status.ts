import { accessSync, constants, existsSync } from 'node:fs'

import {
  type ChromiumStatus,
  playwrightPackageRoot,
  readChromiumStamp,
} from './chromium-status-core.ts'

export * from './chromium-status-core.ts'

function canExecute(path: string): boolean {
  try {
    accessSync(path, constants.X_OK)
    return true
  } catch {
    return false
  }
}

/** Filesystem-only inspection — safe in CI when og/ deps are absent (no static playwright import). */
export async function inspectChromiumEnvironment(): Promise<ChromiumStatus> {
  if (!existsSync(playwrightPackageRoot())) {
    return { kind: 'og_deps_missing' }
  }

  const { chromium } = await import('playwright')

  let executablePath: string
  try {
    executablePath = chromium.executablePath()
  } catch (err) {
    return {
      kind: 'browser_missing',
      detail: err instanceof Error ? err.message : String(err),
    }
  }

  if (!existsSync(executablePath)) {
    return { kind: 'browser_missing', executablePath }
  }

  if (!canExecute(executablePath)) {
    const stamp = readChromiumStamp()
    if (stamp) {
      return {
        kind: 'needs_agent_permissions',
        executablePath,
        stamp,
        detail: 'Chromium binary exists but is not executable from this environment.',
      }
    }
    return { kind: 'browser_not_executable', executablePath }
  }

  return { kind: 'ready', executablePath, stamp: readChromiumStamp() }
}

import { chromium } from 'playwright'

import {
  formatChromiumStatus,
  inspectChromiumEnvironment,
  launchFailureStatus,
  writeChromiumStamp,
} from './chromium-status.ts'

/** Fail fast with a clear message when Chromium was never installed for this package. */
export async function assertChromiumReady(): Promise<void> {
  const env = await inspectChromiumEnvironment()

  if (env.kind === 'og_deps_missing' || env.kind === 'browser_missing') {
    throw new Error(formatChromiumStatus(env))
  }

  if (env.kind === 'browser_not_executable' || env.kind === 'needs_agent_permissions') {
    throw new Error(formatChromiumStatus(env))
  }

  let browser
  try {
    browser = await chromium.launch({ headless: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(formatChromiumStatus(launchFailureStatus(message, env)))
  } finally {
    await browser?.close()
  }
}

export async function printChromiumStatus(): Promise<void> {
  await assertChromiumReady()
  const env = await inspectChromiumEnvironment()
  if (env.executablePath) writeChromiumStamp(env.executablePath)
  console.log('OK: Playwright Chromium is installed and launchable.')
}

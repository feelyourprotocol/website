import { chromium } from 'playwright'

const SETUP_HINT = 'Run once from website/:  npm run og:setup'

/** Fail fast with a clear message when Chromium was never installed for this package. */
export async function assertChromiumReady(): Promise<void> {
  let browser
  try {
    browser = await chromium.launch({ headless: true })
  } catch {
    throw new Error(`Playwright Chromium is not ready.\n${SETUP_HINT}`)
  } finally {
    await browser?.close()
  }
}

export async function printChromiumStatus(): Promise<void> {
  await assertChromiumReady()
  console.log('OK: Playwright Chromium is installed and launchable.')
}

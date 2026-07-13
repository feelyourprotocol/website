import './bootstrap-playwright-env.ts'

import { assertChromiumReady } from './chromium.ts'

async function main(): Promise<void> {
  await assertChromiumReady()
  console.log('OK: Playwright Chromium is installed and launchable for video recording.')
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})

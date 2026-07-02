import './bootstrap-playwright-env.ts'
import { printChromiumStatus } from './check-browsers.ts'

printChromiumStatus().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})

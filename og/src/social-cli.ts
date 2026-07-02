import './bootstrap-playwright-env.ts'
import { captureSocialCards } from './social/capture.ts'

function usage(): never {
  console.error(`Usage:
  npm run capture:social -- hero timeline board
  npm run capture:social -- all

Build preview first:  npm run social:build
Preview in browser:   npm run social:dev  →  http://localhost:5175/?card=timeline`)
  process.exit(1)
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  if (args.includes('-h') || args.includes('--help')) usage()
  if (args.length === 0) {
    await captureSocialCards(['all'])
    return
  }
  await captureSocialCards(args)
}

main().catch((err) => {
  console.error(`\nSocial capture failed: ${err instanceof Error ? err.message : String(err)}`)
  process.exit(1)
})

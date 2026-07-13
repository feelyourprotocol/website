import './bootstrap-playwright-env.ts'

import { type ChromiumStatusKind,formatChromiumStatus, inspectChromiumEnvironment } from './chromium.ts'

function statusForAgent(kind: ChromiumStatusKind): string {
  switch (kind) {
    case 'ready':
      return 'ready'
    case 'og_deps_missing':
    case 'browser_missing':
    case 'launch_failed':
      return 'needs_human_setup'
    case 'browser_not_executable':
    case 'needs_agent_permissions':
      return 'needs_agent_permissions'
    default:
      return 'unknown'
  }
}

async function main(): Promise<void> {
  const env = await inspectChromiumEnvironment()
  const agentStatus = statusForAgent(env.kind)

  console.log(`status: ${agentStatus}`)
  console.log(formatChromiumStatus(env))
  if (env.executablePath) console.log(`executable: ${env.executablePath}`)
  if (env.stamp) console.log(`last_verified: ${env.stamp.checkedAt}`)

  process.exit(agentStatus === 'ready' ? 0 : 1)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})

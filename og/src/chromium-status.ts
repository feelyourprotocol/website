import { accessSync, constants, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const here = dirname(fileURLToPath(import.meta.url))
export const OG_PACKAGE_ROOT = join(here, '..')
export const CHROMIUM_STAMP_PATH = join(OG_PACKAGE_ROOT, '.chromium-ready.json')

export type ChromiumStatusKind =
  | 'ready'
  | 'og_deps_missing'
  | 'browser_missing'
  | 'browser_not_executable'
  | 'needs_agent_permissions'
  | 'launch_failed'

export interface ChromiumStamp {
  checkedAt: string
  executablePath: string
  playwrightVersion: string
}

export interface ChromiumStatus {
  kind: ChromiumStatusKind
  executablePath?: string
  stamp?: ChromiumStamp
  detail?: string
}

export const AGENT_PERMISSIONS_HINT =
  'Cursor agent: run OG/capture commands with required_permissions: ["all"]. Do NOT run og:setup or playwright install.'

export const HUMAN_SETUP_HINT = 'Human (once per machine, from website/):  npm run og:setup && npm run og:check'

function playwrightPackageRoot(): string {
  return join(OG_PACKAGE_ROOT, 'node_modules', 'playwright')
}

function installedPlaywrightVersion(): string {
  try {
    const pkg = JSON.parse(
      readFileSync(join(playwrightPackageRoot(), 'package.json'), 'utf8'),
    ) as { version?: string }
    return pkg.version ?? 'unknown'
  } catch {
    return 'unknown'
  }
}

function canExecute(path: string): boolean {
  try {
    accessSync(path, constants.X_OK)
    return true
  } catch {
    return false
  }
}

export function readChromiumStamp(): ChromiumStamp | undefined {
  if (!existsSync(CHROMIUM_STAMP_PATH)) return undefined
  try {
    return JSON.parse(readFileSync(CHROMIUM_STAMP_PATH, 'utf8')) as ChromiumStamp
  } catch {
    return undefined
  }
}

export function writeChromiumStamp(executablePath: string): ChromiumStamp {
  const stamp: ChromiumStamp = {
    checkedAt: new Date().toISOString(),
    executablePath,
    playwrightVersion: installedPlaywrightVersion(),
  }
  writeFileSync(CHROMIUM_STAMP_PATH, `${JSON.stringify(stamp, null, 2)}\n`, 'utf8')
  return stamp
}

/** Filesystem-only inspection — safe in CI; does not launch a browser. */
export function inspectChromiumEnvironment(): ChromiumStatus {
  if (!existsSync(playwrightPackageRoot())) {
    return { kind: 'og_deps_missing' }
  }

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

export function formatChromiumStatus(status: ChromiumStatus): string {
  switch (status.kind) {
    case 'ready':
      return 'OK: Playwright Chromium is installed and launchable.'
    case 'og_deps_missing':
      return `Playwright package is not installed in og/.\n${HUMAN_SETUP_HINT}`
    case 'browser_missing':
      return `Playwright Chromium browser is not downloaded.\n${HUMAN_SETUP_HINT}${
        status.executablePath ? `\nExpected: ${status.executablePath}` : ''
      }`
    case 'browser_not_executable':
      return `Chromium exists but cannot be executed from this environment.\n${AGENT_PERMISSIONS_HINT}\nPath: ${status.executablePath}`
    case 'needs_agent_permissions':
      return `Chromium is installed on this machine but not reachable from the Cursor sandbox.\n${AGENT_PERMISSIONS_HINT}${
        status.stamp ? `\nLast verified: ${status.stamp.checkedAt}` : ''
      }`
    case 'launch_failed':
      return status.detail
        ? `Playwright Chromium launch failed.\n${status.detail}`
        : `Playwright Chromium launch failed.\n${AGENT_PERMISSIONS_HINT}`
    default:
      return 'Unknown Chromium status.'
  }
}

export function launchFailureStatus(message: string, env: ChromiumStatus): ChromiumStatus {
  const stamp = env.stamp ?? readChromiumStamp()
  const likelySandbox =
    Boolean(stamp) ||
    env.kind === 'needs_agent_permissions' ||
    env.kind === 'browser_not_executable' ||
    /EACCES|EPERM|sandbox|Operation not permitted/i.test(message)

  if (likelySandbox) {
    return {
      kind: 'needs_agent_permissions',
      executablePath: env.executablePath,
      stamp,
      detail: `${AGENT_PERMISSIONS_HINT}\n\nLaunch error: ${message}`,
    }
  }

  return {
    kind: 'launch_failed',
    executablePath: env.executablePath,
    detail: `${HUMAN_SETUP_HINT}\n\nLaunch error: ${message}`,
  }
}

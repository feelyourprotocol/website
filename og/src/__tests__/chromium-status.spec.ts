import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { afterEach, describe, expect, it } from 'vitest'

import {
  AGENT_PERMISSIONS_HINT,
  CHROMIUM_STAMP_PATH,
  formatChromiumStatus,
  launchFailureStatus,
  OG_PACKAGE_ROOT,
  playwrightPackageRoot,
  readChromiumStamp,
} from '../chromium-status-core.ts'

describe('chromium status (CI-safe — no playwright import)', () => {
  afterEach(() => {
    if (existsSync(CHROMIUM_STAMP_PATH)) rmSync(CHROMIUM_STAMP_PATH)
  })

  it('playwrightPackageRoot resolves under og/', () => {
    expect(playwrightPackageRoot()).toBe(`${OG_PACKAGE_ROOT}/node_modules/playwright`)
  })

  it('reads and writes chromium stamp', () => {
    const stamp = {
      checkedAt: '2026-06-30T12:00:00.000Z',
      executablePath: '/tmp/chromium',
      playwrightVersion: '1.61.1',
    }
    mkdirSync(OG_PACKAGE_ROOT, { recursive: true })
    writeFileSync(CHROMIUM_STAMP_PATH, JSON.stringify(stamp), 'utf8')
    expect(readChromiumStamp()).toEqual(stamp)
  })
})

describe('formatChromiumStatus', () => {
  it('never tells agents to run og:setup when permissions are the issue', () => {
    const msg = formatChromiumStatus({
      kind: 'needs_agent_permissions',
      executablePath: '/Users/holger/.cache/ms-playwright/chromium-1234/chrome',
      stamp: {
        checkedAt: '2026-06-30T12:00:00.000Z',
        executablePath: '/Users/holger/.cache/ms-playwright/chromium-1234/chrome',
        playwrightVersion: '1.61.1',
      },
    })
    expect(msg).toContain(AGENT_PERMISSIONS_HINT)
    expect(msg).not.toContain('npm run og:setup')
  })

  it('tells humans to run setup when og deps are missing', () => {
    const msg = formatChromiumStatus({ kind: 'og_deps_missing' })
    expect(msg).toContain('npm run og:setup')
    expect(msg).not.toContain('required_permissions')
  })
})

describe('launchFailureStatus', () => {
  it('prefers agent permissions hint when stamp proves prior successful check', () => {
    const status = launchFailureStatus('spawn EACCES', {
      kind: 'ready',
      executablePath: '/tmp/chromium',
      stamp: {
        checkedAt: '2026-06-30T12:00:00.000Z',
        executablePath: '/tmp/chromium',
        playwrightVersion: '1.61.1',
      },
    })
    expect(status.kind).toBe('needs_agent_permissions')
    expect(formatChromiumStatus(status)).toContain('required_permissions')
    expect(formatChromiumStatus(status)).not.toContain('npm run og:setup')
  })
})

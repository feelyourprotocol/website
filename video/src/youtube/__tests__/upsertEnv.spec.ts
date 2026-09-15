import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { upsertEnvValue } from '../upsertEnv.ts'

describe('upsertEnvValue', () => {
  it('replaces an existing key and appends a missing one', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fyp-env-'))
    const envPath = join(dir, '.env')
    writeFileSync(envPath, 'ELEVENLABS_API_KEY=keep\nYOUTUBE_REFRESH_TOKEN=old\n')
    upsertEnvValue(envPath, 'YOUTUBE_REFRESH_TOKEN', 'new-token')
    const once = readFileSync(envPath, 'utf8')
    expect(once).toContain('ELEVENLABS_API_KEY=keep')
    expect(once).toContain('YOUTUBE_REFRESH_TOKEN=new-token')
    expect(once).not.toContain('old')
    upsertEnvValue(envPath, 'YOUTUBE_CLIENT_ID', 'cid.apps.googleusercontent.com')
    expect(readFileSync(envPath, 'utf8')).toContain('YOUTUBE_CLIENT_ID=cid.apps.googleusercontent.com')
  })

  it('refuses a missing file and a junk key', () => {
    expect(() => upsertEnvValue(join(tmpdir(), 'no-such-fyp-env'), 'YOUTUBE_REFRESH_TOKEN', 'x')).toThrow(
      /Missing/,
    )
    expect(() => upsertEnvValue(join(tmpdir(), 'x'), 'not a key', 'x')).toThrow(/invalid env key/)
  })
})

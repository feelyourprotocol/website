import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const VIDEO_ROOT = join(import.meta.dirname, '..')

/** Load `video/.env` into `process.env` (does not override existing vars). */
export function loadVideoEnv(): void {
  const envPath = join(VIDEO_ROOT, '.env')
  if (!existsSync(envPath)) return

  const text = readFileSync(envPath, 'utf8')
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eq = trimmed.indexOf('=')
    if (eq === -1) continue

    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!(key in process.env)) process.env[key] = value
  }
}

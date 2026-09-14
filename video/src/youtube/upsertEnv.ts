import { existsSync, readFileSync, writeFileSync } from 'node:fs'

/** Set or replace `KEY=value` in a dotenv file. Never include `value` in thrown messages. */
export function upsertEnvValue(envPath: string, key: string, value: string): void {
  if (!/^[A-Z][A-Z0-9_]*$/.test(key)) {
    throw new Error(`Refusing to write invalid env key`)
  }
  if (!existsSync(envPath)) {
    throw new Error(`Missing ${envPath}. Copy video/.env.example to video/.env first.`)
  }
  const text = readFileSync(envPath, 'utf8')
  const line = `${key}=${value}`
  const pattern = new RegExp(`^${key}=.*$`, 'm')
  const next = pattern.test(text)
    ? text.replace(pattern, line)
    : `${text.replace(/\n+$/, '')}\n${line}\n`
  writeFileSync(envPath, next.endsWith('\n') ? next : `${next}\n`)
}

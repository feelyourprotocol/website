import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const DIR = join(process.cwd(), 'mcp-docs/use/eips')
const files = readdirSync(DIR).filter((f) => /^eip-\d+\.md$/.test(f))

describe('EIP page template', () => {
  it('covers all twelve catalogue pages', () => {
    expect(files).toHaveLength(12)
  })

  it.each(files)('%s uses the shared presentation components', (file) => {
    const text = readFileSync(join(DIR, file), 'utf8')
    const number = file.match(/eip-(\d+)\.md/)?.[1]
    expect(text.startsWith(`# EIP-${number} — `)).toBe(true)
    expect(text).toContain('<EipHeader')
    expect(text).toContain(`:number="${number}"`)
    expect(text).toContain('<PromptList')
    expect(text).toContain('<SpecTable')
    expect(text).toContain('<CollapsibleChangelog')
    expect(text).toContain('## Try asking your agent')
    expect(text).toContain('## Twins and spec')
  })

  it.each(files)('%s keeps a prompt in every card', (file) => {
    const text = readFileSync(join(DIR, file), 'utf8')
    expect(text.match(/text: `[^`]{15,}`/g)?.length ?? 0).toBeGreaterThanOrEqual(3)
  })
})

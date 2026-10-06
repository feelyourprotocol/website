import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = join(process.cwd(), 'mcp-docs')

function markdownFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (name === 'node_modules' || name.startsWith('.') || name === 'public') return []
    if (statSync(path).isDirectory()) return markdownFiles(path)
    return name.endsWith('.md') && name !== 'README.md' ? [path] : []
  })
}

function docUrl(path: string): string {
  return (
    '/' +
    path
      .slice(ROOT.length + 1)
      .replace(/\.md$/, '')
      .replace(/^index$/, '')
  )
}

describe('mcp-docs URL stability', () => {
  const pages = markdownFiles(ROOT).map(docUrl)

  it('does not drop pages that are already public', () => {
    expect(pages.filter((p) => p.startsWith('/use/eips/'))).toHaveLength(12)
    expect(pages.filter((p) => p.startsWith('/use/')).length).toBeGreaterThanOrEqual(20)
    expect(pages.filter((p) => p.startsWith('/internals/')).length).toBeGreaterThanOrEqual(8)
    for (const required of [
      '/use/connect',
      '/use/introduction',
      '/use/capabilities',
      '/use/coverage',
      '/use/forks/glamsterdam',
      '/use/forks/fusaka',
      '/use/tools/run-transaction',
      '/use/terms',
    ]) {
      expect(pages).toContain(required)
    }
  })

  it('every internal nav and sidebar link in config.ts resolves to a page', () => {
    const config = readFileSync(join(ROOT, '.vitepress/config.ts'), 'utf8')
    const links = [...config.matchAll(/link: '(\/[^']*)'/g)].map((m) => m[1])
    expect(links.length).toBeGreaterThan(15)
    for (const link of links) {
      expect(existsSync(join(ROOT, `${link}.md`)), `missing page for ${link}`).toBe(true)
    }
  })

  it('links Terms from the sidebar, the footer, and Connect', () => {
    const config = readFileSync(join(ROOT, '.vitepress/config.ts'), 'utf8')
    expect(config).toContain("link: '/use/terms'")
    expect(config).toContain('/use/terms.html')
    expect(readFileSync(join(ROOT, 'use/connect.md'), 'utf8')).toContain('(/use/terms)')
  })

  it('every internal Markdown link points at an existing page', () => {
    const broken: string[] = []
    for (const file of markdownFiles(ROOT)) {
      const text = readFileSync(file, 'utf8')
      for (const match of text.matchAll(/(?:\]\(|href[:=]\s*["'])(\/(?:use|internals)\/[^)"'#\s]+)/g)) {
        if (!existsSync(join(ROOT, `${match[1]}.md`))) broken.push(`${file}: ${match[1]}`)
      }
    }
    expect(broken).toEqual([])
  })
})

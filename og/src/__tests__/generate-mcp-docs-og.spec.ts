import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { OG_HEIGHT, OG_WIDTH, WEBSITE_ROOT } from '../config.ts'
import {
  MCP_DOCS_OG_OUTPUT,
  MCP_DOCS_OG_PUBLIC_DIR,
  MCP_DOCS_OG_RENDER_HTML,
} from '../mcp-docs-og-paths.ts'

describe('mcp-docs OG generator paths', () => {
  it('render template and output resolve under mcp-docs/public/og', () => {
    expect(MCP_DOCS_OG_PUBLIC_DIR).toBe(resolve(WEBSITE_ROOT, 'mcp-docs/public/og'))
    expect(MCP_DOCS_OG_RENDER_HTML).toBe(resolve(MCP_DOCS_OG_PUBLIC_DIR, 'render.html'))
    expect(MCP_DOCS_OG_OUTPUT).toBe(resolve(MCP_DOCS_OG_PUBLIC_DIR, 'default.webp'))
  })

  it('render.html declares standard OG viewport size', () => {
    const html = readFileSync(MCP_DOCS_OG_RENDER_HTML, 'utf8')
    expect(html).toContain(`width: ${OG_WIDTH}px`)
    expect(html).toContain(`height: ${OG_HEIGHT}px`)
    expect(html).toContain('MCP Docs')
    expect(html).not.toContain('roadmap.feelyourprotocol.org')
  })

  it('default.webp is not a byte-identical copy of roadmap default.webp', () => {
    const roadmapWebp = resolve(WEBSITE_ROOT, 'roadmap/public/og/default.webp')
    const mcpWebp = MCP_DOCS_OG_OUTPUT
    const roadmapBytes = readFileSync(roadmapWebp)
    const mcpBytes = readFileSync(mcpWebp)
    expect(mcpBytes.equals(roadmapBytes)).toBe(false)
  })
})

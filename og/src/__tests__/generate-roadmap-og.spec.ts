import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { OG_HEIGHT, OG_WIDTH, WEBSITE_ROOT } from '../config.ts'
import {
  ROADMAP_OG_OUTPUT,
  ROADMAP_OG_PUBLIC_DIR,
  ROADMAP_OG_RENDER_HTML,
} from '../generate-roadmap-og.ts'

describe('roadmap OG generator paths', () => {
  it('render template and output resolve under roadmap/public/og', () => {
    expect(ROADMAP_OG_PUBLIC_DIR).toBe(`${WEBSITE_ROOT}/roadmap/public/og`)
    expect(ROADMAP_OG_RENDER_HTML).toBe(`${ROADMAP_OG_PUBLIC_DIR}/render.html`)
    expect(ROADMAP_OG_OUTPUT).toBe(`${ROADMAP_OG_PUBLIC_DIR}/default.webp`)
  })

  it('render.html declares standard OG viewport size', () => {
    const html = readFileSync(ROADMAP_OG_RENDER_HTML, 'utf8')
    expect(html).toContain(`width: ${OG_WIDTH}px`)
    expect(html).toContain(`height: ${OG_HEIGHT}px`)
  })
})

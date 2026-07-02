import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'
import sharp from 'sharp'

import { OG_HEIGHT, OG_WIDTH } from './config.ts'
import { ROADMAP_OG_OUTPUT, ROADMAP_OG_PUBLIC_DIR } from './roadmap-og-paths.ts'
import { startStaticServer } from './server.ts'

export { ROADMAP_OG_OUTPUT, ROADMAP_OG_PUBLIC_DIR, ROADMAP_OG_RENDER_HTML } from './roadmap-og-paths.ts'

/** Capture roadmap/public/og/render.html at standard OG dimensions. */
export async function generateRoadmapOg(): Promise<string> {
  mkdirSync(ROADMAP_OG_PUBLIC_DIR, { recursive: true })

  const server = await startStaticServer(ROADMAP_OG_PUBLIC_DIR)
  const browser = await chromium.launch({ headless: true })

  try {
    const page = await browser.newPage({
      viewport: { width: OG_WIDTH, height: OG_HEIGHT },
      deviceScaleFactor: 1,
    })
    await page.goto(`${server.url}/render.html`, { waitUntil: 'load', timeout: 30_000 })
    await page.evaluate(async () => {
      await document.fonts.ready
    })
    await page.waitForTimeout(150)

    const png = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: OG_WIDTH, height: OG_HEIGHT },
    })

    await sharp(png).webp({ quality: 92 }).toFile(ROADMAP_OG_OUTPUT)

    const meta = await sharp(ROADMAP_OG_OUTPUT).metadata()
    if (meta.width !== OG_WIDTH || meta.height !== OG_HEIGHT) {
      throw new Error(
        `Roadmap OG has wrong dimensions: ${meta.width}×${meta.height}, expected ${OG_WIDTH}×${OG_HEIGHT}`,
      )
    }

    return ROADMAP_OG_OUTPUT
  } finally {
    await browser.close()
    await server.close()
  }
}

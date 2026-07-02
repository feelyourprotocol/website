import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'
import sharp from 'sharp'

import { assertChromiumReady } from '../check-browsers.ts'
import { startStaticServer } from '../server.ts'
import type { SocialCardId } from './cardIds.ts'
import {
  SOCIAL_CAPTURE_WIDTH,
  SOCIAL_DIST_DIR,
  SOCIAL_OUTPUT_DIR,
  socialCardOutputBase,
} from './config.ts'
import { parseSocialCardIds } from './parseCardIds.ts'

async function captureCard(
  page: import('playwright').Page,
  baseUrl: string,
  id: SocialCardId,
): Promise<{ pngPath: string; webpPath: string }> {
  await page.goto(`${baseUrl}/index.html?card=${id}&mode=capture`, {
    waitUntil: 'load',
    timeout: 30_000,
  })
  await page.waitForSelector(`[data-social-card="${id}"]`, { state: 'visible', timeout: 15_000 })
  await page.evaluate(async () => {
    await document.fonts.ready
  })
  await page.waitForTimeout(200)

  const card = page.locator(`[data-social-card="${id}"]`)
  const box = await card.boundingBox()
  if (!box) throw new Error(`Could not measure card: ${id}`)

  const pngPath = `${socialCardOutputBase(id)}.png`
  const webpPath = `${socialCardOutputBase(id)}.webp`
  mkdirSync(SOCIAL_OUTPUT_DIR, { recursive: true })

  const pngBuffer = await card.screenshot({ type: 'png' })

  const meta = await sharp(pngBuffer).metadata()
  const srcWidth = meta.width ?? SOCIAL_CAPTURE_WIDTH
  const scale = SOCIAL_CAPTURE_WIDTH / srcWidth
  const targetHeight = Math.round((meta.height ?? 675) * scale)

  const normalized = await sharp(pngBuffer)
    .resize(SOCIAL_CAPTURE_WIDTH, targetHeight, { fit: 'inside', withoutEnlargement: false })
    .png()
    .toBuffer()

  await sharp(normalized).png().toFile(pngPath)
  await sharp(normalized).webp({ quality: 90 }).toFile(webpPath)

  return { pngPath, webpPath }
}

export async function captureSocialCards(cardArgs: string[]): Promise<void> {
  await assertChromiumReady()

  const ids = parseSocialCardIds(cardArgs)
  const server = await startStaticServer(SOCIAL_DIST_DIR)
  const browser = await chromium.launch({ headless: true })

  try {
    const page = await browser.newPage({
      viewport: { width: SOCIAL_CAPTURE_WIDTH + 80, height: 1400 },
      deviceScaleFactor: 2,
    })

    for (const id of ids) {
      console.log(`Capturing: ${id}`)
      const { pngPath, webpPath } = await captureCard(page, server.url, id)
      console.log(`  PNG  → ${pngPath}`)
      console.log(`  WebP → ${webpPath}`)
    }
  } finally {
    await browser.close()
    await server.close()
  }

  console.log(`\nDone — ${ids.length} card(s) in ${SOCIAL_OUTPUT_DIR}`)
}

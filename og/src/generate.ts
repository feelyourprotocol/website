import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright'
import sharp from 'sharp'

import { buildExplorationHtml, buildTopicHtml } from './build-html.ts'
import {
  EXPLORATIONS_OG_DIR,
  MANIFEST_PATH,
  OG_HEIGHT,
  OG_WIDTH,
  TMP_DIR,
  TOPICS_OG_DIR,
  WEBSITE_ROOT,
} from './config.ts'
import {
  listAllExplorationIds,
  listAllTopicIds,
  readExplorationOgData,
  readTopicOgData,
} from './data.ts'
import { startStaticServer } from './server.ts'

export interface OgManifest {
  explorations: string[]
  topics: string[]
}

function ensureOutputDirs(): void {
  mkdirSync(EXPLORATIONS_OG_DIR, { recursive: true })
  mkdirSync(TOPICS_OG_DIR, { recursive: true })
}

function writeManifest(manifest: OgManifest): void {
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
}

function readManifest(): OgManifest {
  try {
    return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as OgManifest
  } catch {
    return { explorations: [], topics: [] }
  }
}

function listGeneratedExplorationIds(): string[] {
  try {
    return readdirSync(EXPLORATIONS_OG_DIR)
      .filter((name) => name.endsWith('.webp'))
      .map((name) => name.replace(/\.webp$/, ''))
      .sort()
  } catch {
    return []
  }
}

function listGeneratedTopicIds(): string[] {
  try {
    return readdirSync(TOPICS_OG_DIR)
      .filter((name) => name.endsWith('.webp'))
      .map((name) => name.replace(/\.webp$/, ''))
      .sort()
  } catch {
    return []
  }
}

function refreshManifest(): OgManifest {
  const manifest = {
    explorations: listGeneratedExplorationIds(),
    topics: listGeneratedTopicIds(),
  }
  writeManifest(manifest)
  return manifest
}

async function screenshotHtml(html: string, outPath: string): Promise<void> {
  rmSync(TMP_DIR, { recursive: true, force: true })
  mkdirSync(TMP_DIR, { recursive: true })

  const previewPath = join(TMP_DIR, 'preview.html')
  writeFileSync(previewPath, html)

  const server = await startStaticServer(WEBSITE_ROOT)
  const browser = await chromium.launch()

  try {
    const page = await browser.newPage({
      viewport: { width: OG_WIDTH, height: OG_HEIGHT },
      deviceScaleFactor: 1,
    })
    await page.goto(`${server.url}/og/.tmp/preview.html`, { waitUntil: 'networkidle', timeout: 30_000 })
    await page.waitForTimeout(150)
    mkdirSync(join(outPath, '..'), { recursive: true })
    const png = await page.screenshot({ type: 'png' })
    await sharp(png).webp({ quality: 92 }).toFile(outPath)
  } finally {
    await browser.close()
    await server.close()
  }
}

export async function generateExplorationOg(id: string): Promise<string> {
  const data = readExplorationOgData(id)
  const html = buildExplorationHtml(data)
  const outPath = join(EXPLORATIONS_OG_DIR, `${id}.webp`)
  ensureOutputDirs()
  await screenshotHtml(html, outPath)

  const manifest = readManifest()
  if (!manifest.explorations.includes(id)) {
    manifest.explorations.push(id)
    manifest.explorations.sort()
    writeManifest(manifest)
  }

  return outPath
}

export async function generateTopicOg(topicId: string): Promise<string> {
  const data = readTopicOgData(topicId)
  const html = buildTopicHtml(data)
  const outPath = join(TOPICS_OG_DIR, `${topicId}.webp`)
  ensureOutputDirs()
  await screenshotHtml(html, outPath)

  const manifest = readManifest()
  if (!manifest.topics.includes(topicId)) {
    manifest.topics.push(topicId)
    manifest.topics.sort()
    writeManifest(manifest)
  }

  return outPath
}

export async function generateAllOgImages(): Promise<void> {
  ensureOutputDirs()
  mkdirSync(TMP_DIR, { recursive: true })

  for (const id of listAllExplorationIds()) {
    console.log(`Exploration: ${id}`)
    await generateExplorationOg(id)
  }

  for (const topicId of listAllTopicIds()) {
    console.log(`Topic: ${topicId}`)
    await generateTopicOg(topicId)
  }

  const manifest = refreshManifest()
  console.log(
    `\nManifest: ${manifest.explorations.length} explorations, ${manifest.topics.length} topics`,
  )
}

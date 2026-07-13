#!/usr/bin/env node
/**
 * Analyze and repair logo PNGs with fake transparency (baked-in checkerboard grids
 * from AI image tools instead of a real alpha channel).
 *
 * Uses sharp from the isolated `og/` package — run `npm install` in `website/og/` first.
 *
 * Usage:
 *   node scripts/process-logo-transparency.mjs analyze design/source/logos/
 *   node scripts/process-logo-transparency.mjs fix design/source/logos/icon-on-transparent/master.png
 *   node scripts/process-logo-transparency.mjs fix --mode preserve-white design/source/logos/with-circle-on-transparent/master.png
 */

import { readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sharp = (await import(join(__dirname, '../og/node_modules/sharp/lib/index.js'))).default

/** Light greys and whites used in editor-style transparency grids. */
const CHECKER_RGB = [
  [255, 255, 255],
  [254, 254, 254],
  [253, 253, 253],
  [252, 252, 252],
  [251, 251, 251],
  [250, 250, 250],
  [238, 238, 238],
  [221, 221, 221],
  [213, 213, 213],
  [211, 211, 211],
  [210, 212, 211],
  [204, 204, 204],
  [192, 192, 192],
]

const CHECKER_FUZZ = 22
const ALPHA_TRANSPARENT = 16

function rgbDist(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

function isCheckerRgb(rgb, fuzz = CHECKER_FUZZ) {
  return CHECKER_RGB.some((c) => rgbDist(rgb, c) <= fuzz)
}

function expandPaths(args) {
  const out = []
  for (const arg of args) {
    const p = resolve(arg)
    let st
    try {
      st = statSync(p)
    } catch {
      console.error(`skip (not found): ${arg}`)
      continue
    }
    if (st.isDirectory()) {
      const entries = readdirSync(p, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
      for (const entry of entries) {
        const child = join(p, entry.name)
        if (entry.isFile() && entry.name.endsWith('.png')) out.push(child)
        else if (entry.isDirectory()) {
          for (const name of readdirSync(child).filter((n) => n.endsWith('.png')).sort()) {
            out.push(join(child, name))
          }
        }
      }
    } else {
      out.push(p)
    }
  }
  return out
}

async function loadRgba(path) {
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return { data: Buffer.from(data), ...info }
}

function sampleRegion(data, width, height, channels, x0, y0, w, h) {
  let checker = 0
  let transparent = 0
  let n = 0
  for (let y = y0; y < Math.min(y0 + h, height); y++) {
    for (let x = x0; x < Math.min(x0 + w, width); x++) {
      const i = (y * width + x) * channels
      const rgb = [data[i], data[i + 1], data[i + 2]]
      const a = data[i + 3]
      n++
      if (a < ALPHA_TRANSPARENT) transparent++
      else if (a > 250 && isCheckerRgb(rgb)) checker++
    }
  }
  return { n, checker, transparent }
}

export async function analyzeImage(path) {
  const { data, width, height, channels } = await loadRgba(path)
  const total = width * height
  let transparent = 0
  let semi = 0
  for (let i = 0; i < data.length; i += channels) {
    const a = data[i + 3]
    if (a < ALPHA_TRANSPARENT) transparent++
    else if (a < 250) semi++
  }
  const patch = 256
  const regions = {
    tl: sampleRegion(data, width, height, channels, 0, 0, patch, patch),
    tr: sampleRegion(data, width, height, channels, width - patch, 0, patch, patch),
    bl: sampleRegion(data, width, height, channels, 0, height - patch, patch, patch),
    br: sampleRegion(data, width, height, channels, width - patch, height - patch, patch, patch),
  }
  let fakeCorners = 0
  for (const r of Object.values(regions)) {
    if (r.n && r.transparent / r.n < 0.05 && r.checker / r.n > 0.35) fakeCorners++
  }
  const transparentPct = (100 * transparent) / total
  const likelyFakeChecker = fakeCorners >= 2
  const tag = likelyFakeChecker
    ? 'fake-checkerboard'
    : transparentPct > 5
      ? 'real-alpha'
      : 'fully-opaque'
  return {
    path,
    width,
    height,
    transparentPct: +transparentPct.toFixed(2),
    semiPct: +((100 * semi) / total).toFixed(2),
    likelyFakeChecker,
    tag,
    corners: Object.fromEntries(
      Object.entries(regions).map(([k, v]) => [
        k,
        {
          checkerPct: +((100 * v.checker) / v.n).toFixed(1),
          transPct: +((100 * v.transparent) / v.n).toFixed(1),
        },
      ]),
    ),
  }
}

function floodCheckerFromEdges(data, width, height, channels) {
  const seen = new Uint8Array(width * height)
  const stack = []
  for (let x = 0; x < width; x++) {
    stack.push(x)
    stack.push((height - 1) * width + x)
  }
  for (let y = 0; y < height; y++) {
    stack.push(y * width)
    stack.push(y * width + width - 1)
  }
  while (stack.length) {
    const idx = stack.pop()
    if (seen[idx]) continue
    seen[idx] = 1
    const i = idx * channels
    if (data[i + 3] < ALPHA_TRANSPARENT) continue
    if (!isCheckerRgb([data[i], data[i + 1], data[i + 2]])) continue
    data[i + 3] = 0
    const x = idx % width
    const y = (idx / width) | 0
    if (x > 0) stack.push(idx - 1)
    if (x < width - 1) stack.push(idx + 1)
    if (y > 0) stack.push(idx - width)
    if (y < height - 1) stack.push(idx + width)
  }
}

function removeInteriorCheckerIslands(data, channels) {
  for (let i = 0; i < data.length; i += channels) {
    if (data[i + 3] < ALPHA_TRANSPARENT) continue
    if (isCheckerRgb([data[i], data[i + 1], data[i + 2]])) data[i + 3] = 0
  }
}

function transparentPct(data, channels, total) {
  let t = 0
  for (let i = 3; i < data.length; i += channels) {
    if (data[i] < ALPHA_TRANSPARENT) t++
  }
  return +((100 * t) / total).toFixed(2)
}

/**
 * @param {'auto' | 'preserve-white' | 'remove-all-checker'} mode
 * - preserve-white: flood from image edges only (keeps solid white fills inside the logo)
 * - remove-all-checker: also clears disconnected checker-coloured islands (icon mark)
 * - auto: preserve-white when filename suggests a white badge, else remove-all-checker
 */
export async function fixImage(path, { mode = 'auto', outPath = path } = {}) {
  const resolvedMode =
    mode === 'auto'
      ? /with-circle-on-transparent|community-site/i.test(path)
        ? 'preserve-white'
        : 'remove-all-checker'
      : mode

  const { data, width, height, channels } = await loadRgba(path)
  const total = width * height
  floodCheckerFromEdges(data, width, height, channels)
  if (resolvedMode === 'remove-all-checker') removeInteriorCheckerIslands(data, channels)

  await sharp(data, { raw: { width, height, channels } }).png().toFile(outPath)
  return { path: outPath, mode: resolvedMode, transparentPct: transparentPct(data, channels, total) }
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2)
  if (!cmd || cmd === '--help' || cmd === '-h') {
    console.log(`Usage:
  node scripts/process-logo-transparency.mjs analyze <paths...>
  node scripts/process-logo-transparency.mjs fix [--mode auto|preserve-white|remove-all-checker] [--out path] <paths...>`)
    process.exit(cmd ? 0 : 1)
  }

  let mode = 'auto'
  let outOverride = null
  const paths = []
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i]
    if (a === '--mode') mode = rest[++i]
    else if (a === '--out') outOverride = resolve(rest[++i])
    else paths.push(a)
  }

  if (!paths.length) {
    console.error('Provide at least one PNG path or directory.')
    process.exit(1)
  }

  const files = expandPaths(paths)
  if (cmd === 'analyze') {
    for (const f of files) {
      const r = await analyzeImage(f)
      console.log(JSON.stringify(r))
    }
    return
  }

  if (cmd === 'fix') {
    for (const f of files) {
      const out = outOverride && files.length === 1 ? outOverride : f
      const r = await fixImage(f, { mode, outPath: out })
      console.log(`fixed ${f} → ${out} (${r.mode}, ${r.transparentPct}% transparent)`)
    }
    return
  }

  console.error(`Unknown command: ${cmd}`)
  process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

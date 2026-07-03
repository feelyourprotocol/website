import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, readFileSync, renameSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/** Scan step when searching for the first title-card frame. */
const SCAN_INTERVAL_SEC = 0.05
/** How far into the file we look for the lead-in overlay. */
const MAX_SCAN_SEC = 12
/**
 * Minimum peak RGB in the center crop — title cards have white/purple text on black.
 * Pure black lead-in + companion peek stays well below this.
 */
export const LEAD_IN_LUMINANCE_THRESHOLD = 72
/** Title band center must be true black — exploration UI lavender fails this (min ≈ 25+). */
export const LEAD_IN_MIN_DARK_THRESHOLD = 20
/** Share of center-crop pixels that must be near-black (title band bg vs exploration UI). */
export const LEAD_IN_MIN_DARK_PIXEL_RATIO = 0.35
/** Mean luminance cap — exploration UI center crop averages ~240+ on white/lavender. */
export const LEAD_IN_MAX_MEAN_LUMINANCE = 120
/** Title at hero size spans at least this many px vertically in the center crop. */
export const LEAD_IN_MIN_TEXT_SPAN_PX = 150

export interface CenterLuminanceStats {
  min: number
  max: number
  /** Vertical span of bright (title) pixels in the center crop. */
  textSpanPx: number
  /** Fraction of pixels with max channel ≤ LEAD_IN_MIN_DARK_THRESHOLD. */
  darkPixelRatio: number
  meanLuminance: number
}

function assertFfmpegAvailable(): void {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' })
  } catch {
    throw new Error('ffmpeg is required for video lead-in trim/verify. Install ffmpeg and retry.')
  }
}

function getVideoDimensions(videoPath: string): { width: number; height: number } {
  try {
    const raw = execFileSync(
      'ffprobe',
      [
        '-hide_banner',
        '-v',
        'error',
        '-select_streams',
        'v:0',
        '-show_entries',
        'stream=width,height',
        '-of',
        'json',
        videoPath,
      ],
      { encoding: 'utf8' },
    )
    const stream = (JSON.parse(raw) as { streams?: { width?: number; height?: number }[] })
      .streams?.[0]
    if (stream?.width && stream?.height) {
      return { width: stream.width, height: stream.height }
    }
  } catch {
    /* fall through */
  }
  return { width: 540, height: 960 }
}

function extractCenterLuminanceStats(videoPath: string, timeSec: number): CenterLuminanceStats {
  const tmp = join(tmpdir(), `fyp-vframe-${process.pid}-${Date.now()}.raw`)
  const empty: CenterLuminanceStats = {
    min: 255,
    max: 0,
    textSpanPx: 0,
    darkPixelRatio: 0,
    meanLuminance: 255,
  }
  try {
    const { width: vw, height: vh } = getVideoDimensions(videoPath)
    const cropW = Math.max(1, Math.floor(vw * 0.6))
    const cropH = Math.max(1, Math.floor(vh * 0.35))

    execFileSync(
      'ffmpeg',
      [
        '-hide_banner',
        '-loglevel',
        'error',
        '-y',
        '-ss',
        String(timeSec),
        '-i',
        videoPath,
        '-frames:v',
        '1',
        '-vf',
        'crop=iw*0.6:ih*0.35:iw*0.2:ih*0.30',
        '-f',
        'rawvideo',
        '-pix_fmt',
        'rgb24',
        tmp,
      ],
      { stdio: ['ignore', 'ignore', 'pipe'] },
    )
    const buf = readFileSync(tmp)
    let min = 255
    let max = 0
    let brightMinY = Infinity
    let brightMaxY = -1
    let darkPixels = 0
    let lumSum = 0
    let pixelCount = 0

    for (let i = 0; i + 2 < buf.length; i += 3) {
      const lum = Math.max(buf[i]!, buf[i + 1]!, buf[i + 2]!)
      if (lum > max) max = lum
      if (lum < min) min = lum
      if (lum <= LEAD_IN_MIN_DARK_THRESHOLD) darkPixels++
      lumSum += lum
      pixelCount++
      if (lum >= LEAD_IN_LUMINANCE_THRESHOLD) {
        const y = Math.floor(i / 3 / cropW)
        if (y < brightMinY) brightMinY = y
        if (y > brightMaxY) brightMaxY = y
      }
    }
    const textSpanPx =
      brightMaxY >= brightMinY && brightMaxY < cropH ? brightMaxY - brightMinY + 1 : 0
    return {
      min,
      max,
      textSpanPx,
      darkPixelRatio: pixelCount > 0 ? darkPixels / pixelCount : 0,
      meanLuminance: pixelCount > 0 ? lumSum / pixelCount : 255,
    }
  } catch {
    return empty
  } finally {
    try {
      unlinkSync(tmp)
    } catch {
      /* ignore */
    }
  }
}

function extractCenterMaxLuminance(videoPath: string, timeSec: number): number {
  return extractCenterLuminanceStats(videoPath, timeSec).max
}

/** Title/outro band: bright text on a dark center panel at hero size (rejects exploration UI). */
export function isTitleBandFrame(
  stats: CenterLuminanceStats,
  maxThreshold = LEAD_IN_LUMINANCE_THRESHOLD,
  minDarkThreshold = LEAD_IN_MIN_DARK_THRESHOLD,
  minTextSpanPx = LEAD_IN_MIN_TEXT_SPAN_PX,
  minDarkPixelRatio = LEAD_IN_MIN_DARK_PIXEL_RATIO,
  maxMeanLuminance = LEAD_IN_MAX_MEAN_LUMINANCE,
): boolean {
  return (
    stats.max >= maxThreshold &&
    stats.min <= minDarkThreshold &&
    stats.textSpanPx >= minTextSpanPx &&
    stats.darkPixelRatio >= minDarkPixelRatio &&
    stats.meanLuminance <= maxMeanLuminance
  )
}

/** Find the first timestamp where the title/lead-in content is visible. */
export function findLeadInTrimSec(
  videoPath: string,
  maxThreshold = LEAD_IN_LUMINANCE_THRESHOLD,
  minDarkThreshold = LEAD_IN_MIN_DARK_THRESHOLD,
  minTextSpanPx = LEAD_IN_MIN_TEXT_SPAN_PX,
): number {
  for (let t = 0; t <= MAX_SCAN_SEC; t += SCAN_INTERVAL_SEC) {
    const stats = extractCenterLuminanceStats(videoPath, t)
    if (isTitleBandFrame(stats, maxThreshold, minDarkThreshold, minTextSpanPx)) {
      return t
    }
  }
  return 0
}

export function verifyVideoLeadIn(
  videoPath: string,
  maxThreshold = LEAD_IN_LUMINANCE_THRESHOLD,
  minDarkThreshold = LEAD_IN_MIN_DARK_THRESHOLD,
  minTextSpanPx = LEAD_IN_MIN_TEXT_SPAN_PX,
): { ok: boolean; maxLuminance: number; minLuminance: number; textSpanPx: number; darkPixelRatio: number; meanLuminance: number } {
  const stats = extractCenterLuminanceStats(videoPath, 0)
  return {
    ok: isTitleBandFrame(stats, maxThreshold, minDarkThreshold, minTextSpanPx),
    maxLuminance: stats.max,
    minLuminance: stats.min,
    textSpanPx: stats.textSpanPx,
    darkPixelRatio: stats.darkPixelRatio,
    meanLuminance: stats.meanLuminance,
  }
}

export interface TrimLeadInResult {
  trimmedSec: number
  maxLuminanceBefore: number
  maxLuminanceAfter: number
}

/**
 * Trim black/unstyled lead-in so frame 0 matches the title card (preview thumbnail).
 * Returns how many seconds were removed (0 if already OK).
 */
export function trimVideoLeadIn(videoPath: string): TrimLeadInResult {
  assertFfmpegAvailable()

  const before = verifyVideoLeadIn(videoPath)
  if (before.ok) {
    return {
      trimmedSec: 0,
      maxLuminanceBefore: before.maxLuminance,
      maxLuminanceAfter: before.maxLuminance,
    }
  }

  const trimSec = findLeadInTrimSec(videoPath)
  if (trimSec <= 0.01) {
    throw new Error(
      `Video has no valid lead-in frame in the first ${MAX_SCAN_SEC}s (peak luminance ${before.maxLuminance}). Ensure the first playbook step is a title-card.`,
    )
  }

  const tmpOut = `${videoPath}.trim.webm`
  try {
    execFileSync(
      'ffmpeg',
      [
        '-hide_banner',
        '-loglevel',
        'error',
        '-y',
        '-ss',
        String(trimSec),
        '-i',
        videoPath,
        '-c:v',
        'libvpx-vp9',
        '-crf',
        '32',
        '-b:v',
        '0',
        '-an',
        tmpOut,
      ],
      { stdio: ['ignore', 'ignore', 'pipe'] },
    )
  } catch (err) {
    throw new Error(
      `Failed to trim video lead-in (${trimSec.toFixed(2)}s): ${err instanceof Error ? err.message : String(err)}`,
    )
  }

  if (!existsSync(tmpOut)) {
    throw new Error('ffmpeg did not produce trimmed output')
  }

  renameSync(tmpOut, videoPath)

  const after = verifyVideoLeadIn(videoPath)
  if (!after.ok) {
    throw new Error(
      `Video lead-in still invalid after trim (center min/max/span/mean/dark ${after.minLuminance}/${after.maxLuminance}/${after.textSpanPx}/${Math.round(after.meanLuminance ?? 0)}/${((after.darkPixelRatio ?? 0) * 100).toFixed(1)}%; need dark ≥ ${LEAD_IN_MIN_DARK_PIXEL_RATIO * 100}%, mean ≤ ${LEAD_IN_MAX_MEAN_LUMINANCE}). Check lead-in overlay setup.`,
    )
  }

  return {
    trimmedSec: trimSec,
    maxLuminanceBefore: before.maxLuminance,
    maxLuminanceAfter: after.maxLuminance,
  }
}

/** Copy helper for tests. */
export function copyVideoForTest(src: string, dest: string): void {
  copyFileSync(src, dest)
}

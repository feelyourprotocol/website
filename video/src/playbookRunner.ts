import type { Page } from 'playwright'

import type {
  PlaybookConfig,
  PlaybookStep,
  PlaybookStepAction,
  VideoContentConfig,
  VideoOverlayPlacement,
  ZonesFile,
} from './types.ts'

export interface PlaybookRunnerOptions {
  dryRun?: boolean
  onStep?: (index: number, step: PlaybookStep) => void
  skipInitialOverlay?: string
  content?: VideoContentConfig
  zones?: ZonesFile
}

function normalizeStepAction(step: number | PlaybookStepAction): PlaybookStepAction {
  if (typeof step === 'number') return { count: step, interval: 400 }
  return {
    count: step.count ?? 1,
    interval: step.interval ?? 400,
    climaxFrom: step.climaxFrom,
    climaxInterval: step.climaxInterval,
    climaxPauseMs: step.climaxPauseMs,
    highlightSet: step.highlightSet,
    highlightAfterStep: step.highlightAfterStep,
    highlightSetAfter: step.highlightSetAfter,
    holdAfterClimaxMs: step.holdAfterClimaxMs,
  }
}

function stepUsesHighlights(step: PlaybookStep): boolean {
  if (step.step === undefined) return false
  const action = normalizeStepAction(step.step)
  return Boolean(action.highlightSet || action.highlightSetAfter)
}

function stepHasActions(step: PlaybookStep): boolean {
  return (
    step.selectExample !== undefined ||
    step.step !== undefined ||
    step.scroll !== undefined ||
    step.expandCompanion !== undefined ||
    step.click !== undefined
  )
}

const FULLSCREEN_TYPES = new Set(['title-card', 'outro-card', 'title', 'outro'])

function resolvePlacement(
  step: PlaybookStep,
  overlayId: string | undefined,
  content?: VideoContentConfig,
): VideoOverlayPlacement | undefined {
  if (step.placement) return step.placement
  if (!overlayId || !content) return 'top-banner'
  const def = content.overlays[overlayId]
  if (!def) return 'top-banner'
  if (def.placement) return def.placement
  if (FULLSCREEN_TYPES.has(def.type)) return undefined
  return 'top-banner'
}

async function waitForStepButton(page: Page): Promise<void> {
  const step = page.getByTestId('bytecode-step')
  await step.waitFor({ state: 'visible', timeout: 15_000 })
  await page.waitForFunction(
    () => {
      const btn = document.querySelector('[data-testid="bytecode-step"]') as HTMLButtonElement | null
      return btn !== null && !btn.disabled
    },
    undefined,
    { timeout: 15_000 },
  )
}

export const VIDEO_FONT_STYLESHEET =
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700&display=block'

export async function ensureVideoFontsReady(page: Page): Promise<void> {
  await page.evaluate(async (href) => {
    if (!document.querySelector('link[data-fyp-video-fonts]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.dataset.fypVideoFonts = '1'
      document.head.appendChild(link)
    }
    await Promise.all([
      document.fonts.load('400 1em "Bebas Neue"'),
      document.fonts.load('800 1em "Barlow Condensed"'),
      document.fonts.load('900 1em "Barlow Condensed"'),
    ])
    await document.fonts.ready
  }, VIDEO_FONT_STYLESHEET)
}

export async function waitForVideoBridge(page: Page): Promise<void> {
  await page.waitForFunction(
    () => typeof window.__FYP_VIDEO__?.showOverlay === 'function',
    undefined,
    { timeout: 20_000 },
  )
}

export async function showOverlay(
  page: Page,
  overlayId: string,
  options: { placement?: VideoOverlayPlacement } = {},
): Promise<void> {
  await page.evaluate(
    ({ id, placement }) => {
      window.__FYP_VIDEO__!.showOverlay(id, placement ? { placement } : undefined)
    },
    { id: overlayId, placement: options.placement },
  )
  await page.evaluate(async () => {
    await document.fonts.ready
  })
  await page.waitForTimeout(120)
}

async function hideOverlay(page: Page): Promise<void> {
  await page.evaluate(() => window.__FYP_VIDEO__!.hideOverlay())
}

export async function showAnnotation(page: Page, annotationId: string): Promise<void> {
  await page.evaluate(
    (id) => {
      window.__FYP_VIDEO__!.showAnnotation(id)
    },
    annotationId,
  )
  await page.waitForTimeout(120)
}

async function hideAnnotation(page: Page): Promise<void> {
  await page.evaluate(() => window.__FYP_VIDEO__!.hideAnnotation())
}

export async function showHighlightSet(page: Page, setId: string): Promise<void> {
  await page.evaluate((id) => window.__FYP_VIDEO__!.showHighlightSet(id), setId)
  await page.waitForTimeout(150)
}

async function hideHighlights(page: Page): Promise<void> {
  await page.evaluate(() => window.__FYP_VIDEO__!.hideHighlights())
}

async function scrollStackToTop(page: Page): Promise<void> {
  await page.evaluate(() => {
    const stack = document.querySelector('[data-testid="bytecode-stack"]') as HTMLElement | null
    if (stack) stack.scrollTop = 0
  })
  await page.waitForTimeout(200)
}

export async function applyFocus(page: Page, focusKey: string, zones: ZonesFile): Promise<void> {
  const area = zones.focusAreas[focusKey]
  if (!area) return

  const safeTop = zones.safeZone?.topPx ?? 0
  const safeBottom = zones.safeZone?.bottomPx ?? 0
  const topBanner = zones.placements['top-banner']
  const reservedTop = topBanner
    ? safeTop + topBanner.insetPx + topBanner.maxHeightPx + 12
    : safeTop + 200

  await page.evaluate(
    ({ selector, padTop, padBottom }) => {
      const el = document.querySelector(selector)
      if (!el) return
      const peek =
        Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--companion-peek-h'),
        ) || 56
      const maxY = window.innerHeight - padBottom - peek

      const rect = el.getBoundingClientRect()
      if (rect.top < padTop) {
        el.scrollIntoView({ block: 'start', behavior: 'instant' })
      }
      const after = el.getBoundingClientRect()
      if (after.bottom > maxY) {
        el.scrollIntoView({ block: 'nearest', behavior: 'instant' })
      }
    },
    { selector: area.selector, padTop: reservedTop, padBottom: safeBottom },
  )
  await page.waitForTimeout(350)
}

async function selectExample(page: Page, exampleKey: string): Promise<void> {
  await page.getByTestId('example-select').click({ force: true })
  await page.getByTestId(`example-${exampleKey}`).click({ force: true })
  await page.waitForTimeout(400)
  try {
    await waitForStepButton(page)
  } catch {
    // Not all explorations have a step button
  }
}

async function scrollBytecodePanels(page: Page): Promise<void> {
  await page.evaluate(() => {
    const dis = document.querySelector('[data-testid="bytecode-disassembly"]')
    const activeRow = dis?.querySelector('[data-disassembly-active="true"]')
    activeRow?.scrollIntoView({ block: 'nearest', inline: 'nearest' })

    const stack = document.querySelector('[data-testid="bytecode-stack"]') as HTMLElement | null
    if (!stack) return

    const depth = stack.querySelectorAll('[data-stack-depth]').length
    const opName = activeRow?.querySelector(':last-child')?.textContent ?? ''

    if (/^STOP|RETURN|REVERT|HALT/i.test(opName)) {
      stack.scrollTop = 0
      return
    }
    if (/DUPN|SWAPN|EXCHANGE/i.test(opName) || depth >= 10) {
      stack.scrollTop = Math.max(0, stack.scrollHeight - stack.clientHeight)
      return
    }
    stack.scrollTop = 0
  })
}

async function clickSteps(page: Page, action: PlaybookStepAction): Promise<void> {
  const count = action.count ?? 1
  const interval = action.interval ?? 400
  const climaxFrom = action.climaxFrom ?? 0
  const climaxInterval = action.climaxInterval ?? Math.round(interval * 2.6)
  let climaxPrimed = false

  for (let i = 0; i < count; i++) {
    const stepNum = i + 1
    const inClimax = climaxFrom > 0 && stepNum >= climaxFrom

    if (inClimax && action.highlightSet && !climaxPrimed) {
      if (action.climaxPauseMs) await page.waitForTimeout(action.climaxPauseMs)
      await showHighlightSet(page, action.highlightSet)
      climaxPrimed = true
    }

    const waitMs = inClimax ? climaxInterval : interval

    await waitForStepButton(page)
    await page.getByTestId('bytecode-step').click({ force: true })
    await page.waitForTimeout(80)
    await scrollBytecodePanels(page)

    if (action.highlightAfterStep === stepNum && action.highlightSetAfter) {
      await scrollStackToTop(page)
      await showHighlightSet(page, action.highlightSetAfter)
      if (action.holdAfterClimaxMs) {
        await page.waitForTimeout(action.holdAfterClimaxMs)
      }
    }

    await page.waitForTimeout(Math.max(0, waitMs - 80))
  }
}

async function scrollPage(page: Page, selector: string, y = 120): Promise<void> {
  await page.evaluate(
    ({ sel, amount }) => {
      const el = document.querySelector(sel)
      if (el) el.scrollIntoView({ block: 'center' })
      window.scrollBy({ top: amount, behavior: 'smooth' })
    },
    { sel: selector, amount: y },
  )
  await page.waitForTimeout(700)
}

async function expandCompanion(page: Page, mode: 'half' | 'full'): Promise<void> {
  await page.evaluate((m) => window.__FYP_VIDEO__!.expandCompanion(m), mode)
  await page.waitForTimeout(500)
}

async function runActions(page: Page, step: PlaybookStep): Promise<void> {
  if (step.selectExample) await selectExample(page, step.selectExample)
  if (step.step !== undefined) await clickSteps(page, normalizeStepAction(step.step))
  if (step.scroll) await scrollPage(page, step.scroll.selector, step.scroll.y)
  if (step.expandCompanion) await expandCompanion(page, step.expandCompanion)
  if (step.click) await page.getByTestId(step.click).click()
}

/**
 * Story beat order: show overlay → focus → cue (read) → hide → reveal actions → hold.
 */
async function runStep(
  page: Page,
  step: PlaybookStep,
  options: { skipOverlay?: boolean; content?: VideoContentConfig; zones?: ZonesFile } = {},
): Promise<void> {
  const hasActions = stepHasActions(step)

  if (step.annotate) {
    await showAnnotation(page, step.annotate)
  }

  if (step.overlay && !options.skipOverlay) {
    const placement = resolvePlacement(step, step.overlay, options.content)
    await showOverlay(page, step.overlay, { placement })
    await page.waitForTimeout(80)
    if (step.focus && options.zones) {
      await applyFocus(page, step.focus, options.zones)
    }
  }

  const readMs =
    step.cue ??
    (step.overlay && !hasActions ? step.wait : undefined) ??
    0
  if (readMs > 0) await page.waitForTimeout(readMs)

  const shouldHideAfterCue =
    step.overlay &&
    (step.hideOverlay === true ||
      (step.hideOverlay !== false && hasActions && step.cue !== undefined))

  if (shouldHideAfterCue) {
    await hideOverlay(page)
  } else if (step.hideOverlay && !step.overlay) {
    await hideOverlay(page)
  }

  await runActions(page, step)

  let holdMs = 0
  if (hasActions) {
    holdMs = step.wait ?? 0
  } else if (step.overlay && step.cue !== undefined) {
    holdMs = step.wait ?? 0
  } else if (!step.overlay) {
    holdMs = step.wait ?? 0
  }
  if (holdMs > 0) await page.waitForTimeout(holdMs)

  if (step.annotate) {
    await hideAnnotation(page)
  }

  if (stepUsesHighlights(step)) {
    await hideHighlights(page)
  }
}

export async function showLeadInOverlay(page: Page, overlayId: string): Promise<void> {
  await waitForVideoBridge(page)
  await ensureVideoFontsReady(page)
  await showOverlay(page, overlayId)
  await page
    .locator('[data-testid="video-title-card"], [data-testid="video-outro-card"]')
    .first()
    .waitFor({ state: 'visible', timeout: 10_000 })
  await page.waitForFunction(() => {
    const card = document.querySelector(
      '[data-testid="video-title-card"], [data-testid="video-outro-card"]',
    )
    if (!card) return false
    const { opacity } = getComputedStyle(card)
    return Number.parseFloat(opacity) >= 0.99
  })
  await page.waitForFunction(() => {
    const title = document.querySelector('.video-card-band__title')
    if (!title) return false
    return getComputedStyle(title).fontFamily.toLowerCase().includes('bebas')
  }, undefined, { timeout: 15_000 })
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      }),
  )
  await page.evaluate(() => {
    document.documentElement.classList.add('fyp-video-lead-in-ready')
  })
  // Let Playwright encode several hero-sized title frames before exploration init continues.
  await page.waitForTimeout(900)
}

/** Minimum ms to hold lead-in on screen after it renders (recording continues during this). */
export const LEAD_IN_SETTLE_MS = 900

export async function runPlaybook(
  page: Page,
  playbook: PlaybookConfig,
  options: PlaybookRunnerOptions = {},
): Promise<void> {
  await waitForVideoBridge(page)

  let skippedLeadIn = false

  for (let i = 0; i < playbook.steps.length; i++) {
    const step = playbook.steps[i]!
    options.onStep?.(i, step)
    if (options.dryRun) {
      console.log(`  [dry-run] step ${i + 1}/${playbook.steps.length}:`, JSON.stringify(step))
      continue
    }
    const skipOverlay =
      !skippedLeadIn &&
      options.skipInitialOverlay !== undefined &&
      step.overlay === options.skipInitialOverlay
    if (skipOverlay) skippedLeadIn = true
    await runStep(page, step, {
      skipOverlay,
      content: options.content,
      zones: options.zones,
    })
  }
}

export async function waitForExplorationReady(page: Page, explorationId: string): Promise<void> {
  const rootSelector = `#${explorationId}-c`
  await page.waitForSelector(rootSelector, {
    state: 'attached',
    timeout: 60_000,
  })
  await page.waitForSelector('[data-testid="exploration-ready"]', {
    state: 'attached',
    timeout: 60_000,
  })
  await page.evaluate(async () => {
    await document.fonts.ready
  })
}

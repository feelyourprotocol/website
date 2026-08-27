import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { TEMPLATES_DIR } from './config.ts'
import type { ExplorationOgData, TopicOgData } from './data.ts'
import { renderTemplate, renderTemplateWithRaw } from './render.ts'

const BASE_STYLES = readFileSync(join(TEMPLATES_DIR, 'shared.css'), 'utf8')

function coverBlock(coverUrl: string | null, accent: string): string {
  if (!coverUrl) {
    return `<div class="cover cover--empty" style="border-color:${accent}33">
      <div class="cover-placeholder" style="color:${accent}">FYP</div>
    </div>`
  }
  return `<div class="cover" style="border-color:${accent}55">
    <img src="${coverUrl}" alt="">
  </div>`
}

function thumbnailRow(urls: string[], accent: string): string {
  if (urls.length === 0) {
    return `<div class="thumb-row thumb-row--empty" style="border-color:${accent}33"></div>`
  }
  const items = urls
    .map(
      (url) =>
        `<div class="thumb" style="border-color:${accent}55"><img src="${url}" alt=""></div>`,
    )
    .join('')
  return `<div class="thumb-row">${items}</div>`
}

export function buildExplorationHtml(data: ExplorationOgData): string {
  const template = readFileSync(join(TEMPLATES_DIR, 'exploration.html'), 'utf8')
  const html = renderTemplate(template, {
    TITLE: data.title,
    SPEC_LABEL: data.specLabel,
    DESCRIPTION: data.seoDescription,
    TOPIC_TITLE: data.topicTitle,
    TAGLINE: 'Ethereum Protocol Explorations for Humans and AI',
    LOGO_URL: '/src/logo.png',
  })

  return renderTemplateWithRaw(html, {
    BASE_STYLES,
    ACCENT: data.palette.accent,
    BG: data.palette.bg,
    TEXT: data.palette.text,
    BADGE_BG: data.palette.badgeBg,
    COVER_BLOCK: coverBlock(data.coverUrl, data.palette.accent),
  })
}

export function buildTopicHtml(data: TopicOgData): string {
  const template = readFileSync(join(TEMPLATES_DIR, 'topic.html'), 'utf8')
  const html = renderTemplate(template, {
    PAGE_TITLE: data.pageTitle,
    TOPIC_TITLE: data.title,
    DESCRIPTION: data.introText,
    EXPLORATION_COUNT: String(data.explorationCount),
    EXPLORATION_LABEL: data.explorationCount === 1 ? 'exploration' : 'explorations',
    TAGLINE: 'Ethereum Protocol Explorations for Humans and AI',
    LOGO_URL: '/src/logo.png',
  })

  return renderTemplateWithRaw(html, {
    BASE_STYLES,
    ACCENT: data.palette.accent,
    BG: data.palette.bg,
    TEXT: data.palette.text,
    BADGE_BG: data.palette.badgeBg,
    THUMB_ROW: thumbnailRow(data.coverUrls, data.palette.accent),
  })
}

import { type Exploration, EXPLORATIONS } from '@/explorations/REGISTRY'
import { type Topic, TOPICS } from '@/explorations/TOPICS'

import {
  DEFAULT_SITE_NAME,
  escapeHtml,
  injectSeoIntoHtml,
  type PageSeo,
  truncateDescription,
} from './seoCore'

export {
  DEFAULT_SITE_NAME,
  escapeHtml,
  injectSeoIntoHtml,
  type PageSeo,
  stripHtml,
  truncateDescription,
} from './seoCore'

export const SITE_ORIGIN = 'https://feelyourprotocol.org'
export const SITE_NAME = DEFAULT_SITE_NAME

export const HOME_PAGE_TITLE = `${SITE_NAME} — Interactive Ethereum Protocol Explorations`

export const DEFAULT_DESCRIPTION =
  'Interactive open-source explorations of Ethereum protocol changes. Real EVM and crypto libraries running in your browser.'

/** Stable path under `public/og/` — copied verbatim to `dist/website/og/` on build. */
export const DEFAULT_OG_IMAGE_PATH = '/og/default.webp'
export const DEFAULT_OG_IMAGE_WIDTH = 1200
export const DEFAULT_OG_IMAGE_HEIGHT = 630

export interface BreadcrumbItem {
  label: string
  to?: string
}

export interface SitemapEntry {
  loc: string
  lastmod?: string
}

const explorationByPath = new Map(
  Object.entries(EXPLORATIONS).map(([id, exploration]) => [exploration.path, { id, exploration }]),
)

const topicByPath = new Map(Object.values(TOPICS).map((topic) => [topic.path, topic]))

function absoluteUrl(path: string): string {
  return path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`
}

function formatDocumentTitle(pageTitle: string): string {
  return pageTitle === SITE_NAME ? SITE_NAME : `${pageTitle} — ${SITE_NAME}`
}

type PageSeoCore = Omit<PageSeo, 'imageUrl' | 'imageWidth' | 'imageHeight' | 'imageAlt'>

function withSocialImage(seo: PageSeoCore): PageSeo {
  return {
    ...seo,
    imageUrl: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
    imageWidth: DEFAULT_OG_IMAGE_WIDTH,
    imageHeight: DEFAULT_OG_IMAGE_HEIGHT,
    imageAlt: seo.title,
  }
}

export function formatEipSpecLabel(explorationId: string): string {
  const match = /^eip-(\d+)$/i.exec(explorationId)
  return match ? `EIP-${match[1]}` : explorationId.toUpperCase()
}

function formatTopicPageTitle(topic: Topic): string {
  return `Ethereum ${topic.title}`
}

function buildExplorationDiscoveryFallback(
  explorationId: string,
  exploration: Exploration,
): string {
  const eipLabel = formatEipSpecLabel(explorationId)
  const titleWithoutEip = exploration.title.replace(new RegExp(`^${eipLabel}\\s*`, 'i'), '').trim()
  const subject = titleWithoutEip || exploration.title
  return truncateDescription(
    `Interactive Ethereum explainer for ${eipLabel}: ${subject}. Run real protocol libraries in your browser.`,
  )
}

export function getExplorationDiscoveryDescription(
  explorationId: string,
  exploration: Exploration,
): string {
  if (exploration.seoDescription) {
    return truncateDescription(exploration.seoDescription)
  }
  return buildExplorationDiscoveryFallback(explorationId, exploration)
}

function getTopicDiscoveryDescription(topic: Topic): string {
  const lead = `Interactive Ethereum ${topic.title.toLowerCase()} explorations. `
  return truncateDescription(lead + (topic.introText ?? DEFAULT_DESCRIPTION))
}

/** Shared discovery copy for meta tags, JSON-LD, and static prerender body text. */
export function getDiscoveryDescription(path: string): string {
  if (path === '/') {
    return DEFAULT_DESCRIPTION
  }

  if (path === '/imprint') {
    return (
      'Imprint and contact information for Feel Your Protocol, an open-source Ethereum ' +
      'protocol exploration project by Holger Drewes.'
    )
  }

  if (path === '/all') {
    return (
      'Browse all interactive Ethereum protocol explorations on Feel Your Protocol — filter by ' +
      'research topic, timeline, and tags.'
    )
  }

  const topic = topicByPath.get(path)
  if (topic) {
    return getTopicDiscoveryDescription(topic)
  }

  const entry = explorationByPath.get(path)
  if (entry) {
    return getExplorationDiscoveryDescription(entry.id, entry.exploration)
  }

  return DEFAULT_DESCRIPTION
}

function breadcrumbJsonLd(items: BreadcrumbItem[], pageUrl: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.to ? { item: absoluteUrl(item.to) } : { item: pageUrl }),
    })),
  }
}

export function getBreadcrumbsForPath(path: string): BreadcrumbItem[] {
  if (path === '/') {
    return [{ label: SITE_NAME }]
  }

  if (path === '/imprint') {
    return [{ label: 'Home', to: '/' }, { label: 'Imprint' }]
  }

  if (path === '/all') {
    return [{ label: 'Home', to: '/' }, { label: 'All Explorations' }]
  }

  const topic = topicByPath.get(path)
  if (topic) {
    return [{ label: 'Home', to: '/' }, { label: topic.title }]
  }

  const entry = explorationByPath.get(path)
  if (entry) {
    const topicForExploration = TOPICS[entry.exploration.topic]
    return [
      { label: 'Home', to: '/' },
      { label: topicForExploration.title, to: topicForExploration.path },
      { label: entry.exploration.title },
    ]
  }

  return [{ label: SITE_NAME }]
}

/** Paths that receive nginx SPA fallbacks (all router paths except the catch-all 404). */
export function getValidSpaPaths(): string[] {
  const paths = ['/', '/imprint', '/all']

  for (const topic of Object.values(TOPICS)) {
    paths.push(topic.path)
  }
  for (const exploration of Object.values(EXPLORATIONS)) {
    paths.push(exploration.path)
  }

  return paths
}

/** Indexed paths only — excludes topic pages with no explorations yet. */
export function getSitemapPaths(): string[] {
  return getValidSpaPaths().filter((path) => {
    const topic = topicByPath.get(path)
    if (topic) return topic.explorations.length > 0
    return true
  })
}

export function getPageSeoForPath(path: string): PageSeo {
  const canonicalUrl = absoluteUrl(path)
  const breadcrumbs = getBreadcrumbsForPath(path)

  if (path === '/') {
    return withSocialImage({
      path,
      title: HOME_PAGE_TITLE,
      description: DEFAULT_DESCRIPTION,
      canonicalUrl,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_ORIGIN,
          description: DEFAULT_DESCRIPTION,
        },
        breadcrumbJsonLd(breadcrumbs, canonicalUrl),
      ],
    })
  }

  if (path === '/imprint') {
    const description = getDiscoveryDescription(path)
    return withSocialImage({
      path,
      title: formatDocumentTitle('Imprint'),
      description,
      canonicalUrl,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Imprint',
          url: canonicalUrl,
          description,
          isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_ORIGIN },
        },
        breadcrumbJsonLd(breadcrumbs, canonicalUrl),
      ],
    })
  }

  if (path === '/all') {
    const description = getDiscoveryDescription(path)
    return withSocialImage({
      path,
      title: formatDocumentTitle('All Explorations'),
      description,
      canonicalUrl,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'All Explorations',
          url: canonicalUrl,
          description,
          isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_ORIGIN },
        },
        breadcrumbJsonLd(breadcrumbs, canonicalUrl),
      ],
    })
  }

  const topic = topicByPath.get(path)
  if (topic) {
    const description = getDiscoveryDescription(path)
    return withSocialImage({
      path,
      title: formatDocumentTitle(formatTopicPageTitle(topic)),
      description,
      canonicalUrl,
      noindex: topic.explorations.length === 0 ? true : undefined,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: topic.title,
          url: canonicalUrl,
          description,
          isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_ORIGIN },
        },
        breadcrumbJsonLd(breadcrumbs, canonicalUrl),
      ],
    })
  }

  const entry = explorationByPath.get(path)
  if (entry) {
    const { id, exploration } = entry
    const topicForExploration = TOPICS[exploration.topic]
    const description = getDiscoveryDescription(path)
    const eipLabel = formatEipSpecLabel(id)

    return withSocialImage({
      path,
      title: formatDocumentTitle(exploration.title),
      description,
      canonicalUrl,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: exploration.title,
          url: canonicalUrl,
          description,
          learningResourceType: 'InteractiveResource',
          about: { '@type': 'Thing', name: eipLabel },
          sameAs: exploration.infoURL,
          isPartOf: {
            '@type': 'CollectionPage',
            name: topicForExploration.title,
            url: absoluteUrl(topicForExploration.path),
          },
        },
        breadcrumbJsonLd(breadcrumbs, canonicalUrl),
      ],
    })
  }

  return withSocialImage({
    path,
    title: formatDocumentTitle('Page Not Found'),
    description:
      'This URL is not part of Feel Your Protocol. Explore Ethereum protocol changes interactively.',
    canonicalUrl,
    noindex: true,
    jsonLd: breadcrumbJsonLd(
      [{ label: 'Home', to: '/' }, { label: 'Page Not Found' }],
      canonicalUrl,
    ),
  })
}

export function getPageSeoForRoute(path: string, query: Record<string, unknown> = {}): PageSeo {
  const seo = getPageSeoForPath(path)
  const hasFilters = Boolean(query.tag || query.timeline)

  if (!hasFilters) return seo

  return {
    ...seo,
    canonicalUrl: absoluteUrl(path),
    noindex: true,
  }
}

export function getSitemapEntries(lastmodByPath: Record<string, string> = {}): SitemapEntry[] {
  return getSitemapPaths().map((path) => ({
    loc: absoluteUrl(path),
    lastmod: lastmodByPath[path],
  }))
}

export function generateSitemapXml(lastmodByPath: Record<string, string> = {}): string {
  const entries = getSitemapEntries(lastmodByPath)
    .map(({ loc, lastmod }) => {
      const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
      return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n  </url>`
    })
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</urlset>',
    '',
  ].join('\n')
}

export function generateRobotsTxt(): string {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE_ORIGIN}/sitemap.xml`, ''].join('\n')
}

export function getSpaFallbackDirectories(): string[] {
  return getValidSpaPaths()
    .filter((path) => path !== '/')
    .map((path) => path.replace(/^\//, ''))
}

export interface StaticShellAssets {
  /** Hashed logo path from the Vite build, e.g. `/assets/logo-BGFR8iZG.png`. */
  logoSrc: string
}

/** Screen-reader page heading for the static shell — mirrors in-app `<h1>` / breadcrumb context. */
export function getStaticShellHeading(path: string): string {
  if (path === '/') {
    return `${SITE_NAME} — Interactive Ethereum Protocol Explorations`
  }

  const crumbs = getBreadcrumbsForPath(path)
  return crumbs[crumbs.length - 1]!.label
}

/** Minimal above-the-fold markup painted before Vue mounts (replaced on `mount('#app')`). */
export function buildStaticShellHtml(path: string, assets: StaticShellAssets): string {
  const heading = escapeHtml(getStaticShellHeading(path))
  const discovery = escapeHtml(getDiscoveryDescription(path))
  const logoSrc = escapeHtml(assets.logoSrc)

  return [
    '<div id="static-shell" data-static-shell>',
    '  <header class="mt-3 mb-4">',
    '    <div class="flex flex-col gap-2 sm:grid sm:grid-cols-2">',
    '      <div class="site-title sm:col-start-1 sm:row-start-1">',
    '        <a href="/" class="inline-flex items-center gap-2.5 md:gap-3 text-2xl md:text-4xl font-bold tracking-wider whitespace-nowrap no-underline">',
    `          <img src="${logoSrc}" alt="" class="h-[1em] w-auto shrink-0" width="108" height="128" fetchpriority="high">`,
    '          <span class="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">Feel Your Protocol</span>',
    '        </a>',
    '      </div>',
    '      <p class="flex items-baseline text-sm md:text-xl text-slate-500 tracking-wide sm:col-span-2 sm:row-start-2">',
    '        <span class="shrink-0">Interactive Ethereum Protocol Explorations</span>',
    '      </p>',
    '    </div>',
    '  </header>',
    '  <main>',
    `    <h1 class="sr-only">${heading}</h1>`,
    `    <p class="text-sm text-slate-600 max-w-3xl">${discovery}</p>`,
    '  </main>',
    '</div>',
  ].join('\n')
}

/** Inject visible static shell into `#app` for early LCP paint. */
export function injectStaticShellIntoHtml(
  html: string,
  path: string,
  assets: StaticShellAssets,
): string {
  const shell = buildStaticShellHtml(path, assets)
  const withShell = html.replace(
    /<div id="app">\s*<\/div>/,
    `<div id="app">\n    ${shell}\n  </div>`,
  )
  if (withShell === html) {
    throw new Error('Could not inject static shell: #app placeholder not found')
  }
  return withShell
}

/** SEO head tags + static above-the-fold shell for a built route HTML file. */
export function injectBuiltPageHtml(html: string, seo: PageSeo, assets: StaticShellAssets): string {
  return injectStaticShellIntoHtml(injectSeoIntoHtml(html, seo), seo.path, assets)
}

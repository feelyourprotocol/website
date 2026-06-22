import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'

export const SITE_ORIGIN = 'https://feelyourprotocol.org'
export const SITE_NAME = 'Feel Your Protocol'

export const DEFAULT_DESCRIPTION =
  'Collaborative open-source interactive explorations of upcoming Ethereum protocol changes. ' +
  'Widgets are powered by real EVM and cryptography libraries running in the browser.'

/** Stable path under `public/og/` — copied verbatim to `dist/website/og/` on build. */
export const DEFAULT_OG_IMAGE_PATH = '/og/default.png'
export const DEFAULT_OG_IMAGE_WIDTH = 1024
export const DEFAULT_OG_IMAGE_HEIGHT = 537

export interface BreadcrumbItem {
  label: string
  to?: string
}

export interface PageSeo {
  path: string
  title: string
  description: string
  canonicalUrl: string
  imageUrl: string
  imageWidth: number
  imageHeight: number
  imageAlt: string
  noindex?: boolean
  jsonLd?: object | object[]
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

/** Strip HTML tags and collapse whitespace for meta descriptions. */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text
  const cut = text.slice(0, maxLength - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`
}

export function formatEipSpecLabel(explorationId: string): string {
  const match = /^eip-(\d+)$/i.exec(explorationId)
  return match ? `EIP-${match[1]}` : explorationId.toUpperCase()
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
      title: SITE_NAME,
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
    const description =
      'Imprint and contact information for Feel Your Protocol, an open-source Ethereum ' +
      'protocol exploration project by Holger Drewes.'
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
    const description =
      'Browse all interactive Ethereum protocol explorations on Feel Your Protocol — filter by ' +
      'research topic, timeline, and tags.'
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
    const description = truncateDescription(topic.introText ?? DEFAULT_DESCRIPTION)
    return withSocialImage({
      path,
      title: formatDocumentTitle(topic.title),
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
    const description = truncateDescription(stripHtml(exploration.introText))
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
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

/** Inject title, meta, canonical, Open Graph, and JSON-LD into the Vite-built index.html shell. */
export function injectSeoIntoHtml(html: string, seo: PageSeo): string {
  const headTags: string[] = [
    `<meta name="description" content="${escapeHtml(seo.description)}">`,
    `<link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}">`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}">`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}">`,
    `<meta property="og:url" content="${escapeHtml(seo.canonicalUrl)}">`,
    `<meta property="og:image" content="${escapeHtml(seo.imageUrl)}">`,
    `<meta property="og:image:width" content="${seo.imageWidth}">`,
    `<meta property="og:image:height" content="${seo.imageHeight}">`,
    `<meta property="og:image:alt" content="${escapeHtml(seo.imageAlt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}">`,
    `<meta name="twitter:image" content="${escapeHtml(seo.imageUrl)}">`,
    `<meta name="twitter:image:alt" content="${escapeHtml(seo.imageAlt)}">`,
  ]

  if (seo.noindex) {
    headTags.push('<meta name="robots" content="noindex, follow">')
  }

  if (seo.jsonLd) {
    const json = JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c')
    headTags.push(`<script type="application/ld+json" id="page-seo-jsonld">${json}</script>`)
  }

  let out = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(seo.title)}</title>`)
  out = out.replace(/<meta name="description"[^>]*>\s*/g, '')
  out = out.replace(/<link rel="canonical"[^>]*>\s*/g, '')
  out = out.replace(/<meta property="og:[^"]+"[^>]*>\s*/g, '')
  out = out.replace(/<meta name="twitter:[^"]+"[^>]*>\s*/g, '')
  out = out.replace(/<meta name="robots"[^>]*>\s*/g, '')
  out = out.replace(
    /<script type="application\/ld\+json" id="page-seo-jsonld"[^>]*>[\s\S]*?<\/script>\s*/g,
    '',
  )
  out = out.replace('</head>', `    ${headTags.join('\n    ')}\n  </head>`)
  return out
}

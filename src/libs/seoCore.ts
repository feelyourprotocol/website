/** Shared SEO types and HTML helpers — no router/exploration dependencies. */

export const DEFAULT_SITE_NAME = 'Feel Your Protocol' as const

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

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Inject title, meta, canonical, Open Graph, and JSON-LD into a Vite-built index.html shell. */
export function injectSeoIntoHtml(
  html: string,
  seo: PageSeo,
  siteName: string = DEFAULT_SITE_NAME,
): string {
  const headTags: string[] = [
    `<meta name="description" content="${escapeHtml(seo.description)}">`,
    `<link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}">`,
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
  out = out.replace(/<meta\s+name="description"[^>]*>\s*/g, '')
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

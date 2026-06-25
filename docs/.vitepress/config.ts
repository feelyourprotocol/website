import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitepress'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8')) as {
  version: string
}

/** Production docs origin — static `.html` paths on nginx. */
const DOCS_ORIGIN = 'https://docs.feelyourprotocol.org'

const DOCS_TITLE = 'Feel Your Protocol Docs'
const DOCS_DESCRIPTION =
  'Contributor guide and architecture docs for Feel Your Protocol — interactive Ethereum protocol explorations, E-Components, and open-source development.'

/** Stable path under `docs/public/og/` — copied to `dist/docs/og/` on build. */
const DOCS_OG_IMAGE_PATH = '/og/default.webp'
const DOCS_OG_IMAGE = `${DOCS_ORIGIN}${DOCS_OG_IMAGE_PATH}`
const DOCS_OG_IMAGE_WIDTH = '1200'
const DOCS_OG_IMAGE_HEIGHT = '630'
const DOCS_OG_IMAGE_ALT = 'Feel Your Protocol Docs — contributor guide and architecture'

function docsCanonicalUrl(relativePath: string): string {
  if (relativePath === 'index.md') return `${DOCS_ORIGIN}/index.html`
  return `${DOCS_ORIGIN}/${relativePath.replace(/\.md$/, '.html')}`
}

function docsPageTitle(pageTitle: string | undefined): string {
  if (!pageTitle || pageTitle === DOCS_TITLE) return DOCS_TITLE
  return `${pageTitle} | Feel Your Protocol`
}

export default defineConfig({
  lang: 'en',
  title: DOCS_TITLE,
  titleTemplate: ':title | Feel Your Protocol',
  description: DOCS_DESCRIPTION,
  head: [
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Feel Your Protocol' }],
    ['meta', { property: 'og:image', content: DOCS_OG_IMAGE }],
    ['meta', { property: 'og:image:width', content: DOCS_OG_IMAGE_WIDTH }],
    ['meta', { property: 'og:image:height', content: DOCS_OG_IMAGE_HEIGHT }],
    ['meta', { property: 'og:image:alt', content: DOCS_OG_IMAGE_ALT }],
    ['meta', { property: 'og:image:type', content: 'image/webp' }],
    ['meta', { name: 'twitter:image', content: DOCS_OG_IMAGE }],
    ['meta', { name: 'twitter:image:alt', content: DOCS_OG_IMAGE_ALT }],
  ],
  sitemap: {
    hostname: DOCS_ORIGIN,
  },
  transformHead({ pageData }) {
    const canonical = docsCanonicalUrl(pageData.relativePath)
    const title = docsPageTitle(pageData.title)
    const description = pageData.description || DOCS_DESCRIPTION

    return [
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
    ]
  },
  outDir: '../dist/docs',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Contributing', link: '/contributing/how-to-contribute' },
      { text: 'Changelog', link: '/changelog' },
      { text: 'Website', link: 'https://feelyourprotocol.org' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Architecture', link: '/guide/architecture' },
          { text: 'Changelog', link: '/changelog' },
        ],
      },
      {
        text: 'Contributing',
        items: [
          { text: 'How to Contribute', link: '/contributing/how-to-contribute' },
          { text: 'AI-Assisted Development', link: '/contributing/ai-assisted-development' },
          { text: 'Adding an Exploration', link: '/contributing/adding-an-exploration' },
          { text: 'Images', link: '/contributing/images' },
          { text: 'UI Components', link: '/contributing/ui-components' },
          { text: 'E-Components', link: '/contributing/e-components' },
          { text: 'Available E-Components', link: '/contributing/available-e-components' },
          { text: 'Styling & Design', link: '/contributing/styling' },
          { text: 'Code Conventions', link: '/contributing/code-conventions' },
          { text: 'Third-Party Libraries', link: '/contributing/third-party-libraries' },
        ],
      },
      {
        text: 'Special Actions',
        link: '/special-actions/',
        collapsed: true,
        items: [{ text: 'Ice Cream Week', link: '/special-actions/ice-cream-week' }],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/feelyourprotocol/website' }],
    search: {
      provider: 'local',
    },
    footer: {
      message: `Structural base v${pkg.version} — latest docs always apply. See changelog for history.`,
      copyright: 'Feel Your Protocol',
    },
  },
})

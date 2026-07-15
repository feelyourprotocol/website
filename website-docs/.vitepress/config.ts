import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitepress'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8')) as {
  version: string
}

/** Production website-docs origin — static `.html` paths on nginx. */
const WEBSITE_DOCS_ORIGIN = 'https://website-docs.feelyourprotocol.org'

const DOCS_TITLE = 'Feel Your Protocol Website Docs'
const DOCS_DESCRIPTION =
  'Website docs for Feel Your Protocol — contributor guide and architecture for interactive Ethereum protocol explorations, E-Components, and open-source development.'

/** Stable path under `website-docs/public/og/` — copied to `dist/website-docs/og/` on build. */
const DOCS_OG_IMAGE_PATH = '/og/default.webp'
const DOCS_OG_IMAGE = `${WEBSITE_DOCS_ORIGIN}${DOCS_OG_IMAGE_PATH}`
const DOCS_OG_IMAGE_WIDTH = '1200'
const DOCS_OG_IMAGE_HEIGHT = '630'
const DOCS_OG_IMAGE_ALT = 'Feel Your Protocol Website Docs — contributor guide and architecture'

function docsCanonicalUrl(relativePath: string): string {
  if (relativePath === 'index.md') return `${WEBSITE_DOCS_ORIGIN}/index.html`
  return `${WEBSITE_DOCS_ORIGIN}/${relativePath.replace(/\.md$/, '.html')}`
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
    ['script', {}, 'document.documentElement.classList.add("fyp-site-docs")'],
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
    hostname: WEBSITE_DOCS_ORIGIN,
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
  outDir: '../dist/website-docs',
  themeConfig: {
    siteTitle:
      '<span class="fyp-nav-title"><span class="fyp-nav-title-main">Feel Your Protocol</span><span class="fyp-nav-title-sub">Website Docs</span></span>',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Contributing', link: '/contributing/how-to-contribute' },
      { text: 'Changelog', link: '/changelog' },
      { text: 'All Docs', link: 'https://docs.feelyourprotocol.org' },
      { text: 'MCP Docs', link: 'https://mcp-docs.feelyourprotocol.org' },
      { text: 'Roadmap', link: 'https://roadmap.feelyourprotocol.org' },
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
          { text: 'Video Pipeline', link: '/contributing/video-pipeline' },
          { text: 'Authoring a Video Short', link: '/contributing/video-authoring' },
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

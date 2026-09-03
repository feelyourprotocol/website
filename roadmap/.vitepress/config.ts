import { defineConfig } from 'vitepress'

/** Production roadmap origin — static `.html` paths on nginx. */
const ROADMAP_ORIGIN = 'https://roadmap.feelyourprotocol.org'

const ROADMAP_TITLE = 'Feel Your Protocol Roadmap'
const ROADMAP_DESCRIPTION =
  'Living roadmap and conceptualization workspace for Feel Your Protocol Phase 3 — vision, milestones, and draft concepts toward a sustainable API and MCP server for the future Ethereum protocol (upcoming forks, EIPs, and research).'

/** Stable path under `roadmap/public/og/` — copied to `dist/roadmap/og/` on build. */
const ROADMAP_OG_IMAGE_PATH = '/og/default.webp'
const ROADMAP_OG_IMAGE = `${ROADMAP_ORIGIN}${ROADMAP_OG_IMAGE_PATH}`
const ROADMAP_OG_IMAGE_WIDTH = '1200'
const ROADMAP_OG_IMAGE_HEIGHT = '630'
const ROADMAP_OG_IMAGE_ALT = 'Feel Your Protocol Roadmap — vision, milestones and tracks'

/** Project X — keep in sync with `src/libs/roadmapUrls.ts` (@FeelEthereum, not @feelyourprotocol). */
const FYP_X_URL = 'https://x.com/FeelEthereum'

function roadmapCanonicalUrl(relativePath: string): string {
  if (relativePath === 'index.md') return `${ROADMAP_ORIGIN}/index.html`
  return `${ROADMAP_ORIGIN}/${relativePath.replace(/\.md$/, '.html')}`
}

function roadmapPageTitle(pageTitle: string | undefined): string {
  if (!pageTitle || pageTitle === ROADMAP_TITLE) return ROADMAP_TITLE
  return `${pageTitle} | Feel Your Protocol`
}

export default defineConfig({
  lang: 'en',
  title: ROADMAP_TITLE,
  titleTemplate: ':title | Feel Your Protocol',
  description: ROADMAP_DESCRIPTION,
  /** README + scratch notes are contributor-facing only — keep them out of the built site + sitemap. */
  srcExclude: ['README.md', 'tmp.md', 'social/README.md'],
  head: [
    ['script', {}, 'document.documentElement.classList.add("fyp-site-roadmap")'],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Feel Your Protocol' }],
    ['meta', { property: 'og:image', content: ROADMAP_OG_IMAGE }],
    ['meta', { property: 'og:image:width', content: ROADMAP_OG_IMAGE_WIDTH }],
    ['meta', { property: 'og:image:height', content: ROADMAP_OG_IMAGE_HEIGHT }],
    ['meta', { property: 'og:image:alt', content: ROADMAP_OG_IMAGE_ALT }],
    ['meta', { property: 'og:image:type', content: 'image/webp' }],
    ['meta', { name: 'twitter:image', content: ROADMAP_OG_IMAGE }],
    ['meta', { name: 'twitter:image:alt', content: ROADMAP_OG_IMAGE_ALT }],
  ],
  sitemap: {
    hostname: ROADMAP_ORIGIN,
  },
  transformHead({ pageData }) {
    const canonical = roadmapCanonicalUrl(pageData.relativePath)
    const title = roadmapPageTitle(pageData.title)
    const description = pageData.description || ROADMAP_DESCRIPTION

    return [
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
    ]
  },
  outDir: '../dist/roadmap',
  themeConfig: {
    siteTitle:
      '<span class="fyp-nav-title"><span class="fyp-nav-title-main">Feel Your Protocol</span><span class="fyp-nav-title-sub">Roadmap</span></span>',
    nav: [
      { text: 'Launch', link: '/roadmap/launch' },
      { text: 'Vision', link: '/vision/problem-vision' },
      { text: 'Roadmap', link: '/roadmap/roadmap' },
      { text: 'Concepts', link: '/concepts/api-mcp' },
      { text: 'All Docs', link: 'https://docs.feelyourprotocol.org' },
      { text: 'MCP Docs', link: 'https://mcp-docs.feelyourprotocol.org' },
      { text: 'Website Docs', link: 'https://website-docs.feelyourprotocol.org' },
      { text: 'Website', link: 'https://feelyourprotocol.org' },
    ],
    sidebar: [
      {
        text: 'Overview',
        items: [{ text: 'Introduction', link: '/' }],
      },
      {
        text: 'Vision & Strategy',
        items: [
          { text: 'Problem & Vision', link: '/vision/problem-vision' },
          { text: 'Two Legs, One Engine', link: '/vision/two-legs' },
          { text: 'Principles & Operating Discipline', link: '/vision/principles' },
        ],
      },
      {
        text: 'Roadmap',
        items: [
          { text: 'Launch week', link: '/roadmap/launch' },
          { text: 'Roadmap & Tracks', link: '/roadmap/roadmap' },
          { text: 'Timeline', link: '/roadmap/timeline' },
        ],
      },
      {
        text: 'Core Concepts',
        items: [
          { text: 'Agent API & MCP (Concept)', link: '/concepts/api-mcp' },
          { text: 'x402 & Agent Economy (Concept)', link: '/concepts/x402' },
        ],
      },
      {
        text: 'Monetization & Community',
        items: [
          { text: 'Pricing & Cost Model', link: '/monetization/pricing' },
          { text: 'Token Utility', link: '/monetization/token' },
        ],
      },
      {
        text: 'Infrastructure',
        items: [{ text: 'AWS & Hosting', link: '/infrastructure/aws' }],
      },
      {
        text: 'Go-to-Market',
        items: [
          { text: 'Distribution & DevRel', link: '/go-to-market/distribution' },
          { text: 'Marketing Strategy', link: '/go-to-market/marketing' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/feelyourprotocol/website' },
      { icon: 'x', link: FYP_X_URL },
    ],
    search: {
      provider: 'local',
    },
    footer: {
      message:
        'A living conceptualization workspace — each section carries its own micro-changelog. Latest thinking always applies.',
      copyright: 'Feel Your Protocol',
    },
  },
})

import { defineConfig } from 'vitepress'

/** Production MCP docs origin — static `.html` paths on nginx. */
const MCP_DOCS_ORIGIN = 'https://mcp-docs.feelyourprotocol.org'

const MCP_DOCS_TITLE = 'Feel Your Protocol MCP Docs'
const MCP_DOCS_DESCRIPTION =
  'Concrete documentation for the Feel Your Protocol MCP server — deterministic future-Ethereum-protocol simulations for AI agents, tool reference, and technical setup.'

/** Stable path under `mcp-docs/public/og/` — copied to `dist/mcp-docs/og/` on build. */
const MCP_DOCS_OG_IMAGE_PATH = '/og/default.webp'
const MCP_DOCS_OG_IMAGE = `${MCP_DOCS_ORIGIN}${MCP_DOCS_OG_IMAGE_PATH}`
const MCP_DOCS_OG_IMAGE_WIDTH = '1200'
const MCP_DOCS_OG_IMAGE_HEIGHT = '630'
const MCP_DOCS_OG_IMAGE_ALT =
  'Feel Your Protocol MCP Docs — agent API reference and technical setup'

/** Project X — keep in sync with `src/libs/roadmapUrls.ts` (@FeelEthereum, not @feelyourprotocol). */
const FYP_X_URL = 'https://x.com/FeelEthereum'

function mcpDocsCanonicalUrl(relativePath: string): string {
  if (relativePath === 'index.md') return `${MCP_DOCS_ORIGIN}/index.html`
  return `${MCP_DOCS_ORIGIN}/${relativePath.replace(/\.md$/, '.html')}`
}

function mcpDocsPageTitle(pageTitle: string | undefined): string {
  if (!pageTitle || pageTitle === MCP_DOCS_TITLE) return MCP_DOCS_TITLE
  return `${pageTitle} | Feel Your Protocol`
}

export default defineConfig({
  lang: 'en',
  title: MCP_DOCS_TITLE,
  titleTemplate: ':title | Feel Your Protocol',
  description: MCP_DOCS_DESCRIPTION,
  /** README is contributor-facing only — keep it out of the built site + sitemap. */
  srcExclude: ['README.md'],
  head: [
    ['script', {}, 'document.documentElement.classList.add("fyp-site-mcp")'],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Feel Your Protocol' }],
    ['meta', { property: 'og:image', content: MCP_DOCS_OG_IMAGE }],
    ['meta', { property: 'og:image:width', content: MCP_DOCS_OG_IMAGE_WIDTH }],
    ['meta', { property: 'og:image:height', content: MCP_DOCS_OG_IMAGE_HEIGHT }],
    ['meta', { property: 'og:image:alt', content: MCP_DOCS_OG_IMAGE_ALT }],
    ['meta', { property: 'og:image:type', content: 'image/webp' }],
    ['meta', { name: 'twitter:image', content: MCP_DOCS_OG_IMAGE }],
    ['meta', { name: 'twitter:image:alt', content: MCP_DOCS_OG_IMAGE_ALT }],
  ],
  sitemap: {
    hostname: MCP_DOCS_ORIGIN,
  },
  transformHead({ pageData }) {
    const canonical = mcpDocsCanonicalUrl(pageData.relativePath)
    const title = mcpDocsPageTitle(pageData.title)
    const description = pageData.description || MCP_DOCS_DESCRIPTION

    return [
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
    ]
  },
  outDir: '../dist/mcp-docs',
  themeConfig: {
    siteTitle:
      '<span class="fyp-nav-title"><span class="fyp-nav-title-main">Feel Your Protocol</span><span class="fyp-nav-title-sub">MCP Docs</span></span>',
    nav: [
      { text: 'Use', link: '/use/introduction' },
      { text: 'Internals', link: '/internals/architecture' },
      { text: 'All Docs', link: 'https://docs.feelyourprotocol.org' },
      { text: 'Roadmap', link: 'https://roadmap.feelyourprotocol.org' },
      { text: 'Website Docs', link: 'https://website-docs.feelyourprotocol.org' },
      { text: 'Website', link: 'https://feelyourprotocol.org' },
    ],
    sidebar: {
      '/use/': [
        {
          text: 'Use',
          items: [
            { text: 'Introduction', link: '/use/introduction' },
            { text: 'Capabilities', link: '/use/capabilities' },
            { text: 'Connect', link: '/use/connect' },
            {
              text: 'Tools',
              collapsed: false,
              items: [
                { text: 'Describe Capabilities', link: '/use/tools/describe-capabilities' },
                { text: 'Run Bytecode', link: '/use/tools/run-bytecode' },
              ],
            },
            { text: 'Coverage', link: '/use/coverage' },
            {
              text: 'EIPs',
              collapsed: false,
              items: [{ text: 'EIP-8024 DUPN / SWAPN / EXCHANGE', link: '/use/eips/eip-8024' }],
            },
            { text: 'Guarantees', link: '/use/guarantees' },
            { text: 'Pricing', link: '/use/pricing' },
            { text: 'Runtime agents', link: '/use/runtime-agents' },
          ],
        },
      ],
      '/internals/': [
        {
          text: 'Internals',
          items: [
            { text: 'Architecture', link: '/internals/architecture' },
            { text: 'Repositories', link: '/internals/repositories' },
            { text: 'Execution Engine', link: '/internals/execution-engine' },
            { text: 'Gateway', link: '/internals/gateway' },
            { text: 'Quality', link: '/internals/quality' },
            { text: 'Deployment', link: '/internals/deployment' },
            { text: 'Design Principles', link: '/internals/design-principles' },
            { text: 'Roadmap vs MCP Docs', link: '/internals/roadmap-relationship' },
            { text: 'Contributing', link: '/internals/contributing' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/feelyourprotocol/website' },
      { icon: 'x', link: FYP_X_URL },
    ],
    search: {
      provider: 'local',
    },
    footer: {
      message:
        'Use = end-user reference. Internals = architecture and operations. Each section carries its own micro-changelog.',
      copyright: 'Feel Your Protocol',
    },
  },
})

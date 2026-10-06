import { defineConfig } from 'vitepress'

/** Production MCP docs origin — static `.html` paths on nginx. */
const MCP_DOCS_ORIGIN = 'https://mcp-docs.feelyourprotocol.org'

const MCP_DOCS_TITLE = 'Feel Your Protocol MCP Docs'
const MCP_DOCS_DESCRIPTION =
  'Connect your agent to a deterministic Ethereum lab — Amsterdam at launch, free. Prompts, limits, and reference for the Feel Your Protocol MCP server.'

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
  lastUpdated: true,
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
      { text: 'Get started', link: '/use/introduction' },
      { text: 'Connect', link: '/use/connect' },
      { text: 'Website', link: 'https://feelyourprotocol.org' },
      { text: 'All docs', link: 'https://docs.feelyourprotocol.org' },
      { text: 'Internals', link: '/internals/architecture' },
    ],
    sidebar: {
      '/use/': [
        {
          text: 'Get started',
          items: [
            { text: 'Why this server', link: '/use/introduction' },
            { text: 'Connect', link: '/use/connect' },
            { text: 'Amsterdam now', link: '/use/forks/glamsterdam' },
            { text: 'What you can ask', link: '/use/capabilities' },
            { text: 'Limits', link: '/use/guarantees' },
            { text: 'Pricing', link: '/use/pricing' },
            {
              text: 'Reference',
              collapsed: true,
              items: [
                { text: 'EIP catalogue', link: '/use/coverage' },
                { text: 'Mainnet — Fusaka', link: '/use/forks/fusaka' },
                { text: 'Historical forks', link: '/use/forks/historical-forks' },
                {
                  text: 'Tool schemas',
                  collapsed: true,
                  items: [
                    { text: 'Describe Capabilities', link: '/use/tools/describe-capabilities' },
                    { text: 'Run Bytecode', link: '/use/tools/run-bytecode' },
                    { text: 'Run Transaction', link: '/use/tools/run-transaction' },
                    { text: 'Run Block', link: '/use/tools/run-block' },
                    { text: 'Generate Artifact', link: '/use/tools/generate-artifact' },
                    { text: 'Inspect Artifact', link: '/use/tools/inspect-artifact' },
                  ],
                },
              ],
            },
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
    editLink: {
      pattern: 'https://github.com/feelyourprotocol/website/edit/main/mcp-docs/:path',
      text: 'Edit this page on GitHub',
    },
    docFooter: {
      prev: 'Previous',
      next: 'Next',
    },
    footer: {
      message:
        'Get started = connect and ask questions. Reference = catalogues and tool schemas. Internals = for builders.',
      copyright: 'Feel Your Protocol',
    },
  },
})

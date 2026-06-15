import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitepress'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8')) as {
  version: string
}

export default defineConfig({
  title: 'Feel Your Protocol',
  description: 'Documentation for the Feel Your Protocol project',
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

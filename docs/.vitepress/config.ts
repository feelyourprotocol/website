import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Feel Your Protocol',
  description: 'Documentation for the Feel Your Protocol project',
  outDir: '../dist/docs',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Contributing', link: '/contributing/how-to-contribute' },
      { text: 'Website', link: 'https://feelyourprotocol.org' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Architecture', link: '/guide/architecture' },
        ],
      },
      {
        text: 'Contributing',
        items: [
          { text: 'How to Contribute', link: '/contributing/how-to-contribute' },
          { text: 'Adding an Exploration', link: '/contributing/adding-an-exploration' },
          { text: 'UI Components', link: '/contributing/ui-components' },
          { text: 'E-Components', link: '/contributing/e-components' },
          { text: 'Available E-Components', link: '/contributing/available-e-components' },
          { text: 'Styling & Design', link: '/contributing/styling' },
          { text: 'Code Conventions', link: '/contributing/code-conventions' },
          { text: 'Library Forks', link: '/contributing/library-forks' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/feelyourprotocol/website' },
    ],
    search: {
      provider: 'local',
    },
    footer: {
      message: 'This project and its documentation are under active development.',
    },
  },
})

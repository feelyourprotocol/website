import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

const rootDir = fileURLToPath(new URL('./docs-hub', import.meta.url))
const outDir = fileURLToPath(new URL('./dist/docs', import.meta.url))

// Static docs hub for docs.feelyourprotocol.org (fleet documentation entrypoint)
// Dev:  npm run docs:dev   (http://localhost:5176)
// Prod: npm run docs:build → dist/docs/
export default defineConfig({
  root: rootDir,
  build: {
    outDir,
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        main: fileURLToPath(new URL('./docs-hub/index.html', import.meta.url)),
      },
    },
    assetsInlineLimit: 0,
  },
  server: {
    port: 5176,
    strictPort: true,
  },
  preview: {
    port: 4176,
    strictPort: true,
  },
})

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const rootDir = fileURLToPath(new URL('./roadmap/social', import.meta.url))
const outDir = fileURLToPath(new URL('./roadmap/social/dist', import.meta.url))

/** Standalone render targets for Twitter/social screenshots (Playwright capture). */
export default defineConfig({
  root: rootDir,
  plugins: [vue()],
  publicDir: fileURLToPath(new URL('./roadmap/public', import.meta.url)),
  build: {
    outDir,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@social': fileURLToPath(new URL('./roadmap/social/src', import.meta.url)),
    },
  },
  server: {
    port: 5175,
    strictPort: false,
  },
  preview: {
    port: 4175,
    strictPort: false,
  },
})

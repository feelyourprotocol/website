import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const rootDir = fileURLToPath(new URL('./community-token', import.meta.url))
const outDir = fileURLToPath(new URL('./dist/community-token', import.meta.url))

// Standalone mini-site for communitytoken.feelyourprotocol.org
// Dev:  npm run community-token:dev   (http://localhost:5174)
// Prod: npm run community-token:build → dist/community-token/
export default defineConfig({
  root: rootDir,
  plugins: [tailwindcss(), vue()],
  build: {
    outDir,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@ct': fileURLToPath(new URL('./community-token/src', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5174,
    strictPort: true,
  },
  preview: {
    port: 4174,
    strictPort: true,
  },
})

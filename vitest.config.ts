import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      alias: {
        '@shared': fileURLToPath(new URL('./src', import.meta.url)),
        '@ct': fileURLToPath(new URL('./community-token/src', import.meta.url)),
      },
    },
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      /** Entire repo — src, community-token, roadmap, og tooling; CI runs all via `npm run test:unit:ci`. */
      include: [
        'src/**/*.spec.ts',
        'community-token/**/*.spec.ts',
        'roadmap/**/*.spec.ts',
        'og/**/*.spec.ts',
        'video/**/*.spec.ts',
      ],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)

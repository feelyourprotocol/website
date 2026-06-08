import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

/**
 * Local dev aliases for EIP-8141 development.
 *
 * When VITE_FYP_LOCAL=true (set in .env.local), all @fyp-8141/* imports
 * and transitive @feelyourprotocol/* cross-package imports resolve directly
 * to the EthereumJS monorepo fork source — no npm publish round-trip needed.
 *
 * To enable:  echo "VITE_FYP_LOCAL=true" > .env.local
 * To disable: rm .env.local  (or set VITE_FYP_LOCAL=false)
 */
function getFypLocalAliases(): Record<string, string> {
  const mono = path.resolve(__dirname, '../../ethereumjs-monorepo-fyp/packages')
  const pkgs = [
    'common', 'rlp', 'tx', 'util', 'vm',
    'evm', 'block', 'statemanager', 'mpt', 'binarytree',
  ]
  const aliases: Record<string, string> = {}
  for (const pkg of pkgs) {
    const src = path.join(mono, pkg, 'src')
    aliases[`@fyp-8141/${pkg}`] = src
    aliases[`@feelyourprotocol/${pkg}`] = src
  }
  return aliases
}

// loadEnv at top level so the exported config stays a plain object
// (required by vitest.config.ts's mergeConfig).
// .env.local is loaded regardless of mode, so the mode value doesn't matter here.
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd())
const FYP_LOCAL = env.VITE_FYP_LOCAL === 'true'

if (FYP_LOCAL) {
  console.log(`\n  ⚡ FYP_LOCAL mode: @fyp-8141/* → monorepo source\n`)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    vueDevTools(),
  ],
  build: {
    outDir: 'dist/website',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      ...(FYP_LOCAL ? getFypLocalAliases() : {}),
    },
    ...(FYP_LOCAL ? {
      dedupe: ['eventemitter3', 'debug', 'lru-cache', '@js-sdsl/ordered-map'],
    } : {}),
  },
  ...(FYP_LOCAL ? {
    server: { fs: { allow: ['..', '../../ethereumjs-monorepo-fyp'] } },
  } : {}),
})

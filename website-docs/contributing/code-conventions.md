# Code Conventions

Naming rules agents should follow. Lint, format, and test gates: `.cursor/rules/quality.mdc` and `testing.mdc` — not duplicated here.

## Naming

### Explorations

- Folder: lowercase, hyphen-separated (`eip-7883`)
- Widget: always `MyC.vue`
- Metadata: `info.ts`
- Examples: `examples.ts`

### E-Components and UI

- E-Component folders and main components: `EC` postfix (`precompileInterfaceEC`, `PrecompileInterfaceEC.vue`)
- Shared UI components: `UIC` postfix (`ResultBoxUIC.vue`)
- Other structure components: `C` postfix (`ExplorationC.vue`)

### Imports

External packages first, then `@/` alias, then relative `./` paths. ESLint auto-sorts — run `npm run lint` to fix.

## Vue

`<script setup lang="ts">`, strict equality (`===`), no `console.log` in shipped code.

## Testing

Co-locate `tests.spec.ts` in exploration folders. Agent runs vitest; you review behavior in the browser.

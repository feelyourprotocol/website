# Code Conventions

This page documents the coding conventions used throughout the project. Following these ensures consistency and makes PRs easier to review.

## Imports

### Path Style

Use `@/` path aliases for cross-module imports and relative paths (`./`, `../`) for local/sibling imports within the same module:

```typescript
// External packages first
import { Hardfork } from '@ethereumjs/common'

// Internal @/ alias imports
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'
import ExplorationC from '@/explorations/ExplorationC.vue'

// Local relative imports last
import { examples } from './examples'
import { INFO as exploration } from './info'
```

The `@/` alias maps to `src/`. It is configured in both `vite.config.ts` and `tsconfig.app.json`.

### Import Sorting

Imports are automatically sorted and grouped by ESLint using `eslint-plugin-simple-import-sort`. The enforced order is:

1. **External packages** — anything not starting with `.` or `@/` (e.g. `vue`, `@ethereumjs/common`)
2. **Internal `@/` alias imports** — cross-module imports via the `@/` alias
3. **Local relative imports** — `./` and `../` paths

Run `npm run lint` to auto-fix import order. This is enforced in CI.

## Naming

### E-Components

E-Component folders and files use the `EC` postfix:

- Folder: `src/eComponents/precompileInterfaceEC/`
- Component: `PrecompileInterfaceEC.vue`
- Composable: `usePrecompileState.ts`

### Explorations

- Folder: lowercase, hyphen-separated ID (`eip-7883`, `erc-XXXX`)
- Widget: always `MyC.vue`
- Metadata: always `info.ts`
- Examples: always `examples.ts`

### UI Components

Standard Vue component naming in `src/eComponents/ui/`:
- UI components end with `UIC` (e.g. `ResultBoxUIC.vue`, `ExamplesUIC.vue`), E-Components with `EC`, other structure components with `C`

## Vue Patterns

### Composition API

All components use `<script setup lang="ts">`. Key patterns:

```vue
<script setup lang="ts">
import { ref } from 'vue'

// Use ref() without redundant type annotations when the type is inferred
const data = ref('')
const count = ref(0)

// Use function declarations for top-level functions
async function handleSubmit() {
  // ...
}

// Use shorthand slot syntax
</script>

<template>
  <SomeComponent>
    <template #content>  <!-- not v-slot:content -->
      <!-- ... -->
    </template>
  </SomeComponent>
</template>
```

### Strict Equality

Always use `===` and `!==`, never `==` or `!=`.

### No Console Logging

Remove all `console.log` statements before submitting. Use error handling with `errorMsg` refs for user-facing messages.

## Linting & Formatting

The project uses ESLint 9 (flat config) and Prettier. **CI runs `npm run lf:ci`** (check only) plus `npm run type-check`. For the full finish checklist, see `.cursor/rules/quality.mdc` in the repo — do not duplicate command lists here.

The ESLint config (`eslint.config.ts`) includes:
- Vue essential rules
- TypeScript recommended rules
- Import sorting (`eslint-plugin-simple-import-sort`)
- Vitest rules for test files
- Cypress rules for E2E files
- Custom `sorted-enum-members` rule for `TAGS.ts` (enforces alphabetical enum ordering)

## Testing

Exploration and component tests use [Vitest](https://vitest.dev/) with [Vue Test Utils](https://test-utils.vuejs.org/). Co-locate `tests.spec.ts` in exploration folders or use `__tests__/` next to shared components.

E2E smoke tests use [Cypress](https://www.cypress.io/) in `cypress/e2e/` for critical navigation only.

**What to test where** — see `.cursor/rules/testing.mdc` in the repo for scope and finish gates. Typical split:

| Test type | Tool | What to test |
|-----------|------|-------------|
| Unit | Vitest | Component rendering, config/examples, domain helpers |
| E2E | Cypress | Page loading, navigation flows, critical user journeys |

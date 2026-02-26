# Library Forks

::: warning Under Active Development
Both the Feel Your Protocol project and this documentation are in an early stage and under active development. Things may change frequently.
:::

## Why Forks?

Feel Your Protocol runs real Ethereum library code in the browser. Some exploration widgets need a modified version of an existing library — for example, a version with a new precompile implementation, or experimental gas calculation changes that haven't been released yet.

Rather than waiting for upstream releases, we maintain targeted forks that are used by specific exploration pages.

## How Forks Work

### npm Package Aliases

Multiple versions of the same library coexist in `package.json` using npm aliases:

```json
{
  "dependencies": {
    "@ethereumjs/evm": "^10.1.1-nightly.1",
    "@ethereumjs/evm-experimental": "npm:@ethereumjs/evm@^11.0.0-fork.1"
  }
}
```

Each alias is a fully independent install. In code, you import the specific version you need:

```typescript
import { EVM } from '@ethereumjs/evm'                    // standard
import { EVM as EVMExp } from '@ethereumjs/evm-experimental'  // fork
```

### Monorepo Libraries

For libraries from monorepos (like EthereumJS), where the target package has several intra-monorepo dependencies, we use **pre-bundled ESM builds**. The fork is bundled on the monorepo side with all internal dependencies resolved, producing a single ESM file with no internal wiring issues.

### Per-Route Isolation

Each fork is only imported in its specific exploration's `MyC.vue`. Thanks to Vite's code splitting, the fork's code is only loaded when the user visits that exploration's page. Other pages are unaffected.

## Adding a New Fork

1. Fork the upstream library (or create a branch if you have access)
2. Make your changes
3. For single-package repos: add an npm alias pointing to your fork's git URL
4. For monorepo packages: create a bundled build, then reference it
5. Import the fork only in your exploration's `MyC.vue` file — never in shared code
6. Document the fork in this page

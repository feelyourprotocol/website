# Third-Party Libraries

Feel Your Protocol runs real Ethereum library code in the browser. Most explorations need protocol-level functionality — EVM execution, cryptographic primitives, transaction encoding — that comes from third-party libraries. This page explains how to use them, from the simplest case to deep customizations.

::: tip Open an issue first
If your exploration needs a library that isn't already in `package.json`, or requires a custom fork, **open a GitHub issue before you start coding**. This lets us settle the library situation up front and avoids frustration later. The issue templates will guide you through the relevant questions.
:::

## 1. Use an Existing Dependency

The simplest path. Check `package.json` — if the library you need is already there, just import it in your `MyC.vue`:

```typescript
import { EVM } from '@ethereumjs/evm'
```

Thanks to Vite's code splitting, each exploration's imports are loaded on demand. Only the libraries needed for the page the user visits are downloaded.

**Key rule:** Only import libraries in your exploration's `MyC.vue` (or files within your exploration folder) — never in shared code or E-Components.

## 2. Request a New Dependency

If a well-maintained, popular library exists for what you need but isn't in `package.json` yet, you can request its addition:

1. **Open a GitHub issue** describing the library, why you need it, and which exploration will use it
2. Ideally, submit the dependency addition as a **separate PR** first, so we can review and merge it independently
3. Once merged, import it in your exploration

We keep the dependency list lean — the library should be actively maintained, reasonably sized, and needed by at least one exploration.

## 3. Extend Within Your Exploration

If the library is already available but you need slightly different behavior — a custom precompile, an adjusted gas calculation, a patched encoding — try to make the customization **within your exploration folder** first. This avoids forking entirely.

Common techniques:

- **Subclassing** — extend a library class and override specific methods
- **Composition** — wrap library functions with your custom logic
- **Built-in extension APIs** — some libraries provide dedicated customization hooks. For example, the EthereumJS EVM has a [custom precompile API](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#custom-precompiles) that lets you register precompiles without modifying the library itself

Place custom code in your exploration's folder (e.g. a `custom/` subfolder) so it stays isolated.

## 4. Use a Managed Fork (Special Libraries)

For protocol-core libraries where deep modifications are common, Feel Your Protocol maintains **dedicated forks** under the `feelyourprotocol` GitHub organization. These forks allow multiple explorations to carry independent, branch-isolated customizations in a controlled way.

### Currently Managed Forks

| Library | Fork URL | Upstream |
|---------|----------|----------|
| **EthereumJS** | [feelyourprotocol/ethereumjs-monorepo](https://github.com/feelyourprotocol/ethereumjs-monorepo) | [ethereumjs/ethereumjs-monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) |

Want to propose adding another library as a managed fork? Open an issue. Capacity to maintain forks is limited, so this is reserved for libraries with frequent deep-customization needs.

### Fork Workflow

If your exploration needs a modification to one of the managed fork libraries:

1. **Fork the original upstream library** to your own GitHub account
2. **Create a branch** and implement your changes there
3. **Request a named target branch** on the FYP fork — ask a maintainer (via your issue) to create a branch like `my-custom-exploration` on the managed fork
4. **Open a PR** from your branch towards that named target branch on the FYP fork
5. Your branch is reviewed, merged into the FYP fork, and **kept as a separate branch** — it won't be merged into `master`
6. **A release is built** from that branch and integrated into the site's `package.json` using an [npm alias](#npm-package-aliases)

::: warning Security policy
For security reasons, code is never integrated directly from a contributor's personal fork or branch into the site. All library code flows through the managed FYP fork, where it can be reviewed and maintained.
:::

### npm Package Aliases

Multiple versions or forks of the same library coexist in `package.json` using npm aliases:

```json
{
  "dependencies": {
    "@ethereumjs/evm": "^10.1.2",
    "@ethereumjs/evm-experimental": "npm:@ethereumjs/evm@^11.0.0-fork.1"
  }
}
```

Each alias is a fully independent install. In your exploration, import the specific version you need:

```typescript
import { EVM } from '@ethereumjs/evm'
import { EVM as EVMExp } from '@ethereumjs/evm-experimental'
```

### Monorepo Libraries

For libraries from monorepos (like EthereumJS), where the target package has several intra-monorepo dependencies, use **pre-bundled ESM builds**. The fork is bundled on the monorepo side with all internal dependencies resolved, producing a single ESM file with no wiring issues.

### Per-Route Isolation

Each fork is only imported in its specific exploration's `MyC.vue`. Thanks to Vite's code splitting, the fork's code is only loaded when the user visits that page. Other explorations are unaffected.

## Decision Flowchart

Not sure which approach to take? Walk through this:

1. **Is the library already in `package.json`?** → Use it directly ([Level 1](#_1-use-an-existing-dependency))
2. **Is it a well-known library you can use unmodified?** → Request addition ([Level 2](#_2-request-a-new-dependency))
3. **Can you customize via subclassing or built-in APIs?** → Extend in-place ([Level 3](#_3-extend-within-your-exploration))
4. **Do you need deep library modifications?** → Use the managed fork workflow ([Level 4](#_4-use-a-managed-fork-special-libraries))

When in doubt, **open an issue and ask**. Library integration is often a case-by-case decision that benefits from a quick conversation before you invest implementation time.

# Maintained Library Forks

Feel Your Protocol maintains **dedicated library forks** for protocol-core libraries where deep modifications are common. These forks live under the [feelyourprotocol](https://github.com/feelyourprotocol) GitHub organization and allow multiple explorations to carry independent, branch-isolated customizations in a controlled way.

::: tip When do you need a fork?
Most explorations can use the standard published packages or extend them via subclassing / built-in APIs (see [Third-Party Libraries](/contributing/third-party-libraries)). Forks are reserved for cases where an exploration needs **deep modifications** to a library's internals — for example, adding a new transaction type, modifying EVM execution logic, or implementing a draft EIP end-to-end.
:::

## Fork Workflow

If your exploration needs a modification to one of the managed fork libraries:

1. **Fork the original upstream library** to your own GitHub account
2. **Create a branch** and implement your changes there
3. **Request a named target branch** on the FYP fork — ask a maintainer (via your issue) to create a branch like `eip-XXXX-feature-name` on the managed fork
4. **Open a PR** from your branch towards that named target branch on the FYP fork
5. Your branch is reviewed, merged into the FYP fork, and **kept as a separate branch** — it won't be merged into `master`
6. **A release is built** from that branch and published under the `@feelyourprotocol` npm scope

::: warning Security policy
For security reasons, code is never integrated directly from a contributor's personal fork or branch into the site. All library code flows through the managed FYP fork, where it can be reviewed and maintained.
:::

### Branch Maintenance

Fork branches are regularly **rebased** onto the latest upstream `master` to stay current with upstream bug fixes, new features, and releases. This keeps the diff between the branch and upstream small and well-defined: only the exploration-specific changes sit on top.

## Versioning

All fork releases are published under the **`@feelyourprotocol`** npm scope. The version scheme encodes which feature the release belongs to:

```
@feelyourprotocol/<package>@<eipNumber>.<iteration>.<patch>
```

| Segment | Meaning | Example |
|---------|---------|---------|
| `<package>` | Original package name (without scope) | `evm`, `tx`, `common` |
| `<eipNumber>` | The EIP or feature number the fork implements | `8141` |
| `<iteration>` | Incremented for significant rework or rebase | `0`, `1`, `2` |
| `<patch>` | Bug fixes within the same iteration | `0`, `1` |

**Example:** `@feelyourprotocol/evm@8141.0.0` is the first release of the EVM package from the EIP-8141 fork branch.

For monorepo libraries (like EthereumJS), **all packages are published together** in a single release round with matching versions. This ensures inter-package compatibility — `@feelyourprotocol/evm@8141.0.0` is guaranteed to work with `@feelyourprotocol/common@8141.0.0`.

### Installing Fork Packages

In `package.json`, use npm aliases so that fork packages and official packages coexist without conflict:

```json
{
  "dependencies": {
    "@ethereumjs/evm": "^10.1.1",
    "@fyp-8141/evm": "npm:@feelyourprotocol/evm@8141.0.0",
    "@fyp-8141/common": "npm:@feelyourprotocol/common@8141.0.0",
    "@fyp-8141/tx": "npm:@feelyourprotocol/tx@8141.0.0",
    "@fyp-8141/vm": "npm:@feelyourprotocol/vm@8141.0.0"
  }
}
```

In your code, import from the alias:

```typescript
// Standard EthereumJS (used by other explorations)
import { createEVM } from '@ethereumjs/evm'

// Fork with EIP-8141 support (used by the frame tx exploration)
import { createVM } from '@fyp-8141/vm'
import { createFrameEIP8141Tx } from '@fyp-8141/tx'
```

Thanks to Vite's code splitting, each exploration's fork imports are loaded on demand — other explorations are unaffected.

---

## EthereumJS

| | |
|---|---|
| **Fork** | [feelyourprotocol/ethereumjs-monorepo](https://github.com/feelyourprotocol/ethereumjs-monorepo) |
| **Upstream** | [ethereumjs/ethereumjs-monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) |
| **npm scope** | `@feelyourprotocol` |
| **Packages** | `binarytree`, `block`, `blockchain`, `common`, `evm`, `genesis`, `mpt`, `rlp`, `statemanager`, `tx`, `util`, `vm` |

The EthereumJS monorepo provides the EVM, transaction, state, and block libraries that power most protocol-level explorations on Feel Your Protocol. Fork releases are built using the monorepo's own [release script](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/DEVELOPER.md#fork-releases-feel-your-protocol) with the `--scope=feelyourprotocol` flag.

### EIP-8141 — Frame Transactions

| | |
|---|---|
| **Branch** | [`eip-8141-frame-transactions`](https://github.com/feelyourprotocol/ethereumjs-monorepo/tree/eip-8141-frame-transactions) |
| **npm version** | `8141.x.x` |
| **Modified packages** | `common`, `evm`, `tx`, `vm` (+ transitive: `statemanager`, `block`) |
| **EIP spec** | [EIP-8141](https://eips.ethereum.org/EIPS/eip-8141) |
| **Status** | Prototype — vertically complete for simple transactions |

[EIP-8141](https://eips.ethereum.org/EIPS/eip-8141) introduces **Frame Transactions**, a new transaction type (`0x06`) that decouples validation and gas payment from ECDSA signatures. Each transaction consists of one or more "frames" that can carry arbitrary verification logic — enabling post-quantum secure authentication, native account abstraction, and user-defined fee payment schemes at the protocol level.

The fork implements:

- **New transaction type** (`FrameEIP8141Tx`) in the `tx` package with full RLP encoding/decoding
- **Frame execution logic** in the `vm` package (`runFrameTx`) processing VERIFY, SENDER, and PAYMASTER frames
- **New EVM opcodes** (`APPROVE`, `FRAMEDATALOAD`, `TXPARAM`) in the `evm` package
- **EIP activation** wiring in the `common` package

#### Install

```sh
npm install @feelyourprotocol/common@8141.0.0 @feelyourprotocol/evm@8141.0.0 \
            @feelyourprotocol/tx@8141.0.0 @feelyourprotocol/vm@8141.0.0
```

Or with aliases for coexistence with official packages:

```json
{
  "@fyp-8141/common": "npm:@feelyourprotocol/common@8141.0.0",
  "@fyp-8141/evm": "npm:@feelyourprotocol/evm@8141.0.0",
  "@fyp-8141/tx": "npm:@feelyourprotocol/tx@8141.0.0",
  "@fyp-8141/vm": "npm:@feelyourprotocol/vm@8141.0.0"
}
```

#### Quick Example

```typescript
import { Common, Hardfork, Mainnet } from '@feelyourprotocol/common'
import { createFrameEIP8141Tx } from '@feelyourprotocol/tx'
import { Account, Address, hexToBytes } from '@feelyourprotocol/util'
import { createVM, runTx } from '@feelyourprotocol/vm'

// Enable EIP-8141
const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague, eips: [8141] })
const vm = await createVM({ common })

// Fund a sender
const sender = new Address(hexToBytes('0x' + 'aa'.repeat(20)))
await vm.stateManager.putAccount(sender, new Account(0n, 10000000000000000n))

// Create a frame transaction with VERIFY + SENDER frames
const tx = createFrameEIP8141Tx({
  chainId: 1n,
  nonce: 0n,
  sender: sender.toString(),
  maxFeePerGas: 100n,
  maxPriorityFeePerGas: 1n,
  maxFeePerBlobGas: 0n,
  frames: [
    [new Uint8Array([1]), new Uint8Array(0), /* gasLimit */ ..., verifyData],
    [new Uint8Array([2]), new Uint8Array(0), /* gasLimit */ ..., senderData],
  ],
}, { common })

// Execute
const result = await runTx(vm, { tx })
console.log(`Gas spent: ${result.totalGasSpent}`)
```

For complete working examples, see the [`packages/vm/examples/eip8141-frame-txs/`](https://github.com/feelyourprotocol/ethereumjs-monorepo/tree/eip-8141-frame-transactions/packages/vm/examples/eip8141-frame-txs) directory in the fork.

#### Local Development (FYP_LOCAL Mode)

During active development on the EIP-8141 implementation, you can skip the npm publish cycle entirely and bind the website directly to the monorepo fork's TypeScript source. Vite compiles the source on the fly — edits to the monorepo are picked up instantly by the dev server and test runner.

**Enable:**

```sh
echo "VITE_FYP_LOCAL=true" > .env.local
```

**Disable:**

```sh
rm .env.local
```

When active, all `@fyp-8141/*` imports and their internal `@feelyourprotocol/*` cross-package imports are resolved via Vite aliases to the monorepo source at `../../ethereumjs-monorepo-fyp/packages/<pkg>/src`. This covers the full transitive dependency chain: `common`, `rlp`, `tx`, `util`, `vm`, `evm`, `block`, `statemanager`, `mpt`, and `binarytree`.

The configuration lives in `vite.config.ts` and is inherited by Vitest automatically. The `.env.local` file is gitignored (`*.local`), so this stays a local-only setting.

::: warning Monorepo layout assumption
FYP_LOCAL mode assumes the monorepo fork is checked out at `../../ethereumjs-monorepo-fyp` relative to the website directory (i.e. both repos live under the same parent). If your checkout is elsewhere, adjust the path in the `getFypLocalAliases()` function in `vite.config.ts`.
:::

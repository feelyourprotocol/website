# Ice Cream Stand — Smart Contract

Soulbound ERC-1155 receipts for **Feel Your Protocol Ice Cream Week** on Base.

Pay **10 FYP** → mint one receipt per flavor per wallet (Option A: up to 8 flavors).

## Deployed on Base mainnet

| Field | Value |
| ----- | ----- |
| **IceCreamStand** | [`0xac39d6219C5e45Ba37C64F1604919ff80040eF7e`](https://basescan.org/address/0xac39d6219C5e45Ba37C64F1604919ff80040eF7e) |
| Deploy tx | [`0xa537550cb1a54230c652c34838e60dcdd45249d973c9fa22fe5759bca0e42e86`](https://basescan.org/tx/0xa537550cb1a54230c652c34838e60dcdd45249d973c9fa22fe5759bca0e42e86) |
| Block | `47812253` |
| Chain | Base (`8453`) |
| Owner + scoop revenue | `0x4AEef6965A4cBcddb2e96555dCD0cB1afA7Bd202` |

Canonical mirrors: `src/ice-cream/constants.ts`, `website-docs/special-actions/ice-cream-week.md`.

## What lives here

| Path | Purpose |
| ---- | ------- |
| `src/IceCreamStand.sol` | Main contract |
| `test/IceCreamStand.t.sol` | Unit tests |
| `test/mocks/MockFYP.sol` | Fake FYP token for tests only |
| `lib/` | Dependencies (OpenZeppelin, forge-std) |

## 1. Install Foundry (once per machine)

Foundry is the Solidity toolkit: compiler, test runner, deploy scripts.

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Verify:

```bash
forge --version
```

Docs: [https://book.getfoundry.sh/getting-started/installation](https://book.getfoundry.sh/getting-started/installation)

## 2. Dependencies

This repo already vendors libraries under `lib/`:

- **forge-std** — test helpers (`Test`, `vm`, assertions)
- **OpenZeppelin Contracts v5.3.0** — audited ERC-1155 / ERC-20 / Ownable

If `lib/` is missing (fresh clone without submodules), from this directory:

```bash
cd contracts/ice-cream-stand
forge install foundry-rs/forge-std
forge install OpenZeppelin/openzeppelin-contracts@v5.3.0
```

## 3. Run tests

```bash
cd contracts/ice-cream-stand
forge test -vv
```

Expected: all tests green. `-vv` prints revert reasons on failure.

Single test:

```bash
forge test --match-test test_buyScoop_mintsAndPaysTreasury -vvv
```

## 4. Contract behaviour (short)

- **`buyScoop(tokenId)`** — pulls 10 FYP to the FYP Special Actions wallet, mints 1× ERC-1155
- **Mint limit** — one receipt per `(wallet, tokenId)`; all 8 flavors allowed
- **Soulbound** — transfers between wallets revert; mint still works
- **`uri(tokenId)`** — `https://feelyourprotocol.org/ice-cream/metadata/{id}.json`
- **Owner** — can update metadata base URL only; no free mint

Allowed token IDs (match `src/ice-cream/memes.ts`): `2, 3, 9, 10, 13, 14, 16, 18`.

Production constants (Base mainnet):

| | Address |
| --- | --- |
| **IceCreamStand** (deployed) | [`0xac39d6219C5e45Ba37C64F1604919ff80040eF7e`](https://basescan.org/address/0xac39d6219C5e45Ba37C64F1604919ff80040eF7e) |
| FYP | `0x8eae800ff67778057941792acdbab29904962ba3` |
| FYP Special Actions (scoop revenue) | `0x4AEef6965A4cBcddb2e96555dCD0cB1afA7Bd202` |

Canonical config: `src/IceCreamStandConfig.sol` (Solidity deploy defaults) and `src/ice-cream/constants.ts` (frontend).

## 5. Deploy (Base mainnet)

### Before you broadcast

1. **`forge test -vv`** — all green
2. **Metadata live** — contract points to `https://feelyourprotocol.org/ice-cream/metadata/{id}.json`; wallets need these URLs reachable (deploy website assets first, or MetaMask shows a blank NFT)
3. **Deploy wallet** — FYP Special Actions `0x4AEef6965A4cBcddb2e96555dCD0cB1afA7Bd202` (also becomes contract **owner**); needs Base ETH for gas (~0.001–0.01 ETH)
4. **`.env`** — copy from `.env.example`, set `BASE_RPC_URL` + `ETHERSCAN_API_KEY` (from [etherscan.io/myapikey](https://etherscan.io/myapikey), not basescan.org)

### Simulate (no tx, no gas)

```bash
cd contracts/ice-cream-stand
source .env   # or: export $(grep -v '^#' .env | xargs)
forge script script/DeployIceCreamStand.s.sol:DeployIceCreamStand --rpc-url base
```

Check the logged **contract address** in the output.

### Broadcast + verify

Replace the key flag with `--ledger` or `--account deployer` if you prefer not to use a raw private key.

```bash
forge script script/DeployIceCreamStand.s.sol:DeployIceCreamStand \
  --rpc-url base \
  --broadcast \
  --verify \
  --slow \
  -vvvv
```

With the Special Actions wallet private key in `.env`:

```bash
forge script script/DeployIceCreamStand.s.sol:DeployIceCreamStand \
  --rpc-url base \
  --broadcast \
  --verify \
  --private-key "$SPECIAL_ACTIONS_PRIVATE_KEY" \
  -vvvv
```

Foundry loads `.env` from the project root automatically.

### After deploy — save these

| Field | Value |
| ----- | ----- |
| Contract address | `0xac39d6219C5e45Ba37C64F1604919ff80040eF7e` |
| Deploy tx | `0xa537550cb1a54230c652c34838e60dcdd45249d973c9fa22fe5759bca0e42e86` |
| Owner + revenue | `0x4AEef6965A4cBcddb2e96555dCD0cB1afA7Bd202` (deployer = owner; same address receives FYP) |
| Chain | Base (8453) |

Sanity check on Basescan:

- `fypSpecialActionsWallet()` → Special Actions address
- `uri(3)` → `…/metadata/3.json`
- `allowedToken(3)` → `true`

### Optional smoke test (manual)

Wallet with ≥10 FYP on Base:

1. `approve(iceCreamStand, 10e18)` on FYP token
2. `buyScoop(3)` on IceCreamStand
3. Confirm NFT in wallet + 10 FYP on Special Actions wallet

### Verify failed? (Etherscan API V2)

Basescan’s old `api.basescan.org` URL is **V1 (deprecated)**. Use one key from **[etherscan.io/myapikey](https://etherscan.io/myapikey)** and `ETHERSCAN_API_KEY` in `.env`. Foundry 1.2+ uses Etherscan API V2 by default — no extra config key needed.

If **deploy succeeded** but verify failed, verify the existing contract:

```bash
set -a && source .env && set +a

forge verify-contract 0xac39d6219C5e45Ba37C64F1604919ff80040eF7e \
  src/IceCreamStand.sol:IceCreamStand \
  --chain base \
  --watch
```

Or re-run the deploy script with `--verify` only if deploy did **not** broadcast yet.

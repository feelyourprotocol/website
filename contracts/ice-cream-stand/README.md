# Ice Cream Stand — Smart Contract

Soulbound ERC-1155 receipts for **Feel Your Protocol Ice Cream Week** on Base.

Pay **10 FYP** → mint one receipt per flavor per wallet (Option A: up to 8 flavors).

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
| FYP | `0x8eae800ff67778057941792acdbab29904962ba3` |
| FYP Special Actions (scoop revenue) | `0x4AEef6965A4cBcddb2e96555dCD0cB1afA7Bd202` |

Canonical config: `src/IceCreamStandConfig.sol` (Solidity) and `src/ice-cream/constants.ts` (frontend).

## 5. Deploy (Base mainnet)

```bash
forge script script/DeployIceCreamStand.s.sol --rpc-url base --broadcast --verify
```

Set `BASE_RPC_URL` / `--private-key` or `--ledger` as usual. Owner = deployer wallet; scoop revenue → FYP Special Actions wallet above.

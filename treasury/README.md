# FYP Treasury

Transparent accounting for creator fees from the [FYP community token](https://community-token.feelyourprotocol.org/) — what flows into the treasury wallet, what is taken out, and what justifies each withdrawal.

**Treasury wallet (on-chain):** [feelyourprotocol.eth on Base](https://basescan.org/address/0x15952A6B59F8BaDBD3551F896377EEcF461E79F8#asset-multichain) (`0x15952A6B59F8BaDBD3551F896377EEcF461E79F8`)

**Human readers:** start with the year ledgers (`claims.md`, `withdrawals.md`), then drill into the current month folder for detail.

**Automated analysis:** each file has YAML frontmatter with totals; tables use fixed column headers. Recompute frontmatter from table rows when updating.

## Reconciliation

```
treasury balance ≈ Σ claims − Σ withdrawals (completed only)
```

Pending withdrawal rows are planned take-outs — they reduce the *available* balance in planning but are not counted in `total_withdrawn_eur` until completed (with a Tx).

Small on-chain costs (gas, minor conversions) are not itemized — expect a modest, natural gap vs. wallet balance.

## Layout

```
treasury/
  README.md                 ← you are here
  YYYY/
    claims.md               IN  — fee claims to treasury (year ledger)
    withdrawals.md          OUT — monthly take-outs to developer (year ledger)
    MM/
      fyp.md                FYP work hours (month)
      ethereumjs.md         EthereumJS work hours (month)
      expenses.md           Expenses (month)
```

## Year ledgers

### `claims.md` — money in

Creator fees claimed from the token into the treasury wallet.

| Date | Amount (€) | Asset | Tx | Note |

- **Date:** ISO `YYYY-MM-DD`
- **Amount (€):** EUR equivalent at claim time (for stablecoins like EURC, amount ≈ face value)
- **Asset:** e.g. EURC, ETH, USDC
- **Tx:** markdown link to [BaseScan](https://basescan.org) tx — required for each claim

Frontmatter: `total_claimed_eur`

### `withdrawals.md` — money out

Monthly take-outs from treasury to the developer. Each row should be backed by the month's `fyp.md`, `ethereumjs.md`, and `expenses.md` totals — except the initial catch-up row, which covers pre-tracking work and expenses in one lump sum.

| Date | Work (€) | Expenses (€) | Total (€) | Period | Status | Tx | Note |

- **Work (€):** `fyp.total_eur + ethereumjs.total_eur` for that period
- **Expenses (€):** `expenses.total_eur` for that period
- **Period:** `YYYY-MM` or `pre-log` for the initial catch-up
- **Status:** `pending` (planned) or `completed` (on-chain take-out; add Tx when done)

Frontmatter: `total_withdrawn_eur` — sum of **completed** rows only

## Month detail

### `fyp.md` / `ethereumjs.md`

| Date | CW | Hours | Task |

- **Date:** ISO `YYYY-MM-DD`
- **CW:** ISO calendar week (Monday–Sunday) for that date, e.g. `24` for CW 24
- **Hourly rate:** 50 €/hour (see [community-token fund page](https://community-token.feelyourprotocol.org/#fund))
- Frontmatter: `month`, `hourly_rate_eur`, `total_hours`, `total_eur`

### `expenses.md`

| Date | CW | Category | Amount (€) | Description |

- **Date:** ISO `YYYY-MM-DD`
- **CW:** ISO calendar week for that date
- **Category:** e.g. `LLM`, `Infrastructure`, `Conference`
- Frontmatter: `month`, `total_eur`

## Monthly workflow

1. **Throughout the month** — add rows to `fyp.md`, `ethereumjs.md`, `expenses.md` as work happens.
2. **When claiming fees** — add a row to `claims.md`.
3. **End of month** — recompute month frontmatter totals; add a `withdrawals.md` row where `Work + Expenses = Total`.
4. **Optionally** — run reports/charts (1–2× per month) from ledgers + month files.

## Tax & reporting notes

- **Claims** ≈ gross fee income into treasury.
- **Withdrawals → Work** ≈ compensated development time (hourly).
- **Withdrawals → Expenses** ≈ reimbursed project costs.
- This is operational tracking, not tax advice — use exports for your tax agent.

## Current year

- [2026 claims](2026/claims.md)
- [2026 withdrawals](2026/withdrawals.md)
- [2026-06 detail](2026/06/)

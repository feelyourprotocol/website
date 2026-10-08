---
name: unicorn-merge
description: >-
  Unicorn merge 🦄 only — when the human explicitly asks for that phrase (with
  or without the emoji). Ship session FYP branches to merged PRs, clean default
  branches, and fresh working branches. Not exploration round-trip close.
---

# Unicorn merge 🦄

**Trigger:** the human says **Unicorn merge** or **Unicorn merge 🦄** (or clearly names this skill). Do **not** run from vague “merge my PRs”, “ship it”, or “round-trip close” — those are different workflows ([round-trip-close](../round-trip-close/SKILL.md) is EIP phase 6 only).

**Goal:** move from open feature branches on the FYP repos involved in **this session** to merged PRs, updated `main`, deleted feature branches, and new local working branches.

**Repos:** `website`, `mcp-execution-engine`, `mcp-gateway` — only siblings the human named or that hold unpushed/ahead work on the **same coordinated effort** this session. Skip clean unrelated checkouts. `server-config` only when this session touched it.

**Git mechanics:** [git.mdc](../../rules/git.mdc) — `working_directory`, `required_permissions: ["all"]`, **one signed op at a time**, commit messages, [pre-push CI](#before-a-push) (in git.mdc), PR title/body rules. Multi-repo push/PR order when all three move: **engine → gateway → website**.

Human may stop after any step; report status and what is left.

---

## 1 — Commit if needed

Per in-scope repo: `git status`. If dirty or untracked work belongs to this effort, commit (human already asked via Unicorn merge). One-line subject, no body. If nothing to commit, note clean.

Do **not** start Unicorn merge without the explicit trigger, even if trees are dirty.

---

## 2 — Push

Per in-scope repo, in turn (engine → gateway → website when all three):

1. Run that repo’s pre-push CI from git.mdc; fix red, commit fixes, re-run.
2. `git push` (set upstream if needed) → wait success.

---

## 3 — Open PRs

Per repo, after that repo’s push, one at a time: `gh pr view <branch>`.

- **PR exists:** refresh title/body if branch essence changed (git.mdc § Pull requests).
- **No PR:** `gh pr create` with Related links to sibling PRs when coordinated.

Report each PR URL.

---

## 4 — Wait for green CI

Per repo with a PR: `gh pr checks` (and `gh pr view` for state).

| Result | Action |
| --- | --- |
| Pending / queued / in progress | **Stop here.** Report “waiting on CI” with PR links. Human re-invokes Unicorn merge 🦄 when checks finish. |
| Failed / cancelled | Report job + short cause. Ask fix vs retry. Do not merge. |
| Success / skipped / neutral (all required) | Repo is green. |

Proceed to §5 only when **every** in-scope PR is green. Trees should match remote (not ahead/behind); if not, say so before merge.

---

## 5 — Merge PRs and delete remote feature branches

Only when §4 is fully green for all in-scope PRs.

Per repo, in turn: `gh pr merge <number> --delete-branch` (add `--merge` if `gh` requires a merge method). On failure, **stop** — do not merge the rest until resolved.

---

## 6 — Update local default and delete local feature branches

After **all** merges in §5 succeeded, per repo in turn:

1. `git fetch origin`
2. Checkout default (`main` / `origin/HEAD`)
3. `git pull --ff-only origin <default>`
4. `git branch -d <old-feature-branch>` (safe delete only — not `-D` unless human asks)

Report default @ short SHA; local feature branch gone.

---

## 7 — New working branches

Per in-scope repo, in turn (after §6 for that repo):

`git checkout -b <name>` where `<name>` is the branch name the human gave, or **`new-work`** if they did not name one.

If the human wanted **one shared name** across repos, use the same name on each. If names differ per repo, they will say so.

**Stop** with a short summary: merged PR URLs, default SHAs, new branch names, optional deploy reminder (gateway/hosted MCP, website, metrics) when this session changed runtime surfaces.

---

## Distinction from round-trip close

| | Unicorn merge 🦄 | Round-trip close |
| --- | --- | --- |
| Trigger | Explicit “Unicorn merge” | Round-trip phase 6 GO |
| Branch names | Any session feature branch | `eip-NNNN` on three siblings |
| Extra | — | YouTube, announcement tweets |
| Scope | Session-coordinated FYP repos | Always website + engine + gateway for that EIP |

Reuse merge/checkout/delete **patterns** from round-trip-close §3; do not run round-trip-close marketing/YouTube unless the human also asked for phase 6.

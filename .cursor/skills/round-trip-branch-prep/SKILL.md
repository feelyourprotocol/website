---
name: round-trip-branch-prep
description: >-
  At round-trip exploration GO: stop if any sibling is dirty, refresh main,
  drop local branches already on origin/main, then create eip-NNNN on all
  three. Do not use outside round-trip phase 2. Do not use from add-exploration
  standalone.
---

# Round-trip branch prep

**Only** at the start of [round-trip](../round-trip-protocol-change/SKILL.md) **phase 2** (exploration GO), before [add-exploration](../add-exploration/SKILL.md). Not a general git habit. Standalone widget or engine work must not run this.

Target branch: the confirmed id (`eip-NNNN`). Default branch is `main` (or `master` if that is `origin/HEAD`). Git cwd rules: [git.mdc](../../rules/git.mdc).

Inspect the three siblings in parallel (`working_directory` + `required_permissions: ["all"]`). Mutating git (checkout, pull, delete, create) **one repo at a time**. Do **not** push. Do **not** `git branch -D`. Do **not** delete remote branches.

If any step fails, **STOP** the whole prep. Do not start add-exploration. Report what is still wrong. Do not create `eip-NNNN` on a subset.

## 1 — Dirty tree

If **any** of the three has a non-empty `git status --short`: do nothing else. List repo, branch, and dirty paths.

## 2–4 — Only when all three are clean

`git fetch origin` in each repo first.

**Already on target:** if all three are on `eip-NNNN` and clean, prep has succeeded. Do not switch to main or delete that branch. Say so and continue to add-exploration.

Otherwise, per repo:

2. **On the default branch:** `git pull --ff-only origin <default>`. If that is not a fast-forward, stop that repo and report.
3. **On another branch** (clean): the work is already on remote main only when `git merge-base --is-ancestor HEAD origin/<default>`. Then checkout the default branch, `git pull --ff-only origin <default>`, `git branch -d <old-branch>` (safe delete). If HEAD is **not** an ancestor of `origin/<default>`, leave the branch — this repo is not ready.
4. **Leftover local `eip-NNNN` while on the default branch:** if that ref exists and **is** an ancestor of `origin/<default>`, `git branch -d eip-NNNN`. If it has unique commits, stop and report. Do not overwrite it.

**Create only if all three are clean, on latest default, and have no leftover unique `eip-NNNN`:** `git checkout -b eip-NNNN` in each. Otherwise point out what is still wrong (which repo, which branch, why).

Squash-merged leftovers are often **not** ancestors of `origin/<default>`. Leave them; the human moves to main. That is intentional.

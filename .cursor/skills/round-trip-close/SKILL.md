---
name: round-trip-close
description: >-
  After round-trip comic and video: gate on green PR CI and clean trees,
  wrap-up report, merge the three eip-NNNN PRs on GO, then show the X
  announcement tweets. Do not use outside round-trip phase 6.
---

# Round-trip close

**Only** after [round-trip](../round-trip-protocol-change/SKILL.md) comic and video (or skip of those asks). Not a general git habit. Standalone widget / engine / comic / video work must not run this.

Target: the confirmed id (`eip-NNNN`). The three siblings: `website`, `mcp-execution-engine`, `mcp-gateway`. Git cwd rules: [git.mdc](../../rules/git.mdc).

Inspect in parallel (`working_directory` + `required_permissions: ["all"]`). Mutating git and `gh pr merge` **one repo at a time**. Do **not** push. Do **not** `git branch -D`. Do **not** merge or delete remotes before the merge GO.

This skill has **two human GOs** after the wrap report. Do not skip them. The agent never publishes to X.

## 1 — Gates (hard)

All three must pass. If any fail, **STOP**. Do not print the wrap report as if ready. Do not merge.

### CI

For each sibling, `gh pr view <eip-NNNN>` (branch as positional arg) + `gh pr checks`.

| Result | Action |
| --- | --- |
| No PR | Cannot proceed. Name the repo. Do not open a PR unless the human asked. |
| Any check pending / in progress / queued | Hard block. CI is not finished. Say so; the human re-runs close when it is. |
| Any check failed / cancelled / timed out | Unexpected. High-level cause only (failed job name + the first real error). Ask whether to fix. Do not start a fix in this turn. |
| All completed checks success, skipped, or neutral | That repo is green. |

Move on only when **every** repo that has a PR is green, and every sibling **has** a PR.

### Trees

For each sibling: on `eip-NNNN`, `git status --short` empty, and HEAD in sync with `@{u}` (not ahead, not behind). Fetch first if needed so the comparison is real.

Uncommitted or unpushed work: list repo, branch, paths / ahead-behind. Cannot proceed.

## 2 — Wrap report — then STOP for merge GO

Only after §1 is fully green and clean.

```markdown
## Phase 6 — Close (eip-NNNN)

### CI

| Repo | PR | Checks |
| --- | --- | --- |
| website | [#N](url) | green |
| mcp-execution-engine | [#N](url) | green |
| mcp-gateway | [#N](url) | green |

**Trees:** all three on `eip-NNNN`, clean, in sync with origin.

### What shipped

- **Brief** — <1–2 lines: core question + suitability>.
- **Exploration** — <1–2 lines>. [PR](url) · live path `https://feelyourprotocol.org/<path>` (after deploy) · `src/explorations/eip-NNNN/`
- **MCP** — <1–2 lines: runnable vs planned>. [engine PR](url) · [gateway PR](url) · mcp-docs `https://mcp-docs.feelyourprotocol.org/use/eips/eip-NNNN.html`
- **Comic** — <1–2 lines or skipped>. [strip](file://<abs png/jpg>) · `design/comics/eip-NNNN.yml`
- **Video** — <1–2 lines or skipped>. [Watch](file://<abs *-final.mp4>) · `video/projects/eip-NNNN/`
```

Links must be clickable (GitHub PR URLs, `file://` to local comic/video when those exist). Then **STOP**:

> Merge the three `eip-NNNN` PRs?

Do not show announcement tweets in this report.

## 3 — Merge GO

Only after an explicit yes on that ask.

Per repo, in turn: `gh pr merge <number> --delete-branch`. Pass `--merge` if `gh` requires a method (merge commit). If a merge fails, **STOP** — do not delete remotes or switch branches on the others.

After every merge succeeds: in each repo, `git fetch origin`, checkout the default branch (`main` / `origin/HEAD`), `git pull --ff-only origin <default>`, `git branch -d eip-NNNN` (safe delete). Do not `-D`. Do not delete a leftover that still has unique commits.

**Success report** (short): merged PR URLs, now on default @ short SHA, local `eip-NNNN` gone. Then **STOP**:

> Show the announcement tweets?

## 4 — Marketing GO

Only after an explicit yes on that ask. Read authored YAML; do not rewrite copy unless it is missing `intent` (then encode from `body` as in the comic/video skills). Generate nothing new.

Omit a slot if that phase was skipped or the files are missing.

```markdown
## Announcements (@FeelEthereum)

Comic first; video a few hours later (or the next day). Human posts from the X app. Attach media in the composer. Agent never publishes.

### Comic (spark)

**Image:** [eip-NNNN.png](file://<abs>) — attach this.

```
<tweet.body>
```

**Open in X:** <tweet.intent>

**Alt text** (image description — no intent param):

```
<tweet.alt>
```

### Video (engage)

**File:** [*-final.mp4](file://<abs>) — attach on T1.

**T1**

```
<t1.body>
```

**Open in X (T1):** <t1.intent>

**Video description** (X “Add description” — no intent param):

```
<t1.video_description>
```

**T2** (reply; omit when `shape: single`)

```
<t2.body>
```

**Open in X (T2):** <t2.intent> — after T1 is live, append `&in_reply_to=<id>` or reply in the app.
```

YouTube Shorts copy stays in the [video-short](../video-short/SKILL.md) report — not here.

Then **STOP**. Round-trip complete.

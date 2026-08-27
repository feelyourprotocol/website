# Building Overview

Feel Your Protocol is an open-source **explorations website**: each protocol change gets a self-contained folder with metadata and an interactive widget. This section documents how the site is extended — for humans and for coding agents.

**Agents:** start at [AGENTS.md](https://github.com/feelyourprotocol/website/blob/main/AGENTS.md), then the [add-exploration skill](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/add-exploration/SKILL.md). Canonical procedure: [Adding an Exploration](/contributing/adding-an-exploration).

## What you can build

| Work | Where to start |
| --- | --- |
| **New exploration** | [Adding an Exploration](/contributing/adding-an-exploration) |
| **Improve an existing one** | Same folder under `src/explorations/<id>/` — examples, copy, UI, tests |
| **New E-Component pattern** | [E-Components](/contributing/e-components) when a pattern repeats across explorations |
| **Docs** | `website-docs/` only (explorations site). Roadmap, MCP, and community token each have their own README |

When a change affects the **structural base** (E-Components, building workflow, architecture), bump the patch version in `package.json` and add an entry to [Changelog](/changelog). New explorations alone do not require a version bump.

## Local setup

```bash
git clone https://github.com/feelyourprotocol/website.git
cd website
npm install
npm run dev          # explorations dev server
npm run website-docs:dev   # preview these docs
```

## Quality gates

Before finishing code changes, run the checks CI uses:

```bash
npm run lf:ci        # format + lint (check only)
npm run type-check   # TypeScript
npx vitest run       # unit tests (or scoped to your exploration)
```

E2E smoke tests (`npm run test:e2e`) cover critical navigation. See `.cursor/rules/quality.mdc` and `testing.mdc` in the repo for the full finish checklist.

## What goes where

| What you are working on | Where it lives |
| --- | --- |
| A new exploration | `src/explorations/<id>/` |
| Exploration metadata | `src/explorations/<id>/info.ts` |
| Interactive widget | `src/explorations/<id>/MyC.vue` |
| Example presets | `src/explorations/<id>/examples.ts` |
| Exploration registry | `src/explorations/REGISTRY.ts` |
| E-Components | `src/eComponents/<name>EC/` |
| Shared UI components | `src/eComponents/ui/` |
| Unit tests | Co-located `tests.spec.ts` or `__tests__/` |
| E2E tests | `cypress/e2e/` |
| Website documentation | `website-docs/` (explorations site only) |

## Pull requests

PRs are welcome when someone asks to land work. Fork the repo, branch, pass quality gates, and describe what changed. For explorations that need **new runtime dependencies** or **managed-fork library work**, align with a maintainer first — see [Third-Party Libraries](/contributing/third-party-libraries).

## Further reading

- [Changelog](/changelog) — structural-base history (check after pulling `main`)
- [Adding an Exploration](/contributing/adding-an-exploration) — step-by-step checklist
- [Available E-Components](/contributing/available-e-components) — pick a building block first
- [Architecture](/guide/architecture) — taxonomies and content model
- [Code Conventions](/contributing/code-conventions) — naming and Vue patterns
- [Third-Party Libraries](/contributing/third-party-libraries) — deps and forks

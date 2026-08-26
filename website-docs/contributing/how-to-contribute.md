# How to Contribute

Feel Your Protocol is open source. The primary extension point is **adding or improving explorations** — interactive widgets that help people understand protocol changes. Most new work is expected to be **agent-assisted**; these docs (and [AI-Assisted Development](/contributing/ai-assisted-development)) are written so an LLM can follow them end-to-end with a short human review pass.

## Ways to Contribute

### Add a New Exploration

This is the most impactful contribution. Each exploration is a self-contained folder with metadata and an interactive widget. The [Adding an Exploration](/contributing/adding-an-exploration) guide walks you through it step by step.

### Improve an Existing Exploration

- Better examples and presets
- UI/UX improvements
- Bug fixes
- More informative intro and usage texts

### Build or Improve E-Components

[E-Components](/contributing/e-components) are reusable Ethereum-specific components (e.g. a precompile interface). If you spot a pattern shared across explorations, it might be a candidate for a new E-Component.

### Improve Documentation

Fix typos, add guides, clarify explanations. **Website** documentation lives in `website-docs/` only — do not add dev notes for roadmap, MCP docs, or community token here (each has its own README). Preview locally with:

```bash
npm run website-docs:dev
```

When a change affects the **structural base** (E-Components, contribution workflow, architecture), bump the patch version in `package.json` and add an entry to [Changelog](/changelog). New explorations alone do not require a version bump.

### Report Issues

Found a bug or have a suggestion? [Open an issue](https://github.com/feelyourprotocol/website/issues) on GitHub. Our issue templates will guide you through the relevant details.

::: tip Open an issue early
For new explorations, especially those that need library additions or custom forks, it's a good idea to **open an issue before you start coding**. This lets us align on taxonomy placement, library setup, and scope — and avoids surprises during review.
:::

## Development Workflow

### 1. Setup

```bash
git clone https://github.com/feelyourprotocol/website.git
cd website
npm install
```

### 2. Develop

```bash
npm run dev          # start dev server
```

### 3. Verify

Before submitting a PR, run all quality checks:

```bash
npm run lf           # format + lint (auto-fix)
npm run type-check   # TypeScript type checking
npx vitest run       # unit tests (single run)
npm run test:e2e     # E2E tests
```

### 4. Submit

- Fork the repository and create a feature branch
- Make your changes
- Ensure all checks pass
- Submit a pull request with a clear description of what you changed and why

## What Goes Where

| What you are working on | Where it lives                                      |
| ----------------------- | --------------------------------------------------- |
| A new exploration       | `src/explorations/<id>/`                            |
| Exploration metadata    | `src/explorations/<id>/info.ts`                     |
| Interactive widget      | `src/explorations/<id>/MyC.vue`                     |
| Example presets         | `src/explorations/<id>/examples.ts`                 |
| Exploration registry    | `src/explorations/REGISTRY.ts`                      |
| E-Components            | `src/eComponents/<name>EC/`                         |
| Shared UI components    | `src/eComponents/ui/`                               |
| Unit tests              | `src/views/__tests__/` (or co-located `__tests__/`) |
| E2E tests               | `cypress/e2e/`                                      |
| Website documentation   | `website-docs/` (explorations site only)            |

## Further Reading

- [Changelog](/changelog) — structural-base history (check after pulling `main`)
- [AI-Assisted Development](/contributing/ai-assisted-development) — best practices for building explorations with AI agents
- [Adding an Exploration](/contributing/adding-an-exploration) — step-by-step guide
- [Using E-Components](/contributing/e-components) — reusable Ethereum-specific components
- [Code Conventions](/contributing/code-conventions) — imports, naming, linting, testing
- [Third-Party Libraries](/contributing/third-party-libraries) — using, adding, and forking libraries

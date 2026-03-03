# How to Contribute

Contributions are what make Feel Your Protocol useful. Whether you are adding a brand-new exploration, polishing an existing one, or improving the shared components — every contribution helps the Ethereum community understand protocol changes better.

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

Fix typos, add guides, clarify explanations. Documentation lives in the `docs/` folder as standard markdown files. Preview locally with:

```bash
npm run docs:dev
```

### Report Issues

Found a bug or have a suggestion? [Open an issue](https://github.com/feelyourprotocol/website/issues) on GitHub.

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

| What you are working on | Where it lives |
|------------------------|----------------|
| A new exploration | `src/explorations/<id>/` |
| Exploration metadata | `src/explorations/<id>/info.ts` |
| Interactive widget | `src/explorations/<id>/MyC.vue` |
| Example presets | `src/explorations/<id>/examples.ts` |
| Exploration registry | `src/explorations/REGISTRY.ts` |
| E-Components | `src/eComponents/<name>EC/` |
| Shared UI components | `src/eComponents/ui/` |
| Unit tests | `src/views/__tests__/` (or co-located `__tests__/`) |
| E2E tests | `cypress/e2e/` |
| Documentation | `docs/` |

## Further Reading

- [Adding an Exploration](/contributing/adding-an-exploration) — step-by-step guide
- [Using E-Components](/contributing/e-components) — reusable Ethereum-specific components
- [Code Conventions](/contributing/code-conventions) — imports, naming, linting, testing
- [Library Forks](/contributing/library-forks) — when you need a custom library build

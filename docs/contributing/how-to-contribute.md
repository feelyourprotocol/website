# How to Contribute

::: warning 🚧 Under Active Development
Both the Feel Your Protocol project and this documentation are in an early stage and under active development. Things may change frequently.
:::

## Ways to Contribute

- **Add a new EIP widget** — the most impactful contribution
- **Improve an existing widget** — better examples, UI improvements, bug fixes
- **Improve documentation** — fix typos, add guides, clarify explanations
- **Report issues** — found a bug or have a suggestion? Open an issue

## Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests:

```bash
npm run lf          # format + lint
npm run test:unit   # unit tests
npm run test:e2e    # E2E tests
```

5. Submit a pull request

## Code Style

- **Formatting**: Prettier (auto-formatted with `npm run format`)
- **Linting**: ESLint (auto-fixed with `npm run lint`)
- **Run both**: `npm run lf`

## Documentation

This documentation is built with [VitePress](https://vitepress.dev/). Docs live in the `docs/` folder as standard markdown files.

To preview docs changes locally:

```bash
npm run docs:dev
```

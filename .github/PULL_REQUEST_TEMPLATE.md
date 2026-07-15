## What does this PR do?

<!-- Briefly describe the change and its motivation. -->

## Related issue

<!-- Link the GitHub issue this PR addresses: Fixes #… / Relates to #… -->

## Type of change

<!-- Check all that apply. -->

- [ ] New exploration
- [ ] Improvement to an existing exploration
- [ ] New or updated E-Component
- [ ] Library addition or fork
- [ ] Documentation
- [ ] Bug fix
- [ ] Other: <!-- describe -->

## Taxonomy (new explorations only)

<!-- Fill in if adding a new exploration. See https://website-docs.feelyourprotocol.org/guide/architecture.html -->

- **Topic:** <!-- e.g. Scaling -->
- **Timeline:** <!-- e.g. Fusaka -->
- **Tags:** <!-- e.g. EVM, Gas Costs -->

## Checklist

<!-- Tick off what applies. Not every item is required for every PR. -->

- [ ] I have read the [contributing guide](https://website-docs.feelyourprotocol.org/contributing/how-to-contribute.html)
- [ ] Linting and type checking pass (`npm run lf && npm run type-check`)
- [ ] Unit tests pass (`npx vitest run`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] Production build succeeds (`npm run build` — website + community-token + docs hub + website-docs)
- [ ] New exploration is registered in `REGISTRY.ts`
- [ ] Library needs were discussed in a separate issue (if applicable — see [Third-Party Libraries](https://website-docs.feelyourprotocol.org/contributing/third-party-libraries.html))

## Lightweight PRs (optional)

For docs-only, treasury/work-log, or other non-code PRs, add GitHub labels to skip CI:

| Label | Skips |
|-------|--------|
| `skip lint` | Formatting/lint workflow |
| `skip tests` | Unit tests + E2E tests |

Labels are defined in [`.github/labels.yml`](.github/labels.yml). Create them once under **Issues → Labels** if they do not exist yet.  
**Note:** Skips apply to PR runs only — `master` pushes and tags always run the full CI suite.  
Skipped jobs still report **success** (green) so they satisfy required branch protection checks.

## Screenshots / recordings

<!-- Optional — include before/after screenshots or a screen recording if relevant. -->

# Building Overview

Feel Your Protocol explorations are built **with an agent, reviewed by a human**. You decide *what* the widget should teach; the agent scaffolds code; you judge pedagogy, copy, and UX.

## Typical workflow

1. **Clone and run locally**

```bash
git clone https://github.com/feelyourprotocol/website.git
cd website
npm install
npm run dev
```

2. **Understand the model** — read [Architecture](/guide/architecture) (taxonomies, folder-per-exploration, E-Components).

3. **Brief your agent** — give the EIP/spec link, a one-sentence pedagogical goal (“let users compare gas before/after”), and constraints:
   - Pick topic/timeline/tags from the architecture tables (do not invent IDs)
   - Prefer an existing [E-Component](/contributing/available-e-components) over custom UI
   - Point the agent at [AGENTS.md](https://github.com/feelyourprotocol/website/blob/main/AGENTS.md) and the [add-exploration skill](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/add-exploration/SKILL.md)

4. **Review the result** — even when tests pass, check intro/usage text against the spec, example quality, and the browser UI. See [Adding an Exploration § Human review](/contributing/adding-an-exploration#human-review).

5. **Optional cover art** — [Images](/contributing/images) for rules; [cover-image skill](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/cover-image/SKILL.md) for AI generation.

## What you are building

| Piece | Role |
| --- | --- |
| **Exploration** | One folder = one interactive widget for a protocol change |
| **E-Component** | Reusable Ethereum pattern (precompile UI, bytecode stepper, …) |
| **Taxonomies** | Topic (theme), timeline (maturity/fork), tags (technical concepts) |

Details: [Adding an Exploration](/contributing/adding-an-exploration), [E-Components](/contributing/e-components).

## File map

| What | Where |
| --- | --- |
| New exploration | `src/explorations/<id>/` |
| Metadata | `info.ts` |
| Widget | `MyC.vue` |
| Registry (required) | `src/explorations/REGISTRY.ts` |
| E-Components | `src/eComponents/<name>EC/` |
| Shared UI | `src/eComponents/ui/` |
| Tests | `tests.spec.ts` in the exploration folder |

## Quality gates

Before landing work, CI expects `npm run lf:ci`, `npm run type-check`, and exploration unit tests. Your agent should run these; you spot-check in the browser.

Structural-base changes (E-Components, building workflow): bump patch in `package.json` and [Changelog](/changelog).

## Further reading

- [Architecture](/guide/architecture) — content model
- [Adding an Exploration](/contributing/adding-an-exploration) — checklist and metadata
- [Third-Party Libraries](/contributing/third-party-libraries) — when new runtime deps need approval

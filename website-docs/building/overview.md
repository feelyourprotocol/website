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

3. **Trigger the agent** — for a new EIP, “round-trip for EIP-xxxx” ([round-trip skill](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/round-trip-protocol-change/SKILL.md)). You GO after the briefing and again after the exploration (optional MCP hints). After MCP the agent asks whether to generate a Bro & Bruh comic ([bro-bruh-comic](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/bro-bruh-comic/SKILL.md)) — skippable. Widget-only: [AGENTS.md](https://github.com/feelyourprotocol/website/blob/main/AGENTS.md) + [add-exploration](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/add-exploration/SKILL.md). Constraints the briefing should settle:
   - Pick topic/timeline/tags from the architecture tables (do not invent IDs)
   - Prefer an existing [E-Component](/contributing/available-e-components) over custom UI

4. **Review the result** — tests passing is the quality bar, not the pedagogy bar. Check intro/usage text against the spec, example quality, play loop, form factors (mobile / tablet / desktop), and the browser UI. See [Adding an Exploration § Human review](/contributing/adding-an-exploration#human-review).

5. **Cover art** ships in the same exploration phase — [Images](/contributing/images); [cover-image skill](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/cover-image/SKILL.md).

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

# Adding an Exploration

An exploration is a folder under `src/explorations/` with metadata and an interactive widget. **You** define the pedagogical goal and review the result; **your agent** implements using the [add-exploration skill](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/add-exploration/SKILL.md).

## Brief your agent

Include:

- EIP/ERC spec link and **what the widget should let someone understand**
- Suggested topic, timeline, and tags ([Architecture](/guide/architecture) — agent must read `TOPICS.ts`, `TIMELINE.ts`, `TAGS.ts`, not guess)
- Building block: precompile → [EIP-7951](https://github.com/feelyourprotocol/website/tree/main/src/explorations/eip-7951); bytecode stepper → [EIP-8024](https://github.com/feelyourprotocol/website/tree/main/src/explorations/eip-8024); custom → [EIP-7928](https://github.com/feelyourprotocol/website/tree/main/src/explorations/eip-7928)
- Ask for human review before OG image or PR

## Folder contract

```
src/explorations/eip-XXXX/
├── info.ts          # required
├── MyC.vue          # required
├── examples.ts      # recommended
├── tests.spec.ts    # required
├── config.ts        # when using an E-Component
└── *.vue / *.ts     # optional companions, helpers
```

Register in `REGISTRY.ts` or the exploration will not appear.

## Metadata sketch (`info.ts`)

Canonical shape — agent fills values; you review copy:

```typescript
import type { Exploration } from '@/explorations/REGISTRY'
import { Tag } from '@/explorations/TAGS'

export const INFO: Exploration = {
  id: 'eip-XXXX',
  path: '/eip-XXXX-short-description',
  title: 'Human-Readable Title',
  seoDescription: 'Interactive explainer for EIP-XXXX — search-friendly terms, not widget UI copy.',
  infoURL: 'https://eips.ethereum.org/EIPS/eip-XXXX',
  topic: 'scaling',
  timeline: 'fusaka',
  tags: [Tag.EVM, Tag.GasCosts],
  introText: '<b>What does this change?</b> …',
  usageText: 'How to use the widget below.',
  poweredBy: [{ name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' }],
}
```

### Field guide (what you must judge)

| Field | Your judgment |
| --- | --- |
| `topic` | Fixed set — must match [Architecture § topics](/guide/architecture#topics) |
| `timeline` | Valid ID from `TIMELINE.ts` |
| `tags` | 3–4 reusable concepts; follow [tag rules](/guide/architecture#tags) |
| `seoDescription` | Discovery/search (~120–160 chars); **not** the same as `introText` |
| `introText` / `usageText` | Pedagogy and accuracy vs the spec |
| `introText` vs `seoDescription` | Intro teaches on-page; SEO targets search queries |
| `poweredBy` | Credit libraries used |
| `image` | Optional — [Images](/contributing/images) |

Agent field lookup: JSDoc on `Exploration` in `REGISTRY.ts`.

## Discovery & SEO

Write `seoDescription` for how people search (EIP number, acronyms, “interactive explainer”). Keep pedagogical framing in `introText`.

## Wiring the widget

Do not hand-implement from docs — tell the agent to copy a **reference folder** and read [Available E-Components](/contributing/available-e-components).

**Extension rule:** extra teaching UI goes **inside** E-Component slots, not as siblings next to the component (provide/inject is descendant-only). See [E-Components](/contributing/e-components#extension-points).

## Tests

Agent adds `tests.spec.ts` — metadata, examples, config sanity. You do not need to write tests; verify the exploration **behaves** as intended in the browser.

## Cover & link previews

- **Cover art (optional):** [Images](/contributing/images) + [cover-image skill](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/cover-image/SKILL.md)
- **OG card:** `npm run generate:og:exploration -- <id>` after metadata is final

## Human review

Tests green ≠ ready. Before OG/PR, review:

- **Pedagogy** — does it help someone understand the protocol change?
- **Copy** — `introText` / `usageText` accurate vs spec?
- **Examples** — meaningful inputs, not only edge hex?
- **Visual pass** — spacing, overflow, topic colors in the browser

## Checklist

- [ ] Agent brief included spec, goal, taxonomies, building block
- [ ] Folder + `REGISTRY.ts` entry
- [ ] Human review of copy, examples, UX
- [ ] Quality gates pass (`lf:ci`, typecheck, tests)
- [ ] OG generated when shipping

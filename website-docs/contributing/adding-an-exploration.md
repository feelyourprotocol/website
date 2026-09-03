# Adding an Exploration

An exploration is a folder under `src/explorations/` with metadata and an interactive widget. **You** define the pedagogical goal and review the result; **your agent** implements.

**Default for a new EIP:** tell the agent “round-trip for EIP-xxxx”. That runs the [round-trip skill](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/round-trip-protocol-change/SKILL.md) — brief, then exploration, then MCP, then an optional Bro & Bruh comic — with a GO from you between phases. Widget-only work still uses [brief-protocol-change](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/brief-protocol-change/SKILL.md) then [add-exploration](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/add-exploration/SKILL.md).

## Brief your agent

Include (or let the briefing phase propose these for you to accept):

- EIP/ERC spec link and **what the widget should let someone understand** (practical, curiosity, or research audience)
- Suggested topic, timeline, and tags ([Architecture](/guide/architecture) — agent must read `TOPICS.ts`, `TIMELINE.ts`, `TAGS.ts`, not guess)
- Building block: precompile repricing → [EIP-7883](https://github.com/feelyourprotocol/website/tree/main/src/explorations/eip-7883); precompile new-capability → [EIP-7951](https://github.com/feelyourprotocol/website/tree/main/src/explorations/eip-7951); bytecode stepper → [EIP-8024](https://github.com/feelyourprotocol/website/tree/main/src/explorations/eip-8024); custom → [EIP-7928](https://github.com/feelyourprotocol/website/tree/main/src/explorations/eip-7928)
- Ask for human review before OG image or PR

## Folder contract

```
src/explorations/eip-XXXX/
├── canonical.ts     # required — source of truth (website + MCP)
├── info.ts          # required — website chrome only
├── MyC.vue          # required
├── examples.ts      # recommended
├── tests.spec.ts    # required
├── config.ts        # when using an E-Component
└── *.vue / *.ts     # optional companions, helpers
```

Register in `REGISTRY.ts` or the exploration will not appear.

## Canonical metadata (`canonical.ts`)

Shared meaning lives here — replicated into MCP engine modules and docs. Schema: `src/explorations/canonicalTypes.ts`.

```typescript
import type { ProtocolChangeCanonical } from '@/explorations/canonicalTypes'
import { Tag } from '@/explorations/TAGS'

/** Source of truth for this protocol change (website + MCP). Replicate into engine EipCapability and mcp-docs. */
export const CANONICAL: ProtocolChangeCanonical = {
  identity: { id: 'eip-XXXX', eip: 0, specUrl: 'https://eips.ethereum.org/EIPS/eip-XXXX', name: '…' },
  question: { coreQuestion: '…', changeNature: 'new-capability' },
  taxonomy: { topic: 'scaling', timeline: 'fusaka', tags: [Tag.EVM] },
  maturity: { eipStatus: 'Final', forkInclusion: 'Fusaka' },
  mcp: { shapes: ['simulate'], docsStatus: 'runnable' },
}
```

## Website chrome (`info.ts`)

Website-only fields — agent fills values; you review copy. Derive `topic`, `timeline`, `tags`, `title`, `infoURL` from `CANONICAL` where possible:

```typescript
import type { Exploration } from '@/explorations/REGISTRY'
import { CANONICAL } from './canonical'

export const INFO: Exploration = {
  id: CANONICAL.identity.id,
  path: '/eip-XXXX-short-description',
  title: CANONICAL.identity.name,
  seoDescription: '…',
  infoURL: CANONICAL.identity.specUrl,
  topic: CANONICAL.taxonomy.topic,
  timeline: CANONICAL.taxonomy.timeline,
  tags: CANONICAL.taxonomy.tags,
  coreQuestion: CANONICAL.question.coreQuestion,
  mcpDocsStatus: CANONICAL.mcp.docsStatus,
  introText: `<b>${CANONICAL.question.coreQuestion}</b> …`,
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

Agent adds `tests.spec.ts` (logic **and** UI mounts) — metadata, examples, execution helpers, beyond-edge inputs, play-path presence. Prefer tests before chrome polish. You verify the exploration **behaves** in the browser, including a mobile/tablet pass.

## Cover, Latest, and link previews

- **Cover art (required):** [Images](/contributing/images) + [cover-image skill](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/cover-image/SKILL.md). Round-trip uses Template B from the signed-off core question unless you named a subject at GO.
- **Home Latest:** agent prepends the new id to `FEATURED_EXPLORATION_IDS` in `src/views/homeCatalog.ts` (the previous third Latest moves to the Catalog row). Home cards use `ExplorationPreviewC` (cover + core question), not the full widget chrome. Preview pills are links: topic → topic hub, timeline → `/all?timeline=…`, MCP → `mcp-docs/use/eips/eip-NNNN.html` when `mcpDocsStatus` is runnable or planned-module (label is always **MCP**, not Runnable/Planned).
- **OG card:** `npm run generate:og:exploration -- <id>` after cover and metadata

## Human review

Tests green ≠ ready. Before OG/PR, review:

- **Pedagogy** — does it help someone understand the protocol change?
- **Play loop** — can someone *feel* the core question in the first minute without side knowledge?
- **Copy** — `introText` / `usageText` accurate vs spec?
- **Examples** — meaningful inputs, not only edge hex?
- **Form factors** — usable on mobile, tablet, and desktop (no overflow, tap targets, stacking)
- **Visual pass** — spacing, overflow, topic colors in the browser

## Checklist

- [ ] Round-trip briefing (or standalone brief) + human GO on core question **and** taxonomy
- [ ] Folder + `canonical.ts` + `REGISTRY.ts` entry (nav)
- [ ] Home Latest (`FEATURED_EXPLORATION_IDS` prepend in `homeCatalog.ts`)
- [ ] Cover art (`image.webp`)
- [ ] `mcp-docs/use/eips/eip-NNNN.md` for every live exploration
- [ ] Human review of copy, examples, UX, form factors
- [ ] Quality gates pass (`lf:ci`, typecheck, tests — logic + UI + beyond-edge)
- [ ] MCP phase GO when a twin should ship (engine module and/or catalogue page)
- [ ] OG generated when shipping

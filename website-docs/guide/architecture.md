# Architecture

Vue 3 + Vite explorations app. Each protocol change gets a self-contained folder; routes come from `REGISTRY.ts` with lazy-loaded widgets.

When briefing an agent, internalize this model first — taxonomies and reuse rules matter more than stack details.

## Content model

### Explorations

The core unit: an interactive widget for an EIP, ERC, or research topic.

```
src/explorations/eip-7883/
├── canonical.ts    # Source of truth (website + MCP)
├── info.ts         # Website chrome (path, HTML, images)
├── MyC.vue         # Widget
├── examples.ts     # Presets
└── tests.spec.ts   # Tests
```

Schema for all explorations: `src/explorations/canonicalTypes.ts`. Replicate `CANONICAL` into engine modules and MCP docs; website wins on conflict.

### MCP twin (no orphan explorations)

Every **live** exploration needs a matching MCP usage story — at minimum [`mcp-docs/use/eips/eip-NNNN`](https://mcp-docs.feelyourprotocol.org/use/coverage.html) (Runnable or Planned). The exploration is the textbook slice; MCP is the superset lab. Full path: [round-trip skill](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/round-trip-protocol-change/SKILL.md) (optional Bro & Bruh comic after MCP). Brief first: [brief-protocol-change skill](https://github.com/feelyourprotocol/website/blob/main/.cursor/skills/brief-protocol-change/SKILL.md).

`REGISTRY.ts` assembles all explorations into routes — no manual route registration.

### Topics

Strategic pillars — **static curated set**, not added with regular explorations. Each exploration has exactly one `topic` in `info.ts`. Valid IDs live in `TOPICS.ts`.

| ID | Title | Description |
| --- | --- | --- |
| `scaling` | Scaling | Data availability, throughput, L2 enablement |
| `privacy` | Privacy | ZK-proofs, homomorphic encryption, private mempools |
| `ux` | UX | Account abstraction, wallet infrastructure, signature schemes |
| `security` | Security | Validator incentives, cryptographic agility, MEV mitigations |
| `robustness` | Robustness | Gas cost accuracy, EVM semantics hardening, spec clarity |
| `interoperability` | Interoperability | Cross-chain standards, bridge infrastructure |

When instructing an agent: pick the topic that best reflects the **primary concern** of the change.

### Timeline

Maturity + hardfork placement — one entry per exploration in `TIMELINE.ts`. Hardfork names follow Ethereum upgrade cities; categories like `research` and `ideas` are stable. New hardfork entries can be added as the schedule evolves.

### Tags

Reusable technical concepts (max 3–4 per exploration). Tags **can grow** when rules are met:

| Rule | Example |
| --- | --- |
| Reusable beyond one exploration | `EVM` yes — `EIP-7883` no |
| Short form preferred | `EVM` yes — `Ethereum Virtual Machine` no |
| No redundancy with existing tags | don't add `Gas` if `GasCosts` exists |
| Prefer the generic concept | `GasCosts` yes — `Gas Increases` no |

Valid values: `TAGS.ts` enum (alphabetical, lint-enforced).

## E-Components

Reusable Ethereum-domain widgets in `src/eComponents/<name>EC/`. Each packages a recurring pattern (precompile interface, bytecode stepper, …). The exploration supplies **execution** (EVM, `run` callbacks); the E-Component supplies **chrome and shared UI**.

Brief agents: check [Available E-Components](/contributing/available-e-components) before custom UI. One primary E-Component per exploration today — see [E-Components](/contributing/e-components#composing-e-components) for composition direction.

## Design decisions

**Folder-per-exploration** — isolated deps; one `REGISTRY.ts` import to publish.

**Dynamic views** — `ExplorationView.vue` loads the right `MyC.vue`; no static per-EIP view files.

**Lazy loading** — each exploration is its own chunk; users download only what they visit.

**Testing** — Vitest for units; Cypress for lean navigation smoke tests.

## Video pipeline

Short-form exploration videos live in the isolated `video/` package (sibling of `og/`), with a rendering layer under `src/video/` activated by `?fyp-video=1`. Authoring is agent-driven — see the `video-short` skill and `video/README.md` in the repo.

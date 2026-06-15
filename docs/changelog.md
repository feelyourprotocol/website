# Changelog

Structural-base history for Feel Your Protocol. The version tracks [`package.json`](https://github.com/feelyourprotocol/website/blob/main/package.json) — it reflects changes to the **contribution model, E-Components, and project structure**, not individual explorations.

**Latest docs always apply.** There is no version switching; this page is a trail so you can follow along when the base evolves.

## When the version bumps

| Bump                | When                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------ |
| **Patch** (`0.1.x`) | E-Component APIs, contribution guides, architecture, or contributor workflow changed |
| **Minor** (`0.2.0`) | Breaking change to structural conventions (rare while in beta)                       |

New explorations are listed under **Explorations** for visibility but do not drive version bumps.

---

## [0.1.1] — 2026-06-08

### Added

- **Bytecode Stepper E-Component** (`bytecodeStepperEC`) — documented building block for opcode/bytecode explorations
- **Docs changelog** (this page)
- E-Component **extension model**: layout slots, provide/inject context, companion components in the exploration folder

### Changed

- [E-Components](/contributing/e-components) — integration contract, extension points, composition direction
- [Available E-Components](/contributing/available-e-components) — equal-weight reference for all E-Components
- [Adding an Exploration](/contributing/adding-an-exploration) — building-block choice, extension guidance, E-Component test notes
- [Architecture](/guide/architecture) — E-Components described as a growing set, not precompile-only
- [AI-Assisted Development](/contributing/ai-assisted-development) — check Available E-Components first; slot/inject pitfall
- [UI Components](/contributing/ui-components) — placement rules aligned with exploration-folder companions

### Explorations _(no version bump)_

- [EIP-8024](https://feelyourprotocol.org/eip-8024-stack-opcodes-dupn-swapn-exchange) — DUPN/SWAPN/EXCHANGE bytecode stepper (reference for E-Component + companion panel pattern)

---

## [0.1.0] — 2026-05-01

Initial documented structural base (beta).

### Added

- Folder-per-exploration content model with dynamic routing via `REGISTRY.ts`
- Taxonomies: topics, timeline, tags
- **Precompile Interface E-Component** (`precompileInterfaceEC`)
- Shared UI components (`src/eComponents/ui/`)
- VitePress documentation site
- Contribution guides: adding explorations, styling, code conventions, third-party libraries

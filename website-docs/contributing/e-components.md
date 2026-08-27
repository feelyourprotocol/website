# E-Components

**E-Components** are reusable Ethereum-domain widgets — precompile interfaces, bytecode steppers, and similar patterns. When briefing an agent: *“use the precompile E-Component if it fits”* rather than reinventing inputs and page chrome.

Catalog: [Available E-Components](/contributing/available-e-components). Generic buttons/inputs: [UI Components](/contributing/ui-components).

## Integration intent

| Concern | Who owns it |
| --- | --- |
| Page chrome (title, intro, examples shell) | E-Component |
| What varies per exploration | Exploration `config.ts` |
| Library / execution (EVM, `run`, forks) | Exploration — passed in as props |
| Extra teaching UI | Exploration via **slots** or local companion components |
| Live state for companion panels | E-Component composable + provide/inject |

E-Components do **not** import third-party libraries. Execution stays in the exploration folder.

## Extension points

When the core E-Component is not enough:

| Mechanism | Use for |
| --- | --- |
| Scoped slots (e.g. `#result`) | Custom result display |
| Layout slots (e.g. `#below`) | Extra panels |
| Provide/inject | Companions that react to live runtime state |

::: warning Slots and inject
Extension UI must be **descendants** inside the E-Component slot tree — not siblings next to the E-Component in `MyC.vue`.
:::

Keep exploration-specific logic local until a **second** exploration needs the same thing — then promote to a shared E-Component.

## One E-Component per exploration

Each major E-Component wraps the full page shell today. Compose _on top of_ one E-Component via slots — do not nest two full E-Components side by side.

**Scalability direction:** sub-components usable standalone; eventually one layout owning `ExplorationC` and hosting multiple capability fragments. Until then, keep additions local.

## Creating a new E-Component

When **two or more** explorations share a pattern: new folder `src/eComponents/<name>EC/`, typed config, execution stays in explorations, clear slots/inject hooks, document on [Available E-Components](/contributing/available-e-components).

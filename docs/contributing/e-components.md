# E-Components

**E-Components** are reusable, Ethereum-specific components that encapsulate common patterns across explorations. They live in `src/eComponents/` and are designed to let you build new explorations quickly without duplicating logic.

While the shared [UI components](/contributing/ui-components) (`src/eComponents/ui/`) provide generic building blocks like buttons and input fields, E-Components go a level higher: they package complete Ethereum-domain patterns — precompile testing interfaces, bytecode steppers, and more — into components with a clean configuration API.

For the list of ready-to-use E-Components, see [Available E-Components](/contributing/available-e-components).

## Integration Contract

Each E-Component follows a shared integration model. Understanding this contract helps you wire explorations consistently and know where to add custom behavior.

| Concern                            | Where it lives                                                    | Pattern                                                                                                        |
| ---------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Page chrome**                    | E-Component                                                       | Wraps `ExplorationC` (title, intro, examples, powered-by)                                                      |
| **Variation between explorations** | `config.ts` in the exploration folder                             | Typed config object, testable separately                                                                       |
| **Library / execution ownership**  | Exploration (`MyC.vue` and exploration-local modules)             | Exploration creates EVM instances, `run` callbacks, or fork-specific setup; E-Component receives them as props |
| **Domain-specific visualization**  | Exploration                                                       | Via **slots** or **companion components** wired into the E-Component                                           |
| **Shared runtime state**           | E-Component composable, optionally exposed via **provide/inject** | For panels that need live state without prop-drilling                                                          |

### Standard Props

Most E-Components accept a common set of props:

| Prop          | Description                                                            |
| ------------- | ---------------------------------------------------------------------- |
| `config`      | Exploration-specific configuration (see the E-Component's config type) |
| `examples`    | Example presets from the exploration's `examples.ts`                   |
| `exploration` | Metadata from the exploration's `info.ts`                              |

Beyond these, E-Components accept props for **exploration-owned execution** — for example a `run` callback or a pre-configured EVM instance. E-Components do not import third-party libraries themselves; see [Third-Party Libraries](/contributing/third-party-libraries).

### Extension Points

E-Components deliberately cover **repeatable patterns**, not every pedagogical idea an exploration might need. When the core API is not enough, use the E-Component's extension hooks before wrapping or forking it:

| Mechanism                  | Best for                                                    | Notes                                                                                                                                   |
| -------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Scoped slots**           | Custom UI at a specific render point inside the E-Component | Slot props pass data back to the exploration (e.g. execution results)                                                                   |
| **Named layout slots**     | Additional panels or regions alongside the core UI          | Mount exploration-local components inside the slot                                                                                      |
| **Provide/inject context** | Companion panels that react to live runtime state           | Injection only works for **descendants** — extension UI must be mounted inside the E-Component's slot tree, not as a sibling next to it |

Keep exploration-specific teaching UI, helpers, and domain logic in the **exploration folder**. Promote code to a shared utility or E-Component only when a second exploration needs the same thing.

## How E-Components Work

Each E-Component is a self-contained folder in `src/eComponents/` with a consistent internal structure:

```
src/eComponents/<name>EC/
├── <Name>EC.vue              # Main component (the primary entry point)
├── types.ts                  # Configuration interfaces
├── use<Name>.ts              # Composable: shared state and logic
├── <Name><Sub>EC.vue         # Optional sub-components
└── <utility>.ts              # Optional utility modules
```

### Naming Convention

E-Component folders and files are post-fixed with **`EC`** (for E-Component):

- Folder: `src/eComponents/precompileInterfaceEC/`
- Main component: `PrecompileInterfaceEC.vue`
- Sub-components: `PrecompileInterfaceResultEC.vue`, `PrecompileValueInputEC.vue`
- Composable: `usePrecompileState.ts`
- Types: `types.ts`

### Using an E-Component in Your Exploration

The typical pattern is:

1. Check [Available E-Components](/contributing/available-e-components) for a matching building block
2. Define a `config.ts` describing your specific use case
3. Wire execution in `MyC.vue` (EVM setup, `run` function, etc.)
4. Render the E-Component with config, examples, and exploration metadata
5. Add exploration-local UI via slots or companion components if needed

This keeps `MyC.vue` short and declarative — often under 30 lines for straightforward cases. See [Adding an Exploration](/contributing/adding-an-exploration) for the full walkthrough.

## Composing E-Components

Today, each major E-Component wraps the full exploration shell (`ExplorationC`). That means **one primary E-Component per exploration** is the supported, documented path.

Exploration-specific additions compose _on top of_ that E-Component via slots and inject — not by nesting two full E-Components side by side.

As the project grows, we expect explorations that combine capabilities from multiple E-Components (for example, a precompile comparison alongside a bytecode walkthrough). To prepare for that:

- **E-Component authors** should separate "page chrome" from "capability" where feasible — sub-components that can be used standalone, not only as part of the full wrapper
- **Exploration authors** should keep custom additions local until a composition pattern is established project-wide
- **Future direction:** an exploration-level layout that owns `ExplorationC` once and hosts multiple E-Component fragments

If you are designing an E-Component or an exploration that might need multi-component composition, [open an issue](https://github.com/feelyourprotocol/website/issues) to discuss the approach before investing in a one-off structure.

## Creating a New E-Component

If you spot a pattern shared across two or more explorations, it is a strong candidate for a new E-Component. Contributions of new E-Components are very welcome — they directly help other contributors build explorations faster.

### Steps

1. Create a folder in `src/eComponents/` following the naming convention: `<name>EC/`
2. Define a `types.ts` with a configuration interface that captures the variation between use cases
3. Extract shared logic into a composable (`use<Name>.ts`)
4. Build the component(s) following the [integration contract](#integration-contract) above
5. Document usage on the [Available E-Components](/contributing/available-e-components) page

### Design Principles

A good E-Component should:

- **Accept a config object** rather than many individual props — this keeps the consumer API minimal and easy to extend
- **Provide sensible defaults** where possible, so simple use cases stay simple
- **Expose clear extension hooks** — slots and/or typed inject context for exploration-local additions
- **Keep execution ownership in the exploration** — accept callbacks or library instances as props, never import third-party libraries directly
- **Keep the consumer's `MyC.vue` short and declarative** — ideally config + wiring + a single component tag
- **Encapsulate state and logic** in a composable, keeping the Vue component focused on rendering
- **Favor composable fragments** over monolithic widgets — sub-components usable on their own make future multi-E-Component explorations easier

### Ideas for Future E-Components

Some patterns that might become E-Components as the project grows:

- **Transaction builder** — interactive transaction construction and signing
- **Gas calculator** — compare gas costs across hardforks for different operations
- **Storage layout** — visualize contract storage slot changes

If you are interested in building any of these (or have other ideas), feel free to [open an issue](https://github.com/feelyourprotocol/website/issues) to discuss the design.

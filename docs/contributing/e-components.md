# E-Components

**E-Components** are reusable, Ethereum-specific components that encapsulate common patterns across explorations. They live in `src/eComponents/` and are designed to let you build new explorations quickly without duplicating logic.

While the shared [UI components](/contributing/ui-components) (`src/eComponents/ui/`) provide generic building blocks like buttons and input fields, E-Components go a level higher: they package complete Ethereum-domain patterns — like a full precompile testing interface — into a single component with a clean configuration API.

For the list of ready-to-use E-Components, see [Available E-Components](/contributing/available-e-components).

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

1. Import the E-Component and its config type
2. Define a config object describing your specific use case
3. Render the component in your template with the config, examples, and exploration metadata

This keeps your `MyC.vue` short and declarative — often under 30 lines.

## Creating a New E-Component

If you spot a pattern shared across two or more explorations, it is a strong candidate for a new E-Component. Contributions of new E-Components are very welcome — they directly help other contributors build explorations faster.

### Steps

1. Create a folder in `src/eComponents/` following the naming convention: `<name>EC/`
2. Define a `types.ts` with a configuration interface that captures the variation between use cases
3. Extract shared logic into a composable (`use<Name>.ts`)
4. Build the component(s) with a clean, props-based API
5. Document usage on the [Available E-Components](/contributing/available-e-components) page

### Design Principles

A good E-Component should:

- **Accept a config object** rather than many individual props — this keeps the consumer API minimal and easy to extend
- **Provide sensible defaults** where possible, so simple use cases stay simple
- **Allow customization hooks** (callback functions in the config) for cases that need non-standard behavior
- **Keep the consumer's `MyC.vue` short and declarative** — ideally just a config + a single component tag
- **Encapsulate all state and logic** in a composable, keeping the Vue component focused on rendering

### Ideas for Future E-Components

Some patterns that might become E-Components as the project grows:

- **Transaction builder** — interactive transaction construction and signing
- **Gas calculator** — compare gas costs across hardforks for different operations
- **Storage layout** — visualize contract storage slot changes
- **Opcode explorer** — step through EVM bytecode execution

If you are interested in building any of these (or have other ideas), feel free to [open an issue](https://github.com/feelyourprotocol/website/issues) to discuss the design.

# UI Components

The project provides a set of generic, reusable UI components that you can use in any exploration or E-Component. They live in `src/eComponents/ui/` and are already styled with the exploration design system — colors adapt automatically to the current topic.

## Where UI Components Live

UI components are organized by scope:

```
src/eComponents/
├── ui/                          # Shared across all E-Components and explorations
│   ├── resultBox/               # Result display components
│   │   └── ResultBoxUIC.vue
│   ├── ExamplesUIC.vue
│   ├── HexDataInputUIC.vue
│   ├── ActionButtonUIC.vue
│   ├── ButtonUIC.vue
│   └── TooltipUIC.vue
└── precompileInterfaceEC/
    └── ui/                      # (future) Components specific to this E-Component
```

The placement rules:

| Scope | Location | Example |
|-------|----------|---------|
| Used across multiple E-Components or explorations | `src/eComponents/ui/` | `ResultBoxUIC`, `ExamplesUIC` |
| Specific to one E-Component | `src/eComponents/<name>/ui/` | (none yet) |
| Specific to one exploration | `src/explorations/<id>/custom/ui/` | (none yet) |

## Available Components

### ExamplesUIC

Example selector dropdown built on [Headless UI Listbox](https://headlessui.dev/v1/vue/listbox). Provides an accessible, keyboard-navigable dropdown with pre-defined example presets.

```vue
<ExamplesUIC v-model="example" :examples="examples" :change="selectExample" />
```

| Prop | Type | Description |
|------|------|-------------|
| `v-model` | `string` | Selected example key |
| `examples` | `Examples` | Object mapping keys to `{ title, values }` |
| `change` | `() => void` | Called when selection changes |

### HexDataInputUIC

Hex data input textarea for raw byte input.

```vue
<HexDataInputUIC v-model="data" rows="6" :formChange="onDataInputFormChange" />
```

| Prop | Type | Description |
|------|------|-------------|
| `v-model` | `string` | The hex data string |
| `rows` | `number` | Textarea row count |
| `formChange` | `() => void` | Called on input change |

### ResultBoxUIC

Result display box with a title label. Used for showing computation output. Has built-in support for placeholder info text and error messages via optional props.

```vue
<ResultBoxUIC title="Result" :left="true">
  <p class="e-result-text-lg">21000 Gas</p>
</ResultBoxUIC>
```

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Title label shown in the box |
| `left` | `boolean` | Alignment: `true` for left, `false` for right |
| `infoText` | `string?` | Placeholder text shown when no content is available |
| `errorText` | `string?` | Error message (red) with a "Report on GitHub" hint |

`errorText` takes precedence over `infoText`. Both render below the slot content, so conditionally pass them only when the slot is empty:

```vue
<ResultBoxUIC
  title="Result"
  :left="true"
  :error-text="hasError ? errorMsg : undefined"
  :info-text="!hasResult ? 'Press button to compute...' : undefined"
>
  <table v-if="hasResult">...</table>
</ResultBoxUIC>
```

Use with `e-grid-single` or `e-grid-double` for layout:

```vue
<div class="e-grid-double">
  <ResultBoxUIC title="Before" :left="true">...</ResultBoxUIC>
  <ResultBoxUIC title="After" :left="false">...</ResultBoxUIC>
</div>
```

### ActionButtonUIC

Async action button with loading state and tooltip. Disables itself and shows "Loading..." while the async handler runs.

```vue
<ActionButtonUIC tooltip="Runs the computation" text="RUN" :onClick="run" />
```

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | Button label |
| `tooltip` | `string` | Tooltip text on hover |
| `onClick` | `() => Promise<void>` | Async click handler |

### ButtonUIC

Small icon button with tooltip. Used internally by `ExplorationC` for share and external-link icons.

```vue
<ButtonUIC :icon="ShareIcon" tooltip="Share" />
```

### TooltipUIC

CSS tooltip wrapper. Used internally by `ButtonUIC` and `ActionButtonUIC`. You typically don't need this directly — use `ActionButtonUIC` or `ButtonUIC` instead.

## Underlying Libraries

Some UI components use [Headless UI](https://headlessui.dev/) (`@headlessui/vue`) — a set of completely unstyled, accessible UI primitives designed for Tailwind CSS. Headless UI handles keyboard navigation, focus management, and ARIA attributes while we control all styling via the exploration design system.

Currently used by:
- `ExamplesUIC` — uses the Headless UI **Listbox** component

As a contributor you don't need to interact with Headless UI directly — just use the UIC components as documented above.

## Importing

All shared UI components use the `@/eComponents/ui/` path:

```typescript
import ExamplesUIC from '@/eComponents/ui/ExamplesUIC.vue'
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'
import ActionButtonUIC from '@/eComponents/ui/ActionButtonUIC.vue'
```

# UI Components

The project provides a set of generic, reusable UI components that you can use in any exploration or E-Component. They live in `src/eComponents/ui/` and are already styled with the exploration design system — colors adapt automatically to the current topic.

## Where UI Components Live

UI components are organized by scope:

```
src/eComponents/
├── ui/                          # Shared across all E-Components and explorations
│   ├── resultBox/               # Result display components
│   │   └── ResultBoxC.vue
│   ├── ExamplesC.vue
│   ├── HexDataInputC.vue
│   ├── ActionButtonC.vue
│   ├── ButtonC.vue
│   └── TooltipC.vue
└── precompileInterfaceEC/
    └── ui/                      # (future) Components specific to this E-Component
```

The placement rules:

| Scope | Location | Example |
|-------|----------|---------|
| Used across multiple E-Components or explorations | `src/eComponents/ui/` | `ResultBoxC`, `ExamplesC` |
| Specific to one E-Component | `src/eComponents/<name>/ui/` | (none yet) |
| Specific to one exploration | `src/explorations/<id>/custom/ui/` | (none yet) |

## Available Components

### ExamplesC

Example selector dropdown. Provides a `<select>` with pre-defined example presets.

```vue
<ExamplesC v-model="example" :examples="examples" :change="selectExample" />
```

| Prop | Type | Description |
|------|------|-------------|
| `v-model` | `string` | Selected example key |
| `examples` | `Examples` | Object mapping keys to `{ title, values }` |
| `change` | `() => void` | Called when selection changes |

### HexDataInputC

Hex data input textarea for raw byte input.

```vue
<HexDataInputC v-model="data" rows="6" :formChange="onDataInputFormChange" />
```

| Prop | Type | Description |
|------|------|-------------|
| `v-model` | `string` | The hex data string |
| `rows` | `number` | Textarea row count |
| `formChange` | `() => void` | Called on input change |

### ResultBoxC

Result display box with a title label. Used for showing computation output. Has built-in support for placeholder info text and error messages via optional props.

```vue
<ResultBoxC title="Result" :left="true">
  <p class="e-result-text-lg">21000 Gas</p>
</ResultBoxC>
```

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Title label shown in the box |
| `left` | `boolean` | Alignment: `true` for left, `false` for right |
| `infoText` | `string?` | Placeholder text shown when no content is available |
| `errorText` | `string?` | Error message (red) with a "Report on GitHub" hint |

`errorText` takes precedence over `infoText`. Both render below the slot content, so conditionally pass them only when the slot is empty:

```vue
<ResultBoxC
  title="Result"
  :left="true"
  :error-text="hasError ? errorMsg : undefined"
  :info-text="!hasResult ? 'Press button to compute...' : undefined"
>
  <table v-if="hasResult">...</table>
</ResultBoxC>
```

Use with `e-grid-single` or `e-grid-double` for layout:

```vue
<div class="e-grid-double">
  <ResultBoxC title="Before" :left="true">...</ResultBoxC>
  <ResultBoxC title="After" :left="false">...</ResultBoxC>
</div>
```

### ActionButtonC

Async action button with loading state and tooltip. Disables itself and shows "Loading..." while the async handler runs.

```vue
<ActionButtonC tooltip="Runs the computation" text="RUN" :onClick="run" />
```

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | Button label |
| `tooltip` | `string` | Tooltip text on hover |
| `onClick` | `() => Promise<void>` | Async click handler |

### ButtonC

Small icon button with tooltip. Used internally by `ExplorationC` for share and external-link icons.

```vue
<ButtonC :icon="ShareIcon" tooltip="Share" />
```

### TooltipC

CSS tooltip wrapper. Used internally by `ButtonC` and `ActionButtonC`. You typically don't need this directly — use `ActionButtonC` or `ButtonC` instead.

## Importing

All shared UI components use the `@/eComponents/ui/` path:

```typescript
import ExamplesC from '@/eComponents/ui/ExamplesC.vue'
import ResultBoxC from '@/eComponents/ui/resultBox/ResultBoxC.vue'
import ActionButtonC from '@/eComponents/ui/ActionButtonC.vue'
```

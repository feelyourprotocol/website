# Adding an EIP

::: warning 🚧 Under Active Development
Both the Feel Your Protocol project and this documentation are in an early stage and under active development. Things may change frequently.
:::

## Overview

Each EIP page consists of a **view** (route wrapper) and a **component** (interactive widget). This guide walks you through adding a new one.

## Step 1: Register the EIP

Add your EIP to `src/views/lib/structure.ts`:

```typescript
export const EIPs: EIPs = {
  // ... existing EIPs
  'eip-XXXX': {
    num: XXXX,
    path: '/eip-XXXX-short-description',
    title: 'Your EIP Title',
    hardforkId: 'fusaka',  // optional
    topicId: 'precompiles', // optional
  },
}
```

The route is automatically created by the router based on this structure.

## Step 2: Create the View

Create `src/views/eips/EIPXXXXView.vue`:

```vue
<script setup lang="ts">
import EIPView from '../EIPView.vue'
import EIPXXXXComponent from '@/components/eips/EIPXXXXC.vue'
import DancerView from '../DancerView.vue'
</script>

<template>
  <EIPView>
    <EIPXXXXComponent />
    <DancerView nameId="default" />
  </EIPView>
</template>
```

## Step 3: Create the Component

Create `src/components/eips/EIPXXXXC.vue`. This is where all the interactive logic lives. Use the `EIPC` wrapper component for consistent layout:

```vue
<script setup lang="ts">
import EIPC from './EIPC.vue'
import PoweredByC from './PoweredByC.vue'
import { EIPs } from '@/views/lib/structure.js'

const eip = EIPs['eip-XXXX']
</script>

<template>
  <EIPC :title="eip.title" :eip="eip.num">
    <template v-slot:description>
      <p>Description of what this EIP changes.</p>
    </template>
    <template v-slot:content>
      <!-- Your interactive widget here -->
    </template>
  </EIPC>
</template>
```

## Step 4: Add Library Dependencies

If your widget needs a library fork, see the [Library Forks](../guide/library-forks.md) guide. Key rule: **only import fork-specific libraries in your component file**, never in shared code.

## Step 5: Add Tests

Add a Cypress E2E test in `cypress/e2e/eipXXXX.cy.ts` to verify basic widget functionality.

## Step 6: Build and Verify

```bash
npm run build        # verify production build works
npm run test:e2e     # run E2E tests
```

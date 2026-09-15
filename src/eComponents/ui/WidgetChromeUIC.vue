<template>
  <div class="e-widget-chrome" data-testid="widget-chrome">
    <div v-if="$slots.steps" class="e-widget-chrome-steps">
      <slot name="steps" />
    </div>
    <div class="e-widget-chrome-execute">
      <div v-if="$slots.toggles" class="e-widget-chrome-toggles">
        <slot name="toggles" />
      </div>
      <div class="e-widget-chrome-action">
        <slot name="examples" />
        <div v-if="$slots.run" class="e-widget-chrome-run">
          <slot name="run" />
        </div>
      </div>
    </div>
  </div>
</template>

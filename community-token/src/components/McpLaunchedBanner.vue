<script setup lang="ts">
import {
  MCP_LAUNCH_ANNOUNCEMENT_X_LABEL,
  MCP_LAUNCH_ANNOUNCEMENT_X_URL,
} from '../../../shared/mcpLaunchUrls'

const connectUrl = 'https://mcp-docs.feelyourprotocol.org/use/connect.html'
const askUrl = 'https://mcp-docs.feelyourprotocol.org/use/capabilities.html'
</script>

<template>
  <aside class="ct-launched mb-4" data-mcp-launched aria-label="The MCP server has launched.">
    <div class="ct-launched__rule" aria-hidden="true" />
    <div class="ct-launched__inner">
      <div class="ct-launched__mark" aria-hidden="true">
        <svg class="ct-launched__glyph" viewBox="0 0 24 24" fill="none">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>
      </div>
      <div class="min-w-0 flex-1">
        <p class="ct-launched__kicker">
          <span class="ct-launched__pill">
            <span class="ct-launched__dot" aria-hidden="true" />
            Live
          </span>
          6 October 2026 · Glamsterdam Sepolia
        </p>
        <p class="ct-launched__headline">The MCP server has launched.</p>
        <p class="ct-launched__lede">
          The hosted lab is open. Connect an agent — free Amsterdam runs, no wallet, no API key.
        </p>
      </div>
      <div class="ct-launched__actions">
        <a class="ct-launched__cta" :href="connectUrl" target="_blank" rel="noopener noreferrer">
          Connect
        </a>
        <a
          class="ct-launched__cta ct-launched__cta--quiet"
          :href="askUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Try a question
        </a>
        <a
          class="ct-launched__cta ct-launched__cta--quiet"
          :href="MCP_LAUNCH_ANNOUNCEMENT_X_URL"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ MCP_LAUNCH_ANNOUNCEMENT_X_LABEL }}
        </a>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  FYP_MCP_LAUNCH_ANNOUNCEMENT_X_LABEL,
  FYP_MCP_LAUNCH_ANNOUNCEMENT_X_URL,
  mcpDocsPage,
} from '@/libs/roadmapUrls'

const connectUrl = mcpDocsPage('use/connect')
const askUrl = mcpDocsPage('use/capabilities')
</script>

<template>
  <aside
    class="fyp-mcp-live fyp-mcp-live--ribbon mb-4"
    data-mcp-launched-ribbon
    aria-label="The MCP server has launched."
  >
    <div class="fyp-mcp-live__body">
      <div class="fyp-mcp-live__row">
        <div class="fyp-mcp-live__mark" aria-hidden="true">
          <svg class="fyp-mcp-live__glyph" viewBox="0 0 24 24" fill="none">
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="fyp-mcp-live__kicker">
            <span class="fyp-mcp-live__pill">
              <span class="fyp-mcp-live__dot" aria-hidden="true" />
              Live
            </span>
            6 October 2026 · Glamsterdam Sepolia
          </p>
          <p class="fyp-mcp-live__headline">The MCP server has launched.</p>
          <p class="fyp-mcp-live__lede">
            Free Amsterdam runs for your agent — no wallet, no API key.
          </p>
        </div>
      </div>
      <div class="fyp-mcp-live__actions">
        <a
          :href="connectUrl"
          target="_blank"
          rel="noopener"
          class="fyp-shell-cta bg-gradient-to-r from-purple-600 to-cyan-500 text-white transition hover:opacity-90"
        >
          Connect
        </a>
        <a
          :href="askUrl"
          target="_blank"
          rel="noopener"
          class="fyp-shell-cta border border-violet-300 bg-white text-slate-700 hover:bg-violet-50"
        >
          Try a question
        </a>
        <a
          :href="FYP_MCP_LAUNCH_ANNOUNCEMENT_X_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="fyp-shell-cta border border-violet-300 bg-white text-slate-700 hover:bg-violet-50"
        >
          {{ FYP_MCP_LAUNCH_ANNOUNCEMENT_X_LABEL }}
        </a>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'

import LaunchedBanner from '../../../shared/vitepress/LaunchedBanner.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-top>
      <LaunchedBanner
        kicker="6 October 2026 · Glamsterdam Sepolia"
        headline="The MCP server has launched."
        lede="The hosted lab is open on the full Glamsterdam set. Connect an agent, or read what this week opened."
        primary-href="https://mcp-docs.feelyourprotocol.org/use/connect.html"
        primary-label="Connect an agent"
        secondary-href="/roadmap/launch.html"
        secondary-label="What opened"
        primary-external
      />
    </template>
  </Layout>
</template>

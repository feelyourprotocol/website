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
        lede="Months of lab work, now a public door. Ask your agent to run Amsterdam — free, no wallet, no API key."
        primary-href="/use/connect.html"
        primary-label="Connect"
        secondary-href="/use/capabilities.html"
        secondary-label="Try a question"
      />
    </template>
  </Layout>
</template>

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
        lede="The hosted lab is open. Connect an agent — the textbook you build here is what that lab runs."
        primary-href="https://mcp-docs.feelyourprotocol.org/use/connect.html"
        primary-label="Connect an agent"
        secondary-href="https://feelyourprotocol.org"
        secondary-label="Try an exploration"
        primary-external
        secondary-external
      />
    </template>
  </Layout>
</template>

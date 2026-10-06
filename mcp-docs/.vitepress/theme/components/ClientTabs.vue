<script setup lang="ts">
import { ref } from 'vue'

import {
  CLAUDE_CODE_ADD_COMMAND,
  CODEX_ADD_COMMAND,
  CODEX_CONFIG_TOML,
  CURSOR_INSTALL_LINK,
  CURSOR_MCP_JSON,
  FYP_MCP_URL,
} from '../mcpConstants'
import CodeSnippet from './CodeSnippet.vue'

type TabId = 'cursor' | 'claude' | 'codex' | 'other'

const tabs: { id: TabId; label: string }[] = [
  { id: 'cursor', label: 'Cursor' },
  { id: 'claude', label: 'Claude' },
  { id: 'codex', label: 'Codex' },
  { id: 'other', label: 'Other hosts' },
]

const active = ref<TabId>('cursor')
</script>

<template>
  <div class="fyp-client-tabs" data-testid="client-tabs">
    <div class="fyp-client-tabs__list" role="tablist" aria-label="MCP client setup">
      <button
        v-for="tab in tabs"
        :id="`fyp-tab-${tab.id}`"
        :key="tab.id"
        type="button"
        role="tab"
        class="fyp-client-tabs__tab"
        :class="{ 'fyp-client-tabs__tab--active': active === tab.id }"
        :aria-selected="active === tab.id"
        :aria-controls="`fyp-panel-${tab.id}`"
        @click="active = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div
      v-show="active === 'cursor'"
      id="fyp-panel-cursor"
      class="fyp-client-tabs__panel"
      role="tabpanel"
      aria-labelledby="fyp-tab-cursor"
    >
      <p>
        <a class="fyp-install-link" :href="CURSOR_INSTALL_LINK">Add to Cursor</a>
      </p>
      <p class="fyp-client-tabs__note">
        Opens Cursor and asks before installing. Prefer to edit the file yourself? Add this to your user
        <code>mcp.json</code> (Cursor Settings → MCP):
      </p>
      <CodeSnippet :code="CURSOR_MCP_JSON" language="json" />
      <p class="fyp-client-tabs__note">
        Then restart Cursor or reload MCP servers. You should see six tools. Remote HTTP MCP needs a recent
        Cursor build.
      </p>
    </div>

    <div
      v-show="active === 'claude'"
      id="fyp-panel-claude"
      class="fyp-client-tabs__panel"
      role="tabpanel"
      aria-labelledby="fyp-tab-claude"
    >
      <p><strong>Claude Code</strong> — one command:</p>
      <CodeSnippet :code="CLAUDE_CODE_ADD_COMMAND" language="bash" />
      <p>
        <strong>Claude Desktop and claude.ai</strong> — add the server as a custom connector, not in the config
        file:
      </p>
      <ol class="fyp-client-tabs__steps">
        <li>Open <strong>Customize → Connectors</strong> and choose <strong>Add custom connector</strong>.</li>
        <li>Name it <code>feel-your-protocol</code> and paste the URL below.</li>
        <li>Leave authentication empty — the server needs no key.</li>
      </ol>
      <CodeSnippet :code="FYP_MCP_URL" language="url" />
      <p class="fyp-client-tabs__note">
        Claude connects to remote servers from Anthropic’s cloud, and custom connectors depend on your plan.
        Do not put a <code>url</code> entry into <code>claude_desktop_config.json</code> — that file is for
        local servers only.
      </p>
    </div>

    <div
      v-show="active === 'codex'"
      id="fyp-panel-codex"
      class="fyp-client-tabs__panel"
      role="tabpanel"
      aria-labelledby="fyp-tab-codex"
    >
      <p>One command (works for the Codex CLI, IDE extension, and desktop app, which share config):</p>
      <CodeSnippet :code="CODEX_ADD_COMMAND" language="bash" />
      <p class="fyp-client-tabs__note">
        Or add this to <code>~/.codex/config.toml</code> (or a trusted project’s
        <code>.codex/config.toml</code>):
      </p>
      <CodeSnippet :code="CODEX_CONFIG_TOML" language="toml" />
    </div>

    <div
      v-show="active === 'other'"
      id="fyp-panel-other"
      class="fyp-client-tabs__panel"
      role="tabpanel"
      aria-labelledby="fyp-tab-other"
    >
      <p>Any host that supports remote MCP over HTTP can use these values:</p>
      <table class="fyp-client-tabs__table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>URL</td>
            <td>
              <code>{{ FYP_MCP_URL }}</code>
            </td>
          </tr>
          <tr>
            <td>Transport</td>
            <td>Streamable HTTP</td>
          </tr>
          <tr>
            <td>Auth at launch</td>
            <td>none</td>
          </tr>
        </tbody>
      </table>
      <p class="fyp-client-tabs__note">
        Config formats differ per host, so check your client’s MCP documentation for where these go.
      </p>
    </div>
  </div>
</template>

import { globalIgnores } from 'eslint/config'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pluginCypress from 'eslint-plugin-cypress'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'docs/.vitepress/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    name: 'app/import-sort',
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': ['error', {
        groups: [
          // 1) External packages (anything not starting with . or @/)
          ['^[^.@]', '^@(?!/)'],
          // 2) Internal @/ alias imports
          ['^@/'],
          // 3) Local ./  and ../ relative imports
          ['^\\.'],
        ],
      }],
      'simple-import-sort/exports': 'error',
    },
  },

  {
    name: 'app/sorted-tags-enum',
    files: ['src/explorations/TAGS.ts'],
    plugins: {
      custom: {
        rules: {
          'sorted-enum-members': {
            meta: { type: 'suggestion', messages: { unsorted: 'Enum members must be sorted alphabetically. "{{current}}" should come after "{{previous}}", not before.' } },
            create(context: { report: (descriptor: Record<string, unknown>) => void }) {
              return {
                TSEnumDeclaration(node: { members: Array<{ id: { type: string; name?: string; value?: string } }> }) {
                  const names = node.members.map((m) =>
                    m.id.type === 'Identifier' ? m.id.name! : String(m.id.value),
                  )
                  for (let i = 1; i < names.length; i++) {
                    if (names[i].localeCompare(names[i - 1]) < 0) {
                      context.report({
                        node: node.members[i],
                        messageId: 'unsorted',
                        data: { current: names[i], previous: names[i - 1] },
                      })
                    }
                  }
                },
              }
            },
          },
        },
      },
    },
    rules: {
      'custom/sorted-enum-members': 'error',
    },
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },
  
  {
    ...pluginCypress.configs.recommended,
    files: [
      'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
      'cypress/support/**/*.{js,ts,jsx,tsx}'
    ],
  },
  skipFormatting,
)

import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'

import { COVER_COLUMN_IMAGE_HEIGHT } from '@/explorations/layout'
import { Tag } from '@/explorations/TAGS'

import { CANONICAL } from './canonical'
import { DEFAULT_SCENARIO_ID, examples } from './examples'
import { INFO } from './info'
import MyC from './MyC.vue'
import { buildDeploymentInitcode, runScenario } from './run'
import {
  getScenario,
  GLAMSTERDAM_INITCODE_LIMIT,
  GLAMSTERDAM_RUNTIME_LIMIT,
  LEGACY_INITCODE_LIMIT,
  LEGACY_RUNTIME_LIMIT,
  SCENARIO_ORDER,
} from './scenarios'

describe('EIP-7954 contract-size exploration', () => {
  it('defines the approved UX limit twin and Contracts tag', () => {
    expect(CANONICAL.question.changeNature).toBe('limit')
    expect(CANONICAL.taxonomy.topic).toBe('ux')
    expect(CANONICAL.taxonomy.tags).toContain(Tag.Contracts)
    expect(CANONICAL.taxonomy.timeline).toBe('glamsterdam')
    expect(CANONICAL.mcp.shapes).toEqual(['transaction'])
    expect(CANONICAL.mcp.docsStatus).toBe('runnable')
    expect(CANONICAL.mcp.comparison).toEqual(
      expect.objectContaining({
        baselineForkId: 'fusaka',
        previewForkId: 'glamsterdam',
      }),
    )
  })

  it('wires website metadata and the cover-only layout', () => {
    expect(INFO.id).toBe('eip-7954')
    expect(INFO.path).toBe('/eip-7954-contract-size-limit')
    expect(INFO.topic).toBe('ux')
    expect(INFO.tags).toContain(Tag.Contracts)
    expect(INFO.coreQuestion).toBe(CANONICAL.question.coreQuestion)
    expect(INFO.introText).toContain(CANONICAL.question.coreQuestion)
    expect(INFO.imageBoxHeight).toBe(COVER_COLUMN_IMAGE_HEIGHT)
    expect(INFO.rightPanel).toBeUndefined()
  })

  it('orders four boundary stories with the old wall first', () => {
    expect(Object.keys(examples)).toEqual([...SCENARIO_ORDER])
    expect(DEFAULT_SCENARIO_ID).toBe('01-runtime-old-wall')
    expect(getScenario(DEFAULT_SCENARIO_ID).sizeBytes).toBe(LEGACY_RUNTIME_LIMIT + 1)
    expect(getScenario('04-initcode-old-wall').sizeBytes).toBe(LEGACY_INITCODE_LIMIT + 1)
  })

  it('rejects unknown scenarios with a useful error', () => {
    expect(() => getScenario('')).toThrow(/Unknown EIP-7954 scenario/)
    expect(() => getScenario('not-a-scenario')).toThrow(/Unknown EIP-7954 scenario/)
  })

  it('builds compact runtime-producing initcode and bounded literal initcode', () => {
    expect(buildDeploymentInitcode('runtime-code', LEGACY_RUNTIME_LIMIT + 1)).toHaveLength(36)
    expect(buildDeploymentInitcode('initcode', LEGACY_INITCODE_LIMIT + 1)).toHaveLength(
      LEGACY_INITCODE_LIMIT + 1,
    )
  })

  it('rejects malformed and excessive sizes before allocating', () => {
    for (const value of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() => buildDeploymentInitcode('runtime-code', value)).toThrow(/positive whole number/)
    }
    expect(() => buildDeploymentInitcode('runtime-code', GLAMSTERDAM_RUNTIME_LIMIT + 2)).toThrow(
      /no larger/,
    )
    expect(() => buildDeploymentInitcode('initcode', GLAMSTERDAM_INITCODE_LIMIT + 2)).toThrow(
      /no larger/,
    )
  })

  it('deploys one byte beyond the old runtime wall only on Glamsterdam', async () => {
    const result = await runScenario('01-runtime-old-wall')
    expect(result.fusaka.accepted).toBe(false)
    expect(result.fusaka.error).toBe('runtime code exceeds the limit')
    expect(result.glamsterdam.accepted).toBe(true)
    expect(result.glamsterdam.deployedCodeBytes).toBe(LEGACY_RUNTIME_LIMIT + 1)
  })

  it('accepts the new runtime ceiling and rejects one byte beyond it', async () => {
    const edge = await runScenario('02-runtime-new-ceiling')
    const beyond = await runScenario('03-runtime-too-large')
    expect(edge.glamsterdam.accepted).toBe(true)
    expect(edge.glamsterdam.deployedCodeBytes).toBe(GLAMSTERDAM_RUNTIME_LIMIT)
    expect(beyond.fusaka.accepted).toBe(false)
    expect(beyond.glamsterdam.accepted).toBe(false)
  })

  it('moves the separate initcode boundary on Glamsterdam', async () => {
    const result = await runScenario('04-initcode-old-wall')
    expect(result.fusaka.accepted).toBe(false)
    expect(result.fusaka.error).toBe('initcode exceeds the limit')
    expect(result.glamsterdam.accepted).toBe(true)
    expect(result.glamsterdam.deployedCodeBytes).toBe(0)
  })

  it('mounts the default story with a stable idle result shell', async () => {
    document.body.innerHTML = '<div id="root"></div>'
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div />' } }],
    })
    await router.push('/')

    const wrapper = mount(MyC, {
      attachTo: document.getElementById('root')!,
      global: {
        plugins: [router],
        stubs: {
          ExplorationC: { template: '<div><slot name="content" /></div>' },
          PoweredByC: true,
        },
      },
    })
    await flushPromises()

    expect(wrapper.find('[data-testid="run-deployment"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('24 KiB + 1')
    expect(wrapper.text()).toContain('Fusaka 24 KiB')
    expect(wrapper.text()).toContain('Glamsterdam 64 KiB')
    expect(wrapper.find('[data-testid="deployment-results"]').attributes('data-has-run')).toBe(
      'false',
    )
    expect(wrapper.find('[data-testid="outcome-fusaka"]').text()).toBe('Run to test')
  })
})

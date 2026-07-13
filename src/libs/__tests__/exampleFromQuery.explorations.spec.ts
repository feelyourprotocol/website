import { describe, expect, it } from 'vitest'

import {
  DEFAULT_EXAMPLE as eip7594Default,
  examples as eip7594Examples,
} from '@/explorations/eip-7594/examples'
import { config as eip7883Config } from '@/explorations/eip-7883/config'
import { examples as eip7883Examples } from '@/explorations/eip-7883/examples'
import {
  DEFAULT_SCENARIO_ID as eip7928Default,
  examples as eip7928Examples,
} from '@/explorations/eip-7928/examples'
import { config as eip7951Config } from '@/explorations/eip-7951/config'
import { examples as eip7951Examples } from '@/explorations/eip-7951/examples'
import { config as eip8024Config } from '@/explorations/eip-8024/config'
import { examples as eip8024Examples } from '@/explorations/eip-8024/examples'
import { resolveInitialExample } from '@/libs/exampleFromQuery'

/** Every live exploration and its default example key. */
const EXPLORATION_EXAMPLE_SETS = [
  { id: 'eip-7594', defaultKey: eip7594Default, examples: eip7594Examples },
  { id: 'eip-7883', defaultKey: eip7883Config.defaultExample, examples: eip7883Examples },
  { id: 'eip-7928', defaultKey: eip7928Default, examples: eip7928Examples },
  { id: 'eip-7951', defaultKey: eip7951Config.defaultExample, examples: eip7951Examples },
  { id: 'eip-8024', defaultKey: eip8024Config.defaultExample, examples: eip8024Examples },
] as const

describe('?example= query param across explorations', () => {
  for (const { id, defaultKey, examples } of EXPLORATION_EXAMPLE_SETS) {
    describe(`exploration ${id}`, () => {
      it('default example key exists in examples', () => {
        expect(examples[defaultKey]).toBeDefined()
      })

      it('loads default when query is absent', () => {
        expect(resolveInitialExample(examples, defaultKey)).toBe(defaultKey)
      })

      it('loads each example key from ?example= query', () => {
        for (const key of Object.keys(examples)) {
          expect(resolveInitialExample(examples, defaultKey, key)).toBe(key)
        }
      })

      it('ignores invalid ?example= and falls back to default', () => {
        expect(resolveInitialExample(examples, defaultKey, '__invalid__')).toBe(defaultKey)
      })
    })
  }
})

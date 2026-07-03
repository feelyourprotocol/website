import { describe, expect, it } from 'vitest'

import {
  EXAMPLE_QUERY_PARAM,
  parseExampleQueryParam,
  resolveInitialExample,
} from '../exampleFromQuery'

const examples = {
  dupn: { title: 'DUPN', values: ['aa'] },
  swapn: { title: 'SWAPN', values: ['bb'] },
}

describe('parseExampleQueryParam', () => {
  it('returns undefined for missing or empty values', () => {
    expect(parseExampleQueryParam(undefined)).toBeUndefined()
    expect(parseExampleQueryParam('')).toBeUndefined()
    expect(parseExampleQueryParam('   ')).toBeUndefined()
  })

  it('returns the string for valid example keys', () => {
    expect(parseExampleQueryParam('dupn')).toBe('dupn')
    expect(parseExampleQueryParam('invalid-dupn')).toBe('invalid-dupn')
  })

  it('does not coerce non-string query values', () => {
    expect(parseExampleQueryParam(['dupn'])).toBeUndefined()
    expect(parseExampleQueryParam(1)).toBeUndefined()
  })
})

describe('resolveInitialExample', () => {
  it('uses defaultExample when query is absent', () => {
    expect(resolveInitialExample(examples, 'dupn')).toBe('dupn')
  })

  it('uses query example when it exists in examples', () => {
    expect(resolveInitialExample(examples, 'dupn', 'swapn')).toBe('swapn')
  })

  it('falls back to defaultExample when query example is unknown', () => {
    expect(resolveInitialExample(examples, 'dupn', 'not-a-key')).toBe('dupn')
  })

  it('falls back to first key when defaultExample is also invalid', () => {
    expect(resolveInitialExample(examples, 'missing-default', 'also-missing')).toBe('dupn')
  })
})

describe('EXAMPLE_QUERY_PARAM', () => {
  it('is the documented query key', () => {
    expect(EXAMPLE_QUERY_PARAM).toBe('example')
  })
})

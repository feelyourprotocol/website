import { describe, expect, it } from 'vitest'

import { eipLabelFromId, formatSpecDate, testReleaseNameFromUrl } from '@/libs/specSnapshot'

describe('formatSpecDate', () => {
  it('formats a UTC calendar day without a leading zero on the day', () => {
    expect(formatSpecDate('2026-07-10')).toBe('10 Jul 2026')
    expect(formatSpecDate('2026-01-20')).toBe('20 Jan 2026')
    expect(formatSpecDate('2026-08-04')).toBe('4 Aug 2026')
  })

  it('rejects junk and out-of-range months', () => {
    expect(formatSpecDate('not-a-date')).toBeUndefined()
    expect(formatSpecDate('2026-13-01')).toBeUndefined()
    expect(formatSpecDate('')).toBeUndefined()
  })
})

describe('testReleaseNameFromUrl', () => {
  it('decodes the GitHub release tag from the URL', () => {
    expect(
      testReleaseNameFromUrl(
        'https://github.com/ethereum/execution-specs/releases/tag/tests-glamsterdam-devnet@v8.1.0',
      ),
    ).toBe('tests-glamsterdam-devnet@v8.1.0')
  })
})

describe('eipLabelFromId', () => {
  it('turns a folder id into an EIP label', () => {
    expect(eipLabelFromId('eip-7708')).toBe('EIP-7708')
  })
})

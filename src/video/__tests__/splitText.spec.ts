import { describe, expect, it } from 'vitest'

import { autoSplitText } from '../splitText'

describe('autoSplitText', () => {
  it('keeps short phrases in one hero segment', () => {
    const segs = autoSplitText('DUPN')
    expect(segs).toHaveLength(1)
    expect(segs[0]?.emphasis).toBe(true)
  })

  it('splits long sentences into staggered a/b slots', () => {
    const segs = autoSplitText('17 pushes — the stack is getting DEEP')
    expect(segs).toHaveLength(2)
    expect(segs[0]?.slot).toBe('a')
    expect(segs[1]?.slot).toBe('b')
    expect(segs[1]?.emphasis).toBe(true)
  })
})

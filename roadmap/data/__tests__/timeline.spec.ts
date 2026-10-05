import { describe, expect, it } from 'vitest'

import { groupTimeline, TIMELINE_EVENTS, TIMELINE_GROUPS, timelineSortKey } from '../timeline.ts'

describe('timeline', () => {
  it('sorts a month marker after the days in that month', () => {
    expect(timelineSortKey('2026-06').localeCompare(timelineSortKey('2026-06-06'))).toBeGreaterThan(0)
  })

  it('groups the story by quarter, oldest first, with launch week still ahead', () => {
    expect(TIMELINE_GROUPS.map((group) => group.label)).toEqual(['2025 Q3', '2026 Q2', '2026 Q3', '2026 Q4'])
    const june = TIMELINE_GROUPS[1].events.map((event) => event.id)
    expect(june.indexOf('bankr-token')).toBeLessThan(june.indexOf('twitter'))
    expect(june.indexOf('twitter')).toBeLessThan(june.indexOf('explorations'))

    const launch = TIMELINE_EVENTS.find((event) => event.id === 'launch-week')
    expect(launch?.done).toBeUndefined()
    expect(TIMELINE_EVENTS.filter((event) => event.id !== 'launch-week').every((event) => event.done)).toBe(true)
    expect(TIMELINE_EVENTS.some((event) => event.date === 'later')).toBe(false)
  })

  it('does not invent groups for an empty list', () => {
    expect(groupTimeline([])).toEqual([])
  })
})

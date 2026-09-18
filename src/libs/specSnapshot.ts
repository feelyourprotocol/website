const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

/** UTC calendar day from `YYYY-MM-DD` — does not use the local timezone. */
export function formatSpecDate(isoDate: string): string | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim())
  if (!match) return undefined
  const month = MONTHS[Number(match[2]) - 1]
  if (!month) return undefined
  const day = Number(match[3])
  if (day < 1 || day > 31) return undefined
  return `${day} ${month} ${match[1]}`
}

/** Last path segment of a GitHub release URL, decoded. */
export function testReleaseNameFromUrl(url: string): string {
  const last = url.split('/').filter(Boolean).pop()
  return last ? decodeURIComponent(last) : url
}

export function eipLabelFromId(id: string): string {
  return id.replace(/^eip-/i, 'EIP-')
}

export const SITE_VERSION = 'v0.2' as const

export type ChangelogEntry = {
  version: string
  summary: string
}

export const CHANGELOG: ChangelogEntry[] = [
  { version: 'v0.2', summary: 'New treasury section' },
  { version: 'v0.1', summary: 'Initial version' },
]

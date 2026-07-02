export const SITE_VERSION = 'v0.4' as const

export type ChangelogEntry = {
  version: string
  summary: string
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: 'v0.4',
    summary:
      'Phase 3 roadmap links in header and footer; intro updated for token-as-volume-discount framing; Draft badge removed',
  },
  {
    version: 'v0.3',
    summary:
      '“How it works” intro — Bankr, creator fees, and the FYP relationship; treasury simplified to work tracking only (pre-log removed)',
  },
  { version: 'v0.2', summary: 'New treasury section' },
  { version: 'v0.1', summary: 'Initial version' },
]

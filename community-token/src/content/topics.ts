/** Tabbed "How this works" content — good-faith framing with optional intro prose. */
export type GuidelineTab = {
  id: string
  tabLabel: string
  title: string
  intro?: string
  bullets: string[]
  status?: 'draft' | 'ready'
}

export const INTRO = {
  eyebrow: 'Community Token · In good faith',
  title: 'What you can expect',
  lead: 'This page explains how creator fees from the community token relate to Feel Your Protocol — so it is clear how I intend to handle things.',
  gratitude:
    'Thank you to everyone in the Bankr community who showed interest. This space exists so expectations stay clear on both sides.',
} as const

export const HOW_IT_WORKS = {
  title: 'How this works',
  subtitle: 'Scope, relationship, and the rest.',
  footnote: 'If anything here changes, the updates land on this page.',
} as const

export const GUIDELINE_TABS: GuidelineTab[] = [
  {
    id: 'scope',
    tabLabel: 'Scope',
    title: 'What I work on',
    intro: 'A bit on how I approach the work itself.',
    status: 'ready',
    bullets: [
      'This is a side project I run in my spare time.',
      'I decide what to work on, and how much time I put in.',
      'Token activity does not set my task list or my hours.',
      'Some of the funded time — up to around half — may go to EthereumJS work that supports FYP, like Amsterdam integrations and library upkeep.',
    ],
  },
  {
    id: 'relationship',
    tabLabel: 'Token Relationship',
    title: 'What this token is — and is not',
    intro: 'This token and Feel Your Protocol are related, but they are not the same thing.',
    status: 'ready',
    bullets: [
      'Launched independently by community members on Bankr — not issued or endorsed by me.',
      'Not an official financial product, security, or project equity.',
      'Feel Your Protocol remains an educational, open-source protocol exploration project.',
      'Holding or trading the token grants no ownership, voting rights, or claims on the code or repositories.',
    ],
  },
  {
    id: 'terms',
    tabLabel: 'Terms',
    title: 'Software & involvement',
    intro: 'A few things worth being upfront about.',
    status: 'ready',
    bullets: [
      'Feel Your Protocol is experimental open-source software — provided as-is, without warranties.',
      'I may change direction, pause, or wind down development if circumstances change.',
      'Token price or trading volume does not drive what I build or when.',
      'This page is the reference — not a price promise or investment pitch, and I can not take on liability for market risk from holding the token.',
      'If development winds down, anything unspent would go to a charity or public-good cause — chosen by me, or by a community vote if there is interest in having a say.',
    ],
  },
  {
    id: 'community',
    tabLabel: 'Community',
    title: 'What helps — and what does not',
    intro: 'Community energy genuinely matters. Here is what it does and does not change.',
    status: 'ready',
    bullets: [
      'Curiosity, feedback, and trying out explorations are always welcome.',
      'Visibility and sharing help the project — they just do not buy a roadmap.',
      'Feel free to reach out on X (@HolgerD77) or via the Feel Your Protocol GitHub to contribute or ask questions.',
    ],
  },
]

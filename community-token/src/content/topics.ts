/** Tabbed guideline content — good-faith framing with optional intro prose. */
export type GuidelineTab = {
  id: string
  tabLabel: string
  title: string
  intro?: string
  bullets: string[]
  status?: 'draft' | 'ready'
}

export const INTRO = {
  eyebrow: 'Community Token · Feel Your Protocol',
  title: 'How it works',
  lead: 'Feel Your Protocol is about exploring where Ethereum heads next. A community token on Base is one way to take part in that work — not by buying project equity, but by routing on-chain activity toward the open-source stack behind these explorations.',
  explainer: [
    'The token (FYP) was launched independently by community members on Bankr — a platform for deploying tokens on Base. I did not issue it, but I engage with it in good faith and document how I handle it here.',
    'When people buy, sell, or transfer the token, a portion of trading fees (creator fees) accrues to a claimable balance. I use those fees — tracked in the Treasury section — to fund time on FYP explorations and related EthereumJS library work that keeps them running.',
    'New to this model? Think community-driven support for public-good Ethereum tooling: participation through market activity, not ownership of the code, a roadmap, or a promise of returns.',
  ],
  gratitude:
    'Thank you to everyone in the Bankr community who showed interest. This page exists so expectations stay clear on both sides.',
} as const

export const HOW_IT_WORKS = {
  title: 'Guidelines',
  subtitle: 'Scope, relationship, terms, and community.',
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
      'This is not the only project I have and time I can put in will vary.',
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
      "Launched independently by community members on Bankr — I didn't issue it, but I've chosen to engage with it in good faith.",
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

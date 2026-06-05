/** Guideline tabs — short labels for navigation, bullets for scannable copy. */
export type GuidelineTab = {
  id: string
  tabLabel: string
  title: string
  bullets: string[]
  status?: 'draft' | 'ready'
}

export const INTRO = {
  eyebrow: 'Community Token Guidelines',
  title: 'A clear middle ground',
  lead: 'This page explains how the independently launched community token relates to Feel Your Protocol — what it is, what it is not, and how development may be funded.',
  gratitude:
    'Thank you to everyone in the Bankr community who showed interest in the project. This space exists so expectations stay transparent on both sides.',
} as const

export const GUIDELINE_TABS: GuidelineTab[] = [
  {
    id: 'relationship',
    tabLabel: 'Relationship',
    title: 'What this token is — and is not',
    status: 'ready',
    bullets: [
      'Launched independently by community members on Bankr — not by the Feel Your Protocol developer.',
      'Not an official financial product, security, or project equity.',
      'Feel Your Protocol stays an educational, open-source exploration project.',
      'Holding or trading the token does not give voting rights, ownership, or legal claims on the code or repositories.',
    ],
  },
  {
    id: 'funding',
    tabLabel: 'Funding',
    title: 'How trading fees may support the work',
    status: 'ready',
    bullets: [
      'Organic creator fees from Bankr pool activity may flow into a Developer Fund.',
      'That fund can help pay for maintenance, updates, and protocol research.',
      'Compensated work is logged at a flat $50 USD per hour.',
      'Development stays voluntary and part-time — no fixed roadmap, deadlines, or full-time promise.',
    ],
  },
  {
    id: 'terms',
    tabLabel: 'Terms',
    title: 'How the software itself is handled',
    status: 'ready',
    bullets: [
      'Feel Your Protocol is experimental open-source software — provided as-is.',
      'The developer may change direction, pause, or stop work at any time.',
      'Token price or trading volume does not dictate development priorities.',
      'No liability for market swings or financial risk from holding the token.',
    ],
  },
  {
    id: 'community',
    tabLabel: 'Community',
    title: 'What we can realistically expect from each other',
    status: 'draft',
    bullets: [
      'Curiosity, feedback, and trying explorations are always welcome.',
      'Community energy helps visibility — it does not buy a product roadmap.',
      'More detail on channels and how to reach out — coming in a follow-up pass.',
    ],
  },
  {
    id: 'transparency',
    tabLabel: 'Transparency',
    title: 'How we keep this page honest',
    status: 'draft',
    bullets: [
      'Changes to these guidelines will be posted here.',
      'Major fund or claim decisions will be shared when they happen.',
      'This page is the reference — not a price promise or investment pitch.',
    ],
  },
]

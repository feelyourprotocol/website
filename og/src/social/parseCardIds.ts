import { SOCIAL_CARD_IDS, type SocialCardId } from './cardIds.ts'

/** Resolve CLI args to card ids (`all` or empty → every card). */
export function parseSocialCardIds(args: string[]): SocialCardId[] {
  if (args.length === 0 || args.includes('all')) return [...SOCIAL_CARD_IDS]
  const ids = args.filter((a): a is SocialCardId =>
    (SOCIAL_CARD_IDS as readonly string[]).includes(a),
  )
  if (ids.length === 0) {
    throw new Error(`Unknown card id(s). Use: ${SOCIAL_CARD_IDS.join(', ')}, or all`)
  }
  return ids
}

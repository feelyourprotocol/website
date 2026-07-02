/**
 * Re-export card ids from the social preview app — single source of truth.
 * Capture tooling and Vue preview must stay in sync.
 */
export {
  isSocialCardId,
  SOCIAL_CARD_IDS,
  type SocialCardId,
} from '../../../roadmap/social/src/cards.ts'

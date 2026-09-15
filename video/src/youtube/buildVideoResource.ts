import {
  SCIENCE_TECHNOLOGY_CATEGORY_ID,
  type YoutubePrivacy,
  type YoutubeShortMeta,
} from './types.ts'

export interface YoutubeVideoResource {
  snippet: {
    title: string
    description: string
    tags: string[]
    categoryId: string
  }
  status: {
    privacyStatus: YoutubePrivacy
    selfDeclaredMadeForKids: false
  }
}

export function buildVideoResource(
  meta: YoutubeShortMeta,
  privacy: YoutubePrivacy,
): YoutubeVideoResource {
  return {
    snippet: {
      title: meta.title,
      description: meta.description,
      tags: meta.tags,
      categoryId: SCIENCE_TECHNOLOGY_CATEGORY_ID,
    },
    status: {
      privacyStatus: privacy,
      selfDeclaredMadeForKids: false,
    },
  }
}

export function buildPlaylistItemResource(playlistId: string, videoId: string) {
  return {
    snippet: {
      playlistId,
      resourceId: {
        kind: 'youtube#video',
        videoId,
      },
    },
  }
}

export function buildPrivacyUpdate(videoId: string, privacy: YoutubePrivacy) {
  return {
    id: videoId,
    status: {
      privacyStatus: privacy,
      selfDeclaredMadeForKids: false,
    },
  }
}

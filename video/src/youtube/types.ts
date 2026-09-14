export const YOUTUBE_YML_SCHEMA = 'video-short-youtube/v1'

/** YouTube category id for “Science & Technology”. */
export const SCIENCE_TECHNOLOGY_CATEGORY_ID = '28'

export const YOUTUBE_SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
] as const

export type YoutubePrivacy = 'public' | 'unlisted' | 'private'

export interface YoutubeThumbnailMeta {
  file: string
  width?: number
  time_sec?: number
  source?: string
}

export interface YoutubeSourcesMeta {
  exploration_url: string
  spec_url: string
  forkcast_url: string | null
}

export interface YoutubePublishedMeta {
  video_id: string
  url: string
  privacy: YoutubePrivacy
  uploaded_at: string
}

export interface YoutubeShortMeta {
  schema: string
  id: string
  title: string
  description: string
  tags: string[]
  category: string
  playlist: string
  thumbnail: YoutubeThumbnailMeta
  sources: YoutubeSourcesMeta
  published?: YoutubePublishedMeta
}

export interface YoutubeClientConfig {
  clientId: string
  clientSecret: string
  refreshToken: string
}

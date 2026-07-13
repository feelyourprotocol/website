export type VideoOverlayType =
  | 'title-card'
  | 'outro-card'
  | 'punch'
  | 'split'
  | 'callout'
  | 'list-flash'
  | 'banner'
  /** @deprecated use title-card / punch / split */
  | 'title'
  | 'body'
  | 'highlight'
  | 'list'
  | 'outro'

/** Where floating overlays sit so they avoid the focus area on screen. */
export type VideoOverlayPlacement = 'top-banner' | 'bottom-banner' | 'top' | 'center' | 'bottom'

export interface VideoTheme {
  bg: string
  text: string
  accent: string
  badgeBg?: string
}

export type VideoSegmentSize = 'md' | 'lg' | 'xl' | 'hero'

export interface VideoTextSegment {
  text: string
  size?: VideoSegmentSize
  /** Accent color + display font */
  emphasis?: boolean
  /** Stagger slot: a = upper-left, b = mid-right, c = lower-left */
  slot?: 'a' | 'b' | 'c'
}

export interface VideoOutroCta {
  label: string
  url: string
  /** Secondary CTAs render ~⅓ smaller (e.g. Forkcast vs FYP). */
  variant?: 'primary' | 'secondary'
}

export interface VideoFocusAreaRef {
  selector: string
}

export type AnnotationCalloutSide = 'top' | 'bottom' | 'left' | 'right'

/** UI guide callout — points at an exploration region (parallel to story overlays). */
export interface VideoAnnotationDefinition {
  id: string
  /** Zone key from focusAreas or raw CSS selector */
  target: string
  label: string
  hint?: string
  side?: AnnotationCalloutSide | 'auto'
}

/** Climax mark — translucent area box over a text cell or UI element. */
export interface VideoHighlightMarkDefinition {
  target: string
  /** Uniform padding (px) when padX / padY omitted. */
  pad?: number
  padX?: number
  padY?: number
  /** @deprecated No longer used. */
  tilt?: number
  /** @deprecated Labels removed — marker-only highlights. */
  label?: string
}

export interface VideoHighlightSetDefinition {
  id: string
  marks: VideoHighlightMarkDefinition[]
}

export interface VideoOverlayDefinition {
  type: VideoOverlayType
  id: string
  duration?: number
  /** Default placement when playbook step does not override */
  placement?: VideoOverlayPlacement
  /** banner / compact split — single bar instead of scattered boxes */
  layout?: 'banner' | 'scatter'
  /** title-card */
  eyebrow?: string
  title?: string
  subtitle?: string
  hook?: string[]
  /** punch / banner */
  text?: string
  sub?: string
  position?: 'top' | 'center' | 'bottom'
  invert?: boolean
  /** split / callout — explicit segments (preferred) */
  segments?: VideoTextSegment[]
  /** list-flash */
  headline?: string
  items?: string[]
  /** outro-card */
  closing?: string
  ctas?: VideoOutroCta[]
  primary?: string
  cta?: string
  secondary?: string
  /** legacy */
  lines?: string[]
  question?: string
}

export interface VideoContentConfig {
  explorationId: string
  theme?: VideoTheme
  overlays: Record<string, VideoOverlayDefinition>
  annotations?: Record<string, VideoAnnotationDefinition>
  highlightSets?: Record<string, VideoHighlightSetDefinition>
  focusAreas?: Record<string, VideoFocusAreaRef>
}

export interface ActiveVideoHighlightSet {
  id: string
  marks: VideoHighlightMarkDefinition[]
}

export interface ActiveVideoAnnotation {
  id: string
  definition: VideoAnnotationDefinition
}

export interface ActiveVideoOverlay {
  id: string
  definition: VideoOverlayDefinition
  placement?: VideoOverlayPlacement
}

export interface ShowOverlayOptions {
  placement?: VideoOverlayPlacement
}

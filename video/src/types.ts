/** Mirrors src/video/types.ts — kept in the isolated package for playbook tooling. */

export type VideoOverlayType =
  | 'title-card'
  | 'outro-card'
  | 'punch'
  | 'split'
  | 'callout'
  | 'list-flash'
  | 'banner'
  /** @deprecated */
  | 'title'
  | 'list'
  | 'outro'

export type VideoOverlayPlacement =
  | 'top-banner'
  | 'bottom-banner'
  | 'top'
  | 'center'
  | 'bottom'

export interface VideoTheme {
  bg: string
  text: string
  accent: string
  badgeBg?: string
}

export interface VideoTextSegment {
  text: string
  size?: 'md' | 'lg' | 'xl' | 'hero'
  emphasis?: boolean
  slot?: 'a' | 'b' | 'c'
}

export interface VideoOutroCta {
  label: string
  url: string
  variant?: 'primary' | 'secondary'
}

export interface VideoFocusAreaRef {
  selector: string
}

export type AnnotationCalloutSide = 'top' | 'bottom' | 'left' | 'right'

export interface VideoAnnotationDefinition {
  id: string
  target: string
  label: string
  hint?: string
  side?: AnnotationCalloutSide | 'auto'
}

export interface VideoHighlightMarkDefinition {
  target: string
  pad?: number
  tilt?: number
  /** @deprecated Labels removed — marker-only highlights */
  label?: string
}

export interface VideoHighlightSetDefinition {
  id: string
  marks: VideoHighlightMarkDefinition[]
}

export interface VideoOverlayDefinition {
  type: VideoOverlayType
  id: string
  placement?: VideoOverlayPlacement
  layout?: 'banner' | 'scatter'
  eyebrow?: string
  title?: string
  subtitle?: string
  hook?: string[]
  text?: string
  sub?: string
  position?: 'top' | 'center' | 'bottom'
  invert?: boolean
  segments?: VideoTextSegment[]
  headline?: string
  items?: string[]
  primary?: string
  cta?: string
  secondary?: string
  closing?: string
  ctas?: VideoOutroCta[]
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

export interface PlaybookStepAction {
  count?: number
  interval?: number
  /** 1-based step index to enter slow-mo + optional highlightSet */
  climaxFrom?: number
  climaxInterval?: number
  /** Pause before the first climax step (anticipation beat) */
  climaxPauseMs?: number
  highlightSet?: string
  /** Switch highlights after this step number completes */
  highlightAfterStep?: number
  highlightSetAfter?: string
  /** Extra hold after payoff highlights (ms) */
  holdAfterClimaxMs?: number
}

export interface PlaybookStep {
  /** Story beat label (for storyboard / validation) */
  beat?: string
  overlay?: string
  /** UI guide callout id — stays visible through reveal while story overlay may hide */
  annotate?: string
  /** Per-step placement override */
  placement?: VideoOverlayPlacement
  /** Exploration UI region to keep visible (see zones.json) */
  focus?: string
  /** Read time in ms — overlay stays up so the viewer can read before actions */
  cue?: number
  hideOverlay?: boolean
  /** Hold time in ms after actions (or after cue when overlay-only) */
  wait?: number
  selectExample?: string
  step?: number | PlaybookStepAction
  scroll?: { selector: string; y?: number }
  expandCompanion?: 'half' | 'full'
  click?: string
}

export interface PlaybookConfig {
  format?: 'shorts' | 'shorts-preview'
  exploration: string
  defaultExample?: string
  steps: PlaybookStep[]
}

export interface ContentFile {
  meta: {
    exploration: string
    defaultExample?: string
  }
  overlays: Record<string, Omit<VideoOverlayDefinition, 'id'> & { type: VideoOverlayType }>
  annotations?: Record<string, Omit<VideoAnnotationDefinition, 'id'>>
  highlightSets?: Record<string, Omit<VideoHighlightSetDefinition, 'id'>>
}

export interface FocusAreaDef {
  selector: string
  description?: string
}

export interface PlacementDef {
  anchor: 'top' | 'bottom'
  insetPx: number
  maxHeightPx: number
  description?: string
}

export interface ZonesFile {
  format: { width: number; height: number }
  focusAreas: Record<string, FocusAreaDef>
  placements: Record<string, PlacementDef>
}

export interface LoadedVideoProject {
  projectId: string
  projectDir: string
  content: VideoContentConfig
  playbook: PlaybookConfig
  zones?: ZonesFile
  explorationPath: string
}

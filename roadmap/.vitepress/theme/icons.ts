import type { Component } from 'vue'
import {
  ArrowsRightLeftIcon,
  BanknotesIcon,
  BeakerIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  CommandLineIcon,
  CpuChipIcon,
  CubeIcon,
  DocumentTextIcon,
  InboxArrowDownIcon,
  MapIcon,
  NoSymbolIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Square3Stack3DIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline'

/** Outline Heroicons shared by roadmap essay components. */
export const ROADMAP_ICONS = {
  spark: SparklesIcon,
  cube: CubeIcon,
  book: BookOpenIcon,
  terminal: CommandLineIcon,
  people: UserGroupIcon,
  chip: CpuChipIcon,
  beaker: BeakerIcon,
  stack: Square3Stack3DIcon,
  shield: ShieldCheckIcon,
  scale: ScaleIcon,
  inbox: InboxArrowDownIcon,
  trace: DocumentTextIcon,
  boundary: NoSymbolIcon,
  calendar: CalendarDaysIcon,
  split: ArrowsRightLeftIcon,
  map: MapIcon,
  token: BanknotesIcon,
} as const satisfies Record<string, Component>

export type RoadmapIconId = keyof typeof ROADMAP_ICONS

export function roadmapIcon(icon: string): Component | undefined {
  return ROADMAP_ICONS[icon as RoadmapIconId]
}

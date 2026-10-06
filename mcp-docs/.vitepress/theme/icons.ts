import type { Component } from 'vue'
import {
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  BeakerIcon,
  BoltIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  CommandLineIcon,
  CpuChipIcon,
  CubeIcon,
  DocumentTextIcon,
  InboxArrowDownIcon,
  MapIcon,
  NoSymbolIcon,
  ScaleIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Square3Stack3DIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline'

/** Outline Heroicons for MCP docs components (same ids as the roadmap set). */
export const MCP_ICONS = {
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
  check: CheckCircleIcon,
  bolt: BoltIcon,
  arrow: ArrowRightIcon,
  clock: ClockIcon,
  server: ServerStackIcon,
} as const satisfies Record<string, Component>

export type McpIconId = keyof typeof MCP_ICONS

export function mcpIcon(icon: string): Component | undefined {
  return MCP_ICONS[icon as McpIconId]
}

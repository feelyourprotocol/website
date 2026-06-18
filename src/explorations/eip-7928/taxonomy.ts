import type { Component } from 'vue'
import {
  BanknotesIcon,
  CubeIcon,
  HashtagIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from '@heroicons/vue/24/outline'

/** BAL JSON field each trigger group maps from (internal only — never shown in UI). */
export type BalSourceField =
  | 'balanceChanges'
  | 'nonceChanges'
  | 'codeChanges'
  | 'storageChanges'
  | 'storageReads'

export type TriggerGroupId =
  | 'valueFlow'
  | 'counterTicks'
  | 'contractBirths'
  | 'stateImprints'
  | 'statePeeks'

/** Literal Tailwind classes (scanner-visible) for one trigger group. */
export interface TriggerGroupClasses {
  bgItem: string
  bg: string
  border: string
  borderCard: string
  text: string
  accent: string
  ring: string
  jsonTint: string
  jsonActive: string
}

export interface TriggerGroupDefinition {
  id: TriggerGroupId
  name: string
  triggerLabel: string
  sourceField: BalSourceField
  icon: Component
  classes: TriggerGroupClasses
}

export const TRIGGER_GROUPS: TriggerGroupDefinition[] = [
  {
    id: 'valueFlow',
    name: 'Value Flow',
    triggerLabel: 'value transfer',
    sourceField: 'balanceChanges',
    icon: BanknotesIcon,
    classes: {
      bgItem: 'bg-green-50',
      bg: 'bg-green-100',
      border: 'border-green-200',
      borderCard: 'border-green-400',
      text: 'text-green-800',
      accent: 'text-green-600',
      ring: 'ring-green-400',
      jsonTint: 'bg-green-50/80 border-green-200',
      jsonActive: 'bg-green-100 ring-2 ring-green-400 border-green-400',
    },
  },
  {
    id: 'counterTicks',
    name: 'Counter Ticks',
    triggerLabel: 'nonce bump',
    sourceField: 'nonceChanges',
    icon: HashtagIcon,
    classes: {
      bgItem: 'bg-blue-50',
      bg: 'bg-blue-100',
      border: 'border-blue-200',
      borderCard: 'border-blue-300',
      text: 'text-blue-800',
      accent: 'text-blue-600',
      ring: 'ring-blue-400',
      jsonTint: 'bg-blue-50/80 border-blue-200',
      jsonActive: 'bg-blue-100 ring-2 ring-blue-400 border-blue-400',
    },
  },
  {
    id: 'contractBirths',
    name: 'Contract Births',
    triggerLabel: 'CREATE / deploy',
    sourceField: 'codeChanges',
    icon: CubeIcon,
    classes: {
      bgItem: 'bg-purple-50',
      bg: 'bg-purple-100',
      border: 'border-purple-200',
      borderCard: 'border-purple-400',
      text: 'text-purple-800',
      accent: 'text-purple-600',
      ring: 'ring-purple-400',
      jsonTint: 'bg-purple-50/80 border-purple-200',
      jsonActive: 'bg-purple-100 ring-2 ring-purple-400 border-purple-400',
    },
  },
  {
    id: 'stateImprints',
    name: 'State Imprints',
    triggerLabel: 'SSTORE Opcode',
    sourceField: 'storageChanges',
    icon: PencilSquareIcon,
    classes: {
      bgItem: 'bg-orange-50',
      bg: 'bg-orange-100',
      border: 'border-orange-200',
      borderCard: 'border-orange-400',
      text: 'text-orange-800',
      accent: 'text-orange-600',
      ring: 'ring-orange-400',
      jsonTint: 'bg-orange-50/80 border-orange-200',
      jsonActive: 'bg-orange-100 ring-2 ring-orange-400 border-orange-400',
    },
  },
  {
    id: 'statePeeks',
    name: 'State Peeks',
    triggerLabel: 'SLOAD Opcode',
    sourceField: 'storageReads',
    icon: MagnifyingGlassIcon,
    classes: {
      bgItem: 'bg-yellow-50',
      bg: 'bg-yellow-100',
      border: 'border-yellow-200',
      borderCard: 'border-yellow-500',
      text: 'text-yellow-800',
      accent: 'text-yellow-600',
      ring: 'ring-yellow-400',
      jsonTint: 'bg-yellow-50/80 border-yellow-200',
      jsonActive: 'bg-yellow-100 ring-2 ring-yellow-400 border-yellow-500',
    },
  },
]

const GROUP_BY_FIELD = new Map<BalSourceField, TriggerGroupDefinition>(
  TRIGGER_GROUPS.map((g) => [g.sourceField, g]),
)

const GROUP_BY_ID = new Map<TriggerGroupId, TriggerGroupDefinition>(
  TRIGGER_GROUPS.map((g) => [g.id, g]),
)

export function getGroupByField(field: BalSourceField): TriggerGroupDefinition {
  const group = GROUP_BY_FIELD.get(field)
  if (group === undefined) {
    throw new Error(`No trigger group for field: ${field}`)
  }
  return group
}

export function getGroupById(id: TriggerGroupId): TriggerGroupDefinition {
  const group = GROUP_BY_ID.get(id)
  if (group === undefined) {
    throw new Error(`No trigger group: ${id}`)
  }
  return group
}

/** Stable path prefix for cross-highlight between cards and JSON view. */
export function balPathFor(
  address: string,
  field: BalSourceField,
  suffix: string,
): string {
  return `${address.toLowerCase()}/${field}/${suffix}`
}

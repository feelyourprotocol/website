import type { BALJSONBlockAccessList } from '@ethereumjs/util'

import {
  balPathFor,
  getGroupByField,
  TRIGGER_GROUPS,
  type TriggerGroupDefinition,
} from './taxonomy'

import type { PreStateAccount } from './scenarios/types'

export interface TransitionItem {
  summary: string
  address: string
  addressLabel: string
  balPath: string
  indexBadge: string
  groupId: TriggerGroupDefinition['id']
}

export interface TriggerGroupViewModel {
  group: TriggerGroupDefinition
  items: TransitionItem[]
}

function normalizeAddress(address: string): string {
  return address.toLowerCase()
}

function parseAccessIndex(hex: string): number {
  return Number(BigInt(hex))
}

export function formatIndexBadge(blockAccessIndex: string): string {
  const n = parseAccessIndex(blockAccessIndex)
  if (n === 0) return 'system'
  return `tx ${n}`
}

function hexToBigInt(hex: string): bigint {
  if (hex === '0x' || hex === '') return 0n
  return BigInt(hex)
}

export function formatEth(wei: bigint): string {
  if (wei === 0n) return '0 ETH'
  const eth = Number(wei) / 1e18
  if (eth >= 0.0001) {
    const formatted = eth.toLocaleString(undefined, { maximumFractionDigits: 6 })
    return `${formatted} ETH`
  }
  return `${wei.toLocaleString()} wei`
}

export function formatSlotValue(hex: string): string {
  if (hex === '0x' || hex === '0x0') return '0'
  try {
    const value = BigInt(hex)
    if (value <= 999_999_999_999n) return value.toString()
    return `0x…${hex.slice(-4)}`
  } catch {
    return hex
  }
}

export function formatShortSlot(slot: string): string {
  if (slot === '0x' || slot === '0x0') return '0x00…00'
  const trimmed = slot.replace(/^0x0+/, '0x') || '0x0'
  if (trimmed.length <= 10) return trimmed
  return `${trimmed.slice(0, 6)}…${trimmed.slice(-4)}`
}

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

function preStateByAddress(
  preState: PreStateAccount[],
): Map<string, PreStateAccount> {
  return new Map(preState.map((a) => [normalizeAddress(a.address), a]))
}

function getPreBalance(preStateMap: Map<string, PreStateAccount>, address: string): bigint {
  return preStateMap.get(normalizeAddress(address))?.balance ?? 0n
}

function getPreNonce(preStateMap: Map<string, PreStateAccount>, address: string): bigint {
  return preStateMap.get(normalizeAddress(address))?.nonce ?? 0n
}

function getPreStorage(
  preStateMap: Map<string, PreStateAccount>,
  address: string,
  slot: string,
): bigint {
  const account = preStateMap.get(normalizeAddress(address))
  if (account?.storage === undefined) return 0n
  const normalizedSlot = slot.toLowerCase()
  for (const [s, v] of account.storage) {
    if (s.toLowerCase() === normalizedSlot || normalizeSlotKey(s) === normalizeSlotKey(slot)) {
      return hexToBigInt(v)
    }
  }
  return 0n
}

export function normalizeSlotKey(slot: string): string {
  if (slot === '0x') return '0x0'
  try {
    return `0x${BigInt(slot).toString(16)}`
  } catch {
    return slot.toLowerCase()
  }
}

function buildBalanceItems(
  account: BALJSONBlockAccessList[number],
  preStateMap: Map<string, PreStateAccount>,
): TransitionItem[] {
  const group = getGroupByField('balanceChanges')
  const sorted = [...account.balanceChanges].sort(
    (a, b) => parseAccessIndex(a.blockAccessIndex) - parseAccessIndex(b.blockAccessIndex),
  )
  let previous = getPreBalance(preStateMap, account.address)

  return sorted.map((change, i) => {
    const post = hexToBigInt(change.postBalance)
    const summary = `${formatEth(previous)} → ${formatEth(post)}`
    previous = post
    return {
      summary,
      address: account.address,
      addressLabel: shortAddress(account.address),
      balPath: balPathFor(account.address, 'balanceChanges', String(i)),
      indexBadge: formatIndexBadge(change.blockAccessIndex),
      groupId: group.id,
    }
  })
}

function buildNonceItems(
  account: BALJSONBlockAccessList[number],
  preStateMap: Map<string, PreStateAccount>,
): TransitionItem[] {
  const group = getGroupByField('nonceChanges')
  const sorted = [...account.nonceChanges].sort(
    (a, b) => parseAccessIndex(a.blockAccessIndex) - parseAccessIndex(b.blockAccessIndex),
  )
  let previous = getPreNonce(preStateMap, account.address)

  return sorted.map((change, i) => {
    const post = hexToBigInt(change.postNonce)
    const summary = `nonce ${previous} → ${post}`
    previous = post
    return {
      summary,
      address: account.address,
      addressLabel: shortAddress(account.address),
      balPath: balPathFor(account.address, 'nonceChanges', String(i)),
      indexBadge: formatIndexBadge(change.blockAccessIndex),
      groupId: group.id,
    }
  })
}

function buildCodeItems(account: BALJSONBlockAccessList[number]): TransitionItem[] {
  const group = getGroupByField('codeChanges')
  return account.codeChanges.map((change, i) => {
    const byteLen = change.newCode === '0x' ? 0 : (change.newCode.length - 2) / 2
    return {
      summary: `deployed (${byteLen} bytes)`,
      address: account.address,
      addressLabel: shortAddress(account.address),
      balPath: balPathFor(account.address, 'codeChanges', String(i)),
      indexBadge: formatIndexBadge(change.blockAccessIndex),
      groupId: group.id,
    }
  })
}

function buildStorageChangeItems(
  account: BALJSONBlockAccessList[number],
  preStateMap: Map<string, PreStateAccount>,
): TransitionItem[] {
  const group = getGroupByField('storageChanges')
  const items: TransitionItem[] = []
  let pathIndex = 0

  for (const slotEntry of account.storageChanges) {
    const sorted = [...slotEntry.slotChanges].sort(
      (a, b) => parseAccessIndex(a.blockAccessIndex) - parseAccessIndex(b.blockAccessIndex),
    )
    let previous = getPreStorage(preStateMap, account.address, slotEntry.slot)

    for (const change of sorted) {
      const post = hexToBigInt(change.postValue)
      const summary = `slot ${formatShortSlot(slotEntry.slot)}: ${formatSlotValue(`0x${previous.toString(16)}`)} → ${formatSlotValue(change.postValue)}`
      previous = post
      items.push({
        summary,
        address: account.address,
        addressLabel: shortAddress(account.address),
        balPath: balPathFor(
          account.address,
          'storageChanges',
          `${normalizeSlotKey(slotEntry.slot)}/${pathIndex}`,
        ),
        indexBadge: formatIndexBadge(change.blockAccessIndex),
        groupId: group.id,
      })
      pathIndex++
    }
  }

  return items
}

function buildStorageReadItems(account: BALJSONBlockAccessList[number]): TransitionItem[] {
  const group = getGroupByField('storageReads')
  return account.storageReads.map((slot, i) => ({
    summary: `read slot ${formatShortSlot(slot)}`,
    address: account.address,
    addressLabel: shortAddress(account.address),
    balPath: balPathFor(account.address, 'storageReads', normalizeSlotKey(slot)),
    indexBadge: '',
    groupId: group.id,
  }))
}

/**
 * Build trigger-group view models from BAL JSON and scenario pre-state.
 * Groups with no items are included but marked empty (UI collapses them).
 */
export function buildTriggerGroups(
  balJson: BALJSONBlockAccessList,
  preState: PreStateAccount[],
): TriggerGroupViewModel[] {
  const preStateMap = preStateByAddress(preState)
  const itemsByField = new Map<
    TriggerGroupDefinition['sourceField'],
    TransitionItem[]
  >()

  for (const field of TRIGGER_GROUPS.map((g) => g.sourceField)) {
    itemsByField.set(field, [])
  }

  for (const account of balJson) {
    itemsByField.get('balanceChanges')!.push(...buildBalanceItems(account, preStateMap))
    itemsByField.get('nonceChanges')!.push(...buildNonceItems(account, preStateMap))
    itemsByField.get('codeChanges')!.push(...buildCodeItems(account))
    itemsByField.get('storageChanges')!.push(
      ...buildStorageChangeItems(account, preStateMap),
    )
    itemsByField.get('storageReads')!.push(...buildStorageReadItems(account))
  }

  return TRIGGER_GROUPS.map((group) => ({
    group,
    items: itemsByField.get(group.sourceField) ?? [],
  }))
}

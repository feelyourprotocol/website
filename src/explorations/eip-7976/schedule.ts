/**
 * Calldata floor quotes for the widget. Numbers come from the transaction
 * library so the rows match what a run charges.
 */
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import {
  countCalldataFloorTokens,
  createAccessList2930Tx,
  createLegacyTx,
  getCalldataFloorGas,
  type TypedTransaction,
} from '@ethereumjs/tx'
import { createAddressFromPrivateKey, hexToBytes } from '@ethereumjs/util'

export type ShapeId = 'zeros' | 'nonzeros' | 'busy' | 'access-list'
export type HardforkChoice = 'glamsterdam' | 'fusaka'

export const SHAPE_ORDER = [
  'zeros',
  'nonzeros',
  'busy',
  'access-list',
] as const satisfies readonly ShapeId[]

export const DATA_BYTES = 100

/**
 * Repeated adds, then a 32-byte return. The work is ordinary execution gas,
 * enough that the calldata floor loses on both forks.
 */
const BUSY_CHUNK = hexToBytes('0x600160010150')
const BUSY_TAIL = hexToBytes('0x600160005260206000f3')
const BUSY_REPEATS = 500

export const BUSY_CODE = (() => {
  const code = new Uint8Array(BUSY_CHUNK.length * BUSY_REPEATS + BUSY_TAIL.length)
  for (let i = 0; i < BUSY_REPEATS; i++) {
    code.set(BUSY_CHUNK, i * BUSY_CHUNK.length)
  }
  code.set(BUSY_TAIL, BUSY_CHUNK.length * BUSY_REPEATS)
  return code
})()

const SENDER_KEY = hexToBytes(`0x${'20'.repeat(32)}`)
export const SENDER = createAddressFromPrivateKey(SENDER_KEY)
export const RECIPIENT = createAddressFromPrivateKey(hexToBytes(`0x${'71'.repeat(32)}`))

const GAS_LIMIT = 200_000n
const GAS_PRICE = 1n

const SHAPES = new Set<string>(SHAPE_ORDER)

export function isShapeId(value: string): value is ShapeId {
  return SHAPES.has(value)
}

export function commonFor(hardfork: HardforkChoice): Common {
  return new Common({
    chain: Mainnet,
    hardfork: hardfork === 'glamsterdam' ? Hardfork.Amsterdam : Hardfork.Osaka,
  })
}

function calldataFor(shape: ShapeId): Uint8Array {
  if (shape === 'zeros') return new Uint8Array(DATA_BYTES)
  if (shape === 'nonzeros' || shape === 'busy') return new Uint8Array(DATA_BYTES).fill(1)
  return new Uint8Array()
}

export interface PerBytePrices {
  zeroOrdinary: bigint
  nonzeroOrdinary: bigint
  zeroFloor: bigint
  nonzeroFloor: bigint
}

/** Gas for a single calldata byte. Both forks, so the widget can show the jump. */
export function perBytePrices(hardfork: HardforkChoice): PerBytePrices {
  const zero = oneByte(hardfork, 0)
  const nonzero = oneByte(hardfork, 1)
  return {
    zeroOrdinary: zero.ordinary,
    nonzeroOrdinary: nonzero.ordinary,
    zeroFloor: zero.floor,
    nonzeroFloor: nonzero.floor,
  }
}

function oneByte(hardfork: HardforkChoice, byte: number): { ordinary: bigint; floor: bigint } {
  const common = commonFor(hardfork)
  const tx = createLegacyTx(
    {
      nonce: 0n,
      gasLimit: 100_000n,
      gasPrice: GAS_PRICE,
      to: RECIPIENT,
      value: 0n,
      data: Uint8Array.of(byte),
    },
    { common },
  ).sign(SENDER_KEY)
  return {
    ordinary: byte === 0 ? tx.common.param('txDataZeroGas') : tx.common.param('txDataNonZeroGas'),
    floor: tx.common.param('totalCostFloorPerToken') * countCalldataFloorTokens(tx),
  }
}

export type PayloadKind = 'zero' | 'nonzero' | 'listed'

/** What the byte picture draws for a story. Counts match the transaction. */
export function payloadSketch(shape: ShapeId): { kind: PayloadKind; count: number } {
  if (shape === 'zeros') return { kind: 'zero', count: DATA_BYTES }
  if (shape === 'access-list') return { kind: 'listed', count: 52 }
  return { kind: 'nonzero', count: DATA_BYTES }
}

/** Per-byte price times every byte of this calldata. The totals match `floorQuote`. */
export function blobBreakdown(
  shape: ShapeId,
  hardfork: HardforkChoice,
): {
  count: number
  workEach: bigint
  floorEach: bigint
  workTotal: bigint
  floorTotal: bigint
} {
  const quote = floorQuote(shape, hardfork)
  const count = payloadSketch(shape).count
  const countBn = BigInt(count)
  return {
    count,
    workEach: countBn === 0n ? 0n : quote.ordinaryCalldata / countBn,
    floorEach: countBn === 0n ? 0n : quote.floorOnData / countBn,
    workTotal: quote.ordinaryCalldata,
    floorTotal: quote.floorOnData,
  }
}

export function ordinaryCalldataGas(data: Uint8Array): bigint {
  let cost = 0n
  for (const byte of data) {
    cost += byte === 0 ? 4n : 16n
  }
  return cost
}

export function buildTx(shape: ShapeId, hardfork: HardforkChoice): TypedTransaction {
  const common = commonFor(hardfork)
  const data = calldataFor(shape)
  if (shape === 'access-list') {
    const slot = new Uint8Array(32)
    return createAccessList2930Tx(
      {
        chainId: 1n,
        nonce: 0n,
        gasPrice: GAS_PRICE,
        gasLimit: GAS_LIMIT,
        to: RECIPIENT,
        value: 0n,
        data,
        accessList: [[RECIPIENT.bytes, [slot]]],
      },
      { common },
    ).sign(SENDER_KEY)
  }
  return createLegacyTx(
    {
      nonce: 0n,
      gasLimit: GAS_LIMIT,
      gasPrice: GAS_PRICE,
      to: RECIPIENT,
      value: 0n,
      data,
    },
    { common },
  ).sign(SENDER_KEY)
}

export interface FloorQuote {
  ordinaryCalldata: bigint
  floorOnData: bigint
  /** Whole-transaction floor, including the transaction base. */
  floorCharge: bigint
  /** Whole-transaction intrinsic, before execution. */
  intrinsic: bigint
}

export function floorQuote(shape: ShapeId, hardfork: HardforkChoice): FloorQuote {
  const tx = buildTx(shape, hardfork)
  return {
    ordinaryCalldata: ordinaryCalldataGas(tx.data),
    floorOnData: tx.common.param('totalCostFloorPerToken') * countCalldataFloorTokens(tx),
    floorCharge: getCalldataFloorGas(tx),
    intrinsic: tx.getIntrinsicGas(),
  }
}

/** Whole-transaction floor minus the data: the call itself (15,000 on Glamsterdam, 21,000 on Fusaka). */
export function callBaseGas(quote: FloorQuote): bigint {
  return quote.floorCharge - quote.floorOnData
}

/**
 * How the charged total is built. The pieces add up to `gasUsed`.
 * `paid` is the data price this run actually used.
 * `rest` names whatever is left after the call and that data price.
 */
export function chargeExplanation(
  quote: FloorQuote,
  gasUsed?: bigint,
  paid: 'floor' | 'work' = 'floor',
  rest: 'work' | 'access list' = 'work',
): string {
  const format = (value: bigint) => value.toLocaleString('en-US')
  const call = callBaseGas(quote)
  const data = paid === 'work' ? quote.ordinaryCalldata : quote.floorOnData
  const parts = [`${format(call)} for the call`]
  if (data > 0n) parts.push(`${format(data)} for the data`)
  if (gasUsed !== undefined) {
    const extra = gasUsed - call - data
    if (extra > 0n) parts.push(`${format(extra)} for the ${rest}`)
  }
  return parts.join(' + ')
}

export function undersizedLimitIsInvalid(shape: ShapeId, hardfork: HardforkChoice): boolean {
  const common = commonFor(hardfork)
  const quote = floorQuote(shape, hardfork)
  const tooSmall = quote.floorCharge > 0n ? quote.floorCharge - 1n : 1n
  const data = calldataFor(shape)
  const tx =
    shape === 'access-list'
      ? createAccessList2930Tx(
          {
            chainId: 1n,
            nonce: 0n,
            gasPrice: GAS_PRICE,
            gasLimit: tooSmall,
            to: RECIPIENT,
            value: 0n,
            data,
            accessList: [[RECIPIENT.bytes, [new Uint8Array(32)]]],
          },
          { common },
        )
      : createLegacyTx(
          {
            nonce: 0n,
            gasLimit: tooSmall,
            gasPrice: GAS_PRICE,
            to: RECIPIENT,
            value: 0n,
            data,
          },
          { common },
        )
  return tx.isValid() === false
}

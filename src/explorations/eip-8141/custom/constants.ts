import { Address, hexToBytes, privateToPublic, publicToAddress } from '@fyp-8141/util'

export const PRIVATE_KEY = hexToBytes(('0x' + 'ab'.repeat(32)) as `0x${string}`)
export const PUBLIC_KEY = privateToPublic(PRIVATE_KEY)
export const SENDER_ADDR = new Address(publicToAddress(PUBLIC_KEY))

import { utils } from 'ethers'

import type { UInt256 } from '../types/uint256'
import { uInt256FromString } from '../types/uint256'

/**
 *
 * @param data
 * @returns
 */
export function getHash(data: unknown): UInt256 {
  return uInt256FromString(
    utils.keccak256(
      utils.defaultAbiCoder.encode(['string'], [JSON.stringify(data)]),
    ),
  )
}

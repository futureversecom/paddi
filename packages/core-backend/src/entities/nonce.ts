import type { ChainAddress } from 'core/src/types/chain-address'
import { ChainAddressC } from 'core/src/types/chain-address'
import * as Codec from 'io-ts/Codec'

export type NonceRecordHK = ChainAddress
/**
 *
 */
export const NonceRecordCodec = Codec.struct({
  /**
   * Hash-key: walletAddress
   */
  hk: ChainAddressC,

  /**
   * nonce
   */
  nonce: Codec.string,

  /**
   * User identifier
   */
  walletAddress: ChainAddressC,
})

export type NonceRecord = Codec.TypeOf<typeof NonceRecordCodec>

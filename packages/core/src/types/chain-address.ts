import { string } from 'fp-ts'
import * as Eq from 'fp-ts/Eq'
import { identity, pipe } from 'fp-ts/function'
import * as Codec from 'io-ts/Codec'
import * as Decoder from 'io-ts/Decoder'
import * as Encoder from 'io-ts/Encoder'

export interface ChainAddressBrand {
  readonly ChainAddress: unique symbol
}
export type ChainAddress = string & ChainAddressBrand
export const chainAddressEq: Eq.Eq<ChainAddress> = Eq.contramap<
  string,
  ChainAddress
>(identity)(string.Eq)

export const chainAddressFromString = (addressStr: string): ChainAddress =>
  addressStr.trim().toLowerCase() as ChainAddress

export const ChainAddressC = Codec.make(
  pipe(Decoder.string, Decoder.map(chainAddressFromString)),
  pipe(
    Encoder.id<string>(),
    Encoder.contramap((chainAddress: ChainAddress) => chainAddress),
  ),
)

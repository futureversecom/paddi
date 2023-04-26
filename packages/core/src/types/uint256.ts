import { string } from 'fp-ts'
import * as Either from 'fp-ts/Either'
import * as Eq from 'fp-ts/Eq'
import { identity, pipe } from 'fp-ts/function'
import * as Codec from 'io-ts/Codec'
import * as Decoder from 'io-ts/Decoder'
import * as Encoder from 'io-ts/Encoder'

export interface UInt256Brand {
  readonly UInt256: unique symbol
}

export type UInt256 = string & UInt256Brand

export function uInt256FromString(value: string): UInt256 {
  return value.trim().toLowerCase() as UInt256
}

export const UInt256Codec = Codec.make(
  pipe(Decoder.string, Decoder.map(uInt256FromString)),
  pipe(
    Encoder.id<string>(),
    Encoder.contramap((uint256: UInt256) => uint256),
  ),
)

export function decodeUInt256(value: unknown) {
  const decoded = UInt256Codec.decode(value)

  if (Either.isLeft(decoded)) {
    throw new Error(`Error decoding uint256: ${value}`)
  }

  return decoded.right
}

export const uInt256Eq: Eq.Eq<UInt256> = Eq.contramap(identity)(string.Eq)

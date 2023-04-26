import { number } from 'fp-ts'
import type * as Eq from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'
import * as Codec from 'io-ts/Codec'
import * as Decoder from 'io-ts/Decoder'

export interface TimestampBrand {
  readonly Timestamp: unique symbol
}

export type Timestamp = number & TimestampBrand

export const timestampFromNumber = (value: number) => value as Timestamp

export const timestampEq: Eq.Eq<Timestamp> = number.Eq

export const TimestampCodec: Codec.Codec<unknown, number, Timestamp> =
  Codec.make(
    pipe(Decoder.number, Decoder.map(timestampFromNumber)),
    pipe(Codec.number),
  )

export const currentTimestamp = () => timestampFromNumber(Date.now())

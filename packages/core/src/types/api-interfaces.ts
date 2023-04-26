import { number } from 'fp-ts'
import type * as Eq from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'
import * as Codec from 'io-ts/Codec'
import * as Decoder from 'io-ts/Decoder'

export interface TimeEpochMillisBrand {
  readonly TimeEpochMillis: unique symbol
}
export type TimeEpochMillis = number & TimeEpochMillisBrand
export const timeEpochMillisEq: Eq.Eq<TimeEpochMillis> = number.Eq

export const timeEpochMillisFromNumber = (
  epochMillis: number,
): TimeEpochMillis => epochMillis as TimeEpochMillis

export const TimeEpochMillisC: Codec.Codec<unknown, number, TimeEpochMillis> =
  Codec.make(
    pipe(Decoder.number, Decoder.map(timeEpochMillisFromNumber)),
    pipe(Codec.number),
  )

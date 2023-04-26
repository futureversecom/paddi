import { pipe } from 'fp-ts/function'
import * as Decoder from 'io-ts/Decoder'

export const NumberFromStringD: Decoder.Decoder<unknown, number> = pipe(
  Decoder.string,
  Decoder.parse(str => {
    const num = Number(str)
    return Number.isNaN(num)
      ? Decoder.failure(str, 'valid number')
      : Decoder.success(num)
  }),
)

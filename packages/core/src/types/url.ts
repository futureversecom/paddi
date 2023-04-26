import { pipe } from 'fp-ts/function'
import { parse } from 'fp-ts-std/URL'
import * as Codec from 'io-ts/Codec'
import * as Decoder from 'io-ts/Decoder'

export const UrlFromStringC = Codec.make(
  pipe(
    Decoder.string,
    Decoder.parse(str => parse(() => Decoder.error(str, 'Url'))(str)),
  ),
  { encode: url => url.toString() },
)

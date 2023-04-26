import { string } from 'fp-ts'
import * as Eq from 'fp-ts/Eq'
import { identity, pipe } from 'fp-ts/function'
import * as Codec from 'io-ts/Codec'
import * as Decoder from 'io-ts/Decoder'
import * as Encoder from 'io-ts/Encoder'

export const HEX_COLOUR_CODE =
  /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/

export interface HexColourBrand {
  readonly HexColour: unique symbol
}
export type HexColour = `#${string}` & HexColourBrand
export const hexColourEq: Eq.Eq<HexColour> = Eq.contramap<string, HexColour>(
  identity,
)(string.Eq)

// Convert a number between 0 and 1 to a hex colour code
export const hexColourFromNumber = (hexColourNumber: number): HexColour =>
  `#${Math.round(hexColourNumber * 0xffffff)
    .toString(16)
    .toUpperCase()
    .padStart(6, '0')}` as HexColour

export const hexColourFromString = (hexColourString: string): HexColour =>
  hexColourString.toUpperCase() as HexColour

export const hexColourFromStringD: Decoder.Decoder<unknown, HexColour> = pipe(
  Decoder.string,
  Decoder.parse(str =>
    HEX_COLOUR_CODE.test(str)
      ? Decoder.success(hexColourFromString(str))
      : Decoder.failure(str, 'invalid hex code'),
  ),
)

export const HexColourC = Codec.make(
  hexColourFromStringD,
  pipe(
    Encoder.id<string>(),
    Encoder.contramap((hexColour: HexColour) => hexColour),
  ),
)

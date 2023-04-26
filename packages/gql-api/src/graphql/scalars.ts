import type { ChainAddress } from 'core/src/types/chain-address'
import {
  ChainAddressC,
  chainAddressFromString,
} from 'core/src/types/chain-address'
import type { HexColour } from 'core/src/types/hex-colour'
import {
  HEX_COLOUR_CODE,
  HexColourC,
  hexColourFromString,
} from 'core/src/types/hex-colour'
import * as E from 'fp-ts/Either'
import { GraphQLScalarType, Kind } from 'graphql'

// ChainAddress

export const ChainAddressType = new GraphQLScalarType({
  name: 'ChainAddress',
  description: 'A block-chain address. ex: wallet, contract...',
  serialize(value) {
    if (typeof value === 'string') {
      return ChainAddressC.encode(chainAddressFromString(value))
    }

    return null
  },
  parseValue(value): ChainAddress | null {
    const addr = ChainAddressC.decode(value)
    if (E.isRight(addr)) {
      return addr.right
    }

    return null
  },
  parseLiteral(ast): ChainAddress | null {
    switch (ast.kind) {
      case Kind.STRING: {
        const addr = ChainAddressC.decode(ast.value)
        if (E.isRight(addr)) {
          return addr.right
        }

        return null
      }
      default:
        return null
    }
  },
})

// HexColour

const validHexColour = (value: unknown) =>
  typeof value === 'string' && HEX_COLOUR_CODE.test(value)

export const HexColourType = new GraphQLScalarType({
  name: 'HexColour',
  description: 'A colour code formatted as a hex string. ex #C0FFEE',
  serialize(value) {
    if (validHexColour(value)) {
      return HexColourC.encode(hexColourFromString(value as string))
    }
    return null
  },
  parseValue(value): HexColour | null {
    const hexColour = HexColourC.decode(value)
    if (E.isRight(hexColour)) {
      return hexColour.right
    }
    return null
  },
  parseLiteral(ast): HexColour | null {
    switch (ast.kind) {
      case Kind.STRING: {
        const hexColour = HexColourC.decode(ast.value)
        if (E.isRight(hexColour)) {
          return hexColour.right
        }
        return null
      }
      default:
        return null
    }
  },
})

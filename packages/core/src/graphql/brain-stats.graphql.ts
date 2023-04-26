import { gql } from 'graphql-tag'

export const brainStats = gql`
  type Query {
    genomeAttributes(tokenId: Int!): GenomeAttributesResponse!
  }

  # Attribute types

  union GenomeAttribute = GenomeAttributeInt | GenomeAttributeHex

  type GenomeAttributeInt {
    name: String!
    value: Int!
  }

  type GenomeAttributeHex {
    name: String!
    value: HexColour!
  }

  # Responses

  type GenomeAttributesSuccessResponse {
    genomeAttributes: [GenomeAttribute!]!
  }

  type GenomeAttributesFailureResponse {
    reason: GenomeAttributesFailureReason!
  }

  union GenomeAttributesFailureReason = InvalidTokenId | UnknownError

  type InvalidTokenId {
    _: Boolean
  }

  type UnknownError {
    _: Boolean
  }

  union GenomeAttributesResponse =
      GenomeAttributesSuccessResponse
    | GenomeAttributesFailureResponse
`

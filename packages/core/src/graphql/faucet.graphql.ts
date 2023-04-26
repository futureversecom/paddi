import { gql } from 'graphql-tag'

export const faucet = gql`
  type Mutation {
    gasFaucet(address: ChainAddress!): GasFaucetResponse! @authenticated
  }

  type GasFaucetSuccessResponse {
    hash: String!
  }

  type GasFaucetFailureResponse {
    reason: GasFaucetFailureReason!
  }

  union GasFaucetFailureReason =
      NotEnoughGasInFaucet
    | NotEnoughGasInServer
    | UnknownError

  type NotEnoughGasInFaucet {
    _: Boolean
  }

  type NotEnoughGasInServer {
    _: Boolean
  }

  type UnknownError {
    _: Boolean
  }

  union GasFaucetResponse = GasFaucetSuccessResponse | GasFaucetFailureResponse
`

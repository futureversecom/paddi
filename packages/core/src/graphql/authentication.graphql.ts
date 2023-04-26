import { gql } from 'graphql-tag'

export const authentication = gql`
  type Mutation {
    authenticate(input: AuthenticateInput!): AuthenticatePayload!
  }

  type Query {
    nonce(userWalletAddress: ChainAddress!): String!
  }

  type AuthenticateError implements ErrorInterface {
    message: String!
  }

  type AuthenticateFailure {
    errors: [AuthenticateError!]!
  }

  type AuthenticateSuccess {
    token: String!
  }

  union AuthenticatePayload = AuthenticateFailure | AuthenticateSuccess

  input AuthenticateInput {
    message: String!
    signature: String!
  }
`

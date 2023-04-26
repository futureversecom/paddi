import { gql } from 'graphql-tag'

export const healthCheck = gql`
  type Query {
    healthCheck: String!
  }
`

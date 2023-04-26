import { gql } from 'graphql-tag'

export const errors = gql`
  interface ErrorInterface {
    message: String!
  }
`

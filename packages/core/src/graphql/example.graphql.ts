import { gql } from 'graphql-tag'

export const example = gql`
  type Mutation {
    # Just as an example, remove once we have a concrete implementation
    testAuth: String! @authenticated
  }
`

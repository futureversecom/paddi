import { gql } from 'graphql-tag'

export const directives = gql`
  directive @authenticated on FIELD_DEFINITION

  directive @oneOf on INPUT_OBJECT | FIELD_DEFINITION
`

import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { AuthenticationError } from 'apollo-server-core'
import type { GraphQLFieldConfig, GraphQLSchema } from 'graphql'
import { defaultFieldResolver } from 'graphql'

import type { AuthenticatedContext, Context } from '../context'

const directiveName = 'authenticated'

/**
 * This function takes in a schema and adds auth logic
 * to the resolvers of the fields.
 */
export const authenticatedDirective = (schema: GraphQLSchema) => {
  return mapSchema(schema, {
    // Executes once for each FIELD in the schema
    [MapperKind.OBJECT_FIELD]: (
      fieldConfig: GraphQLFieldConfig<unknown, Context>,
    ): GraphQLFieldConfig<unknown, Context> => {
      // Check whether this field has the specified directive
      const authDirective = getDirective(
        schema,
        fieldConfig,
        directiveName,
      )?.[0]

      if (!authDirective) {
        return fieldConfig
      }

      // Get this field's original resolver
      const { resolve: originalFieldResolver = defaultFieldResolver } =
        fieldConfig

      return {
        ...fieldConfig,
        description: [
          fieldConfig.description,
          '**@authenticated (Requires authentication)**',
        ]
          .filter(Boolean)
          .join(' \n'),
        resolve: async (source, args, context, info) => {
          // If the user is not authenticated, throw an error
          const { walletAddress } = context
          if (!walletAddress) {
            throw new AuthenticationError(
              'You must be authenticated to use this field.',
            )
          }

          const authenticatedContext: AuthenticatedContext<Context> = {
            ...context,
            walletAddress,
          }

          return originalFieldResolver(source, args, authenticatedContext, info)
        },
      }
    },
  })
}

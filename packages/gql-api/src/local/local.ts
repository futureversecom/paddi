import './local-setup'

import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

import { ApolloSettings, getContext } from '../handlers/graphql-handler'

export const startServer = async () => {
  await startStandaloneServer(new ApolloServer(ApolloSettings), {
    context: async ({ req }) => getContext(req.headers),
  }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
}

startServer().catch(err => {
  console.error('Error starting gql server', err)
  throw err
})

import './local-setup'

import { ApolloServer } from 'apollo-server'
import type { ExpressContext } from 'apollo-server-express'

const getHeaders = (context: ExpressContext) => {
  return context.req.headers
}

export const startServer = async () => {
  const { getApolloSettings } = await import('../handlers/graphql-handler')

  await new ApolloServer(getApolloSettings(getHeaders))
    .listen()
    .then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`)
    })
}

startServer().catch(err => {
  console.error('Error starting gql server', err)
  throw err
})

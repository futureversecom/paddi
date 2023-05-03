import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground'
import {
  handlers,
  startServerAndCreateLambdaHandler,
} from '@as-integrations/aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { typeDefs } from 'core/src/graphql/type-defs'
import { BrainMetadataInteractions } from 'core-backend/src/assets/brain-metadata-interactions'
import { ComputeManagerInteractions } from 'core-backend/src/contracts/compute-manager-interactions'
import { getEnvOrThrow } from 'core-backend/src/env'
import * as repositories from 'core-backend/src/repositories'
import { SecretManager } from 'core-backend/src/secrets/secret-manager'
import { sentryWrapper } from 'core-backend/src/sentry'
import { providers, Wallet } from 'ethers'
import { either } from 'fp-ts'
import type { GraphQLFormattedError } from 'graphql'
import { GraphQLError } from 'graphql'
import type { IncomingHttpHeaders } from 'http'
import * as decoder from 'io-ts/Decoder'
import type {
  AuthenticatedContext,
  BaseContext,
  Context,
} from 'src/graphql/context'
import { authenticatedDirective } from 'src/graphql/directives/authenticated'
import { rootResolver } from 'src/graphql/root-resolver'
import { AuthenticationService } from 'src/services/authentication-service'
import { BrainStatsService } from 'src/services/brain-stats-service'
import { GasFaucetService } from 'src/services/gas-faucet-service'
import { HealthCheckService } from 'src/services/health-check-service'
import { TrainingService } from 'src/services/training-service'

import { SecretsC } from './handler-secrets'

const buildCachedServicesPromise = (async (): Promise<Context> => {
  const env = getEnvOrThrow({
    ENVIRONMENT: decoder.literal('dev', 'staging', 'prod'),
    LOCALSTACK_ENDPOINT: decoder.nullable(decoder.string),
    LOGIN_NONCE_TABLE_NAME: decoder.string,
    TRAINING_RECORD_TABLE_NAME: decoder.string,
    RPC_URL: decoder.string,
  })

  // Secrets
  const secretClient = new SecretsManagerClient({
    ...(env.LOCALSTACK_ENDPOINT && { endpoint: env.LOCALSTACK_ENDPOINT }),
  })
  const secretManager = new SecretManager(secretClient)
  const secretsJSON = await secretManager.getString('acp-demo')
  const decodedSecrets = SecretsC.decode(JSON.parse(secretsJSON))
  if (either.isLeft(decodedSecrets)) {
    throw new Error(`Failed to decode secrets`)
  }

  const { JwtSecret, SignerPrivateKey, MemoryTreeSignerPrivateKey } =
    decodedSecrets.right

  // Ethers
  const provider = new providers.JsonRpcProvider(env.RPC_URL)
  const brainMetadataInteractions = new BrainMetadataInteractions(provider)
  const computeManagerInteractions = new ComputeManagerInteractions(provider)
  const wallet = new Wallet(SignerPrivateKey, provider)

  const memoryTreeSignerWallet = new Wallet(
    MemoryTreeSignerPrivateKey,
    provider,
  )

  // DB
  const dynamodb = new DynamoDBClient({
    ...(env.LOCALSTACK_ENDPOINT && { endpoint: env.LOCALSTACK_ENDPOINT }),
  })
  const docClient = DynamoDBDocument.from(dynamodb)
  const nonceRepository = new repositories.LoginNonceRepository(
    docClient,
    env.LOGIN_NONCE_TABLE_NAME,
  )
  const TrainingRecordRepository = new repositories.TrainingRecordRepository(
    docClient,
    env.TRAINING_RECORD_TABLE_NAME,
  )

  // Services

  const authenticationService = new AuthenticationService(
    nonceRepository,
    JwtSecret,
  )
  const healthCheckService = new HealthCheckService(env.ENVIRONMENT)
  const gasFaucetService = new GasFaucetService(wallet)
  const brainStatsService = new BrainStatsService(brainMetadataInteractions)
  const trainingService = new TrainingService(
    TrainingRecordRepository,
    computeManagerInteractions,
    brainStatsService,
    memoryTreeSignerWallet,
  )

  return {
    authenticationService,
    brainStatsService,
    healthCheckService,
    gasFaucetService,
    trainingService,
  }
})()

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: rootResolver,
})

const directives = [authenticatedDirective]
const augmentedSchema = directives.reduce(
  (prev, directive) => directive(prev),
  schema,
)

export const getContext = async (
  headers: IncomingHttpHeaders,
): Promise<Context> => {
  const services: BaseContext = await buildCachedServicesPromise

  // auth token is passed in the request header
  const token = headers['authorization']?.slice('Bearer '.length)
  if (token) {
    const decodedWalletAddress = services.authenticationService.verifyJwt(token)

    if (either.isLeft(decodedWalletAddress)) {
      throw new GraphQLError('Invalid wallet address', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      })
    }

    const context: AuthenticatedContext<BaseContext> = {
      ...services,
      walletAddress: decodedWalletAddress.right,
    }

    return context
  }

  return services
}

// GraphQL Server Initialization
export const ApolloSettings = {
  schema: augmentedSchema,

  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  formatError: (err: GraphQLFormattedError) => {
    console.log(err)

    // Otherwise return the original error. The error can also
    // be manipulated in other ways, as long as it's returned.
    return err
  },
}

/* Run the graphql server as a lambda */
const server = new ApolloServer(ApolloSettings)

const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    context: async req => {
      return getContext(req.event.headers)
    },
  },
)

export const handler = sentryWrapper(graphqlHandler)

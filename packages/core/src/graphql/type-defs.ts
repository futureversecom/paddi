import { authentication } from './authentication.graphql'
import { brainStats } from './brain-stats.graphql'
import { directives } from './directives.graphql'
import { errors } from './errors.graphql'
import { example } from './example.graphql'
import { faucet } from './faucet.graphql'
import { healthCheck } from './health-check.graphql'
import { scalars } from './scalars.graphql'
import { training } from './training.graphql'

export const typeDefs = [
  authentication,
  directives,
  errors,
  example,
  training,
  healthCheck,
  faucet,
  brainStats,
  scalars,
]

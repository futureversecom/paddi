import type { ChainAddress } from 'core/src/types/chain-address'
import type { AuthenticationService } from 'src/services/authentication-service'
import type { BrainStatsService } from 'src/services/brain-stats-service'
import type { GasFaucetService } from 'src/services/gas-faucet-service'
import type { HealthCheckService } from 'src/services/health-check-service'
import type { TrainingService } from 'src/services/training-service'

/**
 * Inject Services for Context.
 * Called in `gql-server/src/graphql/handlers/index.ts
 */
export interface BaseContext {
  healthCheckService: HealthCheckService
  gasFaucetService: GasFaucetService
  authenticationService: AuthenticationService
  brainStatsService: BrainStatsService
  trainingService: TrainingService
}

/**
 * Inject Services for Context.
 * Called in `gql-server/src/graphql/handlers/index.ts
 */
export interface Context extends BaseContext {
  walletAddress?: ChainAddress
}

export type AuthenticatedContext<C> = C & {
  walletAddress: ChainAddress
}

import { ChainAddress } from 'core/src/types/chain-address'
import { HexColour } from 'core/src/types/hex-colour'
import { Timestamp } from 'core/src/types/timestamp'
import { UInt256 } from 'core/src/types/uint256'
import { GraphQLClient } from 'graphql-request'
import { RequestInit } from 'graphql-request/dist/types.dom'
import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
} from 'react-query'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}

function fetcher<TData, TVariables extends { [key: string]: any }>(
  client: GraphQLClient,
  query: string,
  variables?: TVariables,
  requestHeaders?: RequestInit['headers'],
) {
  return async (): Promise<TData> =>
    client.request({
      document: query,
      variables,
      requestHeaders,
    })
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  ChainAddress: ChainAddress
  HexColour: HexColour
  Timestamp: Timestamp
  UInt256: UInt256
}

export type AgentScenario = {
  __typename?: 'AgentScenario'
  agentType: AgentType
}

export type AgentScenarioInput = {
  agentType: AgentType
}

export const enum AgentType {
  Balanced = 'Balanced',
  Heavy = 'Heavy',
  Light = 'Light',
}

export type AggregationStats = {
  __typename?: 'AggregationStats'
  aggregated_data: Scalars['Float']
  name: Scalars['String']
}

export type AuthenticateError = ErrorInterface & {
  __typename?: 'AuthenticateError'
  message: Scalars['String']
}

export type AuthenticateFailure = {
  __typename?: 'AuthenticateFailure'
  errors: Array<AuthenticateError>
}

export type AuthenticateInput = {
  message: Scalars['String']
  signature: Scalars['String']
}

export type AuthenticatePayload = AuthenticateFailure | AuthenticateSuccess

export type AuthenticateSuccess = {
  __typename?: 'AuthenticateSuccess'
  token: Scalars['String']
}

export type ErrorInterface = {
  message: Scalars['String']
}

export type EvaluationOutput = {
  __typename?: 'EvaluationOutput'
  evaluationId: Scalars['String']
  replayPath: Scalars['String']
  stats: Array<EvaluationStats>
}

export type EvaluationStats = AggregationStats | HistogramStats

export type GasFaucetFailureReason =
  | NotEnoughGasInFaucet
  | NotEnoughGasInServer
  | UnknownError

export type GasFaucetFailureResponse = {
  __typename?: 'GasFaucetFailureResponse'
  reason: GasFaucetFailureReason
}

export type GasFaucetResponse =
  | GasFaucetFailureResponse
  | GasFaucetSuccessResponse

export type GasFaucetSuccessResponse = {
  __typename?: 'GasFaucetSuccessResponse'
  hash: Scalars['String']
}

export type GenomeAttribute = GenomeAttributeHex | GenomeAttributeInt

export type GenomeAttributeHex = {
  __typename?: 'GenomeAttributeHex'
  name: Scalars['String']
  value: Scalars['HexColour']
}

export type GenomeAttributeInt = {
  __typename?: 'GenomeAttributeInt'
  name: Scalars['String']
  value: Scalars['Int']
}

export type GenomeAttributesFailureReason = InvalidTokenId | UnknownError

export type GenomeAttributesFailureResponse = {
  __typename?: 'GenomeAttributesFailureResponse'
  reason: GenomeAttributesFailureReason
}

export type GenomeAttributesResponse =
  | GenomeAttributesFailureResponse
  | GenomeAttributesSuccessResponse

export type GenomeAttributesSuccessResponse = {
  __typename?: 'GenomeAttributesSuccessResponse'
  genomeAttributes: Array<GenomeAttribute>
}

export type HistogramStats = {
  __typename?: 'HistogramStats'
  categories: Array<Scalars['String']>
  data: Array<Scalars['Float']>
  name: Scalars['String']
  xAxis: Scalars['String']
  yAxis: Scalars['String']
}

export type InvalidTokenId = {
  __typename?: 'InvalidTokenId'
  _?: Maybe<Scalars['Boolean']>
}

export type Mutation = {
  __typename?: 'Mutation'
  authenticate: AuthenticatePayload
  gasFaucet: GasFaucetResponse
  savePinnedNodeId: SavePinnedMemoryPayload
  testAuth: Scalars['String']
  trainingCancel: TrainingCancelPayload
  trainingRequest: TrainingRequestPayload
}

export type MutationAuthenticateArgs = {
  input: AuthenticateInput
}

export type MutationGasFaucetArgs = {
  address: Scalars['ChainAddress']
}

export type MutationSavePinnedNodeIdArgs = {
  hash: Scalars['UInt256']
  nodeId: Scalars['String']
}

export type MutationTrainingCancelArgs = {
  hash: Scalars['UInt256']
}

export type MutationTrainingRequestArgs = {
  input: TrainingRequestInput
}

export const enum NodeType {
  RootNode = 'RootNode',
  TrainedNode = 'TrainedNode',
}

export type NotEnoughGasInFaucet = {
  __typename?: 'NotEnoughGasInFaucet'
  _?: Maybe<Scalars['Boolean']>
}

export type NotEnoughGasInServer = {
  __typename?: 'NotEnoughGasInServer'
  _?: Maybe<Scalars['Boolean']>
}

export type ParentMemoryNodeConfig = {
  memoryId?: InputMaybe<Scalars['Int']>
  memoryUrl?: InputMaybe<Scalars['String']>
  type: NodeType
}

export type PendingNodeSignature = {
  __typename?: 'PendingNodeSignature'
  signature: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  genomeAttributes: GenomeAttributesResponse
  healthCheck: Scalars['String']
  myTrainings: Array<Training>
  nonce: Scalars['String']
  pendingNodeSignature: PendingNodeSignature
  predictTrainingCost: TrainingCostPayload
}

export type QueryGenomeAttributesArgs = {
  tokenId: Scalars['Int']
}

export type QueryNonceArgs = {
  userWalletAddress: Scalars['ChainAddress']
}

export type QueryPendingNodeSignatureArgs = {
  hash: Scalars['UInt256']
}

export type QueryPredictTrainingCostArgs = {
  trainingParams: TrainingParams
}

export type RewardConfig = {
  __typename?: 'RewardConfig'
  endurancePenaltyMultiplier: Scalars['Float']
  loseRound: Scalars['Float']
  nearMissMultiplier: Scalars['Float']
  paddleHit: Scalars['Float']
  survivalRewardMultiplier: Scalars['Float']
  winRound: Scalars['Float']
}

export type SavePinnedMemoryPayload = {
  __typename?: 'SavePinnedMemoryPayload'
  success: Scalars['Boolean']
}

export type Scenario = AgentScenario | WallScenario

export type ScenarioInput =
  | { agent: AgentScenarioInput; wall?: never }
  | { agent?: never; wall: WallScenarioInput }

export type Training = {
  __typename?: 'Training'
  brainId: Scalars['Int']
  completedUnits?: Maybe<Scalars['Int']>
  evaluationOutput?: Maybe<Array<EvaluationOutput>>
  hash: Scalars['UInt256']
  parentNodeId?: Maybe<Scalars['String']>
  pinnedNodeId?: Maybe<Scalars['String']>
  recordState: TrainingState
  rewardConfig: RewardConfig
  scenario: Scenario
  timestamp: Scalars['Timestamp']
  trainingOutput?: Maybe<TrainingOutput>
  units: Scalars['Int']
}

export type TrainingCancelPayload = {
  __typename?: 'TrainingCancelPayload'
  success: Scalars['Boolean']
}

export type TrainingCostPayload = {
  __typename?: 'TrainingCostPayload'
  astoCost: Scalars['UInt256']
}

export type TrainingOutput = {
  __typename?: 'TrainingOutput'
  outputPath: Scalars['String']
}

export type TrainingParams = {
  endurancePenaltyMultiplier: Scalars['Float']
  loseRound: Scalars['Float']
  nearMissExponent: Scalars['Float']
  nearMissMinDistance: Scalars['Float']
  nearMissMultiplier: Scalars['Float']
  paddleHit: Scalars['Float']
  survivalRewardMultiplier: Scalars['Float']
  trainingRounds: Scalars['Int']
  winRound: Scalars['Float']
}

export type TrainingRequestFailure = ErrorInterface & {
  __typename?: 'TrainingRequestFailure'
  message: Scalars['String']
}

export type TrainingRequestInput = {
  brainId: Scalars['Int']
  parentMemoryNodeConfig: ParentMemoryNodeConfig
  scenario: ScenarioInput
  trainingParams: TrainingParams
}

export type TrainingRequestPayload =
  | TrainingRequestFailure
  | TrainingRequestSuccess

export type TrainingRequestSuccess = {
  __typename?: 'TrainingRequestSuccess'
  training: Training
}

export const enum TrainingState {
  Canceled = 'Canceled',
  Completed = 'Completed',
  InProgress = 'InProgress',
  Pending = 'Pending',
}

export type UnknownError = {
  __typename?: 'UnknownError'
  _?: Maybe<Scalars['Boolean']>
}

export type WallScenario = {
  __typename?: 'WallScenario'
  _?: Maybe<Scalars['Boolean']>
}

export type WallScenarioInput = {
  _?: InputMaybe<Scalars['Boolean']>
}

export type AuthenticateMutationVariables = Exact<{
  input: AuthenticateInput
}>

export type AuthenticateMutation = {
  __typename?: 'Mutation'
  authenticate:
    | {
        __typename: 'AuthenticateFailure'
        errors: Array<{ __typename?: 'AuthenticateError'; message: string }>
      }
    | { __typename: 'AuthenticateSuccess'; token: string }
}

export type GasFaucetMutationVariables = Exact<{
  address: Scalars['ChainAddress']
}>

export type GasFaucetMutation = {
  __typename?: 'Mutation'
  gasFaucet:
    | {
        __typename?: 'GasFaucetFailureResponse'
        reason:
          | { __typename: 'NotEnoughGasInFaucet' }
          | { __typename: 'NotEnoughGasInServer' }
          | { __typename: 'UnknownError' }
      }
    | { __typename: 'GasFaucetSuccessResponse'; hash: string }
}

export type GenomeAttributesQueryVariables = Exact<{
  tokenId: Scalars['Int']
}>

export type GenomeAttributesQuery = {
  __typename?: 'Query'
  genomeAttributes:
    | {
        __typename?: 'GenomeAttributesFailureResponse'
        reason:
          | { __typename: 'InvalidTokenId' }
          | { __typename: 'UnknownError' }
      }
    | {
        __typename: 'GenomeAttributesSuccessResponse'
        genomeAttributes: Array<
          | {
              __typename: 'GenomeAttributeHex'
              name: string
              valueHex: HexColour
            }
          | { __typename: 'GenomeAttributeInt'; name: string; valueInt: number }
        >
      }
}

export type HealthCheckQueryVariables = Exact<{ [key: string]: never }>

export type HealthCheckQuery = { __typename?: 'Query'; healthCheck: string }

export type MyTrainingsQueryVariables = Exact<{ [key: string]: never }>

export type MyTrainingsQuery = {
  __typename?: 'Query'
  myTrainings: Array<{
    __typename?: 'Training'
    hash: UInt256
    brainId: number
    timestamp: Timestamp
    recordState: TrainingState
    parentNodeId?: string | null
    units: number
    completedUnits?: number | null
    pinnedNodeId?: string | null
    trainingOutput?: {
      __typename?: 'TrainingOutput'
      outputPath: string
    } | null
    evaluationOutput?: Array<{
      __typename?: 'EvaluationOutput'
      evaluationId: string
      replayPath: string
      stats: Array<
        | {
            __typename: 'AggregationStats'
            name: string
            aggregated_data: number
          }
        | {
            __typename: 'HistogramStats'
            name: string
            xAxis: string
            yAxis: string
            categories: Array<string>
            data: Array<number>
          }
      >
    }> | null
    rewardConfig: {
      __typename?: 'RewardConfig'
      winRound: number
      loseRound: number
      paddleHit: number
      nearMissMultiplier: number
      survivalRewardMultiplier: number
      endurancePenaltyMultiplier: number
    }
    scenario:
      | { __typename: 'AgentScenario'; agentType: AgentType }
      | { __typename: 'WallScenario' }
  }>
}

export type PendingNodeSignatureQueryVariables = Exact<{
  hash: Scalars['UInt256']
}>

export type PendingNodeSignatureQuery = {
  __typename?: 'Query'
  pendingNodeSignature: {
    __typename?: 'PendingNodeSignature'
    signature: string
  }
}

export type PredictTrainingCostQueryVariables = Exact<{
  trainingParams: TrainingParams
}>

export type PredictTrainingCostQuery = {
  __typename?: 'Query'
  predictTrainingCost: { __typename?: 'TrainingCostPayload'; astoCost: UInt256 }
}

export type SavePinnedNodeIdMutationVariables = Exact<{
  hash: Scalars['UInt256']
  nodeId: Scalars['String']
}>

export type SavePinnedNodeIdMutation = {
  __typename?: 'Mutation'
  savePinnedNodeId: { __typename?: 'SavePinnedMemoryPayload'; success: boolean }
}

export type TrainingCancelMutationVariables = Exact<{
  hash: Scalars['UInt256']
}>

export type TrainingCancelMutation = {
  __typename?: 'Mutation'
  trainingCancel: { __typename?: 'TrainingCancelPayload'; success: boolean }
}

export type TrainingRequestMutationVariables = Exact<{
  input: TrainingRequestInput
}>

export type TrainingRequestMutation = {
  __typename?: 'Mutation'
  trainingRequest:
    | { __typename: 'TrainingRequestFailure'; message: string }
    | {
        __typename: 'TrainingRequestSuccess'
        training: { __typename?: 'Training'; hash: UInt256 }
      }
}

export const AuthenticateDocument = `
    mutation authenticate($input: AuthenticateInput!) {
  authenticate(input: $input) {
    __typename
    ... on AuthenticateFailure {
      errors {
        ... on ErrorInterface {
          message
        }
      }
    }
    ... on AuthenticateSuccess {
      token
    }
  }
}
    `
export const useAuthenticateMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    AuthenticateMutation,
    TError,
    AuthenticateMutationVariables,
    TContext
  >,
  headers?: RequestInit['headers'],
) =>
  useMutation<
    AuthenticateMutation,
    TError,
    AuthenticateMutationVariables,
    TContext
  >(
    ['authenticate'],
    (variables?: AuthenticateMutationVariables) =>
      fetcher<AuthenticateMutation, AuthenticateMutationVariables>(
        client,
        AuthenticateDocument,
        variables,
        headers,
      )(),
    options,
  )
export const GasFaucetDocument = `
    mutation gasFaucet($address: ChainAddress!) {
  gasFaucet(address: $address) {
    ... on GasFaucetSuccessResponse {
      __typename
      hash
    }
    ... on GasFaucetFailureResponse {
      reason {
        ... on NotEnoughGasInFaucet {
          __typename
        }
        ... on NotEnoughGasInServer {
          __typename
        }
        ... on UnknownError {
          __typename
        }
      }
    }
  }
}
    `
export const useGasFaucetMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    GasFaucetMutation,
    TError,
    GasFaucetMutationVariables,
    TContext
  >,
  headers?: RequestInit['headers'],
) =>
  useMutation<GasFaucetMutation, TError, GasFaucetMutationVariables, TContext>(
    ['gasFaucet'],
    (variables?: GasFaucetMutationVariables) =>
      fetcher<GasFaucetMutation, GasFaucetMutationVariables>(
        client,
        GasFaucetDocument,
        variables,
        headers,
      )(),
    options,
  )
export const GenomeAttributesDocument = `
    query genomeAttributes($tokenId: Int!) {
  genomeAttributes(tokenId: $tokenId) {
    ... on GenomeAttributesSuccessResponse {
      __typename
      genomeAttributes {
        __typename
        ... on GenomeAttributeInt {
          name
          valueInt: value
        }
        ... on GenomeAttributeHex {
          name
          valueHex: value
        }
      }
    }
    ... on GenomeAttributesFailureResponse {
      reason {
        __typename
      }
    }
  }
}
    `
export const useGenomeAttributesQuery = <
  TData = GenomeAttributesQuery,
  TError = unknown,
>(
  client: GraphQLClient,
  variables: GenomeAttributesQueryVariables,
  options?: UseQueryOptions<GenomeAttributesQuery, TError, TData>,
  headers?: RequestInit['headers'],
) =>
  useQuery<GenomeAttributesQuery, TError, TData>(
    ['genomeAttributes', variables],
    fetcher<GenomeAttributesQuery, GenomeAttributesQueryVariables>(
      client,
      GenomeAttributesDocument,
      variables,
      headers,
    ),
    options,
  )
export const HealthCheckDocument = `
    query healthCheck {
  healthCheck
}
    `
export const useHealthCheckQuery = <TData = HealthCheckQuery, TError = unknown>(
  client: GraphQLClient,
  variables?: HealthCheckQueryVariables,
  options?: UseQueryOptions<HealthCheckQuery, TError, TData>,
  headers?: RequestInit['headers'],
) =>
  useQuery<HealthCheckQuery, TError, TData>(
    variables === undefined ? ['healthCheck'] : ['healthCheck', variables],
    fetcher<HealthCheckQuery, HealthCheckQueryVariables>(
      client,
      HealthCheckDocument,
      variables,
      headers,
    ),
    options,
  )
export const MyTrainingsDocument = `
    query myTrainings {
  myTrainings {
    hash
    brainId
    timestamp
    recordState
    parentNodeId
    units
    completedUnits
    pinnedNodeId
    trainingOutput {
      outputPath
    }
    evaluationOutput {
      evaluationId
      replayPath
      stats {
        ... on HistogramStats {
          __typename
          name
          xAxis
          yAxis
          categories
          data
        }
        ... on AggregationStats {
          __typename
          name
          aggregated_data
        }
      }
    }
    rewardConfig {
      winRound
      loseRound
      paddleHit
      nearMissMultiplier
      survivalRewardMultiplier
      endurancePenaltyMultiplier
    }
    scenario {
      __typename
      ... on AgentScenario {
        agentType
      }
    }
  }
}
    `
export const useMyTrainingsQuery = <TData = MyTrainingsQuery, TError = unknown>(
  client: GraphQLClient,
  variables?: MyTrainingsQueryVariables,
  options?: UseQueryOptions<MyTrainingsQuery, TError, TData>,
  headers?: RequestInit['headers'],
) =>
  useQuery<MyTrainingsQuery, TError, TData>(
    variables === undefined ? ['myTrainings'] : ['myTrainings', variables],
    fetcher<MyTrainingsQuery, MyTrainingsQueryVariables>(
      client,
      MyTrainingsDocument,
      variables,
      headers,
    ),
    options,
  )
export const PendingNodeSignatureDocument = `
    query pendingNodeSignature($hash: UInt256!) {
  pendingNodeSignature(hash: $hash) {
    signature
  }
}
    `
export const usePendingNodeSignatureQuery = <
  TData = PendingNodeSignatureQuery,
  TError = unknown,
>(
  client: GraphQLClient,
  variables: PendingNodeSignatureQueryVariables,
  options?: UseQueryOptions<PendingNodeSignatureQuery, TError, TData>,
  headers?: RequestInit['headers'],
) =>
  useQuery<PendingNodeSignatureQuery, TError, TData>(
    ['pendingNodeSignature', variables],
    fetcher<PendingNodeSignatureQuery, PendingNodeSignatureQueryVariables>(
      client,
      PendingNodeSignatureDocument,
      variables,
      headers,
    ),
    options,
  )
export const PredictTrainingCostDocument = `
    query predictTrainingCost($trainingParams: TrainingParams!) {
  predictTrainingCost(trainingParams: $trainingParams) {
    ... on TrainingCostPayload {
      astoCost
    }
  }
}
    `
export const usePredictTrainingCostQuery = <
  TData = PredictTrainingCostQuery,
  TError = unknown,
>(
  client: GraphQLClient,
  variables: PredictTrainingCostQueryVariables,
  options?: UseQueryOptions<PredictTrainingCostQuery, TError, TData>,
  headers?: RequestInit['headers'],
) =>
  useQuery<PredictTrainingCostQuery, TError, TData>(
    ['predictTrainingCost', variables],
    fetcher<PredictTrainingCostQuery, PredictTrainingCostQueryVariables>(
      client,
      PredictTrainingCostDocument,
      variables,
      headers,
    ),
    options,
  )
export const SavePinnedNodeIdDocument = `
    mutation savePinnedNodeId($hash: UInt256!, $nodeId: String!) {
  savePinnedNodeId(hash: $hash, nodeId: $nodeId) {
    success
  }
}
    `
export const useSavePinnedNodeIdMutation = <
  TError = unknown,
  TContext = unknown,
>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    SavePinnedNodeIdMutation,
    TError,
    SavePinnedNodeIdMutationVariables,
    TContext
  >,
  headers?: RequestInit['headers'],
) =>
  useMutation<
    SavePinnedNodeIdMutation,
    TError,
    SavePinnedNodeIdMutationVariables,
    TContext
  >(
    ['savePinnedNodeId'],
    (variables?: SavePinnedNodeIdMutationVariables) =>
      fetcher<SavePinnedNodeIdMutation, SavePinnedNodeIdMutationVariables>(
        client,
        SavePinnedNodeIdDocument,
        variables,
        headers,
      )(),
    options,
  )
export const TrainingCancelDocument = `
    mutation trainingCancel($hash: UInt256!) {
  trainingCancel(hash: $hash) {
    success
  }
}
    `
export const useTrainingCancelMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    TrainingCancelMutation,
    TError,
    TrainingCancelMutationVariables,
    TContext
  >,
  headers?: RequestInit['headers'],
) =>
  useMutation<
    TrainingCancelMutation,
    TError,
    TrainingCancelMutationVariables,
    TContext
  >(
    ['trainingCancel'],
    (variables?: TrainingCancelMutationVariables) =>
      fetcher<TrainingCancelMutation, TrainingCancelMutationVariables>(
        client,
        TrainingCancelDocument,
        variables,
        headers,
      )(),
    options,
  )
export const TrainingRequestDocument = `
    mutation trainingRequest($input: TrainingRequestInput!) {
  trainingRequest(input: $input) {
    ... on TrainingRequestFailure {
      __typename
      message
    }
    ... on TrainingRequestSuccess {
      __typename
      training {
        hash
      }
    }
  }
}
    `
export const useTrainingRequestMutation = <
  TError = unknown,
  TContext = unknown,
>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    TrainingRequestMutation,
    TError,
    TrainingRequestMutationVariables,
    TContext
  >,
  headers?: RequestInit['headers'],
) =>
  useMutation<
    TrainingRequestMutation,
    TError,
    TrainingRequestMutationVariables,
    TContext
  >(
    ['trainingRequest'],
    (variables?: TrainingRequestMutationVariables) =>
      fetcher<TrainingRequestMutation, TrainingRequestMutationVariables>(
        client,
        TrainingRequestDocument,
        variables,
        headers,
      )(),
    options,
  )

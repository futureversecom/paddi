import type { ChainAddress } from 'core/src/types/chain-address';
import type { HexColour } from 'core/src/types/hex-colour';
import type { Timestamp } from 'core/src/types/timestamp';
import type { UInt256 } from 'core/src/types/uint256';
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { Context, AuthenticatedContext } from '../../graphql/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ChainAddress: ChainAddress;
  HexColour: HexColour;
  Timestamp: Timestamp;
  UInt256: UInt256;
};

export type AgentScenario = {
  readonly __typename?: 'AgentScenario';
  readonly agentType: AgentType;
};

export type AgentScenarioInput = {
  readonly agentType: AgentType;
};

export const enum AgentType {
  Balanced = 'Balanced',
  Heavy = 'Heavy',
  Light = 'Light'
};

export type AggregationStats = {
  readonly __typename?: 'AggregationStats';
  readonly aggregated_data: Scalars['Float'];
  readonly name: Scalars['String'];
};

export type AuthenticateError = ErrorInterface & {
  readonly __typename?: 'AuthenticateError';
  readonly message: Scalars['String'];
};

export type AuthenticateFailure = {
  readonly __typename?: 'AuthenticateFailure';
  readonly errors: ReadonlyArray<AuthenticateError>;
};

export type AuthenticateInput = {
  readonly message: Scalars['String'];
  readonly signature: Scalars['String'];
};

export type AuthenticatePayload = AuthenticateFailure | AuthenticateSuccess;

export type AuthenticateSuccess = {
  readonly __typename?: 'AuthenticateSuccess';
  readonly token: Scalars['String'];
};

export type ErrorInterface = {
  readonly message: Scalars['String'];
};

export type EvaluationOutput = {
  readonly __typename?: 'EvaluationOutput';
  readonly evaluationId: Scalars['String'];
  readonly replayPath: Scalars['String'];
  readonly stats: ReadonlyArray<EvaluationStats>;
};

export type EvaluationStats = AggregationStats | HistogramStats;

export type GasFaucetFailureReason = NotEnoughGasInFaucet | NotEnoughGasInServer | UnknownError;

export type GasFaucetFailureResponse = {
  readonly __typename?: 'GasFaucetFailureResponse';
  readonly reason: GasFaucetFailureReason;
};

export type GasFaucetResponse = GasFaucetFailureResponse | GasFaucetSuccessResponse;

export type GasFaucetSuccessResponse = {
  readonly __typename?: 'GasFaucetSuccessResponse';
  readonly hash: Scalars['String'];
};

export type GenomeAttribute = GenomeAttributeHex | GenomeAttributeInt;

export type GenomeAttributeHex = {
  readonly __typename?: 'GenomeAttributeHex';
  readonly name: Scalars['String'];
  readonly value: Scalars['HexColour'];
};

export type GenomeAttributeInt = {
  readonly __typename?: 'GenomeAttributeInt';
  readonly name: Scalars['String'];
  readonly value: Scalars['Int'];
};

export type GenomeAttributesFailureReason = InvalidTokenId | UnknownError;

export type GenomeAttributesFailureResponse = {
  readonly __typename?: 'GenomeAttributesFailureResponse';
  readonly reason: GenomeAttributesFailureReason;
};

export type GenomeAttributesResponse = GenomeAttributesFailureResponse | GenomeAttributesSuccessResponse;

export type GenomeAttributesSuccessResponse = {
  readonly __typename?: 'GenomeAttributesSuccessResponse';
  readonly genomeAttributes: ReadonlyArray<GenomeAttribute>;
};

export type HistogramStats = {
  readonly __typename?: 'HistogramStats';
  readonly categories: ReadonlyArray<Scalars['String']>;
  readonly data: ReadonlyArray<Scalars['Float']>;
  readonly name: Scalars['String'];
  readonly xAxis: Scalars['String'];
  readonly yAxis: Scalars['String'];
};

export type InvalidTokenId = {
  readonly __typename?: 'InvalidTokenId';
  readonly _?: Maybe<Scalars['Boolean']>;
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly authenticate: AuthenticatePayload;
  readonly gasFaucet: GasFaucetResponse;
  readonly savePinnedNodeId: SavePinnedMemoryPayload;
  readonly testAuth: Scalars['String'];
  readonly trainingCancel: TrainingCancelPayload;
  readonly trainingRequest: TrainingRequestPayload;
};


export type MutationAuthenticateArgs = {
  input: AuthenticateInput;
};


export type MutationGasFaucetArgs = {
  address: Scalars['ChainAddress'];
};


export type MutationSavePinnedNodeIdArgs = {
  hash: Scalars['UInt256'];
  nodeId: Scalars['String'];
};


export type MutationTrainingCancelArgs = {
  hash: Scalars['UInt256'];
};


export type MutationTrainingRequestArgs = {
  input: TrainingRequestInput;
};

export const enum NodeType {
  RootNode = 'RootNode',
  TrainedNode = 'TrainedNode'
};

export type NotEnoughGasInFaucet = {
  readonly __typename?: 'NotEnoughGasInFaucet';
  readonly _?: Maybe<Scalars['Boolean']>;
};

export type NotEnoughGasInServer = {
  readonly __typename?: 'NotEnoughGasInServer';
  readonly _?: Maybe<Scalars['Boolean']>;
};

export type ParentMemoryNodeConfig = {
  readonly memoryId?: InputMaybe<Scalars['Int']>;
  readonly memoryUrl?: InputMaybe<Scalars['String']>;
  readonly type: NodeType;
};

export type PendingNodeSignature = {
  readonly __typename?: 'PendingNodeSignature';
  readonly signature: Scalars['String'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly genomeAttributes: GenomeAttributesResponse;
  readonly healthCheck: Scalars['String'];
  readonly myTrainings: ReadonlyArray<Training>;
  readonly nonce: Scalars['String'];
  readonly pendingNodeSignature: PendingNodeSignature;
  readonly predictTrainingCost: TrainingCostPayload;
};


export type QueryGenomeAttributesArgs = {
  tokenId: Scalars['Int'];
};


export type QueryNonceArgs = {
  userWalletAddress: Scalars['ChainAddress'];
};


export type QueryPendingNodeSignatureArgs = {
  hash: Scalars['UInt256'];
};


export type QueryPredictTrainingCostArgs = {
  trainingParams: TrainingParams;
};

export type RewardConfig = {
  readonly __typename?: 'RewardConfig';
  readonly endurancePenaltyMultiplier: Scalars['Float'];
  readonly loseRound: Scalars['Float'];
  readonly nearMissMultiplier: Scalars['Float'];
  readonly paddleHit: Scalars['Float'];
  readonly survivalRewardMultiplier: Scalars['Float'];
  readonly winRound: Scalars['Float'];
};

export type SavePinnedMemoryPayload = {
  readonly __typename?: 'SavePinnedMemoryPayload';
  readonly success: Scalars['Boolean'];
};

export type Scenario = AgentScenario | WallScenario;

export type ScenarioInput =
  { readonly agent: AgentScenarioInput; readonly wall?: never; }
  |  { readonly agent?: never; readonly wall: WallScenarioInput; };

export type Training = {
  readonly __typename?: 'Training';
  readonly brainId: Scalars['Int'];
  readonly completedUnits?: Maybe<Scalars['Int']>;
  readonly evaluationOutput?: Maybe<ReadonlyArray<EvaluationOutput>>;
  readonly hash: Scalars['UInt256'];
  readonly parentNodeId?: Maybe<Scalars['String']>;
  readonly pinnedNodeId?: Maybe<Scalars['String']>;
  readonly recordState: TrainingState;
  readonly rewardConfig: RewardConfig;
  readonly scenario: Scenario;
  readonly timestamp: Scalars['Timestamp'];
  readonly trainingOutput?: Maybe<TrainingOutput>;
  readonly units: Scalars['Int'];
};

export type TrainingCancelPayload = {
  readonly __typename?: 'TrainingCancelPayload';
  readonly success: Scalars['Boolean'];
};

export type TrainingCostPayload = {
  readonly __typename?: 'TrainingCostPayload';
  readonly astoCost: Scalars['UInt256'];
};

export type TrainingOutput = {
  readonly __typename?: 'TrainingOutput';
  readonly outputPath: Scalars['String'];
};

export type TrainingParams = {
  readonly endurancePenaltyMultiplier: Scalars['Float'];
  readonly loseRound: Scalars['Float'];
  readonly nearMissExponent: Scalars['Float'];
  readonly nearMissMinDistance: Scalars['Float'];
  readonly nearMissMultiplier: Scalars['Float'];
  readonly paddleHit: Scalars['Float'];
  readonly survivalRewardMultiplier: Scalars['Float'];
  readonly trainingRounds: Scalars['Int'];
  readonly winRound: Scalars['Float'];
};

export type TrainingRequestFailure = ErrorInterface & {
  readonly __typename?: 'TrainingRequestFailure';
  readonly message: Scalars['String'];
};

export type TrainingRequestInput = {
  readonly brainId: Scalars['Int'];
  readonly parentMemoryNodeConfig: ParentMemoryNodeConfig;
  readonly scenario: ScenarioInput;
  readonly trainingParams: TrainingParams;
};

export type TrainingRequestPayload = TrainingRequestFailure | TrainingRequestSuccess;

export type TrainingRequestSuccess = {
  readonly __typename?: 'TrainingRequestSuccess';
  readonly training: Training;
};

export const enum TrainingState {
  Canceled = 'Canceled',
  Completed = 'Completed',
  InProgress = 'InProgress',
  Pending = 'Pending'
};

export type UnknownError = {
  readonly __typename?: 'UnknownError';
  readonly _?: Maybe<Scalars['Boolean']>;
};

export type WallScenario = {
  readonly __typename?: 'WallScenario';
  readonly _?: Maybe<Scalars['Boolean']>;
};

export type WallScenarioInput = {
  readonly _?: InputMaybe<Scalars['Boolean']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AgentScenario: ResolverTypeWrapper<AgentScenario>;
  AgentScenarioInput: AgentScenarioInput;
  AgentType: AgentType;
  AggregationStats: ResolverTypeWrapper<AggregationStats>;
  AuthenticateError: ResolverTypeWrapper<AuthenticateError>;
  AuthenticateFailure: ResolverTypeWrapper<AuthenticateFailure>;
  AuthenticateInput: AuthenticateInput;
  AuthenticatePayload: ResolversTypes['AuthenticateFailure'] | ResolversTypes['AuthenticateSuccess'];
  AuthenticateSuccess: ResolverTypeWrapper<AuthenticateSuccess>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ChainAddress: ResolverTypeWrapper<Scalars['ChainAddress']>;
  ErrorInterface: ResolversTypes['AuthenticateError'] | ResolversTypes['TrainingRequestFailure'];
  EvaluationOutput: ResolverTypeWrapper<Omit<EvaluationOutput, 'stats'> & { stats: ReadonlyArray<ResolversTypes['EvaluationStats']> }>;
  EvaluationStats: ResolversTypes['AggregationStats'] | ResolversTypes['HistogramStats'];
  Float: ResolverTypeWrapper<Scalars['Float']>;
  GasFaucetFailureReason: ResolversTypes['NotEnoughGasInFaucet'] | ResolversTypes['NotEnoughGasInServer'] | ResolversTypes['UnknownError'];
  GasFaucetFailureResponse: ResolverTypeWrapper<Omit<GasFaucetFailureResponse, 'reason'> & { reason: ResolversTypes['GasFaucetFailureReason'] }>;
  GasFaucetResponse: ResolversTypes['GasFaucetFailureResponse'] | ResolversTypes['GasFaucetSuccessResponse'];
  GasFaucetSuccessResponse: ResolverTypeWrapper<GasFaucetSuccessResponse>;
  GenomeAttribute: ResolversTypes['GenomeAttributeHex'] | ResolversTypes['GenomeAttributeInt'];
  GenomeAttributeHex: ResolverTypeWrapper<GenomeAttributeHex>;
  GenomeAttributeInt: ResolverTypeWrapper<GenomeAttributeInt>;
  GenomeAttributesFailureReason: ResolversTypes['InvalidTokenId'] | ResolversTypes['UnknownError'];
  GenomeAttributesFailureResponse: ResolverTypeWrapper<Omit<GenomeAttributesFailureResponse, 'reason'> & { reason: ResolversTypes['GenomeAttributesFailureReason'] }>;
  GenomeAttributesResponse: ResolversTypes['GenomeAttributesFailureResponse'] | ResolversTypes['GenomeAttributesSuccessResponse'];
  GenomeAttributesSuccessResponse: ResolverTypeWrapper<Omit<GenomeAttributesSuccessResponse, 'genomeAttributes'> & { genomeAttributes: ReadonlyArray<ResolversTypes['GenomeAttribute']> }>;
  HexColour: ResolverTypeWrapper<Scalars['HexColour']>;
  HistogramStats: ResolverTypeWrapper<HistogramStats>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  InvalidTokenId: ResolverTypeWrapper<InvalidTokenId>;
  Mutation: ResolverTypeWrapper<{}>;
  NodeType: NodeType;
  NotEnoughGasInFaucet: ResolverTypeWrapper<NotEnoughGasInFaucet>;
  NotEnoughGasInServer: ResolverTypeWrapper<NotEnoughGasInServer>;
  ParentMemoryNodeConfig: ParentMemoryNodeConfig;
  PendingNodeSignature: ResolverTypeWrapper<PendingNodeSignature>;
  Query: ResolverTypeWrapper<{}>;
  RewardConfig: ResolverTypeWrapper<RewardConfig>;
  SavePinnedMemoryPayload: ResolverTypeWrapper<SavePinnedMemoryPayload>;
  Scenario: ResolversTypes['AgentScenario'] | ResolversTypes['WallScenario'];
  ScenarioInput: ScenarioInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']>;
  Training: ResolverTypeWrapper<Omit<Training, 'scenario'> & { scenario: ResolversTypes['Scenario'] }>;
  TrainingCancelPayload: ResolverTypeWrapper<TrainingCancelPayload>;
  TrainingCostPayload: ResolverTypeWrapper<TrainingCostPayload>;
  TrainingOutput: ResolverTypeWrapper<TrainingOutput>;
  TrainingParams: TrainingParams;
  TrainingRequestFailure: ResolverTypeWrapper<TrainingRequestFailure>;
  TrainingRequestInput: TrainingRequestInput;
  TrainingRequestPayload: ResolversTypes['TrainingRequestFailure'] | ResolversTypes['TrainingRequestSuccess'];
  TrainingRequestSuccess: ResolverTypeWrapper<TrainingRequestSuccess>;
  TrainingState: TrainingState;
  UInt256: ResolverTypeWrapper<Scalars['UInt256']>;
  UnknownError: ResolverTypeWrapper<UnknownError>;
  WallScenario: ResolverTypeWrapper<WallScenario>;
  WallScenarioInput: WallScenarioInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AgentScenario: AgentScenario;
  AgentScenarioInput: AgentScenarioInput;
  AggregationStats: AggregationStats;
  AuthenticateError: AuthenticateError;
  AuthenticateFailure: AuthenticateFailure;
  AuthenticateInput: AuthenticateInput;
  AuthenticatePayload: ResolversParentTypes['AuthenticateFailure'] | ResolversParentTypes['AuthenticateSuccess'];
  AuthenticateSuccess: AuthenticateSuccess;
  Boolean: Scalars['Boolean'];
  ChainAddress: Scalars['ChainAddress'];
  ErrorInterface: ResolversParentTypes['AuthenticateError'] | ResolversParentTypes['TrainingRequestFailure'];
  EvaluationOutput: Omit<EvaluationOutput, 'stats'> & { stats: ReadonlyArray<ResolversParentTypes['EvaluationStats']> };
  EvaluationStats: ResolversParentTypes['AggregationStats'] | ResolversParentTypes['HistogramStats'];
  Float: Scalars['Float'];
  GasFaucetFailureReason: ResolversParentTypes['NotEnoughGasInFaucet'] | ResolversParentTypes['NotEnoughGasInServer'] | ResolversParentTypes['UnknownError'];
  GasFaucetFailureResponse: Omit<GasFaucetFailureResponse, 'reason'> & { reason: ResolversParentTypes['GasFaucetFailureReason'] };
  GasFaucetResponse: ResolversParentTypes['GasFaucetFailureResponse'] | ResolversParentTypes['GasFaucetSuccessResponse'];
  GasFaucetSuccessResponse: GasFaucetSuccessResponse;
  GenomeAttribute: ResolversParentTypes['GenomeAttributeHex'] | ResolversParentTypes['GenomeAttributeInt'];
  GenomeAttributeHex: GenomeAttributeHex;
  GenomeAttributeInt: GenomeAttributeInt;
  GenomeAttributesFailureReason: ResolversParentTypes['InvalidTokenId'] | ResolversParentTypes['UnknownError'];
  GenomeAttributesFailureResponse: Omit<GenomeAttributesFailureResponse, 'reason'> & { reason: ResolversParentTypes['GenomeAttributesFailureReason'] };
  GenomeAttributesResponse: ResolversParentTypes['GenomeAttributesFailureResponse'] | ResolversParentTypes['GenomeAttributesSuccessResponse'];
  GenomeAttributesSuccessResponse: Omit<GenomeAttributesSuccessResponse, 'genomeAttributes'> & { genomeAttributes: ReadonlyArray<ResolversParentTypes['GenomeAttribute']> };
  HexColour: Scalars['HexColour'];
  HistogramStats: HistogramStats;
  Int: Scalars['Int'];
  InvalidTokenId: InvalidTokenId;
  Mutation: {};
  NotEnoughGasInFaucet: NotEnoughGasInFaucet;
  NotEnoughGasInServer: NotEnoughGasInServer;
  ParentMemoryNodeConfig: ParentMemoryNodeConfig;
  PendingNodeSignature: PendingNodeSignature;
  Query: {};
  RewardConfig: RewardConfig;
  SavePinnedMemoryPayload: SavePinnedMemoryPayload;
  Scenario: ResolversParentTypes['AgentScenario'] | ResolversParentTypes['WallScenario'];
  ScenarioInput: ScenarioInput;
  String: Scalars['String'];
  Timestamp: Scalars['Timestamp'];
  Training: Omit<Training, 'scenario'> & { scenario: ResolversParentTypes['Scenario'] };
  TrainingCancelPayload: TrainingCancelPayload;
  TrainingCostPayload: TrainingCostPayload;
  TrainingOutput: TrainingOutput;
  TrainingParams: TrainingParams;
  TrainingRequestFailure: TrainingRequestFailure;
  TrainingRequestInput: TrainingRequestInput;
  TrainingRequestPayload: ResolversParentTypes['TrainingRequestFailure'] | ResolversParentTypes['TrainingRequestSuccess'];
  TrainingRequestSuccess: TrainingRequestSuccess;
  UInt256: Scalars['UInt256'];
  UnknownError: UnknownError;
  WallScenario: WallScenario;
  WallScenarioInput: WallScenarioInput;
}>;

export type AuthenticatedDirectiveArgs = { };

export type AuthenticatedDirectiveResolver<Result, Parent, ContextType = Context, Args = AuthenticatedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type OneOfDirectiveArgs = { };

export type OneOfDirectiveResolver<Result, Parent, ContextType = Context, Args = OneOfDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AgentScenarioResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AgentScenario'] = ResolversParentTypes['AgentScenario']> = ResolversObject<{
  agentType?: Resolver<ResolversTypes['AgentType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AggregationStatsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AggregationStats'] = ResolversParentTypes['AggregationStats']> = ResolversObject<{
  aggregated_data?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthenticateErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthenticateError'] = ResolversParentTypes['AuthenticateError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthenticateFailureResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthenticateFailure'] = ResolversParentTypes['AuthenticateFailure']> = ResolversObject<{
  errors?: Resolver<ReadonlyArray<ResolversTypes['AuthenticateError']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthenticatePayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthenticatePayload'] = ResolversParentTypes['AuthenticatePayload']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AuthenticateFailure' | 'AuthenticateSuccess', ParentType, ContextType>;
}>;

export type AuthenticateSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthenticateSuccess'] = ResolversParentTypes['AuthenticateSuccess']> = ResolversObject<{
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface ChainAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ChainAddress'], any> {
  name: 'ChainAddress';
}

export type ErrorInterfaceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ErrorInterface'] = ResolversParentTypes['ErrorInterface']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AuthenticateError' | 'TrainingRequestFailure', ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type EvaluationOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EvaluationOutput'] = ResolversParentTypes['EvaluationOutput']> = ResolversObject<{
  evaluationId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  replayPath?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stats?: Resolver<ReadonlyArray<ResolversTypes['EvaluationStats']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EvaluationStatsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EvaluationStats'] = ResolversParentTypes['EvaluationStats']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AggregationStats' | 'HistogramStats', ParentType, ContextType>;
}>;

export type GasFaucetFailureReasonResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GasFaucetFailureReason'] = ResolversParentTypes['GasFaucetFailureReason']> = ResolversObject<{
  __resolveType: TypeResolveFn<'NotEnoughGasInFaucet' | 'NotEnoughGasInServer' | 'UnknownError', ParentType, ContextType>;
}>;

export type GasFaucetFailureResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GasFaucetFailureResponse'] = ResolversParentTypes['GasFaucetFailureResponse']> = ResolversObject<{
  reason?: Resolver<ResolversTypes['GasFaucetFailureReason'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GasFaucetResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GasFaucetResponse'] = ResolversParentTypes['GasFaucetResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'GasFaucetFailureResponse' | 'GasFaucetSuccessResponse', ParentType, ContextType>;
}>;

export type GasFaucetSuccessResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GasFaucetSuccessResponse'] = ResolversParentTypes['GasFaucetSuccessResponse']> = ResolversObject<{
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GenomeAttributeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GenomeAttribute'] = ResolversParentTypes['GenomeAttribute']> = ResolversObject<{
  __resolveType: TypeResolveFn<'GenomeAttributeHex' | 'GenomeAttributeInt', ParentType, ContextType>;
}>;

export type GenomeAttributeHexResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GenomeAttributeHex'] = ResolversParentTypes['GenomeAttributeHex']> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['HexColour'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GenomeAttributeIntResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GenomeAttributeInt'] = ResolversParentTypes['GenomeAttributeInt']> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GenomeAttributesFailureReasonResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GenomeAttributesFailureReason'] = ResolversParentTypes['GenomeAttributesFailureReason']> = ResolversObject<{
  __resolveType: TypeResolveFn<'InvalidTokenId' | 'UnknownError', ParentType, ContextType>;
}>;

export type GenomeAttributesFailureResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GenomeAttributesFailureResponse'] = ResolversParentTypes['GenomeAttributesFailureResponse']> = ResolversObject<{
  reason?: Resolver<ResolversTypes['GenomeAttributesFailureReason'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GenomeAttributesResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GenomeAttributesResponse'] = ResolversParentTypes['GenomeAttributesResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'GenomeAttributesFailureResponse' | 'GenomeAttributesSuccessResponse', ParentType, ContextType>;
}>;

export type GenomeAttributesSuccessResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GenomeAttributesSuccessResponse'] = ResolversParentTypes['GenomeAttributesSuccessResponse']> = ResolversObject<{
  genomeAttributes?: Resolver<ReadonlyArray<ResolversTypes['GenomeAttribute']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface HexColourScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['HexColour'], any> {
  name: 'HexColour';
}

export type HistogramStatsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['HistogramStats'] = ResolversParentTypes['HistogramStats']> = ResolversObject<{
  categories?: Resolver<ReadonlyArray<ResolversTypes['String']>, ParentType, ContextType>;
  data?: Resolver<ReadonlyArray<ResolversTypes['Float']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  xAxis?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  yAxis?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InvalidTokenIdResolvers<ContextType = Context, ParentType extends ResolversParentTypes['InvalidTokenId'] = ResolversParentTypes['InvalidTokenId']> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  authenticate?: Resolver<ResolversTypes['AuthenticatePayload'], ParentType, ContextType, RequireFields<MutationAuthenticateArgs, 'input'>>;
  gasFaucet?: Resolver<ResolversTypes['GasFaucetResponse'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationGasFaucetArgs, 'address'>>;
  savePinnedNodeId?: Resolver<ResolversTypes['SavePinnedMemoryPayload'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationSavePinnedNodeIdArgs, 'hash' | 'nodeId'>>;
  testAuth?: Resolver<ResolversTypes['String'], ParentType, AuthenticatedContext<ContextType>>;
  trainingCancel?: Resolver<ResolversTypes['TrainingCancelPayload'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationTrainingCancelArgs, 'hash'>>;
  trainingRequest?: Resolver<ResolversTypes['TrainingRequestPayload'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationTrainingRequestArgs, 'input'>>;
}>;

export type NotEnoughGasInFaucetResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NotEnoughGasInFaucet'] = ResolversParentTypes['NotEnoughGasInFaucet']> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NotEnoughGasInServerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NotEnoughGasInServer'] = ResolversParentTypes['NotEnoughGasInServer']> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PendingNodeSignatureResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PendingNodeSignature'] = ResolversParentTypes['PendingNodeSignature']> = ResolversObject<{
  signature?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  genomeAttributes?: Resolver<ResolversTypes['GenomeAttributesResponse'], ParentType, ContextType, RequireFields<QueryGenomeAttributesArgs, 'tokenId'>>;
  healthCheck?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  myTrainings?: Resolver<ReadonlyArray<ResolversTypes['Training']>, ParentType, AuthenticatedContext<ContextType>>;
  nonce?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryNonceArgs, 'userWalletAddress'>>;
  pendingNodeSignature?: Resolver<ResolversTypes['PendingNodeSignature'], ParentType, AuthenticatedContext<ContextType>, RequireFields<QueryPendingNodeSignatureArgs, 'hash'>>;
  predictTrainingCost?: Resolver<ResolversTypes['TrainingCostPayload'], ParentType, ContextType, RequireFields<QueryPredictTrainingCostArgs, 'trainingParams'>>;
}>;

export type RewardConfigResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RewardConfig'] = ResolversParentTypes['RewardConfig']> = ResolversObject<{
  endurancePenaltyMultiplier?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  loseRound?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  nearMissMultiplier?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  paddleHit?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  survivalRewardMultiplier?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  winRound?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SavePinnedMemoryPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SavePinnedMemoryPayload'] = ResolversParentTypes['SavePinnedMemoryPayload']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScenarioResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Scenario'] = ResolversParentTypes['Scenario']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AgentScenario' | 'WallScenario', ParentType, ContextType>;
}>;

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export type TrainingResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Training'] = ResolversParentTypes['Training']> = ResolversObject<{
  brainId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  completedUnits?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  evaluationOutput?: Resolver<Maybe<ReadonlyArray<ResolversTypes['EvaluationOutput']>>, ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['UInt256'], ParentType, ContextType>;
  parentNodeId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pinnedNodeId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  recordState?: Resolver<ResolversTypes['TrainingState'], ParentType, ContextType>;
  rewardConfig?: Resolver<ResolversTypes['RewardConfig'], ParentType, ContextType>;
  scenario?: Resolver<ResolversTypes['Scenario'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  trainingOutput?: Resolver<Maybe<ResolversTypes['TrainingOutput']>, ParentType, ContextType>;
  units?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TrainingCancelPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TrainingCancelPayload'] = ResolversParentTypes['TrainingCancelPayload']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TrainingCostPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TrainingCostPayload'] = ResolversParentTypes['TrainingCostPayload']> = ResolversObject<{
  astoCost?: Resolver<ResolversTypes['UInt256'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TrainingOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TrainingOutput'] = ResolversParentTypes['TrainingOutput']> = ResolversObject<{
  outputPath?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TrainingRequestFailureResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TrainingRequestFailure'] = ResolversParentTypes['TrainingRequestFailure']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TrainingRequestPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TrainingRequestPayload'] = ResolversParentTypes['TrainingRequestPayload']> = ResolversObject<{
  __resolveType: TypeResolveFn<'TrainingRequestFailure' | 'TrainingRequestSuccess', ParentType, ContextType>;
}>;

export type TrainingRequestSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TrainingRequestSuccess'] = ResolversParentTypes['TrainingRequestSuccess']> = ResolversObject<{
  training?: Resolver<ResolversTypes['Training'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UInt256ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UInt256'], any> {
  name: 'UInt256';
}

export type UnknownErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UnknownError'] = ResolversParentTypes['UnknownError']> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WallScenarioResolvers<ContextType = Context, ParentType extends ResolversParentTypes['WallScenario'] = ResolversParentTypes['WallScenario']> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  AgentScenario?: AgentScenarioResolvers<ContextType>;
  AggregationStats?: AggregationStatsResolvers<ContextType>;
  AuthenticateError?: AuthenticateErrorResolvers<ContextType>;
  AuthenticateFailure?: AuthenticateFailureResolvers<ContextType>;
  AuthenticatePayload?: AuthenticatePayloadResolvers<ContextType>;
  AuthenticateSuccess?: AuthenticateSuccessResolvers<ContextType>;
  ChainAddress?: GraphQLScalarType;
  ErrorInterface?: ErrorInterfaceResolvers<ContextType>;
  EvaluationOutput?: EvaluationOutputResolvers<ContextType>;
  EvaluationStats?: EvaluationStatsResolvers<ContextType>;
  GasFaucetFailureReason?: GasFaucetFailureReasonResolvers<ContextType>;
  GasFaucetFailureResponse?: GasFaucetFailureResponseResolvers<ContextType>;
  GasFaucetResponse?: GasFaucetResponseResolvers<ContextType>;
  GasFaucetSuccessResponse?: GasFaucetSuccessResponseResolvers<ContextType>;
  GenomeAttribute?: GenomeAttributeResolvers<ContextType>;
  GenomeAttributeHex?: GenomeAttributeHexResolvers<ContextType>;
  GenomeAttributeInt?: GenomeAttributeIntResolvers<ContextType>;
  GenomeAttributesFailureReason?: GenomeAttributesFailureReasonResolvers<ContextType>;
  GenomeAttributesFailureResponse?: GenomeAttributesFailureResponseResolvers<ContextType>;
  GenomeAttributesResponse?: GenomeAttributesResponseResolvers<ContextType>;
  GenomeAttributesSuccessResponse?: GenomeAttributesSuccessResponseResolvers<ContextType>;
  HexColour?: GraphQLScalarType;
  HistogramStats?: HistogramStatsResolvers<ContextType>;
  InvalidTokenId?: InvalidTokenIdResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NotEnoughGasInFaucet?: NotEnoughGasInFaucetResolvers<ContextType>;
  NotEnoughGasInServer?: NotEnoughGasInServerResolvers<ContextType>;
  PendingNodeSignature?: PendingNodeSignatureResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RewardConfig?: RewardConfigResolvers<ContextType>;
  SavePinnedMemoryPayload?: SavePinnedMemoryPayloadResolvers<ContextType>;
  Scenario?: ScenarioResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  Training?: TrainingResolvers<ContextType>;
  TrainingCancelPayload?: TrainingCancelPayloadResolvers<ContextType>;
  TrainingCostPayload?: TrainingCostPayloadResolvers<ContextType>;
  TrainingOutput?: TrainingOutputResolvers<ContextType>;
  TrainingRequestFailure?: TrainingRequestFailureResolvers<ContextType>;
  TrainingRequestPayload?: TrainingRequestPayloadResolvers<ContextType>;
  TrainingRequestSuccess?: TrainingRequestSuccessResolvers<ContextType>;
  UInt256?: GraphQLScalarType;
  UnknownError?: UnknownErrorResolvers<ContextType>;
  WallScenario?: WallScenarioResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = Context> = ResolversObject<{
  authenticated?: AuthenticatedDirectiveResolver<any, any, ContextType>;
  oneOf?: OneOfDirectiveResolver<any, any, ContextType>;
}>;

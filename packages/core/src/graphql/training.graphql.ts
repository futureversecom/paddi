import { gql } from 'graphql-tag'

export const training = gql`
  type Query {
    predictTrainingCost(trainingParams: TrainingParams!): TrainingCostPayload!
    myTrainings: [Training!]! @authenticated
    pendingNodeSignature(hash: UInt256!): PendingNodeSignature! @authenticated
  }

  type SavePinnedMemoryPayload {
    success: Boolean!
  }

  type PendingNodeSignature {
    signature: String!
  }

  type TrainingCostPayload {
    astoCost: UInt256! # Measured in wei
  }

  type Mutation {
    trainingRequest(input: TrainingRequestInput!): TrainingRequestPayload!
      @authenticated
    trainingCancel(hash: UInt256!): TrainingCancelPayload! @authenticated
    savePinnedNodeId(hash: UInt256!, nodeId: String!): SavePinnedMemoryPayload!
      @authenticated
  }

  type TrainingCancelPayload {
    success: Boolean!
  }

  input TrainingRequestInput {
    brainId: Int!
    # opponentBrainId: Int!
    trainingParams: TrainingParams!
    parentMemoryNodeConfig: ParentMemoryNodeConfig!
    scenario: ScenarioInput!
  }

  enum AgentType {
    Balanced
    Light
    Heavy
  }

  input WallScenarioInput {
    _: Boolean
  }

  input AgentScenarioInput {
    agentType: AgentType!
  }

  input ScenarioInput @oneOf {
    wall: WallScenarioInput
    agent: AgentScenarioInput
  }

  type WallScenario {
    _: Boolean
  }

  type AgentScenario {
    agentType: AgentType!
  }

  union Scenario = WallScenario | AgentScenario

  input TrainingParams {
    winRound: Float!
    loseRound: Float!
    paddleHit: Float!
    nearMissMultiplier: Float!
    nearMissExponent: Float!
    nearMissMinDistance: Float!
    survivalRewardMultiplier: Float!
    endurancePenaltyMultiplier: Float!
    trainingRounds: Int!
  }

  input ParentMemoryNodeConfig {
    type: NodeType!
    memoryId: Int
    memoryUrl: String
  }

  enum NodeType {
    RootNode
    TrainedNode
  }

  union TrainingRequestPayload = TrainingRequestFailure | TrainingRequestSuccess

  type TrainingRequestSuccess {
    training: Training!
  }

  type Training {
    hash: UInt256!
    brainId: Int!
    timestamp: Timestamp!
    recordState: TrainingState!
    trainingOutput: TrainingOutput
    evaluationOutput: [EvaluationOutput!]
    # Null if it's based on RootNode
    parentNodeId: String
    units: Int!
    completedUnits: Int
    pinnedNodeId: String
    rewardConfig: RewardConfig!
    scenario: Scenario!
  }

  type RewardConfig {
    winRound: Float!
    loseRound: Float!
    paddleHit: Float!
    nearMissMultiplier: Float!
    survivalRewardMultiplier: Float!
    endurancePenaltyMultiplier: Float!
  }

  type TrainingOutput {
    outputPath: String!
  }

  type HistogramStats {
    name: String!
    xAxis: String!
    yAxis: String!
    categories: [String!]!
    data: [Float!]!
  }

  type AggregationStats {
    name: String!
    aggregated_data: Float!
  }

  union EvaluationStats = HistogramStats | AggregationStats

  type EvaluationOutput {
    evaluationId: String!
    replayPath: String!
    stats: [EvaluationStats!]!
  }

  type TrainingRequestFailure implements ErrorInterface {
    message: String!
  }

  enum TrainingState {
    Pending
    Canceled
    InProgress
    Completed
  }
`

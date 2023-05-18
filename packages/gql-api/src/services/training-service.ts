import type { Timestamp, UInt256 } from 'core/src/types'
import type { ChainAddress } from 'core/src/types/chain-address'
import { getHash } from 'core/src/utils/ethereum'
import { abis } from 'core-backend/src/contracts/abi'
import type { ComputeManagerInteractions } from 'core-backend/src/contracts/compute-manager-interactions'
import type {
  EvaluationStats,
  TrainingRecord,
  TrainingRecordMemoryConfig,
  TrainingRecordScenario,
} from 'core-backend/src/entities/training-record'
import { makeTrainingEventRecordHK } from 'core-backend/src/entities/training-record'
import type { TrainingRecordRepository } from 'core-backend/src/repositories'
import type { Wallet } from 'ethers'
import { utils } from 'ethers'
import { array, option, record, semigroup } from 'fp-ts'
import { absurd, pipe } from 'fp-ts/function'
import { isLeft } from 'fp-ts/lib/Either'
import * as O from 'fp-ts/Option'
// TODO: avoid depending on graphql types in core
import type {
  AgentType,
  EvaluationOutput,
  EvaluationStats as EvaluationStatsGql,
  GenomeAttribute,
  ParentMemoryNodeConfig,
  Scenario,
  ScenarioInput,
  Training,
  TrainingParams,
  TrainingRequestInput,
  TrainingState,
} from 'gql-api/src/generated/gql'
// TODO: avoid depending on graphql types in core
import { NodeType } from 'gql-api/src/generated/gql'

import type { BrainStatsService } from './brain-stats-service'
import { AgentToAgentConfigMapping } from './pre-trained-agents'

const mapEvaluationStats = (stat: EvaluationStats): EvaluationStatsGql => {
  switch (stat.type) {
    case 'aggregation':
      return {
        __typename: 'AggregationStats',
        name: stat.name,
        aggregated_data: stat.data,
      }
    case 'histogram':
      return {
        __typename: 'HistogramStats',
        name: stat.name,
        xAxis: stat.x_axis,
        yAxis: stat.y_axis,
        categories: stat.categories,
        data: stat.data,
      }
    default:
      return absurd(stat)
  }
}

export class TrainingService {
  public constructor(
    private trainingRecordRepository: TrainingRecordRepository,
    private computeManagerInteractions: ComputeManagerInteractions,
    private brainStatsService: BrainStatsService,
    private wallet: Wallet,
  ) {}

  public async requestTraining(
    request: TrainingRequestInput,
    requestedBy: ChainAddress,
  ) {
    const result = await this.brainStatsService.genomeAttributes(
      request.brainId,
    )
    if (isLeft(result)) {
      throw new Error(
        `Get Genome Attributes Error, ${result.left.reason.__typename}`,
      )
    }
    // safer keyBy..
    const genomeAttributes = record.fromFoldableMap(
      semigroup.last<GenomeAttribute>(),
      array.Foldable,
    )([...result.right.genomeAttributes], v => [v.name, v])

    // TODO: maybe generate hash from frontend?
    const hash = getHash({
      ...request,
      timestamp: Date.now(), // to add some randomness
    })

    const memoryConfig = this.getTrainingRecordMemoryConfig(
      request.parentMemoryNodeConfig,
    )
    const scenario = this.getTrainingRecordScenario(request.scenario)

    const trainingRecord: TrainingRecord = {
      recordState: 'Pending',
      memoryConfig,
      scenario,
      timestamp: Date.now() as Timestamp,
      version: 0,
      hash,
      requestedBy,
      hk: makeTrainingEventRecordHK(hash),
      units: request.trainingParams.trainingRounds,
      brainId: request.brainId,
      // Might need to refactor brainStatsService a bit to get rid of these..
      genomeAttributes: {
        size: (genomeAttributes['size']?.value as number) / 10,
        strength: (genomeAttributes['strength']?.value as number) / 10,
        max_speed: (genomeAttributes['speed']?.value as number) / 10,
        endurance: (genomeAttributes['endurance']?.value as number) / 10,
      },
      rewardConfig: {
        win_round: request.trainingParams.winRound,
        lose_round: request.trainingParams.loseRound,
        paddle_hit: request.trainingParams.paddleHit,
        near_miss_multiplier: request.trainingParams.nearMissMultiplier,
        near_miss_exponent: request.trainingParams.nearMissExponent,
        near_miss_min_distance: request.trainingParams.nearMissMinDistance,
        survival_reward_multiplier:
          request.trainingParams.survivalRewardMultiplier,
        endurance_penalty_multiplier:
          request.trainingParams.endurancePenaltyMultiplier,
      },
      completedUnits: option.none,
      trainingOutput: option.none,
      evaluationOutput: option.none,
      pinnedNodeId: option.none,
    }

    await this.trainingRecordRepository.store(trainingRecord)

    return trainingRecord
  }

  public async predictTrainingCost(trainingParams: TrainingParams) {
    const maybeUnitCost = await this.computeManagerInteractions.getComputeCost(
      trainingParams.trainingRounds,
    )

    if (isLeft(maybeUnitCost)) {
      throw Error('Unable to get unit cost')
    }

    return {
      astoCost: maybeUnitCost.right,
    }
  }

  public async getTraining(hash: UInt256) {
    const hk = makeTrainingEventRecordHK(hash)
    return this.trainingRecordRepository.get(hk)
  }

  public async getTrainings(userWalletAddress: ChainAddress) {
    return this.trainingRecordRepository.getByWalletAddress(userWalletAddress)
  }

  public async getPendingNodeSig(hash: UInt256): Promise<string> {
    const training = await this.getTraining(hash)
    if (training === null) {
      throw new Error('no such record!')
    }
    if (option.isNone(training.trainingOutput)) {
      throw new Error('training not completed yet')
    }
    const storageURI = training.trainingOutput.value.outputPath

    const parentNodeId =
      training.memoryConfig.type === 'TrainedNode'
        ? training.memoryConfig.memory.memory_id
        : null
    const bytes32hash = utils.zeroPad(training.hash, 32)

    let msgHash
    if (parentNodeId == null) {
      // New memory tree
      const params = [
        abis.MockBrain.address,
        training.brainId,
        bytes32hash,
        storageURI,
      ]
      msgHash = utils.solidityKeccak256(
        ['address', 'uint256', 'bytes32', 'string'],
        params,
      )
    } else {
      // New node in tree
      const params = [Number.parseInt(parentNodeId), bytes32hash, storageURI]
      msgHash = utils.solidityKeccak256(
        ['uint256', 'bytes32', 'string'],
        params,
      )
    }

    return this.wallet.signMessage(utils.arrayify(msgHash))
  }

  public updateRecord(record: TrainingRecord) {
    return this.trainingRecordRepository.store({
      ...record,
      version: record.version + 1,
    })
  }

  // Define a DTO somewhere else?
  public mapRecordToGraphqlOutput(training: TrainingRecord): Training {
    const evaluationOutput = pipe(
      training.evaluationOutput,
      O.map(record =>
        Object.entries(record).map(
          ([key, value]): EvaluationOutput => ({
            evaluationId: key,
            replayPath: value.replayPath,
            stats: value.stats.map(mapEvaluationStats),
          }),
        ),
      ),
    )

    const parentNodeId =
      training.memoryConfig.type === 'TrainedNode'
        ? training.memoryConfig.memory.memory_id
        : null

    const rewardConfig = {
      winRound: training.rewardConfig.win_round,
      loseRound: training.rewardConfig.lose_round,
      paddleHit: training.rewardConfig.paddle_hit,
      nearMissMultiplier: training.rewardConfig.near_miss_multiplier,
      survivalRewardMultiplier:
        training.rewardConfig.survival_reward_multiplier,
      endurancePenaltyMultiplier:
        training.rewardConfig.endurance_penalty_multiplier,
    }

    let scenario: Scenario = {
      __typename: 'WallScenario',
    }
    if (
      training.scenario.scenario_type === 'Agent' &&
      training.scenario.agent_config.memory_config.type === 'TrainedNode'
    ) {
      scenario = {
        __typename: 'AgentScenario',
        // Base on the fact the memory_id is AgentType in AgentToAgentConfigMapping
        agentType: training.scenario.agent_config.memory_config.memory
          .memory_id as AgentType,
      }
    }

    return {
      recordState: training.recordState as TrainingState,
      brainId: training.brainId,
      hash: training.hash,
      timestamp: training.timestamp,
      parentNodeId,
      units: training.units,
      rewardConfig,
      scenario,
      trainingOutput: O.toNullable(training.trainingOutput),
      evaluationOutput: O.toNullable(evaluationOutput),
      completedUnits: O.toNullable(training.completedUnits),
      pinnedNodeId: training.pinnedNodeId
        ? O.toNullable(training.pinnedNodeId)
        : null,
    }
  }

  private getTrainingRecordMemoryConfig = (
    parentMemoryNodeConfig: ParentMemoryNodeConfig,
  ): TrainingRecordMemoryConfig => {
    if (parentMemoryNodeConfig.type === NodeType.RootNode) {
      return {
        type: NodeType.RootNode,
      }
    }
    if (!parentMemoryNodeConfig.memoryId || !parentMemoryNodeConfig.memoryUrl) {
      throw new Error('Missing memoryId or memoryUrl in the payload')
    }
    // Should we verify this node's owner here?
    // Not really; someone else could pay for someone's training.
    // But they can't own the memory unless they own the brain.
    // This could be done in the contract if we really need to. -- Pul
    return {
      type: NodeType.TrainedNode,
      memory: {
        memory_id: parentMemoryNodeConfig.memoryId.toString(),
        memory_url: parentMemoryNodeConfig.memoryUrl,
      },
    }
  }

  private getTrainingRecordScenario = (
    scenario: ScenarioInput,
  ): TrainingRecordScenario => {
    if (scenario.wall) {
      return {
        scenario_type: 'Wall',
      }
    }

    if (scenario.agent) {
      return {
        scenario_type: 'Agent',
        agent_config: AgentToAgentConfigMapping[scenario.agent.agentType],
      }
    }

    return absurd(scenario)
  }
}

import type { UInt256 } from 'core/src/types'
import { ChainAddressC, TimestampCodec, UInt256Codec } from 'core/src/types'
import { optionC } from 'core/src/types/option'
import { coerceCodec } from 'core/src/types/utils'
import { pipe } from 'fp-ts/lib/function'
import * as Codec from 'io-ts/Codec'

/**
 * HK
 */

export interface TrainingRecordHKBrand {
  readonly TrainingEventRecordHK: unique symbol
}

export type TrainingRecordHK = string & TrainingRecordHKBrand

const TrainingRecordHKCodec = coerceCodec<string, TrainingRecordHK>(
  Codec.string,
)

/**
 *
 * @param hash
 */
export function makeTrainingEventRecordHK(hash: UInt256): TrainingRecordHK {
  return `hash:${hash}` as TrainingRecordHK
}

export const RewardConfigC = Codec.struct({
  win_round: Codec.number,
  lose_round: Codec.number,
  paddle_hit: Codec.number,
  near_miss_multiplier: Codec.number,
  near_miss_exponent: Codec.number,
  near_miss_min_distance: Codec.number,
  survival_reward_multiplier: Codec.number,
  endurance_penalty_multiplier: Codec.number,
})

const GenomeAttributesC = Codec.struct({
  size: Codec.number,
  strength: Codec.number,
  max_speed: Codec.number,
  endurance: Codec.number,
})

export type GenomeAttributes = Codec.TypeOf<typeof GenomeAttributesC>

const RootNodeC = Codec.struct({
  type: Codec.literal('RootNode'),
})

const TrainedNodeC = Codec.struct({
  type: Codec.literal('TrainedNode'),
  memory: Codec.struct({
    memory_id: Codec.string,
    memory_url: Codec.string,
  }),
})

const MemoryConfigC = Codec.sum('type')({
  ['RootNode']: RootNodeC,
  ['TrainedNode']: TrainedNodeC,
})

const AgentConfigC = Codec.struct({
  memory_config: MemoryConfigC,
  genome_attributes: GenomeAttributesC,
})

export type AgentConfig = Codec.TypeOf<typeof AgentConfigC>

const AgentC = Codec.struct({
  scenario_type: Codec.literal('Agent'),
  agent_config: AgentConfigC,
})

const WallC = Codec.struct({
  scenario_type: Codec.literal('Wall'),
})

const ScenarioC = Codec.sum('scenario_type')({
  ['Agent']: AgentC,
  ['Wall']: WallC,
})

const TrainingOutputC = Codec.struct({
  outputPath: Codec.string,
})

const HistogramStats = Codec.struct({
  type: Codec.literal('histogram'),
  name: Codec.string,
  x_axis: Codec.string,
  y_axis: Codec.string,
  categories: Codec.readonly(Codec.array(Codec.string)),
  data: Codec.readonly(Codec.array(Codec.number)),
})

const AggregationStats = Codec.struct({
  type: Codec.literal('aggregation'),
  name: Codec.string,
  data: Codec.number,
})

const EvaluationStats = Codec.sum('type')({
  histogram: HistogramStats,
  aggregation: AggregationStats,
})

export type EvaluationStats = Codec.TypeOf<typeof EvaluationStats>

const EvaluationOutputC = pipe(
  Codec.struct({ replayPath: Codec.string }),
  Codec.intersect(
    Codec.partial({ stats: Codec.readonly(Codec.array(EvaluationStats)) }),
  ),
  Codec.imap(
    a => ({ ...a, stats: a.stats ?? [] }),
    b => b,
  ),
)

const EvaluationOutputRecordC = Codec.record(EvaluationOutputC)

// Some of these fields may not be common, can move to different status when needed
export const TrainingRecordRequiredC = Codec.struct({
  /** Training request hash */
  hash: UInt256Codec,

  /** Hash-key: `hash:${event.hash}` */
  hk: TrainingRecordHKCodec,

  /** Address of the user who requested the training */
  requestedBy: ChainAddressC,

  /** Number of units to train */
  units: Codec.number,

  /** BrainId of the brain to train */
  brainId: Codec.number, // TODO: use UInt256Codec for ether id

  /** Timestamp of request event */
  timestamp: TimestampCodec,
  /** For optimistic concurrency */
  version: Codec.number,

  /** Reward config for the training */
  rewardConfig: RewardConfigC,

  /** Memory config for the training */
  memoryConfig: MemoryConfigC,

  /** Mapped genome attributes of the brain */
  genomeAttributes: GenomeAttributesC,

  /** The scenario for the agent to train against */
  scenario: ScenarioC,

  /** The number of units to train per batch */
  completedUnits: optionC(Codec.number),

  /** The output path of the training */
  trainingOutput: optionC(TrainingOutputC),

  /** The output results of the evaluation */
  evaluationOutput: optionC(EvaluationOutputRecordC),

  recordState: Codec.literal('Pending', 'InProgress', 'Completed', 'Canceled'),
})

const TrainingRecordOptionalC = Codec.partial({
  /** Node id of the pinned memory in the memory tree */
  pinnedNodeId: optionC(Codec.string),
})

export const TrainingRecordCodec = pipe(
  TrainingRecordRequiredC,
  Codec.intersect(TrainingRecordOptionalC),
)

export type TrainingRecord = Codec.TypeOf<typeof TrainingRecordCodec>
export type TrainingRecordScenario = Codec.TypeOf<typeof ScenarioC>
export type TrainingRecordMemoryConfig = Codec.TypeOf<typeof MemoryConfigC>

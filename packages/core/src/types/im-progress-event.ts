import * as S from '@fp-ts/schema'
import { pipe } from 'fp-ts/lib/function'

import type {
  AggregationStats as IAggregationStats,
  EvaluationOutput as IEvaluationOutput,
  HistogramStats as IHistogramStats,
  IMCompleted as IIMCompleted,
  IMEvaluationCompleted as IIMEvaluationCompleted,
  IMEvaluationStarted as IIMEvaluationStarted,
  IMProgressEvent as IIMProgressEvent,
  IMStarted as IIMStarted,
  IMTrainingCompleted as IIMTrainingCompleted,
  IMTrainingUnitCompleted as IIMTrainingUnitCompleted,
  TrainingOutput as ITrainingOutput} from './generated/in-progress-events'


type SchemaCompatible<T> = 
  T extends Array<infer V>
    ? readonly SchemaCompatible<V>[]
    : T extends Record<any, any>
    ? { [K in keyof T]: SchemaCompatible<T[K]> }
    : T

type SchemaOf<T> = S.Schema<SchemaCompatible<T>>

const TrainingOutput: SchemaOf<ITrainingOutput> = S.struct({
  output_path: S.string,
  completed_training_units: S.number,
  is_completed: S.boolean,
})

const HistogramStats: SchemaOf<IHistogramStats> = S.struct({
  type: S.literal("histogram"),
  name: S.string,
  x_axis: S.string,
  y_axis: S.string,
  categories: S.array(S.string),
  data: S.array(S.number),
})

const AggregationStats: SchemaOf<IAggregationStats> = S.struct({
  type: S.literal("aggregation"),
  name: S.string,
  data: S.number,
})

const EvaluationStats = S.union(HistogramStats, AggregationStats)


const EvaluationOutputOptionalStats =
  S.struct({
    evaluation_id: S.string,
    replay_path: S.string,
    // not present in all records in the DB at the moment
    stats: S.optional(S.array(EvaluationStats)),
  })

const EvaluationOutput: SchemaOf<IEvaluationOutput> = pipe(
  EvaluationOutputOptionalStats,
  S.transform(
    S.struct({
      evaluation_id: S.string,
      replay_path: S.string,
      stats: S.array(EvaluationStats),
    }),
    a => ({
      ...a,
      stats: a.stats ?? [],
    }),
    b => b,
  )
)


const IMStarted: SchemaOf<IIMStarted> = S.struct({
  event_type: S.literal('IMStarted'),
  training_id: S.string,
})

const IMTrainingUnitCompleted: SchemaOf<IIMTrainingUnitCompleted> = S.struct({
  event_type: S.literal('IMTrainingUnitCompleted'),
  training_id: S.string,
  completed_training_units: S.number,
  is_completed: S.boolean,
})

const IMTrainingCompleted: SchemaOf<IIMTrainingCompleted> = S.struct({
  event_type: S.literal('IMTrainingCompleted'),
  training_id: S.string,
  training_output: TrainingOutput,
})

const IMEvaluationStarted: SchemaOf<IIMEvaluationStarted> = S.struct({
  event_type: S.literal('IMEvaluationStarted'),
  training_id: S.string,
  evaluation_id: S.string,
})

const IMEvaluationCompleted: SchemaOf<IIMEvaluationCompleted> = S.struct({
  event_type: S.literal('IMEvaluationCompleted'),
  training_id: S.string,
  evaluation_output: EvaluationOutput,
})

const IMCompleted: SchemaOf<IIMCompleted> = S.struct({
  event_type: S.literal('IMCompleted'),
  training_id: S.string,
  training_output: TrainingOutput,
  evaluation_output: S.array(EvaluationOutput),
})

export const IMProgressEventC: SchemaOf<IIMProgressEvent> = S.union(
  IMStarted,
  IMTrainingUnitCompleted,
  IMTrainingCompleted,
  IMEvaluationStarted,
  IMEvaluationCompleted,
  IMCompleted,
)

// IMProgressEvent type should be the same as event-handlers/types/generated/imProgressEvents
export type IMProgressEvent = S.Infer<typeof IMProgressEventC>

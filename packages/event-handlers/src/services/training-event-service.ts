import { uInt256FromString } from 'core/src/types'
import type { IMProgressEvent } from 'core/src/types/im-progress-event'
import type { TrainingRecord } from 'core-backend/src/entities/training-record'
import { makeTrainingEventRecordHK } from 'core-backend/src/entities/training-record'
import type { TrainingRecordRepository } from 'core-backend/src/repositories'
import { number, option, record, semigroup } from 'fp-ts'
import { absurd, pipe } from 'fp-ts/lib/function'

const trainingRecordCommonSemigroup = semigroup.struct<TrainingRecord>({
  hash: semigroup.first(),
  hk: semigroup.first(),
  version: semigroup.max(number.Ord),
  requestedBy: semigroup.first(),
  units: semigroup.first(),
  brainId: semigroup.first(),
  timestamp: semigroup.first(),
  rewardConfig: semigroup.last(),
  memoryConfig: semigroup.last(),
  genomeAttributes: semigroup.last(),
  scenario: semigroup.last(),
  recordState: semigroup.last(),
  completedUnits: option.getMonoid(semigroup.max(number.Ord)),
  trainingOutput: option.getMonoid(semigroup.last()),
  evaluationOutput: option.getMonoid(record.getUnionSemigroup(semigroup.last())),
})

export const applyTrainingEvent =
  (event: IMProgressEvent) =>
  (record: TrainingRecord): TrainingRecord => {
    switch (event.event_type) {
      case 'IMStarted':
        return {
          ...record,
        }

      case 'IMTrainingUnitCompleted':
        return {
          ...record,
          completedUnits: option.some(event.completed_training_units),
        }
      case 'IMTrainingCompleted':
        return {
          ...record,
          trainingOutput: option.some({
            outputPath: event.training_output.output_path,
          }),
        }
      case 'IMEvaluationStarted':
        return record
      case 'IMEvaluationCompleted':
        return {
          ...record,
          evaluationOutput: option.some({
            [event.evaluation_output.evaluation_id]: {
              replayPath: event.evaluation_output.replay_path,
              stats: event.evaluation_output.stats,
            },
          }),
        }
      case 'IMCompleted':
        return {
          ...record,
          recordState: 'Completed',
          trainingOutput: option.some({
            outputPath: event.training_output.output_path,
          }),
          evaluationOutput: option.some(
            event.evaluation_output.reduce(
              (acc, cur) => ({
                ...acc,
                [cur.evaluation_id]: {
                  replayPath: cur.replay_path,
                  stats: cur.stats,
                },
              }),
              {},
            ),
          ),
        }
      default:
        return absurd(event)
    }
  }

const updateVersion = (record: TrainingRecord): TrainingRecord => ({
  ...record,
  version: record.version + 1,
})

export class TrainingEventService {
  constructor(private trainingRecordRepository: TrainingRecordRepository) {}

  handleTrainingEvent = async (event: IMProgressEvent) => {
    const record = await this.trainingRecordRepository.get(
      makeTrainingEventRecordHK(uInt256FromString(event.training_id)),
    )

    if (!record) {
      throw Error(
        `Training record not found for training_id: ${event.training_id}`,
      )
    }

    const updates = pipe(record, applyTrainingEvent(event), updateVersion)

    const updatedRecord = trainingRecordCommonSemigroup.concat(record, updates)
    await this.trainingRecordRepository.store(updatedRecord)
  }
}

import type { SFNClient } from '@aws-sdk/client-sfn'
import { StartExecutionCommand } from '@aws-sdk/client-sfn'
import type { UInt256 } from 'core/src/types/uint256'
import { makeTrainingEventRecordHK } from 'core-backend/src/entities/training-record'
import type { TrainingRecordRepository } from 'core-backend/src/repositories'

import type { TrainingRequest } from '../types/generated/trainingRequest'

export class TrainingStartService {
  public constructor(
    private trainingRecordRepository: TrainingRecordRepository,
    private sfnClient: SFNClient,
    private stepFunctionArn: string,
    private imResultsDomainName: string,
  ) {}

  async startTraining(computeHash: UInt256) {
    const hk = makeTrainingEventRecordHK(computeHash)
    // TODO: Not sure why we check the training record here?
    const trainingRecord = await this.trainingRecordRepository.get(hk)
    console.log('trainingRecord', trainingRecord)
    if (!trainingRecord) {
      throw Error(`Invalid training record, ${trainingRecord}`)
    }

    const populateMemoryUrl = (): typeof trainingRecord.memoryConfig => {
      if (trainingRecord.memoryConfig.type === 'RootNode') {
        return trainingRecord.memoryConfig
      }
      return {
        ...trainingRecord.memoryConfig,
        memory: {
          ...trainingRecord.memoryConfig.memory,
          memory_url: `https://${this.imResultsDomainName}/${trainingRecord.memoryConfig.memory.memory_url}`,
        },
      }
    }
    const memoryConfig = populateMemoryUrl()

    const input: TrainingRequest = {
      training_id: trainingRecord.hash,
      training_units: trainingRecord.units,
      player_config: {
        memory_config: memoryConfig,
        genome_attributes: trainingRecord.genomeAttributes,
      },
      scenario: trainingRecord.scenario,
      reward_config: trainingRecord.rewardConfig,
    }

    await this.sfnClient.send(
      new StartExecutionCommand({
        input: JSON.stringify(input),
        stateMachineArn: this.stepFunctionArn,
      }),
    )
    await this.trainingRecordRepository.store({
      ...trainingRecord,
      version: trainingRecord.version + 1,
      recordState: 'InProgress',
    })
  }
}

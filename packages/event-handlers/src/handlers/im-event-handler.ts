import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import * as S from '@fp-ts/schema'
import type { SQSEvent, SQSHandler } from 'aws-lambda'
import { IMProgressEventC } from 'core/src/types/im-progress-event'
import { getEnvOrThrow } from 'core-backend/src/env'
import * as repositories from 'core-backend/src/repositories'
import { sentryWrapper } from 'core-backend/src/sentry'
import * as decoder from 'io-ts/Decoder'
import { TrainingEventService } from 'src/services/training-event-service'

const env = getEnvOrThrow({
  TRAINING_RECORD_TABLE_NAME: decoder.string,
  LOCALSTACK_ENDPOINT: decoder.nullable(decoder.string),
})

const dynamodb = new DynamoDBClient({
  ...(env.LOCALSTACK_ENDPOINT && { endpoint: env.LOCALSTACK_ENDPOINT }),
})
const docClient = DynamoDBDocument.from(dynamodb)
const trainingRecordRepository = new repositories.TrainingRecordRepository(
  docClient,
  env.TRAINING_RECORD_TABLE_NAME,
)

const trainingEventService = new TrainingEventService(trainingRecordRepository)

export const handler: SQSHandler = sentryWrapper(async (event: SQSEvent) => {
  const events = event.Records.map(r =>
    S.decodeOrThrow(IMProgressEventC)(JSON.parse(r.body), {
      isUnexpectedAllowed: true,
    }),
  )

  // TODO: Traverse events with different training_ids in parallel as they will not conflict.
  for (const event of events) {
    await trainingEventService.handleTrainingEvent(event)
  }
})

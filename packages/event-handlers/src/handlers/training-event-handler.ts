import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { SFNClient } from '@aws-sdk/client-sfn'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import * as S from '@fp-ts/schema'
import type { SQSEvent, SQSHandler } from 'aws-lambda'
import { EvmChainEventsC } from 'core/src/types/evm-chain-event'
import { decodeUInt256 } from 'core/src/types/uint256'
import { getEnvOrThrow } from 'core-backend/src/env'
import * as repositories from 'core-backend/src/repositories'
import { sentryWrapper } from 'core-backend/src/sentry'
import * as decoder from 'io-ts/Decoder'
import { ComputeRequestManager__factory } from 'smart-contracts/lib/protocol-core/gen'

import { TrainingStartService } from '../services/training-start-service'

const env = getEnvOrThrow({
  TRAINING_RECORD_TABLE_NAME: decoder.string,
  LOCALSTACK_ENDPOINT: decoder.nullable(decoder.string),
  STEP_FUNCTION_ARN: decoder.string,
  IM_RESULTS_DOMAIN_NAME: decoder.string,
})

const dynamodb = new DynamoDBClient({
  ...(env.LOCALSTACK_ENDPOINT && { endpoint: env.LOCALSTACK_ENDPOINT }),
})
const docClient = DynamoDBDocument.from(dynamodb)
const trainingEventRepository = new repositories.TrainingRecordRepository(
  docClient,
  env.TRAINING_RECORD_TABLE_NAME,
)

const sfnClient = new SFNClient({})
const trainingStartService = new TrainingStartService(
  trainingEventRepository,
  sfnClient,
  env.STEP_FUNCTION_ARN,
  env.IM_RESULTS_DOMAIN_NAME,
)

const computeRequestManagerInterface =
  ComputeRequestManager__factory.createInterface()

const EventBridgeEventS = S.struct({
  detail: EvmChainEventsC,
})

const handleComputeRequestedEvent = async (
  event: S.Infer<typeof EventBridgeEventS>,
) => {
  // Parse evm log for:
  // emit ComputeRequested(requester, computeManager, optionId, computeId, units, computeHash);
  const logDescription = computeRequestManagerInterface.parseLog({
    topics: [...event.detail.topics],
    data: event.detail.data,
  })

  const computeHash = decodeUInt256(logDescription.args['computeHash'])
  return trainingStartService.startTraining(computeHash)
}

export const handler: SQSHandler = sentryWrapper(async (event: SQSEvent) => {
  const events = event.Records.map(r =>
    S.decodeOrThrow(EventBridgeEventS)(JSON.parse(r.body), {
      isUnexpectedAllowed: true,
    }),
  )
  await Promise.all(events.map(handleComputeRequestedEvent))
})

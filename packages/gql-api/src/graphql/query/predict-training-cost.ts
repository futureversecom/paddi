import { UInt256Codec } from 'core/src/types/uint256'
import { isLeft } from 'fp-ts/lib/Either'
import type { QueryResolvers } from 'src/generated/gql'

export const predictTrainingCost: Required<QueryResolvers>['predictTrainingCost'] =
  async (_parent, args, context) => {
    const { astoCost } = await context.trainingService.predictTrainingCost(
      args.trainingParams,
    )
    const decodedCost = UInt256Codec.decode(astoCost.toString())
    if (isLeft(decodedCost)) {
      throw Error('Unable to decode ASTO cost')
    }
    return {
      __typename: 'TrainingCostPayload',
      astoCost: decodedCost.right,
    }
  }

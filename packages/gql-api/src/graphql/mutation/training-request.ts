import type { MutationResolvers } from '../../generated/gql'

/**
 *
 * @param parent
 * @param args
 * @param context
 * @returns
 */
export const trainingRequest: Required<MutationResolvers>['trainingRequest'] =
  async (_parent, args, context) => {
    try {
      const training = await context.trainingService.requestTraining(
        args.input,
        context.walletAddress,
      )

      return {
        __typename: 'TrainingRequestSuccess',
        training: context.trainingService.mapRecordToGraphqlOutput(training),
      }
    } catch (err) {
      return {
        __typename: 'TrainingRequestFailure',
        message: err?.toString() || 'Training Request Failure',
      }
    }
  }

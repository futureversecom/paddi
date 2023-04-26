import type { QueryResolvers } from 'gql-api/src/generated/gql'

export const myTrainings: Required<QueryResolvers>['myTrainings'] = async (
  _parent,
  _args,
  context,
) => {
  const trainings = await context.trainingService.getTrainings(
    context.walletAddress,
  )

  return trainings.map(context.trainingService.mapRecordToGraphqlOutput)
}

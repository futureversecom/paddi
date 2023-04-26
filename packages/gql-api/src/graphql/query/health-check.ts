import type { QueryResolvers } from 'src/generated/gql'

export const healthCheck: Required<QueryResolvers>['healthCheck'] = async (
  _parent,
  _args,
  context,
): Promise<string> => {
  return context.healthCheckService.check()
}

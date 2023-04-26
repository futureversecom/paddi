import type { MutationResolvers } from 'src/generated/gql'

export const testAuth: Required<MutationResolvers>['testAuth'] = async (
  _parent,
  _args,
  context,
): Promise<string> => {
  return context.walletAddress
}

import { isLeft } from 'fp-ts/Either'
import type { GasFaucetResponse, MutationResolvers } from 'src/generated/gql'

export const gasFaucet: Required<MutationResolvers>['gasFaucet'] = async (
  _parent,
  _args,
  context,
): Promise<GasFaucetResponse> => {
  const result = await context.gasFaucetService.faucet(context.walletAddress)
  if (isLeft(result)) {
    return result.left
  }
  return result.right
}

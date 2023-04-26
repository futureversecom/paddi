import { chainAddressFromString } from 'core/src/types/chain-address'
import type { QueryResolvers } from 'src/generated/gql'

export const nonce: Required<QueryResolvers>['nonce'] = async (
  _parent,
  args,
  context,
): Promise<string> => {
  return context.authenticationService.generateNonce(
    chainAddressFromString(args.userWalletAddress),
  )
}

import { ChainAddressC } from 'core/src/types/chain-address'
import { either } from 'fp-ts'
import { SiweMessage } from 'siwe'
import type { MutationResolvers } from 'src/generated/gql'

export const authenticate: Required<MutationResolvers>['authenticate'] = async (
  _parent,
  args,
  context,
) => {
  const { input } = args
  const siweMessage = new SiweMessage(input.message)

  try {
    const fields = await siweMessage.validate(input.signature)

    const decodedWalletAddress = ChainAddressC.decode(fields.address)

    if (either.isLeft(decodedWalletAddress)) {
      throw new Error('Invalid wallet address')
    }

    const isNonceValid = await context.authenticationService.verifyNonce(
      decodedWalletAddress.right,
      fields.nonce,
    )

    if (!isNonceValid) {
      throw new Error('Nonce is invalid')
    }

    const token = context.authenticationService.generateJwt(
      decodedWalletAddress.right,
    )

    return { token, __typename: 'AuthenticateSuccess' }
  } catch (err) {
    return {
      __typename: 'AuthenticateFailure',
      errors: [
        {
          __typename: 'AuthenticateError',
          message: err?.toString() || 'Validation error',
        },
      ],
    }
  }
}

import { ErrorCode as EthersErrorCode } from '@ethersproject/logger'
import type { ChainAddress } from 'core/src/types/chain-address'
import type { EthersError } from 'core/src/types/ethers'
import type { Wallet } from 'ethers'
import { utils } from 'ethers'
import type { Either } from 'fp-ts/Either'
import { left, right } from 'fp-ts/Either'
import { abis } from 'smart-contracts/abi'
import { GasFaucet__factory as GasFaucetFactory } from 'smart-contracts/typechain-types/factories/src'
import type {
  GasFaucetFailureResponse,
  GasFaucetSuccessResponse,
} from 'src/generated/gql'

type FaucetResult = Either<GasFaucetFailureResponse, GasFaucetSuccessResponse>

export class GasFaucetService {
  constructor(private wallet: Wallet) {}

  public async faucet(walletAddress: ChainAddress): Promise<FaucetResult> {
    if (!utils.isAddress(walletAddress)) {
      throw new Error('Invalid address')
    }

    try {
      const contract = GasFaucetFactory.connect(
        abis.GasFaucet.address,
        this.wallet,
      )
      const tx = await contract.faucet(walletAddress, {
        gasPrice: '15000000000000',
      })
      return right({ __typename: 'GasFaucetSuccessResponse', hash: tx.hash })
    } catch (error) {
      console.error(error)
      const err: EthersError = error as EthersError
      if (err?.code === EthersErrorCode.UNPREDICTABLE_GAS_LIMIT) {
        // Not enough XRP in faucet
        console.error('Not enough XRP in faucet')
        return left({
          __typename: 'GasFaucetFailureResponse',
          reason: {
            __typename: 'NotEnoughGasInFaucet',
          },
        })
      }
      return left({
        __typename: 'GasFaucetFailureResponse',
        reason: {
          __typename: 'UnknownError',
        },
      })
    }
  }
}

import type { Provider } from '@ethersproject/providers'
import type { BigNumber } from 'ethers'
import type { Either } from 'fp-ts/lib/Either'
import { left, right } from 'fp-ts/lib/Either'
import { abis } from 'smart-contracts/abi'
import { PongComputeManager__factory as PongComputeManagerFactory } from 'smart-contracts/typechain-types/factories/src/PongComputeManager__factory'
import type { PongComputeManager } from 'smart-contracts/typechain-types/src/PongComputeManager'

export class ComputeManagerInteractions {
  private contract: PongComputeManager

  public constructor(private provider: Provider) {
    this.contract = PongComputeManagerFactory.connect(
      abis.PongComputeManager.address,
      this.provider,
    )
  }

  getComputeCost = async (
    units: number,
    computeOption = 0,
  ): Promise<Either<Error, BigNumber>> => {
    try {
      const cost = await this.contract.getComputeOptionUnitCost(
        computeOption,
        units,
      )
      return right(cost)
    } catch (err) {
      console.error(err)
      const error = new Error(
        `Error getting compute option data: ${computeOption}`,
      )
      return left(error)
    }
  }
}

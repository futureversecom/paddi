import type { Provider } from '@ethersproject/providers'
import type { BrainMetadata } from 'core/src/types/asset-metadata'
import { BrainMetadataC } from 'core/src/types/asset-metadata'
import type { Either } from 'fp-ts/lib/Either'
import { isLeft, left, orElse, right, toError } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { abis } from 'smart-contracts/abi'
import { MockBrain__factory as MockBrainFactory } from 'smart-contracts/typechain-types/factories/src/MockBrain__factory'

export class BrainMetadataInteractions {
  public constructor(private provider: Provider) {}

  getBrainTokenUri = async (
    tokenId: number,
  ): Promise<Either<Error, string>> => {
    try {
      const contract = MockBrainFactory.connect(
        abis.MockBrain.address,
        this.provider,
      )
      return right(await contract.tokenURI(tokenId))
    } catch (err) {
      console.error(err)
      const error = new Error(`Error getting metadata for brain: ${tokenId}`)
      return left(error)
    }
  }

  getBrainMetadata = async (
    tokenId: number,
  ): Promise<Either<Error, BrainMetadata>> => {
    const tokenUri = await this.getBrainTokenUri(tokenId)
    if (isLeft(tokenUri)) return left(tokenUri.left)

    const res = await fetch(tokenUri.right)

    if (res.status !== 200) {
      // Unexpected
      const err = new Error(
        `Error getting metadata at ${tokenUri.right} with code: ${res.status}`,
      )
      console.error(err)
      throw err
    }

    const json = await res.json()

    return pipe(
      BrainMetadataC.decode(json),
      orElse(err => left(toError(err))),
    )
  }
}
